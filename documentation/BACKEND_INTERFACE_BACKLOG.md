# Mobility Backend Interface Backlog

## rc.41 V2-first contract gate

Backend issue **rhi-mobility #107 — Mobility UX — V2 contract-gap confirmation for rc.41** is the authority gate for new status semantics.

New UX work follows:

```text
Canonical property V1 = per-asset canonical facts
Policy V2         = thresholds and interpretation rules
Experience V2     = user-facing conclusions
UX                = select, aggregate, format and present
```

UX may not add or retain any legacy product dependency and may not reconstruct a missing V2 product fact locally. Missing configuration completeness, runtime/data health, charge demand, policy classification, site-capacity or other unconfirmed semantics remain backend ownership gaps until the owning V2 contract publishes them.

This backlog captures product capabilities required by Mobility UX that are not yet authoritative in the current V2 public contracts.

Rule: **do not mock these in UX**. Until the backend publishes the contract, the relevant V2 surface remains empty, unavailable, N/A or an explicit contract gap.

## P0 cross-domain Energy contracts — native truth required

Current Energy backend publishes native D0/D1 planning totals as sensors with `canonical_source=rhi_energy.runtime` and exact `metric_key`. These are not per-asset canonical properties whose `asset_id` is `D0` or `D1`.

For reliable Mobility Intelligence and Insights, Energy must also publish:

- complete D0/D1 planning detail, per-asset allocations and exact identity joins (Energy backend #249 / #242);
- per-asset metering and financial attribution with **explicit period identity, units, availability and quality**. A property key containing `today` is not proof of a period;
- configured versus effective strategy truth through an explicit semantic contract. An editable strategy property only proves a configurable setting, not its effective runtime interpretation;
- requested/actual/readback distinction and persistence across changes and reloads.

Until published, the affected cards must show unavailable/N/A. No property-name substring classifiers, sum-of-known-partials, fake totals or shadow Strategy owner are allowed in Mobility UX.

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

Canonical Mobility properties expose charger operating/connection facts. UX may present only the documented product projection supported by those facts; richer availability categories require an explicit backend product semantic.

Unknown/unmapped charger state renders N/A and must not be counted as free.

### Human-readable activity

Overview Recent activity needs a backend-owned human-safe message/summary for each activity row.

Until available:

- timestamp may be shown;
- raw `activity_state` / `activity_type` must not be promoted to a fabricated human event sentence;
- missing message renders N/A.

### Comfort/readiness semantic validity

Historical source data demonstrated that technically formatted climate/comfort values can be invalid user meaning, for example negative duration-like values.

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

No future V2.x field may be guessed, reverse-engineered from raw Home Assistant entities, or locally persisted as a second truth by UX.


## Historical Runtime V2 property-completeness evidence — retired from UX

Mobility M0.9.44 publishes per-asset `property_publication` evidence on Runtime V2, including expected and catalog property keys.

The legacy Runtime V2 catalog was removed from UX during the canonical-only migration. UX now reports directly published canonical property keys and any ambiguity, but does not claim expected-property completeness without a replacement backend-owned expected-key catalog. Such a catalog remains a backend interface gap; no UI inference or old-contract fallback is permitted.
