import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const normative=[
  'README.md',
  'documentation/ARCHITECTURE.md',
  'documentation/PRODUCT_VISION.md',
  'documentation/BACKEND_INTERFACE_BACKLOG.md',
  'documentation/BRANDING.md',
  'documentation/ENGINEER_HANDOVER.md',
  'documentation/HACS_INSTALLATION.md',
  'documentation/HISTORY_AND_LESSONS.md',
  'documentation/KNOWN_DEFECTS.md',
  'documentation/OPEN_ISSUES.json',
  'documentation/SEMANTIC_PICKER_BLUEPRINT.md',
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
const ownership=JSON.parse(fs.readFileSync(path.join(root,'src/OWNERSHIP.json'),'utf8'));
const qualification=JSON.parse(fs.readFileSync(path.join(root,'release/QUALIFICATION.json'),'utf8'));
const presentation=fs.readFileSync(path.join(root,'src/app/presentation.js'),'utf8');
const navigation=fs.readFileSync(path.join(root,'src/app/header-and-navigation.js'),'utf8');

for(const [rel,text] of [['README.md',readme],['documentation/BRANDING.md',branding]]){
  if(text.includes('src/assets/files/')) failures.push(`${rel}: obsolete canonical asset path`);
  if(text.includes('Runtime copy: `assets/')) failures.push(`${rel}: obsolete root generated asset copy`);
}
if(architecture.includes('src/adapters/')) failures.push('documentation/ARCHITECTURE.md: obsolete adapter ownership path');
if(handover.includes('→ UX runtime/adapters') || handover.includes('→ viewmodels') || handover.includes('→ screens/components')) failures.push('documentation/ENGINEER_HANDOVER.md: obsolete source ownership terminology');

const obsoleteWorkspaceClaims=[
  ['README.md',readme,'Overview, Vehicles, Chargers, Charging'],
  ['documentation/PRODUCT_VISION.md',fs.readFileSync(path.join(root,'documentation/PRODUCT_VISION.md'),'utf8'),'Overview, Vehicles, Chargers, Charging'],
  ['documentation/PRODUCT_VISION.md',fs.readFileSync(path.join(root,'documentation/PRODUCT_VISION.md'),'utf8'),'**Charging** —'],
  ['documentation/ARCHITECTURE.md',architecture,'Overview | Vehicles | Chargers | Charging']
];
for(const [rel,text,needle] of obsoleteWorkspaceClaims){
  if(text.includes(needle)) failures.push(`${rel}: obsolete standalone Charging workspace returned`);
}
if(ownership?.owners?.ui_screens?.owns?.includes('Charging')) failures.push('src/OWNERSHIP.json: obsolete Charging screen ownership returned');
if(Object.prototype.hasOwnProperty.call(qualification,'charging_hero')) failures.push('release/QUALIFICATION.json: obsolete charging_hero qualification gate returned');
if(/\bcharging\s*:/.test(presentation)) failures.push('src/app/presentation.js: obsolete Charging hero returned');
if(navigation.includes('key: "charging"')) failures.push('src/app/header-and-navigation.js: obsolete Charging navigation item returned');
if(!readme.includes('Overview, Vehicles and Chargers are the three Mobility workspaces')) failures.push('README.md: canonical three-workspace statement missing');
const productVision=fs.readFileSync(path.join(root,'documentation/PRODUCT_VISION.md'),'utf8');
if(!productVision.includes('Charging remains a Mobility capability') || !productVision.includes('not a standalone Mobility workspace')) failures.push('PRODUCT_VISION missing Charging capability/workspace distinction');
if(!architecture.includes('Overview | Vehicles | Chargers | Detail')) failures.push('ARCHITECTURE missing canonical Mobility projection set');
if(readme.includes('vehicle_bmw_ix1_phev.png')) failures.push('README.md: obsolete BMW iX1 artwork path returned');
if(readme.includes('MOBILITY_PUBLIC_RUNTIME_V1')) failures.push('README.md: V1 returned as primary architecture authority');
if(!readme.includes('documentation/HISTORY_AND_LESSONS.md') || !readme.includes('documentation/KNOWN_DEFECTS.md')) failures.push('README.md: engineer history/open-issue entry points missing');
if(!architecture.includes('V2 interface migration remains open')) failures.push('ARCHITECTURE missing explicit V2 migration compatibility boundary');

const vision=fs.readFileSync(path.join(root,'documentation/PRODUCT_VISION.md'),'utf8');
const backlog=fs.readFileSync(path.join(root,'documentation/BACKEND_INTERFACE_BACKLOG.md'),'utf8');
if(!vision.includes('One model, one ownership') || !vision.includes('No charger') || !vision.includes('refresh')) failures.push('PRODUCT_VISION missing locked Mobility UX invariants');
if(vision.includes('V1 consumes only `MOBILITY_PUBLIC_RUNTIME_V1`') || vision.includes('current release line stays on frozen `MOBILITY_PUBLIC_RUNTIME_V1`')) failures.push('PRODUCT_VISION still declares V1 as current product authority');
for(const token of ['MOBILITY_PUBLIC_RUNTIME_V2 = canonical facts','MOBILITY_EXPERIENCE_V2','MOBILITY_POLICY_V2','MOBILITY_COMMAND_V2','Frozen V1 surfaces exist only as explicit compatibility fallbacks']){
  if(!vision.includes(token)) failures.push(`PRODUCT_VISION missing V2-first authority token: ${token}`);
}
if(!backlog.includes('HA-native user') || !backlog.includes('do not mock') || !backlog.includes('V2.x')) failures.push('BACKEND_INTERFACE_BACKLOG missing interface governance');


const knownDefects=fs.readFileSync(path.join(root,'documentation/KNOWN_DEFECTS.md'),'utf8');
const history=fs.readFileSync(path.join(root,'documentation/HISTORY_AND_LESSONS.md'),'utf8');
const pickerBlueprint=fs.readFileSync(path.join(root,'documentation/SEMANTIC_PICKER_BLUEPRINT.md'),'utf8');
const hacsInstallation=fs.readFileSync(path.join(root,'documentation/HACS_INSTALLATION.md'),'utf8');
const openIssues=JSON.parse(fs.readFileSync(path.join(root,'documentation/OPEN_ISSUES.json'),'utf8'));

for(const token of [
  'V2 interface migration is incomplete',
  'Frozen V1 is compatibility-only',
  'target Home Assistant',
  'canonical readback'
]){
  if(!knownDefects.includes(token)) failures.push(`KNOWN_DEFECTS missing required open-issue invariant: ${token}`);
}
for(const token of [
  'Compatibility projections may keep an older consumer alive',
  'Service acceptance is not persistence proof',
  'Green CI proves source/package invariants',
  'wrong-model image fallback',
  'full V2 interface migration'
]){
  if(!history.includes(token)) failures.push(`HISTORY_AND_LESSONS missing durable lesson: ${token}`);
}
for(const token of ['local draft','canonical backend readback','Reuse by Energy']){
  if(!pickerBlueprint.includes(token)) failures.push(`SEMANTIC_PICKER_BLUEPRINT missing reusable invariant: ${token}`);
}

for(const token of ['asset.profile_id','vehicle.image_key','charger.image_key','ordered semantic write set','transport_value','Service acceptance alone is not persistence proof']){
  if(!pickerBlueprint.includes(token)) failures.push(`SEMANTIC_PICKER_BLUEPRINT missing current picker invariant: ${token}`);
}
if(pickerBlueprint.includes('brand: read-only') || pickerBlueprint.includes('model: read-only') || pickerBlueprint.includes('variant: read-only')) failures.push('SEMANTIC_PICKER_BLUEPRINT returned obsolete appearance-only vehicle picker');
if(hacsInstallation.includes('/mobility-supervisor/charging') || hacsInstallation.includes('Vehicles, Chargers, Charging')) failures.push('HACS_INSTALLATION returned obsolete standalone Charging workspace');
const requiredIssueIds=['MUX-001','MUX-002','MUX-003','MUX-004','MUX-005','MUX-006','MUX-007','MUX-008','MUX-009','MUX-010'];
const issueRows=Array.isArray(openIssues?.issues)?openIssues.issues:[];
for(const id of requiredIssueIds){
  const row=issueRows.find((item)=>item?.id===id);
  if(!row) failures.push(`OPEN_ISSUES missing required issue ${id}`);
  else {
    if(row.status!=='open') failures.push(`OPEN_ISSUES ${id} must remain open until evidence-driven closure`);
    if(!row.owner_area) failures.push(`OPEN_ISSUES ${id} missing owner_area`);
    if(!Array.isArray(row.exit_criteria) || !row.exit_criteria.length) failures.push(`OPEN_ISSUES ${id} missing exit criteria`);
  }
}
if(openIssues?.policy?.accepted_debt!==0) failures.push('OPEN_ISSUES accepted_debt must remain zero');
const runtimeOwns=ownership?.owners?.runtime?.owns || [];
for(const token of ['MOBILITY_PUBLIC_RUNTIME_V2 access','MOBILITY_EXPERIENCE_V2 access','MOBILITY_POLICY_V2 access','frozen V1 compatibility fallback only']){
  if(!runtimeOwns.includes(token)) failures.push(`src/OWNERSHIP runtime boundary missing: ${token}`);
}
if(runtimeOwns.includes('MOBILITY_PUBLIC_RUNTIME_V1 access')) failures.push('src/OWNERSHIP still declares V1 as primary runtime access');
if(/\brc\.\d+\b/.test(handover)) failures.push('ENGINEER_HANDOVER must not copy current candidate identity; use machine release authorities');

const sourceGov=fs.readFileSync(path.join(root,'documentation/SOURCE_PACKAGE_GOVERNANCE.md'),'utf8');
for(const token of ['app/','runtime/','domain/','ui/','assets/','dist/PACKAGE_MANIFEST.json','Migration sequence']){
  if(!sourceGov.includes(token)) failures.push(`SOURCE_PACKAGE_GOVERNANCE missing ${token}`);
}

if(failures.length){
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('PASS documentation drift: normative paths, package model and migration sequence are current');