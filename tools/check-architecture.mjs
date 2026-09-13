import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scanDirs = ['src/screens', 'src/components'];
const forbidden = [
  [/sensor\.mobility_/g, 'public contract entity name outside adapter/runtime boundary'],
  [/script\.mobility_/g, 'command ingress name outside adapter/runtime boundary'],
  [/\bhass\.states\b/g, 'direct Home Assistant entity state access outside runtime boundary'],
  [/\bthis\.hass\.states\b/g, 'direct Home Assistant entity state access outside runtime boundary'],
  [/\/local\/homebrain/g, 'legacy manual deployment path']
];
let failures=[];
for (const dir of scanDirs) {
  for (const file of fs.readdirSync(path.join(root, dir)).filter((x)=>x.endsWith('.js'))) {
    const rel=path.join(dir,file); const text=fs.readFileSync(path.join(root,rel),'utf8');
    for (const [rx,label] of forbidden) {
      const matches=[...text.matchAll(rx)];
      if (matches.length) failures.push(`${rel}: ${label} (${matches.length})`);
    }
  }
}
// Contract names are allowed in adapters and runtime only.
for (const dir of ['src/entry','src/view-models','src/styles']) {
  if (!fs.existsSync(path.join(root,dir))) continue;
  for (const file of fs.readdirSync(path.join(root, dir)).filter((x)=>x.endsWith('.js'))) {
    const rel=path.join(dir,file); const text=fs.readFileSync(path.join(root,rel),'utf8');
    if (/sensor\.mobility_|script\.mobility_/.test(text)) failures.push(`${rel}: contract entity literal outside adapters/runtime`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('PASS architecture boundary: screens/components do not read public contract structures directly');
