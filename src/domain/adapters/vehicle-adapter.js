// 30-vehicle-adapter.js
// R22.12.11.30: vehicle view-model adapter for MOBILITY_PUBLIC_RUNTIME_V1; component-contract materialization is transport-safe and fail-closed.
// Product semantics are rendered from named backend owners only. No fact/source
// fallback, topology inference, command matrix, or frontend family reconstruction.

class HomeBrainVehicleAdapter {
  constructor(rt, vehicleId, config) { this.rt = rt; this.id = vehicleId; this.config = config; }
  assetId() { return String(this.id || "").startsWith("vehicle_") ? String(this.id) : `vehicle_${this.id}`; }
  registryEntry() { return this.config.registry_entry || this.rt.vehicleById(this.assetId()) || this.rt.assetById(this.assetId()) || null; }
  profile() { const reg = this.registryEntry(); return reg?.profile_display_name || reg?.profile || reg?.raw?.profile_display_name || this.config.fallback_profile || "Vehicle"; }
  displayName() { const reg = this.registryEntry(); return reg?.display_name || this.config.fallback_name || "Vehicle"; }
  imageFromProfile() { const reg = this.registryEntry() || {}; return this.rt.visualImageUrl(reg, "vehicle", "hero", "vehicle_fallback"); }
  chargerImage(assetId="") {
    const reg = assetId ? (this.rt.chargerById(assetId) || this.rt.assetById(assetId) || { asset_id: assetId }) : {};
    const prop = assetId ? this.rt.propertyByCompoundKey(assetId, "charger.image_key") : null;
    const raw = prop?.value ?? this.rt.visualImageKey(reg, "image") ?? reg?.image_key ?? "";
    const visual = typeof rhiMobilityResolveChargerVisual === "function" ? rhiMobilityResolveChargerVisual(reg, raw) : null;
    return visual?.appearance?.package_file || this.rt.visualImageUrl(reg, "charger", "image", "charger_fallback");
  }

  chargerAssignmentModel() {
    const assetId = this.assetId();
    const prop = this.rt.propertyByCompoundKey(assetId, "vehicle.selected_charger");
    if (!prop) {
      return { resolved:false, property:null, writable:false, display:"N/A", value:"", editor_value:"", choices:[], allow_none:false, none_value:"" };
    }
    const editor = this.rt.propertyEditorRow(prop);
    const allowNone = editor.allow_none === true;
    const noneValue = editor.none_value ?? "";
    const rawCurrent = prop.value;
    const currentUnset = rawCurrent === undefined || rawCurrent === null || String(rawCurrent).trim() === "" || (allowNone && String(rawCurrent).trim() === String(noneValue ?? ""));
    const currentValue = currentUnset && allowNone ? String(noneValue ?? "") : String(rawCurrent ?? "").trim();
    const choices = [];
    if (allowNone) choices.push({ value:String(noneValue ?? ""), label:"No charger", is_none:true });
    for (const choice of (editor.choices || [])) {
      const value = String(choice?.value ?? choice?.id ?? choice?.asset_id ?? choice ?? "").trim();
      const label = String(choice?.label ?? choice?.display_name ?? choice?.name ?? (value ? this.rt.chargerLabel(value) : "")).trim();
      if (!value || choices.some((row)=>row.value === value)) continue;
      choices.push({ value, label:label || value, is_none:false });
    }
    const currentKnown = choices.some((choice)=>choice.value === String(editor.editor_value ?? currentValue));
    const display = currentUnset
      ? (allowNone ? "No charger" : "N/A")
      : (this.rt.chargerLabel(String(rawCurrent).trim()) || String(rawCurrent).trim());
    return {
      resolved:true,
      property:prop,
      writable:!editor.disabled && choices.length > 0,
      display,
      value:String(rawCurrent ?? "").trim(),
      editor_value:String(editor.editor_value ?? currentValue),
      choices,
      current_known:currentKnown,
      allow_none:allowNone,
      none_value:String(noneValue ?? "")
    };
  }

  latestActivityRows(assetId) {
    const activities = this.rt.activityRowsFor(assetId).slice(0, 3);
    const valueFor = (a) => String(a.result || a.result_code || a.activity_state || a.status || a.message || a.activity_type || a.command_key || a.command_id || "Unavailable");
    const labels = ["Latest activity", "Previous activity", "Earlier activity"];
    if (!activities.length) return [{ type:"readonly", icon:"mdi:history", label:"Latest activity", value:"Unavailable" }];
    return activities.map((a, index)=>({ type:"readonly", icon:index === 0 ? "mdi:history" : "mdi:history-clock", label:labels[index] || `Activity ${index+1}`, value:valueFor(a) }));
  }

  build() {
    const id = this.id;
    const assetId = this.assetId();
    const reg = this.registryEntry() || { asset_id: assetId };
    const lifecycleState = this.rt.lifecycleStatus(reg);
    const lifecycle = lifecycleState === "active" ? "Active" : lifecycleState === "disabled" ? "Disabled" : lifecycleState === "retired" ? "Retired" : "Contract gap";
    const present = lifecycleState === "active";
    const profile = this.profile();
    const display = this.displayName();

    const relationship = this.rt.vehicleChargerRelationship(assetId);
    const isReal = (value) => {
      const v = String(value || "").trim();
      return !!v && !["none", "unknown", "unavailable", "null", "undefined", "—"].includes(v.toLowerCase());
    };
    const physicalChargerId = isReal(relationship.connected) ? this.rt.canonicalAssetId(relationship.connected) : "";
    const effectiveChargerId = isReal(relationship.effective) ? this.rt.canonicalAssetId(relationship.effective) : "";
    // Hero navigation may show the effective charger when no physical charger is
    // connected, but this never changes the physical connection semantics.
    const chargerContextId = physicalChargerId || effectiveChargerId;
    const chargerEntry = chargerContextId ? (this.rt.chargerById(chargerContextId) || this.rt.assetById(chargerContextId)) : null;
    const chargerDisplay = chargerEntry?.display_name
      || (physicalChargerId ? relationship.connected_display_name : relationship.effective_display_name)
      || chargerContextId || "Not available";
    const chargerDetailRoute = chargerContextId ? this.rt.assetDetailRoute(chargerEntry || chargerContextId) : "";

    const profileImage = this.imageFromProfile();
    const imageKeyProp = this.rt.propertyByCompoundKey(assetId, "vehicle.image_key");
    const imageKey = imageKeyProp?.value ?? this.rt.visualImageKey(reg, "image") ?? reg?.image_key ?? "";
    const visual = typeof rhiMobilityParseVehicleVisualKey === "function" ? rhiMobilityParseVehicleVisualKey(imageKey) : null;
    // UX owns rendering. A resolved verified catalog key must drive both the
    // actual model artwork and its colour treatment. Profile/source artwork is
    // only the deterministic fallback when the persisted key is legacy/unknown.
    const visualPackageFile = visual?.vehicle?.selectable !== false && visual?.vehicle?.visual_quality !== "fallback_only"
      ? String(visual?.vehicle?.package_file || "")
      : "";
    const img = visualPackageFile || profileImage;
    const imageFilter = visual?.color?.filter || "none";
    const actions = this.rt.commandActionsFor(assetId, "quick_actions").map((cmd, index) => ({
      label: cmd.label || this.rt.titleize(cmd.command_id || cmd.command_key),
      icon: this.rt.commandIcon(cmd), entity: cmd.intent_entity, command: cmd,
      primary: index === 0, hide: cmd.frontend_allowed === false
    }));
    const componentSections = this.rt.addRelatedAssetDetailLinks(
      this.rt.vehicleComponentDetailSections(assetId),
      { chargerDetailRoute, chargerDisplay }
    );

    const experience = this.rt.vehicleExperienceV2(assetId);
    const v2Relationship = experience?.charging_relationship || this.rt.vehicleRelationshipV2(assetId) || {};
    const rangeIntel = experience?.range_intelligence || {};
    const chargingIntel = experience?.charging_intelligence || {};
    const securityIntel = experience?.security_intelligence || {};
    const maintenanceIntel = experience?.maintenance_intelligence || {};

    const toneFor = (state, actionable = []) => actionable.includes(String(state || "").toLowerCase()) ? "attention" : "neutral";
    const rangeTile = {
      label:"Range",
      value:String(rangeIntel.summary || "Unavailable"),
      subvalue:String(rangeIntel.reason || "Range conclusion unavailable"),
      icon:"mdi:road-variant",
      tone:toneFor(rangeIntel.state, ["low"])
    };

    const configuredId = String(v2Relationship.configured_charger_id || "");
    const physicalId = v2Relationship.observed_identity_proven === true
      ? String(v2Relationship.physically_connected_charger_id || "")
      : "";
    const chargingChargerId = physicalId || configuredId;
    const chargingChargerEntry = chargingChargerId ? (this.rt.chargerById(chargingChargerId) || this.rt.assetById(chargingChargerId)) : null;
    const chargingChargerLabel = chargingChargerEntry?.display_name || (chargingChargerId ? this.rt.chargerLabel(chargingChargerId) : "");
    const chargingDetailRoute = chargingChargerId ? this.rt.assetDetailRoute(chargingChargerEntry || chargingChargerId) : "";
    const chargingTile = {
      label:"Charging",
      value:physicalId
        ? (chargingChargerLabel || "Connected")
        : (configuredId ? (chargingChargerLabel || "Assigned charger") : "No charger"),
      subvalue:physicalId
        ? String(chargingIntel.summary || chargingIntel.reason || "Physical charger confirmed")
        : (configuredId ? "Configured · physical identity not proven" : String(chargingIntel.summary || "No charger assigned")),
      icon:"mdi:ev-station",
      tone:toneFor(chargingIntel.state, ["fault"]),
      detailRoute:chargingDetailRoute,
      detailTitle:chargingChargerLabel ? `Open ${chargingChargerLabel} details` : "Open charger details"
    };

    const securityTile = {
      label:"Security",
      value:String(securityIntel.summary || "Unavailable"),
      subvalue:String(securityIntel.reason || "Security conclusion unavailable"),
      icon:String(securityIntel.state || "").toLowerCase() === "unsafe" ? "mdi:lock-alert-outline" : "mdi:lock-outline",
      tone:toneFor(securityIntel.state, ["unsafe"])
    };

    const maintenanceTile = {
      label:"Maintenance",
      value:String(maintenanceIntel.summary || "Unavailable"),
      subvalue:String(maintenanceIntel.reason || "Maintenance conclusion unavailable"),
      icon:"mdi:wrench-outline",
      tone:toneFor(maintenanceIntel.state, ["overdue","due_soon"])
    };

    const headerStatus = [rangeTile, chargingTile, securityTile, maintenanceTile];

    return {
      type:"vehicle", id, present, display, subtitle:profile, readiness:lifecycle,
      image:this.rt.cache(img), fallbackImage:this.rt.cache(this.rt.assetUrl("vehicles/vehicle_fallback.png")), imageOpacity:present ? 1 : 0.34, imageGray:present ? 0 : 0.25, imageFilter,
      chargerImage:this.rt.cache(this.chargerImage(chargerContextId)), chargerFallbackImage:this.rt.cache(this.rt.assetUrl("chargers/charger_fallback.png")),
      chargerDisplay, chargerDetailRoute,
      backPath:this.config.dashboard_path || "/mobility-supervisor/dashboard", backLabel:this.config.back_label || "← Back to Dashboard", detailRoute:this.rt.detailRoute(reg), lifecycle, registryEntry:reg,
      breadcrumb:["Home", "Vehicles", display],
      status:headerStatus,
      actions,
      sections:[this.rt.lifecycleContractGapSection(assetId)].filter(Boolean).concat(componentSections).concat([
        { key:"activity", title:"Recent Activity", icon:"mdi:history", header:"Activity contract", rows:this.latestActivityRows(assetId), details:[] }
      ])
    };
  }
}
