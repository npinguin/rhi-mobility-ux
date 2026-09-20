import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../../',import.meta.url);
const asset=fs.readFileSync(new URL('src/assets/asset-paths.js',root),'utf8');
const runtime=fs.readFileSync(new URL('src/runtime/10-ha-contract-runtime.js',root),'utf8');
const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(asset+'\n'+runtime+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;
const aid='charger_test';
const hass={states:{
  'sensor.mobility_charger_property_index':{state:'ready',attributes:{properties_by_key:{
    [`${aid}:charger.operating_state`]:{value:'running'},
    [`${aid}:charger.connection_state`]:{value:'connected'},
    [`${aid}:charger.power_kw`]:{value:0,unit:'kW'},
    [`${aid}:charger.requested_charge_power_kw`]:{value:7.36,unit:'kW'},
    [`${aid}:charger.actual_current_a`]:{value:0,unit:'A'},
    [`${aid}:charger.health`]:{value:'OK'},
    [`${aid}:charger.health_reason`]:{value:null}
  }}},
  'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[{asset_id:aid,asset_type:'charger',display_name:'Test charger'}]}},
  'sensor.mobility_relationship_index':{state:'ready',attributes:{relationships:[]}}
}};
const rt=new Runtime(hass,{});
const snap=rt.chargerProductSnapshot(aid);
if(snap.operating.display!=='Charging') throw new Error(`operating_state drift: ${snap.operating.display}`);
if(snap.connection.display!=='Connected') throw new Error(`connection_state drift: ${snap.connection.display}`);
if(snap.power.display!=='0 kW') throw new Error(`zero must remain zero: ${snap.power.display}`);
if(String(snap.health.display).toLowerCase()!=='ok') throw new Error(`health drift: ${snap.health.display}`);
if(snap.power.value!=='0') throw new Error(`canonical actual power must stay 0, got ${snap.power.value}`);
const requested=rt.propertyByCompoundKey(aid,'charger.requested_charge_power_kw');
if(String(requested?.value)!=='7.36') throw new Error('requested charging intent missing from its own property');
if(snap.power.value===String(requested?.value)) throw new Error('requested charging intent replaced canonical actual power');
if(snap.connected_vehicle.resolved!==false) throw new Error('missing relationship must stay unresolved');

const missingAid='charger_missing_power';
const missingHass={states:{
  'sensor.mobility_charger_property_index':{state:'ready',attributes:{properties_by_key:{
    [`${missingAid}:charger.operating_state`]:{value:'stopped'},
    [`${missingAid}:charger.connection_state`]:{value:'disconnected'},
    [`${missingAid}:charger.health`]:{value:'OK'}
  }}},
  'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[{asset_id:missingAid,asset_type:'charger'}]}},
  'sensor.mobility_relationship_index':{state:'ready',attributes:{relationships:[]}}
}};
const missingRt=new Runtime(missingHass,{});
const missingSnap=missingRt.chargerProductSnapshot(missingAid);
if(missingSnap.power.resolved!==false || missingSnap.power.display!=='—') throw new Error('missing actual power must stay unresolved, never become zero');

console.log('PASS canonical actual/requested separation and zero/unavailable semantics');
console.log('PASS canonical charger status/connection/power/health contract smoke');
