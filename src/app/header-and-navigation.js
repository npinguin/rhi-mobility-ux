// Mobility presentation adapter onto the shared RHI UX Core.
// Domain semantics remain owned by Mobility runtime/projections.
const UX_VERSION = "__RHI_UX_VERSION__";
const HB_MOBILITY_COMPANY_LOGO_SVG = "__RHI_COMPANY_LOGO_INLINE__";
const HB_MOBILITY_BASE_PATH = "/mobility-supervisor";

const HB_MOBILITY_MODULES = Object.freeze([
  { key:"mobility", label:"Mobility", path:"/overview", items:[
    { key:"overview", label:"Overview", path:"/overview" },
    { key:"vehicles", label:"Vehicle Management", path:"/dashboard" },
    { key:"chargers", label:"Charger Management", path:"/charger-maintenance" }
  ]},
  { key:"intelligence", label:"Intelligence", path:"/planning", items:[
    { key:"planning", label:"Planning", path:"/planning" },
    { key:"strategies", label:"Strategies", path:"/strategies" }
  ]},
  { key:"insights", label:"Insights", path:"/history", items:[
    { key:"history", label:"History", path:"/history" },
    { key:"log", label:"Log", path:"/log" }
  ]}
]);

const HB_MOBILITY_NAV_ITEMS = HB_MOBILITY_MODULES.flatMap(module =>
  module.items.map(item => ({ ...item, module:module.key }))
);

function hbMobilityPath(path) {
  return `${HB_MOBILITY_BASE_PATH}${path}`;
}

function hbMobilityModuleFor(active = "overview") {
  const item=HB_MOBILITY_NAV_ITEMS.find(entry => entry.key === active);
  return HB_MOBILITY_MODULES.find(module => module.key === (item?.module || active)) || HB_MOBILITY_MODULES[0];
}

function hbMobilityCoreModules() {
  return HB_MOBILITY_MODULES.map(module => ({
    id:module.key,
    label:module.label,
    target:hbMobilityPath(module.path),
    items:module.items.map(item => ({
      id:item.key,
      label:item.label,
      target:hbMobilityPath(item.path)
    }))
  }));
}

function hbMobilityCompanyBrand() {
  return `<span class="rhiMobilityCompanyLogo" role="img" aria-label="Robotix.be — DomotiX · Network · Security">${HB_MOBILITY_COMPANY_LOGO_SVG}</span>`;
}

function hbMobilityNav(active = "overview") {
  const module=hbMobilityModuleFor(active);
  return `<div class="rhiMobilityNav rhiMobilityNav-${rhiUxEscape(module.key)}">${rhiUxDomainShell({
    product:"Home Intelligence",
    domain:"MOBILITY",
    modules:hbMobilityCoreModules(),
    activeModule:module.key,
    activeItem:active,
    brandHtml:hbMobilityCompanyBrand()
  })}<style>${hbMobilitySharedShellStyles()}</style></div>`;
}

function hbMobilityTitleBlock(title = "Mobility", description = "Vehicle readiness, charging, comfort and security in one calm control cockpit.") {
  return `<section class="title"><p class="eyebrow">HOME INTELLIGENCE / MOBILITY</p><h1>${title}</h1><p>${description}</p></section>`;
}

function hbMobilityReleaseFooter(rt) {
  const rel=rt && rt.releaseContract ? rt.releaseContract() : {};
  const backend=rel.backend_release || rel.backend_version || "Unknown";
  let issue="";
  let severity="";
  try {
    const summary=rt && rt.runtimeHealthSummary ? rt.runtimeHealthSummary() : null;
    const state=String(summary?.status || "").toUpperCase();
    if (backend === "Unknown") {
      issue="Backend contract unavailable";
      severity="error";
    } else if (["BLOCKED","INVALID"].includes(state)) {
      issue="Mobility runtime issue";
      severity="error";
    } else if (["DEGRADED","STALE","UNKNOWN"].includes(state)) {
      issue="Mobility runtime degraded";
      severity="warning";
    }
  } catch (_) {
    issue="Runtime health unavailable";
    severity="warning";
  }
  return rhiUxTechnicalFooter({
    product:"RHI Mobility",
    uxVersion:UX_VERSION,
    backendVersion:backend,
    issue,
    severity
  });
}

function hbMobilityOutcomeStrip(rt, contextId = "mobility", fallback = {}) {
  const esc=(v)=>rt && rt.escape ? rt.escape(v) : rhiUxEscape(v);
  const read=(field, fallbackValue="Unavailable") => {
    const value=rt && rt.supervisorOutcome ? rt.supervisorOutcome(contextId, field, null) : null;
    return value === undefined || value === null || value === "" ? fallbackValue : value;
  };
  const status=read("status", fallback.status ?? "Unavailable");
  const trust=read("trust", fallback.trust ?? (rt && rt.backendVersion ? rt.backendVersion() : "Unavailable"));
  const attention=read("attention", fallback.attention ?? "Unavailable");
  const opportunity=read("opportunity", fallback.opportunity ?? "Unavailable");
  const recommendation=read("recommended_action", fallback.recommended_action ?? "Unavailable");
  const items=[
    ["mdi:check-circle-outline","Status",status,"green"],
    ["mdi:shield-check-outline","Trust",trust,"blue"],
    ["mdi:alert-circle-outline","Attention",attention,"orange"],
    ["mdi:lightbulb-outline","Opportunity",opportunity,"green"],
    ["mdi:arrow-right-circle-outline","Recommended action",recommendation,"blue"]
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
    .rhiMobilityCompanyLogo{display:block;width:min(100%,250px);max-height:116px;line-height:0;overflow:hidden}
    .rhiMobilityCompanyLogo svg{display:block;width:100%;height:auto;max-height:116px;object-fit:contain;object-position:center}
    .placeholder-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .placeholder-card{background:#fff;border:1px solid #E8EEF7;border-radius:20px;padding:18px;box-shadow:0 16px 38px rgba(15,35,80,.07)}
    .placeholder-card h3{margin:0 0 8px;font-size:18px;color:#06142D}
    .placeholder-card p{margin:0;color:#66728B;font-size:13px;line-height:1.45}
    .placeholder-kicker{display:inline-flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--rhi-color-primary);font-size:12px;font-weight:650;text-transform:uppercase;letter-spacing:.04em}
    .placeholder-kicker ha-icon{--mdc-icon-size:18px}
    .footer-note{margin-top:12px;color:#66728B;font-size:12px;font-weight:600}
    .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{width:100%!important;max-width:none!important;margin:8px 0 10px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;border:1px solid #E0E8F2!important;border-radius:16px!important;background:#fff!important;box-shadow:0 10px 24px rgba(15,35,80,.045)!important;overflow:hidden!important}
    .status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{display:grid!important;grid-template-columns:28px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;min-width:0!important;padding:12px 14px!important;border-right:1px solid #E8EEF6!important;background:transparent!important}
    .status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child,.outcome-header .metric:last-child{border-right:0!important}
    .status-strip.dashboard-status-strip .metric ha-icon,.status-strip.ops-status-strip .metric ha-icon,.outcome-header .metric ha-icon{--mdc-icon-size:20px}
    .status-strip.dashboard-status-strip .metric>div,.status-strip.ops-status-strip .metric>div,.outcome-header .metric>div{min-width:0}
    .status-strip.dashboard-status-strip .metric span,.status-strip.ops-status-strip .metric span,.outcome-header .metric span{display:block!important;font-size:9px!important;font-weight:600!important;line-height:1.1!important;color:#708098!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .status-strip.dashboard-status-strip .metric b,.status-strip.ops-status-strip .metric b,.outcome-header .metric b{display:block!important;margin-top:2px!important;font-size:12.5px!important;font-weight:650!important;line-height:1.15!important;color:#10213A!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .status-strip .tone-green>ha-icon{color:#16A765!important}.status-strip .tone-blue>ha-icon{color:var(--rhi-color-primary)!important}.status-strip .tone-orange>ha-icon{color:var(--rhi-color-attention)!important}
    .section-title{margin-top:4px!important;margin-bottom:8px!important}
    .hi-version-block{display:none!important}
    @media(max-width:920px){
      .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{grid-template-columns:repeat(5,minmax(150px,1fr))!important;overflow-x:auto!important}
      .status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{min-width:150px!important}
    }
    @media(max-width:760px){
      .placeholder-grid{grid-template-columns:1fr}
      .rhiMobilityCompanyLogo{max-width:126px;max-height:48px}
    }
    /* rc.56 shared image-first appearance selector */
    .visual-picker-panel{
      margin:0!important;padding:12px!important;border:1px solid #dce7f3!important;border-radius:14px!important;
      background:#fbfdff!important;box-shadow:none!important;display:grid!important;gap:10px!important;
    }
    .visual-picker-panel .vehicle-picker-head{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important}
    .visual-picker-panel .vehicle-picker-head small{font-size:9px!important;letter-spacing:.11em!important;color:#64748b!important;font-weight:700!important}
    .visual-picker-panel .vehicle-picker-head h3{margin:2px 0!important;font-size:15px!important;line-height:1.15!important;color:#0f172a!important}
    .visual-picker-panel .vehicle-picker-head p{margin:0!important;font-size:10.5px!important;line-height:1.3!important;color:#64748b!important;font-weight:500!important}
    .visual-picker-panel .vehicle-picker-close{width:30px!important;height:30px!important;min-width:30px!important;border:1px solid #dbe5f0!important;border-radius:9px!important;background:#fff!important;color:#64748b!important;padding:0!important;display:grid!important;place-items:center!important}
    .visual-choice-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(148px,1fr))!important;gap:8px!important;align-items:stretch!important}
    .visual-choice-card{
      position:relative!important;appearance:none!important;border:1px solid #e0e8f2!important;border-radius:12px!important;background:#fff!important;
      min-width:0!important;min-height:126px!important;padding:8px!important;display:grid!important;grid-template-rows:78px auto!important;gap:6px!important;
      text-align:left!important;cursor:pointer!important;color:#0f172a!important;box-shadow:none!important;overflow:hidden!important;
    }
    .visual-choice-card:hover{border-color:#a9c8f6!important;background:#f8fbff!important}
    .visual-choice-card.active{border-color:#1467F5!important;box-shadow:0 0 0 2px rgba(20,103,245,.10)!important;background:#f7fbff!important}
    .visual-choice-image{display:grid!important;place-items:center!important;min-width:0!important;height:78px!important;border-radius:9px!important;background:linear-gradient(135deg,#fff,#f5f8fc)!important;overflow:hidden!important}
    .visual-choice-image img{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center!important;transform:none!important}
    .visual-choice-image ha-icon{--mdc-icon-size:42px!important;color:#94a3b8!important}
    .visual-choice-copy{display:grid!important;gap:2px!important;min-width:0!important}
    .visual-choice-copy b{font-size:11px!important;font-weight:650!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .visual-choice-copy small{font-size:9px!important;color:#64748b!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .visual-choice-check{position:absolute!important;top:7px!important;right:7px!important;--mdc-icon-size:17px!important;color:#1467F5!important;opacity:0!important}
    .visual-choice-card.active .visual-choice-check{opacity:1!important}
    .visual-picker-refine{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important;margin:0!important;align-items:end!important}
    .visual-picker-refine label{display:grid!important;gap:4px!important;min-width:0!important}
    .visual-picker-refine label>span{font-size:8.5px!important;font-weight:700!important;text-transform:uppercase!important;letter-spacing:.045em!important;color:#64748b!important}
    .visual-picker-refine select{width:100%!important;height:34px!important;min-height:34px!important;border:1px solid #d7e2ef!important;border-radius:8px!important;background:#fff!important;color:#0f172a!important;padding:0 8px!important;font-size:10.5px!important;font-weight:600!important}
    .visual-picker-apply{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:10px!important;align-items:center!important;padding-top:2px!important}
    .visual-picker-selection{display:flex!important;align-items:baseline!important;gap:6px!important;min-width:0!important}
    .visual-picker-selection small{font-size:9px!important;color:#64748b!important;text-transform:uppercase!important;font-weight:700!important}
    .visual-picker-selection b{font-size:12px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .visual-picker-selection span{font-size:10px!important;color:#64748b!important;white-space:nowrap!important}
    .visual-picker-apply .vehicle-picker-save{height:36px!important;min-height:36px!important;border:1px solid #1467F5!important;border-radius:9px!important;background:#1467F5!important;color:#fff!important;padding:0 12px!important;display:inline-flex!important;align-items:center!important;gap:6px!important;font-size:10.5px!important;font-weight:650!important;cursor:pointer!important}
    .visual-picker-apply .vehicle-picker-save:disabled{background:#eef2f7!important;border-color:#d9e2ec!important;color:#94a3b8!important;cursor:not-allowed!important}
    .visual-picker-notice{display:flex!important;align-items:flex-start!important;gap:7px!important;padding:8px 10px!important;border:1px solid #e6edf5!important;border-radius:10px!important;background:#fff!important;color:#64748b!important;font-size:10px!important;line-height:1.3!important}
    .visual-picker-notice ha-icon{--mdc-icon-size:16px!important;color:#64748b!important;flex:none!important}
    .vehicle-picker-key,.vehicle-picker-gap{display:none!important}

    @media(max-width:820px){
      .visual-choice-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .visual-picker-refine{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .visual-picker-apply{grid-template-columns:1fr auto!important}
    }
    @media(max-width:520px){
      .visual-picker-panel{padding:9px!important;gap:8px!important}
      .visual-choice-grid{display:flex!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;padding-bottom:2px!important}
      .visual-choice-card{flex:0 0 156px!important;scroll-snap-align:start!important}
      .visual-picker-refine{grid-template-columns:1fr 1fr!important}
      .visual-picker-apply{grid-template-columns:1fr!important}
      .visual-picker-apply .vehicle-picker-save{width:100%!important;justify-content:center!important}
      .visual-picker-selection{min-height:20px!important}
    }
    ${typeof hbMobilityPresentationStyles === "function" ? hbMobilityPresentationStyles() : ""}
  `;
}
