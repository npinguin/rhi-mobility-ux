import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Run the actual consumer implementations against native producer-shaped
// Energy horizon and metric entities, never a synthetic aggregate contract.
const source=fs.readFileSync('src/runtime/energy-public-v2-projection.js','utf8')+'\n'+
  fs.readFileSync('src/runtime/energy-planning-projection.js','utf8');
const context=vm.createContext({});
vm.runInContext(source+'\nthis.Projection=HomeBrainEnergyPlanningProjection;'+
  '\nthis.Energy=HomeBrainEnergyCanonicalProjection;',context);
const Projection=context.Projection;
const Energy=context.Energy;
const mobility={mobilityRegistry:()=>[
  {asset_id:'vehicle_audi_q8'}, {asset_id:'vehicle_vw_id4'},
  {asset_id:'charger_driveway'}]};
const metric=(key,value,availability='AVAILABLE')=>({
  state:String(value),last_updated:'2026-10-11T11:00:00Z',attributes:{
    canonical_source:'rhi_energy.runtime',metric_key:key,
    availability,unit_of_measurement:'kWh'
  }
});
const totals={D0:[21,12.4,8.6,15.6,12.4,3.2],D1:[13,8.1,4.9,11,8.1,2.9]};
const totalKeys=['required_kwh','planned_kwh','still_to_plan_kwh',
  'flexible_required_kwh','flexible_planned_kwh','flexible_still_to_plan_kwh'];
const details=horizon=>({
  horizon_id:horizon,
  required_kwh:totals[horizon][0],planned_kwh:totals[horizon][1],
  still_to_plan_kwh:totals[horizon][2],
  flexible_required_kwh:totals[horizon][3],
  flexible_planned_kwh:totals[horizon][4],
  flexible_still_to_plan_kwh:totals[horizon][5],
  buckets:[{bucket_id:horizon+'-10',start:'2026-10-11T10:00:00Z',
    end:'2026-10-11T11:00:00Z',asset_allocations:[
      {asset_id:'vehicle_audi_q8',planned_energy_kwh:2.5},
      {asset_id:'battery_1',planned_energy_kwh:3.7}]}],
  planning_assets:[{asset_id:'vehicle_vw_id4',planned_energy_kwh:4}],
  known_demand_projection:{
    basis:'solar_plus_home_baseload_only_no_battery_dispatch',
    execution_authorized:false,complete:false,unknown_flexible_load_count:2,
    home_consumption_forecast_kwh:8.5,solar_forecast_kwh:5,
    expected_grid_import_kwh:3.5,expected_grid_export_kwh:0,
    grid_balance_kwh:3.5
  },
  source_lanes:{solar:4},consumer_lanes:{vehicle:6},
  execution_policy:{manual_plan_execution_allowed:false}
});
const horizon=(id,variant='effective',availability='AVAILABLE',extra={})=>({
  state:availability.toLowerCase(),
  last_updated:'2026-10-11T11:00:00Z',
  attributes:{
    canonical_contract:variant==='effective'
      ? 'RHI_ENERGY_PLANNING_HORIZON_V1'
      : 'RHI_ENERGY_BASELINE_PLANNING_HORIZON_V1',
    canonical_source:'rhi_energy.runtime',
    horizon_id:id,variant,provider_id:variant==='baseline'?'rhi_deterministic':'emhass',
    requested_provider:'emhass',plan_id:'effective:42',
    availability,totals_complete:availability==='AVAILABLE',
    reason_code:availability==='AVAILABLE'?null:'planning_horizon_quality_incomplete',
    execution_authorized:variant==='effective'&&availability==='AVAILABLE',
    details:details(id),...extra
  }
});
const metricStates=()=>Object.fromEntries(Object.entries(totals).flatMap(([id,values])=>
  values.map((value,i)=>{
    const day=id==='D0'?'today':'tomorrow';
    return ['sensor.'+day+'_'+totalKeys[i],metric('planning_'+day+'_'+totalKeys[i],value)];
  })));
const complete={states:{...metricStates(),
  'sensor.effective_d0':horizon('D0'),
  'sensor.effective_d1':horizon('D1'),
  'sensor.baseline_d0':horizon('D0','baseline'),
  'sensor.baseline_d1':horizon('D1','baseline')
}};
const model=new Projection(complete,mobility).viewModel();
assert.equal(model.complete,true);
assert.equal(model.available,true);
assert.equal(model.state,'AVAILABLE');
assert.equal(model.today.plannedKwh,12.4);
assert.equal(model.tomorrow.stillToPlanKwh,2.9);
assert.equal(model.today.provisional,false);
assert.equal(model.baselineAvailable,true);
assert.equal(model.effectiveProvider,'emhass');
assert.equal(model.providerHold,false);
assert.equal(model.independentKnownDemand.D0.available,true);
assert.equal(model.independentKnownDemand.D0.source,'effective');
assert.equal(model.independentKnownDemand.D0.homeKwh,8.5);
assert.equal(model.independentKnownDemand.D0.gridImportKwh,3.5);
assert.equal(model.independentKnownDemand.D0.unknownFlexibleLoadCount,2);
assert.equal(model.independentKnownDemand.D0.isEffectiveSchedule,false);
assert.equal(model.independentKnownDemand.D0.executionAuthorized,false);
assert.equal(model.contractVersion,'RHI_ENERGY_PLANNING_HORIZON_V1');
assert.equal(model.mobilityPlanningRows.length,4,
  'only exact matching Mobility planning assets and bucket allocations');
assert.ok(!model.mobilityPlanningRows.some(r=>r.asset_id==='battery_1'));
assert.equal(model.combined.plannedKwh,null,'UX cannot invent cross-horizon total');

const metricsOnly=new Projection({states:metricStates()},mobility).viewModel();
assert.equal(metricsOnly.available,false,
  'loose numeric native metrics cannot prove an effective schedule');
assert.equal(metricsOnly.state,'UNAVAILABLE');
assert.equal(metricsOnly.today.provisional,true);
assert.equal(metricsOnly.today.plannedKwh,12.4,
  'publisher numeric evidence may be surfaced but flagged provisional');
assert.equal(metricsOnly.mobilityPlanningRows.length,0);

const held={states:{...metricStates(),
  'sensor.effective_d0':horizon('D0','effective','INCOMPLETE',{
    provider_id:null,reason_code:'native_optimizer_not_available'}),
  'sensor.effective_d1':horizon('D1','effective','INCOMPLETE',{
    provider_id:null,reason_code:'native_optimizer_not_available'}),
  'sensor.baseline_d0':horizon('D0','baseline')
}};
const blocked=new Projection(held,mobility).viewModel();
assert.equal(blocked.published,true);
assert.equal(blocked.complete,false);
assert.equal(blocked.available,false);
assert.equal(blocked.state,'INCOMPLETE');
assert.equal(blocked.providerHold,true);
assert.equal(blocked.requestedProvider,'emhass');
assert.equal(blocked.effectiveProvider,'');
assert.equal(blocked.quality.D0,'INCOMPLETE');
assert.equal(blocked.quality.D1,'INCOMPLETE');
assert.equal(blocked.reason,'native_optimizer_not_available');
assert.equal(blocked.today.provisional,true);
assert.equal(blocked.mobilityPlanningRows.length,0,
  'baseline or INCOMPLETE allocations may not masquerade as effective schedule');
assert.equal(blocked.independentKnownDemand.D0.available,true,
  'independent known home/solar may survive a held optimizer');
assert.equal(blocked.independentKnownDemand.D0.source,'baseline',
  'hold must prefer baseline evidence, not an unaccepted effective plan');
assert.equal(blocked.independentKnownDemand.D0.isEffectiveSchedule,false);

const duplicate={states:{...complete.states,
  'sensor.d0_conflict':horizon('D0','effective','AVAILABLE',{plan_id:'other-plan'})}};
const conflicting=new Projection(duplicate,mobility).viewModel();
assert.equal(conflicting.complete,false);
assert.equal(conflicting.quality.D0,'UNAVAILABLE');
assert.equal(conflicting.mobilityPlanningRows.every(r=>r.horizon_id!=='D0'),true);

const noJoin=new Projection(complete,{mobilityRegistry:()=>[
  {asset_id:'vehicle_not_in_plan'}]}).viewModel();
assert.equal(noJoin.mobilityPlanningRows.length,0);
assert.equal(noJoin.exactIdentityJoin,true);
assert.equal(new Projection({states:{'sensor.only_baseline':horizon('D0','baseline')}},mobility)
  .viewModel().available,false,'baseline cannot authorize effective plan');

const initialRevision=new Energy(complete).revisionSignature('planning');
const replaced={states:{...complete.states,
  'sensor.effective_d0':{...complete.states['sensor.effective_d0'],
    last_updated:'2026-10-11T11:02:00Z'}}};
assert.notEqual(new Energy(replaced).revisionSignature('planning'),initialRevision,
  'Mobility planning router must respond to Energy publication revision');
assert.equal(new Energy(complete).revisionSignature('planning'),initialRevision);

const mismatchedPlans={states:{...complete.states,
  'sensor.effective_d1':horizon('D1','effective','AVAILABLE',{plan_id:'another-run'})}};
const mixed=new Projection(mismatchedPlans,mobility).viewModel();
assert.equal(mixed.horizonIdentityCoherent,false);
assert.equal(mixed.complete,false,'different D0/D1 plan IDs must never be combined');
assert.equal(mixed.state,'INCOMPLETE');
assert.equal(mixed.mobilityPlanningRows.length,0,'mixed runs may never publish schedule allocations');
assert.equal(mixed.independentKnownDemand.D0.available,true,
  'validated independent home/solar can survive quarantined effective plans');
assert.equal(mixed.independentKnownDemand.D0.isEffectiveSchedule,false);

const mixedProviders={states:{...complete.states,
  'sensor.effective_d1':horizon('D1','effective','AVAILABLE',{provider_id:'rhi_deterministic'})}};
assert.equal(new Projection(mixedProviders,mobility).viewModel().complete,false,
  'D0/D1 provider mismatch must fail closed');
const requestedMismatch={states:{...complete.states,
  'sensor.effective_d0':horizon('D0','effective','AVAILABLE',{requested_provider:'emhass',provider_id:'rhi_deterministic'}),
  'sensor.effective_d1':horizon('D1','effective','AVAILABLE',{requested_provider:'emhass',provider_id:'rhi_deterministic'})}};
assert.equal(new Projection(requestedMismatch,mobility).viewModel().providerHold,true,
  'requested provider mismatch cannot silently become accepted effective selection');

const contradicting=horizon('D0','baseline','AVAILABLE',{
  details:{...details('D0'), known_demand_projection:{
    ...details('D0').known_demand_projection,
    expected_grid_import_kwh:0,
    expected_grid_export_kwh:5}}
});
const rejected=new Projection({states:{'sensor.bad_baseline':contradicting}},mobility).viewModel();
assert.equal(rejected.independentKnownDemand.D0.available,false,
  'non-reconciling known demand and grid balance must not be published');

const noEvidencedBaseload=new Projection({states:metricStates()},mobility).viewModel();
assert.equal(noEvidencedBaseload.independentKnownDemand.D0.available,false);
assert.equal(noEvidencedBaseload.independentKnownDemand.D0.homeKwh,null,
  'standalone totals may not be relabelled as independent physical baseline');

console.log('PASS Mobility native Energy planning: D0/D1 effective, provider HOLD, baseline, duplicates, identity and Energy revision');
