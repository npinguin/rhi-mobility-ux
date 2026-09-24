# v1.0.0-rc.52 — picture-first asset identity TEST CANDIDATE

## Scope

rc.52 completes the Mobility side of the visual identity pattern by making the selected product picture visible while appearance configuration is being edited.

- Vehicle & colour shows a live selected vehicle preview.
- Charger & colour shows a live selected charger preview.
- Preview artwork updates immediately with brand/model/variant/colour changes.
- Existing profile-first then appearance write sequencing is unchanged.
- Canonical backend readback remains required before a write is considered successful.

Required/tested backend: `M0.10.1`.
Rollback: `v1.0.0-rc.51`.

Accepted technical debt: 0.
Accepted feature debt: 0.
Target Home Assistant qualification remains mandatory.
