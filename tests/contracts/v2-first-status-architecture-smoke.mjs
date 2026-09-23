import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const router=fs.readFileSync(new URL('../../src/ui/screens/router.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');
const vehicleAdapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');
const chargerAdapter=fs.readFileSync(new URL('../../src/domain/adapters/charger-adapter.js',import.meta.url),'utf8');

for (const needle of [
  'overviewRangeStatus(rt, vehicles = [])',
  'vehicle.range_total_km',
  'thresholdKm = 100',
  'unsafeValues = new Set',
  'vehicle.inspection_due_days',
  'days < 90',
  'attentionCount:security.unsafeCount + maintenance.actionableCount',
  'label:"Fleet"',
  'label:"Profiles"',
  'label:"Charging setup"',
  'const selected = String(rel?.selected || "")',
  'Vehicle Management'
]) if (!dashboard.includes(needle)) throw new Error(`rc.43 UX status contract missing: ${needle}`);

for (const forbidden of [
  'label:"Configuration", value:"V2 contract gap"',
  'label:"Data health", value:"V2 contract gap"',
  'Low-range policy pending V2',
  'backend #107',
  '/unlocked|\\bopen\\b|door|window|check vehicle/i',
  '/tire|tyre|pressure|oil|inspection|service|maintenance.*due|overdue|check/i',
  'assignment?.editor_value ?? assignment?.value'
]) if (dashboard.includes(forbidden)) throw new Error(`rc.43 UX header leaked backend/inference noise: ${forbidden}`);

for (const needle of [
  'label:"Profiles"',
  'label:"Availability"',
  'label:"Runtime"',
  'connectedCount} connected · ${chargingCount} charging',
  'charger.available_for_connection',
  'if (faultCount) chargerHeaderCards.push'
]) if (!chargers.includes(needle)) throw new Error(`rc.43 Charger Management status architecture missing: ${needle}`);

for (const forbidden of [
  'V2 contract gap',
  'backend #107',
  'capacity V2 gap',
  'label:"Operational"',
  'label:"Power now"'
]) if (chargers.includes(forbidden)) throw new Error(`rc.43 charger header noise returned: ${forbidden}`);

for (const needle of [
  'label:"Today"',
  'label:"Still to plan"',
  'label:"Tomorrow"',
  'label:"Configured"',
  'label:"Effective"',
  'label:"Energy"',
  'label:"Value"',
  'label:"Vehicles"',
  'label:"Activity"'
]) if (!router.includes(needle)) throw new Error(`rc.43 routed status simplification missing: ${needle}`);

for (const forbidden of ['label:"Contract"','label:"Profile contract"','label:"Policy contract"','label:"Source"']) {
  if (router.includes(forbidden)) throw new Error(`technical contract KPI returned to header: ${forbidden}`);
}

if (!presentation.includes('title:"Vehicle Management"') || !presentation.includes('title:"Charger Management"')) throw new Error('management hero naming drift');
if (!presentation.includes('status-count-${visible.length}')) throw new Error('status grid must size to useful card count');
if (!presentation.includes('.rhi-top-status-item.ok .rhi-top-status-icon{background:#EEF3FF;color:#315FBA}')) throw new Error('normal/OK status colour must stay neutral');

for (const needle of [
  'label:"Range"',
  'label:"Charging"',
  'label:"Security"',
  'label:"Maintenance"',
  'rangeKm < 100',
  'maintenanceDays < 90'
]) if (!vehicleAdapter.includes(needle)) throw new Error(`vehicle detail header simplification missing: ${needle}`);

for (const needle of ['label:"State"','label:"Power"','label:"Vehicle"','headerStatus.push']) {
  if (!chargerAdapter.includes(needle)) throw new Error(`charger detail header simplification missing: ${needle}`);
}

console.log('PASS rc.43 UX-first status architecture: compact, factual and neutral unless actionable');
