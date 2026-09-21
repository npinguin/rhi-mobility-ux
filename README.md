# Robotix Home Intelligence Mobility UX

Public HACS Dashboard/plugin repository for Robotix Home Intelligence Mobility UX.

![Robotix Home Intelligence Mobility UX](dist/assets/vehicles/vehicle_bmw_ix1_phev.png)

- License: GPL-3.0-only
- HACS category: Dashboard
- Runtime artifact: `rhi-mobility-ux.js`
- Source candidate: `v1.0.0-rc.8`
- Public backend contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Tested backend baseline: `R43.2.65`

## Release status

The repository distinguishes **source candidate** from **published release**:

- `package.json`, `COMPATIBILITY.json` and `RELEASE_MANIFEST.json` describe the candidate currently on `main`;
- GitHub Releases is the authority for immutable published versions that HACS can install;
- a candidate on `main` is **not** a release until `publish-hacs.yml` has automatically created its immutable tag and GitHub prerelease.

Do not infer the installed HACS version from this README. Check the installed HACS version or GitHub Releases. Stable promotion is a separate manual gate after target runtime and rollback qualification.

The current source candidate is `v1.0.0-rc.8`. It preserves `MOBILITY_PUBLIC_RUNTIME_V1`, keeps the pre-refactor Vehicles/Chargers/detail routes intact, adds Overview as a separate view, and uses the official packaged Robotix.be logo asset.

## HACS installation

Add this repository to HACS as a **Dashboard** custom repository and install the desired published release. The resource is expected at:

`/hacsfiles/rhi-mobility-ux/rhi-mobility-ux.js`

See `documentation/HACS_INSTALLATION.md`.

## Architecture boundary

```text
rhi-mobility backend
        ↓
MOBILITY_PUBLIC_RUNTIME_V1
        ↓
Mobility UX adapters/runtime
        ↓
canonical UX viewmodels
        ↓
screens/components
```

Screens and components may not access Home Assistant Mobility contract entities directly. Missing canonical backend data fails closed as unavailable; the UX must not recreate backend semantics.

## Development

```bash
npm ci
npm test
npm run build
```

`dist/rhi-mobility-ux.js` is generated. Do not edit it manually.

## Migration traceability

Legacy source baseline: `R22.12.11.30`. The original package checksum and exact legacy JS/YAML artifacts are recorded under `archive/legacy/`.
