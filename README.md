# Robotix Home Intelligence Mobility UX

Public HACS Dashboard/plugin repository for Robotix Home Intelligence Mobility UX.

![Robotix Home Intelligence Mobility UX](dist/assets/vehicles/vehicle_bmw_ix1_phev.png)

- License: GPL-3.0-only
- HACS category: Dashboard
- Runtime artifact: `rhi-mobility-ux.js`
- Current migration release: `v1.0.0-rc.1`
- Public backend contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Current backend migration baseline: `R43.2.60`

## Status

`v1.0.0-rc.1` is a migration release candidate. It preserves the legacy `R22.12.11.30` UX behavior while moving delivery to a deterministic HACS repository. Known UX/product defects remain explicitly tracked and are not silently redesigned during migration.

## HACS installation

Add this repository to HACS as a **Dashboard** custom repository and install the latest release candidate. The resource is expected at:

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
