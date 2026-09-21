import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');

for (const needle of [
  'class="ov-energy-hero"',
  'Mobility Overview',
  'Know if your vehicles are ready, secure and comfortable',
  'class="ov-status-grid"',
  'Charging now',
  'class="ov-quickbar energy-like"',
  'class="ov-core-grid"',
  '<h2>Vehicles</h2>',
  '<h2>Chargers</h2>',
  '<h2>Recent activity</h2>',
  '<h2>Next action</h2>',
  'class="ov-conclusion"',
  'this.renderChargerAssignmentSelect(rt, asset)',
  'this.dashboardVehicleCommands(rt, assetId).slice(0, 2)',
  'Range and charge first, with security, comfort, maintenance and direct actions alongside.'
]) if (!dashboard.includes(needle)) throw new Error(`canonical Overview missing: ${needle}`);

for (const forbidden of [
  'Energy today',
  'All ready</small>',
  '3 available</small>'
]) if (dashboard.includes(forbidden)) throw new Error(`mock-only hardcoded runtime value leaked into product: ${forbidden}`);

console.log('PASS Mobility-first action-oriented Overview contract');
