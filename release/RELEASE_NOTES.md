# v1.0.0-rc.69 — Core 1.5.1 convergence and producer navigation TEST CANDIDATE

## User-facing behavior

- preserves all existing Mobility tabs: Overview, Vehicles, Chargers, Planning, Strategies, History and Log;
- preserves asset-detail navigation and arbitrary dashboard-root portability;
- registers the active Mobility asset-detail route generically so other RHI UX domains can optionally offer “Open in Mobility” without hardcoding a Mobility dashboard path;
- no new runtime dependency on RHI UX Core.

## Engineering

- converges Mobility UX from RHI UX Core 1.4.1 to **1.5.1** at source commit `bb275767d9e9672713c00b9e8bd9fde13b9b5962`;
- requires Mobility backend **M0.10.19+** for producer-owned visual presentation registration;
- keeps Core build-time vendored only;
- uses runtime-safe `{asset_id}` navigation templates;
- keeps existing V2 contract, command, visual and route authority unchanged.

Rollback: **v1.0.0-rc.68**.

Target Home Assistant proof remains required for custom dashboard roots, producer navigation registration, asset detail, refresh/restart, upgrade and rollback before stable promotion.
