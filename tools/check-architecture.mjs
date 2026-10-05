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
    [/rt\.commandActionsFor\s*\(/g, 'screen bypasses asset projectors for commands']
  ],
  'src/ui/screens/charger-maintenance.js': [
    [/rt\.mobilityExperienceV2\s*\(/g, 'screen bypasses ChargerProjection for Experience V2'],
    [/rt\.chargerExperienceV2\s*\(/g, 'screen bypasses ChargerProjection for Experience V2'],
    [/rt\.chargerProductSnapshot\s*\(/g, 'screen bypasses ChargerProjection for canonical facts'],
    [/rt\.commandActionsFor\s*\(/g, 'screen bypasses ChargerProjection for commands'],
    [/rt\.canonicalChargerProperty(?:Display|Value)\s*\(/g, 'screen bypasses ChargerProjection for canonical facts']
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


const energyCrossDomainFiles = [
  'src/runtime/energy-public-v2-projection.js',
  'src/runtime/energy-planning-projection.js',
  'src/runtime/energy-mobility-insights-projection.js',
  'src/runtime/energy-mobility-strategy-projection.js'
];
for (const rel of energyCrossDomainFiles) {
  const full=path.join(root,rel);
  if(!fs.existsSync(full)) { failures.push(`${rel}: missing Energy Public V2 boundary file`); continue; }
  const source=fs.readFileSync(full,'utf8');
  if(!source.includes('RHI_ENERGY_PUBLIC_CONTRACT_V2')) failures.push(`${rel}: cross-domain Energy projection is not anchored to Public V2`);
  const legacy=source.match(/sensor\.energy_[a-z0-9_]+/g)||[];
  if(legacy.length) failures.push(`${rel}: legacy Energy entity dependency: ${[...new Set(legacy)].join(', ')}`);
}


const rawRuntimeReaders=['mobilityRuntimeV2','mobilityExperienceV2','mobilityPolicyV2','vehicleExperienceV2','chargerExperienceV2','vehicleRelationshipV2','mobilityFleetV2'];
for(const relDir of ['src/ui','src/domain/adapters']){
  for(const full of jsFiles(path.join(root,relDir))){
    const rel=path.relative(root,full);
    const source=fs.readFileSync(full,'utf8');
    for(const method of rawRuntimeReaders){
      const tokenA=`rt.${method}(`;
      const tokenB=`this.rt.${method}(`;
      const count=source.split(tokenA).length-1 + source.split(tokenB).length-1;
      if(count) failures.push(`${rel}: raw runtime reader ${method} bypasses canonical projection (${count})`);
    }
  }
}

if(failures.length){
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('PASS architecture boundary: app/ui/models are contract-agnostic; HA access is runtime-owned');
