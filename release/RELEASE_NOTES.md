# v1.0.0-rc.31 — premium Mobility cleanup + Energy projections

## Scope

- tightens the shared Mobility presentation grammar into one compact premium layout across Mobility, Intelligence and Insights;
- keeps the current Robotix/Home Intelligence shell, Overview, Vehicles, Chargers, detail screens, controls and existing backend-owned data intact;
- makes tab heroes more compact and responsive so desktop, tablet and phone portrait keep the same visual hierarchy;
- replaces the old Planning/Strategies/History/Log placeholder presentation with the same shared premium card/fact grammar used by the current Mobility workspaces;
- makes Mobility Planning a read-only projection of Energy public planning contracts rather than a future Mobility-owned placeholder;
- projects Energy-owned per-vehicle metering and financial value into Mobility Insights using exact canonical Mobility asset ids only;
- keeps Mobility execution/activity/audit evidence separate from Energy metering/value semantics;
- fails closed to N/A/unavailable when Energy does not publish planning, metering or value;
- adds owned regression tests for Energy Planning and Energy Mobility Insights projections.

## Cross-domain ownership

Planning source:
- `sensor.energy_planning_index`
- `sensor.energy_planning_experience_index`

Insights Energy source:
- `sensor.energy_asset_metering_index`
- `sensor.energy_value_accounting_index`

Mobility UX does not recalculate Energy planning, metering or value and does not join cross-domain data by display name.

## Runtime contract

- Mobility contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum Mobility backend: `M0.9.29`
- Energy data is consumed read-only from Energy public UX entities already present in Home Assistant.
- No Mobility backend semantic extension is introduced.

## Rollback

Rollback candidate: `v1.0.0-rc.30`.

## Qualification

Before publication: source/contract tests, executable bundle proof, deterministic two-build proof, committed package/source equality and HACS validation.

Runtime proof after install: phone portrait, tablet and desktop; Overview, Vehicles, Chargers, Planning, Strategies, History and Log; existing vehicle/charger actions and pickers; Energy Planning fail-closed behavior; Energy per-vehicle metering/value projection; no-charger state; footer/runtime diagnostics.
