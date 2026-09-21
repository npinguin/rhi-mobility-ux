# Engineer handover — RHI Mobility UX

## Start here

Current source candidate: **v1.0.0-rc.14**. Public contract: **MOBILITY_PUBLIC_RUNTIME_V1**. Minimum backend: **R43.2.60**. Current tested backend baseline: **R43.2.65**.

Read in this order:

1. `README.md`
2. `documentation/ARCHITECTURE.md`
3. `documentation/RELEASE_GOVERNANCE.md`
4. `documentation/BRANDING.md`
5. `documentation/HACS_INSTALLATION.md`
6. `documentation/KNOWN_DEFECTS.md`
7. `release/RELEASE_STATUS.json`
8. `release/QUALIFICATION.json`
9. `release/RELEASE_NOTES.md`
10. `CHANGELOG.md`

## Footer authority

- Healthy footer is `RHI Mobility UX <version> · Backend <version>`.
- Runtime health, acceptance proof and diagnostics may create one expandable issue summary only.
- Hover-only issue disclosure is forbidden; concrete conditions must be visible when expanded.
- Footer geometry/classes must match the shared standard and Energy.

## Asset refresh authority

- Company-logo requests must carry the current UX package version as a query revision.
- A timeless external logo URL is forbidden because browser caches can survive HACS package updates.

## Shared shell and brand authority

- Mobility uses the same two-level header hierarchy and company-brand slot contract as Energy.
- Canonical company mark: `src/assets/files/branding/company-logo.svg`.
- The build copies the mark unchanged to `assets/branding/company-logo.svg` and `dist/assets/branding/company-logo.svg`.
- Compact gray secondary-navigation icons are presentation metadata only; routes and backend ownership are unchanged.
- Do not redraw, recolour, filter, crop or replace the company mark locally.
- Responsive header sizing is controlled only through the shared `--rhi-company-*` tokens documented in `documentation/BRANDING.md`.

## Shared UX standards

- `documentation/UX_RELEASE_STANDARD.md` is normative for release lifecycle across all RHI UX packages.
- `documentation/UX_FOOTER_STANDARD.md` is normative for footer layout, data ownership and diagnostics presentation.

## Product boundary

```text
Mobility backend
→ MOBILITY_PUBLIC_RUNTIME_V1
→ UX runtime/adapters
→ viewmodels
→ screens/components
```

UX renders V1 and does not create a second Mobility semantic authority.

Configuration controls use backend V1 write metadata, options and write targets. `asset.profile_id` and `vehicle.selected_charger` may remain visible/editable while unset. Runtime controls remain fail-closed without V1 write capability.

Actual/readback is the normal operational truth. Requested intent is transient during editing/pending write and must not replace canonical actual state.

Global supervisor status, trust, attention, opportunity and recommendation are backend-owned. The UX may present factual charging information, but it may not turn those facts into a substitute recommendation. Missing supervisor intelligence fails closed as unavailable/Unknown.

## Current known product gaps

`documentation/KNOWN_DEFECTS.md` is authoritative for unresolved product defects. These are unresolved defects, not accepted feature debt. Do not silently close them through frontend inference or fallback logic.

In particular, frontend-derived supervisory meaning and requested-versus-actual cleanup must only be closed when the backend public contract supplies the required authority and regression tests prove the UX consumes it correctly.

Engineering/Unmapped remains a fail-visible safety net for unplaced published properties; it is not a substitute for correct product placement.

## Release path

```text
branch
→ structural fix + regression tests
→ PR
→ Validate green
→ squash merge
→ main Validate green
→ automatic Publish HACS
→ immutable HACS-visible TEST CANDIDATE
→ target HA runtime + rollback proof
→ update release/QUALIFICATION.json with PASS + exact candidate SHA
→ manual stable promotion of the exact candidate
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
