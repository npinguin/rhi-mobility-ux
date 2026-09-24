# v1.0.0-rc.50 — Runtime V2 asset-type contract closure

rc.50 fixes the target-runtime regression where Mobility M0.9.44 published Runtime V2 assets with `concept_id` while rc.49 filtered navigation by `asset_type`, causing all vehicles and chargers to disappear.

## Correction

- normalize Runtime V2 asset type from `asset_type` or `concept_id`;
- prove vehicle and charger discovery against the real producer field shape;
- retain V2-only authority and zero V1 fallback;
- require corrected Mobility M0.9.45, which now publishes both fields and migrates canonical V2 entity IDs.

Required/tested backend: `M0.9.45`.
Rollback: `v1.0.0-rc.49`.

Target Home Assistant qualification remains mandatory.
