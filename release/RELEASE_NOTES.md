# v1.0.0-rc.74 — M0.10.22 product acceptance candidate

## User-facing behavior

- targets the immutable Mobility backend M0.10.22 candidate and keeps backend-owned lifecycle, charging-power, relationship and planning semantics authoritative;
- keeps vehicle and charger appearance choice tiles bounded independently of source artwork dimensions through pinned UX Core 1.5.3;
- after Save, immediately carries the selected vehicle/charger appearance into the primary management card as asset-scoped pending presentation;
- clears pending appearance only when canonical Mobility image-key readback confirms the requested value;
- reverts to canonical appearance and exposes a bounded UX error when profile/image writes are rejected or readback times out;
- applies the same explicit failed/revert behavior to vehicle and charger detail pickers;
- preserves requested charging power separately from physical setpoint/readback/actual values and preserves assigned-vs-physical relationship presentation.

## Engineering

- no frontend-owned persistence or semantic reconstruction was introduced;
- pending appearance is presentation-only and never becomes domain truth;
- target-runtime proof remains required for exact rc.74 + M0.10.22 before stable promotion;
- rollback target is v1.0.0-rc.73.

Scope: appearance closure #127 plus rc.74/M0.10.22 target qualification.

Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
