import fs from 'node:fs';

const header=fs.readFileSync(new URL('../../src/app/header-and-navigation.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');
const catalog=fs.readFileSync(new URL('../../src/app/asset-catalog.js',import.meta.url),'utf8');
const assetShell=fs.readFileSync(new URL('../../src/ui/components/asset-shell.js',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const router=fs.readFileSync(new URL('../../src/ui/screens/router.js',import.meta.url),'utf8');

for(const needle of [
  'display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important',
  '.status-strip.dashboard-status-strip .metric',
  '.status-strip.ops-status-strip .metric',
  '.outcome-header .metric',
  'grid-template-columns:28px minmax(0,1fr)!important',
  '--rhi-company-logo-max-width:286px',
  'grid-template-columns:minmax(168px,.52fr) minmax(0,1.48fr)',
  '.hi-module-tabs{width:100%;min-width:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px',
  'justify-content:center'
]) {
  if(!header.includes(needle)) throw new Error(`layout-hardening regression: missing ${needle}`);
}

console.log('PASS shared shell geometry');

for(const needle of [
  'grid-template-columns:minmax(0,1fr) clamp(var(--rhi-company-area-min),23%,var(--rhi-company-area-max))',
  '.hi-product-area{min-width:0;overflow:hidden}',
  'min-width:0;\n      width:100%;\n      min-height:46px',
  '.hi-module-tab span{min-width:0;display:block;overflow:hidden;text-overflow:ellipsis}',
  '.domain-tab-icon{--mdc-icon-size:16px'
]) {
  if(!header.includes(needle)) throw new Error(`responsive navigation integrity regression: missing ${needle}`);
}
console.log('PASS Mobility navigation cannot paint underneath branding');

for(const needle of [
  'HB_MOBILITY_PAGE_HEROES',
  'asset_key:"overview"',
  'asset_key:"vehicles"',
  'asset_key:"chargers"',
  'asset_key:"planning"',
  'asset_key:"strategies"',
  'asset_key:"history"',
  'asset_key:"log"',
  '--rhi-page-pad-x',
  '--rhi-font-display',
  '@media(max-width:760px)',
  '@media(max-width:430px)',
  '@media(min-width:1440px)'
]) if(!presentation.includes(needle)) throw new Error(`shared presentation regression: missing ${needle}`);

if(!dashboard.includes('hbMobilityPageHero(rt, "overview"')) throw new Error('Overview no longer uses shared hero');
if(!dashboard.includes('hbMobilityPageHero(rt, "vehicles"')) throw new Error('Vehicles no longer uses shared hero');
if(!chargers.includes('hbMobilityPageHero(rt, "chargers"')) throw new Error('Chargers no longer uses shared hero');
if(header.includes('key: "charging"')) throw new Error('non-existent Charging tab returned to Mobility navigation');
if(presentation.includes('title:"Charging"')) throw new Error('non-existent Charging tab returned to shared hero contract');
console.log('PASS shared omni-device presentation grammar for Overview, Vehicles and Chargers');

for(const needle of [
  '--rhi-font-card:15px',
  '--rhi-font-body:12.5px',
  '--rhi-font-small:11px',
  '--rhi-weight-strong:620',
  '--rhi-icon-action:18px',
  'font-weight:610!important',
  'height:188px!important',
  '@media(max-height:900px) and (min-width:761px)',
  'height:164px!important'
]) {
  if(!presentation.includes(needle)) throw new Error(`rc.57 design-language regression: missing ${needle}`);
}
console.log('PASS rc.57 sharp readable responsive design language');


if(presentation.includes('\\n')) throw new Error('shared presentation source contains escaped-newline serialization and would not execute as a real module');
const presentationApi = new Function(
  'rhiMobilityAssetUrl',
  catalog + '\n' + presentation + '\nreturn { hbMobilityPageHero, hbMobilityPresentationStyles, rhiMobilityHeroCatalog };'
)((path)=>'/hacsfiles/rhi-mobility-ux/assets/'+path);
if(typeof presentationApi.hbMobilityPageHero !== 'function') throw new Error('shared hero function is not executable');
if(typeof presentationApi.hbMobilityPresentationStyles !== 'function') throw new Error('shared presentation styles are not executable');
const renderedHero=presentationApi.hbMobilityPageHero({escape:(v)=>String(v)},'overview',{meta:'<strong>5 active</strong>'});
if(!renderedHero.includes('Mobility Overview') || !renderedHero.includes('/assets/heroes/mobility-overview.png')) throw new Error('shared Overview hero does not render canonical package output');
const heroRows=presentationApi.rhiMobilityHeroCatalog();
if(heroRows.length!==9) throw new Error(`canonical hero count drifted: ${heroRows.length}; expected 9`);
if(new Set(heroRows.map((row)=>row.package_path)).size!==9) throw new Error('canonical hero keys must map one-to-one to nine unique assets');
for(const key of ['overview','vehicles','chargers','planning','strategies','history','log','vehicle_detail','charging_detail']) {
  if(!heroRows.some((row)=>row.key===key)) throw new Error(`canonical hero key missing: ${key}`);
}
if(!assetShell.includes('rhiMobilityHeroAsset(model.type === "charger" ? "charging_detail" : "vehicle_detail")')) throw new Error('detail shell no longer resolves canonical detail hero scenes');
console.log('PASS shared presentation module executes, not only parses');

for(const needle of ['--rhi-content-gap:8px','--rhi-control-h:38px','.vehicle-card,.charger-card','.section-title,.vehicle-workspace-head,.ov-panel-head']){

  if(!presentation.includes(needle)) throw new Error(`Overview-reference shared style regression: missing ${needle}`);
}


const strategyHero=presentationApi.hbMobilityPageHero({escape:(v)=>String(v)},'strategies');
if(!strategyHero.includes('src="/hacsfiles/rhi-mobility-ux/assets/heroes/mobility-strategies.png"')) throw new Error('strategy hero did not render exact installed HACS asset URL');
const overviewHeroExact=presentationApi.hbMobilityPageHero({escape:(v)=>String(v)},'overview');
if(!overviewHeroExact.includes('src="/hacsfiles/rhi-mobility-ux/assets/heroes/mobility-overview.png"')) throw new Error('overview hero did not render exact installed HACS asset URL');
if(strategyHero.includes('/hacsfiles/rhi-mobility-ux/assets/hacsfiles/') || strategyHero.includes('asset--hacsfiles--')) throw new Error('hero URL double-resolution regression detected');


if(!presentation.includes('Canonical page composition: Overview is the visual reference')) throw new Error('shared Overview-style hero geometry missing');
if(!presentation.includes('function hbMobilityStatusGrid(')) throw new Error('shared top status renderer missing');
if(!presentation.includes('function hbMobilityQuickActions(')) throw new Error('shared top actions renderer missing');
if(/rhi-page-hero-meta">\$\{meta/.test(presentation)) throw new Error('hero mini status/meta rendering returned');
for(const source of [dashboard,chargers,router]){
  if(!source.includes('hbMobilityStatusGrid')) throw new Error('top-level screen missing shared Overview-style status grid');
  if(!source.includes('hbMobilityQuickActions')) throw new Error('top-level screen missing shared Overview-style quick actions');
}
if(dashboard.includes('hbMobilityPageHero(rt, "vehicles", {\n        meta:')) throw new Error('Vehicles hero still carries mini substatus metadata');
if(chargers.includes('hbMobilityPageHero(rt, "chargers", {')) throw new Error('Chargers hero still carries mini substatus metadata');
if(router.includes('hbMobilityOutcomeStrip(rt, view')) throw new Error('Intelligence/Insights still use generic five-column outcome strip at top level');


for(const forbidden of [
  'MOBILITY / VEHICLE MANAGEMENT',
  'MOBILITY / CHARGER MANAGEMENT',
  'INTELLIGENCE / ENERGY PLANNING',
  'INTELLIGENCE / STRATEGIES',
  'INSIGHTS / ENERGY & MOBILITY',
  'INSIGHTS / LOG'
]) {
  if(presentation.includes(forbidden)) throw new Error(`navigation-location eyebrow returned to hero contract: ${forbidden}`);
}
for(const tab of ['overview','vehicles','chargers','planning','strategies','history','log']) {
  const html=presentationApi.hbMobilityPageHero({escape:(v)=>String(v)},tab);
  if(/<small>\s*[^<]+<\/small>/.test(html)) throw new Error(`top-level hero contains navigation/location eyebrow: ${tab}`);
}

for(const forbidden of ['class="breadcrumb"','class="back-inline"','class="hero-topline"']) {
  if(assetShell.includes(forbidden)) throw new Error(`detail hero navigation chrome returned: ${forbidden}`);
}
for(const required of [
  'class="detail-purpose"',
  'class="detail-status-grid status-count-${Math.min(4,statusItems.length)}"',
  'Inspect readiness, charging relationship, operational status and direct actions for this vehicle.',
  'Inspect charger availability, connection health, power, linked vehicle and direct controls for this charging point.',
  'rc.39 canonical detail composition',
  '.detail-scene-hero h1{margin:8px 0 10px!important;font-size:clamp(31px,3.1vw,48px)!important',
  '.detail-status-grid{display:grid!important',
  '.actions{min-height:52px!important'
]) {
  if(!assetShell.includes(required)) throw new Error(`canonical detail layout regression: missing ${required}`);
}
const heroIndex=assetShell.indexOf('class="hero detail-scene-hero"');
const statusIndex=assetShell.indexOf('class="detail-status-grid status-count-');
const actionsIndex=assetShell.indexOf('class="actions"');
if(!(heroIndex >= 0 && statusIndex > heroIndex && actionsIndex > statusIndex)) throw new Error('detail page hierarchy must be hero -> status -> quick actions');
