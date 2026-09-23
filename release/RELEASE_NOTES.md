# v1.0.0-rc.44 — V2 picker closure

This candidate closes the known Vehicle/Charger picker defects against Mobility backend `M0.9.41`.

- Vehicle Brand / Model / Variant now select a Mobility-owned product profile via `asset.profile_id`; Colour persists through `vehicle.image_key`.
- Charger Brand / Model / Variant now select a Mobility-owned charger profile via `asset.profile_id`; Appearance persists through `charger.image_key`.
- The UX resolves canonical per-asset V2 property sensors first and consumes their published write capability instead of requiring the frozen V1 property-index path.
- Charger Management fixes the render guard that previously prevented the picker from appearing after clicking **Charger & colour**.
- Active picker sessions remain local and stable during normal Home Assistant refreshes.
- Product artwork/profile mapping is explicit in the UX visual catalog; the UX does not infer backend identity from free text.

Required backend: `M0.9.41`.

Rollback: `v1.0.0-rc.43`.

Target qualification must prove both pickers on real Home Assistant: open, hierarchy edit, save, canonical readback, refresh, reload and restart persistence.
