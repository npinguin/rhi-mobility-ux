import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const catalog=fs.readFileSync(new URL('../../src/app/asset-catalog.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');
const adapter=fs.readFileSync(new URL('../../src/domain/adapters/vehicle-adapter.js',import.meta.url),'utf8');
const shell=fs.readFileSync(new URL('../../src/ui/components/asset-shell.js',import.meta.url),'utf8');

for(const needle of [
  'MOBILITY / VEHICLE MANAGEMENT',
  'data-vehicle-filter',
  'data-vehicle-sort',
  'Manage vehicles & profiles',
  '/config/integrations/integration/rhi_mobility',
  'manage-lifecycle',
  'vehicle.selected_charger',
  'Choose vehicle & colour',
  'data-vehicle-picker-type',
  'data-vehicle-picker-color',
  'data-vehicle-picker-save',
  'vehicle.image_key',
  'Picker stays fail-closed',
  'Current legacy visual has no verified model artwork',
  'rhiMobilitySelectableVehicleVisualCatalog()',
  'style="filter:${rt.escape(visualFilter)}"',
  'style="filter:${rt.escape(heroVisualFilter)}"'
]) {
  if(!dashboard.includes(needle)) throw new Error(`vehicle-management regression: missing ${needle}`);
}

for(const needle of [
  'RHI_MOBILITY_VEHICLE_VISUALS',
  'audi.q8.4m.2024-2026.tfsi-e',
  'bmw.ix1.u11.2022-2026.ev',
  'mercedes.gla.h247.2023-2026.phev',
  'renault.scenic.e-tech.2024-2026.techno',
  'volkswagen.id4.2024-2026.ev',
  'generic.guest.current.generic',
  'rhiMobilityParseVehicleVisualKey',
  'rhiMobilityVehicleVisualKey',
  'rhiMobilitySelectableVehicleVisualCatalog',
  'selectable:false, visual_quality:"fallback_only"',
  'selectable:true, visual_quality:"verified_model"'
]) {
  if(!catalog.includes(needle)) throw new Error(`vehicle visual catalog regression: missing ${needle}`);
}

if(!runtime.includes('rhiMobilityParseVehicleVisualKey')) throw new Error('runtime no longer resolves structured vehicle visual keys');
if(!adapter.includes('imageFilter = visual?.color?.filter || "none"')) throw new Error('vehicle detail model no longer carries selected visual colour');
if(!shell.includes('model.imageFilter || "none"')) throw new Error('vehicle detail shell no longer renders selected visual colour');

console.log('PASS vehicle management, picker, verified visual gating and cross-screen rendering');
