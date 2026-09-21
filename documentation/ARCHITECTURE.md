# Mobility UX Architecture

## Hard boundary

Only `src/runtime/` and `src/domain/adapters/` may know Mobility public contract names; direct `hass.states` access belongs to `src/runtime/` only.

```text
MOBILITY_PUBLIC_RUNTIME_V1
        ↓
runtime
        ↓
domain adapters / models
        ↓
UI components / screens
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

## Test architecture

Test ownership mirrors runtime ownership.

```text
runtime/domain contract tests
        ↓
UX behavior owners
        ↓
shared shell owners
        ↓
package verification
        ↓
release/qualification gates
```

An invariant is asserted by exactly one owner. Other suites may rely on it but may not freeze its implementation. The normative mapping is `tests/OWNERSHIP.json`; see `documentation/TEST_GOVERNANCE.md`.

This is an architectural boundary, not a testing preference. Cross-owner assertions are test technical debt because they make unrelated changes fail together and recreate the same drift that package ownership is intended to prevent.

## Source/package architecture

The physical repository structure is part of the architecture contract:

```text
src/app
src/runtime
src/domain/adapters
src/domain/models
src/ui/components
src/ui/screens
src/assets/<category>
```

`src/manifest.json` owns build order. `src/OWNERSHIP.json` owns source responsibilities. `dist/` is the complete generated HACS package and mirrors `src/assets/` under `dist/assets/`. See `documentation/SOURCE_PACKAGE_GOVERNANCE.md`.
