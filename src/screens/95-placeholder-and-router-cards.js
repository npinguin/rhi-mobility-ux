// 95-placeholder-and-router-cards.js
// Placeholder and generic routed asset detail cards plus custom element registration.

class HomeBrainMobilityPlaceholderCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.config = {};
  }
  setConfig(config = {}) { this.config = config; }
  getCardSize() { return 8; }
  set hass(hass) {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    const view = this.config.view || this.viewFromPath();
    const data = this.viewModel(view);
    this.shadowRoot.innerHTML = `<ha-card><div class="page">${this.versionBlock(rt)}
      ${hbMobilityTitleBlock("Mobility", "Vehicle readiness, charging, comfort and security in one calm control cockpit.")}
      ${hbMobilityNav(view)}
      ${hbMobilityOutcomeStrip(rt, view, data.outcome)}
      <section class="section-title"><h2>${rt.escape(data.title)}</h2><span>${rt.escape(data.subtitle)}</span></section>
      <section class="placeholder-grid">
        ${data.cards.map((card) => `<article class="placeholder-card"><div class="placeholder-kicker"><ha-icon icon="${card.icon}"></ha-icon>${rt.escape(card.kicker)}</div><h3>${rt.escape(card.title)}</h3><p>${rt.escape(card.text)}</p></article>`).join("")}
      </section>
      <section class="bottom-grid"><div class="info"><h3><ha-icon icon="mdi:calendar-clock"></ha-icon>Charging Plan</h3><p>${rt.escape(rt.supervisorOutcome("mobility", "opportunity", "Supervised"))}</p></div><div class="info"><h3><ha-icon icon="mdi:shield-check-outline"></ha-icon>System Trust</h3><p>${rt.escape(rt.supervisorOutcome("mobility", "trust", "Unknown"))}</p></div><div class="info"><h3><ha-icon icon="mdi:history"></ha-icon>Recent Activity</h3><p>No recent activity requiring attention.</p></div></section>
      <div class="footer-note">MVP placeholder — contract-backed content will appear here as backend indexes mature.</div>
      ${hbMobilityReleaseFooter(rt)}
    </div><style>${this.styles()}</style></ha-card>`;
    this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn)=>btn.addEventListener("click",()=>rt.navigate(btn.getAttribute("data-nav"))));
  }
  versionBlock(rt) { return ``; }
  viewFromPath() {
    const path = String(window.location?.pathname || "").toLowerCase();
    if (path.includes("intelligence")) return "intelligence";
    if (path.includes("activity")) return "activity";
    if (path.includes("value")) return "value";
    return "intelligence";
  }
  viewModel(view) {
    const models = {
      intelligence: {
        title: "Mobility Intelligence", subtitle: "Decisions, optimization and automation will be consolidated here.", outcome: { opportunity: "optimize_charging", recommended_action: "review_plan" },
        cards: [
          { icon:"mdi:car-clock", kicker:"Readiness", title:"Readiness Overview", text:"Upcoming departure readiness, energy deficits and deadline risks will appear here." },
          { icon:"mdi:lightbulb-on-outline", kicker:"Recommendations", title:"Optimization Opportunities", text:"Solar-first charging, delayed charging and load balancing opportunities will be listed here." },
          { icon:"mdi:robot-outline", kicker:"Automation", title:"Automation Execution", text:"Queued, executed and rejected automation decisions will be visible here." },
          { icon:"mdi:check-decagram-outline", kicker:"Trust", title:"Decision Confidence", text:"Why Mobility trusts or delays an automated decision will be explained here." }
        ]
      },
      activity: {
        title: "Mobility Activity", subtitle: "Commands, recommendations and automation history in one audit trail.", outcome: { status: "Logging", opportunity: "audit_ready", recommended_action: "none" },
        cards: [
          { icon:"mdi:timeline-clock-outline", kicker:"Timeline", title:"Recent Executions", text:"Executed commands and automation outcomes will appear here." },
          { icon:"mdi:cursor-default-click-outline", kicker:"Commands", title:"Recent Commands", text:"Manual and automated command attempts will be listed here." },
          { icon:"mdi:alert-outline", kicker:"Failures", title:"Recent Failures", text:"Failed or rejected actions will be surfaced here with reasons." },
          { icon:"mdi:file-document-check-outline", kicker:"Audit", title:"Recommendation History", text:"Historical recommendations and why they were made will be available here." }
        ]
      },
      value: {
        title: "Mobility Value", subtitle: "Readiness, energy, financial and automation value created by Mobility.", outcome: { status: "Measuring", opportunity: "value_tracking", recommended_action: "none" },
        cards: [
          { icon:"mdi:car-check", kicker:"Readiness", title:"Readiness Value", text:"Vehicle readiness score, ready days and avoided misses will be summarized here." },
          { icon:"mdi:solar-power-variant-outline", kicker:"Energy", title:"Energy Value", text:"Solar energy used for charging, grid energy avoided and battery utilization will appear here." },
          { icon:"mdi:cash-multiple", kicker:"Financial", title:"Financial Value", text:"Estimated charging savings and optimization gains will be calculated here." },
          { icon:"mdi:robot-happy-outline", kicker:"Automation", title:"Automation Value", text:"Manual interventions avoided and automated decisions executed will be tracked here." }
        ]
      }
    };
    return models[view] || models.intelligence;
  }
  styles() { return `:host{display:block;width:100%;box-sizing:border-box;--hb-blue:#1467F5;--hb-ink:#06142D;--hb-muted:#66728B;--hb-line:#E8EEF7;font-family:inherit}ha-card{background:transparent;box-shadow:none;border:none}.page{position:relative;width:min(100%,1560px);margin:0 auto;padding:18px 26px 30px;box-sizing:border-box}.title h1{margin:2px 0 4px;font-size:38px;color:#06142D}.title p{margin:0;color:#66728B}.eyebrow{font-size:11px;font-weight:650;letter-spacing:.12em;color:#1467F5;text-transform:uppercase}.section-title{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:10px 0 8px}.section-title h2{margin:0;font-size:24px;color:#06142D}.section-title span{color:#66728B;font-weight:600}.bottom-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px}.info{background:#fff;border:1px solid #E8EEF7;border-radius:18px;padding:16px;box-shadow:0 16px 38px rgba(15,35,80,.06)}.info h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;color:#06142D}.info p{margin:0;color:#66728B}.status-strip.dashboard-status-strip{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;border:1px solid rgba(14,35,72,.11)!important;border-radius:17px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 16px 32px rgba(15,35,80,.08)!important;overflow:hidden!important;max-width:none!important;width:100%!important;margin:8px 0 10px!important}.status-strip.dashboard-status-strip .metric{display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important}.status-strip.dashboard-status-strip .metric:last-child{border-right:0!important}.status-strip.dashboard-status-strip .metric ha-icon{--mdc-icon-size:23px;color:#1467F5}.status-strip.dashboard-status-strip .metric.tone-green ha-icon{color:#18A957!important}.status-strip.dashboard-status-strip .metric.tone-orange ha-icon{color:#F59E0B!important}.status-strip.dashboard-status-strip .metric span{display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1}.status-strip.dashboard-status-strip .metric b{display:block;font-size:16px;font-weight:650;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}${hbMobilitySharedShellStyles()}@media(max-width:760px){.bottom-grid{grid-template-columns:1fr}.status-strip.dashboard-status-strip{grid-template-columns:1fr!important;max-width:100%!important}}`; }
}
if (!customElements.get("homebrain-mobility-placeholder-card")) {
  customElements.define("homebrain-mobility-placeholder-card", HomeBrainMobilityPlaceholderCard);
}
window.customCards.push({
  type: "homebrain-mobility-placeholder-card",
  name: "Home Brain Mobility Placeholder Card",
  description: "R22.10.3 navigation shell placeholder for Intelligence, Activity and Value."
});

class HomeBrainMobilityAssetDetailCard extends HTMLElement {
  constructor() {
    super();
    this.config = { dashboard_path: "/mobility-supervisor/dashboard" };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._lastSignature = "";
  }

  setConfig(config = {}) {
    this.config = { dashboard_path: "/mobility-supervisor/dashboard", ...(config || {}) };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._lastSignature = "";
  }

  selectedAssetId() {
    // HA keeps Lovelace view navigation in the browser URL. The generic detail card reads
    // ?asset=<asset_id>. Config asset_id remains supported for test cards or fixed mounts.
    let url;
    try { url = new URL(window.location.href); } catch (e) { url = { searchParams: new URLSearchParams(), hash: "" }; }
    let hashAsset = "";
    try {
      const hash = String(url.hash || "").replace(/^#/, "");
      if (hash.startsWith("asset=")) hashAsset = decodeURIComponent(hash.slice(6));
      else hashAsset = hash;
    } catch (e) {}
    return this.config.asset_id || url.searchParams.get("asset") || hashAsset || sessionStorage.getItem("homebrain_mobility_last_asset") || "";
  }

  set hass(hass) {
    try {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    let assetId = this.selectedAssetId();
    let entry = assetId ? rt.registryEntry(assetId) : null;
    if (!entry && this.config.default_asset_type) {
      const wanted = String(this.config.default_asset_type).toLowerCase();
      entry = rt.mobilityRegistry().find((a)=> wanted === "vehicle" ? rt.isVehicleAsset(a) : wanted === "charger" ? rt.isChargerAsset(a) : false) || null;
      assetId = entry?.asset_id || assetId;
    }
    if (!entry && !assetId) {
      entry = rt.mobilityRegistry().find((a)=>rt.isVehicleAsset(a)) || rt.mobilityRegistry().find((a)=>rt.isChargerAsset(a)) || null;
      assetId = entry?.asset_id || "";
    }

    if (!entry) {
      this.shadowRoot.innerHTML = `
        <ha-card>
          <div class="missing">
            <h2>Asset not registered</h2>
            <p>No registered Mobility asset was found for <b>${rt.escape(assetId || "missing asset id")}</b>.</p>
            <button data-nav="/mobility-supervisor/dashboard">← Back to Dashboard</button>
          </div>
          <style>
            ha-card{background:transparent;box-shadow:none;border:none}
            .missing{font-family:inherit;user-select:text;-webkit-user-select:text;margin:24px auto;padding:28px;width:min(100%,900px);background:#fff;border:1px solid #E5ECF6;border-radius:22px;box-shadow:0 16px 40px rgba(15,35,80,.07)}
            h2{margin:0 0 8px;color:#06142D}
            p{color:#66728B;font-weight:400}
            button{border:1px solid #DDE6F2;background:#fff;border-radius:12px;font-weight:500;padding:10px 14px;cursor:pointer;color:#06142D}
          

/* R22.10.3_CHARGE_SPEED_LAYOUT_ENFORCEMENT
   Vehicle card bottom row is source-driven and visible: metrics stay left in the
   existing order, charger selector + mode + charge speed render as real cells.
   The charge speed cell is not allowed to disappear due to nested grid overflow. */
.vehicle-control-row.mock-row{
  display:grid!important;
  grid-template-columns:minmax(176px,.58fr) minmax(260px,1.22fr) minmax(118px,.42fr) minmax(116px,.40fr)!important;
  gap:6px!important;
  align-items:stretch!important;
  padding:0 12px 8px!important;
  min-width:0!important;
  overflow:visible!important;
}
.vehicle-control-row.mock-row>.vehicle-metrics-strip.mock-metrics{
  grid-column:1!important;
  min-width:0!important;
}
.vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{
  display:contents!important;
}
.vehicle-control-row.mock-row .charger-select{
  grid-column:2!important;
  min-width:0!important;
  width:100%!important;
  flex:none!important;
}
.vehicle-control-row.mock-row .mode-select{
  grid-column:3!important;
  min-width:0!important;
  width:100%!important;
  flex:none!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current{
  grid-column:4!important;
  display:grid!important;
  grid-template-columns:minmax(44px,1fr) 24px 24px!important;
  gap:5px!important;
  align-items:center!important;
  justify-items:center!important;
  min-width:0!important;
  width:100%!important;
  height:38px!important;
  min-height:38px!important;
  padding:0 7px!important;
  overflow:hidden!important;
  flex:none!important;
  background:#fff!important;
  border:1px solid var(--hb-line)!important;
  border-radius:12px!important;
  box-sizing:border-box!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current.readonly{
  grid-template-columns:minmax(56px,1fr)!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy{
  min-width:0!important;
  width:100%!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:flex-start!important;
  justify-content:center!important;
  overflow:hidden!important;
  line-height:1.05!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy small{
  display:block!important;
  font-size:8px!important;
  font-weight:650!important;
  color:#64708A!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy strong{
  display:block!important;
  font-size:13px!important;
  font-weight:650!important;
  color:#12213A!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
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
  grid-template-columns:minmax(140px,1.05fr) minmax(120px,.95fr) minmax(110px,.85fr) minmax(12px,1fr) 42px 42px!important;
  gap:8px!important;
  align-items:center!important;
  padding:8px 12px 12px!important;
}
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
.vehicle-actions.clean-actions .details-action.icon-only ha-icon{
  color:#1467F5!important;
}
@media(max-width:1380px){
  .vehicle-control-row.mock-row{grid-template-columns:minmax(176px,.60fr) minmax(240px,1.20fr) minmax(112px,.42fr) minmax(112px,.42fr)!important;}
}
@media(max-width:880px){
  .vehicle-control-row.mock-row{grid-template-columns:1fr 1fr!important;overflow:visible!important;}
  .vehicle-control-row.mock-row>.vehicle-metrics-strip.mock-metrics{grid-column:1 / -1!important;}
  .vehicle-control-row.mock-row .charger-select{grid-column:1 / -1!important;}
  .vehicle-control-row.mock-row .mode-select{grid-column:1!important;}
  .vehicle-control-row.mock-row .mini-current-stepper.compact-current{grid-column:2!important;}
}



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
.status-strip.dashboard-status-strip .metric b,.status-strip.ops-status-strip .metric b{display:block;font-size:16px;font-weight:650;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
@media(max-width:760px){.status-strip.dashboard-status-strip,.status-strip.ops-status-strip{grid-template-columns:1fr!important;max-width:100%!important}.status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric{border-right:0!important;border-bottom:1px solid #E6ECF5!important}.status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child{border-bottom:0!important}}
${hbMobilitySharedShellStyles()}

    /* R22.10.3 charger capability guard and outcome renderer alignment */
    .domain-tabs-wrap{margin:6px 0 8px!important}
    .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{width:100%!important;max-width:none!important;margin:8px 0 10px!important}
    .section-title{margin-top:8px!important;margin-bottom:8px!important}
    /* R22.11.8 dynamic release footer. Backend version is runtime data from the Mobility release contract. */
    .hi-version-block{display:none!important}
    .hi-release-footer{display:flex;align-items:center;gap:8px;flex-wrap:wrap;width:100%;box-sizing:border-box;margin:8px 0 0;padding:8px 14px;border-top:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#53627A;font-size:11px;font-weight:500;line-height:1.2;white-space:normal;overflow:hidden}
    .hi-release-footer span+span::before{content:"•";margin-right:8px;color:#8A96AA}
    @media(max-width:760px){.hi-release-footer{font-size:10px;padding:8px 10px}}
    .page{gap:10px!important}

    /* R22.10.3 final dashboard enforcement: command framework + charge speed alignment */
    .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{
      display:grid!important;
      grid-template-columns:minmax(210px,1.28fr) minmax(124px,.74fr) minmax(136px,.78fr)!important;
      gap:7px!important;
      align-items:stretch!important;
      height:40px!important;
      overflow:visible!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current{
      grid-column:auto!important;
      height:40px!important;
      min-height:40px!important;
      flex:unset!important;
      display:grid!important;
      grid-template-columns:minmax(52px,1fr) 28px 28px!important;
      gap:5px!important;
      align-items:center!important;
      padding:0 7px!important;
      border-radius:12px!important;
      min-width:0!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current.readonly{
      grid-template-columns:minmax(52px,1fr)!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy{
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      align-items:flex-start!important;
      min-width:0!important;
      line-height:1.05!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy small{
      font-size:8px!important;
      line-height:1!important;
      color:#6A768D!important;
      margin:0 0 2px!important;
      white-space:nowrap!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy strong{
      font-size:13px!important;
      line-height:1!important;
      font-weight:600!important;
      color:#06142D!important;
      white-space:nowrap!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .round-step{
      width:28px!important;
      height:28px!important;
      min-width:28px!important;
      border-radius:11px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
    }
    .vehicle-actions.clean-actions{
      grid-template-columns:minmax(132px,1.05fr) minmax(124px,.95fr) minmax(106px,.82fr) minmax(0,1fr) 38px 38px!important;
      align-items:center!important;
    }
</style>
        ${hbMobilityReleaseFooter(rt)}
        </ha-card>`;
      this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn)=>btn.addEventListener("click",()=>rt.navigate(btn.getAttribute("data-nav"))));

      return;
    }

    const factory = new HomeBrainAssetFactory(rt);
    const adapter = factory.adapterFor(entry, this.config);
    if (!adapter) {
      this.shadowRoot.innerHTML = `<ha-card><div style="padding:24px">No adapter available for ${rt.escape(entry.asset_type)}</div></ha-card>`;
      return;
    }

    const sig = JSON.stringify({
      entry,
      assetId,
      lifecycle: rt.lifecycleStatus ? rt.lifecycleStatus(entry) : entry.lifecycle_state,
      properties: rt.propertyRows(assetId).map((p)=>[p.asset_id, p.property_key, p.value, p.health, p.write_supported, p.write_target_entity]),
      commands: rt.commandRegistry(assetId).map((c)=>[c.asset_id, c.command_id, c.command_key, c.frontend_allowed, c.execution_allowed, c.execution_status || ""]),
      intelligence: rt.intelligenceRowsFor ? rt.intelligenceRowsFor(assetId).map((r)=>[r.asset_id, r.cluster_id || r.cluster || r.key, r.summary || r.message || r.value, r.severity || ""]) : []
    });
    if (sig !== this._lastSignature) {
      this._lastSignature = sig;
      const model = adapter.build();
      model.backPath = this.config.dashboard_path || "/mobility-supervisor/dashboard";
      model.backLabel = "← Back to Dashboard";
      new HomeBrainAssetShell(this.shadowRoot, rt).render(model);
    }
  
    } catch (err) {
      console.error("HomeBrain Mobility asset detail render failed", err);
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const msg = String((err && (err.stack || err.message)) || err || "Unknown detail render error").replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
      this.shadowRoot.innerHTML = `<ha-card><div style="font-family:inherit;margin:24px auto;width:min(100%,1100px);padding:28px;border:1px solid #F3B7B7;border-radius:22px;background:#FFF7F7;color:#061226;box-shadow:0 18px 48px rgba(80,15,15,.08)"><h2>Asset detail temporarily unavailable</h2><p>The selected Mobility asset could not render safely.</p><pre style="white-space:pre-wrap;font-size:12px">${msg}</pre><button data-back style="border:1px solid #DDE6F2;background:#fff;border-radius:12px;padding:10px 14px;font-weight:600">← Back to Dashboard</button></div></ha-card>`;
      this.shadowRoot.querySelector('[data-back]')?.addEventListener('click', () => { try { history.pushState(null, '', (this.config && this.config.dashboard_path) || '/mobility-supervisor/dashboard'); window.dispatchEvent(new Event('location-changed')); } catch(e) {} });
    }
  }

  getCardSize() { return 12; }
}

if (!customElements.get("homebrain-mobility-asset-detail-card")) {
  customElements.define("homebrain-mobility-asset-detail-card", HomeBrainMobilityAssetDetailCard);
}
window.customCards.push({
  type: "homebrain-mobility-asset-detail-card",
  name: "Home Brain Mobility Generic Asset Detail Card",
  description: "R21.6 generic registry-driven asset detail card."
});

console.info(`Home Intelligence Mobility UX bundle loaded ${UX_VERSION}; backend version is read from the Mobility release contract at runtime.`);
