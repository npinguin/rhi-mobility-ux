// 40-charger-adapter.js
// Charger view-model adapter mapping public contracts to charger card data.

class HomeBrainChargerAdapter {
  constructor(rt, chargerId, config) { this.rt = rt; this.id = chargerId; this.config = config; }
  assetId() { return String(this.id || "").startsWith("charger_") ? String(this.id) : `charger_${this.id}`; }
  registryEntry() { return this.config.registry_entry || this.rt.chargerById(this.assetId()) || this.rt.assetById(this.assetId()) || null; }
  commandExists(commandId) { return this.rt.commandExists(this.assetId(), commandId) !== false; }
  displayName() { const reg = this.registryEntry(); return reg?.display_name || this.config.fallback_name || this.rt.titleize(this.assetId()); }
  chargerVisual() {
    const reg = this.registryEntry() || {};
    const prop = this.rt.propertyByCompoundKey(this.assetId(), "charger.image_key");
    const raw = prop?.value ?? this.rt.visualImageKey(reg, "image") ?? reg?.image_key ?? "";
    return typeof rhiMobilityResolveChargerVisual === "function"
      ? rhiMobilityResolveChargerVisual(reg.asset_id ? reg : { ...reg, asset_id:this.assetId() }, raw)
      : null;
  }
  chargerImageFromId() {
    const reg = this.registryEntry() || { asset_id:this.assetId() };
    const visual = this.chargerVisual();
    const packageFile = String(visual?.appearance?.package_file || "");
    return packageFile || this.rt.visualImageUrl(reg, "charger", "image", "charger_fallback");
  }
  profile() { const reg = this.registryEntry(); return reg?.profile_display_name || reg?.profile || this.config.fallback_profile || "Charger"; }
  status() { return this.rt.chargerOperationalStatus(this.assetId()); }
  can(capability) { return this.commandExists(capability); }
  overviewAvailability() {
    const assetId = this.assetId();
    const lifecycle = this.rt.lifecycleStatus(this.registryEntry() || assetId);
    if (lifecycle === "disabled") return { bucket:"disabled", resolved:true, label:"Disabled" };
    if (lifecycle !== "active") return { bucket:"unknown", resolved:false, label:"N/A" };

    const snapshot = this.rt.chargerProductSnapshot(assetId);
    const operatingResolved = !!snapshot?.operating?.resolved;
    const operating = operatingResolved ? String(snapshot.operating.value || "").trim().toLowerCase() : "";
    if (operating === "fault") return { bucket:"unavailable", resolved:true, label:"Unavailable" };

    // "Free" is an occupancy statement, not a charging-power statement.
    // An idle/stopped charger may still have a vehicle physically connected.
    const connectionResolved = !!snapshot?.connection?.resolved;
    const connection = connectionResolved ? String(snapshot.connection.value || "").trim().toLowerCase() : "";
    const physicallyConnected = !!snapshot?.connected_vehicle?.resolved
      || ["connected", "asset_connected"].includes(connection);
    const physicallyDisconnected = ["disconnected", "no_asset_connected"].includes(connection);

    if (physicallyConnected) return { bucket:"in_use", resolved:true, label:"In use" };
    if (["running", "preparing", "suspended"].includes(operating)) return { bucket:"in_use", resolved:true, label:"In use" };
    if (physicallyDisconnected && ["idle", "stopped"].includes(operating)) {
      return { bucket:"free", resolved:true, label:"Free" };
    }

    // Fail closed: without connection/relationship evidence we cannot call a
    // charger free merely because its power/operating state is idle/stopped.
    return { bucket:"unknown", resolved:false, label:"N/A" };
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
    const available = lifecycleState === "active";
    const name = this.displayName();
    const profile = this.profile();
    const visual = this.chargerVisual();
    const chargerSnapshot = this.rt.chargerProductSnapshot(assetId);
    const status = chargerSnapshot.operating.display;
    const connectionState = chargerSnapshot.connection.display;
    const assignedVehicle = chargerSnapshot.connected_vehicle.display;
    const physicalVehicle = this.rt.physicalVehicleForCharger(assetId);
    const relatedVehicle = this.rt.relatedVehicleForCharger(assetId);
    const power = chargerSnapshot.power.display;
    const sessionEnergy = this.rt.canonicalChargerPropertyDisplay(assetId, "charger.session_energy_kwh", "—");
    const currentLimit = this.rt.canonicalChargerPropertyDisplay(assetId, "charger.current_limit_a", "—");
    const connector = connectionState;
    const limitSource = "sensor.mobility_charger_property_index";
    const phases = "—";
    const voltage = "—";
    const current = this.rt.canonicalChargerPropertyDisplay(assetId, "charger.actual_current_a", "—");
    const dataFreshness = "—";
    const trust = "—";
    const health = chargerSnapshot.health.display;
    const operatingRaw = chargerSnapshot.operating.resolved ? String(chargerSnapshot.operating.value || "").toLowerCase() : "";
    const connectionRaw = chargerSnapshot.connection.resolved ? String(chargerSnapshot.connection.value || "").toLowerCase() : "";
    const faulted = operatingRaw === "fault";
    const stateTile = {
      label:"State",
      value:chargerSnapshot.operating.display,
      subvalue:chargerSnapshot.connection.resolved ? chargerSnapshot.connection.display : "Connection unknown",
      icon:"mdi:ev-station",
      tone:faulted ? "attention" : "neutral"
    };
    const powerTile = {
      label:"Power",
      value:chargerSnapshot.power.display,
      subvalue:chargerSnapshot.power.resolved ? (operatingRaw === "running" ? "Charging now" : "Current charger load") : "Power unavailable",
      icon:"mdi:flash",
      tone:faulted ? "attention" : "neutral"
    };
    const vehicleTile = {
      label:"Vehicle",
      value:chargerSnapshot.connected_vehicle.resolved ? chargerSnapshot.connected_vehicle.display : "No vehicle identified",
      subvalue:chargerSnapshot.connected_vehicle.resolved ? "Physical relationship" : (["connected","asset_connected"].includes(connectionRaw) ? "Connected vehicle not identified" : "No physical vehicle relationship"),
      icon:"mdi:car-electric",
      tone:"neutral",
      detailRoute:chargerSnapshot.connected_vehicle.resolved ? physicalVehicle.detailRoute : "",
      detailTitle:physicalVehicle.displayName ? `Open ${physicalVehicle.displayName} details` : "Open vehicle details"
    };
    const headerStatus = [stateTile, powerTile, vehicleTile];
    if (chargerSnapshot.health.resolved && String(chargerSnapshot.health.display || "").toLowerCase() !== "ok") {
      headerStatus.push({
        label:"Issue",
        value:chargerSnapshot.health.display,
        subvalue:chargerSnapshot.health.reason || "Review charger health",
        icon:"mdi:alert-circle-outline",
        tone:"attention"
      });
    }
    const iconMap = { driveway_left:"mdi:ev-station", driveway_right:"mdi:ev-station", sideway:"mdi:ev-plug-type2", utility_plug:"mdi:power-socket-eu" };
    const ctlByField = (field, label, icon, opts = {}) => { const entity = this.rt.controlEntity(assetId, field, ""); return entity ? { type:"control", entity, label, icon, ...opts } : { type:"readonly", icon, label, value: opts.fallback || "Not available" }; };
    return {
      type:"charger", id, present:available, display:name, subtitle:profile, readiness:status, iconHero:iconMap[id] || "mdi:ev-station",
      image:this.rt.cache(this.chargerImageFromId()), fallbackImage:this.rt.cache(this.rt.assetUrl("chargers/charger_fallback.png")), imageOpacity:available ? 1 : 0.34, imageGray:available ? 0 : 0.25,
      visualKey:visual?.key || "", visualProduct:visual?.charger || null, visualAppearance:visual?.appearance || null,
      backPath:this.config.dashboard_path || "/mobility-supervisor/dashboard", backLabel:this.config.back_label || "← Back to Dashboard", detailRoute:this.rt.detailRoute(reg), lifecycle, registryEntry:reg, breadcrumb:["Home","Chargers",name],
      status:headerStatus,
      actions:this.rt.commandActionsFor(assetId, "quick_actions").map((cmd,index)=>({ label:cmd.label || this.rt.titleize(cmd.command_id || cmd.command_key), icon:this.rt.commandIcon(cmd), entity:cmd.intent_entity, command:cmd, primary:index === 0, hide:cmd.frontend_allowed === false })),
      // R22.12.11.24: charger detail sections come from the charger component contract.
      // UX must not infer charger layout from flat property family/group names.
      sections:[this.rt.lifecycleContractGapSection(assetId)].filter(Boolean).concat(
        this.rt.addRelatedAssetDetailLinks(this.rt.chargerComponentDetailSections(assetId), { vehicleDetailRoute: relatedVehicle.detailRoute, vehicleDisplay: relatedVehicle.displayName })
      ).concat([
        { key:"activity", title:"Recent Activity", icon:"mdi:history", header:"Activity contract", rows:this.latestActivityRows(assetId), details:[] }
      ])
    };
  }
}
