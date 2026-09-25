import fs from 'node:fs';

const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const router=fs.readFileSync(new URL('../../src/ui/screens/router.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');
const vehicleAdapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');
const chargerAdapter=fs.readFileSync(new URL('../../src/domain/adapters/charger-adapter.js',import.meta.url),'utf8');

for (const needle of [
  'MOBILITY_PUBLIC_RUNTIME_V2',
  'MOBILITY_EXPERIENCE_V2',
  'MOBILITY_POLICY_V2',
  'mobilityRuntimeV2()',
  'mobilityExperienceV2()',
  'mobilityPolicyV2()',
  'vehicleExperienceV2(assetId = "")',
  'chargerExperienceV2(assetId = "")',
  'vehicleRelationshipV2(assetId = "")',
  'writePublishedPropertyAsync(assetId = "", propertyKey = "", value = "", options = {})'
]) if (!runtime.includes(needle)) throw new Error(`V2 UX contract consumer missing: ${needle}`);

for (const forbidden of [
  'setMobilityPolicy(policyKey = "", value = "")',
  'writePublishedProperty(assetId = "", propertyKey = "", value = "")',
  'writePropertyValue(prop = {}, value = "")'
]) if (runtime.includes(forbidden)) throw new Error(`optimistic/no-readback write API returned: ${forbidden}`);

for (const needle of [
  'rt.mobilityFleetV2()',
  'rt.mobilityPolicyV2()',
  'model?.projection?.signals',
  'model?.projection?.relationships',
  'model?.projection?.commands',
  'label:"Fleet"',
  'label:"Profiles"',
  'label:"Charging setup"',
  '<small>Security</small>',
  '<small>Maintenance</small>'
]) if (!dashboard.includes(needle)) throw new Error(`V2-driven dashboard projection contract missing: ${needle}`);
if(dashboard.includes('rt.mobilityExperienceV2(') || dashboard.includes('rt.vehicleExperienceV2(')) {
  throw new Error('dashboard reintroduced direct Experience V2 interpretation outside VehicleProjection');
}
if(!vehicleAdapter.includes('observed_identity_proven === true')) throw new Error('VehicleProjection lost physical relationship identity proof');

for (const forbidden of [
  'thresholdKm = 100',
  'unsafeValues = new Set',
  'vehicle.inspection_due_days',
  'vehicle.oil_service_due_days',
  'const days = Math.min(...values)',
  'const selected = String(rel?.selected || "")',
  'backend #107',
  'Low-range policy pending V2'
]) if (dashboard.includes(forbidden)) throw new Error(`frontend product inference returned: ${forbidden}`);

for (const needle of [
  'rt.mobilityFleetV2()',
  'factory.adapterFor(charger, this.config)?.build?.()',
  'model?.projection?.experience',
  'label:"Profiles"',
  'label:"Availability"',
  'label:"Runtime"',
  'if (faultCount) chargerHeaderCards.push'
]) if (!chargers.includes(needle)) throw new Error(`Charger Management V2 projection architecture missing: ${needle}`);
if(chargers.includes('rt.mobilityExperienceV2(') || chargers.includes('rt.chargerExperienceV2(')) {
  throw new Error('Charger Management reintroduced direct Experience V2 interpretation outside ChargerProjection');
}

for (const forbidden of [
  'charger.available_for_connection',
  'snapshot?.operating?.resolved && String(snapshot.operating.value || "").toLowerCase() === "fault"',
  'capacity V2 gap',
  'backend #107'
]) if (chargers.includes(forbidden)) throw new Error(`charger management inferred product status returned: ${forbidden}`);

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
]) if (!router.includes(needle)) throw new Error(`routed status simplification missing: ${needle}`);

if (!vehicleAdapter.includes('this.rt.vehicleExperienceV2(assetId)')) throw new Error('vehicle detail must consume Experience V2');
for (const forbidden of ['rangeKm < 100','maintenanceDays < 90','unsafeValues = new Set']) {
  if (vehicleAdapter.includes(forbidden)) throw new Error(`vehicle detail reintroduced UX inference: ${forbidden}`);
}
if (!chargerAdapter.includes('this.rt.chargerExperienceV2(assetId)')) throw new Error('charger detail must consume Experience V2');
if (!chargerAdapter.includes('String(fault.state || "").toLowerCase() === "active"')) throw new Error('charger detail fault must use Experience V2 fault state');

if (!presentation.includes('title:"Vehicle Management"') || !presentation.includes('title:"Charger Management"')) throw new Error('management hero naming drift');
if (!presentation.includes('status-count-${visible.length}')) throw new Error('status grid must size to useful card count');
if (!presentation.includes('.rhi-top-status-item.ok .rhi-top-status-icon,.rhi-top-status-item.neutral .rhi-top-status-icon{background:#F0F5FC;color:#355D96}')) throw new Error('normal/OK status colour must stay neutral');

console.log('PASS V2 contract ownership: backend concludes, asset projectors normalize, UX selects/aggregates/formats/presents');
