# v1.0.0-rc.53 — vehicle visuals everywhere TEST CANDIDATE

## Scope

rc.53 makes a canonical vehicle picture part of vehicle identity across routed Mobility UX instead of limiting visuals to dashboard/detail/picker surfaces.

- Planning vehicle rows render picture + human name + state.
- History / Vehicle energy & value rows render picture + human name + metrics.
- Effective-strategy rows for concrete Mobility assets render the same canonical picture.
- Backend release identity falls back from `sensor.mobility_release_contract` to canonical `sensor.mobility_release_identity` before showing Unknown.
- All artwork remains package-local and visual_ref-aware.

Required/tested backend: `M0.10.1`.
Rollback: `v1.0.0-rc.52`.

Accepted technical debt: 0.
Accepted feature debt: 0.
Target Home Assistant qualification remains mandatory.
