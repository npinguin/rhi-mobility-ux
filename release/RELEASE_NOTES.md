# v1.0.0-rc.38 — Unified Overview-style top-level tab layout

## Scope
- makes Mobility Overview the visual reference for every top-level tab hero;
- keeps the nine approved hero images and their semantic mapping unchanged;
- removes all hero-level mini status/meta rows: heroes contain only eyebrow, title, description and artwork;
- adds one shared four-tile top status pattern matching Overview;
- adds one shared quick-action bar matching Overview;
- applies the pattern to Vehicles, Chargers, Planning, Strategies, History and Log;
- preserves detailed content and domain ownership below the top-level presentation layer;
- preserves rc.37 nested HACS asset delivery and rc.36 charger occupancy semantics.

## Runtime target
Every top-level tab must render in this order:
1. shared navigation;
2. full-width Overview-style hero;
3. four top-level status cards;
4. Overview-style quick actions;
5. domain-specific content.

## Rollback
Rollback candidate: `v1.0.0-rc.37`.

## Qualification
Target Home Assistant proof must confirm desktop/tablet/mobile alignment across all seven tabs and no mini status text inside any hero.
