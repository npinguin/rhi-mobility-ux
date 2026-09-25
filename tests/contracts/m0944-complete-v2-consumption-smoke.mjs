import vm from 'node:vm';
import { mobilityRuntimeSource } from '../helpers/source-fixtures.mjs';

const ctx={console,globalThis:{}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(mobilityRuntimeSource()+'\n;globalThis.HomeBrainAssetRuntime=HomeBrainAssetRuntime;',ctx);
const Runtime=ctx.HomeBrainAssetRuntime;

const v2Asset={
  asset_id:'vehicle_v2',
  concept_id:'vehicle',
  display_name:'Canonical V2 vehicle',
  property_publication:{
    expected_property_keys:['vehicle.soc_pct','vehicle.image_key'],
    catalog_property_keys:['vehicle.soc_pct','vehicle.image_key','vehicle.range_km'],
    authority:'MOBILITY_PUBLIC_RUNTIME_V2',
    v1_fallback_allowed:false
  }
};
const v2Charger={asset_id:'charger_v2',concept_id:'charger',display_name:'Canonical V2 charger'};
const relationship={source_asset_id:'vehicle_v2',target_asset_id:'charger_v2',relationship_type:'vehicle_effective_charger'};
const profile={profile_id:'vehicle.v2',asset_type:'vehicle',identity:{brand:'V2',model:'Canonical'}};
const activity={asset_id:'vehicle_v2',activity_type:'charging',activity_state:'active'};
const states={
  'sensor.rhi_mobility_runtime_v2':{state:'ready',attributes:{
    contract_id:'MOBILITY_PUBLIC_RUNTIME_V2',canonical:true,assets:[v2Asset,v2Charger],relationships:[relationship],
    fleet:{active_vehicle_count:1,active_charger_count:1},vehicle_charger_relationships:[]
  }},
  'sensor.rhi_mobility_activity_v2':{state:'ready',attributes:{contract_id:'MOBILITY_ACTIVITY_V2',publisher:'rhi_mobility',activities:[activity]}},
  'sensor.rhi_mobility_profile_catalog_v2':{state:'ready',attributes:{contract_id:'MOBILITY_PROFILE_CATALOG_V2',publisher:'rhi_mobility',profiles:[profile]}},
  'sensor.rhi_mobility_supervision_v2':{state:'ready',attributes:{
    contract_id:'MOBILITY_SUPERVISION_V2',publisher:'rhi_mobility',
    status:{available:true,value:'ready'},system_trust:{available:true,value:'trusted'},
    attention:{available:true,value:'none',reasons:[]},current_activity:{available:true,activity}
  }},
  'sensor.rhi_mobility_energy_v2':{state:'ready',attributes:{
    contract_id:'MOBILITY_ENERGY_V2',publisher:'rhi_mobility',command_provider_id:'mobility.command.v2',
    consumer_assets:[{asset_id:'vehicle_v2',soc_pct:51}],connection_assets:[{asset_id:'charger_v2',power_kw:0}]
  }},
  'sensor.rhi_mobility_vehicle_v2_soc_pct':{entity_id:'sensor.rhi_mobility_vehicle_v2_soc_pct',state:'51',attributes:{
    canonical_contract:'MOBILITY_PUBLIC_RUNTIME_V2',asset_id:'vehicle_v2',asset_type:'vehicle',property_key:'vehicle.soc_pct',unit:'%'
  }},
  'sensor.rhi_mobility_vehicle_v2_range_total_km':{entity_id:'sensor.rhi_mobility_vehicle_v2_range_total_km',state:'372',attributes:{
    canonical_contract:'MOBILITY_PUBLIC_RUNTIME_V2',asset_id:'vehicle_v2',asset_type:'vehicle',property_key:'vehicle.range_total_km',unit:'km'
  }},
  'sensor.rhi_mobility_vehicle_v2_ev_range_km':{entity_id:'sensor.rhi_mobility_vehicle_v2_ev_range_km',state:'70',attributes:{
    canonical_contract:'MOBILITY_PUBLIC_RUNTIME_V2',asset_id:'vehicle_v2',asset_type:'vehicle',property_key:'vehicle.ev_range_km',unit:'km'
  }},
  // Deliberately conflicting V1-shaped data. None of it may win while Runtime V2 exists.
  'sensor.mobility_asset_index':{state:'ready',attributes:{assets_json:[{asset_id:'vehicle_legacy',asset_type:'vehicle'}]}},
  'sensor.mobility_vehicle_profile_index':{state:'ready',attributes:{profiles:[{profile_id:'vehicle.legacy',asset_type:'vehicle'}]}},
  'sensor.mobility_activity_index':{state:'ready',attributes:{activities:[{asset_id:'vehicle_legacy',activity_type:'legacy'}]}},
  'sensor.mobility_relationship_index':{state:'ready',attributes:{relationships:[{source_asset_id:'vehicle_legacy',target_asset_id:'charger_legacy'}]}},
  'sensor.mobility_energy_asset_publication':{state:'ready',attributes:{assets:[{asset_id:'vehicle_legacy'}]}},
  'sensor.mobility_vehicle_property_index':{state:'ready',attributes:{properties_by_key:{
    'vehicle_v2:vehicle.soc_pct':{asset_id:'vehicle_v2',property_key:'vehicle.soc_pct',value:99},
    'vehicle_v2:vehicle.image_key':{asset_id:'vehicle_v2',property_key:'vehicle.image_key',value:'legacy-image'}
  }}},
  'sensor.mobility_command_index':{state:'ready',attributes:{commands:[{asset_id:'vehicle_v2',command_key:'vehicle.command.legacy'}]}}
};

const rt=new Runtime({states},{});

const assets=rt.assetIndexRows('all');
if(assets.length!==2 || assets[0].asset_id!=='vehicle_v2') throw new Error('Runtime V2 assets are not primary');
if(rt.assetIndexRows('vehicle').map((row)=>row.asset_id).join(',')!=='vehicle_v2') throw new Error('concept_id vehicle was lost during Runtime V2 normalization');
if(rt.assetIndexRows('charger').map((row)=>row.asset_id).join(',')!=='charger_v2') throw new Error('concept_id charger was lost during Runtime V2 normalization');
const profiles=rt.profileRows();
if(profiles.length!==1 || profiles[0].profile_id!=='vehicle.v2') throw new Error('Profile Catalog V2 is not primary');
const activities=rt.activityRowsFor('vehicle_v2');
if(activities.length!==1 || activities[0].activity_type!=='charging') throw new Error('Activity V2 is not primary');
const relationships=rt.relationshipRows('vehicle_v2');
if(relationships.length!==1 || relationships[0].target_asset_id!=='charger_v2') throw new Error('Runtime V2 relationships are not primary');
const energy=rt.energyAssetPublicationRows('');
if(energy.length!==2 || energy.some((row)=>row.asset_id==='vehicle_legacy')) throw new Error('Energy V2 external boundary is not primary');
if(rt.supervisorOutcome('mobility','status','missing')!=='ready') throw new Error('Supervision V2 status is not primary');
if(rt.supervisorOutcome('mobility','system_trust','missing')!=='trusted') throw new Error('Supervision V2 trust is not primary');

const soc=rt.propertyRows('vehicle_v2').find((row)=>row.property_key==='vehicle.soc_pct');
if(String(soc?.value)!=='51') throw new Error('canonical V2 property did not beat conflicting V1 value');
if(rt.propertyRows('vehicle_v2').some((row)=>row.property_key==='vehicle.image_key')) throw new Error('missing V2 property was silently filled from V1');

const gap=rt.propertyPublicationGap('vehicle_v2');
if(gap.status!=='incomplete' || gap.missing.length!==1 || gap.missing[0]!=='vehicle.image_key') throw new Error('property publication completeness evidence not enforced');

const summaryFacts=rt.vehicleOverviewMetricSlots('vehicle_v2');
if(summaryFacts.length!==3) throw new Error('Vehicle summary fact shape changed');
if(summaryFacts[0].resolved!==true || summaryFacts[0].display!=='372 km') throw new Error('Full range did not use canonical V2 display shape');
if(summaryFacts[1].resolved!==true || summaryFacts[1].display!=='70 km') throw new Error('EV range did not use canonical V2 display shape');
if(summaryFacts[2].resolved!==true || summaryFacts[2].display!=='51 %') throw new Error('Battery did not use canonical V2 display shape');

if(rt.publicCommandRows().length!==0) throw new Error('V1 command fallback remained active while Runtime V2 exists');
if(rt.propertyPublicationEvidence('vehicle_v2')?.v1_fallback_allowed!==false) throw new Error('V1 fallback authority changed');

console.log('PASS M0.9.45 Runtime V2 asset contract and zero V1 authority fallback');
