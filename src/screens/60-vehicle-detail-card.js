// 60-vehicle-detail-card.js
// Vehicle detail custom card registration.

class HomeBrainVehicleAssetDetailCard extends HTMLElement {
  setConfig(config) {
    this.config = {
      fallback_name: "Vehicle",
      fallback_profile: "Vehicle",
      fallback_image: rhiMobilityAssetUrl("vehicles/default_vehicle.png"),
      image_base: "",
      dashboard_path: "/mobility-supervisor/dashboard",
      resource_version: UX_VERSION,
      ...config
    };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._lastSignature = "";
  }

  set hass(hass) {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    const id = this.config.vehicle_id;
    const sig = [
      rt.runtimeSignature(id),
      JSON.stringify(rt.propertyRows(id)),
      JSON.stringify(rt.relationshipRows(id)),
      JSON.stringify(rt.commandsFor(id)),
      JSON.stringify(rt.activityRowsFor(id)),
      JSON.stringify(rt.intelligenceRowsFor(id))
    ].join("|");
    if (sig !== this._lastSignature) {
      this._lastSignature = sig;
      const model = new HomeBrainVehicleAdapter(rt, id, this.config).build();
      new HomeBrainAssetShell(this.shadowRoot, rt).render(model);
    }
  }
  getCardSize() { return 12; }
}
