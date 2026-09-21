import fs from 'node:fs';

const header=fs.readFileSync(new URL('../../src/entry/00-header-and-navigation.js',import.meta.url),'utf8');
const logoPath=new URL('../../assets/branding/company-logo.svg',import.meta.url);

if(!fs.existsSync(logoPath)) throw new Error('shared Robotix.be logo missing at HACS runtime root assets path');
if(!header.includes('rhiMobilityAssetUrl(HB_MOBILITY_COMPANY_LOGO, UX_VERSION)')) throw new Error('header does not resolve canonical shared logo through HACS asset resolver');

for(const needle of [
  'display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important',
  '.status-strip.dashboard-status-strip .metric',
  '.status-strip.ops-status-strip .metric',
  '.outcome-header .metric',
  'grid-template-columns:28px minmax(0,1fr)!important',
  '--rhi-company-logo-max-width:286px'
]) {
  if(!header.includes(needle)) throw new Error(`layout-hardening regression: missing ${needle}`);
}

console.log('PASS shared horizontal status rail and unified RHI company-brand slot');
