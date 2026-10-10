import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const shared=fs.readFileSync('src/runtime/energy-public-v2-projection.js','utf8');
const source=fs.readFileSync('src/runtime/energy-mobility-strategy-projection.js','utf8');
const context={};
vm.createContext(context);
vm.runInContext(shared+'\n'+source+'\nthis.__Projection=HomeBrainEnergyMobilityStrategyProjection;',context);
const Projection=context.__Projection;
const prop=(asset,key,value)=>({state:String(value),attributes:{
 canonical_contract:'RHI_ENERGY_CANONICAL_PROPERTY_V2',asset_id:asset,property_key:key,
 value,availability:'AVAILABLE',presentation_surface:'configuration'}});
const hass={states:{
 'sensor.configured_vehicle':prop('vehicle_audi_q8','strategy_configured_deadline','07:30'),
 'sensor.configured_battery':prop('battery','strategy_configured_reserve',20),
 'sensor.effective_vehicle':prop('vehicle_audi_q8','strategy_effective_mode','ready_by'),
 'sensor.effective_battery':prop('battery','strategy_effective_mode','reserve')
}};
const mobilityRuntime={mobilityRegistry:()=>[{asset_id:'vehicle_audi_q8',display_name:'Audi Q8'}]};
const model=new Projection(hass,mobilityRuntime).viewModel();
assert.equal(model.profilesAvailable,false);
assert.equal(model.effectiveAvailable,true);
assert.equal(model.configured.length,1);
assert.equal(model.effective.length,1);
assert.equal(model.effective[0].asset_id,'vehicle_audi_q8');
assert.equal(model.source,'RHI_ENERGY_CANONICAL_PROPERTY_V2.configuration.strategy');
const legacyOnly={states:{'sensor.old':{state:'ready',attributes:{effective_strategies:[{asset_id:'vehicle_audi_q8'}]}}}};
const unavailable=new Projection(legacyOnly,mobilityRuntime).viewModel();
assert.equal(unavailable.effectiveAvailable,false);
assert.equal(unavailable.configured.length,0);
assert.equal(unavailable.effective.length,0);
console.log('Energy Mobility canonical Strategy smoke PASS');
