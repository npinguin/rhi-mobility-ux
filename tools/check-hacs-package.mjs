import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const hacs=JSON.parse(fs.readFileSync(path.join(root,'hacs.json'),'utf8'));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'dist/PACKAGE_MANIFEST.json'),'utf8'));
const publish=fs.readFileSync(path.join(root,'.github/workflows/publish-hacs.yml'),'utf8');

if(hacs.filename!=='rhi-mobility-ux.js') throw new Error('HACS filename drift');
if(hacs.zip_release===true) throw new Error('plugin zip_release is not part of the supported package model');
if(manifest.version!==pkg.version) throw new Error('package manifest version drift');
if(manifest.hacs_package_root!=='dist') throw new Error('HACS package root must be dist');
if(manifest.hacs_filename!==hacs.filename) throw new Error('package manifest/HACS filename drift');
for(const category of ['branding','vehicles','chargers']){
  if(!manifest.asset_categories.includes(category)) throw new Error(`package asset category missing: ${category}`);
  if(!fs.existsSync(path.join(root,'dist/assets',category))) throw new Error(`dist asset category missing: ${category}`);
}
if(fs.existsSync(path.join(root,'assets'))) throw new Error('parallel root assets tree is forbidden');

for(const row of manifest.files){
  const full=path.join(root,'dist',row.path);
  if(!fs.existsSync(full)) throw new Error(`package manifest file missing: ${row.path}`);
  const bytes=fs.readFileSync(full);
  const digest=crypto.createHash('sha256').update(bytes).digest('hex');
  if(bytes.length!==row.bytes || digest!==row.sha256) throw new Error(`package manifest hash drift: ${row.path}`);
}
if(/gh release create[\s\S]*dist\/rhi-mobility-ux\.js(?:\s|\\)/.test(publish)) {
  throw new Error('publishing JS as a GitHub release asset would force HACS single-file mode and drop nested assets');
}
if(!publish.includes('dist/PACKAGE_MANIFEST.json')) throw new Error('release must attach package manifest evidence');
console.log('PASS HACS package: immutable tag dist tree contains runtime + structured assets; release assets are evidence-only');
