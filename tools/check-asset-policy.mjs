import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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

const catalog=fs.readFileSync(path.join(root,'src/app/asset-catalog.js'),'utf8');
const referenced=[...catalog.matchAll(/package_path:"([^"]+)"/g)].map(m=>m[1]);
for(const rel of referenced){
  if(!sourceFiles.includes(rel)) throw new Error(`package catalog references missing asset: ${rel}`);
}

const duplicates=new Map();
for(const rel of sourceFiles){
  const digest=crypto.createHash('sha256').update(fs.readFileSync(path.join(srcRoot,rel))).digest('hex');
  duplicates.set(digest,[...(duplicates.get(digest)||[]),rel]);
}
const duplicateGroups=[...duplicates.values()].filter(v=>v.length>1);
console.log(`PASS asset policy: ${sourceFiles.length} safe canonical assets, ${referenced.length} catalog references, ${duplicateGroups.length} duplicate-byte groups reported only`);
