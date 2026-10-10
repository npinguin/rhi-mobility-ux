// Cross-domain Energy canonical-property projection for Mobility UX.
// Never read the retired aggregate publication or infer missing semantics.
class HomeBrainEnergyCanonicalProjection {
  constructor(hass = {}) { this.hass = hass || {}; }
  static get contractId() { return 'RHI_ENERGY_CANONICAL_PROPERTY_V2'; }
  rows() {
    return Object.entries(this.hass?.states || {}).flatMap(([entityId, state]) => {
      const a=state?.attributes || {};
      if(a.canonical_contract !== HomeBrainEnergyCanonicalProjection.contractId ||
         !a.asset_id || !a.property_key) return [];
      const raw=String(state?.state ?? '').trim().toLowerCase();
      const availability=String(a.availability || '').toUpperCase();
      const quality=String(a.quality || '').toUpperCase();
      const valid=!['unknown','unavailable','none','null',''].includes(raw) &&
        (availability === '' || availability === 'AVAILABLE') &&
        !['STALE','INVALID','UNKNOWN'].includes(quality);
      return [Object.freeze({entity_id:entityId,asset_id:String(a.asset_id),
        property_key:String(a.property_key),value:valid?(Object.hasOwn(a,'value')?a.value:state.state):null,
        availability:valid?'AVAILABLE':'UNAVAILABLE',
        presentation_family:a.presentation_family || '',
        presentation_role:a.presentation_role || '',
        presentation_surface:a.presentation_surface || ''})];
    });
  }
  object(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value !== 'string') return {};
    try { const parsed=JSON.parse(value); return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}; } catch (_) { return {}; }
  }
  snapshot() {
    const rows=this.rows();
    return Object.freeze({available:rows.length>0,contractId:HomeBrainEnergyCanonicalProjection.contractId,
      attributes:Object.freeze({properties:rows})});
  }
  section(name) {
    const wanted=String(name || '');
    return {properties:this.rows().filter(row=>row.presentation_surface===wanted)};
  }
}

// Transitional class alias for existing consumers; the retired transport is not read.
const HomeBrainEnergyPublicV2Projection = HomeBrainEnergyCanonicalProjection;
