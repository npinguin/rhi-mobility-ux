// Sole cross-domain Energy contract reader for Mobility UX.
// Mobility may consume Energy semantics only through RHI_ENERGY_PUBLIC_CONTRACT_V2.
class HomeBrainEnergyPublicV2Projection {
  constructor(hass = {}) { this.hass = hass || {}; }

  static get entityId() { return "sensor.rhi_energy_public_contract_v2"; }
  static get contractId() { return "RHI_ENERGY_PUBLIC_CONTRACT_V2"; }

  _parse(value, fallback = null) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value !== "string") return value;
    try { return JSON.parse(value); } catch (_) { return fallback; }
  }
  object(value) {
    const parsed=this._parse(value,value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  }
  rows(value) {
    const parsed=this._parse(value,value);
    if (Array.isArray(parsed)) return parsed.filter(row=>row && typeof row === "object");
    if (parsed && typeof parsed === "object") return Object.values(parsed).filter(row=>row && typeof row === "object");
    return [];
  }
  snapshot() {
    const state=this.hass?.states?.[HomeBrainEnergyPublicV2Projection.entityId] || null;
    const attributes=state?.attributes || {};
    const valid=!!state && String(attributes.contract_id || "") === HomeBrainEnergyPublicV2Projection.contractId;
    return Object.freeze({
      available:valid,
      entityId:HomeBrainEnergyPublicV2Projection.entityId,
      state:String(state?.state || "UNAVAILABLE"),
      contractId:String(attributes.contract_id || ""),
      contractVersion:String(attributes.contract_version || ""),
      release:String(attributes.release || ""),
      attributes:valid ? attributes : {}
    });
  }
  section(name) {
    const snapshot=this.snapshot();
    return snapshot.available ? this.object(snapshot.attributes?.[name]) : {};
  }
}
