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
console.log('PASS Vehicles/Chargers content preservation, image-first picker, canonical artwork and rc.56 compact workspace architecture');
