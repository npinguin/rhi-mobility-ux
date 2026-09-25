// Shared image-first charger visual picker.
// Mobility V2 owns product profile/image-key persistence; UX owns local artwork.
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
    const writable=!!key && !!profileId && imageWritable && (!profileChanged || profileWritable);

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
    const close=options.showClose===false ? "" : `<button class="vehicle-picker-close" data-charger-picker-close="${this.rt.escape(assetId)}" title="Close appearance selector"><ha-icon icon="mdi:close"></ha-icon></button>`;
    const placeholder=(label,selected)=>`<option value="" ${selected?"selected":""} disabled>${label}</option>`;

    const tiles=catalog.flatMap((row)=>(row.appearances || []).map((appearance)=>{
      const active=row.id===current.charger?.id && appearance.id===current.appearance?.id;
      return `<button type="button" class="visual-choice-card charger-choice-card ${active?"active":""}" data-charger-visual-choice="${this.rt.escape(row.id)}" data-choice-brand="${this.rt.escape(row.brand || "")}" data-choice-model="${this.rt.escape(row.model || "")}" data-choice-appearance="${this.rt.escape(appearance.id || "")}" aria-pressed="${active?"true":"false"}">
        <span class="visual-choice-image">${appearance.package_file ? `<img src="${this.rt.escape(this.rt.cache(appearance.package_file))}" alt="${this.rt.escape([row.label,appearance.label].filter(Boolean).join(" "))}">` : `<ha-icon icon="mdi:ev-station"></ha-icon>`}</span>
        <span class="visual-choice-copy"><b>${this.rt.escape(row.label || row.model || "Charger")}</b><small>${this.rt.escape(appearance.label || row.variant || "Standard")}</small></span>
        <ha-icon class="visual-choice-check" icon="mdi:check-circle"></ha-icon>
      </button>`;
    })).join("");

    const blocked=!current.profile_writable || !current.image_writable;
    const notice=blocked
      ? `<div class="visual-picker-notice"><ha-icon icon="mdi:information-outline"></ha-icon><span>Appearance browsing is available. Apply requires Mobility V2 configuration controls for profile and image.</span></div>`
      : "";

    return `<section class="vehicle-picker-panel charger-picker-panel visual-picker-panel ${options.context==="detail"?"detail-vehicle-picker detail-charger-picker":""}" data-charger-picker-panel="${this.rt.escape(assetId)}">
      <div class="vehicle-picker-head">
        <div><small>APPEARANCE</small><h3>Choose charger appearance</h3><p>Select the real charger visually, then refine product and finish only when needed.</p></div>
        ${close}
      </div>
      <div class="visual-choice-grid" role="listbox" aria-label="Charger appearance">${tiles}</div>
      <div class="vehicle-picker-grid vehicle-picker-hierarchy visual-picker-refine">
        <label><span>Brand</span><select data-charger-picker-brand="${this.rt.escape(assetId)}">
          ${placeholder("Choose brand…",!current.brand)}
          ${brands.map((brand)=>`<option value="${this.rt.escape(brand)}" ${brand===current.brand?"selected":""}>${this.rt.escape(brand)}</option>`).join("")}
        </select></label>
        <label><span>Model</span><select data-charger-picker-model="${this.rt.escape(assetId)}" ${!current.brand?"disabled":""}>
          ${placeholder("Choose model…",!current.model)}
          ${models.map((model)=>`<option value="${this.rt.escape(model)}" ${model===current.model?"selected":""}>${this.rt.escape(model)}</option>`).join("")}
        </select></label>
        <label><span>Variant</span><select data-charger-picker-variant="${this.rt.escape(assetId)}" ${!current.model?"disabled":""}>
          ${placeholder("Choose variant…",!current.charger)}
          ${variants.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.charger?.id?"selected":""}>${this.rt.escape(row.variant || "Standard")} · ${this.rt.escape(row.years)}</option>`).join("")}
        </select></label>
        <label><span>Finish</span><select data-charger-picker-appearance="${this.rt.escape(assetId)}" ${!current.charger?"disabled":""}>
          ${placeholder("Choose finish…",!current.appearance)}
          ${appearances.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.appearance?.id?"selected":""}>${this.rt.escape(row.label)}</option>`).join("")}
        </select></label>
      </div>
      <div class="visual-picker-apply">
        <div class="visual-picker-selection"><small>Selected</small><b>${this.rt.escape(current.charger?.label || current.charger?.model || "Choose a charger")}</b><span>${this.rt.escape(current.appearance?.label || "")}</span></div>
        <button class="vehicle-picker-save" data-charger-picker-save="${this.rt.escape(assetId)}" data-charger-profile-id="${this.rt.escape(current.profile_id)}" data-charger-key="${this.rt.escape(current.key)}" ${!current.writable?"disabled":""}><ha-icon icon="mdi:check"></ha-icon><span>Apply appearance</span></button>
      </div>
      ${notice}
    </section>`;
  }
}
