# Mobility UX Screen Model

Status: working model for screen-by-screen UX closure. This document is not a release artifact.

## Product truth layers

Every Mobility screen consumes the same five truth layers.

1. **Facts** — canonical per-asset scalar properties from `MOBILITY_PUBLIC_RUNTIME_V2`.
   Examples: `vehicle.range_total_km`, `vehicle.ev_range_km`, `vehicle.soc_pct`, `charger.power_kw`, `charger.actual_current_a`, `charger.current_limit_a`, `charger.session_energy_kwh`.
2. **Intelligence** — backend-owned conclusions from `MOBILITY_EXPERIENCE_V2`.
   Examples: range, security, maintenance, charging, availability and connection intelligence.
3. **Relationships** — canonical Vehicle↔Charger configured/physical relationship from Runtime V2.
4. **Commands** — backend-published `MOBILITY_COMMAND_V2`; UX presents command state but never invents it.
5. **Aggregates** — backend fleet totals from Runtime V2, e.g. active/connected/charging counts and aggregate charging power.

## Screen rules

### Overview
Question: what needs attention now?

- Charging status: fleet aggregate + Experience V2; never sum cards in the frontend.
- Range status: Range Intelligence V2 and policy threshold.
- Security: Security Intelligence V2 only.
- Maintenance: Maintenance Intelligence V2 only.
- Compact Vehicle rows: canonical facts + Intelligence V2 + relationship + commands.

### Vehicle Management
Question: what is each configured Vehicle, what is its state, and what can I manage?

- Full range = `vehicle.range_total_km`.
- EV range = `vehicle.ev_range_km`.
- Battery = `vehicle.soc_pct`.
- Security = Security Intelligence V2.
- Maintenance = Maintenance Intelligence V2.
- Assigned charger = Runtime V2 relationship / canonical selected-charger property.
- Actual charging power = physically connected Charger canonical fact.
- No separate component-index truth path when Runtime V2 exists.

### Overview policy settings

Overview may expose Mobility Policy V2 configuration only as an optional user-invoked editor from Quick Actions.

- Policy values, labels, units, limits, choices and write transport are backend-owned `MOBILITY_POLICY_V2` editor metadata.
- UX must not duplicate policy defaults or validation rules.
- A policy write is complete only after Policy V2 revision advances and canonical readback equals the requested value.
- Range, maintenance, security and charging conclusions consume the same Policy V2 values after the write.
- Policy configuration is not a fifth status layer; the editor is hidden unless the user asks for it.

### Vehicle charging relationship semantics

Vehicle↔Charger relationship presentation is tri-state:

- **Connected** only when Runtime V2 publishes a proven physical Vehicle identity for the Charger relationship.
- **Connection unknown** when a charger is configured/effective but physical Vehicle identity is not proven.
- **Not connected** may only be shown when the backend publishes explicit negative physical-connection evidence.

Absence of `physically_connected_charger_id` is not itself proof of disconnection.

### Charger Management
Question: what is each Charger doing and what can I operate?

- Power = `charger.power_kw`.
- Current = `charger.actual_current_a` (or the canonical published current fact selected by backend contract).
- Limit = `charger.current_limit_a`.
- Session = `charger.session_energy_kwh`.
- Connection/availability/charging/health = Experience V2.
- Commands = Command V2.
- Images/appearance are presentation identity only.

### Asset Detail
Question: show all canonical facts, controls and diagnostics for one asset.

Detail is the completeness/reference surface. A fact shown on Overview or Management must resolve from the same canonical property as Detail.

## Invariant

If the same fact is visible on two screens, both screens must consume the same runtime helper and canonical property key. Screen-local aliases, reconstructed values and different object shapes are forbidden.
