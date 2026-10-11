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
  _strategyRows(kind) {
    const mobility=this._mobilityAssets();
    return this.energy.canonicalRows().filter(row=>
      row.availability==='AVAILABLE' &&
      String(row.presentation_surface).toLowerCase()==='configuration' &&
      String(row.property_key).toLowerCase().includes('strategy') &&
      String(row.property_key).toLowerCase().includes(kind) &&
      (!row.asset_id || mobility.has(row.asset_id)));
  }
  _configuredRows() { return this._strategyRows('configured'); }
  _effectiveRows() { return this._strategyRows('effective'); }
  viewModel() {
    const configured=this._configuredRows();
    const effective=this._effectiveRows();
    return Object.freeze({
      profilesAvailable:false,
      effectiveAvailable:effective.length>0,
      profileContractVersion:'RHI_ENERGY_CANONICAL_PROPERTY_V2',
      effectiveContractVersion:'RHI_ENERGY_CANONICAL_PROPERTY_V2',
      profiles:[],configured,effective,
      configuredState:configured.length?'AVAILABLE':'UNAVAILABLE',
      effectiveState:effective.length?'AVAILABLE':'UNAVAILABLE',
      source:'RHI_ENERGY_CANONICAL_PROPERTY_V2.configuration.strategy'
    });
  }
}
