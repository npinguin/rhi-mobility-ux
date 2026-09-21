# Robotix Home Intelligence Mobility UX

Public HACS Dashboard/plugin repository for Robotix Home Intelligence Mobility UX.

![Robotix Home Intelligence Mobility UX](dist/assets/vehicles/vehicle_bmw_ix1_phev.png)

- License: GPL-3.0-only
- HACS category: Dashboard
- Runtime artifact: `rhi-mobility-ux.js`
- Source candidate version: see `package.json` (authoritative)
- Release contract/backend baseline: see `release/product.json` (authoritative)

## Release status

The repository distinguishes **source candidate** from **published release**:

- `package.json`, `COMPATIBILITY.json` and `RELEASE_MANIFEST.json` describe the candidate currently on `main`;
- GitHub Releases is the authority for immutable published versions that HACS can install;
- a candidate on `main` is **not** a release until `publish-hacs.yml` has automatically created its immutable tag and normal GitHub Release. TEST CANDIDATE status is tracked in release metadata/qualification, not the GitHub prerelease flag.

Do not infer the installed HACS version from this README. Check the installed HACS version or GitHub Releases. Stable promotion is a separate manual gate after target runtime and rollback qualification.

Current candidate identity is intentionally not duplicated in this README. Read `package.json` and `release/product.json`. The Mobility Overview remains contract-driven: Vehicles, Charging now, Chargers and Attention are primary overview truth; vehicle readiness, security, comfort, maintenance and direct actions remain backend-owned.

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
npm run check:test-ownership
npm run release:sync   # only when preparing a new candidate
```

`npm test` performs the candidate build and all owned test suites. `dist/rhi-mobility-ux.js` is generated; do not edit it manually. Publication uses this committed validated artifact and does not rebuild it.

## Migration traceability

Legacy source baseline: `R22.12.11.30`. The original package checksum and exact legacy JS/YAML artifacts are recorded under `archive/legacy/`.

## Shared company branding

The canonical company mark is `src/assets/files/branding/company-logo.svg`. The build preserves the canonical generated copies and injects the same SVG into the JS runtime bundle for HACS-safe delivery. Header sizing is independently owned by the shared `--rhi-company-*` layout tokens. See `documentation/BRANDING.md`.

## Candidate visibility and footer

TEST CANDIDATE releases are normal GitHub Releases so HACS exposes them without enabling beta/prerelease versions. Qualification state is tracked separately in `release/QUALIFICATION.json`.

The shared footer must render healthy state as `RHI Mobility UX <version> · Backend <version>`. Problems add one short amber/red `issues · details` summary that expands in-page to show the concrete runtime/backend conditions and verification guidance. See `documentation/UX_FOOTER_STANDARD.md`.

## Test ownership

Testing follows the same ownership model as the code: one invariant, one test owner. See `documentation/TEST_GOVERNANCE.md` and `tests/OWNERSHIP.json`. A local implementation change should not require unrelated test suites to learn the new implementation.
