// Cross-domain Energy canonical-property projection for Mobility UX.
// Never read the retired aggregate publication or infer missing semantics.
class HomeBrainEnergyCanonicalProjection {
  constructor(hass = {}) { this.hass = hass || {}; }
  static get contractId() { return 'RHI_ENERGY_CANONICAL_PROPERTY_V2'; }
  canonicalRows() {
    const published=Object.entries(this.hass?.states || {}).flatMap(([entityId, state]) => {
      const a=state?.attributes || {};
      if(a.canonical_contract !== HomeBrainEnergyCanonicalProjection.contractId ||
         !a.asset_id || !a.property_key) return [];
      const raw=String(state?.state ?? '').trim().toLowerCase();
      const availability=String(a.availability || '').toUpperCase();
      const quality=String(a.quality || '').toUpperCase();
      const semantic=Object.hasOwn(a,'value')?a.value:state.state;
      const invalidValue=semantic===undefined || semantic===null ||
        (typeof semantic==='string' && ['unknown','unavailable','none','null',''].includes(semantic.trim().toLowerCase()));
      const valid=!['unknown','unavailable','none','null',''].includes(raw) && !invalidValue &&
        (availability === '' || availability === 'AVAILABLE') &&
        !['STALE','INVALID','UNKNOWN'].includes(quality);
      return [Object.freeze({entity_id:entityId,asset_id:String(a.asset_id),
        property_key:String(a.property_key),value:valid?semantic:null,
        availability:valid?'AVAILABLE':'UNAVAILABLE',
        presentation_family:a.presentation_family || '',
        presentation_role:a.presentation_role || '',
        presentation_surface:a.presentation_surface || '',
        // Only explicit backend metadata may bind a reading to a time period
        // or a configuration editor. Property-key substrings have no authority.
        period_id:String(a.period_id || ''),
        unit:String(a.unit || a.unit_of_measurement || ''),
        editable:a.editable === true || a.write_supported === true})];
    });
    // No arbitrary winner when the same asset/property is published twice.
    const counts=new Map();
    for(const row of published) {
      const key=`${row.asset_id}::${row.property_key}`;
      counts.set(key,(counts.get(key)||0)+1);
    }
    return published.filter(row=>counts.get(`${row.asset_id}::${row.property_key}`)===1);
  }
  // Energy publishes D0/D1 planning totals as native metrics rather than
  // synthetic D0/D1 canonical assets. Only exact producer-owned keys qualify.
  nativeMetric(metricKey='') {
    const key=String(metricKey||'').trim();
    const matches=Object.entries(this.hass?.states||{}).filter(([,state])=>
      state?.attributes?.canonical_source==='rhi_energy.runtime' &&
      String(state?.attributes?.metric_key||'')===key);
    if(!key || matches.length!==1) return Object.freeze({available:false,value:null,
      reason:matches.length>1?'duplicate_native_energy_metric':'native_energy_metric_not_published'});
    const [entityId,state]=matches[0];
    const attrs=state?.attributes||{};
    const raw=String(state?.state??'').trim();
    const numeric=raw && !['unknown','unavailable','none','null'].includes(raw.toLowerCase()) ? Number(raw) : NaN;
    const quality=String(attrs.quality||'').trim().toUpperCase();
    const valid=String(attrs.availability||'').toUpperCase()==='AVAILABLE' &&
      Number.isFinite(numeric) && !['STALE','INVALID','UNKNOWN'].includes(quality);
    return Object.freeze({available:valid,value:valid?numeric:null,
      entity_id:entityId,unit:String(attrs.unit_of_measurement||''),
      reason:valid?'':String(attrs.reason_code||'native_energy_metric_unavailable'),
      provenance:attrs.provenance||null});
  }
  object(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value !== 'string') return {};
    try { const parsed=JSON.parse(value); return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}; } catch (_) { return {}; }
  }
  rows(value) {
    if (value === undefined) return this.canonicalRows();
    if (Array.isArray(value)) return value.filter(row=>row && typeof row==='object');
    const parsed=this.object(value);
    return Object.values(parsed).filter(row=>row && typeof row==='object');
  }
  snapshot() {
    const rows=this.canonicalRows();
    return Object.freeze({available:rows.length>0,contractId:HomeBrainEnergyCanonicalProjection.contractId,
      attributes:Object.freeze({properties:rows})});
  }
  section(name) {
    const wanted=String(name || '');
    return {properties:this.canonicalRows().filter(row=>row.presentation_surface===wanted)};
  }
}

// Transitional class alias for existing consumers; the retired transport is not read.
const HomeBrainEnergyPublicV2Projection = HomeBrainEnergyCanonicalProjection;
