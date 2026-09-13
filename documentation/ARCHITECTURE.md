# Mobility UX Architecture

## Hard boundary

Only `src/runtime/` and `src/adapters/` may know Home Assistant Mobility public contract entity/field names.

```text
MOBILITY_PUBLIC_RUNTIME_V1
        ↓
runtime / adapters
        ↓
canonical viewmodels
        ↓
components / screens
```

Forbidden for screens/components:

- `hass.states` reads;
- direct `sensor.mobility_*` or `script.mobility_*` references;
- source/integration entity access;
- topology reconstruction;
- command readiness derivation;
- property semantic fallback;
- local component/family reconstruction.

## Ownership invariants

- Charger product state: `charger.operating_state`.
- Charger connection: `charger.connection_state`.
- Charger actual power: `charger.power_kw`.
- Charger health: `charger.health` + `charger.health_reason`.
- Relationships: Mobility Relationship Index only.
- Command placement: backend command-slot indexes only.
- Command readiness/invoke: Mobility Command Index only.
- Command activity/result: Mobility Activity Index only.

## Actual/readback

Operational values render canonical actual/readback by default. Requested/setpoint values are interaction state only while editing or while backend write state is pending. The migration RC does not redesign existing controls; this invariant is preserved as the forward contract requirement.
