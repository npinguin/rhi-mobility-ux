import vm from 'node:vm';
import fs from 'node:fs';
import { mobilityRuntimeSource } from '../helpers/source-fixtures.mjs';

const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const vehicleAdapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');

function propertyState(entityId, assetId, propertyKey, value, extra={}){
  return [entityId,{
    entity_id:entityId,
    state:value===null ? 'unknown' : String(value),
    attributes:{
      canonical_contract:'MOBILITY_PUBLIC_RUNTIME_V2',
      asset_id:assetId,
      property_key:propertyKey,
      value,
      ...extra
    }
  }];
}

function runtimeState(assets=[]){
  return {
    state:'OK',
    attributes:{
      contract_id:'MOBILITY_PUBLIC_RUNTIME_V2',
      canonical:true,
      assets,
      relationships:[],
      vehicle_charger_relationships:[],
      release:{backend_release:'M0.test'}
    }
  };
}

const charger='charger_profile_test';
const chargerStates=Object.fromEntries([
  ['sensor.rhi_mobility_runtime_v2',runtimeState([{asset_id:charger,asset_type:'charger',display_name:'Profile test charger'}])],
  propertyState('sensor.rhi_mobility_test_charger_profile',charger,'asset.profile_id',null,{
    asset_type:'charger',
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
  }),
  propertyState('sensor.rhi_mobility_test_charger_requested_power',charger,'charger.requested_power_kw',null,{
    asset_type:'charger',
    editable:false,
    write_supported:false,
    write_binding_type:'number',
    write_blocked_reason:'requested_power_capability_unavailable'
  })
]);
const rt=new Runtime({states:chargerStates},{});
const profile=rt.propertyByCompoundKey(charger,'asset.profile_id');
if(!profile) throw new Error('unset asset.profile_id must remain published/renderable through V2');
if(!rt.isWritableProperty(profile)) throw new Error('profile selector must use V2 write metadata and remain writable while unset');
const editor=rt.propertyEditorRow(profile);
if(editor.editor!=='select') throw new Error(`expected select editor, got ${editor.editor}`);
if(editor.editor_value!=='__none__') throw new Error(`unset profile must select backend none token, got ${editor.editor_value}`);
if(editor.choices.length!==1 || editor.choices[0].value!=='wallbox_ocpp') throw new Error('profile choices must come from V2 published choices');

const runtimeControl=rt.propertyByCompoundKey(charger,'charger.requested_power_kw');
if(rt.isWritableProperty(runtimeControl)) throw new Error('runtime requested power must fail closed without V2 write capability');
if(rt.propertyEditorRow(runtimeControl).disabled_reason!=='requested_power_capability_unavailable') throw new Error('backend-owned control blocked reason was not surfaced');

const inferred={asset_id:charger,property_key:'charger.power_kw',editable:true,write_supported:true,write_service_domain:'number',write_service_action:'set_value',write_target_entity:'number.fake',unit:'kW'};
if(rt.isWritableProperty(inferred)) throw new Error('UX must not infer editor type from property name/unit without V2 write_binding_type');

const vehicle='vehicle_profile_test';
const vehicleStates=Object.fromEntries([
  ['sensor.rhi_mobility_runtime_v2',runtimeState([
    {asset_id:vehicle,asset_type:'vehicle',display_name:'Profile test vehicle'},
    {asset_id:'charger_a',asset_type:'charger',display_name:'Driveway charger'}
  ])],
  propertyState('sensor.rhi_mobility_test_vehicle_profile',vehicle,'asset.profile_id',null,{
    asset_type:'vehicle',editable:true,write_supported:true,write_binding_type:'select',
    write_service_domain:'select',write_service_action:'select_option',
    write_target_entity:'select.rhi_mobility_vehicle_profile',
    options:['__none__','audi_q8_phev'],choices:[{value:'audi_q8_phev',label:'Audi Q8 PHEV'}],
    allow_none:true,none_value:'__none__'
  }),
  propertyState('sensor.rhi_mobility_test_selected_charger',vehicle,'vehicle.selected_charger',null,{
    asset_type:'vehicle',editable:true,write_supported:true,write_binding_type:'select',
    write_service_domain:'select',write_service_action:'select_option',
    write_target_entity:'select.rhi_mobility_vehicle_selected_charger',
    options:['__none__','charger_a'],choices:[{value:'charger_a',label:'Driveway charger'}],
    allow_none:true,none_value:'__none__'
  }),
  propertyState('sensor.rhi_mobility_test_vehicle_requested_power',vehicle,'vehicle.requested_charge_power_kw',null,{
    asset_type:'vehicle',editable:false,write_supported:false,write_binding_type:'number'
  })
]);

const vrt=new Runtime({states:vehicleStates},{});
for(const key of ['asset.profile_id','vehicle.selected_charger']) {
  const prop=vrt.propertyByCompoundKey(vehicle,key);
  if(!prop) throw new Error(`unset vehicle V2 configuration property missing: ${key}`);
  if(!vrt.isWritableProperty(prop)) throw new Error(`unset vehicle V2 configuration property not writable: ${key}`);
  const row=vrt.propertyEditorRow(prop);
  if(row.editor!=='select') throw new Error(`vehicle configuration editor must be select for ${key}`);
  if(row.editor_value!=='__none__') throw new Error(`unset vehicle configuration must use backend none token for ${key}`);
  if(!row.choices.length) throw new Error(`vehicle configuration choices missing for ${key}`);
}
if(!vehicleAdapter.includes('rhiMobilityT(this.rt?.hass,"vehicle.no_charger"') || !vehicleAdapter.includes('allow_none:allowNone')) throw new Error('shared vehicle adapter must model backend-owned no-charger semantics once with localized presentation');
if(!dashboard.includes('adapter.chargerAssignmentModel()')) throw new Error('Overview/vehicle surfaces must consume the shared charger-assignment model');

const vehicleRuntimeControl=vrt.propertyByCompoundKey(vehicle,'vehicle.requested_charge_power_kw');
if(vrt.isWritableProperty(vehicleRuntimeControl)) throw new Error('vehicle requested power must fail closed without V2 write capability');

console.log('PASS V2 vehicle/charger configuration editables preserve unset values and fail closed without write capability');
