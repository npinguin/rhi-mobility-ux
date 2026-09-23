# Mobility UX Architecture

## Hard boundary

Only `src/runtime/` and `src/domain/adapters/` may know Mobility public contract names; direct `hass.states` access belongs to `src/runtime/` only.

```text
MOBILITY_PUBLIC_RUNTIME_V2 = canonical facts / fleet / physical relationships
MOBILITY_EXPERIENCE_V2     = backend-owned user conclusions
MOBILITY_POLICY_V2         = persistent interpretation policy
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
MOBILITY_PUBLIC_RUNTIME_V2
        ↓
runtime
        ↓
domain adapters / canonical UX models
        ↓
Overview | Vehicles | Chargers | Detail
```

No screen may independently redefine lifecycle, relationship identity, readiness, range classification, security, maintenance, charge demand, availability or fault semantics. Product conclusions come from `MOBILITY_EXPERIENCE_V2`; fleet totals and physical relationship proof come from `MOBILITY_PUBLIC_RUNTIME_V2`; thresholds come from `MOBILITY_POLICY_V2`. Missing backend truth renders unavailable/fail-closed.

`vehicle.selected_charger` unset semantics are normalized once in the vehicle adapter. **No charger** is shown only from backend-owned `allow_none` / `none_value` metadata; UX never manufactures an unset write option.

## Ownership invariants

- Fleet counts / aggregate charging power / completeness: `MOBILITY_PUBLIC_RUNTIME_V2.fleet`.
- Vehicle↔charger configured/effective/physical identity: `MOBILITY_PUBLIC_RUNTIME_V2.vehicle_charger_relationships`.
- Vehicle product conclusions: `MOBILITY_EXPERIENCE_V2.vehicles[]`.
- Charger product conclusions and fault: `MOBILITY_EXPERIENCE_V2.chargers[]`.
- Thresholds and required coverage: `MOBILITY_POLICY_V2.policy`.
- UX owns select / aggregate / format / present only; it does not recreate product states.
- Scalar property indexes remain valid for detailed factual values and controls, not for re-deriving Experience V2.
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

## Cross-domain Energy projections

Mobility UX may present Energy-owned planning, metering and value when the data is explicitly published through Energy public UX contracts. This is a read-only cross-domain projection boundary; it does not make Mobility the semantic owner.

```text
Energy public UX contracts
  ├─ sensor.energy_planning_index
  ├─ sensor.energy_planning_experience_index
  ├─ sensor.energy_strategy_profile_index
  ├─ sensor.energy_strategy_effective_index
  ├─ sensor.energy_asset_metering_index
  └─ sensor.energy_value_accounting_index
          ↓
src/runtime/energy-*-projection.js
          ↓ exact canonical asset-id join only
Mobility Intelligence / Insights presentation
```

Rules:

- Planning totals, schedule state and planning evidence remain Energy-owned.
- Strategy profiles and effective energy policy remain Energy-owned.
- Vehicle/flexible-load measured energy and financial attribution remain Energy-owned.
- Mobility UX never recalculates planning, metering or value.
- Mobility UX never joins cross-domain data by display name, order, integration name or artwork.
- Cross-domain joins use exact canonical Mobility asset ids only.
- Missing Energy truth renders unavailable/N/A; there is no Mobility fallback calculation.
- Mobility remains owner of vehicle readiness, charger assignment, vehicle/charger execution, commands and Mobility activity/audit evidence.
