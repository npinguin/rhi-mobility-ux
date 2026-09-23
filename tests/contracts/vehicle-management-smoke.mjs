import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const presentation=fs.readFileSync(new URL('../../src/app/presentation.js',import.meta.url),'utf8');
const catalog=fs.readFileSync(new URL('../../src/app/asset-catalog.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');
const shell=fs.readFileSync(new URL('../../src/ui/components/asset-shell.js',import.meta.url),'utf8');
const picker=fs.readFileSync(new URL('../../src/ui/components/vehicle-visual-picker.js',import.meta.url),'utf8');
const chargerPicker=fs.readFileSync(new URL('../../src/ui/components/charger-visual-picker.js',import.meta.url),'utf8');
const chargerAdapter=fs.readFileSync(new URL('../../src/domain/adapters/charger-adapter.js',import.meta.url),'utf8');
const artwork=fs.readFileSync(new URL('../../documentation/VEHICLE_ARTWORK_SOURCES.json',import.meta.url),'utf8');

for(const needle of [
  'data-vehicle-filter',
  'data-vehicle-sort',
  'Manage vehicles & profiles',
  '/config/integrations/integration/rhi_mobility',
  'manage-lifecycle',
  'vehicle.selected_charger',
  'vehicle.image_key',
  'style="filter:${rt.escape(visualFilter)}"',
]) {
  if(!dashboard.includes(needle)) throw new Error(`vehicle-management regression: missing ${needle}`);
}

for(const needle of [
  'Vehicle & colour',
  'data-vehicle-picker-brand',
  'data-vehicle-picker-model',
  'data-vehicle-picker-variant',
  'data-vehicle-picker-color',
  'data-vehicle-picker-save',
  'class HomeBrainVehicleVisualPicker',
  'rhiMobilitySelectableVehicleVisualCatalog()',
  'modelsForBrand',
  'variantsFor'
]) {
  if(!picker.includes(needle)) throw new Error(`shared vehicle picker regression: missing ${needle}`);
}

for(const needle of [
  'RHI_MOBILITY_VEHICLE_VISUALS',
  'audi.q8.4m.2024-2026.tfsi-e',
  'bmw.x1.u11.2025-2026.phev',
  'mercedes.gla.h247.2023-2026.phev',
  'renault.scenic.e-tech.2024-2026.techno',
  'volkswagen.id4.2024-2026.ev',
  'generic.guest.current.phev-1phase',
  'generic.guest.current.ev-3phase',
  'rhiMobilityParseVehicleVisualKey',
  'rhiMobilityVehicleVisualKey',
  'rhiMobilitySelectableVehicleVisualCatalog',
  'audi_q8_daytona_grey_23',
  'vw_id4_business_pro_silver_grey',
  'mercedes_gla_phev',
  'bmw_x1_phev',
  'renault_scenic_techno_ev',
  'guest_phev',
  'guest_ev',
  'selectable:true, visual_quality:"verified_model"',
  'vehicles/vehicle_vw_id4.webp',
  'vehicles/vehicle_renault_scenic_techno_ev.webp',
  'vehicle_bmw_x1_phev'
]) {
  if(!catalog.includes(needle)) throw new Error(`vehicle visual catalog regression: missing ${needle}`);
}

for(const needle of [
  'audi_q8_tfsi_55e_2025_phev',
  'vw_id4_business_pro_77kwh',
  'mercedes_gla_2021_phev',
  'bmw_x1_2025_phev',
  'renault_scenic_techno_ev',
  'guest_phev_1phase',
  'guest_ev_3phase',
  '"current_scope_package_complete": true',
  '"no_wrong_model_fallback": true',
  '"legacy_runtime_artwork_paths": false'
]) {
  if(!artwork.includes(needle)) throw new Error(`vehicle artwork provenance regression: missing ${needle}`);
}

if(!runtime.includes('rhiMobilityParseVehicleVisualKey')) throw new Error('runtime no longer resolves structured vehicle visual keys');
if(runtime.includes('profileImageCompatibilityKey')) throw new Error('legacy profile-name artwork inference returned');
for(const dead of ['default_vehicle.png','vehicle_unknown_profile_hero.png','vehicle_audi_q8_hero.png','vehicle_bmw_ix1_phev_hero.png','vehicle_guest_hero.png']){
  if(catalog.includes(dead)||runtime.includes(dead)||dashboard.includes(dead)||shell.includes(dead)) throw new Error(`legacy artwork path returned: ${dead}`);
}
if(!adapter.includes('imageFilter = visual?.color?.filter || "none"')) throw new Error('vehicle detail model no longer carries selected visual colour');
if(!adapter.includes('const visualPackageFile = visual?.vehicle?.selectable !== false')) throw new Error('persisted vehicle visual no longer resolves to verified catalog artwork');
if(!adapter.includes('const img = visualPackageFile || profileImage')) throw new Error('vehicle adapter no longer prefers the already-resolved package URL over profile/source fallback');
if(adapter.includes('this.rt.assetUrl(visualPackageFile)')) throw new Error('vehicle adapter reintroduced double-prefix package URL resolution');
if(!shell.includes('model.imageFilter || "none"')) throw new Error('vehicle detail shell no longer renders selected visual colour');
if(!shell.includes('key === "vehicle.image_key"')) throw new Error('vehicle detail does not intercept vehicle.image_key for picker rendering');
if(!shell.includes('new HomeBrainVehicleVisualPicker(this.rt).render')) throw new Error('vehicle detail is not using the shared picker');
if(!shell.includes('data-vehicle-visual-preview')) throw new Error('vehicle detail live picker preview is missing');
if(!picker.includes('class HomeBrainVehicleVisualPicker')) throw new Error('shared vehicle picker helper missing');
if(picker.includes('|| catalog[0]')) throw new Error('picker must not silently default an unknown vehicle to the first catalog entry');

for(const needle of [
  'class HomeBrainChargerVisualPicker',
  'Charger & colour',
  'data-charger-picker-brand',
  'data-charger-picker-model',
  'data-charger-picker-variant',
  'data-charger-picker-appearance',
  'Mobility V2 does not publish a writable asset.profile_id for this charger.'
]) {
  if(!chargerPicker.includes(needle)) throw new Error(`shared charger picker regression: missing ${needle}`);
}
for(const needle of [
  'RHI_MOBILITY_CHARGER_VISUALS',
  'wallbox.commander2',
  'peblar.business.socket',
  'fibaro.wall-plug-2.zwave-plus.be-fr',
  'rhiMobilityResolveChargerVisual'
]) {
  if(!catalog.includes(needle)) throw new Error(`charger visual catalog regression: missing ${needle}`);
}
if(!chargerAdapter.includes('return packageFile || this.rt.visualImageUrl')) throw new Error('charger adapter no longer prefers resolved package artwork');
if(chargerAdapter.includes('this.rt.assetUrl(packageFile)')) throw new Error('charger adapter reintroduced double-prefix package URL resolution');
if(!dashboard.includes('new HomeBrainVehicleVisualPicker(rt).selection')) throw new Error('vehicle management does not consume shared picker selection model');
for(const needle of [
  'Vehicle & colour',
  'vehicle-visual-edit',
  'rc.24 mobile hero art + discoverable visual picker',
  'background:linear-gradient(90deg',
  '.charger-mini-image{',
  'object-position:right center'
]) {
  if(!dashboard.includes(needle)) throw new Error(`hero-art/picker discoverability regression: missing ${needle}`);
}

for(const needle of [
  'rc.23 mobile density rewrite',
  'grid-template-columns:minmax(0,1fr) 138px',
  '.charger-hero-panel{',
  'height:72px!important',
  '.inactive-row{',
  'grid-template-columns:auto minmax(0,1fr) auto!important',
  '.vehicle-picker-grid{grid-template-columns:1fr!important',
  'height:44px!important'
]) {
  if(!dashboard.includes(needle)) throw new Error(`mobile vehicle-density regression: missing ${needle}`);
}
if(!shell.includes('rc.23 mobile detail density + picker hardening')) throw new Error('mobile detail picker hardening missing');
if(!shell.includes('.detail-vehicle-picker .vehicle-picker-grid{grid-template-columns:1fr!important')) throw new Error('detail picker is not one-column on phone');

console.log('PASS vehicle management, hierarchical picker, complete canonical current artwork, zero legacy runtime path and compact mobile composition');

if(presentation.includes('MOBILITY / VEHICLE MANAGEMENT')) throw new Error('vehicle-management hero navigation/location eyebrow must stay removed');
if(!presentation.includes('Check that your fleet is configured, assigned and operational')) throw new Error('vehicle-management hero purpose drifted from shared presentation owner');

if(!presentation.includes('asset_key:"vehicles"')) throw new Error('Vehicle tab contextual hero key missing from shared presentation owner');

for(const needle of [
  'this.rt.semanticProperty(assetId, "asset.profile_id")',
  'this.rt.semanticProperty(assetId, "vehicle.image_key")',
  'rhiMobilityVehicleVisualForProfile',
  'profileIdForVehicle',
  'Use this vehicle & colour',
  'data-vehicle-profile-id'
]) if(!picker.includes(needle)) throw new Error(`V2 vehicle picker regression: missing ${needle}`);

for(const needle of [
  'profile_ids:["volkswagen_id4_pro_my2026","vw_id4_business_pro_77kwh"]',
  'profile_ids:["audi_q8_55_tfsi_e_quattro_my2025","audi_q8_tfsi_55e_2025_phev"]',
  'profile_ids:["wallbox_commander2_22kw","wallbox_ocpp"]',
  'profile_ids:["peblar_business_socket_22kw","peblar_22kw"]'
]) if(!catalog.includes(needle)) throw new Error(`profile-to-visual mapping regression: missing ${needle}`);

if(!dashboard.includes('this._vehiclePickerDraft.delete(assetId)')) throw new Error('vehicle picker cancel/close no longer clears unsaved draft');
if(!dashboard.includes('this._vehiclePickerDraft.set(assetId,{})')) throw new Error('vehicle picker open no longer starts from canonical current selection');
if(!dashboard.includes('No charger selected')) throw new Error('no-charger relationship no longer has explicit user-facing state');
if(dashboard.includes('this.chargerImage(activeChargerId || "default")')) throw new Error('no-charger state may resolve through an unrelated default asset');
