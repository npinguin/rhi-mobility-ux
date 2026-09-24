// 10-ha-contract-runtime.js
// Home Assistant state reader, contract loaders, property/relationship/command resolvers, and release contract access.

class HomeBrainAssetRuntime {
  assetUrl(path) { return rhiMobilityAssetUrl(path); }
  constructor(hass, config = {}) {
    this.hass = hass;
    this.config = config;
    this._cache = HomeBrainAssetRuntime._cache || (HomeBrainAssetRuntime._cache = new Map());
    this._memo = new Map();
  }


  hardBackendGateSpecs() {
    return [
      { entity_id: "sensor.mobility_runtime_deployment_health", label: "Runtime deployment", blocking: true },
      { entity_id: "sensor.mobility_runtime_proof_health", label: "Runtime proof", blocking: true },
      { entity_id: "sensor.mobility_audit_closure_health", label: "Audit closure", blocking: true },
      { entity_id: "sensor.mobility_contract_version_consistency_health", label: "Contract version consistency", blocking: true },
      { entity_id: "sensor.mobility_home_intelligence_contract_standard_health", label: "Home Intelligence standard", blocking: true }
    ];
  }

  diagnosticHealthSpecs() {
    return [
      { entity_id: "sensor.mobility_range_normalization_health", label: "Range normalization", blocking: false },
      { entity_id: "sensor.mobility_wallbox_ocpp_phase_projection_health", label: "Wallbox OCPP phase projection", blocking: false },
      { entity_id: "sensor.mobility_source_authority_health", label: "Source authority", blocking: false },
      { entity_id: "sensor.mobility_source_evidence_health", label: "Source evidence", blocking: false },
      { entity_id: "sensor.mobility_index_integrity_health", label: "Index integrity", blocking: false },
      { entity_id: "sensor.mobility_index_schema_health", label: "Index schema", blocking: false },
      { entity_id: "sensor.mobility_energy_publication_health", label: "Energy publication", blocking: false },
      { entity_id: "sensor.mobility_relationship_integrity_health", label: "Relationship integrity", blocking: false },
      { entity_id: "sensor.mobility_runtime_binding_health", label: "Runtime binding", blocking: false },
      { entity_id: "sensor.mobility_command_integrity_health", label: "Command integrity", blocking: false },
      { entity_id: "sensor.mobility_command_publication_health", label: "Command publication", blocking: false },
      { entity_id: "sensor.mobility_contract_traceability_health", label: "Contract traceability", blocking: false },
      { entity_id: "sensor.mobility_property_editable_metadata_health", label: "Editable metadata", blocking: false },
      { entity_id: "sensor.mobility_property_projection_audit", label: "Property projection", blocking: false },
      { entity_id: "sensor.mobility_command_projection_audit", label: "Command projection", blocking: false }
    ];
  }


  contractAuthorityRegistry() {
    return {
      fleet_runtime_v2: { contract_id: "MOBILITY_PUBLIC_RUNTIME_V2", role: "authority" },
      product_experience_v2: { contract_id: "MOBILITY_EXPERIENCE_V2", role: "authority" },
      product_policy_v2: { contract_id: "MOBILITY_POLICY_V2", role: "authority" },
      command_v2: { contract_id: "MOBILITY_COMMAND_V2", role: "authority" },
      activity_v2: { contract_id: "MOBILITY_ACTIVITY_V2", role: "authority" },
      profile_catalog_v2: { contract_id: "MOBILITY_PROFILE_CATALOG_V2", role: "authority" },
      supervision_v2: { contract_id: "MOBILITY_SUPERVISION_V2", role: "authority" },
      identity_navigation: { contract_id: "MOBILITY_PUBLIC_RUNTIME_V2", field: "assets", role: "authority" },
      semantic_properties_v2: { canonical_contract: "MOBILITY_PUBLIC_RUNTIME_V2", role: "authority" },
      vehicle_properties: { canonical_contract: "MOBILITY_PUBLIC_RUNTIME_V2", role: "authority" },
      charger_properties: { canonical_contract: "MOBILITY_PUBLIC_RUNTIME_V2", role: "authority" },
      relationships: { contract_id: "MOBILITY_PUBLIC_RUNTIME_V2", role: "authority" },
      command_readiness: { contract_id: "MOBILITY_COMMAND_V2", role: "authority" },
      command_results: { contract_id: "MOBILITY_ACTIVITY_V2", role: "authority" },
      component_layout: { fields: ["component_id","section_id"], canonical_contract: "MOBILITY_PUBLIC_RUNTIME_V2", role: "authority" },
      command_placement: { contract_id: "MOBILITY_COMMAND_V2", role: "authority" },
      energy_boundary: { contract_id: "MOBILITY_ENERGY_V2", role: "external_consumer_only" },
      asset_runtime_compatibility: { entity_id: "sensor.mobility_asset_runtime_contract_index", role: "diagnostics_only_deprecated" },
      product_asset_compatibility: { entity_id: "sensor.mobility_product_asset_index", role: "diagnostics_only_deprecated" }
    };
  }

  compatibilityAssetRuntimeRow(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    if (!canonical) return null;
    const attrs = this.entity("sensor.mobility_asset_runtime_contract_index")?.attributes || {};
    const byId = this.parseJsonValue(attrs.assets_by_id, attrs.assets_by_id || {});
    if (byId && typeof byId === "object" && !Array.isArray(byId) && byId[canonical]) return byId[canonical];
    const rows = this.parseListValue(attrs.assets_json ?? attrs.assets ?? []);
    return rows.find((row)=>String(row?.asset_id || "") === canonical) || null;
  }

  compatibilityLifecyclePropertyRow(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    if (!canonical) return null;
    const keys = canonical.startsWith("vehicle_")
      ? ["asset.lifecycle_status", "vehicle.lifecycle_status"]
      : ["asset.lifecycle_status", "charger.lifecycle_status"];
    for (const key of keys) {
      const row = this.v2SemanticProperty(canonical, key);
      if (row) return row;
    }
    return null;
  }


  allowedContractEntityIds() {
    return new Set([
      "sensor.mobility_vehicle_property_index",
      "sensor.mobility_vehicle_component_contract_index",
      "sensor.mobility_charger_component_contract_index",
      "sensor.mobility_ux_runtime_consumption_map",
      "sensor.mobility_asset_runtime_contract_index",
      "sensor.mobility_canonical_asset_contract_registry",
      "sensor.mobility_vehicle_identity_property_index",
      "sensor.mobility_vehicle_battery_property_index",
      "sensor.mobility_vehicle_charging_property_index",
      "sensor.mobility_vehicle_range_property_index",
      "sensor.mobility_vehicle_access_property_index",
      "sensor.mobility_vehicle_comfort_property_index",
      "sensor.mobility_vehicle_location_property_index",
      "sensor.mobility_vehicle_maintenance_property_index",
      "sensor.mobility_vehicle_diagnostics_property_index",
      "sensor.mobility_charger_property_index",
      "sensor.mobility_person_property_index",
      "sensor.mobility_relationship_index",
      "sensor.mobility_command_index",
      "sensor.mobility_vehicle_command_slot_index",
      "sensor.mobility_charger_command_slot_index",
      "sensor.mobility_intelligence_index",
      "sensor.mobility_vehicle_intelligence_index",
      "sensor.mobility_charger_intelligence_index",
      "sensor.mobility_activity_index",
      "sensor.mobility_asset_index",
      "sensor.mobility_vehicle_profile_index",
      "sensor.mobility_charger_profile_index",
      "sensor.mobility_energy_asset_publication",
      "sensor.mobility_release_contract",
      "sensor.rhi_mobility_runtime_v2",
      "sensor.rhi_mobility_experience_v2",
      "sensor.rhi_mobility_policy_v2",
      "sensor.rhi_mobility_command_v2",
      "sensor.rhi_mobility_activity_v2",
      "sensor.rhi_mobility_profile_catalog_v2",
      "sensor.rhi_mobility_supervision_v2",
      "sensor.rhi_mobility_energy_v2",
      ...this.hardBackendGateSpecs().map((g) => g.entity_id),
      ...this.diagnosticHealthSpecs().map((g) => g.entity_id)
    ]);
  }

  isAllowedContractEntity(entityId = "") {
    const id = String(entityId || "").trim();
    if (!id) return false;
    if (this.allowedContractEntityIds().has(id)) return true;
    // R41.90.1 model-driven component contracts may publish component-specific
    // property index entities. Allow only public property-index shaped entities;
    // do not allow candidate, binding, source evidence or raw runtime entities.
    if (/^sensor\.mobility_(vehicle|charger|person)_[a-z0-9_]+_property_index$/.test(id)) return true;
    return false;
  }

  assertAllowedContractEntity(entityId = "") {
    const id = String(entityId || "").trim();
    if (this.isAllowedContractEntity(id)) return true;
    return false;
  }

  attr(entityId, attr, fallback = undefined) {
    const entity = this.entity(entityId);
    return entity?.attributes?.[attr] ?? fallback;
  }

  contractEntity(contractId = "", preferredEntityIds = []) {
    const wanted = String(contractId || "").trim();
    if (!wanted) return undefined;
    for (const entityId of preferredEntityIds) {
      const state = this.hass?.states?.[entityId];
      if (String(state?.attributes?.contract_id || "") === wanted) return state;
    }
    return Object.values(this.hass?.states || {}).find((state) =>
      String(state?.attributes?.contract_id || "") === wanted
    );
  }

  mobilityRuntimeV2() {
    const state = this.contractEntity("MOBILITY_PUBLIC_RUNTIME_V2", [
      "sensor.rhi_mobility_runtime_v2",
      "sensor.mobility_runtime_v2"
    ]);
    const attrs = state?.attributes || {};
    if (String(attrs.contract_id || "") !== "MOBILITY_PUBLIC_RUNTIME_V2") return null;
    return {
      contract_id: attrs.contract_id,
      canonical: attrs.canonical === true,
      assets: Array.isArray(attrs.assets) ? attrs.assets : [],
      fleet: attrs.fleet && typeof attrs.fleet === "object" ? attrs.fleet : {},
      relationships: Array.isArray(attrs.relationships) ? attrs.relationships : [],
      vehicle_charger_relationships: Array.isArray(attrs.vehicle_charger_relationships) ? attrs.vehicle_charger_relationships : [],
      ux_inference_forbidden: attrs.ux_inference_forbidden === true
    };
  }

  propertyPublicationEvidence(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    if (!canonical) return null;
    const asset = (this.mobilityRuntimeV2()?.assets || []).find((row) => String(row?.asset_id || "") === canonical);
    const publication = asset?.property_publication;
    if (!publication || typeof publication !== "object") return null;
    return {
      ...publication,
      expected_property_keys: Array.isArray(publication.expected_property_keys) ? publication.expected_property_keys : [],
      catalog_property_keys: Array.isArray(publication.catalog_property_keys) ? publication.catalog_property_keys : [],
      v1_fallback_allowed: publication.v1_fallback_allowed === true
    };
  }

  propertyPublicationGap(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const evidence = this.propertyPublicationEvidence(canonical);
    if (!evidence) return { status:"unavailable", missing:[], unexpected:[] };
    const actual = new Set(this.v2PropertyRows(canonical).map((row)=>String(row.property_key || "")).filter(Boolean));
    const expected = new Set(evidence.expected_property_keys.map(String));
    return {
      status:[...expected].every((key)=>actual.has(key)) ? "complete" : "incomplete",
      missing:[...expected].filter((key)=>!actual.has(key)).sort(),
      unexpected:[...actual].filter((key)=>!expected.has(key)).sort(),
      expected_count:expected.size,
      actual_count:actual.size,
      authority:evidence.authority || "MOBILITY_PUBLIC_RUNTIME_V2"
    };
  }

  mobilityExperienceV2() {
    const state = this.contractEntity("MOBILITY_EXPERIENCE_V2", [
      "sensor.rhi_mobility_experience_v2",
      "sensor.mobility_experience_v2"
    ]);
    const attrs = state?.attributes || {};
    if (String(attrs.contract_id || "") !== "MOBILITY_EXPERIENCE_V2") return null;
    return {
      ...attrs,
      fleet: attrs.fleet && typeof attrs.fleet === "object" ? attrs.fleet : {},
      vehicles: Array.isArray(attrs.vehicles) ? attrs.vehicles : [],
      chargers: Array.isArray(attrs.chargers) ? attrs.chargers : []
    };
  }

  mobilityPolicyV2() {
    const state = this.contractEntity("MOBILITY_POLICY_V2", [
      "sensor.rhi_mobility_policy_v2",
      "sensor.mobility_policy_v2"
    ]);
    const attrs = state?.attributes || {};
    if (String(attrs.contract_id || "") !== "MOBILITY_POLICY_V2") return null;
    return {
      contract_id: attrs.contract_id,
      publisher: attrs.publisher || "",
      revision: Number(attrs.revision ?? state?.state ?? 0) || 0,
      policy: attrs.policy && typeof attrs.policy === "object" ? attrs.policy : {}
    };
  }

  mobilityCommandV2() {
    const state = this.contractEntity("MOBILITY_COMMAND_V2", [
      "sensor.rhi_mobility_command_v2",
      "sensor.mobility_command_v2"
    ]);
    const attrs = state?.attributes || {};
    if (String(attrs.contract_id || "") !== "MOBILITY_COMMAND_V2") return null;
    return {
      contract_id: attrs.contract_id,
      publisher: attrs.publisher || "",
      commands: Array.isArray(attrs.commands) ? attrs.commands : [],
      raw_service_bindings_exposed: attrs.raw_service_bindings_exposed === true
    };
  }

  mobilityActivityV2() {
    const state = this.contractEntity("MOBILITY_ACTIVITY_V2", [
      "sensor.rhi_mobility_activity_v2"
    ]);
    const attrs = state?.attributes || {};
    if (String(attrs.contract_id || "") !== "MOBILITY_ACTIVITY_V2") return null;
    return {
      ...attrs,
      activities: Array.isArray(attrs.activities) ? attrs.activities : []
    };
  }

  mobilityProfileCatalogV2() {
    const state = this.contractEntity("MOBILITY_PROFILE_CATALOG_V2", [
      "sensor.rhi_mobility_profile_catalog_v2"
    ]);
    const attrs = state?.attributes || {};
    if (String(attrs.contract_id || "") !== "MOBILITY_PROFILE_CATALOG_V2") return null;
    return {
      ...attrs,
      profiles: Array.isArray(attrs.profiles) ? attrs.profiles : []
    };
  }

  mobilitySupervisionV2() {
    const state = this.contractEntity("MOBILITY_SUPERVISION_V2", [
      "sensor.rhi_mobility_supervision_v2"
    ]);
    const attrs = state?.attributes || {};
    if (String(attrs.contract_id || "") !== "MOBILITY_SUPERVISION_V2") return null;
    return attrs;
  }

  commandV2Label(commandKey = "") {
    const key = String(commandKey || "").split(".").pop() || "";
    const labels = {
      start:"Start charging",
      stop:"Stop charging",
      start_charging:"Start charging",
      stop_charging:"Stop charging",
      unlock_connector:"Unlock connector",
      restart:"Restart",
      identify:"Identify",
      lock:"Lock",
      unlock:"Unlock",
      climate_start:"Start climate",
      climate_stop:"Stop climate",
      refresh:"Refresh"
    };
    return labels[key] || this.titleize(key.replace(/_/g, " "));
  }

  commandV2Rows(assetId = "") {
    const contract = this.mobilityCommandV2();
    if (!contract) return null;
    const canonical = this.canonicalAssetId(assetId);
    const order = {
      "charger.command.start":10,
      "charger.command.start_charging":10,
      "charger.command.stop":20,
      "charger.command.stop_charging":20,
      "charger.command.unlock_connector":30,
      "vehicle.command.lock":10,
      "vehicle.command.unlock":20,
      "vehicle.command.climate_start":30,
      "vehicle.command.climate_stop":40,
      "charger.command.restart":70,
      "charger.command.identify":80,
      "vehicle.command.refresh":90
    };
    return contract.commands
      .filter((row) => row && (!canonical || this.canonicalAssetId(row.asset_id || "") === canonical))
      .map((row) => {
        const key = String(row.command_key || "").trim();
        const placement = String(row.placement || "").trim();
        const family = placement.split(".").pop() || "";
        return this.normalizeCommandEntry({
          ...row,
          command_id: row.command_id || (row.asset_id && key ? `${row.asset_id}:${key}` : key),
          command_key:key,
          label:row.label || this.commandV2Label(key),
          command_family:row.command_family || (family === "primary" ? "charging" : family),
          category:row.category || (family === "engineering" ? "secondary" : "primary"),
          frontend_allowed:row.supported !== false,
          exists:row.supported !== false,
          enabled:row.supported !== false,
          execution_allowed:row.execution_allowed === true,
          blocked_reason:row.blocked_reason || "",
          sort_order:row.sort_order ?? order[key] ?? 999,
          service_domain:"rhi_mobility",
          service_action:"execute_command",
          service_data:{ asset_id:row.asset_id || canonical, command_key:key },
          service_target:{},
          _authority:"MOBILITY_COMMAND_V2"
        }, row.asset_id || canonical);
      })
      .filter(Boolean);
  }

  commandV2RowsForSurface(assetId = "", surface = "operational") {
    const rows = this.commandV2Rows(assetId);
    if (rows === null) return null;
    const canonical = this.canonicalAssetId(assetId);
    const wanted = this.norm(surface);
    const isQuick = ["quick_actions","operational","vehicle_actions","charger_actions"].includes(String(surface || ""));
    return rows.filter((row) => {
      const placement = String(row.raw?.placement || row.placement || "").trim();
      const normalizedPlacement = this.norm(placement);
      const placementTail = this.norm(placement.split(".").pop() || "");
      if (isQuick) {
        if (canonical.startsWith("vehicle_")) return placementTail !== "engineering";
        return canonical.startsWith("charger_");
      }
      return wanted === normalizedPlacement || wanted === placementTail || normalizedPlacement.endsWith(wanted);
    });
  }

  mobilityFleetV2() {
    return this.mobilityRuntimeV2()?.fleet || this.mobilityExperienceV2()?.fleet || {};
  }

  vehicleExperienceV2(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    return this.mobilityExperienceV2()?.vehicles?.find((row) => String(row?.asset_id || "") === canonical) || null;
  }

  chargerExperienceV2(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    return this.mobilityExperienceV2()?.chargers?.find((row) => String(row?.asset_id || "") === canonical) || null;
  }

  vehicleRelationshipV2(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const runtime = this.mobilityRuntimeV2();
    const fromRuntime = runtime?.vehicle_charger_relationships?.find((row) => String(row?.vehicle_id || row?.asset_id || "") === canonical);
    if (fromRuntime) return fromRuntime;
    return this.vehicleExperienceV2(canonical)?.charging_relationship || null;
  }

  setMobilityPolicy(policyKey = "", value = "") {
    const key = String(policyKey || "").trim();
    if (!key || !this.hass?.callService) return false;
    this.hass.callService("rhi_mobility", "set_policy", { policy_key:key, value });
    return true;
  }

  parseListValue(value) {
    if (value === undefined || value === null || value === "") return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") {
      if (Array.isArray(value.items)) return value.items;
      if (Array.isArray(value.assets)) return value.assets;
      if (Array.isArray(value.vehicles)) return value.vehicles;
      if (Array.isArray(value.chargers)) return value.chargers;
      return Object.values(value);
    }
    const raw = String(value).trim();
    if (!raw || ["unknown", "unavailable", "none", "null"].includes(raw.toLowerCase())) return [];
    const parsed = this.parseJsonValue(raw, null);
    if (parsed && parsed !== raw) return this.parseListValue(parsed);
    return raw.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean);
  }



  runtimeHealthGateRows() {
    return this._healthRows(this.hardBackendGateSpecs(), { diagnosticsOnly: false });
  }

  runtimeDiagnosticRows() {
    return this._healthRows(this.diagnosticHealthSpecs(), { diagnosticsOnly: true });
  }

  _healthRows(rows = [], options = {}) {
    const diagnosticsOnly = Boolean(options.diagnosticsOnly);
    return rows.map((gate) => {
      const entity = this.entity(gate.entity_id);
      const state = String(entity?.state || "unavailable").trim();
      const normalized = state.toUpperCase();
      const ok = ["OK", "PASS", "PASSED", "READY"].includes(normalized);
      const absent = ["UNKNOWN", "UNAVAILABLE", "NONE", "", "RESTORED"].includes(normalized);
      // Hard gates are closed and explicit: unavailable or unknown is not trusted.
      // Diagnostics-only sensors are non-blocking context and may not create main backend runtime status.
      const bad = diagnosticsOnly ? (!ok && !absent) : !ok;
      const attrs = entity?.attributes || {};
      const rootCause = attrs.rule || attrs.release_gate || attrs.release_gate_rule || attrs.ux_rule || attrs.validation_rule || attrs.reason || "";
      return { ...gate, state, bad, ok, diagnostics_only: diagnosticsOnly, root_cause: rootCause, attributes: attrs };
    });
  }

  runtimeHealthSummary() {
    const hardRows = this.runtimeHealthGateRows();
    const diagnosticRows = this.runtimeDiagnosticRows();
    const diagnosticBad = diagnosticRows.filter((r) => r.bad);
    const release = this.releaseContract();
    const explicitRuntime = String(release.runtime_health || "").trim();
    const deploymentState = String(this.entity("sensor.mobility_runtime_deployment_health")?.state || "").trim();
    const rawRuntime = explicitRuntime && !["unknown","unavailable","none"].includes(explicitRuntime.toLowerCase()) ? explicitRuntime : deploymentState;
    const normalized = String(rawRuntime || "UNKNOWN").toUpperCase();
    let status = "UNKNOWN";
    if (["OK","PASS","PASSED","READY","HEALTHY"].includes(normalized)) status = "OK";
    else if (["DEGRADED","WARNING","WARN"].includes(normalized)) status = "DEGRADED";
    else if (["FAIL","FAILED","BLOCKED","ERROR","NOT_OK"].includes(normalized)) status = "BLOCKED";
    const runtimeBad = ["DEGRADED","BLOCKED"].includes(status);
    const diagnosticStatus = diagnosticBad.length ? "DEGRADED" : "OK";
    return {
      status,
      ok: status === "OK",
      bad_count: runtimeBad ? 1 : 0,
      blocking_count: status === "BLOCKED" ? 1 : 0,
      diagnostic_status: diagnosticStatus,
      diagnostic_bad_count: diagnosticBad.length,
      rows: hardRows,
      diagnostics: diagnosticRows,
      physical_acceptance: release.physical_acceptance || "Unknown",
      release_acceptance: release.release_acceptance || "Unknown",
      message: status === "OK" ? "Mobility runtime healthy." : status === "DEGRADED" ? "Mobility runtime degraded." : status === "BLOCKED" ? "Mobility runtime failed." : "Mobility runtime health unavailable."
    };
  }

  renderRuntimeHealthWarning() {
    const summary = this.runtimeHealthSummary();
    if (!["DEGRADED","BLOCKED"].includes(summary.status)) return "";
    const deployment = String(this.entity("sensor.mobility_runtime_deployment_health")?.state || summary.status);
    return `<div class="hi-contract-warning" title="Mobility runtime health warning"><div><strong>Runtime ${summary.status === "BLOCKED" ? "failed" : "degraded"}</strong> — ${this.escape(summary.message)}</div><div class="hi-contract-warning-list"><span>Runtime health: ${this.escape(deployment)}</span></div></div>`;
  }


  indexAttr(attr, fallback = []) {
    const key = `indexAttr:${attr}`;
    if (this._memo.has(key)) return this._memo.get(key);
    const raw = this.attr("sensor.mobility_asset_index", attr, undefined);
    const parsed = this.parseListValue(raw);
    const value = parsed.length ? parsed : fallback;
    this._memo.set(key, value);
    return value;
  }

  typeIndexEntity(kind = "all") {
    // R22.8: asset index is the only asset catalog/navigation source.
    // Vehicle/charger indexes are compatibility/transitional and must not drive UX asset discovery.
    return "sensor.mobility_asset_index";
  }

  assetIndexRows(kind = "all") {
    const cacheKey = `assetIndexRows:${kind}`;
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const runtime = this.mobilityRuntimeV2();
    let rows = (runtime?.assets || []).map((v, index) =>
      this.normalizeAssetEntry({ sort_order:index, ...(v || {}) })
    ).filter(Boolean);
    if (kind === "vehicle") rows = rows.filter((a) => String(a.asset_type || "").toLowerCase() === "vehicle");
    if (kind === "charger") rows = rows.filter((a) => String(a.asset_type || "").toLowerCase() === "charger");
    if (kind === "person") rows = rows.filter((a) => String(a.asset_type || "").toLowerCase() === "person");
    this._memo.set(cacheKey, rows);
    return rows;
  }

  consumerAssetIds(kind = "all") {
    return this.assetIndexRows(kind).map((a) => a.asset_id).filter(Boolean);
  }

  indexedAssets(kind = "all") {
    // R22.10.3: runtime UX must consume only the backend-owned consumer indexes.
    // Do not fall back to legacy registries, legacy relationship entities,
    // global charger lists or reverse charger matching. Missing indexes should be
    // visible as a contract/deployment issue rather than silently derived in UX.
    return this.assetIndexRows(kind);
  }

  registryEntryFromList(assetId, list = null) {
    const id = String(assetId || "");
    const items = list || [...this.assetIndexRows("all"), ...this.assetIndexRows("vehicle"), ...this.assetIndexRows("charger")];
    return items.find((a) => a.asset_id === id || a.asset_id === id.replace(/^vehicle_/, "").replace(/^charger_/, "") || a.asset_id === `vehicle_${id}` || a.asset_id === `charger_${id}`) || null;
  }

  assetDisplayName(assetId) {
    const entry = this.registryEntryFromList(assetId, [...this.assetIndexRows("all"), ...this.assetIndexRows("vehicle"), ...this.assetIndexRows("charger")]);
    return entry?.display_name || entry?.raw?.display_name || String(assetId || "Asset");
  }


  assetLiveProfile(assetId) {
    const entry = this.registryEntryFromList(assetId, [...this.assetIndexRows("all"), ...this.assetIndexRows("vehicle"), ...this.assetIndexRows("charger")]);
    return entry?.profile_display_name || entry?.profile || entry?.raw?.profile_display_name || "";
  }


  profileRows() {
    const key = "profileRows";
    if (this._memo.has(key)) return this._memo.get(key);
    const rows = this.mobilityProfileCatalogV2()?.profiles || [];
    this._memo.set(key, rows);
    return rows;
  }

  profileForAsset(asset = {}) {
    const profileId = String(asset?.profile_id || asset?.raw?.profile_id || "");
    if (!profileId) return null;
    return this.profileRows().find((p) => String(p.profile_id || p.id || "") === profileId) || null;
  }

  isGenericVehicleImageKey(imageKey = "") {
    return ["vehicle_guest", "vehicle_guest_generic", "vehicle_fallback", "vehicle_unknown_profile", "vehicle_unknown_profile_hero", "default_vehicle"].includes(String(imageKey || "").trim());
  }

  imageCatalog() {
    return rhiMobilityImageCatalog();
  }

  resolveImageCatalogEntry(imageKey = "") {
    const key = String(imageKey || "").trim();
    if (!key) return null;
    const direct = this.imageCatalog().find((row) => String(row.image_key || "") === key) || null;
    if (direct) return direct;
    const visual = typeof rhiMobilityParseVehicleVisualKey === "function" ? rhiMobilityParseVehicleVisualKey(key) : null;
    if (!visual) return null;
    const base = this.imageCatalog().find((row) => String(row.image_key || "") === String(visual.vehicle?.image_key || "")) || null;
    return base ? { ...base, visual_key:visual.key, vehicle_visual:visual } : null;
  }

  imageUrlFromCatalog(imageKey = "", fallbackKey = "") {
    const first = this.resolveImageCatalogEntry(imageKey);
    const fallback = this.resolveImageCatalogEntry(fallbackKey || first?.fallback_image_key || "");
    const file = first?.package_file || fallback?.package_file || "";
    return file ? this.cache(file) : "";
  }

  visualImageKey(asset = {}, role = "image") {
    const visualRef = String(asset?.visual_ref || asset?.raw?.visual_ref || "").trim();
    const refKey = typeof rhiMobilityLocalVisualKeyFromRef === "function"
      ? rhiMobilityLocalVisualKeyFromRef(visualRef)
      : "";
    if (refKey) return refKey;
    const profile = this.profileForAsset(asset) || {};
    const profileId = String(asset?.profile_id || asset?.raw?.profile_id || "").trim();
    const profileVisual = String(asset?.asset_type || "").toLowerCase() === "vehicle" && typeof rhiMobilityVehicleVisualForProfile === "function"
      ? rhiMobilityVehicleVisualForProfile(profileId)
      : null;
    // Persisted appearance may refine colour only inside the profile-owned visual family.
    // A stale image_key from another model must never override the current Mobility profile.
    const candidates = [asset.image_key, asset.raw?.image_key, profile.image_key];
    const explicit = String(candidates.find((v) => v !== undefined && v !== null && String(v).trim() && !this.isGenericVehicleImageKey(v)) || "").trim();
    if (profileVisual) {
      const parsed = typeof rhiMobilityParseVehicleVisualKey === "function" ? rhiMobilityParseVehicleVisualKey(explicit) : null;
      if (parsed?.vehicle?.id === profileVisual.id) return parsed.key;
      const firstColor = profileVisual.colors?.[0]?.id || "";
      if (firstColor && typeof rhiMobilityVehicleVisualKey === "function") return rhiMobilityVehicleVisualKey(profileVisual.id, firstColor);
    }
    if (explicit) return explicit;
    const fallback = [asset.fallback_image_key, asset.raw?.fallback_image_key, profile.fallback_image_key]
      .find((v) => v !== undefined && v !== null && String(v).trim());
    return String(fallback || "vehicle_fallback").trim();
  }

  visualImageUrl(asset = {}, kind = "vehicle", role = "image", fallback = "") {
    // visual_ref is the canonical cross-domain identity. Package paths remain UX-owned.
    const visualRef = String(asset?.visual_ref || asset?.raw?.visual_ref || "").trim();
    const resolvedRef = visualRef && typeof rhiMobilityResolveVisualRef === "function"
      ? rhiMobilityResolveVisualRef(visualRef)
      : null;
    if (resolvedRef?.package_file) return this.cache(resolvedRef.package_file);
    const key = this.visualImageKey(asset, role);
    const fallbackKey = asset.fallback_image_key || asset.raw?.fallback_image_key || fallback || `${kind}_fallback`;
    return this.imageUrlFromCatalog(key, fallbackKey);
  }

  mobilityRegistry() {
    // R22.8: one discovered asset catalog assembled only from mobility_asset_index.
    const rows = [...this.indexedAssets("all")];
    const seen = new Set();
    return rows.filter((a) => {
      const id = String(a?.asset_id || "");
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  normalizeAssetEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    const assetBlock = entry.asset || {};
    const lifecycleBlock = entry.lifecycle || {};
    const identityBlock = entry.identity || {};
    const trustBlock = entry.trust || {};
    const frontendBlock = entry.frontend || {};
    const relationshipBlock = entry.relationship || entry.relationships || {};
    const asset_id = entry.asset_id || assetBlock.id || entry.id || entry.key;
    if (!asset_id) return null;
    const rawRoles = entry.roles ?? assetBlock.roles;
    const roles = Array.isArray(rawRoles) ? rawRoles : (rawRoles ? String(rawRoles).split(",").map((r) => r.trim()) : []);
    const lifecycle = entry.lifecycle_status || lifecycleBlock.lifecycle_status || entry.lifecycle_state || lifecycleBlock.state || entry.lifecycle || "Unknown";
    return {
      schema_version: entry.schema_version || 1,
      asset_id,
      domain: entry.domain || assetBlock.domain || "mobility",
      asset_type: entry.asset_type || entry.concept_id || assetBlock.type || entry.type || "unknown",
      display_name: entry.display_name || identityBlock.display_name || entry.name || asset_id,
      profile: entry.profile || entry.profile_display_name || identityBlock.profile || "",
      profile_id: entry.profile_id || identityBlock.profile_id || "",
      profile_display_name: entry.profile_display_name || identityBlock.profile_display_name || entry.profile || identityBlock.profile || "",
      visual_ref: entry.visual_ref || identityBlock.visual_ref || "",
      image_key: entry.image_key || identityBlock.image_key || "",
      hero_image_key: entry.hero_image_key || identityBlock.hero_image_key || "",
      thumbnail_image_key: entry.thumbnail_image_key || identityBlock.thumbnail_image_key || "",
      fallback_image_key: entry.fallback_image_key || identityBlock.fallback_image_key || "",
      location: entry.location || identityBlock.location || "",
      enabled: entry.enabled ?? lifecycleBlock.enabled ?? true,
      lifecycle_status: this.normalizeLifecycle(lifecycle),
      lifecycle_state: this.normalizeLifecycle(lifecycle),
      roles,
      execution_owner: entry.execution_owner || assetBlock.execution_owner || "",
      frontend_allowed: entry.frontend_allowed ?? frontendBlock.visible ?? true,
      detail_enabled: entry.detail_enabled ?? frontendBlock.detail_enabled ?? true,
      group: entry.group || frontendBlock.group || "",
      sort_order: entry.sort_order ?? frontendBlock.sort_order ?? 999,
      trust_status: entry.trust_status || trustBlock.status || "",
      trust_reason: entry.trust_reason || trustBlock.reason || "",
      last_seen: entry.last_seen ?? lifecycleBlock.last_seen ?? "",
      relationship: relationshipBlock,
      assigned_charger: relationshipBlock.assigned_charger ?? "",
      connected_charger: relationshipBlock.connected_charger ?? "",
      effective_charger: relationshipBlock.effective_charger ?? "",
      selected_charger: relationshipBlock.selected_charger ?? "",
      assigned_charger_display_name: relationshipBlock.assigned_charger_display_name ?? "",
      connected_charger_display_name: relationshipBlock.connected_charger_display_name ?? "",
      effective_charger_display_name: relationshipBlock.effective_charger_display_name ?? "",
      raw: entry
    };
  }

  normalizeLifecycle(value) {
    const s = String(value || "Unknown").trim().toLowerCase();
    if (s === "active") return "Active";
    if (["inactive", "not_present", "not present", "none"].includes(s)) return "Inactive";
    if (s === "disabled") return "Disabled";
    if (s === "retired") return "Retired";
    return "Unknown";
  }

  registryEntry(assetId) {
    return this.registryEntryFromList(assetId, this.mobilityRegistry());
  }

  vehicleChargerRelationship(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    const runtimeV2 = this.mobilityRuntimeV2();
    if (runtimeV2) {
      const relation = (runtimeV2.vehicle_charger_relationships || []).find((row)=>String(row?.vehicle_id || row?.asset_id || "") === canonical) || null;
      const selected = this.cleanValue(relation?.configured_charger_id || "", "none") || "none";
      const effective = this.cleanValue(relation?.effective_charger_id || "", "none") || "none";
      const connected = relation?.observed_identity_proven === true
        ? (this.cleanValue(relation?.physically_connected_charger_id || "", "none") || "none")
        : "none";
      return {
        assigned:selected !== "none" ? selected : effective,
        effective, selected, connected,
        assigned_display_name:this.assetDisplayName(selected !== "none" ? selected : effective),
        effective_display_name:this.assetDisplayName(effective),
        connected_display_name:this.assetDisplayName(connected),
        relationship_resolution:relation?.relationship_status || "",
        reason:relation?.reason || "",
        observed_identity_proven:relation?.observed_identity_proven === true,
        row:relation,
        physical_row:relation,
        effective_row:relation,
        selected_row:relation,
        _authority:"MOBILITY_PUBLIC_RUNTIME_V2"
      };
    }
    // Frozen V1 relationship index is compatibility-only on older backends.
    const rows = this.relationshipRows(canonical).filter((r) => String(r.source_asset_id || r.asset_id || "") === String(canonical));
    const selectedRow = rows.find((r) => String(r.relationship_type || "") === "vehicle_selected_charger") || null;
    const effectiveRow = rows.find((r) => String(r.relationship_type || "") === "vehicle_effective_charger") || null;
    const physicalRow = rows.find((r) => String(r.relationship_type || "") === "vehicle_physical_charger") || null;
    const valueOf = (row) => this.cleanValue(row?.effective_target_asset_id || row?.target_asset_id || "", "none") || "none";
    const selected = valueOf(selectedRow);
    const effective = valueOf(effectiveRow);
    const connected = valueOf(physicalRow);
    const assigned = selected !== "none" ? selected : effective;
    return {
      assigned, effective, selected, connected,
      assigned_display_name: this.assetDisplayName(assigned),
      effective_display_name: this.assetDisplayName(effective),
      connected_display_name: this.assetDisplayName(connected),
      relationship_resolution: physicalRow?.resolution_source || effectiveRow?.resolution_source || selectedRow?.resolution_source || "",
      row: effectiveRow || selectedRow || physicalRow || null,
      physical_row: physicalRow,
      effective_row: effectiveRow,
      selected_row: selectedRow
    };
  }


  releaseContract() {
    const e = this.entity("sensor.mobility_release_contract");
    const attrs = e?.attributes || {};
    const backend = this.cleanValue(
      attrs.backend_release ||
      attrs.backend_version ||
      attrs.backend_release_version ||
      attrs.release_version ||
      attrs.release ||
      attrs.version ||
      attrs.package_version ||
      e?.state ||
      "",
      "Unknown"
    ) || "Unknown";
    return {
      backend_release: backend,
      backend_version: backend,
      contract_version: this.cleanValue(attrs.contract_version || attrs.contract_release || attrs.contract || "", "Unknown") || "Unknown",
      schema_version: this.cleanValue(attrs.schema_version || attrs.schema || "", "Unknown") || "Unknown",
      build_date: this.cleanValue(attrs.build_date || attrs.release_date || attrs.generated_at || "", "Unknown") || "Unknown",
      contract_health: this.cleanValue(attrs.contract_health || attrs.health || attrs.status || "Unknown", "Unknown") || "Unknown",
      runtime_health: this.cleanValue(attrs.runtime_health || attrs.runtime_status || "", "Unknown") || "Unknown",
      physical_acceptance: this.cleanValue(attrs.physical_acceptance || attrs.physical_execution_acceptance || "", "Unknown") || "Unknown",
      release_acceptance: this.cleanValue(attrs.release_acceptance || attrs.acceptance || "", "Unknown") || "Unknown"
    };
  }

  backendVersion() {
    // R22.7.9.21 contract lock: backend/version source is sensor.mobility_release_contract only.
    return this.releaseContract().backend_release;
  }

  contractVersion() {
    return this.releaseContract().contract_version;
  }

  contractHealth() {
    return this.releaseContract().contract_health;
  }

  runtimeSignature(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const parts = [
      JSON.stringify(this.releaseContract()),
      JSON.stringify(this.assetIndexRows("all")),
      JSON.stringify(this.profileRows()),
      JSON.stringify(canonical ? this.propertyRows(canonical) : this.propertyRows("")),
      JSON.stringify(canonical ? this.relationshipRows(canonical) : this.relationshipRows("")),
      JSON.stringify(canonical ? this.commandRegistry(canonical) : this.publicCommandRows()),
      JSON.stringify(canonical ? this.activityRowsFor(canonical) : this.activityRowsFor("")),
      JSON.stringify(canonical ? this.intelligenceRowsFor(canonical) : this.intelligenceRowsFor("")),
      JSON.stringify(canonical ? this.energyAssetPublicationRows(canonical) : this.energyAssetPublicationRows("")),
      JSON.stringify(this.mobilityRuntimeV2()),
      JSON.stringify(this.mobilityExperienceV2()),
      JSON.stringify(this.mobilityPolicyV2()),
      JSON.stringify(this.mobilityCommandV2()),
      JSON.stringify(this.mobilityActivityV2()),
      JSON.stringify(this.mobilityProfileCatalogV2()),
      JSON.stringify(this.mobilitySupervisionV2())
    ];
    return parts.join("|");
  }

  publicCommandRows() {
    const v2 = this.commandV2Rows("");
    if (v2 !== null) return v2;
    if (this.mobilityRuntimeV2()) return [];
    const rows = [];
    const entity = this.entity("sensor.mobility_command_index");
    const attrs = entity?.attributes || {};
    for (const attrName of ["commands", "commands_by_asset", "rows"]) {
      const value = this.parseJsonValue(attrs[attrName], attrs[attrName]);
      rows.push(...this.commandsFromIndexValue(value, ""));
    }
    const seen = new Set();
    return rows.map((r)=>this.normalizeCommandEntry(r, r?.asset_id || "")).filter(Boolean).filter((r)=>{
      const key = `${r.asset_id}:${r.command_key || r.command_id}:${r.command_role || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  publicRelationshipRows() {
    return this.relationshipRows("");
  }

  publicActivityRows() {
    return this.activityRowsFor("");
  }

  publicIntelligenceRows() {
    return this.intelligenceRowsFor("");
  }

  energyAssetPublicationRows(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const state = this.contractEntity("MOBILITY_ENERGY_V2", ["sensor.rhi_mobility_energy_v2"]);
    const attrs = state?.attributes || {};
    if (String(attrs.contract_id || "") !== "MOBILITY_ENERGY_V2") return [];
    const rows = [
      ...(Array.isArray(attrs.consumer_assets) ? attrs.consumer_assets : []),
      ...(Array.isArray(attrs.connection_assets) ? attrs.connection_assets : [])
    ];
    return rows.filter((r)=>!canonical || String(r.asset_id || r.source_asset_id || "") === canonical);
  }

  contractCoverageReport() {
    const assets = this.assetIndexRows("all");
    const profiles = this.profileRows();
    const vehicleProfiles = profiles.filter((row)=>String(row.asset_type || "").toLowerCase() === "vehicle");
    const chargerProfiles = profiles.filter((row)=>String(row.asset_type || "").toLowerCase() === "charger");
    const allProperties = this.propertyRows("").filter((p)=>String(p.access || "").toLowerCase() !== "internal");
    const vehicleProperties = allProperties.filter((p)=>String(p.asset_type || "").toLowerCase() === "vehicle");
    const chargerProperties = allProperties.filter((p)=>String(p.asset_type || "").toLowerCase() === "charger");
    const personProperties = allProperties.filter((p)=>String(p.asset_type || "").toLowerCase() === "person");
    const relationships = this.publicRelationshipRows();
    const commands = this.publicCommandRows();
    const intelligence = this.publicIntelligenceRows();
    const activities = this.publicActivityRows();
    const energyPublications = this.energyAssetPublicationRows("");
    const visibleCommands = commands.filter((c)=>this.contractBool(c.frontend_allowed, true) === true && !this.isConfigurationCommand(c));
    return {
      release: { ux_version: UX_VERSION, backend_version: this.backendVersion(), contract_version: this.contractVersion(), contract_health: this.contractHealth(), runtime_health: this.runtimeHealthSummary().status },
      health_gates: { published: this.runtimeHealthGateRows().length, consumed: this.runtimeHealthGateRows().length, bad: this.runtimeHealthSummary().bad_count, blocking: this.runtimeHealthSummary().blocking_count },
      assets: { published: assets.length, consumed: assets.length, rendered_or_categorized: assets.length, missing: 0 },
      profiles: { vehicle_published: vehicleProfiles.length, vehicle_consumed: vehicleProfiles.length, charger_published: chargerProfiles.length, charger_consumed: chargerProfiles.length, missing: 0 },
      properties: {
        published: allProperties.length, consumed: allProperties.length, primary_rendered: 0, detail_rendered: 0, engineering_overflow: allProperties.length, missing: 0,
        vehicle_published: vehicleProperties.length, vehicle_consumed: vehicleProperties.length,
        charger_published: chargerProperties.length, charger_consumed: chargerProperties.length,
        person_published: personProperties.length, person_consumed: personProperties.length
      },
      relationships: { published: relationships.length, consumed: relationships.length, missing: 0 },
      commands: {
        authority: this.mobilityCommandV2() ? "MOBILITY_COMMAND_V2" : "UNAVAILABLE",
        published: commands.length, consumed: commands.length, missing: 0,
        hidden_frontend_false: commands.filter((c)=>this.contractBool(c.frontend_allowed, true) === false).length,
        visible_disabled: visibleCommands.filter((c)=>this.contractBool(c.execution_allowed, false) === false).length,
        visible_enabled: visibleCommands.filter((c)=>this.contractBool(c.execution_allowed, false) === true).length
      },
      intelligence: { published: intelligence.length, consumed: intelligence.length, missing: 0 },
      activity: { published: activities.length, consumed: activities.length, missing: 0 },
      energy_publication: { published: energyPublications.length, consumed: energyPublications.length, missing: 0 },
      vehicle_components: {
        component_contract_available: this.vehicleComponentContractAvailable(),
        published: this.vehicleComponentContractRows().length,
        consumed: this.vehicleComponentRows().length,
        property_index_entities_consumed: this.vehicleComponentPropertyIndexEntities().length,
        detail_source: this.vehicleComponentContractAvailable() ? "component_property_indexes" : "component_contract_unavailable",
        missing: 0
      },
      charger_components: {
        component_contract_available: this.chargerComponentContractAvailable(),
        published: this.chargerComponentContractRows().length,
        consumed: this.chargerComponentRows().length,
        property_index_entities_consumed: this.chargerComponentPropertyIndexEntities().length,
        detail_source: this.chargerComponentContractAvailable() ? "component_contract" : "component_contract_unavailable",
        missing: 0
      }
    };
  }

  canonicalAssetId(assetId) {
    const id = String(assetId || "");
    if (id.startsWith("vehicle_") || id.startsWith("charger_")) return id;
    const reg = this.mobilityRegistry().find((a) =>
      a.asset_id === id ||
      a.asset_id === `vehicle_${id}` ||
      a.asset_id === `charger_${id}` ||
      a.asset_id.replace(/^vehicle_/, "") === id ||
      a.asset_id.replace(/^charger_/, "") === id
    );
    return reg?.asset_id || id;
  }

  uiId(assetId) {
    return String(assetId || "").replace(/^vehicle_/, "").replace(/^charger_/, "");
  }


  assetHasRole(entry, role) {
    return (entry?.roles || []).map((r) => String(r).toLowerCase()).includes(String(role).toLowerCase());
  }

  /**
   * Product classification helper used by the factory, asset viewer and detail card.
   * The backend contract should ideally provide roles, but during contract cleanup the
   * frontend accepts asset_id prefixes and common asset_type/profile words as safe fallbacks.
   */
  isVehicleAsset(entry) {
    const text = [entry?.asset_id, entry?.asset_type, entry?.profile, entry?.group, ...(entry?.roles || [])]
      .filter(Boolean).join(" ").toLowerCase();
    return this.assetHasRole(entry, "vehicle") || text.includes("vehicle") || text.startsWith("vehicle_");
  }

  isChargerAsset(entry) {
    const text = [entry?.asset_id, entry?.asset_type, entry?.profile, entry?.group, ...(entry?.roles || [])]
      .filter(Boolean).join(" ").toLowerCase();
    return this.assetHasRole(entry, "charger") || text.includes("charger") ||
      text.includes("evse") || text.includes("chargepoint") || text.includes("charging point") ||
      text.startsWith("charger_");
  }

  detailRoute(entry) {
    // R21.4: Registry does not own Lovelace routes. UX route factory owns navigation.
    return entry ? this.assetDetailRoute(entry) : "";
  }

  assetDetailRoute(entryOrAssetId) {
    const assetId = typeof entryOrAssetId === "string" ? entryOrAssetId : entryOrAssetId?.asset_id;
    if (!assetId) return "";
    const dashboardPath = this.config.dashboard_path || "/mobility-supervisor/dashboard";
    const base = String(dashboardPath).replace(/\/?dashboard\/?$/, "").replace(/\/$/, "") || "/mobility-supervisor";
    return `${base}/asset-detail?asset=${encodeURIComponent(assetId)}#asset=${encodeURIComponent(assetId)}`;
  }

  /**
   * Canonical R21.8 command registry lookup.
   *
   * The frontend deliberately does not read the old
   * legacy mobility_asset command registry pattern anymore. If the
   * new registry is missing, actions disappear and the maintenance/contract
   * views expose that as a backend contract issue.
   */
  commandRegistry(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    const cacheKey = `commandRegistry:${canonical}`;
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const rows = this.uiCommandSurface(canonical)
      .filter((c) => c && this.contractBool(c.frontend_allowed, true) === true)
      .sort((a, b) => (Number(a.sort_order ?? 999) - Number(b.sort_order ?? 999)) || String(a.label).localeCompare(String(b.label)));
    this._memo.set(cacheKey, rows);
    return rows;
  }


  uiCommandSurface(assetId = "") {
    const v2 = this.commandV2Rows(assetId);
    if (v2 !== null) return v2;
    const entityIds = ["sensor.mobility_command_index"];
    for (const entityId of entityIds) {
      const entity = this.entity(entityId);
      if (!entity) continue;
      const attrs = entity.attributes || {};
      // R43.2.54: same authority, multiple transport serializations. Do not stop at
      // the first partially populated attribute; union exact command-index rows and
      // deduplicate by command_id so Restart/Identify/Unlock cannot disappear simply
      // because START/STOP were present in an earlier serialization.
      const commandAttrs = ["commands", "commands_json", "commands_by_asset", "commands_by_asset_json", "commands_by_id", "commands_by_id_json"];
      const collected = [];
      for (const attrName of commandAttrs) {
        const raw = attrs[attrName];
        let value = this.parseJsonValue(raw, null);
        if (!value && raw && typeof raw === "object") value = raw;
        collected.push(...this.commandsFromIndexValue(value, assetId));
      }
      const seen = new Set();
      const normalized = collected
        .map((entry) => this.normalizeCommandEntry(entry, entry?.asset_id || assetId))
        .filter(Boolean)
        .filter((entry) => {
          const key = String(entry.command_id || entry.command_key || "");
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .sort((a, b) => (Number(a.sort_order ?? 999) - Number(b.sort_order ?? 999)) || String(a.label).localeCompare(String(b.label)));
      if (normalized.length) return normalized;
    }
    return [];
  }

  commandsFromIndexValue(value, assetId = "") {
    if (!value) return [];
    if (Array.isArray(value)) {
      if (value.some((x) => typeof x === "object" && (x?.command_id || x?.command_key))) return value.filter((entry) => !assetId || String(entry?.asset_id || "") === String(assetId));
      // index of command registry entity ids or rows
      const registries = value.map((x) => typeof x === "string" ? x : (x.registry || x.entity_id || x.command_registry || x.command_registry_entity || "")).filter(Boolean);
      return registries.flatMap((entityId) => this.commandsFromRegistryEntity(entityId, assetId));
    }
    if (typeof value === "object") {
      if (Array.isArray(value.commands)) return this.commandsFromIndexValue(value.commands, assetId);
      if (assetId && value[assetId]) return this.commandsFromIndexValue(value[assetId], assetId);
      const rows = Object.entries(value).flatMap(([key, row]) => {
        const keyAsset = String(key || "").includes(":") ? String(key).split(":")[0] : String(key || "");
        if (Array.isArray(row)) return row.map((c) => ({ asset_id: c.asset_id || keyAsset, ...c }));
        if (typeof row === "string") return this.commandsFromRegistryEntity(row, assetId || keyAsset);
        if (row?.commands) return this.commandsFromIndexValue(row.commands, assetId || keyAsset).map((c) => ({ asset_id: c.asset_id || keyAsset, ...c }));
        if (row?.command_id || row?.command_key) return [{ asset_id: row.asset_id || keyAsset, ...row }];
        return [];
      });
      return rows.filter((entry) => !assetId || String(entry?.asset_id || "") === String(assetId));
    }
    return [];
  }

  commandsFromRegistryEntity(entityId, assetId = "") {
    // Strict contract mode: per-asset command registries are not consumed by UX.
    return [];
  }


  /** Normalize the backend command contract into the UI action model. */
  normalizeCommandEntry(entry, assetId = "") {
    if (!entry || typeof entry !== "object") return null;
    const rawCommandKey = String(entry.command_key || entry.key || entry.command_id || entry.command || entry.id || entry.name || "").trim();
    const command_id = entry.command_id || (rawCommandKey.includes(".") ? rawCommandKey.split(".").pop() : rawCommandKey) || entry.command || entry.id || entry.name;
    if (!command_id && !rawCommandKey) return null;
    const parameter_schema = this.parseJsonValue(entry.parameter_schema, {});
    const currentSchema = parameter_schema?.current_a || {};
    const frontendAllowed = this.contractBool(entry.frontend_allowed, true);
    const intent = entry.intent_entity || entry.action_entity || entry.button_entity || entry.entity_id || entry.intent || "";
    const invoke = this.parseJsonValue(entry.invoke, entry.invoke || {});
    const invokeObject = invoke && typeof invoke === "object" && !Array.isArray(invoke) ? invoke : {};
    const invokeService = String(invokeObject.service || "").trim();
    const serviceParts = invokeService.includes(".") ? invokeService.split(".") : [];
    const invokeDomain = serviceParts.length > 1 ? serviceParts.shift() : "";
    const invokeAction = serviceParts.length ? serviceParts.join(".") : "";
    return {
      schema_version: entry.schema_version || 1,
      asset_id: entry.asset_id || assetId || "",
      command_id,
      label: entry.label || entry.display_name || this.titleize(command_id || rawCommandKey),
      category: entry.category || "secondary",
      command_key: entry.command_key || rawCommandKey || "",
      command_family: entry.command_family || entry.family || "",
      command_group: entry.command_group || entry.group || "",
      command_role: entry.command_role || entry.role || "",
      current_state_property: entry.current_state_property || "",
      opposite_command_key: entry.opposite_command_key || "",
      frontend_allowed: frontendAllowed,
      execution_allowed: this.contractBool(entry.execution_allowed, true),
      exists: this.contractBool(entry.exists, true),
      enabled: this.contractBool(entry.enabled, true),
      intent_entity: intent,
      intent_candidates: intent ? [intent] : [],
      capability_entity: entry.capability_entity || "",
      disabled_reason_entity: entry.disabled_reason_entity || "",
      execution_status: entry.execution_status || entry.ui_state || entry.effective_availability || "",
      execution_status_entity: entry.execution_status_entity || "",
      execution_reason: entry.blocked_reason || entry.execution_reason || entry.disabled_reason || "",
      execution_reason_entity: entry.execution_reason_entity || "",
      source_entity_id: entry.source_entity_id || "",
      service_domain: invokeDomain || entry.service_domain || entry.domain || "",
      service_action: invokeAction || entry.service_action || entry.service || entry.action || "",
      service_data: this.parseJsonValue(invokeObject.data, this.parseJsonValue(entry.service_data, entry.service_data || {})),
      service_target: this.parseJsonValue(invokeObject.target, entry.service_target || entry.target || {}),
      invoke: invokeObject,
      confirmation_status_entity: entry.confirmation_status_entity || "",
      confirmation_reason_entity: entry.confirmation_reason_entity || "",
      value_entity: entry.value_entity || "",
      current_value_entity: entry.current_value_entity || entry.current_entity || "",
      parameter_schema,
      primary_action: this.contractBool(entry.primary_action, false),
      confirmation_required: this.contractBool(entry.confirmation_required, false),
      physical_executor_asset_id: entry.physical_executor_asset_id || "",
      min: entry.min ?? entry.minimum ?? currentSchema.min ?? null,
      max: entry.max ?? entry.maximum ?? currentSchema.max ?? null,
      step: entry.step ?? currentSchema.step ?? null,
      unit: entry.unit || entry.unit_of_measurement || currentSchema.unit || "",
      supported: this.contractBool(entry.supported ?? currentSchema.supported, true),
      capability: entry.capability ?? entry.can_execute ?? entry.available ?? null,
      sort_order: entry.sort_order ?? 999,
      disabled_reason: entry.disabled_reason || "",
      raw: entry
    };
  }

  commandExists(assetId, commandId) {
    const registry = this.commandRegistry(assetId);
    if (!registry.length) return null;
    return registry.some((c) => {
      const wanted = this.norm(commandId);
      const parts = [c.command_id, c.command_key, c.command_group, c.command_role].filter(Boolean).map((v)=>this.norm(v));
      return c.exists !== false && (parts.includes(wanted) || parts.some((p)=>p.endsWith(wanted)));
    });
  }


  // R22.10.3 shared Mobility runtime contract access layer.
  // All Mobility screens must use these methods instead of view-specific index parsing.
  vehicles() {
    return this.indexedAssets("vehicle").filter((a) => a.frontend_allowed !== false && a.lifecycle_state !== "Retired");
  }

  chargers() {
    return this.indexedAssets("charger").filter((a) => a.frontend_allowed !== false && a.lifecycle_state !== "Retired");
  }

  assetById(assetId, kind = "all") {
    const canonical = this.canonicalAssetId(assetId);
    const pool = kind === "vehicle" ? this.vehicles() : kind === "charger" ? this.chargers() : [...this.vehicles(), ...this.chargers(), ...this.indexedAssets("all")];
    return pool.find((a) => String(a.asset_id || "") === String(canonical)) || null;
  }

  vehicleById(assetId) { return this.assetById(assetId, "vehicle"); }
  chargerById(assetId) { return this.assetById(assetId, "charger"); }

  canonicalRows(entityId, attrName, cacheKey = "") {
    const key = `canonicalRows:${cacheKey || entityId}:${attrName}`;
    if (this._memo.has(key)) return this._memo.get(key);
    const entity = this.entity(entityId);
    const attrs = entity?.attributes || {};
    let raw = attrs[attrName];
    let value = this.parseJsonValue(raw, null);
    if (!value && typeof raw === "object") value = raw;
    const rows = Array.isArray(value) ? value : (value && typeof value === "object" ? Object.values(value) : []);
    this._memo.set(key, rows.filter((r) => r && typeof r === "object"));
    return this._memo.get(key);
  }

  canonicalRowsFromAttrs(entityId, attrNames = [], cacheKey = "") {
    const key = `canonicalRowsFromAttrs:${cacheKey || entityId}:${attrNames.join("|")}`;
    if (this._memo.has(key)) return this._memo.get(key);
    const entity = this.entity(entityId);
    const attrs = entity?.attributes || {};
    const rows = [];
    for (const attrName of attrNames) {
      const raw = attrs[attrName];
      let value = this.parseJsonValue(raw, null);
      if (!value && raw && typeof raw === "object") value = raw;
      if (Array.isArray(value)) rows.push(...value);
      else if (value && typeof value === "object") rows.push(...Object.values(value));
    }
    const normalized = rows.filter((r) => r && typeof r === "object");
    this._memo.set(key, normalized);
    return normalized;
  }

  normalizedPropertyCatalog(assetType = "") {
    const rows = Array.isArray(globalThis.HI_MOBILITY_NORMALIZED_PROPERTY_CATALOG)
      ? globalThis.HI_MOBILITY_NORMALIZED_PROPERTY_CATALOG
      : (typeof HI_MOBILITY_NORMALIZED_PROPERTY_CATALOG !== "undefined" ? HI_MOBILITY_NORMALIZED_PROPERTY_CATALOG : []);
    const t = String(assetType || "").trim().toLowerCase();
    return rows.filter((r) => r && (!t || String(r.asset_type || "").toLowerCase() === t));
  }

  commandStandardCatalog(assetType = "") {
    const rows = Array.isArray(globalThis.HI_MOBILITY_COMMAND_STANDARD)
      ? globalThis.HI_MOBILITY_COMMAND_STANDARD
      : (typeof HI_MOBILITY_COMMAND_STANDARD !== "undefined" ? HI_MOBILITY_COMMAND_STANDARD : []);
    const t = String(assetType || "").trim().toLowerCase();
    return rows.filter((r) => r && (!t || String(r.asset_type || "").toLowerCase() === t));
  }

  propertyKeyCandidates(assetId = "", field = "") {
    const canonical = this.canonicalAssetId(assetId || "");
    const assetType = canonical.startsWith("vehicle_") ? "vehicle" : canonical.startsWith("charger_") ? "charger" : canonical.startsWith("person_") ? "person" : "";
    const raw = String(field || "").trim();
    const stripped = raw.replace(/^(vehicle|charger|person|asset)\./, "");
    const candidates = [];
    const add = (v) => {
      const x = String(v ?? "").trim();
      if (x && !candidates.includes(x)) candidates.push(x);
    };
    add(raw);
    add(stripped);
    if (assetType) {
      add(`${assetType}.${raw}`);
      add(`${assetType}.${stripped}`);
    }
    if (!raw.startsWith("asset.")) add(`asset.${stripped}`);

    const legacyAliases = {
      soc: ["soc_pct", "battery_pct", "battery", "state_of_charge", "battery_percent"],
      battery: ["soc_pct", "battery_pct", "state_of_charge"],
      battery_pct: ["soc_pct"],
      soc_pct: ["battery", "state_of_charge"],
      range_km: ["ev_range_km", "range_ev_km", "full_range_km", "range_total_km", "total_range_km"],
      ev_range: ["ev_range_km", "electric_range_km", "secondary_engine_range"],
      electric_range_km: ["ev_range_km"],
      total_range_km: ["range_total_km", "full_range_km", "total_range_km", "range_km", "hybrid_range_km", "primary_engine_range", "vehicle.range_total_km"],
      full_range: ["range_total_km", "full_range_km", "total_range_km"],
      full_range_km: ["range_total_km", "full_range_km", "total_range_km", "range_km", "hybrid_range_km"],
      selected_charger: ["vehicle.assigned_charger_id", "vehicle.selected_charger"],
      assigned_charger_id: ["vehicle.assigned_charger_id", "vehicle.selected_charger"],
      assigned_charger: ["vehicle.assigned_charger_id", "vehicle.assigned_charger", "vehicle.selected_charger"],
      effective_charger: ["vehicle.effective_charger_id", "vehicle.effective_charger"],
      effective_charger_id: ["vehicle.effective_charger_id", "vehicle.effective_charger"],
      connected_charger: ["vehicle.connected_charger_id", "vehicle.connected_charger"],
      connected_charger_id: ["vehicle.connected_charger_id", "vehicle.connected_charger"],
      preferred_charger_id: ["vehicle.preferred_charger_id", "vehicle.assigned_charger_id", "vehicle.selected_charger"],
      charging_power: ["charging_power_kw", "charge_power", "power_kw", "current_power_kw", "import_power_kw"],
      charge_power: ["charging_power_kw"],
      import_power_kw: ["charging_power_kw", "power_kw", "current_power_kw"],
      net_power_kw: ["charging_power_kw", "power_kw", "current_power_kw"],
      actual_power_kw: ["charging_power_kw", "power_kw", "current_power_kw"],
      current_power_kw: ["power_kw", "charging_power_kw"],
      charger_state: ["operating_state", "charger.operating_state"],
      operational_status: ["operating_state", "charger.operating_state"],
      connection_state: ["connection_state", "connected_state", "vehicle_connection_state", "ev_connection_state", "plug_state", "connector_state"],
      connected_vehicle_id: ["connected_vehicle_id", "connected_vehicle", "effective_vehicle_id", "effective_vehicle", "selected_vehicle"],
      effective_vehicle_id: ["effective_vehicle_id", "effective_vehicle", "connected_vehicle_id", "connected_vehicle", "selected_vehicle"],
      selected_vehicle: ["selected_vehicle", "effective_vehicle", "connected_vehicle"],
      session_state: ["status", "charging_state"],
      runtime_activity: ["status", "charging_state", "last_seen"],
      actual_current_a: ["current_a", "current_limit_a"],
      current_limit: ["current_limit_a", "requested_current_a", "requested_current_limit", "requested_power_kw"],
      current_limit_amps: ["current_limit_a"],
      requested_current_limit: ["requested_current_a", "current_limit_a"],
      requested_power: ["requested_power_kw"],
      requested_power_kw: ["requested_power_kw", "vehicle.requested_power_kw", "vehicle.requested_charge_power_kw", "vehicle.charge_power_kw", "vehicle.mobility_charge_power_kw", "current_limit_a"],
      requested_charge_power_kw: ["vehicle.requested_charge_power_kw", "requested_charge_power_kw", "vehicle.requested_power_kw", "requested_power_kw", "vehicle.charge_power_kw", "vehicle.mobility_charge_power_kw"],
      vehicle_charge_power_kw: ["vehicle.requested_charge_power_kw", "vehicle.requested_power_kw", "vehicle.charge_power_kw", "vehicle.mobility_charge_power_kw", "requested_power_kw"],
      vehicle_charge_power: ["vehicle.requested_charge_power_kw", "vehicle.requested_power_kw", "vehicle.charge_power_kw", "vehicle.mobility_charge_power_kw", "requested_power_kw"],
      active_phases: ["effective_phase_count", "phase_count", "phases"],
      effective_phases: ["effective_phase_count", "phase_count", "phases"],
      phases: ["effective_phase_count", "phase_count"],
      phase_count: ["effective_phase_count", "phase_count", "phases"],
      min_power_kw: ["effective_min_power_kw"],
      max_power_kw: ["effective_max_power_kw"],
      min_current_a: ["charger.min_current_a", "min_current_a", "effective_min_current_a"],
      max_current_a: ["charger.max_current_a", "max_current_a", "effective_max_current_a"],
      effective_min_current_a: ["charger.min_current_a", "min_current_a", "effective_min_current_a", "current_limit_a"],
      effective_max_current_a: ["charger.max_current_a", "max_current_a", "effective_max_current_a", "current_limit_a"],
      physical_min_power_kw: ["charger.physical_min_power_kw", "physical_min_power_kw", "effective_min_power_kw", "min_power_kw"],
      physical_max_power_kw: ["charger.physical_max_power_kw", "physical_max_power_kw", "effective_max_power_kw", "max_power_kw"],
      power_source: ["status"],
      data_freshness: ["last_seen", "health"],
      vehicle_health: ["health"],
      charger_health: ["health", "charger.health"],
      data_quality: ["health"],
      make_model: ["model", "vehicle.model", "charger.model"],
      manufacturer: ["vendor", "make"],
      vendor: ["manufacturer"],
      owner: ["owner_label"],
      present: ["person.present", "asset.present", "vehicle.present"],
      ready_by: ["vehicle.ready_by"],
      target_soc: ["target_soc_pct"],
      target_soc_pct: ["vehicle.target_soc_pct", "default_target_soc_pct"],
      climate: ["climate_state"],
      climate_status: ["climate_state"],
      security: ["lock_state"],
      lock: ["lock_state"],
      door: ["door_state"],
      doors: ["door_state"],
      windows: ["window_state"],
      trunk: ["trunk_state"],
      hood: ["hood_state"],
      roof: ["roof_state"],
      odometer: ["odometer_km"],
      mileage: ["odometer_km"],
      service_due: ["service_due_days", "service_due_distance_km"],
      oil_change: ["oil_change_due_days", "oil_change_due_distance_km"],
      voltage: ["voltage_v", "phase_voltage_l1_v"],
      current: ["current_a"],
      power: ["power_kw"],
      session_energy: ["session_energy_kwh"],
      lifetime_energy: ["lifetime_energy_kwh"]
    };
    for (const alias of (legacyAliases[raw] || legacyAliases[stripped] || [])) add(alias);

    // Latest foundation matrix: accept any normalized property as direct key and bridge
    // plain keys to their normalized form. This makes every published property readable
    // one way or another without raw/entity fallback.
    const catalog = this.normalizedPropertyCatalog(assetType);
    for (const row of catalog) {
      const key = String(row.property_key || "");
      const plain = String(row.plain_key || key.replace(/^(vehicle|charger|person|asset)\./, ""));
      if (raw === key || stripped === key || raw === plain || stripped === plain || raw.endsWith(`.${plain}`)) {
        add(key); add(plain);
      }
    }

    const expanded = [];
    for (const item of candidates) {
      add(item);
      expanded.push(item);
      const plain = String(item).replace(/^(vehicle|charger|person|asset)\./, "");
      expanded.push(plain);
      if (assetType) expanded.push(`${assetType}.${plain}`);
      if (!String(item).startsWith("asset.")) expanded.push(`asset.${plain}`);
    }
    for (const item of expanded) add(item);
    if (canonical.startsWith("charger_") && stripped === "charging_state") { add("operating_state"); add("charger.operating_state"); }
    return candidates;
  }


  canonicalFamilies() {
    return ["overview","vehicle","charging","battery","range","climate","security","openings","maintenance","tires","location","energy","metering","diagnostics"];
  }

  familyConfig(family = "overview") {
    const f = String(family || "overview").toLowerCase();
    const map = {
      overview: { title:"Overview", icon:"mdi:view-dashboard-outline", order:0 },
      vehicle: { title:"Vehicle", icon:"mdi:car-info", order:10 },
      charging: { title:"Charging", icon:"mdi:battery-charging", order:20 },
      battery: { title:"Battery", icon:"mdi:battery", order:30 },
      range: { title:"Range", icon:"mdi:map-marker-distance", order:40 },
      climate: { title:"Climate", icon:"mdi:fan", order:50 },
      security: { title:"Security", icon:"mdi:shield-check-outline", order:60 },
      openings: { title:"Openings", icon:"mdi:car-door", order:70 },
      maintenance: { title:"Maintenance", icon:"mdi:wrench-clock", order:80 },
      tires: { title:"Tires", icon:"mdi:car-tire-alert", order:90 },
      location: { title:"Location", icon:"mdi:map-marker", order:100 },
      energy: { title:"Energy", icon:"mdi:flash", order:110 },
      metering: { title:"Metering", icon:"mdi:counter", order:120 },
      diagnostics: { title:"Diagnostics", icon:"mdi:tools", order:900 }
    };
    return map[f] || { title:this.titleize(f), icon:"mdi:folder-outline", order:500 };
  }

  normalizedFamilyName(value = "") {
    const f = String(value || "").trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    if (!f) return "";
    const aliases = { comfort:"climate", access:"security", locks:"security", doors:"openings", windows:"openings", electrical:"charging", configuration:"overview", config:"overview", identity:"overview", trust:"diagnostics", health:"diagnostics" };
    return aliases[f] || f;
  }

  fallbackFamilyForPropertyKey(propertyKey = "", assetType = "") {
    const k = String(propertyKey || "").toLowerCase();
    const plain = k.replace(/^(vehicle|charger|person|asset|mobility|fleet|connections|owners)\./, "");
    if (!plain) return "overview";
    // R22.11.17 intelligence alignment: R39 introduces domain/subdomain intelligence
    // prefixes. These are only consumed when they are published through approved
    // runtime property indexes; the UX must not query new intelligence registries.
    if (k.startsWith("mobility.")) return plain.includes("diagnostic") || plain.includes("trust") ? "diagnostics" : "overview";
    if (k.startsWith("fleet.")) return plain.includes("location") ? "location" : plain.includes("energy") ? "energy" : "vehicle";
    if (k.startsWith("connections.")) return plain.includes("meter") || plain.includes("energy") || plain.includes("cost") ? "metering" : "charging";
    if (k.startsWith("owners.")) return plain.includes("present") || plain.includes("location") ? "location" : "vehicle";
    if (k.startsWith("asset.")) return "overview";
    if (plain.includes("diagnostic") || plain.includes("source_") || plain.includes("api_quota") || plain.includes("latency") || plain.includes("reconnect")) return "diagnostics";
    if (plain.includes("tire") || plain.includes("tyre")) return "tires";
    if (plain.includes("location") || plain.includes("position") || plain.includes("park_time")) return "location";
    if (plain.includes("climate") || plain.includes("cabin") || plain.includes("temperature") || plain.includes("precondition")) return "climate";
    if (plain.includes("lock") || plain.includes("security") || plain.includes("alarm")) return "security";
    if (plain.includes("door") || plain.includes("window") || plain.includes("hood") || plain.includes("trunk") || plain.includes("tailgate") || plain.includes("roof") || plain.includes("opening")) return "openings";
    if (plain.includes("service") || plain.includes("oil") || plain.includes("odometer") || plain.includes("mileage") || plain.includes("last_seen") || plain.includes("firmware") || plain.includes("serial")) return "maintenance";
    if (plain.includes("range") || plain.includes("fuel_range") || plain.includes("nominal_range")) return "range";
    if (plain.includes("soc") || plain.includes("battery")) return "battery";
    if (plain.includes("session_energy") || plain.includes("lifetime_energy") || plain.includes("grid_energy") || plain.includes("solar_energy") || plain.includes("meter") || plain.includes("cost")) return "metering";
    if (plain.includes("energy")) return "energy";
    if (plain.includes("charge") || plain.includes("charging") || plain.includes("plug") || plain.includes("ready_by") || plain.includes("target_soc") || plain.includes("current_limit") || plain.includes("requested_power") || plain.includes("power_kw") || plain.includes("current_a") || plain.includes("voltage") || plain.includes("phase") || plain.includes("status")) return "charging";
    if (assetType === "vehicle") return "vehicle";
    return "overview";
  }

  propertyFamilyContractValue(row = {}) {
    return this.normalizedFamilyName(row.family || row.property_family || row.ux_family || "");
  }

  propertyPresentationFamilyOverride(row = {}, explicit = "") {
    const assetType = String(row.asset_type || "").toLowerCase();
    const k = String(row.property_key || "").toLowerCase();
    const e = String(explicit || "").toLowerCase();

    // Runtime R40.7 observed: charger asset identity rows can be published with
    // family=vehicle. UX must remain readable while reporting the backend gap.
    if (assetType === "charger" && e === "vehicle" && k.startsWith("asset.")) return "overview";
    if (assetType === "person" && (e === "vehicle" || e === "charger") && k.startsWith("asset.")) return "overview";

    // Charger electrical and configuration settings belong to the charging
    // presentation family even when the backend temporarily publishes family=charger.
    if (assetType === "charger" && e === "charger") {
      if (/(current|voltage|power|phase|energy|meter|requested_power|current_limit|status|charging_policy|offered|export|import|session|lifetime)/.test(k)) return "charging";
      if (/(error|warning|latency|reconnect|uptime|firmware|last_seen|config_response)/.test(k)) return "maintenance";
    }
    return "";
  }

  propertyFamily(row = {}) {
    const explicit = this.propertyFamilyContractValue(row);
    const valid = this.canonicalFamilies();
    const override = this.propertyPresentationFamilyOverride(row, explicit);
    if (override) return override;
    if (explicit && valid.includes(explicit)) return explicit;
    return this.fallbackFamilyForPropertyKey(row.property_key || row.normalized_property || row.fact_type || "", row.asset_type || "");
  }

  propertyGroup(row = {}) {
    const explicitRaw = String(row.group || row.property_group || row.ux_group || "").trim();
    if (explicitRaw) {
      const explicit = explicitRaw.toLowerCase() === "main_info" ? "overview" : explicitRaw;
      return explicit;
    }
    const k = String(row.property_key || "").toLowerCase();
    if (k.startsWith("mobility.")) return "domain_intelligence";
    if (k.startsWith("fleet.")) return "fleet_intelligence";
    if (k.startsWith("connections.")) return "connection_intelligence";
    if (k.startsWith("owners.")) return "owner_intelligence";
    if (k.includes("lock")) return "locks";
    if (k.includes("door")) return "doors";
    if (k.includes("window")) return "windows";
    if (k.includes("climate")) return "cabin_climate";
    if (k.includes("soc") || k.includes("battery")) return "battery_state";
    if (k.includes("range")) return "range";
    if (k.includes("session") || k.includes("lifetime") || k.includes("meter")) return "metering";
    if (k.includes("current_limit") || k.includes("requested_power")) return "charge_settings";
    if (k.includes("status") || k.includes("charge") || k.includes("plug")) return "charging_state";
    return "general";
  }

  propertyParent(row = {}) {
    return String(row.parent || row.parent_property || row.parent_key || row.summary_parent || this.propertyGroup(row) || "general").trim();
  }

  propertyDetailLevel(row = {}) {
    const explicit = String(row.detail_level || row.visibility_level || row.ux_detail_level || "").trim().toLowerCase();
    if (["summary","operational","technical"].includes(explicit)) return explicit;
    const f = this.propertyFamily(row);
    const k = String(row.property_key || "").toLowerCase();
    if (f === "diagnostics" || k.includes("source_") || k.includes("diagnostic")) return "technical";
    if (["asset.display_name","asset.short_name","vehicle.soc_pct","vehicle.ev_range_km","vehicle.full_range_km","vehicle.lock_state","vehicle.climate_state","vehicle.charge_state","vehicle.charging_state","charger.operating_state","charger.connection_state","charger.power_kw"].includes(k)) return "summary";
    return "operational";
  }

  propertyDisplayLabel(row = {}) {
    const key = String(row.property_key || row.fact_type || "");
    const labels = {
      "vehicle.preferred_charger_id":"Preferred charger",
      "vehicle.connected_charger_id":"Connected charger",
      "vehicle.effective_charger_id":"Active charger",
      "vehicle.assigned_charger_id":"Preferred charger",
      "vehicle.selected_charger":"Preferred charger",
      "vehicle.effective_charger":"Active charger",
      "vehicle.connected_charger":"Connected charger",
      "vehicle.nominal_range_km":"Nominal range",
      "vehicle.max_ac_power_kw":"Max AC power",
      "vehicle.effective_max_charge_power_kw":"Effective max charge power",
      "vehicle.effective_phase_count":"Effective phases",
      "vehicle.phase_capability":"Phase capability",
      "charger.max_ac_power_kw":"Max AC power",
      "charger.physical_min_power_kw":"Physical min power",
      "charger.physical_max_power_kw":"Physical max power",
      "charger.phase_capability":"Phase capability",
      "charger.energy_kwh":"Energy",
      "vehicle.charge_mode":"Charge mode",
      "vehicle.billing_account_id":"Billing account",
      "charger.billing_account_id":"Billing account",
      "vehicle.requested_charge_power_kw":"Vehicle charge power",
      "requested_charge_power_kw":"Vehicle charge power",
      "requested_power_kw":"Vehicle charge power",
      "charge_power_kw":"Vehicle charge power",
      "vehicle.requested_power_kw":"Vehicle charge power",
      "vehicle.charge_power_kw":"Vehicle charge power",
      "vehicle.mobility_charge_power_kw":"Vehicle charge power",
      "charger.requested_power_kw":"Requested power",
      "charger.current_limit_a":"Current limit",
      "charger.connection_state":"Connection",
      "charger.connected_vehicle_id":"Connected vehicle",
      "charger.effective_vehicle_id":"Active vehicle",
      "charger.selected_vehicle":"Connected vehicle",
      "charger.effective_vehicle":"Active vehicle",
      "charger.connected_vehicle":"Connected vehicle",
      "charger.operating_state":"Operating state",
      "charger.status":"Source status",
      "lifecycle_status":"Lifecycle",
      "asset.lifecycle_status":"Lifecycle",
      "vehicle.lifecycle_status":"Lifecycle",
      "charger.lifecycle_status":"Lifecycle"
    };
    if (labels[key]) return labels[key];
    const explicit = String(row.display_name || row.label || row.name || "").trim();
    if (explicit && explicit !== key) return explicit;
    const labelKey = key.replace(/^(vehicle|charger|person|asset)\./, "");
    return this.titleize(labelKey.replace(/_/g, " "));
  }

  valueWithoutUnit(value, unit = "") {
    const raw = String(value ?? "").trim();
    const u = String(unit || "").trim();
    if (!raw || !u) return raw;
    const escaped = u.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");
    return raw.replace(new RegExp(`\\s*${escaped}$`, "i"), "").trim();
  }

  formatNumberForUnit(value, unit = "", propertyKey = "") {
    const raw = this.valueWithoutUnit(value, unit);
    const n = Number(String(raw).replace(",", "."));
    if (!Number.isFinite(n)) return String(value ?? "");
    const u = String(unit || "").trim();
    const key = String(propertyKey || "").toLowerCase();
    let decimals = 2;
    const ul = u.toLowerCase();
    if (ul === "kwh" || key.includes("energy") || key.includes("cost")) decimals = 4;
    else if (ul === "kw" || key.includes("power")) decimals = 2;
    else if (ul === "a" || key.includes("current")) decimals = 1;
    else if (ul === "km" || key.includes("range") || key.includes("odometer") || key.includes("distance")) decimals = 0;
    else if (u === "%" || key.includes("soc") || key.includes("pct")) decimals = Math.abs(n - Math.round(n)) < 0.05 ? 0 : 1;
    const fixed = n.toFixed(decimals);
    return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }

  formatValue(value, unit = "", propertyKey = "") {
    const s = String(value ?? "").trim();
    if (!s || ["Unknown","Not available","—","None"].includes(s)) return s || "—";
    const formatted = this.formatNumberForUnit(s, unit, propertyKey);
    const u = String(unit || "").trim();
    if (!u) return formatted;
    const noUnit = this.valueWithoutUnit(formatted, u);
    return `${noUnit} ${u}`.trim();
  }

  displayFactWithUnit(assetId, field, fallback = "—") {
    const row = this.factContractRow(assetId, field);
    if (!row) return fallback;
    return this.propertyDisplayValue(row, fallback);
  }

  propertyDisplayValue(row = {}, fallback = "Unknown") {
    const key = String(row.property_key || "").toLowerCase();
    const value = this.factContractValue(row.asset_id, row.property_key, fallback);
    if (["lifecycle_status", "asset.lifecycle_status", "vehicle.lifecycle_status", "charger.lifecycle_status"].includes(key)) {
      const v = String(value || "").trim().toLowerCase();
      if (v === "active") return "Active";
      if (v === "disabled") return "Disabled";
      return value || fallback;
    }
    if (key.includes("charger_id") || key.includes("charger") && String(value || "").startsWith("charger_")) return this.chargerLabel(value);
    if (key.includes("vehicle_id") || key.includes("vehicle") && String(value || "").startsWith("vehicle_")) return this.vehicleLabel(value);
    return this.formatValue(value, row.unit || "", row.property_key || "");
  }

  uxEditorControlKind(prop = {}) {
    // Backend-published canonical write metadata is the sole editor authority.
    // Direct V2 semantic properties are primary; frozen V1 metadata is compatibility-only.
    // Do not infer editor type from property names, units, integrations or values.
    const binding = String(prop.write_binding_type || prop.editor || "").trim().toLowerCase();
    if (binding === "select") return "select";
    if (binding === "text") return "text";
    if (binding === "switch" || binding === "toggle" || binding === "boolean") return "toggle";
    if (binding === "number" || binding === "slider") return "slider";
    if (binding === "datetime" || binding === "datetime-local") return "datetime";
    return "";
  }

  isConfigurationCommand(command = {}) {
    const key = String(command.command_key || command.command_id || command.label || "").toLowerCase();
    const role = String(command.command_role || command.role || "").toLowerCase();
    const forbidden = [
      "set_current_limit", "set_requested_power", "set_target_soc", "set_ready_by",
      "set_display_name", "set_profile", "set_selected_charger", "set_owner", "set_short_name"
    ];
    return forbidden.some((part) => key.includes(part) || role.includes(part));
  }

  commandFamilyIssue(command = {}) {
    if (!command || command.frontend_allowed === false) return "";
    const explicit = this.normalizedFamilyName(command.command_family || command.family || "");
    const assetId = this.canonicalAssetId(command.asset_id || "");
    const currentKey = String(command.current_state_property || "").trim();
    const row = currentKey ? this.factContractRow(assetId, currentKey) : null;
    const propFamily = row ? this.propertyFamily(row) : (currentKey ? this.fallbackFamilyForPropertyKey(currentKey, command.asset_type || "") : "");
    if (explicit && propFamily && explicit !== propFamily) return `Command family '${explicit}' does not match property family '${propFamily}' for ${currentKey}`;
    return "";
  }

  resolvedCommandFamily(command = {}) {
    const explicit = this.normalizedFamilyName(command.command_family || command.family || "");
    if (explicit) return explicit;
    const currentKey = String(command.current_state_property || "").trim();
    if (currentKey) return this.fallbackFamilyForPropertyKey(currentKey, command.asset_type || "");
    return this.normalizedFamilyName(command.command_group || command.group || "") || "overview";
  }

  familyCommandRows(assetId = "", family = "") {
    const f = this.normalizedFamilyName(family);
    return this.commandsFor(assetId)
      .filter((cmd) => this.resolvedCommandFamily(cmd) === f)
      .map((cmd) => {
        const st = this.commandState(cmd);
        const label = cmd.label || this.titleize(cmd.command_id || cmd.command_key || "Command");
        const value = st.disabled ? `Blocked${st.reason ? ` — ${st.reason}` : ""}` : "Available";
        return { type:"readonly", icon:this.commandIcon(cmd), label, value, _command:true, detail_level:"operational", order:Number(cmd.sort_order ?? 999) };
      });
  }

  familyLogicalSectionForProperty(row = {}) {
    const level = this.propertyDetailLevel(row);
    const family = this.propertyFamily(row);
    const group = String(this.propertyGroup(row) || "").toLowerCase();
    const k = String(row.property_key || "").toLowerCase();
    const authority = String(row.authority || row.value_authority || row.source_layer || "").toLowerCase();
    if (level === "technical" || family === "diagnostics" || group === "diagnostics" || k.includes("diagnostic") || k.includes("error") || k.includes("warning") || k.includes("firmware") || k.includes("communication")) return "diagnostics";
    if (group === "metering" || family === "metering" || k.includes("session_energy") || k.includes("lifetime_energy") || k.includes("grid_energy") || k.includes("solar_energy") || k.includes("cost") || k.includes("meter") || k.includes("cycle_count") || k.includes("efficiency")) return "metering";
    if (group === "overview" || level === "summary") return "overview";
    if (group === "details") return "details";
    if (group === "actions") return "details"; // R41.4: actions are commands only; properties stay readable/editable elsewhere.
    if (authority.includes("diagnostic")) return "diagnostics";
    return "details";
  }

  familyLogicalSectionLabel(section = "details") {
    const key = String(section || "details").toLowerCase();
    const labels = { overview:"Overview", editors:"Editors", settings:"Editors", actions:"Actions", details:"Details", metering:"Metering", diagnostics:"Diagnostics" };
    return labels[key] || this.titleize(key);
  }

  familyLogicalSectionOrder(section = "details") {
    const order = { overview:0, editors:8, settings:8, actions:10, details:20, metering:30, diagnostics:40 };
    return order[String(section || "details").toLowerCase()] ?? 99;
  }


  isWritableProperty(prop = {}) {
    const editor = this.uxEditorControlKind(prop);
    return this.contractBool(prop.editable, false) === true
      && this.contractBool(prop.write_supported, false) === true
      && !!editor
      && !!prop.write_service_domain
      && !!prop.write_service_action
      && !!prop.write_target_entity;
  }

  propertyEditorChoices(prop = {}) {
    // Backend-published choices/options are authoritative. Direct V2 metadata is primary.
    // UX never derives profile, charger or other configuration options from integrations or device identity.
    const direct = this.parseJsonValue(prop.choices, prop.choices || null);
    if (Array.isArray(direct)) return direct;
    const options = this.parseJsonValue(prop.options, prop.options || null);
    if (Array.isArray(options)) return options;
    const validation = prop.validation && typeof prop.validation === "object" ? prop.validation : {};
    const validationChoices = this.parseJsonValue(validation.choices, validation.choices || null);
    if (Array.isArray(validationChoices)) return validationChoices;
    const validationOptions = this.parseJsonValue(validation.options, validation.options || null);
    if (Array.isArray(validationOptions)) return validationOptions;
    return [];
  }

  numericPropertyValue(assetId = "", propertyKey = "", fallback = null) {
    const v = this.factValue(assetId, propertyKey, fallback);
    const n = Number(String(this.valueWithoutUnit(v ?? "", "")).replace(",", "."));
    return Number.isFinite(n) ? n : fallback;
  }

  numericPropertyValueAny(assetId = "", propertyKeys = [], fallback = null) {
    for (const key of propertyKeys.filter(Boolean)) {
      const v = this.numericPropertyValue(assetId, key, null);
      if (Number.isFinite(v)) return v;
    }
    return fallback;
  }

  sliderBoundsForProperty(prop = {}) {
    // R43.2.54: min/max/step are property-contract metadata. UX does not derive
    // power from current/phases/voltage, clamp against local capability guesses,
    // or invent semantic fallback bounds.
    const validation = prop.validation && typeof prop.validation === "object" ? { ...prop.validation } : {};
    const min = validation.min ?? validation.minimum ?? prop.min;
    const max = validation.max ?? validation.maximum ?? prop.max;
    const step = validation.step ?? prop.step;
    const nMin = Number(String(min ?? "").replace(",", "."));
    const nMax = Number(String(max ?? "").replace(",", "."));
    const nStep = Number(String(step ?? "").replace(",", "."));
    const valid = Number.isFinite(nMin) && Number.isFinite(nMax) && nMax >= nMin;
    return {
      min: valid ? nMin : "",
      max: valid ? nMax : "",
      step: Number.isFinite(nStep) && nStep > 0 ? nStep : "",
      valid: valid && Number.isFinite(nStep) && nStep > 0,
      source: valid && Number.isFinite(nStep) && nStep > 0 ? "property_contract" : ""
    };
  }

  propertyEditorRow(prop) {
    const editor = this.uxEditorControlKind(prop);
    const validation = prop.validation && typeof prop.validation === "object" ? { ...prop.validation } : {};
    const slider = this.sliderBoundsForProperty(prop);
    if (slider.valid) {
      validation.min = slider.min;
      validation.max = slider.max;
      validation.step = slider.step;
    }
    const allowNone = this.contractBool(prop.allow_none, false);
    const noneValue = prop.none_value ?? "";
    const configuredValue = prop.value === undefined || prop.value === null || String(prop.value).trim() === ""
      ? (allowNone ? noneValue : "")
      : prop.value;
    return {
      type:"property-editor",
      property: prop,
      icon: prop.icon || this.propertyIcon(prop.property_key),
      label: this.propertyDisplayLabel(prop),
      value: this.propertyDisplayValue(prop),
      editor_value: configuredValue,
      help: prop.description || prop.meaning || "",
      editor,
      validation,
      slider_bounds_valid: slider.valid,
      slider_bounds_source: slider.source || "",
      choices: this.propertyEditorChoices(prop),
      choice_source: prop.choice_source || "",
      value_field: prop.value_field || "value",
      label_field: prop.label_field || "label",
      secondary_label_field: prop.secondary_label_field || "secondary_label",
      allow_none: allowNone,
      none_value: noneValue,
      disabled: !this.isWritableProperty(prop),
      disabled_reason: !this.contractBool(prop.write_supported, false) ? "Editing not available" : (!editor ? "Editor metadata missing" : (!prop.write_service_domain || !prop.write_service_action || !prop.write_target_entity) ? "Write binding incomplete" : "")
    };
  }

  propertyOperationalRow(prop) {
    if (this.isWritableProperty(prop)) return this.propertyEditorRow(prop);
    return { type:"readonly", icon: prop.icon || this.propertyIcon(prop.property_key), label:this.propertyDisplayLabel(prop), value:this.propertyDisplayValue(prop), detail_level:prop._ux_level, parent:prop._ux_parent, group:prop._ux_group };
  }

  propertyWriteSection(prop) {
    if (this.isWritableProperty(prop)) return "editors";
    return this.familyLogicalSectionForProperty(prop);
  }

  activityRowsFor(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const rows = [...(this.mobilityActivityV2()?.activities || [])];
    return rows.filter((a)=>!canonical || String(a.asset_id || a.subject_asset_id || a.related_asset_id || "") === canonical || String(a.related_asset_id || "") === canonical);
  }

  intelligenceRowsFor(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const experience = this.mobilityExperienceV2();
    if (!experience) return [];
    const source = [...(experience.vehicles || []), ...(experience.chargers || [])]
      .filter((row)=>!canonical || String(row?.asset_id || "") === canonical);
    const rows = [];
    for (const row of source) {
      for (const [key, value] of Object.entries(row || {})) {
        if (!key.endsWith("_intelligence") || !value || typeof value !== "object") continue;
        rows.push({
          asset_id: row.asset_id,
          insight_type: key,
          family: key.replace(/_intelligence$/, ""),
          title: key.replace(/_/g, " "),
          message: value.summary || value.reason || value.state || "",
          value: value.state,
          reason: value.reason || "",
          raw: value,
          _authority: "MOBILITY_EXPERIENCE_V2"
        });
      }
    }
    return rows;
  }


  clusterIntelligenceRows(assetType = "vehicle", assetId = "") {
    const entityId = assetType === "charger" ? "sensor.mobility_charger_intelligence_index" : "sensor.mobility_vehicle_intelligence_index";
    const canonical = this.canonicalAssetId(assetId);
    const attrs = this.entity(entityId)?.attributes || {};
    const rows = [];
    const collect = (value, keyHint = "") => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) {
        for (const item of parsed) rows.push({ ...(item || {}), asset_id: item?.asset_id || item?.subject_asset_id || keyHint });
      } else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.rows)) collect(parsed.rows, keyHint);
        if (Array.isArray(parsed.intelligence)) collect(parsed.intelligence, keyHint);
        if (Array.isArray(parsed.clusters)) collect(parsed.clusters, keyHint);
        for (const [key, val] of Object.entries(parsed)) {
          if (["rows","intelligence","clusters","schema_version","contract_version","generated_at"].includes(key)) continue;
          if (Array.isArray(val)) collect(val.map((r)=>({ asset_id:r?.asset_id || r?.subject_asset_id || key, ...r })), key);
          else if (val && typeof val === "object") rows.push({ asset_id:val.asset_id || val.subject_asset_id || key, ...val });
        }
      }
    };
    for (const attrName of ["assets_json", "assets", "rows", "rows_json", "intelligence", "intelligence_json", "clusters", "clusters_json", "vehicles", "chargers", "by_asset", "intelligence_by_asset", "summary_by_asset"]) collect(attrs[attrName], "");
    return rows.filter((r)=>!canonical || String(r.asset_id || r.subject_asset_id || r.related_asset_id || "") === canonical);
  }

  clusterIntelligenceObject(assetId = "", assetType = "vehicle") {
    const rows = this.clusterIntelligenceRows(assetType, assetId);
    if (!rows.length) return null;
    const first = rows[0] || {};
    return first.summary && typeof first.summary === "object" ? { ...first, ...first.summary } : first;
  }

  contractGapTile(label = "Contract", icon = "mdi:alert-outline", detail = "Required intelligence contract missing") {
    return { icon, label, value:"Contract gap", subvalue:detail, tone:"attention", subIcon:"mdi:alert-outline" };
  }

  normalizedIntelligenceTile(raw = null, required = {}) {
    if (!raw || typeof raw !== "object" || !Object.keys(raw).length) {
      return this.contractGapTile(required.label || "Status", required.icon || "mdi:alert-outline", required.detail || "Missing from intelligence index");
    }
    const primary = raw.primary ?? raw.primary_display ?? raw.summary ?? raw.value ?? raw.display ?? raw.label ?? raw.state_label ?? "";
    const secondary = raw.secondary ?? raw.secondary_display ?? raw.reason ?? raw.detail ?? raw.message ?? raw.activity_display ?? raw.charging_activity_display ?? "";
    if (!String(primary || "").trim()) {
      return this.contractGapTile(required.label || raw.label || "Status", required.icon || raw.icon || "mdi:alert-outline", "Missing primary display");
    }
    const severity = String(raw.severity || raw.tone || raw.state || "neutral").toLowerCase();
    const tone = /error|critical|not_ok|not ok|fault/.test(severity) ? "error" : (/warn|attention|stale|due/.test(severity) ? "attention" : (/active|charging/.test(severity) ? "active" : "neutral"));
    return {
      icon: raw.icon || raw.primary_icon || required.icon || "mdi:information-outline",
      label: required.label || raw.label_text || raw.title || raw.label || "Status",
      value: String(primary || "Unknown"),
      subvalue: secondary ? String(secondary) : "",
      tone,
      subIcon: raw.reason_icon || raw.secondary_icon || ""
    };
  }

  vehicleIntelligenceStatusTiles(assetId = "") {
    const obj = this.clusterIntelligenceObject(assetId, "vehicle");
    if (!obj) {
      return [
        this.contractGapTile("Range", "mdi:road-variant", "sensor.mobility_vehicle_intelligence_index missing"),
        this.contractGapTile("Energy", "mdi:battery-charging", "sensor.mobility_vehicle_intelligence_index missing"),
        this.contractGapTile("Security", "mdi:lock-outline", "sensor.mobility_vehicle_intelligence_index missing"),
        this.contractGapTile("Maintenance", "mdi:wrench-outline", "sensor.mobility_vehicle_intelligence_index missing"),
        this.contractGapTile("Freshness", "mdi:clock-outline", "sensor.mobility_vehicle_intelligence_index missing")
      ];
    }
    const range = obj.range_intelligence || obj.range || obj.range_summary || obj.Range || null;
    const energy = obj.energy_intelligence || obj.energy || obj.energy_summary || obj.charging_energy || obj.Energy || null;
    const charging = obj.charging_intelligence || obj.charging || obj.charging_summary || null;
    const security = obj.security_intelligence || obj.security || obj.security_summary || obj.Security || null;
    const maintenance = obj.maintenance_intelligence || obj.maintenance || obj.maintenance_summary || obj.Maintenance || null;
    const freshness = obj.freshness_intelligence || obj.freshness || obj.freshness_summary || obj.data_freshness || obj.Freshness || null;
    const energyRaw = energy ? {
      ...energy,
      primary: energy.primary || energy.primary_display || [energy.ev_range_display, energy.battery_soc_display].filter(Boolean).join(" · ") || energy.display,
      secondary: energy.secondary || energy.secondary_display || energy.charging_activity_display || energy.activity_display || charging?.summary || charging?.primary || charging?.primary_display || [energy.actual_charge_power_display, energy.charge_state || energy.charging_state].filter(Boolean).join(" "),
      icon: energy.icon || "mdi:battery-charging"
    } : null;
    return [
      this.normalizedIntelligenceTile(range, { label:"Range", icon:"mdi:road-variant" }),
      this.normalizedIntelligenceTile(energyRaw, { label:"Energy", icon:"mdi:battery-charging" }),
      this.normalizedIntelligenceTile(security, { label:"Security", icon:"mdi:lock-outline" }),
      this.normalizedIntelligenceTile(maintenance, { label:"Maintenance", icon:"mdi:wrench-outline" }),
      this.normalizedIntelligenceTile(freshness, { label:"Freshness", icon:"mdi:clock-outline" })
    ];
  }

  // Charger product headline semantics intentionally have no intelligence-based
  // compatibility resolver. Use chargerProductSnapshot() only.

  lifecyclePropertyRow(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    // R43.2.54: lifecycle is a property concern. Deprecated aggregate runtime
    // publications and asset-index metadata are never product lifecycle fallbacks.
    return (this.propertyRows(canonical) || []).find((p) => String(p.property_key || "").toLowerCase() === "lifecycle_status") || null;
  }



  lifecycleStatus(assetOrId = "") {
    const asset = typeof assetOrId === "object" ? assetOrId : this.assetById(assetOrId);
    const canonical = this.canonicalAssetId(asset?.asset_id || assetOrId || "");
    const prop = canonical ? this.lifecyclePropertyRow(canonical) : null;
    const raw = String(prop?.value ?? "").trim().toLowerCase();
    if (raw === "active") return "active";
    if (raw === "disabled") return "disabled";
    if (raw === "retired") return "retired";
    return "unknown";
  }

  isLifecycleActive(assetOrId = "") {
    return this.lifecycleStatus(assetOrId) === "active";
  }

  isLifecycleDisabled(assetOrId = "") {
    return this.lifecycleStatus(assetOrId) === "disabled";
  }

  lifecycleWriteModel(assetOrId = "", desiredStatus = "") {
    const asset = typeof assetOrId === "object" ? assetOrId : this.assetById(assetOrId);
    const canonical = this.canonicalAssetId(asset?.asset_id || assetOrId || "");
    const value = String(desiredStatus || "").trim().toLowerCase();
    const prop = canonical ? this.lifecyclePropertyRow(canonical) : null;
    const writable = !!(prop && this.isWritableProperty(prop));
    const current = this.lifecycleStatus(asset || canonical);
    return {
      asset_id: canonical,
      property_key: prop?.property_key || "lifecycle_status",
      prop,
      current,
      desired: value,
      writable,
      disabled: !writable || !["active", "disabled"].includes(value),
      reason: prop ? (writable ? "" : "Lifecycle write binding incomplete") : "Lifecycle contract gap"
    };
  }

  propertyTransportValue(prop = {}, semanticValue = "") {
    const domainText = String(prop.write_service_domain || "").toLowerCase();
    const actionText = String(prop.write_service_action || "").toLowerCase();
    const binding = String(prop.write_binding_type || "").toLowerCase();
    if (!(binding === "select" || domainText === "select" || actionText.includes("select"))) return semanticValue;
    const choices = this.propertyEditorChoices(prop);
    const wanted = String(semanticValue ?? "");
    const match = choices.find((row)=>{
      const value = typeof row === "object" && row !== null ? row.value : row;
      return String(value ?? "") === wanted;
    });
    if (match && typeof match === "object" && match !== null) {
      const transport = match.transport_value ?? match.transportValue;
      if (transport !== undefined && transport !== null && String(transport).trim() !== "") return transport;
      const label = match.label ?? match.display_name ?? match.name;
      if (label !== undefined && label !== null && String(label).trim() !== "") return label;
    }
    return semanticValue;
  }

  canonicalWriteValueEqual(actual, expected) {
    if (typeof expected === "boolean") return String(actual).toLowerCase() === String(expected).toLowerCase();
    const a = Number(String(actual ?? "").replace(",", "."));
    const e = Number(String(expected ?? "").replace(",", "."));
    if (String(actual ?? "").trim() !== "" && String(expected ?? "").trim() !== "" && Number.isFinite(a) && Number.isFinite(e)) {
      return Math.abs(a - e) <= 0.000001;
    }
    return String(actual ?? "").trim() === String(expected ?? "").trim();
  }

  async waitForCanonicalPropertyReadback(assetId = "", propertyKey = "", expected = "", options = {}) {
    const canonical = this.canonicalAssetId(assetId);
    const attempts = Math.max(1, Number(options.attempts || 20));
    const delayMs = Math.max(25, Number(options.delay_ms || 150));
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const row = this.v2SemanticProperty(canonical, propertyKey) || this.semanticProperty(canonical, propertyKey);
      if (row && this.canonicalWriteValueEqual(row.value, expected)) return true;
      if (attempt < attempts - 1) await new Promise((resolve)=>setTimeout(resolve, delayMs));
    }
    return false;
  }

  async writePropertyValueAsync(prop = {}, value = "", options = {}) {
    if (!prop || !this.hass || !this.isWritableProperty(prop)) return false;
    const domain = prop.write_service_domain;
    const action = prop.write_service_action;
    const target = prop.write_target_entity;
    const transportValue = this.propertyTransportValue(prop, value);
    const payload = { ...(prop.write_service_data && typeof prop.write_service_data === "object" ? prop.write_service_data : {}) };
    if (!payload.entity_id) payload.entity_id = target;
    const domainText = String(domain || "").toLowerCase();
    const actionText = String(action || "").toLowerCase();
    if (!["button", "input_button"].includes(domainText)) {
      const explicitField = String(prop.write_value_field || "").trim();
      if (explicitField) payload[explicitField] = transportValue;
      else if (actionText.includes("select") || domainText.includes("select")) payload.option = transportValue;
      else if (actionText.includes("datetime") || domainText.includes("datetime")) payload.datetime = transportValue;
      else if (actionText.includes("time")) payload.time = transportValue;
      else if (actionText.includes("turn_")) { /* entity_id only */ }
      else payload.value = transportValue;
    }
    try {
      await this.hass.callService(domain, action, payload);
      if (options.readback === false) return true;
      const assetId = this.canonicalAssetId(prop.asset_id || options.asset_id || "");
      const propertyKey = String(prop.property_key || options.property_key || "").trim();
      if (!assetId || !propertyKey) return false;
      const confirmed = await this.waitForCanonicalPropertyReadback(assetId, propertyKey, value, options);
      if (!confirmed) {
        console.error("[RHI Mobility UX] canonical property readback timeout", {property_key:propertyKey,asset_id:assetId,expected:value});
      }
      return confirmed;
    } catch (error) {
      console.error("[RHI Mobility UX] property write failed", {property_key:prop.property_key,asset_id:prop.asset_id,error});
      return false;
    }
  }

  async writePublishedPropertyAsync(assetId = "", propertyKey = "", value = "", options = {}) {
    const canonical = this.canonicalAssetId(assetId);
    const prop = this.semanticProperty(canonical, propertyKey);
    if (!prop) return false;
    return this.writePropertyValueAsync(prop, value, { ...options, asset_id:canonical, property_key:propertyKey });
  }

  writePropertyValue(prop = {}, value = "") {
    if (!prop || !this.hass || !this.isWritableProperty(prop)) return false;
    const domain = prop.write_service_domain;
    const action = prop.write_service_action;
    const target = prop.write_target_entity;
    const payload = { ...(prop.write_service_data && typeof prop.write_service_data === "object" ? prop.write_service_data : {}) };
    if (!payload.entity_id) payload.entity_id = target;
    const domainText = String(domain || "").toLowerCase();
    const actionText = String(action || "").toLowerCase();
    const transportValue = this.propertyTransportValue(prop, value);
    if (!["button", "input_button"].includes(domainText)) {
      const explicitField = String(prop.write_value_field || "").trim();
      if (explicitField) payload[explicitField] = transportValue;
      else if (actionText.includes("select") || domainText.includes("select")) payload.option = transportValue;
      else if (actionText.includes("datetime") || domainText.includes("datetime")) payload.datetime = transportValue;
      else if (actionText.includes("time")) payload.time = transportValue;
      else if (actionText.includes("turn_")) { /* entity_id only */ }
      else payload.value = transportValue;
    }
    this.hass.callService(domain, action, payload);
    return true;
  }

  writePublishedProperty(assetId = "", propertyKey = "", value = "") {
    const prop = this.semanticProperty(this.canonicalAssetId(assetId), propertyKey);
    if (!prop) return false;
    return this.writePropertyValue(prop, value);
  }

  writeLifecycleStatus(assetOrId = "", desiredStatus = "") {
    const model = this.lifecycleWriteModel(assetOrId, desiredStatus);
    if (model.disabled) return false;
    return this.writePropertyValue(model.prop, model.desired);
  }

  async writeLifecycleStatusAsync(assetOrId = "", desiredStatus = "") {
    const model = this.lifecycleWriteModel(assetOrId, desiredStatus);
    if (model.disabled) return false;
    return this.writePropertyValueAsync(model.prop, model.desired, {
      asset_id:this.canonicalAssetId(typeof assetOrId === "string" ? assetOrId : assetOrId?.asset_id || ""),
      property_key:model.prop?.property_key || "lifecycle_status"
    });
  }

  lifecycleContractGapSection(assetId = "") {
    if (this.lifecyclePropertyRow(assetId)) return null;
    return {
      key:"lifecycle-contract-gap",
      title:"Lifecycle",
      icon:"mdi:alert-outline",
      header:"Contract gap",
      rows:[{ type:"readonly", icon:"mdi:alert-outline", label:"Lifecycle", value:"Contract gap" }],
      details:[{ label:"Required property", value:"property_key=lifecycle_status is missing; no fallback to mobility_enabled/Enabled" }]
    };
  }

  contractConsumptionSummary(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const props = this.propertyRows(canonical).filter((p)=>String(p.access || "").toLowerCase() !== "internal");
    const commands = this.commandRegistry(canonical).filter((c)=>this.contractBool(c.frontend_allowed, true) === true && !this.isConfigurationCommand(c));
    const activities = this.activityRowsFor(canonical);
    const insights = this.intelligenceRowsFor(canonical);
    const editable = props.filter((p)=>p.editable);
    const editableGaps = editable.filter((p)=>!this.isWritableProperty(p));
    const executableCommandGaps = commands.filter((c)=>this.contractBool(c.execution_allowed, false) === true && (!c.service_domain || !c.service_action));
    return { props, commands, activities, insights, editable, editableGaps, executableCommandGaps };
  }

  familyDetailSections(assetId = "", assetType = "") {
    const canonical = this.canonicalAssetId(assetId);
    const groups = new Map();
    const warnings = [];
    const publishedPublicPropertyKeys = new Set();
    const renderedPublicPropertyKeys = new Set();
    const engineeringPublicPropertyKeys = new Set();
    const addFamily = (family) => {
      const f = this.normalizedFamilyName(family) || "overview";
      if (!groups.has(f)) groups.set(f, { properties:[], commands:[] });
      return groups.get(f);
    };

    for (const prop of this.propertyRows(canonical)) {
      if (String(prop.access || "").toLowerCase() === "internal") continue;
      const propKeyLower = String(prop.property_key || prop.normalized_property || prop.fact_type || "").toLowerCase();
      if (["asset.mobility_enabled", "vehicle.mobility_enabled", "charger.mobility_enabled", "mobility_enabled"].includes(propKeyLower)) { engineeringPublicPropertyKeys.add(propKeyLower); continue; }
      publishedPublicPropertyKeys.add(String(prop.property_key || prop.normalized_property || prop.fact_type || ""));
      const family = this.propertyFamily(prop);
      const level = this.propertyDetailLevel(prop);
      const bucket = addFamily(family);
      const group = this.propertyGroup(prop);
      const parent = this.propertyParent(prop);
      const logical = this.propertyWriteSection(prop);
      bucket.properties.push({ ...prop, _ux_family:family, _ux_group:group, _ux_parent:parent, _ux_level:level, _ux_logical_section:logical });
      const contractFamily = this.propertyFamilyContractValue(prop);
      const overrideFamily = this.propertyPresentationFamilyOverride(prop, contractFamily);
      if (overrideFamily) warnings.push(`Backend grouping issue for ${prop.asset_id}:${prop.property_key}; contract family '${contractFamily}' rendered as '${overrideFamily}'.`);
      if (!prop.family) warnings.push(`Missing property.family for ${prop.property_key}; UX fallback '${family}' used.`);
      if (!prop.group) warnings.push(`Missing property.group for ${prop.property_key}; UX fallback '${group}' used.`);
      if (!prop.parent && !prop.parent_property && !prop.parent_key && !prop.summary_parent) warnings.push(`Missing property.parent for ${prop.property_key}; UX fallback '${parent}' used.`);
      if (prop.editable && !this.isWritableProperty(prop)) warnings.push(`Editable property ${prop.property_key} is not writable under R41.4; UX renders it read-only and reports backend contract gap.`);
      if (String(prop.group || "").toLowerCase() === "main_info") warnings.push(`Property ${prop.property_key} still uses deprecated group=main_info; R41.4 requires group=overview.`);
      if (String(prop.group || "").toLowerCase() === "actions") warnings.push(`Property ${prop.property_key} uses group=actions; R41.4 reserves Actions for command_index only.`);
    }


    const sections = [];
    const familyOrder = this.canonicalFamilies();
    const sortedFamilies = Array.from(groups.keys()).sort((a,b) => (this.familyConfig(a).order - this.familyConfig(b).order) || familyOrder.indexOf(a) - familyOrder.indexOf(b) || a.localeCompare(b));

    for (const family of sortedFamilies) {
      const bucket = groups.get(family) || { properties:[], commands:[] };
      const cfg = this.familyConfig(family);
      const props = bucket.properties.sort((a,b)=>(Number(a.display_order ?? a.sort_order ?? 999)-Number(b.display_order ?? b.sort_order ?? 999)) || String(a._ux_parent).localeCompare(String(b._ux_parent)) || String(a.property_key).localeCompare(String(b.property_key)));
      const primary = props.find((p)=>p._ux_level === "summary" || p._ux_logical_section === "overview") || props[0] || null;
      const logical = new Map();
      const addLogical = (name, item) => {
        const key = String(name || "details").toLowerCase();
        if (!logical.has(key)) logical.set(key, []);
        logical.get(key).push(item);
      };
      for (const p of props) {
        // Normal detail screens must not become a public property dump. Technical/diagnostic
        // rows stay available under Engineering details only.
        if (p._ux_logical_section === "diagnostics" || p._ux_level === "technical") {
          engineeringPublicPropertyKeys.add(String(p.property_key || ""));
          continue;
        }
        renderedPublicPropertyKeys.add(String(p.property_key || ""));
        addLogical(p._ux_logical_section, { kind:"property", row:p });
      }
      for (const cmd of bucket.commands.sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.command_key || a.label || "").localeCompare(String(b.command_key || b.label || "")))) addLogical("actions", { kind:"command", row:cmd });

      const rows = [];
      const details = [];
      const logicalKeys = Array.from(logical.keys()).sort((a,b)=>this.familyLogicalSectionOrder(a)-this.familyLogicalSectionOrder(b));
      for (const logicalKey of logicalKeys) {
        const items = logical.get(logicalKey) || [];
        if (!items.length) continue;
        rows.push({ type:"subheader", label:this.familyLogicalSectionLabel(logicalKey), value:"" });
        let currentParent = "";
        for (const item of items) {
          if (item.kind === "property") {
            const p = item.row;
            const parent = String(p._ux_parent || p._ux_group || "general");
            if (parent && parent !== currentParent && logicalKey !== "overview") {
              currentParent = parent;
              rows.push({ type:"subheader-small", label:this.titleize(parent.replace(/_/g," ")), value:"" });
            }
            rows.push(this.propertyOperationalRow(p));
          } else if (item.kind === "command") {
            const cmd = item.row;
            rows.push({ type:"action-row", icon:this.commandIcon(cmd), label:cmd.label || this.titleize(cmd.command_id || cmd.command_key), command:cmd, asset_id:canonical });
          }
        }
      }

      const technicalProps = props.filter((p)=>p._ux_level === "technical" || p._ux_logical_section === "diagnostics" || p.source_entity_id || p.source_adapter_id || p.source_candidate_id);
      for (const p of technicalProps) {
        engineeringPublicPropertyKeys.add(String(p.property_key || ""));
        details.push({ label:this.propertyDisplayLabel(p), value:`${this.propertyDisplayValue(p)} · key=${p.property_key}; quality=${p.quality || ""}; health=${p.health || ""}` });
      }
      // V1 contract-complete guard: every public property must be visible in normal UX or
      // traceable from Engineering details. This prevents silent drops when family,
      // group, detail_level or access metadata changes in runtime.
      const familyPublicKeys = props.map((p)=>String(p.property_key || "")).filter(Boolean);
      const unaccounted = familyPublicKeys.filter((k)=>!renderedPublicPropertyKeys.has(k) && !engineeringPublicPropertyKeys.has(k));
      for (const key of unaccounted) {
        const p = props.find((row)=>String(row.property_key || "") === key) || {};
        engineeringPublicPropertyKeys.add(key);
        details.push({ label:`unaccounted ${this.propertyDisplayLabel(p)}`, value:`${this.propertyDisplayValue(p)} · key=${key}; routed_to=engineering_guard` });
      }
      for (const cmd of bucket.commands) {
        const st = this.commandState(cmd);
        details.push({ label:`command ${cmd.command_key || cmd.command_id}`, value:`${st.disabled ? "disabled" : "enabled"}; reason=${st.reason || cmd.execution_reason || ""}` });
      }

      sections.push({ key:`family-${family}`, title:cfg.title, icon:cfg.icon, header: primary ? this.propertyDisplayValue(primary) : `${bucket.commands.length} actions`, rows, details });
    }

    const activities = this.activityRowsFor(canonical);
    if (activities.length) {
      sections.push({ key:"activity", title:"Current Activity", icon:"mdi:progress-clock", header:`${activities.length} active`, rows:activities.map((a)=>({type:"readonly", icon:"mdi:progress-clock", label:a.activity_type || a.family || "Activity", value:a.message || a.activity_state || "Active"})), details:activities.map((a,i)=>({label:`Activity ${i+1}`, value:`family=${a.family || ""}; state=${a.activity_state || ""}; confidence=${a.confidence || ""}`})) });
    }
    const insights = this.intelligenceRowsFor(canonical);
    if (insights.length) {
      sections.push({ key:"intelligence", title:"Insights", icon:"mdi:brain", header:`${insights.length} insights`, rows:insights.map((r)=>({type:"readonly", icon:"mdi:brain", label:r.title || r.insight_type || r.family || "Insight", value:r.message || r.meaning || r.value || "Published"})), details:insights.map((r,i)=>({label:`Insight ${i+1}`, value:`quality=${r.quality || ""}; confidence=${r.confidence || ""}; sources=${Array.isArray(r.source_properties) ? r.source_properties.join(",") : (r.source_property || "")}`})) });
    }

    const summary = this.contractConsumptionSummary(canonical);
    const silentDrops = Array.from(publishedPublicPropertyKeys).filter((k)=>k && !renderedPublicPropertyKeys.has(k) && !engineeringPublicPropertyKeys.has(k));
    if (silentDrops.length) warnings.push(`Silent property drops detected: ${silentDrops.join(", ")}`);
    const reportRows = [
      {type:"readonly", icon:"mdi:database-check", label:"Properties consumed", value:String(summary.props.length)},
      {type:"readonly", icon:"mdi:gesture-tap-button", label:"Commands surfaced", value:String(summary.commands.length)},
      {type:"readonly", icon:"mdi:tune", label:"Editable properties", value:String(summary.editable.length)},
      {type:"readonly", icon:"mdi:alert", label:"Gaps", value:String(warnings.length + summary.editableGaps.length + summary.executableCommandGaps.length)}
    ];
    // Keep contract consumption evidence out of normal detail UX. It belongs in validation
    // reports and Engineering details, not as a visible product section.
    if (this.config?.show_contract_consumption === true) {
      sections.push({ key:"contract-consumption", title:"Contract Consumption", icon:"mdi:file-check-outline", header:"UX v1 completeness", rows:reportRows, details:[...warnings.map((w,i)=>({label:`Warning ${i+1}`, value:w})), ...summary.editableGaps.map((p)=>({label:`Editable gap ${p.property_key}`, value:"Missing write_supported/write_service_domain/write_service_action/write_target_entity"})), ...summary.executableCommandGaps.map((c)=>({label:`Command gap ${c.command_key || c.command_id}`, value:"execution_allowed=true but service metadata incomplete"}))] });
    }
    return sections.filter((s)=>s.rows?.length || s.details?.length);
  }

  propertyDisplaySection(assetId = "", title = "Published Properties") {
    const rows = this.propertyRows(assetId)
      .slice()
      .sort((a,b)=>String(a.property_key || "").localeCompare(String(b.property_key || "")));
    const displayRows = rows.map((p) => {
      return { type:"readonly", icon:this.propertyIcon(p.property_key), label:this.propertyDisplayLabel(p), value:this.propertyDisplayValue(p) };
    });
    const details = rows.map((p) => ({
      label:p.property_key,
      value:`quality=${p.quality || ""}; health=${p.health || ""}; source=${p.source_layer || ""}; command=${p.write_command || ""}`
    }));
    return {
      key:"published-properties",
      title,
      icon:"mdi:database-eye-outline",
      header:`${rows.length} properties`,
      rows:displayRows,
      details
    };
  }

  propertyIcon(propertyKey = "") {
    const k = String(propertyKey || "").toLowerCase();
    if (k.includes("soc") || k.includes("battery")) return "mdi:battery";
    if (k.includes("range")) return "mdi:map-marker-distance";
    if (k.includes("power")) return "mdi:flash";
    if (k.includes("current")) return "mdi:current-ac";
    if (k.includes("voltage")) return "mdi:sine-wave";
    if (k.includes("lock") || k.includes("door") || k.includes("window") || k.includes("security")) return "mdi:shield-car";
    if (k.includes("climate") || k.includes("temperature")) return "mdi:fan";
    if (k.includes("energy")) return "mdi:counter";
    if (k.includes("profile")) return "mdi:card-account-details-outline";
    return "mdi:database";
  }

  vehicleComponentContractRows() {
    const cacheKey = "vehicleComponentContractRows";
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    // R22.12.11.30: components_json is the deployed serialized form of the
    // same component contract. Parsing it is transport normalization, not a
    // semantic fallback: ownership remains the single component-contract entity.
    const parsedRows = this.canonicalRowsFromAttrs(
      "sensor.mobility_vehicle_component_contract_index",
      ["components_json", "components", "component_contract", "component_contract_index", "rows"],
      "vehicle_component_contract"
    ).map((row, index) => {
      const component_id = String(row.component_id || row.id || row.key || "").trim();
      const property_index_entity = String(row.property_index_entity || row.property_index || "").trim();
      if (!component_id || !property_index_entity) return null;
      return {
        ...row,
        component_id,
        display_name: row.display_name || row.label || component_id,
        tab_id: row.tab_id || component_id,
        card_order: Number(row.card_order ?? row.order ?? index),
        property_index_entity,
        overview_properties: this.parseListValue(row.overview_properties),
        action_properties: this.parseListValue(row.action_properties),
        detail_properties: this.parseListValue(row.detail_properties),
        engineering_properties: this.parseListValue(row.engineering_properties),
        related_commands: this.parseListValue(row.related_commands)
      };
    }).filter(Boolean);
    // If a backend exposes both object and *_json serializations during a
    // rollout, consume the component exactly once.
    const byComponentId = new Map();
    for (const row of parsedRows) if (!byComponentId.has(row.component_id)) byComponentId.set(row.component_id, row);
    const rows = [...byComponentId.values()].sort((a,b)=>Number(a.card_order || 999) - Number(b.card_order || 999));
    this._memo.set(cacheKey, rows);
    return rows;
  }

  vehicleComponentContractAvailable() {
    return this.vehicleComponentContractRows().length > 0;
  }

  vehicleComponentRows() {
    // R43.2.54 fail-closed: layout comes only from the published component contract.
    return this.vehicleComponentContractRows();
  }

  vehicleComponent(assetId = "", componentId = "") {
    const id = String(componentId || "").trim();
    return this.vehicleComponentRows().find((c)=>String(c.component_id || "") === id) || null;
  }

  vehicleComponentPropertyIndexEntities() {
    const rows = this.vehicleComponentRows();
    const entities = rows.map((c)=>String(c.property_index_entity || "").trim()).filter(Boolean);
    return [...new Set(entities)];
  }

  componentPropertyRows(assetId = "", componentId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const component = this.vehicleComponent(canonical, componentId);
    if (!component?.property_index_entity) return [];
    return this.propertyRowsFromEntity(component.property_index_entity, canonical).map((row)=>({ ...row, component_id: component.component_id, component_display_name: component.display_name }));
  }

  vehicleComponentProperties(assetId = "", componentId = "") {
    return this.componentPropertyRows(assetId, componentId);
  }

  vehicleComponentCommands(assetId = "", componentId = "") {
    // R43.2.54: component contracts never invent command placement. Only explicit
    // vehicle command-slot placement may put a command inside a component.
    const rows = this.commandSlotRowsForSurface(assetId, componentId);
    if (rows === null || !rows.length) return [];
    return this.commandsForSurface(assetId, componentId);
  }

  vehicleComponentModel(assetId = "", componentId = "") {
    const component = this.vehicleComponent(assetId, componentId);
    if (!component) return null;
    const properties = this.vehicleComponentProperties(assetId, componentId);
    return {
      ...component,
      properties,
      commands: this.vehicleComponentCommands(assetId, componentId),
      property_count: properties.length
    };
  }

  vehicleComponentModels(assetId = "") {
    return this.vehicleComponentRows().map((c)=>this.vehicleComponentModel(assetId, c.component_id)).filter(Boolean);
  }

  vehicleOverviewMetricSlots(assetId = "") {
    // Product presentation is compact, but value ownership/placement stays
    // backend-driven. Each metric slot takes the exact Nth overview property
    // published by the named component; there is no property-name alias resolver.
    const canonical = this.canonicalAssetId(assetId);
    const specs = [
      { component_id:"range", property_index:0, label:"Full" },
      { component_id:"range", property_index:1, label:"EV" },
      { component_id:"battery", property_index:0, label:"Battery" }
    ];
    return specs.map((spec)=>{
      const component = this.vehicleComponent(canonical, spec.component_id);
      const propertyKey = String(component?.overview_properties?.[spec.property_index] || "").trim();
      const rows = component ? this.vehicleComponentProperties(canonical, component.component_id) : [];
      const prop = propertyKey ? rows.find((row)=>String(row.property_key || "") === propertyKey) || null : null;
      return {
        ...spec,
        property_key: propertyKey,
        property: prop,
        resolved: !!prop && prop.value !== undefined && prop.value !== null && String(prop.value).trim() !== "",
        display: prop ? this.propertyDisplayValue(prop) : "—"
      };
    });
  }

  vehicleComponentDetailSections(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const v2Sections = this.v2ComponentDetailSections(canonical, "vehicle");
    if (v2Sections !== null) return v2Sections;
    const components = this.vehicleComponentRows();
    if (!components.length) {
      return [{
        key:"vehicle-layout-contract-gap",
        title:"Layout contract gap",
        icon:"mdi:alert-outline",
        header:"Component contract unavailable",
        rows:[{ type:"readonly", icon:"mdi:alert-outline", label:"Vehicle layout", value:"Contract gap" }],
        details:[{ label:"Required owner", value:"sensor.mobility_vehicle_component_contract_index" }]
      }];
    }
    const sections = [];
    const groupDefs = [
      { key:"overview", title:"Overview", list:"overview_properties" },
      { key:"actions", title:"Controls", list:"action_properties" },
      { key:"details", title:"Details", list:"detail_properties" },
      { key:"engineering", title:"Engineering", list:"engineering_properties", detailsOnly:true }
    ];
    for (const component of components) {
      const props = this.vehicleComponentProperties(canonical, component.component_id)
        .filter((p)=>String(p.access || "").toLowerCase() !== "internal")
        .sort((a,b)=>(Number(a.display_order ?? a.sort_order ?? 999)-Number(b.display_order ?? b.sort_order ?? 999)) || String(a.property_key || "").localeCompare(String(b.property_key || "")));
      const byKey = new Map(props.map((p)=>[String(p.property_key || ""), p]).filter(([key])=>!!key));
      const declared = new Set();
      for (const def of groupDefs) for (const key of (component[def.list] || [])) declared.add(String(key));
      const hasDeclaredPlacement = declared.size > 0;
      const rows = [];
      const details = [];
      const rendered = new Set();

      // A property listed in Actions is an editable-property placement, not a command.
      // Prefer that placement when the same key is also present in Overview.
      const actionKeys = new Set((component.action_properties || []).map(String));
      for (const def of groupDefs) {
        const keys = hasDeclaredPlacement
          ? (component[def.list] || []).map(String).filter((key)=>!(def.key === "overview" && actionKeys.has(key)))
          : (def.key === "overview" ? props.map((p)=>String(p.property_key || "")) : []);
        const placed = keys.map((key)=>byKey.get(key)).filter(Boolean).filter((p)=>!rendered.has(String(p.property_key || "")));
        if (!placed.length) continue;
        if (def.detailsOnly) {
          for (const p of placed) {
            const key = String(p.property_key || "");
            rendered.add(key);
            details.push({ label:this.propertyDisplayLabel(p), value:`${this.propertyDisplayValue(p)} · key=${key}; component=${component.component_id}; engineering=true` });
          }
          continue;
        }
        rows.push({ type:"subheader", label:def.title, value:"" });
        for (const p of placed) {
          const key = String(p.property_key || "");
          rendered.add(key);
          rows.push(this.propertyOperationalRow(p));
        }
      }

      // If the component declares exact placement lists, unlisted component properties
      // are a backend layout-contract gap. Do not reconstruct placement from families.
      if (hasDeclaredPlacement) {
        for (const p of props) {
          const key = String(p.property_key || "");
          if (!key || rendered.has(key)) continue;
          details.push({ label:`Unplaced: ${key}`, value:`owner=${component.property_index_entity}; component=${component.component_id}; layout_contract_gap=true` });
        }
      }

      sections.push({
        key:`vehicle-component-${component.component_id}`,
        title:component.display_name || this.titleize(component.component_id),
        icon:component.icon || (String(component.component_id).includes("charging") ? "mdi:ev-station" : String(component.component_id).includes("battery") ? "mdi:battery-charging" : String(component.component_id).includes("range") ? "mdi:map-marker-distance" : String(component.component_id).includes("access") ? "mdi:shield-car" : String(component.component_id).includes("comfort") ? "mdi:fan" : String(component.component_id).includes("location") ? "mdi:map-marker" : String(component.component_id).includes("maintenance") ? "mdi:wrench" : String(component.component_id).includes("diagnostic") ? "mdi:bug-check" : "mdi:car"),
        header:`${props.length} properties`,
        rows,
        details
      });
    }
    return sections.filter((s)=>s.rows?.length || s.details?.length);
  }


  chargerComponentContractRows() {
    const cacheKey = "chargerComponentContractRows";
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const entityId = "sensor.mobility_charger_component_contract_index";
    const attrs = this.entity(entityId)?.attributes || {};
    const rows = [];
    const collect = (value) => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) rows.push(...parsed);
      else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.cards)) rows.push(...parsed.cards);
        else if (Array.isArray(parsed.rows)) rows.push(...parsed.rows);
        else if (Array.isArray(parsed.components)) rows.push(...parsed.components);
        else rows.push(...Object.values(parsed).filter((r)=>r && typeof r === "object"));
      }
    };
    for (const attrName of ["ux_cards_json", "cards", "cards_json", "components", "component_contract", "component_contract_index", "rows"]) collect(attrs[attrName]);
    const sectionCommandMap = this.parseJsonValue(attrs.related_commands_by_section_json, attrs.related_commands_by_section_json || {});
    const fieldMap = this.parseJsonValue(attrs.ux_fields_by_property_json, attrs.ux_fields_by_property_json || {});
    const layoutRules = this.parseJsonValue(attrs.ux_layout_rules_json, attrs.ux_layout_rules_json || {});
    const forbiddenRendering = this.parseJsonValue(attrs.ux_forbidden_rendering_json, attrs.ux_forbidden_rendering_json || {});
    const normalized = rows.map((row, index) => {
      if (!row || typeof row !== "object") return null;
      const component_id = String(row.component_id || row.card_id || row.id || row.key || "").trim();
      const property_index_entity = String(row.property_index_entity || row.property_index || "").trim();
      if (!component_id || !property_index_entity) return null;
      const sections = this.parseListValue(row.sections || row.sections_json);
      const relatedFromRow = this.parseListValue(row.related_commands || row.commands || row.command_keys);
      return {
        ...row,
        component_id,
        card_id: row.card_id || component_id,
        display_name: row.display_name || row.title || row.label || component_id,
        tab_id: row.tab_id || row.tab || (component_id.includes("engineering") ? "engineering" : component_id.includes("metering") ? "details" : "overview"),
        card_order: Number(row.card_order ?? row.order ?? index),
        property_index_entity,
        runtime_contract_index_entity: "",
        command_index_entity: String(row.command_index_entity || attrs.command_index_entity || "sensor.mobility_command_index").trim(),
        sections,
        overview_properties: this.parseListValue(row.overview_properties),
        action_properties: this.parseListValue(row.action_properties),
        detail_properties: this.parseListValue(row.detail_properties),
        engineering_properties: this.parseListValue(row.engineering_properties),
        related_commands: relatedFromRow,
        related_commands_by_section: this.parseJsonValue(row.related_commands_by_section_json || row.related_commands_by_section, row.related_commands_by_section || sectionCommandMap || {}),
        ux_fields_by_property: fieldMap,
        ux_layout_rules: layoutRules,
        ux_forbidden_rendering: forbiddenRendering
      };
    }).filter(Boolean).sort((a,b)=>Number(a.card_order || 999) - Number(b.card_order || 999));
    this._memo.set(cacheKey, normalized);
    return normalized;
  }

  chargerComponentContractAvailable() {
    return this.chargerComponentContractRows().length > 0;
  }

  chargerComponentRows() {
    // R43.2.54 fail-closed: layout comes only from the published component contract.
    return this.chargerComponentContractRows();
  }

  chargerComponent(componentId = "") {
    const id = String(componentId || "").trim();
    return this.chargerComponentRows().find((c)=>String(c.component_id || c.card_id || "") === id) || null;
  }

  chargerComponentPropertyIndexEntities() {
    const rows = this.chargerComponentRows();
    const entities = rows.map((c)=>String(c.property_index_entity || "").trim()).filter(Boolean);
    return [...new Set(entities)];
  }

  chargerComponentPropertyRows(assetId = "", componentId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const component = this.chargerComponent(componentId);
    if (!component?.property_index_entity) return [];
    return this.propertyRowsFromEntity(component.property_index_entity, canonical).map((row)=>({ ...row, component_id: component.component_id, component_display_name: component.display_name }));
  }

  chargerComponentCommands(assetId = "", componentId = "", sectionId = "") {
    // R43.2.54 product rule: charger_actions.commands is rendered exactly once in
    // the shared top Actions surface. Component contracts own layout/properties and
    // may not cause a second command rendering path.
    return [];
  }

  chargerFieldConfig(propertyKey = "", component = {}) {
    const key = String(propertyKey || "").trim();
    const map = component?.ux_fields_by_property || this.parseJsonValue(this.attr("sensor.mobility_charger_component_contract_index", "ux_fields_by_property_json", {}), {});
    return (map && typeof map === "object" ? (map[key] || {}) : {}) || {};
  }

  chargerPropertyRowForContract(prop = {}, component = {}) {
    const field = this.chargerFieldConfig(prop.property_key, component);
    const row = { ...prop };
    if (field.display_name || field.label) row.display_name = field.display_name || field.label;
    if (field.icon) row.icon = field.icon;
    if (field.render_mode) row.render_mode = field.render_mode;
    if (field.detail_level) row.detail_level = field.detail_level;
    return this.propertyOperationalRow(row);
  }

  chargerSectionDefinitions(component = {}) {
    const parsed = this.parseListValue(component.sections || []);
    if (parsed.length) return parsed.map((section) => {
      if (typeof section === "string") return { section_id:section, display_name:this.titleize(section.replace(/_/g," ")) };
      return {
        section_id: section.section_id || section.id || section.key || section.name || "details",
        display_name: section.display_name || section.title || section.label || this.titleize(String(section.section_id || section.id || section.key || "details").replace(/_/g," ")),
        ...section
      };
    });
    // A component may be a single-card layout without sub-sections. Keep every
    // property in that backend-owned component rather than inventing UX families.
    return [{ section_id:"__component__", display_name:"" }];
  }

  chargerComponentDetailSections(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const v2Sections = this.v2ComponentDetailSections(canonical, "charger");
    if (v2Sections !== null) return v2Sections;
    const components = this.chargerComponentRows();
    const forbiddenProductStatusKeys = new Set(["charger.status", "source_status", "charger.operational_state"]);
    const allProps = this.propertyRows(canonical).filter((p)=>String(p.access || "").toLowerCase() !== "internal");
    const productProps = allProps.filter((p)=>!forbiddenProductStatusKeys.has(String(p.property_key || "")) && String(p.access || "").toLowerCase() !== "diagnostics_only");
    const diagnosticsProps = allProps.filter((p)=>forbiddenProductStatusKeys.has(String(p.property_key || "")) || String(p.access || "").toLowerCase() === "diagnostics_only");
    const productByKey = new Map(productProps.map((p)=>[String(p.property_key || ""), p]));
    const diagnosticsByKey = new Map(diagnosticsProps.map((p)=>[String(p.property_key || ""), p]));
    const fieldMap = this.parseJsonValue(this.attr("sensor.mobility_charger_component_contract_index", "ux_fields_by_property_json", {}), {});
    const renderedKeys = new Set();
    const sections = [];

    const placementsFor = (component, sectionId) => {
      if (!fieldMap || typeof fieldMap !== "object" || Array.isArray(fieldMap)) return [];
      const componentId = String(component.component_id || component.card_id || "");
      return Object.entries(fieldMap).map(([mapKey, cfg]) => {
        if (!cfg || typeof cfg !== "object") return null;
        const propertyKey = String(cfg.property_key || mapKey || "").trim();
        const cardId = String(cfg.card_id || cfg.component_id || "").trim();
        const cfgSection = String(cfg.section_id || cfg.section || "").trim();
        if (!propertyKey || (cardId && cardId !== componentId) || (sectionId !== "__component__" && cfgSection !== sectionId)) return null;
        return { propertyKey, cfg, order:Number(cfg.display_order ?? cfg.order ?? 999) };
      }).filter(Boolean).sort((a,b)=>a.order-b.order || a.propertyKey.localeCompare(b.propertyKey));
    };

    const rowForPlacement = (placement, component, diagnostics = false) => {
      const source = diagnostics ? diagnosticsByKey : productByKey;
      const prop = source.get(placement.propertyKey);
      if (!prop) return null;
      renderedKeys.add(placement.propertyKey);
      return this.chargerPropertyRowForContract({ ...prop, ...placement.cfg, display_name:placement.cfg.label || placement.cfg.display_name || prop.display_name }, component);
    };

    let engineeringComponent = null;
    for (const component of components) {
      const componentId = String(component.component_id || component.card_id || "");
      if (componentId === "charger_actions") continue;
      if (componentId === "charger_engineering") engineeringComponent = component;
      const componentProps = this.chargerComponentPropertyRows(canonical, component.component_id)
        .filter((p)=>String(p.access || "").toLowerCase() !== "internal")
        .sort((a,b)=>(Number(a.display_order ?? a.sort_order ?? 999)-Number(b.display_order ?? b.sort_order ?? 999)) || String(a.property_key || "").localeCompare(String(b.property_key || "")));
      const rows = [];
      const details = [];
      for (const sectionDef of this.chargerSectionDefinitions(component)) {
        const sectionId = String(sectionDef.section_id || sectionDef.id || sectionDef.key || "details");
        const isDiagnosticsSection = componentId === "charger_engineering" && this.norm(sectionId) === "diagnostics";
        const isUnmappedSection = componentId === "charger_engineering" && this.norm(sectionId) === "unmapped";
        let placedRows = [];
        if (!isUnmappedSection) {
          const placements = placementsFor(component, sectionId);
          placedRows = placements.map((placement)=>rowForPlacement(placement, component, isDiagnosticsSection)).filter(Boolean);
        }
        if (isUnmappedSection) {
          // Explicit backend-owned catch-all section. Showing unplaced properties here
          // is allowed because the component contract itself declared `unmapped`.
          const leftovers = productProps.filter((p)=>!renderedKeys.has(String(p.property_key || "")));
          if (leftovers.length) {
            rows.push({ type:"subheader", label:sectionDef.display_name || "Unmapped", value:"" });
            for (const p of leftovers) {
              renderedKeys.add(String(p.property_key || ""));
              rows.push(this.chargerPropertyRowForContract(p, component));
            }
          }
          continue;
        }
        if (!placedRows.length) continue;
        if (sectionId !== "__component__") rows.push({ type:"subheader", label:sectionDef.display_name || this.titleize(sectionId.replace(/_/g," ")), value:"" });
        rows.push(...placedRows);
      }
      sections.push({
        key:`charger-component-${component.component_id}`,
        title:component.display_name || this.titleize(component.component_id),
        icon: component.icon || (componentId.includes("control") ? "mdi:tune" : componentId.includes("metering") ? "mdi:counter" : componentId.includes("engineering") ? "mdi:wrench" : "mdi:ev-station"),
        header:`${rows.filter((r)=>r.type !== "subheader").length} fields`,
        rows,
        details
      });
    }

    // If the contract has no explicit Engineering/Unmapped section, fail closed and
    // report the missing placement instead of inventing a product card.
    const unaccounted = productProps.filter((p)=>!renderedKeys.has(String(p.property_key || "")));
    if (unaccounted.length && !engineeringComponent) {
      sections.push({
        key:"charger-layout-contract-gap",
        title:"Layout contract gap",
        icon:"mdi:alert-outline",
        header:`${unaccounted.length} unplaced properties`,
        rows:[{ type:"readonly", icon:"mdi:alert-outline", label:"Component placement", value:"Contract gap" }],
        details:unaccounted.map((p)=>({ label:String(p.property_key || "Property"), value:`owner=${p._source_entity_id || "sensor.mobility_charger_property_index"}; missing component placement` }))
      });
    }

    const diagnosticsUnplaced = diagnosticsProps.filter((p)=>!renderedKeys.has(String(p.property_key || "")));
    if (diagnosticsUnplaced.length) {
      sections.push({
        key:"charger-component-source-diagnostics",
        title:"Engineering / Source diagnostics",
        icon:"mdi:stethoscope",
        header:`${diagnosticsUnplaced.length} diagnostics`,
        rows:[],
        details:diagnosticsUnplaced.map((p)=>({ label:this.propertyDisplayLabel(p), value:`${this.propertyDisplayValue(p)} · key=${p.property_key}; diagnostics_only=true` }))
      });
    }
    return sections.filter((section)=>section.rows?.length || section.details?.length);
  }

  propertyIndexEntityForAsset(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    if (canonical.startsWith("vehicle_")) return "sensor.mobility_vehicle_component_contract_index";
    if (canonical.startsWith("charger_")) return this.chargerComponentContractAvailable() ? "sensor.mobility_charger_component_contract_index" : "sensor.mobility_charger_property_index";
    if (canonical.startsWith("person_")) return "sensor.mobility_person_property_index";
    return "";
  }

  v2PropertyRows(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const rows = [];
    for (const state of Object.values(this.hass?.states || {})) {
      const attrs = state?.attributes || {};
      if (String(attrs.canonical_contract || "").toUpperCase() !== "MOBILITY_PUBLIC_RUNTIME_V2") continue;
      const rowAsset = this.canonicalAssetId(attrs.asset_id || "");
      const propertyKey = String(attrs.property_key || "").trim();
      if (!rowAsset || !propertyKey || (canonical && rowAsset !== canonical)) continue;
      rows.push(this.normalizePropertyRow({
        ...attrs,
        asset_id:rowAsset,
        property_key:propertyKey,
        value:state?.state,
        display_name:attrs.display_name || attrs.friendly_name || state?.attributes?.friendly_name || "",
        _source_entity_id:state?.entity_id || "",
        canonical_contract:"MOBILITY_PUBLIC_RUNTIME_V2"
      }));
    }
    const byKey = new Map();
    for (const row of rows.filter(Boolean)) {
      const key = `${row.asset_id}:${row.property_key}`;
      const current = byKey.get(key);
      if (!current || String(row._source_entity_id || "").startsWith("sensor.rhi_mobility_")) byKey.set(key, row);
    }
    return [...byKey.values()].sort((a,b)=>
      String(a.asset_id || "").localeCompare(String(b.asset_id || "")) ||
      Number(a.display_order ?? 9999) - Number(b.display_order ?? 9999) ||
      String(a.property_key || "").localeCompare(String(b.property_key || ""))
    );
  }

  v2ComponentDetailSections(assetId = "", assetType = "") {
    const canonical = this.canonicalAssetId(assetId);
    const props = this.v2PropertyRows(canonical);
    if (!props.length) return null;

    const hiddenFromProduct = assetType === "charger"
      ? new Set(["charger.status","source_status","charger.operating_state"])
      : new Set();
    const product = [];
    const engineering = [];
    const unplaced = [];
    for (const prop of props) {
      const visibility = String(prop.visibility || prop.ux_visibility || "").toLowerCase();
      if (visibility === "internal") continue;
      if (visibility === "engineering" || visibility === "diagnostics" || visibility === "diagnostics_only" || hiddenFromProduct.has(String(prop.property_key || ""))) {
        engineering.push(prop);
        continue;
      }
      const componentId = String(prop.component_id || "").trim();
      const sectionId = String(prop.section_id || "").trim();
      if (!componentId || !sectionId) {
        unplaced.push(prop);
        continue;
      }
      product.push(prop);
    }

    const sections = [];
    const groups = new Map();
    for (const prop of product) {
      const componentId = String(prop.component_id);
      if (!groups.has(componentId)) groups.set(componentId, new Map());
      const sectionId = String(prop.section_id);
      if (!groups.get(componentId).has(sectionId)) groups.get(componentId).set(sectionId, []);
      groups.get(componentId).get(sectionId).push(prop);
    }

    for (const [componentId, sectionMap] of [...groups.entries()].sort(([a],[b])=>a.localeCompare(b))) {
      const rows = [];
      const multiSection = sectionMap.size > 1;
      for (const [sectionId, sectionProps] of [...sectionMap.entries()].sort(([a],[b])=>a.localeCompare(b))) {
        if (multiSection || !["overview","details","main"].includes(this.norm(sectionId))) {
          rows.push({ type:"subheader", label:this.titleize(sectionId.replace(/_/g," ")), value:"" });
        }
        for (const prop of sectionProps.sort((a,b)=>
          Number(a.display_order ?? 9999) - Number(b.display_order ?? 9999) ||
          String(a.property_key || "").localeCompare(String(b.property_key || ""))
        )) rows.push(this.propertyOperationalRow(prop));
      }
      sections.push({
        key:`v2-component-${componentId}`,
        title:this.titleize(componentId.replace(/_/g," ")),
        icon:componentId.includes("power") ? "mdi:flash" : componentId.includes("charging") ? "mdi:ev-station" : componentId.includes("security") ? "mdi:shield-car" : componentId.includes("battery") ? "mdi:battery" : "mdi:information-outline",
        header:`${rows.filter((row)=>row.type !== "subheader").length} fields`,
        rows,
        details:[]
      });
    }

    if (unplaced.length) {
      sections.push({
        key:"v2-layout-contract-gap",
        title:"Layout contract gap",
        icon:"mdi:alert-outline",
        header:`${unplaced.length} unplaced properties`,
        rows:[{ type:"readonly", icon:"mdi:alert-outline", label:"Component placement", value:"Contract gap" }],
        details:unplaced.map((prop)=>({
          label:String(prop.property_key || "Property"),
          value:`owner=${prop._source_entity_id || "MOBILITY_PUBLIC_RUNTIME_V2"}; missing component_id/section_id`
        }))
      });
    }

    if (engineering.length) {
      sections.push({
        key:"v2-engineering",
        title:"Engineering",
        icon:"mdi:wrench",
        header:`${engineering.length} diagnostics`,
        rows:[],
        details:engineering
          .sort((a,b)=>String(a.property_key || "").localeCompare(String(b.property_key || "")))
          .map((prop)=>({ label:this.propertyDisplayLabel(prop), value:`${this.propertyDisplayValue(prop)} · key=${prop.property_key}` }))
      });
    }
    return sections.filter((section)=>section.rows?.length || section.details?.length);
  }

  propertyRowsFromEntity(entityId = "", assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const attrs = this.entity(entityId)?.attributes || {};
    const rows = [];

    // Transport normalization only: preserve the structural keys published by the
    // same property-index owner. In particular, keyed maps may omit asset_id and/or
    // property_key because those values are encoded in the map key. Losing those
    // keys made valid canonical charger fields disappear from UX in R22.12.11.29.
    const addRow = (rawRow, keyHint = "", assetHint = "") => {
      if (!rawRow || typeof rawRow !== "object" || Array.isArray(rawRow)) return;
      const row = { ...rawRow, _source_entity_id: entityId };
      const hint = String(keyHint || "").trim();
      const hintedAsset = String(assetHint || "").trim();
      if (hint.includes(":")) {
        const splitAt = hint.indexOf(":");
        const keyAsset = hint.slice(0, splitAt);
        const keyProperty = hint.slice(splitAt + 1);
        if (!row.asset_id && keyAsset) row.asset_id = keyAsset;
        if (!row.property_key && !row.normalized_property && !row.fact_type && keyProperty) row.property_key = keyProperty;
        row._compound_key = row._compound_key || hint;
      } else {
        if (!row.asset_id && hintedAsset) row.asset_id = hintedAsset;
        if (!row.property_key && !row.normalized_property && !row.fact_type && hint && hint.includes(".")) row.property_key = hint;
      }
      rows.push(row);
    };

    const collectPropertyContainer = (value, assetHint = "") => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) {
        for (const row of parsed) addRow(row, "", assetHint);
        return;
      }
      if (!parsed || typeof parsed !== "object") return;
      for (const [key, row] of Object.entries(parsed)) {
        if (Array.isArray(row)) {
          for (const item of row) addRow(item, key, assetHint);
        } else if (row && typeof row === "object") {
          // Nested asset map: { charger_x: { charger.power_kw: {...} } }
          if (!row.asset_id && !row.property_key && !row.normalized_property && !row.fact_type && !key.includes(":")) {
            const nestedEntries = Object.entries(row);
            const looksLikeNestedPropertyMap = nestedEntries.some(([nestedKey, nestedRow]) => nestedRow && typeof nestedRow === "object" && (nestedKey.includes(".") || nestedKey.includes(":")));
            if (looksLikeNestedPropertyMap) {
              collectPropertyContainer(row, key.startsWith("vehicle_") || key.startsWith("charger_") || key.startsWith("person_") ? key : assetHint);
              continue;
            }
          }
          addRow(row, key, assetHint);
        }
      }
    };

    for (const attrName of ["properties", "properties_json", "property_index", "property_index_json", "rows", "rows_json", "properties_by_key", "properties_by_key_json", "properties_by_asset", "properties_by_asset_json"]) {
      collectPropertyContainer(attrs[attrName]);
    }

    // Some property-index schemas wrap the exact property rows per asset. Only
    // explicit nested property containers are consumed; top-level asset scalars are
    // not reinterpreted as properties.
    for (const attrName of ["assets", "assets_json"]) {
      const assets = this.parseJsonValue(attrs[attrName], attrs[attrName] || null);
      const assetRows = Array.isArray(assets) ? assets : (assets && typeof assets === "object" ? Object.values(assets) : []);
      for (const asset of assetRows) {
        if (!asset || typeof asset !== "object") continue;
        const assetKey = String(asset.asset_id || "").trim();
        for (const nestedName of ["properties", "properties_json", "property_index", "property_index_json", "rows", "rows_json", "source_properties", "properties_by_key", "properties_by_key_json"]) {
          collectPropertyContainer(asset[nestedName], assetKey);
        }
      }
    }

    const seen = new Set();
    return rows.map((r) => this.normalizePropertyRow(r)).filter(Boolean).filter((r) => {
      if (canonical && String(r.asset_id || "") !== String(canonical)) return false;
      const key = `${r.asset_id}:${r.property_key}:${String(r.value)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  propertyRows(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const cacheKey = `propertyRows:${canonical || "all"}`;
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const v2 = this.v2PropertyRows(canonical);
    if (v2.length || this.mobilityRuntimeV2()) {
      this._memo.set(cacheKey, v2);
      return v2;
    }
    let entities = [];
    if (canonical) {
      if (canonical.startsWith("vehicle_")) entities = ["sensor.mobility_vehicle_property_index", ...this.vehicleComponentPropertyIndexEntities()];
      else if (canonical.startsWith("charger_")) entities = ["sensor.mobility_charger_property_index", ...this.chargerComponentPropertyIndexEntities()];
      else entities = [this.propertyIndexEntityForAsset(canonical)];
    } else {
      entities = [
        "sensor.mobility_vehicle_property_index",
        ...this.vehicleComponentPropertyIndexEntities(),
        "sensor.mobility_charger_property_index",
        ...this.chargerComponentPropertyIndexEntities(),
        "sensor.mobility_person_property_index"
      ];
    }
    const rows = [];
    for (const entityId of [...new Set(entities.filter(Boolean))]) rows.push(...this.propertyRowsFromEntity(entityId, canonical));
    const seen = new Set();
    const normalized = rows.filter((r) => {
      const key = `${r.asset_id}:${r.property_key}:${String(r.value)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    this._memo.set(cacheKey, normalized);
    return normalized;
  }

  propertyControlModel(assetId = "", propertyKey = "") {
    const canonical = this.canonicalAssetId(assetId);
    const prop = this.propertyByCompoundKey(canonical, propertyKey);
    if (!prop) return { asset_id: canonical, property_key: propertyKey, resolved: false, writable: false, reason: "property_contract_gap" };
    const min = Number(prop.min ?? prop.validation?.min);
    const max = Number(prop.max ?? prop.validation?.max);
    const step = Number(prop.step ?? prop.validation?.step);
    const value = Number(prop.value);
    return {
      asset_id: canonical, property_key: prop.property_key, prop, resolved: true,
      value: Number.isFinite(value) ? value : prop.value, unit: prop.unit || "",
      min: Number.isFinite(min) ? min : null, max: Number.isFinite(max) ? max : null,
      step: Number.isFinite(step) && step > 0 ? step : null,
      writable: this.isWritableProperty(prop),
      write_target_entity: prop.write_target_entity || "",
      write_service_domain: prop.write_service_domain || "",
      write_service_action: prop.write_service_action || "",
      authority_entity: prop._source_entity_id || ""
    };
  }

  vehicleChargePowerControlModel(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    // R43.2.54: the vehicle property is the backend-owned delegated proxy. UX
    // reads/writes that exact vehicle property and never resolves a charger-side
    // property as a frontend authority fallback.
    const delegated = this.propertyControlModel(canonical, "vehicle.requested_charge_power_kw");
    return { ...delegated, consumer_asset_id: canonical, authority_asset_id: canonical, delegated: true };
  }

  normalizedPropertyControlValue(model = {}, value = null) {
    let next = Number(value);
    if (!Number.isFinite(next)) return null;
    if (Number.isFinite(model.min)) next = Math.max(model.min, next);
    if (Number.isFinite(model.max)) next = Math.min(model.max, next);
    if (Number.isFinite(model.step) && model.step > 0 && Number.isFinite(model.min)) {
      next = model.min + Math.round((next - model.min) / model.step) * model.step;
      next = Number(next.toFixed(6));
    }
    return next;
  }

  writePropertyControl(model = {}, value = null) {
    if (!model?.resolved || !model?.prop || !model.writable) return false;
    const next = this.normalizedPropertyControlValue(model, value);
    if (next === null) return false;
    return this.writePropertyValue(model.prop, next);
  }

  async writePropertyControlAsync(model = {}, value = null) {
    if (!model?.resolved || !model?.prop || !model.writable) return false;
    const next = this.normalizedPropertyControlValue(model, value);
    if (next === null) return false;
    return this.writePropertyValueAsync(model.prop, next, {
      asset_id:model.asset_id || model.prop?.asset_id || "",
      property_key:model.property_key || model.prop?.property_key || ""
    });
  }

  v2SemanticProperty(assetId = "", propertyKey = "") {
    const canonical = this.canonicalAssetId(assetId);
    const wanted = String(propertyKey || "").trim();
    if (!canonical || !wanted) return null;
    const states = Object.values(this.hass?.states || {});
    const matches = states.filter((state) => {
      const attrs = state?.attributes || {};
      return String(attrs.canonical_contract || "").toUpperCase() === "MOBILITY_PUBLIC_RUNTIME_V2"
        && String(attrs.asset_id || "") === canonical
        && String(attrs.property_key || "") === wanted;
    });
    if (!matches.length) return null;
    const state = matches.find((row)=>String(row.entity_id || "").startsWith("sensor.rhi_mobility_")) || matches[0];
    const attrs = state?.attributes || {};
    return this.normalizePropertyRow({
      ...attrs,
      asset_id: canonical,
      property_key: wanted,
      value: state?.state,
      _source_entity_id: state?.entity_id || "",
      canonical_contract: "MOBILITY_PUBLIC_RUNTIME_V2"
    });
  }

  semanticProperty(assetId = "", propertyKey = "") {
    return this.v2SemanticProperty(assetId, propertyKey)
      || this.propertyByCompoundKey(assetId, propertyKey);
  }

  propertyByCompoundKey(assetId = "", propertyKey = "") {
    const canonical = this.canonicalAssetId(assetId);
    const wanted = String(propertyKey || "").trim();
    if (!canonical || !wanted) return null;
    const rows = this.propertyRows(canonical).filter((r)=>String(r.property_key || "") === wanted || String(r._compound_key || "") === `${canonical}:${wanted}`);
    if (!rows.length) return null;
    // Frozen V1 can expose the same canonical V2 property through more than one
    // index. Prefer the richest canonical row so complete write metadata is not
    // shadowed by a read-only duplicate.
    const score = (row) => {
      let value = 0;
      if (String(row.canonical_contract || "").toUpperCase() === "MOBILITY_PUBLIC_RUNTIME_V2") value += 16;
      if (this.contractBool(row.write_supported, false)) value += 8;
      if (this.contractBool(row.editable, false)) value += 4;
      if (row.write_service_domain && row.write_service_action && row.write_target_entity) value += 4;
      if (row.value !== undefined && row.value !== null && String(row.value).trim() !== "") value += 2;
      if (this.contractBool(row.available, false)) value += 1;
      return value;
    };
    return rows.slice().sort((a,b)=>score(b)-score(a))[0] || null;
  }

  normalizePropertyRow(row = {}) {
    if (!row || typeof row !== "object") return null;
    const asset_id = row.asset_id || "";
    const asset_type = row.asset_type || (String(asset_id).startsWith("vehicle_") ? "vehicle" : String(asset_id).startsWith("charger_") ? "charger" : String(asset_id).startsWith("person_") ? "person" : "");
    const property_key = String(row.property_key || row.normalized_property || row.fact_type || row.key || "").trim();
    if (!asset_id || !property_key) return null;
    const fact_type = row.fact_type || property_key.split('.').pop();
    return {
      ...row,
      asset_id,
      asset_type,
      property_key,
      fact_type,
      normalized_property: row.normalized_property || property_key,
      value: row.value,
      unit: row.unit ?? row.unit_of_measurement ?? "",
      quality: row.quality || row.health || "Unknown",
      health: row.health || row.quality || "Unknown",
      access: row.access || (this.contractBool(row.editable, false) ? "editable" : "read_only"),
      persistence: row.persistence || "",
      editable: this.contractBool(row.editable, false),
      editor: row.editor || row.editor_type || "",
      validation: this.parseJsonValue(row.validation, row.validation || {}),
      choices: this.parseJsonValue(row.choices, row.choices || null),
      options: this.parseJsonValue(row.options, row.options || null),
      choice_source: row.choice_source || "",
      value_field: row.value_field || "value",
      label_field: row.label_field || "label",
      secondary_label_field: row.secondary_label_field || "secondary_label",
      allow_none: this.contractBool(row.allow_none, false),
      none_value: row.none_value ?? "",
      // V1 write metadata is authoritative. Never manufacture writeability from
      // the mere presence of a target/service binding.
      write_supported: this.contractBool(row.write_supported, false),
      write_binding_type: row.write_binding_type || row.editor || "",
      write_service_domain: row.write_service_domain || "",
      write_service_action: row.write_service_action || "",
      write_target_entity: row.write_target_entity || "",
      write_service_data: this.parseJsonValue(row.write_service_data, row.write_service_data || {}),
      write_value_field: row.write_value_field || row.write_field || "",
      write_command: row.write_command || "",
      family: row.family || row.property_family || row.ux_family || "",
      group: row.group || row.property_group || row.ux_group || "",
      parent: row.parent || row.parent_property || row.parent_key || row.summary_parent || "",
      parent_property: row.parent_property || row.parent || row.parent_key || row.summary_parent || "",
      detail_level: row.detail_level || row.visibility_level || row.ux_detail_level || "",
      logical_entity: row.logical_entity || "",
      display_order: row.display_order ?? row.sort_order ?? row.priority ?? 999,
      display_name: row.display_name || row.label || row.name || "",
      description: row.description || row.help || row.meaning || "",
      icon: row.icon || "",
      semantic_value_type: row.semantic_value_type || row.semantic_type || "",
      value_type: row.value_type || row.type || row.semantic_value_type || row.semantic_type || "",
      importance: row.importance || row.priority_level || ""
    };
  }

  factRows(assetId = "") {
    // R22.8: runtime values come only from typed property indexes.
    // Legacy mobility_fact_index and embedded vehicle/charger facts are not consumed.
    return this.propertyRows(assetId);
  }

  relationshipRows(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const rows = this.mobilityRuntimeV2()?.relationships || [];
    return rows.filter((r) => !canonical || String(r.source_asset_id || r.asset_id || "") === String(canonical) || String(r.target_asset_id || "") === String(canonical));
  }

  relationshipFor(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    if (canonical.startsWith("vehicle_")) return this.vehicleChargerRelationship(canonical);
    if (!canonical.startsWith("charger_")) return { assigned:"none", connected:"none", effective:"none", selected:"none", row:null };
    const runtimeV2 = this.mobilityRuntimeV2();
    if (runtimeV2) {
      const relations = runtimeV2.vehicle_charger_relationships || [];
      const configured = relations.filter((row)=>String(row?.configured_charger_id || "") === canonical);
      const effectiveRows = relations.filter((row)=>String(row?.effective_charger_id || "") === canonical);
      const physical = relations.filter((row)=>row?.observed_identity_proven === true && String(row?.physically_connected_charger_id || "") === canonical);
      const one = (rows) => rows.length === 1 ? String(rows[0]?.vehicle_id || rows[0]?.asset_id || "none") : "none";
      const selected = one(configured);
      const effective = one(effectiveRows);
      const connected = one(physical);
      const assigned = selected !== "none" ? selected : effective;
      return {
        assigned, connected, effective, selected,
        assigned_vehicle:assigned,
        connected_vehicle:connected,
        effective_vehicle:effective,
        selected_vehicle:selected,
        relationship_resolution:physical.length > 1 || effectiveRows.length > 1 || configured.length > 1 ? "CONFLICT" : "V2",
        confidence:physical.length === 1 ? "proven" : "",
        row:physical[0] || effectiveRows[0] || configured[0] || null,
        connected_row:physical[0] || null,
        effective_row:effectiveRows[0] || null,
        selected_row:configured[0] || null,
        _authority:"MOBILITY_PUBLIC_RUNTIME_V2"
      };
    }
    const rows = this.relationshipRows(canonical).filter((r) => String(r.source_asset_id || r.asset_id || "") === String(canonical));
    const selectedRow = rows.find((r) => String(r.relationship_type || "") === "charger_selected_vehicle") || null;
    const effectiveRow = rows.find((r) => String(r.relationship_type || "") === "charger_effective_assigned_vehicle") || null;
    const connectedRow = rows.find((r) => String(r.relationship_type || "") === "charger_connected_vehicle") || null;
    const valueOf = (row) => this.cleanValue(row?.effective_target_asset_id || row?.target_asset_id || "", "none") || "none";
    const selected = valueOf(selectedRow);
    const effective = valueOf(effectiveRow);
    const connected = valueOf(connectedRow);
    const assigned = selected !== "none" ? selected : effective;
    return {
      assigned, connected, effective, selected,
      assigned_vehicle: assigned,
      connected_vehicle: connected,
      effective_vehicle: effective,
      selected_vehicle: selected,
      relationship_resolution: connectedRow?.resolution_source || effectiveRow?.resolution_source || selectedRow?.resolution_source || "",
      confidence: connectedRow?.confidence || effectiveRow?.confidence || selectedRow?.confidence || "",
      row: effectiveRow || selectedRow || connectedRow || null,
      connected_row: connectedRow,
      effective_row: effectiveRow,
      selected_row: selectedRow
    };
  }

  commandsFor(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    // Command V2 is authoritative when present. The frozen V1 command index is
    // compatibility-only for older backends and never overrides a V2 publication.
    return this.commandRegistry(canonical)
      .filter((c) => c && String(c.asset_id || "") === String(canonical))
      .filter((c) => this.contractBool(c.frontend_allowed, true) === true)
      .map((c) => this.withCommandEnumOptions(c))
      .sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.command_key || a.label || "").localeCompare(String(b.command_key || b.label || "")));
  }

  withCommandEnumOptions(command) {
    if (!command || !command.parameter_schema || typeof command.parameter_schema !== "object") return command;
    const out = { ...command, enum_options: {} };
    for (const [paramName, schema] of Object.entries(command.parameter_schema || {})) {
      if (!schema || typeof schema !== "object" || String(schema.type || "").toLowerCase() !== "enum") continue;
      const options = this.commandEnumOptions(schema);
      out.enum_options[paramName] = options;
    }
    return out;
  }

  commandEnumOptions(schema = {}) {
    const source = String(schema.source || "").trim();
    if (!source) return [];
    const valueField = schema.value_field || "value";
    const labelField = schema.label_field || "label";
    const rows = this.canonicalRowsFromAttrs(source, ["profiles", "chargers", "assets", "rows", "options"], `enum:${source}`);
    return rows
      .map((row) => ({
        value: row?.[valueField] ?? row?.asset_id ?? row?.profile_id ?? row?.id ?? "",
        label: row?.[labelField] ?? row?.display_name ?? row?.short_name ?? row?.name ?? row?.asset_id ?? row?.profile_id ?? ""
      }))
      .filter((o) => String(o.value || "").trim())
      .sort((a,b)=>String(a.label || a.value).localeCompare(String(b.label || b.value)));
  }

  commandFamily(command) {
    return this.resolvedCommandFamily(command);
  }

  commandsByFamily(assetId) {
    const grouped = new Map();
    this.commandsFor(assetId)
      .filter((cmd) => cmd && cmd.frontend_allowed !== false)
      .forEach((cmd) => {
        const family = this.commandFamily(cmd) || `__${String(cmd.command_id || cmd.label || "command").toLowerCase()}`;
        if (!grouped.has(family)) grouped.set(family, []);
        grouped.get(family).push(this.completeCommandIntent(cmd, assetId));
      });
    for (const [family, rows] of grouped.entries()) {
      grouped.set(family, rows.filter(Boolean).sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.label || "").localeCompare(String(b.label || ""))));
    }
    return grouped;
  }

  commandFromFamily(assetId, family, orderedIds = []) {
    const rows = this.commandsByFamily(assetId).get(String(family || "").toLowerCase()) || [];
    if (!rows.length) return null;
    for (const id of orderedIds) {
      const wanted = this.norm(id);
      const found = rows.find((cmd) => this.norm(cmd.command_id) === wanted);
      if (found) return found;
    }
    return rows.find((cmd) => this.commandUsable(cmd)) || rows[0] || null;
  }

  commandActionRank(command = {}) {
    const id = String(command.command_key || command.command_id || command.label || "").toLowerCase();
    const family = this.resolvedCommandFamily(command);
    const group = String(command.command_group || "").toLowerCase();
    const role = String(command.command_role || "").toLowerCase();
    const familyRank = { charging: 10, climate: 20, security: 30, access: 30, maintenance: 70, diagnostics: 75, vehicle: 80, charger: 80, overview: 90 };
    let actionRank = 50;
    if (id.includes("stop") || role.includes("stop")) actionRank = 10;
    else if (id.includes("pause")) actionRank = 15;
    else if (id.includes("start") || id.includes("force") || id.includes("resume")) actionRank = 20;
    else if (id.includes("toggle")) actionRank = 30;
    else if (id.includes("unlock")) actionRank = 35;
    else if (id.includes("lock")) actionRank = 40;
    else if (id.includes("restart")) actionRank = 70;
    else if (id.includes("identify") || id.includes("locate")) actionRank = 75;
    else if (id.includes("availability")) actionRank = 85;
    return [familyRank[family] ?? 60, actionRank, Number(command.sort_order ?? 999), group, id].join("|");
  }

  commandInteraction(command = {}) {
    const schema = command?.parameter_schema && typeof command.parameter_schema === "object" ? command.parameter_schema : {};
    const parameters = Object.entries(schema).map(([name, definition]) => ({
      name,
      ...(definition && typeof definition === "object" ? definition : {}),
      required: this.contractBool(definition?.required, false) === true
    }));
    const required = parameters.filter((parameter) => parameter.required);
    if (!required.length) return { mode: "immediate", parameters, required, supported: true, reason: "" };
    const supported = required.every((parameter) => {
      const type = String(parameter.type || "").toLowerCase();
      if (type !== "enum") return false;
      return this.commandEnumOptions(parameter).length > 0 || (Array.isArray(parameter.values) && parameter.values.length > 0);
    });
    return {
      mode: "form",
      parameters,
      required,
      supported,
      reason: supported ? "" : "Required command parameters are not supported by this control surface"
    };
  }

  commandSlotContract(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const entityId = canonical.startsWith("charger_")
      ? "sensor.mobility_charger_command_slot_index"
      : canonical.startsWith("vehicle_")
        ? "sensor.mobility_vehicle_command_slot_index"
        : "";
    if (!entityId || !this.entity(entityId)) return null;
    const attrs = this.entity(entityId)?.attributes || {};
    const actionKey = canonical.startsWith("charger_") ? "charger_actions" : "vehicle_actions";

    // Same slot owner; accept object/JSON transport forms only.
    for (const attrName of ["slots_by_asset", "slots_by_asset_json"]) {
      const byAsset = this.parseJsonValue(attrs[attrName], attrs[attrName] || {});
      if (byAsset && typeof byAsset === "object" && !Array.isArray(byAsset) && byAsset[canonical]) return byAsset[canonical];
    }

    for (const attrName of [actionKey, `${actionKey}_json`]) {
      const directActions = this.parseJsonValue(attrs[attrName], attrs[attrName] || null);
      if (directActions && typeof directActions === "object") {
        if (!Array.isArray(directActions) && directActions[canonical]) return { asset_id: canonical, [actionKey]: directActions[canonical] };
        if (!Array.isArray(directActions) && Array.isArray(directActions.commands)) {
          const owned = directActions.commands.filter((row)=>!row?.asset_id || this.canonicalAssetId(row.asset_id) === canonical);
          if (owned.length) return { asset_id: canonical, [actionKey]: { ...directActions, commands: owned } };
        }
      }
    }

    for (const attrName of ["slots_json", "slots", "rows", "rows_json"]) {
      const rows = this.parseJsonValue(attrs[attrName], attrs[attrName] || []);
      if (!Array.isArray(rows)) continue;
      const row = rows.find((entry)=>this.canonicalAssetId(entry?.asset_id || "") === canonical) || null;
      if (row) return row;
    }
    return null;
  }

  commandSlotRowsForSurface(assetId = "", surface = "quick_actions") {
    const canonical = this.canonicalAssetId(assetId);
    const slot = this.commandSlotContract(canonical);
    if (!slot) return null;
    const actionKey = canonical.startsWith("charger_") ? "charger_actions" : canonical.startsWith("vehicle_") ? "vehicle_actions" : "";
    if (!actionKey) return null;

    // R43.2.54: <asset_actions>.commands is one semantic placement container. Merge
    // only structural serializations of that exact container, then deduplicate. The
    // former first-array-wins parser could silently reduce four charger actions to
    // START/STOP when another serialization was only partially materialized.
    const candidates = [];
    if (canonical.startsWith("vehicle_") && surface === "quick_actions") candidates.push(slot.quick_actions);
    const nested = this.parseJsonValue(slot[actionKey], slot[actionKey] || null);
    if (nested && typeof nested === "object" && !Array.isArray(nested)) candidates.push(nested.commands);
    candidates.push(slot[`${actionKey}.commands`]);
    const cardSections = this.parseJsonValue(slot.card_sections, slot.card_sections || null);
    if (cardSections && typeof cardSections === "object" && !Array.isArray(cardSections)) {
      candidates.push(cardSections[`${actionKey}.commands`]);
      const section = this.parseJsonValue(cardSections[actionKey], cardSections[actionKey] || null);
      if (section && typeof section === "object" && !Array.isArray(section)) candidates.push(section.commands);
    }

    const commands = [];
    const seen = new Set();
    for (const candidate of candidates) {
      if (candidate === undefined || candidate === null || candidate === "") continue;
      const parsed = this.parseJsonValue(candidate, null);
      if (!Array.isArray(parsed)) continue;
      for (const row of parsed) {
        const key = typeof row === "string" ? row : String(row?.command_id || row?.command_key || row?.id || "");
        if (!key || seen.has(key)) continue;
        seen.add(key);
        commands.push(row);
      }
    }

    if (["quick_actions", "operational", actionKey].includes(surface)) return commands;
    const wanted = this.norm(surface);
    return commands.filter((row)=>{
      const explicit = [row?.surface, row?.surface_id, row?.section_id, row?.placement, row?.component_id && row?.section_id ? `${row.component_id}.${row.section_id}` : ""]
        .filter(Boolean).map((value)=>this.norm(value));
      return explicit.includes(wanted);
    });
  }

  commandsForSurface(assetId = "", surface = "operational") {
    const canonical = this.canonicalAssetId(assetId);
    const v2Rows = this.commandV2RowsForSurface(canonical, surface);
    if (v2Rows !== null) {
      return v2Rows
        .map((command)=>this.completeCommandIntent(command, canonical))
        .filter((command)=>command && this.contractBool(command.frontend_allowed, true) === true);
    }
    const slotRows = this.commandSlotRowsForSurface(canonical, surface);
    if (slotRows === null) return [];

    // Frozen V1 compatibility path: placement comes from the slot index and
    // readiness/invoke from mobility_command_index. This path is never consulted
    // when MOBILITY_COMMAND_V2 exists.
    const commands = this.uiCommandSurface(canonical).map((command)=>this.completeCommandIntent(command, canonical)).filter(Boolean);
    const byId = new Map(commands.map((cmd)=>[String(cmd.command_id || ""), cmd]));
    const byKey = new Map(commands.map((cmd)=>[String(cmd.command_key || ""), cmd]));
    const seen = new Set();
    return slotRows.map((slot)=>{
      const rawPlacement = typeof slot === "string" ? { command_id: slot, command_key: slot } : (slot || {});
      const slotId = String(rawPlacement.command_id || rawPlacement.id || rawPlacement.command || "");
      const slotKey = String(rawPlacement.command_key || rawPlacement.key || rawPlacement.command || "");
      // R43.2.54 owner separation: slot rows are placement only. Even when an older
      // compatibility serialization still carries readiness/invoke fields, UX must
      // ignore them so they cannot override sensor.mobility_command_index.
      const placement = {
        command_id: slotId,
        command_key: slotKey,
        surface: rawPlacement.surface || rawPlacement.surface_id || "",
        section_id: rawPlacement.section_id || "",
        component_id: rawPlacement.component_id || "",
        display_order: rawPlacement.display_order ?? rawPlacement.order ?? null,
        primary_action: this.contractBool(rawPlacement.primary_action, false)
      };
      const command = byId.get(slotId) || byKey.get(slotKey) || byId.get(slotKey) || byKey.get(slotId);
      if (command) return { ...command, ...placement, command_id: command.command_id || slotId, command_key: command.command_key || slotKey };
      if (!slotId && !slotKey) return null;
      return {
        ...placement,
        asset_id: canonical,
        command_id: slotId || slotKey,
        command_key: slotKey || slotId,
        label: this.titleize(slotId || slotKey),
        frontend_allowed: true,
        execution_allowed: false,
        execution_reason: "Backend contract gap: placed command missing from mobility_command_index"
      };
    }).filter((command)=>{
      if (!command || this.contractBool(command.frontend_allowed, true) === false) return false;
      const key = String(command.command_id || command.command_key || "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map((command)=>{
      const interaction = this.commandInteraction(command);
      const enumOptions = {};
      for (const parameter of interaction.required) {
        if (String(parameter.type || "").toLowerCase() !== "enum") continue;
        const sourced = this.commandEnumOptions(parameter);
        enumOptions[parameter.name] = sourced.length ? sourced : (parameter.values || []).map((value)=>({ value, label:this.titleize(value) }));
      }
      return { ...command, interaction_mode:interaction.mode, interaction_supported:interaction.supported, interaction_reason:interaction.reason, required_parameters:interaction.required.map((parameter)=>parameter.name), enum_options:enumOptions };
    });
  }

  unifiedCommandsFor(assetId, surface = "operational") {
    // Compatibility method retained for callers, but semantics are now identical to
    // the R43.2.54 slot-owned command surface. No family/category filtering exists.
    return this.commandsForSurface(assetId, surface);
  }

  controlsFor(assetId = "") {
    // Public typed model: write controls are exposed on property rows as write_command.
    return [];
  }

  controlEntity(assetId, field, fallback = "") {
    const canonical = this.canonicalAssetId(assetId);
    const prop = this.propertyRows(canonical).find((p) => {
      const ft = String(p.fact_type || "");
      const pk = String(p.property_key || "");
      return ft === String(field) || pk === String(field) || pk.endsWith(`.${field}`);
    });
    if (prop?.write_command) return prop.write_command;
    const row = this.controlsFor(canonical).find((c) => String(c.field || c.control_id || c.id || "") === String(field));
    return row?.entity_id || row?.value_entity || fallback;
  }

  factTypeAliases(field, assetId = "") {
    return this.propertyKeyCandidates(assetId, field);
  }

  factContractRow(assetId, field) {
    const canonical = this.canonicalAssetId(assetId);
    const wanted = this.factTypeAliases(field, canonical);
    for (const key of wanted) {
      const direct = this.propertyByCompoundKey(canonical, key);
      if (direct) return direct;
    }
    const rows = this.factRows(canonical);
    for (const factType of wanted) {
      const wantedPlain = String(factType || "").replace(/^(vehicle|charger|person|asset)\./, "");
      const row = rows.find((f) => {
        const t = String(f.fact_type || f.field || "");
        const pk = String(f.property_key || f.normalized_property || "");
        const pkPlain = pk.replace(/^(vehicle|charger|person|asset)\./, "");
        return t === factType || t === wantedPlain || pk === factType || pkPlain === wantedPlain || pk.endsWith(`.${wantedPlain}`);
      });
      if (row) return row;
    }
    return null;
  }

  compatibilityFactRow(assetId) {
    // R22.8: embedded compatibility facts are transitional and forbidden for UX runtime values.
    return null;
  }

  factEntity(assetId, field) {
    const canonicalFact = this.factContractRow(assetId, field);
    return canonicalFact?.entity_id || "";
  }


  factContractValue(assetId, field, fallback = "") {
    const canonicalFact = this.factContractRow(assetId, field);
    if (!canonicalFact) return fallback;
    const value = canonicalFact.value;
    if (value === undefined || value === null) return fallback;
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return String(value);
    const s = String(value).trim();
    if (s === "") return fallback;
    const lower = s.toLowerCase();
    // A published property row is meaningful even when the backend explicitly says
    // unknown/unavailable/degraded. Do not hide it as if the contract row was missing.
    if (["unknown", "unavailable", "none", "null", "undefined", "nan", "invalid"].includes(lower)) {
      if (fallback === "—" || fallback === "") return "Unknown";
      return lower === "none" ? "None" : "Unknown";
    }
    return s;
  }


  factValue(assetId, field, fallback = "") {
    return this.factContractValue(assetId, field, fallback);
  }


  factEntityExists(assetId, field) {
    return !!this.factContractRow(assetId, field);
  }


  displayFactValue(assetId, field, fallback = "Not available") {
    const row = this.factContractRow(assetId, field);
    if (!row) return fallback;
    return this.factContractValue(assetId, field, fallback);
  }


  numberValue(entityId) {
    const raw = this.state(entityId, "");
    if (raw === "") return null;
    const n = Number(String(raw).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  factNumber(assetId, field) {
    const v = this.factContractValue(assetId, field, "");
    if (v === "") return null;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }


  completeCommandIntent(command, assetId = "") {
    if (!command) return null;
    const completed = { ...command };
    const canonical = assetId ? this.canonicalAssetId(assetId) : (completed.asset_id || "");
    if (!completed.asset_id && canonical) completed.asset_id = canonical;
    if (!completed.parameter_schema && typeof completed.parameter_schema_json === "string" && completed.parameter_schema_json.trim()) {
      const parsed = this.parseJsonValue(completed.parameter_schema_json, null);
      if (parsed && typeof parsed === "object") completed.parameter_schema = parsed;
    }
    return completed;
  }

  selectCommand(assetId, ids = []) {
    const canonical = this.canonicalAssetId(assetId);
    const commands = this.commandsFor(canonical).filter((c) => c.frontend_allowed !== false);
    for (const wanted of ids) {
      const normWanted = this.norm(wanted);
      const found = commands.find((cmd) => {
        const parts = [cmd.command_id, cmd.command_key, cmd.command_group, cmd.command_role, cmd.current_state_property, cmd.label].filter(Boolean).map((v)=>this.norm(v));
        return parts.includes(normWanted) || parts.some((p)=>p.endsWith(normWanted));
      });
      if (found) return this.completeCommandIntent(found, canonical);
    }
    return null;
  }

  vehicleCommandSafetyState(command) {
    // R41.5: vehicle charging proxy availability is owned by the backend command row.
    // UX must not locally disable vehicle charging actions by inspecting relationships.
    // If backend cannot bind the proxy, it must publish frontend_allowed=false or execution_allowed=false.
    return { disabled: false, reason: "" };
  }

  commandUsable(command) {
    if (!command || this.contractBool(command.frontend_allowed, true) === false) return false;
    return this.contractBool(command.execution_allowed, false) === true;
  }

  commandState(command) {
    // MOBILITY_COMMAND_V2 is authoritative when present; V1 command-index rows are
    // accepted only as a compatibility projection on older backends.
    const status = command?.execution_status || command?.ui_state || command?.effective_availability || "";
    const reason = command?.blocked_reason || command?.execution_reason || command?.disabled_reason || "";
    const lower = String(status).toLowerCase();
    const frontendHidden = !command || this.contractBool(command.frontend_allowed, true) === false;
    const executionAllowed = this.contractBool(command?.execution_allowed, false) === true;
    const hasServiceCall = !!(command?.service_domain && command?.service_action);
    const missingExecutor = executionAllowed && !hasServiceCall;
    const unsupportedInteraction = command?.interaction_mode === "form" && command?.interaction_supported === false;
    return {
      disabled: frontendHidden || !executionAllowed || missingExecutor || unsupportedInteraction,
      busy: lower.includes("running") || lower.includes("pending") || lower.includes("queued") || lower.includes("in_progress"),
      failed: lower.includes("failed") || lower.includes("blocked") || lower.includes("unavailable") || lower.includes("error"),
      status,
      reason: reason || (unsupportedInteraction ? (command?.interaction_reason || "Required command parameters are not supported") : (missingExecutor ? "No executable producer command boundary available" : (!executionAllowed ? "Execution not allowed by command contract" : "")))
    };
  }

  commandVisibilityReport(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    return this.commandRegistry(canonical).map((cmd) => {
      const st = this.commandState(cmd);
      const hidden = cmd.frontend_allowed === false ? "frontend_allowed=false" : (this.isConfigurationCommand(cmd) ? "configuration-setting-command" : "visible");
      return {
        asset_id: cmd.asset_id || canonical,
        command_key: cmd.command_key || cmd.command_id || "",
        family: cmd.command_family || "",
        frontend_allowed: String(cmd.frontend_allowed !== false),
        execution_allowed: String(cmd.execution_allowed === true),
        render_decision: hidden === "visible" ? (st.disabled ? "visible_disabled" : "visible_enabled") : "hidden",
        reason: hidden === "visible" ? (st.reason || cmd.execution_reason || "") : hidden
      };
    });
  }

  normalizeRuntimeChargingStatus(value) {
    const s = String(value || "").trim();
    const l = s.toLowerCase();
    if (!s || ["unknown", "unavailable", "none", "null", "undefined", "empty_snapshots", "invalid"].includes(l)) return "Unknown";
    if (l === "off") return "Off";
    if (l === "on") return "On";
    if (l.includes("charging")) return "Charging";
    if (l.includes("connected") || l.includes("plugged")) return "Connected";
    return s;
  }

  chargingActive(status, power = null) {
    const l = String(status || "").toLowerCase();
    return l === "charging" || l.includes("charging now") || (power !== null && Number.isFinite(Number(power)) && Math.abs(Number(power)) > 0.05);
  }

  canonicalPropertyValue(assetId = "", propertyKey = "") {
    const canonical = this.canonicalAssetId(assetId);
    const row = this.propertyByCompoundKey(canonical, propertyKey);
    if (!row) return { resolved:false, value:"", row:null, reason:`${propertyKey} contract gap` };
    const value = this.cleanValue(row.value, "");
    if (value === "" || value === null || value === undefined) return { resolved:false, value:"", row, reason:`${propertyKey} missing value` };
    return { resolved:true, value:String(value).trim(), row, reason:"" };
  }

  canonicalPropertyDisplay(assetId = "", propertyKey = "", fallback = "—") {
    const prop = this.canonicalPropertyValue(assetId, propertyKey);
    if (!prop.resolved) return fallback;
    return this.formatValue(prop.value, prop.row?.unit || "", propertyKey);
  }

  canonicalChargerPropertyValue(assetId = "", propertyKey = "") {
    return this.canonicalPropertyValue(assetId, propertyKey);
  }

  canonicalChargerPropertyDisplay(assetId = "", propertyKey = "", fallback = "—") {
    // Exact-owner display helper. This intentionally does not use displayFactValue()
    // because that resolver supports historical aliases for non-cutover surfaces.
    const prop = this.canonicalChargerPropertyValue(assetId, propertyKey);
    if (!prop.resolved) return fallback;
    const row = prop.row || {};
    return this.formatValue(prop.value, row.unit || "", propertyKey);
  }

  chargerProductSnapshot(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const cacheKey = `chargerProductSnapshot:${canonical}`;
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const exact = (propertyKey) => this.canonicalChargerPropertyValue(canonical, propertyKey);
    const operating = exact("charger.operating_state");
    const connection = exact("charger.connection_state");
    const power = exact("charger.power_kw");
    const health = exact("charger.health");
    const healthReason = exact("charger.health_reason");
    const relationship = this.relationshipFor(canonical);
    const connectedRaw = String(relationship?.connected_vehicle || relationship?.connected || "").trim();
    const hasConnectedVehicle = !!connectedRaw && !["none", "unknown", "unavailable", "null", "undefined", "—"].includes(connectedRaw.toLowerCase());
    const vehicleId = hasConnectedVehicle ? this.canonicalAssetId(connectedRaw.startsWith("vehicle_") ? connectedRaw : `vehicle_${connectedRaw.replace(/^vehicle_/, "")}`) : "";
    const vehicleEntry = vehicleId ? (this.vehicleById(vehicleId) || this.assetById(vehicleId)) : null;
    const connectionRaw = connection.resolved ? String(connection.value).trim().toLowerCase() : "";
    const connectionDisplay = !connection.resolved ? "—" : (["connected", "asset_connected"].includes(connectionRaw) ? "Connected" : (["disconnected", "no_asset_connected"].includes(connectionRaw) ? "Disconnected" : this.titleize(connection.value)));
    const healthDisplay = health.resolved ? this.titleize(health.value) : "—";
    const reasonDisplay = healthReason.resolved && !["none", "ok", ""].includes(String(healthReason.value || "").toLowerCase()) ? this.titleize(healthReason.value) : "";
    const snapshot = {
      asset_id: canonical,
      operating: { ...operating, display: operating.resolved ? this.chargerOperatingStateDisplay(operating.value) : "—" },
      connection: { ...connection, display: connectionDisplay },
      power: { ...power, display: power.resolved ? this.formatValue(power.value, power.row?.unit || "kW", "charger.power_kw") : "—" },
      health: { ...health, display: healthDisplay, reason: reasonDisplay, reason_resolved: healthReason.resolved },
      connected_vehicle: { resolved: hasConnectedVehicle, asset_id: vehicleId, display: hasConnectedVehicle ? (vehicleEntry?.display_name || this.vehicleLabel(vehicleId)) : "—", relationship }
    };
    this._memo.set(cacheKey, snapshot);
    return snapshot;
  }


  chargerOperatingStateDisplay(value = "") {
    const raw = String(value || "").trim();
    const state = raw.toLowerCase();
    const labels = {
      idle:"Idle",
      stopped:"Stopped",
      running:"Charging",
      suspended:"Suspended",
      preparing:"Preparing",
      fault:"Fault",
      unknown:"Unknown"
    };
    return labels[state] || this.titleize(raw);
  }

  chargerOperationalStatus(assetId = "") {
    return this.chargerProductSnapshot(assetId).operating.display;
  }

  chargerConnectionState(assetId = "") {
    return this.chargerProductSnapshot(assetId).connection.display;
  }

  chargerConnectedVehicleLabel(assetId = "") {
    return this.chargerProductSnapshot(assetId).connected_vehicle.display;
  }

  physicalVehicleForCharger(assetId = "") {
    const connected = this.chargerProductSnapshot(assetId).connected_vehicle;
    if (!connected.resolved) return { assetId:"", displayName:"", detailRoute:"" };
    const entry = this.vehicleById(connected.asset_id) || this.assetById(connected.asset_id);
    return { assetId:connected.asset_id, displayName:connected.display, detailRoute:this.assetDetailRoute(entry || connected.asset_id) };
  }

  chargerHealthSummary(assetId = "") {
    const health = this.chargerProductSnapshot(assetId).health;
    return { value:health.display, reason:health.reason, resolved:health.resolved };
  }

  chargerCanonicalStatusTiles(assetId = "", vehicleTile = {}) {
    const snapshot = this.chargerProductSnapshot(assetId);
    const statusValue = snapshot.operating.display;
    const connectionValue = snapshot.connection.display;
    const connectedVehicle = snapshot.connected_vehicle.display;
    return [
      { label:"Status", value:statusValue, subvalue:snapshot.operating.resolved ? "Canonical operating state" : snapshot.operating.reason, icon:"mdi:ev-station", tone: !snapshot.operating.resolved ? "neutral" : (this.chargerStatusToneLabel(statusValue) === "red" ? "error" : this.chargerStatusToneLabel(statusValue) === "amber" ? "attention" : "neutral") },
      { label:"Connection", value:connectionValue, subvalue:snapshot.connection.resolved ? "Physical connection" : snapshot.connection.reason, icon:"mdi:ev-plug-type2", tone: connectionValue === "Connected" ? "active" : "neutral" },
      { label:"Power", value:snapshot.power.display, subvalue:snapshot.power.resolved ? "Actual canonical power" : snapshot.power.reason, icon:"mdi:flash", tone: snapshot.power.resolved && Number(snapshot.power.value) > 0.05 ? "active" : "neutral" },
      { label:"Vehicle", value:connectedVehicle === "—" ? "No vehicle connected" : connectedVehicle, subvalue:snapshot.connected_vehicle.resolved ? "Physical relationship" : "No physical vehicle relationship", icon:"mdi:car-electric", tone:snapshot.connected_vehicle.resolved ? "active" : "neutral", detailRoute:snapshot.connected_vehicle.resolved ? (vehicleTile.detailRoute || "") : "", detailTitle:vehicleTile.detailTitle || "Open vehicle details" },
      { label:"Health", value:snapshot.health.display, subvalue:snapshot.health.reason, icon:"mdi:shield-check-outline", tone:snapshot.health.resolved && String(snapshot.health.display).toLowerCase() === "ok" ? "active" : (snapshot.health.resolved ? "attention" : "neutral") }
    ];
  }

  chargerStatusToneLabel(value = "") {
    const l = String(value || "").toLowerCase();
    if (l.includes("running") || l.includes("charging")) return "green";
    if (["idle", "stopped", "suspended"].some((s)=>l.includes(s))) return "green";
    if (l.includes("fault") || l.includes("error")) return "red";
    if (l.includes("unavailable") || l.includes("unknown") || l === "—") return "amber";
    return "green";
  }


  relatedVehicleForCharger(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const rel = this.relationshipFor(canonical);
    const isReal = (value) => {
      const v = String(value || "").trim();
      return !!v && !["none", "unknown", "unavailable", "null", "undefined", "—"].includes(v.toLowerCase());
    };
    // Navigation may use the effective/selected relationship when physically disconnected,
    // but the displayed connection badge/connected-vehicle pill never does.
    const raw = [rel.connected_vehicle, rel.effective_vehicle, rel.assigned_vehicle, rel.connected, rel.effective, rel.assigned].find(isReal) || "";
    const vehicleId = raw ? this.canonicalAssetId(String(raw).startsWith("vehicle_") ? raw : `vehicle_${String(raw).replace(/^vehicle_/, "")}`) : "";
    const entry = vehicleId ? (this.vehicleById(vehicleId) || this.assetById(vehicleId)) : null;
    const displayName = entry?.display_name || (vehicleId ? this.vehicleLabel(vehicleId) : "");
    const detailRoute = vehicleId ? this.assetDetailRoute(entry || vehicleId) : "";
    return { assetId: vehicleId, displayName, detailRoute };
  }

  addRelatedAssetDetailLinks(sections = [], context = {}) {
    const chargerRoute = String(context.chargerDetailRoute || "");
    const chargerDisplay = String(context.chargerDisplay || "");
    const vehicleRoute = String(context.vehicleDetailRoute || "");
    const vehicleDisplay = String(context.vehicleDisplay || "");
    const decorateRow = (row) => {
      if (!row || typeof row !== "object" || row.detailRoute) return row;
      const label = String(row.label || "").toLowerCase();
      const value = String(row.value || "").trim();
      const isMissing = !value || ["—", "none", "unknown", "unavailable", "not available"].includes(value.toLowerCase());
      if (isMissing) return row;
      if (chargerRoute && (label.includes("active charger") || label.includes("connected charger") || label === "charger" || label.includes("effective charger"))) {
        return { ...row, detailRoute: chargerRoute, detailTitle: `Open ${chargerDisplay || "charger"} details` };
      }
      if (vehicleRoute && (label.includes("active vehicle") || label.includes("connected vehicle") || label === "vehicle" || label.includes("effective vehicle"))) {
        return { ...row, detailRoute: vehicleRoute, detailTitle: `Open ${vehicleDisplay || "vehicle"} details` };
      }
      return row;
    };
    return (sections || []).map((section) => section && typeof section === "object" ? {
      ...section,
      rows: (section.rows || []).map(decorateRow)
    } : section);
  }

  commandActionsFor(assetId, surface = "operational") {
    return this.commandsForSurface(assetId, surface);
  }

  liveChargerInfo(chargerAssetOrId) {
    const assetId = this.canonicalAssetId(typeof chargerAssetOrId === "string" ? chargerAssetOrId : chargerAssetOrId?.asset_id || "");
    if (!assetId) return { active:false, status:"—", power:null, current:null, evidence:"contract_gap" };
    const snapshot = this.chargerProductSnapshot(assetId);
    const current = this.canonicalChargerPropertyValue(assetId, "charger.actual_current_a");
    const power = snapshot.power.resolved && Number.isFinite(Number(snapshot.power.value)) ? Number(snapshot.power.value) : null;
    const operatingState = snapshot.operating.resolved ? String(snapshot.operating.value).toLowerCase() : "";
    return {
      active: operatingState === "running",
      status: snapshot.operating.display,
      power,
      current: current.resolved && Number.isFinite(Number(current.value)) ? Number(current.value) : null,
      evidence: snapshot.operating.resolved || snapshot.power.resolved ? "canonical_charger_property_index" : "contract_gap"
    };
  }

  vehicleChargePowerControl(vehicleAssetOrId) {
    const assetId = typeof vehicleAssetOrId === "string" ? this.canonicalAssetId(vehicleAssetOrId) : this.canonicalAssetId(vehicleAssetOrId?.asset_id || "");
    if (!assetId) return { value: null, display: "—", unit: "kW", property: null, entity: "", intent: "", visible: false, executable: false };
    const model = this.vehicleChargePowerControlModel(assetId);
    const prop = model?.prop || null;
    const value = model?.resolved && Number.isFinite(Number(model.value)) ? Number(model.value) : null;
    const display = value === null ? "—" : this.formatValue(Number.isInteger(value) ? String(value) : String(Number(value).toFixed(2)).replace(/\.00$/, ""), model?.unit || "kW", prop?.property_key || "charger.requested_charge_power_kw");
    return {
      value, display, unit: model?.unit || "kW", property: prop,
      entity: model?.write_target_entity || "", intent: "", visible: !!model?.resolved,
      executable: !!model?.writable,
      min: model?.min, max: model?.max, step: model?.step, authority_asset_id: model?.authority_asset_id || ""
    };
  }

  liveChargingContextForVehicle(vehicleAssetOrId) {
    const assetId = this.canonicalAssetId(typeof vehicleAssetOrId === "string" ? vehicleAssetOrId : vehicleAssetOrId?.asset_id || "");
    if (!assetId) return { active:false, status:"—", rawStatus:"", reason:"contract_gap", power:null, current:null, detail:"Charging context unavailable.", assigned:"", effective_charger:"", physical_charger:"", charger:null, chargerEvidence:"contract_gap", statusEntity:"" };
    const rel = this.vehicleChargerRelationship(assetId);
    const isReal = (value) => {
      const v = String(value || "").trim();
      return !!v && !["none","unknown","unavailable","null","undefined","—"].includes(v.toLowerCase());
    };
    const physicalId = isReal(rel.connected) ? this.canonicalAssetId(rel.connected) : "";
    const effectiveId = isReal(rel.effective) ? this.canonicalAssetId(rel.effective) : "";
    const chargerId = physicalId || effectiveId;
    const charger = chargerId ? (this.chargerById(chargerId) || { asset_id:chargerId }) : null;
    const snapshot = chargerId ? this.chargerProductSnapshot(chargerId) : null;
    const status = physicalId && snapshot?.operating?.resolved ? snapshot.operating.display : (physicalId ? "—" : "Not connected");
    const power = physicalId && snapshot?.power?.resolved && Number.isFinite(Number(snapshot.power.value)) ? Number(snapshot.power.value) : null;
    const active = physicalId && snapshot?.operating?.resolved && String(snapshot.operating.value).toLowerCase() === "running";
    return {
      active,
      status,
      rawStatus: snapshot?.operating?.resolved ? String(snapshot.operating.value) : "",
      reason: snapshot?.operating?.reason || "",
      power,
      current:null,
      detail: physicalId ? "Physical charger context from relationship_index and canonical charger properties." : "No physical charger relationship published.",
      assigned: effectiveId,
      effective_charger: effectiveId,
      physical_charger: physicalId,
      charger,
      chargerEvidence: physicalId ? "relationship_index+charger_property_index" : "relationship_index",
      statusEntity:""
    };
  }

  vehicleChargingInfo(vehicleAssetOrId) {
    return this.liveChargingContextForVehicle(vehicleAssetOrId);
  }

  assetViewModel(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    const asset = this.assetById(canonical, canonical.startsWith("vehicle_") ? "vehicle" : canonical.startsWith("charger_") ? "charger" : "all") || this.registryEntry(canonical) || { asset_id: canonical };
    const facts = canonical.startsWith("vehicle_") ? { charging: this.liveChargingContextForVehicle(canonical) } : { charging: this.liveChargerInfo(canonical) };
    return {
      asset,
      asset_id: canonical,
      facts,
      relationship: canonical.startsWith("vehicle_") ? this.relationshipFor(canonical) : {},
      commands: this.commandsFor(canonical),
      controls: this.controlsFor(canonical),
      outcome: {
        status: this.supervisorOutcome(canonical, "status", this.assetStatus(canonical, "status", "Unknown")),
        trust: this.supervisorOutcome(canonical, "trust", this.assetStatus(canonical, "trust", "Unknown")),
        attention: this.supervisorOutcome(canonical, "attention", this.assetStatus(canonical, "attention", "None")),
        opportunity: this.supervisorOutcome(canonical, "opportunity", this.assetStatus(canonical, "opportunity", "None")),
        recommended_action: this.supervisorOutcome(canonical, "recommended_action", this.assetStatus(canonical, "recommended_action", "none"))
      }
    };
  }

  entity(entityId) {
    const id = String(entityId || "").trim();
    if (!id) return undefined;
    // UX consumption contract R22.11.9: all runtime/identity/selector reads
    // must go through the approved public Mobility indexes only.
    // This prevents accidental candidate/fact/adapter/diagnostics/raw entity fallback.
    if (!this.isAllowedContractEntity(id)) return undefined;
    return this.hass?.states?.[id];
  }

  exists(entityId) {
    return !!this.entity(entityId);
  }

  jsonAttr(entityId, attr, fallback = []) {
    const entity = this.entity(entityId);
    const raw = entity?.attributes?.[attr];
    const result = { ok: false, value: fallback, raw, error: "", exists: !!entity, attr_exists: raw !== undefined };
    if (!entity) { result.error = `Entity ${entityId} not found`; return result; }
    if (typeof raw !== "string" || !raw.trim()) { result.error = `Attribute ${attr} missing or not a JSON string`; return result; }
    try { result.value = JSON.parse(raw); result.ok = true; return result; }
    catch (e) { result.error = String(e?.message || e); return result; }
  }

  state(entityId, fallback = "") {
    const raw = this.entity(entityId)?.state;
    if (raw === undefined || raw === null) return fallback;
    const s = String(raw).trim();
    if (!s || ["unknown", "unavailable", "none", "null", "undefined"].includes(s.toLowerCase())) return fallback;
    return s;
  }

  cleanState(entityId, fallback = "") {
    const s = this.state(entityId, fallback);
    if (String(s).toLowerCase() === "none") return fallback;
    return s;
  }

  cleanValue(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    if (Array.isArray(value)) return value.length ? String(value[0] ?? "").trim() : fallback;
    if (typeof value === "object") {
      const candidate = value.asset_id ?? value.id ?? value.value ?? value.state ?? value.display_name ?? value.name;
      return this.cleanValue(candidate, fallback);
    }
    const s = String(value).trim();
    if (!s || ["unknown", "unavailable", "none", "null", "undefined", "nan"].includes(s.toLowerCase())) return fallback;
    return s;
  }

  firstCleanState(candidates = [], fallback = "") {
    for (const entityId of (candidates || []).filter(Boolean)) {
      const v = this.cleanState(entityId, "");
      if (v !== "") return this.normalizeOutcomeValue(key, v, fallback || "Unknown");
    }
    return fallback;
  }

  indexedEntity(assetId, indexAttrName, fieldName) {
    const canonical = this.canonicalAssetId(assetId);
    const rows = this.indexAttr(indexAttrName, []);
    const row = rows.find((r) => String(r?.asset_id || "") === canonical);
    return row?.[fieldName] || "";
  }

  assetStatus(assetId, statusName, fallback = "Unknown") {
    const canonical = this.canonicalAssetId(assetId);
    const mapped = {
      operational_status: "status",
      availability_status: "status",
      data_freshness_status: "data_freshness",
      trust_status: "trust"
    }[statusName] || statusName;
    if (["status", "trust", "attention", "recommended_action", "opportunity"].includes(mapped)) {
      return this.supervisorOutcome(canonical, mapped, fallback);
    }
    return this.displayFactValue(canonical, mapped, fallback);
  }


  energyFactEntity(assetId, fieldName) {
    const canonical = this.canonicalAssetId(assetId);
    return this.indexedEntity(canonical, "energy_fact_entities_json", fieldName);
  }

  energyFact(assetId, fieldName, fallback = "") {
    return this.cleanState(this.energyFactEntity(assetId, fieldName), fallback);
  }


  outcomeCatalogValues(kind = "") {
    return [];
  }

  normalizeOutcomeValue(kind, value, fallback = "Unknown") {
    const clean = this.cleanValue(value, "");
    if (!clean) return fallback;
    const allowed = this.outcomeCatalogValues(kind);
    // No catalog is currently published. If one is added later, only a real
    // non-empty Set constrains backend values.
    if (!(allowed instanceof Set) || allowed.size === 0) return clean;
    return allowed.has(clean) ? clean : fallback;
  }

  supervisorOutcome(assetId = "mobility", key = "status", fallback = "") {
    const canonical = this.canonicalAssetId(assetId || "");
    if (canonical && canonical !== "mobility") return this.factContractValue(canonical, key, fallback);

    // M0.9.44+: global product supervision is a direct producer-owned V2 contract.
    // UX never derives readiness/trust/attention from local facts.
    const supervision = this.mobilitySupervisionV2();
    if (!supervision) return fallback;
    const wanted = String(key || "status").trim().toLowerCase();
    const aliases = {
      trust:"system_trust",
      systemtrust:"system_trust",
      activity:"current_activity"
    };
    const field = aliases[wanted] || wanted;
    const raw = supervision[field];
    if (raw === undefined || raw === null) return fallback;
    if (typeof raw === "object") {
      if (raw.value !== undefined && raw.value !== null) return String(raw.value);
      if (field === "current_activity" && raw.activity) {
        return String(raw.activity.activity_state || raw.activity.state || raw.activity.activity_type || "active");
      }
    }
    if (typeof raw === "string" || typeof raw === "number") return String(raw);
    return fallback;
  }

  parseSupervisorValue(raw, assetId, key) {
    if (raw === undefined || raw === null || raw === "") return "";
    const value = this.parseJsonValue(raw, raw);
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) {
      const row = value.find((r) => String(r?.asset_id || r?.id || r?.scope || "mobility") === String(assetId));
      return row?.[key] ?? row?.outcomes?.[key] ?? "";
    }
    if (typeof value === "object") {
      if (value[key] !== undefined && (assetId === "mobility" || value.asset_id === assetId || !value.asset_id)) return String(value[key]);
      if (value[assetId]) return this.parseSupervisorValue(value[assetId], assetId, key);
      if (value.outcomes) return this.parseSupervisorValue(value.outcomes, assetId, key);
    }
    return "";
  }

  vehicleState(assetId, stateName, fallback = "Unknown") {
    return this.displayFactValue(assetId, stateName, fallback);
  }


  chargerState(assetId, stateName, fallback = "Unknown") {
    return this.displayFactValue(assetId, stateName, fallback);
  }


  isOn(entityId) {
    return this.state(entityId) === "on";
  }

  boolPresent(entityId) {
    const s = this.state(entityId, "");
    if (!s) return true;
    return s !== "off";
  }

  contractBool(value, fallback = true) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "boolean") return value;
    const s = String(value).trim().toLowerCase();
    if (["true", "yes", "on", "1"].includes(s)) return true;
    if (["false", "no", "off", "0"].includes(s)) return false;
    return fallback;
  }

  parseJsonValue(value, fallback = {}) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "object") return value;
    if (typeof value === "string") {
      try { return JSON.parse(value); } catch (e) { return fallback; }
    }
    return fallback;
  }

  norm(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  cache(src) {
    if (!src || src.startsWith("data:")) return src;
    const v = this.config.resource_version || UX_VERSION;
    return src.includes("?") ? `${src}&v=${v}` : `${src}?v=${v}`;
  }

  formatAge(value) {
    if (!value && value !== 0) return "Unknown";
    const raw = String(value).trim();
    const n = Number(raw.replace(",", "."));
    if (Number.isNaN(n)) return raw;
    if (n < 60) return `${Math.round(n)} sec ago`;
    if (n < 3600) return `${Math.round(n / 60)} min ago`;
    if (n < 86400) return `${Math.round(n / 3600)} h ago`;
    return `${Math.round(n / 86400)} d ago`;
  }

  /** Convert command ids and contract values into calm product labels. */
  titleize(value) {
    return String(value || "")
      .replace(/^.*\./, "")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }


  /** Shared command icon resolver used by all screens and adapters. */
  commandIcon(command) {
    const id = String(command?.command_id || command?.id || "").toLowerCase();
    const family = String(command?.command_family || "").toLowerCase();
    const text = `${family} ${id}`;
    if (text.includes("restart") || text.includes("reboot") || text.includes("reset")) return "mdi:restart";
    if (text.includes("identify") || text.includes("locate") || text.includes("location")) return "mdi:crosshairs-gps";
    if (text.includes("stop") || text.includes("pause")) return "mdi:stop";
    if (text.includes("start") || text.includes("charge") || text.includes("resume")) return "mdi:lightning-bolt";
    if (text.includes("climate") || text.includes("heat") || text.includes("precondition")) return "mdi:fan";
    if (text.includes("unlock")) return "mdi:lock-open-outline";
    if (text.includes("lock") || text.includes("security")) return "mdi:lock-outline";
    if (text.includes("present") || text.includes("active")) return "mdi:power";
    return "mdi:gesture-tap-button";
  }

  assetLabelFromIndex(assetId, kind = "all") {
    const id = String(assetId || "").trim();
    if (!id || id.toLowerCase() === "none") return "None";
    const row = this.assetIndexRows(kind).find((a)=>String(a.asset_id || "") === id) || this.assetIndexRows("all").find((a)=>String(a.asset_id || "") === id);
    return row?.display_name || this.titleize(id);
  }

  chargerLabel(value) {
    return this.assetLabelFromIndex(value, "charger");
  }

  vehicleLabel(value) {
    return this.assetLabelFromIndex(value, "vehicle");
  }

  /**
   * Execute the exact invocation published by sensor.mobility_command_index.
   * The UI never reconstructs vendor/OEM producer bindings.
   */
  callCommand(command, data = {}) {
    if (!command || !this.hass) return;
    const st = this.commandState(command);
    if (st.disabled) return;
    if (command.service_domain && command.service_action) {
      const serviceData = { ...(command.service_data && typeof command.service_data === "object" ? command.service_data : {}) };
      if (data && Object.keys(data).length) Object.assign(serviceData, data);
      const target = command.service_target && typeof command.service_target === "object" ? command.service_target : {};
      this.hass.callService(command.service_domain, command.service_action, serviceData, target);
      return;
    }
    console.warn("HomeBrain Mobility: command has no executable service metadata", command.command_key || command.command_id || command);
  }

  toDateTimeLocalInputValue(value = "") {
    const raw = String(value ?? "").trim();
    if (!raw || ["unknown","unavailable","none","null","undefined","not available","—"].includes(raw.toLowerCase())) return "";
    // Already usable HA/input_datetime or datetime-local format.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) return raw.slice(0, 16);
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(raw)) return raw.replace(" ", "T").slice(0, 16);
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  navigate(path) {
    if (!path) return;
    try {
      const u = new URL(path, window.location.origin);
      const asset = u.searchParams.get("asset") || (u.hash || "").replace(/^#asset=/, "");
      if (asset) sessionStorage.setItem("homebrain_mobility_last_asset", decodeURIComponent(asset));
    } catch (e) {}
    history.pushState(null, "", path);
    window.dispatchEvent(new Event("location-changed"));
  }
}
