import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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

  // Model current HACS tagged-plugin selection: any release assets would be preferred.
  const simulatedReleaseAssets=[];
  if(simulatedReleaseAssets.length) throw new Error('tagged release assets would override the dist tree');
  fs.mkdirSync(path.dirname(installRoot),{recursive:true});
  fs.cpSync(dist,installRoot,{recursive:true});

  const allowedTop=new Set(['rhi-mobility-ux.js','rhi-mobility-ux.js.sha256','PACKAGE_MANIFEST.json','assets']);
  for(const entry of fs.readdirSync(installRoot)){
    if(!allowedTop.has(entry)) throw new Error(`unexpected HACS package top-level entry: ${entry}`);
  }

  for(const row of manifest.files){
    const full=path.join(installRoot,row.path);
    if(!fs.existsSync(full)) throw new Error(`simulated HACS install missing: ${row.path}`);
    const bytes=fs.readFileSync(full);
    if(bytes.length!==row.bytes) throw new Error(`simulated HACS install size mismatch: ${row.path}`);
  }

  const catalog=fs.readFileSync(path.join(root,'src/app/asset-catalog.js'),'utf8');
  const refs=[...catalog.matchAll(/package_path:"([^"]+)"/g)].map(m=>m[1]);
  if(!refs.length) throw new Error('package asset catalog has no references');
  for(const rel of refs){
    if(!fs.existsSync(path.join(installRoot,'assets',rel))) throw new Error(`package catalog has no installed asset: ${rel}`);
  }

  for(const required of ['assets/branding/company-logo.svg','assets/vehicles/vehicle_fallback.png','assets/chargers/charger_fallback.png']){
    if(!fs.existsSync(path.join(installRoot,required))) throw new Error(`required installed package asset missing: ${required}`);
  }
  console.log(`PASS HACS tagged-release install simulation (zero release assets -> dist tree): ${manifest.files.length} files installed under www/community/rhi-mobility-ux with ${refs.length} catalog asset references resolved`);
} finally {
  fs.rmSync(tmp,{recursive:true,force:true});
}
