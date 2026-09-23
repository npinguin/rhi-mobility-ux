import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const blueprint=fs.readFileSync(new URL('../../documentation/SEMANTIC_PICKER_BLUEPRINT.md',import.meta.url),'utf8');
const runtime=fs.readFileSync(new URL('../../src/runtime/ha-contract-runtime.js',import.meta.url),'utf8');
const router=fs.readFileSync(new URL('../../src/ui/screens/router.js',import.meta.url),'utf8');
const assetShell=fs.readFileSync(new URL('../../src/ui/components/asset-shell.js',import.meta.url),'utf8');

const vehicleStart=dashboard.indexOf('this.shadowRoot.querySelectorAll("[data-picker-panel]")');
const vehicleEnd=dashboard.indexOf('this.shadowRoot.querySelectorAll("button[data-lifecycle-asset]")',vehicleStart);
const vehicleBlock=dashboard.slice(vehicleStart,vehicleEnd);
for(const needle of ['new HomeBrainVehicleVisualPicker(rt)','picker.selection(asset,draft)','brandSelect?.addEventListener','modelSelect?.addEventListener','variantSelect?.addEventListener','colorSelect?.addEventListener','data-vehicle-profile-id']) {
  if(!vehicleBlock.includes(needle)) throw new Error(`vehicle picker session regression: missing ${needle}`);
}
if(vehicleBlock.includes('this.hass = this._hass')) throw new Error('vehicle hierarchy change must not rebuild the HA card');
if(!vehicleBlock.includes('preview.style.filter')) throw new Error('vehicle picker must update preview in place');

const chargerStart=chargers.indexOf('querySelectorAll("[data-charger-picker-panel]")');
const chargerEnd=chargers.indexOf('button[data-charger-picker-save]',chargerStart);
const chargerBlock=chargers.slice(chargerStart,chargerEnd);
for(const needle of ['refreshHierarchy','updatePreview','brandSelect?.addEventListener','modelSelect?.addEventListener','variantSelect?.addEventListener','appearanceSelect?.addEventListener']) {
  if(!chargerBlock.includes(needle)) throw new Error(`charger picker session regression: missing ${needle}`);
}
if(chargerBlock.includes('this.hass = this._hass')) throw new Error('charger hierarchy change must not rebuild the HA card');
if(!chargerBlock.includes('this._chargerPickerDraft.set')) throw new Error('charger picker must preserve local draft state');

if(!dashboard.includes('if (!forceRender && this._vehiclePickerAsset && this._lastRenderOk) return;')) throw new Error('open vehicle picker must block normal HA card reconstruction');
if(!chargers.includes('if (!this._forceRender && this._chargerPickerAsset && this._lastRenderOk) return;')) throw new Error('open charger picker must allow one forced render, then block normal HA card reconstruction');
if(!router.includes('activeDetailControl?.closest?.(".detail-vehicle-picker,.detail-charger-picker")')) throw new Error('focused detail picker must survive runtime refresh');
for(const needle of ['MOBILITY_PUBLIC_RUNTIME_V2','v2SemanticProperty(assetId = "", propertyKey = "")','semanticProperty(assetId = "", propertyKey = "")','write_supported','write_service_domain','write_target_entity']) {
  if(!runtime.includes(needle)) throw new Error(`runtime duplicate property resolution no longer prefers canonical writable metadata: missing ${needle}`);
}
if(!runtime.includes('rows.slice().sort((a,b)=>score(b)-score(a))[0]')) throw new Error('compound property lookup must choose the richest canonical duplicate');
if(!assetShell.includes('saveButton.disabled = !visual.writable')) throw new Error('detail picker must honor the V2 profile + appearance selection write capability');

for(const needle of ['Domain public runtime V2','local draft + live preview','must not trigger a complete Home Assistant card render','Reuse by Energy']) {
  if(!blueprint.includes(needle)) throw new Error(`semantic picker blueprint regression: missing ${needle}`);
}

if(!dashboard.includes('data-vehicle-profile-id')) throw new Error('vehicle picker save must carry canonical Mobility profile intent');
if(!chargers.includes('data-charger-profile-id')) throw new Error('charger picker save must carry canonical Mobility profile intent');
console.log('PASS V2 semantic picker editing session stays local and reusable');


if(!dashboard.includes('await rt.writePublishedPropertyAsync(assetId,"asset.profile_id",profileId)')) throw new Error('vehicle picker must await profile persistence before appearance write');
if(!dashboard.includes('await rt.writePublishedPropertyAsync(assetId,"vehicle.image_key",key)')) throw new Error('vehicle picker must await appearance write');
if(!chargers.includes('await rt.writePublishedPropertyAsync(assetId, "asset.profile_id", profileId)')) throw new Error('charger picker must await profile persistence before appearance write');
if(!chargers.includes('await rt.writePublishedPropertyAsync(assetId, "charger.image_key", key)')) throw new Error('charger picker must await appearance write');
if(!chargers.includes('grid-template-columns:repeat(4,minmax(120px,1fr))')) throw new Error('charger picker must share the vehicle picker desktop hierarchy layout');
