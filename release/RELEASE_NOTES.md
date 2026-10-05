# v1.0.0-rc.82 — canonical Mobility projection closure

- make raw Runtime/Experience/Policy V2 readers runtime-private;
- require exact producer-owned V2 contract ingresses instead of discovering alternate HA entities;
- make Runtime V2 the sole fleet and physical relationship authority;
- route Overview and Charger Management through normalized fleet/policy projections;
- route Vehicle and Charger adapters through canonical Experience and relationship projections;
- remove Experience-based fallback for physical charger/vehicle identity and overview metric values;
- keep cross-domain Energy consumption exclusively on RHI_ENERGY_PUBLIC_CONTRACT_V2;
- add architecture gates preventing UI/adapters from bypassing canonical projections.

Missing canonical product truth fails closed; it is never reconstructed from a parallel contract path.

Rollback: **v1.0.0-rc.81**.  
Known accepted technical debt: **0**.  
Known accepted feature debt: **0**.

Target Home Assistant runtime and rollback qualification remain mandatory before stable promotion.
