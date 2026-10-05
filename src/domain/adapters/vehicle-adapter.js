// 30-vehicle-adapter.js
// Vehicle view-model adapter. Canonical V2 runtime/experience/configuration is the sole product authority; presentation remains fail-closed.
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

  productProjection() {
    const assetId = this.assetId();
    const reg = this.registryEntry() || { asset_id: assetId };
    const experience = this.rt.vehicleExperienceV2(assetId) || {};
    const v2Relationship = this.rt.vehicleRelationshipV2(assetId) || {};

    const realId = (value) => {
      const raw = String(value || "").trim();
      return raw && !["none","unknown","unavailable","null","undefined","—"].includes(raw.toLowerCase())
        ? this.rt.canonicalAssetId(raw)
        : "";
    };
    const configuredId = realId(v2Relationship.configured_charger_id);
    const effectiveId = realId(v2Relationship.effective_charger_id || configuredId);
    const physicalId = v2Relationship.observed_identity_proven === true
      ? realId(v2Relationship.physically_connected_charger_id)
      : "";
    const relationshipId = physicalId || effectiveId || configuredId;
    const chargerEntry = relationshipId ? (this.rt.chargerById(relationshipId) || this.rt.assetById(relationshipId)) : null;
    const chargerDisplay = chargerEntry?.display_name || (relationshipId ? this.rt.chargerLabel(relationshipId) : "");

    const signal = (intel = {}, label, icon, attentionStates = []) => {
      const state = String(intel?.state || "").toLowerCase();
      const summary = String(intel?.summary || "Unavailable");
      const rawReason = String(intel?.reason || "").trim();
      const reason = /^[a-z0-9]+(?:[_.:-][a-z0-9]+)+$/i.test(rawReason) ? "" : rawReason;
      return {
        resolved: !!intel && Object.keys(intel).length > 0 && !["unknown","unavailable"].includes(state),
        value: summary,
        display: summary,
        unit: "",
        state: state || "unknown",
        reason,
        source: "MOBILITY_EXPERIENCE_V2",
        label,
        icon,
        tone: attentionStates.includes(state) ? "attention" : "neutral"
      };
    };

    const range = signal(experience.range_intelligence, "Range", "mdi:road-variant", ["low"]);
    const energy = signal(experience.energy_intelligence, "Energy", "mdi:battery-charging", ["attention","low"]);
    const security = signal(experience.security_intelligence, "Security", "mdi:lock-outline", ["unsafe"]);
    const comfort = signal(experience.comfort_intelligence, "Comfort", "mdi:fan", ["attention","degraded"]);
    const maintenance = signal(experience.maintenance_intelligence, "Maintenance", "mdi:wrench-outline", ["overdue","due_soon"]);
    const chargingIntel = experience.charging_intelligence || {};
    const charging = signal(chargingIntel, "Charging", "mdi:ev-station", ["fault","blocked"]);
    charging.value = charging.display = physicalId
      ? (chargerDisplay || "Connected")
      : (configuredId ? (chargerDisplay || "Assigned charger") : String(chargingIntel.summary || "No charger"));
    charging.reason = physicalId
      ? String(chargingIntel.summary || "Connected charger")
      : (configuredId ? "Assigned charger" : String(charging.reason || chargingIntel.summary || "No charger assigned"));
    charging.detailRoute = relationshipId ? this.rt.assetDetailRoute(chargerEntry || relationshipId) : "";
    charging.detailTitle = chargerDisplay ? `Open ${chargerDisplay} details` : "Open charger details";

    const configuration = String(experience?.configuration_status?.state || "").toLowerCase();
    const dataHealth = String(experience?.runtime_data_health?.state || "").toLowerCase();
    const demand = String(experience?.charge_demand?.state || "").toLowerCase();
    const attentionRequired = configuration === "incomplete"
      || ["partial","stale","unavailable"].includes(dataHealth)
      || range.state === "low"
      || security.state === "unsafe"
      || ["overdue","due_soon"].includes(maintenance.state)
      || demand === "needed";

    const profileProperty = this.rt.semanticProperty(assetId, "asset.profile_id");
    const profileId = String(profileProperty?.value ?? "").trim();
    // Charging execution belongs to the charger, not the vehicle. A vehicle card may
    // present the configured/effective/physical charger's charging commands as a
    // convenience, but the command keeps its charger asset_id and backend readiness.
    // This must never be used as evidence that the charger is physically connected
    // to this specific vehicle; power attribution still requires observed identity.
    const vehicleCommands = this.rt.commandActionsFor(assetId, "quick_actions");
    const chargingCommandKeys = new Set([
      "charger.command.start",
      "charger.command.start_charging",
      "charger.command.stop",
      "charger.command.stop_charging"
    ]);
    const chargerCommands = relationshipId
      ? this.rt.commandActionsFor(relationshipId, "quick_actions")
          .filter((command) => chargingCommandKeys.has(String(command?.command_key || "")))
      : [];
    const semanticCommandRole = (command) => {
      const key = String(command?.command_key || command?.command_id || "").toLowerCase();
      if (key === "charger.command.start" || key === "charger.command.start_charging") return "charging:start";
      if (key === "charger.command.stop" || key === "charger.command.stop_charging") return "charging:stop";
      return key;
    };
    const commandPreference = (command) => {
      const key = String(command?.command_key || command?.command_id || "").toLowerCase();
      if (key === "charger.command.start" || key === "charger.command.stop") return 0;
      if (key === "charger.command.start_charging" || key === "charger.command.stop_charging") return 1;
      return 0;
    };
    const commands = [...chargerCommands, ...vehicleCommands]
      .sort((a,b) => commandPreference(a) - commandPreference(b))
      .filter((command, index, rows) => {
        const executor = String(command?.physical_executor_asset_id || command?.asset_id || "");
        const role = semanticCommandRole(command);
        const key = `${executor}::${role}`;
        return rows.findIndex((candidate) => {
          const candidateExecutor = String(candidate?.physical_executor_asset_id || candidate?.asset_id || "");
          return `${candidateExecutor}::${semanticCommandRole(candidate)}` === key;
        }) === index;
      });
    return {
      identity: {
        asset_id: assetId,
        display_name: this.displayName(),
        profile: this.profile(),
        source: "MOBILITY_PUBLIC_RUNTIME_V2"
      },
      lifecycle: {
        state: this.rt.lifecycleStatus(reg),
        source: "MOBILITY_PUBLIC_RUNTIME_V2"
      },
      facts: {
        overview_metrics: this.rt.vehicleOverviewMetricSlots(assetId),
        live_charging: this.rt.liveChargingContextForVehicle(assetId),
        ready_by: this.rt.semanticProperty(assetId, "vehicle.ready_by") || null,
        climate_state: this.rt.semanticProperty(assetId, "vehicle.climate_state") || null
      },
      configuration: {
        profile_id: profileId,
        profile_resolved: !!profileProperty,
        selected_charger: this.chargerAssignmentModel(),
        charge_power_control: this.rt.vehicleChargePowerControl(assetId),
        charge_power_control_model: this.rt.vehicleChargePowerControlModel(assetId)
      },
      signals: { range, energy, security, comfort, maintenance, charging },
      relationships: {
        configured_charger_id: configuredId,
        effective_charger_id: effectiveId,
        physically_connected_charger_id: physicalId,
        charger_id: relationshipId,
        charger_display_name: chargerDisplay,
        identity_proven: !!physicalId,
        source: "MOBILITY_PUBLIC_RUNTIME_V2"
      },
      commands,
      attention_required: attentionRequired,
      experience,
      source_contracts: ["MOBILITY_PUBLIC_RUNTIME_V2", "MOBILITY_EXPERIENCE_V2", "MOBILITY_COMMAND_V2"]
    };
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

    const projection = this.productProjection();
    const physicalChargerId = String(projection.relationships.physically_connected_charger_id || "");
    const effectiveChargerId = String(projection.relationships.effective_charger_id || "");
    const chargerContextId = physicalChargerId || effectiveChargerId || String(projection.relationships.configured_charger_id || "");
    const chargerEntry = chargerContextId ? (this.rt.chargerById(chargerContextId) || this.rt.assetById(chargerContextId)) : null;
    const chargerDisplay = String(projection.relationships.charger_display_name || chargerEntry?.display_name || chargerContextId || "Not available");
    const chargerDetailRoute = chargerContextId ? this.rt.assetDetailRoute(chargerEntry || chargerContextId) : "";

    const profileImage = this.imageFromProfile();
    const imageKeyProp = this.rt.propertyByCompoundKey(assetId, "vehicle.image_key");
    const imageKey = imageKeyProp?.value ?? this.rt.visualImageKey(reg, "image") ?? reg?.image_key ?? "";
    const visual = typeof rhiMobilityParseVehicleVisualKey === "function" ? rhiMobilityParseVehicleVisualKey(imageKey) : null;
    const profileId = String(this.rt.semanticProperty(assetId, "asset.profile_id")?.value ?? reg?.profile_id ?? reg?.raw?.profile_id ?? "").trim();
    const profileVisual = typeof rhiMobilityVehicleVisualForProfile === "function" ? rhiMobilityVehicleVisualForProfile(profileId) : null;
    // Persisted appearance may refine colour only inside the backend profile-owned
    // vehicle family. A stale cross-model key must never outrank canonical identity.
    const visualMatchesProfile = !profileVisual || visual?.vehicle?.id === profileVisual.id;
    const visualPackageFile = visualMatchesProfile && visual?.vehicle?.selectable !== false && visual?.vehicle?.visual_quality !== "fallback_only"
      ? String(visual?.vehicle?.package_file || "")
      : "";
    const canonicalProfilePackage = String(profileVisual?.package_file || "");
    const img = visualPackageFile || canonicalProfilePackage || profileImage;
    const imageFilter = visualMatchesProfile ? (visual?.color?.filter || "none") : "none";
    const actions = projection.commands.map((cmd, index) => ({
      label: cmd.label || this.rt.titleize(cmd.command_id || cmd.command_key),
      icon: this.rt.commandIcon(cmd), entity: cmd.intent_entity, command: cmd,
      primary: index === 0, hide: cmd.frontend_allowed === false
    }));
    const componentSections = this.rt.addRelatedAssetDetailLinks(
      this.rt.vehicleComponentDetailSections(assetId),
      { chargerDetailRoute, chargerDisplay }
    );

    const rangeTile = projection.signals.range;
    const chargingTile = projection.signals.charging;
    const securityTile = projection.signals.security;
    const comfortTile = projection.signals.comfort;
    const maintenanceTile = projection.signals.maintenance;
    const headerStatus = [rangeTile, chargingTile, securityTile, comfortTile, maintenanceTile];

    return {
      type:"vehicle", id, present, display, subtitle:profile, readiness:lifecycle,
      image:this.rt.cache(img), fallbackImage:this.rt.cache(this.rt.assetUrl("vehicles/vehicle_fallback.png")), imageOpacity:present ? 1 : 0.34, imageGray:present ? 0 : 0.25, imageFilter,
      chargerImage:this.rt.cache(this.chargerImage(chargerContextId)), chargerFallbackImage:this.rt.cache(this.rt.assetUrl("chargers/charger_fallback.png")),
      chargerDisplay, chargerDetailRoute,
      projection,
      backPath:this.config.dashboard_path || hbMobilityPath("/dashboard"), backLabel:this.config.back_label || "← Back to Dashboard", detailRoute:this.rt.detailRoute(reg), lifecycle, registryEntry:reg,
      breadcrumb:["Home", "Vehicles", display],
      status:headerStatus,
      actions,
      sections:[this.rt.lifecycleContractGapSection(assetId)].filter(Boolean).concat(componentSections).concat([
        { key:"activity", title:"Recent Activity", icon:"mdi:history", header:"Activity contract", rows:this.latestActivityRows(assetId), details:[] }
      ])
    };
  }
}
