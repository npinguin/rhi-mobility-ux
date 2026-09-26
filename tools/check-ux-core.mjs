import fs from 'node:fs';

const meta=JSON.parse(fs.readFileSync(new URL('../src/vendor/RHI_UX_CORE.json',import.meta.url),'utf8'));
const manifest=JSON.parse(fs.readFileSync(new URL('../src/manifest.json',import.meta.url),'utf8'));
const vendor=fs.readFileSync(new URL('../src/vendor/rhi-ux-core.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../src/app/presentation.js',import.meta.url),'utf8');
const header=fs.readFileSync(new URL('../src/app/header-and-navigation.js',import.meta.url),'utf8');

if(meta.version!=='1.1.0') throw new Error('unexpected RHI UX Core version');
if(meta.source_commit!=='480eaef12955d56970ec172fdde6f5fe2e0ab9c6') throw new Error('RHI UX Core source commit drift');
if(meta.runtime_dependency!==false) throw new Error('RHI UX Core must remain build-time only');
if(manifest.modules[0]!=='vendor/rhi-ux-core.js') throw new Error('RHI UX Core must load before Mobility modules');
for(const text of [vendor,presentation,header]){
  if(text.includes('/hacsfiles/rhi-ux-core')) throw new Error('runtime dependency on rhi-ux-core is forbidden');
}
if(!presentation.includes('rhiUxCoreStyles()')) throw new Error('Mobility presentation must consume Core styles');
if(!header.includes('rhiUxTechnicalFooter({')) throw new Error('Mobility footer must consume Core primitive');
console.log('PASS Mobility consumes pinned RHI UX Core 1.1.0 without runtime coupling');
