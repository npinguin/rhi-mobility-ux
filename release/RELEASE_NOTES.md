# v1.0.0-rc.89 — canonical-only Mobility HACS candidate

**HACS-installable TEST CANDIDATE; not stable or target-HA qualified.** The release is published as a normal GitHub Release so HACS can install it without a beta toggle.

- Removes the retired `MOBILITY_PUBLIC_RUNTIME_V2` aggregate from bundled runtime, adapters and screens. Canonical per-asset properties are supplied by `RHI_MOBILITY_CANONICAL_PROPERTY_V1`, while Experience, Policy, Commands, Activity and Supervision remain distinct backend-owned contracts.
- Vehicle and charger relationship projections consume backend-published `MOBILITY_EXPERIENCE_V2` relationships. Configured and effective assignments are kept separate from physical connections; physical attribution requires explicit observed identity proof.
- Strengthens fail-closed identity validation and adds regression coverage for two independently published Audi Q8 vehicles and conflicting vehicle identifiers.
- Keeps HACS bundle, checksum, version and release metadata consistent with an immutable source candidate.
- Target Home Assistant installation, controls/readback, responsive rendering, restart and rollback remain **pending qualification**. No stable-promotion claim is made.

Compatible backend baseline: Mobility M0.10.41 or later. Static evidence includes the M0.10.43 backend contract baseline. Rollback: **v1.0.0-rc.88**.

GitHub Release must have no attached assets; HACS installs the exact immutable `dist/` tree from the tag.
