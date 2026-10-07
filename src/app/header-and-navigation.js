// Mobility presentation adapter onto the shared RHI UX Core.
// Domain semantics remain owned by Mobility runtime/projections.
const UX_VERSION = "__RHI_UX_VERSION__";
const HB_MOBILITY_ROUTE_SEGMENTS = new Set([
  "overview","dashboard","vehicles","charger-maintenance","chargers",
  "planning","strategies","history","log","asset-detail","detail","charging"
]);

function hbMobilityDashboardBase(pathname = "") {
  const raw = String(pathname || window.location?.pathname || "")
    .split("?")[0].split("#")[0].replace(/\/+$/, "");
  const parts = raw.split("/").filter(Boolean);
  if (!parts.length) return "";
  const last = String(parts[parts.length - 1] || "").toLowerCase();
  if (HB_MOBILITY_ROUTE_SEGMENTS.has(last) || /^\d+$/.test(last)) parts.pop();
  return parts.length ? `/${parts.join("/")}` : "";
}

const HB_MOBILITY_MODULES = Object.freeze([
  { key:"mobility", labelKey:"nav.mobility", fallback:"Mobility", path:"/overview", items:[
    { key:"overview", labelKey:"nav.overview", fallback:"Overview", path:"/overview" },
    { key:"vehicles", labelKey:"nav.vehicles", fallback:"Vehicles", path:"/dashboard" },
    { key:"chargers", labelKey:"nav.chargers", fallback:"Chargers", path:"/charger-maintenance" }
  ]},
  { key:"intelligence", labelKey:"nav.intelligence", fallback:"Intelligence", path:"/planning", items:[
    { key:"planning", labelKey:"nav.planning", fallback:"Planning", path:"/planning" },
    { key:"strategies", labelKey:"nav.strategies", fallback:"Strategies", path:"/strategies" }
  ]},
  { key:"insights", labelKey:"nav.insights", fallback:"Insights", path:"/history", items:[
    { key:"history", labelKey:"nav.history", fallback:"History", path:"/history" },
    { key:"log", labelKey:"nav.log", fallback:"Activity", path:"/log" }
  ]}
]);

const HB_MOBILITY_NAV_ITEMS = HB_MOBILITY_MODULES.flatMap(module =>
  module.items.map(item => ({ ...item, module:module.key }))
);

function hbMobilityPath(path = "", configuredBase = "") {
  const suffix = `/${String(path || "").replace(/^\/+/, "")}`;
  const root = hbMobilityDashboardBase(configuredBase || window.location?.pathname || "") || "/mobility-supervisor";
  return `${root}${suffix}`;
}

function hbMobilityModuleFor(active = "overview") {
  const item=HB_MOBILITY_NAV_ITEMS.find(entry => entry.key === active);
  return HB_MOBILITY_MODULES.find(module => module.key === (item?.module || active)) || HB_MOBILITY_MODULES[0];
}

function hbMobilityCoreModules(configuredBase = "", hass = null) {
  return HB_MOBILITY_MODULES.map(module => ({
    id:module.key,
    label:rhiMobilityT(hass,module.labelKey,{},module.fallback),
    target:hbMobilityPath(module.path, configuredBase),
    items:module.items.map(item => ({
      id:item.key,
      label:rhiMobilityT(hass,item.labelKey,{},item.fallback),
      target:hbMobilityPath(item.path, configuredBase)
    }))
  }));
}

function hbMobilityNav(active = "overview", configuredBase = "") {
  const module=hbMobilityModuleFor(active);
  return `<div class="rhiMobilityNav rhiMobilityNav-${rhiUxEscape(module.key)}">${rhiUxDomainShell({
    product:"Home Intelligence",
    domain:"MOBILITY",
    modules:hbMobilityCoreModules(configuredBase),
    activeModule:module.key,
    activeItem:active
  })}<style>${hbMobilitySharedShellStyles()}</style></div>`;
}

function hbMobilityTitleBlock(title = "", description = "") {
  const resolvedTitle=title || rhiMobilityT(null,"nav.mobility",{},"Mobility");
  const resolvedDescription=description || rhiMobilityT(null,"hero.overview.description",{},"See your mobility status and what needs attention.");
  return `<section class="title"><p class="eyebrow">${rhiUxEscape(rhiMobilityT(null,"shell.eyebrow",{},"HOME INTELLIGENCE / MOBILITY"))}</p><h1>${rhiUxEscape(resolvedTitle)}</h1><p>${rhiUxEscape(resolvedDescription)}</p></section>`;
}

function hbMobilityReleaseFooter(rt) {
  if (rt?.config?.show_diagnostics !== true) return "";
  const rel=rt && rt.releaseContract ? rt.releaseContract() : {};
  const backend=rel.backend_release || rel.backend_version || "Unknown";
  let issue="";
  let severity="";
  try {
    const summary=rt && rt.runtimeHealthSummary ? rt.runtimeHealthSummary() : null;
    const state=String(summary?.status || "").toUpperCase();
    if (backend === "Unknown") { issue="Backend unavailable"; severity="error"; }
    else if (["BLOCKED","INVALID"].includes(state)) { issue="Runtime issue"; severity="error"; }
    else if (["DEGRADED","STALE","UNKNOWN"].includes(state)) { issue="Runtime degraded"; severity="warning"; }
  } catch (_) { issue="Runtime health unavailable"; severity="warning"; }
  return rhiUxTechnicalFooter({ product:"RHI Mobility", uxVersion:UX_VERSION, backendVersion:backend, issue, severity });
}

function hbMobilityOutcomeStrip(rt, contextId = "mobility", fallback = {}) {
  const esc=(v)=>rt && rt.escape ? rt.escape(v) : rhiUxEscape(v);
  const read=(field, fallbackValue=rhiMobilityT(rt?.hass,"common.unavailable",{},"Unavailable")) => {
    const value=rt && rt.supervisorOutcome ? rt.supervisorOutcome(contextId, field, null) : null;
    return value === undefined || value === null || value === "" ? fallbackValue : value;
  };
  const status=read("status", fallback.status ?? rhiMobilityT(rt?.hass,"common.unavailable",{},"Unavailable"));
  const trust=read("trust", fallback.trust ?? (rt && rt.backendVersion ? rt.backendVersion() : rhiMobilityT(rt?.hass,"common.unavailable",{},"Unavailable")));
  const attention=read("attention", fallback.attention ?? rhiMobilityT(rt?.hass,"common.unavailable",{},"Unavailable"));
  const opportunity=read("opportunity", fallback.opportunity ?? rhiMobilityT(rt?.hass,"common.unavailable",{},"Unavailable"));
  const recommendation=read("recommended_action", fallback.recommended_action ?? rhiMobilityT(rt?.hass,"common.unavailable",{},"Unavailable"));
  const items=[
    ["mdi:check-circle-outline",rhiMobilityT(rt?.hass,"common.status",{},"Status"),status,"green"],
    ["mdi:shield-check-outline",rhiMobilityT(rt?.hass,"common.trust",{},"Confidence"),trust,"blue"],
    ["mdi:alert-circle-outline",rhiMobilityT(rt?.hass,"common.attention",{},"Attention"),attention,"orange"],
    ["mdi:lightbulb-outline",rhiMobilityT(rt?.hass,"common.opportunity",{},"Opportunity"),opportunity,"green"],
    ["mdi:arrow-right-circle-outline",rhiMobilityT(rt?.hass,"common.recommended_action",{},"Recommended action"),recommendation,"blue"]
  ];
  return `<section class="status-strip dashboard-status-strip outcome-header">
    ${items.map(([icon,label,value,tone]) => `<div class="metric tone-${tone}"><ha-icon icon="${icon}"></ha-icon><div><span>${label}</span><b>${esc(value)}</b></div></div>`).join("")}
  </section>`;
}

function hbMobilitySharedShellStyles() {
  return `${rhiUxCoreStyles()}
    :host{
      --hi-primary:var(--rhi-color-primary);
      --hi-primary-soft:var(--rhi-color-primary-soft);
      --hi-ink:var(--rhi-color-text);
      --hi-muted:var(--rhi-color-muted);
      --hi-line:var(--rhi-color-line);
      --hi-surface:var(--rhi-color-surface);
      --hi-surface-soft:var(--rhi-color-surface-soft);
    }
    .rhiMobilityNav-intelligence .rhiUxDomainShell{--rhi-nav-active-bg:#F1EDFF;--rhi-nav-active-border:#DFD5FB;--rhi-nav-active-text:#5A38B3}
    .rhiMobilityNav-insights .rhiUxDomainShell{--rhi-nav-active-bg:#E7F7F4;--rhi-nav-active-border:#CDEBE6;--rhi-nav-active-text:#176E67}
    .placeholder-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .placeholder-card{background:#fff;border:1px solid #E8EEF7;border-radius:20px;padding:18px;box-shadow:0 16px 38px rgba(15,35,80,.07)}
    .placeholder-card h3{margin:0 0 8px;font-size:18px;color:#06142D}
    .placeholder-card p{margin:0;color:#66728B;font-size:13px;line-height:1.45}
    .placeholder-kicker{display:inline-flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--rhi-color-primary);font-size:12px;font-weight:650;text-transform:uppercase;letter-spacing:.04em}
    .placeholder-kicker ha-icon{--mdc-icon-size:18px}
    .footer-note{margin-top:12px;color:#66728B;font-size:12px;font-weight:600}
    .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{width:100%;max-width:none;margin:8px 0 10px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border:1px solid #E0E8F2;border-radius:16px;background:#fff;box-shadow:0 10px 24px rgba(15,35,80,.045);overflow:hidden}
    .status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{display:grid;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:center;min-width:0;padding:12px 14px;border-right:1px solid #E8EEF6;background:transparent}
    .status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child,.outcome-header .metric:last-child{border-right:0}
    .status-strip.dashboard-status-strip .metric ha-icon,.status-strip.ops-status-strip .metric ha-icon,.outcome-header .metric ha-icon{--mdc-icon-size:20px}
    .status-strip.dashboard-status-strip .metric>div,.status-strip.ops-status-strip .metric>div,.outcome-header .metric>div{min-width:0}
    .status-strip.dashboard-status-strip .metric span,.status-strip.ops-status-strip .metric span,.outcome-header .metric span{display:block;font-size:9px;font-weight:600;line-height:1.1;color:#708098;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .status-strip.dashboard-status-strip .metric b,.status-strip.ops-status-strip .metric b,.outcome-header .metric b{display:block;margin-top:2px;font-size:12.5px;font-weight:650;line-height:1.15;color:#10213A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .status-strip .tone-green>ha-icon{color:#16A765}.status-strip .tone-blue>ha-icon{color:var(--rhi-color-primary)}.status-strip .tone-orange>ha-icon{color:var(--rhi-color-attention)}
    .section-title{margin-top:4px;margin-bottom:8px}
    .hi-version-block{display:none}
    @media(max-width:920px){
      .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{grid-template-columns:repeat(5,minmax(150px,1fr));overflow-x:auto}
      .status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{min-width:150px}
    }
    @media(max-width:760px){
      .placeholder-grid{grid-template-columns:1fr}
    }
    /* rc.56 shared image-first appearance selector */
    .visual-picker-panel{
      margin:0;padding:12px;border:1px solid #dce7f3;border-radius:14px;
      background:#fbfdff;box-shadow:none;display:grid;gap:10px;
    }
    .visual-picker-panel .vehicle-picker-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .visual-picker-panel .vehicle-picker-head small{font-size:9px;letter-spacing:.11em;color:#64748b;font-weight:700}
    .visual-picker-panel .vehicle-picker-head h3{margin:2px 0;font-size:15px;line-height:1.15;color:#0f172a}
    .visual-picker-panel .vehicle-picker-head p{margin:0;font-size:10.5px;line-height:1.3;color:#64748b;font-weight:500}
    .visual-picker-panel .vehicle-picker-close{width:30px;height:30px;min-width:30px;border:1px solid #dbe5f0;border-radius:9px;background:#fff;color:#64748b;padding:0;display:grid;place-items:center}
    .visual-choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:8px;align-items:stretch}
    .visual-choice-card{
      position:relative;appearance:none;border:1px solid #e0e8f2;border-radius:12px;background:#fff;
      min-width:0;min-height:126px;padding:8px;display:grid;grid-template-rows:78px auto;gap:6px;
      text-align:left;cursor:pointer;color:#0f172a;box-shadow:none;overflow:hidden;
    }
    .visual-choice-card:hover{border-color:#a9c8f6;background:#f8fbff}
    .visual-choice-card.active{border-color:#1467F5;box-shadow:0 0 0 2px rgba(20,103,245,.10);background:#f7fbff}
    .visual-choice-image{display:grid;place-items:center;min-width:0;height:78px;border-radius:9px;background:linear-gradient(135deg,#fff,#f5f8fc);overflow:hidden}
    .visual-choice-image img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;object-position:center;transform:none}
    .visual-choice-image ha-icon{--mdc-icon-size:42px;color:#94a3b8}
    .visual-choice-copy{display:grid;gap:2px;min-width:0}
    .visual-choice-copy b{font-size:11px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .visual-choice-copy small{font-size:9px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .visual-choice-check{position:absolute;top:7px;right:7px;--mdc-icon-size:17px;color:#1467F5;opacity:0}
    .visual-choice-card.active .visual-choice-check{opacity:1}
    .visual-picker-refine{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:0;align-items:end}
    .visual-picker-refine label{display:grid;gap:4px;min-width:0}
    .visual-picker-refine label>span{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.045em;color:#64748b}
    .visual-picker-refine select{width:100%;height:34px;min-height:34px;border:1px solid #d7e2ef;border-radius:8px;background:#fff;color:#0f172a;padding:0 8px;font-size:10.5px;font-weight:600}
    .visual-picker-apply{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding-top:2px}
    .visual-picker-selection{display:flex;align-items:baseline;gap:6px;min-width:0}
    .visual-picker-selection small{font-size:9px;color:#64748b;text-transform:uppercase;font-weight:700}
    .visual-picker-selection b{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .visual-picker-selection span{font-size:10px;color:#64748b;white-space:nowrap}
    .visual-picker-apply .vehicle-picker-save{height:36px;min-height:36px;border:1px solid #1467F5;border-radius:9px;background:#1467F5;color:#fff;padding:0 12px;display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:650;cursor:pointer}
    .visual-picker-apply .vehicle-picker-save:disabled{background:#eef2f7;border-color:#d9e2ec;color:#94a3b8;cursor:not-allowed}
    .visual-picker-notice{display:flex;align-items:flex-start;gap:7px;padding:8px 10px;border:1px solid #e6edf5;border-radius:10px;background:#fff;color:#64748b;font-size:10px;line-height:1.3}
    .visual-picker-notice ha-icon{--mdc-icon-size:16px;color:#64748b;flex:none}
    .vehicle-picker-key,.vehicle-picker-gap{display:none}

    @media(max-width:820px){
      .visual-choice-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .visual-picker-refine{grid-template-columns:repeat(2,minmax(0,1fr))}
      .visual-picker-apply{grid-template-columns:1fr auto}
    }
    @media(max-width:520px){
      .visual-picker-panel{padding:9px;gap:8px}
      .visual-choice-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:2px}
      .visual-choice-card{flex:0 0 156px;scroll-snap-align:start}
      .visual-picker-refine{grid-template-columns:1fr 1fr}
      .visual-picker-apply{grid-template-columns:1fr}
      .visual-picker-apply .vehicle-picker-save{width:100%;justify-content:center}
      .visual-picker-selection{min-height:20px}
    }
    ${typeof hbMobilityPresentationStyles === "function" ? hbMobilityPresentationStyles() : ""}
  `;
}
