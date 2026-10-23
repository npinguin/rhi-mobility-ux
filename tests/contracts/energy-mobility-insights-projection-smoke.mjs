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
assert.equal(model.meteringContractVersion,'RHI_ENERGY_CANONICAL_PROPERTY_V2');
assert.equal(model.valueContractVersion,'RHI_ENERGY_CANONICAL_PROPERTY_V2');
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

const session=(id,charger,vehicle,total,status='FINISHED',cost=null,costQuality='NOT_ALLOCATED')=>({
  session_id:id,charger_asset_id:charger,vehicle_asset_id:vehicle,
  attribution_quality:vehicle?'PROVEN':'UNATTRIBUTED',
  started_at:'2026-10-23T10:00:00+02:00',
  last_observed_at:'2026-10-23T10:30:00+02:00',
  finished_at:status==='CHARGING'?null:'2026-10-23T10:30:00+02:00',
  status,energy_kwh:total,cost_eur:cost,cost_quality:costQuality,
  quality:'PARTIAL',reason:'charger_energy_counter_unavailable'
});
const nativeSessionState=(active,recent,historyCount=10)=>({
  state:'OK',last_updated:'2026-10-23T10:31:00+02:00',attributes:{
    contract_id:'RHI_ENERGY_METERING_PERIOD_V1',
    canonical_source:'rhi_energy.runtime',period_id:'today',
    charging_sessions:{active,recent,history_count:historyCount}
  }
});
const goodNative=nativeSessionState(
  [session('active-1','driveway_left','vehicle_audi_q8',1.23,'CHARGING')],
  [session('old-1','driveway_right',null,0.0),
   session('old-2','driveway_right','vehicle_audi_q8',2.50,'FINISHED',0,'ALLOCATED')]
);
const withSessions={states:{...hass.states,'sensor.energy_today_meter':goodNative}};
const history=new Projection(withSessions,mobilityRuntime).viewModel('week');
assert.equal(history.sessionsAvailable,true);
assert.equal(history.recentSessions.length,3);
assert.equal(history.recentSessions.find(r=>r.sessionId==='active-1').vehicleId,'vehicle_audi_q8');
assert.equal(history.recentSessions.find(r=>r.sessionId==='old-1').vehicleId,null);
assert.equal(history.recentSessions.find(r=>r.sessionId==='old-1').energyKwh,0);
assert.equal(history.recentSessions.find(r=>r.sessionId==='old-1').costEur,null);
assert.equal(history.recentSessions.find(r=>r.sessionId==='old-2').costEur,0);
assert.equal(history.sessionHistoryCount,10);
assert.match(history.sessionsSource,/RHI_ENERGY_METERING_PERIOD_V1/);
assert.notEqual(new Projection(withSessions,mobilityRuntime).energy.revisionSignature('history'),
  new Projection(hass,mobilityRuntime).energy.revisionSignature('history'),
  'native Energy session update invalidates Mobility History');

const withoutCostAllocation=nativeSessionState([],
  [session('s','c','vehicle_audi_q8',4,'FINISHED',99,'NOT_ALLOCATED')]);
assert.equal(new Projection({states:{a:withoutCostAllocation}},mobilityRuntime)
  .viewModel('today').recentSessions[0].costEur,null,'bare numeric euro never establishes allocation');

const duplicatedPublication=new Projection({states:{a:goodNative,b:goodNative}},mobilityRuntime)
  .viewModel('today');
assert.equal(duplicatedPublication.sessionsAvailable,false);
assert.equal(duplicatedPublication.recentSessions.length,0);
assert.equal(duplicatedPublication.sessionHistoryReason,'duplicate_energy_session_publication');

const duplicateId=nativeSessionState([session('collision','white','vehicle_audi_q8',1,'CHARGING')],
  [session('collision','black',null,4)]);
assert.equal(new Projection({states:{a:duplicateId}},mobilityRuntime)
  .viewModel('today').recentSessions.length,0,'duplicate session ID never chooses an arbitrary winner');

const invalidTimes=nativeSessionState([],[
  {...session('no-tz','white','vehicle_audi_q8',1),started_at:'2026-10-23T10:00:00'},
  {...session('reversed','white','vehicle_audi_q8',1),finished_at:'2026-10-23T08:00:00+02:00'},
]);
assert.equal(new Projection({states:{a:invalidTimes}},mobilityRuntime)
  .viewModel('today').recentSessions.length,0);

const router=fs.readFileSync('src/ui/screens/router.js','utf8');
const localization=fs.readFileSync('src/app/localization.js','utf8');
assert.match(router,/insights\.charging_sessions/);
assert.match(router,/insights\.session_cost_unavailable/);
assert.match(router,/insights\.unassigned_vehicle/);
for(const key of ['charging_sessions','charging_history','session_cost_unavailable','unassigned_vehicle','session_source_unavailable']){
  assert.equal((localization.match(new RegExp('"insights\\.'+key+'"','g'))||[]).length,3,
    'EN NL FR key '+key);
}

console.log('Energy Mobility period-scoped canonical Insights smoke PASS');
