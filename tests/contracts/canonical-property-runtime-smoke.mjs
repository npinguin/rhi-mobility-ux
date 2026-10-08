import fs from "node:fs";

const runtime=fs.readFileSync("src/runtime/ha-contract-runtime.js","utf8");
const index=fs.readFileSync("src/runtime/canonical-property-index.js","utf8");

for(const forbidden of [
  "return this.fallbackFamilyForPropertyKey(",
  "k.includes(\"soc\") || k.includes(\"battery\")",
  "k.includes(\"current_limit\") || k.includes(\"requested_power\")",
  "k.includes(\"status\") || k.includes(\"charge\") || k.includes(\"plug\")"
]){
  if(runtime.includes(forbidden)) throw new Error("Mobility placement heuristic remains active: "+forbidden);
}
if(!runtime.includes("this._canonicalProperties.rows(canonical)")) throw new Error("Mobility canonical property index is not the v2PropertyRows authority");
if(runtime.includes("for (const state of Object.values(this.hass?.states || {}))")) throw new Error("v2PropertyRows still scans all HA states");
if(!runtime.includes("row.section_id") || !runtime.includes("row.visibility")) throw new Error("Mobility placement must consume backend section/visibility metadata");
if(!runtime.includes("state?.last_updated")) throw new Error("Mobility runtime signatures must use entity revisions");
if(runtime.includes("JSON.stringify(this.mobilityRuntimeV2())") || runtime.includes("JSON.stringify(this.mobilityExperienceV2())")) throw new Error("runtimeSignature must not serialize full aggregate contracts");
if(!index.includes("component_id") || !index.includes("section_id") || !index.includes("render_as")) throw new Error("Mobility property index must treat placement metadata as index identity");
console.log("PASS Mobility canonical-property indexing and metadata-owned placement");
