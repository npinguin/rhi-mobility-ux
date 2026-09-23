# v1.0.0-rc.41 — V2-first status architecture

This candidate is the rc.41 stop/go implementation around backend contract-gap issue #107.

Tested backend baseline: `M0.9.39`.

- Mobility Overview is organized around Charging, Range and Comfort, with Attention rendered only when backend-published security or maintenance intelligence reports an actionable state.
- Security and maintenance no longer infer meaning from display text or regular expressions.
- Vehicle Management top status is Configuration / Charging setup / Data health. Missing configuration-completeness and data-health product facts remain explicit V2 contract gaps rather than frontend reconstructions.
- Charging setup counts exact selected charger relationships and no longer treats editor sentinel values as assignments.
- Charger Management top status is Configuration / Site / Runtime, with a conditional Issue card only for canonical charger fault state.
- Aggregate actual charger power remains a Mobility fact; site capacity remains an explicit V2/Energy contract gap.
- No new V1-only dependency is introduced. Existing public V1 facade consumption remains transitional until backend #107 confirms direct V2 authority and migration paths.

Rollback: `v1.0.0-rc.40`.

Target Home Assistant qualification and V2 contract confirmation remain mandatory before stable promotion.
