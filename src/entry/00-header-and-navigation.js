// 00-header-and-navigation.js
// Constants, navigation shell helpers and shared shell styles.

/**
 * Home Brain Mobility Assets Bundle
 * Release version is defined by UX_VERSION below and package.json.
 *
 * Purpose:
 * - Provides the bundled frontend custom elements for the Mobility domain.
 * - Keeps the YAML thin: dashboard pages mount custom cards, while this bundle owns registry parsing,
 *   asset grouping, route generation, detail rendering, empty states and safe action rendering.
 *
 * Architecture boundaries:
 * - Backend owns consumer-facing public indexes. The frontend consumes them only through HomeBrainAssetRuntime; asset registry and reverse relationship matching are forbidden for dashboard runtime rendering.
 * - Frontend owns presentation and generated navigation only. It must not require detail_route in backend.
 * - Command placement comes from command-slot contracts; readiness/execution metadata comes from the canonical Command Index; execution uses the canonical Mobility command ingress.
 *
 * R22.12.11.30 charger contract materialization closure:
 * - Uses one shared charger product snapshot for overview and detail: operating_state, connection_state, power_kw, health/health_reason and physical connected vehicle.
 * - Consumes only R43.2.54 charger_actions.commands / vehicle_actions.commands for normal command placement and preserves backend order.
 * - Renders every frontend-allowed backend-placed command exactly once on desktop and mobile; responsive CSS may wrap but never suppress actions.
 * - Uses mobility_command_index exclusively for readiness, blocked reason and invoke metadata; no status/power/capability-derived readiness.
 * - Removes product lifecycle fallback to deprecated aggregate runtime publications; missing lifecycle is a contract gap.
 * - Removes frontend kW↔A/phase synchronization and secondary writes; editable properties write only their own backend-owned property binding.
 * - Centralizes property writes in HomeBrainAssetRuntime instead of constructing service payloads in cards.
 * - Keeps runtime health separate from physical/release acceptance in the release footer.
 * - HACS migration baseline: single self-contained rhi-mobility-ux.js; no /local runtime dependency
 */
/*
Robotix Home Intelligence Mobility UX

Defines:
- custom:homebrain-vehicle-asset-detail-card
- custom:homebrain-charger-asset-detail-card

Internal structure:
- HomeBrainAssetRuntime: shared HA/entity helpers
- HomeBrainAssetShell: generic asset detail shell
- HomeBrainVehicleAdapter: vehicle contract mapping
- HomeBrainChargerAdapter: charger contract mapping
*/

const UX_VERSION = "1.0.0-rc.8";

const HB_MOBILITY_BASE_PATH = "/mobility-supervisor";

const HB_MOBILITY_MODULES = [
  {
    key: "mobility",
    label: "Mobility",
    icon: "mdi:car-electric",
    path: "/overview",
    items: [
      { key: "overview", label: "Overview", path: "/overview" },
      { key: "vehicles", label: "Vehicles", path: "/dashboard" },
      { key: "chargers", label: "Chargers", path: "/charger-maintenance" },
      { key: "charging", label: "Charging", path: "/charging" }
    ]
  },
  {
    key: "intelligence",
    label: "Intelligence",
    icon: "mdi:brain",
    path: "/planning",
    items: [
      { key: "planning", label: "Planning", path: "/planning" },
      { key: "strategies", label: "Strategies", path: "/strategies" }
    ]
  },
  {
    key: "insights",
    label: "Insights",
    icon: "mdi:chart-bar",
    path: "/history",
    items: [
      { key: "history", label: "History", path: "/history" },
      { key: "log", label: "Log", path: "/log" }
    ]
  }
];

const HB_MOBILITY_NAV_ITEMS = HB_MOBILITY_MODULES.flatMap((module) =>
  module.items.map((item) => ({ ...item, module: module.key }))
);

function hbMobilityPath(path) {
  return `${HB_MOBILITY_BASE_PATH}${path}`;
}

function hbMobilityModuleFor(active = "overview") {
  const item = HB_MOBILITY_NAV_ITEMS.find((entry) => entry.key === active);
  return HB_MOBILITY_MODULES.find((module) => module.key === (item?.module || active))
    || HB_MOBILITY_MODULES[0];
}

function hbMobilityCompanyBrand() {
  // Official Robotix.be brand asset supplied by the product owner.
  return `<div class="hi-company-brand" aria-label="Robotix.be — DomotiX Network Security">
    <img class="hi-company-logo" src="${rhiMobilityAssetUrl("branding/robotix-logo.webp")}" alt="Robotix.be — DomotiX · Network · Security" />
  </div>`;
}

function hbMobilityNav(active = "overview") {
  const module = hbMobilityModuleFor(active);
  return `<header class="hi-domain-shell">
    <div class="hi-domain-shell-top">
      <div class="hi-domain-identity">
        <span>Home Intelligence</span>
        <strong>MOBILITY</strong>
      </div>
      <div class="hi-domain-divider" aria-hidden="true"></div>
      <nav class="hi-module-tabs" aria-label="Home Intelligence modules">
        ${HB_MOBILITY_MODULES.map((entry) => `<button type="button" class="hi-module-tab ${entry.key === module.key ? "active" : ""}" data-nav="${hbMobilityPath(entry.path)}" title="${entry.label}"><ha-icon icon="${entry.icon}"></ha-icon><span>${entry.label}</span></button>`).join("")}
      </nav>
      <div class="hi-company-divider" aria-hidden="true"></div>
      ${hbMobilityCompanyBrand()}
    </div>
    <div class="hi-domain-shell-bottom">
      <nav class="domain-tabs" aria-label="${module.label} navigation">
        ${module.items.map((tab) => `<button type="button" class="domain-tab ${tab.key === active ? "active" : ""}" data-nav="${hbMobilityPath(tab.path)}" title="${tab.label}"><span>${tab.label}</span></button>`).join("")}
      </nav>
    </div>
    <style>${hbMobilitySharedShellStyles()}</style>
  </header>`;
}

function hbMobilityTitleBlock(title = "Mobility", description = "Vehicle readiness, charging, comfort and security in one calm control cockpit.") {
  return `<section class="title"><p class="eyebrow">HOME INTELLIGENCE / MOBILITY</p><h1>${title}</h1><p>${description}</p></section>`;
}

function hbMobilityReleaseFooter(rt) {
  const esc = (v) => rt && rt.escape ? rt.escape(v) : String(v ?? "").replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
  const rel = rt && rt.releaseContract ? rt.releaseContract() : {};
  const backend = rel.backend_release || rel.backend_version || "Unknown";
  const contract = rel.contract_version && rel.contract_version !== "Unknown" ? ` · Contract ${rel.contract_version}` : "";
  const health = rel.contract_health && rel.contract_health !== "Unknown" ? ` · ${rel.contract_health}` : "";
  let runtimeNote = "";
  let acceptanceNote = "";
  let diagnosticsNote = "";
  try {
    const summary = rt && rt.runtimeHealthSummary ? rt.runtimeHealthSummary() : null;
    if (summary) {
      if (summary.status === "OK") runtimeNote = `<span class="hi-release-health trusted" title="Canonical Mobility runtime health is OK.">Runtime healthy</span>`;
      else if (summary.status === "DEGRADED") runtimeNote = `<span class="hi-release-health degraded" title="Canonical Mobility runtime health reports degradation.">Runtime degraded</span>`;
      else if (summary.status === "BLOCKED") runtimeNote = `<span class="hi-release-health blocking" title="Canonical Mobility runtime health reports failure.">Runtime failed</span>`;
      else runtimeNote = `<span class="hi-release-health degraded" title="Canonical Mobility runtime health is unavailable.">Runtime health unavailable</span>`;
      const physical = String(summary.physical_acceptance || "Unknown");
      const releaseAcceptance = String(summary.release_acceptance || "Unknown");
      const pendingPhysical = ["NOT_PROVEN","PENDING","UNKNOWN"].includes(physical.toUpperCase());
      const pendingRelease = ["NOT_PROVEN","PENDING","UNKNOWN"].includes(releaseAcceptance.toUpperCase());
      const parts = [];
      if (pendingPhysical) parts.push("Physical execution proof pending");
      else if (physical && physical !== "Unknown") parts.push(`Physical ${physical}`);
      if (pendingRelease) parts.push("Release acceptance pending");
      else if (releaseAcceptance && releaseAcceptance !== "Unknown") parts.push(`Release ${releaseAcceptance}`);
      if (parts.length) acceptanceNote = `<span class="hi-release-health degraded" title="Runtime health and acceptance proof are separate backend-owned states.">${parts.map(esc).join(" · ")}</span>`;
    }
    if (summary && summary.diagnostic_bad_count) {
      const rows = (summary.diagnostics || []).filter((r) => r.bad).slice(0, 3);
      diagnosticsNote = `<span class="hi-release-health degraded" title="Non-blocking diagnostics only.">Diagnostics: ${esc(summary.diagnostic_status)}${rows.length ? ` — ${rows.map((r)=>`${esc(r.label)} ${esc(r.state)}`).join(", ")}` : ""}</span>`;
    }
  } catch (e) { /* footer must never break the dashboard */ }
  return `<div class="hi-release-footer" title="Backend version is read from the Mobility release contract"><span>UX ${esc(UX_VERSION)}</span><span>Backend ${esc(backend)}</span><span>Source Mobility release contract${esc(contract)}${esc(health)}</span>${runtimeNote}${acceptanceNote}${diagnosticsNote}</div>`;
}

function hbMobilityOutcomeStrip(rt, contextId = "mobility", fallback = {}) {
  const esc = (v) => rt && rt.escape ? rt.escape(v) : String(v ?? "").replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
  const outcome = (field, fb) => (rt && rt.supervisorOutcome ? rt.supervisorOutcome(contextId, field, fb) : fb) || fb;
  const status = outcome("status", fallback.status || "OK");
  const trust = outcome("trust", fallback.trust || (rt && rt.backendVersion ? rt.backendVersion() : "Unknown"));
  const attention = outcome("attention", fallback.attention || "None");
  const opportunity = outcome("opportunity", fallback.opportunity || "None");
  const recommendation = outcome("recommended_action", fallback.recommended_action || "none");
  const items = [
    ["mdi:check-circle-outline", "Status", status, "green"],
    ["mdi:shield-check-outline", "Trust", trust, "blue"],
    ["mdi:alert-circle-outline", "Attention", attention, "orange"],
    ["mdi:lightbulb-outline", "Opportunity", opportunity, "green"],
    ["mdi:arrow-right-circle-outline", "Recommended action", recommendation, "blue"]
  ];
  return `<section class="status-strip dashboard-status-strip outcome-header">
    ${items.map(([icon,label,value,tone]) => `<div class="metric tone-${tone}"><ha-icon icon="${icon}"></ha-icon><div><span>${label}</span><b>${esc(value)}</b></div></div>`).join("")}
  </section>`;
}
function hbMobilitySharedShellStyles() {
  return `
    :host{
      --hi-primary:#1467F5;
      --hi-primary-soft:#EAF3FF;
      --hi-ink:#0F172A;
      --hi-muted:#64748B;
      --hi-line:#E2E8F0;
      --hi-surface:#FFFFFF;
      --hi-surface-soft:#F8FAFC;
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    }
    .hi-domain-shell{width:100%;box-sizing:border-box;margin:0 0 12px;border:1px solid #DCE6F2;border-radius:22px;background:linear-gradient(180deg,#fff 0%,#fbfdff 100%);box-shadow:0 14px 34px rgba(15,35,80,.055);overflow:hidden;color:var(--hi-ink)}
    .hi-domain-shell-top{min-height:92px;display:grid;grid-template-columns:minmax(220px,260px) 1px minmax(460px,1fr) 1px minmax(280px,320px);align-items:center;gap:22px;padding:12px 24px 8px}
    .hi-domain-identity{display:grid;align-content:center;line-height:1}
    .hi-domain-identity span{font-size:17px;font-weight:450;color:#4E6A91;letter-spacing:-.01em}
    .hi-domain-identity strong{font-size:34px;font-weight:760;letter-spacing:-.035em;color:#0C3F79;margin-top:4px}
    .hi-domain-divider,.hi-company-divider{width:1px;height:54px;background:#D7E1ED}
    .hi-module-tabs{display:flex;align-items:center;justify-content:flex-start;gap:20px;min-width:0}
    .hi-module-tab{appearance:none;border:0;background:transparent;min-height:58px;padding:0 24px;border-radius:18px;color:#3F587A;display:inline-flex;align-items:center;justify-content:center;gap:12px;font:inherit;font-size:17px;font-weight:560;cursor:pointer;white-space:nowrap;transition:background .15s ease,color .15s ease}
    .hi-module-tab ha-icon{--mdc-icon-size:27px;color:#345A88}
    .hi-module-tab:hover{background:#F4F8FE;color:#0F3F79}
    .hi-module-tab.active{background:#EAF3FF;color:#0961E7;font-weight:650}
    .hi-module-tab.active ha-icon{color:#0961E7}
    .hi-company-brand{justify-self:end;display:flex;align-items:center;justify-content:flex-end;min-width:220px;overflow:visible}
    .hi-company-logo{display:block;width:290px;max-width:100%;height:82px;object-fit:contain;object-position:right center;filter:none;image-rendering:auto}
    .hi-domain-shell-bottom{border-top:1px solid #E1E8F1;padding:6px 20px 10px}
    .domain-tabs{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;overflow-x:auto;scrollbar-width:none}
    .domain-tabs::-webkit-scrollbar{display:none}
    .domain-tab{appearance:none;border:0;background:transparent;color:#40587A;min-height:42px;padding:0 20px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font:inherit;font-size:15px;font-weight:560;cursor:pointer;white-space:nowrap;transition:background .15s ease,color .15s ease,box-shadow .15s ease}
    .domain-tab:hover{background:#F3F7FD;color:#0F3F79}
    .domain-tab.active{background:#EAF3FF;color:#0961E7;font-weight:650;box-shadow:inset 0 -3px 0 #0961E7}

    .placeholder-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .placeholder-card{background:#fff;border:1px solid #E8EEF7;border-radius:20px;padding:18px;box-shadow:0 16px 38px rgba(15,35,80,.07)}
    .placeholder-card h3{margin:0 0 8px;font-size:18px;color:#06142D}
    .placeholder-card p{margin:0;color:#66728B;font-size:13px;line-height:1.45}
    .placeholder-kicker{display:inline-flex;align-items:center;gap:8px;margin-bottom:10px;color:#1467F5;font-size:12px;font-weight:650;text-transform:uppercase;letter-spacing:.04em}
    .placeholder-kicker ha-icon{--mdc-icon-size:18px}
    .footer-note{margin-top:12px;color:#66728B;font-size:12px;font-weight:600}
    .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{width:100%!important;max-width:none!important;margin:8px 0 10px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;border:1px solid #E0E8F2!important;border-radius:16px!important;background:#fff!important;box-shadow:0 10px 24px rgba(15,35,80,.045)!important;overflow:hidden!important}
    .status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{display:grid!important;grid-template-columns:28px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;min-width:0!important;padding:12px 14px!important;border-right:1px solid #E8EEF6!important;background:transparent!important}
    .status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child,.outcome-header .metric:last-child{border-right:0!important}
    .status-strip.dashboard-status-strip .metric ha-icon,.status-strip.ops-status-strip .metric ha-icon,.outcome-header .metric ha-icon{--mdc-icon-size:20px}
    .status-strip.dashboard-status-strip .metric>div,.status-strip.ops-status-strip .metric>div,.outcome-header .metric>div{min-width:0}
    .status-strip.dashboard-status-strip .metric span,.status-strip.ops-status-strip .metric span,.outcome-header .metric span{display:block!important;font-size:9px!important;font-weight:600!important;line-height:1.1!important;color:#708098!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .status-strip.dashboard-status-strip .metric b,.status-strip.ops-status-strip .metric b,.outcome-header .metric b{display:block!important;margin-top:2px!important;font-size:12.5px!important;font-weight:650!important;line-height:1.15!important;color:#10213A!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .status-strip .tone-green>ha-icon{color:#16A765!important}.status-strip .tone-blue>ha-icon{color:#1467F5!important}.status-strip .tone-orange>ha-icon{color:#F59E0B!important}
    @media(max-width:920px){.status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{grid-template-columns:repeat(5,minmax(150px,1fr))!important;overflow-x:auto!important}.status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{min-width:150px!important}}
    .section-title{margin-top:4px!important;margin-bottom:8px!important}
    .hi-version-block{display:none!important}
    .hi-release-footer{display:flex;align-items:center;gap:8px;flex-wrap:wrap;width:100%;box-sizing:border-box;margin:8px 0 0;padding:8px 14px;border-top:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#53627A;font-size:11px;font-weight:500;line-height:1.2;white-space:normal;overflow:hidden}
    .hi-release-footer span+span::before{content:"•";margin-right:8px;color:#8A96AA}
    .hi-release-footer .hi-release-health{color:#6B7280;font-weight:650;opacity:.92}
    .hi-release-footer .hi-release-health.trusted{color:#2F6B4F}
    .hi-release-footer .hi-release-health.degraded{color:#8A5A00}
    .hi-release-footer .hi-release-health.blocking{color:#9A3412}
    .hi-release-footer .hi-release-health::before{content:"•";margin-right:8px;color:#C7A35A}

    @media(max-width:1100px){
      .hi-domain-shell-top{grid-template-columns:minmax(190px,240px) 1px 1fr;gap:16px;padding-right:18px}
      .hi-company-divider,.hi-company-brand{display:none}
      .hi-module-tabs{gap:8px;justify-content:flex-start}
      .hi-module-tab{padding:0 16px;font-size:15px}
    }
    @media(max-width:760px){
      .hi-domain-shell{border-radius:18px}
      .hi-domain-shell-top{min-height:76px;grid-template-columns:1fr auto;padding:10px 14px;gap:10px}
      .hi-domain-divider{display:none}
      .hi-domain-identity span{font-size:13px}
      .hi-domain-identity strong{font-size:27px}
      .hi-module-tabs{gap:4px}
      .hi-module-tab{min-height:44px;width:44px;padding:0;border-radius:13px}
      .hi-module-tab span{display:none}
      .hi-module-tab ha-icon{--mdc-icon-size:22px}
      .hi-domain-shell-bottom{padding:5px 10px 8px}
      .domain-tabs{gap:6px;min-height:44px}
      .domain-tab{font-size:13px;min-height:36px;padding:0 14px}
      .placeholder-grid{grid-template-columns:1fr}
      .hi-release-footer{font-size:10px;padding:8px 10px}
    }
  `;
}
