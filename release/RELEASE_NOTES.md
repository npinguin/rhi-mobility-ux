# v1.0.0-rc.46 — Direct Mobility Command V2 closure

This candidate moves Mobility command presentation and execution onto the canonical backend command boundary introduced by Mobility M0.9.42 and carried unchanged into M0.9.43.

The UX now discovers `MOBILITY_COMMAND_V2` by contract id and treats it as the sole command authority whenever published. Command support, readiness, blocked reason and placement come from that V2 contract. The frozen `sensor.mobility_command_index` and vehicle/charger command-slot indexes are compatibility-only and are not consulted when Command V2 exists.

Execution is routed through the producer-owned Home Assistant service:

```text
UX command
→ MOBILITY_COMMAND_V2 exact asset_id + command_key
→ rhi_mobility.execute_command
→ Mobility command controller
→ physical producer binding
→ backend-owned execution/readback lifecycle
```

The UX never receives or reconstructs raw physical service bindings. Charger Start/Stop/Unlock/Restart/Identify are therefore no longer dependent on partial V1 slot/index materialization. Vehicle engineering commands remain outside quick actions according to producer-owned placement.

Existing rc.45 picker transport, readback sequencing and cross-model artwork protection are preserved.

Required/tested backend: `M0.9.43`.
Rollback: `v1.0.0-rc.45`.

Target Home Assistant qualification remains mandatory. It must prove Command V2 discovery, complete charger command visibility, producer-owned execution, picker write/readback persistence, refresh/reload/restart behavior and rollback before stable promotion.
