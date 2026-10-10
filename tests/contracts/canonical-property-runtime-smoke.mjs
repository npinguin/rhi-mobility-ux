import fs from "node:fs";
import vm from "node:vm";

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


const context=vm.createContext({Map,Set,Object,String,Array});
vm.runInContext(index+"\nglobalThis.MobilityCanonicalPropertyIndex=MobilityCanonicalPropertyIndex;",context);
const Index=context.MobilityCanonicalPropertyIndex;
const mk=(entity,asset="vehicle_1")=>({state:"42",attributes:{
  canonical_contract:"RHI_MOBILITY_CANONICAL_PROPERTY_V1",
  asset_id:asset,property_key:"battery.soc_pct",
  presentation_role:"key",component_id:"status",section_id:"overview"
}});
const initial={states:{"sensor.vehicle_soc":mk(),"sensor.noncanonical":{state:"x",attributes:{}}}};
const propertyIndex=new Index(initial);
const beforeRevision=propertyIndex.revision("vehicle_1");
const replacement={states:{"sensor.new_vehicle_soc":mk(),"sensor.noncanonical":initial.states["sensor.noncanonical"]}};
propertyIndex.refresh(replacement);
if(propertyIndex.row("vehicle_1","battery.soc_pct")?._source_entity_id!=="sensor.new_vehicle_soc") throw new Error("same-count entity replacement must be discovered");
if(propertyIndex.byEntity.has("sensor.vehicle_soc")) throw new Error("stale canonical entity survived replacement");
if(propertyIndex.revision("vehicle_1")<=beforeRevision) throw new Error("entity replacement must invalidate asset revision");
const beforeRemoval=propertyIndex.revision();
const vanished={states:{"sensor.noncanonical":replacement.states["sensor.noncanonical"],"sensor.other":{state:"y",attributes:{}}}};
propertyIndex.refresh(vanished);
if(propertyIndex.rows("vehicle_1").length!==0 || propertyIndex.revision()<=beforeRemoval) throw new Error("canonical removal must invalidate without shrinking HA state count");

const duplicate={states:{"sensor.a":mk(),"sensor.b":mk()}};
const conflicting=new Index(duplicate);
if(conflicting.row("vehicle_1","battery.soc_pct")!==null) throw new Error("duplicate native property must fail closed");
if(conflicting.contractGaps()[0]?.reason!=="duplicate_canonical_property") throw new Error("duplicate native property must be reportable");
const removedRevision=conflicting.revision("vehicle_1");
conflicting.refresh({states:{"sensor.noncanonical":{state:"ok",attributes:{}}}});
if(conflicting.revision("vehicle_1")<=removedRevision) throw new Error("removed native asset must invalidate its own revision");
const assetMembership=body('  assetIndexRows(kind = "all") {','  consumerAssetIds(kind = "all") {');
if(!assetMembership.includes('this._canonicalProperties.rows()'))
  throw new Error("Mobility inventory must derive from backend canonical property membership");
if(assetMembership.includes('this.mobilityRuntimeV2()'))
  throw new Error("Missing Runtime V2 must never hide active canonical Mobility assets");
const runtimeMethod=assetMembership.slice(assetMembership.indexOf('{')+1,assetMembership.lastIndexOf('}'));
const directInventory=new Function('kind',runtimeMethod);
const canonicalStates=[
  {asset_id:'vehicle_a',asset_type:'vehicle',property_key:'vehicle.soc_pct'},
  {asset_id:'charger_a',asset_type:'charger',property_key:'charger.status'}
];
const fakeRuntime={
  _memo:new Map(),
  _canonicalProperties:{rows(){return canonicalStates;}},
  mobilityRuntimeV2(){throw Error('retired Runtime V2 accessed');},
  normalizeAssetEntry(row){return row;}
};
const cars=directInventory.call(fakeRuntime,'vehicle');
const chargers=directInventory.call(fakeRuntime,'charger');
if(cars.length!==1 || cars[0].asset_id!=='vehicle_a' ||
   chargers.length!==1 || chargers[0].asset_id!=='charger_a')
  throw new Error('active vehicles and chargers lost when V2 aggregate is absent');
const ownedRows=new Index({states:{
  "sensor.vehicle_soc":{state:"64",attributes:{canonical_contract:"RHI_MOBILITY_CANONICAL_PROPERTY_V1",asset_id:"vehicle_a",asset_type:"vehicle",property_key:"battery.soc_pct",availability:"AVAILABLE",value:64}},
  "sensor.charger_state":{state:"ready",attributes:{canonical_contract:"RHI_MOBILITY_CANONICAL_PROPERTY_V1",asset_id:"charger_a",asset_type:"charger",property_key:"charger.operating_state",availability:"AVAILABLE",value:"ready"}}
}});
const assetsById=new Map(ownedRows.rows().filter(r=>r.asset_id && r.asset_type)
  .map(r=>[r.asset_id,r.asset_type]));
if(assetsById.size!==2 || assetsById.get("vehicle_a")!=="vehicle" || assetsById.get("charger_a")!=="charger")
  throw new Error("canonical backend asset membership must survive without retired Runtime V2 aggregate");
console.log("PASS Mobility canonical-property indexing, membership revision and metadata-owned placement");
