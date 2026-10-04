# Known Defects and Open Migration Issues

This file is the authoritative list of unresolved Mobility UX product/runtime issues. These are **not accepted technical or feature debt**. They stay open until the owning contract/test plus target Home Assistant evidence proves closure.

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
