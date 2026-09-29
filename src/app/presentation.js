// Shared Mobility presentation grammar.
// Owns cross-screen visual hierarchy, density, responsive modes and tab heroes.
// Domain screens keep their semantics, data ownership and actions.

const HB_MOBILITY_PAGE_HEROES = Object.freeze({
  overview: { eyebrow:"", title:"Mobility Overview", description:"Know if your vehicles are ready, secure and comfortable, what is charging, and where action is needed.", asset_key:"overview" },
  vehicles: { eyebrow:"", title:"Vehicle Management", description:"Check that your fleet is configured, assigned and operational, then manage the vehicles that need attention.", asset_key:"vehicles" },
  chargers: { eyebrow:"", title:"Charger Management", description:"Check that your charging park is configured, available and operating as expected, then manage exceptions.", asset_key:"chargers" },
  planning: { eyebrow:"", title:"Planning", description:"See the Energy-owned charging plan, what is already planned and what still needs attention.", asset_key:"planning" },
  strategies: { eyebrow:"", title:"Strategies", description:"Understand configured intent and effective energy policy without duplicating backend semantics.", asset_key:"strategies" },
  history: { eyebrow:"", title:"History", description:"Review measured vehicle energy, value and Mobility outcomes from their authoritative backend domains.", asset_key:"history" },
  log: { eyebrow:"", title:"Log", description:"Inspect operational and audit evidence with backend-owned reasons and status.", asset_key:"log" }
});

const HB_MOBILITY_PRELOADED_HEROES = globalThis.__rhiMobilityPreloadedHeroes || (globalThis.__rhiMobilityPreloadedHeroes = new Set());

function hbMobilityPreloadHero(asset = "") {
  const src = String(asset || "").trim();
  if (!src || HB_MOBILITY_PRELOADED_HEROES.has(src) || typeof Image === "undefined") return;
  HB_MOBILITY_PRELOADED_HEROES.add(src);
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  if (typeof img.decode === "function") img.decode().catch(()=>{});
}

function hbMobilityPageHero(rt, tab, options = {}) {
  const spec = HB_MOBILITY_PAGE_HEROES[tab] || HB_MOBILITY_PAGE_HEROES.overview;
  const asset = options.asset || rhiMobilityHeroAsset(options.asset_key || spec.asset_key);
  hbMobilityPreloadHero(asset);
  return rhiUxPageHero({
    eyebrow: options.eyebrow || spec.eyebrow || "",
    title: options.title || spec.title,
    description: options.description || spec.description,
    image: asset,
    imageAlt: ""
  }).replace("<img ", '<img loading="eager" decoding="async" fetchpriority="high" ');
}

function hbMobilityStatusGrid(rt, items = [], className = "") {
  const visible = items.slice(0, 4);
  const markup = rhiUxStatusGrid(visible.map(item => ({
    icon: item.icon || "mdi:information-outline",
    label: item.label || "",
    value: item.value ?? "—",
    detail: [item.sub, item.sub2].filter(Boolean).join(" · ")
  })));
  return className ? markup.replace('class="rhiUxStatusGrid"', `class="rhiUxStatusGrid ${rt?.escape ? rt.escape(className) : String(className)}"`) : markup;
}

function hbMobilityQuickActions(rt, actions = [], label = "Quick actions") {
  return rhiUxQuickActionBar({
    label,
    actions: actions.map((action,index) => ({
      label: action.label || "Open",
      target: action.path || "",
      icon: action.icon || "mdi:arrow-right",
      primary: action.primary || index === 0,
      disabled: action.disabled === true
    }))
  });
}

function hbMobilityPresentationStyles() {
  return `
    :host{
      --rhi-content-gap:8px;
      --rhi-card-gap:8px;
      color:var(--rhi-color-text);
    }
    .rhiUxPageHeroArt img{transition:none!important;animation:none!important;backface-visibility:hidden!important;transform:translateZ(0)}
    .vehicle-card,.charger-card,.vehicle-management-controls,.rhi-context-card{
      border-radius:var(--rhi-radius-lg);
      border-color:var(--rhi-color-line);
      box-shadow:var(--rhi-shadow-md);
    }
    .action,.cmd,.vehicle-manage-button,.ov-nav-action,.charger-appearance-action{
      min-height:var(--rhi-control-h);
      border-radius:var(--rhi-radius-sm);
      font-weight:var(--rhi-weight-medium);
    }
    .action ha-icon,.cmd ha-icon,.vehicle-manage-button ha-icon,.ov-nav-action ha-icon,.charger-appearance-action ha-icon{
      --mdc-icon-size:var(--rhi-icon-action)
    }
    .vehicle-management-bar{padding:6px;gap:6px;border-radius:var(--rhi-radius-md);box-shadow:none}
    .vehicle-filter-group{gap:4px}
    .vehicle-filter-group button,.vehicle-sort-control,.vehicle-manage-button{height:34px;min-height:34px;border-radius:9px}
    .vehicle-page-summary{gap:7px}
    .vehicle-page-summary-item{min-height:48px;border-radius:var(--rhi-radius-md);padding:7px 10px}
    .vehicle-management-controls,.charger-picker-panel{margin-top:0}
    .vehicle-workspace-list,.inactive-list,.grid{gap:var(--rhi-card-gap)}
    .rhi-context-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--rhi-card-gap);margin:0 0 var(--rhi-space-2)}
    .rhi-context-card{min-width:0;background:#fff;padding:12px 14px}
    .rhi-context-card-kicker{display:flex;align-items:center;gap:7px;margin-bottom:6px;color:#355D96;font-size:var(--rhi-font-label);font-weight:var(--rhi-weight-medium);letter-spacing:.07em;text-transform:uppercase}
    .rhi-context-card-kicker ha-icon{--mdc-icon-size:18px}
    .rhi-context-card h3{margin:0 0 4px;color:var(--rhi-color-text);font-size:var(--rhi-font-card);line-height:1.18;font-weight:var(--rhi-weight-strong);letter-spacing:-.015em}
    .rhi-context-card p{margin:0;color:var(--rhi-color-muted);font-size:var(--rhi-font-body);line-height:var(--rhi-line-height-body);font-weight:var(--rhi-weight-regular)}
    .rhi-fact-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--rhi-card-gap);margin:0 0 var(--rhi-space-3)}
    .rhi-fact{min-width:0;display:grid;grid-template-columns:30px minmax(0,1fr);gap:8px;align-items:center;border:1px solid var(--rhi-color-line);border-radius:var(--rhi-radius-md);background:#fff;padding:9px 10px;box-shadow:none}
    .rhi-fact ha-icon{--mdc-icon-size:20px;color:#355D96}
    .rhi-fact small,.rhi-fact span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .rhi-fact small{font-size:var(--rhi-font-label);color:var(--rhi-color-muted-soft);font-weight:var(--rhi-weight-medium)}
    .rhi-fact b{display:block;margin-top:2px;color:var(--rhi-color-text);font-size:14px;font-weight:var(--rhi-weight-strong);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rhi-fact span{margin-top:2px;font-size:var(--rhi-font-small);color:var(--rhi-color-muted)}
    @media(max-width:760px){
      .vehicle-management-bar{grid-template-columns:1fr}
      .vehicle-sort-control,.vehicle-manage-button{grid-column:auto}
      .vehicle-page-summary{grid-template-columns:repeat(2,minmax(0,1fr))}
      .vehicle-filter-group{overflow-x:auto}
      .vehicle-filter-group button{flex:0 0 auto}
      .rhi-context-grid{grid-template-columns:1fr}
      .rhi-fact-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    }
    @media(max-width:430px){
      .rhi-context-card{padding:11px}
      .rhi-fact{grid-template-columns:24px minmax(0,1fr);gap:6px}
      .rhi-fact ha-icon{--mdc-icon-size:18px}
    }
  `;
}
