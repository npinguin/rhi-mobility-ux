// Read-only cross-domain Energy Planning projection for Mobility UX.
// Energy remains the semantic owner. This adapter only reads explicitly public
// Energy UX entities and joins planning rows to canonical Mobility asset ids.

class HomeBrainEnergyPlanningProjection {
  constructor(hass, mobilityRuntime = null) {
    this.hass = hass || {};
    this.mobilityRuntime = mobilityRuntime || null;
  }

  static get entities() {
    return Object.freeze({
      planning: "sensor.energy_planning_index",
      planningExperience: "sensor.energy_planning_experience_index",
      flexibleAssets: "sensor.energy_flexible_asset_index",
      strategyProfiles: "sensor.energy_strategy_profile_index",
      strategyEffective: "sensor.energy_strategy_effective_index"
    });
  }

  _state(key) {
    const id = HomeBrainEnergyPlanningProjection.entities[key];
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

  _mobilityAssetIds() {
    try {
      const rows = this.mobilityRuntime?.mobilityRegistry?.() || [];
      return new Set(rows.map((row) => String(row?.asset_id || "")).filter(Boolean));
    } catch (_) {
      return new Set();
    }
  }

  _assetId(row = {}) {
    return String(this._first(row.asset_id, row.target_asset_id, row.flexible_asset_id, row.consumer_asset_id, row.participant_id, "") || "");
  }

  _mobilityRows(rows = []) {
    const ids = this._mobilityAssetIds();
    if (!ids.size) return [];
    return rows.filter((row) => ids.has(this._assetId(row)));
  }

  _totals(attrs, key) {
    const named = key === "today"
      ? this._first(attrs.planning_today_totals_json, attrs.planning_today_totals)
      : key === "tomorrow"
        ? this._first(attrs.planning_tomorrow_totals_json, attrs.planning_tomorrow_totals)
        : this._first(attrs.planning_combined_totals_json, attrs.planning_combined_totals);
    return this._object(named);
  }

  _totalsView(totals = {}) {
    const consumers = this._object(totals.consumers);
    return Object.freeze({
      plannedKwh: this._number(
        totals.planned_flexible_kwh,
        totals.flexible_planned_kwh,
        totals.managed_energy_kwh,
        totals.planned_energy_kwh,
        consumers.flexible_loads_kwh,
        consumers.flexible_assets_kwh
      ),
      stillToPlanKwh: this._number(
        totals.still_to_plan_kwh,
        totals.unplanned_kwh,
        totals.remaining_to_plan_kwh,
        totals.flexible_remaining_kwh,
        consumers.still_to_plan_kwh
      ),
      gridImportKwh: this._number(totals.grid_import_kwh, totals.grid_in_kwh),
      solarKwh: this._number(totals.solar_kwh, totals.solar_production_kwh, totals.solar_total_kwh),
      state: String(this._first(totals.state, totals.status, totals.planning_state, "") || ""),
      raw: totals
    });
  }

  viewModel() {
    const planningState = this._state("planning");
    const attrs = planningState?.attributes || {};
    const planningRows = this._rows(this._first(attrs.planning_assets_json, attrs.planning_assets, []));
    const experienceState = this._state("planningExperience");
    const experienceAttrs = experienceState?.attributes || {};
    const experienceRows = this._rows(this._first(
      experienceAttrs.rows_json,
      experienceAttrs.experiences_json,
      experienceAttrs.asset_experiences_json,
      experienceAttrs.rows,
      experienceAttrs.experiences,
      []
    ));
    const mobilityPlanningRows = this._mobilityRows(planningRows);
    const mobilityExperienceRows = this._mobilityRows(experienceRows);
    const currentIntent = this._object(this._first(attrs.current_action_intent_json, attrs.current_action_intent));
    const today = this._totalsView(this._totals(attrs, "today"));
    const tomorrow = this._totalsView(this._totals(attrs, "tomorrow"));
    const combined = this._totalsView(this._totals(attrs, "combined"));
    return Object.freeze({
      available: !!planningState,
      entityId: HomeBrainEnergyPlanningProjection.entities.planning,
      contractVersion: String(this._first(attrs.contract_version, attrs.release, "") || ""),
      state: String(planningState?.state || this._first(attrs.planning_state, attrs.status, "unavailable") || "unavailable"),
      today,
      tomorrow,
      combined,
      currentIntent,
      planningRows,
      experienceRows,
      mobilityPlanningRows,
      mobilityExperienceRows,
      exactIdentityJoin: this._mobilityAssetIds().size > 0,
      source: "Energy public UX contract"
    });
  }
}
