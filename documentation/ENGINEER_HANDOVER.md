# Engineer handover — RHI Mobility UX

## Start here

Do not copy current release identity from this document. The authoritative sources are `package.json` for package version and `release/product.json` for contract/backend/release context. Published versions are authoritative in GitHub Releases.

Read in this order:

1. `README.md`
2. `documentation/PRODUCT_VISION.md`
3. `documentation/ARCHITECTURE.md`
4. `documentation/BACKEND_INTERFACE_BACKLOG.md`
5. `documentation/RELEASE_GOVERNANCE.md`
6. `documentation/UX_REPOSITORY_STANDARD.md`
7. `documentation/TEST_GOVERNANCE.md`
8. `src/OWNERSHIP.json`
9. `src/manifest.json`
10. `documentation/SOURCE_PACKAGE_GOVERNANCE.md`
11. `tests/OWNERSHIP.json`
12. `documentation/BRANDING.md`
13. `documentation/HACS_INSTALLATION.md`
14. `documentation/KNOWN_DEFECTS.md`
15. `release/product.json`
16. `release/QUALIFICATION.json`
17. `release/RELEASE_NOTES.md`
18. `CHANGELOG.md`

## Footer authority

- Healthy footer is `RHI Mobility UX <version> · Backend <version>`.
- Runtime health, acceptance proof and diagnostics may create one expandable issue summary only.
- Hover-only issue disclosure is forbidden; concrete conditions must be visible when expanded.
- Footer geometry/classes must match the shared standard and Energy.

## Brand delivery authority

- `src/assets/branding/company-logo.svg` is the canonical artwork source.
- The build injects that canonical SVG into the runtime bundle; source code must not contain a second copy of the artwork.
- Branding tests own artwork/delivery. Footer, navigation and layout tests must not re-test the delivery mechanism.

## Shared shell and brand authority

- Mobility uses the same two-level header hierarchy and company-brand slot contract as Energy.
- Canonical company mark: `src/assets/branding/company-logo.svg`.
- The build mirrors the canonical `src/assets/` tree into `dist/assets/` and injects the same canonical SVG into the JS runtime bundle for HACS-safe delivery.
- Compact gray secondary-navigation icons are presentation metadata only; routes and backend ownership are unchanged.
- Do not redraw, recolour, filter, crop or replace the company mark locally.
- Responsive header sizing is controlled only through the shared `--rhi-company-*` tokens documented in `documentation/BRANDING.md`.

## Shared UX standards

- `documentation/UX_RELEASE_STANDARD.md` is normative for release lifecycle.
- `documentation/TEST_GOVERNANCE.md` and `tests/OWNERSHIP.json` are normative for test ownership.
- `documentation/UX_FOOTER_STANDARD.md` is normative for footer layout, data ownership and diagnostics presentation.

### Testing ownership

Testing mirrors code ownership: **one invariant, one test owner**. Do not make a footer test understand branding delivery, a screen-preservation test understand navigation internals, or a layout test understand asset packaging. If one local change breaks several unrelated suites, treat that as test-ownership drift unless multiple product contracts genuinely changed.

## Product boundary

```text
Mobility backend
→ MOBILITY_PUBLIC_RUNTIME_V1
→ runtime
→ domain adapters/models
→ UI components/screens
```

UX renders V1 and does not create a second Mobility semantic authority.

Configuration controls use backend V1 write metadata, options and write targets. `asset.profile_id` and `vehicle.selected_charger` may remain visible/editable while unset. Runtime controls remain fail-closed without V1 write capability.

Actual/readback is the normal operational truth. Requested intent is transient during editing/pending write and must not replace canonical actual state.

### Vehicle visual ownership

- Mobility persists only `vehicle.image_key`; UX owns catalog entries, base artwork and colour rendering.
- The picker may expose only `selectable` verified models.
- A fallback-only or byte-duplicated model asset is not a supported picker model.
- Legacy Scenic/ID.4 keys remain readable only for compatibility and resolve to fallback until distinct verified artwork is supplied.
- Do not expand the picker by adding labels first. New model support starts with verified distinct artwork, then catalog metadata, then tests.
- Colour variants are rendered on the fly from one model base image; do not proliferate one image file per colour unless a future visual standard explicitly requires it.

Global supervisor status, trust, attention, opportunity and recommendation are backend-owned. The UX may present factual charging information, but it may not turn those facts into a substitute recommendation. Missing supervisor intelligence fails closed as unavailable/Unknown.


### Product/contract rule

- One Mobility model sits behind every tab; screens are projections only.
- Overview evolves from the current V1 implementation; do not replace it with a mock redesign.
- Missing backend capabilities render N/A/empty and go to `documentation/BACKEND_INTERFACE_BACKLOG.md`.
- Do not mock user→vehicle links, HA-user permissions, management capabilities or future V2.x fields.
- `No charger` is a first-class selected-charger state only when V1 publishes backend-owned unset metadata.
- URL route is authoritative product state: refresh must preserve the current tab and relevant position.
- The connected HA user may influence focus/sorting only after the backend publishes HA-native relationship and rights contracts.
- Shared RHI header/footer remain unchanged unless a transversal RHI UX change is explicitly approved. Mobility may only simplify the outer Lovelace top menu as part of this program.

## Current known product gaps

`documentation/KNOWN_DEFECTS.md` is authoritative for unresolved product defects. These are unresolved defects, not accepted feature debt. Do not silently close them through frontend inference or fallback logic.

In particular, frontend-derived supervisory meaning and requested-versus-actual cleanup must only be closed when the backend public contract supplies the required authority and regression tests prove the UX consumes it correctly.

Engineering/Unmapped remains a fail-visible safety net for unplaced published properties; it is not a substitute for correct product placement.

## Release path

```text
branch
→ structural fix + owned regression tests
→ PR
→ one full Validate gate
   → candidate build + complete tests
   → deterministic second-build proof
   → committed-dist equality
   → HACS validation
→ squash merge
→ Publish HACS verifies the complete committed dist package and creates/verifies the immutable tag (no rebuild)
→ GitHub Release attaches evidence only; no JS release asset
→ immutable HACS-visible TEST CANDIDATE
→ target HA runtime + rollback proof
→ update release/QUALIFICATION.json with PASS + exact candidate SHA
→ stable promotion of the exact candidate (no rebuild)
```

Qualification evidence may change after candidate publication. Candidate runtime/source may not. Updating `release/QUALIFICATION.json` must not republish or move the candidate tag.

Never move or overwrite a published tag. Any runtime-impacting correction after publication requires a new version.

## Qualification evidence

Before stable promotion, `release/QUALIFICATION.json` must identify the current candidate version/tag, contain the exact immutable candidate commit SHA, and have every runtime gate plus `stable_promotion` set to `pass`.

Static CI is not target Home Assistant evidence.

## Definition of transferable

The next engineer must be able to determine without tribal knowledge:

- current source candidate;
- latest published immutable release;
- public contract and tested backend;
- what code owns and does not own;
- current known defects and which remain unresolved;
- how to run tests/build;
- how publication works;
- which target runtime evidence is still pending;
- where that evidence is recorded and how it is bound to candidate SHA;
- how to roll back through HACS.

If any of those requires guessing, release governance is not clean.

## Source/package ownership

- `src/app/`: shell, navigation and package URL glue.
- `src/runtime/`: Home Assistant/public contract boundary.
- `src/domain/adapters/`: backend → canonical UX mapping.
- `src/domain/models/`: canonical view models.
- `src/ui/`: presentation only.
- `src/assets/`: canonical artwork by category.
- `src/manifest.json`: bundle order.
- `dist/`: complete generated HACS package.

Do not reintroduce numeric load-order filenames, `src/assets/files/`, a root generated `assets/` tree or a same-named JS GitHub Release asset.
