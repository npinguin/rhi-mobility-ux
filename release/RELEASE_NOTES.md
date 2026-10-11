# v1.0.0-rc.91 — Mobility canonical lifecycle and Energy planning evidence (HACS TEST CANDIDATE)

**Source- and contract-qualified candidate only. Not a stable Home Assistant installation.** Backend-HACS M0.10.44 does not contain the canonically published `asset.lifecycle_status` default fix currently present on backend `main`. **M0.10.45 or a verified successor package containing that exact fix is required** before the target installation can show all four active vehicles.

## Structural UX recovery

- Never interpret absent canonical Mobility lifecycle as disabled. Active, explicitly disabled, retired and missing evidence are separate states. The disabled/reactivate control is available only when `asset.lifecycle_status=disabled` is actually published.
- Zero active vehicles does not produce false-green range, security or maintenance claims. Missing power or fleet counts do not become `0` by JavaScript coercion. Explicit native zero remains zero.
- Mobility Planning now consumes exact effective `RHI_ENERGY_PLANNING_HORIZON_V1` D0/D1, preserving `INCOMPLETE`, reason, requested/effective provider selection, exact planning asset identity and provisional metric totals. Baseline `RHI_ENERGY_BASELINE_PLANNING_HORIZON_V1` is never an executable substitute for a failed EMHASS effective plan.
- Routed planning/Insights/Strategies subscribe to Energy's native revision changes, not just Mobility property/command events.
- Strategy displays backend-published configured settings without pretending they are full profiles or effective policies. Insights reports the real canonical contract ID.
- Removes obsolete frontend `HomeBrainEnergyPublicV2Projection` compatibility symbol. Architecture CI now prohibits reintroduction.
- New executable regression tests cover native product lifecycle, readback absence vs disabled, provider HOLD, D0/D1 quality, duplicate publications, exact Mobility asset joins, Energy refresh, valid zero and unknowable status.

## Target installation findings from diagnostics

Mobility M0.10.44 runtime: four vehicles + four chargers structurally active, all READY, none disabled. Frontend may report lifecycle unverified until the native property fix is deployed in a newer backend-HACS source. Do **not** reactivate the assets.

Energy E0.15.116: requested provider `emhass`, effective provider null; deterministic plan `PLAN_AVAILABLE` but not selected as effective. EMHASS reports `canonical_solar_forecast_missing_slot:2026-10-12T22:00:00+00:00` and both effective D0/D1 horizons are INCOMPLETE. Display this as a provider/input publication HOLD; do not fabricate schedules or silently promote the deterministic baseline.

## Compatibility and rollback

- Minimum Mobility backend: **M0.10.45** containing the canonical lifecycle fix, once published.
- Energy Planning requires the producer-owned native D0/D1 effective publication contract; an incomplete horizon remains nonexecutable regardless of Energy version.
- UX Core: 1.6.3 pinned; rollback frontend: `v1.0.0-rc.90`.
- Exact HACS tag `dist/` and target-HA lifecycle, refresh/reload, property write readback, charging connection identity, cross-domain scheduled assets, mobile/tablet/desktop layout and rollback acceptance remain separately tracked in `release/QUALIFICATION.json`. Stable promotion stays blocked.
