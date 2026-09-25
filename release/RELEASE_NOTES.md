# v1.0.0-rc.59 — runtime truth rendering TEST CANDIDATE

## Scope

rc.59 closes target-runtime truth/rendering defects observed after rc.58.

- Vehicle Management Full, EV and Battery slots consume direct V2 canonical properties:
  - `vehicle.range_total_km`
  - `vehicle.ev_range_km`
  - `vehicle.soc_pct`
- No V1/component-index fallback executes when Runtime V2 is present.
- Charger product artwork hides the generic fallback whenever the real image loads.
- Assigned charger images in Vehicle Management render at full opacity.
- Security presentation remains backend-owned and is paired with Mobility M0.10.10, which separates EV plug-lock state from whole-vehicle access security.
- Charger Session and Limit stay fail-closed. The UX does not reconstruct them from unrelated entities; target qualification must prove the Foundation → Mobility canonical publication chain.

Required/tested backend: `M0.10.10`.
Required Foundation for target proof: `F1.8.15`.
Rollback: `v1.0.0-rc.58`.

Accepted technical debt: 0.
Accepted feature debt: 0.
