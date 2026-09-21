# Changelog

## 1.0.0-rc.11 — shared UX release and footer governance

- Publishes TEST CANDIDATE versions as HACS-visible normal GitHub Releases rather than GitHub prereleases.
- Makes stable promotion evidence-only against the exact immutable candidate.
- Standardizes the compact footer contract with Energy.
- Collapses Mobility runtime/acceptance diagnostics into one issue label + tooltip in the footer.
- Adds shared release/footer standards and fail-closed drift validation.
- Preserves all Mobility routes, screens, actions, header geometry and company branding.


## 1.0.0-rc.10 — unified RHI header and company branding

- Aligns Mobility header geometry and hierarchy with the current Energy shell.
- Uses the exact shared transparent Robotix company logo and shared brand-slot tokens.
- Adds compact gray icons to the second navigation line without changing routes.
- Keeps the company mark visible and consistently sized across desktop, tablet and mobile.
- Removes the superseded Mobility-specific WebP logo asset.
- Adds immutable brand hash/parity validation and transferable branding documentation.
- Preserves all Mobility screens, actions, status rails and backend semantic boundaries.
- Status: source candidate until immutable TEST CANDIDATE publication.

## 1.0.0-rc.9 — layout hardening

- Fixes the official Robotix.be logo runtime path for HACS.
- Keeps the logo sharp and right aligned in the shared header.
- Makes the shared five-column status rail authoritative across screens.
- Prevents Vehicles status/trust/attention/opportunity/recommendation from collapsing into a vertical text stack.
- Tightens header proportions and shared spacing without changing routes or screen content.
- Adds layout-hardening regression coverage.
- Status: source candidate until immutable TEST CANDIDATE publication.

## 1.0.0-rc.8 — screen preservation and official brand asset

- Replaces the temporary drawn Robotix mark with the official supplied Robotix.be logo asset.
- Preserves the legacy Vehicles route at `/dashboard`, Chargers at `/charger-maintenance`, and generic asset detail at `/asset-detail`.
- Moves the new Overview to additive route `/overview` instead of replacing Vehicles.
- Keeps Mobility → Overview / Vehicles / Chargers / Charging, Intelligence → Planning / Strategies, and Insights → History / Log.
- Updates HACS migration YAML to include every agreed screen/view.
- Makes legacy dashboard-card mounts default to Vehicles when no `nav_active` is configured.
- Adds route/screen preservation regression coverage.
- Status: source candidate until immutable TEST CANDIDATE publication.

## 1.0.0-rc.7 — canonical shell and action-first Overview

- Implements the approved Mobility Overview composition with hero, four KPIs, quick actions, Vehicles, Chargers, Recent activity and Next actions.
- Keeps range/energy, security, comfort, maintenance and charging context visible on Overview vehicle rows.
- Allows inline assign/change charger using the existing backend-published selected-charger property.
- Preserves backend-owned vehicle quick actions directly on Overview rows.
- Moves canonical navigation above vehicle/charger detail heroes.
- Normalizes desktop shell width across Overview, Chargers, detail and placeholder screens.
- Prevents mock-only values from leaking into runtime presentation.
- Adds canonical shell/Overview regression coverage.
- Status: source candidate until immutable TEST CANDIDATE publication.

## 1.0.0-rc.6 — Energy-style header and grouped navigation

- Aligns Mobility header typography, spacing and visual tokens with Energy.
- Introduces top-level Mobility, Intelligence and Insights modules.
- Groups Overview / Vehicles / Chargers / Charging under Mobility.
- Groups Planning / Strategies under Intelligence.
- Groups History / Log under Insights.
- Keeps Robotix.be branding sharp, vector-based, replaceable and right aligned.
- Reuses existing screens; no Mobility backend semantics or command behavior change.
- Adds navigation-shell regression coverage.
- Status: source candidate until immutable TEST CANDIDATE publication.

## 1.0.0-rc.5 — backend-owned supervisor semantics candidate

- Removes frontend-derived global supervisor conclusions from the Mobility dashboard.
- Reads global status, trust, attention, opportunity and recommendation from the backend-owned Mobility Intelligence Index.
- Fails closed as Unknown/unavailable when supervisor meaning is not published.
- Stops factual charging summaries from being promoted into supervisor recommendations/opportunities.
- Keeps requested charge-power intent separate from canonical actual charger power.
- Adds a focused regression that rejects reintroduction of positive frontend supervisor fallbacks.
- Preserves the rc.4 release-governance and immutable qualification lifecycle.
- Status: source candidate until an immutable GitHub prerelease/tag is created.

## 1.0.0-rc.4 — closure governance and regression candidate

- Preserves `MOBILITY_PUBLIC_RUNTIME_V1` and the existing runtime/adapters → viewmodels → screens/components architecture.
- Fixes the immutable TEST CANDIDATE → runtime qualification → stable promotion lifecycle.
- Binds runtime qualification to the published candidate tag and exact commit SHA without moving or republishing the candidate.
- Keeps runtime JS/checksum immutable while allowing final qualification evidence to be attached at stable promotion.
- Aligns governance documentation and automated enforcement, including removal of the obsolete `MIGRATION_STATUS.md` requirement.
- Moves the historical rc.1 validation transcript out of active candidate evidence.
- Adds focused regressions for qualification lifecycle and canonical actual/unavailable semantics.
- Does not introduce new frontend semantic authority, framework layers or fallback reconstruction.
- Status: source candidate until an immutable GitHub prerelease/tag is created.

## 1.0.0-rc.2 — V1 configuration editable candidate

- Renders `asset.profile_id` as a V1-owned configuration control for vehicle and charger assets even when its current value is unset.
- Uses only V1-published choices/options, write metadata and write targets for configuration editors.
- Applies the same unset configuration-control pattern to `vehicle.selected_charger`.
- Keeps runtime controls such as requested charging power fail-closed unless V1 publishes actual runtime write capability.
- Removes editor-type inference from property names/units and avoids retaining a second local truth after write dispatch.
- Adds vehicle and charger regression coverage for these semantics.
- Makes bundle/runtime version checks derive from `package.json` instead of hard-coded RC strings.
- Status: immutable HACS TEST CANDIDATE published.

## 1.0.0-rc.1 — HACS migration baseline

- Migrates legacy Mobility UX `R22.12.11.30` into a dedicated public HACS Dashboard/plugin repository.
- Preserves the current custom-element names and screen behavior.
- Embeds the exact legacy PNG image bytes in the generated JS bundle so no `/local/homebrain/...` runtime deployment is required.
- Adds deterministic source-to-dist build, contract/architecture/render smoke tests and public-repository hygiene validation.
- Adds `COMPATIBILITY.json` for `MOBILITY_PUBLIC_RUNTIME_V1` / backend R43.2.60 migration baseline.
- Does not redesign UX semantics or repair known product defects as part of the packaging migration.
