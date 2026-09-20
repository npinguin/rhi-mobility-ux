# Engineer handover — RHI Mobility UX

## Start here

Current source candidate: **v1.0.0-rc.2**. Public contract: **MOBILITY_PUBLIC_RUNTIME_V1**. Minimum backend: **R43.2.60**. Current tested backend baseline: **R43.2.65**.

Read in this order:

1. `README.md`
2. `documentation/ARCHITECTURE.md`
3. `documentation/RELEASE_GOVERNANCE.md`
4. `documentation/HACS_INSTALLATION.md`
5. `documentation/KNOWN_DEFECTS.md`
6. `release/RELEASE_STATUS.json`
7. `release/RELEASE_NOTES.md`
8. `CHANGELOG.md`

## Product boundary

```text
Mobility backend
→ MOBILITY_PUBLIC_RUNTIME_V1
→ UX runtime/adapters
→ viewmodels
→ screens/components
```

UX renders V1 and does not infer backend semantics.

Configuration controls use backend V1 write metadata, options and write targets. `asset.profile_id` and `vehicle.selected_charger` may remain visible/editable while unset. Runtime controls remain fail-closed without V1 write capability.

Actual/readback is the normal operational truth. Requested intent is transient during editing/pending write and is not retained as a second frontend truth.

## Release path

```text
branch
→ structural fix + regression tests
→ PR
→ Validate green
→ squash merge
→ main Validate green
→ Release workflow
→ immutable HACS version
→ target HA runtime proof
→ stable only after qualification
```

Never move or overwrite a published tag. Any runtime change after publication requires a new version.

## Definition of transferable

The next engineer must be able to determine without tribal knowledge:

- current source candidate;
- latest published immutable release;
- public contract and tested backend;
- what code owns and does not own;
- how to run tests/build;
- how publication works;
- which target runtime evidence is still pending;
- how to roll back through HACS.

If any of those requires guessing, release governance is not clean.
