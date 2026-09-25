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

function hbMobilityPageHero(rt, tab, options = {}) {
  const spec = HB_MOBILITY_PAGE_HEROES[tab] || HB_MOBILITY_PAGE_HEROES.overview;
  const esc = (value) => rt?.escape ? rt.escape(value) : String(value ?? "");
  const asset = options.asset || rhiMobilityHeroAsset(options.asset_key || spec.asset_key);
  const badge = options.badge || "";
  return `<section class="rhi-page-hero rhi-page-hero-${esc(tab)}">
    <div class="rhi-page-hero-copy">
      ${(options.eyebrow || spec.eyebrow) ? `<small>${esc(options.eyebrow || spec.eyebrow)}</small>` : ""}
      <h1>${esc(options.title || spec.title)}</h1>
      <p>${esc(options.description || spec.description)}</p>
    </div>
    <div class="rhi-page-hero-art" aria-hidden="true">
      <img src="${esc(asset)}" alt="">
      ${badge ? `<div class="rhi-page-hero-badge">${badge}</div>` : ""}
    </div>
  </section>`;
}

function hbMobilityStatusGrid(rt, items = [], className = "") {
  const esc = (value) => rt?.escape ? rt.escape(value) : String(value ?? "");
  const visible = items.slice(0,4);
  return `<section class="rhi-top-status-grid status-count-${visible.length} ${esc(className)}" aria-label="Page status">
    ${visible.map((item) => `<article class="rhi-top-status-item ${esc(item.tone || "")}">
      <span class="rhi-top-status-icon"><ha-icon icon="${esc(item.icon || "mdi:information-outline")}"></ha-icon></span>
      <div><small>${esc(item.label || "")}</small><b>${esc(item.value ?? "—")}</b>${item.sub ? `<em>${esc(item.sub)}</em>` : ""}${item.sub2 ? `<em>${esc(item.sub2)}</em>` : ""}</div>
    </article>`).join("")}
  </section>`;
}

function hbMobilityQuickActions(rt, actions = [], label = "Quick actions") {
  const esc = (value) => rt?.escape ? rt.escape(value) : String(value ?? "");
  return `<section class="rhi-top-actions" aria-label="${esc(label)}">
    <span class="rhi-top-actions-title">${esc(label)}</span>
    ${actions.map((action, index) => `<button class="rhi-top-action ${action.primary || index === 0 ? "primary" : ""}" data-nav="${esc(action.path || "")}" ${action.disabled ? "disabled" : ""}><ha-icon icon="${esc(action.icon || "mdi:arrow-right")}"></ha-icon><span>${esc(action.label || "Open")}</span></button>`).join("")}
  </section>`;
}

function hbMobilityPresentationStyles() {
  return `
    :host{
      --rhi-page-max:1640px;
      --rhi-page-pad-x:24px;--rhi-page-pad-y:14px;
      --rhi-space-1:4px;--rhi-space-2:7px;--rhi-space-3:10px;--rhi-space-4:14px;--rhi-space-5:18px;--rhi-space-6:24px;
      --rhi-radius-sm:9px;--rhi-radius-md:12px;--rhi-radius-lg:16px;
      --rhi-line:#DCE5EF;--rhi-line-soft:#EAF0F6;
      --rhi-ink:#101828;--rhi-muted:#5F6F84;--rhi-muted-soft:#758399;--rhi-blue:#1467F5;
      --rhi-surface:#FFFFFF;--rhi-soft:#F8FAFC;
      --rhi-shadow:0 7px 20px rgba(15,35,80,.035);
      --rhi-font-display:clamp(29px,2.55vw,42px);
      --rhi-font-section:clamp(18px,1.4vw,22px);
      --rhi-font-card:15px;--rhi-font-body:12.5px;--rhi-font-small:11px;--rhi-font-label:10px;
      --rhi-weight-regular:450;--rhi-weight-medium:540;--rhi-weight-strong:620;
      --rhi-content-gap:8px;--rhi-card-gap:8px;--rhi-control-h:38px;--rhi-icon-action:18px;--rhi-icon-status:24px;
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      color:var(--rhi-ink);
    }

    .page{
      width:min(100%,var(--rhi-page-max))!important;margin:0 auto!important;
      padding:var(--rhi-page-pad-y) var(--rhi-page-pad-x) 24px!important;
      box-sizing:border-box!important;gap:var(--rhi-content-gap)!important;
    }

    /* Shared geometry: one calm visual language, screen semantics remain local. */
    .vehicle-card,.charger-card,.info,.summary,.vehicle-management-controls,.ov-panel,.rhi-context-card{
      border-radius:var(--rhi-radius-lg)!important;
      border-color:var(--rhi-line)!important;
      box-shadow:var(--rhi-shadow)!important;
    }
    .section-title,.vehicle-workspace-head,.ov-panel-head{margin-top:var(--rhi-space-2)!important;margin-bottom:var(--rhi-space-2)!important;color:var(--rhi-ink)!important}
    .section-title h2,.vehicle-workspace-head h2,.ov-panel-head h2{
      margin-bottom:3px!important;font-size:var(--rhi-font-section)!important;line-height:1.12!important;
      letter-spacing:-.022em!important;font-weight:var(--rhi-weight-strong)!important;color:var(--rhi-ink)!important;
    }
    .section-title p,.vehicle-workspace-head p,.ov-panel-head p{
      color:var(--rhi-muted)!important;font-size:var(--rhi-font-small)!important;line-height:1.42!important;font-weight:var(--rhi-weight-regular)!important;
    }
    button,select,input{font-family:inherit}
    .action,.cmd,.vehicle-manage-button,.ov-nav-action,.charger-appearance-action{
      min-height:var(--rhi-control-h)!important;border-radius:var(--rhi-radius-sm)!important;font-weight:var(--rhi-weight-medium)!important;
    }
    .action ha-icon,.cmd ha-icon,.vehicle-manage-button ha-icon,.ov-nav-action ha-icon,.charger-appearance-action ha-icon{--mdc-icon-size:var(--rhi-icon-action)!important}

    /* Hero: premium image, sharper type, bounded height. */
    .rhi-page-hero{
      position:relative!important;display:block!important;height:188px!important;min-height:188px!important;
      border:0!important;border-radius:var(--rhi-radius-lg)!important;
      background:linear-gradient(90deg,#fff 0%,#fff 28%,rgba(255,255,255,.94) 38%,rgba(255,255,255,.18) 61%,rgba(255,255,255,0) 78%)!important;
      box-shadow:none!important;overflow:hidden!important;margin:0!important;
    }
    .rhi-page-hero:before{display:none!important}
    .rhi-page-hero-copy{
      position:relative!important;z-index:4!important;width:min(48%,650px)!important;max-width:none!important;
      padding:28px 18px 24px 22px!important;box-sizing:border-box!important;
    }
    .rhi-page-hero-copy>small{display:none!important}
    .rhi-page-hero-copy h1{
      margin:4px 0 8px!important;font-size:var(--rhi-font-display)!important;line-height:1.02!important;
      letter-spacing:-.038em!important;color:#0B1739!important;font-weight:610!important;
    }
    .rhi-page-hero-copy p{
      margin:0!important;max-width:520px!important;font-size:clamp(12.5px,1.05vw,15px)!important;line-height:1.42!important;
      color:#536781!important;font-weight:450!important;
    }
    .rhi-page-hero-meta,.rhi-page-hero-actions{display:none!important}
    .rhi-page-hero-art{position:absolute!important;z-index:1!important;inset:0 0 0 28%!important;display:block!important;overflow:hidden!important;pointer-events:none!important}
    .rhi-page-hero-art:before{
      content:""!important;display:block!important;position:absolute!important;z-index:2!important;inset:0!important;
      background:linear-gradient(90deg,#fff 0%,rgba(255,255,255,.95) 8%,rgba(255,255,255,.62) 19%,rgba(255,255,255,.10) 38%,rgba(255,255,255,0) 57%)!important;
    }
    .rhi-page-hero-art img{
      position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
      object-fit:cover!important;object-position:center 52%!important;transform:none!important;
    }

    /* One status layer. Colour stays quiet unless the backend status is actionable. */
    .rhi-top-status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:0!important}
    .rhi-top-status-grid.status-count-1{grid-template-columns:1fr}
    .rhi-top-status-grid.status-count-2{grid-template-columns:repeat(2,minmax(0,1fr))}
    .rhi-top-status-grid.status-count-3{grid-template-columns:repeat(3,minmax(0,1fr))}
    .rhi-top-status-item{
      min-width:0;min-height:82px;display:grid;grid-template-columns:44px minmax(0,1fr);gap:10px;align-items:center;
      padding:10px 12px;border:1px solid var(--rhi-line)!important;border-radius:var(--rhi-radius-md)!important;
      background:#fff!important;box-shadow:var(--rhi-shadow)!important;
    }
    .rhi-top-status-icon{
      width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;
      background:#F0F5FC;color:#355D96;
    }
    .rhi-top-status-icon ha-icon{--mdc-icon-size:var(--rhi-icon-status)!important}
    .rhi-top-status-item.ok .rhi-top-status-icon,.rhi-top-status-item.neutral .rhi-top-status-icon{background:#F0F5FC;color:#355D96}
    .rhi-top-status-item.warn .rhi-top-status-icon{background:#FFF4E8;color:#D96812}
    .rhi-top-status-item>div{min-width:0}
    .rhi-top-status-item small{
      display:block;margin:0 0 2px;color:#476487;font-size:var(--rhi-font-label)!important;
      font-weight:var(--rhi-weight-medium)!important;line-height:1.2;
    }
    .rhi-top-status-item b{
      display:block;margin:0 0 2px;color:var(--rhi-ink);font-size:clamp(14px,1.12vw,17px)!important;
      font-weight:var(--rhi-weight-strong)!important;line-height:1.12;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }
    .rhi-top-status-item.warn b{color:#B94F0B}
    .rhi-top-status-item em{
      display:block;margin-top:2px;color:var(--rhi-muted);font-size:var(--rhi-font-small)!important;font-style:normal;
      font-weight:var(--rhi-weight-regular)!important;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }

    /* One page-level action layer. Card actions remain in the body. */
    .rhi-top-actions{
      min-height:48px;padding:5px 8px;border:1px solid var(--rhi-line)!important;border-radius:var(--rhi-radius-md)!important;
      background:#fff!important;box-shadow:0 4px 14px rgba(21,61,115,.025)!important;
      display:flex;align-items:center;gap:7px;flex-wrap:wrap;
    }
    .rhi-top-actions-title{
      font-size:var(--rhi-font-label)!important;letter-spacing:.10em;text-transform:uppercase;color:#476487;
      font-weight:var(--rhi-weight-medium)!important;margin-right:2px;
    }
    .rhi-top-action{
      height:36px;min-height:36px;border:1px solid #D6E0EB;border-radius:9px;background:#fff;color:#125DB7;
      box-shadow:none;font-size:11.5px;font-weight:var(--rhi-weight-medium)!important;padding:0 12px;
      display:inline-flex;align-items:center;gap:7px;cursor:pointer;
    }
    .rhi-top-action ha-icon{--mdc-icon-size:var(--rhi-icon-action)!important}
    .rhi-top-action.primary{background:#1467F5;border-color:#1467F5;color:#fff}
    .rhi-top-action:disabled{opacity:.46}

    /* Filters belong to body context: compact, aligned, never a second action banner. */
    .vehicle-management-bar{padding:6px!important;gap:6px!important;border-radius:var(--rhi-radius-md)!important;box-shadow:none!important}
    .vehicle-filter-group{gap:4px!important}
    .vehicle-filter-group button,.vehicle-sort-control,.vehicle-manage-button{height:34px!important;min-height:34px!important;border-radius:9px!important}
    .vehicle-page-summary{gap:7px!important}
    .vehicle-page-summary-item{min-height:48px!important;border-radius:var(--rhi-radius-md)!important;padding:7px 10px!important}
    .vehicle-management-controls,.charger-picker-panel{margin-top:0!important}
    .vehicle-workspace-list,.inactive-list,.grid{gap:var(--rhi-card-gap)!important}

    /* Shared data/card primitives. */
    .rhi-context-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--rhi-card-gap);margin:0 0 var(--rhi-space-2)}
    .rhi-context-card{min-width:0;background:#fff;padding:12px 14px}
    .rhi-context-card-kicker{display:flex;align-items:center;gap:7px;margin-bottom:6px;color:#355D96;font-size:var(--rhi-font-label);font-weight:var(--rhi-weight-medium);letter-spacing:.07em;text-transform:uppercase}
    .rhi-context-card-kicker ha-icon{--mdc-icon-size:18px}
    .rhi-context-card h3{margin:0 0 4px;color:var(--rhi-ink);font-size:16px;line-height:1.18;font-weight:var(--rhi-weight-strong);letter-spacing:-.015em}
    .rhi-context-card p{margin:0;color:var(--rhi-muted);font-size:var(--rhi-font-body);line-height:1.42;font-weight:var(--rhi-weight-regular)}
    .rhi-fact-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--rhi-card-gap);margin:0 0 var(--rhi-space-3)}
    .rhi-fact{min-width:0;display:grid;grid-template-columns:30px minmax(0,1fr);gap:8px;align-items:center;border:1px solid var(--rhi-line);border-radius:var(--rhi-radius-md);background:#fff;padding:9px 10px;box-shadow:none}
    .rhi-fact ha-icon{--mdc-icon-size:20px;color:#355D96}
    .rhi-fact small,.rhi-fact span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .rhi-fact small{font-size:var(--rhi-font-label);color:var(--rhi-muted-soft);font-weight:var(--rhi-weight-medium)}
    .rhi-fact b{display:block;margin-top:2px;color:var(--rhi-ink);font-size:14px;font-weight:var(--rhi-weight-strong);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rhi-fact span{margin-top:2px;font-size:var(--rhi-font-small);color:var(--rhi-muted)}

    /* Responsive composition uses the same grammar at every size. */
    @media(max-width:1180px){
      :host{--rhi-page-pad-x:18px}
      .rhi-page-hero{height:174px!important;min-height:174px!important}
      .rhi-page-hero-copy{width:51%!important;padding:24px 14px 20px 18px!important}
      .rhi-page-hero-art{inset:0 0 0 30%!important}
      .rhi-top-status-item{grid-template-columns:40px minmax(0,1fr);padding:9px 10px;min-height:78px}
      .rhi-top-status-icon{width:37px;height:37px}
    }
    @media(max-height:900px) and (min-width:761px){
      :host{--rhi-page-pad-y:10px}
      .rhi-page-hero{height:164px!important;min-height:164px!important}
      .rhi-page-hero-copy{padding-top:20px!important;padding-bottom:18px!important}
    }
    @media(max-width:760px){
      :host{--rhi-page-pad-x:10px;--rhi-page-pad-y:9px;--rhi-font-body:12px;--rhi-font-small:10.75px}
      .rhi-page-hero{height:154px!important;min-height:154px!important;border-radius:14px!important}
      .rhi-page-hero-copy{width:59%!important;padding:18px 9px 16px 13px!important}
      .rhi-page-hero-copy h1{font-size:27px!important;letter-spacing:-.032em!important}
      .rhi-page-hero-copy p{font-size:11px!important;line-height:1.32!important;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .rhi-page-hero-art{inset:0 0 0 34%!important}
      .rhi-top-status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .rhi-top-status-item{min-height:74px;grid-template-columns:34px minmax(0,1fr);gap:7px;padding:8px}
      .rhi-top-status-icon{width:32px;height:32px;border-radius:9px}
      .rhi-top-status-icon ha-icon{--mdc-icon-size:20px!important}
      .rhi-top-actions{overflow-x:auto;flex-wrap:nowrap}
      .rhi-top-actions-title,.rhi-top-action{flex:0 0 auto}
      .vehicle-management-bar{grid-template-columns:1fr!important}
      .vehicle-sort-control,.vehicle-manage-button{grid-column:auto!important}
      .vehicle-page-summary{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .vehicle-filter-group{overflow-x:auto!important}
      .vehicle-filter-group button{flex:0 0 auto!important}
      .rhi-context-grid{grid-template-columns:1fr}
      .rhi-fact-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    }
    @media(max-width:430px){
      :host{--rhi-page-pad-x:8px;--rhi-page-pad-y:8px}
      .rhi-page-hero{height:146px!important;min-height:146px!important}
      .rhi-page-hero-copy{width:64%!important;padding:16px 8px 14px 11px!important}
      .rhi-page-hero-copy h1{font-size:24px!important}
      .rhi-page-hero-copy p{font-size:10.5px!important;-webkit-line-clamp:2}
      .rhi-page-hero-art{inset:0 0 0 38%!important}
      .rhi-top-status-grid{grid-template-columns:1fr 1fr}
      .rhi-context-card{padding:11px}
      .rhi-fact{grid-template-columns:24px minmax(0,1fr);gap:6px}
      .rhi-fact ha-icon{--mdc-icon-size:18px}
    }
    @media(min-width:1440px){
      .rhi-page-hero-copy{width:min(46%,650px)!important}
      .rhi-page-hero-art{inset:0 0 0 26%!important}
    }
  `;
}
