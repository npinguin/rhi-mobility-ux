# v1.0.0-rc.6 — Energy-style Mobility header and grouped navigation TEST CANDIDATE

## Scope

This candidate changes only the Mobility UX shell and navigation grouping. Existing Mobility runtime semantics, backend ownership, cards and command behavior are unchanged.

## Included

- aligns Mobility typography, spacing, blue/gray tokens and two-level header structure with the Energy UX;
- keeps the Home Intelligence / MOBILITY identity on the left;
- adds top-level modules: Mobility, Intelligence and Insights;
- groups Overview, Vehicles, Chargers and Charging under Mobility;
- groups Planning and Strategies under Intelligence;
- groups History and Log under Insights;
- keeps Robotix.be branding isolated in one replaceable, right-aligned vector brand helper;
- preserves existing dashboard and charger content by reusing the current cards for the new grouped routes;
- uses neutral placeholder routes only where no dedicated current screen exists;
- adds a regression test that guards the module/submenu ownership and route map.

## Compatibility

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Previous candidate: `v1.0.0-rc.5`

## Qualification status

Static validation and HACS validation are required before TEST CANDIDATE publication. Target Home Assistant desktop/tablet/mobile header rendering and route navigation must still be proven before stable promotion.
