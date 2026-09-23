# v1.0.0-rc.43 — UX-first status simplification on Mobility V2

This candidate applies the agreed Mobility status design and migrates the user-facing status architecture to the direct backend V2 contracts introduced in `M0.9.40`.

Required Mobility contracts:

- `MOBILITY_PUBLIC_RUNTIME_V2` — canonical fleet facts and configured/effective/physical relationships.
- `MOBILITY_EXPERIENCE_V2` — backend-owned product conclusions.
- `MOBILITY_POLICY_V2` — persistent thresholds and interpretation policy.

UX ownership is limited to **select / aggregate / format / present**. It does not derive low range, security state, maintenance state, charger fault or physical relationship identity.

Status model:

- Overview: Charging / Range / Security / Maintenance.
- Vehicle Management: Fleet / Profiles / Charging setup.
- Charger Management: Profiles / Availability / Runtime / conditional Issue.
- Planning: Today / Still to plan / Tomorrow.
- Strategies: Configured / Effective.
- History: Energy / Value / Vehicles.
- Log: recent Activity plus Attention only when a concrete backend-published action exists.
- Vehicle Detail: Range / Charging / Security / Maintenance.
- Charger Detail: State / Power / Vehicle, with Issue only when Experience V2 publishes `fault.state=active`.

Important semantics:

- Runtime V2 fleet power uses `aggregate_power_state`; unknown or partial power is never silently presented as complete zero.
- A configured charger is never presented as a physical vehicle relationship.
- Vehicle→charger physical mapping is shown only when `observed_identity_proven=true`.
- `security_intelligence.state=incomplete|unknown` is neutral, not unsafe.
- Maintenance warning treatment is driven by Experience V2 `overdue|due_soon`; scheduled/ok/unknown remain non-actionable.
- Range warning treatment is driven by Experience V2 `range_intelligence.state=low`.
- Policy thresholds are read from Policy V2; they are not duplicated as UX constants.

Tested backend baseline: `M0.9.40`.

Rollback: `v1.0.0-rc.42`.

Target Home Assistant qualification must verify the information hierarchy, V2 contract discovery and status colour behavior with real runtime data before stable promotion.
