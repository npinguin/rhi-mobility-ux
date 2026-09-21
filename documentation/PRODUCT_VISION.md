# RHI Mobility UX — Product Vision and UX Guidance

## Product vision

RHI Mobility gives each Home Assistant user a calm, recognizable and actionable view of personal mobility while allowing the household to manage vehicles, chargers, profiles and charging as one connected system.

The primary user question is:

> **Is my vehicle ready for me, and do I need to do anything?**

Charging is one Mobility capability. It is not the center of the product.

## User focus

The intended hierarchy is:

```text
Home Assistant user
        ↓
primary / linked vehicle
        ↓
readiness
├─ range / energy
├─ security
├─ comfort
├─ maintenance
├─ connectivity / freshness
├─ charger relationship
└─ permitted direct actions
        ↓
household Mobility
├─ other vehicles
├─ guest / shared / disabled vehicles
├─ chargers
├─ profiles
├─ assignments
└─ charging / planning
```

User-to-vehicle focus must come from an authoritative Home Assistant-native backend contract. UX must not infer a primary vehicle from display order, charger assignment, activity, name or browser state.

Permissions may differ per Home Assistant user. UX renders only backend-authorized visibility and actions and fails closed when authorization metadata is absent.

## One model, one ownership

There is one Mobility semantic model behind the UX.

```text
MOBILITY_PUBLIC_RUNTIME_V1
        ↓
runtime contract boundary
        ↓
domain adapters / canonical UX models
        ↓
tab-specific projections
```

Overview, Vehicles, Chargers, Charging and detail views may not independently redefine the meaning of lifecycle, assignment, readiness, attention, profile, permission or action state.

Tabs bring one shared model to the user:

- **Overview** — compact operational awareness.
- **Vehicles** — extended vehicle management.
- **Chargers** — extended charger management.
- **Charging** — charging activity and planning.
- **Vehicle detail** — deep vehicle projection.
- **Charger detail** — deep charger projection.

## Overview V1

Overview evolves in place from the current product. It is not rewritten from scratch.

It must preserve recognizable vehicles and chargers, current operational status, charger assignment and direct actions while becoming more compact and correct.

Overview answers:

> **Is my vehicle ready for me, and does anything need my attention now?**

Current V1 sections remain:

- Vehicles
- Charging now
- Chargers
- Attention
- vehicle reduced cards
- Next action
- charger reduced list
- Recent activity
- conclusion

Missing backend semantics render as **N/A**. UX does not invent values, mock a future contract or derive a second semantic authority.

## Vehicle-to-charger assignment

**No charger is a valid first-class assignment across all Mobility UX surfaces.**

The UX consumes only the backend-published `vehicle.selected_charger` editor contract.

- if backend publishes `allow_none=true`, the backend `none_value` is rendered as **No charger**;
- selecting No charger writes that exact backend-owned token;
- if the assignment contract is absent, render **N/A**;
- No charger is not Unknown, Unavailable or an error.

This semantic is modeled once and reused by every tab/detail view.

## Route and position persistence

The current Mobility route is product state.

```text
refresh
→ same Mobility tab
→ same route/context
→ same relevant position
```

Overview must never refresh into Vehicles. No Mobility tab may silently switch without explicit user navigation.

## Visual direction

Preserve the shared RHI header/footer standard. Mobility does not change transversal shell behavior locally.

The only shell-level change allowed in the Mobility program is a deliberate simplification of the outer Lovelace top menu bar.

Within Mobility:

- keep real asset recognition central;
- preserve images, names, live state and direct actions;
- reduce unused space;
- use compact reduced cards on Overview;
- use extended management cards on Vehicles and Chargers;
- remain desktop, tablet and mobile friendly.

## Asset identity direction

Future management UX should support recognizable vehicle/charger families and profiles, including brand, model/family and color where backend contracts exist.

Assets remain package data under `src/assets/<category>/`. Behavior and permissions never come from artwork selection.

## V1 vs V2.x

V1 consumes only `MOBILITY_PUBLIC_RUNTIME_V1`.

Features requiring new backend truth are not mocked in V1. They render N/A/empty where appropriate and are tracked in `documentation/BACKEND_INTERFACE_BACKLOG.md`.

A later V2.x may adopt new backend contracts explicitly. V1 and V2.x must never be silently mixed.
