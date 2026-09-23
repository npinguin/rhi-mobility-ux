# v1.0.0-rc.43 — UX-first status simplification

This candidate applies the Mobility status design from the UX perspective only. It does not expose backend implementation gaps or contract plumbing as user-facing status.

Tested backend baseline: `M0.9.39`.

- Overview: Charging / Range / Comfort / conditional Attention.
- Vehicle Management: Fleet / Profiles / Charging setup.
- Charger Management: Profiles / Availability / Runtime / conditional Issue.
- Planning: Today / Still to plan / Tomorrow.
- Strategies: Configured / Effective.
- History: Energy / Value / Vehicles.
- Log: recent Activity plus Attention only when a concrete backend-published action exists.
- Vehicle Detail: Range / Charging / Security / Maintenance.
- Charger Detail: State / Power / Vehicle, with Issue added only for a real health problem.
- Normal, available, connected, scheduled and OK states stay visually neutral. Colour is reserved for action.
- UX presentation thresholds: low range <100 km; maintenance due soon <90 days.
- rc.42 picker persistence and refresh stability are preserved.

Rollback: `v1.0.0-rc.42`.

Target Home Assistant qualification must verify the information hierarchy and colours on desktop/mobile with real runtime data before stable promotion.
