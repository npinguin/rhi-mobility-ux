# v1.0.0-rc.80 — canonical cross-domain Energy V2 closure

- make `RHI_ENERGY_PUBLIC_CONTRACT_V2` the sole Energy ingress used by Mobility UX;
- replace the old Planning, Metering/Value and Strategy Energy index readers with one canonical Public V2 projection;
- fail closed when Public V2 does not publish required evidence instead of falling back to old Energy indexes;
- stop reconstructing cross-domain aggregate totals in Mobility when Energy has not published authoritative totals;
- add negative regression fixtures proving legacy-only Energy entities remain unavailable;
- extend architecture and zero-debt gates to prevent old Energy indexes from returning in Mobility UX;
- preserve Mobility-owned V2 commands, relationships, configuration and readback boundaries.

Rollback: **v1.0.0-rc.79**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required before stable promotion.
