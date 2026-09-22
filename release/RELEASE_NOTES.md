# v1.0.0-rc.24 — hero artwork + visible Vehicle & colour TEST CANDIDATE

## Purpose

Refine the mobile Vehicle card hierarchy after target-HA review: artwork should read as part of the hero surface, not as a separate image box, and the Vehicle / Colour picker must be visibly discoverable.

## Changes

- renders vehicle artwork as large hero background-art inside the vehicle panel;
- keeps vehicle text and controls as foreground content over a readability gradient;
- renders charger artwork with the same visual language, but smaller and deliberately cropped;
- reduces the charger panel to a compact supporting visual rather than a second large hero;
- adds an explicit `Vehicle & colour` edit control directly inside the vehicle hero;
- removes the duplicate bottom-row Appearance action so the appearance entrypoint has one clear visual owner;
- keeps the shared rc.22 Vehicle / Colour picker and rc.23 mobile density rules;
- preserves backend-owned `vehicle.image_key` persistence and Option A verified-model gating.

## Compatibility

- Mobility UX: 1.0.0-rc.24
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Required backend: M0.9.29
- Tested backend baseline: M0.9.29
- Rollback: `v1.0.0-rc.23`
