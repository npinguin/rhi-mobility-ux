import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/app/header-and-navigation.js',import.meta.url),'utf8');
const core=fs.readFileSync(new URL('../src/vendor/rhi-ux-core.js',import.meta.url),'utf8');

if(!source.includes('return rhiUxTechnicalFooter({')) throw new Error('Mobility footer must delegate to shared RHI UX Core');
for(const forbidden of ['physical_acceptance','release_acceptance','diagnostic_bad_count','audit','qualification']){
  const start=source.indexOf('function hbMobilityReleaseFooter');
  const end=source.indexOf('function hbMobilityOutcomeStrip',start);
  const slice=source.slice(start,end);
  if(slice.includes(forbidden)) throw new Error('non-product proof/diagnostic leaked into product footer: '+forbidden);
}
if(!core.includes('function rhiUxTechnicalFooter')) throw new Error('shared Core technical footer unavailable');
console.log('PASS Mobility footer: canonical runtime health only; no proof/diagnostic coupling');
