// Read-only Energy strategy projection for Mobility Intelligence.
// Strategy semantics stay Energy-owned and are consumed only from Public V2 configuration.strategy.
class HomeBrainEnergyMobilityStrategyProjection {
  constructor(hass, mobilityRuntime = null) {
    this.energy = new HomeBrainEnergyPublicV2Projection(hass);
    this.mobilityRuntime = mobilityRuntime || null;
  }
  _mobilityAssets() {
    try { return new Map((this.mobilityRuntime?.mobilityRegistry?.() || []).map(row=>[String(row?.asset_id || ""),row]).filter(([id])=>id)); }
    catch (_) { return new Map(); }
  }
  _assetId(row={}) { return String(row.asset_id || row.target_asset_id || row.flexible_asset_id || ""); }
  _strategy() { return this.energy.object(this.energy.section("configuration").strategy); }
  _configuredRows() {
    const strategy=this._strategy();
    const configured=this.energy.object(strategy.configured);
    const mobility=this._mobilityAssets();
    return this.energy.rows(configured.properties).filter(row=>{ const id=this._assetId(row); return !id || mobility.has(id); });
  }
  _effectiveRows() {
    const strategy=this._strategy();
    const effective=this.energy.object(strategy.effective);
    const mobility=this._mobilityAssets();
    return this.energy.rows(effective.properties).filter(row=>{ const id=this._assetId(row); return !id || mobility.has(id); });
  }
  viewModel() {
    const snapshot=this.energy.snapshot();
    const strategy=this._strategy();
    const configured=this.energy.object(strategy.configured);
    const effective=this.energy.object(strategy.effective);
    return Object.freeze({
      profilesAvailable:false,
      effectiveAvailable:snapshot.available && Object.keys(effective).length>0,
      profileContractVersion:snapshot.contractVersion,
      effectiveContractVersion:snapshot.contractVersion,
      profiles:[],
      configured:this._configuredRows(),
      effective:this._effectiveRows(),
      configuredState:String(configured.status || "UNAVAILABLE"),
      effectiveState:String(effective.status || "UNAVAILABLE"),
      source:"RHI_ENERGY_PUBLIC_CONTRACT_V2.configuration.strategy"
    });
  }
}
