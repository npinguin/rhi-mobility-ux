import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const readJson=(rel)=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
const writeJson=(rel,obj)=>fs.writeFileSync(path.join(root,rel),JSON.stringify(obj,null,2)+'\n');

const pkg=readJson('package.json');
const product=readJson('release/product.json');
const version=String(pkg.version);
const tag=`v${version}`;

const compat=readJson('COMPATIBILITY.json');
compat.ux_version=version;
compat.release_stage=product.stage==='test_candidate'?'release_candidate':product.stage;
compat.mobility_contract={
  ...(compat.mobility_contract||{}),
  contract:product.contract,
  minimum_backend:product.minimum_backend,
  tested_backend_releases:[product.tested_backend]
};
writeJson('COMPATIBILITY.json',compat);

const manifest=readJson('RELEASE_MANIFEST.json');
manifest.product=product.product;
manifest.version=version;
manifest.stage=product.stage;
manifest.mobility_contract=product.contract;
manifest.minimum_backend=product.minimum_backend;
manifest.tested_backend_baseline=product.tested_backend;
manifest.runtime_artifact=product.runtime_artifact;
manifest.runtime_checksum_artifact=product.runtime_checksum_artifact;
manifest.hacs_repository_type=product.hacs_repository_type;
manifest.hacs_validation_category=product.hacs_validation_category;
writeJson('RELEASE_MANIFEST.json',manifest);

const status=readJson('release/RELEASE_STATUS.json');
status.product=product.product;
status.source_candidate_version=version;
status.stage=product.stage;
status.contract=product.contract;
status.minimum_backend=product.minimum_backend;
status.tested_backend=product.tested_backend;
writeJson('release/RELEASE_STATUS.json',status);

const qualification=readJson('release/QUALIFICATION.json');
const versionChanged=qualification.candidate_version!==version;
qualification.candidate_version=version;
qualification.candidate_tag=tag;
if(versionChanged){
  qualification.candidate_sha='pending';
  for(const key of Object.keys(qualification)){
    if(['candidate_version','candidate_tag','candidate_sha','stable_promotion'].includes(key)) continue;
    qualification[key]='pending';
  }
  qualification.stable_promotion='blocked';
}
writeJson('release/QUALIFICATION.json',qualification);

console.log(`Synchronized release metadata for ${tag} from package.json + release/product.json`);
