import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const dist=path.join(root,'dist');
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'PACKAGE_MANIFEST.json'),'utf8'));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rhi-mobility-hacs-'));
const installRoot=path.join(tmp,'www/community/rhi-mobility-ux');
const product=JSON.parse(fs.readFileSync(path.join(root,'release/product.json'),'utf8'));
const publish=fs.readFileSync(path.join(root,'.github/workflows/publish-hacs.yml'),'utf8');
const stable=fs.readFileSync(path.join(root,'.github/workflows/release.yml'),'utf8');

try{
  if(product.release_asset_policy!=='none') throw new Error('tagged HACS plugin release must have release_asset_policy=none');
  const createBlock=(publish.match(/gh release create[\s\S]*?^\s*fi/m)||[''])[0];
  for(const forbidden of ['dist/','COMPATIBILITY.json','RELEASE_MANIFEST.json','QUALIFICATION.json','PACKAGE_MANIFEST.json','.sha256']){
    if(createBlock.includes(forbidden)) throw new Error(`publish workflow attaches HACS-diverting GitHub Release asset: ${forbidden}`);
  }
  if(publish.includes('gh release upload')) throw new Error('publish workflow must not upload GitHub Release assets');
  if(stable.includes('gh release upload')) throw new Error('stable workflow must not upload GitHub Release assets');

  fs.mkdirSync(installRoot,{recursive:true});

  // Mirror current HACS plugin gather_files_to_download() exactly enough for our package:
  // remote location is dist and HACS installs only files directly under dist.
  for(const entry of fs.readdirSync(dist,{withFileTypes:true})){
    if(entry.isDirectory()) continue;
    fs.copyFileSync(path.join(dist,entry.name),path.join(installRoot,entry.name));
  }

  const installed=fs.readdirSync(installRoot,{withFileTypes:true});
  if(installed.some((entry)=>entry.isDirectory())) throw new Error('simulated HACS plugin install unexpectedly contains directories');

  for(const row of manifest.files){
    if(row.path.includes('/')) throw new Error(`package manifest contains nested path HACS plugin will not install: ${row.path}`);
    const full=path.join(installRoot,row.path);
    if(!fs.existsSync(full)) throw new Error(`simulated HACS install missing: ${row.path}`);
    const bytes=fs.readFileSync(full);
    if(bytes.length!==row.bytes) throw new Error(`simulated HACS install size mismatch: ${row.path}`);
  }

  const resolver=fs.readFileSync(path.join(root,'src/app/asset-paths.js'),'utf8');
  const catalog=fs.readFileSync(path.join(root,'src/app/asset-catalog.js'),'utf8');
  const sandbox={};
  vm.createContext(sandbox);
  vm.runInContext(resolver+'\n'+catalog,sandbox,{timeout:5000});
  const refs=vm.runInContext(`[
    ...rhiMobilityImageCatalog().map((row)=>row.package_file),
    ...rhiMobilityHeroCatalog().map((row)=>row.package_path)
  ].filter(Boolean)`,sandbox,{timeout:1000});
  if(!refs.length) throw new Error('package asset catalogs have no references');
  for(const rel of refs){
    const name=vm.runInContext(`rhiMobilityPackagedAssetName(${JSON.stringify(rel)})`,sandbox,{timeout:1000});
    if(!name || name.includes('/')) throw new Error(`asset did not resolve to flat HACS filename: ${rel} -> ${name}`);
    if(!fs.existsSync(path.join(installRoot,name))) throw new Error(`catalog asset missing after exact HACS plugin install: ${rel} -> ${name}`);
  }

  for(const required of [
    'asset--branding--company-logo.svg',
    'asset--vehicles--vehicle_fallback.png',
    'asset--chargers--charger_fallback.png',
    'asset--heroes--mobility-overview.png',
    'asset--heroes--mobility-strategies.png'
  ]){
    if(!fs.existsSync(path.join(installRoot,required))) throw new Error(`required installed package asset missing: ${required}`);
  }
  console.log(`PASS exact HACS plugin install simulation: ${manifest.files.length} flat files installed; ${refs.length} catalog references resolve to installed assets`);
} finally {
  fs.rmSync(tmp,{recursive:true,force:true});
}
