# v1.0.0-rc.49 — Mobility M0.9.44 complete V2 consumption closure

This candidate completes the first-party Mobility UX migration onto the canonical public V2 surfaces introduced by Mobility M0.9.44.

## Canonical authority

- Runtime V2 owns asset inventory, fleet and relationships.
- Experience V2 owns user-facing conclusions.
- Policy V2 owns interpretation thresholds.
- Command V2 owns executable command readiness.
- Activity V2 owns activity history/current activity.
- Profile Catalog V2 owns product profile browsing.
- Supervision V2 owns global status, trust and attention.
- Energy V2 is the external Mobility→Energy publication boundary.
- direct per-asset V2 property entities own semantic read/write state.

When Runtime V2 is present, missing V2 data is not backfilled from V1. Per-asset property-publication evidence distinguishes an unsupported property from an expected property that failed to materialize.

Required/tested backend: `M0.9.44`.
Rollback: `v1.0.0-rc.48`.

Target Home Assistant qualification remains mandatory before stable promotion.
