# v1.0.0-rc.90 — Mobility structural recovery (unpublished)

**WORK BRANCH ONLY — DO NOT PUBLISH OR MERGE BEFORE QUALIFICATION.** The immutable `v1.0.0-rc.89` release remains unchanged. This is prospective rc.90, not a retag and not yet target-HA qualified.

- D0/D1 planning from exact Energy-native `canonical_source` / `metric_key`, never fabricated horizon assets.
- Energy Insights requires explicit asset identity, `period_id`, availability and kWh/EUR unit; no property-name inference.
- Configured Energy Strategy from producer metadata; effective strategy unavailable without separate published truth.
- Detect duplicate canonical publishers through the contract-gap authority.
- Regression tests, product vision, backend interface backlog and engineering documentation aligned.
- HACS dist rebuilt deterministically; full npm/HACS and target HA tests remain pending.

Compatible baseline: Mobility M0.10.43 and native Energy E0.15.114. Rollback: `v1.0.0-rc.89`.

## 2026-10-11 screenshot-driven recovery (same unpublished work candidate)

- Preserve inactive/unknown vehicles on Overview even when zero are active; never silently treat them as operational.
- Accept Mobility producer commands without a `label` while preserving explicit `invoke`, supported and execution permissions; missing invoke stays disabled.
- Restore dedicated appearance-picker write capability despite readonly generic image fields; only backend-authorized writes with canonical readback.
- Replace erroneous Utility Plug car artwork with the existing producer-maintained plug schematic; pending verified model photography.
- Add current-status versus timed-event distinction, true asset visuals and Activity filtering/sorting/grouping; a coordinated Mobility backend work branch publishes timestamps for completed commands.
- Reduce detail density using wider responsive cards and a fold for secondary property rows; Insights includes real Mobility execution evidence when Energy period attribution is absent.

Full npm/HACS gates and live HA user journeys have **not yet passed**, and neither package nor backend branch has been promoted.

- Charger Management now labels the backend-configured assigned vehicle independently of physical connection; charger detail preserves the same relationship distinctions and backend profile display name.
- Inactive vehicle cards retain identity artwork instead of only state chips.
- Activity grouping now forms contiguous type/asset clusters before applying time/asset sorting.
