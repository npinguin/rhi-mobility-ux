import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const hacs=JSON.parse(fs.readFileSync(path.join(root,'hacs.json'),'utf8'));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'dist/PACKAGE_MANIFEST.json'),'utf8'));
const publish=fs.readFileSync(path.join(root,'.github/workflows/publish-hacs.yml'),'utf8');

if(hacs.filename!=='rhi-mobility-ux.js') throw new Error('HACS filename drift');
if(hacs.content_in_root!==false) throw new Error('HACS plugin must use dist as remote package path');
if(hacs.zip_release===true) throw new Error('plugin zip_release is not part of the supported package model');
if(manifest.version!==pkg.version) throw new Error('package manifest version drift');
if(manifest.hacs_package_root!=='dist') throw new Error('HACS package root must be dist');
if(manifest.hacs_filename!==hacs.filename) throw new Error('package manifest/HACS filename drift');
if(manifest.asset_delivery!=='flat_hacs_plugin_root') throw new Error('runtime assets must be flat in HACS plugin package root');
if(manifest.asset_filename_prefix!=='asset--') throw new Error('flat HACS asset prefix drift');
for(const category of ['branding','vehicles','chargers','heroes']){
  if(!manifest.asset_categories.includes(category)) throw new Error(`package asset category missing: ${category}`);
}
if(fs.existsSync(path.join(root,'dist/assets'))) throw new Error('nested dist/assets is incompatible with HACS plugin downloader');

const distEntries=fs.readdirSync(path.join(root,'dist'),{withFileTypes:true});
for(const entry of distEntries){
  if(entry.isDirectory()) throw new Error(`HACS plugin dist must be flat; nested directory found: ${entry.name}`);
}
for(const row of manifest.files){
  if(row.path.includes('/')) throw new Error(`nested package path HACS plugin will not install: ${row.path}`);
  const full=path.join(root,'dist',row.path);
  if(!fs.existsSync(full)) throw new Error(`package manifest file missing: ${row.path}`);
  const bytes=fs.readFileSync(full);
  if(bytes.length!==row.bytes) throw new Error(`package manifest size drift: ${row.path}`);
}
const flatAssets=manifest.files.filter((row)=>row.path.startsWith('asset--'));
if(flatAssets.length<1) throw new Error('HACS package contains no flattened runtime assets');

const createBlock=(publish.match(/gh release create[\s\S]*?^\s*fi/m)||[''])[0];
for(const forbidden of ['dist/','COMPATIBILITY.json','RELEASE_MANIFEST.json','QUALIFICATION.json','PACKAGE_MANIFEST.json','.sha256']){
  if(createBlock.includes(forbidden)) throw new Error(`tagged HACS plugin release must not attach GitHub Release asset: ${forbidden}`);
}
if(publish.includes('gh release upload')) throw new Error('publication must not upload GitHub Release assets');
const checksum=fs.readFileSync(path.join(root,'dist/rhi-mobility-ux.js.sha256'),'utf8').trim().split(/\s+/)[0];
if(manifest.runtime_sha256!==checksum) throw new Error('package manifest runtime checksum drift');
console.log(`PASS HACS package: flat dist root with ${flatAssets.length} runtime assets matches actual HACS plugin download semantics`);
