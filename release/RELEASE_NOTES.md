# v1.0.0-rc.88 — experimental Mobility HACS native-property candidate

**HACS installable test prerelease; not stable, not target-HA qualified.** HACS beta versions must be enabled.

- Canonical property index consumes the backend-published `RHI_MOBILITY_CANONICAL_PROPERTY_V1` marker (the previous metadata incorrectly named it `MOBILITY_CANONICAL_PROPERTY_V2`).
- Keeps current Mobility command authority, frontend native-property indexing and lifecycle fixes on the engineering branch.
- Mobility Runtime V2 and cross-domain Energy V2 dependencies remain active in parts of the UX; this prerelease does **not** declare canonical-only migration or full functional parity complete.
- Physical connection and vehicle identities, configuration readback and restart/upgrade/rollback require target-HA runtime qualification before stable promotion.

Rollback: **v1.0.0-rc.87**. GitHub Release has no binary assets; HACS installs the immutable tag `dist/` tree.
