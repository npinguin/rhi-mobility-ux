import fs from 'node:fs';

const header=fs.readFileSync(new URL('../../src/entry/00-header-and-navigation.js',import.meta.url),'utf8');
const logoPath=new URL('../../src/assets/files/branding/company-logo.svg',import.meta.url);

if(!fs.existsSync(logoPath)) throw new Error('canonical shared Robotix.be logo source asset missing');
if(!header.includes('const HB_MOBILITY_COMPANY_LOGO_SVG = "__RHI_COMPANY_LOGO_INLINE__";')) throw new Error('header does not declare inline canonical shared logo placeholder');
if(header.includes('rhiMobilityAssetUrl(HB_MOBILITY_COMPANY_LOGO')) throw new Error('header still depends on external HACS company logo path');

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

console.log('PASS shared horizontal status rail and unified inline RHI company-brand slot');
