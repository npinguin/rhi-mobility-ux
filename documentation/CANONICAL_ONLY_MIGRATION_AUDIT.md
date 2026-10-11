# P0 — Canonical-only frontend migration audit (2026-10-09)

Status: **OPEN / preparation only**. Branch is not releasable. No fabricated replacement entity IDs.

## Architectural decision
Domain canonical state → native HA devices/entities → Mobility gateway → scoped view models → components. No Public Runtime V2 reader, dual-contract gateway, reverse lookup, guessed relation, derived totals or semantic fallback.

Backend-owned `MOBILITY_ENERGY_V2` and `COMMAND_V2` remain legitimate producer/command contracts; UX must not recreate their meaning.

## Verified active dependencies (main, 2026-10-09)
| Frontend consumer | Current source | Canonical replacement | Backend owner | Required properties | Availability | Migration status |
|---|---|---|---|---|---|---|
| `tests/contracts/runtime-contract-smoke.mjs` | Fixtures use `sensor.rhi_mobility_runtime_v2` and `MOBILITY_PUBLIC_RUNTIME_V2` for asset list, relationships, release/fleet and snapshots | Native canonical asset/property/relationship publication (exact IDs pending) | Mobility | Backend-owned asset identity, explicit relationship, status/reason/freshness | Await exact native contract | REWRITE REQUIRED |
| `tests/contracts/runtime-contract-smoke.mjs` | Coexists with `MOBILITY_CANONICAL_PROPERTY_V2` scalar entities | Preserve these canonical property semantics and actual-versus-requested separation | Mobility | `charger.power_kw`, `charger.requested_charge_power_kw`, availability | Demonstrated in static fixtures, target HA unqualified | RETAIN / EXTEND |
| `documentation/KNOWN_DEFECTS.md` | Requires target-HA proof for placement, commands, picker save/readback, relationship and cross-screen parity | Same capabilities directly through canonical native entities and producer-owned write/readback | Mobility | Per-asset placement, authoritative descriptors/readback, relationship proof | Runtime proof pending | BLOCKED |

## Workstream A
- [ ] Complete production dependency inventory for `MOBILITY_PUBLIC_RUNTIME_V2`, aggregate caches and legacy contract references; test fixture dependencies above are verified but do not prove exhaustive production coverage.
- [ ] Refactor native HA entity selection without whole-domain registry reconstruction; handle new/removed/replaced entities and preserve canonical IDs.
- [ ] Require explicit backend-owned `component_id`, `section_id`, ordering, reason/provenance/freshness. Missing placement is a visible contract gap.
- [ ] Keep zero distinct from unknown/unavailable/absent/not-applicable and avoid UI-synthesized operational truth.
- [ ] Add scoped invalidation/performance tests and closed-surface tests; no global HTML recreation for scalar changes.
- [ ] Independently correct iOS widths, wrapping, hero/device images, shared responsive and visual picker hierarchy.

## Backend dependencies
Mobility #242 and #246 must confirm the native canonical asset/relationship/property/command interfaces and preservation or intentional change of entity and unique IDs. Do not assume compatibility solely from Foundation baseline.

## Release gate
No frontend cutover release before a validated published backend, exact compatible version matrix, HA runtime and rollback qualification, benchmark and zero accepted debt. This document is not a completed implementation or test result.

## Coordinated P0 release gates — blocking
Six issue program: Foundation #109/#111; Mobility #246/#247; Energy #240/#242.

1. Domain model first: normalized property changes must update domain model, canonical catalog, HA materialization and bidirectional Validate canaries in the same backend PR.
2. Backend complete: exact public native entity/unique IDs, attributes, typed state/quality/freshness, placement, invoke and terminal readback; missing capability stays open at owning backend issue.
3. Backend validated: Foundation, Mobility and Energy CI PASS, no active retired aggregate transport in UX/HA hot path, no shadow semantic authority.
4. Backend released: immutable tested backend tags, full SHA and baseline-adoption manifests for all three domains; confirm identities rather than assuming.
5. UX validated: all critical screens and actions use native canonical entities only; absent backend truth is visible contract gap.
6. Joint qualified: one HA instance, install/upgrade, dynamic asset lifecycle, reload/restart, outages, write/readback, rollback, iPhone/iPad/desktop and measured event→gateway→component processing. Backend CPU ≤25% target must be assessed in same qualification.

**No premature closure:** backend CI green alone is not product acceptance. Keep WIP backend decommission PRs blocked until canonical replacement is proven. Technical debt acceptance = 0; feature debt acceptance = 0. Never substitute frontend logic for missing backend semantics.
