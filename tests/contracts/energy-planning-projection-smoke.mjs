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
const hass={states:{
  'sensor.planned_d0':property('D0','flexible_planned_kwh',12.4),
  'sensor.remaining_d0':property('D0','flexible_still_to_plan_kwh',3.2),
  'sensor.planned_d1':property('D1','flexible_planned_kwh',8.1),
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
assert.equal(model.source,'RHI_ENERGY_CANONICAL_PROPERTY_V2.planning');
const unavailable=new Projection({states:{'sensor.legacy':{state:'ready',attributes:{planning_today_totals:{planned_flexible_kwh:99}}}}},mobilityRuntime).viewModel();
assert.equal(unavailable.available,false);
assert.equal(unavailable.today.plannedKwh,null);
const stale=new Projection({states:{'sensor.stale':{...property('D0','flexible_planned_kwh',15),attributes:{...property('D0','flexible_planned_kwh',15).attributes,quality:'STALE'}}}},mobilityRuntime).viewModel();
assert.equal(stale.available,false);
console.log('Energy canonical planning projection smoke PASS');
