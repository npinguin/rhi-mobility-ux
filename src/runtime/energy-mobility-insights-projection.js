// Read-only Energy metering/value projection for Mobility Insights.
// Only RHI_ENERGY_PUBLIC_CONTRACT_V2 is authoritative; missing V2 evidence fails closed.
class HomeBrainEnergyMobilityInsightsProjection {
  constructor(hass, mobilityRuntime = null) {
    this.energy = new HomeBrainEnergyPublicV2Projection(hass);
    this.mobilityRuntime = mobilityRuntime || null;
  }
  _first(...values) { for (const value of values) if (value !== undefined && value !== null && value !== "") return value; return null; }
  _number(...values) { const value=this._first(...values); if(value===null) return null; const n=Number(value); return Number.isFinite(n)?n:null; }
  _mobilityAssets() {
    try { return new Map((this.mobilityRuntime?.mobilityRegistry?.() || []).map(row=>[String(row?.asset_id || ""),row]).filter(([id])=>id)); }
    catch (_) { return new Map(); }
  }
  _assetId(row={}) { return String(this._first(row.asset_id,row.consumer_asset_id,row.child_asset_id,row.target_asset_id,row.flexible_asset_id,row.participant_id,"") || ""); }
  _assetName(assetId,row={}) {
    const mobility=this._mobilityAssets().get(assetId) || {};
    return String(this._first(row.display_name,row.asset_label,row.label,mobility.display_name,mobility.name,this.mobilityRuntime?.assetDisplayName?.(assetId),assetId) || assetId);
  }
  _meteringRows(periodId="today") {
    const metering=this.energy.section("metering");
    const wanted=String(periodId || "today").toLowerCase()==="day"?"today":String(periodId || "today").toLowerCase();
    const mobility=this._mobilityAssets();
    return this.energy.rows(metering.records).filter(row=>{
      const period=String(this._first(row.period_id,row.period,"") || "").toLowerCase();
      const id=this._assetId(row);
      return period===wanted && row.ux_visible===true && String(row.record_role || "").toLowerCase()==="flexible_load_detail" && mobility.has(id);
    }).map(row=>{
      const assetId=this._assetId(row);
      return Object.freeze({assetId,name:this._assetName(assetId,row),periodId:wanted,energyKwh:this._number(row.energy_kwh,row.value),unit:String(row.unit || "kWh"),measurementState:String(this._first(row.measurement_state,row.status,row.health,"UNAVAILABLE") || "UNAVAILABLE"),trustState:String(row.trust_state || ""),raw:row});
    });
  }
  _valueRows(periodId="today") {
    const accounting=this.energy.section("value_accounting");
    const wanted=String(periodId || accounting.selected_period_id || "today").toLowerCase();
    const periods=this.energy.object(accounting.periods);
    const period=this.energy.object(periods[wanted]);
    const mobility=this._mobilityAssets();
    return this.energy.rows(period.consumer_allocation).filter(row=>mobility.has(this._assetId(row))).map(row=>{
      const assetId=this._assetId(row);
      return Object.freeze({assetId,name:this._assetName(assetId,row),periodId:wanted,attributedEur:this._number(row.attributed_eur,row.attributed_value,row.net_value_eur,row.actual_energy_cost_eur),energyKwh:this._number(row.energy_kwh,row.actual_energy_kwh,row.measured_energy_kwh),state:String(this._first(row.state,row.status,row.attribution_state,"") || ""),raw:row});
    });
  }
  viewModel(periodId="today") {
    const snapshot=this.energy.snapshot();
    const metering=this.energy.section("metering");
    const accounting=this.energy.section("value_accounting");
    const meteringRows=this._meteringRows(periodId);
    const valueRows=this._valueRows(periodId);
    const ids=new Set([...meteringRows.map(row=>row.assetId),...valueRows.map(row=>row.assetId)]);
    const rows=[...ids].map(assetId=>{
      const m=meteringRows.find(row=>row.assetId===assetId)||null;
      const v=valueRows.find(row=>row.assetId===assetId)||null;
      return Object.freeze({assetId,name:m?.name||v?.name||this._assetName(assetId),energyKwh:m?.energyKwh??v?.energyKwh??null,measurementState:m?.measurementState||"UNAVAILABLE",trustState:m?.trustState||"",attributedEur:v?.attributedEur??null,valueState:v?.state||"",metering:m,value:v});
    });
    return Object.freeze({
      periodId:String(periodId || "today").toLowerCase(),
      meteringAvailable:snapshot.available && this.energy.rows(metering.records).length>0,
      valueAvailable:snapshot.available && Object.keys(this.energy.object(accounting.periods)).length>0,
      meteringContractVersion:snapshot.contractVersion,
      valueContractVersion:snapshot.contractVersion,
      valueCurrency:String(accounting.currency || "EUR"),
      valueState:String(this._first(accounting.status,accounting.state,"UNAVAILABLE") || "UNAVAILABLE"),
      rows,
      totalVehicleEnergyKwh:null,
      totalAttributedEur:null,
      source:"RHI_ENERGY_PUBLIC_CONTRACT_V2.metering/value_accounting"
    });
  }
}
