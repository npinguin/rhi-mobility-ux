# v1.0.0-rc.25 — full current vehicle picker catalog TEST CANDIDATE

## Purpose

Make the Vehicle / Colour picker preserve the current vehicle identity and cover the complete set of Mobility vehicle profiles already present today.

## Changes

- removes implicit fallback to the first picker row when the current visual key is unknown;
- recognises current Mobility profile/source image keys so the picker opens on the actual vehicle;
- aligns picker catalog with current Mobility vehicle profiles: Audi Q8 TFSI e, VW ID.4 Business Pro 77 kWh, Mercedes GLA PHEV, BMW X1 PHEV, Renault Scenic Techno EV, Guest PHEV 1-phase and Guest EV 3-phase;
- replaces the incorrect BMW iX1 UX identity with the Mobility-owned BMW X1 PHEV identity while retaining old UX aliases for compatibility;
- splits generic Guest into the two current Mobility guest profiles;
- keeps ID.4 and Scenic source/profile artwork instead of forcing a wrong package fallback;
- applies UX colour treatment on top of profile/source artwork where package-specific artwork is not yet available;
- unknown future visual keys now require explicit user selection and never silently become Audi/Mercedes/another first catalog entry.

## Compatibility

- Mobility UX: 1.0.0-rc.25
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Required backend: M0.9.29
- Tested backend baseline: M0.9.29
- Rollback: `v1.0.0-rc.24`
