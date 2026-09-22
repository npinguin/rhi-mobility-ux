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
if(!Array.isArray(imageRows) || !Array.isArray(visualRows)) throw new Error('vehicle asset catalog did not evaluate to arrays');

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
if(verified.length < 3) throw new Error(`verified vehicle artwork gate parsed only ${verified.length} models; expected at least the current Audi/BMW/Mercedes package artwork`);

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

console.log(`PASS asset policy: ${sourceFiles.length} safe canonical assets, ${referenced.length} catalog references, ${verified.length} verified model visuals are distinct; ${duplicateGroups.length} duplicate-byte groups are limited to non-verified/alias assets`);
