# Release governance

RHI Mobility UX follows the shared `documentation/UX_RELEASE_STANDARD.md`. This file adds Mobility-specific rules only.

## Release path

```text
branch
→ PR
→ Validate green
→ squash merge to main
→ main Validate green
→ automatic Publish HACS
→ immutable HACS-visible TEST CANDIDATE GitHub Release
→ target Home Assistant qualification
→ manual stable promotion of exact immutable candidate
```

## Rules

1. `validate.yml` is side-effect free.
2. `publish-hacs.yml` is the only TEST CANDIDATE publication path.
3. TEST CANDIDATE releases are normal GitHub Releases, not GitHub prereleases; HACS must expose them without a beta-version toggle.
4. Candidate publication re-runs source/package tests, deterministic build proof and HACS validation.
5. A published `vX.Y.Z`/`vX.Y.Z-rc.N` tag/release is immutable. Never republish it; fix forward with the next version.
6. `release/QUALIFICATION.json` records target runtime evidence and must not trigger candidate publication.
7. Stable promotion is manual, fail-closed and evidence-only. It may attach/update qualification evidence and release title/notes, but it may not move the tag or alter runtime bytes.
8. Stable promotion verifies candidate tag/SHA and published JS/checksum byte parity.
9. Previous immutable HACS releases remain the rollback path.
10. UX owns presentation only and consumes `MOBILITY_PUBLIC_RUNTIME_V1`; backend semantics remain backend-owned.
11. Workflow-only, documentation-only and qualification-only changes must not republish an immutable runtime version.
12. Exactly three release workflows are allowed: validate, publish candidate and stable promotion.

## Required release identity

The following must agree with `package.json`:

- `COMPATIBILITY.json`
- `RELEASE_MANIFEST.json`
- `release/RELEASE_STATUS.json`
- `release/QUALIFICATION.json`
- source `UX_VERSION`
- first `CHANGELOG.md` entry
- current release notes
- engineer handover
- generated runtime artifact

## Current release

- candidate: `v1.0.0-rc.11`
- minimum backend: `R43.2.60`
- tested backend: `R43.2.65`
- rollback target: `v1.0.0-rc.10`
