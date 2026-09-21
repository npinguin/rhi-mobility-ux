import fs from 'node:fs';

const routes=fs.readFileSync(new URL('../../documentation/homebrain_mobility.hacs.yaml',import.meta.url),'utf8');
const install=fs.readFileSync(new URL('../../documentation/HACS_INSTALLATION.md',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const charger=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const detail=fs.readFileSync(new URL('../../src/ui/screens/router.js',import.meta.url),'utf8');

const expectedViews = [
  ['Overview','overview'],
  ['Vehicles','dashboard'],
  ['Vehicle & Charger Detail','asset-detail'],
  ['Chargers','charger-maintenance'],
  ['Charging','charging'],
  ['Planning','planning'],
  ['Strategies','strategies'],
  ['History','history'],
  ['Log','log']
];

for (const [title,path] of expectedViews) {
  if (!routes.includes(`title: ${title}\n    path: ${path}`)) throw new Error(`missing preserved/additive view: ${title} -> ${path}`);
  if (!install.includes(`title: ${title}\n    path: ${path}`)) throw new Error(`installation YAML drift for: ${title} -> ${path}`);
}

if (!charger.includes('homebrain-mobility-charger-maintenance-card')) throw new Error('charger screen class missing');
if (!detail.includes('homebrain-mobility-asset-detail-card')) throw new Error('asset detail screen class missing');

console.log('PASS screen preservation: documented views and screen registrations retained');
