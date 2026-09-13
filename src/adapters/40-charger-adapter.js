// 40-charger-adapter.js
// Charger view-model adapter mapping public contracts to charger card data.

class HomeBrainChargerAdapter {
  constructor(rt, chargerId, config) { this.rt = rt; this.id = chargerId; this.config = config; }
  assetId() { return String(this.id || "").startsWith("charger_") ? String(this.id) : `charger_${this.id}`; }
  registryEntry() { return this.config.registry_entry || this.rt.chargerById(this.assetId()) || this.rt.assetById(this.assetId()) || null; }
  commandExists(commandId) { return this.rt.commandExists(this.assetId(), commandId) !== false; }
  displayName() { const reg = this.registryEntry(); return reg?.display_name || this.config.fallback_name || this.rt.titleize(this.assetId()); }
  chargerImageFromId() { const reg = this.registryEntry(); return this.rt.visualImageUrl(reg, "charger", "image", "charger_fallback"); }
  profile() { const reg = this.registryEntry(); return reg?.profile_display_name || reg?.profile || this.config.fallback_profile || "Charger"; }
  status() { return this.rt.chargerOperationalStatus(this.assetId()); }
  can(capability) { return this.commandExists(capability); }
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
    const iconMap = { driveway_left:"mdi:ev-station", driveway_right:"mdi:ev-station", sideway:"mdi:ev-plug-type2", utility_plug:"mdi:power-socket-eu" };
    const ctlByField = (field, label, icon, opts = {}) => { const entity = this.rt.controlEntity(assetId, field, ""); return entity ? { type:"control", entity, label, icon, ...opts } : { type:"readonly", icon, label, value: opts.fallback || "Not available" }; };
    return {
      type:"charger", id, present:available, display:name, subtitle:profile, readiness:status, iconHero:iconMap[id] || "mdi:ev-station",
      image:this.rt.cache(this.chargerImageFromId()), fallbackImage:this.rt.cache(this.rt.assetUrl("chargers/charger_fallback.png")), imageOpacity:available ? 1 : 0.34, imageGray:available ? 0 : 0.25,
      backPath:this.config.dashboard_path || "/mobility-supervisor/dashboard", backLabel:this.config.back_label || "← Back to Dashboard", detailRoute:this.rt.detailRoute(reg), lifecycle, registryEntry:reg, breadcrumb:["Home","Chargers",name],
      status:this.rt.chargerCanonicalStatusTiles(assetId, { detailRoute: physicalVehicle.detailRoute, detailTitle: physicalVehicle.displayName ? `Open ${physicalVehicle.displayName} details` : "Open vehicle details" }),
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
