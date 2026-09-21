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
  'src/OWNERSHIP.json','src/manifest.json','documentation/SOURCE_PACKAGE_GOVERNANCE.md','documentation/UX_REPOSITORY_STANDARD.md',
  'tests/OWNERSHIP.json','tools/check-test-ownership.mjs','tools/check-source-ownership.mjs',
  'tools/check-asset-policy.mjs','tools/check-hacs-package.mjs','tools/sync-release-metadata.mjs',
  'dist/rhi-mobility-ux.js','dist/rhi-mobility-ux.js.sha256','dist/PACKAGE_MANIFEST.json'
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
if(manifest.package_manifest!==product.package_manifest || manifest.hacs_package_root!==product.hacs_package_root || manifest.hacs_delivery_mode!==product.hacs_delivery_mode || manifest.release_asset_policy!==product.release_asset_policy) throw new Error('HACS package delivery drift from release/product.json');
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
if(!pkg.scripts?.['check:test-ownership'] || !pkg.scripts?.['check:source-ownership'] || !pkg.scripts?.['check:asset-policy'] || !pkg.scripts?.['check:hacs-package'] || !pkg.scripts?.['check:documentation-drift'] || !pkg.scripts?.['test:hacs-install'] || !pkg.scripts?.['test:contract'] || !pkg.scripts?.['test:ux'] || !pkg.scripts?.['test:package'] || !pkg.scripts?.['test:release']) throw new Error('owned test/package suite scripts missing');

if(!governance.includes('publication does not rebuild')) throw new Error('Mobility release governance must prohibit publication rebuilds');
if(!sharedRelease.includes('immutable tag') || !sharedRelease.includes('Publication must be idempotent')) throw new Error('shared UX release standard missing immutable/idempotent package publication rule');
if(validateWorkflow.includes('push:\n    branches: [main]')) throw new Error('full Validate must not rebuild again on main push');
if(!validateWorkflow.includes('Deterministic two-build proof')) throw new Error('PR reproducibility proof missing');
if(!validateWorkflow.includes('Protect immutable published package')) throw new Error('immutable complete-package gate missing');
if(!/hacs:\n\s+name: HACS\n\s+needs: source/.test(validateWorkflow)) throw new Error('HACS validation must depend on source gate');
for(const forbidden of ['npm test','npm run build','npm run clean']){
  if(publishWorkflow.includes(forbidden)) throw new Error(`publication must not rebuild/retest candidate: ${forbidden}`);
  if(releaseWorkflow.includes(forbidden)) throw new Error(`stable promotion must not rebuild/retest candidate: ${forbidden}`);
}
if(!publishWorkflow.includes('node tools/verify-dist.mjs') || !publishWorkflow.includes('node tools/check-hacs-package.mjs') || !publishWorkflow.includes('Existing immutable tag package and HACS metadata match current candidate')) throw new Error('publication must verify exact committed/idempotent HACS package and metadata');
if(product.release_asset_policy!=='none') throw new Error('tagged HACS plugin release asset policy must be none');
const publishCreateBlock=(publishWorkflow.match(/gh release create[\s\S]*?^\s*fi/m)||[''])[0];
for(const forbidden of ['dist/','COMPATIBILITY.json','RELEASE_MANIFEST.json','QUALIFICATION.json','PACKAGE_MANIFEST.json','.sha256']){
  if(publishCreateBlock.includes(forbidden)) throw new Error(`candidate publication must attach zero GitHub Release assets: ${forbidden}`);
}
if(publishWorkflow.includes('gh release upload')) throw new Error('candidate publication must not upload GitHub Release assets');
if(!releaseWorkflow.includes('git archive "${TAG}" dist')) throw new Error('stable promotion must compare complete immutable tag dist package');
if(releaseWorkflow.includes('gh release upload')) throw new Error('stable promotion must not upload GitHub Release assets');
if(!releaseWorkflow.includes("'.assets | length'")) throw new Error('stable promotion must verify zero GitHub Release assets');

const workflowDir=path.join(root,'.github/workflows');
const workflows=fs.readdirSync(workflowDir).filter(n=>/\.ya?ml$/.test(n)).sort();
const expected=['publish-hacs.yml','release.yml','validate.yml'];
if(JSON.stringify(workflows)!==JSON.stringify(expected)) throw new Error(`workflow governance violation: ${workflows.join(', ')}`);

console.log(`PASS release governance: package ${version}, source/test/package ownership and immutable full-tree HACS lifecycle aligned`);
