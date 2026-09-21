# v1.0.0-rc.17 — HACS runtime install hardening TEST CANDIDATE

## Purpose

Correct the HACS/dashboard installation path exposed by real Home Assistant qualification of rc.16.

## HACS packaging

- makes standard HACS plugin `dist/` semantics explicit through `content_in_root: false`;
- keeps one generated package tree under `dist/` with no duplicate runtime/assets at repository root;
- binds immutable candidate verification to `dist/`, `hacs.json` and `package.json`, so an existing tag can no longer pass while carrying stale HACS metadata;
- preserves the canonical Home Assistant resource URL `/hacsfiles/rhi-mobility-ux/rhi-mobility-ux.js`.

## Dashboard migration

- Overview is the only visible Lovelace Mobility view;
- Vehicles, Vehicle & Charger Detail, Chargers, Charging, Planning, Strategies, History and Log are internal `subview: true` routes;
- RHI Mobility navigation remains the product navigation surface;
- HACS installation and Lovelace dashboard migration are documented as separate required steps.

## Product behavior

All rc.16 Overview behavior is preserved:
- one Mobility model / one ownership;
- URL-authoritative tab state and position restoration;
- No charger as a first-class backend-owned assignment;
- fail-closed N/A for missing backend semantics;
- no mocked V2.x capabilities.

## Compatibility

- Mobility UX: 1.0.0-rc.17
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: R43.2.60
- Tested backend baseline: R43.2.65
- Rollback: `v1.0.0-rc.16`

Target Home Assistant qualification must prove the installed HACS resource loads, expected custom elements register, Overview renders, internal routes remain subviews, refresh works, nested assets load, and rollback succeeds.
