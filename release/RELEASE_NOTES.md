# v1.0.0-rc.12 — Readable footer and cache-safe company asset TEST CANDIDATE

## Scope

Cross-package UX usability and browser-cache correction over rc.11. Existing Mobility routes, screens, actions, backend semantics, header geometry and company artwork remain intact.

- increases the shared footer to a readable 11px desktop / 10.5px phone with full opacity;
- replaces hover-only issue disclosure with an expandable `issues · details` control;
- expanded details show the concrete runtime/backend conditions plus backend release and contract context;
- keeps one concise warning/error summary in the normal footer;
- versions the company-logo request with the UX package version so Chrome cannot reuse a stale logo URL after a HACS update/reload;
- keeps the canonical shared SVG unchanged;
- keeps footer and asset-refresh behavior aligned with Energy.

## Compatibility

- Mobility UX: 1.0.0-rc.12
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Rollback release: `v1.0.0-rc.11`

Stable promotion remains blocked until target Home Assistant runtime and rollback proof are PASS.
