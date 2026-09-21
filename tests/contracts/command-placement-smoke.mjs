import vm from 'node:vm';
import { mobilityRuntimeSource } from '../helpers/source-fixtures.mjs';
const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;
const aid='charger_test';
const slots=['start_charging','stop_charging','unlock_connector','restart','identify'].map((x,i)=>({command_id:`${aid}:charger.command.${x}`,command_key:`charger.command.${x}`,display_order:(i+1)*10}));
const commands=Object.fromEntries(slots.map((s,i)=>[s.command_id,{asset_id:aid,...s,frontend_allowed:true,execution_allowed:i!==1,blocked_reason:i===1?'already_stopped':'',invoke:{service:'script.mobility_execute_command',target:{},data:{command_id:s.command_id}}}]));
const hass={states:{
 'sensor.mobility_charger_command_slot_index':{state:'ready',attributes:{slots_by_asset_json:JSON.stringify({[aid]:{asset_id:aid,charger_actions:{commands:slots}}})}},
 'sensor.mobility_command_index':{state:'ready',attributes:{commands_by_id:commands}},
 'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[{asset_id:aid,asset_type:'charger'}]}}
}};
const rt=new Runtime(hass,{});
const rows=rt.commandsForSurface(aid,'quick_actions');
if(rows.length!==slots.length) throw new Error(`expected ${slots.length} placed commands, got ${rows.length}`);
const ids=new Set(rows.map(x=>x.command_id));
if(ids.size!==rows.length) throw new Error('duplicate command rendered');
const stop=rows.find(x=>x.command_key==='charger.command.stop_charging');
if(stop?.execution_allowed!==false) throw new Error('readiness must come from command index');
console.log('PASS command-slot placement exact-once and command-index readiness smoke');
