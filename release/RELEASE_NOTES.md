# v1.0.0-rc.37 — Energy-aligned nested assets + hero runtime fix

## Scope
- keeps the rc.36 charger occupancy semantics fix;
- restores the same nested HACS package model used successfully by RHI Energy UX: `dist/assets/**` with zero GitHub Release assets;
- removes the rc.35 flat `asset--...` runtime workaround;
- restores runtime URLs under `/hacsfiles/rhi-mobility-ux/assets/**`;
- fixes the actual hero defect: the shared hero renderer was resolving an already-resolved HACS URL a second time;
- preserves all nine approved hero masters byte-for-byte and keeps the semantic mapping unchanged;
- adds executable regression checks for exact final Overview and Strategies hero URLs.

## Packaging reference
RHI Energy UX currently uses the same HACS dashboard metadata, immutable tag `dist/` delivery, zero release assets, structured `dist/assets/` tree and source/dist asset parity. Mobility now follows that proven model again.

## Rollback
Rollback candidate: `v1.0.0-rc.36`.

## Qualification
Static/package/HACS validation must pass before publication. Target Home Assistant proof must confirm:
- `www/community/rhi-mobility-ux/assets/{branding,chargers,heroes,vehicles}` exists;
- no `asset--...` file sprawl remains in the plugin root;
- all seven tab heroes and both detail scenes render;
- rc.36 charger occupancy semantics remain intact.
