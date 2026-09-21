import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/manifest.json'),'utf8'));
const modules=new Set(manifest.modules || []);

export function sourceModule(relativePath){
  if(!modules.has(relativePath)) throw new Error(`test requested module outside src/manifest.json: ${relativePath}`);
  return fs.readFileSync(path.join(root,'src',relativePath),'utf8');
}

export function mobilityRuntimeSource(){
  return [
    'app/asset-paths.js',
    'app/asset-catalog.js',
    'runtime/ha-contract-runtime.js'
  ].map(sourceModule).join('\n');
}
