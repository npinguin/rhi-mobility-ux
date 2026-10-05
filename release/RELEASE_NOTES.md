# v1.0.0-rc.83 — unified Mobility semantic projection candidate

- preserve the rc.82 iPad containment and charger command-alias closure;
- make VehicleProjection the sole owner of vehicle relationship, overview metrics, charging configuration, ready-by and climate facts;
- make ChargerProjection the sole owner of charger snapshot, availability and connected-vehicle relationship truth;
- remove duplicate relationship/snapshot reads from adapter presentation build paths;
- make Overview consume the same projected facts and configuration used by detail views;
- retain the single Energy Public V2 cross-domain ingress;
- strengthen architecture gates so screens cannot reopen direct semantic runtime paths.

Rollback: **v1.0.0-rc.82**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required before stable promotion.
