import fs from 'node:fs';
import crypto from 'node:crypto';

const file=new URL('../dist/rhi-mobility-ux.js', import.meta.url);
const checksumFile=new URL('../dist/rhi-mobility-ux.js.sha256', import.meta.url);
const text=fs.readFileSync(file,'utf8');
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url),'utf8'));
const required=['homebrain-mobility-dashboard-card','homebrain-vehicle-asset-detail-card','homebrain-charger-asset-detail-card','homebrain-mobility-charger-maintenance-card',pkg.version];
for(const token of required) if(!text.includes(token)) throw new Error(`dist missing ${token}`);
for(const token of ['/local/homebrain','homebrain-mobility-assets.bundle.js?v=']) if(text.includes(token)) throw new Error(`legacy runtime dependency remains: ${token}`);
const asset=new URL('../dist/assets/vehicles/vehicle_fallback.png',import.meta.url);
if(!fs.existsSync(asset)) throw new Error('dist runtime assets missing');
if(!fs.existsSync(checksumFile)) throw new Error('dist checksum missing');
const actual=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const recorded=fs.readFileSync(checksumFile,'utf8').trim().split(/\s+/)[0];
if(actual!==recorded) throw new Error(`dist checksum mismatch: ${recorded} != ${actual}`);
console.log(`PASS dist self-contained, versioned and checksum verified: ${actual}`);
