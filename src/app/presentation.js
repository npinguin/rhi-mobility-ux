// Shared Mobility presentation grammar.
// Owns cross-screen visual hierarchy, density, responsive modes and tab heroes.
// Domain screens keep their semantics, data ownership and actions.

const HB_MOBILITY_PAGE_HEROES = Object.freeze({
  overview: { eyebrow:"MOBILITY", title:"Mobility Overview", description:"Know if your vehicles are ready, secure and comfortable, what is charging, and where action is needed.", asset:"heroes/mobility-overview.svg" },
  vehicles: { eyebrow:"MOBILITY / VEHICLE MANAGEMENT", title:"Vehicles", description:"Manage the vehicles you use every day: readiness, charger assignment, charging controls, direct actions and lifecycle.", asset:"heroes/mobility-vehicles.svg" },
  chargers: { eyebrow:"MOBILITY / CHARGER MANAGEMENT", title:"Chargers", description:"Manage charger availability, charging state, power, connected vehicles, controls and lifecycle from one compact workspace.", asset:"heroes/mobility-chargers.svg" }
});

function hbMobilityPageHero(rt, tab, options = {}) {
  const spec = HB_MOBILITY_PAGE_HEROES[tab] || HB_MOBILITY_PAGE_HEROES.overview;
  const esc = (value) => rt?.escape ? rt.escape(value) : String(value ?? "");
  const asset = options.asset || spec.asset;
  const meta = options.meta || "";
  const actions = options.actions || "";
  const badge = options.badge || "";
  return `<section class="rhi-page-hero rhi-page-hero-${esc(tab)}">
    <div class="rhi-page-hero-copy">
      <small>${esc(options.eyebrow || spec.eyebrow)}</small>
      <h1>${esc(options.title || spec.title)}</h1>
      <p>${esc(options.description || spec.description)}</p>
      ${meta ? `<div class="rhi-page-hero-meta">${meta}</div>` : ""}
      ${actions ? `<div class="rhi-page-hero-actions">${actions}</div>` : ""}
    </div>
    <div class="rhi-page-hero-art" aria-hidden="true">
      <img src="${esc(rhiMobilityAssetUrl(asset))}" alt="">
      ${badge ? `<div class="rhi-page-hero-badge">${badge}</div>` : ""}
    </div>
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
    .vehicle-management-controls,.charger-picker-panel{margin-top:0!important}
    .action,.cmd,.vehicle-manage-button,.ov-nav-action,.charger-appearance-action{min-height:var(--rhi-control-h)!important}
    .rhi-page-hero{position:relative;min-height:148px;display:grid;grid-template-columns:minmax(0,1.28fr) minmax(280px,.72fr);align-items:center;gap:14px;overflow:hidden;border:1px solid #DDE6F0;border-radius:var(--rhi-radius-lg);background:linear-gradient(135deg,#F8FBFF 0%,#FFFFFF 52%,#EEF5FF 100%);box-shadow:var(--rhi-shadow);margin:0 0 10px}
    .rhi-page-hero:before{content:"";position:absolute;inset:auto auto -90px -50px;width:310px;height:210px;border-radius:50%;background:radial-gradient(circle,rgba(20,103,245,.08),transparent 68%);pointer-events:none}
    .rhi-page-hero-copy{position:relative;z-index:2;padding:18px 0 18px 22px;min-width:0;max-width:820px}
    .rhi-page-hero-copy>small{display:block;margin:0 0 4px;font-size:9px;font-weight:760;letter-spacing:.13em;text-transform:uppercase;color:#5E6E84}
    .rhi-page-hero-copy h1{margin:0 0 5px;font-size:var(--rhi-font-display);line-height:1.02;letter-spacing:-.035em;color:var(--rhi-ink);font-weight:680}
    .rhi-page-hero-copy p{margin:0;max-width:720px;color:var(--rhi-muted);font-size:11.5px;line-height:1.38;font-weight:520}
    .rhi-page-hero-meta{margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:20px;color:#334155;font-size:10.5px;font-weight:620}
    .rhi-page-hero-meta strong{color:#0F172A;font-size:11px}.rhi-page-hero-meta span{color:#64748B}
    .rhi-page-hero-actions{margin-top:10px;display:flex;gap:7px;flex-wrap:wrap}
    .rhi-page-hero-art{position:relative;align-self:stretch;min-height:148px;display:flex;align-items:center;justify-content:flex-end;overflow:hidden;pointer-events:none}
    .rhi-page-hero-art:before{content:"";position:absolute;inset:10px 8px 10px 0;border-radius:20px;background:radial-gradient(circle at 68% 52%,rgba(20,103,245,.08),transparent 63%)}
    .rhi-page-hero-art img{position:relative;z-index:1;width:100%;height:100%;min-height:148px;max-height:160px;object-fit:cover;object-position:center}
    .rhi-page-hero-badge{position:absolute;right:12px;bottom:10px;z-index:3;border:1px solid rgba(255,255,255,.72);border-radius:999px;background:rgba(255,255,255,.86);backdrop-filter:blur(8px);padding:5px 8px;font-size:9.5px;color:#41516A;box-shadow:0 7px 18px rgba(15,35,80,.08)}
    .section-title,.vehicle-workspace-head,.ov-panel-head{color:var(--rhi-ink)}
    .section-title h2,.vehicle-workspace-head h2,.ov-panel-head h2{font-size:var(--rhi-font-section)!important;line-height:1.08!important;letter-spacing:-.02em!important;font-weight:660!important}
    .section-title p,.vehicle-workspace-head p,.ov-panel-head p{color:var(--rhi-muted)!important;font-size:var(--rhi-font-small)!important;line-height:1.35!important}
    button,select,input{font-family:inherit}.action,.cmd,.vehicle-manage-button,.ov-nav-action{border-radius:var(--rhi-radius-sm)!important}
    @media(max-width:1024px){:host{--rhi-page-pad-x:18px;--rhi-page-pad-y:14px}.rhi-page-hero{grid-template-columns:minmax(0,1fr) minmax(240px,.62fr);min-height:142px}.rhi-page-hero-copy{padding:16px 0 16px 18px}.rhi-page-hero-art,.rhi-page-hero-art img{min-height:142px}}
    @media(max-width:760px){:host{--rhi-page-pad-x:10px;--rhi-page-pad-y:10px}.rhi-page-hero{min-height:126px;grid-template-columns:minmax(0,1fr) minmax(118px,.42fr);gap:2px;border-radius:16px;margin-bottom:8px}.rhi-page-hero-copy{padding:13px 0 13px 13px}.rhi-page-hero-copy>small{font-size:8px;margin-bottom:3px}.rhi-page-hero-copy h1{font-size:23px;margin-bottom:4px}.rhi-page-hero-copy p{font-size:10px;line-height:1.28;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.rhi-page-hero-meta{margin-top:7px;font-size:9.5px;gap:6px}.rhi-page-hero-art,.rhi-page-hero-art img{min-height:126px;max-height:126px}.rhi-page-hero-art img{object-fit:cover;object-position:62% center}.rhi-page-hero-badge{display:none}}
    @media(max-width:430px){:host{--rhi-page-pad-x:8px;--rhi-page-pad-y:8px}.rhi-page-hero{min-height:118px;grid-template-columns:minmax(0,1fr) 110px}.rhi-page-hero-copy{padding:11px 0 11px 11px}.rhi-page-hero-copy h1{font-size:21px}.rhi-page-hero-copy p{-webkit-line-clamp:2;font-size:9.5px}.rhi-page-hero-meta{font-size:9px;margin-top:6px}.rhi-page-hero-art,.rhi-page-hero-art img{min-height:118px;max-height:118px}}
    @media(min-width:1440px){.rhi-page-hero{grid-template-columns:minmax(0,1.36fr) minmax(360px,.64fr)}.rhi-page-hero-art img{object-position:55% center}}
  `;
}
