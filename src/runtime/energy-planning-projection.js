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
    const properties=this.energy.canonicalRows().filter(row=>row.availability==='AVAILABLE');
    const ids=this._mobilityAssetIds();
    const planning=properties.filter(row=>String(row.presentation_surface).toLowerCase()==='planning');
    // No fabricated D0/D1 asset identities: use the exact native metric
    // publications from Energy's canonical runtime, preserving unknown != 0.
    const metric=(horizon,suffix)=>this.energy.nativeMetric(
      (horizon==='D0'?'planning_today_':'planning_tomorrow_')+suffix);
    const totals=(horizon)=>this._totalsView({
      flexible_planned_kwh:metric(horizon,'flexible_planned_kwh').value,
      flexible_still_to_plan_kwh:metric(horizon,'flexible_still_to_plan_kwh').value
    });
    const today=totals('D0');
    const tomorrow=totals('D1');
    const hasTotals=['D0','D1'].some(horizon=>
      ['flexible_planned_kwh','flexible_still_to_plan_kwh'].some(key=>metric(horizon,key).available));
    const mobilityPlanningRows=planning.filter(row=>ids.has(row.asset_id));
    return Object.freeze({
      available:hasTotals || planning.length>0,
      entityId:null,
      contractVersion:'RHI_ENERGY_CANONICAL_PROPERTY_V2',
      state:hasTotals || planning.length?'AVAILABLE':'UNAVAILABLE',
      today,tomorrow,
      combined:Object.freeze({plannedKwh:null,stillToPlanKwh:null,gridImportKwh:null,solarKwh:null,state:'',raw:{}}),
      currentIntent:{},
      planningRows:planning,
      experienceRows:[],
      mobilityPlanningRows,
      mobilityExperienceRows:[],
      exactIdentityJoin:ids.size>0,
      source:'rhi_energy.runtime/native_metric'
    });
  }
}
