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
  'grid-template-columns:minmax(270px,.72fr) minmax(430px,1.28fr)',
  '.hi-module-tabs{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px',
  'justify-content:center'
]) {
  if(!header.includes(needle)) throw new Error(`layout-hardening regression: missing ${needle}`);
}

console.log('PASS shared shell geometry');

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

for(const needle of ['--rhi-content-gap:10px','--rhi-control-h:40px','.vehicle-card,.charger-card','.section-title,.vehicle-workspace-head,.ov-panel-head']){
  if(!presentation.includes(needle)) throw new Error(`Overview-reference shared style regression: missing ${needle}`);
}


const strategyHero=presentationApi.hbMobilityPageHero({escape:(v)=>String(v)},'strategies');
if(!strategyHero.includes('src="/hacsfiles/rhi-mobility-ux/asset--heroes--mobility-strategies.png"')) throw new Error('strategy hero did not render exact installed HACS asset URL');
if(strategyHero.includes('asset--hacsfiles--')) throw new Error('hero URL double-resolution regression detected');
const overviewHeroExact=presentationApi.hbMobilityPageHero({escape:(v)=>String(v)},'overview');
if(!overviewHeroExact.includes('src="/hacsfiles/rhi-mobility-ux/asset--heroes--mobility-overview.png"')) throw new Error('overview hero did not render exact installed HACS asset URL');
