import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');
const vehicleAdapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');

for (const needle of [
  'hbMobilityPageHero(rt, "overview")',
  'Mobility Overview',
  'class="ov-status-grid ov-domain-statusbar"',
  '<small>Charging</small>',
  '<small>Range</small>',
  '<small>Security</small>',
  '<small>Maintenance</small>',
  'overviewChargingStatus(rt, vehicles, chargers)',
  'overviewRangeStatus(rt, vehicles)',
  'overviewSecurityStatus(rt, vehicles)',
  'overviewMaintenanceStatus(rt, vehicles)',
  'rt.mobilityFleetV2()',
  'rt.mobilityPolicyV2()',
  'class="ov-quickbar energy-like"',
  'class="ov-panel ov-core-vehicles ov-overview-vehicles"',
  '<h2>Vehicles</h2>',
  'this.renderChargerAssignmentSelect(rt, asset)',
  "Readiness first: range and energy, security, comfort, maintenance, charger relationship and direct actions.",
  "const navActive = this.dashboardTabFromRoute()",
  "this.overviewStyles()"
]) if (!dashboard.includes(needle)) throw new Error(`canonical Overview missing: ${needle}`);

for (const forbidden of [
  'thresholdKm = 100',
  'unsafeValues = new Set',
  'const days = Math.min(...values)',
  '<small>Comfort</small>',
  '<small>Attention</small>',
  'meta:`<strong>${rt.escape(fleetLabel)}',
  '<small>Vehicles</small><b>',
  '<small>Charging now</small>',
  '<small>Chargers</small><b>',
  'class="ov-core-grid"',
  '<h2>Next action</h2>',
  '<h2>Recent activity</h2>',
  'class="ov-conclusion"',
  'Energy today'
]) if (dashboard.includes(forbidden)) throw new Error(`obsolete/inferred Overview content returned: ${forbidden}`);

if(dashboard.includes('rt.mobilityExperienceV2(')) throw new Error('Overview bypasses the canonical Vehicle/Charger projections for Experience V2');
if(dashboard.includes('rt.vehicleExperienceV2(')) throw new Error('Overview directly reinterprets per-vehicle Experience V2');
if(!dashboard.includes('model?.projection?.signals')) throw new Error('Overview does not render shared VehicleProjection signals');
if(!dashboard.includes('(model?.projection?.commands || []).slice(0, 2)')) throw new Error('Overview does not render shared VehicleProjection commands');
if(!vehicleAdapter.includes('observed_identity_proven === true')) throw new Error('VehicleProjection does not preserve physical relationship identity proof');
if(!vehicleAdapter.includes('comfort_intelligence')) throw new Error('VehicleProjection does not consume Comfort Experience V2');

if(!presentation.includes('asset_key:"overview"')) throw new Error('Overview is not bound to the canonical hero key');
if(!presentation.includes('Know if your vehicles are ready, secure and comfortable')) throw new Error('Overview hero product purpose drifted from shared presentation contract');

console.log('PASS Mobility Overview consumes canonical asset projections and preserves the four agreed user questions');
