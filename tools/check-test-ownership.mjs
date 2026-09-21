import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const map=JSON.parse(fs.readFileSync(path.join(root,'tests/OWNERSHIP.json'),'utf8'));

for(const [ownerName,owner] of Object.entries(map.owners||{})){
  if(!owner.owner) throw new Error(`test owner ${ownerName} has no owner file`);
  if(!fs.existsSync(path.join(root,owner.owner))) throw new Error(`test owner file missing: ${owner.owner}`);
  for(const [rel,tokens] of Object.entries(owner.forbidden_in||{})){
    const full=path.join(root,rel);
    if(!fs.existsSync(full)) throw new Error(`ownership target missing: ${rel}`);
    const source=fs.readFileSync(full,'utf8');
    for(const token of tokens){
      if(source.includes(token)) throw new Error(`test ownership drift: ${rel} asserts ${ownerName} invariant via token ${JSON.stringify(token)}; owner is ${owner.owner}`);
    }
  }
}
console.log('PASS test ownership: one invariant, one owner');
