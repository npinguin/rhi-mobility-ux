# v1.0.0-rc.45 — Picker transport and visual consistency closure

This candidate fixes the target-runtime defects observed with rc.44 on Mobility M0.9.41.

The backend publishes canonical profile ids, while Home Assistant select entities accept their display labels. rc.44 passed the semantic id directly to `select.select_option`, producing errors such as `peblar_business_socket_22kw is not valid`. rc.45 keeps the semantic id as UX/backend truth but translates it to the contract-published choice label only at the Home Assistant transport boundary.

Vehicle and Charger picker saves are now sequenced:

```text
profile semantic value
→ awaited HA write
→ appearance/image key
→ awaited HA write
→ close picker only on success
```

Vehicle rendering also rejects a stale image key from a different model when `asset.profile_id` identifies a known canonical visual family. This prevents a Volkswagen profile from continuing to display Renault artwork after a partial/failed previous write.

The Charger picker uses the same hierarchy presentation grammar as the Vehicle picker.

Required backend: `M0.9.41`.
Rollback: `v1.0.0-rc.44`.

Target qualification remains mandatory: save Vehicle and Charger profile + appearance, verify canonical readback, refresh/reload, and restart persistence.
