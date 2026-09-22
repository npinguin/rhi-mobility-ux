// Read-only Energy metering/value projection for Mobility Insights.
// Energy owns measurement and financial semantics. Mobility UX only filters
// Energy's public per-asset records by exact canonical Mobility asset ids.

class HomeBrainEnergyMobilityInsightsProjection {
  constructor(hass, mobilityRuntime = null) {
    this.hass = hass || {};
    this.mobilityRuntime = mobilityRuntime || null;
  }

  static get entities() {
    return Object.freeze({
      metering: "sensor.energy_asset_metering_index",
      value: "sensor.energy_value_accounting_index"
    });
  }

  _state(key) {
    const id = HomeBrainEnergyMobilityInsightsProjection.entities[key];
    return id ? (this.hass?.states?.[id] || null) : null;
  }

  _parse(value, fallback = null) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "object") return value;
    try { return JSON.parse(value); } catch (_) { return fallback ?? value; }
  }

  _object(value) {
    const parsed = this._parse(value, value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  }

  _rows(value) {
    const parsed = this._parse(value, value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
    if (parsed && typeof parsed === "object") return Object.values(parsed).filter(Boolean);
    return [];
  }

  _first(...values) {
    for (const value of values) if (value !== undefined && value !== null && value !== "") return value;
    return null;
  }

  _number(...values) {
    const value = this._first(...values);
    if (value === null) return null;
    const number = Number(String(value).replace(",", "."));
    return Number.isFinite(number) ? number : null;
  }

  _mobilityAssets() {
    try {
      const rows = this.mobilityRuntime?.mobilityRegistry?.() || [];
      return new Map(rows.map((row) => [String(row?.asset_id || ""), row]).filter(([id]) => id));
    } catch (_) {
      return new Map();
    }
  }

  _assetId(row = {}) {
    return String(this._first(
      row.asset_id,
      row.consumer_asset_id,
      row.child_asset_id,
      row.target_asset_id,
      row.flexible_asset_id,
      row.participant_id,
      ""
    ) || "");
  }

  _assetName(assetId, row = {}) {
    const mobility = this._mobilityAssets().get(assetId) || {};
    return String(this._first(
      row.display_name,
      row.asset_label,
      row.label,
      mobility.display_name,
      mobility.name,
      this.mobilityRuntime?.assetDisplayName?.(assetId),
      assetId
    ) || assetId);
  }

  _meteringRows(periodId = "today") {
    const state = this._state("metering");
    const attrs = state?.attributes || {};
    const wanted = String(periodId || "today").toLowerCase() === "day" ? "today" : String(periodId || "today").toLowerCase();
    const mobility = this._mobilityAssets();
    const records = this._rows(attrs.records_json).map((row) => ({...row}));
    return records.filter((row) => {
      const period = String(this._first(row.period_id, row.period, row.context?.value, "") || "").toLowerCase();
      const role = String(this._first(row.record_role, "") || "").toLowerCase();
      const id = this._assetId(row);
      return period === wanted
        && row.ux_visible === true
        && role === "flexible_load_detail"
        && mobility.has(id);
    }).map((row) => {
      const assetId = this._assetId(row);
      return Object.freeze({
        assetId,
        name: this._assetName(assetId, row),
        periodId: wanted,
        energyKwh: this._number(row.energy_kwh, row.value),
        unit: String(this._first(row.unit, "kWh") || "kWh"),
        measurementState: String(this._first(row.measurement_state, row.status, row.health, "UNAVAILABLE") || "UNAVAILABLE"),
        attributionState: String(this._first(row.attribution_state, "") || ""),
        trustState: String(this._first(row.trust_state, "") || ""),
        sourceLabel: String(this._first(row.source_label, "") || ""),
        raw: row
      });
    });
  }

  _valueRows(periodId = "today") {
    const state = this._state("value");
    const attrs = state?.attributes || {};
    const summary = this._object(this._first(attrs.summary_json, attrs.summary, {}));
    const selected = this._object(this._first(attrs.selected_context_json, attrs.selected_context, {}));
    const selectedPeriod = String(this._first(selected.value, selected.period_id, periodId, "today") || "today").toLowerCase();
    const mobility = this._mobilityAssets();
    const consumers = this._rows(this._first(summary.consumer_allocation, attrs.consumer_allocation_json, attrs.flexible_asset_value_json, []));
    return consumers.filter((row) => mobility.has(this._assetId(row))).map((row) => {
      const assetId = this._assetId(row);
      return Object.freeze({
        assetId,
        name: this._assetName(assetId, row),
        periodId: selectedPeriod,
        attributedEur: this._number(row.attributed_eur, row.attributed_value, row.net_value_eur, row.actual_energy_cost_eur),
        energyKwh: this._number(row.energy_kwh, row.actual_energy_kwh, row.measured_energy_kwh),
        state: String(this._first(row.state, row.status, row.attribution_state, "") || ""),
        raw: row
      });
    });
  }

  viewModel(periodId = "today") {
    const meteringState = this._state("metering");
    const valueState = this._state("value");
    const meteringAttrs = meteringState?.attributes || {};
    const valueAttrs = valueState?.attributes || {};
    const valueSummary = this._object(this._first(valueAttrs.summary_json, valueAttrs.summary, {}));
    const valueProductStatus = this._object(this._first(valueAttrs.product_status_json, {}));
    const meteringRows = this._meteringRows(periodId);
    const valueRows = this._valueRows(periodId);
    const ids = new Set([...meteringRows.map((row)=>row.assetId), ...valueRows.map((row)=>row.assetId)]);
    const byAsset = [...ids].map((assetId) => {
      const metering = meteringRows.find((row)=>row.assetId===assetId) || null;
      const value = valueRows.find((row)=>row.assetId===assetId) || null;
      return Object.freeze({
        assetId,
        name: metering?.name || value?.name || this._assetName(assetId),
        energyKwh: metering?.energyKwh ?? value?.energyKwh ?? null,
        measurementState: metering?.measurementState || "UNAVAILABLE",
        trustState: metering?.trustState || "",
        attributedEur: value?.attributedEur ?? null,
        valueState: value?.state || "",
        metering,
        value
      });
    });
    return Object.freeze({
      periodId: String(periodId || "today").toLowerCase(),
      meteringAvailable: !!meteringState,
      valueAvailable: !!valueState,
      meteringContractVersion: String(this._first(meteringAttrs.contract_version, meteringAttrs.release, "") || ""),
      valueContractVersion: String(this._first(valueAttrs.contract_version, valueAttrs.release, "") || ""),
      valueCurrency: String(this._first(valueSummary.currency, valueAttrs.currency, "EUR") || "EUR"),
      valueState: String(this._first(valueProductStatus.state, valueAttrs.status, "UNAVAILABLE") || "UNAVAILABLE"),
      rows: byAsset,
      totalVehicleEnergyKwh: byAsset.some((row)=>row.energyKwh!==null)
        ? byAsset.reduce((sum,row)=>sum+(row.energyKwh ?? 0),0)
        : null,
      totalAttributedEur: byAsset.some((row)=>row.attributedEur!==null)
        ? byAsset.reduce((sum,row)=>sum+(row.attributedEur ?? 0),0)
        : null,
      source: "Energy public UX metering/value contracts"
    });
  }
}
