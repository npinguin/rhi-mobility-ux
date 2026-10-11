# Active engineer handover — Mobility UX (2026-10-11)

**Status: immutable HACS test candidate available; target Home Assistant runtime and rollback qualification remain OPEN.** This is an active handover, not proof of release acceptance. Refresh the `main` SHA, releases, CI and open issues when starting.

## Current verified repository state

- `main` `e3032467e180e877d21de28e696b57048fdc7352`, [HACS test candidate v1.0.0-rc.92](https://github.com/npinguin/rhi-mobility-ux/releases/tag/v1.0.0-rc.92). rc.92 merged PR #179 after fresh-main integration, avoiding previous #177 conflicts and retaining rc.91 planning/lifecycle updates; [PR #179](https://github.com/npinguin/rhi-mobility-ux/pull/179). PR #177 was superseded and closed, not an outstanding integration candidate.
- `release/QUALIFICATION.json` still records `candidate_sha=pending`, target HA, charger/vehicle readback, responsiveness, upgrade and rollback all pending; `stable_promotion=blocked`.
- At checkpoint: zero open Mobility UX PRs. Current release ownership: `release/product.json`, `package.json`, GitHub Release tag, `release/QUALIFICATION.json` — not snapshots in legacy engineer notes.
- Related Energy UX: [active engineering handover](https://github.com/npinguin/rhi-energy-ux/blob/main/docs/ACTIVE_ENGINEERING_HANDOVER_2026-10-11.md); Energy UX rc.5 includes newer consumer/metrology/presentation changes and remains runtime-unqualified.

## Mission and exact ownership

Take complete ownership of UX implementation, regression, integration, HACS packaging and target runtime proof. No narrow CI-only patching, shadow charging model, guessed HA identifiers, derived power from current limit, optimistic success without authoritative readback or silent removal of capabilities. Backend owns physical facts:
- Foundation: discovery candidate identity, disambiguation and explicit accepted binding.
- Mobility: vehicle, charger and connector identities, operating/connection status, physical relationship proof, requested/actual limits, command readiness and authorized write routes.
- Energy: flexible load / planning participation as Energy consumer, planning/financial truth.
- UX: consume the exact published contracts, format and present correctly; direct commands through backend-declared actions.

## P0 defects and acceptance

**M-01 Charger Charging with 0 kW.** rc.92 implemented charger operating state vs measured `charger.power_kw` evidence and tests in `src/domain/adapters/charger-adapter.js`, `src/ui/screens/charger-maintenance.js`, `tests/view-models/charger-overview-availability.mjs`. In the supplied Wallbox screenshot, `Charging` and `0 kW` were both published while 6 A and 38.252 kWh referred to other quantities. On HA: verify `0` vs unavailable, charging/running vs idle, offered current vs actual, requested power vs measured, and accurate sessions. Never derive kW from A; never attribute charger power to vehicle without proven physical identity.

**M-02 Peblar source ambiguity — BACKEND BLOCKER.** Diagnostic evidence: discovery PARTIAL; selected source 1; accepted bindings 0; ambiguous capabilities 3; `cardinality_violation:charger_operating_state:expected_exactly_one...count_2`. Foundation must retain candidate provenance and disambiguate using device/connector semantics, Mobility must accept exactly one explicit operating-state binding; UX must not arbitrarily select either. Once published as canonical, validate Peblar in charger list, profile/image, connection/operating/health/actual power, source identity, commands and config readback. Preserve unsafe state until producer ready.

**M-03 Plug Car Charger.** Snapshot shows Idle/Disconnected/0 kW, which is coherent; separately validate visual/profile setting and source connector identity. No inferred charging from configured vehicle or session history.

**M-04 Vehicle ↔ charger relationships and dual Audi Q8.** Assignment != connected physical vehicle != current session != command readiness. Backend may publish two valid same-model Audi Q8 identities; preserve exact IDs and separate mappings. Test all cases including no vehicle, configured-but-unplugged, proven physical connection, unknown, unavailable and duplicate owner.

**M-05 Public write/transport selectors.** Historical [#134](https://github.com/npinguin/rhi-mobility-ux/issues/134) and [#136](https://github.com/npinguin/rhi-mobility-ux/issues/136) discuss using backend `choices[].transport_value` / `transport_value_field` for HA select transport, while canonical readback compares semantic values. Re-qualify these historical scenarios on rc.92 before closing or rewriting stale issue versions. Test charger/vehicle profile + image, requested charging kW, lifecycle Disable/Activate, command pending/rejection, refresh/restart persistence and permissions.

**M-06 Flexible/available charging capacity.** Only display an independently published canonical capability and corresponding quality. Distinguish requested vs effective cap vs offered current vs measured actual power; no conversion from amperes, session totals or Energy planning assumptions. Missing facts remain explained as unavailable.

## P1 consistency and UX debt

- Shared Core asset grammar without flattening Vehicle and Charger detail semantics: [#141](https://github.com/npinguin/rhi-mobility-ux/issues/141).
- Localization and locale formatting EN/NL/FR: [#140](https://github.com/npinguin/rhi-mobility-ux/issues/140).
- Release/change record traceability: [#112](https://github.com/npinguin/rhi-mobility-ux/issues/112).
- Comprehensive target-HA broad pilot [#142](https://github.com/npinguin/rhi-mobility-ux/issues/142).
- Responsive cards, hero image stability, visual-picker session/readback, truthful unknowns, title/IDs and accessible details/diagnostics.
- Note product boundary: flexible_load consumer inventory belongs to Energy's canonical objects; do not implement it by duplicating Mobility's vehicle or charger inventory in Mobility UX.

## Engineering and release path

Read `documentation/RELEASE_GOVERNANCE.md`, `documentation/UX_RELEASE_STANDARD.md`, `documentation/TEST_GOVERNANCE.md`, `src/manifest.json`, `tests/OWNERSHIP.json`. Source and owned regression tests → `npm ci`, `npm run validate`, deterministic `dist/` parity → PR Validate PASS → squash merge → exact-main Validate PASS → automatic `Publish HACS` checks immutable candidate (does not rebuild) → target-HA qualification → stable promotion only when candidate SHA/rollback/readback evidence is PASS. Keep version/compatibility synchronized from release owner on intentional new candidates; do not edit already published rc.92 tag.

## First actions for incoming engineer

1. Fetch current main and read current open issues, candidate notes and qualification, verify exact SHA rather than following a stale handover.
2. Test rc.92 on target HA against Wallbox, Plug Car Charger, two Q8 identities and Peblar partial discovery; record actual canonical facts and missing binder proof.
3. Route the Peblar cardinality defect to Foundation+Mobility owners and follow to an unambiguous accepted publication. UX must only consume proven resulting public contracts.
4. Fix remaining UX presentation/write cases with central adapter, dedicated regressions, complete deterministic build and HA readback; do not close at static CI.
5. Release only through Validate → exact-main Validate → Publish HACS; bind real HA/rollback evidence in `release/QUALIFICATION.json`. No stable GO until proved.
