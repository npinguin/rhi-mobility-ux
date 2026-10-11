// Read-only cross-domain Energy Planning projection for Mobility UX.
// Energy owns effective/baseline selection, horizon quality and schedule details.
// No UI-fabricated totals, EMHASS fallback, source aliases or guessed asset join.
class HomeBrainEnergyPlanningProjection {
  constructor(hass, mobilityRuntime = null) {
    this.energy=new HomeBrainEnergyCanonicalProjection(hass);
    this.mobilityRuntime=mobilityRuntime||null;
  }
  _first(...values) {
    for(const value of values) if(value!==undefined && value!==null && value!=='') return value;
    return null;
  }
  _number(value) {
    if(value===null || value===undefined || value==='') return null;
    const number=Number(value);
    return Number.isFinite(number)?number:null;
  }
  _mobilityAssetIds() {
    try{return new Set((this.mobilityRuntime?.mobilityRegistry?.()||[])
      .map(row=>String(row?.asset_id||'')).filter(Boolean));}
    catch(_){return new Set();}
  }
  _assetId(row={}) {
    return String(this._first(row.asset_id,row.target_asset_id,
      row.flexible_asset_id,row.consumer_asset_id,row.participant_id,'')||'');
  }
  _totalsView(horizon,publication) {
    const day=horizon==='D0'?'today':'tomorrow';
    const metric=key=>this.energy.nativeMetric('planning_'+day+'_'+key);
    const raw=publication.available?publication.details||{}:{};
    const own=key=>this._number(this._first(raw[key],metric(key).value));
    return Object.freeze({
      plannedKwh:own('flexible_planned_kwh'),
      stillToPlanKwh:own('flexible_still_to_plan_kwh'),
      requiredKwh:own('flexible_required_kwh'),
      gridImportKwh:publication.available?this._number(raw.grid_import_kwh):null,
      solarKwh:publication.available?this._number(raw.solar_kwh):null,
      // Numeric metric availability is not proof of an effective plan.
      state:publication.status,
      provisional:!publication.available,
      reason:publication.reason,
      raw:publication.available?raw:{}
    });
  }
  _assetScheduleRows(publications) {
    const rows=[];
    for(const publication of publications) {
      if(!publication.available) continue;
      const details=publication.details||{};
      const horizon=publication.metadata.horizon_id;
      // Planning asset and bucket allocations are published by Energy, not
      // reconstructed from the number of hours or charger observations.
      for(const asset of Array.isArray(details.planning_assets)?details.planning_assets:[])
        if(asset && typeof asset==='object') rows.push({...asset,horizon_id:horizon});
      for(const bucket of Array.isArray(details.buckets)?details.buckets:[]) {
        if(!bucket || typeof bucket!=='object') continue;
        for(const asset of Array.isArray(bucket.asset_allocations)?bucket.asset_allocations:[])
          if(asset && typeof asset==='object') rows.push({...asset,horizon_id:horizon,
            bucket_id:bucket.bucket_id||'',window_start:bucket.start||bucket.starts_at||'',
            window_end:bucket.end||bucket.ends_at||''});
      }
    }
    const ids=this._mobilityAssetIds();
    return ids.size?rows.filter(row=>ids.has(this._assetId(row))):[];
  }
  viewModel() {
    const d0=this.energy.planningHorizon('D0','effective');
    const d1=this.energy.planningHorizon('D1','effective');
    const baselineD0=this.energy.planningHorizon('D0','baseline');
    const baselineD1=this.energy.planningHorizon('D1','baseline');
    const publications=[d0,d1];
    const today=this._totalsView('D0',d0);
    const tomorrow=this._totalsView('D1',d1);
    const bothAvailable=d0.available&&d1.available;
    const someAvailable=d0.available||d1.available;
    const anyPublished=d0.published||d1.published;
    const metadata=d0.metadata||d1.metadata||null;
    const requestedProvider=metadata?.requested_provider||'';
    const effectiveProvider=metadata?.provider_id||'';
    const providerHold=!!requestedProvider&&!effectiveProvider;
    const reason=providerHold
      ? String(metadata?.reason_code||'requested_provider_not_effective')
      : publications.find(row=>!row.available)?.reason||'';
    const properties=this.energy.canonicalRows().filter(row=>row.availability==='AVAILABLE'&&
      row.presentation_surface==='planning');
    const scheduleRows=this._assetScheduleRows(publications);
    const ids=this._mobilityAssetIds();
    return Object.freeze({
      available:someAvailable,
      complete:bothAvailable,
      published:anyPublished,
      entityId:null,
      contractVersion:'RHI_ENERGY_PLANNING_HORIZON_V1',
      state:bothAvailable?'AVAILABLE':anyPublished?'INCOMPLETE':'UNAVAILABLE',
      requestedProvider,
      effectiveProvider,
      providerHold,
      reason,
      today,tomorrow,
      baselineAvailable:baselineD0.available||baselineD1.available,
      baselineStatus:Object.freeze({D0:baselineD0.status,D1:baselineD1.status}),
      // Baseline evidence never becomes an effective or executable plan.
      combined:Object.freeze({plannedKwh:null,stillToPlanKwh:null,
        gridImportKwh:null,solarKwh:null,state:'',raw:{}}),
      currentIntent:{},
      planningRows:properties,
      experienceRows:[],
      mobilityPlanningRows:scheduleRows,
      mobilityExperienceRows:[],
      exactIdentityJoin:ids.size>0,
      source:'rhi_energy.runtime/native_horizon',
      quality:Object.freeze({D0:d0.status,D1:d1.status})
    });
  }
}
