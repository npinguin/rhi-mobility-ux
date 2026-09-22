// Shared vehicle visual picker model/presentation helper.
// UX owns catalog + rendering; Mobility persists only vehicle.image_key.
class HomeBrainVehicleVisualPicker {
  constructor(rt) { this.rt = rt; }

  catalog() {
    return typeof rhiMobilitySelectableVehicleVisualCatalog === "function"
      ? rhiMobilitySelectableVehicleVisualCatalog()
      : [];
  }

  selection(asset = {}, draft = {}) {
    const assetId = String(asset?.asset_id || asset || "").trim();
    const prop = assetId ? this.rt.propertyByCompoundKey(assetId, "vehicle.image_key") : null;
    const raw = prop?.value ?? this.rt.visualImageKey(asset || {}, "image") ?? asset?.image_key ?? "";
    const parsed = typeof rhiMobilityParseVehicleVisualKey === "function"
      ? rhiMobilityParseVehicleVisualKey(raw)
      : null;
    const catalog = this.catalog();
    const parsedSelectable = parsed?.vehicle
      ? catalog.find((row)=>row.id === parsed.vehicle.id) || null
      : null;
    const vehicle = catalog.find((row)=>row.id === String(draft.vehicle_id || ""))
      || parsedSelectable
      || catalog[0]
      || null;
    const colors = vehicle?.colors || [];
    const parsedColor = parsedSelectable?.id === vehicle?.id ? parsed?.color : null;
    const color = colors.find((row)=>row.id === String(draft.color_id || ""))
      || parsedColor
      || colors[0]
      || null;
    const key = vehicle && color && typeof rhiMobilityVehicleVisualKey === "function"
      ? rhiMobilityVehicleVisualKey(vehicle.id, color.id)
      : "";
    return {
      asset_id: assetId,
      prop,
      raw: String(raw || ""),
      parsed,
      parsed_selectable: !!parsedSelectable,
      vehicle,
      color,
      key,
      writable: !!(prop && this.rt.isWritableProperty(prop))
    };
  }

  render(asset = {}, options = {}) {
    const current = this.selection(asset, options.draft || {});
    const catalog = this.catalog();
    const vehicle = current.vehicle;
    const colors = vehicle?.colors || [];
    const color = current.color;
    const assetId = current.asset_id;
    const close = options.showClose === false ? "" :
      `<button class="vehicle-picker-close" data-vehicle-picker-close="${this.rt.escape(assetId)}" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>`;
    return `<section class="vehicle-picker-panel ${options.context === "detail" ? "detail-vehicle-picker" : ""}" data-picker-panel="${this.rt.escape(assetId)}">
      <div class="vehicle-picker-head">
        <div><small>APPEARANCE</small><h3>Choose vehicle & colour</h3><p>The UX catalog owns visuals. Mobility stores only the selected <code>vehicle.image_key</code>.</p></div>
        ${close}
      </div>
      <div class="vehicle-picker-grid">
        <label><span>Vehicle</span><select data-vehicle-picker-type="${this.rt.escape(assetId)}">${catalog.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===vehicle?.id?"selected":""}>${this.rt.escape(row.label)} · ${this.rt.escape(row.years)}</option>`).join("")}</select></label>
        <label><span>Colour</span><select data-vehicle-picker-color="${this.rt.escape(assetId)}">${colors.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===color?.id?"selected":""}>${this.rt.escape(row.label)}</option>`).join("")}</select></label>
        <div class="vehicle-picker-key"><span>Visual key</span><code>${this.rt.escape(current.key || "Unavailable")}</code></div>
        <button class="vehicle-picker-save" data-vehicle-picker-save="${this.rt.escape(assetId)}" data-vehicle-key="${this.rt.escape(current.key)}" ${!current.writable || !current.key ? "disabled" : ""}><ha-icon icon="mdi:check"></ha-icon><span>Use this vehicle</span></button>
      </div>
      ${current.parsed && !current.parsed_selectable ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:image-off-outline"></ha-icon><span>Current legacy visual has no verified model artwork. It remains readable, but is not offered as a new picker choice.</span></div>` : ""}
      ${current.writable ? "" : `<div class="vehicle-picker-gap"><ha-icon icon="mdi:alert-outline"></ha-icon><span>Backend does not publish a writable vehicle.image_key yet. Picker stays fail-closed.</span></div>`}
    </section>`;
  }
}
