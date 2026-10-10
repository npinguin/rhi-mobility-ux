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
  _meteringRows(periodId='today') {
    const mobility=this._mobilityAssets();
    return this.energy.canonicalRows().filter(row=>row.availability==='AVAILABLE' &&
      row.presentation_surface==='metering' && mobility.has(row.asset_id) &&
      String(row.property_key).includes(String(periodId).toLowerCase())).map(row=>Object.freeze({
        assetId:row.asset_id,name:this._assetName(row.asset_id),periodId,
        energyKwh:this._number(row.value),unit:'kWh',measurementState:'AVAILABLE',
        trustState:'',raw:row
      }));
  }
  _valueRows(periodId='today') {
    const mobility=this._mobilityAssets();
    return this.energy.canonicalRows().filter(row=>row.availability==='AVAILABLE' &&
      row.presentation_surface==='value_accounting' && mobility.has(row.asset_id) &&
      String(row.property_key).includes(String(periodId).toLowerCase())).map(row=>Object.freeze({
        assetId:row.asset_id,name:this._assetName(row.asset_id),periodId,
        attributedEur:this._number(row.value),energyKwh:null,state:'AVAILABLE',raw:row
      }));
  }
  viewModel(periodId="today") {
    const snapshot=this.energy.snapshot();
    const metering=this.energy.canonicalRows().filter(row=>row.presentation_surface==="metering");
    const accounting=this.energy.canonicalRows().filter(row=>row.presentation_surface==="value_accounting");
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
      meteringAvailable:snapshot.available && metering.length>0,
      valueAvailable:snapshot.available && accounting.length>0,
      meteringContractVersion:snapshot.contractVersion,
      valueContractVersion:snapshot.contractVersion,
      valueCurrency:"EUR",
      valueState:valueRows.length?"AVAILABLE":"UNAVAILABLE",
      rows,
      totalVehicleEnergyKwh:null,
      totalAttributedEur:null,
      source:"RHI_ENERGY_CANONICAL_PROPERTY_V2.metering/value_accounting"
    });
  }
}
