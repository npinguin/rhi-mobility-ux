// 90-mobility-dashboard-card.js
// Mobility dashboard and vehicle overview custom card.

class HomeBrainMobilityDashboardCard extends HTMLElement {
  setConfig(config) {
    this.config = { dashboard_path: "/mobility-supervisor/dashboard", ...config };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._sent = this._sent || new Map();
    this._selectedChargers = this._selectedChargers || new Map();
    this._currentOverrides = this._currentOverrides || new Map();
    this._lastDashboardRenderAt = this._lastDashboardRenderAt || 0;
    this._lastSignature = this._lastSignature || "";
  }

  assetId(asset) { return asset?.asset_id || ""; }
  vehicleId(asset) { return String(this.assetId(asset)).replace(/^vehicle_/, ""); }
  chargerId(assetOrId) { return String(assetOrId?.asset_id || assetOrId || "").replace(/^charger_/, ""); }

  /** Centralized charger image resolver.
   * Priority: profile/type words -> asset_id -> default. Keep this in one place
   * so Dashboard, Vehicle cards and Charger Maintenance remain visually aligned.
   */
  chargerImage(assetOrId) {
    const rt = this.rt || null;
    const asset = typeof assetOrId === "object"
      ? assetOrId
      : (rt && typeof rt.chargerById === "function" ? (rt.chargerById(assetOrId) || rt.assetById(assetOrId) || { asset_id: assetOrId }) : { asset_id: assetOrId });
    if (rt && typeof rt.visualImageUrl === "function") return rt.visualImageUrl(asset, "charger", "image", "charger_fallback");
    return rhiMobilityAssetUrl("chargers/charger_fallback.png");
  }

  chargerImageFromId(id) { return this.chargerImage(id); }

  displaySubtitle(asset, model = null) {
    const profile = String(asset?.profile || model?.subtitle || "").trim();
    return profile || model?.subtitle || asset?.asset_type || "Vehicle";
  }

  isGood(value) {
    const s = String(value || "").toLowerCase();
    return ["ready","on track","secure","trusted","complete","fresh","ok","comfort ready","charging","connected"].some((w)=>s.includes(w));
  }
  isBad(value) {
    const s = String(value || "").toLowerCase();
    return ["attention","degraded","failed","critical","issue","unsafe","unlocked","stale","not connected","open","blocked"].some((w)=>s.includes(w));
  }
  tone(value) {
    const s = String(value || "").toLowerCase();
    if (this.isGood(s)) return "ok";
    if (s.includes("charging") || s.includes("heating") || s.includes("waiting")) return "warn";
    if (this.isBad(s)) return "bad";
    return "muted";
  }

  commandState(rt, command) {
    // One command state model across overview and detail screens.
    return rt.commandState ? rt.commandState(command) : { disabled: !command, busy:false, failed:false, status:"", reason:"" };
  }

  completeCommandIntent(rt, command, assetId = "") {
    // R22.10.3 hotfix: Previous release called this helper but did not ship it.
    // Keep this function deliberately small: complete metadata that is already
    // discovered from the backend command contract, but never synthesize new
    // commands or hardcode known vehicle/charger identities.
    if (!command) return null;
    const completed = { ...command };
    const canonical = assetId ? rt.canonicalAssetId(assetId) : (completed.asset_id || "");
    if (!completed.asset_id && canonical) completed.asset_id = canonical;
    if (!completed.parameter_schema && typeof completed.parameter_schema_json === "string" && completed.parameter_schema_json.trim()) {
      const parsed = rt.parseJsonValue(completed.parameter_schema_json, null);
      if (parsed && typeof parsed === "object") completed.parameter_schema = parsed;
    }
    return completed;
  }

  selectCommand(rt, assetId, ids) {
    return rt.selectCommand(assetId, ids);
  }

  commandUsable(rt, command) {
    return rt.commandUsable(command);
  }

  chooseFirstUsable(rt, commands) {
    const list = (commands || []).filter(Boolean);
    return list.find((command) => this.commandUsable(rt, command)) || list[0] || null;
  }

  commandsByCategory(rt, assetId, categories) {
    const wanted = categories.map((c)=>String(c).toLowerCase());
    return rt.commandRegistry(assetId)
      .filter((c)=>c.frontend_allowed !== false)
      .filter((c)=>wanted.includes(String(c.category || "secondary").toLowerCase()));
  }

  commandKey(command) {
    return `${command?.asset_id || ""}::${command?.command_id || command?.command_key || ""}`;
  }

  renderCommand(rt, command, label, icon, extraClass = "") {
    const buttonLabel = command?.label || label;
    if (!command) return `<button class="action ${extraClass}" disabled><ha-icon icon="${icon}"></ha-icon><span>${rt.escape(buttonLabel)}</span></button>`;
    const completed = this.completeCommandIntent(rt, command, command.asset_id || "") || command;
    const st = this.commandState(rt, completed);
    const title = st.reason || st.status || "";
    const enums = completed?.enum_options || {};
    const requiredEnum = (completed.required_parameters || []).find((name) => Array.isArray(enums[name]) && enums[name].length);
    if (completed.interaction_mode === "form" && requiredEnum) {
      return `<label class="action enum-action ${extraClass} ${st.disabled ? "is-disabled" : ""}" title="${rt.escape(title)}"><ha-icon icon="${icon}"></ha-icon><select aria-label="${rt.escape(buttonLabel)}" data-command-asset="${rt.escape(completed.asset_id || "")}" data-command-id="${rt.escape(completed.command_id || "")}" data-command-key="${rt.escape(completed.command_key || completed.command_id || "")}" data-command-param="${rt.escape(requiredEnum)}" ${st.disabled ? "disabled" : ""}><option value="">${rt.escape(buttonLabel)}…</option>${enums[requiredEnum].map((option)=>`<option value="${rt.escape(option.value)}">${rt.escape(option.label || option.value)}</option>`).join("")}</select></label>`;
    }
    const backendSent = String(st.status || "").toLowerCase() === "sent";
    const cls = st.busy ? "busy" : st.failed ? "failed" : backendSent ? "sent-ack" : "";
    return `<button class="action ${extraClass} ${cls}" data-asset-id="${rt.escape(completed.asset_id || "")}" data-command-id="${rt.escape(completed.command_id || "")}" data-command-key="${rt.escape(completed.command_key || completed.command_id || "")}" ${st.disabled ? "disabled" : ""} title="${rt.escape(title)}"><ha-icon icon="${icon}"></ha-icon><span>${rt.escape(buttonLabel)}</span></button>`;
  }


  sourceUnavailable(rt, assetId) {
    // UX must not construct raw/source status entities. Backend contract health is exposed through runtime health gates.
    return false;
  }

  fmtKw(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
    return `${Number(value).toFixed(1)} kW`;
  }

  fmtAmp(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
    const n = Number(value);
    return `${Number.isInteger(n) ? n : n.toFixed(1)} A`;
  }

  metricWithUnit(rt, value, unit = "", propertyKey = "") {
    const raw = String(value ?? "").trim();
    if (!raw || ["—", "Unknown", "Not available", "Unavailable"].includes(raw)) return raw || "—";
    return rt.formatValue(raw, unit, propertyKey);
  }



  resolveEffectiveCharger(rt, vehicleAsset, chargers) {
    // R22.10.3 authoritative dashboard rule:
    // Vehicle -> charger relation comes only from mobility_relationship_index
    // assets_json[].relationship.effective_charger. No local selection cache,
    // no assigned fallback, no display-name token matching, no charger reverse scan.
    const rel = rt.vehicleChargerRelationship(this.assetId(vehicleAsset));
    const effective = String(rel.effective || "").trim();
    if (!effective || ["none", "unknown", "unavailable", "null", "undefined"].includes(effective.toLowerCase())) return null;
    return rt.chargerById(effective) || chargers.find((c)=>String(c.asset_id || "") === effective) || null;
  }

  vehicleChargingInfo(rt, vehicleAsset) {
    return rt.liveChargingContextForVehicle(this.assetId(vehicleAsset));
  }

  chargingContext(rt, vehicleAsset, chargers = []) {
    // R22.12.11.24: one contract-driven vehicle charging context used by
    // overview rendering and charge-power controls. This adapter does not
    // scan raw entities or reconstruct charger ownership.
    const assetId = this.assetId(vehicleAsset);
    const assigned = this.resolveEffectiveCharger(rt, vehicleAsset, chargers || []);
    const info = this.vehicleChargingInfo(rt, vehicleAsset) || {
      active: false, status: "Unknown", power: null, detail: "Charging context unavailable."
    };
    const limit = typeof rt.vehicleChargePowerControl === "function"
      ? rt.vehicleChargePowerControl(assetId)
      : { value: null, display: "—", entity: "", intent: "", visible: false, executable: false, property: null };
    return {
      assetId,
      assigned,
      info,
      limit,
      currentEntity: limit?.entity || ""
    };
  }


  commandIcon(command) {
    const id = String(command?.command_id || "").toLowerCase();
    if (id.includes("restart") || id.includes("reboot") || id.includes("reset")) return "mdi:restart";
    if (id.includes("identify") || id.includes("locate")) return "mdi:crosshairs-gps";
    if (id.includes("stop") || id.includes("pause")) return "mdi:stop";
    if (id.includes("start") || id.includes("charge") || id.includes("resume")) return "mdi:lightning-bolt";
    if (id.includes("climate") || id.includes("heat") || id.includes("precondition")) return "mdi:fan";
    if (id.includes("unlock")) return "mdi:lock-open-outline";
    if (id.includes("lock")) return "mdi:lock-outline";
    if (id.includes("present") || id.includes("active")) return "mdi:power";
    if (id.includes("profile")) return "mdi:card-account-details-outline";
    if (id.includes("selected_charger") || id.includes("charger")) return "mdi:ev-station";
    if (id.includes("target_soc")) return "mdi:battery-charging-80";
    if (id.includes("ready_by")) return "mdi:clock-outline";
    return "mdi:gesture-tap-button";
  }

  dashboardVehicleCommands(rt, assetId, context = {}) {
    // R22.10.3: dashboard quick actions are selected from discovered commands
    // grouped by the backend command_family contract. Asset identity discovery
    // remains dynamic; command IDs are only used inside a published family to
    // select the currently meaningful member of that family.
    return rt.commandActionsFor(assetId, "quick_actions");
  }

  lifecycleDisplay(rt, asset) {
    const status = rt.lifecycleStatus(asset);
    if (status === "active") return "Active";
    if (status === "disabled") return "Disabled";
    if (status === "retired") return "Retired";
    return "Contract gap";
  }

  lifecycleToggleButton(rt, asset, extraClass = "presence-toggle icon-only") {
    const status = rt.lifecycleStatus(asset);
    const desired = status === "disabled" ? "active" : "disabled";
    const model = rt.lifecycleWriteModel(asset, desired);
    const label = desired === "active" ? "Activate" : "Disable";
    const title = model.disabled ? (model.reason || "Lifecycle contract gap") : `${label} via lifecycle_status`;
    return `<button class="action ${extraClass}" data-lifecycle-asset="${rt.escape(this.assetId(asset))}" data-lifecycle-value="${rt.escape(desired)}" ${model.disabled ? "disabled" : ""} title="${rt.escape(title)}"><ha-icon icon="mdi:power"></ha-icon><span>${rt.escape(label)}</span></button>`;
  }

  chargingActivityDisplay(rt, asset) {
    const assetId = this.assetId(asset);
    const rel = rt.vehicleChargerRelationship(assetId);
    const physical = String(rel.connected || "").trim();
    const hasPhysical = !!physical && !["none","unknown","unavailable","null","undefined","—"].includes(physical.toLowerCase());
    if (!hasPhysical) return "Not connected";
    const snapshot = rt.chargerProductSnapshot(physical);
    const status = snapshot.operating.resolved ? snapshot.operating.display : "—";
    const power = snapshot.power.resolved ? snapshot.power.display : "—";
    return power === "—" ? status : `${status} · ${power}`;
  }

  renderChargerAssignmentSelect(rt, vehicleAsset) {
    const assetId = this.assetId(vehicleAsset);
    // R43.2.54: selected charger is an editable vehicle property. Relationship
    // indexes describe topology; they are never used as write targets or option lists.
    const prop = rt.propertyByCompoundKey(assetId, "vehicle.selected_charger");
    if (!prop) {
      return `<div class="mini-control charger-select readonly" title="vehicle.selected_charger is not published"><ha-icon icon="mdi:ev-station"></ha-icon><strong>—</strong></div>`;
    }
    const current = String(prop.value ?? "").trim();
    const rawChoices = rt.propertyEditorChoices(prop);
    const choices = (rawChoices || []).map((choice)=>{
      if (choice && typeof choice === "object") {
        const value = String(choice.value ?? choice.id ?? choice.asset_id ?? "").trim();
        const label = String(choice.label ?? choice.display_name ?? choice.name ?? (value ? rt.chargerLabel(value) : "")).trim();
        return value ? { value, label: label || value } : null;
      }
      const value = String(choice ?? "").trim();
      return value ? { value, label: rt.chargerLabel(value) || value } : null;
    }).filter(Boolean);
    const writable = rt.isWritableProperty(prop) && choices.length > 0;
    const currentKnown = choices.some((choice)=>choice.value === current);
    if (!writable) {
      const display = current ? (rt.chargerLabel(current) || current) : "—";
      return `<div class="mini-control charger-select readonly" title="Selected charger from vehicle property contract"><ha-icon icon="mdi:ev-station"></ha-icon><strong>${rt.escape(display)}</strong></div>`;
    }
    return `<div class="mini-control charger-select" title="Selected charger from vehicle property contract"><ha-icon icon="mdi:ev-station"></ha-icon><select data-property-asset="${rt.escape(assetId)}" data-property-key="vehicle.selected_charger" aria-label="Selected charger">${current && !currentKnown ? `<option value="${rt.escape(current)}" selected disabled>${rt.escape(rt.chargerLabel(current) || current)}</option>` : ""}${choices.map((choice)=>`<option value="${rt.escape(choice.value)}" ${choice.value === current ? "selected" : ""}>${rt.escape(choice.label)}</option>`).join("")}</select></div>`;
  }

  renderVehicleControlRow(rt, vehicleAsset, chargers) {
    const ctx = this.chargingContext(rt, vehicleAsset, chargers);
    const metricSlots = rt.vehicleOverviewMetricSlots(this.assetId(vehicleAsset));
    const chargePowerModel = rt.vehicleChargePowerControlModel(this.assetId(vehicleAsset));
    const limitValue = chargePowerModel?.resolved && Number.isFinite(Number(chargePowerModel.value)) ? Number(chargePowerModel.value) : null;
    const currentValue = limitValue === null ? "—" : (Number.isInteger(limitValue) ? String(limitValue) : Number(limitValue).toFixed(2).replace(/\.00$/, ""));
    const meta = {
      min: Number.isFinite(chargePowerModel?.min) ? chargePowerModel.min : 0,
      max: Number.isFinite(chargePowerModel?.max) ? chargePowerModel.max : 0,
      step: Number.isFinite(chargePowerModel?.step) ? chargePowerModel.step : 0
    };
    const canCurrent = !!(chargePowerModel?.resolved && chargePowerModel?.writable && meta.step > 0 && meta.max >= meta.min);
    const currentStepEntity = chargePowerModel?.write_target_entity || "";
    // R22.12.11.24: Vehicle charge power is the user-facing setting.
    // The connected/effective charger is the backend-owned execution target.
    const showCurrent = !!chargePowerModel?.resolved;
    const displayCurrent = currentValue === "—" ? "—" : `${currentValue} kW`;
    const atMin = canCurrent && limitValue !== null && limitValue <= meta.min + 0.000001;
    const atMax = canCurrent && limitValue !== null && limitValue >= meta.max - 0.000001;
    const currentControl = showCurrent ? `
      <div class="mini-current-stepper compact-current ${canCurrent ? "" : "readonly"}" title="Vehicle charge power. Same charger-owned property contract as the detail editor.">
        <span class="current-copy"><small>Vehicle charge power</small><strong>${rt.escape(displayCurrent)}</strong></span>
        ${canCurrent ? `<button class="round-step" data-property-step="vehicle.requested_charge_power_kw" data-vehicle-asset="${rt.escape(ctx.assetId)}" data-charge-power-value="${rt.escape(limitValue ?? meta.min)}" data-delta="-${rt.escape(meta.step)}" data-min="${rt.escape(meta.min)}" data-max="${rt.escape(meta.max)}" data-unit="kW" ${atMin ? "disabled" : ""}>−</button>
        <button class="round-step" data-property-step="vehicle.requested_charge_power_kw" data-vehicle-asset="${rt.escape(ctx.assetId)}" data-charge-power-value="${rt.escape(limitValue ?? meta.min)}" data-delta="${rt.escape(meta.step)}" data-min="${rt.escape(meta.min)}" data-max="${rt.escape(meta.max)}" data-unit="kW" ${atMax ? "disabled" : ""}>+</button>` : ``}
      </div>` : ``;
    const actualPowerNumber = Number(ctx.info?.power);
    const actualPowerDisplay = Number.isFinite(actualPowerNumber) ? `${Math.max(0, actualPowerNumber).toFixed(1).replace(/\.0$/, "")} kW` : "—";
    const hasPhysicalCharger = !!ctx.info?.physical_charger;
    const actualPowerControl = hasPhysicalCharger ? `
      <div class="mini-power-read actual-power-read" title="Actual power from the physically connected charger canonical property contract.">
        <span class="power-copy"><small>Power</small><strong>${rt.escape(actualPowerDisplay)}</strong></span>
      </div>` : ``;
    return `<section class="vehicle-control-row mock-row" title="${rt.escape(ctx.info.detail)}">
      <div class="vehicle-metrics-strip mock-metrics">
        ${metricSlots.map((slot, index)=>`<div class="metric-chip ${index === 2 ? "battery-chip" : ""}" title="${rt.escape(slot.property_key || "Component contract gap")}"><span>${rt.escape(slot.label)}</span><b>${rt.escape(slot.resolved ? slot.display : "—")}</b></div>`).join("")}
      </div>
      <div class="charge-mini-strip mock-controls ${showCurrent ? "has-speed" : "no-speed"} no-mode">
        ${this.renderChargerAssignmentSelect(rt, vehicleAsset)}
        ${currentControl}
        ${actualPowerControl}
      </div>
    </section>`;
  }

  vehiclePresent(rt, asset) {
    return rt.lifecycleStatus(asset) === "active";
  }


  renderInactiveVehicle(rt, asset) {
    const factory = new HomeBrainAssetFactory(rt);
    const model = factory.adapterFor(asset, this.config)?.build?.() || null;
    const display = model?.display || asset.display_name || rt.vehicleLabel(asset.asset_id);
    const subtitle = model?.subtitle || asset.profile || "Vehicle";
    const route = rt.assetDetailRoute(asset);
    const lifecycleLabel = this.lifecycleDisplay(rt, asset);
    const activateButton = this.lifecycleToggleButton(rt, asset, "activate-soft icon-only");
    return `<article class="inactive-row compact-present-row lifecycle-collapsed-row">
      <span class="inactive-state">${rt.escape(lifecycleLabel)}</span>
      <div class="inactive-copy"><h3>${rt.escape(display)}</h3><p>${rt.escape(subtitle)}</p></div>
      <div class="inactive-actions">${activateButton}<button class="action icon-only" data-nav="${rt.escape(route)}" title="Open details"><ha-icon icon="mdi:plus"></ha-icon><span>Details</span></button></div>
    </article>`;
  }

  renderVehicle(rt, asset, chargers) {
    const factory = new HomeBrainAssetFactory(rt);
    const adapter = factory.adapterFor(asset, this.config);
    const model = adapter?.build?.() || null;
    const id = this.vehicleId(asset);
    const assetId = this.assetId(asset);
    const display = model?.display || asset.display_name || rt.vehicleLabel(assetId);
    const subtitle = this.displaySubtitle(asset, model);
    const image = model?.image || "";
    const route = rt.assetDetailRoute(asset);
    const ctx = this.chargingContext(rt, asset, chargers);
    const relLabels = rt.vehicleChargerRelationship(assetId);
    const assignedName = relLabels.effective_display_name || ctx.assigned?.display_name || "No active charger";
    const isRealAssetId = (v) => {
      const idv = String(v || "").trim();
      return !!idv && !["none","unknown","unavailable","null","undefined"].includes(idv.toLowerCase());
    };
    const hasEffectiveCharger = isRealAssetId(relLabels.effective);
    const hasConnectedCharger = isRealAssetId(relLabels.connected);
    const activeChargerId = [relLabels.connected, relLabels.effective, ctx.assigned?.asset_id].find(isRealAssetId) || "";
    const activeChargerAsset = activeChargerId ? (rt.chargerById(activeChargerId) || rt.assetById(activeChargerId) || { asset_id: activeChargerId, asset_type: "charger" }) : null;
    const activeChargerRoute = activeChargerAsset ? rt.assetDetailRoute(activeChargerAsset) : "";
    const chargerImage = this.chargerImage(activeChargerId || "default");
    const notPresentButton = this.lifecycleToggleButton(rt, asset, "presence-toggle icon-only");
    const vehicleCommands = this.dashboardVehicleCommands(rt, assetId);
    const chargingActivity = this.chargingActivityDisplay(rt, asset);
    return `<article class="vehicle-card premium-vehicle-card">
      <div class="status-top-row vehicle-intelligence-strip">
        ${(Array.isArray(model?.status) ? model.status : rt.vehicleIntelligenceStatusTiles(assetId)).slice(0, 5).map((tile) => this.intelligenceStatusRow(rt, tile)).join("")}
      </div>
      <div class="hero-split-row">
        <div class="vehicle-hero-panel">
          <div class="vehicle-copy"><h2>${rt.escape(display)}</h2><p>${rt.escape(subtitle)}</p><p class="vehicle-activity-inline">${rt.escape(chargingActivity)}</p></div>
          <div class="vehicle-image">${image ? `<img src="${rt.escape(rt.cache(image))}" alt="${rt.escape(display)}">` : `<ha-icon icon="mdi:car-estate"></ha-icon>`}</div>
          <button class="mini-detail-button vehicle-detail-link" data-nav="${rt.escape(route)}" title="Open vehicle details"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        <div class="charger-hero-panel">
          <div class="charger-mini-copy"><b>${rt.escape(assignedName)}</b></div>
          <div class="charger-mini-image"><img src="${rt.escape(rt.cache(chargerImage))}" alt="${rt.escape(assignedName)}" loading="lazy" onerror="this.style.display='none';this.closest('.charger-mini-image')?.classList.add('image-missing')"><ha-icon icon="mdi:ev-station"></ha-icon></div>
          ${activeChargerRoute ? `<button class="mini-detail-button charger-detail-link" data-nav="${rt.escape(activeChargerRoute)}" title="Open charger details"><ha-icon icon="mdi:plus"></ha-icon></button>` : ``}
        </div>
      </div>
      ${this.renderVehicleControlRow(rt, asset, chargers)}
      <div class="vehicle-actions clean-actions">
        ${vehicleCommands.map((cmd, index)=>this.renderCommand(rt, cmd, cmd?.label || "Action", this.commandIcon(cmd), index === 0 ? "primary-charge" : "")).join("")}
        ${Array.from({length: Math.max(0, 3 - vehicleCommands.length)}).map(()=>`<span class="action-spacer"></span>`).join("")}
        <span class="action-spacer"></span>
        ${notPresentButton ? notPresentButton.replace('class="action presence-toggle"', 'class="action presence-toggle icon-only"') : ""}
      </div>
    </article>`;
  }

  versionBlock(rt) {
    return `<div class="hi-version-block" style="position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0;margin:0;z-index:3;pointer-events:none;"><div>UX ${rt.escape(UX_VERSION)}</div><div>Backend ${rt.escape(rt.backendVersion())}</div></div>`;
  }

  intelligenceStatusRow(rt, tile = {}) {
    const label = tile.label || "Intelligence";
    const value = tile.value || "Contract gap";
    const subvalue = tile.subvalue || "";
    const rawTone = String(tile.tone || "neutral").toLowerCase();
    const pillTone = rawTone === "error" ? "bad" : rawTone === "attention" ? "warn" : rawTone === "active" ? "ok" : "muted";
    const title = subvalue ? `${label}: ${value} — ${subvalue}` : `${label}: ${value}`;
    return `<div class="status-row intelligence-status-row" title="${rt.escape(title)}"><ha-icon icon="${rt.escape(tile.icon || "mdi:information-outline")}"></ha-icon><span>${rt.escape(label)}</span><b class="pill ${pillTone}">${rt.escape(value)}</b></div>`;
  }

  issueRows(rt, vehicles) {
    const rows = [];
    let missing = 0;
    for (const a of vehicles) {
      const label = a.display_name || rt.vehicleLabel(a.asset_id);
      const attention = rt.supervisorOutcome(a.asset_id, "attention", "");
      const reason = rt.supervisorOutcome(a.asset_id, "attention_reason", "");
      if (!attention) {
        missing += 1;
        continue;
      }
      const att = String(attention).toLowerCase();
      if (!["none", "ok", "not applicable"].includes(att)) {
        rows.push(`<li><b>${rt.escape(label)}</b><span>${rt.escape(reason || attention)}</span></li>`);
      }
    }
    if (rows.length) return rows.join("");
    if (missing) return `<li><b>Supervisor</b><span>Attention unavailable for ${missing} vehicle${missing === 1 ? "" : "s"}.</span></li>`;
    return `<li class="clear"><b>All vehicles</b><span>Backend supervisor reports no attention requiring action.</span></li>`;
  }

  recommended(rt) {
    const action = rt.supervisorOutcome("mobility", "recommended_action", "");
    const reason = rt.supervisorOutcome("mobility", "recommended_reason", "") || rt.supervisorOutcome("mobility", "attention", "");
    if (action) return { label: "Mobility", action, reason: reason || "Backend supervisor recommendation." };
    return { label: "Mobility", action: "Unknown", reason: "Backend supervisor recommendation unavailable." };
  }

  set hass(hass) {
    this._hass = hass;
    try {
          const now = Date.now();
          const forceRender = !!this._forceRender;
          this._forceRender = false;
          const activeEl = this.shadowRoot?.activeElement;
          if (!forceRender && (now < (this._holdRenderUntil || 0)) && this._lastRenderOk) return;
          if (!forceRender && activeEl && ["SELECT", "INPUT"].includes(activeEl.tagName) && this._lastRenderOk) return;
          if (!forceRender && this._lastRenderOk && now - (this._lastDashboardRenderAt || 0) < 900) return;
          this._lastDashboardRenderAt = now;
          const rt = new HomeBrainAssetRuntime(hass, this.config);
          this.rt = rt;
          const factory = new HomeBrainAssetFactory(rt);
          const vehicles = factory.vehicles().filter((a)=>a.lifecycle_state !== "Retired").sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.display_name).localeCompare(String(b.display_name)));
          const chargers = factory.chargers().filter((a)=>a.frontend_allowed !== false && rt.lifecycleStatus(a) === "active").sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.display_name).localeCompare(String(b.display_name)));
          const activeVehicles = vehicles.filter((v)=>rt.lifecycleStatus(v) === "active");
          const inactiveVehicles = vehicles.filter((v)=>rt.lifecycleStatus(v) !== "active" && rt.lifecycleStatus(v) !== "retired");
          const reco = this.recommended(rt);
          const plan = rt.supervisorOutcome("mobility", "opportunity", "Unknown") || "Unknown";
          const trust = rt.supervisorOutcome("mobility", "trust", "Unknown") || "Unknown";
          const activityRows = rt.activityRowsFor ? rt.activityRowsFor("") : [];
          const intelligenceRows = rt.intelligenceRowsFor ? rt.intelligenceRowsFor("") : [];
          const activity = activityRows.slice(0, 3).map((a)=>a.message || a.activity_state || a.activity_type || "Current activity");
          const intelligenceSummary = intelligenceRows.find((r)=>r.message || r.meaning || r.value || r.title || r.insight_type);
          const signature = JSON.stringify({
            vehicles: vehicles.map((v) => {
              const id = this.vehicleId(v);
              const assetId = v.asset_id;
              const cmds = rt.commandRegistry(assetId).map((cmd) => [cmd.command_id, cmd.frontend_allowed, cmd.execution_allowed, cmd.execution_status || "", cmd.blocked_reason || cmd.execution_reason || ""]);
              const relationship = rt.vehicleChargerRelationship(assetId);
              const intelligence = rt.vehicleIntelligenceStatusTiles(assetId).map((tile) => [tile.label, tile.value, tile.subvalue, tile.tone]);
              const compactMetrics = rt.vehicleOverviewMetricSlots(assetId).map((slot)=>[slot.property_key, slot.resolved ? slot.display : "—"]);
              return [assetId, v.display_name, rt.lifecycleStatus(v), relationship.connected, relationship.effective, intelligence, compactMetrics,
                rt.supervisorOutcome(assetId, "status", ""), rt.supervisorOutcome(assetId, "trust", ""), rt.supervisorOutcome(assetId, "attention", ""), cmds];
            }),
            chargers: chargers.map((c) => {
              const cid = this.chargerId(c);
              const aid = c.asset_id;
              return [aid,
                rt.chargerOperationalStatus(aid),
                rt.chargerConnectionState(aid),
                rt.canonicalChargerPropertyDisplay(aid, "charger.power_kw", ""),
                rt.canonicalChargerPropertyDisplay(aid, "charger.current_limit_a", "")
              ];
            }),
            reco, plan, trust, activity, sent: Array.from(this._sent || []).filter(([, t]) => Date.now() - t < 3000)
          });
          const activeElement = this.shadowRoot?.activeElement;
          if (!forceRender && this._lastSignature === signature && this._lastRenderOk && !(activeElement && ["SELECT", "INPUT"].includes(activeElement.tagName))) return;
          this._lastSignature = signature;
          this._lastRenderOk = true;
          this.shadowRoot.innerHTML = `<ha-card><div class="page">${this.versionBlock(rt)}
            ${hbMobilityNav(this.config?.nav_active || "overview")}
            <section class="title"><h1>Overview</h1><p>Vehicle readiness, charging, comfort and security in one calm control cockpit.</p></section>
            <section class="status-strip dashboard-status-strip" style="display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;border:1px solid rgba(14,35,72,.11)!important;border-radius:17px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 16px 32px rgba(15,35,80,.08)!important;overflow:hidden!important;max-width:none!important;width:100%!important;margin:8px 0 10px!important">
              <div class="metric tone-green" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:check-circle-outline" style="color:#18A957;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Status</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(rt.supervisorOutcome("mobility", "status", "Unknown") || "Unknown")}</b></div></div>
              <div class="metric tone-blue" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:shield-check-outline" style="color:#1467F5;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Trust</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(rt.supervisorOutcome("mobility", "trust", "Unknown") || "Unknown")}</b></div></div>
              <div class="metric tone-orange" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:alert-circle-outline" style="color:#F59E0B;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Attention</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(rt.supervisorOutcome("mobility", "attention", "Unknown") || "Unknown")}</b></div></div>
              <div class="metric tone-green" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:lightbulb-outline" style="color:#18A957;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Opportunity</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(rt.supervisorOutcome("mobility", "opportunity", "Unknown") || "Unknown")}</b></div></div>
              <div class="metric tone-blue" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:arrow-right-circle-outline" style="color:#1467F5;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Recommended action</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(reco.action || "Unknown")}</b></div></div>
            </section>
            <section class="section-title"><h2>Active vehicles</h2><span>${activeVehicles.length} active</span></section>
            <section class="vehicles">${activeVehicles.length ? activeVehicles.map((v)=>this.renderVehicle(rt,v,chargers)).join("") : `<div class="empty">No active vehicles. Activate a vehicle below when needed.</div>`}</section>
            ${inactiveVehicles.length ? `<section class="section-title compact-title"><h2>Inactive vehicles</h2><span>${inactiveVehicles.length} inactive</span></section><section class="inactive-list">${inactiveVehicles.map((v)=>this.renderInactiveVehicle(rt,v)).join("")}</section>` : `<section class="debt-strip"><ha-icon icon="mdi:information-outline"></ha-icon><b>Inactive vehicles (0)</b><span>Deactivated vehicles are hidden.</span></section>`}
            <section class="bottom-grid"><div class="info"><h3><ha-icon icon="mdi:calendar-clock"></ha-icon>Charging Plan</h3><p>${rt.escape(plan)}</p></div><div class="info"><h3><ha-icon icon="mdi:shield-check-outline" style="color:#1467F5;--mdc-icon-size:23px"></ha-icon>System Trust</h3><p>${rt.escape(intelligenceSummary ? (intelligenceSummary.message || intelligenceSummary.meaning || intelligenceSummary.value || intelligenceSummary.title || intelligenceSummary.insight_type) : trust)}</p></div><div class="info"><h3><ha-icon icon="mdi:history"></ha-icon>Current Activity</h3>${activity.length ? `<ul>${activity.map((a)=>`<li>${rt.escape(a)}</li>`).join("")}</ul>` : `<p>No current activity published.</p>`}</div></section>
          </div>${hbMobilityReleaseFooter(rt)}<style>${this.styles()}
/* R22.12.11.24 unified quick-action sizing */
.action.enum-action,.cmd.enum-command{height:43px!important;min-height:43px!important;max-height:43px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:0 11px!important;box-sizing:border-box!important;overflow:hidden!important}
.action.enum-action ha-icon,.cmd.enum-command ha-icon{flex:0 0 auto!important;grid-row:auto!important}
.action.enum-action select,.cmd.enum-command select{appearance:auto!important;-webkit-appearance:auto!important;min-width:0!important;max-width:170px!important;width:auto!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-size:12px!important;font-weight:600!important;padding:0 2px!important;line-height:1!important;box-shadow:none!important;cursor:pointer!important;grid-column:auto!important}
.action.enum-action select:focus,.cmd.enum-command select:focus{outline:2px solid rgba(20,103,245,.20)!important;outline-offset:3px!important;border-radius:6px!important}
.command-row>.cmd,.command-row>.enum-command{min-width:0!important;width:100%!important}
</style></ha-card>`;
          this.wireEvents(rt);
    } catch (err) {
      console.error("HomeBrain Mobility dashboard render failed", err);
      const message = String((err && (err.stack || err.message)) || err || "Unknown render error");
      const safe = message.replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      let backendVersion = "Unknown";
      try { backendVersion = new HomeBrainAssetRuntime(this._hass || hass, this.config).backendVersion(); } catch (e) {}
      this.shadowRoot.innerHTML = `<ha-card>
        <div class="hb-error-page">
          <div class="hi-version-block" style="position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0;margin:0;z-index:3;pointer-events:none;"><div>UX ${String(UX_VERSION).replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]))}</div><div>Backend ${String(backendVersion).replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]))}</div></div>
          <h1>Mobility</h1>
          <h2>Dashboard temporarily unavailable</h2>
          <p>The frontend loaded, but the dashboard could not render the current backend contract safely.</p>
          <pre>${safe}</pre>
        </div>
        <style>
          ha-card{background:transparent;border:0;box-shadow:none}
          .hb-error-page{position:relative;margin:24px auto;width:min(100%,1100px);box-sizing:border-box;padding:28px;border:1px solid #F3B7B7;border-radius:22px;background:#FFF7F7;color:#061226;font-family:inherit;user-select:text;-webkit-user-select:text,sans-serif;box-shadow:0 18px 48px rgba(80,15,15,.08)}
          .hi-version-block{position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0}
          h1{margin:0 0 8px;font-size:34px;letter-spacing:-.04em}
          h2{margin:0 0 8px;font-size:20px}
          p{font-weight:600;color:#5F6D84}
          pre{white-space:pre-wrap;overflow:auto;background:#fff;border:1px solid #F0D0D0;border-radius:14px;padding:14px;font-size:12px;max-height:360px}
        
/* R22.12.11.24 unified quick-action sizing */
.action.enum-action,.cmd.enum-command{height:43px!important;min-height:43px!important;max-height:43px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:0 11px!important;box-sizing:border-box!important;overflow:hidden!important}
.action.enum-action ha-icon,.cmd.enum-command ha-icon{flex:0 0 auto!important;grid-row:auto!important}
.action.enum-action select,.cmd.enum-command select{appearance:auto!important;-webkit-appearance:auto!important;min-width:0!important;max-width:170px!important;width:auto!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-size:12px!important;font-weight:600!important;padding:0 2px!important;line-height:1!important;box-shadow:none!important;cursor:pointer!important;grid-column:auto!important}
.action.enum-action select:focus,.cmd.enum-command select:focus{outline:2px solid rgba(20,103,245,.20)!important;outline-offset:3px!important;border-radius:6px!important}
.command-row>.cmd,.command-row>.enum-command{min-width:0!important;width:100%!important}
</style>
        ${hbMobilityReleaseFooter(new HomeBrainAssetRuntime(this._hass || hass, this.config))}
      </ha-card>`;
    }
  }
  wireEvents(rt) {
    this.shadowRoot.querySelectorAll("button[data-intent]").forEach((btn)=>btn.addEventListener("click",()=>{
      const assetId = btn.getAttribute("data-asset-id") || "";
      const commandId = btn.getAttribute("data-command-id") || "";
      const commandKey = btn.getAttribute("data-command-key") || commandId;
      const command = commandKey ? rt.commandsFor(assetId).find((c)=>String(c.command_key || c.command_id || "") === String(commandKey) || String(c.command_id || "") === String(commandId)) : null;
      if (command) rt.callCommand(command);
    }));
    this.shadowRoot.querySelectorAll("select[data-command-id]").forEach((select)=>select.addEventListener("change",()=>{
      const value = select.value;
      if (!value || select.disabled) return;
      const assetId = select.getAttribute("data-command-asset") || "";
      const commandId = select.getAttribute("data-command-id") || "";
      const commandKey = select.getAttribute("data-command-key") || commandId;
      const parameter = select.getAttribute("data-command-param") || "";
      const command = rt.commandsFor(assetId).find((candidate)=>String(candidate.command_key || candidate.command_id || "") === String(commandKey) || String(candidate.command_id || "") === String(commandId));
      if (!command || !parameter) return;
      rt.callCommand(command, { [parameter]: value });
      select.value = "";
    }));
    this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn)=>btn.addEventListener("click",()=>rt.navigate(btn.getAttribute("data-nav"))));
    this.shadowRoot.querySelectorAll("button[data-lifecycle-asset]").forEach((btn)=>btn.addEventListener("click",()=>{
      if (btn.disabled) return;
      const assetId = btn.getAttribute("data-lifecycle-asset") || "";
      const value = btn.getAttribute("data-lifecycle-value") || "";
      if (!assetId || !value) return;
      const ok = rt.writeLifecycleStatus(assetId, value);
      if (!ok) return;
      btn.classList.add("sent");
      this._forceRender = true;
      this._holdRenderUntil = 0;
      setTimeout(()=>{ if (this.isConnected) this.hass = this._hass; }, 650);
    }));

    this.shadowRoot.querySelectorAll("button[data-property-step],button[data-charge-power-step],button[data-current-step]").forEach((btn)=>btn.addEventListener("click",()=>{
      const vehicleAsset = btn.getAttribute("data-vehicle-asset") || btn.getAttribute("data-charger-asset");
      const propertyKey = btn.getAttribute("data-property-step") || "";
      const unit = btn.getAttribute("data-unit") || "kW";
      const delta = Number(btn.getAttribute("data-delta") || 0);
      const min = Number(btn.getAttribute("data-min") || 0);
      const max = Number(btn.getAttribute("data-max") || 100);
      const attrValue = Number(btn.getAttribute("data-charge-power-value") || btn.getAttribute("data-current-value"));
      const cur = Number.isFinite(attrValue) ? attrValue : null;
      const next = Math.max(min, Math.min(max, (cur ?? min) + delta));
      if (vehicleAsset) this._currentOverrides.set(vehicleAsset, next);
      const wrap = btn.closest(".mini-current-stepper");
      if (wrap) {
        const strong = wrap.querySelector("strong");
        if (strong) strong.textContent = `${Number.isInteger(next) ? next : Number(next).toFixed(2).replace(/\.00$/, "")} ${unit}`;
        wrap.querySelectorAll("button[data-property-step],button[data-charge-power-step],button[data-current-step]").forEach((b)=>{
          b.setAttribute("data-charge-power-value", String(next));
          b.setAttribute("data-current-value", String(next));
          const d = Number(b.getAttribute("data-delta") || 0);
          b.disabled = (d < 0 && next <= min + 0.000001) || (d > 0 && next >= max - 0.000001);
        });
      }
      this._holdRenderUntil = Date.now() + 1200;
      if (!propertyKey || !vehicleAsset) return;
      const model = propertyKey === "vehicle.requested_charge_power_kw"
        ? rt.vehicleChargePowerControlModel(vehicleAsset)
        : rt.propertyControlModel(vehicleAsset, propertyKey);
      rt.writePropertyControl(model, next);
      setTimeout(()=>{ if (this.isConnected) this.hass = this._hass; }, 900);
    }));
    this.shadowRoot.querySelectorAll("select[data-property-asset][data-property-key]").forEach((select)=>{
      const hold = ()=>{ this._holdRenderUntil = Date.now() + 1200; };
      select.addEventListener("pointerdown", hold);
      select.addEventListener("focus", hold);
      select.addEventListener("change",()=>{
        const assetId = select.getAttribute("data-property-asset") || "";
        const propertyKey = select.getAttribute("data-property-key") || "";
        if (!assetId || !propertyKey || select.disabled) return;
        rt.writePublishedProperty(assetId, propertyKey, select.value);
        this._forceRender = true;
        this._holdRenderUntil = 0;
        setTimeout(()=>{ if (this.isConnected) this.hass = this._hass; }, 250);
      });
    });
  }

  styles() { return `
    :host{--hb-blue:#1467F5;--hb-ink:#061226;--hb-muted:#63718A;--hb-line:#E4ECF7;--hb-soft:#F6FAFF;--hb-shadow:0 22px 60px rgba(15,35,80,.08);font-family:inherit;color:var(--hb-ink);user-select:text;-webkit-user-select:text}
    *{user-select:text;-webkit-user-select:text} button,select,input,img,ha-icon{user-select:none;-webkit-user-select:none}
    ha-card{background:transparent;border:0;box-shadow:none}.page{position:relative;width:min(100%,1680px);margin:0 auto;padding:18px 34px 38px;display:grid;gap:12px;box-sizing:border-box}.release-badge{position:absolute;top:10px;right:34px;border:1px solid rgba(14,35,72,.10);background:#fff;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:650;color:#33415C;box-shadow:0 8px 20px rgba(15,35,80,.055)}.eyebrow{margin:0 0 6px!important;color:#1467F5!important;font-size:12px;font-weight:650;letter-spacing:.12em}.title h1{font-size:38px;letter-spacing:-.055em;margin:0 0 6px;font-weight:650}.title p{margin:0;color:#34405A;font-weight:600}.top-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.summary{border:1px solid var(--hb-line);border-radius:22px;background:#fff;box-shadow:var(--hb-shadow);min-height:108px;padding:20px;display:grid;grid-template-columns:56px 1fr;gap:16px;align-items:center}.summary.attention{border-color:rgba(245,143,32,.30);background:linear-gradient(135deg,#FFFAF2,#fff)}.summary.recommendation{border-color:rgba(20,103,245,.22);background:linear-gradient(135deg,#F5FAFF,#fff)}.summary-icon{width:52px;height:52px;border-radius:16px;background:rgba(255,145,0,.12);display:flex;align-items:center;justify-content:center;color:#F28C00}.summary-icon.blue{background:#1467F5;color:#fff}.summary-icon ha-icon{--mdc-icon-size:30px}.summary h3,.info h3{margin:0 0 8px;font-size:16px;font-weight:650}.summary ul,.info ul{list-style:none;margin:0;padding:0}.summary li{display:flex;flex-direction:column;gap:3px;border-top:1px solid rgba(14,35,72,.06);padding:7px 0;font-size:13px;color:#34405A;font-weight:600}.summary li.clear b{color:#087A35}.section-title{display:flex;align-items:end;justify-content:space-between;margin:0 2px -8px}.section-title h2{font-size:20px;letter-spacing:-.035em;margin:0;font-weight:650}.section-title span{font-size:12px;font-weight:650;color:#6A768D;background:#F4F7FB;border:1px solid var(--hb-line);border-radius:999px;padding:5px 9px}.vehicles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.vehicle-card{background:#fff;border:1px solid var(--hb-line);border-radius:24px;box-shadow:var(--hb-shadow);overflow:hidden}.premium-vehicle-card{display:grid;gap:0}.status-top-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;padding:16px 18px 8px}.status-row{display:flex;align-items:center;justify-content:center;gap:7px;min-height:40px;border:1px solid var(--hb-line);border-radius:14px;background:#fff;min-width:0}.status-row span{display:none}.status-row ha-icon{--mdc-icon-size:18px;color:#17233B;flex:0 0 auto}.vehicle-intelligence-strip .intelligence-status-row{display:grid;grid-template-columns:20px minmax(0,1fr);grid-template-rows:auto auto;justify-content:stretch;align-content:center;column-gap:7px;row-gap:1px;padding:5px 8px;min-height:40px}.vehicle-intelligence-strip .intelligence-status-row ha-icon{grid-row:1 / span 2;align-self:center}.vehicle-intelligence-strip .intelligence-status-row span{display:block!important;grid-column:2;font-size:9px;line-height:1;color:#6A768D;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vehicle-intelligence-strip .intelligence-status-row .pill{grid-column:2;justify-content:flex-start;min-width:0;padding:3px 7px;font-size:10px}.pill{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:6px 10px;min-width:72px;max-width:100%;font-size:10px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pill.ok{background:#E7F6EA;color:#087A35}.pill.warn{background:#FFF1D9;color:#B76500}.pill.bad{background:#FDE4E4;color:#C21E1E}.pill.muted{background:#EEF1F6;color:#64708A}.hero-split-row{display:grid;grid-template-columns:2fr 1fr;gap:12px;padding:8px 18px 12px;align-items:stretch}.vehicle-hero-panel{display:grid;grid-template-columns:minmax(0,.86fr) minmax(220px,1.14fr);gap:12px;min-height:170px;border:1px solid rgba(14,35,72,.06);border-radius:18px;background:linear-gradient(135deg,#fff,#F8FBFF);padding:18px;overflow:hidden}.vehicle-copy h2{font-size:25px;margin:0 0 4px;font-weight:650;letter-spacing:-.045em}.vehicle-copy p{margin:0;color:#34405A;font-weight:600}.vehicle-image{display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at center,rgba(20,103,245,.09),transparent 62%);min-width:0}.vehicle-image img{max-width:100%;max-height:176px;object-fit:contain;filter:drop-shadow(0 18px 28px rgba(15,35,80,.16))}.vehicle-image ha-icon{--mdc-icon-size:76px;color:#B8C3D6}.charger-hero-panel{border:1px solid var(--hb-line);border-radius:18px;background:linear-gradient(135deg,#F8FBFF,#fff);padding:14px;display:grid;grid-template-rows:auto 1fr;gap:8px;align-items:center;min-width:0}.charger-mini-image{height:118px;border-radius:16px;background:radial-gradient(circle at center,rgba(20,103,245,.10),transparent 65%);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.charger-mini-image img{max-width:100%;max-height:112px;object-fit:contain;filter:drop-shadow(0 14px 24px rgba(15,35,80,.13))}.charger-mini-image ha-icon{display:none;--mdc-icon-size:46px;color:#8EA1BE}.charger-mini-image.image-missing ha-icon{display:block}.charger-mini-copy{display:flex;flex-direction:column;gap:2px;min-width:0}.charger-mini-copy b{font-size:15px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.charger-mini-copy span{display:none!important}.relationship-lines{display:flex;flex-direction:column;gap:2px;margin-top:6px;font-size:10.5px;color:#64708A;font-weight:500;line-height:1.25}.relationship-lines span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vehicle-control-row{display:grid;grid-template-columns:minmax(320px,1fr) minmax(420px,.95fr);gap:12px;padding:0 18px 12px;align-items:stretch}.vehicle-metrics-strip,.charge-mini-strip{display:grid;gap:8px}.vehicle-metrics-strip{grid-template-columns:repeat(3,minmax(92px,1fr))}.charge-mini-strip{grid-template-columns:minmax(170px,1.2fr) minmax(190px,1fr) minmax(110px,.7fr)}.metric-chip,.mini-control{min-height:42px;border:1px solid var(--hb-line);border-radius:13px;background:#fff;display:flex;align-items:center;gap:8px;padding:0 12px;min-width:0}.metric-chip{flex-direction:column;align-items:flex-start;justify-content:center;gap:2px}.metric-chip span{color:var(--hb-muted);font-size:10px;text-transform:uppercase;font-weight:650}.metric-chip b,.mini-control strong{font-size:14px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mini-control ha-icon{--mdc-icon-size:18px;color:var(--hb-blue);flex:0 0 auto}.charger-select select{width:100%;border:0;background:transparent;font-weight:650;color:#17233B;min-width:0;outline:0}.charger-select.readonly{opacity:.72}.current-edit input{width:54px;min-width:0;border:0;background:transparent;font-weight:650;color:#061226;outline:0;text-align:right}.current-edit span{font-weight:650;color:#63718A}.inline-apply{border:1px solid rgba(14,35,72,.10);background:#fff;border-radius:10px;padding:6px 8px;font-size:11px;font-weight:650;color:#1467F5;cursor:pointer}.inline-apply:disabled{opacity:.38;cursor:not-allowed}.power-read{justify-content:flex-start}.vehicle-actions{border-top:1px solid rgba(14,35,72,.07);display:grid;grid-template-columns:1.05fr 1fr 1fr 1fr;gap:8px;padding:11px 18px}.clean-actions .details-action{margin-left:auto;width:100%}.action{min-height:42px;border:1px solid rgba(14,35,72,.11);border-radius:13px;background:#fff;color:var(--hb-ink);font-weight:650;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;box-shadow:0 10px 24px rgba(15,35,80,.035)}.action ha-icon{--mdc-icon-size:18px;color:var(--hb-blue)}.action.primary-charge{background:linear-gradient(135deg,#1467F5,#3B82F6);border-color:#1467F5;color:#fff}.action.primary-charge ha-icon{color:#fff}.action.sent{background:#EEF5FF;border-color:#CFE0FF;color:#0B4BC1}.action.busy{background:#FFF8E8}.action.failed{background:#FEF3F2;color:#B42318}.action:disabled{opacity:.55;cursor:not-allowed}.action.activate-soft{opacity:1;cursor:pointer}.inactive-list{display:grid;gap:10px}.inactive-row{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:0 12px 36px rgba(15,35,80,.055);padding:10px 12px;display:grid;grid-template-columns:78px 1fr auto;gap:14px;align-items:center}.inactive-image{width:78px;height:52px;border-radius:14px;background:#F4F8FF;display:flex;align-items:center;justify-content:center;overflow:hidden}.inactive-image img{max-width:100%;max-height:64px;object-fit:contain;filter:grayscale(.25) opacity(.82)}.inactive-image ha-icon{--mdc-icon-size:34px;color:#9AABC5}.inactive-copy h3{margin:0 0 2px;font-size:16px;font-weight:650}.inactive-copy p{margin:0;color:#64708A;font-weight:600}.inactive-actions{display:flex;gap:8px}.bottom-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.info{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:var(--hb-shadow);padding:18px;min-height:100px}.info h3{display:flex;align-items:center;gap:10px}.info h3 ha-icon{--mdc-icon-size:22px;color:var(--hb-blue)}.info p,.info li{color:#34405A;font-weight:600}.empty{grid-column:1/-1;border:1px dashed #CBD5E1;border-radius:18px;background:#fff;padding:28px;color:var(--hb-muted);font-weight:600;text-align:center}.domain-tabs-wrap{margin:8px 0 8px!important}.dashboard-status-strip.outcome-header{margin:8px 0 6px!important}.section-title{margin:0 2px -4px!important}.title h1{margin-bottom:3px!important}.title p{margin-bottom:0!important}@media(max-width:1500px){.vehicles{grid-template-columns:1fr}.vehicle-hero-panel{grid-template-columns:1fr 1.25fr}}@media(max-width:900px){.top-grid,.bottom-grid{grid-template-columns:1fr}.hero-split-row,.vehicle-control-row{grid-template-columns:1fr}.vehicle-hero-panel{grid-template-columns:1fr}.vehicle-actions{grid-template-columns:repeat(2,1fr)}.inactive-row{grid-template-columns:70px 1fr}.inactive-actions{grid-column:1/-1}.charge-mini-strip{grid-template-columns:1fr 1fr 1fr}.vehicle-image{min-height:150px}.status-top-row{grid-template-columns:repeat(5,minmax(54px,1fr));overflow:auto;padding-bottom:8px}}@media(max-width:640px){.page{padding:16px}.summary{grid-template-columns:1fr}.vehicle-metrics-strip,.charge-mini-strip,.vehicle-actions{grid-template-columns:1fr}.inactive-actions{flex-direction:column}.hero-split-row,.vehicle-control-row,.status-top-row{padding-left:12px;padding-right:12px}.pill{min-width:58px;font-size:9px}.vehicle-copy h2{font-size:22px}}
    /* 2.3.9 mock-aligned dashboard overrides */
    .hi-contract-warning{border:1px solid rgba(245,158,11,.32);background:#FFFBEB;color:#6B3F00;border-radius:16px;padding:10px 14px;font-size:12px;font-weight:600;display:grid;gap:6px;box-shadow:0 12px 28px rgba(80,55,0,.05)}.hi-contract-warning strong{font-weight:650}.hi-contract-warning-list{display:flex;flex-wrap:wrap;gap:6px}.hi-contract-warning-list span{border:1px solid rgba(245,158,11,.25);background:#fff;border-radius:999px;padding:4px 8px;font-weight:600;color:#7A4B00}
    .release-badge{display:grid;gap:2px;place-items:center;padding:8px 13px;border-radius:16px;font-size:13px}.release-badge b{font-size:16px;color:#1467F5}.release-badge span{font-size:12px;color:#33415C;font-weight:650}.vehicles{grid-template-columns:repeat(2,minmax(560px,1fr));gap:12px}.vehicle-card{border-radius:22px}.status-top-row{padding:12px 14px 8px;gap:8px}.status-row{min-height:36px;border-radius:999px;justify-content:flex-start;padding:0 12px}.status-row span{display:none}.pill{min-width:86px;font-size:11px;padding:7px 12px}.hero-split-row{grid-template-columns:2.35fr 1fr;padding:6px 14px 8px;gap:12px}.vehicle-hero-panel{grid-template-columns:.62fr 1.38fr;min-height:205px;padding:22px;border-radius:18px}.vehicle-copy h2{font-size:27px}.vehicle-image img{max-height:230px;transform:scale(1.15);transform-origin:center;max-width:105%}.charger-hero-panel{min-height:205px;border-radius:18px;padding:16px}.charger-mini-image{height:128px}.charger-mini-image img{max-width:142px;max-height:126px}.vehicle-control-row.mock-row{grid-template-columns:minmax(330px,1.35fr) minmax(250px,.9fr);padding:0 14px 10px;gap:10px}.vehicle-metrics-strip.mock-metrics{grid-template-columns:repeat(3,minmax(100px,1fr));gap:0;border:1px solid var(--hb-line);border-radius:16px;overflow:hidden;background:#fff}.vehicle-metrics-strip.mock-metrics .metric-chip{border:0;border-right:1px solid var(--hb-line);border-radius:0;min-height:62px;padding:10px 14px}.vehicle-metrics-strip.mock-metrics .metric-chip:last-child{border-right:0}.metric-chip span{font-size:11px}.metric-chip b{font-size:21px}.battery-chip{position:relative}.battery-chip i{position:absolute;right:16px;bottom:16px;width:26px;height:8px;border-radius:999px;background:linear-gradient(90deg,#2CBF61 60%,#DCEBE2 60%)}.charge-mini-strip.mock-controls{grid-template-columns:minmax(148px,1fr) minmax(164px,1fr);gap:10px}.mini-control,.mini-current-stepper{min-height:62px;border:1px solid var(--hb-line);border-radius:16px;background:#fff;display:flex;align-items:center;gap:10px;padding:0 12px;min-width:0}.charger-select select{font-size:14px}.mini-current-stepper ha-icon,.mini-control ha-icon{--mdc-icon-size:22px;color:#1467F5}.mini-current-stepper strong{font-size:18px;min-width:48px;text-align:center}.mini-current-stepper small{font-size:11px;color:#63718A;font-weight:600}.round-step{width:34px;height:34px;border-radius:999px;border:1px solid var(--hb-line);background:#F6FAFF;color:#1467F5;font-size:22px;font-weight:650;line-height:1;cursor:pointer}.mini-current-stepper.readonly{opacity:.55;justify-content:center}.mini-current-stepper.readonly .round-step{display:none}.power-read{display:none}.vehicle-actions{grid-template-columns:1.05fr 1fr 1fr .9fr .95fr;padding:10px 14px 14px;gap:10px}.action{min-height:43px;border-radius:14px;font-size:14px}.danger-action{border-color:rgba(230,57,70,.35)!important;color:#D11A2A!important;background:#FFF3F3!important}.danger-action ha-icon{color:#D11A2A!important}.inactive-row{grid-template-columns:auto 1fr auto;border-radius:16px}.inactive-image{display:none}.debt-strip{display:flex;align-items:center;gap:14px;background:#F8FBFF;border:1px solid #DDEAFF;border-radius:18px;padding:12px 18px;color:#45536C;font-size:13px;font-weight:600}.debt-strip ha-icon{color:#1467F5}.debt-strip span:before{content:"•";margin-right:12px;color:#8EA1BE}@media(max-width:1300px){.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:240px}}@media(max-width:760px){.hero-split-row,.vehicle-control-row.mock-row{grid-template-columns:1fr}.vehicle-hero-panel{grid-template-columns:1fr}.vehicle-actions{grid-template-columns:1fr 1fr}.debt-strip{flex-wrap:wrap}.charge-mini-strip.mock-controls{grid-template-columns:1fr}}

    /* 2.3.9 compact mock implementation and technical-debt burn-down */

    .hi-version-block{
      position:absolute!important;
      top:26px!important;
      right:28px!important;
      text-align:right!important;
      font-size:10.5px!important;
      line-height:1.25!important;
      font-weight:400!important;
      color:var(--secondary-text-color,#6B7280)!important;
      opacity:.82!important;
      background:none!important;
      border:0!important;
      box-shadow:none!important;
      padding:0!important;
      margin:0!important;
      z-index:2!important;
      pointer-events:none!important;
    }
    .release-badge{display:none!important;}.hi-version-block{display:none!important;}

    .page{width:min(100%,1640px);padding:24px 28px 38px;gap:16px}.title{margin-bottom:0}.title h1{font-size:38px}.top-grid{gap:16px}.summary{min-height:116px;padding:20px 24px;align-items:center}.summary h3{margin:0 0 8px}.summary-icon{width:58px;height:58px}.section-title{margin-top:0}.vehicles{gap:16px}.vehicle-card{border-radius:20px;overflow:hidden}.status-top-row{padding:10px 12px 6px;gap:7px;grid-template-columns:repeat(5,minmax(0,1fr))}.status-row{min-height:34px;padding:0 10px}.status-row ha-icon{--mdc-icon-size:18px}.pill{min-width:0;width:100%;font-size:10.5px;padding:7px 9px}.hero-split-row{grid-template-columns:minmax(0,2.45fr) minmax(180px,.85fr);padding:6px 12px 6px;gap:10px}.vehicle-hero-panel{min-height:215px;padding:20px;border-radius:16px;grid-template-columns:.54fr 1.46fr}.vehicle-copy h2{font-size:28px;line-height:1.02}.vehicle-copy p{font-size:14px}.vehicle-image{min-height:170px}.vehicle-image img{max-height:270px;transform:scale(1.28);max-width:118%}.charger-hero-panel{min-height:215px;padding:14px;border-radius:16px}.charger-mini-image{height:135px}.charger-mini-image img{max-width:154px;max-height:132px}.vehicle-control-row.mock-row{grid-template-columns:minmax(240px,.92fr) minmax(330px,1.08fr);padding:0 12px 8px;gap:8px;align-items:stretch}.vehicle-metrics-strip.mock-metrics{grid-template-columns:repeat(3,minmax(70px,1fr));height:56px}.vehicle-metrics-strip.mock-metrics .metric-chip{min-height:54px;padding:7px 10px}.metric-chip span{font-size:9.5px}.metric-chip b{font-size:18px}.battery-chip i{right:10px;bottom:12px;width:22px;height:7px}.charge-mini-strip.mock-controls{grid-template-columns:minmax(160px,1.15fr) minmax(190px,1fr);gap:8px;height:56px}.mini-control,.mini-current-stepper{min-height:54px;height:56px;border-radius:14px;padding:0 10px}.charger-select select{font-size:13.5px}.mini-current-stepper strong{font-size:16px}.mini-current-stepper small{font-size:10px}.round-step{width:30px;height:30px;font-size:20px}.vehicle-actions{grid-template-columns:1.05fr 1fr .85fr .82fr .9fr;padding:9px 12px 12px;gap:8px}.action{min-height:40px;border-radius:13px;font-size:13.5px}.inactive-row{min-height:62px;padding:10px 16px;grid-template-columns:82px 1fr auto}.inactive-state{background:#EEF2F7;color:#53627A;border-radius:999px;font-weight:650;font-size:12px;padding:7px 10px;text-align:center}.compact-present-row .action{min-width:118px}.debt-strip{font-size:12px;padding:10px 14px}.bottom-grid{display:none}.domain-tabs-wrap{margin:8px 0 8px!important}.dashboard-status-strip.outcome-header{margin:8px 0 6px!important}.section-title{margin:0 2px -4px!important}.title h1{margin-bottom:3px!important}.title p{margin-bottom:0!important}@media(max-width:1500px){.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:290px}.hero-split-row{grid-template-columns:minmax(0,2.3fr) minmax(190px,.9fr)}}@media(max-width:760px){.vehicle-control-row.mock-row{grid-template-columns:1fr}.charge-mini-strip.mock-controls{grid-template-columns:1fr 1fr}.vehicle-actions{grid-template-columns:1fr 1fr}.vehicle-image img{transform:scale(1.12)}}


    /* 2.3.9 contract-catalog aligned compact dashboard */
    .page{width:min(100%,1560px);padding:18px 26px 30px;gap:14px}.top-grid{gap:14px}.summary{min-height:104px;padding:18px 22px;display:grid;grid-template-columns:64px 1fr;align-items:center}.summary h3{margin:0 0 6px}.summary ul{margin:0;padding:0;list-style:none}.summary li{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:baseline}.summary li span{font-size:13px}.summary-icon{width:54px;height:54px}.vehicles{gap:14px}.vehicle-card{border-radius:20px}.status-top-row{padding:10px 12px 6px;gap:7px}.status-row{min-height:32px;padding:0 9px}.pill{font-size:10.5px;padding:6px 9px}.hero-split-row{grid-template-columns:minmax(0,2.7fr) minmax(160px,.85fr);gap:10px;padding:5px 12px 8px}.vehicle-hero-panel{min-height:188px;padding:18px;grid-template-columns:.50fr 1.50fr}.vehicle-copy h2{font-size:27px}.vehicle-image img{max-height:258px;transform:scale(1.24);max-width:116%}.charger-hero-panel{min-height:188px;padding:13px}.charger-mini-image{height:112px}.charger-mini-image img{max-width:138px;max-height:110px}.vehicle-control-row.mock-row{grid-template-columns:minmax(250px,.86fr) minmax(360px,1.14fr);padding:0 12px 8px;gap:8px;align-items:stretch}.vehicle-metrics-strip.mock-metrics{grid-template-columns:.9fr .8fr .75fr;height:48px}.vehicle-metrics-strip.mock-metrics .metric-chip{min-height:48px;padding:6px 10px}.metric-chip span{font-size:9px}.metric-chip b{font-size:17px}.charge-mini-strip.mock-controls{grid-template-columns:minmax(170px,1.25fr) minmax(150px,.95fr) minmax(86px,.65fr);gap:8px;height:48px}.charge-mini-strip.mock-controls.no-speed{grid-template-columns:minmax(190px,1fr) minmax(86px,.46fr)}.mini-control,.mini-current-stepper,.mini-power-read{min-height:48px;height:48px;border:1px solid var(--hb-line);border-radius:13px;background:#fff;display:flex;align-items:center;gap:8px;padding:0 10px;min-width:0}.mini-power-read ha-icon,.mini-current-stepper ha-icon,.mini-control ha-icon{--mdc-icon-size:20px;color:#1467F5}.mini-power-read strong,.mini-current-stepper strong{font-size:15px;font-weight:650;white-space:nowrap}.charger-select select{font-size:13px;max-width:100%}.round-step{width:28px;height:28px;font-size:19px}.mini-current-stepper small{display:none}.vehicle-actions{grid-template-columns:1.05fr 1fr .95fr .85fr .95fr;padding:8px 12px 12px;gap:8px}.action{min-height:38px;border-radius:13px;font-size:13px}.section-title{margin-top:0}.inactive-row{min-height:56px;padding:8px 14px}.debt-strip{margin-top:0;font-size:12px;padding:9px 14px}@media(max-width:1380px){.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:270px}.hero-split-row{grid-template-columns:minmax(0,2.45fr) minmax(170px,.9fr)}}@media(max-width:820px){.vehicle-control-row.mock-row,.hero-split-row{grid-template-columns:1fr}.charge-mini-strip.mock-controls,.charge-mini-strip.mock-controls.no-speed{grid-template-columns:1fr}.vehicle-actions{grid-template-columns:1fr 1fr}.vehicle-image img{transform:scale(1.10)}}


    /* 2.4.0 dashboard stabilization: compact cockpit, restored footer and icon navigation */
    .page{width:min(100%,1560px);padding:16px 24px 30px;gap:10px}.top-grid{gap:14px}.summary{min-height:96px;padding:16px 20px;align-items:center}.summary h3{margin:0 0 6px}.summary li{padding:5px 0}.vehicles{gap:14px}.vehicle-card{border-radius:20px}.hero-split-row{grid-template-columns:minmax(0,2.55fr) minmax(155px,.75fr);gap:9px;padding:5px 12px 8px}.vehicle-hero-panel{min-height:190px;padding:17px;grid-template-columns:.47fr 1.53fr}.vehicle-copy h2{font-size:27px}.vehicle-copy p{font-size:13px}.vehicle-image img{max-height:278px;transform:scale(1.33);max-width:122%}.charger-hero-panel{min-height:190px;padding:12px}.charger-mini-image{height:112px}.charger-mini-image img{max-width:142px;max-height:112px}.vehicle-control-row.mock-row{grid-template-columns:minmax(210px,.70fr) minmax(430px,1.30fr);padding:0 12px 8px;gap:8px}.vehicle-metrics-strip.mock-metrics{grid-template-columns:.85fr .75fr .70fr;height:44px}.vehicle-metrics-strip.mock-metrics .metric-chip{min-height:44px;padding:5px 9px}.metric-chip span{font-size:8.5px}.metric-chip b{font-size:16px}.battery-chip i{right:9px;bottom:10px;width:20px;height:7px}.charge-mini-strip.mock-controls{grid-template-columns:minmax(150px,1.25fr) minmax(118px,.82fr) minmax(126px,.95fr) minmax(78px,.48fr);height:44px;gap:7px}.charge-mini-strip.no-mode{grid-template-columns:minmax(170px,1.35fr) minmax(126px,.95fr) minmax(78px,.48fr)}.charge-mini-strip.no-speed{grid-template-columns:minmax(180px,1fr) minmax(118px,.75fr) minmax(78px,.40fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(190px,1fr) minmax(78px,.35fr)}.mini-control,.mini-current-stepper,.mini-power-read{height:44px;min-height:44px;border-radius:13px;padding:0 9px}.charger-select select,.mode-select select{font-size:12.5px}.mini-current-stepper strong,.mini-power-read strong{font-size:14px}.round-step{width:27px;height:27px;font-size:18px}.vehicle-actions{grid-template-columns:minmax(138px,1.05fr) minmax(130px,1fr) minmax(110px,.85fr) 1fr minmax(54px,.32fr) 42px;padding:8px 12px 12px;gap:8px}.action{min-height:38px;border-radius:13px;font-size:13px}.action-spacer{display:block}.icon-only{width:42px;min-width:42px;max-width:42px;padding:0!important}.icon-only span{display:none!important}.icon-only ha-icon{margin:0!important}.presence-toggle{background:#fff!important;color:#1467F5!important;border-color:var(--hb-line)!important}.presence-toggle ha-icon{color:#1467F5!important}.details-action{background:#fff!important;color:#1467F5!important}.details-action ha-icon{color:#1467F5!important}.inactive-actions .icon-only{width:42px}.bottom-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.info{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:0 14px 34px rgba(15,35,80,.055);padding:14px 16px;min-height:82px}.info h3{display:flex;align-items:center;gap:8px;font-size:15px;margin:0 0 8px}.info h3 ha-icon{color:#1467F5}.info p,.info li{font-size:12px;font-weight:600;color:#34405A}.debt-strip{display:none!important}@media(max-width:1380px){.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:285px}.hero-split-row{grid-template-columns:minmax(0,2.45fr) minmax(170px,.9fr)}}@media(max-width:860px){.top-grid,.vehicles,.hero-split-row,.vehicle-control-row.mock-row,.bottom-grid{grid-template-columns:1fr}.charge-mini-strip.mock-controls,.charge-mini-strip.no-mode,.charge-mini-strip.no-speed,.charge-mini-strip.no-speed.no-mode{grid-template-columns:1fr 1fr}.vehicle-actions{grid-template-columns:1fr 1fr 1fr minmax(54px,.35fr) 42px}.action-spacer{display:none}.vehicle-image img{transform:scale(1.12)}}


    /* 2.4.0 dashboard stabilization: density, alignment and unified controls */
    .page{width:calc(100% - 96px);max-width:1720px;margin:0 auto 0 48px;padding:18px 22px 30px;gap:12px;}
    .release-badge{top:6px;right:24px;min-width:58px;text-align:center;}
    .title h1{font-size:38px;margin-bottom:6px}.title p{font-size:14px}
    .top-grid{gap:12px;align-items:stretch}.summary{min-height:86px;padding:14px 18px;grid-template-columns:52px 1fr;gap:14px;align-items:center}.summary-icon{width:50px;height:50px;border-radius:16px}.summary h3{margin:0 0 5px;font-size:15px}.summary li{padding:4px 0;font-size:12px;display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:baseline}
    .section-title{margin:0 2px -7px}.section-title h2{font-size:19px}.vehicles{gap:12px}.vehicle-card{border-radius:21px}.status-top-row{padding:8px 10px 5px;gap:6px}.status-row{min-height:30px;border-radius:12px;padding:0 7px}.status-row ha-icon{--mdc-icon-size:16px}.pill{font-size:9.8px;padding:5px 8px;min-width:0;width:100%;}
    .hero-split-row{grid-template-columns:minmax(0,2.72fr) minmax(148px,.72fr);gap:8px;padding:4px 10px 6px;align-items:stretch}.vehicle-hero-panel{min-height:178px;padding:14px;border-radius:16px;grid-template-columns:.36fr 1.64fr;gap:8px}.vehicle-copy h2{font-size:25px;line-height:1.02;margin-bottom:4px}.vehicle-copy p{font-size:12px}.vehicle-image{justify-content:flex-start;align-items:center;overflow:visible;min-height:150px}.vehicle-image img{max-height:294px;max-width:126%;transform:translateX(-10px) scale(1.24);object-fit:contain}.charger-hero-panel{min-height:178px;border-radius:16px;padding:11px}.charger-mini-image{height:105px;border-radius:14px}.charger-mini-image img{max-width:132px;max-height:104px}.charger-mini-copy b{font-size:14px}.charger-mini-copy span{font-size:11px}
    .vehicle-control-row.mock-row{grid-template-columns:minmax(185px,.55fr) minmax(470px,1.45fr);gap:6px;padding:0 10px 7px;align-items:stretch}.vehicle-metrics-strip.mock-metrics{height:40px;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.vehicle-metrics-strip.mock-metrics .metric-chip{min-height:40px;height:40px;padding:4px 8px;border-radius:12px}.metric-chip span{font-size:7.8px;letter-spacing:.01em}.metric-chip b{font-size:14px;line-height:1.1}.battery-chip i{width:18px;height:6px;right:7px;bottom:8px}.charge-mini-strip.mock-controls{height:40px;gap:6px;grid-template-columns:minmax(155px,1.16fr) minmax(112px,.84fr) minmax(112px,.78fr) minmax(70px,.42fr)}.charge-mini-strip.no-mode{grid-template-columns:minmax(175px,1.35fr) minmax(112px,.78fr) minmax(70px,.42fr)}.charge-mini-strip.no-speed{grid-template-columns:minmax(185px,1.28fr) minmax(112px,.82fr) minmax(70px,.42fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(200px,1fr) minmax(70px,.35fr)}.mini-control,.mini-current-stepper,.mini-power-read{height:40px;min-height:40px;border-radius:12px;padding:0 8px;gap:6px}.mini-control ha-icon,.mini-current-stepper ha-icon,.mini-power-read ha-icon{--mdc-icon-size:17px}.charger-select select,.mode-select select{font-size:12px}.mini-current-stepper strong,.mini-power-read strong{font-size:13px}.round-step{width:25px;height:25px;font-size:17px}.mini-current-stepper small{display:none!important}
    .vehicle-actions{grid-template-columns:minmax(125px,1fr) minmax(122px,.96fr) minmax(105px,.84fr) 1fr 38px 38px;padding:7px 10px 10px;gap:7px}.action{min-height:36px;border-radius:12px;font-size:12.5px}.action ha-icon{--mdc-icon-size:17px}.icon-only{width:38px!important;min-width:38px!important;max-width:38px!important}.inactive-row{min-height:54px;padding:8px 12px;grid-template-columns:74px 1fr auto}.inactive-actions{gap:7px}.inactive-actions .icon-only{width:38px!important}.bottom-grid{gap:12px}.info{min-height:68px;padding:11px 13px;border-radius:16px}.info h3{font-size:14px;margin-bottom:6px}.info p,.info li{font-size:11.5px}.debt-strip{display:none!important}
    @media(max-width:1580px){.page{width:calc(100% - 56px);margin-left:28px}.vehicles{gap:12px}.vehicle-hero-panel{grid-template-columns:.32fr 1.68fr}.vehicle-image img{max-height:284px;transform:translateX(-14px) scale(1.22)}}
    @media(max-width:1380px){.page{width:min(100%,1280px);margin:0 auto}.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:284px;transform:translateX(-8px) scale(1.18)}}
    @media(max-width:860px){.page{width:100%;margin:0;padding:14px}.top-grid,.vehicles,.hero-split-row,.vehicle-control-row.mock-row,.bottom-grid{grid-template-columns:1fr}.charge-mini-strip.mock-controls,.charge-mini-strip.no-mode,.charge-mini-strip.no-speed,.charge-mini-strip.no-speed.no-mode{grid-template-columns:1fr 1fr}.vehicle-actions{grid-template-columns:1fr 1fr 1fr 38px 38px}.action-spacer{display:none}.vehicle-image img{transform:scale(1.08);max-width:100%}}

    /* 2.4.0 Consistency pass — single dashboard visual system.
       Keep this override near the end so the refactor remains safe while we
       converge duplicate legacy rules into reusable components in 2.4.x. */
    :host{--hb-font:inherit;--hb-font-size:13px;--hb-radius-pill:13px;--hb-control-h:38px;--hb-control-pad:0 9px}
    *{font-family:var(--hb-font);box-sizing:border-box}
    .page{width:calc(100vw - 72px);max-width:1640px;margin-left:28px;margin-right:auto;padding:18px 18px 30px;gap:12px}
    .title h1{font-size:36px;line-height:.98;letter-spacing:-.055em}.title p{font-size:13px;font-weight:600}.eyebrow{font-size:11px;letter-spacing:.10em}
    .release-badge{right:22px;top:14px;font-size:12px;padding:8px 12px;border-radius:17px}
    .top-grid{gap:12px}.summary{min-height:84px;padding:13px 18px;grid-template-columns:50px 1fr;gap:14px;border-radius:20px}.summary-icon{width:48px;height:48px;border-radius:15px}.summary h3{font-size:15px;line-height:1.1;margin:0 0 6px}.summary li,.summary li span{font-size:12px;line-height:1.25;font-weight:600}
    .section-title{margin:0 2px -5px}.section-title h2{font-size:18px;line-height:1}.section-title .count{font-size:11px;padding:6px 10px}
    .vehicles{grid-template-columns:repeat(2,minmax(610px,1fr));gap:12px}.vehicle-card{border-radius:20px;overflow:hidden}.status-top-row{padding:8px 10px 5px;gap:6px}.status-row{height:30px;min-height:30px;border-radius:999px;padding:0 8px;display:grid;grid-template-columns:18px 1fr;align-items:center}.status-row ha-icon{--mdc-icon-size:16px}.pill{height:22px;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:650;padding:0 8px;border-radius:999px;line-height:1;white-space:nowrap}
    .hero-split-row{grid-template-columns:minmax(0,2.65fr) minmax(146px,.78fr);gap:8px;padding:4px 10px 6px}.vehicle-hero-panel,.charger-hero-panel{border-radius:16px;border:1px solid var(--hb-line);background:linear-gradient(135deg,#fff,#F8FBFF)}.vehicle-hero-panel{min-height:178px;padding:13px 14px;grid-template-columns:.36fr 1.64fr;gap:6px}.vehicle-copy h2{font-size:25px;line-height:.96;letter-spacing:-.055em;margin:0 0 7px}.vehicle-copy p{font-size:12px;line-height:1.15;font-weight:600}.vehicle-image{justify-content:flex-start;overflow:visible}.vehicle-image img{max-height:286px;max-width:124%;transform:translateX(-18px) scale(1.19);object-fit:contain}.charger-hero-panel{min-height:178px;padding:11px;display:grid;align-content:space-between}.charger-mini-image{height:106px;border-radius:14px}.charger-mini-image img{max-width:132px;max-height:104px}.charger-mini-copy b{font-size:14px;line-height:1.05}.charger-mini-copy span{font-size:11px;font-weight:600}
    .vehicle-control-row.mock-row{grid-template-columns:minmax(178px,.50fr) minmax(500px,1.50fr);gap:6px;padding:0 10px 7px}.vehicle-metrics-strip.mock-metrics{height:38px;grid-template-columns:.95fr .8fr .72fr;gap:0;border:1px solid var(--hb-line);border-radius:12px;overflow:hidden;background:#fff}.vehicle-metrics-strip.mock-metrics .metric-chip{height:38px;min-height:38px;border:0;border-right:1px solid var(--hb-line);border-radius:0;padding:4px 8px;background:#fff}.vehicle-metrics-strip.mock-metrics .metric-chip:last-child{border-right:0}.metric-chip span{font-size:7.5px;line-height:1;text-transform:uppercase;letter-spacing:.045em;color:#64708A;font-weight:650}.metric-chip b{font-size:14px;line-height:1.05;font-weight:650}.battery-chip i{display:none!important}
    .charge-mini-strip.mock-controls{height:38px;gap:6px;grid-template-columns:minmax(190px,1.35fr) minmax(120px,.86fr) minmax(126px,.88fr) minmax(74px,.45fr);align-items:stretch}.charge-mini-strip.no-mode{grid-template-columns:minmax(218px,1.55fr) minmax(126px,.88fr) minmax(74px,.45fr)}.charge-mini-strip.no-speed{grid-template-columns:minmax(245px,1.65fr) minmax(128px,.85fr) minmax(74px,.45fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(270px,1fr) minmax(74px,.32fr)}.mini-control,.mini-current-stepper,.mini-power-read{height:38px;min-height:38px;border-radius:12px;padding:var(--hb-control-pad);gap:6px;background:#fff;border:1px solid var(--hb-line);overflow:hidden}.mini-control ha-icon,.mini-current-stepper ha-icon,.mini-power-read ha-icon{--mdc-icon-size:17px;flex:0 0 auto;color:#1467F5}.charger-select select,.mode-select select{appearance:none;-webkit-appearance:none;border:0;background:transparent;outline:0;width:100%;min-width:0;font-family:var(--hb-font)!important;font-size:12px!important;font-weight:650!important;color:#12213A;line-height:1.1;padding:0 16px 0 0}.charger-select,.mode-select{position:relative}.charger-select:after,.mode-select:after{content:"⌄";position:absolute;right:8px;top:50%;transform:translateY(-52%);font-size:12px;color:#64708A;pointer-events:none}.charger-select option,.mode-select option{font-family:var(--hb-font)!important;font-size:13px!important;color:#12213A}.mini-current-stepper{display:grid;grid-template-columns:minmax(54px,1fr) 24px 24px;justify-items:center;align-items:center}.mini-current-stepper .current-copy{justify-self:start;display:grid;gap:0;line-height:1.0}.mini-current-stepper strong{font-size:13px;white-space:nowrap}.round-step{width:24px;height:24px;border-radius:999px;font-size:17px}.mini-current-stepper.readonly{grid-template-columns:minmax(54px,1fr)}.mini-power-read strong{font-size:13px;white-space:nowrap}
    .vehicle-actions{grid-template-columns:minmax(122px,1fr) minmax(120px,.96fr) minmax(100px,.82fr) 1fr 38px 38px;padding:7px 10px 10px;gap:7px}.action{height:36px;min-height:36px;border-radius:12px;font-size:12.5px;font-weight:650}.action ha-icon{--mdc-icon-size:17px}.icon-only{width:38px!important;min-width:38px!important;max-width:38px!important}.inactive-row{border-radius:18px;min-height:54px;padding:8px 12px;grid-template-columns:74px 1fr auto}.inactive-actions{gap:7px}.inactive-actions .icon-only{width:38px!important}.bottom-grid{gap:12px}.info{min-height:66px;padding:11px 13px;border-radius:16px}.info h3{font-size:14px;line-height:1.1;margin-bottom:5px}.info p,.info li{font-size:11.5px;line-height:1.25}.debt-strip{display:none!important}
    @media(max-width:1500px){.page{width:calc(100vw - 56px);margin-left:20px}.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:286px;transform:translateX(-12px) scale(1.13)}}


    /* 2.4.0 Beta Consolidation — Product-wide visual system
       This block intentionally normalizes dashboard, cards, controls and footer
       using reusable visual primitives. No backend contract changes. */
    :host{
      --hb-font:inherit;
      --hb-ink:#06142D; --hb-muted:#66728B; --hb-blue:#1467F5;
      --hb-line:#E4EBF6; --hb-soft-blue:#EEF5FF;
      --hb-card-radius:22px; --hb-pill-radius:14px;
      --hb-control-h:36px; --hb-action-h:38px;
    }
    *{font-family:var(--hb-font)!important;box-sizing:border-box;user-select:text;-webkit-user-select:text}
    ha-card{background:transparent;border:0;box-shadow:none}
    .page{width:calc(100vw - 50px);max-width:1680px;margin:0 0 0 24px;padding:16px 18px 28px;gap:12px}
    .title{display:grid;gap:4px}.title h1{font-size:35px;line-height:.98;margin:0;letter-spacing:-.055em;font-weight:650}.title p{font-size:13px;line-height:1.35;font-weight:600;color:#1D2B45}.eyebrow{font-size:10.5px;line-height:1;letter-spacing:.11em;margin:0 0 3px;color:var(--hb-blue);font-weight:650}.release-badge{top:12px;right:22px;border-radius:17px;padding:8px 12px;background:rgba(255,255,255,.94)}.release-badge b{font-size:13px;color:#1467F5}.release-badge span{font-size:10.5px;color:#33415C}
    .top-grid{gap:12px;align-items:stretch}.summary{min-height:80px;border-radius:20px;padding:13px 18px;grid-template-columns:50px 1fr;gap:14px}.summary-icon{width:48px;height:48px;border-radius:15px}.summary h3{font-size:15px;line-height:1.05;margin:0 0 7px;font-weight:650}.summary ul{margin:0;padding:0;display:grid;gap:4px}.summary li{grid-template-columns:max-content 1fr;gap:12px;align-items:center}.summary li b,.summary li span{font-size:12px;line-height:1.25;font-weight:600}.summary.recommendation,.summary.attention{display:grid;align-content:center}.summary.recommendation h3,.summary.attention h3{transform:none}
    .section-title{margin:1px 2px -5px;align-items:center}.section-title h2{font-size:18px;line-height:1;margin:0;font-weight:650}.section-title span{font-size:11px;font-weight:650;padding:6px 10px;border-radius:999px;background:#F6F9FD;border:1px solid var(--hb-line);color:#64708A}
    .vehicles{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.vehicle-card{border-radius:20px;overflow:hidden;border:1px solid var(--hb-line);box-shadow:0 18px 44px rgba(15,35,80,.065)}
    .status-top-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:8px 10px 5px}.status-row{height:30px;min-height:30px;border-radius:999px;padding:0 8px;display:grid;grid-template-columns:18px minmax(0,1fr);gap:5px;align-items:center;border:1px solid var(--hb-line);background:#fff;min-width:0}.status-row ha-icon{--mdc-icon-size:15.5px}.status-row span{display:none}.status-row .pill{height:22px;padding:0 8px;border-radius:999px;font-size:9.5px;line-height:1;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .hero-split-row{grid-template-columns:minmax(0,2.62fr) minmax(142px,.78fr);gap:8px;padding:4px 10px 6px}.vehicle-hero-panel,.charger-hero-panel{border-radius:16px;border:1px solid var(--hb-line);background:linear-gradient(135deg,#fff 0%,#F9FCFF 58%,#F1F6FF 100%)}.vehicle-hero-panel{min-height:174px;padding:13px 14px;grid-template-columns:.35fr 1.65fr;gap:6px}.vehicle-copy h2{font-size:25px;line-height:.95;letter-spacing:-.055em;margin:0 0 7px;font-weight:650}.vehicle-copy p{font-size:11.5px;line-height:1.15;font-weight:600;color:#1D2B45}.vehicle-image{justify-content:flex-start;overflow:hidden}.vehicle-image img{max-height:278px;max-width:125%;object-fit:contain;transform:translateX(-16px) scale(1.17);filter:drop-shadow(0 20px 28px rgba(15,35,80,.16))}.charger-hero-panel{min-height:174px;padding:11px;display:grid;align-content:space-between}.charger-mini-image{height:102px;border-radius:14px;background:rgba(255,255,255,.75)}.charger-mini-image img{max-width:126px;max-height:100px;object-fit:contain}.charger-mini-copy b{font-size:14px;line-height:1.05;font-weight:650}.charger-mini-copy span{font-size:11px;font-weight:600;color:#66728B}
    .vehicle-control-row.mock-row{grid-template-columns:minmax(150px,.42fr) minmax(560px,1.58fr);gap:6px;padding:0 10px 7px;align-items:stretch}.vehicle-metrics-strip.mock-metrics{height:36px;grid-template-columns:.9fr .78fr .72fr;border:1px solid var(--hb-line);border-radius:12px;overflow:hidden;background:#fff;min-width:0}.vehicle-metrics-strip.mock-metrics .metric-chip{height:36px;min-height:36px;border:0;border-right:1px solid var(--hb-line);border-radius:0;padding:4px 8px;background:#fff;min-width:0}.vehicle-metrics-strip.mock-metrics .metric-chip:last-child{border-right:0}.metric-chip span{font-size:7.3px;line-height:1;text-transform:uppercase;letter-spacing:.045em;color:#64708A;font-weight:650}.metric-chip b{font-size:13.5px;line-height:1.05;font-weight:650;white-space:nowrap}.battery-chip i{display:none!important}
    .charge-mini-strip.mock-controls{height:36px;gap:6px;grid-template-columns:minmax(210px,1.35fr) minmax(126px,.78fr) minmax(116px,.72fr) minmax(80px,.42fr);align-items:stretch;min-width:0}.charge-mini-strip.no-mode{grid-template-columns:minmax(250px,1.5fr) minmax(116px,.72fr) minmax(80px,.42fr)}.charge-mini-strip.no-speed{grid-template-columns:minmax(290px,1.7fr) minmax(126px,.78fr) minmax(80px,.42fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(310px,1fr) minmax(80px,.32fr)}.mini-control,.mini-current-stepper,.mini-power-read{height:36px;min-height:36px;border-radius:12px;padding:0 9px;gap:6px;background:#fff;border:1px solid var(--hb-line);overflow:hidden;min-width:0;box-shadow:none}.mini-control ha-icon,.mini-current-stepper ha-icon,.mini-power-read ha-icon{--mdc-icon-size:16px;flex:0 0 auto;color:#1467F5}.charger-select select,.mode-select select{appearance:none;-webkit-appearance:none;border:0;background:transparent;outline:0;width:100%;min-width:0;font-family:var(--hb-font)!important;font-size:12px!important;font-weight:650!important;color:#12213A;line-height:1.1;padding:0 16px 0 0}.charger-select,.mode-select{position:relative}.charger-select:after,.mode-select:after{content:"⌄";position:absolute;right:8px;top:50%;transform:translateY(-52%);font-size:12px;color:#64708A;pointer-events:none}.charger-select option,.mode-select option{font-family:var(--hb-font)!important;font-size:13px!important;font-weight:600!important;color:#12213A;background:#fff}.mini-current-stepper{display:grid;grid-template-columns:22px 16px minmax(34px,1fr) 22px;justify-items:center}.mini-current-stepper strong{font-size:13px;white-space:nowrap}.round-step{width:22px;height:22px;border-radius:999px;font-size:16px;border:1px solid var(--hb-line);background:#F7FAFF;color:#1467F5}.mini-power-read strong{font-size:13px;white-space:nowrap}.mini-power-read{justify-content:center}
    .vehicle-actions{grid-template-columns:minmax(132px,1.05fr) minmax(126px,.95fr) minmax(104px,.82fr) 1fr 36px 36px;padding:7px 10px 10px;gap:7px;align-items:stretch}.action{height:36px;min-height:36px;border-radius:12px;font-size:12.3px;font-weight:650;padding:0 10px;border:1px solid var(--hb-line);box-shadow:none}.action ha-icon{--mdc-icon-size:16.5px}.action.primary{background:#1467F5;border-color:#1467F5;color:white}.icon-only{width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important}.icon-only span{display:none!important}.action-spacer{display:block}.presence-toggle{background:#fff;color:#1467F5}.details-action{background:#fff;color:#1467F5}
    .inactive-row{border-radius:18px;min-height:52px;padding:8px 12px;grid-template-columns:74px 1fr auto;border:1px solid var(--hb-line);box-shadow:0 14px 32px rgba(15,35,80,.05)}.inactive-row .inactive-actions{gap:7px}.inactive-row .inactive-actions .action{width:36px!important;min-width:36px!important}.inactive-row .inactive-actions .action span{display:none!important}.inactive-row h3{font-size:14px;margin:0 0 3px}.inactive-row p{font-size:12px;margin:0;color:#66728B;font-weight:600}
    .bottom-grid{gap:12px;grid-template-columns:repeat(3,minmax(0,1fr))}.info{min-height:62px;padding:10px 13px;border-radius:16px}.info h3{font-size:13.5px;line-height:1.1;margin:0 0 5px;font-weight:650}.info h3 ha-icon{--mdc-icon-size:17px}.info p,.info li{font-size:11px;line-height:1.25;font-weight:600;color:#1D2B45}.debt-strip{display:none!important}
    @media(max-width:1520px){.page{width:calc(100vw - 42px);margin-left:18px}.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:282px;transform:translateX(-8px) scale(1.12)}}

    /* R22.10.3 cross-screen consistency overrides */
    .vehicle-actions.clean-actions{display:flex!important;align-items:center!important;gap:7px!important;flex-wrap:nowrap!important;padding:7px 10px 10px!important}
    .vehicle-actions.clean-actions .action:not(.icon-only){flex:0 1 150px!important;min-width:92px!important;max-width:170px!important}
    .vehicle-actions.clean-actions .action-spacer{display:block!important;flex:1 1 auto!important;min-width:8px!important}
    .vehicle-actions.clean-actions .icon-only{flex:0 0 36px!important;width:36px!important;min-width:36px!important;max-width:36px!important}
    .charge-mini-strip.mock-controls{align-items:center!important}
    .mini-current-stepper.compact-current{justify-content:flex-end!important;min-width:128px!important}
    .hero-split-row{margin-bottom:0!important}
    .quick-actions,.quick-action-row{margin-top:-18px!important}

    /* R22.10.3 cross-screen state isolation and stable compact actions */
    .vehicle-actions.clean-actions{display:grid!important;grid-template-columns:minmax(138px,1.1fr) minmax(120px,.95fr) minmax(104px,.85fr) minmax(92px,.75fr) minmax(0,1fr) 38px 38px!important;align-items:center!important;gap:7px!important;flex-wrap:nowrap!important;overflow:hidden!important;}
    .vehicle-actions.clean-actions .action:not(.icon-only){min-width:0!important;max-width:none!important;width:100%!important;overflow:hidden!important;}
    .vehicle-actions.clean-actions .action:not(.icon-only) span{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;}
    .vehicle-actions.clean-actions .action-spacer{display:block!important;min-width:0!important;visibility:hidden!important;}
    .vehicle-actions.clean-actions .presence-toggle.icon-only,.vehicle-actions.clean-actions .details-action.icon-only{justify-self:end!important;grid-row:1!important;width:38px!important;min-width:38px!important;max-width:38px!important;height:38px!important;}
    .vehicle-actions.clean-actions .details-action.icon-only{grid-column:7!important;}
    .vehicle-actions.clean-actions .presence-toggle.icon-only{grid-column:6!important;}
    .charger-mini-image img{object-fit:contain!important;}
    .hero-split-row,.vehicle-control-row.mock-row,.vehicle-actions.clean-actions{min-width:0!important;}
    @media(max-width:900px){.vehicle-actions.clean-actions{grid-template-columns:repeat(2,minmax(0,1fr)) 38px 38px!important;overflow:visible!important}.vehicle-actions.clean-actions .action:not(.icon-only){display:inline-flex!important}.vehicle-actions.clean-actions .presence-toggle.icon-only{grid-column:3!important}.vehicle-actions.clean-actions .details-action.icon-only{grid-column:4!important}}
    .asset-detail .hero,.asset-hero{margin-bottom:8px!important}

    @media(max-width:850px){.page{width:100%;margin:0;padding:12px}.top-grid,.vehicles,.bottom-grid{grid-template-columns:1fr}.hero-split-row{grid-template-columns:1fr}.vehicle-control-row.mock-row{grid-template-columns:1fr}.charge-mini-strip.mock-controls,.charge-mini-strip.no-mode,.charge-mini-strip.no-speed,.charge-mini-strip.no-speed.no-mode{grid-template-columns:1fr 1fr}.status-top-row{grid-template-columns:1fr 1fr}.vehicle-actions{grid-template-columns:1fr 1fr 1fr 36px 36px}.action-spacer{display:none}}


    /* R22.0 Design System Foundation — final cross-screen beta consistency pass.
       Purpose: remove clipping, unify typography, and make dashboard controls behave
       as one component family. This is CSS-only and contract-safe. */
    :host{
      --hi-font:inherit;
      --hi-ink:#06142D; --hi-muted:#66728B; --hi-blue:#1467F5;
      --hi-line:#E4EBF6; --hi-panel:#FFFFFF; --hi-soft:#F7FAFF;
      --hi-radius:18px; --hi-radius-lg:24px;
      --hi-control-h:38px; --hi-gap:8px;
    }
    .page{width:calc(100vw - 56px);max-width:1660px;margin:0 0 0 24px;padding:18px 16px 30px;gap:12px;}
    .release-badge{top:12px;right:18px;border-radius:18px;padding:8px 12px;box-shadow:0 10px 24px rgba(15,35,80,.075)}
    .title{margin:0 0 2px}.title h1{font-size:34px;line-height:1;letter-spacing:-.055em}.title p{font-size:13px;line-height:1.35;color:#1d2b45}.eyebrow{font-size:11px;margin-bottom:7px}
    .top-grid{gap:12px}.summary{min-height:80px;padding:12px 18px;border-radius:20px;align-items:center}.summary h3{font-size:15px;line-height:1.1}.summary li,.summary li span{font-size:12px;line-height:1.25}.summary-icon{width:46px;height:46px;border-radius:15px}.summary-icon ha-icon{--mdc-icon-size:25px}
    .section-title{margin:2px 2px -4px}.section-title h2{font-size:18px}.section-title span,.section-title .count{font-size:11px;height:26px;display:inline-flex;align-items:center}
    .vehicles{grid-template-columns:repeat(2,minmax(640px,1fr));gap:12px;align-items:start}.vehicle-card{border-radius:20px;overflow:hidden;min-width:0}.status-top-row{padding:8px 10px 5px;gap:7px}.status-row{height:29px;min-height:29px;border-radius:999px;grid-template-columns:18px minmax(0,1fr);padding:0 8px;min-width:0}.status-row ha-icon{--mdc-icon-size:16px}.pill{height:21px;min-width:0;font-size:9.3px;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .hero-split-row{grid-template-columns:minmax(0,2.55fr) minmax(150px,.72fr);gap:8px;padding:4px 10px 6px;min-width:0}.vehicle-hero-panel,.charger-hero-panel{border-radius:16px;border:1px solid var(--hi-line);background:linear-gradient(135deg,#fff,#F8FBFF);min-width:0}.vehicle-hero-panel{min-height:168px;padding:12px;grid-template-columns:.34fr 1.66fr}.vehicle-copy h2{font-size:24px;line-height:.95;margin-bottom:6px}.vehicle-copy p{font-size:11.5px;line-height:1.15}.vehicle-image{overflow:hidden;justify-content:center;align-items:center}.vehicle-image img{max-width:105%;max-height:230px;transform:translateX(-4px) scale(1.03);object-fit:contain;filter:drop-shadow(0 18px 26px rgba(15,35,80,.16))}.charger-hero-panel{min-height:168px;padding:10px}.charger-mini-image{height:98px;border-radius:14px}.charger-mini-image img{max-width:122px;max-height:96px}.charger-mini-copy b{font-size:13px}.charger-mini-copy span{font-size:10.5px}
    .vehicle-control-row.mock-row{grid-template-columns:minmax(170px,.42fr) minmax(600px,1.58fr);gap:6px;padding:0 10px 7px;min-width:0}.vehicle-metrics-strip.mock-metrics{height:38px;min-width:0}.metric-chip{min-width:0}.metric-chip span{font-size:7.2px}.metric-chip b{font-size:13px}.charge-mini-strip.mock-controls{height:38px;gap:6px;grid-template-columns:minmax(220px,1.35fr) minmax(128px,.76fr) minmax(112px,.65fr) minmax(78px,.42fr);min-width:0}.charge-mini-strip.no-speed{grid-template-columns:minmax(300px,1.65fr) minmax(128px,.78fr) minmax(78px,.42fr)}.charge-mini-strip.no-mode{grid-template-columns:minmax(260px,1.48fr) minmax(112px,.65fr) minmax(78px,.42fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(330px,1fr) minmax(78px,.28fr)}
    .mini-control,.mini-current-stepper,.mini-power-read{height:38px;min-height:38px;border-radius:12px;padding:0 9px;box-shadow:none;min-width:0}.charger-select select,.mode-select select{font-size:12px!important;font-weight:650!important;line-height:1!important;min-width:0;text-overflow:ellipsis}.mini-current-stepper{grid-template-columns:24px 16px minmax(32px,1fr) 24px}.mini-current-stepper strong,.mini-power-read strong{font-size:12.5px;white-space:nowrap}.round-step{width:24px;height:24px}.mini-power-read{justify-content:center;min-width:68px}
    .vehicle-actions{grid-template-columns:minmax(124px,1fr) minmax(116px,.92fr) minmax(98px,.78fr) minmax(0,1fr) 38px 38px;gap:7px;padding:7px 10px 10px}.action{height:38px;min-height:38px;border-radius:12px;font-size:12.2px}.icon-only{width:38px!important;min-width:38px!important;max-width:38px!important}.action-spacer{min-width:0}.inactive-row{min-height:52px;border-radius:18px;padding:8px 12px}.bottom-grid{gap:12px}.info{min-height:58px;padding:10px 13px}.info h3{font-size:13px}.info p,.info li{font-size:11px}
    /* R22.1 working beta cockpit alignment: one density system, no clipping. */
    .page{width:min(100%,1460px);max-width:1460px;gap:12px;padding:16px 22px 28px;margin:0 auto;overflow:visible}
    .title{padding-left:0}.title h1{font-size:34px;line-height:.94}.title p{font-size:13px}.eyebrow{font-size:11px}
    .top-grid{grid-template-columns:1fr 1fr;gap:12px}.summary{height:76px;min-height:76px;padding:10px 16px;box-sizing:border-box}.summary h3{font-size:15px}.summary li,.summary li span{font-size:12px}.summary-icon{width:44px;height:44px}.summary-icon ha-icon{--mdc-icon-size:24px}
    .section-title{margin:1px 0 -2px}.section-title h2{font-size:18px;line-height:1}.section-title span{height:24px;font-size:11px}
    .vehicles{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.vehicle-card{border-radius:20px;min-width:0;overflow:hidden}.status-top-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:7px 9px 5px}.status-row{height:27px;min-height:27px;border-radius:999px;display:grid;grid-template-columns:16px 1fr;align-items:center;gap:4px;padding:0 7px;min-width:0}.status-row>span{display:none}.status-row ha-icon{--mdc-icon-size:15px}.pill{height:19px;font-size:9px;padding:0 6px;min-width:0;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .hero-split-row{display:grid;grid-template-columns:minmax(0,2.9fr) minmax(132px,.82fr);gap:8px;padding:4px 9px 6px}.vehicle-hero-panel,.charger-hero-panel{border-radius:16px;min-width:0;box-sizing:border-box}.vehicle-hero-panel{position:relative;display:block;min-height:190px;height:190px;padding:14px 14px 10px;overflow:hidden}.vehicle-copy{position:absolute;z-index:2;left:14px;top:14px;max-width:42%;min-width:150px}.vehicle-copy h2{font-size:23px;line-height:.95;margin:0 0 5px;white-space:nowrap;letter-spacing:-.055em}.vehicle-copy p{font-size:11px;line-height:1.15;white-space:normal}.vehicle-image{position:absolute;inset:8px 10px 8px 118px;display:flex;align-items:center;justify-content:center;overflow:hidden}.vehicle-image img{max-width:100%;max-height:174px;object-fit:contain;transform:translateX(-4%) scale(.96);filter:drop-shadow(0 16px 25px rgba(15,35,80,.15))}.charger-hero-panel{min-height:190px;height:190px;padding:10px;display:grid;grid-template-rows:1fr auto;gap:8px}.charger-mini-image{height:auto;min-height:116px;border-radius:14px}.charger-mini-image img{max-width:112px;max-height:104px;object-fit:contain}.charger-mini-copy b{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.charger-mini-copy span{font-size:10.5px}
    .vehicle-control-row.mock-row{display:grid;grid-template-columns:minmax(165px,.42fr) minmax(0,1.58fr);gap:6px;padding:0 9px 6px;align-items:stretch;min-width:0}.vehicle-metrics-strip.mock-metrics{height:36px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-radius:12px;overflow:hidden;min-width:0}.metric-chip{height:36px;min-width:0;padding:4px 7px;border-radius:0;box-shadow:none;border-right:1px solid var(--hi-line)}.metric-chip:last-child{border-right:0}.metric-chip span{font-size:7px;line-height:1;text-transform:uppercase;letter-spacing:.04em}.metric-chip b{font-size:12.5px;line-height:1.05;white-space:nowrap}.battery-chip i{display:none!important}
    .charge-mini-strip.mock-controls{height:36px;display:flex;align-items:stretch;gap:6px;min-width:0;overflow:hidden}.mini-control,.mini-current-stepper,.mini-power-read{height:36px;min-height:36px;border-radius:12px;padding:0 8px;box-sizing:border-box;min-width:0;flex:0 1 auto}.charger-select{flex:1 1 210px;min-width:160px}.mode-select{flex:0 1 126px;min-width:108px}.mini-current-stepper{flex:0 0 112px;display:grid;grid-template-columns:22px 14px minmax(31px,1fr) 22px;gap:4px}.mini-power-read{flex:0 0 72px;justify-content:center}.charge-mini-strip.no-speed .mini-power-read{flex:0 0 82px}.charger-select select,.mode-select select{font-size:12px!important;font-weight:600!important;line-height:1!important;color:var(--hi-ink);height:100%;width:100%;border:0;background:transparent;min-width:0;outline:0}.mini-control ha-icon,.mini-power-read ha-icon{--mdc-icon-size:16px;flex:0 0 16px}.mini-current-stepper strong,.mini-power-read strong{font-size:12px;line-height:1;white-space:nowrap}.round-step{width:22px;height:22px;min-width:22px;border-radius:999px;font-size:15px}
    .vehicle-actions{display:grid;grid-template-columns:minmax(118px,1.05fr) minmax(112px,.95fr) minmax(92px,.78fr) minmax(0,1fr) 36px 36px;gap:7px;padding:7px 9px 9px;align-items:center}.action{height:36px;min-height:36px;border-radius:12px;font-size:12px;font-weight:600;line-height:1;gap:7px;padding:0 11px;box-sizing:border-box;white-space:nowrap;overflow:hidden}.action ha-icon{--mdc-icon-size:16px}.icon-only{width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important;display:inline-flex!important;justify-content:center!important}.icon-only span{display:none!important}.action-spacer{min-width:0}
    .inactive-row{min-height:52px;border-radius:18px;padding:8px 12px}.inactive-state{width:62px;height:42px;font-size:10px}.inactive-copy h3{font-size:13px}.inactive-copy p{font-size:11px}.inactive-actions{gap:7px}.inactive-actions .action:not(.icon-only){width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important}.inactive-actions .action:not(.icon-only) span{display:none!important}
    .bottom-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.info{min-height:58px;padding:10px 13px;border-radius:16px}.info h3{font-size:13px}.info p,.info li{font-size:11px}
    @media(max-width:1280px){.page{width:100%;padding:14px}.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:176px}.top-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:880px){.page{width:100%;margin:0;padding:12px}.top-grid,.vehicles,.hero-split-row,.vehicle-control-row.mock-row,.bottom-grid{grid-template-columns:1fr}.charge-mini-strip.mock-controls{flex-wrap:wrap;height:auto;overflow:visible}.mini-control,.mini-current-stepper,.mini-power-read{height:36px}.vehicle-actions{grid-template-columns:1fr 1fr 1fr 36px 36px}.action-spacer{display:none}.status-top-row{grid-template-columns:1fr 1fr}.vehicle-image{position:relative;inset:auto;height:150px}.vehicle-copy{position:relative;left:auto;top:auto;max-width:100%}.vehicle-hero-panel{height:auto;min-height:0}}

    /* R22.2 font and interaction polish: sharper, less heavy typography and safer command fallback. */
    :host{--hi-font:inherit;--hb-font:var(--hi-font);font-family:var(--hi-font)!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
    .title h1,h1{font-weight:600!important;letter-spacing:-.025em!important;}
    .vehicle-copy h2,h2{font-weight:600!important;letter-spacing:-.02em!important;}
    h3,.summary h3,.section-title h2,.charger-mini-copy b{font-weight:600!important;}
    .action,.mini-control select,.charger-select select,.mode-select select,.metric-chip b,.mini-current-stepper strong,.mini-power-read strong,.inactive-copy h3{font-weight:500!important;}
    .status-row .pill{font-weight:500!important;}
    .metric-chip span,.inactive-copy p,.charger-mini-copy span,.summary li b,.summary li span,.info p,.info li{font-weight:400!important;}
    .action:disabled{opacity:.45;filter:none;}


    /* R22.12.11.24 Energy look & feel alignment — CSS/token-level polish only. Card layout and contract behavior stay frozen. */
    :host{
      --hi-surface:var(--card-background-color);
      --hi-surface-soft:rgba(14,35,72,.025);
      --hi-surface-chip:rgba(14,35,72,.055);
      --hi-line:rgba(14,35,72,.10);
      --hi-line-soft:rgba(14,35,72,.075);
      --hi-muted:var(--secondary-text-color);
      --hi-ink:var(--primary-text-color);
      --hi-radius-card:18px;
      --hi-radius-inner:14px;
      --hi-radius-control:12px;
      --hi-shadow-soft:none;
      font-family:inherit;
    }
    .page{background:transparent!important;}
    .summary,.vehicle-card,.inactive-row,.info,.vehicle-hero-panel,.charger-hero-panel,.metric-chip,.mini-control,.mini-current-stepper,.mini-power-read,.status-row{
      background:var(--hi-surface)!important;
      border-color:var(--hi-line)!important;
      box-shadow:none!important;
    }
    .summary,.vehicle-card,.info{border-radius:var(--hi-radius-card)!important;}
    .vehicle-hero-panel,.charger-hero-panel,.inactive-row{border-radius:var(--hi-radius-card)!important;}
    .metric-chip,.mini-control,.mini-current-stepper,.mini-power-read,.status-row{border-radius:var(--hi-radius-control)!important;}
    .summary.attention,.summary.recommendation,.vehicle-hero-panel,.charger-hero-panel{background:linear-gradient(135deg,var(--hi-surface),var(--hi-surface-soft))!important;}
    .title h1{font-size:32px!important;font-weight:600!important;letter-spacing:-.025em!important;color:var(--hi-ink)!important;}
    .title p,.vehicle-copy p,.info p,.info li,.summary li,.inactive-copy p,.charger-mini-copy span,.relationship-lines{color:var(--hi-muted)!important;font-weight:400!important;}
    .eyebrow,.metric-chip span{color:var(--hi-muted)!important;font-weight:500!important;}
    .section-title h2,.summary h3,.info h3,.vehicle-copy h2,.charger-mini-copy b,.inactive-copy h3{font-weight:600!important;color:var(--hi-ink)!important;}
    .metric-chip b,.mini-control strong,.mini-current-stepper strong,.mini-power-read strong{font-weight:600!important;color:var(--hi-ink)!important;}
    .pill{font-weight:500!important;border:1px solid transparent!important;}
    .pill.ok{background:rgba(22,163,74,.10)!important;color:#166534!important;border-color:rgba(22,163,74,.12)!important;}
    .pill.warn{background:rgba(217,119,6,.11)!important;color:#92400E!important;border-color:rgba(217,119,6,.14)!important;}
    .pill.bad{background:rgba(220,38,38,.10)!important;color:#991B1B!important;border-color:rgba(220,38,38,.14)!important;}
    .pill.muted{background:var(--hi-surface-chip)!important;color:var(--hi-muted)!important;border-color:var(--hi-line-soft)!important;}
    .action{
      background:var(--hi-surface)!important;
      border-color:var(--hi-line)!important;
      border-radius:var(--hi-radius-control)!important;
      box-shadow:none!important;
      font-weight:500!important;
      color:var(--hi-ink)!important;
    }
    .action.primary-charge{background:rgba(20,103,245,.10)!important;border-color:rgba(20,103,245,.18)!important;color:#164AA8!important;}
    .action.primary-charge ha-icon{color:#1467F5!important;}
    .action.sent{background:rgba(20,103,245,.08)!important;border-color:rgba(20,103,245,.14)!important;color:#164AA8!important;}
    .action.busy{background:rgba(217,119,6,.08)!important;border-color:rgba(217,119,6,.14)!important;}
    .action.failed{background:rgba(220,38,38,.08)!important;border-color:rgba(220,38,38,.14)!important;color:#991B1B!important;}
    .vehicle-image,.charger-mini-image,.inactive-image{background:radial-gradient(circle at center,rgba(14,35,72,.045),transparent 62%)!important;}
    .section-title span{background:var(--hi-surface-chip)!important;border-color:var(--hi-line-soft)!important;color:var(--hi-muted)!important;font-weight:500!important;}
    .empty{background:var(--hi-surface)!important;border-color:var(--hi-line)!important;color:var(--hi-muted)!important;font-weight:400!important;}



    /* R22.6.2 tablet + hero stability pass
       - tablet keeps two columns longer
       - image cards stop blinking by preventing layout-driven reload pressure
       - attention cards hide positive/clear rows
       - vehicle hero becomes less boxed on tablet and phone-prep remains controlled */
    .summary.attention li.clear{display:none!important;}
    .summary.attention ul:empty:after{content:"No urgent mobility attention.";display:block;color:#34405A;font-size:13px;font-weight:400;}
    .vehicle-image img,.charger-mini-image img,.charger-visual img{will-change:auto;backface-visibility:hidden;}
    .vehicle-card{contain:layout paint style;}
    .vehicle-image{overflow:visible!important;}

    @media (min-width: 900px) and (max-width: 1320px){
      .page{width:100%!important;margin:0!important;padding:18px 18px 34px!important;gap:14px!important;}
      .top-grid{grid-template-columns:1fr 1fr!important;gap:12px!important;}
      .summary{min-height:92px!important;padding:14px 16px!important;grid-template-columns:46px 1fr!important;gap:12px!important;}
      .summary-icon{width:42px!important;height:42px!important;border-radius:14px!important;}
      .summary-icon ha-icon{--mdc-icon-size:24px!important;}
      .summary h3{font-size:15px!important;margin:0 0 5px!important;}
      .summary li{font-size:12px!important;padding:5px 0!important;gap:8px!important;}
      .vehicles{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;}
      .vehicle-card{border-radius:20px!important;min-width:0!important;}
      .status-top-row{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important;padding:8px 8px 5px!important;}
      .status-row{min-height:28px!important;height:28px!important;padding:0 6px!important;border-radius:999px!important;gap:3px!important;}
      .status-row ha-icon{--mdc-icon-size:14px!important;}
      .pill{font-size:8.8px!important;min-width:0!important;padding:0 5px!important;height:18px!important;}
      .hero-split-row{grid-template-columns:minmax(0,2.65fr) minmax(112px,.72fr)!important;gap:7px!important;padding:4px 8px 6px!important;}
      .vehicle-hero-panel{position:relative!important;display:block!important;height:178px!important;min-height:178px!important;padding:12px!important;overflow:hidden!important;border-radius:16px!important;}
      .vehicle-copy{position:absolute!important;left:12px!important;top:12px!important;z-index:2!important;max-width:45%!important;min-width:120px!important;}
      .vehicle-copy h2{font-size:21px!important;line-height:.95!important;white-space:nowrap!important;margin:0 0 4px!important;}
      .vehicle-copy p{font-size:10.5px!important;line-height:1.1!important;}
      .vehicle-image{position:absolute!important;inset:12px 10px 8px 110px!important;display:flex!important;align-items:center!important;justify-content:center!important;min-height:0!important;background:radial-gradient(circle at center,rgba(20,103,245,.08),transparent 60%)!important;}
      .vehicle-image img{max-height:148px!important;max-width:112%!important;transform:translateX(-4%) scale(1.02)!important;object-fit:contain!important;}
      .charger-hero-panel{height:178px!important;min-height:178px!important;padding:9px!important;border-radius:16px!important;grid-template-rows:auto 1fr!important;}
      .charger-mini-image{height:108px!important;min-height:108px!important;border-radius:14px!important;}
      .charger-mini-image img{max-width:96px!important;max-height:94px!important;}
      .charger-mini-copy b{font-size:12px!important;}
      .charger-mini-copy span{font-size:10px!important;}
      .vehicle-control-row.mock-row{grid-template-columns:1fr!important;gap:6px!important;padding:0 8px 7px!important;}
      .vehicle-metrics-strip.mock-metrics{height:34px!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;}
      .vehicle-metrics-strip.mock-metrics .metric-chip{min-height:34px!important;padding:4px 8px!important;}
      .metric-chip span{font-size:7.6px!important;}
      .metric-chip b{font-size:12px!important;}
      .charge-mini-strip.mock-controls{height:34px!important;grid-template-columns:minmax(170px,1.4fr) minmax(96px,.62fr) minmax(74px,.42fr)!important;gap:5px!important;}
      .charge-mini-strip.mock-controls.no-speed{grid-template-columns:minmax(210px,1.5fr) minmax(108px,.8fr) minmax(74px,.42fr)!important;}
      .mini-control,.mini-current-stepper,.mini-power-read{height:34px!important;min-height:34px!important;border-radius:11px!important;padding:0 7px!important;gap:5px!important;}
      .charger-select select,.mode-select select{font-size:11px!important;font-weight:500!important;}
      .mini-current-stepper{grid-template-columns:20px 14px minmax(28px,1fr) 20px!important;}
      .round-step{width:20px!important;height:20px!important;font-size:14px!important;}
      .mini-current-stepper strong,.mini-power-read strong{font-size:11.5px!important;}
      .vehicle-actions{grid-template-columns:minmax(118px,1fr) minmax(108px,.9fr) minmax(82px,.72fr) 1fr 34px 34px!important;gap:6px!important;padding:6px 8px 9px!important;}
      .action{min-height:34px!important;height:34px!important;font-size:11.5px!important;border-radius:11px!important;}
      .icon-only{width:34px!important;min-width:34px!important;max-width:34px!important;}
      .bottom-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;}
      .info{min-height:58px!important;padding:10px 12px!important;}
    }

    @media (max-width: 899px){
      .page{width:100%!important;margin:0!important;padding:12px 12px 28px!important;gap:12px!important;}
      .top-grid{grid-template-columns:1fr!important;gap:10px!important;}
      .summary{min-height:auto!important;padding:14px!important;grid-template-columns:44px 1fr!important;gap:12px!important;}
      .vehicles{grid-template-columns:1fr!important;gap:12px!important;}
      .hero-split-row{grid-template-columns:1fr!important;gap:9px!important;}
      .vehicle-hero-panel{height:auto!important;min-height:230px!important;display:block!important;position:relative!important;padding:14px!important;}
      .vehicle-copy{position:relative!important;left:auto!important;top:auto!important;max-width:100%!important;z-index:2!important;}
      .vehicle-copy h2{white-space:nowrap!important;font-size:25px!important;}
      .vehicle-image{position:relative!important;inset:auto!important;height:160px!important;margin-top:8px!important;}
      .vehicle-image img{max-height:150px!important;transform:none!important;}
      .charger-hero-panel{height:auto!important;min-height:150px!important;}
      .vehicle-control-row.mock-row{grid-template-columns:1fr!important;}
      .vehicle-metrics-strip.mock-metrics{height:42px!important;}
      .charge-mini-strip.mock-controls,.charge-mini-strip.mock-controls.no-speed{grid-template-columns:1fr 1fr!important;height:auto!important;}
      .mini-control,.mini-current-stepper,.mini-power-read{height:38px!important;min-height:38px!important;}
      .vehicle-actions{grid-template-columns:1fr 1fr 1fr 36px 36px!important;}
      .bottom-grid{grid-template-columns:1fr!important;}
    }

    @media (max-width: 560px){
      .status-top-row{grid-template-columns:1fr 1fr!important;}
      .vehicle-metrics-strip.mock-metrics{grid-template-columns:repeat(3,minmax(0,1fr))!important;}
      .charge-mini-strip.mock-controls,.charge-mini-strip.mock-controls.no-speed{grid-template-columns:1fr!important;}
      .vehicle-actions{grid-template-columns:1fr 1fr 36px 36px!important;}
      .vehicle-actions .action:nth-child(3){grid-column:1 / 3;}
    }


    /* R22.10.3 hard visible charge-speed + bottom alignment gate
       This block is inside the dashboard styles() return, not in the missing-card branch. */
    .vehicle-control-row.mock-row{
      display:grid!important;
      grid-template-columns:minmax(176px,.44fr) minmax(220px,1fr) minmax(126px,.48fr) minmax(92px,.34fr)!important;
      gap:6px!important;
      align-items:stretch!important;
      padding:0 12px 8px!important;
      min-width:0!important;
      overflow:visible!important;
    }
    .vehicle-control-row.mock-row>.vehicle-metrics-strip.mock-metrics{
      grid-column:1!important;
      min-width:0!important;
      height:38px!important;
      display:grid!important;
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
    }
    .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{
      display:contents!important;
    }
    .vehicle-control-row.mock-row .charger-select{
      grid-column:2!important;
      min-width:0!important;
      width:100%!important;
      height:38px!important;
      min-height:38px!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current{
      grid-column:3!important;
      display:grid!important;
      grid-template-columns:minmax(42px,1fr) 24px 24px!important;
      gap:5px!important;
      align-items:center!important;
      min-width:0!important;
      width:100%!important;
      height:38px!important;
      min-height:38px!important;
      padding:0 7px!important;
      overflow:hidden!important;
      background:#fff!important;
      border:1px solid var(--hb-line)!important;
      border-radius:12px!important;
      box-sizing:border-box!important;
      opacity:1!important;
      visibility:visible!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current.readonly{
      grid-template-columns:minmax(56px,1fr)!important;
    }
    .vehicle-control-row.mock-row .mini-power-read.actual-power-read{
      grid-column:4!important;
      display:flex!important;
      align-items:center!important;
      min-width:0!important;
      width:100%!important;
      height:38px!important;
      min-height:38px!important;
      padding:0 8px!important;
      background:#fff!important;
      border:1px solid var(--hb-line)!important;
      border-radius:12px!important;
      box-sizing:border-box!important;
      overflow:hidden!important;
    }
    .vehicle-control-row.mock-row .mini-power-read.actual-power-read .power-copy{
      min-width:0!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      line-height:1.05!important;
      overflow:hidden!important;
    }
    .vehicle-control-row.mock-row .mini-power-read.actual-power-read small{
      display:block!important;
      font-size:8px!important;
      color:#64708A!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      font-weight:500!important;
    }
    .vehicle-control-row.mock-row .mini-power-read.actual-power-read strong{
      display:block!important;
      font-size:13px!important;
      color:#12213A!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      font-weight:500!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy{
      min-width:0!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      overflow:hidden!important;
      line-height:1.05!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy small{
      display:block!important;
      font-size:8px!important;
      color:#64708A!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      font-weight:500!important;
      letter-spacing:0!important;
      text-transform:none!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy strong{
      display:block!important;
      font-size:13px!important;
      color:#12213A!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      font-weight:500!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .round-step{
      width:24px!important;
      min-width:24px!important;
      height:24px!important;
      border-radius:999px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      padding:0!important;
      font-size:16px!important;
      line-height:1!important;
      background:#fff!important;
      color:#1467F5!important;
      border:1px solid var(--hb-line)!important;
      box-shadow:none!important;
    }
    .vehicle-actions.clean-actions{
      display:grid!important;
      grid-template-columns:minmax(132px,1.05fr) minmax(118px,.95fr) minmax(104px,.82fr) minmax(92px,.75fr) minmax(0,1fr) 42px 42px!important;
      gap:8px!important;
      align-items:center!important;
      padding:8px 12px 12px!important;
    }
    .vehicle-actions.clean-actions .action-spacer{display:block!important;min-width:0!important;visibility:hidden!important;}
    .vehicle-actions.clean-actions .presence-toggle.icon-only,
    .vehicle-actions.clean-actions .details-action.icon-only{
      justify-self:end!important;
      width:42px!important;
      min-width:42px!important;
      max-width:42px!important;
      background:#fff!important;
      color:#1467F5!important;
      border-color:var(--hb-line)!important;
    }
    .vehicle-actions.clean-actions .presence-toggle.icon-only ha-icon,
    .vehicle-actions.clean-actions .details-action.icon-only ha-icon{color:#1467F5!important;}
    .charger-hero-panel{position:relative!important;}
    .charger-hero-panel .mini-detail-button.charger-detail-link{
      position:absolute!important;
      right:10px!important;
      bottom:10px!important;
      width:30px!important;
      height:30px!important;
      min-width:30px!important;
      border-radius:999px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      padding:0!important;
      background:#fff!important;
      border:1px solid var(--hb-line)!important;
      color:#1467F5!important;
      box-shadow:0 8px 18px rgba(15,35,80,.06)!important;
      z-index:2!important;
      cursor:pointer!important;
    }
    .charger-hero-panel .mini-detail-button.charger-detail-link ha-icon{--mdc-icon-size:18px;color:#1467F5!important;}
    .vehicle-hero-panel{position:relative!important;}
    .vehicle-hero-panel .mini-detail-button.vehicle-detail-link{
      position:absolute!important;
      right:10px!important;
      bottom:10px!important;
      width:30px!important;
      height:30px!important;
      min-width:30px!important;
      border-radius:999px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      padding:0!important;
      background:#fff!important;
      border:1px solid var(--hb-line)!important;
      color:#1467F5!important;
      box-shadow:0 8px 18px rgba(15,35,80,.06)!important;
      z-index:2!important;
      cursor:pointer!important;
    }
    .vehicle-hero-panel .mini-detail-button.vehicle-detail-link ha-icon{--mdc-icon-size:18px;color:#1467F5!important;}
    .vehicle-activity-inline{margin:6px 0 0!important;color:#34405A!important;font-size:12px!important;font-weight:500!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}
    .vehicle-lifecycle-chip{
      align-self:center!important;
      justify-self:start!important;
      min-width:0!important;
      color:#17233B!important;
      font-size:13px!important;
      font-weight:500!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      padding:0 4px!important;
    }
    .vehicle-lifecycle-chip.empty{visibility:hidden!important;}

    @media (max-width: 1320px){
      .vehicle-control-row.mock-row{grid-template-columns:1fr!important;}
      .vehicle-control-row.mock-row>.vehicle-metrics-strip.mock-metrics{grid-column:1!important;}
      .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{display:grid!important;grid-template-columns:minmax(180px,1fr) minmax(108px,.50fr) minmax(124px,.52fr)!important;gap:6px!important;height:38px!important;}
      .vehicle-control-row.mock-row .charger-select{grid-column:1!important;}
      .vehicle-control-row.mock-row .mode-select{grid-column:2!important;}
      .vehicle-control-row.mock-row .mini-current-stepper.compact-current{grid-column:3!important;}
    }
    @media (max-width: 899px){
      .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{height:auto!important;grid-template-columns:1fr 1fr!important;}
      .vehicle-control-row.mock-row .charger-select{grid-column:1 / -1!important;}
      .vehicle-control-row.mock-row .mode-select{grid-column:1!important;}
      .vehicle-control-row.mock-row .mini-current-stepper.compact-current{grid-column:2!important;}
      .vehicle-actions.clean-actions{grid-template-columns:1fr 1fr 1fr minmax(0,1fr) 36px 36px!important;}
    }


    /* R22.10.3 stabilization: tighter vehicle charge power alignment */
    .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{
      align-items:stretch!important;
    }
    .vehicle-control-row.mock-row .charger-select,
    .vehicle-control-row.mock-row .mode-select,
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current{
      height:40px!important;
      min-height:40px!important;
      align-self:stretch!important;
      box-sizing:border-box!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current{
      grid-template-columns:minmax(66px,1fr) 26px 26px!important;
      gap:4px!important;
      padding:0 6px!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current.readonly{
      grid-template-columns:minmax(78px,1fr)!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy{
      text-align:left!important;
      padding-top:1px!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .round-step{
      width:26px!important;min-width:26px!important;height:26px!important;
    }

    /* R22.12.11.24 Energy typography alignment — no layout or contract changes. */
    :host{font-family:inherit!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
    *{font-family:inherit!important;}
    .title h1{font-size:34px!important;line-height:1.08!important;font-weight:650!important;letter-spacing:-.025em!important;}
    .title p{font-size:13px!important;line-height:1.4!important;font-weight:400!important;color:var(--hb-muted,#66728B)!important;}
    .eyebrow{font-size:11px!important;font-weight:650!important;letter-spacing:.10em!important;}
    .section-title h2{font-size:18px!important;line-height:1.25!important;font-weight:600!important;letter-spacing:-.01em!important;}
    .section-title .count{font-size:11px!important;font-weight:500!important;}
    .summary h3,.info h3{font-size:14px!important;font-weight:600!important;line-height:1.2!important;}
    .summary li,.summary li span,.info p,.info li{font-size:11.5px!important;line-height:1.35!important;font-weight:400!important;color:var(--hb-muted,#66728B)!important;}
    .vehicle-copy h2{font-size:23px!important;line-height:1.08!important;font-weight:650!important;letter-spacing:-.025em!important;}
    .vehicle-copy p,.charger-mini-copy span{font-size:12px!important;font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
    .charger-mini-copy b{font-size:13px!important;font-weight:600!important;line-height:1.15!important;}
    .metric-chip span{font-size:7.8px!important;font-weight:600!important;letter-spacing:.035em!important;color:var(--hb-muted,#66728B)!important;}
    .metric-chip b{font-size:14px!important;font-weight:650!important;line-height:1.1!important;}
    .pill{font-weight:500!important;}
    .status-strip .metric span{font-size:11px!important;font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
    .status-strip .metric b{font-size:15px!important;font-weight:650!important;line-height:1.2!important;}
    .mini-control small,.mini-current-stepper small,.mini-power-read small{font-size:9.5px!important;font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
    .mini-current-stepper strong,.mini-power-read strong{font-size:13px!important;font-weight:600!important;}
    .charger-select select,.mode-select select{font-size:12px!important;font-weight:600!important;}
    .action{font-size:12.5px!important;font-weight:600!important;}
    .hi-release-footer{font-size:11px!important;font-weight:400!important;line-height:1.35!important;color:var(--secondary-text-color,#6B7280)!important;}
    .hi-release-footer .hi-release-health{font-weight:600!important;}


  `; }

  getCardSize(){ return 12; }
}

if (!customElements.get("homebrain-mobility-dashboard-card")) {
  customElements.define("homebrain-mobility-dashboard-card", HomeBrainMobilityDashboardCard);
}
window.customCards.push({
  type: "homebrain-mobility-dashboard-card",
  name: "Home Brain Mobility Dashboard Card",
  description: "Premium Mobility dashboard custom card with first-class charging controls and compact inactive vehicle rows."
});
/**
 * The former Mobility Asset Viewer was intentionally removed from the Mobility
 * product navigation in 2.1.16. Contract exploration now belongs to the Setup
 * domain. The product bundle keeps only operational Mobility cards.
 */
