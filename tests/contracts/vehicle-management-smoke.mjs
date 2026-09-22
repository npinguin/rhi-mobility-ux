import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const catalog=fs.readFileSync(new URL('../../src/app/asset-catalog.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');
const shell=fs.readFileSync(new URL('../../src/ui/components/asset-shell.js',import.meta.url),'utf8');
const picker=fs.readFileSync(new URL('../../src/ui/components/vehicle-visual-picker.js',import.meta.url),'utf8');
const artwork=fs.readFileSync(new URL('../../documentation/VEHICLE_ARTWORK_SOURCES.json',import.meta.url),'utf8');

for(const needle of [
  'MOBILITY / VEHICLE MANAGEMENT',
  'data-vehicle-filter',
  'data-vehicle-sort',
  'Manage vehicles & profiles',
  '/config/integrations/integration/rhi_mobility',
  'manage-lifecycle',
  'vehicle.selected_charger',
  'vehicle.image_key',
  'style="filter:${rt.escape(visualFilter)}"',
  'style="filter:${rt.escape(heroVisualFilter)}"'
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
  'No replacement default is applied',
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
  'visual_quality:"profile_source"',
  'selectable:true, visual_quality:"verified_model"'
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
  'CC0-1.0',
  'CC-BY-2.0',
  '"no_wrong_model_fallback": true'
]) {
  if(!artwork.includes(needle)) throw new Error(`vehicle artwork provenance regression: missing ${needle}`);
}

if(!runtime.includes('rhiMobilityParseVehicleVisualKey')) throw new Error('runtime no longer resolves structured vehicle visual keys');
if(!adapter.includes('imageFilter = visual?.color?.filter || "none"')) throw new Error('vehicle detail model no longer carries selected visual colour');
if(!adapter.includes('const visualPackageFile = visual?.vehicle?.selectable !== false')) throw new Error('persisted vehicle visual no longer resolves to verified catalog artwork');
if(!adapter.includes('const img = visualPackageFile ? this.rt.assetUrl(visualPackageFile) : profileImage')) throw new Error('vehicle adapter no longer prefers persisted picker artwork over profile/source fallback');
if(!shell.includes('model.imageFilter || "none"')) throw new Error('vehicle detail shell no longer renders selected visual colour');
if(!shell.includes('key === "vehicle.image_key"')) throw new Error('vehicle detail does not intercept vehicle.image_key for picker rendering');
if(!shell.includes('new HomeBrainVehicleVisualPicker(this.rt).render')) throw new Error('vehicle detail is not using the shared picker');
if(!shell.includes('data-vehicle-visual-preview')) throw new Error('vehicle detail live picker preview is missing');
if(!picker.includes('class HomeBrainVehicleVisualPicker')) throw new Error('shared vehicle picker helper missing');
if(picker.includes('|| catalog[0]')) throw new Error('picker must not silently default an unknown vehicle to the first catalog entry');
if(!picker.includes('Choose brand…')) throw new Error('unknown current visual must require explicit brand selection');
if(!picker.includes('Choose model…')) throw new Error('hierarchical picker model placeholder missing');
if(!picker.includes('Choose variant…')) throw new Error('hierarchical picker variant placeholder missing');
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

console.log('PASS vehicle management, hierarchical picker, full current profile coverage, artwork provenance and compact mobile composition');
