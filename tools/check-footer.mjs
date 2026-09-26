import fs from 'node:fs';

const headerUrl=new URL('../src/app/header-and-navigation.js',import.meta.url);
const coreUrl=new URL('../src/vendor/rhi-ux-core.js',import.meta.url);
const source=fs.readFileSync(headerUrl,'utf8');
const core=fs.readFileSync(coreUrl,'utf8');

const requiredSource=[
  'function hbMobilityReleaseFooter(rt)',
  'return rhiUxTechnicalFooter({',
  'product:"RHI Mobility"',
  'backendVersion:backend',
  'issue,',
  'severity'
];
for(const token of requiredSource) if(!source.includes(token)) throw new Error('Mobility footer adapter missing: '+token);

const requiredCore=[
  'function rhiUxTechnicalFooter(',
  'class="rhiUxTechnicalFooter"',
  '.rhiUxTechnicalFooter{',
  '[data-severity="warning"]',
  '[data-severity="error"]'
];
for(const token of requiredCore) if(!core.includes(token)) throw new Error('RHI UX Core footer contract missing: '+token);

for(const forbidden of [
  'class="rhiUxFooter"',
  'class="rhiUxFooterDetails"',
  'hi-release-footer',
  'Source Mobility release contract'
]) if(source.includes(forbidden)) throw new Error('legacy Mobility-specific footer structure remains: '+forbidden);

console.log('PASS Mobility footer delegates shared presentation to RHI UX Core');
