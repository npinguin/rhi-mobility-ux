# v1.0.0-rc.4 — closure governance and regression TEST CANDIDATE

## Scope

This candidate preserves `MOBILITY_PUBLIC_RUNTIME_V1` and the existing UX architecture. It closes release-evidence drift and adds focused regression coverage without introducing a new framework or runtime authority.

## Included

- keeps the UX boundary at backend V1 → runtime/adapters → canonical viewmodels → screens/components;
- fixes candidate → runtime qualification → stable promotion so qualification evidence can be recorded after immutable candidate publication without moving or republishing the candidate tag;
- binds stable promotion to the exact candidate tag and SHA recorded in `release/QUALIFICATION.json`;
- keeps runtime JS/checksum immutable while allowing final qualification evidence to be attached at stable promotion;
- aligns release-governance documentation and automated checks;
- archives the historical rc.1 validation transcript instead of presenting it as current candidate evidence;
- adds focused release-lifecycle and canonical runtime regression coverage;
- preserves zero vs unavailable semantics and backend-owned command/readiness/write metadata.

## Compatibility

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Legacy migration source: `R22.12.11.30`

## Qualification status

Static validation and HACS validation are required before TEST CANDIDATE publication. Target Home Assistant install/update/render/write-readback/restart/rollback evidence remains pending until performed against the immutable candidate. Stable promotion remains blocked until that evidence is PASS and bound to the published candidate SHA.
