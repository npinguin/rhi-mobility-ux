import fs from 'node:fs';
import crypto from 'node:crypto';

const file=new URL('../dist/rhi-mobility-ux.js',import.meta.url);
const checksumFile=new URL('../dist/rhi-mobility-ux.js.sha256',import.meta.url);
const packageManifestFile=new URL('../dist/PACKAGE_MANIFEST.json',import.meta.url);
const text=fs.readFileSync(file,'utf8');
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
const required=['homebrain-mobility-dashboard-card','homebrain-vehicle-asset-detail-card','homebrain-charger-asset-detail-card','homebrain-mobility-charger-maintenance-card',pkg.version];
for(const token of required) if(!text.includes(token)) throw new Error(`dist missing ${token}`);
for(const token of ['/local/homebrain','homebrain-mobility-assets.bundle.js?v=']) if(text.includes(token)) throw new Error(`legacy runtime dependency remains: ${token}`);
for(const rel of ['assets/vehicles/vehicle_fallback.png','assets/chargers/charger_fallback.png']){
  if(!fs.existsSync(new URL('../dist/'+rel,import.meta.url))) throw new Error(`dist package asset missing: ${rel}`);
}
if(fs.existsSync(new URL('../dist/assets/branding',import.meta.url))) throw new Error('domain dist must not contain company branding; branding belongs to RHI UX Core');
if(!fs.existsSync(checksumFile)) throw new Error('dist checksum missing');
if(!fs.existsSync(packageManifestFile)) throw new Error('dist package manifest missing');
const actual=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const recorded=fs.readFileSync(checksumFile,'utf8').trim().split(/\s+/)[0];
if(actual!==recorded) throw new Error(`dist checksum mismatch: ${recorded} != ${actual}`);
const manifest=JSON.parse(fs.readFileSync(packageManifestFile,'utf8'));
if(manifest.version!==pkg.version || manifest.hacs_package_root!=='dist') throw new Error('package manifest identity drift');
console.log(`PASS dist package self-contained, versioned and checksum verified: ${actual}`);
