# v1.0.0-rc.72 — unified appearance + failure isolation

- Adopts UX Core 1.5.3 canonical appearance primitives for vehicle and charger image choices.
- Appearance failures remain isolated from vehicle truth/rendering.

# v1.0.0-rc.71 — complete pinned UX Core vendor

## User-facing behavior

- Preserves the rc.70 shared appearance picker behavior for Vehicle and Charger.
- Restores the complete pinned RHI UX Core 1.5.2 vendor snapshot used by the packaged Mobility UX candidate.
- Keeps Mobility domain semantics, Public Runtime V2 writes/readback and producer-owned visual publication unchanged.

## Engineering

- restores the complete pinned RHI UX Core 1.5.2 vendor snapshot;
- strengthens Core integrity validation so incomplete vendor snapshots fail before publication;
- advances the immutable HACS candidate from rc.70 to rc.71 without changing backend semantics.

Rollback: **v1.0.0-rc.70**.

Known accepted technical debt: **0**.
Known accepted feature debt: **0**.

Target Home Assistant proof remains required for vehicle/charger save-readback, refresh/restart, upgrade and rollback before stable promotion.
