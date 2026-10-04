# v1.0.0-rc.79 — V2-only zero-debt UX closure

- decommission all Mobility V1 product API compatibility and fallback paths;
- consume UX Core 1.6.0 compact shared page, asset and localization grammar;
- remove domain presentation specificity debt and require zero `!important` overrides;
- fail closed when V2 product truth is absent instead of reconstructing legacy state;
- keep technical contract/entity evidence out of normal product states and reserve it for diagnostics;
- add a hard zero-debt release gate preventing V1 product APIs and presentation debt from returning;
- preserve backend-owned commands, relationships, write/readback and cross-domain Energy truth.

Rollback: **v1.0.0-rc.78**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification, including EN/NL/FR product proof, remains required before stable/pilot promotion.
