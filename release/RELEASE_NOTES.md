# v1.0.0-rc.2 — V1 configuration controls TEST CANDIDATE

## Scope

This candidate keeps the public boundary at `MOBILITY_PUBLIC_RUNTIME_V1` and corrects UX consumption of existing V1 configuration-write metadata.

## Included

- vehicle and charger `asset.profile_id` render as configuration controls when V1 publishes them editable, including null/unset current values;
- selector options/labels come from V1 `choices/options`;
- `vehicle.selected_charger` follows the same unset configuration-control pattern;
- editor type, editability and write target are V1-owned;
- requested charging runtime controls remain fail-closed without published write capability;
- frontend does not infer profile/capability from integration, device name, model or units;
- frontend does not retain a second durable truth after write dispatch;
- deterministic build/checksum and release-governance gates are included.

## Compatibility

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Legacy migration source: `R22.12.11.30`

## Qualification status

Static repository validation and HACS validation are required before publication. Target Home Assistant runtime install/update/write/readback/restart/rollback proof remains required before stable promotion.
