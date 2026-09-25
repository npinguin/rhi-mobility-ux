// Single-card Mobility bootstrap shell.
// Existing individual Mobility custom cards remain registered and supported.
class HomeBrainMobilityCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.config = {};
    this._hass = null;
    this._locationHandler = () => this.render();
  }

  setConfig(config = {}) {
    this.config = { default_view:"overview", ...(config || {}) };
    this.render();
  }

  connectedCallback() {
    window.addEventListener("location-changed", this._locationHandler);
  }

  disconnectedCallback() {
    window.removeEventListener("location-changed", this._locationHandler);
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  currentView() {
    try {
      const url = new URL(window.location.href);
      const value = String(url.searchParams.get("mobility_view") || this.config.default_view || "overview").toLowerCase();
      return ["overview","vehicles","chargers","planning","strategies","history","log","detail"].includes(value) ? value : "overview";
    } catch (e) {
      return String(this.config.default_view || "overview").toLowerCase();
    }
  }

  childSpec(view) {
    if (view === "overview" || view === "vehicles") return {
      tag:"homebrain-mobility-dashboard-card",
      config:{ nav_active:view }
    };
    if (view === "chargers") return {
      tag:"homebrain-mobility-charger-maintenance-card",
      config:{ nav_active:"chargers" }
    };
    if (["planning","strategies","history","log"].includes(view)) return {
      tag:"homebrain-mobility-placeholder-card",
      config:{ view }
    };
    return {
      tag:"homebrain-mobility-asset-detail-card",
      config:{}
    };
  }

  render() {
    if (!this.shadowRoot || !this._hass) return;
    const view = this.currentView();
    const spec = this.childSpec(view);
    const basePath = String(this.config.bootstrap_path || window.location?.pathname || "/mobility-supervisor/overview");
    const childConfig = {
      ...this.config,
      ...spec.config,
      bootstrap_mode:true,
      bootstrap_path:basePath,
      dashboard_path:`${basePath}?mobility_view=vehicles`
    };
    delete childConfig.type;
    delete childConfig.default_view;

    this.shadowRoot.innerHTML = `<div id="mobility-bootstrap"></div><style>:host{display:block}#mobility-bootstrap{display:block;min-width:0}</style>`;
    const mount = this.shadowRoot.getElementById("mobility-bootstrap");
    const child = document.createElement(spec.tag);
    child.setConfig?.(childConfig);
    mount.appendChild(child);
    child.hass = this._hass;
  }

  getCardSize() { return 12; }
}

if (!customElements.get("homebrain-mobility-card")) {
  customElements.define("homebrain-mobility-card", HomeBrainMobilityCard);
}
window.customCards = window.customCards || [];
window.customCards.push({
  type:"homebrain-mobility-card",
  name:"Robotix Home Intelligence Mobility",
  description:"Single-card Mobility bootstrap with internal navigation; legacy multi-view cards remain supported."
});
