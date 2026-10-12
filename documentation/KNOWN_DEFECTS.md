# Known Defects and Open Migration Issues

This file is the authoritative list of unresolved Mobility UX product/runtime issues. These are **not accepted technical or feature debt**. They stay open until the owning contract/test plus target Home Assistant evidence proves closure.

## rc.93 responsive presentation recovery (2026-10-12)

Observed iPhone screenshots of Overview, Vehicles and Chargers show severe narrow-column status wrapping, vehicle identity pushed below secondary facts, some overlapping asset imagery/text, duplicated/misplaced detail navigation, excessive boxed facts/whitespace and inconsistent top-level action presentation. The rc.93 source branch centralizes a final responsive authority, moves vehicle identity before the status strip, adds labelled contextual details, unifies factual rows and reduces vertical density across all screens.

**Still open until target Home Assistant proof:** 320/375/430 CSS-pixel phones, portrait/landscape tablets, desktop; Overview, Vehicles, Chargers, Intelligence/Planning, Strategies, Insights/History, Activity, both asset details, appearance selectors, command/readback, active/inactive/unavailable and same-model distinct assets. See `documentation/RESPONSIVE_UX_ACCEPTANCE.md`. Source green is not visual qualification. No new feature or tech debt is accepted as a workaround.

## Cross-domain native Energy acceptance update (2026-10-11)

Mobility's recovery branch replaces synthetic D0/D1 asset-key planning with producer-owned native Energy metrics and blocks period/strategy inference. This is source-level behavior, not evidence that the current Energy backend publishes complete per-asset metering/financial attribution or effective strategy semantics. Verify the exact Energy producer publications and record runtime evidence before closing Planning/Intelligence or Insights.

## Open issues

1. **Vehicle/charger picker runtime qualification is not closed.**
   - Static CI and package validation are not sufficient evidence.
   - Vehicle and charger profile/appearance edits must be proven on the target Home Assistant through: open → edit hierarchy → save → canonical readback → refresh → reload/restart.
   - A failed service call must keep the editor open and fail visibly; service acceptance is not durable truth.

2. **V2 product API decommission is structurally closed; target proof remains open.**
   - Mobility UX product runtime now consumes only the explicit V2 authorities and canonical per-asset V2 semantic properties.
   - Legacy product indexes, command-slot indexes, release fallbacks and compatibility reads are forbidden by the zero-debt CI gate.
   - Missing V2 truth fails closed and is reported as a backend gap; UX does not reconstruct or recover it from older interfaces.
   - Closure on the target Home Assistant still requires the immutable candidate to prove the complete V2 read/write journey.


3. **Picker semantic-value versus Home Assistant transport-value handling requires target proof.**
   - Backend/domain truth uses stable semantic identifiers such as profile IDs.
   - Home Assistant select entities may require human display labels at the transport boundary.
   - UX must translate only at the generic write boundary and must never promote a display label to semantic truth.
   - The current rc.45 transport fix is static/CI proven; target runtime proof remains required.

4. **Canonical visual rendering still requires target proof and premium asset polish.**
   - rc.48 enforces profile-family identity for vehicles and persisted-V2 precedence for chargers.
   - Wrong-model/cross-family fallbacks are forbidden. Missing/invalid artwork must fail visibly to a neutral placeholder rather than display another real model.
   - Current device imagery quality remains below the intended premium standard. Functional identity/render correctness must be proven before premium asset replacement is accepted.

5. **Direct V2 property placement is structurally closed in rc.47, target proof remains open.**
   - Product placement is driven by backend-published `component_id` + `section_id`.
   - Missing placement fails visibly as a Layout contract gap; UX does not invent Engineering/Unmapped.
   - Target HA must still prove the deployed backend materializes the expected V2 property entities and placements.

6. **Direct Command V2 is structurally closed in rc.46, target proof remains open.**
   - Start/Stop/Unlock/Restart/Identify come from `MOBILITY_COMMAND_V2` and execute through `rhi_mobility.execute_command`.
   - Legacy command/slot indexes are not consumed by the UX.
   - Target HA must still prove all expected commands are published and executable for the installed assets.

7. **Requested versus actual/readback cross-screen parity still needs runtime proof.**
   - Requested charge power is control intent.
   - Actual charging power comes from the physically connected charger's canonical `charger.power_kw`.
   - Requested intent must never replace canonical actual/readback truth.

8. **Cross-screen runtime parity against the current tested backend remains unqualified** until the immutable candidate is installed and exercised on the target Home Assistant.

## Closure rule

An open issue may move to the closed section only when all of the following are true:

- the owning backend/UX contract is explicit;
- the owning regression test is green;
- the exact immutable candidate SHA/tag is identified;
- target Home Assistant evidence is recorded in `release/QUALIFICATION.json`;
- refresh/reload/restart behavior is covered where persistence is involved;
- documentation and ownership maps are updated in the same change.

Do not silently close issues through frontend inference, fallbacks or optimistic UI state.

## Closed structurally after migration baseline

- Frontend-derived supervisory/dashboard meaning was removed in v1.0.0-rc.5. Global supervisor status, trust, attention, opportunity and recommendation consume backend-owned semantics and fail closed when unavailable.

The first stable HACS release must not silently close remaining items without explicit tests and target-runtime evidence.

## Observed target Home Assistant failures — screenshot recovery (2026-10-11)

Captured target UX showed zero active vehicles (four registered), no useful Overview fleet, missing charger/vehicle commands, nonworking appearance Save, Utility Plug rendered with car artwork, unhelpful Activity timestamps and a largely empty Energy Insights panel. This is direct product acceptance evidence; previous source-level green checks did not detect all of it.

Recovery branch `work/ux-structural-closure-20261011` implements source corrections for: backend Command V2 rows without optional `label`; exact canonical `asset.lifecycle_status` reads and backend-owned alias write with canonical readback; visible inactive fleet on Overview; explicit appearance-picker editor binding; replaced wrong Utility Plug raster with backend-maintained schematic illustration; per-subject Activity media, filter/sort/group, live-state/event distinction and deeper detail disclosure.

The companion Mobility backend branch `work/ux-activity-evidence-20261011` adds actual UTC command completion timestamps and labels current status rows as `current_state`. The UX cannot show historical time for those live snapshots; the backend branch must deploy before command-event timestamps appear.

**NOT CLOSED until proven on the target HA:** actual 4-vehicle lifecycle states and authorized reactivation, all physical charger matches, image choice persistence, command invocation/readback, genuine Energy per-asset period metering/financial attribution, Activity chronology, browser refresh/selection persistence, responsive desktop/tablet/phone and rollback. No fake vehicle activation, event times or kWh/EUR values should be accepted as repair.

**Charger relationship correction:** charger list and detail previously showed "No vehicle assigned" whenever physical vehicle identity was not proven, despite a backend-published configured assignment. The ChargerProjection now carries configured, effective and physically proven vehicle IDs separately, preserving duplicate/conflict rejection from `MOBILITY_EXPERIENCE_V2`. The list labels the configured assignment; a physical badge still requires actual identity proof. The charger profile label now resolves via the exact canonical `asset.profile_id` and backend profile catalog.

## Structural recovery verification checkpoint — 2026-10-11

The recovery source now keeps inactive registered vehicles visible, distinguishes physical from configured/effective charger relations, uses optional command labels without discarding executable command metadata, and separates command-result events from current-state snapshots. The generated `dist/` was rebuilt from the same recovery branch after source changes. **These are source/build facts only**: this file does not authorize a new stable HACS release, does not mark missing target-HA evidence as complete, and does not turn static Command V2 simulation into physical execution proof.

The release candidate remains blocked until the exact branch SHA passes complete Validate, package digest identity and actual target-HA lifecycle/edit/command/readback, including two distinct Audi Q8 identities, all inactive vehicles, Utility Plug artwork, refresh/reload/restart, responsive device layouts and rollback. The backend HACS mirrors are candidates with `approved_release=false`; a green backend main cannot close this UX runtime gate.
