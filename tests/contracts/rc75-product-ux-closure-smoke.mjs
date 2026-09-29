import fs from 'node:fs';

const runtime=fs.readFileSync('src/runtime/ha-contract-runtime.js','utf8');
const dashboard=fs.readFileSync('src/ui/screens/mobility-dashboard.js','utf8');
const chargers=fs.readFileSync('src/ui/screens/charger-maintenance.js','utf8');
const assetShell=fs.readFileSync('src/ui/components/asset-shell.js','utf8');
const presentation=fs.readFileSync('src/app/presentation.js','utf8');
const router=fs.readFileSync('src/ui/screens/router.js','utf8');

for(const token of [
  'isProductConfigurationProperty(prop = {})',
  'isProductWritableProperty(prop = {})',
  '"asset.profile_id"',
  '"vehicle.selected_charger"',
  '"vehicle.requested_charge_power_kw"',
  '"charger.requested_charge_power_kw"',
  'if (this.isProductWritableProperty(prop) && !this.isAppearanceProperty(prop))'
]) {
  if(!runtime.includes(token)) throw new Error('product configuration editor boundary regression: '+token);
}
if(!runtime.includes('if (this.isAppearanceProperty(prop))')) throw new Error('appearance property must be consumed outside generic detail grid');
if(assetShell.includes('detail-appearance-fold')) throw new Error('legacy charger-only detail appearance fold remains');
for(const token of [
  'data-detail-appearance-toggle',
  'data-detail-appearance-panel',
  'new HomeBrainVehicleVisualPicker(this.rt).render',
  'new HomeBrainChargerVisualPicker(this.rt).render',
  'hero-appearance-edit'
]) {
  if(!assetShell.includes(token)) throw new Error('hero appearance interaction regression: '+token);
}

const copyIndex=chargers.indexOf('<div class="charger-identity-copy">');
const imageIndex=chargers.indexOf('${this.renderChargerHero(rt, id, name, status)}',copyIndex);
if(copyIndex<0 || imageIndex<0 || copyIndex>imageIndex) throw new Error('charger management must render identity copy before charger visual');
if(!chargers.includes('grid-template-columns:minmax(0,1fr) 160px!important')) throw new Error('charger management desktop text-left/image-right geometry missing');

for(const token of [
  '<small>Requested power</small>',
  '<small>Charging now</small>',
  '"Power not proven"',
  '"Physical charger identity is not proven, so power is not attributed to this vehicle."',
  'requestedReason'
]) {
  if(!dashboard.includes(token)) throw new Error('vehicle charging answer regression: '+token);
}
if(!dashboard.includes('tile.subvalue || tile.reason')) throw new Error('vehicle attention state must expose backend reason');
if(!dashboard.includes('lifecycle-disabled-reason') || !chargers.includes('lifecycle-disabled-reason')) throw new Error('blocked lifecycle control reason must remain visible');

for(const token of [
  '__rhiMobilityPreloadedHeroes',
  'hbMobilityPreloadHero(asset)',
  'loading="eager"',
  'fetchpriority="high"',
  'transition:none!important'
]) {
  if(!presentation.includes(token) && !assetShell.includes(token)) throw new Error('hero flicker hardening regression: '+token);
}

for(const token of [
  'What will charge, and when?',
  'No per-asset schedule published',
  'Can the plan execute?',
  'What happened?',
  'What needs attention?'
]) {
  if(!router.includes(token)) throw new Error('user-question-first routed UX regression: '+token);
}

console.log('PASS rc.75 target-HA screenshot UX closure invariants');
