# Mobility Backend Interface Backlog

This backlog captures product capabilities required by Mobility UX that are not authoritative in `MOBILITY_PUBLIC_RUNTIME_V1` today.

Rule: **do not mock these in UX**. Until the backend publishes the contract, the relevant V1 surface remains empty, unavailable or N/A.

## Priority — Overview completion

### HA-native user → vehicle relationship

Needed for personalized default focus and sorting.

Required backend semantics should identify, using the authenticated Home Assistant user:

- current HA user identity/reference suitable for Mobility;
- visible vehicles for that user;
- primary vehicle, if configured;
- relationship type such as primary/shared/family/guest where product-approved;
- stable relationship identifiers/revisions.

UX must not infer this relationship.

### HA-native authorization

Needed before user-specific management is exposed.

Backend should publish authoritative effective permissions/capabilities for the current HA user, at least for:

- view vehicle;
- execute vehicle action;
- edit vehicle configuration/profile;
- assign/unassign charger;
- view charger;
- execute charger action;
- edit charger configuration/profile;
- add/remove asset;
- activate/deactivate asset.

Unknown authorization fails closed.

### Charger availability summary

Overview needs truthful counts such as free / in use / unavailable.

V1 currently has canonical charger operating state. UX may present a shared, documented V1 projection for known canonical states, but a future backend interface should publish explicit product availability semantics if those categories become richer than operating state.

Unknown/unmapped charger state renders N/A and must not be counted as free.

### Human-readable activity

Overview Recent activity needs a backend-owned human-safe message/summary for each activity row.

Until available:

- timestamp may be shown;
- raw `activity_state` / `activity_type` must not be promoted to a fabricated human event sentence;
- missing message renders N/A.

### Comfort/readiness semantic validity

Observed V1 data can expose technically formatted climate/comfort values that are not valid user meaning, for example negative duration-like values.

Backend should publish product-valid comfort/readiness semantics and units. UX fails closed as N/A for clearly invalid duration-style presentation; it does not reinterpret the value.

## Vehicle management backlog

For later management work, publish or complete authoritative contracts for:

- add/remove vehicle;
- activate/deactivate vehicle;
- profile create/select/activate/deactivate;
- brand/model/family/variant/color identity;
- image key / visual profile selection;
- user ↔ vehicle relationship editing;
- per-user visibility and action rights.

## Charger management backlog

Publish or complete authoritative contracts for:

- add/remove charger;
- activate/deactivate charger;
- charger profile create/select/activate/deactivate;
- vehicle assignment including explicit no-vehicle semantics where applicable;
- minimum charge power;
- maximum charge power;
- effective permitted power for the attached/assigned vehicle;
- current configured limit versus actual power/readback.

## V2.x gate

These items may become a V2.x contract only through an explicit backend contract release and corresponding UX compatibility declaration.

No V2.x field may be guessed, reverse-engineered from raw Home Assistant entities, or locally persisted as a second truth by V1 UX.
