# v1.0.0-rc.51 — canonical cross-domain visual_ref TEST CANDIDATE

## Scope

rc.51 validates the Foundation F1.8.14 visual identity pattern in Mobility without moving artwork or semantic ownership into Foundation.

- Mobility backend M0.10.1 publishes package-neutral `visual_ref` on canonical V2 assets and the Mobility→Energy boundary.
- Mobility UX renders `visual_ref` first against its local packaged catalog.
- Existing `vehicle.image_key` / `charger.image_key` picker writes remain supported as configuration compatibility.
- Unknown or foreign visual namespaces never silently resolve to another product.

Required/tested backend: `M0.10.1`.
Rollback: `v1.0.0-rc.50`.

Target Home Assistant qualification remains mandatory.
