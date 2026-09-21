# v1.0.0-rc.15 — Source ownership and structured HACS package TEST CANDIDATE

## Scope

Structural package release over rc.14. Mobility product semantics and user flows remain unchanged.

- replaces historical numbered source-file ordering with explicit `src/manifest.json`;
- introduces explicit source ownership: app, runtime, domain adapters/models, UI components/screens and assets;
- removes the redundant `src/assets/files/` layer;
- makes `src/assets/` the single canonical artwork tree;
- preserves asset categories one-to-one under `dist/assets/`, including `branding/`, `vehicles/` and `chargers/`;
- allows future real categories such as `profiles/` or `manufacturers/` without build-code changes;
- removes the parallel generated repository-root `assets/` tree;
- generates `dist/PACKAGE_MANIFEST.json` with package file hashes and asset categories;
- makes `dist/` the complete HACS plugin package root;
- stops attaching `rhi-mobility-ux.js` as a GitHub Release asset so HACS does not fall into single-file plugin mode and omit nested assets;
- keeps GitHub Release assets evidence-only while the immutable tag owns the installable `dist/` tree;
- adds source-ownership and HACS-package gates.

## Compatibility

- Mobility UX: 1.0.0-rc.15
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Rollback release: `v1.0.0-rc.14`

Target Home Assistant qualification must prove HACS installs the complete package tree and that structured assets resolve under `/hacsfiles/rhi-mobility-ux/assets/...`.
