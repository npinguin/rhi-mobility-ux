# v1.0.0-rc.22 — shared Vehicle Detail picker TEST CANDIDATE

## Purpose

Close rc.21 cross-screen visual drift: Vehicle Detail must use the same verified Vehicle / Colour picker as Vehicle Management, and Overview rendering must execute without an undeclared visual filter.

## Changes

- introduces one shared `HomeBrainVehicleVisualPicker` helper for catalog selection, writable-state handling and picker markup;
- uses that same picker on Vehicle Management and Vehicle Detail;
- removes the raw generic text editor path for `vehicle.image_key` on Vehicle Detail;
- previews vehicle type and colour changes live on the Vehicle Detail hero before save;
- previews type/colour drafts live on Vehicle Management cards;
- fixes the Overview vehicle-row `visualFilter` runtime scope regression;
- adds execution-level bundle smoke coverage that actually renders an Overview vehicle row and verifies Vehicle Detail emits the shared picker rather than a raw text input;
- preserves the Option A catalog rule: Audi Q8, BMW iX1 and Mercedes-Benz GLA plus generic Guest are selectable; Scenic and ID.4 remain compatibility-only until distinct verified artwork exists.

## Compatibility

- Mobility UX: 1.0.0-rc.22
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Required backend: M0.9.29
- Tested backend baseline: M0.9.29
- Rollback: `v1.0.0-rc.21`
