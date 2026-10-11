import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const shared=fs.readFileSync('src/runtime/energy-public-v2-projection.js','utf8');
const source=fs.readFileSync('src/runtime/energy-planning-projection.js','utf8');
const context={};
vm.createContext(context);
vm.runInContext(shared+'\n'+source+'\nthis.__Projection=HomeBrainEnergyPlanningProjection;',context);
const Projection=context.__Projection;
const property=(asset,key,value)=>({
  state:String(value),attributes:{canonical_contract:'RHI_ENERGY_CANONICAL_PROPERTY_V2',
    asset_id:asset,property_key:key,value,availability:'AVAILABLE',
    presentation_surface:'planning'}
});
const metric=(key,value,availability='AVAILABLE')=>({state:String(value),attributes:{
  canonical_source:'rhi_energy.runtime',metric_key:key,availability,unit_of_measurement:'kWh'
}});
const hass={states:{
  'sensor.planned_d0':metric('planning_today_flexible_planned_kwh',12.4),
  'sensor.remaining_d0':metric('planning_today_flexible_still_to_plan_kwh',3.2),
  'sensor.planned_d1':metric('planning_tomorrow_flexible_planned_kwh',8.1),
  'sensor.vehicle_plan':property('vehicle_audi_q8','planning_state','planned'),
  'sensor.home_battery_plan':property('home_battery','planning_state','planned')
}};
const mobilityRuntime={mobilityRegistry:()=>[{asset_id:'vehicle_audi_q8'},{asset_id:'charger_driveway_left'}]};
const model=new Projection(hass,mobilityRuntime).viewModel();
assert.equal(model.available,true);
assert.equal(model.today.plannedKwh,12.4);
assert.equal(model.today.stillToPlanKwh,3.2);
assert.equal(model.tomorrow.plannedKwh,8.1);
assert.equal(model.mobilityPlanningRows.length,1);
assert.equal(model.source,'rhi_energy.runtime/native_metric');
const unavailable=new Projection({states:{'sensor.legacy':{state:'ready',attributes:{planning_today_totals:{planned_flexible_kwh:99}}}}},mobilityRuntime).viewModel();
assert.equal(unavailable.available,false);
assert.equal(unavailable.today.plannedKwh,null);
const stale=new Projection({states:{'sensor.stale':{...metric('planning_today_flexible_planned_kwh',15),attributes:{...metric('planning_today_flexible_planned_kwh',15).attributes,quality:'STALE'}}}},mobilityRuntime).viewModel();
assert.equal(stale.available,false);
// Backend-owned zero remains valid and missing native metrics stay unknown.
const zero=new Projection({states:{'sensor.zero':metric('planning_today_flexible_planned_kwh',0)}},mobilityRuntime).viewModel();
assert.equal(zero.available,true);
assert.equal(zero.today.plannedKwh,0);
assert.equal(zero.tomorrow.plannedKwh,null);
const conflicting=new Projection({states:{
  'sensor.first':metric('planning_today_flexible_planned_kwh',12),
  'sensor.second':metric('planning_today_flexible_planned_kwh',13)
}},mobilityRuntime).viewModel();
assert.equal(conflicting.available,false);
assert.equal(conflicting.today.plannedKwh,null);
const absentSemantic=new Projection({states:{'sensor.absent':{
  state:'12',attributes:{canonical_contract:'RHI_ENERGY_CANONICAL_PROPERTY_V2',
    asset_id:'vehicle_audi_q8',property_key:'planning_state',value:null,
    availability:'AVAILABLE',presentation_surface:'planning'}
}}},mobilityRuntime).viewModel();
assert.equal(absentSemantic.available,false);
assert.equal(absentSemantic.mobilityPlanningRows.length,0);
const duplicateAsset=new Projection({states:{
  a:property('vehicle_audi_q8','planning_state','ready'),
  b:property('vehicle_audi_q8','planning_state','not_ready')
}},mobilityRuntime).viewModel();
assert.equal(duplicateAsset.available,false);
assert.equal(duplicateAsset.mobilityPlanningRows.length,0);
console.log('Energy native planning and identity-safe cross-domain projection smoke PASS');
