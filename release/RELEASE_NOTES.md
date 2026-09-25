# v1.0.0-rc.59 — permanent detail quick actions TEST CANDIDATE

## Scope

rc.59 closes the detail-action presentation ambiguity found during target review.

- Vehicle and Charger detail pages render supported commands permanently in the dedicated **Quick Actions** strip.
- Command visibility is driven only by producer-owned `MOBILITY_COMMAND_V2` support/readiness.
- Temporarily unavailable supported commands remain visible but disabled with the producer reason.
- Assets with no supported commands correctly show no actions.
- Related Vehicle/Charger navigation in status tiles is navigation only and now uses a chevron instead of an ambiguous `+` icon.
- Status-card navigation, expansion or disclosure state can never reveal, hide or gate Quick Actions.

Required/tested backend: `M0.10.7`.
Rollback: `v1.0.0-rc.58`.

Accepted technical debt: 0.
Accepted feature debt: 0.
Target Home Assistant qualification remains mandatory, including Vehicle/Charger detail command visibility and disabled-state behavior.
