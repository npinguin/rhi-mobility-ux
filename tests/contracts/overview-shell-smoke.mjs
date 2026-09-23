import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');

for (const needle of [
  'hbMobilityPageHero(rt, "overview")',
  'Mobility Overview',
  'class="ov-status-grid ov-domain-statusbar"',
  '<small>Charging</small>',
  '<small>Climate / Comfort</small>',
  '<small>Security</small>',
  '<small>Maintenance</small>',
  'overviewChargingStatus(rt, vehicles, chargers)',
  'overviewOutsideTemperature()',
  'overviewNextDeparture(rt, vehicles)',
  'overviewSecurityStatus(rt, vehicles)',
  'overviewMaintenanceStatus(rt, vehicles)',
  'class="ov-quickbar energy-like"',
  'class="ov-panel ov-core-vehicles ov-overview-vehicles"',
  '<h2>Vehicles</h2>',
  'this.renderChargerAssignmentSelect(rt, asset)',
  'this.dashboardVehicleCommands(rt, assetId).slice(0, 2)',
  "Readiness first: range and energy, security, comfort, maintenance, charger relationship and direct actions.",
  "const navActive = this.dashboardTabFromRoute()",
  "this.overviewStyles()"
]) if (!dashboard.includes(needle)) throw new Error(`canonical Overview missing: ${needle}`);

for (const forbidden of [
  'meta:`<strong>${rt.escape(fleetLabel)}',
  '<small>Vehicles</small><b>',
  '<small>Charging now</small>',
  '<small>Chargers</small><b>',
  'class="ov-core-grid"',
  '<h2>Next action</h2>',
  '<h2>Recent activity</h2>',
  'class="ov-conclusion"',
  'Energy today',
  'All ready</small>',
  '3 available</small>'
]) if (dashboard.includes(forbidden)) throw new Error(`obsolete/mock Overview content returned: ${forbidden}`);

if(!presentation.includes('asset_key:"overview"')) throw new Error('Overview is not bound to the canonical hero key');
if(!presentation.includes('Know if your vehicles are ready, secure and comfortable')) throw new Error('Overview hero product purpose drifted from shared presentation contract');

console.log('PASS pixel-perfect Mobility Overview contract');
