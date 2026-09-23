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
      --rhi-page-max:1640px;--rhi-page-pad-x:28px;--rhi-page-pad-y:18px;
      --rhi-space-1:4px;--rhi-space-2:8px;--rhi-space-3:12px;--rhi-space-4:16px;--rhi-space-5:20px;
      --rhi-radius-sm:10px;--rhi-radius-md:14px;--rhi-radius-lg:18px;--rhi-radius-xl:22px;
      --rhi-line:#E4EAF2;--rhi-ink:#0F172A;--rhi-muted:#64748B;--rhi-blue:#1467F5;
      --rhi-surface:#FFFFFF;--rhi-soft:#F8FAFC;--rhi-shadow:0 12px 30px rgba(15,35,80,.055);
      --rhi-font-display:clamp(24px,2.2vw,34px);--rhi-font-section:clamp(17px,1.35vw,21px);
      --rhi-font-body:12px;--rhi-font-small:10.5px;
      --rhi-content-gap:10px;--rhi-card-gap:8px;--rhi-control-h:40px;
    }
    .page{width:min(100%,var(--rhi-page-max))!important;margin:0 auto!important;padding:var(--rhi-page-pad-y) var(--rhi-page-pad-x) 28px!important;box-sizing:border-box!important;gap:var(--rhi-content-gap)!important}
    .vehicle-card,.charger-card,.info,.summary,.vehicle-management-controls,.ov-panel{border-radius:var(--rhi-radius-lg)!important}
    .status-strip.dashboard-status-strip,.status-strip.ops-status-strip{margin:var(--rhi-space-2) 0 var(--rhi-space-3)!important;border-radius:var(--rhi-radius-lg)!important;box-shadow:var(--rhi-shadow)!important}
    .section-title,.vehicle-workspace-head,.ov-panel-head{margin-top:var(--rhi-space-2)!important;margin-bottom:var(--rhi-space-2)!important}
    .vehicle-management-bar{padding:var(--rhi-space-2)!important;gap:var(--rhi-space-2)!important;border-radius:var(--rhi-radius-md)!important;box-shadow:0 8px 22px rgba(15,35,80,.035)!important}
    .vehicle-filter-group{gap:var(--rhi-space-1)!important}
    .vehicle-filter-group button,.vehicle-sort-control,.vehicle-manage-button{height:36px!important;min-height:36px!important;border-radius:var(--rhi-radius-sm)!important}
    .vehicle-page-summary{gap:var(--rhi-space-2)!important}
    .vehicle-page-summary-item{min-height:52px!important;border-radius:var(--rhi-radius-md)!important;padding:var(--rhi-space-2) var(--rhi-space-3)!important}
    .vehicle-management-controls,.charger-picker-panel{margin-top:0!important}
    .action,.cmd,.vehicle-manage-button,.ov-nav-action,.charger-appearance-action{min-height:var(--rhi-control-h)!important}
    .vehicle-workspace-list,.inactive-list,.grid{gap:var(--rhi-card-gap)!important}
    .vehicle-workspace-list .vehicle-card,.charger-card{box-shadow:0 10px 26px rgba(15,35,80,.045)!important}
    @media(max-width:1024px){.vehicle-management-bar{grid-template-columns:minmax(0,1fr) auto!important}.vehicle-manage-button{grid-column:1/-1!important;justify-content:center!important}.vehicle-page-summary{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
    @media(max-width:760px){.vehicle-management-bar{grid-template-columns:1fr!important}.vehicle-sort-control,.vehicle-manage-button{grid-column:auto!important}.vehicle-page-summary{grid-template-columns:repeat(2,minmax(0,1fr))!important}.vehicle-filter-group{overflow-x:auto!important}.vehicle-filter-group button{flex:0 0 auto!important}}
    .rhi-page-hero{position:relative;min-height:136px;display:grid;grid-template-columns:minmax(0,1.28fr) minmax(280px,.72fr);align-items:center;gap:14px;overflow:hidden;border:1px solid #DDE6F0;border-radius:var(--rhi-radius-lg);background:linear-gradient(135deg,#F8FBFF 0%,#FFFFFF 52%,#EEF5FF 100%);box-shadow:var(--rhi-shadow);margin:0 0 10px}
    .rhi-page-hero:before{content:"";position:absolute;inset:auto auto -90px -50px;width:310px;height:210px;border-radius:50%;background:radial-gradient(circle,rgba(20,103,245,.08),transparent 68%);pointer-events:none}
    .rhi-page-hero-copy{position:relative;z-index:2;padding:18px 0 18px 22px;min-width:0;max-width:820px}
    .rhi-page-hero-copy>small{display:block;margin:0 0 4px;font-size:9px;font-weight:760;letter-spacing:.13em;text-transform:uppercase;color:#5E6E84}
    .rhi-page-hero-copy h1{margin:0 0 5px;font-size:var(--rhi-font-display);line-height:1.02;letter-spacing:-.035em;color:var(--rhi-ink);font-weight:680}
    .rhi-page-hero-copy p{margin:0;max-width:720px;color:var(--rhi-muted);font-size:11.5px;line-height:1.38;font-weight:520}
    .rhi-page-hero-meta{margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:20px;color:#334155;font-size:10.5px;font-weight:620}
    .rhi-page-hero-meta strong{color:#0F172A;font-size:11px}.rhi-page-hero-meta span{color:#64748B}
    .rhi-page-hero-actions{margin-top:10px;display:flex;gap:7px;flex-wrap:wrap}
    .rhi-page-hero-art{position:relative;align-self:stretch;min-height:136px;display:flex;align-items:center;justify-content:flex-end;overflow:hidden;pointer-events:none}
    .rhi-page-hero-art:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.15),rgba(238,245,255,.04) 36%,rgba(228,239,252,.10));pointer-events:none}
    .rhi-page-hero-art img{position:relative;z-index:1;width:100%;height:100%;min-height:136px;max-height:148px;object-fit:cover;object-position:center 58%;transform:scale(1.015);transform-origin:center}
    .rhi-page-hero-badge{position:absolute;right:12px;bottom:10px;z-index:3;border:1px solid rgba(255,255,255,.72);border-radius:999px;background:rgba(255,255,255,.86);backdrop-filter:blur(8px);padding:5px 8px;font-size:9.5px;color:#41516A;box-shadow:0 7px 18px rgba(15,35,80,.08)}
    .section-title,.vehicle-workspace-head,.ov-panel-head{color:var(--rhi-ink)}
    .section-title h2,.vehicle-workspace-head h2,.ov-panel-head h2{font-size:var(--rhi-font-section)!important;line-height:1.08!important;letter-spacing:-.02em!important;font-weight:660!important}
    .section-title p,.vehicle-workspace-head p,.ov-panel-head p{color:var(--rhi-muted)!important;font-size:var(--rhi-font-small)!important;line-height:1.35!important}
    button,select,input{font-family:inherit}.action,.cmd,.vehicle-manage-button,.ov-nav-action{border-radius:var(--rhi-radius-sm)!important}

    .rhi-context-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--rhi-card-gap);margin:0 0 var(--rhi-space-2)}
    .rhi-context-card{min-width:0;background:rgba(255,255,255,.96);border:1px solid var(--rhi-line);border-radius:var(--rhi-radius-lg);box-shadow:0 8px 22px rgba(15,35,80,.04);padding:14px 16px}
    .rhi-context-card-kicker{display:flex;align-items:center;gap:7px;margin-bottom:8px;color:var(--rhi-blue);font-size:9.5px;font-weight:760;letter-spacing:.09em;text-transform:uppercase}
    .rhi-context-card-kicker ha-icon{--mdc-icon-size:17px}
    .rhi-context-card h3{margin:0 0 5px;color:var(--rhi-ink);font-size:17px;line-height:1.15;font-weight:680;letter-spacing:-.02em}
    .rhi-context-card p{margin:0;color:var(--rhi-muted);font-size:11.5px;line-height:1.45}
    .rhi-fact-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--rhi-card-gap);margin:0 0 var(--rhi-space-3)}
    .rhi-fact{min-width:0;display:grid;grid-template-columns:30px minmax(0,1fr);gap:8px;align-items:center;border:1px solid var(--rhi-line);border-radius:var(--rhi-radius-md);background:#fff;padding:10px 12px;box-shadow:0 6px 18px rgba(15,35,80,.03)}
    .rhi-fact ha-icon{--mdc-icon-size:20px;color:var(--rhi-blue)}
    .rhi-fact small,.rhi-fact span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .rhi-fact small{font-size:9.5px;color:#718096;font-weight:600}
    .rhi-fact b{display:block;margin-top:2px;color:var(--rhi-ink);font-size:14px;font-weight:680;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rhi-fact span{margin-top:2px;font-size:9.5px;color:var(--rhi-muted)}
    .rhi-data-list{display:grid;gap:6px;margin-top:10px}
    .rhi-data-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:9px 10px;border:1px solid #edf1f6;border-radius:var(--rhi-radius-sm);background:var(--rhi-soft)}
    .rhi-data-row b{font-size:11.5px;color:var(--rhi-ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .rhi-data-row span{font-size:10.5px;color:var(--rhi-muted);white-space:nowrap}
    .rhi-context-note{margin:7px 2px 0;color:#718096;font-size:10px;line-height:1.4}
    @media(max-width:760px){.rhi-context-grid{grid-template-columns:1fr}.rhi-fact-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.rhi-context-card{padding:12px}.rhi-fact{padding:9px 10px}}
    @media(max-width:430px){.rhi-fact-grid{grid-template-columns:1fr 1fr}.rhi-fact{grid-template-columns:24px minmax(0,1fr);gap:6px}.rhi-fact ha-icon{--mdc-icon-size:17px}.rhi-context-card h3{font-size:16px}}
    @media(max-width:1024px){:host{--rhi-page-pad-x:18px;--rhi-page-pad-y:14px}.rhi-page-hero{grid-template-columns:minmax(0,1fr) minmax(240px,.62fr);min-height:142px}.rhi-page-hero-copy{padding:16px 0 16px 18px}.rhi-page-hero-art,.rhi-page-hero-art img{min-height:142px}}
    @media(max-width:760px){:host{--rhi-page-pad-x:10px;--rhi-page-pad-y:10px}.rhi-page-hero{min-height:126px;grid-template-columns:minmax(0,1fr) minmax(118px,.42fr);gap:2px;border-radius:16px;margin-bottom:8px}.rhi-page-hero-copy{padding:13px 0 13px 13px}.rhi-page-hero-copy>small{font-size:8px;margin-bottom:3px}.rhi-page-hero-copy h1{font-size:23px;margin-bottom:4px}.rhi-page-hero-copy p{font-size:10px;line-height:1.28;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.rhi-page-hero-meta{margin-top:7px;font-size:9.5px;gap:6px}.rhi-page-hero-art,.rhi-page-hero-art img{min-height:126px;max-height:126px}.rhi-page-hero-art img{object-fit:cover;object-position:62% center}.rhi-page-hero-badge{display:none}}
    @media(max-width:430px){:host{--rhi-page-pad-x:8px;--rhi-page-pad-y:8px}.rhi-page-hero{min-height:118px;grid-template-columns:minmax(0,1fr) 110px}.rhi-page-hero-copy{padding:11px 0 11px 11px}.rhi-page-hero-copy h1{font-size:21px}.rhi-page-hero-copy p{-webkit-line-clamp:2;font-size:9.5px}.rhi-page-hero-meta{font-size:9px;margin-top:6px}.rhi-page-hero-art,.rhi-page-hero-art img{min-height:118px;max-height:118px}}
    @media(min-width:1440px){.rhi-page-hero{grid-template-columns:minmax(0,1.36fr) minmax(360px,.64fr)}.rhi-page-hero-art img{object-position:55% center}}
    /* Canonical page composition: Overview is the visual reference for every top-level tab. */
    .rhi-page-hero{position:relative!important;display:block!important;min-height:clamp(176px,16vw,218px)!important;border:0!important;border-radius:18px!important;background:linear-gradient(90deg,#fff 0%,#fff 30%,rgba(255,255,255,.94) 39%,rgba(255,255,255,.18) 60%,rgba(255,255,255,0) 76%)!important;box-shadow:none!important;overflow:hidden!important;margin:0!important}
    .rhi-page-hero:before{display:none!important}
    .rhi-page-hero-copy{position:relative!important;z-index:4!important;width:min(48%,650px)!important;max-width:none!important;padding:32px 20px 28px 24px!important}
    .rhi-page-hero-copy>small{display:none!important;font-size:10px!important;color:#214A86!important;letter-spacing:.16em!important}
    .rhi-page-hero-copy h1{font-size:clamp(31px,3.1vw,48px)!important;line-height:.98!important;letter-spacing:-.048em!important;color:#08133A!important;margin:8px 0 10px!important}
    .rhi-page-hero-copy p{max-width:510px!important;font-size:clamp(12px,1.15vw,16px)!important;line-height:1.42!important;color:#536A91!important;font-weight:500!important}
    .rhi-page-hero-meta,.rhi-page-hero-actions{display:none!important}
    .rhi-page-hero-art{position:absolute!important;z-index:1!important;inset:0 0 0 27%!important;min-height:0!important;display:block!important;overflow:hidden!important}
    .rhi-page-hero-art:before{content:""!important;display:block!important;position:absolute!important;z-index:2!important;inset:0!important;background:linear-gradient(90deg,#fff 0%,rgba(255,255,255,.96) 9%,rgba(255,255,255,.68) 19%,rgba(255,255,255,.13) 37%,rgba(255,255,255,0) 55%)!important}
    .rhi-page-hero-art img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;object-fit:cover!important;object-position:center 52%!important;transform:none!important}

    .rhi-top-status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:0}.rhi-top-status-grid.status-count-1{grid-template-columns:1fr}.rhi-top-status-grid.status-count-2{grid-template-columns:repeat(2,minmax(0,1fr))}.rhi-top-status-grid.status-count-3{grid-template-columns:repeat(3,minmax(0,1fr))}
    .rhi-top-status-item{min-width:0;min-height:94px;display:grid;grid-template-columns:52px minmax(0,1fr);gap:11px;align-items:center;padding:12px 14px;border:1px solid #DBE6F3;border-radius:15px;background:rgba(255,255,255,.97);box-shadow:0 8px 22px rgba(21,61,115,.045)}
    .rhi-top-status-icon{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:#EEF5FF;color:#1467F5}
    .rhi-top-status-icon ha-icon{--mdc-icon-size:27px}
    .rhi-top-status-item.ok .rhi-top-status-icon{background:#EEF3FF;color:#315FBA}
    .rhi-top-status-item.warn .rhi-top-status-icon{background:#FFF4E8;color:#FF7500}
    .rhi-top-status-item.neutral .rhi-top-status-icon{background:#EEF3FF;color:#315FBA}
    .rhi-top-status-item>div{min-width:0}.rhi-top-status-item small{display:block;margin:0 0 3px;color:#31558E;font-size:10px;font-weight:650}
    .rhi-top-status-item b{display:block;margin:0 0 3px;color:#0B173D;font-size:clamp(14px,1.25vw,18px);font-weight:720;line-height:1.08;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rhi-top-status-item.warn b{color:#F05B0A}.rhi-top-status-item em{display:block;margin-top:2px;color:#55709B;font-size:10px;font-style:normal;font-weight:500;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rhi-top-actions{min-height:52px;padding:6px 10px;border:1px solid #DBE6F3;border-radius:14px;background:#fff;box-shadow:0 5px 16px rgba(21,61,115,.03);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .rhi-top-actions-title{font-size:9.5px;letter-spacing:.13em;text-transform:uppercase;color:#31558E;font-weight:700;margin-right:2px}
    .rhi-top-action{height:40px;min-height:40px;border:1px solid #D8E4F1;border-radius:10px;background:#fff;color:#075FD8;box-shadow:none;font-size:11px;font-weight:660;padding:0 13px;display:inline-flex;align-items:center;gap:7px;cursor:pointer}
    .rhi-top-action ha-icon{--mdc-icon-size:17px}.rhi-top-action.primary{background:#0B66F6;border-color:#0B66F6;color:#fff}
    @media(max-width:1024px){.rhi-page-hero{min-height:188px!important}.rhi-page-hero-copy{width:50%!important;padding:26px 16px 22px 18px!important}.rhi-page-hero-art{inset:0 0 0 30%!important}.rhi-top-status-item{grid-template-columns:42px minmax(0,1fr);padding:10px;min-height:88px}.rhi-top-status-icon{width:40px;height:40px}}
    @media(max-width:760px){.rhi-page-hero{min-height:168px!important}.rhi-page-hero-copy{width:58%!important;padding:20px 10px 18px 14px!important}.rhi-page-hero-copy h1{font-size:29px!important}.rhi-page-hero-art{inset:0 0 0 34%!important}.rhi-top-status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.rhi-top-actions{overflow-x:auto;flex-wrap:nowrap}.rhi-top-actions-title{flex:0 0 auto}.rhi-top-action{flex:0 0 auto}}
    @media(max-width:430px){.rhi-page-hero{min-height:154px!important}.rhi-page-hero-copy{width:64%!important;padding:17px 8px 15px 12px!important}.rhi-page-hero-copy h1{font-size:25px!important}.rhi-page-hero-copy p{font-size:10px!important;line-height:1.3!important}.rhi-page-hero-art{inset:0 0 0 38%!important}.rhi-top-status-grid{grid-template-columns:1fr 1fr}.rhi-top-status-item{grid-template-columns:34px minmax(0,1fr);min-height:76px;padding:8px;gap:7px}.rhi-top-status-icon{width:32px;height:32px;border-radius:10px}.rhi-top-status-icon ha-icon{--mdc-icon-size:20px}}
  `;
}
