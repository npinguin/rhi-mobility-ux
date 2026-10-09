import vm from 'vm';
import { mobilityRuntimeSource } from '../helpers/source-fixtures.mjs';

const src=mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;';
const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(src,ctx);
const Runtime=ctx.HomeBrainAssetRuntime;
const aid='charger_driveway_right';

const runtimeState={
  state:'OK',
  attributes:{
    contract_id:'MOBILITY_PUBLIC_RUNTIME_V2',
    canonical:true,
    assets:[{asset_id:aid,asset_type:'charger',display_name:'Driveway Right Charger'}],
    relationships:[],
    vehicle_charger_relationships:[],
    release:{backend_release:'M0.test'}
  }
};
const prop=(entityId,key,value,extra={})=>[entityId,{
  entity_id:entityId,
  state:value===null?'unknown':String(value),
  attributes:{
    canonical_contract:'MOBILITY_CANONICAL_PROPERTY_V2',
    asset_id:aid,
    asset_type:'charger',
    property_key:key,
    value,
    ...extra
  }
}];

const propertyStates=[
  prop('sensor.rhi_mobility_charger_display_name',aid+'.display_name','Driveway Right Charger',{property_key:'asset.display_name',component_id:'charger',section_id:'identity',display_name:'Name',display_order:10}),
  prop('sensor.rhi_mobility_charger_profile', 'asset.profile_id','wallbox_ocpp',{component_id:'charger',section_id:'identity',display_name:'Profile',display_order:20,editable:true,write_supported:true,write_binding_type:'select',write_service_domain:'select',write_service_action:'select_option',write_target_entity:'select.rhi_mobility_charger_profile',choices:[{value:'wallbox_ocpp',label:'Wallbox OCPP charger'},{value:'__none__',label:'None'}]}),
  prop('sensor.rhi_mobility_charger_lifecycle','lifecycle_status','active',{component_id:'charger',section_id:'status',display_name:'Lifecycle',display_order:10}),
  prop('sensor.rhi_mobility_charger_operating','charger.operating_state','stopped',{component_id:'charger',section_id:'status',display_name:'Operating state',display_order:20}),
  prop('sensor.rhi_mobility_charger_connection','charger.connection_state','connected',{component_id:'charger',section_id:'connection',display_name:'Connection',display_order:30}),
  prop('sensor.rhi_mobility_charger_requested','charger.requested_charge_power_kw',3.68,{component_id:'control',section_id:'limits',display_name:'Requested charge power',display_order:10,unit:'kW',editable:true,write_supported:true,write_binding_type:'number',write_service_domain:'number',write_service_action:'set_value',write_target_entity:'number.rhi_mobility_charger_requested_power',min:2.76,max:7.36,step:.46}),
  prop('sensor.rhi_mobility_charger_power','charger.power_kw',0,{component_id:'metering',section_id:'power',display_name:'Power',display_order:10,unit:'kW'}),
  prop('sensor.rhi_mobility_charger_session','charger.session_energy_kwh',.364,{component_id:'metering',section_id:'energy',display_name:'Session energy',display_order:10,unit:'kWh'}),
  prop('sensor.rhi_mobility_charger_lifetime','charger.lifetime_energy_kwh',209.599,{component_id:'metering',section_id:'energy',display_name:'Lifetime energy',display_order:20,unit:'kWh'}),
  prop('sensor.rhi_mobility_charger_health','charger.health','OK',{component_id:'engineering',section_id:'diagnostics',display_name:'Health',display_order:10,visibility:'diagnostics'}),
  prop('sensor.rhi_mobility_charger_vendor','charger.vendor','Wallbox',{component_id:'engineering',section_id:'diagnostics',display_name:'Vendor',display_order:20,visibility:'diagnostics'})
];

const command=(key,placement,allowed=true)=>({
  asset_id:aid,
  command_id:`${aid}:${key}`,
  command_key:key,
  label:key.split('.').pop(),
  placement,
  supported:true,
  execution_allowed:allowed,
  blocked_reason:allowed?'':'already_stopped'
});
const commandState={
  state:'4',
  attributes:{
    contract_id:'MOBILITY_COMMAND_V2',
    commands:[
      command('charger.command.start_charging','quick_actions'),
      command('charger.command.stop_charging','quick_actions',false),
      command('charger.command.unlock_connector','quick_actions'),
      command('charger.command.restart','quick_actions')
    ]
  }
};

const hass={states:Object.fromEntries([
  ['sensor.rhi_mobility_runtime_v2',runtimeState],
  ['sensor.rhi_mobility_command_v2',commandState],
  ...propertyStates
])};

const rt=new Runtime(hass,{});
const snapshot=rt.chargerProductSnapshot(aid);
if(snapshot.operating.display!=='Stopped') throw new Error('operating_state not materialized from V2 property publication');
if(snapshot.connection.display!=='Connected') throw new Error('connection_state not materialized from V2 property publication');
if(snapshot.power.display!=='0 kW') throw new Error(`power not materialized: ${snapshot.power.display}`);
if(snapshot.health.display!=='Ok' && snapshot.health.display!=='OK') throw new Error(`health not materialized: ${snapshot.health.display}`);

const profileRow=rt.propertyByCompoundKey(aid,'asset.profile_id');
if(rt.uxEditorControlKind(profileRow)!=='select') throw new Error('V2 profile choices did not produce select editor');
if(rt.propertyEditorRow(profileRow).choices.length!==2) throw new Error('V2 profile choices were not preserved');

const sections=rt.chargerComponentDetailSections(aid);
for(const title of ['Charger','Control','Metering','Engineering']) if(!sections.some(s=>s.title===title)) throw new Error(`missing V2 component ${title}`);
const meteringText=JSON.stringify(sections.find(s=>s.title==='Metering'));
for(const text of ['Power','Session energy','Lifetime energy']) if(!meteringText.includes(text)) throw new Error(`metering missing ${text}`);

const commands=rt.commandsForSurface(aid,'quick_actions');
const keys=commands.map(c=>c.command_key);
for(const key of ['charger.command.start_charging','charger.command.stop_charging','charger.command.unlock_connector','charger.command.restart']) if(!keys.includes(key)) throw new Error(`missing V2 command ${key}`);
if(commands.find(c=>c.command_key==='charger.command.stop_charging')?.execution_allowed!==false) throw new Error('V2 command readiness not preserved');

const serialized=JSON.stringify(hass);
for(const legacy of ['sensor.mobility_charger_property_index','sensor.mobility_charger_component_contract_index','sensor.mobility_charger_command_slot_index','sensor.mobility_command_index','sensor.mobility_asset_index']){
  if(serialized.includes(legacy)) throw new Error('V1 test fixture returned: '+legacy);
}
console.log('PASS charger materialization uses V2 property publications only');
console.log('PASS V2 component placement renders charger details');
console.log('PASS MOBILITY_COMMAND_V2 owns charger actions and readiness');
