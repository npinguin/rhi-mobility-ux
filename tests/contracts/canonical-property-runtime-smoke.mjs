import fs from "node:fs";

const runtime=fs.readFileSync("src/runtime/ha-contract-runtime.js","utf8");
const index=fs.readFileSync("src/runtime/canonical-property-index.js","utf8");

function body(startToken,endToken){
  const start=runtime.indexOf(startToken);
  const end=runtime.indexOf(endToken,start+startToken.length);
  if(start<0 || end<0) throw new Error("missing runtime contract section: "+startToken);
  return runtime.slice(start,end);
}

const placement=[
  body("  propertyFamily(row = {}) {","  propertyDisplayLabel(row = {}) {"),
  body("  familyLogicalSectionForProperty(row = {}) {","  familyLogicalSectionLabel("),
  body("  resolvedCommandFamily(command = {}) {","  familyCommandRows(")
].join("\n");

for(const forbidden of [
  "fallbackFamilyForPropertyKey",
  "propertyPresentationFamilyOverride",
  ".includes(\"soc\")",
  ".includes(\"battery\")",
  ".includes(\"power\")",
  ".includes(\"status\")",
  ".includes(\"charge\")",
  "property_key"
]){
  if(placement.includes(forbidden)) throw new Error("Mobility placement heuristic remains active: "+forbidden);
}
if(runtime.includes("  fallbackFamilyForPropertyKey(")) throw new Error("dead property-name family fallback remains in runtime");
if(runtime.includes("  propertyPresentationFamilyOverride(")) throw new Error("dead frontend family override remains in runtime");
if(!runtime.includes("this._canonicalProperties.rows(canonical)")) throw new Error("Mobility canonical property index is not the v2PropertyRows authority");
if(body("  v2PropertyRows(assetId = \"\") {","  v2ComponentDetailSections(").includes("Object.values(this.hass?.states")) throw new Error("v2PropertyRows still scans all HA states");
if(!placement.includes("row.section_id") || !placement.includes("row.visibility")) throw new Error("Mobility placement must consume backend section/visibility metadata");
if(!runtime.includes("state?.last_updated")) throw new Error("Mobility boundary-contract signatures must use entity revisions");
const revisionBody=body("  productRevisionSignature(assetId = \"\", contractIds = []) {","  runtimeSignature(assetId = \"\") {");
if(!revisionBody.includes("this._canonicalProperties.revision(canonical)")) throw new Error("product revision must use canonical asset revision counter");
if(revisionBody.includes(".entityIds(canonical)")) throw new Error("product revision must not rescan all canonical property entity ids");
if(runtime.includes("JSON.stringify(this.mobilityRuntimeV2())") || runtime.includes("JSON.stringify(this.mobilityExperienceV2())")) throw new Error("runtimeSignature must not serialize full aggregate contracts");
for(const token of ["component_id","section_id","visibility","render_as"]) if(!index.includes(token)) throw new Error("Mobility property index must track placement metadata: "+token);
if(!index.includes("assetRevisions") || !index.includes("_globalRevision")) throw new Error("Mobility property index must maintain revision counters");

if(runtime.includes("legacyAliases =")) throw new Error("legacy property alias matrix remains in Mobility runtime");
const semanticLookup=body('  semanticProperty(assetId = "", propertyKey = "") {','  propertyByCompoundKey(assetId = "", propertyKey = "") {');
if(semanticLookup.includes("||")) throw new Error("semanticProperty still contains a secondary lookup fallback");
const contractDiscovery=body('  contractEntity(contractId = "", preferredEntityIds = []) {','  mobilityRuntimeV2() {');
if(contractDiscovery.includes("Object.values(this.hass?.states")) throw new Error("contract discovery still scans arbitrary HA states as fallback");
const overviewMetrics=body('  vehicleOverviewMetricSlots(assetId = "") {','  vehicleComponentDetailSections(assetId = "") {');
if(overviewMetrics.includes("range_intelligence") || overviewMetrics.includes("energy_intelligence")) throw new Error("vehicle overview still substitutes Experience summaries for missing canonical properties");

console.log("PASS Mobility canonical-property indexing and metadata-owned placement");
