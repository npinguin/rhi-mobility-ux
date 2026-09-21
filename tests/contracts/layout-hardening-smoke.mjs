import fs from 'node:fs';

const header=fs.readFileSync(new URL('../../src/app/header-and-navigation.js',import.meta.url),'utf8');
for(const needle of [
  'display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important',
  '.status-strip.dashboard-status-strip .metric',
  '.status-strip.ops-status-strip .metric',
  '.outcome-header .metric',
  'grid-template-columns:28px minmax(0,1fr)!important',
  '--rhi-company-logo-max-width:286px',\n  'grid-template-columns:minmax(240px,.60fr) minmax(0,1.40fr)',\n  '.hi-module-tabs{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px',\n  'justify-content:center'
]) {
  if(!header.includes(needle)) throw new Error(`layout-hardening regression: missing ${needle}`);
}

console.log('PASS shared status rail and shell geometry');
