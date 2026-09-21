# v1.0.0-rc.14 — Overview navigation and inline company brand TEST CANDIDATE

## Scope

Runtime closure over rc.13 for two target-HA issues observed after deployment.

- fixes Overview/Vehicle navigation so the dashboard card can switch locally between both product views without depending on a separately provisioned Lovelace route;
- removes invalid internal `/vehicles` navigation targets and uses the canonical Vehicles dashboard target;
- keeps the dedicated `/overview` Lovelace route compatible when it exists;
- embeds the canonical approved Robotix company SVG into the generated JS bundle at build time;
- removes runtime dependency on `/hacsfiles/rhi-mobility-ux/assets/branding/company-logo.svg`;
- preserves the same canonical SVG source and immutable branding hash;
- keeps the company brand in the right-hand shared header slot aligned with Energy;
- leaves all vehicle/charger semantics, detail screens and backend contracts unchanged.

## Compatibility

- Mobility UX: 1.0.0-rc.14
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Rollback release: `v1.0.0-rc.13`

Stable promotion remains blocked until target Home Assistant runtime and rollback proof are PASS.
