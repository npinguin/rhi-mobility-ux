# v1.0.0-rc.85 — canonical Mobility property interface

- consume **MOBILITY_CANONICAL_PROPERTY_V2** as the primary per-property authority;
- retain **MOBILITY_PUBLIC_RUNTIME_V2** only as compatibility aggregate/fallback during migration;
- preserve backend-owned component, section, visibility, render, write and quality metadata;
- make canonical property rows outrank duplicate aggregate-era rows;
- keep **MOBILITY_COMMAND_V2** as the product command authority and **MOBILITY_ENERGY_V2** as the Energy boundary;
- preserve current Vehicle/Charger UX and fail-closed semantics;
- qualify against Mobility **M0.10.41**.

Rollback: **v1.0.0-rc.84**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime functional and CPU qualification remains required before stable promotion.
