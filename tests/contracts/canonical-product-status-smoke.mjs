import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');

for (const forbidden of [
  '/unlocked|\\bopen\\b|door|window|check vehicle/i',
  '/tire|tyre|pressure|oil|inspection|service|maintenance.*due|overdue|check/i',
  'assignment?.editor_value ?? assignment?.value'
]) {
  if (dashboard.includes(forbidden)) throw new Error(`frontend semantic inference returned: ${forbidden}`);
}

for (const required of [
  'rt.vehicleChargerRelationship(this.assetId(vehicle))?.selected',
  'rt.vehicleChargerRelationship(this.assetId(vehicle))?.connected',
  '"vehicle.inspection_due_days"',
  '"vehicle.oil_service_due_days"',
  '"vehicle.oil_change_due_days"',
  'headline:`${unsafe} unsafe` : "0 unsafe"',
  'line1:`${secure} secure · ${incomplete} incomplete`',
  'headline:`${overdue} overdue`',
  'Future due dates are not maintenance issues',
  'label:"Physical identity"',
  'sub:"Vehicle ↔ charger"',
  'label:"Charging", value:String(chargingCount)'
]) {
  if (!dashboard.includes(required)) throw new Error(`canonical dashboard status contract missing: ${required}`);
}

for (const required of [
  'label:"Connected", value:String(connectedCount)',
  'label:"Charging", value:String(chargingCount)',
  'label:"Available", value:String(availableCount)',
  'connection === "disconnected"',
  '["running","charging"].includes(value)'
]) {
  if (!chargers.includes(required)) throw new Error(`canonical charger status contract missing: ${required}`);
}

if (chargers.includes('label:"Operational"') || chargers.includes('label:"Attention"')) {
  throw new Error('charger top status regressed to overlapping operational/attention cards');
}

console.log('PASS canonical Mobility product status semantics and focused top-level status rows');
