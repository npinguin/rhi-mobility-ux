import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const hacs=JSON.parse(fs.readFileSync(path.join(root,'hacs.json'),'utf8'));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'dist/PACKAGE_MANIFEST.json'),'utf8'));
const publish=fs.readFileSync(path.join(root,'.github/workflows/publish-hacs.yml'),'utf8');

if(hacs.filename!=='rhi-mobility-ux.js') throw new Error('HACS filename drift');
if(hacs.content_in_root!==false) throw new Error('HACS plugin must use standard dist/ package semantics (content_in_root=false)');
if(hacs.zip_release===true) throw new Error('plugin zip_release is not part of the supported package model');
if(manifest.version!==pkg.version) throw new Error('package manifest version drift');
if(manifest.hacs_package_root!=='dist') throw new Error('HACS package root must be dist');
if(manifest.hacs_filename!==hacs.filename) throw new Error('package manifest/HACS filename drift');
for(const category of ['branding','vehicles','chargers','heroes']){
  if(!manifest.asset_categories.includes(category)) throw new Error(`package asset category missing: ${category}`);
  if(!fs.existsSync(path.join(root,'dist/assets',category))) throw new Error(`dist asset category missing: ${category}`);
}
if(fs.existsSync(path.join(root,'assets'))) throw new Error('parallel root assets tree is forbidden');

for(const row of manifest.files){
  const full=path.join(root,'dist',row.path);
  if(!fs.existsSync(full)) throw new Error(`package manifest file missing: ${row.path}`);
  const bytes=fs.readFileSync(full);
  if(bytes.length!==row.bytes) throw new Error(`package manifest size drift: ${row.path}`);
}
const createBlock=(publish.match(/gh release create[\s\S]*?^\s*fi/m)||[''])[0];
for(const forbidden of ['dist/','COMPATIBILITY.json','RELEASE_MANIFEST.json','QUALIFICATION.json','PACKAGE_MANIFEST.json','.sha256']){
  if(createBlock.includes(forbidden)) throw new Error(`tagged HACS plugin release must not attach GitHub Release asset: ${forbidden}`);
}
if(publish.includes('gh release upload')) throw new Error('publication must not upload GitHub Release assets');
const checksum=fs.readFileSync(path.join(root,'dist/rhi-mobility-ux.js.sha256'),'utf8').trim().split(/\s+/)[0];
if(manifest.runtime_sha256!==checksum) throw new Error('package manifest runtime checksum drift');
console.log('PASS HACS package: nested dist/assets package restored with branding, vehicles, chargers and heroes');
