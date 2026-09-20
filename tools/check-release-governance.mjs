import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const json=(rel)=>JSON.parse(read(rel));

const pkg=json('package.json');
const compat=json('COMPATIBILITY.json');
const manifest=json('RELEASE_MANIFEST.json');
const status=json('release/RELEASE_STATUS.json');
const qualification=json('release/QUALIFICATION.json');
const readme=read('README.md');
const changelog=read('CHANGELOG.md');
const notes=read('release/RELEASE_NOTES.md');
const governance=read('documentation/RELEASE_GOVERNANCE.md');
const handover=read('documentation/ENGINEER_HANDOVER.md');
const publishWorkflow=read('.github/workflows/publish-hacs.yml');
const releaseWorkflow=read('.github/workflows/release.yml');

const version=String(pkg.version);
const contract='MOBILITY_PUBLIC_RUNTIME_V1';

const requiredFiles=[
  'README.md','CHANGELOG.md','COMPATIBILITY.json','RELEASE_MANIFEST.json',
  'release/RELEASE_STATUS.json','release/RELEASE_NOTES.md','release/QUALIFICATION.json',
  'documentation/ARCHITECTURE.md','documentation/RELEASE_GOVERNANCE.md',
  'documentation/ENGINEER_HANDOVER.md','documentation/HACS_INSTALLATION.md',
  'dist/rhi-mobility-ux.js','dist/rhi-mobility-ux.js.sha256'
];
for(const rel of requiredFiles) if(!fs.existsSync(path.join(root,rel))) throw new Error(`missing release file ${rel}`);

for(const [label,value] of [
  ['COMPATIBILITY',compat.ux_version],
  ['RELEASE_MANIFEST',manifest.version],
  ['RELEASE_STATUS',status.source_candidate_version],
  ['QUALIFICATION',qualification.candidate_version]
]) if(String(value)!==version) throw new Error(`${label} version ${value} != package ${version}`);

for(const [label,value] of [
  ['COMPATIBILITY',compat.mobility_contract?.contract],
  ['RELEASE_MANIFEST',manifest.mobility_contract],
  ['RELEASE_STATUS',status.contract]
]) if(String(value)!==contract) throw new Error(`${label} contract ${value} != ${contract}`);

if(qualification.candidate_tag!==`v${version}`) throw new Error('qualification candidate tag drift');
if(manifest.publication_authority!=='github_releases') throw new Error('GitHub Releases must be publication authority');
if(manifest.known_accepted_technical_debt!==0) throw new Error('accepted technical debt must be zero');
if(manifest.known_accepted_feature_debt!==0) throw new Error('accepted feature debt must be zero');
if(manifest.hacs_repository_type!=='dashboard' || manifest.hacs_validation_category!=='plugin') throw new Error('HACS repository/category governance drift');
if(manifest.runtime_artifact!=='dist/rhi-mobility-ux.js' || manifest.runtime_checksum_artifact!=='dist/rhi-mobility-ux.js.sha256') throw new Error('runtime artifact governance drift');
if(status.publication_status!=='derive_from_github_release') throw new Error('release status must derive publication state from GitHub Releases');
if(!readme.includes(`Source candidate: \`v${version}\``)) throw new Error('README source candidate does not match package');
if(!notes.startsWith(`# v${version} `)) throw new Error('current release notes do not start with source candidate version');

const headings=changelog.split(/\r?\n/).filter(line=>/^## \d/.test(line));
if(!headings.length || !headings[0].startsWith(`## ${version} `)) throw new Error('CHANGELOG current version is not first release entry');

if(!governance.includes('GitHub Releases/tags are the publication authority')) throw new Error('release governance publication rule missing');
if(!governance.includes('`publish-hacs.yml` is the only TEST CANDIDATE publication path')) throw new Error('automatic candidate publication governance missing');
if(!governance.includes('qualification evidence may change after candidate publication')) throw new Error('post-publication qualification rule missing');
if(!handover.includes(`Current source candidate: **v${version}**`)) throw new Error('handover source candidate drift');

const publishTrigger=publishWorkflow.split('  workflow_dispatch:')[0];
if(publishTrigger.includes("'release/QUALIFICATION.json'")) throw new Error('qualification evidence must not trigger immutable candidate republish');
if(!releaseWorkflow.includes('candidate_sha')) throw new Error('stable promotion must bind to qualification candidate_sha');
if(!releaseWorkflow.includes('git show "${TAG}:dist/rhi-mobility-ux.js"')) throw new Error('stable promotion must compare release payload with immutable tag payload');
if(releaseWorkflow.includes('= "$(git rev-parse "$GITHUB_SHA")"')) throw new Error('stable promotion must not require current main SHA to equal immutable candidate SHA');

const workflowDir=path.join(root,'.github/workflows');
const workflows=fs.readdirSync(workflowDir).filter(n=>/\.ya?ml$/.test(n)).sort();
const expected=['publish-hacs.yml','release.yml','validate.yml'];
if(JSON.stringify(workflows)!==JSON.stringify(expected)) throw new Error(`workflow governance violation: ${workflows.join(', ')}`);

if(fs.existsSync(path.join(root,'documentation/validation/MIGRATION_VALIDATION.txt'))) throw new Error('stale rc.1 validation transcript must not remain active evidence');

console.log(`PASS release governance: source candidate ${version}, contract ${contract}, immutable qualification lifecycle enforced`);
