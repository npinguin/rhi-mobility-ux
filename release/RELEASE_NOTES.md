# v1.0.0-rc.93 — Responsive product UX and consistent asset presentation (HACS TEST CANDIDATE)

- Vehicles now lead with the actual model/photo and charging relationship before secondary status facts. Long reasons remain in technical/asset detail rather than forcing narrow text columns.
- Replaced floating icon-only detail links with contextual labelled Details actions on vehicle and charger cards; reduced duplicate and misplaced affordances.
- Unified responsive spacing, compact hero geometry, status presentation, quick-action wrapping and flat fact rows across Overview, Vehicles, Chargers, Planning, Strategies, History, Activity and asset details.
- Unset charger location no longer appears as an ambiguous Not configured label; unavailable commands remain visibly unavailable without leaking internal contract jargon.
- New rendered-journey regression, dedicated 320–1920px acceptance matrix and explicit target Home Assistant/mobile/tablet/desktop qualification gates.
- Product semantics, canonical V2 ownership, HACS runtime artifact and UX Core pin (1.6.3) are unchanged. Backend compatibility comes from `release/product.json`.

**Qualification:** candidate only. Full CI, immutable HACS packaging, target-device screenshots, controls/readback, refresh, upgrade and rollback are required before stable promotion. Rollback: `v1.0.0-rc.92`.
