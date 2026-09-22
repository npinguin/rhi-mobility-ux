import fs from 'node:fs';

const header=fs.readFileSync(new URL('../../src/app/header-and-navigation.js',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');

for(const needle of [
  'display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important',
  '.status-strip.dashboard-status-strip .metric',
  '.status-strip.ops-status-strip .metric',
  '.outcome-header .metric',
  'grid-template-columns:28px minmax(0,1fr)!important',
  '--rhi-company-logo-max-width:286px',
  'grid-template-columns:minmax(270px,.72fr) minmax(430px,1.28fr)',
  '.hi-module-tabs{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px',
  'justify-content:center'
]) {
  if(!header.includes(needle)) throw new Error(`layout-hardening regression: missing ${needle}`);
}

for(const needle of [
  'MOBILITY / VEHICLE MANAGEMENT',
  'data-vehicle-filter',
  'data-vehicle-sort',
  'Manage vehicles & profiles',
  '/config/integrations/integration/rhi_mobility',
  'manage-lifecycle',
  'vehicle.selected_charger'
]) {
  if(!dashboard.includes(needle)) throw new Error(`vehicle-management regression: missing ${needle}`);
}

const catalog=fs.readFileSync(new URL('../../src/app/asset-catalog.js',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');

for(const needle of [
  'RHI_MOBILITY_VEHICLE_VISUALS',
  'audi.q8.4m.2024-2026.tfsi-e',
  'bmw.ix1.u11.2022-2026.ev',
  'mercedes.gla.h247.2023-2026.phev',
  'renault.scenic.e-tech.2024-2026.techno',
  'volkswagen.id4.2024-2026.ev',
  'generic.guest.current.generic',
  'rhiMobilityParseVehicleVisualKey',
  'rhiMobilityVehicleVisualKey'
]) {
  if(!catalog.includes(needle)) throw new Error(`vehicle visual catalog regression: missing ${needle}`);
}

for(const needle of [
  'Choose vehicle & colour',
  'data-vehicle-picker-type',
  'data-vehicle-picker-color',
  'data-vehicle-picker-save',
  'vehicle.image_key',
  'Picker stays fail-closed'
]) {
  if(!dashboard.includes(needle)) throw new Error(`vehicle picker regression: missing ${needle}`);
}

if(!runtime.includes('rhiMobilityParseVehicleVisualKey')) throw new Error('runtime no longer resolves structured vehicle visual keys');

console.log('PASS shared shell geometry, vehicle management and vehicle visual picker');
