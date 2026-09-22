// Read-only Energy strategy projection for Mobility Intelligence.
// Strategy semantics stay Energy-owned. Mobility only projects profiles relevant
// to flexible/vehicle energy plus effective policies for exact Mobility asset ids.

class HomeBrainEnergyMobilityStrategyProjection {
  constructor(hass, mobilityRuntime = null) {
    this.hass = hass || {};
    this.mobilityRuntime = mobilityRuntime || null;
  }

  static get entities() {
    return Object.freeze({
      profiles: "sensor.energy_strategy_profile_index",
      effective: "sensor.energy_strategy_effective_index"
    });
  }

  _state(key) {
    const id = HomeBrainEnergyMobilityStrategyProjection.entities[key];
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

  _mobilityAssets() {
    try {
      const rows = this.mobilityRuntime?.mobilityRegistry?.() || [];
      return new Map(rows.map((row) => [String(row?.asset_id || ""), row]).filter(([id]) => id));
    } catch (_) {
      return new Map();
    }
  }

  _profileRows() {
    const state = this._state("profiles");
    const attrs = state?.attributes || {};
    let rows = this._rows(this._first(
      attrs.strategy_profiles_json,
      attrs.strategy_profiles,
      attrs.profiles_json,
      attrs.profiles,
      attrs.profile_rows_json,
      attrs.profile_rows,
      attrs.rows_json,
      attrs.rows,
      []
    ));
    const byId = this._object(this._first(attrs.profiles_by_id, attrs.strategy_profiles_by_id, {}));
    if (!rows.length && Object.keys(byId).length) rows = Object.entries(byId).map(([profile_id,row])=>({profile_id,...this._object(row)}));
    return rows.map((row,index)=>{
      const nested=this._object(this._first(row.strategy_profile,row.profile,row.energy_strategy_profile,{}));
      const id=String(this._first(row.profile_id,row.strategy_profile_id,row.id,row.type_id,row.profile_type,row.asset_type,nested.profile_id,nested.profile_type,`strategy_profile_${index+1}`)||"");
      const label=String(this._first(row.profile_label,row.display_name,row.name,row.label,nested.profile_label,nested.display_name,nested.name,id)||id);
      return {...row,...nested,profile_id:id,profile_label:label};
    }).filter((row)=>{
      const text=[row.profile_id,row.profile_label,row.profile_type,row.asset_type,row.domain_id,row.subdomain_id].filter(Boolean).join(" ").toLowerCase();
      return /vehicle|charger|consumer|flexible|mobility/.test(text);
    });
  }

  _effectiveRows() {
    const state = this._state("effective");
    const attrs = state?.attributes || {};
    const mobility = this._mobilityAssets();
    let rows = this._rows(this._first(
      attrs.current_policies_json,
      attrs.current_policies,
      attrs.policies_json,
      attrs.policies,
      attrs.effective_strategies_json,
      attrs.effective_strategies,
      attrs.asset_strategies_json,
      attrs.asset_strategies,
      attrs.strategy_rows_json,
      attrs.strategy_rows,
      attrs.rows_json,
      attrs.rows,
      attrs.assets_json,
      attrs.assets,
      []
    ));
    return rows.map((row,index)=>{
      const nested=this._object(this._first(row.effective_strategy,row.energy_strategy,row.strategy,{}));
      const assetId=String(this._first(row.asset_id,row.target_asset_id,row.flexible_asset_id,nested.asset_id,"")||"");
      const policyId=String(this._first(row.policy_id,nested.policy_id,row.strategy_id,row.id,`effective_strategy_${index+1}`)||"");
      return {...row,...nested,asset_id:assetId,policy_id:policyId};
    }).filter((row)=>row.asset_id && mobility.has(row.asset_id));
  }

  viewModel() {
    const profileState=this._state("profiles");
    const effectiveState=this._state("effective");
    const profiles=this._profileRows();
    const effective=this._effectiveRows();
    return Object.freeze({
      profilesAvailable:!!profileState,
      effectiveAvailable:!!effectiveState,
      profileContractVersion:String(this._first(profileState?.attributes?.contract_version,profileState?.attributes?.release,"")||""),
      effectiveContractVersion:String(this._first(effectiveState?.attributes?.contract_version,effectiveState?.attributes?.release,"")||""),
      profiles,
      effective,
      source:"Energy public UX strategy contracts"
    });
  }
}
