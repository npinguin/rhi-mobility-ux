import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const forbidden=[
  [/sensor\.mobility_/g,'public contract entity name outside runtime/domain adapter boundary'],
  [/script\.mobility_/g,'command ingress name outside runtime/domain adapter boundary'],
  [/\bhass\.states\b/g,'direct Home Assistant entity state access outside runtime boundary'],
  [/\bthis\.hass\.states\b/g,'direct Home Assistant entity state access outside runtime boundary'],
  [/\/local\/homebrain/g,'legacy manual deployment path']
];


const screenSemanticBypasses = {
  'src/ui/screens/mobility-dashboard.js': [
    [/rt\.vehicleExperienceV2\s*\(/g, 'screen bypasses VehicleProjection for Experience V2'],
    [/rt\.mobilityExperienceV2\s*\(/g, 'screen bypasses asset projectors for Experience V2'],
    [/rt\.vehicleChargerRelationship\s*\(/g, 'screen bypasses VehicleProjection for relationships'],
    [/rt\.chargerProductSnapshot\s*\(/g, 'screen bypasses ChargerProjection for canonical charger facts'],
    [/rt\.commandActionsFor\s*\(/g, 'screen bypasses asset projectors for commands'],
    [/rt\.(?:propertyByCompoundKey|semanticProperty|vehicleOverviewMetricSlots|vehicleChargePowerControlModel|vehicleRelationshipV2|mobilityFleetV2|mobilityPolicyV2)\s*\(/g, 'screen bypasses canonical Mobility projection']
  ],
  'src/ui/screens/charger-maintenance.js': [
    [/rt\.mobilityExperienceV2\s*\(/g, 'screen bypasses ChargerProjection for Experience V2'],
    [/rt\.chargerExperienceV2\s*\(/g, 'screen bypasses ChargerProjection for Experience V2'],
    [/rt\.chargerProductSnapshot\s*\(/g, 'screen bypasses ChargerProjection for canonical facts'],
    [/rt\.commandActionsFor\s*\(/g, 'screen bypasses ChargerProjection for commands'],
    [/rt\.canonicalChargerProperty(?:Display|Value)\s*\(/g, 'screen bypasses ChargerProjection for canonical facts'],
    [/rt\.(?:propertyByCompoundKey|semanticProperty|relatedVehicleForCharger|physicalVehicleForCharger|mobilityFleetV2)\s*\(/g, 'screen bypasses canonical ChargerProjection']
  ]
};

function jsFiles(dir){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry)=>{
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) return jsFiles(full);
    return entry.isFile() && entry.name.endsWith('.js') ? [full] : [];
  });
}

const failures=[];
for(const relDir of ['src/ui','src/app','src/domain/models']){
  for(const full of jsFiles(path.join(root,relDir))){
    const rel=path.relative(root,full);
    const source=fs.readFileSync(full,'utf8');
    for(const [rx,label] of forbidden){
      const count=[...source.matchAll(rx)].length;
      if(count) failures.push(`${rel}: ${label} (${count})`);
    }
  }
}

for (const [rel, rules] of Object.entries(screenSemanticBypasses)) {
  const full=path.join(root,rel);
  if(!fs.existsSync(full)) continue;
  const source=fs.readFileSync(full,'utf8');
  for(const [rx,label] of rules){
    const count=[...source.matchAll(rx)].length;
    if(count) failures.push(`${rel}: ${label} (${count})`);
  }
}

for(const full of jsFiles(path.join(root,'src/domain/adapters'))){
  const rel=path.relative(root,full);
  const source=fs.readFileSync(full,'utf8');
  if(/\bhass\.states\b|\bthis\.hass\.states\b/.test(source)) failures.push(`${rel}: direct hass state access belongs to runtime only`);
}


const vehicleAdapter=fs.readFileSync(path.join(root,'src/domain/adapters/vehicle-adapter.js'),'utf8');
for(const token of ['vehicleChargerRelationship(assetId)','experience?.charging_relationship ||','vehicleExperienceV2(assetId)','vehicleRelationshipV2(assetId)']) {
  if(vehicleAdapter.includes(token)) failures.push(`src/domain/adapters/vehicle-adapter.js: parallel vehicle authority: ${token}`);
}
const chargerAdapter=fs.readFileSync(path.join(root,'src/domain/adapters/charger-adapter.js'),'utf8');
for(const token of ['vehicleIntel.connected_vehicle_asset_id','physicalVehicleForCharger(assetId)','relatedVehicleForCharger(assetId)','chargerExperienceV2(assetId)']) {
  if(chargerAdapter.includes(token)) failures.push(`src/domain/adapters/charger-adapter.js: parallel charger authority: ${token}`);
}
const runtimeSource=fs.readFileSync(path.join(root,'src/runtime/ha-contract-runtime.js'),'utf8');
if(/mobilityRuntimeV2\(\)\?\.fleet\s*\|\|\s*this\.mobilityExperienceV2/.test(runtimeSource)) failures.push('runtime: parallel fleet authority is forbidden');
if(/return\s+this\.vehicleExperienceProjection[\s\S]{0,160}charging_relationship/.test(runtimeSource)) failures.push('runtime: Experience relationship fallback is forbidden');

const energyCrossDomainFiles = [
  'src/runtime/energy-public-v2-projection.js',
  'src/runtime/energy-planning-projection.js',
  'src/runtime/energy-mobility-insights-projection.js',
  'src/runtime/energy-mobility-strategy-projection.js'
];
for (const rel of energyCrossDomainFiles) {
  const full=path.join(root,rel);
  if(!fs.existsSync(full)) { failures.push(`${rel}: missing Energy canonical boundary file`); continue; }
  const source=fs.readFileSync(full,'utf8');
  if(!source.includes('RHI_ENERGY_CANONICAL_PROPERTY_V2') && !source.includes('HomeBrainEnergyPublicV2Projection')) failures.push(`${rel}: cross-domain Energy projection is not anchored to canonical properties`);
  const legacy=source.match(/sensor\.energy_[a-z0-9_]+/g)||[];
  if(legacy.length) failures.push(`${rel}: legacy Energy entity dependency: ${[...new Set(legacy)].join(', ')}`);
}

if(failures.length){
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('PASS architecture boundary: app/ui/models are contract-agnostic; HA access is runtime-owned');
