# v1.0.0-rc.85 — canonical property performance architecture

- index canonical Mobility property entities once instead of scanning the complete Home Assistant state tree on every property read;
- make backend-published component/section/visibility metadata the sole owner of property placement and remove property-name semantic fallbacks;
- replace full aggregate-contract JSON signatures with cheap entity revision signatures;
- skip dashboard, detail, charger-management and routed-view rebuilds when relevant canonical/contract entities did not change;
- keep MOBILITY_COMMAND_V2 and MOBILITY_ENERGY_V2 as producer-owned boundary contracts and retain aggregate V2 only as migration compatibility;
- preserve EN/NL/FR pilot localization, Core 1.6.3 presentation ownership and fail-closed unavailable semantics.

Rollback: **v1.0.0-rc.84**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required before stable promotion.
