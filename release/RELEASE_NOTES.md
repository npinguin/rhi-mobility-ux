# v1.0.0-rc.60 — canonical projection closure TEST CANDIDATE

## Scope

rc.60 closes the structural backend-to-UX drift class for Mobility and preserves user interaction state across live Home Assistant refreshes.

- promotes HomeBrainVehicleAdapter and HomeBrainChargerAdapter to the shared canonical asset projection boundary for Overview, Management and Detail;
- removes screen-local Experience V2, relationship, charger-fact and command reinterpretation from Overview, Vehicle Management and Charger Management;
- projects range, energy, security, comfort, maintenance, charging, canonical relationships, commands and charging configuration through one Vehicle projection;
- projects operating/connection/power/current/limit/session/health, Experience V2, relationships and commands through one Charger projection;
- keeps Planning, Strategies and History as read-only Energy-owned cross-domain projections joined to canonical Mobility identity;
- preserves view instances across backend refresh and tab switching, so filters, expanded sections, pickers and drafts are not reset by new data;
- keeps physical command truth backend-owned and readback-confirmed; the UX does not optimistically mutate canonical state;
- adds release-blocking architecture and regression gates that reject direct screen bypasses around the canonical projectors;
- removes superseded Charger Management semantic helpers;
- keeps accepted technical debt at 0 and accepted feature debt at 0.

Required/tested backend: `M0.10.10`.
Required Foundation for target proof: `F1.8.15`.
Rollback: `v1.0.0-rc.59`.

Target Home Assistant qualification and rollback proof remain required before stable promotion.
