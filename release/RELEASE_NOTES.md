# v1.0.0-rc.7 — canonical Mobility shell and action-first Overview TEST CANDIDATE

## Scope

This candidate implements the approved Mobility Overview and removes remaining shell drift across list/detail screens. It preserves `MOBILITY_PUBLIC_RUNTIME_V1`, backend semantic authority and existing command/property write contracts.

## Included

- one canonical two-level Mobility shell on Overview, Vehicles, Chargers, asset details and Intelligence/Insights placeholders;
- asset detail navigation is moved above the hero instead of being embedded inside vehicle/charger content;
- canonical 1560 px desktop shell width across Overview, Chargers, placeholders and asset detail screens;
- new Overview matching the approved product direction:
  - hero with Mobility identity and vehicle visual;
  - Vehicles / Chargers / Charging / Energy today KPIs;
  - action-first quick bar;
  - Vehicles panel;
  - Chargers panel;
  - Recent activity;
  - Next actions;
- each Overview vehicle row keeps range/energy, security, comfort, maintenance and charging context visible from backend-owned contracts;
- selected charger is editable inline per vehicle through the existing published `vehicle.selected_charger` property contract;
- backend-owned per-vehicle quick actions remain available directly from the Overview;
- charger rows consume canonical charger operating state and power;
- mock-only numbers are never hardcoded: `Energy today` is unavailable unless explicitly published by Mobility;
- new regression gate for canonical shell placement, Overview structure, assignment control and hardcoded mock-value prevention.

## Compatibility

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Previous candidate: `v1.0.0-rc.6`

## Qualification status

Static validation and HACS validation are required before TEST CANDIDATE publication. Target Home Assistant proof must still confirm the Overview at desktop/tablet/mobile widths, inline charger assignment/readback, direct commands, detail navigation, and shell consistency before stable promotion.
