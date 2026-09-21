# v1.0.0-rc.8 — screen-preservation and official Robotix branding TEST CANDIDATE

## Scope

This candidate corrects the rc.7 navigation migration defect without changing Mobility backend semantics or command ownership.

## Included

- uses the official Robotix.be logo asset supplied by the product owner;
- packages the logo inside HACS at `/hacsfiles/rhi-mobility-ux/assets/branding/robotix-logo.webp`;
- keeps the logo sharp and right aligned in the canonical Mobility shell;
- restores the pre-refactor route contract:
  - `/mobility-supervisor/dashboard` remains **Vehicles**;
  - `/mobility-supervisor/charger-maintenance` remains **Chargers**;
  - `/mobility-supervisor/asset-detail` remains the vehicle/charger detail subview;
- adds the new Overview as an additive view at `/mobility-supervisor/overview` instead of overwriting Vehicles;
- retains the agreed grouped navigation:
  - Mobility → Overview, Vehicles, Chargers, Charging;
  - Intelligence → Planning, Strategies;
  - Insights → History, Log;
- updates the complete HACS dashboard YAML so every agreed view is mounted;
- documents explicitly that HACS updates the JS resource but cannot add Lovelace views to an existing dashboard automatically;
- defaults an old dashboard-card mount without `nav_active` to **Vehicles**, preserving pre-refactor behavior;
- adds regression coverage that prevents removal/reuse of legacy screen routes during future header/navigation changes.

## Compatibility

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Previous candidate: `v1.0.0-rc.7`

## Qualification status

Static/HACS validation is required before TEST CANDIDATE publication. Target Home Assistant proof must verify the new Overview plus all preserved routes and details before stable promotion.
