// Persistent Mobility canonical-property index.
//
// Mobility canonical property entities identify themselves with
// canonical_contract=MOBILITY_CANONICAL_PROPERTY_V2. This is the sole
// frontend property-truth contract. Aggregate Runtime V2 never backfills it.
class MobilityCanonicalPropertyIndex {
  constructor(hass = {}) {
    this.byEntity = new Map();
    this.byAsset = new Map();
    this.byAssetAndKey = new Map();
    this.stateRefs = new Map();
    this.assetRevisions = new Map();
    this._globalRevision = 0;
    this._stateCount = 0;
    this._hassRef = null;
    this.discover(hass);
  }

  isCanonicalPropertyState(state) {
    const attrs = state?.attributes || {};
    const contract=String(attrs.canonical_contract || '').toUpperCase();
    return contract === 'MOBILITY_CANONICAL_PROPERTY_V2'
      && !!String(attrs.asset_id || '').trim()
      && !!String(attrs.property_key || '').trim();
  }

  rawRow(entityId, state) {
    if (!this.isCanonicalPropertyState(state)) return null;
    const attrs = state.attributes || {};
    return {
      ...attrs,
      asset_id:String(attrs.asset_id || '').trim(),
      property_key:String(attrs.property_key || '').trim(),
      value:Object.prototype.hasOwnProperty.call(attrs,'value') ? attrs.value : state?.state,
      display_name:attrs.display_name || attrs.friendly_name || '',
      _source_entity_id:String(entityId || ''),
      canonical_contract:String(attrs.canonical_contract || 'MOBILITY_CANONICAL_PROPERTY_V2').toUpperCase()
    };
  }

  _index(entityId, state) {
    const row=this.rawRow(entityId,state);
    if(!row) return;
    this.byEntity.set(entityId,row);
    if(!this.byAsset.has(row.asset_id)) this.byAsset.set(row.asset_id,[]);
    this.byAsset.get(row.asset_id).push(row);
    const compound=`${row.asset_id}::${row.property_key}`;
    const current=this.byAssetAndKey.get(compound);
    if(!current) this.byAssetAndKey.set(compound,row);
    this.stateRefs.set(entityId,state);
  }

  discover(hass = {}) {
    this.byEntity.clear();
    this.byAsset.clear();
    this.byAssetAndKey.clear();
    this.stateRefs.clear();
    const states=hass?.states || {};
    this._hassRef=hass;
    this._stateCount=Object.keys(states).length;
    for(const [entityId,state] of Object.entries(states)) this._index(entityId,state);
    this._globalRevision += 1;
    for(const assetId of this.byAsset.keys()) this.assetRevisions.set(assetId,(this.assetRevisions.get(assetId)||0)+1);
    return this;
  }

  refresh(hass = {}) {
    const states=hass?.states || {};
    if(Object.keys(states).length !== this._stateCount) {
      this.discover(hass);
      return;
    }
    let metadataChanged=false;
    const changed=[];
    for(const [entityId,previous] of this.stateRefs.entries()) {
      const current=states[entityId];
      if(current===previous) continue;
      changed.push([entityId,current]);
      const before=this.byEntity.get(entityId);
      const after=this.rawRow(entityId,current);
      if(!after || !before ||
        before.asset_id!==after.asset_id ||
        before.property_key!==after.property_key ||
        before.component_id!==after.component_id ||
        before.section_id!==after.section_id ||
        before.visibility!==after.visibility ||
        before.render_as!==after.render_as) {
        metadataChanged=true;
        break;
      }
    }
    if(metadataChanged) {
      this.discover(hass);
      return;
    }
    const changedAssets=new Set();
    for(const [entityId,current] of changed) {
      const before=this.byEntity.get(entityId);
      const after=this.rawRow(entityId,current);
      this.byEntity.set(entityId,after);
      this.byAssetAndKey.set(`${after.asset_id}::${after.property_key}`,after);
      this.byAsset.set(after.asset_id,(this.byAsset.get(after.asset_id)||[]).map(row=>row._source_entity_id===entityId?after:row));
      this.stateRefs.set(entityId,current);
      changedAssets.add(after.asset_id);
    }
    if(changedAssets.size) {
      this._globalRevision += 1;
      changedAssets.forEach(assetId=>this.assetRevisions.set(assetId,(this.assetRevisions.get(assetId)||0)+1));
    }
    this._hassRef=hass;
  }

  rows(assetId = '') {
    const id=String(assetId || '').trim();
    const source=id ? [...(this.byAsset.get(id)||[])] : [...this.byEntity.values()];
    return source;
  }

  row(assetId='',propertyKey='') {
    return this.byAssetAndKey.get(`${String(assetId||'')}::${String(propertyKey||'')}`) || null;
  }

  entityIds(assetId='') {
    const id=String(assetId||'').trim();
    return this.rows(id).map(row=>row._source_entity_id).filter(Boolean);
  }

  revision(assetId='') {
    const id=String(assetId||'').trim();
    return id ? (this.assetRevisions.get(id)||0) : this._globalRevision;
  }
}

function mobilityCanonicalPropertyIndex(hass = {}) {
  const current=HomeBrainAssetRuntime?._canonicalPropertyIndex;
  if(!current) {
    const created=new MobilityCanonicalPropertyIndex(hass);
    HomeBrainAssetRuntime._canonicalPropertyIndex=created;
    return created;
  }
  current.refresh(hass);
  return current;
}
