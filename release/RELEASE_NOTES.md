# v1.0.0-rc.85 — canonical runtime performance

- introduce a persistent canonical per-asset property index so normal rendering no longer repeatedly scans all Home Assistant states;
- use per-asset canonical revision counters plus selected producer-owned contract revisions to decide whether a screen is dirty before materializing adapters and view models;
- remove full aggregate-contract JSON serialization from detail/dashboard invalidation;
- remove property-name semantic placement fallbacks; component, section and visibility metadata remain backend-owned;
- keep generic number formatting driven by published units rather than property names;
- consume MOBILITY_CANONICAL_PROPERTY_V2 as the primary per-property authority while aggregate Runtime V2 remains a compatibility surface;
- retain existing user-visible Mobility behaviour and EN/NL/FR localization while the remaining aggregate V2 contracts stay transitional;
- preserve MOBILITY_COMMAND_V2 and MOBILITY_ENERGY_V2 as real producer-owned domain boundaries;
- qualify against Mobility M0.10.41;
- preserve RHI UX Core 1.6.3 and immutable HACS tag-tree delivery.

Rollback: **v1.0.0-rc.84**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required before stable promotion.
