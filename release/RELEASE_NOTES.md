# v1.0.0-rc.61 — Vehicle Management runtime closure TEST CANDIDATE

## Scope

rc.61 closes the rc.60 Vehicle Management render regression without restoring the removed parallel Experience-map path.

- removes the stale `experienceById` reference that crashed Vehicle Management during `.filter(...)`;
- publishes canonical `asset.profile_id` configuration truth through `HomeBrainVehicleAdapter.productProjection()`;
- makes Vehicle Management profile counts consume that canonical VehicleProjection instead of a screen-local Experience map;
- adds an executable Vehicle Management render-path regression with profiled and unprofiled active vehicles so undefined/free-variable refactor regressions fail CI;
- preserves the rc.60 canonical projector architecture, write/readback rules and Mobility M0.10.10 backend baseline;
- keeps accepted technical debt at 0 and accepted feature debt at 0.

Required/tested backend: `M0.10.10`.
Required Foundation for target proof: `F1.8.15`.
Rollback: `v1.0.0-rc.60`.

Target Home Assistant qualification and rollback proof remain required before stable promotion.
