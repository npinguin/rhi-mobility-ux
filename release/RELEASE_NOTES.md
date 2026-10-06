# v1.0.0-rc.83 — canonical cross-surface projection closure

- make VehicleProjection and ChargerProjection the sole semantic entry for Mobility product screens;
- route Overview, Vehicles and Charger Management through canonical Fleet, Policy, Experience and relationship projections;
- remove screen-level property, metric, requested-power, appearance and relationship reads that bypass the asset projections;
- remove Experience/legacy relationship fallback as a second vehicle↔charger authority;
- keep physical charger/vehicle identity fail-closed unless published by the canonical Public Runtime relationship/snapshot;
- preserve rc.81/rc.82 phone, iPad and command behavior while tightening semantic ownership;
- keep cross-domain Energy Planning/Insights/Strategy exclusively on `RHI_ENERGY_PUBLIC_CONTRACT_V2`;
- add release-blocking architecture gates so parallel semantic paths cannot return.

Rollback: **v1.0.0-rc.82**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required before stable promotion.
