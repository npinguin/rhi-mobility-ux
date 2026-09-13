import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const excluded=new Set(['dist','archive','.git','node_modules']);
const findings=[];
const patterns=[
  [/https?:\/\/[^\s"')]+/gi,'URL'],
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'email'],
  [/(password|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"']+["']/gi,'credential-like assignment'],
  [/wessels\.robotix\.be/gi,'private installation host'],
  [/\bNicky\b|\bCarole\b/gi,'installation-specific personal name']
];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(excluded.has(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(js|mjs|json|md|yml|yaml|txt|csv)$/i.test(e.name)){const t=fs.readFileSync(p,'utf8');for(const [rx,label] of patterns){for(const m of t.matchAll(rx)){const v=m[0];if(label==='URL' && (/github\.com|hacs\.xyz|spdx\.org|gnu\.org/.test(v)))continue;findings.push(`${path.relative(root,p)}: ${label}: ${v.slice(0,120)}`);}}}}}
walk(root);
if(findings.length){console.error(findings.join('\n'));process.exit(1)}
console.log('PASS public repository hygiene scan');
