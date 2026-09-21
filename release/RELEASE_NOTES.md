# v1.0.0-rc.16 — Overview completion and product-contract hardening TEST CANDIDATE

## Scope

In-place evolution of the existing Mobility Overview. This release does **not** replace the rc.15 information architecture.

### Overview completion

- preserves the compact Mobility-first Overview and existing operational actions;
- makes the URL route authoritative so Overview refresh stays on Overview instead of falling back to Vehicles;
- persists/restores the relevant browser scroll position per Mobility route;
- centralizes selected-charger unset semantics in one vehicle adapter model;
- renders backend-owned `allow_none / none_value` as **No charger** across consumers of that shared model;
- renders a missing selected-charger contract as **N/A** instead of inventing an option;
- replaces loose charger “available” counting with one shared charger availability projection based on canonical V1 operating state;
- shows free / in use / unavailable / disabled / N/A counts without counting unknown states as free;
- fails closed as N/A for clearly invalid negative duration-style comfort presentation;
- stops promoting raw activity state/type values into human-readable Recent activity messages when the backend message is absent;
- renders missing global Attention as N/A while preserving backend-owned supervisor meaning when present.

## Product governance

Adds normative product guidance and a backend interface backlog.

- one Mobility semantic model behind all tabs;
- tabs are projections, not independent semantic owners;
- no mocked backend fields;
- HA-native user → vehicle focus and per-user rights are future backend-interface work;
- V1 remains `MOBILITY_PUBLIC_RUNTIME_V1`; future V2.x fields are adopted only through an explicit compatibility change.

## Compatibility

- Mobility UX: 1.0.0-rc.16
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: R43.2.60
- Tested backend baseline: R43.2.65
- Rollback release: `v1.0.0-rc.15`

Target Home Assistant qualification remains required. In particular, prove route refresh, position restoration, No charger read/write/readback, Overview semantic fail-closed behavior, HACS update and rollback.
