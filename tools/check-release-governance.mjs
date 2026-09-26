import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const json=(rel)=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));

const product=json('release/product.json');
const pkg=json('package.json');
const lock=json('package-lock.json');
const compat=json('COMPATIBILITY.json');
const manifest=json('RELEASE_MANIFEST.json');
const status=json('release/RELEASE_STATUS.json');
const qualification=json('release/QUALIFICATION.json');

const version=String(product.version);
const checks={
  package_version:pkg.version===version,
  lock_version:lock.version===version && lock.packages?.['']?.version===version,
  compatibility_version:compat.ux_version===version,
  compatibility_contract:compat.mobility_contract?.contract===product.contract,
  compatibility_minimum_backend:compat.mobility_contract?.minimum_backend===product.minimum_backend,
  compatibility_tested_backend:Array.isArray(compat.mobility_contract?.tested_backend_releases) && compat.mobility_contract.tested_backend_releases.length===1 && compat.mobility_contract.tested_backend_releases[0]===product.tested_backend,
  compatibility_required_contracts:JSON.stringify(compat.mobility_contract?.required_contracts||[])===JSON.stringify(product.required_contracts||[]),
  manifest_version:manifest.version===version,
  manifest_contract:manifest.mobility_contract===product.contract,
  manifest_backend:manifest.minimum_backend===product.minimum_backend && manifest.tested_backend_baseline===product.tested_backend,
  manifest_stage:manifest.stage===product.stage,
  manifest_package:manifest.runtime_artifact===product.runtime_artifact && manifest.runtime_checksum_artifact===product.runtime_checksum_artifact && manifest.package_manifest===product.package_manifest,
  status_version:status.source_candidate_version===version,
  status_contract:status.contract===product.contract,
  status_backend:status.minimum_backend===product.minimum_backend && status.tested_backend===product.tested_backend,
  ux_core_compatibility:compat.ux_core?.version===product.ux_core?.version && compat.ux_core?.source_commit===product.ux_core?.source_commit && compat.ux_core?.runtime_dependency===false,
  ux_core_manifest:manifest.ux_core?.version===product.ux_core?.version && manifest.ux_core?.source_commit===product.ux_core?.source_commit && manifest.ux_core?.runtime_dependency===false,
  ux_core_status:status.ux_core?.version===product.ux_core?.version && status.ux_core?.runtime_dependency===false,
  qualification_version:qualification.candidate_version===version,
  qualification_tag:qualification.candidate_tag===`v${version}`,
  qualification_sha:qualification.candidate_sha==='pending' || /^[0-9a-f]{40}$/i.test(String(qualification.candidate_sha||'')),
  rollback:typeof product.rollback_release==='string' && product.rollback_release.startsWith('v') && product.rollback_release!==`v${version}`,
  zero_debt:manifest.known_accepted_technical_debt===0 && manifest.known_accepted_feature_debt===0
};
const failed=Object.entries(checks).filter(([,ok])=>!ok).map(([name])=>name);
for(const [name,ok] of Object.entries(checks)) console.log(ok?'PASS':'FAIL',name);
if(failed.length) throw new Error('release projection drift; run npm run release:sync: '+failed.join(', '));
console.log('PASS release governance: release/product.json is the single release identity owner');
