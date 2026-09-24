# v1.0.0-rc.48 — UX authority, visual identity and canonical write closure

This candidate closes the remaining UX authority defects found by the post-rc.47 deep audit.

## Semantic authority

- Overview vehicle Range/Energy/Security/Maintenance signals now consume `MOBILITY_EXPERIENCE_V2` directly.
- Primary dashboard rendering no longer falls back to the legacy vehicle intelligence index.
- Vehicle Management, Overview and Vehicle Detail therefore use one backend-owned conclusion source.

## Visual identity

- Persisted V2 `charger.image_key` outranks legacy charger instance aliases.
- Vehicle artwork is constrained to the current backend-owned profile family; a stale cross-model image key cannot override canonical identity.
- Charger artwork is likewise constrained to the current profile family, including the intermediate state between profile and image-key writes.
- Legacy aliases remain decode-only compatibility inputs and may not override valid V2 identity.

## Writes and readback

- Property writes are no longer considered successful merely because Home Assistant accepted the service call.
- Generic property editors, lifecycle controls, charge-power controls and assignment selects now await canonical property readback.
- Failed or timed-out writes remain visibly failed and the UX re-renders from canonical backend truth.
- Picker sequencing keeps the existing profile → appearance ordering but now inherits the same canonical readback requirement.

## Governance and tests

- Added behavioral conflict tests for Experience V2 Overview parity, stale cross-model vehicle artwork, stale cross-family charger artwork, legacy charger instance precedence and service-accepted/no-readback writes.
- Product Vision is V2-first; stale V1-primary wording is rejected by documentation validation.
- Backend interface backlog now records the missing per-asset V2 publication-completeness evidence needed to diagnose partial entity materialization without creating dual authority.

Required/tested backend: `M0.9.43`.
Rollback: `v1.0.0-rc.47`.

Target Home Assistant qualification remains mandatory before stable promotion.
