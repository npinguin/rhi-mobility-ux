# v1.0.0-rc.25 — hierarchical vehicle picker PILOT

## Purpose

Deliver a testable Vehicle / Colour pilot that preserves the current vehicle identity, covers every Mobility vehicle profile already present today, and scales to the future artwork library without a large flat picker.

## Pilot behavior

- compact hierarchy: Brand → Model → Variant → Colour;
- current vehicle key prefills the hierarchy exactly where a known Mobility alias exists;
- unknown keys never fall back to the first catalog row;
- changing a higher level clears only the dependent lower levels;
- save remains disabled until a complete valid visual key exists;
- Vehicle Management and Vehicle Detail use the same shared picker;
- the persisted Mobility `vehicle.image_key` remains the only durable visual selection truth;
- package artwork is preferred when available; current profile/source artwork remains the deterministic fallback for models not yet carrying dedicated package artwork;
- a different vehicle model is never used as fallback artwork.

## Current Mobility profile coverage

1. Audi Q8 TFSI e 55 PHEV
2. Volkswagen ID.4 Business Pro 77 kWh
3. Mercedes-Benz GLA PHEV
4. BMW X1 PHEV
5. Renault Scenic Techno EV
6. Guest PHEV 1-phase
7. Guest EV 3-phase

## Artwork pilot

- adds `documentation/VEHICLE_ARTWORK_SOURCES.json` as the machine-readable provenance/source registry;
- records high-resolution permissive source candidates for current real models;
- keeps dedicated package artwork where already present;
- keeps ID.4 and Scenic on profile/source artwork until their processed package masters land;
- establishes the next expansion target as 10 Belgian fleet/leasing brands × 4 current models.

## Compatibility

- Mobility UX: 1.0.0-rc.25
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Required backend: M0.9.29
- Tested backend baseline: M0.9.29
- Rollback: `v1.0.0-rc.24`

## Pilot qualification still required on target HA

- ID.4 opens as Volkswagen → ID.4 → Business Pro 77 kWh, not another default vehicle;
- opening and closing without save changes nothing;
- explicit brand/model/variant/colour selection updates preview coherently;
- save writes `vehicle.image_key`, reload preserves it, HA restart preserves it;
- profile/source-only artwork remains the same vehicle model before/during/after picker use.
