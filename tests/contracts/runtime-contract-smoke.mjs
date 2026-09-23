import vm from 'node:vm';
import { mobilityRuntimeSource } from '../helpers/source-fixtures.mjs';
const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
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


const v2Hass={states:{
  'sensor.rhi_mobility_runtime_v2':{state:'ready',attributes:{
    contract_id:'MOBILITY_PUBLIC_RUNTIME_V2',
    canonical:true,
    fleet:{
      active_vehicle_count:5,
      active_charger_count:4,
      available_charger_count:2,
      connected_charger_count:2,
      charging_charger_count:0,
      aggregate_actual_charging_power_kw:0,
      aggregate_power_state:'complete',
      power_known_charger_count:4,
      power_unknown_charger_count:0
    },
    vehicle_charger_relationships:[
      {vehicle_id:'vehicle_id4',configured_charger_id:'charger_peb',effective_charger_id:'charger_peb',physically_connected_charger_id:null,observed_identity_proven:false,relationship_status:'CONFIGURED',reason:'configured_only'}
    ],
    ux_inference_forbidden:true
  }},
  'sensor.rhi_mobility_experience_v2':{state:'ready',attributes:{
    contract_id:'MOBILITY_EXPERIENCE_V2',
    policy_revision:7,
    fleet:{active_vehicle_count:5,active_charger_count:4},
    vehicles:[{
      asset_id:'vehicle_id4',
      display_name:'ID4',
      configuration_status:{state:'complete',profile_id:'vehicle.vw.id4'},
      runtime_data_health:{state:'healthy',reasons:[]},
      charge_demand:{state:'satisfied',energy_needed_kwh:0,target_soc_pct:80,ready_by:null,reason:'minimum_demand_kwh:0.5'},
      charging_relationship:{vehicle_id:'vehicle_id4',configured_charger_id:'charger_peb',effective_charger_id:'charger_peb',physically_connected_charger_id:null,observed_identity_proven:false},
      range_intelligence:{state:'ok',summary:'387 km total',reason:'Low-range threshold 100 km',threshold_km:100},
      security_intelligence:{state:'secure',summary:'Secure',reason:'Required security coverage confirms the vehicle is secured'},
      maintenance_intelligence:{state:'scheduled',summary:'Inspection in 292 d',reason:'Inspection in 292 d'},
      comfort_intelligence:{state:'off',summary:'Off',reason:'off'}
    }],
    chargers:[{
      asset_id:'charger_peb',
      display_name:'PEB',
      configuration_status:{state:'complete',profile_id:'charger.peblar'},
      runtime_data_health:{state:'healthy',reasons:[]},
      fault:{state:'none',code:null,reason:null},
      availability_intelligence:{state:'ok',summary:'Available'},
      connection_intelligence:{state:'asset_connected',summary:'Asset Connected'},
      charging_intelligence:{state:'idle',summary:'Idle',reason:'0.00 kW actual'},
      power_intelligence:{state:'ok',summary:'0.00 kW actual',reason:'No requested power configured'},
      vehicle_intelligence:{state:'assigned',summary:'Vehicle vehicle_id4',connected_vehicle_asset_id:'vehicle_id4',connected_vehicle_display_name:'ID4'}
    }]
  }},
  'sensor.rhi_mobility_policy_v2':{state:'7',attributes:{
    contract_id:'MOBILITY_POLICY_V2',
    publisher:'rhi_mobility',
    revision:7,
    policy:{
      range:{low_range_km:100},
      maintenance:{due_soon_days:90},
      security:{required_coverage:['lock','doors','windows']},
      charging:{minimum_demand_kwh:0.5}
    }
  }},
  'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[
    {asset_id:'vehicle_id4',asset_type:'vehicle',display_name:'ID4'},
    {asset_id:'charger_peb',asset_type:'charger',display_name:'PEB'}
  ]}}
},callService:(domain,service,data)=>{v2Hass.lastCall={domain,service,data};}};
const v2rt=new Runtime(v2Hass,{});
if(v2rt.mobilityRuntimeV2()?.fleet?.connected_charger_count!==2) throw new Error('Runtime V2 fleet contract not consumed');
if(v2rt.vehicleExperienceV2('vehicle_id4')?.security_intelligence?.state!=='secure') throw new Error('Experience V2 vehicle contract not consumed');
if(v2rt.chargerExperienceV2('charger_peb')?.fault?.state!=='none') throw new Error('Experience V2 charger contract not consumed');
if(v2rt.mobilityPolicyV2()?.policy?.maintenance?.due_soon_days!==90) throw new Error('Policy V2 contract not consumed');
if(v2rt.vehicleRelationshipV2('vehicle_id4')?.observed_identity_proven!==false) throw new Error('Runtime V2 relationship identity proof not preserved');
if(!v2rt.setMobilityPolicy('range.low_range_km','120')) throw new Error('Policy V2 write boundary unavailable');
if(v2Hass.lastCall?.domain!=='rhi_mobility' || v2Hass.lastCall?.service!=='set_policy' || v2Hass.lastCall?.data?.policy_key!=='range.low_range_km') throw new Error('Policy V2 write must use rhi_mobility.set_policy');
console.log('PASS Mobility Runtime/Experience/Policy V2 direct contract consumption');


const v2PropertyCalls=[];
const v2PropertyHass={states:{
  'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[{asset_id:'vehicle_id4',asset_type:'vehicle',display_name:'ID.4'}]}},
  'sensor.rhi_mobility_vehicle_id4_image_key':{
    entity_id:'sensor.rhi_mobility_vehicle_id4_image_key',
    state:'volkswagen.id4.2024-2026.ev.scale-silver',
    attributes:{
      canonical_contract:'MOBILITY_PUBLIC_RUNTIME_V2',
      asset_id:'vehicle_id4',
      asset_type:'vehicle',
      property_key:'vehicle.image_key',
      editable:true,
      write_supported:true,
      write_binding_type:'text',
      write_service_domain:'text',
      write_service_action:'set_value',
      write_target_entity:'text.rhi_mobility_vehicle_id4_vehicle_image_key'
    }
  },
  'sensor.rhi_mobility_vehicle_id4_profile_id':{
    entity_id:'sensor.rhi_mobility_vehicle_id4_profile_id',
    state:'volkswagen_id4_pro_my2026',
    attributes:{
      canonical_contract:'MOBILITY_PUBLIC_RUNTIME_V2',
      asset_id:'vehicle_id4',
      asset_type:'vehicle',
      property_key:'asset.profile_id',
      editable:true,
      write_supported:true,
      write_binding_type:'select',
      write_service_domain:'select',
      write_service_action:'select_option',
      write_target_entity:'select.rhi_mobility_vehicle_id4_asset_profile_id',
      choices:[{value:'volkswagen_id4_pro_my2026',label:'Volkswagen ID.4 Pro',brand:'Volkswagen',model:'ID.4',variant:'Pro',model_year:2026}]
    }
  }
},callService:(domain,service,data)=>v2PropertyCalls.push({domain,service,data})};
const v2PropertyRt=new Runtime(v2PropertyHass,{});
const imageProp=v2PropertyRt.semanticProperty('vehicle_id4','vehicle.image_key');
if(!imageProp || imageProp._source_entity_id!=='sensor.rhi_mobility_vehicle_id4_image_key') throw new Error('canonical V2 semantic image property not resolved directly');
if(!v2PropertyRt.isWritableProperty(imageProp)) throw new Error('canonical V2 image property write capability not consumed');
const profileProp=v2PropertyRt.semanticProperty('vehicle_id4','asset.profile_id');
if(!profileProp || !v2PropertyRt.isWritableProperty(profileProp)) throw new Error('canonical V2 profile property write capability not consumed');
if(v2PropertyRt.propertyEditorChoices(profileProp)?.[0]?.brand!=='Volkswagen') throw new Error('structured V2 profile identity choices not preserved');
if(!v2PropertyRt.writePublishedProperty('vehicle_id4','vehicle.image_key','volkswagen.id4.2024-2026.ev.glacier-white')) throw new Error('V2 image write dispatch failed');
if(v2PropertyCalls.at(-1)?.domain!=='text' || v2PropertyCalls.at(-1)?.service!=='set_value' || v2PropertyCalls.at(-1)?.data?.entity_id!=='text.rhi_mobility_vehicle_id4_vehicle_image_key' || v2PropertyCalls.at(-1)?.data?.value!=='volkswagen.id4.2024-2026.ev.glacier-white') throw new Error('V2 semantic image write used wrong transport');
console.log('PASS canonical per-asset V2 semantic property read/write consumption');
