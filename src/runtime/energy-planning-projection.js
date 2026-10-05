// Read-only cross-domain Energy Planning projection for Mobility UX.
// Energy remains semantic owner. No legacy Energy index/entity fallback is permitted.
class HomeBrainEnergyPlanningProjection {
  constructor(hass, mobilityRuntime = null) {
    this.energy = new HomeBrainEnergyPublicV2Projection(hass);
    this.mobilityRuntime = mobilityRuntime || null;
  }
  _first(...values) { for (const value of values) if (value !== undefined && value !== null && value !== "") return value; return null; }
  _number(...values) { const value=this._first(...values); if(value===null) return null; const n=Number(value); return Number.isFinite(n)?n:null; }
  _mobilityAssetIds() {
    try { return new Set((this.mobilityRuntime?.mobilityRegistry?.() || []).map(row=>String(row?.asset_id || "")).filter(Boolean)); }
    catch (_) { return new Set(); }
  }
  _assetId(row={}) { return String(this._first(row.asset_id,row.target_asset_id,row.flexible_asset_id,row.consumer_asset_id,row.participant_id,"") || ""); }
  _mobilityRows(rows=[]) { const ids=this._mobilityAssetIds(); return ids.size ? rows.filter(row=>ids.has(this._assetId(row))) : []; }
  _totalsView(row={}) {
    return Object.freeze({
      plannedKwh:this._number(row.flexible_planned_kwh,row.planned_kwh),
      stillToPlanKwh:this._number(row.flexible_still_to_plan_kwh,row.still_to_plan_kwh),
      gridImportKwh:this._number(row.grid_import_kwh,row.grid_in_kwh),
      solarKwh:this._number(row.solar_kwh,row.solar_production_kwh),
      state:String(this._first(row.state,row.status,row.planning_state,"") || ""),
      raw:row
    });
  }
  viewModel() {
    const snapshot=this.energy.snapshot();
    const planning=this.energy.section("planning");
    const horizons=this.energy.object(planning.horizons);
    const d0=this.energy.object(horizons.D0 || horizons.d0);
    const d1=this.energy.object(horizons.D1 || horizons.d1);
    const planningRows=this.energy.rows(planning.assets || planning.planning_objects);
    const experienceRows=this.energy.rows(planning.experiences || planning.asset_experiences);
    return Object.freeze({
      available:snapshot.available && (Object.keys(d0).length>0 || Object.keys(d1).length>0),
      entityId:snapshot.entityId,
      contractVersion:snapshot.contractVersion,
      state:String(this._first(planning.status,planning.state,snapshot.state,"UNAVAILABLE") || "UNAVAILABLE"),
      today:this._totalsView(d0),
      tomorrow:this._totalsView(d1),
      combined:Object.freeze({plannedKwh:null,stillToPlanKwh:null,gridImportKwh:null,solarKwh:null,state:"",raw:{}}),
      currentIntent:this.energy.object(planning.current_action_intent),
      planningRows,
      experienceRows,
      mobilityPlanningRows:this._mobilityRows(planningRows),
      mobilityExperienceRows:this._mobilityRows(experienceRows),
      exactIdentityJoin:this._mobilityAssetIds().size>0,
      source:"RHI_ENERGY_PUBLIC_CONTRACT_V2.planning"
    });
  }
}
