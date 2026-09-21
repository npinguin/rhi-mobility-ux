import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourceManifest=JSON.parse(fs.readFileSync(path.join(root,'src/manifest.json'),'utf8'));
const ownership=JSON.parse(fs.readFileSync(path.join(root,'src/OWNERSHIP.json'),'utf8'));

if(ownership.principle!=='one source concern, one owner') throw new Error('source ownership principle drift');
for(const [name,owner] of Object.entries(ownership.owners||{})){
  if(!owner.path) throw new Error(`source owner ${name} has no path`);
  if(name!=='package' && !fs.existsSync(path.join(root,owner.path))) throw new Error(`source owner path missing: ${owner.path}`);
}
for(const legacy of ['src/entry','src/adapters','src/view-models','src/components','src/screens','src/assets/files']){
  if(fs.existsSync(path.join(root,legacy))) throw new Error(`legacy source tree remains: ${legacy}`);
}
if(fs.existsSync(path.join(root,'assets'))) throw new Error('generated root assets/ is forbidden; dist/ is the HACS package root');

const modules=sourceManifest.modules||[];
if(!modules.length) throw new Error('source manifest has no modules');
if(new Set(modules).size!==modules.length) throw new Error('duplicate module in src/manifest.json');
for(const rel of modules){
  const full=path.join(root,'src',rel);
  if(!fs.existsSync(full)) throw new Error(`source manifest module missing: src/${rel}`);
  if(/^\d+[-_]/.test(path.basename(rel))) throw new Error(`numeric load-order filename forbidden: ${rel}`);
}
if(sourceManifest.assets_root!=='assets') throw new Error('canonical source assets root must be src/assets');
for(const required of ['branding','vehicles','chargers']){
  if(!fs.existsSync(path.join(root,'src/assets',required))) throw new Error(`required asset category missing: ${required}`);
}
console.log('PASS source ownership: app/runtime/domain/ui/assets are explicit and load order lives only in src/manifest.json');
