# v1.0.0-rc.73 — Mobility stabilization UX

## User-facing behavior

- makes vehicle↔charger assignment explicit and actionable in Vehicle Management;
- shows reciprocal assigned-vehicle information in Charger Management while keeping physical connection distinct;
- keeps long charger identity, location and profile information readable;
- normalizes vehicle/charger appearance picker proportions across desktop, tablet and phone;
- separates profile-owned defaults from instance configuration and keeps explicit deviations under Advanced overrides;
- targets Mobility M0.10.21 for the stabilized relationship, security, command and identity semantics.

## Engineering

- consumes canonical Mobility V2 relationship/write metadata without frontend semantic reconstruction;
- preserves deterministic HACS packaging and immutable candidate publication;
- aligns UX engineering CI with the release-boundary model so ordinary defect PRs do not require version churn.

Scope: rhi-mobility-ux#115, #116 and #118.
Rollback: **v1.0.0-rc.72**.

Known accepted technical debt: **0**.
Known accepted feature debt: **0**.

Target Home Assistant proof remains required for rendering, assignment/readback, restart/reload, upgrade and rollback before stable promotion.
