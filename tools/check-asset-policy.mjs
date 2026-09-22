import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const srcRoot=path.join(root,'src/assets');
const distRoot=path.join(root,'dist/assets');
const allowedExt=new Set(['.png','.webp','.svg','.jpg','.jpeg']);
const safeSegment=/^[a-z0-9][a-z0-9_.-]*$/;

function walk(dir, base){
  const rows=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.isSymbolicLink()) throw new Error(`asset symlink forbidden: ${path.relative(base,path.join(dir,entry.name))}`);
    if(!safeSegment.test(entry.name)) throw new Error(`unsafe asset name: ${entry.name}`);
    const absolute=path.join(dir,entry.name);
    if(entry.isDirectory()) rows.push(...walk(absolute,base));
    else if(entry.isFile()) rows.push(path.relative(base,absolute).split(path.sep).join('/'));
  }
  return rows.sort();
}

const sourceFiles=walk(srcRoot,srcRoot);
const distFiles=walk(distRoot,distRoot);
if(JSON.stringify(sourceFiles)!==JSON.stringify(distFiles)) throw new Error('src/assets and dist/assets file inventories differ');

for(const rel of sourceFiles){
  const ext=path.extname(rel).toLowerCase();
  if(!allowedExt.has(ext)) throw new Error(`unsupported asset extension: ${rel}`);
  const sourceBytes=fs.readFileSync(path.join(srcRoot,rel));
  const distBytes=fs.readFileSync(path.join(distRoot,rel));
  if(!sourceBytes.equals(distBytes)) throw new Error(`packaged asset differs from canonical source: ${rel}`);
}

const catalogSource=fs.readFileSync(path.join(root,'src/app/asset-catalog.js'),'utf8');
const sandbox={rhiMobilityAssetUrl:(p)=>String(p)};
vm.createContext(sandbox);
vm.runInContext(catalogSource,sandbox,{timeout:5000});
const imageRows=vm.runInContext('rhiMobilityImageCatalog()',sandbox,{timeout:1000});
const visualRows=vm.runInContext('rhiMobilityVehicleVisualCatalog()',sandbox,{timeout:1000});
const chargerVisualRows=vm.runInContext('rhiMobilityChargerVisualCatalog()',sandbox,{timeout:1000});
if(!Array.isArray(imageRows) || !Array.isArray(visualRows) || !Array.isArray(chargerVisualRows)) throw new Error('visual asset catalogs did not evaluate to arrays');

const referenced=imageRows.map((row)=>String(row.package_file || '')).filter(Boolean);
for(const rel of referenced){
  if(!sourceFiles.includes(rel)) throw new Error(`package catalog references missing asset: ${rel}`);
}

const duplicates=new Map();
for(const rel of sourceFiles){
  const digest=crypto.createHash('sha256').update(fs.readFileSync(path.join(srcRoot,rel))).digest('hex');
  duplicates.set(digest,[...(duplicates.get(digest)||[]),rel]);
}
const duplicateGroups=[...duplicates.values()].filter(v=>v.length>1);

for(const row of visualRows){
  if(row.visual_quality==='fallback_only' && row.selectable) {
    throw new Error(`fallback-only vehicle visual must not be selectable: ${row.id}`);
  }
  if(row.visual_quality==='profile_source' && row.package_file) {
    throw new Error(`profile-source vehicle must not silently claim package artwork: ${row.id}`);
  }
}

const imagePathByKey=new Map(imageRows.map((row)=>[String(row.image_key),String(row.package_file)]));
const verified=visualRows.filter((row)=>row.selectable && row.visual_quality==='verified_model');
const expectedVerifiedIds=[
  'audi.q8.4m.2024-2026.tfsi-e',
  'bmw.x1.u11.2025-2026.phev',
  'mercedes.gla.h247.2023-2026.phev',
  'renault.scenic.e-tech.2024-2026.techno',
  'volkswagen.id4.2024-2026.ev'
];
const verifiedIds=new Set(verified.map((row)=>row.id));
for(const id of expectedVerifiedIds){
  if(!verifiedIds.has(id)) throw new Error(`current supported vehicle lacks verified package artwork: ${id}`);
}
if(verified.length !== expectedVerifiedIds.length) throw new Error(`verified current-model artwork count drifted: ${verified.length}; expected exactly ${expectedVerifiedIds.length}`);

const verifiedDigests=new Map();
const fallbackDigest=crypto.createHash('sha256').update(fs.readFileSync(path.join(srcRoot,'vehicles/vehicle_fallback.png'))).digest('hex');
for(const row of verified){
  const rel=imagePathByKey.get(String(row.image_key));
  if(!rel) throw new Error(`verified vehicle visual has no image catalog entry: ${row.id} -> ${row.image_key}`);
  const digest=crypto.createHash('sha256').update(fs.readFileSync(path.join(srcRoot,rel))).digest('hex');
  if(digest===fallbackDigest) throw new Error(`verified vehicle visual resolves to fallback bytes: ${row.id}`);
  if(verifiedDigests.has(digest)) throw new Error(`verified vehicle visuals share identical artwork: ${verifiedDigests.get(digest)} and ${row.id}`);
  verifiedDigests.set(digest,row.id);
}

const vehicleFiles=sourceFiles.filter((rel)=>rel.startsWith('vehicles/'));
const allowedVehicleFiles=new Set([
  'vehicles/vehicle_audi_q8.png',
  'vehicles/vehicle_bmw_x1_phev.png',
  'vehicles/vehicle_fallback.png',
  'vehicles/vehicle_mercedes_gla.png',
  'vehicles/vehicle_renault_scenic_techno_ev.webp',
  'vehicles/vehicle_vw_id4.webp'
]);
for(const rel of vehicleFiles){
  if(!allowedVehicleFiles.has(rel)) throw new Error(`legacy/dead vehicle artwork still packaged: ${rel}`);
}
if(vehicleFiles.length!==allowedVehicleFiles.size) throw new Error(`vehicle asset inventory drifted: ${vehicleFiles.length}; expected ${allowedVehicleFiles.size}`);
console.log(`PASS asset policy: 5 current real vehicles have distinct canonical package artwork; vehicle inventory is legacy-free and one-master-per-model`);


function pngDimensions(file) {
  const bytes=fs.readFileSync(file);
  if(bytes.length<24 || bytes.toString('ascii',1,4)!=='PNG') return null;
  return { width:bytes.readUInt32BE(16), height:bytes.readUInt32BE(20) };
}

const expectedChargerIds=[
  'wallbox.commander2.22kw',
  'peblar.business.socket.22kw',
  'fibaro.wall-plug-2.zwave-plus.be-fr'
];
const chargerIds=new Set(chargerVisualRows.map((row)=>row.id));
for(const id of expectedChargerIds){
  if(!chargerIds.has(id)) throw new Error(`supported charger missing from visual library: ${id}`);
}
if(chargerVisualRows.length!==expectedChargerIds.length) throw new Error(`charger visual library drifted: ${chargerVisualRows.length}; expected exactly ${expectedChargerIds.length}`);

const verifiedChargerImageKeys=new Set();
for(const row of chargerVisualRows){
  if(row.visual_quality!=='verified_model' || row.selectable===false) throw new Error(`supported charger must be selectable verified_model: ${row.id}`);
  if(!Array.isArray(row.appearances) || !row.appearances.length) throw new Error(`charger has no appearances: ${row.id}`);
  for(const appearance of row.appearances){
    const imageKey=String(appearance.image_key || '');
    const rel=imagePathByKey.get(imageKey);
    if(!rel) throw new Error(`charger appearance has no package image: ${row.id} / ${appearance.id}`);
    if(!rel.startsWith('chargers/')) throw new Error(`charger appearance escaped charger asset folder: ${rel}`);
    verifiedChargerImageKeys.add(imageKey);
    const absolute=path.join(srcRoot,rel);
    const stat=fs.statSync(absolute);
    if(stat.size>600*1024) throw new Error(`charger artwork too large (>600 KiB): ${rel} = ${stat.size} bytes`);
    if(path.extname(rel).toLowerCase()==='.png'){
      const dim=pngDimensions(absolute);
      if(!dim) throw new Error(`cannot read PNG dimensions: ${rel}`);
      const longEdge=Math.max(dim.width,dim.height);
      if(longEdge<900) throw new Error(`charger artwork below 900 px minimum long edge: ${rel} = ${dim.width}x${dim.height}`);
    }
  }
}
for(const key of ['charger_wallbox_white','charger_wallbox_black','charger_peblar','charger_utility_plug']){
  if(!verifiedChargerImageKeys.has(key)) throw new Error(`current charger artwork not governed by charger visual catalog: ${key}`);
}
console.log('PASS charger visual policy: 3 supported products, governed appearances, <=600 KiB and >=900 px PNG long edge');
