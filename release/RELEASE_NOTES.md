# v1.0.0-rc.21 — vehicle picker TEST CANDIDATE

## Purpose

Complete the Vehicles management flow with one package-owned vehicle picker for vehicle type and colour while Mobility persists only the selected `vehicle.image_key`.

## Changes

- adds a structured UX-owned vehicle visual catalog with verified selectable artwork for Audi Q8, BMW iX1 and Mercedes-Benz GLA plus the generic guest vehicle;
- adds a Vehicle / Colour picker directly on each vehicle card;
- stores one canonical visual key through the backend-published `vehicle.image_key` write surface;
- preserves legacy image keys through deterministic aliases;
- resolves canonical keys to packaged imagery, while legacy Renault Scenic / Volkswagen ID.4 placeholder keys fail safe to the generic vehicle fallback until distinct verified artwork exists;
- applies package-owned colour rendering consistently across Overview, Vehicle Management and vehicle detail without moving paint/catalog semantics into backend;
- keeps picker fail-closed when the backend does not publish the required writable property;
- includes the rc.19 top-navigation alignment and rc.20 vehicle-management workspace.

## Compatibility

- Mobility UX: 1.0.0-rc.21
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Required backend: M0.9.29
- Tested backend baseline: M0.9.29
- Rollback: `v1.0.0-rc.18`

## Asset-quality guard

Model-specific visuals may only be offered by the picker when their packaged artwork is verified and byte-distinct from the generic fallback and from other verified models. Placeholder/aliased visuals remain readable for backward compatibility but are not selectable as new visual identities.
