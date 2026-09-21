# v1.0.0-rc.9 — Mobility layout hardening TEST CANDIDATE

## Scope

This candidate is a presentation-only hardening pass over rc.8. Existing routes, screens, backend semantics, commands and content structure remain intact.

## Included

- fixes the Robotix.be logo runtime path by publishing the official supplied logo at the exact HACS root asset location used by the shared header;
- keeps the official logo sharp, right aligned and sized consistently in the canonical header;
- makes the shared status/outcome strip the single layout authority across Vehicles, Chargers and other Mobility surfaces;
- forces the status rail into five equal horizontal cells on desktop instead of collapsing into a vertical text column;
- keeps compact horizontal scrolling on smaller widths instead of destroying the layout;
- slightly tightens header grid proportions and content spacing without changing navigation structure;
- adds regression coverage for:
  - official logo existence at the HACS runtime path;
  - shared five-column status rail;
  - shared metric cell layout.

## Compatibility

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Previous candidate: `v1.0.0-rc.8`

## Qualification status

Static/HACS validation is required before TEST CANDIDATE publication. Target Home Assistant proof should verify Vehicles first, then Chargers and both detail screens at desktop and tablet widths.
