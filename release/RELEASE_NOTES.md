# v1.0.0-rc.13 — Mobility-first Energy-style Overview TEST CANDIDATE

## Scope

Product-level redesign of the Mobility Overview on top of rc.12. The shared header, readable/actionable footer, cache-safe company logo, existing routes, detail screens and backend contracts remain intact.

- adopts the calm Energy information hierarchy without importing Energy semantics;
- makes Mobility purpose explicit: readiness, charging, security, comfort, maintenance and required action;
- replaces the primary `Energy today` KPI with Mobility-owned `Attention`;
- shows Vehicles, Charging now, Chargers and Attention as the four primary status signals;
- keeps direct vehicle actions, charging plan, preconditioning and charger assignment close to the overview;
- keeps vehicle rows contract-driven for range/charge, security, comfort, maintenance and commands;
- treats chargers as supporting Mobility infrastructure;
- adds backend-owned Next action, Recent activity and a concise conclusion;
- preserves fail-closed rendering when canonical backend evidence is unavailable.

## Compatibility

- Mobility UX: 1.0.0-rc.13
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Rollback release: `v1.0.0-rc.12`

Stable promotion remains blocked until target Home Assistant runtime and rollback proof are PASS.
