# v1.0.0-rc.18 — HACS full-tree delivery correction TEST CANDIDATE

## Purpose

Correct the HACS release model using the behavior proven from current HACS source and clean Home Assistant reinstall evidence.

## Root cause

For tagged HACS plugins, GitHub Release assets are preferred as install payload when any assets exist. The previous RHI UX model attached checksum/manifest/qualification files as “evidence-only” assets. On a clean install HACS therefore installed only those files and never materialized the immutable tag's complete `dist/` tree, leaving `rhi-mobility-ux.js` and `assets/` absent.

## Correction

- GitHub Release remains the HACS-visible version surface but contains **zero assets**.
- The immutable Git tag owns the complete `dist/` package.
- `content_in_root: false` keeps `dist/` as the remote plugin package root.
- Candidate publication and stable promotion both fail if any GitHub Release asset exists.
- HACS install simulation now models current tagged-release selection semantics before projecting the `dist/` tree.
- Qualification remains repository-governed and is not uploaded as a release asset.

## Product behavior

No Mobility product semantics are changed from rc.17. Overview, Vehicles, Chargers, Charging, detail screens, No charger semantics, URL-authoritative routing and fail-closed behavior are preserved.

## Compatibility

- Mobility UX: 1.0.0-rc.18
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: R43.2.60
- Tested backend baseline: R43.2.65
- Rollback: `v1.0.0-rc.17`

Target Home Assistant qualification must use a clean HACS install and prove that `www/community/rhi-mobility-ux/` contains `rhi-mobility-ux.js` plus the packaged `assets/` tree before runtime promotion.
