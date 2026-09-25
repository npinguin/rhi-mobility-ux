# v1.0.0-rc.58 — bootstrap install and charger layout cleanup TEST CANDIDATE

## Scope

rc.58 makes Mobility easier to install while preserving all existing dashboard configurations. It also closes the visible charger icon/layout defects found during rc.57 target review.

- Adds `custom:homebrain-mobility-card` as the recommended single-card bootstrap.
- New dashboards can use one Lovelace view and one custom card, matching the Energy installation pattern.
- Existing multi-view YAML and all current custom card names/routes remain supported.
- Bootstrap internal navigation uses `?mobility_view=...` and keeps refresh/browser navigation meaningful.
- Removes the duplicate Vehicles management CTA below Filters.
- Uses real charger artwork as the primary identity; the duplicate generic charger icon is removed.
- Uses semantically correct charger fact/status/action icons.
- Replaces `+` as charger Details with a labeled chevron action.
- Keeps lifecycle action visible and labeled.
- Compacts charger facts and command layout without changing command ownership or grouping.

Required/tested backend: `M0.10.7`.
Rollback: `v1.0.0-rc.57`.

Accepted technical debt: 0.
Accepted feature debt: 0.
Target Home Assistant qualification remains mandatory for bootstrap install, legacy multi-view compatibility, navigation refresh, phone/tablet/desktop presentation and charger icon hierarchy.
