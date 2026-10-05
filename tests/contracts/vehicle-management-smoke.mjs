import fs from 'node:fs';
import vm from 'node:vm';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const localization=fs.readFileSync(new URL('../../src/app/localization.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');
const catalog=fs.readFileSync(new URL('../../src/app/asset-catalog.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');
const shell=fs.readFileSync(new URL('../../src/ui/components/asset-shell.js',import.meta.url),'utf8');
const picker=fs.readFileSync(new URL('../../src/ui/components/vehicle-visual-picker.js',import.meta.url),'utf8');
const chargerPicker=fs.readFileSync(new URL('../../src/ui/components/charger-visual-picker.js',import.meta.url),'utf8');
const chargerAdapter=fs.readFileSync(new URL('../../src/domain/adapters/charger-adapter.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const uxCore=fs.readFileSync(new URL('../../src/vendor/rhi-ux-core.js',import.meta.url),'utf8');

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
  'Choose appearance',
  'rhiUxVisualPickerShell',
  'rhiUxVisualChoice',
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
  'Save appearance'
]) if(!picker.includes(needle)) throw new Error('shared vehicle picker regression: missing '+needle);

if(picker.includes('Visual key')) throw new Error('technical visual key returned to normal Vehicle UX');
if(picker.includes('|| catalog[0]')) throw new Error('picker must not silently default unknown vehicles');

for(const needle of [
  'class HomeBrainChargerVisualPicker',
  'Choose appearance',
  'rhiUxVisualPickerShell',
  'rhiUxVisualChoice',
  'data-charger-picker-brand',
  'data-charger-picker-model',
  'data-charger-picker-variant',
  'data-charger-picker-appearance',
  'data-charger-picker-save',
  'data-charger-visual-choice',
  'Save appearance'
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
if(!localization.includes('"hero.vehicles.description":"See which vehicles are ready, connected or need attention, then manage only what matters."')) throw new Error('Vehicles purpose translation drifted');
if(!presentation.includes('asset_key:"vehicles"')) throw new Error('Vehicles contextual hero key missing');

if ((dashboard.match(/Manage vehicles & profiles/g) || []).length !== 1) throw new Error('Vehicles duplicated page-level Manage vehicles & profiles action outside Quick Actions');
for(const needle of [
  'mdi:connection',
  'mdi:car-electric',
  'mdi:shield-check-outline',
  'mdi:chevron-right',
  'data-charger-picker=',
]) if(!chargers.includes(needle)) throw new Error('rc.58 charger visual hierarchy regression: missing '+needle);
if(chargers.includes('<div class="charger-icon"><ha-icon icon="mdi:ev-station"></ha-icon></div>')) throw new Error('generic charger identity icon returned beside real product artwork');
if(chargers.includes('title="Open charger details"><ha-icon icon="mdi:plus"')) throw new Error('plus icon must not represent charger Details');

for(const needle of [
  'vehicle.range_total_km',
  'vehicle.ev_range_km',
  'vehicle.soc_pct',
  'vehicle.current_energy_kwh',
  'this.vehicleExperienceV2(canonical)',
  'this.semanticProperty(canonical, key)',
  'experience.range_intelligence',
  'experience.energy_intelligence',
  'if (totalDisplay) slots.push',
  'if (batteryDisplay) slots.push'
]) if(!runtime.includes(needle)) throw new Error('rc.64 canonical vehicle summary regression: missing '+needle);
if(runtime.includes('propertyByCompoundKey(canonical, spec.property_key)')) throw new Error('rc.64 vehicle summary regressed to materialized-property-only slots');

if(!chargers.includes('.charger-visual:not(.image-missing) .charger-visual-fallback{display:none}')) {
  throw new Error('rc.59 real charger artwork must suppress generic fallback');
}
if(!dashboard.includes('.charger-mini-image img{opacity:1')) {
  throw new Error('rc.59 assigned charger artwork must render at full opacity');
}
console.log('PASS rc.64 cross-screen vehicle range/battery summary and charger artwork truth');


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
  if(!dashboard.includes('model?.projection?.configuration?.profile_id')) throw new Error('Vehicle Management profile count is not sourced from canonical VehicleProjection');
  if(!html.includes('vehicle_profiled')||!html.includes('vehicle_unprofiled')) throw new Error('Vehicle Management did not render active vehicle rows');
}

console.log('PASS Vehicles/Chargers content preservation, image-first picker, canonical artwork and rc.56 compact workspace architecture');


// rc stabilization #116: Vehicle/Charger management share one relationship and visual grammar.
for(const needle of [
  'Assigned charger · Change',
  'Assignment unavailable because vehicle.selected_charger is not published',
  'Read-only selected charger from canonical vehicle property contract',
  'relationship-copy'
]) if(!dashboard.includes(needle)) throw new Error('relationship action grammar regression: missing '+needle);
if(dashboard.includes('title="vehicle.selected_charger is not published"><ha-icon icon="mdi:ev-station"></ha-icon><strong>N/A</strong>')) {
  throw new Error('writable/read-only relationship regressed to N/A pseudo-dropdown grammar');
}

for(const needle of [
  'const relatedVehicle = rt.relatedVehicleForCharger(assetId)',
  'rt.t("common.assigned_vehicle"',
  'rt.t("common.connected_vehicle"',
  'charger-assignment',
  'charger-profile',
  'charger-location'
]) if(!chargers.includes(needle)) throw new Error('charger reciprocal/card anatomy regression: missing '+needle);
if(chargers.includes('h3{margin:0;font-size:18px;font-weight:650;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}')) {
  throw new Error('charger identity regressed to forced single-line truncation');
}
for(const needle of [
  '.rhiUxVisualPickerPanel{width:min(920px,94vw);max-height:min(82vh,760px);overflow:hidden',
  '.rhiUxVisualChoiceGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:142px',
  'overflow-y:auto;overscroll-behavior:contain',
  '.rhiUxVisualChoiceImage{width:100%;height:86px;min-width:0;min-height:86px;max-width:none;max-height:86px',
  'object-fit:contain;object-position:center',
  '@media(max-width:560px)'
]) if(!uxCore.includes(needle)) throw new Error('shared visual picker bounds regression: missing '+needle);

console.log('PASS #116 management cards expose canonical relationships and bounded visual proportions');


//
// rc.81 target-HA closure: vehicle presentation may surface charger-owned
// Start/Stop commands through the canonical relationship, while execution and
// readiness remain owned by the charger command row.
//
{
  const context={};
  vm.createContext(context);
  vm.runInContext(adapter+'\nthis.HomeBrainVehicleAdapter=HomeBrainVehicleAdapter;',context);
  const calls=[];
  const rt={
    vehicleById:()=>null,
    assetById:(id)=>({asset_id:id,display_name:id==='charger_driveway'?'Driveway charger':'Vehicle'}),
    vehicleExperienceV2:()=>({}),
    vehicleChargerRelationship:()=>({assigned:'charger_driveway',effective:'charger_driveway',connected:''}),
    vehicleRelationshipV2:()=>({configured_charger_id:'charger_driveway',effective_charger_id:'charger_driveway',observed_identity_proven:false}),
    canonicalAssetId:(id)=>String(id||''),
    chargerById:(id)=>({asset_id:id,display_name:'Driveway charger'}),
    chargerLabel:()=> 'Driveway charger',
    assetDetailRoute:()=>'/charger',
    semanticProperty:()=>null,
    commandActionsFor:(id)=>{
      calls.push(id);
      if(id==='charger_driveway') return [
        {asset_id:id,command_key:'charger.command.start',command_id:'start',execution_allowed:true,label:'Start charging'},
        {asset_id:id,command_key:'charger.command.stop',command_id:'stop',execution_allowed:false,blocked_reason:'charger_not_active',label:'Stop charging'},
        {asset_id:id,command_key:'charger.command.restart',command_id:'restart',execution_allowed:true,label:'Restart'}
      ];
      return [{asset_id:id,command_key:'vehicle.command.lock',command_id:'lock',execution_allowed:true,label:'Lock'}];
    },
    vehicleOverviewMetricSlots:()=>[],
    liveChargingContextForVehicle:()=>({})
  };
  const instance=new context.HomeBrainVehicleAdapter(rt,'vehicle_test',{registry_entry:{asset_id:'vehicle_test',display_name:'Test vehicle'}});
  const projection=instance.productProjection();
  if(!calls.includes('charger_driveway')) throw new Error('rc.81 vehicle projection did not request commands from effective charger');
  if(projection.relationships.physically_connected_charger_id!=='') throw new Error('rc.81 command presentation must not invent physical vehicle identity');
  if(projection.commands[0]?.command_key!=='charger.command.start'||projection.commands[0]?.asset_id!=='charger_driveway') throw new Error('rc.81 Start charging must remain charger-targeted and lead vehicle quick actions');
  if(projection.commands[1]?.command_key!=='charger.command.stop'||projection.commands[1]?.execution_allowed!==false) throw new Error('rc.81 backend blocked readiness must survive vehicle projection');
  if(projection.commands.some(cmd=>cmd.command_key==='charger.command.restart')) throw new Error('rc.81 vehicle card must not import unrelated charger engineering commands');
}

for(const needle of [
  'rc.81 target-HA phone closure',
  'grid-auto-rows:minmax(44px,auto)',
  'white-space:normal;overflow-wrap:anywhere',
  'height:auto;min-height:0;grid-template-columns:1fr;overflow:visible'
]) if(!dashboard.includes(needle)) throw new Error('rc.81 mobile no-overlap regression: missing '+needle);

console.log('PASS rc.81 assigned charger charging commands and phone card flow closure');
