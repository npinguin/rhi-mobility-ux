import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const failures=[];
const legacy=[
  /sensor\.mobility_asset_index/g,
  /sensor\.mobility_relationship_index/g,
  /sensor\.mobility_command_index/g,
  /sensor\.mobility_activity_index/g,
  /sensor\.mobility_(?:vehicle|charger|person)_[a-z0-9_]*property_index/g,
  /sensor\.mobility_(?:vehicle|charger)_command_slot_index/g,
  /sensor\.mobility_(?:vehicle|charger)_profile_index/g,
  /sensor\.mobility_(?:vehicle|charger)_intelligence_index/g,
  /sensor\.mobility_(?:asset_runtime_contract|product_asset)_index/g,
  /sensor\.mobility_(?:runtime|experience|policy|command)_v2/g,
  /sensor\.mobility_release_(?:contract|identity)/g,
  /sensor\.energy_(?:planning|planning_experience|flexible_asset|strategy_profile|strategy_effective|asset_metering|value_accounting)_index/g
];

const semanticFallbacks=[
  /legacyAliases\s*=\s*\{/g,
  /compatibility_aggregate/g,
  /return\s+this\.v2SemanticProperty\([^\n]+\)\s*\|\|\s*this\.propertyByCompoundKey/g,
  /Object\.values\(this\.hass\?\.states\s*\|\|\s*\{\}\)\.find\([^\n]*contract_id/g,
  /commandV2Label\s*\(/g,
  /label:String\(row\.label\s*\|\|\s*""\)\.trim\(\)\s*\|\|/g,
];

function files(dir){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    const p=path.join(dir,e.name);
    return e.isDirectory()?files(p):(e.isFile()&&p.endsWith(".js")?[p]:[]);
  });
}
for(const file of files(path.join(root,"src"))){
  const rel=path.relative(root,file);
  const text=fs.readFileSync(file,"utf8");
  if(text.includes("!important")) failures.push(`${rel}: !important is forbidden; shared geometry belongs to UX Core`);
  if(/\bV1\b/.test(text)) failures.push(`${rel}: V1 product compatibility reference remains`);
  for(const rx of legacy){
    const matches=text.match(rx)||[];
    if(matches.length) failures.push(`${rel}: legacy Mobility product API remains: ${[...new Set(matches)].join(", ")}`);
  }
  for(const rx of semanticFallbacks){
    const matches=text.match(rx)||[];
    if(matches.length) failures.push(`${rel}: semantic compatibility fallback remains: ${[...new Set(matches)].join(", ")}`);
  }
}
if(failures.length){
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("PASS zero-debt gate: canonical Mobility truth fails closed; no semantic compatibility fallback, V1 product API or presentation debt");
