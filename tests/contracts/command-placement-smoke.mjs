import vm from 'node:vm';
import { mobilityRuntimeSource } from '../helpers/source-fixtures.mjs';

const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;

const aid='charger_test';
const commands=[
  ['charger.command.start','charger.primary',true],
  ['charger.command.stop','charger.primary',false],
  ['charger.command.unlock_connector','charger.primary',true],
  ['charger.command.restart','charger.engineering',true],
  ['charger.command.identify','charger.engineering',true]
].map(([command_key,placement,execution_allowed])=>({
  command_id:`${aid}:${command_key}`,
  asset_id:aid,
  command_key,
  supported:true,
  execution_allowed,
  blocked_reason:execution_allowed?'':'already_stopped',
  placement,
  protective:command_key.endsWith('.stop')
}));

const staleV1={
  [`${aid}:charger.command.start`]:{
    asset_id:aid,command_id:`${aid}:charger.command.start`,command_key:'charger.command.start',
    frontend_allowed:true,execution_allowed:false,blocked_reason:'stale_v1_must_not_override',
    invoke:{service:'script.mobility_execute_command',data:{command_id:`${aid}:charger.command.start`}}
  }
};

const calls=[];
const hass={
  states:{
    'sensor.rhi_mobility_command_v2':{
      entity_id:'sensor.rhi_mobility_command_v2',
      state:'ready',
      attributes:{
        contract_id:'MOBILITY_COMMAND_V2',
        publisher:'rhi_mobility',
        commands,
        raw_service_bindings_exposed:false
      }
    },
    // Deliberately conflicting V1 compatibility surfaces. Once Command V2 exists
    // neither readiness nor placement may fall back to these entities.
    'sensor.mobility_command_index':{state:'ready',attributes:{commands_by_id:staleV1}},
    'sensor.mobility_charger_command_slot_index':{state:'ready',attributes:{slots_by_asset_json:JSON.stringify({[aid]:{charger_actions:{commands:[{command_key:'charger.command.start'}]}}})}},
    'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[{asset_id:aid,asset_type:'charger'}]}}
  },
  callService:(domain,service,data,target)=>{calls.push({domain,service,data,target});return Promise.resolve();}
};

const rt=new Runtime(hass,{});
const rows=rt.commandsForSurface(aid,'quick_actions');
if(rows.length!==commands.length) throw new Error(`expected ${commands.length} V2 commands, got ${rows.length}`);
const keys=new Set(rows.map(x=>x.command_key));
for(const key of commands.map(row=>row.command_key)) if(!keys.has(key)) throw new Error(`missing Command V2 command ${key}`);
if(keys.size!==rows.length) throw new Error('duplicate command rendered');

const stop=rows.find(x=>x.command_key==='charger.command.stop');
if(stop?.execution_allowed!==false || stop?.execution_reason!=='already_stopped') throw new Error('Command V2 readiness was not preserved');
const start=rows.find(x=>x.command_key==='charger.command.start');
if(start?.execution_allowed!==true) throw new Error('stale V1 readiness overrode Command V2');

for(const row of rows){
  if(row.service_domain!=='rhi_mobility' || row.service_action!=='execute_command') throw new Error('UX did not bind through producer-owned rhi_mobility.execute_command');
  if(row.service_data?.asset_id!==aid || row.service_data?.command_key!==row.command_key) throw new Error('producer command request is not exact asset_id + command_key');
}
if(rows.some(row=>row.service_domain==='script')) throw new Error('legacy raw script command transport leaked into V2 authority');

rt.callCommand(start);
if(calls.length!==1) throw new Error('V2 command was not dispatched');
if(calls[0].domain!=='rhi_mobility' || calls[0].service!=='execute_command') throw new Error('command did not use Mobility producer boundary');
if(calls[0].data.asset_id!==aid || calls[0].data.command_key!=='charger.command.start') throw new Error('dispatched command target/key mismatch');

const vehicle='vehicle_test';
hass.states['sensor.rhi_mobility_command_v2'].attributes.commands.push(
  {command_id:`${vehicle}:vehicle.command.lock`,asset_id:vehicle,command_key:'vehicle.command.lock',supported:true,execution_allowed:true,blocked_reason:'ready',placement:'vehicle.security',protective:false},
  {command_id:`${vehicle}:vehicle.command.refresh`,asset_id:vehicle,command_key:'vehicle.command.refresh',supported:true,execution_allowed:true,blocked_reason:'ready',placement:'vehicle.engineering',protective:false}
);
rt._memo.clear();
const vehicleQuick=rt.commandsForSurface(vehicle,'quick_actions');
if(vehicleQuick.some(row=>row.command_key==='vehicle.command.refresh')) throw new Error('engineering vehicle command leaked into quick actions');
if(!vehicleQuick.some(row=>row.command_key==='vehicle.command.lock')) throw new Error('vehicle security command missing from quick actions');
const engineering=rt.commandsForSurface(vehicle,'engineering');
if(engineering.length!==1 || engineering[0].command_key!=='vehicle.command.refresh') throw new Error('V2 placement did not route engineering command');

console.log('PASS MOBILITY_COMMAND_V2 is sole command authority when published');
console.log('PASS Start/Stop/Unlock/Restart/Identify survive without V1 slot materialization');
console.log('PASS command execution uses producer-owned rhi_mobility.execute_command');
console.log('PASS producer placement separates normal and engineering vehicle actions');
