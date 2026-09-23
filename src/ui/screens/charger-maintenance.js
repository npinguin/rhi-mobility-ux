// 80-charger-maintenance-card.js
// Charger overview/maintenance custom card.

class HomeBrainMobilityChargerMaintenanceCard extends HTMLElement {
  setConfig(config) {
    this.config = { dashboard_path: "/mobility-supervisor/dashboard", ...config };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._commandFeedback = this._commandFeedback || new Map();
    this._openPanels = this._openPanels || new Set();
    this._limitDrafts = this._limitDrafts || new Map();
    this._chargerPickerAsset = this._chargerPickerAsset || "";
    this._chargerPickerDraft = this._chargerPickerDraft || new Map();
    this._lastSignature = this._lastSignature || "";
    this._lastRenderAt = this._lastRenderAt || 0;
  }

  assetId(charger) { return charger?.asset_id || ""; }
  chargerId(charger) { return String(this.assetId(charger)).replace(/^charger_/, ""); }

  chargerRuntimeReady(rt, charger) {
    // R43.2.53 readiness for the product card means the canonical operational
    // property exists. Source/fact presence is not a substitute.
    return rt.canonicalChargerPropertyValue(this.assetId(charger), "charger.operating_state").resolved;
  }


  chargerImageFromId(id) {
    const rt = this._hass ? new HomeBrainAssetRuntime(this._hass, this.config) : null;
    const assetId = String(id || "").startsWith("charger_") ? String(id) : `charger_${id}`;
    const asset = rt ? (rt.chargerById(assetId) || rt.assetById(assetId) || { asset_id: assetId }) : { asset_id: assetId };
    if (rt) {
      const prop = rt.propertyByCompoundKey(assetId, "charger.image_key");
      const raw = prop?.value ?? rt.visualImageKey(asset, "image") ?? asset?.image_key ?? "";
      const visual = typeof rhiMobilityResolveChargerVisual === "function" ? rhiMobilityResolveChargerVisual(asset, raw) : null;
      if (visual?.appearance?.package_file) return visual.appearance.package_file;
      return rt.visualImageUrl(asset, "charger", "image", "charger_fallback");
    }
    return rhiMobilityAssetUrl("chargers/charger_fallback.png");
  }


  renderChargerHero(rt, id, name, status) {
    const img = rt.cache(this.chargerImageFromId(id));
    const tone = this.statusTone(status);
    return `<div class="charger-visual ${tone}">
      <img src="${rt.escape(img)}" alt="${rt.escape(name)}" loading="lazy"
           onerror="this.onerror=null;this.classList.add('failed');this.closest('.charger-visual')?.classList.add('image-missing');" />
      <div class="charger-visual-fallback"><ha-icon icon="${id === 'utility_plug' ? 'mdi:power-socket-eu' : 'mdi:ev-station'}"></ha-icon></div>
    </div>`;
  }

  chargerVisualSelection(rt, charger, draft = {}) {
    return new HomeBrainChargerVisualPicker(rt).selection(charger, draft);
  }

  renderChargerPicker(rt, charger) {
    const assetId = this.assetId(charger);
    const draft = this._chargerPickerDraft.get(assetId) || {};
    return new HomeBrainChargerVisualPicker(rt).render(charger, { draft, showClose:true, context:"management" });
  }

  statusTone(status) {
    const s = String(status || "").toLowerCase();
    if (["charging", "running", "active", "connected", "available", "ready", "healthy", "trusted"].some((w) => s.includes(w))) return "ok";
    if (["fault", "error", "failed", "blocked", "unavailable", "offline"].some((w) => s.includes(w))) return "bad";
    if (["waiting", "preparing", "suspended", "paused", "unknown", "contract gap", "starting", "initializing"].some((w) => s.includes(w))) return "warn";
    if (["idle", "stopped", "disconnected"].some((w) => s.includes(w))) return "muted";
    return "muted";
  }

  commandIcon(command) {
    const id = String(command.command_id || "").toLowerCase();
    if (id.includes("restart") || id.includes("reset")) return "mdi:restart";
    if (id.includes("identify") || id.includes("locate")) return "mdi:crosshairs-gps";
    if (id.includes("unlock")) return "mdi:lock-open-outline";
    if (id.includes("lock")) return "mdi:lock-outline";
    if (id.includes("enable") || id.includes("resume") || id.includes("start")) return "mdi:play";
    if (id.includes("disable") || id.includes("pause") || id.includes("stop")) return "mdi:stop";
    if (id.includes("current") || id.includes("limit")) return "mdi:current-ac";
    if (id.includes("diagnostic")) return "mdi:stethoscope";
    return "mdi:gesture-tap-button";
  }

  commandState(rt, command) {
    // R22.11.24: charger overview must use the same command-state resolver as
    // charger detail. Do not locally disable bound R41.9 commands because power is
    // 0, session is Completed/SuspendedEV, or legacy intent_entity is absent.
    return rt.commandState ? rt.commandState(command) : { disabled: !command, busy: false, failed: false, status: "", reason: "" };
  }


  groupedCommands(rt, assetId) {
    const groups = { primary: [], secondary: [], diagnostic: [], maintenance: [], advanced: [], destructive: [] };
    for (const command of rt.commandRegistry(assetId)) {
      if (command.frontend_allowed === false) continue;
      const category = groups[command.category] ? command.category : "secondary";
      groups[category].push(command);
    }
    return groups;
  }

  field(rt, label, value, icon = "mdi:information-outline") {
    return `<div class="field"><ha-icon icon="${icon}"></ha-icon><span>${rt.escape(label)}</span><b>${rt.escape(value || "—")}</b></div>`;
  }

  detailField(rt, label, value) {
    return `<div class="detail-field"><span>${rt.escape(label)}</span><b>${rt.escape(value || "—")}</b></div>`;
  }

  renderCommand(rt, command, compact = false) {
    const state = this.commandState(rt, command);
    const tone = state.failed ? "failed" : state.busy ? "busy" : "";
    const reason = state.reason || "";
    const enums = command?.enum_options || {};
    const enumName = (command?.required_parameters || []).find((name) => Array.isArray(enums[name]) && enums[name].length) || "";
    if (command?.interaction_mode === "form" && enumName) {
      return `<label class="cmd enum-command ${tone} ${compact ? "compact" : ""} ${state.disabled ? "is-disabled" : ""}" title="${rt.escape(reason || command.label)}">
        <ha-icon icon="${this.commandIcon(command)}"></ha-icon>
        <select aria-label="${rt.escape(command.label)}" data-command-asset="${rt.escape(command.asset_id || "")}" data-command-id="${rt.escape(command.command_id || "")}" data-command-key="${rt.escape(command.command_key || command.command_id || "")}" data-command-param="${rt.escape(enumName)}" ${state.disabled ? "disabled" : ""}>
          <option value="">${rt.escape(command.label)}…</option>
          ${enums[enumName].map((option)=>`<option value="${rt.escape(option.value)}">${rt.escape(option.label || option.value)}</option>`).join("")}
        </select>
      </label>`;
    }
    return `<button class="cmd ${tone} ${compact ? "compact" : ""}" data-command-asset="${rt.escape(command.asset_id || "")}" data-command-id="${rt.escape(command.command_id || "")}" data-command-key="${rt.escape(command.command_key || command.command_id || "")}" ${state.disabled ? "disabled" : ""} title="${rt.escape(reason || command.label)}">
      <ha-icon icon="${this.commandIcon(command)}"></ha-icon>
      <span>${rt.escape(command.label)}</span>
      ${state.busy ? `<small>Busy</small>` : state.failed ? `<small>${rt.escape(state.status)}</small>` : ""}
    </button>`;
  }


  formatKw(rt, value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "0.0";
    const n = Number(raw.replace(",", "."));
    if (!Number.isFinite(n)) return raw;
    const kw = Math.abs(n) > 100 ? n / 1000 : n;
    return kw.toFixed(kw >= 10 ? 1 : 1);
  }

  chargerProperty(rt, assetId, propertyKey, fallback = "—") {
    return rt.canonicalChargerPropertyDisplay(assetId, propertyKey, fallback);
  }

  chargerBinary(rt, assetId, id, fact, fallback = "") {
    const key = String(fact || "").startsWith("charger.") ? String(fact) : `charger.${fact}`;
    return rt.canonicalChargerPropertyDisplay(assetId, key, fallback);
  }



  displayVehicleName(rt, value) {
    const raw = String(value || "").trim();
    if (!raw || ["none", "unknown", "unavailable"].includes(raw.toLowerCase())) return "None";
    const canonical = raw.startsWith("vehicle_") ? raw : `vehicle_${raw.replace(/^vehicle_/, "")}`;
    const reg = rt.registryEntry(canonical);
    return reg?.display_name || rt.vehicleLabel(raw);
  }

  chargerCommands(rt, assetId) {
    // V1: no legacy charger command whitelist. The public command_index is authoritative.
    return rt.commandsFor(assetId).filter((cmd) => cmd.frontend_allowed !== false && cmd.exists !== false);
  }

  choosePrimaryChargerCommand(rt, assetId, chargerState) {
    // Return all published charging-family commands; command state is owned by the backend row.
    return this.chargerCommands(rt, assetId).filter((cmd) => rt.commandFamily(cmd) === "charging");
  }

  canonicalLimitCommand(rt, assetId) {
    return null;
  }

  lifecycleDisplay(rt, charger) {
    const status = rt.lifecycleStatus(charger);
    if (status === "active") return "Active";
    if (status === "disabled") return "Disabled";
    if (status === "retired") return "Retired";
    return "Contract gap";
  }

  lifecycleToggleButton(rt, charger, extraClass = "mini-detail-link lifecycle-toggle icon-only") {
    const status = rt.lifecycleStatus(charger);
    const desired = status === "disabled" ? "active" : "disabled";
    const model = rt.lifecycleWriteModel(charger, desired);
    const label = desired === "active" ? "Activate" : "Disable";
    const title = model.disabled ? (model.reason || "Lifecycle contract gap") : `${label} via lifecycle_status`;
    return `<button class="${extraClass}" data-lifecycle-asset="${rt.escape(this.assetId(charger))}" data-lifecycle-value="${rt.escape(desired)}" ${model.disabled ? "disabled" : ""} title="${rt.escape(title)}"><ha-icon icon="mdi:power"></ha-icon><span>${rt.escape(label)}</span></button>`;
  }

  renderCollapsedCharger(rt, charger) {
    const name = charger.display_name || rt.titleize(charger.asset_id);
    const subtitle = charger.location || charger.profile || "Charger";
    const route = rt.assetDetailRoute(charger);
    return `<article class="inactive-row lifecycle-collapsed-row charger-collapsed-row">
      <span class="inactive-state">${rt.escape(this.lifecycleDisplay(rt, charger))}</span>
      <div class="inactive-copy"><h3>${rt.escape(name)}</h3><p>${rt.escape(subtitle)}</p></div>
      <div class="inactive-actions">${this.lifecycleToggleButton(rt, charger, "cmd compact icon-only lifecycle-toggle")}<button class="cmd compact icon-only" data-nav="${rt.escape(route)}" title="Open charger details"><ha-icon icon="mdi:plus"></ha-icon><span>Details</span></button></div>
    </article>`;
  }

  renderCharger(rt, charger) {
    const id = this.chargerId(charger);
    const assetId = this.assetId(charger);
    const name = charger.display_name || rt.titleize(assetId);
    const runtimeReady = this.chargerRuntimeReady(rt, charger);
    // Each concern resolves independently from its exact R43.2.53 owner. A gap in
    // operating_state must not erase a valid connection/power/relationship value.
    const chargerSnapshot = rt.chargerProductSnapshot(assetId);
    const status = chargerSnapshot.operating.display;
    const connectionState = chargerSnapshot.connection.display;
    const connectedVehicle = chargerSnapshot.connected_vehicle.display;
    const power = chargerSnapshot.power.display;
    const actualCurrent = this.chargerProperty(rt, assetId, "charger.actual_current_a", "—");
    const currentLimit = this.chargerProperty(rt, assetId, "charger.current_limit_a", "—");
    const offeredCurrent = this.chargerProperty(rt, assetId, "charger.offered_current_a", "—");
    const activePhases = "—";
    const session = this.chargerProperty(rt, assetId, "charger.session_energy_kwh", "—");
    const connected = connectionState;
    const enabled = "—";
    const healthSummary = { value:chargerSnapshot.health.display, reason:chargerSnapshot.health.reason, resolved:chargerSnapshot.health.resolved };
    const freshness = "—";
    const trust = healthSummary.value;
    const connector = connectionState;
    const primary = rt.commandActionsFor(assetId, "quick_actions");
    // R43.2.54: all normal product commands render exactly once from
    // charger_actions.commands. Maintenance/diagnostic sections contain context only.
    const maintenance = [];
    const destructive = [];
    const issue = status.toLowerCase().includes("fault") || status.toLowerCase().includes("unavailable") || status.toLowerCase().includes("contract gap") || (healthSummary.resolved && !["ok", "healthy"].includes(String(healthSummary.value || "").toLowerCase()));
    const maintenanceOpen = this._openPanels.has(`${assetId}:maintenance`);
    const configOpen = this._openPanels.has(`${assetId}:config`);
    const mode = "Automatic";
    const dataQuality = trust;
    const lastUpdate = charger.last_seen || "Unknown";
    const roles = Array.isArray(charger.roles) ? charger.roles.join(", ") : (charger.roles || "—");
    const configFields = [
      this.detailField(rt, "Profile", charger.profile || "—"),
      this.detailField(rt, "Location", charger.location || "—"),
      this.detailField(rt, "Lifecycle", this.lifecycleDisplay(rt, charger)),
      this.detailField(rt, "Frontend allowed", String(charger.frontend_allowed !== false)),
      this.detailField(rt, "Mode", mode),
      this.detailField(rt, "Vehicle relationship", connectedVehicle),
      this.detailField(rt, "Connector state", connector),
      this.detailField(rt, "Current limit", currentLimit),
      this.detailField(rt, "Actual current", actualCurrent),
      this.detailField(rt, "Offered current", offeredCurrent),
      this.detailField(rt, "Active phases", activePhases),
      this.detailField(rt, "Power", power),
      this.detailField(rt, "Session energy", session),
      this.detailField(rt, "Execution owner", charger.execution_owner || "—"),
      this.detailField(rt, "Roles", roles),
      this.detailField(rt, "Health", healthSummary.value),
      this.detailField(rt, "Health reason", healthSummary.reason || "—"),
      this.detailField(rt, "Last update", lastUpdate),
      this.detailField(rt, "Command source", "mobility_command_index"),
      this.detailField(rt, "Published commands", String(rt.commandRegistry(assetId).length)),
      this.detailField(rt, "Asset id", assetId),
      this.detailField(rt, "Sort order", String(charger.sort_order ?? "—"))
    ].join("");

    const pickerOpen = this._chargerPickerAsset === assetId;
    return `<article class="charger-card ${issue ? "attention" : ""}">
      <div class="charger-hero-card premium-image-hero">
        ${this.renderChargerHero(rt, id, name, status)}
        <div class="charger-head">
          <div class="charger-icon"><ha-icon icon="mdi:ev-station"></ha-icon></div>
          <div class="charger-title"><h3>${rt.escape(name)}</h3><p>${rt.escape(charger.location || charger.profile || assetId)}</p></div>
          <span class="status ${this.statusTone(status)}">${rt.escape(status)}</span>
          <button class="charger-appearance-action" data-charger-picker="${rt.escape(assetId)}" title="Choose charger and colour"><ha-icon icon="mdi:palette-outline"></ha-icon><span>Charger & colour</span></button>
        </div>
      </div>
      ${pickerOpen ? this.renderChargerPicker(rt, charger) : ""}
      <div class="charger-kpis">
        ${this.field(rt, "Power", power, "mdi:flash")}
        ${this.field(rt, "Actual", actualCurrent, "mdi:current-ac")}
        ${this.field(rt, "Limit", currentLimit, "mdi:gauge")}
        ${this.field(rt, "Session", session, "mdi:counter")}
      </div>
      <div class="soft-line">
        <span><ha-icon icon="mdi:ev-plug-type2"></ha-icon>${rt.escape(connector)}</span>
        <span><ha-icon icon="mdi:car-electric"></ha-icon>${rt.escape(connectedVehicle)}</span>
        <span title="Canonical charger health"><ha-icon icon="mdi:shield-check-outline" style="color:#1467F5;--mdc-icon-size:23px"></ha-icon>${rt.escape(healthSummary.value)}</span>
        <button class="mini-detail-link details-action icon-only" data-nav="${rt.escape(rt.assetDetailRoute(charger))}" title="Open charger details"><ha-icon icon="mdi:plus"></ha-icon></button>
        ${this.lifecycleToggleButton(rt, charger)}
      </div>
      <div class="command-row">${primary.length ? primary.map((c) => this.renderCommand(rt, c)).join("") : `<div class="empty-actions">No product command placement published for this charger.</div>`}</div>
      <section class="fold-section ${maintenanceOpen ? "open" : ""}" data-panel-key="${rt.escape(`${assetId}:maintenance`)}">
        <button class="fold-toggle" data-toggle-panel="${rt.escape(`${assetId}:maintenance`)}" type="button"><ha-icon icon="mdi:chevron-${maintenanceOpen ? "down" : "right"}"></ha-icon><span>Maintenance & diagnostics</span></button>
        <div class="fold-panel">
          <div class="detail-grid">
            ${this.detailField(rt, "Health", healthSummary.value)}
            ${this.detailField(rt, "Health reason", healthSummary.reason || "—")}
            ${this.detailField(rt, "Command placement", "charger_actions.commands")}
            ${this.detailField(rt, "Command readiness", "Command Index")}
          </div>
        </div>
      </section>
      <section class="fold-section config-details ${configOpen ? "open" : ""}" data-panel-key="${rt.escape(`${assetId}:config`)}">
        <button class="fold-toggle" data-toggle-panel="${rt.escape(`${assetId}:config`)}" type="button"><ha-icon icon="mdi:chevron-${configOpen ? "down" : "right"}"></ha-icon><span>Profile & detailed configuration</span></button>
        <div class="fold-panel"><div class="detail-grid">${configFields}</div></div>
      </section>
    </article>`;
  }

  set hass(hass) {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    const factory = new HomeBrainAssetFactory(rt);
    const chargers = factory.chargers().filter((a) => rt.lifecycleStatus(a) !== "retired").sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.display_name).localeCompare(String(b.display_name)));
    const activeChargers = chargers.filter((c) => rt.lifecycleStatus(c) === "active");
    const inactiveChargers = chargers.filter((c) => rt.lifecycleStatus(c) !== "active" && rt.lifecycleStatus(c) !== "retired");
    const operational = activeChargers.filter((c) => this.chargerRuntimeReady(rt, c)).length;
    const totalPower = activeChargers.reduce((sum, c) => {
      const exact = rt.canonicalChargerPropertyValue(c.asset_id, "charger.power_kw");
      const n = exact.resolved ? Number(String(exact.value).replace(",", ".")) : NaN;
      const kw = Number.isFinite(n) ? (Math.abs(n) > 100 ? n / 1000 : n) : 0;
      return sum + kw;
    }, 0);
    const signature = JSON.stringify({
      assets: chargers.map((c) => {
        const assetId = c.asset_id;
        const id = String(assetId || "").replace(/^charger_/, "");
        const commands = rt.commandRegistry(assetId).map((cmd) => [cmd.command_id, cmd.frontend_allowed, cmd.execution_allowed, cmd.execution_status || "", cmd.blocked_reason || cmd.execution_reason || ""]);
        return [assetId, c.display_name, c.profile, c.location, rt.lifecycleStatus(c),
          rt.chargerOperationalStatus(assetId),
          rt.chargerConnectionState(assetId),
          rt.chargerConnectedVehicleLabel(assetId),
          this.chargerProperty(rt, assetId, "charger.power_kw", ""),
          this.chargerProperty(rt, assetId, "charger.actual_current_a", this.chargerProperty(rt, assetId, "charger.current_a", "")),
          this.chargerProperty(rt, assetId, "charger.current_limit_a", ""),
          this.chargerProperty(rt, assetId, "charger.session_energy_kwh", ""),
          rt.chargerHealthSummary(assetId).value,
          rt.chargerHealthSummary(assetId).reason,
          commands];
      }),
      open: Array.from(this._openPanels || []).sort(),
      drafts: Array.from(this._limitDrafts || []),
      feedback: Array.from(this._commandFeedback || []).filter(([, until]) => Date.now() < until)
    });
    const activeEl = this.shadowRoot?.activeElement;
    if (this._lastSignature === signature && this._lastRenderOk && !(activeEl && ["SELECT", "INPUT"].includes(activeEl.tagName))) return;
    this._lastSignature = signature;
    this._lastRenderOk = true;

    this.shadowRoot.innerHTML = `<ha-card>
      <div class="page">
        <div class="hi-version-block" style="position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0;margin:0;z-index:3;pointer-events:none;"><div>UX ${rt.escape(UX_VERSION)}</div><div>Backend ${rt.escape(rt.backendVersion())}</div></div>
        ${hbMobilityNav(this.config?.nav_active || "chargers")}
        ${hbMobilityPageHero(rt, "chargers")}
        ${hbMobilityStatusGrid(rt, [
          { icon:"mdi:ev-station", label:"Active", value:String(activeChargers.length), sub:`${inactiveChargers.length} inactive`, tone:"neutral" },
          { icon:"mdi:check-circle-outline", label:"Operational", value:`${operational} of ${activeChargers.length}`, sub:"Runtime ready", tone:operational === activeChargers.length ? "ok" : "warn" },
          { icon:"mdi:lightning-bolt", label:"Power now", value:`${totalPower.toFixed(1)} kW`, sub:"Active charger total", tone:totalPower > 0 ? "ok" : "neutral" },
          { icon:"mdi:alert-circle-outline", label:"Attention", value:activeChargers.length === operational ? "None" : "Review", sub:activeChargers.length === operational ? "No contract gap" : "Operational gap", tone:activeChargers.length === operational ? "ok" : "warn" }
        ], "chargers-top-status")}
        ${hbMobilityQuickActions(rt, [
          { icon:"mdi:cog-outline", label:"Manage chargers & profiles", path:"/config/integrations/integration/rhi_mobility", primary:true },
          { icon:"mdi:car-electric", label:"Vehicles", path:hbMobilityPath("/dashboard") },
          { icon:"mdi:calendar-clock", label:"Charging plan", path:hbMobilityPath("/planning") },
          { icon:"mdi:target", label:"Strategies", path:hbMobilityPath("/strategies") }
        ])}
        <section class="section-title"><h2>Active chargers</h2><span>${activeChargers.length} active · ${operational} operational · ${totalPower.toFixed(1)} kW now</span></section>
        <section class="grid">
          ${activeChargers.length ? activeChargers.map((c) => this.renderCharger(rt, c)).join("") : `<div class="empty-state"><ha-icon icon="mdi:ev-station-off"></ha-icon><h2>No active chargers</h2><p>Activate a charger below when needed.</p></div>`}
        </section>
        ${inactiveChargers.length ? `<section class="section-title compact-title"><h2>Inactive chargers</h2><span>${inactiveChargers.length} inactive</span></section><section class="inactive-list">${inactiveChargers.map((c)=>this.renderCollapsedCharger(rt,c)).join("")}</section>` : `<section class="debt-strip"><ha-icon icon="mdi:information-outline"></ha-icon><b>Inactive chargers (0)</b><span>Disabled chargers are hidden.</span></section>`}
        
      </div>
      <style>${this.styles()}
/* R22.12.11.24 unified quick-action sizing */
.action.enum-action,.cmd.enum-command{height:43px!important;min-height:43px!important;max-height:43px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:0 11px!important;box-sizing:border-box!important;overflow:hidden!important}
.action.enum-action ha-icon,.cmd.enum-command ha-icon{flex:0 0 auto!important;grid-row:auto!important}
.action.enum-action select,.cmd.enum-command select{appearance:auto!important;-webkit-appearance:auto!important;min-width:0!important;max-width:170px!important;width:auto!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-size:12px!important;font-weight:600!important;padding:0 2px!important;line-height:1!important;box-shadow:none!important;cursor:pointer!important;grid-column:auto!important}
.action.enum-action select:focus,.cmd.enum-command select:focus{outline:2px solid rgba(20,103,245,.20)!important;outline-offset:3px!important;border-radius:6px!important}
.command-row>.cmd,.command-row>.enum-command{min-width:0!important;width:100%!important}
</style>
      ${hbMobilityReleaseFooter(rt)}
    </ha-card>`;

    this.shadowRoot.querySelectorAll("button[data-command-id]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (btn.disabled) return;
        const assetId = btn.getAttribute("data-command-asset");
        const commandId = btn.getAttribute("data-command-id");
        const command = rt.commandsFor(assetId).find((c)=>String(c.command_id || "") === String(commandId));
        if (!command) return;
        rt.callCommand(command);
      });
    });
    this.shadowRoot.querySelectorAll("select[data-command-id]").forEach((select) => {
      select.addEventListener("change", (ev) => {
        ev.stopPropagation();
        if (select.disabled || !select.value) return;
        const assetId = select.getAttribute("data-command-asset") || "";
        const commandId = select.getAttribute("data-command-id") || "";
        const commandKey = select.getAttribute("data-command-key") || commandId;
        const parameter = select.getAttribute("data-command-param") || "";
        const command = rt.commandsFor(assetId).find((candidate)=>String(candidate.command_key || candidate.command_id || "") === String(commandKey) || String(candidate.command_id || "") === String(commandId));
        if (!command || !parameter) return;
        rt.callCommand(command, { [parameter]: select.value });
        select.value = "";
      });
    });
    this.shadowRoot.querySelectorAll("button[data-toggle-panel]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const key = btn.getAttribute("data-toggle-panel");
        if (!key) return;
        const section = btn.closest(".fold-section");
        const icon = btn.querySelector("ha-icon");
        if (this._openPanels.has(key)) {
          this._openPanels.delete(key);
          section?.classList.remove("open");
          if (icon) icon.setAttribute("icon", "mdi:chevron-right");
        } else {
          this._openPanels.add(key);
          section?.classList.add("open");
          if (icon) icon.setAttribute("icon", "mdi:chevron-down");
        }
      });
    });
    this.shadowRoot.querySelectorAll("button[data-lifecycle-asset]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (btn.disabled) return;
        const assetId = btn.getAttribute("data-lifecycle-asset") || "";
        const value = btn.getAttribute("data-lifecycle-value") || "";
        if (!assetId || !value) return;
        const ok = rt.writeLifecycleStatus(assetId, value);
        if (!ok) return;
        btn.classList.add("sent");
        this._lastSignature = "";
        setTimeout(()=>{ if (this.isConnected) this.hass = this._hass; }, 650);
      });
    });
    this.shadowRoot.querySelectorAll("button[data-charger-picker]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        const assetId = btn.getAttribute("data-charger-picker") || "";
        this._chargerPickerAsset = this._chargerPickerAsset === assetId ? "" : assetId;
        if (!this._chargerPickerDraft.has(assetId)) this._chargerPickerDraft.set(assetId, {});
        this._lastSignature = "";
        if (this.isConnected) this.hass = this._hass;
      });
    });
    this.shadowRoot.querySelectorAll("button[data-charger-picker-close]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        this._chargerPickerAsset = "";
        this._lastSignature = "";
        if (this.isConnected) this.hass = this._hass;
      });
    });
    this.shadowRoot.querySelectorAll("[data-charger-picker-panel] select").forEach((select) => {
      select.addEventListener("change", (ev) => {
        ev.stopPropagation();
        const panel = select.closest("[data-charger-picker-panel]");
        const assetId = panel?.getAttribute("data-charger-picker-panel") || "";
        const draft = { ...(this._chargerPickerDraft.get(assetId) || {}) };
        if (select.hasAttribute("data-charger-picker-brand")) {
          draft.brand = select.value; draft.model = ""; draft.variant_id = ""; draft.appearance_id = "";
        } else if (select.hasAttribute("data-charger-picker-model")) {
          draft.model = select.value; draft.variant_id = ""; draft.appearance_id = "";
        } else if (select.hasAttribute("data-charger-picker-variant")) {
          draft.variant_id = select.value; draft.appearance_id = "";
        } else if (select.hasAttribute("data-charger-picker-appearance")) {
          draft.appearance_id = select.value;
        }
        this._chargerPickerDraft.set(assetId, draft);
        this._lastSignature = "";
        if (this.isConnected) this.hass = this._hass;
      });
    });
    this.shadowRoot.querySelectorAll("button[data-charger-picker-save]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        if (btn.disabled) return;
        const assetId = btn.getAttribute("data-charger-picker-save") || "";
        const key = btn.getAttribute("data-charger-key") || "";
        if (assetId && key) rt.writePublishedProperty(assetId, "charger.image_key", key);
      });
    });

    this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const path = btn.getAttribute("data-nav");
        if (path) rt.navigate(path);
      });
    });
  }

  styles() {
    return `
      :host{display:block;--hb-blue:#1467F5;--hb-soft-blue:#EEF5FF;--hb-ink:#06142D;--hb-muted:#66728B;--hb-line:#E6EDF7;--hb-shadow:0 18px 44px rgba(15,35,80,.075);font-family:inherit;user-select:text;-webkit-user-select:text;color:var(--hb-ink)}
      ha-card{background:transparent;border:0;box-shadow:none}.page{position:relative;width:min(100%,1560px);margin:0 auto;padding:18px 26px 30px;box-sizing:border-box;display:grid;gap:12px}.release-badge{position:absolute;top:6px;right:26px;z-index:3;border:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#33415C;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:650;line-height:1;box-shadow:0 8px 20px rgba(15,35,80,.055)}.hero{border:1px solid rgba(14,35,72,.10);border-radius:24px;background:linear-gradient(135deg,#FFFFFF 0%,#F8FBFF 48%,#EEF5FF 100%);box-shadow:var(--hb-shadow);padding:28px 34px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center}.hero-side{display:grid;grid-template-columns:auto auto;gap:12px;align-items:center}.hero-side.no-registered-chargers{grid-template-columns:auto;justify-self:end}.charger-hero-visual{width:230px;height:112px;border-radius:24px;background:linear-gradient(135deg,rgba(238,245,255,.95),rgba(255,255,255,.7));border:1px solid rgba(20,103,245,.10);display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:inset 0 1px 0 rgba(255,255,255,.7)}.charger-device{position:relative;width:58px;height:82px;border-radius:18px;background:#FFFFFF;border:1px solid var(--hb-line);box-shadow:0 14px 30px rgba(15,35,80,.12);display:flex;align-items:center;justify-content:center}.charger-device ha-icon{--mdc-icon-size:34px;color:var(--hb-blue)}.charger-device span{position:absolute;top:9px;width:22px;height:4px;border-radius:99px;background:#2DD56F}.flow-line{width:64px;height:6px;border-radius:999px;background:linear-gradient(90deg,#CFE0FF,#1467F5);box-shadow:0 0 18px rgba(20,103,245,.25)}.charger-car{width:58px;height:58px;border-radius:20px;background:#fff;border:1px solid var(--hb-line);box-shadow:0 14px 30px rgba(15,35,80,.10);display:flex;align-items:center;justify-content:center}.charger-car ha-icon{--mdc-icon-size:34px;color:var(--hb-ink)}.eyebrow{font-size:12px;font-weight:650;letter-spacing:.08em;text-transform:uppercase;color:var(--hb-blue);margin-bottom:8px}h1{font-size:46px;line-height:1;letter-spacing:-.055em;margin:0 0 10px;font-weight:650}p{margin:0;color:#34405A;font-size:16px;line-height:1.45;font-weight:600;max-width:780px}.hero-metrics{display:grid;grid-template-columns:repeat(3,112px);gap:10px}.hero-metrics div{background:rgba(255,255,255,.92);border:1px solid var(--hb-line);border-radius:18px;padding:14px;text-align:center;box-shadow:0 10px 28px rgba(15,35,80,.055)}.hero-metrics b{display:block;font-size:28px;font-weight:650}.hero-metrics span{font-size:12px;color:var(--hb-muted);font-weight:600}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:16px;align-items:start}.inactive-list{display:grid;gap:10px}.inactive-row{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:0 12px 36px rgba(15,35,80,.055);padding:10px 12px;display:grid;grid-template-columns:82px 1fr auto;gap:14px;align-items:center}.inactive-state{background:#EEF2F7;color:#53627A;border-radius:999px;font-weight:650;font-size:12px;padding:7px 10px;text-align:center}.inactive-copy h3{margin:0 0 2px;font-size:16px;font-weight:650}.inactive-copy p{margin:0;color:#64708A;font-weight:600}.inactive-actions{display:flex;gap:8px}.cmd.icon-only{width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important}.cmd.icon-only span{display:none!important}.debt-strip{display:flex;align-items:center;gap:12px;background:#F8FBFF;border:1px solid #DDEAFF;border-radius:18px;padding:12px 18px;color:#45536C;font-size:13px;font-weight:600}.debt-strip ha-icon{color:#1467F5}.charger-card{background:#fff;border:1px solid var(--hb-line);border-radius:22px;box-shadow:var(--hb-shadow);padding:18px;display:grid;gap:15px;min-width:0;align-self:start;align-content:start}.charger-card.attention{border-color:rgba(242,140,0,.35);background:linear-gradient(180deg,#fff,#fffaf3)}.charger-hero-card{min-height:150px;border-radius:20px;border:1px solid rgba(20,103,245,.10);background:linear-gradient(135deg,#FFFFFF 0%,#F7FAFF 52%,#EEF5FF 100%);padding:14px;display:grid;grid-template-columns:minmax(0,1fr) 124px;gap:10px;align-items:center;overflow:hidden}.charger-head{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:13px;align-items:center}.charger-head.compact{grid-template-columns:44px minmax(0,1fr);align-content:start}.charger-head.compact .status{grid-column:1/-1;justify-self:start;margin-top:10px}.charger-icon{width:48px;height:48px;border-radius:16px;background:var(--hb-soft-blue);display:flex;align-items:center;justify-content:center}.charger-icon ha-icon{--mdc-icon-size:26px;color:var(--hb-blue)}h3{margin:0;font-size:18px;font-weight:650;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.charger-title p{font-size:12px;color:var(--hb-muted);font-weight:600;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.charger-visual{position:relative;height:128px;border-radius:18px;background:rgba(255,255,255,.72);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}.charger-visual:before{content:"";position:absolute;inset:auto 14px 14px;height:12px;border-radius:50%;background:rgba(15,35,80,.08);filter:blur(8px)}.charger-visual img{position:relative;z-index:2;max-width:118px;max-height:118px;object-fit:contain;filter:drop-shadow(0 18px 22px rgba(15,35,80,.16))}.charger-visual img.failed{display:none}.charger-visual-fallback{display:none;position:relative;z-index:1;width:86px;height:86px;border-radius:26px;background:#fff;border:1px solid var(--hb-line);align-items:center;justify-content:center;box-shadow:0 16px 30px rgba(15,35,80,.10)}.charger-visual.image-missing .charger-visual-fallback{display:flex}.charger-visual-fallback ha-icon{--mdc-icon-size:46px;color:var(--hb-blue)}.status{border-radius:999px;padding:7px 10px;font-size:12px;font-weight:650;border:1px solid rgba(14,35,72,.08);white-space:nowrap}.status.ok{background:#E7F6EA;color:#087A35}.status.warn{background:#FFF1D9;color:#B76500}.status.bad{background:#FDE4E4;color:#C21E1E}.status.muted{background:#EEF1F6;color:#64708A}.charger-kpis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.field{border:1px solid var(--hb-line);background:#FAFCFF;border-radius:15px;padding:11px;display:grid;grid-template-columns:24px minmax(0,1fr);column-gap:8px;align-items:center}.field ha-icon{--mdc-icon-size:20px;color:var(--hb-blue);grid-row:1/3}.field span{font-size:11px;color:var(--hb-muted);font-weight:600}.field b{font-size:14px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.soft-line{display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid rgba(14,35,72,.07);padding-top:12px}.soft-line span{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--hb-line);background:#fff;border-radius:999px;padding:6px 9px;color:#34405A;font-size:12px;font-weight:600}.soft-line ha-icon{--mdc-icon-size:16px;color:var(--hb-blue)}.mini-detail-link.icon-only{width:36px;height:36px;min-width:34px;border-radius:13px;border:1px solid var(--hb-line);background:#fff;color:#1467F5;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 10px 22px rgba(15,35,80,.05);padding:0;cursor:pointer}.mini-detail-link.icon-only ha-icon{--mdc-icon-size:18px;color:#1467F5}.mini-detail-link.icon-only span{display:none!important}.command-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px}.cmd{min-height:43px;border:1px solid rgba(14,35,72,.10);border-radius:13px;background:#fff;color:var(--hb-ink);box-shadow:0 10px 22px rgba(15,35,80,.05);font-weight:650;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;padding:0 10px}.cmd ha-icon{--mdc-icon-size:19px;color:var(--hb-blue)}.cmd.sent{background:#EEF5FF;border-color:#CFE0FF;color:#0B4BC1}.cmd.busy{background:#FFF8E8;border-color:#F8DB99}.cmd.failed{background:#FEF3F2;border-color:#FECDCA;color:#B42318}.cmd:disabled{opacity:.56;cursor:not-allowed;box-shadow:none}.cmd small{font-size:10px;color:var(--hb-muted);font-weight:650}.cmd.compact{min-height:38px;font-size:12px}.cmd.enum-command{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto auto;gap:4px 8px;padding:7px 10px}.cmd.enum-command ha-icon{grid-row:1/3}.cmd.enum-command span{text-align:left}.cmd.enum-command select{grid-column:2;border:1px solid var(--hb-line);border-radius:8px;background:#fff;color:var(--hb-ink);font:inherit;font-size:11px;padding:4px 6px;min-width:0}.cmd.enum-command.is-disabled{opacity:.56}.fold-section{border-top:1px solid rgba(14,35,72,.07);padding-top:8px}.fold-toggle{appearance:none;border:0;background:transparent;color:var(--hb-blue);font-size:13px;font-weight:650;display:flex;align-items:center;gap:4px;padding:0;cursor:pointer}.fold-toggle ha-icon{--mdc-icon-size:16px}.fold-panel{display:none;margin-top:10px}.fold-section.open .fold-panel{display:block}.maintenance-row{margin-top:0}.limit-control{grid-column:1/-1;border:1px solid var(--hb-line);border-radius:15px;background:#FAFCFF;padding:11px;display:grid;gap:9px}.limit-control.missing{grid-template-columns:1fr auto;align-items:center}.limit-control b{font-weight:650}.limit-control span{font-size:12px;color:var(--hb-muted);font-weight:600}.limit-head{display:flex;justify-content:space-between;gap:12px}.limit-slider{width:100%;accent-color:var(--hb-blue)}.limit-actions{display:grid;grid-template-columns:1fr auto;gap:8px}.limit-note{font-size:10px;color:var(--hb-muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.limit-number{border:1px solid var(--hb-line);border-radius:12px;background:#fff;padding:8px 10px;font-weight:600;color:var(--hb-ink);min-width:0}.detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.detail-field{border:1px solid var(--hb-line);border-radius:12px;background:#FAFCFF;padding:9px 10px;min-width:0}.detail-field span{display:block;font-size:10px;color:var(--hb-muted);font-weight:650;text-transform:uppercase;letter-spacing:.03em}.detail-field b{display:block;margin-top:3px;font-size:12px;color:var(--hb-ink);font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.empty-actions{grid-column:1/-1;border:1px dashed #CBD5E1;border-radius:13px;padding:13px;color:var(--hb-muted);font-size:13px;font-weight:600;text-align:center}.empty-state{grid-column:1/-1;border:1px dashed #CBD5E1;border-radius:20px;background:#fff;padding:34px;text-align:center;color:var(--hb-muted);font-weight:600}.empty-state ha-icon{--mdc-icon-size:48px;color:var(--hb-blue);opacity:.55}.empty-state h2{color:var(--hb-ink);margin:10px 0 6px}
      .charger-hero-visual.image-strip{width:310px;height:130px;gap:10px;padding:10px;box-sizing:border-box;overflow:hidden}.charger-hero-visual.image-strip img{max-width:92px;max-height:106px;object-fit:contain;filter:drop-shadow(0 18px 22px rgba(15,35,80,.16))}.premium-image-hero{min-height:226px;grid-template-columns:1fr;grid-template-rows:142px auto;padding:14px;background:linear-gradient(135deg,#FFFFFF 0%,#F8FBFF 48%,#EEF5FF 100%)}.premium-image-hero .charger-visual{height:142px;width:100%;background:linear-gradient(135deg,rgba(238,245,255,.95),rgba(255,255,255,.72));border:1px solid rgba(20,103,245,.10)}.premium-image-hero .charger-visual img{max-width:150px;max-height:132px}.premium-image-hero .charger-head{grid-template-columns:44px minmax(0,1fr) auto}.premium-image-hero .charger-icon{width:44px;height:44px;border-radius:15px}.premium-image-hero .status{align-self:center}.charger-visual.ok:after{content:"";position:absolute;top:14px;right:16px;width:34px;height:6px;border-radius:999px;background:#37D67A;box-shadow:0 0 16px rgba(55,214,122,.35)}.charger-visual.warn:after{content:"";position:absolute;top:14px;right:16px;width:34px;height:6px;border-radius:999px;background:#F8B84E}.charger-visual.bad:after{content:"";position:absolute;top:14px;right:16px;width:34px;height:6px;border-radius:999px;background:#F04438}
/* R22.10.3 shared horizontal outcome/status header */
.status-strip.dashboard-status-strip,.status-strip.ops-status-strip{
  display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;
  border:1px solid rgba(14,35,72,.11)!important;border-radius:17px!important;
  background:rgba(255,255,255,.96)!important;box-shadow:0 16px 32px rgba(15,35,80,.08)!important;
  overflow:hidden!important;max-width:none!important;width:100%!important;margin:8px 0 10px!important;
}
.status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric{
  display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;
  padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important;
}
.status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child{border-right:0!important;}
.status-strip.dashboard-status-strip .metric ha-icon,.status-strip.ops-status-strip .metric ha-icon{--mdc-icon-size:23px;color:#1467F5;}
.status-strip.dashboard-status-strip .metric.tone-green ha-icon,.status-strip.ops-status-strip .metric.tone-green ha-icon{color:#18A957!important;}
.status-strip.dashboard-status-strip .metric.tone-orange ha-icon,.status-strip.ops-status-strip .metric.tone-orange ha-icon{color:#F59E0B!important;}
.status-strip.dashboard-status-strip .metric span,.status-strip.ops-status-strip .metric span{display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1;}
.status-strip.dashboard-status-strip .metric b,.status-strip.ops-status-strip .metric b{display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
@media(max-width:760px){.status-strip.dashboard-status-strip,.status-strip.ops-status-strip{grid-template-columns:1fr!important;max-width:100%!important}.status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric{border-right:0!important;border-bottom:1px solid #E6ECF5!important}.status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child{border-bottom:0!important}}
${hbMobilitySharedShellStyles()}
@media(max-width:900px){.page{padding:14px}.hero{grid-template-columns:1fr;padding:22px}.hero-side{grid-template-columns:1fr}.hero .charger-hero-visual{display:none}.hero-metrics{grid-template-columns:repeat(3,1fr)}h1{font-size:36px}.grid{grid-template-columns:1fr}.charger-hero-card{grid-template-columns:1fr}.charger-kpis{grid-template-columns:1fr}.charger-head{grid-template-columns:44px minmax(0,1fr);}.status{grid-column:1/-1;justify-self:start}.command-row{grid-template-columns:1fr 1fr}}
      @media(max-width:520px){.hero-metrics{grid-template-columns:1fr}.charger-hero-card{grid-template-columns:1fr}.charger-visual{height:120px}.command-row{grid-template-columns:1fr}.detail-grid{grid-template-columns:1fr}}


      /* R22.10.3 operations aligned with main dashboard */
      .title{position:relative;padding:6px 0 0}.title .eyebrow{font-size:12px;font-weight:650;letter-spacing:.08em;text-transform:uppercase;color:var(--hb-blue);margin-bottom:6px}.title h1{font-size:42px;line-height:1;letter-spacing:-.055em;margin:0 0 8px;font-weight:650}.title p{font-size:14px;color:#06142D;font-weight:600;max-width:780px}.top-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.summary{min-height:76px;border:1px solid var(--hb-line);border-radius:20px;background:#fff;box-shadow:var(--hb-shadow);padding:14px 18px;display:grid;grid-template-columns:56px 1fr;gap:14px;align-items:center}.summary.attention{border-color:#FFD8A8}.summary.recommendation{border-color:#C9DEFF}.summary-icon{width:44px;height:44px;border-radius:16px;background:#FFF1D9;display:flex;align-items:center;justify-content:center}.summary-icon.blue{background:#1467F5;color:white}.summary-icon ha-icon{color:#F39A1B}.summary-icon.blue ha-icon{color:white}.summary h3{margin:0 0 6px;font-size:16px;font-weight:650}.summary ul{margin:0;padding:0;list-style:none}.summary li{display:flex;gap:14px;font-size:12px;color:#34405A;font-weight:600}.section-title{display:flex;align-items:center;justify-content:space-between;margin-top:4px}.section-title h2{margin:0;font-size:20px;font-weight:650}.section-title span{font-size:12px;color:#66728B;border:1px solid var(--hb-line);border-radius:999px;padding:4px 10px;background:#fff;font-weight:650}.bottom-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.info{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:0 14px 34px rgba(15,35,80,.055);padding:14px 16px;min-height:82px}.info h3{display:flex;align-items:center;gap:8px;font-size:15px;margin:0 0 8px}.info h3 ha-icon{color:#1467F5}.info p{font-size:12px;font-weight:600;color:#34405A}@media(max-width:860px){.top-grid,.bottom-grid{grid-template-columns:1fr}}
      /* R22.10.3 charge speed restore: compact, contract-driven, no min/max helper text. */
      .charge-mini-strip.mock-controls{display:flex!important;align-items:stretch!important;gap:8px!important;height:42px!important;overflow:hidden!important;min-width:0!important;grid-template-columns:none!important}
      .charger-select{flex:1 1 230px!important;min-width:170px!important}
      .mode-select{flex:0 1 132px!important;min-width:112px!important}
      .mini-current-stepper.compact-current{flex:0 0 156px!important;display:grid!important;grid-template-columns:minmax(56px,1fr) 32px 32px!important;align-items:center!important;gap:6px!important;padding:0 8px!important;background:#fff!important;border:1px solid var(--hb-line)!important;border-radius:12px!important;box-shadow:none!important;min-width:0!important;height:42px!important;min-height:42px!important}
      .mini-current-stepper.compact-current .current-copy{display:flex!important;flex-direction:column!important;justify-content:center!important;min-width:0!important;line-height:1.05!important;overflow:hidden!important}
      .mini-current-stepper.compact-current small{display:block!important;font-size:9px!important;font-weight:500!important;color:#6A768D!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-transform:none!important;letter-spacing:0!important;margin:0!important}
      .mini-current-stepper.compact-current strong{font-size:13px!important;font-weight:600!important;color:#06142D!important;white-space:nowrap!important;line-height:1.15!important;margin-top:2px!important}
      .mini-current-stepper.compact-current.readonly{grid-template-columns:minmax(56px,1fr)!important;flex-basis:112px!important}
      .mini-current-stepper.compact-current .round-step{width:30px!important;height:30px!important;min-width:30px!important;border-radius:12px!important;background:#fff!important;border:1px solid var(--hb-line)!important;color:#1467F5!important;font-size:18px!important;font-weight:500!important;box-shadow:none!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important}
      .mini-power-read{display:none!important}
      .vehicle-actions.clean-actions{grid-template-columns:minmax(142px,1.05fr) minmax(130px,1fr) minmax(110px,.85fr) 1fr 42px 42px!important;align-items:center!important}
      .vehicle-actions.clean-actions .presence-toggle.icon-only,.vehicle-actions.clean-actions .details-action.icon-only{justify-self:end!important;background:#fff!important;color:#1467F5!important;border-color:var(--hb-line)!important}
      .vehicle-actions.clean-actions .presence-toggle.icon-only ha-icon,.vehicle-actions.clean-actions .details-action.icon-only ha-icon{color:#1467F5!important}
      @media(max-width:880px){.charge-mini-strip.mock-controls{height:auto!important;flex-wrap:wrap!important}.mini-current-stepper.compact-current{flex:1 1 150px!important}.vehicle-actions.clean-actions{grid-template-columns:1fr 1fr 1fr 42px 42px!important}.action-spacer{display:none!important}}

      /* rc.27 shared visual-library management + mobile density. */
      .charger-appearance-action{height:34px;border-radius:10px;border:1px solid rgba(14,35,72,.10);background:#fff;color:#1467F5;display:inline-flex;align-items:center;gap:6px;padding:0 10px;font-size:11px;font-weight:600;cursor:pointer;grid-column:2/4;justify-self:start}
      .charger-appearance-action ha-icon{--mdc-icon-size:16px}
      .charger-picker-panel{margin:0;padding:10px;border:1px solid var(--hb-line);border-radius:14px;background:#fbfdff}
      .charger-picker-panel .vehicle-picker-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      .charger-picker-panel .vehicle-picker-head{display:flex;justify-content:space-between;gap:10px}
      .charger-picker-panel .vehicle-picker-head small{font-size:9px;color:var(--hb-blue);font-weight:650;letter-spacing:.08em}
      .charger-picker-panel .vehicle-picker-head h3{margin:2px 0 3px;font-size:15px}
      .charger-picker-panel .vehicle-picker-head p{font-size:10.5px;line-height:1.3}
      .charger-picker-panel label{display:grid;gap:4px}
      .charger-picker-panel label>span,.charger-picker-panel .vehicle-picker-key>span{font-size:9px;text-transform:uppercase;letter-spacing:.06em;color:var(--hb-muted)}
      .charger-picker-panel select,.charger-picker-panel code,.charger-picker-panel .vehicle-picker-save{min-height:40px;border:1px solid var(--hb-line);border-radius:10px;background:#fff;padding:0 10px}
      .charger-picker-panel .vehicle-picker-key{display:grid;gap:4px}
      .charger-picker-panel .vehicle-picker-save{display:flex;align-items:center;justify-content:center;gap:7px;font-weight:600}
      .charger-picker-panel .vehicle-picker-close{width:34px;height:34px;border-radius:10px;border:1px solid var(--hb-line);background:#fff}
      .charger-picker-panel .vehicle-picker-gap{grid-column:1/-1;margin-top:8px;font-size:10.5px;color:var(--hb-muted);display:flex;gap:7px;align-items:flex-start}
      @media(max-width:560px){
        .page{padding:8px 8px 18px!important;gap:8px!important}
        .charger-card{padding:10px!important;gap:8px!important;border-radius:16px!important}
        .charger-hero-card{grid-template-columns:minmax(0,1fr) 96px!important;min-height:116px!important;padding:10px!important;border-radius:14px!important}
        .charger-visual{height:96px!important}.charger-visual img{max-width:90px!important;max-height:90px!important}
        .charger-head{grid-template-columns:38px minmax(0,1fr) auto!important;gap:8px!important}
        .charger-icon{width:38px!important;height:38px!important;border-radius:12px!important}
        .charger-title h3{font-size:15px!important}.charger-title p{font-size:10px!important}
        .charger-kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important}
        .soft-line{gap:6px!important;flex-wrap:wrap!important}
        .charger-picker-panel .vehicle-picker-grid{grid-template-columns:1fr!important}
        .charger-appearance-action{grid-column:2/4!important;height:32px!important;padding:0 8px!important}
        .grid{grid-template-columns:1fr!important;gap:10px!important}
      }

      /* R22.12.11.24 Energy typography alignment — charger maintenance. */
      :host{font-family:inherit!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
      *{font-family:inherit!important;}
      .title h1{font-size:34px!important;line-height:1.08!important;font-weight:650!important;letter-spacing:-.025em!important;}
      .title p{font-size:13px!important;font-weight:400!important;color:var(--hb-muted,#66728B)!important;}
      .eyebrow{font-size:11px!important;font-weight:650!important;}
      .charger-name,.charger-mini-copy b{font-weight:600!important;}
      .card-title,.info h3,.section-title h2{font-weight:600!important;}
      .label,.subtext,.charger-mini-copy span{font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
      .value,strong{font-weight:650!important;}
      .action{font-weight:600!important;}

    `;
  }

  getCardSize(){ return 10; }
}

if (!customElements.get("homebrain-mobility-charger-maintenance-card")) {
  customElements.define("homebrain-mobility-charger-maintenance-card", HomeBrainMobilityChargerMaintenanceCard);
}
window.customCards.push({
  type: "homebrain-mobility-charger-maintenance-card",
  name: "Home Brain Mobility Charger Maintenance Card",
  description: "Premium responsive operational view for all Mobility chargers."
});



/**
 * Home Brain Mobility Dashboard Card — 2.2.2
 *
 * Adds consistent charging visibility and charger restart/startup guards.
 * This replaces the legacy Lovelace/button-card dashboard composition. The YAML now
 * only mounts this custom element. The card consumes the canonical registry and
 * runtime contracts, then renders the premium Mobility product dashboard from the
 * bundled JavaScript.
 */
