# v1.0.0-rc.34 — Canonical Mobility hero library

## Scope
- replaces the legacy shared/reused hero artwork with the approved nine-image Mobility hero library;
- assigns one canonical scene to Overview, Vehicles, Chargers, Planning, Strategies, History and Log;
- adds dedicated vehicle-detail and charging-detail scenes while preserving asset-specific vehicle/charger identity artwork;
- centralizes hero resolution in the package-owned semantic hero catalog;
- removes superseded active SVG/WebP hero assets;
- adds release gates for exact nine-image inventory, unique mapping, 2172×724 PNG masters and source/dist byte parity.

## Rollback
Rollback candidate: `v1.0.0-rc.33`.

## Qualification
Static/package/HACS validation is required before publication. Target Home Assistant proof must verify all seven tab heroes, both detail scenes, responsive rendering, HACS update/install, restart persistence and rollback before stable promotion.
