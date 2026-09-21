import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const json=(rel)=>JSON.parse(read(rel));

const pkg=json('package.json');
const product=json('release/product.json');
const compat=json('COMPATIBILITY.json');
const manifest=json('RELEASE_MANIFEST.json');
const status=json('release/RELEASE_STATUS.json');
const qualification=json('release/QUALIFICATION.json');
const ownership=json('tests/OWNERSHIP.json');
const changelog=read('CHANGELOG.md');
const notes=read('release/RELEASE_NOTES.md');
const governance=read('documentation/RELEASE_GOVERNANCE.md');
const testGovernance=read('documentation/TEST_GOVERNANCE.md');
const sharedRelease=read('documentation/UX_RELEASE_STANDARD.md');
const publishWorkflow=read('.github/workflows/publish-hacs.yml');
const validateWorkflow=read('.github/workflows/validate.yml');
const releaseWorkflow=read('.github/workflows/release.yml');

const version=String(pkg.version);
const contract=String(product.contract);

const requiredFiles=[
  'README.md','CHANGELOG.md','COMPATIBILITY.json','RELEASE_MANIFEST.json',
  'release/product.json','release/RELEASE_STATUS.json','release/RELEASE_NOTES.md','release/QUALIFICATION.json',
  'documentation/ARCHITECTURE.md','documentation/RELEASE_GOVERNANCE.md',
  'documentation/BRANDING.md','documentation/UX_RELEASE_STANDARD.md','documentation/UX_FOOTER_STANDARD.md',
  'documentation/TEST_GOVERNANCE.md','documentation/ENGINEER_HANDOVER.md','documentation/HACS_INSTALLATION.md',
  'tests/OWNERSHIP.json','tools/check-test-ownership.mjs','tools/sync-release-metadata.mjs',
  'dist/rhi-mobility-ux.js','dist/rhi-mobility-ux.js.sha256'
];
for(const rel of requiredFiles) if(!fs.existsSync(path.join(root,rel))) throw new Error(`missing release/governance file ${rel}`);

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
]) if(String(value)!==contract) throw new Error(`${label} contract ${value} != release/product.json ${contract}`);

if(String(compat.mobility_contract?.minimum_backend)!==String(product.minimum_backend)) throw new Error('COMPATIBILITY minimum backend drift');
if(!Array.isArray(compat.mobility_contract?.tested_backend_releases) || compat.mobility_contract.tested_backend_releases[0]!==product.tested_backend) throw new Error('COMPATIBILITY tested backend drift');
if(String(manifest.minimum_backend)!==String(product.minimum_backend) || String(manifest.tested_backend_baseline)!==String(product.tested_backend)) throw new Error('RELEASE_MANIFEST backend baseline drift');
if(String(status.minimum_backend)!==String(product.minimum_backend) || String(status.tested_backend)!==String(product.tested_backend)) throw new Error('RELEASE_STATUS backend baseline drift');
if(manifest.stage!==product.stage || status.stage!==product.stage) throw new Error('release stage drift from release/product.json');
if(manifest.runtime_artifact!==product.runtime_artifact || manifest.runtime_checksum_artifact!==product.runtime_checksum_artifact) throw new Error('runtime artifact drift from release/product.json');
if(manifest.hacs_repository_type!==product.hacs_repository_type || manifest.hacs_validation_category!==product.hacs_validation_category) throw new Error('HACS metadata drift from release/product.json');

if(qualification.candidate_tag!==`v${version}`) throw new Error('qualification candidate tag drift');
if(manifest.publication_authority!=='github_releases') throw new Error('GitHub Releases must be publication authority');
if(manifest.known_accepted_technical_debt!==0) throw new Error('accepted technical debt must be zero');
if(manifest.known_accepted_feature_debt!==0) throw new Error('accepted feature debt must be zero');
if(status.publication_status!=='derive_from_github_release') throw new Error('release status must derive publication state from GitHub Releases');
if(status.github_release_prerelease!==false) throw new Error('TEST CANDIDATE must be a normal GitHub Release');

if(!notes.startsWith(`# v${version} `)) throw new Error('current release notes do not start with package candidate version');
const headings=changelog.split(/\r?\n/).filter(line=>/^## \d/.test(line));
if(!headings.length || !headings[0].startsWith(`## ${version} `)) throw new Error('CHANGELOG current version is not first release entry');

if(!testGovernance.includes('One invariant has exactly one test owner')) throw new Error('test ownership principle missing');
if(ownership.principle!=='one invariant, one test owner') throw new Error('machine-readable test ownership principle drift');
if(!pkg.scripts?.['check:test-ownership'] || !pkg.scripts?.['test:contract'] || !pkg.scripts?.['test:ux'] || !pkg.scripts?.['test:package'] || !pkg.scripts?.['test:release']) throw new Error('owned test suite scripts missing');

if(!governance.includes('publication does not rebuild')) throw new Error('Mobility release governance must prohibit publication rebuilds');
if(!sharedRelease.includes('publish the exact committed artifact')) throw new Error('shared UX release standard missing exact-artifact publication rule');
if(validateWorkflow.includes('push:\n    branches: [main]')) throw new Error('full Validate must not rebuild again on main push');
if(!validateWorkflow.includes('Deterministic two-build proof')) throw new Error('PR reproducibility proof missing');
if(!validateWorkflow.includes('Protect immutable published runtime')) throw new Error('immutable runtime byte gate missing');
for(const forbidden of ['npm test','npm run build','npm run clean']){
  if(publishWorkflow.includes(forbidden)) throw new Error(`publication must not rebuild/retest candidate: ${forbidden}`);
  if(releaseWorkflow.includes(forbidden)) throw new Error(`stable promotion must not rebuild/retest candidate: ${forbidden}`);
}
if(!publishWorkflow.includes('node tools/verify-dist.mjs')) throw new Error('publication must verify exact committed dist');
if(!releaseWorkflow.includes('git show "${TAG}:dist/rhi-mobility-ux.js"')) throw new Error('stable promotion must compare immutable tag payload');
if(!releaseWorkflow.includes('gh release upload "${TAG}" release/QUALIFICATION.json --clobber')) throw new Error('stable promotion must attach final qualification evidence');

const workflowDir=path.join(root,'.github/workflows');
const workflows=fs.readdirSync(workflowDir).filter(n=>/\.ya?ml$/.test(n)).sort();
const expected=['publish-hacs.yml','release.yml','validate.yml'];
if(JSON.stringify(workflows)!==JSON.stringify(expected)) throw new Error(`workflow governance violation: ${workflows.join(', ')}`);

console.log(`PASS release governance: package ${version}, release descriptor, test ownership and exact-artifact lifecycle aligned`);
