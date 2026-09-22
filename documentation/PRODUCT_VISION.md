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

## Vehicle visual catalog rule

Vehicle visuals are UX-owned package data; Mobility persists only the selected `vehicle.image_key`.

For the current release line:

- every supported real vehicle in the current Mobility scope has its own canonical package artwork;
- one real model maps to exactly one base artwork master; hero/detail/overview are presentation crops over that same master;
- verified production models may not share identical artwork bytes;
- no current supported model may resolve through another model, generic guest art, profile-source artwork or a legacy hero asset;
- legacy persisted keys are accepted only as input aliases and normalize immediately to the canonical vehicle visual identity;
- generic guest vehicles deliberately use the single generic fallback master;
- colour variants are rendered on the fly; separate image files per colour are forbidden unless a later visual contract explicitly requires them.

Current real-model package coverage is Audi Q8, BMW X1 PHEV, Mercedes-Benz GLA PHEV, Renault Scenic E-Tech and Volkswagen ID.4. Guest PHEV/EV share the explicit generic vehicle fallback.

The canonical vehicle file inventory is enforced by `tools/check-asset-policy.mjs`; dead hero/default/unknown duplicate files fail validation.

Assets remain package data under `src/assets/<category>/`. Behavior, permissions and operational semantics never come from artwork selection.

The same Vehicle / Colour picker component is used wherever vehicle appearance is editable. Vehicle Management and Vehicle Detail may present it differently, but neither may expose a raw `vehicle.image_key` editor or maintain a second catalog.

The picker hierarchy is Brand → Model → Variant → Colour. Opening a picker must preserve the current Mobility identity; unknown or future keys must never silently resolve to the first catalog entry. Artwork provenance and future expansion are governed by `documentation/VEHICLE_ARTWORK_SOURCES.json`.

## Shared Vehicle and Charger visual library

Vehicle and Charger presentation follows one governed UX-owned pattern. The current release line stays on frozen `MOBILITY_PUBLIC_RUNTIME_V1`; the visual library must not require new V1 product semantics.

```text
frozen V1 object
      ↓
runtime/domain adapter
      ↓
canonical UX view model
      ↓
UX visual catalog + resolver
      ↓
Overview / Management / Detail / relationship visuals
```

The same presentation pattern applies to both object types:

- Brand → Model → Variant → Appearance/Colour;
- one canonical artwork master per real model/physical appearance;
- legacy keys are compatibility aliases only;
- technical specifications do not become visual identity;
- every screen uses the same resolver;
- `image_key` is an explicit persisted presentation choice only when the backend contract supports writing it;
- read-only V1 presentation properties may drive current rendering but UX never creates a browser-local second truth.

Current Charger catalog coverage is:

- Wallbox Commander 2 with White and Black appearances;
- Peblar Business, Socket;
- Fibaro Wall Plug 2, Z-Wave Plus BE/FR.

Power/current/phase capabilities stay backend/profile/runtime facts and are intentionally absent from the visual identity catalog.

The visual-library update workflow, quality gates and future cross-domain reuse are governed by `documentation/VISUAL_LIBRARY_GOVERNANCE.md`. Charger product/artwork provenance is tracked in `documentation/CHARGER_ARTWORK_SOURCES.json`.

## V1 vs V2.x

V1 consumes only `MOBILITY_PUBLIC_RUNTIME_V1`.

Features requiring new backend truth are not mocked in V1. They render N/A/empty where appropriate and are tracked in `documentation/BACKEND_INTERFACE_BACKLOG.md`.

A later V2.x may adopt new backend contracts explicitly. V1 and V2.x must never be silently mixed.
