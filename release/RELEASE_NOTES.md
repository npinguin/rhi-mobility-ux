# v1.0.0-rc.39 — Clean heroes + canonical asset detail layout

## Scope
- removes page-location/navigation labels from Mobility heroes;
- uses only page/device title, purpose and artwork in the hero;
- rebuilds Vehicle Detail and Charger Detail on the same hero/status/actions hierarchy as Mobility Overview;
- retains transparent canonical detail scene art and shows the actual selected vehicle/charger as the foreground asset;
- moves status cards below the hero and Quick Actions below status;
- leaves domain cards and backend contracts unchanged.

## Required runtime hierarchy
navigation → hero(title + purpose + asset visual) → status cards → quick actions → detail content.

## Rollback
Rollback candidate: `v1.0.0-rc.38`.

## Qualification
Target Home Assistant proof must confirm:
- no `MOBILITY / ...`, breadcrumb or Back-to-Dashboard text inside heroes;
- Vehicle Detail and Charger Detail both use Overview-style hero geometry;
- actual selected asset image is visible in each detail hero;
- status and action rows render below the hero;
- desktop/tablet/mobile layouts remain usable.
