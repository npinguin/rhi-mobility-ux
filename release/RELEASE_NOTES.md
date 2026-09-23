# v1.0.0-rc.41 — picker write/readback + refresh stability

This candidate fixes Vehicle/Charger visual picker writability and editing-session refresh behavior without changing Mobility product semantics.

Tested backend: `M0.9.39`.

- Canonical duplicate-property resolution now prefers the richest V2-backed row, including complete write metadata when Mobility publishes it.
- Vehicle and Charger management picker sessions no longer get reconstructed by normal Home Assistant state churn while open.
- Focused detail pickers are protected from runtime refresh reconstruction.
- Vehicle identity remains backend/profile owned; the vehicle picker still edits appearance only.
- Charger visual selection remains presentation-only and does not redefine backend charger identity.
- No new V1-only dependency or temporary status interpretation is added.

Rollback: `v1.0.0-rc.40`.

Target Home Assistant qualification must prove write → canonical readback → reload/restart persistence for both vehicle and charger visuals before stable promotion.
