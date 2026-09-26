# Mobility UX backlog

## Relationship-state visual/action refinement

MVP rule: vehicle/charger relationship areas must never render an unrelated vehicle or product image as a fallback.

Current MVP states remain factual and simple:
- no charger selected;
- charger assigned but not physically connected;
- charger unavailable / maintenance;
- connected / ready;
- charging.

Follow-up UX refinement:
- add one shared relationship-state illustration family;
- pair each state with one concise user-facing hint and one context-correct action;
- keep setup/incomplete states neutral, maintenance subtle amber, healthy/connected blue/green, and reserve red for real blocking faults;
- use package-owned generic illustrations, never a generated product image as device truth;
- keep the same relationship component and illustration grammar across Overview, Vehicles and Chargers;
- validate phone portrait, tablet and desktop;
- do not invent backend semantics: visual/action selection must consume explicit relationship, lifecycle, health and command/readback contracts.

The intended visual examples are:
- **No charger selected**: empty charger position / subtle plus cue;
- **Assigned, not connected**: vehicle and charger with an open/disconnected cable;
- **Maintenance**: charger with a small service cue;
- **Connected/ready**: completed connection;
- **Charging**: completed connection with restrained power-flow cue.

This is a presentation backlog item. It must not expand frozen V1 or create a second relationship-state engine in UX.


## P0 product maturity — Planning / Intelligence is not yet proven

Static implementation is not product acceptance.

Planning/Intelligence has not demonstrated a dependable end-to-end working journey on the target Home Assistant since the V2 transition. Treat the capability as open/broken-until-proven for product maturity purposes.

This depends on Energy-owned planning truth and must remain fail-closed.

Closure requires at minimum:

- real V2 planning data on the target HA;
- exact canonical Mobility asset joins;
- correct planned-today, still-to-plan and tomorrow totals;
- vehicle-centric readiness consequence;
- real strategy configured/effective state;
- refresh/reload/restart persistence where applicable;
- immutable candidate runtime evidence.

Do not add additional pilot Intelligence features before this core journey is working reliably.

## P0 product maturity — no loose pilot surfaces

Before the first mature/stable product milestone, every visible pilot capability must be integrated into a coherent supported journey, deliberately hidden/feature-gated, or removed.

Feature count is not a maturity metric.
