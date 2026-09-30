# v1.0.0-rc.76 — Select transport hotfix

- honors backend-published `choices[].transport_value` / `transport_value_field` for Home Assistant select writes;
- keeps product labels presentation-only;
- keeps canonical readback semantic-value based;
- fixes profile writes where the HA select option differs from the product display label, including the Peblar profile case observed on target HA;
- backend baseline remains M0.10.22; no producer semantics are reconstructed in UX.

Rollback: **v1.0.0-rc.75**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required.
