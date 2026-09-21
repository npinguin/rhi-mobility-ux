import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const dist=path.join(root,'dist');
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'PACKAGE_MANIFEST.json'),'utf8'));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rhi-mobility-hacs-'));
const installRoot=path.join(tmp,'www/community/rhi-mobility-ux');

try{
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
  console.log(`PASS HACS install simulation: ${manifest.files.length} files installed under www/community/rhi-mobility-ux with ${refs.length} catalog asset references resolved`);
} finally {
  fs.rmSync(tmp,{recursive:true,force:true});
}
