# v1.0.0-rc.69 — Core 1.5.1 and producer-owned cross-domain navigation TEST CANDIDATE

Mobility now consumes the current RHI UX Core 1.5.1 baseline and registers its asset-detail route generically for optional cross-domain navigation.

## User-facing changes

- existing Overview, Vehicles, Chargers, Planning, Strategies, History and Log tabs remain unchanged;
- asset detail routing remains path-relative to the dashboard where Mobility is mounted;
- another RHI UX can optionally open a Mobility-owned asset without hardcoding the Mobility dashboard root;
- custom dashboard roots and one-card bootstrap routing remain supported.

## Engineering

- exact RHI UX Core 1.5.1 provenance is pinned and bundled at build time;
- Mobility registers its current asset-detail template through the shared Core navigation registry;
- the route template is derived from the existing canonical Mobility route factory;
- no consumer is allowed to reconstruct Mobility route grammar;
- adds a blocking generic cross-domain navigation contract test;
- minimum/tested backend is M0.10.19.

Rollback: **v1.0.0-rc.68**.

This is an installable HACS TEST CANDIDATE after repository validation. Target Home Assistant qualification, refresh/restart, upgrade and rollback proof remain required before stable promotion.
