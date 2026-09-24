import vm from 'node:vm';
import { mobilityRuntimeSource, sourceModule } from '../helpers/source-fixtures.mjs';

const dashboard=sourceModule('ui/screens/mobility-dashboard.js');
const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;

const hass={states:{
  'sensor.rhi_mobility_supervision_v2':{state:'ready',attributes:{
    contract_id:'MOBILITY_SUPERVISION_V2',
    publisher:'rhi_mobility',
    status:{available:true,value:'ready'},
    system_trust:{available:true,value:'trusted'},
    attention:{available:true,value:'none',reasons:[]},
    current_activity:{available:true,activity:{asset_id:'vehicle_1',activity_type:'charging',activity_state:'active'}},
    charging_plan:{available:false,reason:'owned_by_energy'},
    opportunity:{available:false,reason:'owned_by_energy'},
    recommended_action:{available:false,reason:'owned_by_energy'}
  }}
}};
const rt=new Runtime(hass,{});
for(const [key,expected] of [
  ['status','ready'],
  ['trust','trusted'],
  ['attention','none'],
  ['activity','active']
]) {
  const actual=rt.supervisorOutcome('mobility',key,'Unknown');
  if(actual!==expected) throw new Error(`global supervisor ${key} drift: ${actual}`);
}
if(rt.supervisorOutcome('mobility','opportunity','')!=='') throw new Error('Energy-owned opportunity must not be invented by Mobility UX');
if(rt.supervisorOutcome('mobility','recommended_action','')!=='') throw new Error('Energy-owned recommendation must not be invented by Mobility UX');

const missing=new Runtime({states:{}},{});
if(missing.supervisorOutcome('mobility','status','Unknown')!=='Unknown') throw new Error('missing global supervisor status must fail closed');
if(missing.supervisorOutcome('mobility','recommended_action','')!=='') throw new Error('missing recommendation must not be locally invented');

for(const forbidden of [
  'No immediate action',
  'Vehicles and chargers are under supervision.',
  'charge_when_optimal',
  'const chargingSummary = this.chargingSummary',
  'this.chargingSummary(rt, vehicles)'
]) {
  if(dashboard.includes(forbidden)) throw new Error(`frontend-derived supervisor fallback remains: ${forbidden}`);
}
if(!dashboard.includes('Backend supervisor recommendation unavailable.')) throw new Error('missing fail-closed recommendation presentation');
if(!dashboard.includes('rt.supervisorOutcome("mobility", "recommended_action", "")')) throw new Error('Mobility recommendation path must remain fail-closed while Energy owns recommendation semantics');

console.log('PASS Mobility Supervision V2 status/trust/attention authority and Energy-owned recommendation fail-closed boundary');
