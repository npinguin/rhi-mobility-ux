import fs from 'node:fs';

const header=fs.readFileSync(new URL('../../src/app/header-and-navigation.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');
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
  'mobility-overview.svg',
  'mobility-vehicles.svg',
  'mobility-chargers.svg',
  'mobility-charging.svg',
  '--rhi-page-pad-x',
  '--rhi-font-display',
  '@media(max-width:760px)',
  '@media(max-width:430px)',
  '@media(min-width:1440px)'
]) if(!presentation.includes(needle)) throw new Error(`shared presentation regression: missing ${needle}`);

if(!dashboard.includes('hbMobilityPageHero(rt, "overview"')) throw new Error('Overview no longer uses shared hero');
if(!dashboard.includes('hbMobilityPageHero(rt, "vehicles"')) throw new Error('Vehicles no longer uses shared hero');
if(!chargers.includes('hbMobilityPageHero(rt, "chargers"')) throw new Error('Chargers no longer uses shared hero');
if(!router.includes('hbMobilityPageHero(rt, "charging"')) throw new Error('Charging no longer uses shared hero');
console.log('PASS shared omni-device presentation grammar and all Mobility tab heroes');
