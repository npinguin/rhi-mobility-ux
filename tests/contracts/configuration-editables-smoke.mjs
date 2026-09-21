import vm from 'node:vm';
import { mobilityRuntimeSource } from '../helpers/source-fixtures.mjs';

const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;

const charger='charger_profile_test';
const hass={states:{
  'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[{asset_id:charger,asset_type:'charger',display_name:'Profile test charger'}]}},
  'sensor.mobility_charger_property_index':{state:'ready',attributes:{properties_by_key:{
    [`${charger}:asset.profile_id`]:{
      asset_id:charger,
      property_key:'asset.profile_id',
      value:null,
      editable:true,
      write_supported:true,
      write_binding_type:'select',
      write_service_domain:'select',
      write_service_action:'select_option',
      write_target_entity:'select.rhi_mobility_charger_profile',
      options:['__none__','wallbox_ocpp'],
      choices:[{value:'wallbox_ocpp',label:'Wallbox OCPP charger'}],
      allow_none:true,
      none_value:'__none__'
    },
    [`${charger}:charger.requested_power_kw`]:{
      asset_id:charger,
      property_key:'charger.requested_power_kw',
      value:null,
      editable:false,
      write_supported:false,
      write_binding_type:'number',
      write_service_domain:'',
      write_service_action:'',
      write_target_entity:''
    }
  }}}
}};

const rt=new Runtime(hass,{});
const profile=rt.propertyByCompoundKey(charger,'asset.profile_id');
if(!profile) throw new Error('unset asset.profile_id must remain published/renderable');
if(!rt.isWritableProperty(profile)) throw new Error('profile selector must use V1 write metadata and remain writable while unset');
const editor=rt.propertyEditorRow(profile);
if(editor.editor!=='select') throw new Error(`expected select editor, got ${editor.editor}`);
if(editor.editor_value!=='__none__') throw new Error(`unset profile must select backend none token, got ${editor.editor_value}`);
if(editor.choices.length!==1 || editor.choices[0].value!=='wallbox_ocpp') throw new Error('profile choices must come from V1 published choices');

const runtimeControl=rt.propertyByCompoundKey(charger,'charger.requested_power_kw');
if(rt.isWritableProperty(runtimeControl)) throw new Error('runtime requested power must fail closed without V1 write capability');

const inferred={asset_id:charger,property_key:'charger.power_kw',editable:true,write_supported:true,write_service_domain:'number',write_service_action:'set_value',write_target_entity:'number.fake',unit:'kW'};
if(rt.isWritableProperty(inferred)) throw new Error('UX must not infer editor type from property name/unit without V1 write_binding_type');


const vehicle='vehicle_profile_test';
const vehicleHass={states:{
  'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[
    {asset_id:vehicle,asset_type:'vehicle',display_name:'Profile test vehicle'},
    {asset_id:'charger_a',asset_type:'charger',display_name:'Driveway charger'}
  ]}},
  'sensor.mobility_vehicle_property_index':{state:'ready',attributes:{properties_by_key:{
    [`${vehicle}:asset.profile_id`]:{
      asset_id:vehicle,
      property_key:'asset.profile_id',
      value:null,
      editable:true,
      write_supported:true,
      write_binding_type:'select',
      write_service_domain:'select',
      write_service_action:'select_option',
      write_target_entity:'select.rhi_mobility_vehicle_profile',
      options:['__none__','audi_q8_phev'],
      choices:[{value:'audi_q8_phev',label:'Audi Q8 PHEV'}],
      allow_none:true,
      none_value:'__none__'
    },
    [`${vehicle}:vehicle.selected_charger`]:{
      asset_id:vehicle,
      property_key:'vehicle.selected_charger',
      value:null,
      editable:true,
      write_supported:true,
      write_binding_type:'select',
      write_service_domain:'select',
      write_service_action:'select_option',
      write_target_entity:'select.rhi_mobility_vehicle_selected_charger',
      options:['__none__','charger_a'],
      choices:[{value:'charger_a',label:'Driveway charger'}],
      allow_none:true,
      none_value:'__none__'
    },
    [`${vehicle}:vehicle.requested_charge_power_kw`]:{
      asset_id:vehicle,
      property_key:'vehicle.requested_charge_power_kw',
      value:null,
      editable:false,
      write_supported:false,
      write_binding_type:'number'
    }
  }}},
  'sensor.mobility_relationship_index':{state:'ready',attributes:{relationships:[]}}
}};

const vrt=new Runtime(vehicleHass,{});
for(const key of ['asset.profile_id','vehicle.selected_charger']) {
  const prop=vrt.propertyByCompoundKey(vehicle,key);
  if(!prop) throw new Error(`unset vehicle configuration property missing: ${key}`);
  if(!vrt.isWritableProperty(prop)) throw new Error(`unset vehicle configuration property not writable from V1 metadata: ${key}`);
  const row=vrt.propertyEditorRow(prop);
  if(row.editor!=='select') throw new Error(`vehicle configuration editor must be select for ${key}`);
  if(row.editor_value!=='__none__') throw new Error(`unset vehicle configuration must use backend none token for ${key}`);
  if(!row.choices.length) throw new Error(`vehicle configuration choices missing for ${key}`);
}
const vehicleRuntimeControl=vrt.propertyByCompoundKey(vehicle,'vehicle.requested_charge_power_kw');
if(vrt.isWritableProperty(vehicleRuntimeControl)) throw new Error('vehicle runtime requested power must fail closed without V1 write capability');
console.log('PASS vehicle profile and selected-charger configuration controls remain editable while unset');

console.log('PASS V1 configuration editables render unset values from backend write metadata and runtime controls fail closed');
