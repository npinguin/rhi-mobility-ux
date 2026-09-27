# v1.0.0-rc.68 — path-relative dashboard routing and install UX TEST CANDIDATE

Mobility can now be mounted under the Home Assistant dashboard URL chosen by the user instead of depending on the legacy `/mobility-supervisor` root.

## User-facing changes

- derives Mobility navigation from the dashboard where the card is mounted;
- keeps Overview, Vehicles, Chargers, Planning, Strategies, History, Log and asset detail inside a custom dashboard root such as `/robotix-mobility`;
- preserves the one-card bootstrap query routing and browser refresh/history behavior;
- keeps explicit `dashboard_path` / bootstrap configuration available for legacy or advanced layouts;
- keeps HACS resources and packaged visual assets under `/hacsfiles/rhi-mobility-ux/...` independently of the dashboard URL;
- fixes the README hero image and aligns first-time HACS/dashboard instructions with the clearer Energy installation flow.

## Engineering

- removes the fixed `/mobility-supervisor` navigation authority from shared navigation and detail-card defaults;
- centralizes dashboard-root resolution in the Mobility presentation adapter;
- adds regression coverage for custom dashboard roots, numeric Lovelace view paths and legacy compatibility;
- preserves existing multi-view installations while making the dashboard root deployment-specific.

Rollback: **v1.0.0-rc.67**.

This is an installable HACS test candidate. Target Home Assistant path/navigation, refresh, asset-detail, upgrade and rollback proof remain required before stable promotion.
