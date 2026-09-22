// Shared hierarchical vehicle visual picker.
// UX owns catalog + rendering; Mobility persists only vehicle.image_key.
class HomeBrainVehicleVisualPicker {
  constructor(rt) { this.rt = rt; }

  catalog() {
    return typeof rhiMobilitySelectableVehicleVisualCatalog === "function"
      ? rhiMobilitySelectableVehicleVisualCatalog()
      : [];
  }

  brands(catalog = this.catalog()) {
    return [...new Set(catalog.map((row)=>String(row.brand || "").trim()).filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b));
  }

  modelsForBrand(brand, catalog = this.catalog()) {
    return [...new Set(catalog
      .filter((row)=>row.brand === brand)
      .map((row)=>String(row.model || "").trim())
      .filter(Boolean))]
      .sort((a,b)=>a.localeCompare(b));
  }

  variantsFor(brand, model, catalog = this.catalog()) {
    return catalog
      .filter((row)=>row.brand === brand && row.model === model)
      .slice()
      .sort((a,b)=>String(a.variant || "").localeCompare(String(b.variant || "")));
  }

  selection(asset = {}, draft = {}) {
    const assetId = String(asset?.asset_id || asset || "").trim();
    const prop = assetId ? this.rt.propertyByCompoundKey(assetId, "vehicle.image_key") : null;
    const profile = this.rt.profileForAsset ? (this.rt.profileForAsset(asset) || {}) : {};
    const profileRaw = String(profile?.image_key || "").trim();
    const persistedRaw = String(prop?.value ?? this.rt.visualImageKey(asset || {}, "image") ?? asset?.image_key ?? "").trim();
    const profileParsed = typeof rhiMobilityParseVehicleVisualKey === "function"
      ? rhiMobilityParseVehicleVisualKey(profileRaw)
      : null;
    const persistedParsed = typeof rhiMobilityParseVehicleVisualKey === "function"
      ? rhiMobilityParseVehicleVisualKey(persistedRaw)
      : null;
    const catalog = this.catalog();

    // Product identity never comes from a presentation override. Profile/source
    // identity is authoritative under frozen V1. Persisted image_key may only
    // select appearance within that same product.
    const identityVehicle = profileParsed?.vehicle
      ? catalog.find((row)=>row.id === profileParsed.vehicle.id) || null
      : (persistedParsed?.vehicle ? catalog.find((row)=>row.id === persistedParsed.vehicle.id) || null : null);

    const sameProductOverride = !!(identityVehicle && persistedParsed?.vehicle?.id === identityVehicle.id);
    const currentColor = sameProductOverride
      ? persistedParsed?.color
      : (profileParsed?.color || identityVehicle?.colors?.[0] || null);
    const color = identityVehicle?.colors?.find((row)=>row.id === String(draft.color_id || ""))
      || currentColor
      || identityVehicle?.colors?.[0]
      || null;
    const key = identityVehicle && color && typeof rhiMobilityVehicleVisualKey === "function"
      ? rhiMobilityVehicleVisualKey(identityVehicle.id, color.id)
      : "";

    return {
      asset_id: assetId,
      prop,
      raw: persistedRaw,
      profile_raw: profileRaw,
      parsed: persistedParsed,
      identity_parsed: profileParsed,
      current_vehicle: identityVehicle,
      brand: identityVehicle?.brand || "",
      model: identityVehicle?.model || "",
      vehicle: identityVehicle,
      color,
      key,
      writable: !!(prop && this.rt.isWritableProperty(prop)),
      identity_locked: true,
      cross_model_override_rejected: !!(identityVehicle && persistedParsed?.vehicle && persistedParsed.vehicle.id !== identityVehicle.id)
    };
  }

  render(asset = {}, options = {}) {
    const current = this.selection(asset, options.draft || {});
    const catalog = this.catalog();
    const brands = this.brands(catalog);
    const models = current.brand ? this.modelsForBrand(current.brand, catalog) : [];
    const variants = current.brand && current.model ? this.variantsFor(current.brand, current.model, catalog) : [];
    const colors = current.vehicle?.colors || [];
    const assetId = current.asset_id;
    const close = options.showClose === false ? "" :
      `<button class="vehicle-picker-close" data-vehicle-picker-close="${this.rt.escape(assetId)}" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>`;

    const placeholder = (label, selected) => `<option value="" ${selected ? "selected" : ""} disabled>${label}</option>`;
    return `<section class="vehicle-picker-panel ${options.context === "detail" ? "detail-vehicle-picker" : ""}" data-picker-panel="${this.rt.escape(assetId)}">
      <div class="vehicle-picker-head">
        <div><small>APPEARANCE</small><h3>Vehicle & colour</h3><p>Vehicle identity comes from Mobility. Choose the colour/appearance for this vehicle; the picker never changes product identity.</p></div>
        ${close}
      </div>
      <div class="vehicle-picker-grid vehicle-picker-hierarchy">
        <label><span>Brand</span><select data-vehicle-picker-brand="${this.rt.escape(assetId)}" disabled>
          ${placeholder("Choose brand…", !current.brand)}
          ${brands.map((brand)=>`<option value="${this.rt.escape(brand)}" ${brand===current.brand?"selected":""}>${this.rt.escape(brand)}</option>`).join("")}
        </select></label>
        <label><span>Model</span><select data-vehicle-picker-model="${this.rt.escape(assetId)}" disabled>
          ${placeholder("Choose model…", !current.model)}
          ${models.map((model)=>`<option value="${this.rt.escape(model)}" ${model===current.model?"selected":""}>${this.rt.escape(model)}</option>`).join("")}
        </select></label>
        <label><span>Variant</span><select data-vehicle-picker-variant="${this.rt.escape(assetId)}" disabled>
          ${placeholder("Choose variant…", !current.vehicle)}
          ${variants.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.vehicle?.id?"selected":""}>${this.rt.escape(row.variant)} · ${this.rt.escape(row.years)}</option>`).join("")}
        </select></label>
        <label><span>Colour</span><select data-vehicle-picker-color="${this.rt.escape(assetId)}" ${!current.vehicle ? "disabled" : ""}>
          ${placeholder("Choose colour…", !current.color)}
          ${colors.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.color?.id?"selected":""}>${this.rt.escape(row.label)}</option>`).join("")}
        </select></label>
        <div class="vehicle-picker-key"><span>Visual key</span><code>${this.rt.escape(current.key || "Unavailable")}</code></div>
        <button class="vehicle-picker-save" data-vehicle-picker-save="${this.rt.escape(assetId)}" data-vehicle-key="${this.rt.escape(current.key)}" ${!current.writable || !current.key ? "disabled" : ""}><ha-icon icon="mdi:check"></ha-icon><span>Use this colour</span></button>
      </div>
      ${current.vehicle?.visual_quality === "profile_source" ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:image-outline"></ha-icon><span>This model uses its Mobility profile/source artwork until dedicated package artwork is available.</span></div>` : ""}
      ${current.cross_model_override_rejected ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:shield-alert-outline"></ha-icon><span>A stored image override referenced another vehicle model and was ignored. Product identity remains backend/profile-owned.</span></div>` : (!current.parsed && current.raw ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:alert-outline"></ha-icon><span>The current visual key is unknown. No replacement default is applied.</span></div>` : "")}
      ${current.writable ? "" : `<div class="vehicle-picker-gap"><ha-icon icon="mdi:alert-outline"></ha-icon><span>Mobility does not publish a writable vehicle.image_key. Saving is disabled.</span></div>`}
    </section>`;
  }
}
