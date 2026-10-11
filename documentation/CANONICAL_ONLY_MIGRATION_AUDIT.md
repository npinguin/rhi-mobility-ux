# Mobility UX canonical-only migration — current status

**As built 2026-10-11:** canonical-only source migration merged to `main` in PR #175 and published as immutable, HACS-installable **test candidate** `v1.0.0-rc.89`. Source, UX, package, release, HACS and strict canonical-only scans passed. **Target Home Assistant qualification is PENDING; stable promotion is BLOCKED.** This is not a claim of product acceptance.

## Single product authority

```text
Mobility M0.10.43 canonical native property entities (V1)
  + producer-owned Experience V2 / Policy V2 / Command V2
  + Activity V2 / Profile Catalog V2 / Supervision V2 / Mobility Energy V2
    → runtime identity / property / relationship / command adapters
    → view models
    → Overview / Vehicles / Chargers / Details / Actions / Configuration / Diagnostics
```

- Fleet identity from exact canonical `asset_id`; Audi Q8s represented by separate integrations remain different physical identities.
- Per-asset properties from `RHI_MOBILITY_CANONICAL_PROPERTY_V1`; duplicates, stale, unknown and absent values fail closed, preserving zero.
- Configured/effective assignment and physical connection truth from `MOBILITY_EXPERIENCE_V2` with explicit observed identity proof. Do not infer physical connection from charger assignment.
- Commands and write/readback require backend-owned execution target, applicability and terminal readback.
- UI owns display and interaction, not semantic relationships, lifecycle, confidence or planned energy.

## Changes in structural recovery branch

On `work/ux-structural-closure-20261011` (prospective rc.90, not yet main):

1. Cross-domain D0/D1 planning now reads actual Energy-native metric publications selected by `canonical_source=rhi_energy.runtime` and exact `metric_key`, not fabricated `D0` / `D1` canonical asset IDs.
2. Insights requires explicitly published per-asset `period_id` and unit before rendering Energy energy/financial attribution; property-name matching is no longer treated as period authority.
3. Strategy displays only backend-published, editable `presentation_family=strategy` configuration. Without a producer-owned effective strategy state, effective status remains unavailable, not derived from a property key.
4. Duplicate canonical-property diagnostics use the canonical index's actual contract gaps even though duplicate rows are hidden from product selectors.

These changes are unqualified until full source/UX/package validation and target HA runtime checks pass; they do not alter published rc.89 bytes.

## Target Home Assistant acceptance — still OPEN

- Install exact immutable candidate against Foundation F1.8.43, Mobility M0.10.43 and compatible Energy backend, with SHA/contract provenance.
- Prove all expected vehicles/chargers, both Audi Q8 integrations, add/remove and rename stability, no source device duplication.
- Verify vehicle/charger configured vs effective vs physical relationship truth including unknown, conflict, reassignment and explicit No charger.
- Execute Start, Stop, Unlock, Restart and Identify via producer-owned commands; test blocked/failed/timeout and terminal readback.
- Save/reopen vehicle/charger appearance, profiles, actual vs requested power and editable configuration across refresh, restart and rollback.
- Prove Energy cross-domain planning, metering and financial evidence with exact period/asset joins; fail closed when unavailable. Do not accept synthetic Energy fixture data as runtime qualification.
- Inspect Overview, Vehicles, Chargers, Details, Intelligence, Insights and Diagnostics on phone, tablet and desktop for layout/state preservation.
- Demonstrate reload, upgrade, HACS install and immutable rollback. Record evidence in `release/QUALIFICATION.json`.

## CI discipline and ownership

Do not spend Actions on each intermediate commit. Validate locally in a non-PR working branch; only open the qualification PR once full source, UX, package, documentation and deterministic dist are consistent. No weakening of `tools/audit-canonical-dependencies.mjs`, `npm test`, or HACS gates. `src/OWNERSHIP.json` and `tests/OWNERSHIP.json` remain normative.

## Historical baseline

The original 2026-10-09 audit listed `MOBILITY_PUBLIC_RUNTIME_V2` as active. That inventory is **superseded by the verified rc.89 code/CI**; it must not be interpreted as the current release state. Missing backend contract requirements remain tracked in `documentation/BACKEND_INTERFACE_BACKLOG.md`, and real runtime gaps in `documentation/KNOWN_DEFECTS.md`.
