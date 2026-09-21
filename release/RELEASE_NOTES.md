# v1.0.0-rc.10 — Unified RHI header and company branding TEST CANDIDATE

## Scope

This candidate is a presentation-only shell unification over rc.9. Existing routes, screens, backend semantics, commands and content structure remain intact.

## Included

- aligns Mobility with the current Energy header geometry, spacing and hierarchy;
- keeps `Home Intelligence / MOBILITY` on the left with Mobility / Intelligence / Insights as the primary row;
- adds compact gray icons to the secondary navigation while preserving every existing route and label;
- uses the exact shared transparent Robotix company logo also used by Energy;
- keeps dark-blue Robotix/building artwork and the lighter-blue `DomotiX · Network · Security` slogan;
- keeps the company mark visible and proportioned consistently on desktop, tablet and mobile;
- standardizes the reusable `--rhi-company-*` brand-slot tokens;
- removes the superseded Mobility-specific `robotix-logo.webp` asset;
- adds a pinned brand hash, source/runtime/dist parity validation and a transferable branding contract;
- preserves the existing five-column status/outcome strip and all Mobility screen/action behaviour.

## Compatibility

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Previous candidate: `v1.0.0-rc.9`

## Qualification status

Static/HACS validation is required before TEST CANDIDATE publication. Target Home Assistant proof must still verify the resulting header and all existing Mobility screens before stable promotion.
