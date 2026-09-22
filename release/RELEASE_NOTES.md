# v1.0.0-rc.29 — shared premium Mobility presentation hotfix

## Scope

- supersedes broken `v1.0.0-rc.28`;
- fixes the shared presentation source serialization defect that caused `hbMobilityPageHero()` to be undefined at runtime while static parse checks still passed;
- adds an executable regression gate for the shared presentation module;
- keeps the rc.28 presentation scope intact: shared typography, spacing, density, page geometry and compact premium tab heroes;
- preserves all existing Mobility content, filters, actions, KPI/status rows and management controls;
- keeps contextual hero artwork presentation-only; product/device truth remains separate;
- keeps Mobility on frozen `MOBILITY_PUBLIC_RUNTIME_V1` with backend baseline `M0.9.29`.

## Rollback

Known-good rollback remains `v1.0.0-rc.27`. The published rc.28 candidate is not modified.

## Qualification

Static validation, executable-module validation, deterministic build proof, HACS validation and package/source equality are required before publication. Target runtime proof must cover phone portrait, tablet and desktop plus Overview, Vehicles, Chargers and Charging.
