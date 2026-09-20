import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../../',import.meta.url);
const asset=fs.readFileSync(new URL('src/assets/asset-paths.js',root),'utf8');
const runtime=fs.readFileSync(new URL('src/runtime/10-ha-contract-runtime.js',root),'utf8');
const dashboard=fs.readFileSync(new URL('src/screens/90-mobility-dashboard-card.js',root),'utf8');
const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(asset+'\n'+runtime+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
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
if(!dashboard.includes('rt.supervisorOutcome("mobility", "status", "Unknown")')) throw new Error('global status is not backend-owned/fail-closed');

console.log('PASS backend-owned global supervisor intelligence and fail-closed UX regression');
