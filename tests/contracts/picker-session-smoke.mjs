import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const blueprint=fs.readFileSync(new URL('../../documentation/SEMANTIC_PICKER_BLUEPRINT.md',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');
const router=fs.readFileSync(new URL('../../src/ui/screens/router.js',import.meta.url),'utf8');
const assetShell=fs.readFileSync(new URL('../../src/ui/components/asset-shell.js',import.meta.url),'utf8');

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

if(!dashboard.includes('if (!forceRender && this._vehiclePickerAsset && this._lastRenderOk) return;')) throw new Error('open vehicle picker must block normal HA card reconstruction');
if(!chargers.includes('if (this._chargerPickerAsset && this._lastRenderOk) return;')) throw new Error('open charger picker must block normal HA card reconstruction');
if(!router.includes('activeDetailControl?.closest?.(".detail-vehicle-picker,.detail-charger-picker")')) throw new Error('focused detail picker must survive runtime refresh');
for(const needle of ['MOBILITY_PUBLIC_RUNTIME_V2','v2SemanticProperty(assetId = "", propertyKey = "")','semanticProperty(assetId = "", propertyKey = "")','write_supported','write_service_domain','write_target_entity']) {
  if(!runtime.includes(needle)) throw new Error(`runtime duplicate property resolution no longer prefers canonical writable metadata: missing ${needle}`);
}
if(!runtime.includes('rows.slice().sort((a,b)=>score(b)-score(a))[0]')) throw new Error('compound property lookup must choose the richest canonical duplicate');
if(!assetShell.includes('saveButton.disabled = !key || !picker.selection({asset_id:assetId}).writable')) throw new Error('vehicle detail picker must honor canonical write capability');

for(const needle of ['Domain public runtime V2','local draft + live preview','must not trigger a complete Home Assistant card render','Reuse by Energy']) {
  if(!blueprint.includes(needle)) throw new Error(`semantic picker blueprint regression: missing ${needle}`);
}

if(!dashboard.includes('data-vehicle-profile-id')) throw new Error('vehicle picker save must carry canonical Mobility profile intent');
if(!chargers.includes('data-charger-profile-id')) throw new Error('charger picker save must carry canonical Mobility profile intent');
console.log('PASS V2 semantic picker editing session stays local and reusable');
