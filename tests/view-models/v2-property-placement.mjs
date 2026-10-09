import vm from 'node:vm';
import { mobilityRuntimeSource } from '../helpers/source-fixtures.mjs';

const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;

const aid='charger_v2';
const state=(entity_id,value,property_key,component_id,section_id,visibility='product',extra={})=>({
  entity_id,state:String(value),
  attributes:{
    canonical_contract:'MOBILITY_CANONICAL_PROPERTY_V2',
    asset_id:aid,asset_type:'charger',property_key,component_id,section_id,visibility,
    friendly_name:property_key.split('.').pop().replaceAll('_',' '),
    quality:'OK',...extra
  }
});

const hass={states:{
  'sensor.rhi_mobility_charger_v2_brand':state('sensor.rhi_mobility_charger_v2_brand','Peblar','charger.brand','identity','overview'),
  'sensor.rhi_mobility_charger_v2_model':state('sensor.rhi_mobility_charger_v2_model','Business','charger.model','identity','details'),
  'sensor.rhi_mobility_charger_v2_vendor':state('sensor.rhi_mobility_charger_v2_vendor','Prodrive','charger.vendor','identity','details'),
  'sensor.rhi_mobility_charger_v2_power':state('sensor.rhi_mobility_charger_v2_power','7.2','charger.power_kw','power','live','product',{unit:'kW'}),
  'sensor.rhi_mobility_charger_v2_engineering':state('sensor.rhi_mobility_charger_v2_engineering','ok','charger.source_health','engineering','diagnostics','engineering'),
  'sensor.rhi_mobility_charger_v2_unplaced':state('sensor.rhi_mobility_charger_v2_unplaced','x','charger.future_field','','','product'),
  // Aggregate/legacy duplicate must be ignored; canonical property truth is exclusive.
  'sensor.mobility_charger_property_index':{state:'ready',attributes:{properties_json:[{asset_id:aid,property_key:'charger.vendor',value:'STALE-V1',component_id:'charger_engineering',section_id:'unmapped'}]}}
}};
const rt=new Runtime(hass,{});

const props=rt.propertyRows(aid);
const vendor=props.find(p=>p.property_key==='charger.vendor');
if(!vendor || vendor.value!=='Prodrive') throw new Error('canonical Mobility property was not consumed');
if(props.some(p=>p.value==='STALE-V1')) throw new Error('non-canonical property projection leaked into canonical asset truth');

const sections=rt.chargerComponentDetailSections(aid);
const allRows=sections.flatMap(s=>s.rows||[]);
const rowText=JSON.stringify(allRows);
for(const expected of ['Peblar','Business','Prodrive','7.2']){
  if(!rowText.includes(expected)) throw new Error(`V2 product property missing from component layout: ${expected}`);
}
if(sections.some(s=>String(s.title||'').toLowerCase().includes('unmapped'))) throw new Error('UX invented Engineering/Unmapped for a V2 property');
const gap=sections.find(s=>s.key==='v2-layout-contract-gap');
if(!gap || !JSON.stringify(gap).includes('charger.future_field')) throw new Error('missing V2 placement did not fail visibly as contract gap');
const engineering=sections.find(s=>s.key==='v2-engineering');
if(!engineering || !JSON.stringify(engineering).includes('charger.source_health')) throw new Error('engineering V2 property not isolated from product layout');

const grouped=sections.filter(s=>s.key?.startsWith('v2-component-')).map(s=>s.key);
if(!grouped.includes('v2-component-identity') || !grouped.includes('v2-component-power')) throw new Error('component_id did not drive V2 component grouping');

console.log('PASS MOBILITY_CANONICAL_PROPERTY_V2 is the exclusive scalar property authority');
console.log('PASS component_id + section_id drive product placement without compatibility indexes');
console.log('PASS missing placement fails visibly instead of becoming Engineering/Unmapped');
console.log('PASS engineering visibility stays isolated from product UX');
