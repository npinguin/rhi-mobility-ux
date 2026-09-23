// 95-placeholder-and-router-cards.js
// Routed Intelligence/Insights projections and generic asset detail cards.

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
    this.shadowRoot.innerHTML = `<ha-card><div class="page">
      ${hbMobilityNav(view)}
      ${hbMobilityPageHero(rt, view)}
      ${this.renderTopStatus(rt, view)}
      ${this.renderTopActions(rt, view)}
      ${view === "planning" ? this.renderPlanning(rt) : view === "strategies" ? this.renderStrategies(rt) : view === "history" ? this.renderInsights(rt) : this.renderContextCards(rt, data)}
      ${hbMobilityReleaseFooter(rt)}
    </div><style>${this.styles()}</style></ha-card>`;
    this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn)=>btn.addEventListener("click",()=>rt.navigate(btn.getAttribute("data-nav"))));
  }

  viewFromPath() {
    const path = String(window.location?.pathname || "").toLowerCase();
    if (path.includes("planning")) return "planning";
    if (path.includes("strategies")) return "strategies";
    if (path.includes("history")) return "history";
    if (path.includes("/log")) return "log";
    return "planning";
  }

  viewModel(view) {
    const models = {
      planning: {
        outcome: { opportunity: "planning", recommended_action: "review_plan" },
        cards: [
          { icon:"mdi:calendar-clock", kicker:"Planning", title:"Operational Planning", text:"Energy owns the planning truth. Mobility projects the published plan without recalculation." },
          { icon:"mdi:car-clock", kicker:"Readiness", title:"Vehicle Readiness", text:"Vehicle readiness and charging execution remain Mobility-owned and are shown alongside, not merged into, Energy planning semantics." }
        ]
      },
      strategies: {
        outcome: { opportunity: "strategy", recommended_action: "review_strategy" },
        cards: [
          { icon:"mdi:tune-variant", kicker:"Strategy", title:"Strategy Profiles", text:"Configured strategy intent is kept separate from the policy that is currently effective." },
          { icon:"mdi:shield-check-outline", kicker:"Effective", title:"Effective Strategy", text:"Energy-owned strategy state can be projected here without recreating strategy rules in Mobility UX." }
        ]
      },
      history: {
        outcome: { status: "Unknown", opportunity: "history", recommended_action: "none" },
        cards: [
          { icon:"mdi:history", kicker:"History", title:"Mobility History", text:"Historical executions, recommendations and outcomes remain a read-only Mobility insight." },
          { icon:"mdi:timeline-clock-outline", kicker:"Timeline", title:"Activity Timeline", text:"Time-ordered evidence stays backend-owned and is presented without frontend reinterpretation." }
        ]
      },
      log: {
        outcome: { status: "Unknown", opportunity: "audit", recommended_action: "none" },
        cards: [
          { icon:"mdi:text-box-search-outline", kicker:"Log", title:"Mobility Log", text:"Commands, runtime events and audit evidence remain available in one operational view." },
          { icon:"mdi:alert-outline", kicker:"Exceptions", title:"Exceptions", text:"Failed or rejected activity is surfaced with the backend-published reason when available." }
        ]
      }
    };
    return models[view] || models.planning;
  }

  energyPlanning(rt) {
    return new HomeBrainEnergyPlanningProjection(this._hass, rt).viewModel();
  }

  energyInsights(rt) {
    return new HomeBrainEnergyMobilityInsightsProjection(this._hass, rt).viewModel("today");
  }

  energyStrategies(rt) {
    return new HomeBrainEnergyMobilityStrategyProjection(this._hass, rt).viewModel();
  }

  fmtKwh(value) {
    return value === null || value === undefined ? "N/A" : `${Number(value).toFixed(1)} kWh`;
  }

  renderTopStatus(rt, view) {
    if (view === "planning") {
      const plan = this.energyPlanning(rt);
      return hbMobilityStatusGrid(rt, [
        { icon:"mdi:calendar-check-outline", label:"Planned today", value:this.fmtKwh(plan.today.plannedKwh), sub:plan.today.state || "Energy planning", tone:plan.available ? "ok" : "warn" },
        { icon:"mdi:calendar-alert-outline", label:"Still to plan", value:this.fmtKwh(plan.today.stillToPlanKwh), sub:"Published by Energy", tone:Number(plan.today.stillToPlanKwh || 0) > 0 ? "warn" : "ok" },
        { icon:"mdi:weather-sunset-up", label:"Tomorrow", value:this.fmtKwh(plan.tomorrow.plannedKwh), sub:plan.tomorrow.state || "Next horizon", tone:"neutral" },
        { icon:"mdi:source-branch-check", label:"Contract", value:plan.contractVersion || (plan.available ? "Published" : "Unavailable"), sub:plan.source, tone:plan.available ? "ok" : "warn" }
      ], "planning-top-status");
    }
    if (view === "strategies") {
      const strategy = this.energyStrategies(rt);
      return hbMobilityStatusGrid(rt, [
        { icon:"mdi:tune-variant", label:"Profiles", value:String(strategy.profiles.length), sub:"Energy strategy", tone:strategy.profilesAvailable ? "ok" : "warn" },
        { icon:"mdi:shield-check-outline", label:"Effective policies", value:String(strategy.effective.length), sub:"Exact Mobility assets", tone:strategy.effective.length ? "ok" : "neutral" },
        { icon:"mdi:source-branch-check", label:"Profile contract", value:strategy.profileContractVersion || (strategy.profilesAvailable ? "Published" : "Unavailable"), sub:"Energy-owned", tone:strategy.profilesAvailable ? "ok" : "warn" },
        { icon:"mdi:database-check-outline", label:"Policy contract", value:strategy.effectiveContractVersion || (strategy.effectiveAvailable ? "Published" : "Unavailable"), sub:"Energy-owned", tone:strategy.effectiveAvailable ? "ok" : "warn" }
      ], "strategies-top-status");
    }
    if (view === "history") {
      const insights = this.energyInsights(rt);
      return hbMobilityStatusGrid(rt, [
        { icon:"mdi:counter", label:"Vehicle energy", value:this.fmtKwh(insights.totalVehicleEnergyKwh), sub:"Energy metering", tone:insights.meteringAvailable ? "ok" : "warn" },
        { icon:"mdi:currency-eur", label:"Attributed value", value:insights.totalAttributedEur === null ? "N/A" : `€${Number(insights.totalAttributedEur).toFixed(2)}`, sub:"Energy accounting", tone:insights.valueAvailable ? "ok" : "warn" },
        { icon:"mdi:car-multiple", label:"Vehicles with evidence", value:String(insights.rows.length), sub:"Exact asset-id join", tone:insights.rows.length ? "ok" : "neutral" },
        { icon:"mdi:database-check-outline", label:"Source", value:"Energy", sub:"Metering + value", tone:"neutral" }
      ], "history-top-status");
    }
    return hbMobilityStatusGrid(rt, [
      { icon:"mdi:check-circle-outline", label:"Status", value:rt.supervisorOutcome("mobility", "status", "Unknown"), sub:"Mobility runtime", tone:"neutral" },
      { icon:"mdi:shield-check-outline", label:"Trust", value:rt.supervisorOutcome("mobility", "trust", "Unknown"), sub:"Contract-backed", tone:"neutral" },
      { icon:"mdi:alert-circle-outline", label:"Attention", value:rt.supervisorOutcome("mobility", "attention", "None"), sub:"Backend-published", tone:String(rt.supervisorOutcome("mobility", "attention", "None")).toLowerCase()==="none" ? "ok" : "warn" },
      { icon:"mdi:history", label:"Activity", value:"Read-only", sub:"Audit evidence", tone:"neutral" }
    ], "log-top-status");
  }

  renderTopActions(rt, view) {
    const actions = {
      planning: [
        { icon:"mdi:target", label:"Strategies", path:hbMobilityPath("/strategies"), primary:true },
        { icon:"mdi:car-electric", label:"Vehicles", path:hbMobilityPath("/dashboard") },
        { icon:"mdi:ev-station", label:"Chargers", path:hbMobilityPath("/charger-maintenance") },
        { icon:"mdi:chart-timeline-variant", label:"History", path:hbMobilityPath("/history") }
      ],
      strategies: [
        { icon:"mdi:calendar-clock", label:"Planning", path:hbMobilityPath("/planning"), primary:true },
        { icon:"mdi:car-electric", label:"Vehicles", path:hbMobilityPath("/dashboard") },
        { icon:"mdi:ev-station", label:"Chargers", path:hbMobilityPath("/charger-maintenance") },
        { icon:"mdi:chart-timeline-variant", label:"History", path:hbMobilityPath("/history") }
      ],
      history: [
        { icon:"mdi:format-list-bulleted", label:"Log", path:hbMobilityPath("/log"), primary:true },
        { icon:"mdi:car-electric", label:"Vehicles", path:hbMobilityPath("/dashboard") },
        { icon:"mdi:calendar-clock", label:"Planning", path:hbMobilityPath("/planning") },
        { icon:"mdi:target", label:"Strategies", path:hbMobilityPath("/strategies") }
      ],
      log: [
        { icon:"mdi:chart-timeline-variant", label:"History", path:hbMobilityPath("/history"), primary:true },
        { icon:"mdi:car-electric", label:"Vehicles", path:hbMobilityPath("/dashboard") },
        { icon:"mdi:ev-station", label:"Chargers", path:hbMobilityPath("/charger-maintenance") },
        { icon:"mdi:calendar-clock", label:"Planning", path:hbMobilityPath("/planning") }
      ]
    };
    return hbMobilityQuickActions(rt, actions[view] || actions.planning);
  }

  planningHeroMeta(rt) {
    const plan = this.energyPlanning(rt);
    const source = plan.available ? "Energy backend" : "Energy planning unavailable";
    const today = this.fmtKwh(plan.today.plannedKwh);
    const remaining = this.fmtKwh(plan.today.stillToPlanKwh);
    return `<strong>${rt.escape(source)}</strong><span>Planned today ${rt.escape(today)}</span><span>Still to plan ${rt.escape(remaining)}</span>`;
  }

  strategyHeroMeta(rt) {
    const strategy = this.energyStrategies(rt);
    const source = strategy.profilesAvailable || strategy.effectiveAvailable ? "Energy backend" : "Energy strategy unavailable";
    return `<strong>${rt.escape(source)}</strong><span>${rt.escape(String(strategy.profiles.length))} Mobility profiles</span><span>${rt.escape(String(strategy.effective.length))} effective policies</span>`;
  }

  insightsHeroMeta(rt) {
    const insights = this.energyInsights(rt);
    const energy = this.fmtKwh(insights.totalVehicleEnergyKwh);
    const value = insights.totalAttributedEur === null ? "N/A" : `€${Number(insights.totalAttributedEur).toFixed(2)}`;
    const source = insights.meteringAvailable || insights.valueAvailable ? "Energy backend" : "Energy Insights unavailable";
    return `<strong>${rt.escape(source)}</strong><span>Vehicle energy ${rt.escape(energy)}</span><span>Attributed value ${rt.escape(value)}</span>`;
  }

  renderPlanning(rt) {
    const plan = this.energyPlanning(rt);
    const mobilityRows = plan.mobilityPlanningRows.length ? plan.mobilityPlanningRows : plan.mobilityExperienceRows;
    const facts = [
      ["mdi:calendar-check-outline","Planned today",this.fmtKwh(plan.today.plannedKwh),plan.today.state || "Energy planning"],
      ["mdi:calendar-alert-outline","Still to plan",this.fmtKwh(plan.today.stillToPlanKwh),"Published by Energy"],
      ["mdi:weather-sunset-up","Tomorrow",this.fmtKwh(plan.tomorrow.plannedKwh),plan.tomorrow.state || "Next horizon"],
      ["mdi:source-branch-check","Contract",plan.contractVersion || (plan.available ? "Published" : "Unavailable"),plan.source]
    ];
    const rows = mobilityRows.slice(0, 8).map((row) => {
      const id = String(row.asset_id || row.target_asset_id || row.flexible_asset_id || row.consumer_asset_id || row.participant_id || "Mobility asset");
      const name = String(row.display_name || row.name || row.label || rt.assetDisplayName?.(id) || id);
      const state = String(row.planning_state || row.state || row.status || row.reason_label || "Published");
      return `<div class="rhi-data-row"><b>${rt.escape(name)}</b><span>${rt.escape(state)}</span></div>`;
    }).join("");
    const contractGap = plan.available
      ? (plan.exactIdentityJoin && !mobilityRows.length ? "Energy planning is available, but no published planning row currently matches a canonical Mobility asset id." : "")
      : "The Energy public planning contract is not available. Mobility does not reconstruct or estimate a plan.";

    return `<section class="rhi-context-grid">
      <article class="rhi-context-card">
        <div class="rhi-context-card-kicker"><ha-icon icon="mdi:calendar-clock"></ha-icon>Energy-owned planning</div>
        <h3>Operational charging plan</h3>
        <p>Mobility shows Energy's public planning truth directly. No charging schedule, totals or feasibility is recalculated in the frontend.</p>
        ${rows ? `<div class="rhi-data-list">${rows}</div>` : ""}
        ${contractGap ? `<div class="rhi-context-note">${rt.escape(contractGap)}</div>` : ""}
      </article>
      <article class="rhi-context-card">
        <div class="rhi-context-card-kicker"><ha-icon icon="mdi:car-clock"></ha-icon>Mobility execution context</div>
        <h3>Vehicle readiness</h3>
        <p>Readiness, charger assignment, connection state and Mobility commands remain Mobility-owned. Planning is shown next to that execution truth instead of being duplicated here.</p>
        <div class="rhi-data-list">
          <div class="rhi-data-row"><b>Planning source</b><span>${rt.escape(plan.source)}</span></div>
          <div class="rhi-data-row"><b>Matched Mobility assets</b><span>${rt.escape(String(mobilityRows.length))}</span></div>
          <div class="rhi-data-row"><b>Plan state</b><span>${rt.escape(plan.state || "Unavailable")}</span></div>
        </div>
      </article>
    </section>`;
  }

  renderStrategies(rt) {
    const strategy = this.energyStrategies(rt);
    const profileRows = strategy.profiles.map((row) => {
      const objective = String(row.objective_mode || row.mode || row.energy_control_mode || row.grid_policy || row.user_summary_label || "Configured");
      return `<div class="rhi-data-row"><b>${rt.escape(row.profile_label || row.profile_id)}</b><span>${rt.escape(objective)}</span></div>`;
    }).join("");
    const effectiveRows = strategy.effective.map((row) => {
      const assetId = String(row.asset_id || "");
      const name = String(row.display_name || row.asset_label || rt.assetDisplayName?.(assetId) || assetId);
      const state = String(row.effective_state || row.configured_state || row.influence_state || row.reason_label || row.policy_id || "Published");
      return `<div class="rhi-data-row"><b>${rt.escape(name)}</b><span>${rt.escape(state)}</span></div>`;
    }).join("");
    const unavailable = !strategy.profilesAvailable && !strategy.effectiveAvailable
      ? "Energy strategy contracts are unavailable. Mobility does not invent a strategy or infer one from charging behavior."
      : "";
    return `<section class="rhi-context-grid">
      <article class="rhi-context-card">
        <div class="rhi-context-card-kicker"><ha-icon icon="mdi:tune-variant"></ha-icon>Configured intent</div>
        <h3>Mobility energy profiles</h3>
        <p>Relevant Energy strategy profiles are shown read-only here. Profile meaning and editable strategy settings remain owned by Energy.</p>
        ${profileRows ? `<div class="rhi-data-list">${profileRows}</div>` : ""}
        ${unavailable ? `<div class="rhi-context-note">${rt.escape(unavailable)}</div>` : ""}
      </article>
      <article class="rhi-context-card">
        <div class="rhi-context-card-kicker"><ha-icon icon="mdi:shield-check-outline"></ha-icon>Effective strategy</div>
        <h3>What is in effect</h3>
        <p>Effective policy is filtered to exact Mobility asset ids so vehicle/charger behavior is not confused with unrelated Energy domains.</p>
        ${effectiveRows ? `<div class="rhi-data-list">${effectiveRows}</div>` : `<div class="rhi-context-note">No effective Mobility policy is currently published by Energy.</div>`}
      </article>
    </section>`;
  }

  renderInsights(rt) {
    const insights = this.energyInsights(rt);
    const rows = insights.rows.map((row) => {
      const energy = this.fmtKwh(row.energyKwh);
      const value = row.attributedEur === null ? "N/A" : `€${Number(row.attributedEur).toFixed(2)}`;
      const quality = row.measurementState || row.trustState || "UNAVAILABLE";
      return `<article class="rhi-insight-vehicle">
        <div class="rhi-insight-vehicle-head"><div><small>VEHICLE</small><h3>${rt.escape(row.name)}</h3></div><span>${rt.escape(quality)}</span></div>
        <div class="rhi-insight-metrics">
          <div><small>Measured energy</small><b>${rt.escape(energy)}</b></div>
          <div><small>Attributed value</small><b>${rt.escape(value)}</b></div>
        </div>
      </article>`;
    }).join("");
    const gap = (!insights.meteringAvailable && !insights.valueAvailable)
      ? "Energy metering and value contracts are unavailable. Mobility does not estimate vehicle energy or financial value."
      : (!rows ? "Energy is available, but no published metering/value record currently matches a canonical Mobility vehicle id." : "");
    return `<section class="rhi-context-grid insights-grid">
      <article class="rhi-context-card rhi-insights-wide">
        <div class="rhi-context-card-kicker"><ha-icon icon="mdi:chart-timeline-variant"></ha-icon>Measured Mobility</div>
        <h3>Vehicle energy & value</h3>
        <p>Per-vehicle energy and financial attribution come directly from Energy public UX contracts. Mobility only joins them by canonical asset id.</p>
        ${rows ? `<div class="rhi-insight-vehicle-list">${rows}</div>` : ""}
        ${gap ? `<div class="rhi-context-note">${rt.escape(gap)}</div>` : ""}
      </article>
      <article class="rhi-context-card">
        <div class="rhi-context-card-kicker"><ha-icon icon="mdi:history"></ha-icon>Mobility evidence</div>
        <h3>Execution history</h3>
        <p>Commands, readiness transitions and vehicle/charger execution remain Mobility-owned. Energy measurements complement that history; they do not replace it.</p>
        <div class="rhi-data-list">
          <div class="rhi-data-row"><b>Metering contract</b><span>${rt.escape(insights.meteringContractVersion || (insights.meteringAvailable ? "Published" : "Unavailable"))}</span></div>
          <div class="rhi-data-row"><b>Value contract</b><span>${rt.escape(insights.valueContractVersion || (insights.valueAvailable ? "Published" : "Unavailable"))}</span></div>
          <div class="rhi-data-row"><b>Value state</b><span>${rt.escape(insights.valueState)}</span></div>
        </div>
      </article>
    </section>`;
  }

  renderContextCards(rt, data) {
    return `<section class="rhi-context-grid">
      ${data.cards.map((card) => `<article class="rhi-context-card"><div class="rhi-context-card-kicker"><ha-icon icon="${card.icon}"></ha-icon>${rt.escape(card.kicker)}</div><h3>${rt.escape(card.title)}</h3><p>${rt.escape(card.text)}</p></article>`).join("")}
    </section>`;
  }

  renderSupportFacts(rt, view) {
    const plan = view === "planning" ? this.energyPlanning(rt) : null;
    const chargingPlan = plan ? (plan.available ? (plan.today.state || "Published") : "Unavailable") : rt.supervisorOutcome("mobility", "opportunity", "Supervised");
    return `<section class="rhi-fact-grid support-facts">
      <div class="rhi-fact"><ha-icon icon="mdi:calendar-clock"></ha-icon><div><small>Charging plan</small><b>${rt.escape(chargingPlan)}</b><span>${view === "planning" ? "Energy backend" : "Mobility context"}</span></div></div>
      <div class="rhi-fact"><ha-icon icon="mdi:shield-check-outline"></ha-icon><div><small>System trust</small><b>${rt.escape(rt.supervisorOutcome("mobility", "trust", "Unknown"))}</b><span>Mobility runtime</span></div></div>
      <div class="rhi-fact"><ha-icon icon="mdi:history"></ha-icon><div><small>Recent activity</small><b>Read-only</b><span>No frontend inference</span></div></div>
      <div class="rhi-fact"><ha-icon icon="mdi:database-check-outline"></ha-icon><div><small>Data policy</small><b>Contract-backed</b><span>Fail closed</span></div></div>
    </section>`;
  }

  styles() {
    return `:host{display:block;width:100%;box-sizing:border-box;font-family:inherit}ha-card{background:transparent;box-shadow:none;border:none}
      ${hbMobilityPresentationStyles()}
      ${hbMobilitySharedShellStyles()}
      .page{position:relative}
      .status-strip.dashboard-status-strip{margin:8px 0 10px!important}
      .support-facts{margin-top:8px!important}
      .insights-grid{grid-template-columns:minmax(0,1.45fr) minmax(280px,.55fr)}
      .rhi-insight-vehicle-list{display:grid;gap:7px;margin-top:10px}
      .rhi-insight-vehicle{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;border:1px solid #edf1f6;border-radius:var(--rhi-radius-md);background:var(--rhi-soft);padding:10px 12px}
      .rhi-insight-vehicle-head{min-width:0;display:flex;align-items:center;justify-content:space-between;gap:8px}.rhi-insight-vehicle-head small{font-size:8.5px;letter-spacing:.09em;color:#718096}.rhi-insight-vehicle-head h3{margin:1px 0 0;font-size:13px}.rhi-insight-vehicle-head>span{font-size:9px;color:#64748b}
      .rhi-insight-metrics{display:grid;grid-template-columns:repeat(2,minmax(95px,1fr));gap:6px}.rhi-insight-metrics>div{padding:6px 8px;border-left:1px solid #e4eaf2}.rhi-insight-metrics small{display:block;font-size:8.5px;color:#718096}.rhi-insight-metrics b{display:block;margin-top:2px;font-size:12px;color:var(--rhi-ink)}
      @media(max-width:900px){.insights-grid{grid-template-columns:1fr}.rhi-insight-vehicle{grid-template-columns:1fr}.rhi-insight-metrics>div:first-child{border-left:0}}
      @media(max-width:520px){.rhi-insight-metrics{grid-template-columns:1fr 1fr}.rhi-insight-vehicle{padding:9px 10px}}
      @media(max-width:760px){.status-strip.dashboard-status-strip{grid-template-columns:repeat(5,minmax(150px,1fr))!important;overflow-x:auto!important}.status-strip.dashboard-status-strip .metric{min-width:150px!important}}
    `;
  }
}
if (!customElements.get("homebrain-mobility-placeholder-card")) {
  customElements.define("homebrain-mobility-placeholder-card", HomeBrainMobilityPlaceholderCard);
}
window.customCards.push({
  type: "homebrain-mobility-placeholder-card",
  name: "Home Brain Mobility Intelligence and Insights",
  description: "Contract-backed Mobility Intelligence and Insights projections."
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

    const activeDetailControl = this.shadowRoot?.activeElement;
    if (activeDetailControl?.closest?.(".detail-vehicle-picker,.detail-charger-picker")) return;

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
