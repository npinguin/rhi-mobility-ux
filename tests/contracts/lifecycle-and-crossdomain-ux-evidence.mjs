import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const runtime=fs.readFileSync('src/runtime/ha-contract-runtime.js','utf8');
const dashboard=fs.readFileSync('src/ui/screens/mobility-dashboard.js','utf8');
const router=fs.readFileSync('src/ui/screens/router.js','utf8');
const fragment=(source,start,end)=>{
  const from=source.indexOf(start),to=source.indexOf(end,from+start.length);
  assert.ok(from>=0&&to>from,'missing stable source section '+start);
  return source.slice(from,to);
};
// Run actual lifecycle decision and inactive row rendering.
const lifecycle=vm.runInNewContext('({'+fragment(runtime,
  '  lifecycleStatus(assetOrId = "") {',
  '  isLifecycleActive(assetOrId = "") {')+'}).lifecycleStatus');
const asset={asset_id:'vehicle_q8'};
const resolver=value=>({
  canonicalAssetId:id=>String(id||''),
  assetById:()=>asset,
  lifecyclePropertyRow:()=>value===undefined?null:{value}
});
for(const [value,status] of [['active','active'],['disabled','disabled'],
  ['retired','retired'],['unknown','unknown'],[undefined,'unknown']])
  assert.equal(lifecycle.call(resolver(value),asset),status);
assert.equal(lifecycle.call(resolver(null),asset),'unknown');
assert.equal(lifecycle.call(resolver('ACTIVE'),asset),'active');

const render=vm.runInNewContext('({'+fragment(dashboard,
  '  renderInactiveVehicle(rt, asset) {',
  '  vehicleVisualSelection(rt, asset, draft = {}) {')+'}).renderInactiveVehicle',{
  HomeBrainAssetFactory:class {adapterFor(){return{build:()=>({
    display:'Audi Q8',subtitle:'Vehicle',image:'/assets/q8.webp'})};}}
});
const rt=value=>({
  lifecycleStatus:()=>value,vehicleLabel:()=> 'Audi Q8',assetDetailRoute:()=>'/vehicle/q8',
  escape:x=>String(x)
});
const renderer={
  lifecycleDisplay:()=> 'Not available',
  lifecycleToggleButton:()=>'<button data-lifecycle="activate">Activate</button>'
};
const unknown=render.call(renderer,rt('unknown'),asset);
assert.match(unknown,/Audi Q8/);
assert.doesNotMatch(unknown,/data-lifecycle="activate"/,
  'an unknown canonical lifecycle is not a disabled vehicle');
assert.match(unknown,/data-nav="\/vehicle\/q8"/);
const disabled=render.call(renderer,rt('disabled'),asset);
assert.match(disabled,/data-lifecycle="activate"/);
const active=render.call(renderer,rt('active'),asset);
assert.doesNotMatch(active,/data-lifecycle="activate"/);

assert.match(dashboard,/const unverifiedVehicles = vehicles\.filter/,
  'overview must retain unverified group separate from disabled');
assert.match(dashboard,/const inactiveVehicles = vehicles\.filter\(\(v\)=>rt\.lifecycleStatus\(v\) === "disabled"\)/);
assert.match(dashboard,/Lifecycle status unavailable/,
  'unverified assets need an explicit evidence gap');
assert.doesNotMatch(dashboard,/\["disabled","unknown"\]\.includes\(rt\.lifecycleStatus\(v\)\)/);
assert.match(router,/energyRevision = \["planning","strategies","history"\]/);
assert.match(router,/revisionSignature\(view\)/);
assert.match(router,/Effective planning incomplete|effective Energy plan is complete/i);
assert.match(router,/plan\.providerHold/);
assert.match(router,/plan\.quality\.D0/);
assert.doesNotMatch(router,/The Energy public planning contract is not available/);
// Behavioral guards for aggregate status tiles: a missing lifecycle and
// missing charger facts cannot silently become reassuring numerical zeros.
const summaryMethods=vm.runInNewContext('new (class {'+fragment(dashboard,
  '  overviewChargingStatus(rt, vehicles = [], chargers = []) {',
  '  overviewSecurityStatus(rt, vehicles = []) {')+'})()',{
  HomeBrainAssetFactory:class {adapterFor(){return null;}}
});
const emptyRuntime={
  mobilityFleetProjection:()=>({
    connected_charger_count:null,charging_charger_count:null,
    available_charger_count:null,aggregate_power_state:'unknown',
    aggregate_actual_charging_power_kw:null
  }),
  rangePolicyProjection:()=>({range:{low_range_km:null}})
};
const noEvidence=summaryMethods.overviewChargingStatus.call({},emptyRuntime,[],[]);
assert.equal(noEvidence.connected,null,'missing backend connection count is not zero');
assert.equal(noEvidence.charging,null);
assert.match(noEvidence.stateDisplay,/Unknown charging · Unknown connected/);
assert.match(noEvidence.currentContext,/not verified/);
const knownZeroRuntime={...emptyRuntime,mobilityFleetProjection:()=>({
  connected_charger_count:0,charging_charger_count:0,available_charger_count:0,
  aggregate_actual_charging_power_kw:0,aggregate_power_state:'available'
})};
const actualZero=summaryMethods.overviewChargingStatus.call({},knownZeroRuntime,[],[]);
assert.equal(actualZero.connected,0);
assert.equal(actualZero.charging,0);
assert.equal(actualZero.powerDisplay,'0.0 kW now');
const noVehicleRange=summaryMethods.overviewRangeStatus.call({},emptyRuntime,[]);
assert.equal(noVehicleRange.headline,'Range unavailable');
assert.equal(noVehicleRange.thresholdKm,null);
assert.equal(noVehicleRange.line1,'No verified active vehicles');
assert.match(dashboard,/Not assessed/);

console.log('PASS lifecycle: active vs disabled vs unavailable, no false reactivation, native cross-domain navigation and planning quality');
