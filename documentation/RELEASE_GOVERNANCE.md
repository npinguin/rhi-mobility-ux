# Release governance

The public `npinguin/rhi-mobility-ux` repository is both the engineering source and the HACS Dashboard distribution source for Mobility UX.

## Non-negotiable release rule

A release is valid only when source, generated runtime, documentation, governance metadata and validation evidence describe the same version and contract. Silent drift is a release defect.

The UX may consume `MOBILITY_PUBLIC_RUNTIME_V1`; it may not create a second Mobility semantic authority. Runtime behavior, documentation and release evidence must remain consistent with that boundary.

## Workflow model

This repository has exactly three governed workflows:

- `.github/workflows/validate.yml` — side-effect-free validation.
- `.github/workflows/publish-hacs.yml` — automatic immutable HACS TEST CANDIDATE publication from validated `main` changes.
- `.github/workflows/release.yml` — manual, fail-closed stable promotion after target runtime qualification.

No repair/release-helper workflow may be added to make a failing candidate green.

Normal work follows:

```text
branch
→ PR
→ Validate green
→ squash merge
→ main Validate green
→ automatic Publish HACS
→ immutable vX.Y.Z TEST CANDIDATE tag + GitHub prerelease
→ HACS install/update
→ target Home Assistant runtime proof + rollback proof
→ manual stable promotion of the exact same immutable candidate
→ next version for any runtime-impacting correction
```

## Candidate identity

`package.json` is the source-candidate version. The following active files must agree with it:

- `COMPATIBILITY.json`
- `RELEASE_MANIFEST.json`
- `MIGRATION_STATUS.md`
- current `CHANGELOG.md` entry
- `UX_VERSION` in source
- generated `dist/rhi-mobility-ux.js`

A source candidate is not a published release. `publish-hacs.yml` is the only TEST CANDIDATE publication path. GitHub Releases/tags are the publication authority. `release.yml` may only promote an already-published, byte-identical candidate after qualification; it may not manufacture or replace the candidate.

## Immutable publication and rollback

Once `vX.Y.Z` exists, its tag is immutable. Runtime/publication-impacting changes require the next version; the old tag is never moved or overwritten.

Each release publishes:

- exact tagged repository source;
- generated `dist/rhi-mobility-ux.js`;
- `rhi-mobility-ux.js.sha256`;
- `COMPATIBILITY.json`;
- `RELEASE_MANIFEST.json`;
- release notes.

HACS rollback means selecting an older immutable release/version and redownloading it. Dashboard YAML remains contract-oriented and must not contain release-specific cache parameters.

## Validation gates

Validation must prove:

- locked dependency install;
- deterministic build: two clean builds produce byte-identical JS and checksum;
- source/runtime version alignment;
- architecture boundary;
- public-repository hygiene;
- release/documentation governance consistency;
- V1 contract regressions;
- vehicle and charger configuration-editable semantics;
- command placement/readiness ownership;
- render/custom-element smoke;
- HACS repository validation;
- committed generated JS equals a clean build.

Static CI and HACS validation do not substitute for target Home Assistant runtime proof.

## Runtime qualification

Before a stable release, prove on the target Home Assistant instance:

- HACS install and update;
- Vehicles overview;
- vehicle detail;
- Chargers overview;
- charger detail;
- images/assets;
- browser refresh on overview/detail;
- profile selector for vehicle and charger including unset state;
- `vehicle.selected_charger` including unset state;
- runtime controls remain fail-closed without V1 capability;
- write → backend republish/readback behavior;
- restart/reload;
- rollback to the preceding immutable release.

A prerelease may be published as a TEST CANDIDATE while target runtime proof is pending. Stable publication must not claim runtime qualification until that evidence exists.

## Documentation integrity

Evergreen architecture documents should avoid transient release numbers. Release-specific identity belongs in `CHANGELOG.md`, `RELEASE_MANIFEST.json`, `RELEASE_STATUS.json` and GitHub Releases.

Historical files may retain historical versions only when clearly marked historical.

## Repository hygiene

`main` is the only persistent engineering branch. Feature/fix/docs/release branches are transient and should be deleted after merge/closure. Superseded open PRs should be closed. Generated runtime is rebuilt from source; source remains authoritative.
