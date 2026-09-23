# v1.0.0-rc.40 — V2 picker session hardening

This candidate fixes the visual-picker editing lifecycle without changing Mobility domain semantics.

Tested backend: `M0.9.39`.

- Vehicle colour preview stays local until Save; picker changes no longer force a Home Assistant card rebuild.
- Charger brand/model/variant/appearance hierarchy updates in place, preserving the active native select and draft state.
- Save remains contract-driven and fail-closed: persistence activates only when the canonical backend property publishes complete write capability.
- `documentation/SEMANTIC_PICKER_BLUEPRINT.md` defines the reusable Domain V2 → local draft → semantic write → canonical readback pattern intended for Mobility and later Energy UX.

Rollback: `v1.0.0-rc.39`.

Target Home Assistant qualification and backend readback proof remain mandatory before stable promotion.
