# v1.0.0-rc.87 — zero-debt canonical property release

- **MOBILITY_CANONICAL_PROPERTY_V2** is the sole frontend authority for per-asset Mobility properties;
- remove legacy property aliases, secondary semantic lookups, broad HA contract discovery and Experience-to-property substitution;
- require producer-owned component/section/visibility metadata and canonical command labels instead of reconstructing presentation from keys or IDs;
- keep **MOBILITY_COMMAND_V2** and **MOBILITY_ENERGY_V2** as genuine producer-owned boundary contracts;
- missing canonical truth or presentation metadata fails closed as a contract gap;
- preserve revision-scoped invalidation, EN/NL/FR localization and RHI UX Core ownership;
- enforce CI ratchets that reject semantic compatibility fallbacks.

Rollback: **v1.0.0-rc.86**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime functional and CPU qualification remains required before stable promotion.
