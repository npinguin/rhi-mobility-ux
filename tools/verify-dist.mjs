import fs from 'node:fs';
const file=new URL('../dist/rhi-mobility-ux.js', import.meta.url);
const text=fs.readFileSync(file,'utf8');
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url),'utf8'));
const required=['homebrain-mobility-dashboard-card','homebrain-vehicle-asset-detail-card','homebrain-charger-asset-detail-card','homebrain-mobility-charger-maintenance-card',pkg.version];
for(const token of required) if(!text.includes(token)) throw new Error(`dist missing ${token}`);
for(const token of ['/local/homebrain','homebrain-mobility-assets.bundle.js?v=']) if(text.includes(token)) throw new Error(`legacy runtime dependency remains: ${token}`);
const asset=new URL('../dist/assets/vehicles/vehicle_fallback.png',import.meta.url); if(!fs.existsSync(asset)) throw new Error('dist runtime assets missing');
console.log('PASS dist self-contained and expected custom elements present');
