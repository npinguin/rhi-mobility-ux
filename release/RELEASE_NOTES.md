# v1.0.0-rc.42 — picker write/readback + refresh stability

This candidate builds on the already-published rc.41 V2-first status architecture and fixes only Vehicle/Charger visual picker writability plus editing-session refresh behavior.

Tested backend baseline: `M0.9.39`.

- Canonical duplicate-property resolution prefers the richest V2-backed row, including complete write metadata when Mobility publishes it.
- Vehicle and Charger management picker sessions are not reconstructed by normal Home Assistant state churn while open.
- Focused Vehicle/Charger Detail pickers are protected from runtime refresh reconstruction.
- Vehicle identity remains backend/profile owned; the vehicle picker edits appearance only.
- Charger visual selection remains presentation-only and does not redefine backend charger identity.
- rc.41 status semantics are preserved unchanged.

Rollback: `v1.0.0-rc.41`.

Target Home Assistant qualification must prove write → canonical readback → reload/restart persistence for both vehicle and charger visuals before stable promotion.
