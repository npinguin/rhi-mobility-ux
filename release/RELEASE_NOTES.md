# v1.0.0-rc.28 — shared premium Mobility presentation

## Scope

- introduces one shared Mobility presentation layer for typography, spacing, density, page geometry and responsive behavior;
- keeps screen/domain ownership intact: Overview, Vehicles, Chargers and Charging retain their own semantics, actions and content;
- adds one compact premium hero grammar for current Mobility tabs;
- adds package-owned contextual hero scenes for Overview, Vehicles, Chargers and Charging;
- keeps hero artwork decorative/contextual only: no generated product image is used as device truth;
- makes phone portrait, tablet and desktop first-class presentation targets from the same shared style layer;
- preserves all existing Vehicle and Charger management controls, KPI/status rows, filters, actions and detail access;
- keeps Mobility on frozen `MOBILITY_PUBLIC_RUNTIME_V1`; no backend contract change is required.

## UX principle

Compact + premium + usable. No decorative space is added unless it improves hierarchy, recognition or navigation. Common changes belong to the shared presentation layer instead of screen-local CSS.

## Runtime contract

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `M0.9.29`
- Tested backend baseline: `M0.9.29`
- V1 status: frozen compatibility input only

## Qualification

Static validation, HACS validation and package determinism are required before publication. Runtime proof must cover phone portrait, tablet and desktop, all current Mobility tabs, hero rendering, existing actions and responsive preservation.
