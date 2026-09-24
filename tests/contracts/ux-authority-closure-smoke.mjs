import vm from 'node:vm';
import { mobilityRuntimeSource, sourceModule } from '../helpers/source-fixtures.mjs';

const dashboard = sourceModule('ui/screens/mobility-dashboard.js');
const adapterSource = sourceModule('domain/adapters/vehicle-adapter.js');

const ctx={console,globalThis:{},setTimeout,clearTimeout};
ctx.globalThis=ctx;
vm.createContext(ctx);
vm.runInContext(
  mobilityRuntimeSource()
  +'\n'+adapterSource
  +'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;globalThis.HomeBrainVehicleAdapter=HomeBrainVehicleAdapter;'
  +'globalThis.rhiMobilityParseChargerVisualKey=rhiMobilityParseChargerVisualKey;',
  ctx
);
const Runtime=ctx.HomeBrainAssetRuntime;
const VehicleAdapter=ctx.HomeBrainVehicleAdapter;

// 1) Charger V2 appearance must outrank legacy instance aliases.
const parsedCharger=ctx.rhiMobilityParseChargerVisualKey('peblar.business.socket.factory','charger_driveway_right');
if(parsedCharger?.charger?.id!=='peblar.business.socket') {
  throw new Error('persisted V2 charger.image_key was overridden by legacy charger instance alias');
}

// 2) Vehicle profile identity must outrank a stale cross-model appearance key.
const vehicleId='vehicle_test';
const v2State=(entity_id,state,property_key,extra={})=>({
  entity_id,state,
  attributes:{
    canonical_contract:'MOBILITY_PUBLIC_RUNTIME_V2',
    asset_id:vehicleId,
    asset_type:'vehicle',
    property_key,
    component_id:'identity',
    section_id:'overview',
    visibility:'product',
    ...extra
  }
});
const hass={
  states:{
    'sensor.rhi_mobility_vehicle_test_profile':v2State('sensor.rhi_mobility_vehicle_test_profile','volkswagen_id4_pro_my2026','asset.profile_id'),
    'sensor.rhi_mobility_vehicle_test_image':v2State('sensor.rhi_mobility_vehicle_test_image','renault.scenic.e-tech.2024-2026.techno.flame-red','vehicle.image_key')
  },
  callService:async()=>{}
};
const rt=new Runtime(hass,{});
const adapter=new VehicleAdapter(rt,'test',{
  registry_entry:{
    asset_id:vehicleId,
    asset_type:'vehicle',
    display_name:'Test vehicle',
    profile_id:'volkswagen_id4_pro_my2026',
    lifecycle_state:'Active'
  }
});
const model=adapter.build();
if(!String(model.image||'').includes('vehicle_vw_id4.webp')) {
  throw new Error(`stale cross-model image_key overrode VW profile identity: ${model.image}`);
}
if(String(model.image||'').includes('renault')) throw new Error('Renault artwork rendered for VW profile');
if(String(model.imageFilter||'')!=='none') throw new Error('stale cross-model colour filter leaked across profile family');

// 3) Overview row semantics must be Experience V2 only.
const start=dashboard.indexOf('  overviewVehicleSignals(rt, assetId) {');
const end=dashboard.indexOf('\n  renderOverviewVehicleRow(',start);
if(start<0||end<0) throw new Error('overviewVehicleSignals function not found');
const overviewSignals=dashboard.slice(start,end);
if(!overviewSignals.includes('rt.vehicleExperienceV2(assetId)')) throw new Error('Overview signals do not consume Experience V2');
if(overviewSignals.includes('vehicleIntelligenceStatusTiles')) throw new Error('Overview signals still consume legacy vehicle intelligence');
for(const key of ['range_intelligence','energy_intelligence','security_intelligence','maintenance_intelligence']) {
  if(!overviewSignals.includes(key)) throw new Error(`Overview Experience V2 signal missing: ${key}`);
}

// 4) Service acceptance is not success until canonical readback confirms semantic truth.
const writeId='vehicle_write';
const writeEntity='sensor.rhi_mobility_vehicle_write_name';
const writeHass={
  states:{
    [writeEntity]:{
      entity_id:writeEntity,
      state:'Before',
      attributes:{
        canonical_contract:'MOBILITY_PUBLIC_RUNTIME_V2',
        asset_id:writeId,
        asset_type:'vehicle',
        property_key:'asset.display_name',
        component_id:'identity',
        section_id:'overview',
        visibility:'product',
        editable:true,
        write_supported:true,
        write_binding_type:'text',
        write_service_domain:'input_text',
        write_service_action:'set_value',
        write_target_entity:'input_text.vehicle_name'
      }
    }
  },
  callService:async(_domain,_action,payload)=>{
    writeHass.states[writeEntity].state=String(payload.value);
  }
};
const writeRt=new Runtime(writeHass,{});
const confirmed=await writeRt.writePublishedPropertyAsync(writeId,'asset.display_name','After',{attempts:2,delay_ms:1});
if(!confirmed) throw new Error('canonical readback-confirmed write did not succeed');

writeHass.callService=async()=>{}; // accepted transport, no canonical state change
const rejected=await writeRt.writePublishedPropertyAsync(writeId,'asset.display_name','Never confirmed',{attempts:2,delay_ms:1});
if(rejected) throw new Error('service acceptance without canonical readback was treated as durable success');

console.log('PASS Experience V2 is the Overview semantic authority');
console.log('PASS vehicle profile family rejects stale cross-model artwork');
console.log('PASS persisted charger V2 appearance outranks legacy instance aliases');
console.log('PASS UX writes require canonical readback, not service acceptance');
