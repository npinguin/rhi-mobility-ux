# RHI UX Source and Package Governance

This document is normative for Mobility UX and is the reference structure to be applied to other RHI UX packages.

## Principle

**One source concern, one owner. One canonical source asset tree, one HACS package tree.**

Do not create parallel runtime trees, duplicate asset roots, numbered filenames used as dependency management, or release-specific patch layers.

## Canonical source skeleton

```text
src/
  manifest.json
  OWNERSHIP.json
  app/
    asset-paths.js
    header-and-navigation.js
  runtime/
    ha-contract-runtime.js
  domain/
    adapters/
      intelligence-model-alignment.js
      vehicle-adapter.js
      charger-adapter.js
    models/
      asset-factory.js
  ui/
    components/
      asset-shell.js
    screens/
      vehicle-detail.js
      charger-detail.js
      charger-maintenance.js
      mobility-dashboard.js
      router.js
  assets/
    branding/
    vehicles/
    chargers/
    profiles/        # create when real profile assets exist
```

`src/manifest.json` owns bundle module order. File names do not encode load order.

## Dependency direction

```text
app/package glue
      ↓
runtime contract boundary
      ↓
domain adapters/models
      ↓
ui components
      ↓
ui screens
```

Screens/components never read Home Assistant states or public Mobility entity names directly. Runtime/adapters do not own screen layout.

Split a file when ownership changes, not merely because the file is large. Avoid generic provider frameworks, event buses, reflection layers or registries without a proven repeated need.

## Asset framework

`src/assets/` is the only canonical artwork source.

Asset categories are directories, not code branches. The build recursively discovers every directory below `src/assets/` and preserves its relative path under `dist/assets/`.

Examples:

```text
src/assets/chargers/charger_peblar.png
→ dist/assets/chargers/charger_peblar.png
→ /hacsfiles/rhi-mobility-ux/assets/chargers/charger_peblar.png

src/assets/vehicles/vehicle_audi_q8.png
→ dist/assets/vehicles/vehicle_audi_q8.png
→ /hacsfiles/rhi-mobility-ux/assets/vehicles/vehicle_audi_q8.png
```

Adding `src/assets/profiles/`, `src/assets/manufacturers/` or another real category requires no build-code change.

The backend owns the semantic `image_key`; UX/package code only resolves that key to a packaged relative asset path.

## HACS package

`dist/` is the complete HACS install package:

```text
dist/
  rhi-mobility-ux.js
  rhi-mobility-ux.js.sha256
  PACKAGE_MANIFEST.json
  assets/
    branding/
    vehicles/
    chargers/
    ...
```

There is no generated root-level `assets/` copy.

For tagged HACS plugin repositories, the GitHub Release must contain **no assets at all**. HACS prefers release assets for tagged plugin installs when any are present; therefore even checksum or qualification files can divert installation away from the immutable `dist/` tree. The immutable tag carries the complete package under `dist/`; the GitHub Release carries release notes only.

## Package manifest

`dist/PACKAGE_MANIFEST.json` is generated. It records:

- package version;
- source manifest schema;
- HACS package root;
- runtime filename;
- asset categories;
- every package file with byte size;\n- the runtime JS SHA-256.

It is evidence, not a second source of truth. Per-asset cryptographic hashes are intentionally not duplicated here; source↔dist byte parity and immutable Git tags already protect the asset tree.

## Ownership gates

- `src/OWNERSHIP.json` defines source owners.
- `tools/check-source-ownership.mjs` rejects legacy/parallel source folders and numeric load-order filenames.
- `tools/check-hacs-package.mjs` verifies the installable dist tree and release-delivery rules.
- `tools/check-documentation-drift.mjs` rejects stale normative paths/terminology and escaped migration artifacts.
- `tests/OWNERSHIP.json` independently owns test boundaries.

## Mean and lean rule

A new abstraction requires at least one of:

1. a second real implementation that needs the same abstraction;
2. repeated drift that one owner cannot contain;
3. a public package contract that must be stable.

Otherwise keep the implementation local and explicit.

## Migration sequence

Use this order when aligning another RHI UX package, including Energy:

1. **Governance first** — establish release/test/source ownership before moving files.
2. **Restructure source without semantic redesign** — move code into owner folders and introduce an explicit source manifest.
3. **Normalize assets** — move to one canonical `src/assets/<category>/` tree and remove duplicate generated roots.
4. **Update build/package gates** — make `dist/` the complete install package and add package/install simulation.
5. **Generate and commit `dist/` before opening the PR** — metadata/version and generated package must never be temporarily out of sync in review.
6. **Run the complete PR gate** — candidate build, owned tests, deterministic rebuild, committed-dist equality, HACS validation.
7. **Merge and publish idempotently** — if a tag/release already exists, verify identical package bytes and finish green without mutation.
8. **Only then perform target Home Assistant qualification**.

Never combine this migration with unrelated product/semantic redesign. Structural migration must be reviewable and reversible on its own.
