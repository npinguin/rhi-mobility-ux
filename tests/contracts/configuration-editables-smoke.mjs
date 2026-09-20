import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../../',import.meta.url);
const asset=fs.readFileSync(new URL('src/assets/asset-paths.js',root),'utf8');
const runtime=fs.readFileSync(new URL('src/runtime/10-ha-contract-runtime.js',root),'utf8');
const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(asset+'\n'+runtime+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
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

console.log('PASS V1 configuration editables render unset values from backend write metadata and runtime controls fail closed');
