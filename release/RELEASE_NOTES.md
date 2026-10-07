# v1.0.0-rc.84 — pilot localization and Core convergence

- converge Mobility UX on the current shared RHI UX Core 1.6.3 commit `56560ba61893089b3e0ab8b6535fd777a799066b`;
- expand EN/NL/FR product localization for the shell, appearance pickers, dashboard and charger-management pilot surfaces;
- route primary pilot-visible copy through stable localization keys instead of embedded English literals;
- add a release-blocking source guard for raw pilot-visible copy bypassing localization;
- preserve canonical Vehicle/Charger/Fleet projections and V2-only backend ownership from rc.83;
- reset target-Home-Assistant qualification because shared Core and rendered product copy changed.

Rollback: **v1.0.0-rc.83**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required before stable promotion.
