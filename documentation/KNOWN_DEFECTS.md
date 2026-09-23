# Known Defects and Open Migration Issues

This file is the authoritative list of unresolved Mobility UX product/runtime issues. These are **not accepted technical or feature debt**. They stay open until the owning contract/test plus target Home Assistant evidence proves closure.

## Open issues

1. **Vehicle/charger picker runtime qualification is not closed.**
   - Static CI and package validation are not sufficient evidence.
   - Vehicle and charger profile/appearance edits must be proven on the target Home Assistant through: open → edit hierarchy → save → canonical readback → refresh → reload/restart.
   - A failed service call must keep the editor open and fail visibly; service acceptance is not durable truth.

2. **V2 interface migration is incomplete.**
   - Target authority is `MOBILITY_PUBLIC_RUNTIME_V2` + `MOBILITY_EXPERIENCE_V2` + `MOBILITY_POLICY_V2` plus canonical per-asset V2 semantic configuration properties.
   - Frozen V1 is compatibility-only and must not become a new UX authority.
   - Remaining UX/runtime paths that still depend on V1 property indexes, V1-only metadata or V1-shaped assumptions must be identified, migrated to V2-first consumption and covered by owned regression tests.
   - No new feature may introduce a V1-only dependency. Any temporary compatibility fallback must be explicit, fail-closed and removable without changing product semantics.
   - Migration is only closed when target runtime evidence proves the V2 read/write path for the affected feature and documentation/tests no longer describe V1 as the primary interface.

3. **Picker semantic-value versus Home Assistant transport-value handling requires target proof.**
   - Backend/domain truth uses stable semantic identifiers such as profile IDs.
   - Home Assistant select entities may require human display labels at the transport boundary.
   - UX must translate only at the generic write boundary and must never promote a display label to semantic truth.
   - The current rc.45 transport fix is static/CI proven; target runtime proof remains required.

4. **Canonical visual rendering is not yet product-acceptable.**
   - Blank vehicle imagery during/after edit is a release blocker when a canonical visual key is available.
   - Wrong-model fallbacks are forbidden. Missing/invalid artwork must fail visibly to a neutral placeholder rather than display another real model.
   - Current device imagery quality is below the intended premium standard. Functional identity/render correctness must be proven before premium asset replacement is accepted.

5. **Charger component placement can still surface valid product properties under Engineering/Unmapped** depending on deployed component contract/materialization.

6. **Some charger commands such as Restart, Identify or Unlock may still be missing** if the deployed placement/runtime parsing path does not materialize them correctly.

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
