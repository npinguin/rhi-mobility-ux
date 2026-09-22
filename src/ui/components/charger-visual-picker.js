// Shared hierarchical charger visual picker.
// UX owns charger artwork/catalog rendering. Frozen V1 may publish charger.image_key
// read-only; save automatically enables only when the active runtime contract exposes
// a writable presentation property.
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
      .slice()
      .sort((a,b)=>String(a.variant || "").localeCompare(String(b.variant || "")));
  }

  selection(asset = {}, draft = {}) {
    const assetId = String(asset?.asset_id || asset || "").trim();
    const prop = assetId ? this.rt.propertyByCompoundKey(assetId, "charger.image_key") : null;
    const raw = prop?.value ?? this.rt.visualImageKey(asset || {}, "image") ?? asset?.image_key ?? "";
    const parsed = typeof rhiMobilityParseChargerVisualKey === "function"
      ? rhiMobilityParseChargerVisualKey(raw, assetId)
      : null;
    const catalog = this.catalog();
    const currentCharger = parsed?.charger ? catalog.find((row)=>row.id===parsed.charger.id) || null : null;
    const brand = String(draft.brand || currentCharger?.brand || "");
    const model = String(draft.model || (currentCharger?.brand===brand ? currentCharger?.model : "") || "");
    const variants = brand && model ? this.variantsFor(brand, model, catalog) : [];
    const charger = variants.find((row)=>row.id===String(draft.variant_id || ""))
      || (currentCharger?.brand===brand && currentCharger?.model===model ? currentCharger : null)
      || null;
    const appearances = charger?.appearances || [];
    const parsedAppearance = currentCharger?.id===charger?.id ? parsed?.appearance : null;
    const appearance = appearances.find((row)=>row.id===String(draft.appearance_id || ""))
      || parsedAppearance
      || (charger ? appearances[0] || null : null);
    const key = charger && appearance && typeof rhiMobilityChargerVisualKey === "function"
      ? rhiMobilityChargerVisualKey(charger.id, appearance.id)
      : "";
    return {
      asset_id:assetId, prop, raw:String(raw || ""), parsed, current_charger:currentCharger,
      brand, model, charger, appearance, key,
      writable:!!(prop && this.rt.isWritableProperty(prop))
    };
  }

  render(asset = {}, options = {}) {
    const current=this.selection(asset, options.draft || {});
    const catalog=this.catalog();
    const brands=this.brands(catalog);
    const models=current.brand ? this.modelsForBrand(current.brand,catalog) : [];
    const variants=current.brand && current.model ? this.variantsFor(current.brand,current.model,catalog) : [];
    const appearances=current.charger?.appearances || [];
    const assetId=current.asset_id;
    const close=options.showClose===false ? "" : `<button class="vehicle-picker-close" data-charger-picker-close="${this.rt.escape(assetId)}" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>`;
    const placeholder=(label,selected)=>`<option value="" ${selected?"selected":""} disabled>${label}</option>`;
    return `<section class="vehicle-picker-panel charger-picker-panel ${options.context==="detail"?"detail-vehicle-picker detail-charger-picker":""}" data-charger-picker-panel="${this.rt.escape(assetId)}">
      <div class="vehicle-picker-head">
        <div><small>APPEARANCE</small><h3>Charger & colour</h3><p>Choose the product and its real appearance. The library owns artwork; backend identity remains unchanged.</p></div>
        ${close}
      </div>
      <div class="vehicle-picker-grid vehicle-picker-hierarchy">
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
        <label><span>Colour</span><select data-charger-picker-appearance="${this.rt.escape(assetId)}" ${!current.charger?"disabled":""}>
          ${placeholder("Choose colour…",!current.appearance)}
          ${appearances.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.appearance?.id?"selected":""}>${this.rt.escape(row.label)}</option>`).join("")}
        </select></label>
        <div class="vehicle-picker-key"><span>Visual key</span><code>${this.rt.escape(current.key || "Unavailable")}</code></div>
        <button class="vehicle-picker-save" data-charger-picker-save="${this.rt.escape(assetId)}" data-charger-key="${this.rt.escape(current.key)}" ${!current.writable || !current.key?"disabled":""}><ha-icon icon="mdi:check"></ha-icon><span>Use this charger</span></button>
      </div>
      ${!current.parsed && current.raw ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:alert-outline"></ha-icon><span>The current charger visual key is unknown. No replacement default is silently applied.</span></div>` : ""}
      ${current.writable ? "" : `<div class="vehicle-picker-gap"><ha-icon icon="mdi:lock-outline"></ha-icon><span>Frozen V1 publishes charger.image_key read-only. Selection preview is available now; persistence activates when the replacement contract exposes a writable presentation choice.</span></div>`}
    </section>`;
  }
}
