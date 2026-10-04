# Robotix Home Intelligence Mobility UX

Public HACS Dashboard/plugin repository for Robotix Home Intelligence Mobility UX.

![Robotix Home Intelligence Mobility UX](dist/assets/vehicles/vehicle_bmw_x1_phev.webp)

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

## Install with HACS

### First-time install

1. Open **HACS** → **Custom repositories**.
2. Add `https://github.com/npinguin/rhi-mobility-ux`.
3. Select **Dashboard**.
4. Install the intended published TEST CANDIDATE version shown in GitHub Releases / HACS.
5. Go to **Settings → Dashboards → Resources**.
6. Confirm this resource exists as **JavaScript Module**:

```text
/hacsfiles/rhi-mobility-ux/rhi-mobility-ux.js
```

Do not manually copy JavaScript or artwork to `/config/www` for a normal HACS install.

## Copy-paste dashboard YAML

For a dedicated Mobility dashboard, **Edit dashboard → Raw configuration editor** can use the one-card bootstrap:

```yaml
views:
  - title: Mobility
    path: overview
    icon: mdi:car-electric
    type: panel
    cards:
      - type: custom:homebrain-mobility-card
```

The dashboard URL itself is **not fixed**. Name the Home Assistant dashboard as you prefer, for example `robotix-mobility`. Mobility derives navigation from the dashboard where the card is mounted.

If your existing dashboard already has its own view/layout, keep it and use only:

```yaml
type: custom:homebrain-mobility-card
```

The single-card bootstrap keeps Overview, Vehicles, Chargers, Planning, Strategies, History, Log and detail navigation inside the mounted Lovelace view while preserving browser history through `?mobility_view=...`.

### Runtime verification

After install/update:
1. hard-refresh Home Assistant;
2. open Mobility under the dashboard URL you chose;
3. verify Overview → Vehicles → Chargers → Planning → Strategies → History → Log;
4. open a vehicle and charger detail and use Back;
5. refresh a detail and an internal view;
6. verify vehicle/charger images load from the HACS package;
7. when engineering diagnostics are explicitly enabled, confirm the technical footer reports the installed UX and backend version.

See `documentation/HACS_INSTALLATION.md` for migration, legacy multi-view compatibility and rollback.

## Architecture boundary

```text
rhi-mobility backend
        ↓
MOBILITY_PUBLIC_RUNTIME_V2
MOBILITY_EXPERIENCE_V2
MOBILITY_POLICY_V2
canonical per-asset V2 configuration
        ↓
runtime contract boundary
        ↓
domain adapters/models
        ↓
UI components/screens
```

Screens and components may not access Home Assistant Mobility contract entities directly. Missing canonical backend data fails closed as unavailable; the UX must not recreate backend semantics.

## Product vision and backend backlog

Mobility UX has one semantic model behind the current workspaces. Overview, Vehicles and Chargers are the three Mobility workspaces; detail views are projections of the same backend-owned truth. Charging remains a Mobility capability inside those projections, not a standalone workspace.

Read:
- `documentation/PRODUCT_VISION.md` for user focus, tab intent, No charger semantics and route persistence;
- `documentation/HISTORY_AND_LESSONS.md` for durable engineering history and failed patterns;
- `documentation/KNOWN_DEFECTS.md` for authoritative open runtime/qualification issues;
- `documentation/BACKEND_INTERFACE_BACKLOG.md` for backend interfaces that remain unavailable until explicitly published.

No backend capability is mocked or reconstructed in the UX. The active product runtime is V2-only; legacy product APIs are decommissioned and forbidden by CI.

## Development

```bash
npm ci
npm test
npm run check:test-ownership
npm run release:sync   # only when preparing a new candidate
```

`npm test` performs the candidate build and all owned test suites. `dist/` is the generated complete HACS package; do not edit it manually. Publication tags these exact committed bytes and does not rebuild them.

## Migration traceability

Legacy source baseline: `R22.12.11.30`. The original package checksum and exact legacy JS/YAML artifacts are recorded under `archive/legacy/`.

## Shared company branding

The canonical company mark is owned by RHI UX Core. `src/assets/branding/company-logo.svg` is a vendored/package copy pinned to the Core provenance in `src/vendor/RHI_UX_CORE.json`; it is not a second branding authority. The build mirrors this packaged copy into `dist/assets/` and injects the same SVG into the JS runtime bundle for HACS-safe delivery. Header sizing is independently owned by the shared `--rhi-company-*` layout tokens. See `documentation/BRANDING.md`.

## Candidate visibility and footer

TEST CANDIDATE releases are normal GitHub Releases so HACS exposes them without enabling beta/prerelease versions. Qualification state is tracked separately in `release/QUALIFICATION.json`.

Technical release/footer information is diagnostics-only and hidden from the normal product experience. When diagnostics are explicitly enabled, the shared footer may expose UX/backend identity and concrete runtime verification details. See `documentation/UX_FOOTER_STANDARD.md`.

## Test ownership

Testing follows the same ownership model as the code: one invariant, one test owner. See `documentation/TEST_GOVERNANCE.md` and `tests/OWNERSHIP.json`. A local implementation change should not require unrelated test suites to learn the new implementation.

## Source and package structure

`src/OWNERSHIP.json` and `src/manifest.json` define source ownership and bundle order. Canonical assets live only under `src/assets/<category>/`; the build preserves that tree under `dist/assets/<category>/`. `dist/PACKAGE_MANIFEST.json` records the generated install inventory, file sizes, asset categories and runtime SHA-256 without becoming a second source of truth.

For Dashboard/plugin releases with nested assets, the GitHub Release does not attach `rhi-mobility-ux.js` as a release asset. HACS therefore installs the complete immutable tag `dist/` tree instead of switching to single-file mode. See `documentation/SOURCE_PACKAGE_GOVERNANCE.md`.