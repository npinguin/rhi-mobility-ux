# v1.0.0-rc.75 — Target-HA product UX closure

## User-facing behavior

- keeps requested charging power and actual charging power visible as separate answers for every vehicle, including explicit producer-owned reasons when either answer is unavailable;
- refuses to attribute charger power to a vehicle when physical vehicle↔charger identity is not proven;
- keeps backend-owned Security states unchanged while surfacing the published reason behind unsafe/incomplete states;
- moves both Vehicle and Charger appearance selection to one hero-level interaction instead of rendering image selection deep inside detail property families;
- keeps source/sensor facts read-only in product detail unless they are an explicit Mobility configuration intent;
- restores Charger Management scan order to text/status left and charger visual right;
- keeps blocked lifecycle controls visible with their backend reason instead of presenting a silent disabled button;
- preloads/eagerly decodes hero media and removes cosmetic image transitions to reduce refresh flicker;
- makes Planning distinguish zero from not-published and leads with “what will charge, and when?” without reconstructing Energy planning;
- makes Log lead with “what happened?” and “what needs attention?” while preserving backend-owned activity reasons.

## Boundary

rc.75 deliberately does not mask producer defects observed on M0.10.22. Peblar profile transport mismatch, Plug Car Charger appearance writability, lifecycle write bindings, Audi Q8 requested-kW/physical-identity evidence and ID.4 security truth remain backend-owned follow-up items.

Backend baseline: **M0.10.22**.
UX Core: **1.5.3**.
Rollback: **v1.0.0-rc.74**.

Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target-runtime qualification remains required before stable promotion.
