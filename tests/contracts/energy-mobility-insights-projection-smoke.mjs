import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const shared=fs.readFileSync('src/runtime/energy-public-v2-projection.js','utf8');
const source=fs.readFileSync('src/runtime/energy-mobility-insights-projection.js','utf8');
const context={};
vm.createContext(context);
vm.runInContext(shared+'\n'+source+'\nthis.__Projection=HomeBrainEnergyMobilityInsightsProjection;',context);
const Projection=context.__Projection;
const property=(asset,key,value,surface)=>({state:String(value),attributes:{
  canonical_contract:'RHI_ENERGY_CANONICAL_PROPERTY_V2',asset_id:asset,property_key:key,
  value,availability:'AVAILABLE',presentation_surface:surface,
  period_id:'today',unit:surface==='metering'?'kWh':'EUR'}});
const hass={states:{
  'sensor.vehicle_meter':property('vehicle_audi_q8','today_energy_kwh',8.5,'metering'),
  'sensor.battery_meter':property('home_battery','today_energy_kwh',4.2,'metering'),
  'sensor.vehicle_value':property('vehicle_audi_q8','today_attributed_eur',1.42,'value_accounting'),
  'sensor.battery_value':property('home_battery','today_attributed_eur',0.2,'value_accounting')
}};
const mobilityRuntime={mobilityRegistry:()=>[{asset_id:'vehicle_audi_q8',display_name:'Audi Q8'}]};
const model=new Projection(hass,mobilityRuntime).viewModel('today');
assert.equal(model.meteringAvailable,true);
assert.equal(model.valueAvailable,true);
assert.equal(model.rows.length,1);
assert.equal(model.rows[0].energyKwh,8.5);
assert.equal(model.rows[0].attributedEur,1.42);
assert.equal(model.totalVehicleEnergyKwh,null);
assert.equal(model.totalAttributedEur,null);
assert.equal(model.source,'RHI_ENERGY_CANONICAL_PROPERTY_V2.metering/value_accounting');
const unavailable=new Projection({states:{'sensor.old':{state:'ready',attributes:{summary:{consumer_allocation:[{asset_id:'vehicle_audi_q8',attributed_eur:99}]}}}}},mobilityRuntime).viewModel('today');
assert.equal(unavailable.meteringAvailable,false);
assert.equal(unavailable.valueAvailable,false);
assert.equal(unavailable.rows.length,0);
// A coincidentally named key cannot establish period ownership or units.
const missingPeriod={states:{'sensor.guessed':{state:'8.5',attributes:{
  canonical_contract:'RHI_ENERGY_CANONICAL_PROPERTY_V2',asset_id:'vehicle_audi_q8',
  property_key:'today_energy_kwh',value:8.5,availability:'AVAILABLE',presentation_surface:'metering'
}}}};
const guessed=new Projection(missingPeriod,mobilityRuntime).viewModel('today');
assert.equal(guessed.meteringAvailable,false);
assert.equal(guessed.rows.length,0);
const anotherPeriod=new Projection(hass,mobilityRuntime).viewModel('week');
assert.equal(anotherPeriod.meteringAvailable,false);
assert.equal(anotherPeriod.valueAvailable,false);
console.log('Energy Mobility period-scoped canonical Insights smoke PASS');
