// Shared hierarchical charger visual picker.
// Mobility V2 owns charger product profile; UX owns artwork/appearance.
class HomeBrainChargerVisualPicker {
  constructor(rt) { this.rt = rt; }

  catalog() {
    return typeof rhiMobilitySelectableChargerVisualCatalog === "function"
      ? rhiMobilitySelectableChargerVisualCatalog()
      : [];
  }

  brands(catalog = this.catalog()) {
    return [...new Set(catalog.map((row)=>String(row.brand || "").trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b));
  }

  modelsForBrand(brand, catalog = this.catalog()) {
    return [...new Set(catalog.filter((row)=>row.brand===brand).map((row)=>String(row.model || "").trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b));
  }

  variantsFor(brand, model, catalog = this.catalog()) {
    return catalog.filter((row)=>row.brand===brand && row.model===model)
      .slice().sort((a,b)=>String(a.variant || "").localeCompare(String(b.variant || "")));
  }

  profileIdForCharger(charger, profileProp) {
    if (!charger) return "";
    const available = new Set((this.rt.propertyEditorChoices(profileProp) || []).map((row)=>String((row?.value ?? row) || "")));
    const candidates = Array.isArray(charger.profile_ids) ? charger.profile_ids : [];
    return candidates.find((id)=>available.has(String(id))) || "";
  }

  selection(asset = {}, draft = {}) {
    const assetId=String(asset?.asset_id || asset || "").trim();
    const imageProp=assetId ? this.rt.semanticProperty(assetId,"charger.image_key") : null;
    const profileProp=assetId ? this.rt.semanticProperty(assetId,"asset.profile_id") : null;
    const raw=String(imageProp?.value ?? this.rt.visualImageKey(asset || {},"image") ?? asset?.image_key ?? "").trim();
    const parsed=typeof rhiMobilityParseChargerVisualKey==="function" ? rhiMobilityParseChargerVisualKey(raw,assetId) : null;
    const currentProfileId=String(profileProp?.value ?? asset?.profile_id ?? asset?.raw?.profile_id ?? "").trim();
    const profileCharger=typeof rhiMobilityChargerVisualForProfile==="function" ? rhiMobilityChargerVisualForProfile(currentProfileId) : null;
    const catalog=this.catalog();
    const currentCharger=profileCharger || (parsed?.charger ? catalog.find((row)=>row.id===parsed.charger.id) || null : null);

    const brand=String(draft.brand ?? currentCharger?.brand ?? "");
    const model=String(draft.model ?? (currentCharger?.brand===brand ? currentCharger?.model : "") ?? "");
    const variants=brand && model ? this.variantsFor(brand,model,catalog) : [];
    const charger=variants.find((row)=>row.id===String(draft.variant_id || ""))
      || (currentCharger?.brand===brand && currentCharger?.model===model ? currentCharger : null)
      || null;
    const appearances=charger?.appearances || [];
    const parsedAppearance=currentCharger?.id===charger?.id ? parsed?.appearance : null;
    const appearance=appearances.find((row)=>row.id===String(draft.appearance_id || ""))
      || parsedAppearance || appearances[0] || null;
    const key=charger && appearance && typeof rhiMobilityChargerVisualKey==="function"
      ? rhiMobilityChargerVisualKey(charger.id,appearance.id)
      : "";
    const profileId=this.profileIdForCharger(charger,profileProp) || (charger?.id===currentCharger?.id ? currentProfileId : "");
    const profileChanged=!!profileId && profileId!==currentProfileId;
    const profileWritable=!!(profileProp && this.rt.isWritableProperty(profileProp));
    const imageWritable=!!(imageProp && this.rt.isWritableProperty(imageProp));
    const writable=!!key && imageWritable && (!profileChanged || profileWritable);

    return {
      asset_id:assetId,
      prop:imageProp,
      image_prop:imageProp,
      profile_prop:profileProp,
      raw,parsed,
      current_profile_id:currentProfileId,
      profile_id:profileId,
      profile_changed:profileChanged,
      profile_writable:profileWritable,
      image_writable:imageWritable,
      current_charger:currentCharger,
      brand,model,charger,appearance,key,writable
    };
  }

  render(asset = {}, options = {}) {
    const current=this.selection(asset,options.draft || {});
    const catalog=this.catalog();
    const brands=this.brands(catalog);
    const models=current.brand ? this.modelsForBrand(current.brand,catalog) : [];
    const variants=current.brand && current.model ? this.variantsFor(current.brand,current.model,catalog) : [];
    const appearances=current.charger?.appearances || [];
    const assetId=current.asset_id;
    const close=options.showClose===false ? "" : `<button class="vehicle-picker-close" data-charger-picker-close="${this.rt.escape(assetId)}" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>`;
    const placeholder=(label,selected)=>`<option value="" ${selected?"selected":""} disabled>${label}</option>`;
    const previewFile=current.appearance?.package_file || "";
    const preview=current.charger ? `<div class="visual-picker-preview"><img data-picker-visual-preview="charger" src="${this.rt.escape(this.rt.cache(previewFile))}" alt="${this.rt.escape(current.charger.label || current.charger.model || "Charger")}"><div><small>Selected appearance</small><b>${this.rt.escape(current.charger.label || current.charger.model || "Charger")}</b><span>${this.rt.escape(current.appearance?.label || "")}</span></div></div>` : "";
    return `<section class="vehicle-picker-panel charger-picker-panel ${options.context==="detail"?"detail-vehicle-picker detail-charger-picker":""}" data-charger-picker-panel="${this.rt.escape(assetId)}">
      <div class="vehicle-picker-head">
        <div><small>APPEARANCE</small><h3>Charger & colour</h3><p>Choose the Mobility charger profile and its real appearance. Product identity is persisted by Mobility V2; artwork remains UX-owned.</p></div>
        ${close}
      </div>
      ${preview}
      <div class="vehicle-picker-grid vehicle-picker-hierarchy">
        <label><span>Brand</span><select data-charger-picker-brand="${this.rt.escape(assetId)}" ${!current.profile_writable?"disabled":""}>
          ${placeholder("Choose brand…",!current.brand)}
          ${brands.map((brand)=>`<option value="${this.rt.escape(brand)}" ${brand===current.brand?"selected":""}>${this.rt.escape(brand)}</option>`).join("")}
        </select></label>
        <label><span>Model</span><select data-charger-picker-model="${this.rt.escape(assetId)}" ${!current.profile_writable||!current.brand?"disabled":""}>
          ${placeholder("Choose model…",!current.model)}
          ${models.map((model)=>`<option value="${this.rt.escape(model)}" ${model===current.model?"selected":""}>${this.rt.escape(model)}</option>`).join("")}
        </select></label>
        <label><span>Variant</span><select data-charger-picker-variant="${this.rt.escape(assetId)}" ${!current.profile_writable||!current.model?"disabled":""}>
          ${placeholder("Choose variant…",!current.charger)}
          ${variants.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.charger?.id?"selected":""}>${this.rt.escape(row.variant || "Standard")} · ${this.rt.escape(row.years)}</option>`).join("")}
        </select></label>
        <label><span>Colour</span><select data-charger-picker-appearance="${this.rt.escape(assetId)}" ${!current.charger||!current.image_writable?"disabled":""}>
          ${placeholder("Choose colour…",!current.appearance)}
          ${appearances.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.appearance?.id?"selected":""}>${this.rt.escape(row.label)}</option>`).join("")}
        </select></label>
        <div class="vehicle-picker-key"><span>Visual key</span><code>${this.rt.escape(current.key || "Unavailable")}</code></div>
        <button class="vehicle-picker-save" data-charger-picker-save="${this.rt.escape(assetId)}" data-charger-profile-id="${this.rt.escape(current.profile_id)}" data-charger-key="${this.rt.escape(current.key)}" ${!current.writable?"disabled":""}><ha-icon icon="mdi:check"></ha-icon><span>Use this charger & colour</span></button>
      </div>
      ${current.charger && !current.profile_id ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:alert-outline"></ha-icon><span>This visual has no writable Mobility V2 charger profile in the active backend catalog.</span></div>` : ""}
      ${!current.profile_writable ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:lock-outline"></ha-icon><span>Mobility V2 does not publish a writable asset.profile_id for this charger.</span></div>` : ""}
      ${!current.image_writable ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:lock-outline"></ha-icon><span>Mobility V2 does not publish a writable charger.image_key for this charger.</span></div>` : ""}
    </section>`;
  }
}
