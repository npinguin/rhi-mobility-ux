# Engineer handover — RHI Mobility UX

## Zero-debt closure baseline

Mobility UX is part of the coordinated RHI frontend closure program. The target is **zero accepted technical debt, zero accepted feature debt and zero V1 product/runtime dependency**.

Current candidate context for this handover:

- candidate: `1.0.0-rc.80`;
- closure PR: `#146`;
- canonical product authority: `MOBILITY_PUBLIC_RUNTIME_V2` plus the explicitly required V2 companion contracts;
- minimum/tested backend baseline: `M0.10.25`;
- vendored UX Core in this candidate: `1.6.1`;
- current Core main is newer; Core adoption must be explicit and provenance-pinned, never silently drifted;
- stable promotion remains blocked until exact-candidate target Home Assistant qualification passes.

Machine-readable release authority remains `package.json`, `release/RELEASE_STATUS.json` and `release/QUALIFICATION.json`.

### Non-negotiable architecture

```text
Mobility public V2 contracts
        ↓
single runtime gateway
        ↓
thin vehicle / charger projections
        ↓
RHI UX Core grammar + Mobility content
        ↓
user
```

Rules:

1. **V1 is fully decommissioned.** V1 product/runtime readers, indexes, fallbacks, compatibility authorities and V1-shaped reconstruction are forbidden in `src/` and generated `dist/`.
2. Historical V1 names may exist only in archive/history or negative tests proving they are rejected. They are never runtime compatibility.
3. **One projection boundary.** Screens consume vehicle/charger projections. A backend semantic change is mapped once, not fixed across multiple screens.
4. **No frontend domain inference.** Relationships, readiness, command capability, actual/requested values, policy and supervision come from the owning V2 contract.
5. **Unmapped truth is reported, not guessed.** Missing required semantics become an owning-backend gap.
6. **Normal UX is product language.** Contract names, entity IDs, property keys, raw backend codes and implementation details do not appear on normal screens.
7. **Diagnostics is explicit.** Engineering evidence is available only through a deliberate technical disclosure.
8. **EN/NL/FR is release scope.** Product copy uses localization resources and locale-aware formatting; machine identifiers remain untranslated.
9. **Writes require canonical readback.** Requested intent is transient. Actual/readback remains the operational truth.
10. **Core owns shared grammar.** Mobility retains dedicated domain content and detail UX but must not fork shared shell/Hero/status/asset/editor/responsive primitives.

### Product UX grammar

```text
Is my mobility ready?
        ↓
What needs attention?
        ↓
What can I do?
        ↓
Details
        ↓
Diagnostics
```

A normal user should never need to understand Home Assistant entities, Mobility contract identifiers or transport/write mechanics.

### Definition of done

A transferable Mobility candidate requires:

- static/package/HACS validation green;
- V1 product API decommission proven;
- zero accepted presentation/technical/feature debt;
- EN/NL/FR and user-safe copy proven;
- vehicle/charger relationships and actual/readback truth proven on target HA;
- lifecycle, appearance, requested-power and select writes proven with readback + refresh/restart persistence;
- responsive runtime proven;
- cross-domain navigation/visual identity proven;
- upgrade and rollback proven;
- qualification bound to the exact immutable candidate SHA.

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
14. `documentation/HISTORY_AND_LESSONS.md`
15. `documentation/KNOWN_DEFECTS.md`
16. `release/product.json`
17. `release/QUALIFICATION.json`
18. `release/RELEASE_NOTES.md`
19. `CHANGELOG.md`

## Footer authority

- Healthy footer is `RHI Mobility UX <version> · Backend <version>`.
- Runtime health, acceptance proof and diagnostics may create one expandable issue summary only.
- Hover-only issue disclosure is forbidden; concrete conditions must be visible when expanded.
- Footer geometry/classes must match the shared standard and Energy.

## Brand delivery authority

- RHI UX Core is the canonical company-brand authority; `src/assets/branding/company-logo.svg` is the pinned vendored/package copy used for this immutable Mobility artifact.
- The build injects that canonical SVG into the runtime bundle; source code must not contain a second copy of the artwork.
- Branding tests own artwork/delivery. Footer, navigation and layout tests must not re-test the delivery mechanism.

## Shared shell and brand authority

- Mobility uses the same two-level header hierarchy and company-brand slot contract as Energy.
- Canonical company mark authority: RHI UX Core. The local `src/assets/branding/company-logo.svg` is a build-time vendored copy pinned by `src/vendor/RHI_UX_CORE.json`.
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

Target architecture:

```text
MOBILITY_PUBLIC_RUNTIME_V2 = canonical facts
MOBILITY_POLICY_V2         = thresholds / interpretation rules
MOBILITY_EXPERIENCE_V2     = user-facing conclusions
UX                         = select / aggregate / format / present
```

The supported runtime path is V2-only: Runtime V2, Experience V2, Policy V2, Command V2, Activity V2, Profile Catalog V2, Supervision V2 and canonical per-asset V2 semantic configuration. V1 product/runtime compatibility is not supported in the current package. Runtime controls remain fail-closed without published V2 write capability.

Actual/readback is the normal operational truth. Requested intent is transient during editing/pending write and must not replace canonical actual state.

### Vehicle visual ownership

- Mobility persists only `vehicle.image_key`; UX owns catalog entries, base artwork and colour rendering.
- Every current supported real model has exactly one canonical package master.
- Audi Q8, BMW X1 PHEV, Mercedes GLA PHEV, Renault Scenic E-Tech and VW ID.4 must all resolve to distinct package artwork.
- Hero/detail/overview may crop or scale the master differently but may not own separate hero artwork.
- Legacy keys are compatibility input aliases only. Do not add legacy asset files or a second runtime resolver.
- Generic Guest PHEV/EV intentionally share the one generic fallback master.
- Colour variants are rendered on the fly; do not proliferate one image file per colour.
- Picker navigation is hierarchical (Brand → Model → Variant → Colour) and must preserve the current identity on open.
- Asset source/licence/provenance is tracked in `documentation/VEHICLE_ARTWORK_SOURCES.json`.
- `tools/check-asset-policy.mjs` is fail-closed on current-scope completeness, distinct bytes and the exact canonical vehicle-file inventory.

Global supervisor status, trust and attention are Mobility Supervision V2-owned. Planning opportunity and recommendation are Energy-owned. The UX may present factual charging information, but it may not turn those facts into a substitute recommendation. Missing supervisor intelligence fails closed as unavailable/Unknown.


### Product/contract rule

- One Mobility model sits behind every tab; screens are projections only.
- Overview evolves from the current implementation; do not replace it with a mock redesign.
- Missing backend capabilities render N/A/empty and go to `documentation/BACKEND_INTERFACE_BACKLOG.md`.
- Do not mock user→vehicle links, HA-user permissions, management capabilities or future V2.x fields.
- `No charger` is a first-class selected-charger state only when Mobility publishes backend-owned unset metadata.
- URL route is authoritative product state: refresh must preserve the current tab and relevant position.
- The connected HA user may influence focus/sorting only after the backend publishes HA-native relationship and rights contracts.
- Shared RHI header/footer remain unchanged unless a transversal RHI UX change is explicitly approved. Mobility may only simplify the outer Lovelace top menu as part of this program.

## Current known product gaps

`documentation/KNOWN_DEFECTS.md` is authoritative for unresolved product defects. These are unresolved defects, not accepted feature debt. Do not silently close them through frontend inference or fallback logic.

In particular:
- V1 product/runtime migration is closed only when source, generated package and target-runtime evidence all prove there is no V1 authority, fallback or compatibility execution path;
- frontend-derived supervisory meaning and requested-versus-actual cleanup may only be closed when backend public contracts supply the required authority and owned regression tests prove the UX consumes it correctly;
- picker persistence is not closed by a green service call; canonical readback plus refresh/reload/restart proof is required.

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
→ GitHub Release contains release notes only and zero release assets
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

## First task for a new engineer

Before changing behavior:

1. verify current package/backend identity from the machine authorities;
2. read `documentation/HISTORY_AND_LESSONS.md` and `documentation/KNOWN_DEFECTS.md`;
3. inspect `release/QUALIFICATION.json` for target-runtime gates still pending;
4. classify the requested change against source/test ownership;
5. confirm whether the path is V2-native or still using a compatibility fallback;
6. add/adjust the owned anti-drift regression before considering the issue structurally closed.

Do not start premium visual work while a related identity, persistence or canonical-render defect is still open.

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
