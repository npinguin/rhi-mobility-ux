# Robotix Home Intelligence Mobility UX

Public HACS Dashboard/plugin repository for Robotix Home Intelligence Mobility UX.

![Robotix Home Intelligence Mobility UX](dist/assets/vehicles/vehicle_bmw_ix1_phev.png)

- License: GPL-3.0-only
- HACS category: Dashboard
- Runtime artifact: `rhi-mobility-ux.js`
- Source candidate: `v1.0.0-rc.11`
- Public backend contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Tested backend baseline: `R43.2.65`

## Release status

The repository distinguishes **source candidate** from **published release**:

- `package.json`, `COMPATIBILITY.json` and `RELEASE_MANIFEST.json` describe the candidate currently on `main`;
- GitHub Releases is the authority for immutable published versions that HACS can install;
- a candidate on `main` is **not** a release until `publish-hacs.yml` has automatically created its immutable tag and normal GitHub Release. TEST CANDIDATE status is tracked in release metadata/qualification, not the GitHub prerelease flag.

Do not infer the installed HACS version from this README. Check the installed HACS version or GitHub Releases. Stable promotion is a separate manual gate after target runtime and rollback qualification.

The current source candidate is `v1.0.0-rc.11`. It preserves all existing Mobility routes and screens while aligning the shared shell with Energy: identical header proportions and hierarchy, the same canonical transparent Robotix company mark, compact gray icons on the secondary navigation, and responsive brand-slot behaviour.

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

## Shared company branding

The canonical company mark is `src/assets/files/branding/company-logo.svg`. It is byte-identical to the shared RHI company logo used by Energy and is copied unchanged by the build. Header sizing is controlled through the shared `--rhi-company-*` slot tokens. See `documentation/BRANDING.md`.

## Candidate visibility and footer

TEST CANDIDATE releases are normal GitHub Releases so HACS exposes them without enabling beta/prerelease versions. Qualification state is tracked separately in `release/QUALIFICATION.json`.

The shared footer must render healthy state as `RHI Mobility UX <version> · Backend <version>`. Problems add only one short amber/red issue label with technical detail in its tooltip. See `documentation/UX_FOOTER_STANDARD.md`.
