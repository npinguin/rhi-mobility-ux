import fs from 'node:fs';
import vm from 'node:vm';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');
const catalog=fs.readFileSync(new URL('../../src/app/asset-catalog.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');
const shell=fs.readFileSync(new URL('../../src/ui/components/asset-shell.js',import.meta.url),'utf8');
const picker=fs.readFileSync(new URL('../../src/ui/components/vehicle-visual-picker.js',import.meta.url),'utf8');
const chargerPicker=fs.readFileSync(new URL('../../src/ui/components/charger-visual-picker.js',import.meta.url),'utf8');
const chargerAdapter=fs.readFileSync(new URL('../../src/domain/adapters/charger-adapter.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');

for(const needle of [
  'data-vehicle-filter',
  'data-vehicle-sort',
  'Manage vehicles & profiles',
  '/config/integrations/integration/rhi_mobility',
  'manage-lifecycle',
  'vehicle.selected_charger',
  'vehicle.image_key',
  'new HomeBrainVehicleVisualPicker(rt).selection',
  'data-vehicle-visual-choice',
  'this._vehiclePickerDraft.delete(assetId)',
  'this._vehiclePickerDraft.set(assetId,{})',
  'No charger selected',
  'rc.56 compact Vehicles body'
]) if(!dashboard.includes(needle)) throw new Error('vehicle-management regression: missing '+needle);

for(const needle of [
  'class HomeBrainVehicleVisualPicker',
  'Choose vehicle & colour',
  'visual-choice-grid',
  'data-vehicle-picker-brand',
  'data-vehicle-picker-model',
  'data-vehicle-picker-variant',
  'data-vehicle-picker-color',
  'data-vehicle-picker-save',
  'data-vehicle-visual-choice',
  'rhiMobilitySelectableVehicleVisualCatalog()',
  'profileIdForVehicle',
  'this.rt.semanticProperty(assetId, "asset.profile_id")',
  'this.rt.semanticProperty(assetId, "vehicle.image_key")',
  'data-vehicle-profile-id',
  'Apply appearance'
]) if(!picker.includes(needle)) throw new Error('shared vehicle picker regression: missing '+needle);

if(picker.includes('Visual key')) throw new Error('technical visual key returned to normal Vehicle UX');
if(picker.includes('|| catalog[0]')) throw new Error('picker must not silently default unknown vehicles');

for(const needle of [
  'class HomeBrainChargerVisualPicker',
  'Choose charger appearance',
  'visual-choice-grid',
  'data-charger-picker-brand',
  'data-charger-picker-model',
  'data-charger-picker-variant',
  'data-charger-picker-appearance',
  'data-charger-picker-save',
  'data-charger-visual-choice',
  'Apply appearance'
]) if(!chargerPicker.includes(needle)) throw new Error('shared charger picker regression: missing '+needle);
if(chargerPicker.includes('Visual key')) throw new Error('technical visual key returned to normal Charger UX');

for(const needle of [
  'RHI_MOBILITY_VEHICLE_VISUALS',
  'audi.q8.4m.2024-2026.tfsi-e',
  'bmw.x1.u11.2025-2026.phev',
  'mercedes.gla.h247.2023-2026.phev',
  'renault.scenic.e-tech.2024-2026.techno',
  'volkswagen.id4.2024-2026.ev',
  'generic.guest.current.phev-1phase',
  'generic.guest.current.ev-3phase',
  'vehicles/vehicle_audi_q8.webp',
  'vehicles/vehicle_guest.webp'
]) if(!catalog.includes(needle)) throw new Error('vehicle visual catalog regression: missing '+needle);

for(const needle of [
  'RHI_MOBILITY_CHARGER_VISUALS',
  'wallbox.commander2',
  'peblar.business.socket',
  'fibaro.wall-plug-2.zwave-plus.be-fr',
  'charger_wallbox_white.webp',
  'charger_wallbox_black.webp',
  'charger_peblar.webp',
  'charger_utility_plug.webp'
]) if(!catalog.includes(needle)) throw new Error('charger visual catalog regression: missing '+needle);

if(!runtime.includes('rhiMobilityParseVehicleVisualKey')) throw new Error('runtime no longer resolves structured vehicle visual keys');
if(runtime.includes('profileImageCompatibilityKey')) throw new Error('legacy profile-name artwork inference returned');
if(!adapter.includes('const visualMatchesProfile = !profileVisual || visual?.vehicle?.id === profileVisual.id')) throw new Error('vehicle detail profile-family guard missing');
if(!chargerAdapter.includes('return packageFile || this.rt.visualImageUrl')) throw new Error('charger adapter no longer prefers package artwork');
if(!shell.includes('new HomeBrainVehicleVisualPicker(this.rt).render')) throw new Error('vehicle detail is not using shared picker');
if(!shell.includes('new HomeBrainChargerVisualPicker(this.rt).render')) throw new Error('charger detail is not using shared picker');

if(presentation.includes('MOBILITY / VEHICLE MANAGEMENT')) throw new Error('obsolete management eyebrow returned');
if(!presentation.includes('Check that your fleet is configured, assigned and operational')) throw new Error('Vehicles purpose drifted');
if(!presentation.includes('asset_key:"vehicles"')) throw new Error('Vehicles contextual hero key missing');

if ((dashboard.match(/Manage vehicles & profiles/g) || []).length !== 1) throw new Error('Vehicles duplicated page-level Manage vehicles & profiles action outside Quick Actions');
for(const needle of [
  'mdi:connection',
  'mdi:car-electric',
  'mdi:shield-check-outline',
  'mdi:chevron-right',
  'Charger appearance',
  'grid-template-columns:repeat(4,minmax(0,1fr))!important'
]) if(!chargers.includes(needle)) throw new Error('rc.58 charger visual hierarchy regression: missing '+needle);
if(chargers.includes('<div class="charger-icon"><ha-icon icon="mdi:ev-station"></ha-icon></div>')) throw new Error('generic charger identity icon returned beside real product artwork');
if(chargers.includes('title="Open charger details"><ha-icon icon="mdi:plus"')) throw new Error('plus icon must not represent charger Details');

for(const needle of [
  'vehicle.range_total_km',
  'vehicle.ev_range_km',
  'vehicle.soc_pct',
  'if (this.mobilityRuntimeV2())',
  'propertyByCompoundKey(canonical, spec.property_key)'
]) if(!runtime.includes(needle)) throw new Error('rc.59 direct V2 vehicle metric regression: missing '+needle);

if(!chargers.includes('.charger-visual:not(.image-missing) .charger-visual-fallback{display:none!important}')) {
  throw new Error('rc.59 real charger artwork must suppress generic fallback');
}
if(!dashboard.includes('.charger-mini-image img{opacity:1!important')) {
  throw new Error('rc.59 assigned charger artwork must render at full opacity');
}
console.log('PASS rc.59 direct V2 vehicle metrics and charger artwork truth');


//
// Runtime-path regression: Vehicle Management must execute with real active rows.
// This catches stale free variables left behind by projector refactors (rc.60
// regressed here with an undefined experienceById inside renderVehiclesPage).
//
{
  const methodStart=dashboard.indexOf('  renderVehiclesPage(');
  const methodEnd=dashboard.indexOf('\n  versionBlock(',methodStart);
  if(methodStart<0||methodEnd<0) throw new Error('renderVehiclesPage extraction failed');
  const renderMethod=dashboard.slice(methodStart,methodEnd).trim();

  const models=new Map([
    ['vehicle_profiled',{
      display:'Profiled',
      projection:{
        attention_required:false,
        relationships:{configured_charger_id:'charger_driveway'},
        configuration:{profile_id:'audi_q8_tfsie'}
      }
    }],
    ['vehicle_unprofiled',{
      display:'Unprofiled',
      projection:{
        attention_required:false,
        relationships:{configured_charger_id:''},
        configuration:{profile_id:''}
      }
    }]
  ]);

  const context={
    HomeBrainAssetFactory:class{
      adapterFor(vehicle){
        return {build:()=>models.get(vehicle.asset_id)||null};
      }
    },
    hbMobilityPageHero:()=>'<hero/>',
    hbMobilityStatusGrid:()=>'<status/>',
    hbMobilityQuickActions:()=>'<actions/>',
    hbMobilityPath:(path)=>path
  };
  vm.createContext(context);
  const holder=vm.runInContext('({'+renderMethod+'})',context);

  const card={
    config:{},
    _vehicleSort:'default',
    _vehicleFilter:'all',
    assetId:(vehicle)=>vehicle?.asset_id||'',
    overviewShortLabel:(vehicle,fallback='')=>vehicle?.display_name||fallback,
    renderVehicle:(_rt,vehicle)=>'<vehicle>'+vehicle.asset_id+'</vehicle>',
    renderInactiveVehicle:(_rt,vehicle)=>'<inactive>'+vehicle.asset_id+'</inactive>'
  };
  const rt={
    mobilityFleetV2:()=>({active_vehicle_count:2}),
    vehicleLabel:(id)=>id,
    escape:(value)=>String(value??''),
    lifecycleStatus:()=> 'active'
  };
  const active=[
    {asset_id:'vehicle_profiled',display_name:'Profiled'},
    {asset_id:'vehicle_unprofiled',display_name:'Unprofiled'}
  ];

  let html='';
  try{
    html=holder.renderVehiclesPage.call(card,rt,active,[],[],null,null,null,[],null);
  }catch(error){
    throw new Error('Vehicle Management runtime render failed: '+(error?.stack||error));
  }
  if(!html.includes('1/2 configured')) throw new Error('Vehicle Management profile count is not sourced from canonical VehicleProjection');
  if(!html.includes('vehicle_profiled')||!html.includes('vehicle_unprofiled')) throw new Error('Vehicle Management did not render active vehicle rows');
}

console.log('PASS Vehicles/Chargers content preservation, image-first picker, canonical artwork and rc.56 compact workspace architecture');
