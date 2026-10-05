import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const read=(rel)=>fs.readFileSync(fileURLToPath(new URL('../../src/'+rel,import.meta.url)),'utf8');
const vehicle=read('domain/adapters/vehicle-adapter.js');
const charger=read('domain/adapters/charger-adapter.js');
const dashboard=read('ui/screens/mobility-dashboard.js');
const chargerScreen=read('ui/screens/charger-maintenance.js');

for (const [name,source] of [['VehicleProjection',vehicle],['ChargerProjection',charger]]) {
  if(!source.includes('productProjection()')) throw new Error(`${name} authority missing productProjection()`);
  for(const contract of ['MOBILITY_PUBLIC_RUNTIME_V2','MOBILITY_EXPERIENCE_V2','MOBILITY_COMMAND_V2']) {
    if(!source.includes(contract)) throw new Error(`${name} does not declare ${contract} authority`);
  }
}

for(const key of ['range_intelligence','energy_intelligence','security_intelligence','comfort_intelligence','maintenance_intelligence','charging_intelligence']) {
  if(!vehicle.includes(key)) throw new Error(`VehicleProjection missing Experience family: ${key}`);
}
for(const key of ['configured_charger_id','effective_charger_id','physically_connected_charger_id','identity_proven']) {
  if(!vehicle.includes(key)) throw new Error(`VehicleProjection missing relationship field: ${key}`);
}
for(const key of ['actual_current','current_limit','offered_current','session_energy','lifetime_energy']) {
  if(!charger.includes(key)) throw new Error(`ChargerProjection missing canonical fact: ${key}`);
}

const forbiddenDashboard=[
  'rt.vehicleExperienceV2(',
  'rt.mobilityExperienceV2(',
  'rt.vehicleChargerRelationship(',
  'rt.chargerProductSnapshot(',
  'rt.commandActionsFor(',
  'rt.propertyByCompoundKey(',
  'rt.semanticProperty(',
  'rt.vehicleOverviewMetricSlots(',
  'rt.vehicleChargePowerControlModel(',
  'rt.vehicleRelationshipV2('
];
for(const token of forbiddenDashboard) if(dashboard.includes(token)) throw new Error(`dashboard bypasses canonical projection: ${token}`);

const forbiddenCharger=[
  'rt.mobilityExperienceV2(',
  'rt.chargerExperienceV2(',
  'rt.chargerProductSnapshot(',
  'rt.commandActionsFor(',
  'rt.canonicalChargerPropertyDisplay(',
  'rt.canonicalChargerPropertyValue('
];
for(const token of forbiddenCharger) if(chargerScreen.includes(token)) throw new Error(`charger management bypasses canonical projection: ${token}`);


for(const token of ['vehicleChargerRelationship(assetId)','experience?.charging_relationship ||','physicalVehicleForCharger(assetId)','relatedVehicleForCharger(assetId)']) {
  if(vehicle.includes(token)) throw new Error(`VehicleProjection/build retains parallel relationship path: ${token}`);
}
if(charger.includes('vehicleIntel.connected_vehicle_asset_id')) throw new Error('ChargerProjection may not take physical relationship identity from Experience');
if(charger.includes('physicalVehicleForCharger(assetId)') || charger.includes('relatedVehicleForCharger(assetId)')) throw new Error('Charger build retains parallel relationship projection');

if(!dashboard.includes('model?.projection?.signals')) throw new Error('dashboard does not consume projected signals');
if(!dashboard.includes('model?.projection?.commands')) throw new Error('dashboard does not consume projected commands');
if(!chargerScreen.includes('const projection = model?.projection || {}')) throw new Error('charger management does not consume ChargerProjection');


const rawProjectionBypasses=[
  'rt.mobilityRuntimeV2(',
  'rt.mobilityExperienceV2(',
  'rt.mobilityPolicyV2(',
  'rt.vehicleExperienceV2(',
  'rt.chargerExperienceV2(',
  'rt.vehicleRelationshipV2(',
  'rt.mobilityFleetV2('
];
for(const [name,source] of [['dashboard',dashboard],['charger management',chargerScreen],['vehicle adapter',vehicle],['charger adapter',charger]]) {
  for(const token of rawProjectionBypasses) if(source.includes(token)) throw new Error(`${name} bypasses canonical runtime projection: ${token}`);
}
for(const token of ['vehicleExperienceProjection(assetId)','vehicleRelationshipProjection(assetId)']) {
  if(!vehicle.includes(token)) throw new Error('VehicleProjection missing canonical runtime projection '+token);
}
if(!charger.includes('chargerExperienceProjection(assetId)')) throw new Error('ChargerProjection missing canonical Experience projection');
if(!dashboard.includes('mobilityFleetProjection()')) throw new Error('Overview must consume canonical fleet projection');
if(!dashboard.includes('rangePolicyProjection()')) throw new Error('Overview must consume canonical policy projection');
if(!chargerScreen.includes('mobilityFleetProjection()')) throw new Error('Charger management must consume canonical fleet projection');

console.log('PASS canonical asset projectors are the sole Mobility semantic entry for Overview/Management');
