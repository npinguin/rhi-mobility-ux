# v1.0.0-rc.21 — vehicle picker TEST CANDIDATE

## Purpose

Complete the Vehicles management flow with one package-owned vehicle picker for vehicle type and colour while Mobility persists only the selected `vehicle.image_key`.

## Changes

- adds a structured UX-owned vehicle visual catalog for Audi Q8, BMW iX1, Mercedes-Benz GLA, Renault Scenic E-Tech, Volkswagen ID.4 and generic guest vehicles;
- adds a Vehicle / Colour picker directly on each vehicle card;
- stores one canonical visual key through the backend-published `vehicle.image_key` write surface;
- preserves legacy image keys through deterministic aliases;
- resolves canonical keys back to the existing packaged model imagery;
- applies package-owned colour rendering without moving paint/catalog semantics into backend;
- keeps picker fail-closed when the backend does not publish the required writable property;
- includes the rc.19 top-navigation alignment and rc.20 vehicle-management workspace.

## Compatibility

- Mobility UX: 1.0.0-rc.21
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Required backend: M0.9.29
- Tested backend baseline: M0.9.29
- Rollback: `v1.0.0-rc.18`
