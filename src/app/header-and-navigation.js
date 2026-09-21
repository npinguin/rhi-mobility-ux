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

const UX_VERSION = "__RHI_UX_VERSION__";
const HB_MOBILITY_COMPANY_LOGO_SVG = "__RHI_COMPANY_LOGO_INLINE__";

const HB_MOBILITY_BASE_PATH = "/mobility-supervisor";

const HB_MOBILITY_MODULES = [
  {
    key: "mobility",
    label: "Mobility",
    icon: "mdi:car-electric",
    path: "/overview",
    items: [
      { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline", path: "/overview" },
      { key: "vehicles", label: "Vehicles", icon: "mdi:car-outline", path: "/dashboard" },
      { key: "chargers", label: "Chargers", icon: "mdi:ev-station", path: "/charger-maintenance" },
      { key: "charging", label: "Charging", icon: "mdi:lightning-bolt-outline", path: "/charging" }
    ]
  },
  {
    key: "intelligence",
    label: "Intelligence",
    icon: "mdi:brain",
    path: "/planning",
    items: [
      { key: "planning", label: "Planning", icon: "mdi:calendar-clock-outline", path: "/planning" },
      { key: "strategies", label: "Strategies", icon: "mdi:target", path: "/strategies" }
    ]
  },
  {
    key: "insights",
    label: "Insights",
    icon: "mdi:chart-bar",
    path: "/history",
    items: [
      { key: "history", label: "History", icon: "mdi:chart-timeline-variant", path: "/history" },
      { key: "log", label: "Log", icon: "mdi:format-list-bulleted", path: "/log" }
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
  return `<div class="hi-company-brand" aria-label="Robotix.be · DomotiX · Network · Security">
    <span class="hi-company-logo" role="img" aria-label="Robotix.be — DomotiX · Network · Security">${HB_MOBILITY_COMPANY_LOGO_SVG}</span>
  </div>`;
}

function hbMobilityNav(active = "overview") {
  const module = hbMobilityModuleFor(active);
  return `<header class="hi-domain-shell hi-nav-${module.key}">
    <div class="hi-product-area">
      <div class="hi-domain-shell-top">
        <div class="hi-domain-identity" aria-label="Home Intelligence Mobility">
          <span>Home Intelligence</span>
          <strong>MOBILITY</strong>
        </div>
        <nav class="hi-module-tabs" aria-label="Home Intelligence modules">
          ${HB_MOBILITY_MODULES.map((entry) => `<button type="button" class="hi-module-tab ${entry.key === module.key ? "active" : ""}" data-nav="${hbMobilityPath(entry.path)}" title="${entry.label}"><ha-icon icon="${entry.icon}"></ha-icon><span>${entry.label}</span></button>`).join("")}
        </nav>
      </div>
      <div class="hi-domain-shell-bottom">
        <nav class="domain-tabs" aria-label="${module.label} navigation">
          ${module.items.map((tab) => `<button type="button" class="domain-tab ${tab.key === active ? "active" : ""}" data-nav="${hbMobilityPath(tab.path)}" title="${tab.label}"><ha-icon class="domain-tab-icon" icon="${tab.icon}"></ha-icon><span>${tab.label}</span></button>`).join("")}
        </nav>
      </div>
    </div>
    ${hbMobilityCompanyBrand()}
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
  const contract = rel.contract_version || "Unknown";
  const details = [];
  let severity = "";
  try {
    const summary = rt && rt.runtimeHealthSummary ? rt.runtimeHealthSummary() : null;
    if (backend === "Unknown") {
      severity = "error";
      details.push("Backend release contract unavailable.");
    }
    if (summary) {
      const status = String(summary.status || "Unknown").toUpperCase();
      if (status === "BLOCKED") {
        severity = "error";
        details.push("Canonical Mobility runtime health reports failure.");
      } else if (status === "DEGRADED") {
        if (!severity) severity = "warning";
        details.push("Canonical Mobility runtime health reports degradation.");
      } else if (!["OK","HEALTHY"].includes(status)) {
        if (!severity) severity = "warning";
        details.push("Canonical Mobility runtime health is unavailable.");
      }

      const physical = String(summary.physical_acceptance || "Unknown");
      const releaseAcceptance = String(summary.release_acceptance || "Unknown");
      if (["NOT_PROVEN","PENDING","UNKNOWN"].includes(physical.toUpperCase())) {
        if (!severity) severity = "warning";
        details.push("Physical execution proof pending.");
      }
      if (["NOT_PROVEN","PENDING","UNKNOWN"].includes(releaseAcceptance.toUpperCase())) {
        if (!severity) severity = "warning";
        details.push("Release acceptance proof pending.");
      }
      if (summary.diagnostic_bad_count) {
        if (!severity) severity = "warning";
        const rows = (summary.diagnostics || []).filter((row) => row.bad).slice(0, 5);
        details.push(`Diagnostics: ${summary.diagnostic_status || "degraded"}.`);
        rows.forEach((row) => details.push(`${row.label || "Diagnostic"}: ${row.state || "Unknown"}.`));
      }
    }
  } catch (e) {
    if (!severity) severity = "warning";
    details.push("Runtime diagnostics unavailable.");
  }

  const issueDetails = details.length ? `
    <details class="rhiUxFooterDetails">
      <summary class="rhiUxFooterIssue ${severity || "warning"}">${severity === "error" ? "Runtime issue" : `${details.length} issue${details.length === 1 ? "" : "s"}`} · details</summary>
      <div class="rhiUxFooterPanel" role="status">
        <div class="rhiUxFooterPanelMeta">Backend ${esc(backend)} · Contract ${esc(contract)}</div>
        ${details.map((line) => `<div class="rhiUxFooterProblem"><span class="rhiUxFooterProblemDot" aria-hidden="true"></span><span>${esc(line)}</span></div>`).join("")}
        <div class="rhiUxFooterAction">Resolve the listed runtime/backend condition, then reload this view to verify recovery.</div>
      </div>
    </details>` : "";

  return `<footer class="rhiUxFooter" aria-label="RHI Mobility release information"><span>RHI Mobility UX ${esc(UX_VERSION)}</span><span>Backend ${esc(backend)}</span>${issueDetails}</footer>`;
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

    .hi-domain-shell{
      --nav-active-bg:#edf5ff;
      --nav-active-border:#cfdef1;
      --nav-active-text:#0f4ca4;
      --rhi-company-area-min:250px;
      --rhi-company-area-max:320px;
      --rhi-company-logo-max-width:286px;
      --rhi-company-logo-max-height:116px;
      --rhi-company-logo-padding:10px 16px;
      --rhi-company-divider:rgba(226,232,240,.82);
      position:relative;
      display:grid;
      grid-template-columns:minmax(0,1fr) minmax(var(--rhi-company-area-min),var(--rhi-company-area-max));
      gap:0;
      width:100%;
      box-sizing:border-box;
      margin:0 0 12px;
      background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(249,251,254,.91));
      border:1px solid rgba(207,217,230,.86);
      border-radius:22px;
      box-shadow:0 12px 30px rgba(15,23,42,.045);
      overflow:hidden;
      color:var(--hi-ink);
      backdrop-filter:blur(16px);
    }
    .hi-domain-shell.hi-nav-intelligence{--nav-active-bg:#f1edff;--nav-active-border:#dfd5fb;--nav-active-text:#5a38b3}
    .hi-domain-shell.hi-nav-insights{--nav-active-bg:#e7f7f4;--nav-active-border:#cdebe6;--nav-active-text:#176e67}

    .hi-product-area{min-width:0}
    .hi-domain-shell-top{
      min-height:78px;
      display:grid;
      grid-template-columns:minmax(270px,.72fr) minmax(430px,1.28fr);
      align-items:center;
      gap:24px;
      padding:10px 22px 9px;
    }
    .hi-domain-identity{display:grid;align-content:center;gap:2px;min-width:0;min-height:56px;padding:2px 0 0 4px}
    .hi-domain-identity span{font-size:15px;line-height:1.1;font-weight:520;letter-spacing:-.01em;color:#58708f;white-space:nowrap}
    .hi-domain-identity strong{font-size:24px;line-height:1.02;letter-spacing:.055em;font-weight:790;color:#0b467f;white-space:nowrap}

    .hi-module-tabs,.domain-tabs{
      display:flex;
      align-items:center;
      overflow-x:auto;
      overflow-y:hidden;
      white-space:nowrap;
      scrollbar-width:none;
      -webkit-overflow-scrolling:touch;
      overscroll-behavior-inline:contain;
    }
    .hi-module-tabs::-webkit-scrollbar,.domain-tabs::-webkit-scrollbar{display:none}
    .hi-module-tabs{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:0;background:transparent;border:0;border-radius:0;max-width:100%}
    .hi-module-tab{
      appearance:none;
      min-height:50px;
      border:0;
      border-radius:15px;
      background:transparent;
      padding:10px 20px;
      font:inherit;
      font-size:13px;
      font-weight:660;
      color:#53647d;
      cursor:pointer;
      white-space:nowrap;
      display:flex;
      align-items:center;
      gap:10px;
      transition:background .15s ease,color .15s ease,box-shadow .15s ease;
    }
    .hi-module-tab ha-icon{--mdc-icon-size:22px;color:currentColor}
    .hi-module-tab:hover{background:#f8fafc;color:#2f3f56}
    .hi-module-tab.active{background:var(--nav-active-bg);color:var(--nav-active-text);box-shadow:inset 0 0 0 1px var(--nav-active-border),0 6px 16px rgba(15,23,42,.035)}

    .hi-domain-shell-bottom{
      margin:0;
      padding:7px 22px 9px;
      border:0;
      border-top:1px solid rgba(226,232,240,.82);
      border-radius:0;
      background:rgba(255,255,255,.52);
      box-shadow:none;
      backdrop-filter:none;
      min-height:52px;
      box-sizing:border-box;
    }
    .domain-tabs{gap:10px;width:100%;min-height:34px}
    .domain-tab{
      appearance:none;
      flex:0 0 auto;
      min-height:34px;
      border:0;
      border-radius:11px;
      background:transparent;
      padding:7px 12px;
      font:inherit;
      font-size:11px;
      font-weight:600;
      color:#5f6d80;
      cursor:pointer;
      white-space:nowrap;
      display:flex;
      align-items:center;
      gap:6px;
      transition:background .15s ease,color .15s ease,box-shadow .15s ease;
    }
    .domain-tab-icon{--mdc-icon-size:13px;color:#7a8798;flex:0 0 13px}
    .domain-tab:hover{background:#f8fafc;color:#425269}
    .domain-tab:hover .domain-tab-icon{color:#66758a}
    .domain-tab.active{background:var(--nav-active-bg);color:var(--nav-active-text);box-shadow:inset 0 0 0 1px var(--nav-active-border)}
    .domain-tab.active .domain-tab-icon{color:#718096}

    .hi-company-brand{
      min-width:0;
      border-left:1px solid var(--rhi-company-divider);
      display:grid;
      place-items:center;
      padding:var(--rhi-company-logo-padding);
      background:linear-gradient(180deg,rgba(252,254,255,.78),rgba(247,250,253,.58));
    }
    .hi-company-logo{
      display:block;
      width:min(100%,var(--rhi-company-logo-max-width));
      max-height:var(--rhi-company-logo-max-height);
      line-height:0;
      overflow:hidden;
    }
    .hi-company-logo svg{
      display:block;
      width:100%;
      height:auto;
      max-height:var(--rhi-company-logo-max-height);
      object-fit:contain;
      object-position:center;
      filter:none;
      image-rendering:auto;
    }

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
    .section-title{margin-top:4px!important;margin-bottom:8px!important}
    .hi-version-block{display:none!important}
    .rhiUxFooter{display:flex!important;justify-content:center!important;align-items:center!important;flex-wrap:wrap!important;gap:5px 10px!important;margin:10px 3px 0!important;padding:7px 4px!important;border:0!important;background:transparent!important;color:#64748b!important;font-size:11px!important;font-weight:520!important;line-height:1.35!important;opacity:1!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
    .rhiUxFooter>span+span:before{content:"·";margin-right:10px;color:#cbd5e1}
    .rhiUxFooterDetails{position:relative!important;margin:0!important}
    .rhiUxFooterDetails>summary{list-style:none!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;gap:4px!important;white-space:nowrap!important}
    .rhiUxFooterDetails>summary::-webkit-details-marker{display:none}
    .rhiUxFooterDetails>summary:after{content:"▾";font-size:9px;color:currentColor}
    .rhiUxFooterDetails[open]>summary:after{content:"▴"}
    .rhiUxFooterIssue{font-weight:700!important}
    .rhiUxFooterIssue.warning{color:#9a6700!important}
    .rhiUxFooterIssue.error{color:#b42318!important}
    .rhiUxFooterPanel{flex-basis:100%;width:min(720px,calc(100vw - 48px));box-sizing:border-box;margin:7px auto 2px;padding:10px 12px;border:1px solid #dbe5f0;border-radius:10px;background:#fff;color:#334155;font-size:11px;line-height:1.4;box-shadow:0 8px 20px rgba(15,23,42,.06)}
    .rhiUxFooterPanelMeta{font-size:10px;font-weight:650;color:#64748b;margin-bottom:6px}
    .rhiUxFooterProblem{display:grid;grid-template-columns:8px minmax(0,1fr);gap:7px;align-items:start;padding:3px 0}
    .rhiUxFooterProblemDot{width:6px;height:6px;margin-top:5px;border-radius:50%;background:#d97706}
    .rhiUxFooterAction{margin-top:7px;padding-top:7px;border-top:1px solid #eef2f7;color:#475569;font-weight:600}

    @media(max-width:1180px){
      .hi-domain-shell{--rhi-company-area-min:220px;--rhi-company-area-max:250px;--rhi-company-logo-max-width:220px;--rhi-company-logo-max-height:94px;--rhi-company-logo-padding:8px 12px}
      .hi-domain-shell-top{grid-template-columns:minmax(205px,.56fr) minmax(0,1.44fr);gap:12px;padding-inline:16px}
      .hi-module-tabs{gap:6px}
      .hi-module-tab{padding:9px 8px;font-size:11.5px}
      .hi-domain-identity span{font-size:13.5px}
      .hi-domain-identity strong{font-size:21px}
      .hi-domain-shell-bottom{padding-inline:16px}
      .domain-tabs{gap:7px}
      .domain-tab{padding:7px 13px;font-size:11px}
      .hi-company-brand{padding-inline:12px}
    }
    @media(max-width:920px){
      .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{grid-template-columns:repeat(5,minmax(150px,1fr))!important;overflow-x:auto!important}
      .status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{min-width:150px!important}
    }
    @media(max-width:820px){
      .hi-domain-shell{--rhi-company-logo-max-width:126px;--rhi-company-logo-max-height:48px;display:block;border-radius:18px}
      .hi-product-area{min-width:0}
      .hi-company-brand{position:absolute;top:8px;right:10px;width:126px;height:48px;padding:0;border:0;background:transparent;pointer-events:none}
      .hi-company-logo{max-height:var(--rhi-company-logo-max-height)}
      .hi-domain-shell-top{display:grid;grid-template-columns:1fr;gap:7px;min-height:0;padding:10px 8px 7px}
      .hi-domain-identity{min-height:48px;padding:1px 138px 0 6px}
      .hi-domain-identity span{font-size:12.5px}
      .hi-domain-identity strong{font-size:19px}
      .hi-module-tabs{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
      .hi-module-tab{min-width:0;min-height:41px;justify-content:center;padding:7px 5px;font-size:10.5px;gap:6px}
      .hi-module-tab ha-icon{--mdc-icon-size:17px}
      .hi-domain-shell-bottom{padding:5px 8px 7px;min-height:48px}
      .domain-tabs{display:flex;overflow-x:auto;white-space:nowrap;gap:4px;min-height:35px}
      .domain-tab{min-height:35px;padding:6px 11px;font-size:10.5px}
      .placeholder-grid{grid-template-columns:1fr}
      .rhiUxFooter{font-size:10.5px!important;gap:4px 8px!important;padding:6px 3px!important}.rhiUxFooter>span+span:before{margin-right:8px!important}.rhiUxFooterPanel{width:min(100%,calc(100vw - 28px));font-size:10.5px}
    }
    @media(max-width:430px){
      .hi-domain-shell{--rhi-company-logo-max-width:102px;--rhi-company-logo-max-height:42px}
      .hi-company-brand{width:102px;right:8px}
      .hi-domain-identity{padding-right:112px}
      .hi-domain-identity strong{font-size:17px}
      .hi-module-tab{font-size:10px}
      .domain-tab{padding:6px 9px;font-size:10px}
    }
  `;
}
