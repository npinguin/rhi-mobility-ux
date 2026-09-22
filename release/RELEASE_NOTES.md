# v1.0.0-rc.23 — compact mobile Vehicles TEST CANDIDATE

## Purpose

Make Vehicle Management and Vehicle Detail genuinely phone-friendly without changing Mobility semantics or backend ownership.

## Changes

- rewrites the phone composition of active vehicle cards for density rather than stacking desktop panels;
- keeps vehicle identity and artwork together in a compact two-column hero;
- reduces the charger relationship to a compact row with small charger artwork;
- keeps the three key vehicle metrics in one compact strip;
- groups charger assignment and charge-power controls without empty rows;
- turns quick actions into touch-sized horizontal controls instead of large vertical blocks;
- collapses inactive vehicles into a single compact row with inline lifecycle/detail actions;
- makes the Vehicle / Colour picker one column on phones with 44 px touch targets;
- applies the same one-column 44 px picker rule on Vehicle Detail;
- preserves rc.22 shared picker, Option A verified visual gating, backend M0.9.29 and all existing product semantics.

## Compatibility

- Mobility UX: 1.0.0-rc.23
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Required backend: M0.9.29
- Tested backend baseline: M0.9.29
- Rollback: `v1.0.0-rc.22`
