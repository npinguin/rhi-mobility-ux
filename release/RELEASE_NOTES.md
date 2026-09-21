# v1.0.0-rc.19 — shared top-navigation alignment TEST CANDIDATE

## Purpose

Align the first-level RHI navigation across Mobility and Energy so Mobility / Intelligence / Insights use one stable, evenly distributed grid and no item can drift into or under the company-brand area on tablet widths.

## Changes

- primary product/navigation row uses the same shared column proportions as Energy;
- Mobility / Intelligence / Insights use three equal-width navigation columns;
- primary navigation buttons are centered inside their columns;
- tablet spacing is tightened without changing mobile behavior;
- company logo area and second-level navigation remain unchanged;
- no Mobility semantics, routes, commands or backend contracts change.

## Compatibility

- Mobility UX: 1.0.0-rc.19
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: R43.2.60
- Tested backend baseline: R43.2.65
- Rollback: `v1.0.0-rc.18`
