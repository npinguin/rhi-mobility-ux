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
const footer=source.split('function hbMobilityReleaseFooter(rt) {')[1]?.split('\\n}')[0] || '';
if(!footer.includes('Status '+String.fromCharCode(34))) {
  // The status is derived from Mobility's own supervisor, not frontend heuristics.
  if(!footer.includes('issue="Status "+state')) throw new Error('Mobility runtime status not published in footer');
}
if(footer.includes('show_diagnostics')) throw new Error('Mobility version/status may not be hidden by show_diagnostics');


const requiredCore=[
  'function rhiUxTechnicalFooter(',
  'class="rhiUxTechnicalFooter"',
  'data-severity='
];
for(const token of requiredCore) if(!core.includes(token)) throw new Error('RHI UX Core footer contract missing: '+token);
for(const forbidden of [
  'class="rhiUxFooter"',
  'class="rhiUxFooterDetails"',
  'hi-release-footer',
  'Source Mobility release contract'
]) if(source.includes(forbidden)) throw new Error('legacy Mobility-specific footer structure remains: '+forbidden);

console.log('PASS Mobility footer delegates shared presentation to RHI UX Core');
