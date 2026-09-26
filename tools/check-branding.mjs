import fs from 'node:fs';

const vendor=fs.readFileSync(new URL('../src/vendor/rhi-ux-core.js',import.meta.url),'utf8');
const header=fs.readFileSync(new URL('../src/app/header-and-navigation.js',import.meta.url),'utf8');
const build=fs.readFileSync(new URL('./build.mjs',import.meta.url),'utf8');
const sourceLogo=new URL('../src/assets/branding/company-logo.svg',import.meta.url);
const distLogo=new URL('../dist/assets/branding/company-logo.svg',import.meta.url);

for(const token of [
  'function rhiUxCompanyBrand(',
  'class="rhiUxCompanyLogo"',
  'Robotix.be',
  'DomotiX · Network · Security',
  '#0B4C86',
  '#5B95C8'
]) if(!vendor.includes(token)) throw new Error('canonical Core company-brand contract missing: '+token);

if(fs.existsSync(sourceLogo)) throw new Error('Mobility must not own a local company-logo source asset');
if(fs.existsSync(distLogo)) throw new Error('Mobility package must not ship a local company-logo asset');
for(const forbidden of ['HB_MOBILITY_COMPANY_LOGO','hbMobilityCompanyBrand','__RHI_COMPANY_LOGO_INLINE__']){
  if(header.includes(forbidden) || build.includes(forbidden)) throw new Error('Mobility company-brand ownership drift: '+forbidden);
}
console.log('PASS branding ownership: canonical RHI UX Core -> self-contained Mobility runtime');
