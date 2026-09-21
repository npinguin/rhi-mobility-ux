# Engineer handover — RHI Mobility UX

## Start here

Current source candidate: **v1.0.0-rc.7**. Public contract: **MOBILITY_PUBLIC_RUNTIME_V1**. Minimum backend: **R43.2.60**. Current tested backend baseline: **R43.2.65**.

Read in this order:

1. `README.md`
2. `documentation/ARCHITECTURE.md`
3. `documentation/RELEASE_GOVERNANCE.md`
4. `documentation/HACS_INSTALLATION.md`
5. `documentation/KNOWN_DEFECTS.md`
6. `release/RELEASE_STATUS.json`
7. `release/QUALIFICATION.json`
8. `release/RELEASE_NOTES.md`
9. `CHANGELOG.md`

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
→ immutable HACS TEST CANDIDATE
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
