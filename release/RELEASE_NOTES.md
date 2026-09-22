# v1.0.0-rc.30 — Mobility UX coherence + identity-safe picker

## Scope

- makes Overview the explicit presentation reference for page spacing, section spacing, card rhythm, control height and responsive density;
- centralizes common Vehicles/Chargers presentation glue in `src/app/presentation.js` while preserving screen-specific semantics and functionality;
- removes the synthetic standalone Charging tab/page/hero from Mobility navigation and presentation contracts;
- keeps Overview, Vehicles and Chargers as the current Mobility workspaces;
- fixes Vehicle & colour so frozen-V1 product identity comes from the backend/profile and `vehicle.image_key` can only select appearance within that same product;
- clears unsaved picker drafts on close/reopen so another vehicle's draft cannot leak into the current vehicle;
- rejects cross-model persisted image overrides instead of presenting them as vehicle identity;
- fixes the no-charger relationship fallback so the vehicle card shows an explicit charger fallback / “No charger selected” state instead of resolving through an unrelated default asset;
- upgrades the three tab hero scenes to a darker premium home-mobility visual language with sports-car/charging context;
- records relationship-state illustration/action refinement as an explicit UX backlog item without expanding frozen V1.

## Runtime contract

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `M0.9.29`
- V1 remains frozen; no new backend semantics are introduced.

## Rollback

Rollback candidate: `v1.0.0-rc.29`.

## Qualification

Before publication: static/source validation, executable shared-presentation proof, picker identity-safety regression, deterministic two-build proof, committed package/source equality and HACS validation.
Runtime proof after install: phone portrait, tablet and desktop; Overview, Vehicles and Chargers; picker reopen/cancel/save; no-charger state; existing actions/controls remain present.
