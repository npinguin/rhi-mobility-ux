# v1.0.0-rc.86 — canonical V2 zero-debt candidate

- publish the exact current Mobility UX runtime after the canonical V2, performance and zero-debt closures;
- consume **MOBILITY_CANONICAL_PROPERTY_V2** as primary per-property authority;
- retain **MOBILITY_PUBLIC_RUNTIME_V2** only as compatibility aggregate/fallback during migration;
- keep revision-scoped canonical indexing and canonical duplicate precedence;
- remove frontend semantic fallbacks that could recreate backend meaning;
- keep **MOBILITY_COMMAND_V2** as command authority and **MOBILITY_ENERGY_V2** as the Energy boundary;
- qualify against Mobility **M0.10.41**.

Rollback: **v1.0.0-rc.85**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime functional and CPU qualification remains required before stable promotion.
