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
    const raw = prop?.value ?? this.rt.visualImageKey(asset || {}, "image") ?? asset?.image_key ?? "";
    const parsed = typeof rhiMobilityParseVehicleVisualKey === "function"
      ? rhiMobilityParseVehicleVisualKey(raw)
      : null;
    const catalog = this.catalog();
    const currentVehicle = parsed?.vehicle
      ? catalog.find((row)=>row.id === parsed.vehicle.id) || null
      : null;

    const brand = String(draft.brand || currentVehicle?.brand || "");
    const model = String(
      draft.model
      || (currentVehicle?.brand === brand ? currentVehicle?.model : "")
      || ""
    );
    const variants = brand && model ? this.variantsFor(brand, model, catalog) : [];
    const vehicle = variants.find((row)=>row.id === String(draft.variant_id || ""))
      || (currentVehicle?.brand === brand && currentVehicle?.model === model ? currentVehicle : null)
      || null;
    const colors = vehicle?.colors || [];
    const parsedColor = currentVehicle?.id === vehicle?.id ? parsed?.color : null;
    const color = colors.find((row)=>row.id === String(draft.color_id || ""))
      || parsedColor
      || (vehicle ? colors[0] || null : null);
    const key = vehicle && color && typeof rhiMobilityVehicleVisualKey === "function"
      ? rhiMobilityVehicleVisualKey(vehicle.id, color.id)
      : "";

    return {
      asset_id: assetId,
      prop,
      raw: String(raw || ""),
      parsed,
      current_vehicle: currentVehicle,
      brand,
      model,
      vehicle,
      color,
      key,
      writable: !!(prop && this.rt.isWritableProperty(prop))
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
        <div><small>APPEARANCE</small><h3>Vehicle & colour</h3><p>Choose brand, model, variant and colour. The current vehicle is preserved until you explicitly save another selection.</p></div>
        ${close}
      </div>
      <div class="vehicle-picker-grid vehicle-picker-hierarchy">
        <label><span>Brand</span><select data-vehicle-picker-brand="${this.rt.escape(assetId)}">
          ${placeholder("Choose brand…", !current.brand)}
          ${brands.map((brand)=>`<option value="${this.rt.escape(brand)}" ${brand===current.brand?"selected":""}>${this.rt.escape(brand)}</option>`).join("")}
        </select></label>
        <label><span>Model</span><select data-vehicle-picker-model="${this.rt.escape(assetId)}" ${!current.brand ? "disabled" : ""}>
          ${placeholder("Choose model…", !current.model)}
          ${models.map((model)=>`<option value="${this.rt.escape(model)}" ${model===current.model?"selected":""}>${this.rt.escape(model)}</option>`).join("")}
        </select></label>
        <label><span>Variant</span><select data-vehicle-picker-variant="${this.rt.escape(assetId)}" ${!current.model ? "disabled" : ""}>
          ${placeholder("Choose variant…", !current.vehicle)}
          ${variants.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.vehicle?.id?"selected":""}>${this.rt.escape(row.variant)} · ${this.rt.escape(row.years)}</option>`).join("")}
        </select></label>
        <label><span>Colour</span><select data-vehicle-picker-color="${this.rt.escape(assetId)}" ${!current.vehicle ? "disabled" : ""}>
          ${placeholder("Choose colour…", !current.color)}
          ${colors.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===current.color?.id?"selected":""}>${this.rt.escape(row.label)}</option>`).join("")}
        </select></label>
        <div class="vehicle-picker-key"><span>Visual key</span><code>${this.rt.escape(current.key || "Unavailable")}</code></div>
        <button class="vehicle-picker-save" data-vehicle-picker-save="${this.rt.escape(assetId)}" data-vehicle-key="${this.rt.escape(current.key)}" ${!current.writable || !current.key ? "disabled" : ""}><ha-icon icon="mdi:check"></ha-icon><span>Use this vehicle</span></button>
      </div>
      ${current.vehicle?.visual_quality === "profile_source" ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:image-outline"></ha-icon><span>This model uses its Mobility profile/source artwork until dedicated package artwork is available.</span></div>` : ""}
      ${!current.parsed && current.raw ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:alert-outline"></ha-icon><span>The current visual key is unknown. No replacement default is applied.</span></div>` : ""}
      ${current.writable ? "" : `<div class="vehicle-picker-gap"><ha-icon icon="mdi:alert-outline"></ha-icon><span>Mobility does not publish a writable vehicle.image_key. Saving is disabled.</span></div>`}
    </section>`;
  }
}
