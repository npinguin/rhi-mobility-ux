# v1.0.0-rc.82 — iPad vehicle-card and command closure

- deduplicate semantically equivalent charger Start/Start Charging and Stop/Stop Charging aliases without synthesizing commands;
- preserve the original backend command row, physical executor, execution_allowed and blocked_reason;
- keep source_temporarily_unavailable fail-closed instead of enabling an unsafe action;
- make the five vehicle intelligence fields responsive at iPad/tablet widths and contain long product copy within its tile;
- preserve M0.10.35 canonical configured/effective/observed vehicle↔charger truth.

Rollback: **v1.0.0-rc.81**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required before stable promotion.
