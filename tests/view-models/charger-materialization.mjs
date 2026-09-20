import fs from 'fs';
import vm from 'vm';
const src = fs.readFileSync(new URL('../../src/assets/asset-paths.js', import.meta.url), 'utf8') + '\n' + fs.readFileSync(new URL('../../src/runtime/10-ha-contract-runtime.js', import.meta.url), 'utf8') + '\n;globalThis.HomeBrainAssetRuntime = HomeBrainAssetRuntime;';
const ctx = { console, globalThis: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const Runtime = ctx.HomeBrainAssetRuntime;
const aid='charger_driveway_right';
const prop=(value, extra={})=>({value, ...extra});
const fields={
  'asset.display_name':{property_key:'asset.display_name',card_id:'charger_overview',section_id:'identity',label:'Name',display_order:10},
  'asset.profile_id':{property_key:'asset.profile_id',card_id:'charger_overview',section_id:'identity',label:'Profile',display_order:20},
  'lifecycle_status':{property_key:'lifecycle_status',card_id:'charger_overview',section_id:'status',label:'Lifecycle',display_order:10},
  'charger.operating_state':{property_key:'charger.operating_state',card_id:'charger_overview',section_id:'status',label:'Operating state',display_order:20},
  'charger.connection_state':{property_key:'charger.connection_state',card_id:'charger_overview',section_id:'connection',label:'Connection',display_order:10},
  'charger.requested_charge_power_kw':{property_key:'charger.requested_charge_power_kw',card_id:'charger_control',section_id:'limits',label:'Requested charge power',display_order:10},
  'charger.power_kw':{property_key:'charger.power_kw',card_id:'charger_metering',section_id:'power',label:'Power',display_order:10},
  'charger.session_energy_kwh':{property_key:'charger.session_energy_kwh',card_id:'charger_metering',section_id:'energy',label:'Session energy',display_order:10},
  'charger.lifetime_energy_kwh':{property_key:'charger.lifetime_energy_kwh',card_id:'charger_metering',section_id:'energy',label:'Lifetime energy',display_order:20},
  'charger.health':{property_key:'charger.health',card_id:'charger_engineering',section_id:'diagnostics',label:'Health',display_order:10},
  'charger.health_reason':{property_key:'charger.health_reason',card_id:'charger_engineering',section_id:'diagnostics',label:'Health reason',display_order:20}
};
const cards=[
 {card_id:'charger_overview',title:'Charger',card_order:10,property_index_entity:'sensor.mobility_charger_property_index',sections:[{section_id:'identity',title:'Identity',order:10},{section_id:'status',title:'Status',order:20},{section_id:'connection',title:'Connection',order:30}]},
 {card_id:'charger_actions',title:'Actions',card_order:20,property_index_entity:'sensor.mobility_charger_command_slot_index',sections:[{section_id:'commands',title:'Actions'}]},
 {card_id:'charger_control',title:'Control',card_order:25,property_index_entity:'sensor.mobility_charger_property_index',sections:[{section_id:'limits',title:'Charge limits'}]},
 {card_id:'charger_metering',title:'Metering',card_order:30,property_index_entity:'sensor.mobility_charger_property_index',sections:[{section_id:'power',title:'Power'},{section_id:'energy',title:'Energy'}]},
 {card_id:'charger_engineering',title:'Engineering',card_order:90,property_index_entity:'sensor.mobility_charger_property_index',sections:[{section_id:'diagnostics',title:'Diagnostics'},{section_id:'unmapped',title:'Unmapped'}]}
];
const propertiesByKey={
 [`${aid}:asset.display_name`]:prop('Driveway Right Charger',{editable:false}),
 [`${aid}:asset.profile_id`]:prop('wallbox_ocpp',{editable:true,write_supported:true,write_binding_type:'select',write_service_domain:'select',write_service_action:'select_option',write_target_entity:'select.rhi_mobility_charger_profile',choices:[{value:'wallbox_ocpp',label:'Wallbox OCPP charger'},{value:'__none__',label:'None'}],value_field:'value',label_field:'label'}),
 [`${aid}:lifecycle_status`]:prop('active',{editable:true}),
 [`${aid}:charger.operating_state`]:prop('stopped'),
 [`${aid}:charger.connection_state`]:prop('connected'),
 [`${aid}:charger.power_kw`]:prop(0,{unit:'kW'}),
 [`${aid}:charger.health`]:prop('OK'),
 [`${aid}:charger.health_reason`]:prop('none'),
 [`${aid}:charger.requested_charge_power_kw`]:prop(3.68,{unit:'kW',editable:true,min:2.76,max:7.36,step:.46,write_supported:true,write_binding_type:'number',write_service_domain:'input_number',write_service_action:'set_value',write_target_entity:'input_number.test'}),
 [`${aid}:charger.session_energy_kwh`]:prop(.364,{unit:'kWh'}),
 [`${aid}:charger.lifetime_energy_kwh`]:prop(209.599,{unit:'kWh'}),
 [`${aid}:charger.vendor`]:prop('Wallbox'),
 [`${aid}:charger.status`]:prop('Finishing',{access:'diagnostics_only'})
};
const slotStart={command_id:`${aid}:charger.command.start_charging`,command_key:'charger.command.start_charging'};
const slotStop={command_id:`${aid}:charger.command.stop_charging`,command_key:'charger.command.stop_charging'};
const slotUnlock={command_id:`${aid}:charger.command.unlock_connector`,command_key:'charger.command.unlock_connector'};
const slotRestart={command_id:`${aid}:charger.command.restart`,command_key:'charger.command.restart'};
const commandRow=(slot, allowed=true)=>({asset_id:aid,command_id:slot.command_id,command_key:slot.command_key,frontend_allowed:true,execution_allowed:allowed,blocked_reason:allowed?'':'already_stopped',invoke:{service:'script.mobility_execute_command',target:{},data:{command_id:slot.command_id}}});
const hass={states:{
 'sensor.mobility_charger_property_index':{state:'ready',attributes:{properties_by_key:propertiesByKey}},
 'sensor.mobility_charger_component_contract_index':{state:'ready',attributes:{ux_cards_json:cards,ux_fields_by_property_json:fields,command_index_entity:'sensor.mobility_command_index'}},
 'sensor.mobility_charger_command_slot_index':{state:'ready',attributes:{slots_by_asset_json:JSON.stringify({[aid]:{asset_id:aid,charger_actions:{commands:[slotStart,slotStop]},card_sections:{'charger_actions.commands':[slotStart,slotStop,slotUnlock,slotRestart]}}})}},
 'sensor.mobility_command_index':{state:'ready',attributes:{commands_by_id:{[slotStart.command_id]:commandRow(slotStart),[slotStop.command_id]:commandRow(slotStop,false),[slotUnlock.command_id]:commandRow(slotUnlock),[slotRestart.command_id]:commandRow(slotRestart)}}},
 'sensor.mobility_relationship_index':{state:'ready',attributes:{relationships:[]}},
 'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[{asset_id:aid,asset_type:'charger',display_name:'Driveway Right Charger'}]}}
}};
const rt=new Runtime(hass,{});
const snapshot=rt.chargerProductSnapshot(aid);
if(snapshot.operating.display!=='Stopped') throw new Error('operating_state not materialized from keyed property map');
if(snapshot.connection.display!=='Connected') throw new Error('connection_state not materialized');
if(snapshot.power.display!=='0 kW') throw new Error(`power not materialized: ${snapshot.power.display}`);
if(snapshot.health.display!=='Ok' && snapshot.health.display!=='OK') throw new Error(`health not materialized: ${snapshot.health.display}`);
const profileRow=rt.propertyByCompoundKey(aid,'asset.profile_id');
if(rt.uxEditorControlKind(profileRow)!=='select') throw new Error('backend profile choices did not produce select editor');
const profileEditor=rt.propertyEditorRow(profileRow);
if(profileEditor.choices.length!==2 || profileEditor.choices[0].value!=='wallbox_ocpp') throw new Error('backend profile choices were not preserved');
const sections=rt.chargerComponentDetailSections(aid);
for(const title of ['Charger','Control','Metering','Engineering']) if(!sections.some(s=>s.title===title)) throw new Error(`missing component ${title}`);
const metering=sections.find(s=>s.title==='Metering');
const meteringText=JSON.stringify(metering);
for(const text of ['Power','Session energy','Lifetime energy']) if(!meteringText.includes(text)) throw new Error(`metering missing ${text}`);
const engineering=sections.find(s=>s.title==='Engineering');
if(!JSON.stringify(engineering).includes('Wallbox')) throw new Error('explicit Engineering/Unmapped did not retain unplaced product data');
const commands=rt.commandsForSurface(aid,'quick_actions');
const keys=commands.map(c=>c.command_key);
for(const key of ['charger.command.start_charging','charger.command.stop_charging','charger.command.unlock_connector','charger.command.restart']) if(!keys.includes(key)) throw new Error(`missing command ${key}`);
const stop=commands.find(c=>c.command_key==='charger.command.stop_charging');
if(stop.execution_allowed!==false) throw new Error('command readiness not taken from command index');
console.log('PASS backend-owned profile choices render as select metadata');
console.log('PASS charger canonical keyed-map materialization');
console.log('PASS charger component contract-driven details + explicit Unmapped retention');
console.log('PASS merged charger action container: Start/Stop/Unlock/Restart');
console.log('PASS command readiness remains Command Index owned');
