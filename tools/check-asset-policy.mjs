import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const srcRoot=path.join(root,'src/assets');
const distRoot=path.join(root,'dist');
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

function packagedAssetName(rel){
  return `asset--${rel.replaceAll('/', '--')}`;
}

function assertValidWebp(file, label){
  if(!label.endsWith('.webp')) return;
  const bytes=fs.readFileSync(file);
  if(bytes.length < 16 || bytes.toString('ascii',0,4)!=='RIFF' || bytes.toString('ascii',8,12)!=='WEBP') throw new Error(`Invalid WebP header: ${label}`);
  const declared=bytes.readUInt32LE(4)+8;
  if(declared!==bytes.length) throw new Error(`Truncated/corrupt WebP asset: ${label} declares ${declared} bytes, actual ${bytes.length}`);
}

const expectedPackagedAssets=new Set();
for(const rel of sourceFiles){
  const ext=path.extname(rel).toLowerCase();
  if(!allowedExt.has(ext)) throw new Error(`unsupported asset extension: ${rel}`);
  const packaged=packagedAssetName(rel);
  if(expectedPackagedAssets.has(packaged)) throw new Error(`flattened HACS asset collision: ${rel} -> ${packaged}`);
  expectedPackagedAssets.add(packaged);
  const sourceFile=path.join(srcRoot,rel);
  const distFile=path.join(distRoot,packaged);
  if(!fs.existsSync(distFile)) throw new Error(`flattened HACS package asset missing: ${rel} -> ${packaged}`);
  assertValidWebp(sourceFile,rel);
  assertValidWebp(distFile,packaged);
  const sourceBytes=fs.readFileSync(sourceFile);
  const distBytes=fs.readFileSync(distFile);
  if(!sourceBytes.equals(distBytes)) throw new Error(`packaged asset differs from canonical source: ${rel} -> ${packaged}`);
}
const actualPackagedAssets=fs.readdirSync(distRoot,{withFileTypes:true})
  .filter((entry)=>entry.isFile() && entry.name.startsWith('asset--'))
  .map((entry)=>entry.name)
  .sort();
if(JSON.stringify([...expectedPackagedAssets].sort())!==JSON.stringify(actualPackagedAssets)) throw new Error('flat HACS asset inventory differs from canonical src/assets inventory');

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

const heroRows=vm.runInContext('rhiMobilityHeroCatalog()',sandbox,{timeout:1000});
if(!Array.isArray(heroRows)) throw new Error('hero asset catalog did not evaluate to an array');
const expectedHeroFiles=new Set([
  'heroes/mobility-overview.png',
  'heroes/mobility-vehicles.png',
  'heroes/mobility-chargers.png',
  'heroes/mobility-planning.png',
  'heroes/mobility-strategies.png',
  'heroes/mobility-history.png',
  'heroes/mobility-log.png',
  'heroes/mobility-vehicle-detail.png',
  'heroes/mobility-charging-detail.png'
]);
const heroFiles=sourceFiles.filter((rel)=>rel.startsWith('heroes/'));
if(heroFiles.length!==expectedHeroFiles.size) throw new Error(`hero asset inventory drifted: ${heroFiles.length}; expected exactly ${expectedHeroFiles.size}`);
for(const rel of heroFiles){
  if(!expectedHeroFiles.has(rel)) throw new Error(`legacy/dead hero artwork still packaged: ${rel}`);
}
if(heroRows.length!==expectedHeroFiles.size) throw new Error(`hero catalog count drifted: ${heroRows.length}; expected exactly ${expectedHeroFiles.size}`);
if(new Set(heroRows.map((row)=>row.package_path)).size!==expectedHeroFiles.size) throw new Error('hero catalog must map one semantic key to one unique package asset');
const heroDigests=new Map();
for(const row of heroRows){
  const rel=String(row.package_path || '');
  if(!expectedHeroFiles.has(rel)) throw new Error(`hero catalog references non-canonical asset: ${row.key} -> ${rel}`);
  if(!sourceFiles.includes(rel)) throw new Error(`hero catalog references missing asset: ${row.key} -> ${rel}`);
  const absolute=path.join(srcRoot,rel);
  const dim=pngDimensions(absolute);
  if(!dim || dim.width!==2172 || dim.height!==724) throw new Error(`hero master must remain exact 2172x724 PNG: ${rel}`);
  const stat=fs.statSync(absolute);
  if(stat.size>3*1024*1024) throw new Error(`hero artwork too large (>3 MiB): ${rel} = ${stat.size} bytes`);
  const digest=crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
  if(heroDigests.has(digest)) throw new Error(`hero assets share identical bytes: ${heroDigests.get(digest)} and ${rel}`);
  heroDigests.set(digest,rel);
}
console.log('PASS canonical hero policy: 9 unique semantic masters, exact 2172x724 PNG inventory, source/dist parity');

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
function svgDimensions(file) {
  const text=fs.readFileSync(file,'utf8');
  const width=Number(text.match(/<svg[^>]*\bwidth=["']([0-9.]+)/i)?.[1] || 0);
  const height=Number(text.match(/<svg[^>]*\bheight=["']([0-9.]+)/i)?.[1] || 0);
  if(width>0 && height>0) return {width,height};
  const viewBox=text.match(/<svg[^>]*\bviewBox=["'][^"']*?([0-9.]+)\s+([0-9.]+)["']/i);
  return viewBox ? {width:Number(viewBox[1]),height:Number(viewBox[2])} : null;
}

const expectedChargerIds=[
  'wallbox.commander2',
  'peblar.business.socket',
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
    const ext=path.extname(rel).toLowerCase();
    const dim=ext==='.png' ? pngDimensions(absolute) : ext==='.svg' ? svgDimensions(absolute) : null;
    if(!dim) throw new Error(`charger master must expose deterministic dimensions: ${rel}`);
    const longEdge=Math.max(dim.width,dim.height);
    if(longEdge<1200) throw new Error(`charger artwork below 1200 px/logical-unit minimum long edge: ${rel} = ${dim.width}x${dim.height}`);
  }
}
for(const key of ['charger_wallbox_white','charger_wallbox_black','charger_peblar','charger_utility_plug']){
  if(!verifiedChargerImageKeys.has(key)) throw new Error(`current charger artwork not governed by charger visual catalog: ${key}`);
}
const chargerFiles=sourceFiles.filter((rel)=>rel.startsWith('chargers/'));
const allowedChargerFiles=new Set([
  'chargers/charger_fallback.png',
  'chargers/charger_wallbox_white.svg',
  'chargers/charger_wallbox_black.svg',
  'chargers/charger_peblar.svg',
  'chargers/charger_utility_plug.svg'
]);
for(const rel of chargerFiles){
  if(!allowedChargerFiles.has(rel)) throw new Error(`legacy/dead charger artwork still packaged: ${rel}`);
}
if(chargerFiles.length!==allowedChargerFiles.size) throw new Error(`charger asset inventory drifted: ${chargerFiles.length}; expected ${allowedChargerFiles.size}`);
console.log('PASS charger visual policy: 3 supported products, governed appearances, exact legacy-free inventory, <=600 KiB and >=1200 px/logical-unit master edge');
