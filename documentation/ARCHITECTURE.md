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


## One semantic model, multiple projections

Mobility UX has one semantic ownership model. Tabs are projections, not independent interpreters.

```text
MOBILITY_PUBLIC_RUNTIME_V1
        ↓
runtime
        ↓
domain adapters / canonical UX models
        ↓
Overview | Vehicles | Chargers | Detail
```

No screen may independently redefine lifecycle, selected charger, readiness, attention, user relationship, permission or action semantics. Missing backend truth renders N/A/fail-closed and is tracked in `documentation/BACKEND_INTERFACE_BACKLOG.md`.

`vehicle.selected_charger` unset semantics are normalized once in the vehicle adapter. **No charger** is shown only from backend-owned `allow_none` / `none_value` metadata; UX never manufactures an unset write option.

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


## Shared presentation glue

Mobility keeps domain/screen ownership separate while sharing one presentation grammar.

```text
runtime/domain truth
      ↓
screen-specific view composition
      ↓
shared presentation glue
  - typography
  - spacing/density
  - page geometry
  - shared tab hero
  - responsive modes
      ↓
phone portrait / tablet / desktop
```

`src/app/presentation.js` owns cross-screen visual tokens, responsive page geometry and the shared tab-hero composition. Screens remain owners of their semantics, actions and local composition. Common visual behavior must not be copied back into screen-local CSS unless it is a documented screen-specific exception.