import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(process.cwd());
const src=path.join(root,'src');
function walk(dir){
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()){ if(entry.name!=='vendor') out.push(...walk(p)); }
    else if(entry.isFile() && p.endsWith('.js')) out.push(p);
  }
  return out;
}
const errors=[];
for(const file of walk(src)){
  const rel=path.relative(root,file).split(path.sep).join('/');
  const value=fs.readFileSync(file,'utf8');
  if(/font-family\s*:/i.test(value)) errors.push(rel+': domain font-family declaration is forbidden; UX Core owns typography');
  if(/--rhi-font-[\w-]+\s*:/i.test(value)) errors.push(rel+': --rhi-font-* tokens are UX Core-owned');
  for(const selector of ['.rhiUxPageHero{','.rhiUxStatusGrid{','.rhiUxQuickActionBar{','.rhiUxDomainBody{']){
    if(value.replace(/\s+/g,'').includes(selector)) errors.push(rel+': shared selector '+selector+' may only be styled by UX Core');
  }
}
const presentation=fs.readFileSync(path.join(src,'app','presentation.js'),'utf8');
for(const fn of ['rhiUxPageHero','rhiUxStatusGrid','rhiUxQuickActionBar']) if(!presentation.includes(fn)) errors.push('src/app/presentation.js: must consume Core primitive '+fn);
for(const legacy of ['.rhi-page-hero{','.rhi-top-status-grid{','.rhi-top-actions{']) if(presentation.replace(/\s+/g,'').includes(legacy)) errors.push('src/app/presentation.js: legacy shared visual owner remains '+legacy);
const dash=fs.readFileSync(path.join(src,'ui','screens','mobility-dashboard.js'),'utf8');
if(!dash.includes('page rhiUxDomainBody rhi-ux-root')) errors.push('mobility-dashboard.js: page root must consume Core body/typography classes');
const meta=JSON.parse(fs.readFileSync(path.join(src,'vendor','RHI_UX_CORE.json'),'utf8'));
const product=JSON.parse(fs.readFileSync(path.join(root,'release','product.json'),'utf8'));
if(meta.version!==product.ux_core?.version) errors.push('Core version authority drift: '+meta.version+' != '+product.ux_core?.version);
if(meta.source_commit!==product.ux_core?.source_commit) errors.push('Core source commit authority drift');
const vendor=fs.readFileSync(path.join(src,'vendor','rhi-ux-core.js'),'utf8');
if(!vendor.includes('const RHI_UX_CORE_VERSION = "'+meta.version+'";')) errors.push('vendored Core runtime version does not match metadata authority');
if(errors.length) throw new Error(errors.join('\n'));
console.log('PASS shared visual ownership: Core owns typography, hero, status, quick actions and body grammar');
