# HACS release status

This file describes the **source candidate on main**, not the latest published HACS release.

Current source candidate:

- UX version: `1.0.0-rc.2`
- source branch: `main`
- legacy source: `R22.12.11.30`
- public contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- minimum backend: `R43.2.60`
- tested backend baseline: `R43.2.65`
- repository CI: PASS
- HACS validation: PASS
- target Home Assistant runtime proof: PENDING

Publication rule:

```text
source candidate on main
→ main Validate green
→ release workflow
→ immutable vX.Y.Z tag
→ GitHub Release
→ HACS install/update
→ target HA runtime proof
```

Only the immutable GitHub Release/tag is a published release. A version present in `package.json` or the README is not, by itself, proof that HACS can install that version.
