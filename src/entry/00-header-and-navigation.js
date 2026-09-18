// 00-header-and-navigation.js
// Constants, navigation shell helpers and shared shell styles.

/**
 * Home Brain Mobility Assets Bundle
 * Release: v1.0.0-rc.1_HACS_MIGRATION_BASELINE
 *
 * Purpose:
 * - Provides the bundled frontend custom elements for the Mobility domain.
 * - Keeps the YAML thin: dashboard pages mount custom cards, while this bundle owns registry parsing,
 *   asset grouping, route generation, detail rendering, empty states and safe action rendering.
 *
 * Architecture boundaries:
 * - Backend owns consumer-facing public indexes. The frontend consumes them only through HomeBrainAssetRuntime; asset registry and reverse relationship matching are forbidden for dashboard runtime rendering.
 * - Frontend owns presentation and generated navigation only. It must not require detail_route in backend.
 * - Command placement comes from command-slot contracts; readiness/execution metadata comes from the canonical Command Index; execution uses the canonical Mobility command ingress.
 *
 * R22.12.11.30 charger contract materialization closure:
 * - Uses one shared charger product snapshot for overview and detail: operating_state, connection_state, power_kw, health/health_reason and physical connected vehicle.
 * - Consumes only R43.2.54 charger_actions.commands / vehicle_actions.commands for normal command placement and preserves backend order.
 * - Renders every frontend-allowed backend-placed command exactly once on desktop and mobile; responsive CSS may wrap but never suppress actions.
 * - Uses mobility_command_index exclusively for readiness, blocked reason and invoke metadata; no status/power/capability-derived readiness.
 * - Removes product lifecycle fallback to deprecated aggregate runtime publications; missing lifecycle is a contract gap.
 * - Removes frontend kW↔A/phase synchronization and secondary writes; editable properties write only their own backend-owned property binding.
 * - Centralizes property writes in HomeBrainAssetRuntime instead of constructing service payloads in cards.
 * - Keeps runtime health separate from physical/release acceptance in the release footer.
 * - HACS migration baseline: single self-contained rhi-mobility-ux.js; no /local runtime dependency
 */
/*
Robotix Home Intelligence Mobility UX v1.0.0-rc.1

Defines:
- custom:homebrain-vehicle-asset-detail-card
- custom:homebrain-charger-asset-detail-card

Internal structure:
- HomeBrainAssetRuntime: shared HA/entity helpers
- HomeBrainAssetShell: generic asset detail shell
- HomeBrainVehicleAdapter: vehicle contract mapping
- HomeBrainChargerAdapter: charger contract mapping
*/

const UX_VERSION = "1.0.0-rc.2";

const HB_MOBILITY_BASE_PATH = "/mobility-supervisor";
const HB_MOBILITY_TABS = [
  { key: "vehicle", label: "Vehicles", path: "/dashboard", icon: "mdi:car-electric" },
  { key: "charging", label: "Chargers", path: "/charger-maintenance", icon: "mdi:ev-station" }
];
function hbMobilityPath(path) {
  return `${HB_MOBILITY_BASE_PATH}${path}`;
}
function hbMobilityNav(active = "vehicle") {
  return `<div class="domain-tabs-wrap">
    <nav class="domain-tabs" aria-label="Mobility navigation">
      ${HB_MOBILITY_TABS.map((tab) => `<button type="button" class="domain-tab ${tab.key === active ? "active" : ""}" data-nav="${hbMobilityPath(tab.path)}" title="${tab.label}"><ha-icon icon="${tab.icon}"></ha-icon><span>${tab.label}</span></button>`).join("")}
    </nav>
    <style>${hbMobilitySharedShellStyles()}</style>
  </div>`;
}
function hbMobilityTitleBlock(title = "Mobility", description = "Vehicle readiness, charging, comfort and security in one calm control cockpit.") {
  return `<section class="title"><p class="eyebrow">HOME INTELLIGENCE / MOBILITY</p><h1>${title}</h1><p>${description}</p></section>`;
}
function hbMobilityReleaseFooter(rt) {
  const esc = (v) => rt && rt.escape ? rt.escape(v) : String(v ?? "").replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
  const rel = rt && rt.releaseContract ? rt.releaseContract() : {};
  const backend = rel.backend_release || rel.backend_version || "Unknown";
  const contract = rel.contract_version && rel.contract_version !== "Unknown" ? ` · Contract ${rel.contract_version}` : "";
  const health = rel.contract_health && rel.contract_health !== "Unknown" ? ` · ${rel.contract_health}` : "";
  let runtimeNote = "";
  let acceptanceNote = "";
  let diagnosticsNote = "";
  try {
    const summary = rt && rt.runtimeHealthSummary ? rt.runtimeHealthSummary() : null;
    if (summary) {
      if (summary.status === "OK") runtimeNote = `<span class="hi-release-health trusted" title="Canonical Mobility runtime health is OK.">Runtime healthy</span>`;
      else if (summary.status === "DEGRADED") runtimeNote = `<span class="hi-release-health degraded" title="Canonical Mobility runtime health reports degradation.">Runtime degraded</span>`;
      else if (summary.status === "BLOCKED") runtimeNote = `<span class="hi-release-health blocking" title="Canonical Mobility runtime health reports failure.">Runtime failed</span>`;
      else runtimeNote = `<span class="hi-release-health degraded" title="Canonical Mobility runtime health is unavailable.">Runtime health unavailable</span>`;
      const physical = String(summary.physical_acceptance || "Unknown");
      const releaseAcceptance = String(summary.release_acceptance || "Unknown");
      const pendingPhysical = ["NOT_PROVEN","PENDING","UNKNOWN"].includes(physical.toUpperCase());
      const pendingRelease = ["NOT_PROVEN","PENDING","UNKNOWN"].includes(releaseAcceptance.toUpperCase());
      const parts = [];
      if (pendingPhysical) parts.push("Physical execution proof pending");
      else if (physical && physical !== "Unknown") parts.push(`Physical ${physical}`);
      if (pendingRelease) parts.push("Release acceptance pending");
      else if (releaseAcceptance && releaseAcceptance !== "Unknown") parts.push(`Release ${releaseAcceptance}`);
      if (parts.length) acceptanceNote = `<span class="hi-release-health degraded" title="Runtime health and acceptance proof are separate backend-owned states.">${parts.map(esc).join(" · ")}</span>`;
    }
    if (summary && summary.diagnostic_bad_count) {
      const rows = (summary.diagnostics || []).filter((r) => r.bad).slice(0, 3);
      diagnosticsNote = `<span class="hi-release-health degraded" title="Non-blocking diagnostics only.">Diagnostics: ${esc(summary.diagnostic_status)}${rows.length ? ` — ${rows.map((r)=>`${esc(r.label)} ${esc(r.state)}`).join(", ")}` : ""}</span>`;
    }
  } catch (e) { /* footer must never break the dashboard */ }
  return `<div class="hi-release-footer" title="Backend version is read from the Mobility release contract"><span>UX ${esc(UX_VERSION)}</span><span>Backend ${esc(backend)}</span><span>Source Mobility release contract${esc(contract)}${esc(health)}</span>${runtimeNote}${acceptanceNote}${diagnosticsNote}</div>`;
}

function hbMobilityOutcomeStrip(rt, contextId = "mobility", fallback = {}) {
  const esc = (v) => rt && rt.escape ? rt.escape(v) : String(v ?? "").replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
  const outcome = (field, fb) => (rt && rt.supervisorOutcome ? rt.supervisorOutcome(contextId, field, fb) : fb) || fb;
  const status = outcome("status", fallback.status || "OK");
  const trust = outcome("trust", fallback.trust || (rt && rt.backendVersion ? rt.backendVersion() : "Unknown"));
  const attention = outcome("attention", fallback.attention || "None");
  const opportunity = outcome("opportunity", fallback.opportunity || "None");
  const recommendation = outcome("recommended_action", fallback.recommended_action || "none");
  const items = [
    ["mdi:check-circle-outline", "Status", status, "green"],
    ["mdi:shield-check-outline", "Trust", trust, "blue"],
    ["mdi:alert-circle-outline", "Attention", attention, "orange"],
    ["mdi:lightbulb-outline", "Opportunity", opportunity, "green"],
    ["mdi:arrow-right-circle-outline", "Recommended action", recommendation, "blue"]
  ];
  return `<section class="status-strip dashboard-status-strip outcome-header">
    ${items.map(([icon,label,value,tone]) => `<div class="metric tone-${tone}"><ha-icon icon="${icon}"></ha-icon><div><span>${label}</span><b>${esc(value)}</b></div></div>`).join("")}
  </section>`;
}
function hbMobilitySharedShellStyles() {
  return `
    .domain-tabs-wrap{width:100%;margin:6px 0 8px;box-sizing:border-box;display:block;clear:both}
    .domain-tabs{display:flex;align-items:center;gap:8px;width:100%;min-height:50px;padding:6px;border:1px solid #E3EBF6;border-radius:20px;background:rgba(255,255,255,.96);box-shadow:0 16px 38px rgba(15,35,80,.055);box-sizing:border-box;overflow-x:auto;scrollbar-width:none}
    .domain-tabs::-webkit-scrollbar{display:none}
    .domain-tab{appearance:none;-webkit-appearance:none;border:0;background:transparent;color:#47566E;min-height:38px;padding:0 18px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600;font-size:14px;line-height:1;cursor:pointer;white-space:nowrap;box-shadow:none;box-sizing:border-box;transition:background .15s ease,color .15s ease,box-shadow .15s ease}
    .domain-tab ha-icon{--mdc-icon-size:19px;color:#47566E}
    .domain-tab:hover{background:#F4F8FE;color:#06142D}
    .domain-tab:hover ha-icon{color:#1467F5}
    .domain-tab.active{background:#EAF3FF;color:#182842;border:1px solid #CBE0FF;box-shadow:inset 0 0 0 1px rgba(20,103,245,.05)}
    .domain-tab.active ha-icon{color:#1467F5}
    .placeholder-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.placeholder-card{background:#fff;border:1px solid #E8EEF7;border-radius:20px;padding:18px;box-shadow:0 16px 38px rgba(15,35,80,.07)}.placeholder-card h3{margin:0 0 8px;font-size:18px;color:#06142D}.placeholder-card p{margin:0;color:#66728B;font-size:13px;line-height:1.45}.placeholder-kicker{display:inline-flex;align-items:center;gap:8px;margin-bottom:10px;color:#1467F5;font-size:12px;font-weight:650;text-transform:uppercase;letter-spacing:.04em}.placeholder-kicker ha-icon{--mdc-icon-size:18px}.footer-note{margin-top:12px;color:#66728B;font-size:12px;font-weight:600}@media(max-width:760px){.placeholder-grid{grid-template-columns:1fr}.domain-tabs-wrap{margin:8px 0}.domain-tabs{min-height:52px;border-radius:16px;padding:6px}.domain-tab{font-size:12px;padding:0 12px;min-height:38px}}

    /* R22.10.3 charger capability guard and outcome renderer alignment */
    .domain-tabs-wrap{margin:6px 0 8px!important}
    .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{width:100%!important;max-width:none!important;margin:8px 0 10px!important}
    .section-title{margin-top:8px!important;margin-bottom:8px!important}
    /* Dynamic release footer. Backend version is runtime data from the Mobility release contract. */

    /* R22.12.11.24 Energy look & feel alignment — visual tokens only, no route/data changes. */
    :host{--hi-surface:var(--card-background-color);--hi-surface-soft:rgba(14,35,72,.025);--hi-line:rgba(14,35,72,.10);--hi-line-soft:rgba(14,35,72,.075);--hi-muted:var(--secondary-text-color);--hi-ink:var(--primary-text-color);--hi-radius-card:18px;--hi-radius-control:12px;--hi-shadow-soft:none;font-family:inherit;}
    .domain-tabs{border-color:var(--hi-line)!important;border-radius:16px!important;background:var(--hi-surface)!important;box-shadow:none!important;min-height:44px!important;padding:5px!important;gap:6px!important;}
    .domain-tab{min-height:34px!important;padding:0 14px!important;border-radius:12px!important;color:var(--hi-muted)!important;font-size:13px!important;font-weight:500!important;letter-spacing:0!important;}
    .domain-tab ha-icon{--mdc-icon-size:18px!important;color:var(--hi-muted)!important;}
    .domain-tab:hover{background:var(--hi-surface-soft)!important;color:var(--hi-ink)!important;}
    .domain-tab:hover ha-icon{color:var(--hi-ink)!important;}
    .domain-tab.active{background:rgba(20,103,245,.08)!important;color:var(--hi-ink)!important;border:1px solid rgba(20,103,245,.14)!important;box-shadow:none!important;}
    .domain-tab.active ha-icon{color:#1467F5!important;}

    .hi-version-block{display:none!important}
    .hi-release-footer{display:flex;align-items:center;gap:8px;flex-wrap:wrap;width:100%;box-sizing:border-box;margin:8px 0 0;padding:8px 14px;border-top:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#53627A;font-size:11px;font-weight:500;line-height:1.2;white-space:normal;overflow:hidden}
    .hi-release-footer span+span::before{content:"•";margin-right:8px;color:#8A96AA}
    .hi-release-footer .hi-release-health{color:#6B7280;font-weight:650;opacity:.92}
    .hi-release-footer .hi-release-health.trusted{color:#2F6B4F}
    .hi-release-footer .hi-release-health.degraded{color:#8A5A00}
    .hi-release-footer .hi-release-health.blocking{color:#9A3412}
    .hi-release-footer .hi-release-health::before{content:"•";margin-right:8px;color:#C7A35A}
    @media(max-width:760px){.hi-release-footer{font-size:10px;padding:8px 10px}}
  `;
}
