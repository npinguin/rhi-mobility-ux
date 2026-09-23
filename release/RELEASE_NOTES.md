# v1.0.0-rc.36 — Restore nested assets + hero URL fix

## Scope
- restores the proven rc.34 runtime package structure under `assets/{branding,chargers,heroes,vehicles}`;
- removes the rc.35 flat `asset--...` packaging workaround;
- fixes the actual hero defect: canonical hero URLs were resolved a second time by the shared page-hero renderer;
- preserves the nine approved hero masters byte-for-byte;
- adds exact rendered hero URL regression checks and installed-target existence checks.

## Rollback
Rollback candidate: `v1.0.0-rc.34`.

## Qualification
Target Home Assistant must show the structured `www/community/rhi-mobility-ux/assets/` tree and render all seven tab heroes plus both detail scenes without manual file moves.

The rc.35 flat root layout is explicitly rejected by this candidate; runtime assets remain grouped under `assets/`.
