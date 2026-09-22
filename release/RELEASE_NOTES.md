# v1.0.0-rc.26 — zero-debt current vehicle artwork

## Purpose

Remove the remaining legacy/duplicate vehicle artwork paths and make the complete current real-vehicle scope package-owned, model-correct and fail-closed.

## What changed

- Volkswagen ID.4 and Renault Scenic E-Tech now have their own canonical package masters.
- BMW artwork is canonically named X1 PHEV; old iX1 keys remain input aliases only.
- Removes separate hero copies, default/unknown copies and duplicate guest asset files.
- One real model now maps to exactly one package master.
- Hero/detail/overview render the same master with presentation-specific crop/scale only.
- Removes legacy profile-name artwork inference from runtime.
- Existing persisted legacy visual keys normalize through aliases to canonical visual identities.
- Generic Guest PHEV/EV deliberately share the one generic fallback master.

## Current real-model package coverage

1. Audi Q8 TFSI-e
2. BMW X1 PHEV
3. Mercedes-Benz GLA PHEV
4. Renault Scenic E-Tech
5. Volkswagen ID.4

All five are required by CI to:
- resolve to package artwork;
- resolve to five different byte hashes;
- never equal the fallback bytes;
- exist in the exact canonical vehicle-file inventory.

## Removed legacy artwork files

- default_vehicle.png
- vehicle_audi_q8_hero.png
- vehicle_bmw_ix1_phev.png
- vehicle_bmw_ix1_phev_hero.png
- vehicle_guest.png
- vehicle_guest_hero.png
- vehicle_mercedes_gla_hero.png
- vehicle_renault_scenic_techno_ev.png
- vehicle_unknown_profile.png
- vehicle_unknown_profile_hero.png
- vehicle_vw_id4.png

## Compatibility

- Mobility UX: 1.0.0-rc.26
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Required backend: M0.9.29
- Tested backend baseline: M0.9.29
- Rollback: `v1.0.0-rc.25`

## Target HA proof required

For ID.4 and Scenic in particular:
- picker opens on the correct current identity;
- hero/detail/overview all show the same correct model;
- opening/closing picker without save changes nothing;
- changing colour never changes model artwork;
- refresh and HA restart preserve the selected key and model artwork.
