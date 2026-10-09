import fs from "node:fs";

const runtime=fs.readFileSync("src/runtime/ha-contract-runtime.js","utf8");
const index=fs.readFileSync("src/runtime/canonical-property-index.js","utf8");

const extract=(startMarker,endMarker)=>{
  const start=runtime.indexOf(startMarker);
  const end=runtime.indexOf(endMarker,start);
  if(start<0 || end<0) throw new Error("test cannot locate runtime block: "+startMarker);
  return runtime.slice(start,end);
};

const placementBlocks=[
  extract('  propertyFamily(row = {}) {','  propertyDisplayLabel(row = {}) {'),
  extract('  familyLogicalSectionForProperty(row = {}) {','  familyLogicalSectionLabel(')
].join("\n");

for(const forbidden of [
  "fallbackFamilyForPropertyKey",
  "propertyPresentationFamilyOverride",
  "includes(\"soc\")",
  "includes('soc')",
  "includes(\"battery\")",
  "includes('battery')",
  "includes(\"power\")",
  "includes('power')",
  "includes(\"charge\")",
  "includes('charge')",
  "includes(\"diagnostic\")",
  "includes('diagnostic')"
]){
  if(placementBlocks.includes(forbidden)) throw new Error("Mobility placement heuristic remains active: "+forbidden);
}
if(runtime.includes("fallbackFamilyForPropertyKey(")) throw new Error("dead Mobility semantic fallback remains in runtime");
if(runtime.includes("propertyPresentationFamilyOverride(")) throw new Error("dead Mobility presentation override remains in runtime");
if(!runtime.includes("this._canonicalProperties.rows(canonical)")) throw new Error("Mobility canonical property index is not the v2PropertyRows authority");
if(runtime.includes("for (const state of Object.values(this.hass?.states || {}))")) throw new Error("v2PropertyRows still scans all HA states");
if(!placementBlocks.includes("row.section_id") || !placementBlocks.includes("row.visibility")) throw new Error("Mobility placement must consume backend section/visibility metadata");
if(!runtime.includes("state?.last_updated")) throw new Error("Mobility runtime signatures must use entity revisions");
if(runtime.includes("JSON.stringify(this.mobilityRuntimeV2())") || runtime.includes("JSON.stringify(this.mobilityExperienceV2())")) throw new Error("runtimeSignature must not serialize full aggregate contracts");
if(!index.includes("component_id") || !index.includes("section_id") || !index.includes("render_as")) throw new Error("Mobility property index must treat placement metadata as index identity");
console.log("PASS Mobility canonical-property indexing and metadata-owned placement");
