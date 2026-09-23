import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const blueprint=fs.readFileSync(new URL('../../documentation/SEMANTIC_PICKER_BLUEPRINT.md',import.meta.url),'utf8');

const vehicleStart=dashboard.indexOf('select[data-vehicle-picker-color]');
const vehicleEnd=dashboard.indexOf('button[data-vehicle-picker-save]',vehicleStart);
const vehicleBlock=dashboard.slice(vehicleStart,vehicleEnd);
if(!vehicleBlock.includes('new HomeBrainVehicleVisualPicker(rt).selection')) throw new Error('vehicle colour picker no longer updates from the shared selection model');
if(vehicleBlock.includes('this.hass = this._hass')) throw new Error('vehicle colour change must not rebuild the HA card');
if(!vehicleBlock.includes('preview.style.filter')) throw new Error('vehicle colour picker must update preview in place');

const chargerStart=chargers.indexOf('querySelectorAll("[data-charger-picker-panel]")');
const chargerEnd=chargers.indexOf('button[data-charger-picker-save]',chargerStart);
const chargerBlock=chargers.slice(chargerStart,chargerEnd);
for(const needle of ['refreshHierarchy','updatePreview','brandSelect?.addEventListener','modelSelect?.addEventListener','variantSelect?.addEventListener','appearanceSelect?.addEventListener']) {
  if(!chargerBlock.includes(needle)) throw new Error(`charger picker session regression: missing ${needle}`);
}
if(chargerBlock.includes('this.hass = this._hass')) throw new Error('charger hierarchy change must not rebuild the HA card');
if(!chargerBlock.includes('this._chargerPickerDraft.set')) throw new Error('charger picker must preserve local draft state');

for(const needle of ['Domain public runtime V2','local draft + live preview','must not trigger a complete Home Assistant card render','Reuse by Energy']) {
  if(!blueprint.includes(needle)) throw new Error(`semantic picker blueprint regression: missing ${needle}`);
}

console.log('PASS V2 semantic picker editing session stays local and reusable');
