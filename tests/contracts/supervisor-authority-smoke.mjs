import vm from 'node:vm';
import { mobilityRuntimeSource, sourceModule } from '../helpers/source-fixtures.mjs';

const dashboard=sourceModule('ui/screens/mobility-dashboard.js');
const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;

const hass={states:{
  'sensor.mobility_intelligence_index':{state:'ready',attributes:{
    intelligence_json:JSON.stringify([
      {scope:'mobility',status:'OK',trust:'Trusted',attention:'None',opportunity:'Charge later',recommended_action:'Wait',recommended_reason:'Lower-price window expected'}
    ])
  }}
}};
const rt=new Runtime(hass,{});
for(const [key,expected] of [
  ['status','OK'],
  ['trust','Trusted'],
  ['attention','None'],
  ['opportunity','Charge later'],
  ['recommended_action','Wait'],
  ['recommended_reason','Lower-price window expected']
]) {
  const actual=rt.supervisorOutcome('mobility',key,'Unknown');
  if(actual!==expected) throw new Error(`global supervisor ${key} drift: ${actual}`);
}

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
if(!dashboard.includes('rt.supervisorOutcome("mobility", "attention", "Unknown")')) throw new Error('overview attention is not backend-owned/fail-closed');
if(!dashboard.includes('rt.supervisorOutcome("mobility", "recommended_action", "")')) throw new Error('overview recommendation is not backend-owned/fail-closed');

console.log('PASS backend-owned global supervisor intelligence and fail-closed UX regression');
