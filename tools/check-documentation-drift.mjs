import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const normative=[
  'README.md',
  'documentation/ARCHITECTURE.md',
  'documentation/BRANDING.md',
  'documentation/ENGINEER_HANDOVER.md',
  'documentation/HACS_INSTALLATION.md',
  'documentation/RELEASE_GOVERNANCE.md',
  'documentation/SOURCE_PACKAGE_GOVERNANCE.md',
  'documentation/TEST_GOVERNANCE.md',
  'documentation/UX_RELEASE_STANDARD.md'
];

const failures=[];
for(const rel of normative){
  const text=fs.readFileSync(path.join(root,rel),'utf8');
  if(text.includes('\\n→') || text.includes('\\n6.') || text.includes('\\n7.') || text.includes('\\n8.')){
    failures.push(`${rel}: literal escaped newline artifact`);
  }
}

const readme=fs.readFileSync(path.join(root,'README.md'),'utf8');
const branding=fs.readFileSync(path.join(root,'documentation/BRANDING.md'),'utf8');
const architecture=fs.readFileSync(path.join(root,'documentation/ARCHITECTURE.md'),'utf8');
const handover=fs.readFileSync(path.join(root,'documentation/ENGINEER_HANDOVER.md'),'utf8');

for(const [rel,text] of [['README.md',readme],['documentation/BRANDING.md',branding]]){
  if(text.includes('src/assets/files/')) failures.push(`${rel}: obsolete canonical asset path`);
  if(text.includes('Runtime copy: `assets/')) failures.push(`${rel}: obsolete root generated asset copy`);
}
if(architecture.includes('src/adapters/')) failures.push('documentation/ARCHITECTURE.md: obsolete adapter ownership path');
if(handover.includes('→ UX runtime/adapters') || handover.includes('→ viewmodels') || handover.includes('→ screens/components')) failures.push('documentation/ENGINEER_HANDOVER.md: obsolete source ownership terminology');

const sourceGov=fs.readFileSync(path.join(root,'documentation/SOURCE_PACKAGE_GOVERNANCE.md'),'utf8');
for(const token of ['src/app/','src/runtime/','src/domain/','src/ui/','src/assets/','dist/PACKAGE_MANIFEST.json','Migration sequence']){
  if(!sourceGov.includes(token)) failures.push(`SOURCE_PACKAGE_GOVERNANCE missing ${token}`);
}

if(failures.length){
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('PASS documentation drift: normative paths, package model and migration sequence are current');
