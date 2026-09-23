# v1.0.0-rc.35 — HACS runtime asset delivery hotfix

## Scope
- fixes the real HACS frontend-plugin install model: only files directly under `dist/` are downloaded;
- replaces the broken nested `dist/assets/**` delivery with deterministic flat runtime asset filenames in `dist/`;
- keeps canonical source assets structured under `src/assets/{branding,vehicles,chargers,heroes}`;
- changes the runtime resolver so structured catalog paths map to flat installed filenames;
- replaces the recursive test install with a simulation of HACS `gather_files_to_download()` semantics;
- requires source-to-flat-package byte parity for every runtime image.

## Rollback
Rollback candidate: `v1.0.0-rc.34`.

## Qualification
Static/package/HACS validation must pass before publication. Target Home Assistant proof must confirm the nine hero scenes and existing vehicle/charger artwork load from `/hacsfiles/rhi-mobility-ux/asset--*`.
