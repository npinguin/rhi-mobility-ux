import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const readJson=(rel)=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
const writeJson=(rel,obj)=>fs.writeFileSync(path.join(root,rel),JSON.stringify(obj,null,2)+'\n');

const product=readJson('release/product.json');
const version=String(product.version);
const tag=`v${version}`;

const pkg=readJson('package.json');
pkg.version=version;
writeJson('package.json',pkg);

const lock=readJson('package-lock.json');
lock.version=version;
lock.packages[''].version=version;
writeJson('package-lock.json',lock);

const compat=readJson('COMPATIBILITY.json');
compat.ux_version=version;
compat.release_stage=product.stage==='test_candidate'?'release_candidate':product.stage;
compat.mobility_contract={
  ...(compat.mobility_contract||{}),
  contract:product.contract,
  minimum_backend:product.minimum_backend,
  tested_backend_releases:[product.tested_backend],
  required_contracts:[...(product.required_contracts||[])]
};
compat.ux_core={...(product.ux_core||{}),runtime_dependency:false};
writeJson('COMPATIBILITY.json',compat);

const manifest=readJson('RELEASE_MANIFEST.json');
Object.assign(manifest,{
  product:product.product,
  version,
  stage:product.stage,
  mobility_contract:product.contract,
  minimum_backend:product.minimum_backend,
  tested_backend_baseline:product.tested_backend,
  runtime_artifact:product.runtime_artifact,
  runtime_checksum_artifact:product.runtime_checksum_artifact,
  hacs_repository_type:product.hacs_repository_type,
  hacs_validation_category:product.hacs_validation_category,
  package_manifest:product.package_manifest,
  hacs_package_root:product.hacs_package_root,
  hacs_delivery_mode:product.hacs_delivery_mode,
  release_asset_policy:product.release_asset_policy,
  required_contracts:[...(product.required_contracts||[])]
});
manifest.ux_core={...(product.ux_core||{}),runtime_dependency:false};
writeJson('RELEASE_MANIFEST.json',manifest);

const status=readJson('release/RELEASE_STATUS.json');
Object.assign(status,{
  product:product.product,
  source_candidate_version:version,
  stage:product.stage,
  contract:product.contract,
  minimum_backend:product.minimum_backend,
  tested_backend:product.tested_backend,
  required_contracts:[...(product.required_contracts||[])]
});
status.ux_core={...(product.ux_core||{}),runtime_dependency:false};
writeJson('release/RELEASE_STATUS.json',status);

const q=readJson('release/QUALIFICATION.json');
if(q.candidate_version!==version){
  q.candidate_version=version;
  q.candidate_tag=tag;
  q.candidate_sha='pending';
  for(const key of Object.keys(q)){
    if(['candidate_version','candidate_tag','candidate_sha'].includes(key)) continue;
    q[key]=key==='stable_promotion'?'blocked':'pending';
  }
}
writeJson('release/QUALIFICATION.json',q);

console.log(`Synchronized release metadata for ${tag} from release/product.json`);
