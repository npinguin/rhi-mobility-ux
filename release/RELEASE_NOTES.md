# v1.0.0-rc.20 — vehicle management workspace TEST CANDIDATE

## Purpose

Evolve the existing Vehicles tab into the primary Mobility vehicle-management workspace without duplicating backend ownership or rebuilding Home Assistant configuration flows in the UX.

## Changes

- replaces the generic supervisor-heavy Vehicles header with a focused vehicle-management hero and fleet summary;
- adds All / Active / Disabled / Attention filters and configured-order / name sorting;
- exposes one HA-native **Manage vehicles & profiles** entry point to the existing `rhi_mobility` integration configuration;
- keeps guest vehicle add/edit/remove and vehicle profile add/edit/remove in the Mobility Options flow;
- makes lifecycle Activate / Disable explicit on vehicle cards while preserving the backend-owned lifecycle write contract;
- retains backend-published readiness, charger assignment, charge-power controls and quick actions;
- distinguishes selected charger assignment from physical connection in the fleet summary;
- keeps inactive vehicles compact and deliberately recoverable;
- does not introduce a second profile store, vehicle registry, command catalog or inferred vehicle-management semantics.

## Compatibility

- Mobility UX: 1.0.0-rc.20
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: R43.2.60
- Tested backend baseline: R43.2.65
- Rollback: `v1.0.0-rc.19`
