## 1.0.0-rc.53 — Mobility-wide asset identity closure

- applies vehicle/charger pictures to inactive vehicles, selected charger assignments, issue references and related-asset detail rows;
- carries related vehicle/charger asset ids through the existing detail-link decoration so the shared asset shell can render the actual related asset picture;
- centralizes inline vehicle/charger picture rendering instead of adding screen-specific artwork rules;
- preserves canonical backend relationships and existing visual_ref/image-key ownership;
- adds release-blocking Mobility-wide asset identity regression coverage;
- preserves Mobility M0.10.1 compatibility and zero accepted technical/feature debt.

## 1.0.0-rc.52 — picture-first asset identity

- adds a live product image preview directly inside Vehicle & colour and Charger & colour pickers;
- keeps picker previews synchronized while brand/model/variant/colour selections change;
- reuses the same package-owned artwork and canonical `visual_ref`/image-key bridge already used by Mobility cards;
- keeps existing profile/image write sequencing and canonical backend readback unchanged;
- adds a release-blocking picture-first picker regression check;
- preserves Mobility M0.10.1 compatibility and zero accepted technical/feature debt.

## 1.0.0-rc.51 — canonical cross-domain visual_ref pilot

- consume backend-published `visual_ref` before legacy `image_key` for vehicle and charger rendering;
- resolve only the Mobility namespace against the package-local visual catalog;
- keep `vehicle.image_key` and `charger.image_key` write compatibility for the existing visual pickers;
- reject foreign visual namespaces and keep package artwork fully UX-owned;
- pair the candidate with Mobility M0.10.1 and reset target Home Assistant qualification.

## 1.0.0-rc.50 — Runtime V2 asset-type contract closure

- accept producer `concept_id` as canonical asset type input;
- retain `asset_type` support for corrected M0.9.45 producer rows;
- test representative vehicle + charger discovery using the real producer shape;
- require Mobility M0.9.45 and keep zero V1 fallback.

## 1.0.0-rc.49 — Mobility M0.9.44 complete V2 consumption closure

- raise the supported/tested Mobility backend baseline to M0.9.44;
- take asset discovery from Runtime V2 `assets` and relationships from Runtime V2 `relationships`;
- consume Activity V2, Profile Catalog V2 and product Supervision V2 directly;
- consume `MOBILITY_ENERGY_V2` instead of the frozen Energy publication facade;
- use Experience V2 as the only user-facing intelligence source;
- stop filling missing V2 properties/commands from V1 once Runtime V2 is present;
- consume per-asset property-publication completeness evidence so missing expected V2 entities fail visibly;
- keep V1 only as old-backend compatibility code outside the M0.9.44+ supported path;
- reset target Home Assistant qualification for the complete V2 consumer set.

## 1.0.0-rc.48 — UX authority, visual identity and canonical write closure

- move Overview vehicle Range/Energy/Security/Maintenance signals fully onto Experience V2;
- remove the primary-dashboard fallback to legacy vehicle intelligence;
- make persisted V2 charger appearance outrank legacy charger instance aliases;
- enforce vehicle and charger profile-family visual identity across stale/partial writes;
- require canonical backend readback for generic property, lifecycle, assignment and charge-power writes;
- fail visibly when service acceptance is not followed by canonical readback;
- add behavioral conflict tests for semantic and visual authority;
- make Product Vision V2-first and gate V1-primary documentation drift;
- record V2 property-publication completeness as an explicit backend diagnostic interface gap.

## 1.0.0-rc.47 — Direct V2 property, placement and relationship closure

- prefer direct per-asset `MOBILITY_PUBLIC_RUNTIME_V2` property entities over frozen V1 property indexes;
- drive product detail placement from backend-published `component_id` + `section_id`;
- fail visibly on missing V2 placement instead of inventing Engineering/Unmapped;
- isolate backend-marked engineering properties from normal product sections;
- consume Runtime V2 vehicle↔charger relationships directly and preserve configured/effective/physical distinctions;
- keep physical identity fail-closed unless `observed_identity_proven=true`;
- retain V1 property/component/relationship indexes only as compatibility fallbacks when V2 is absent;
- preserve rc.46 Command V2 execution and rc.45 picker/visual protections.

## 1.0.0-rc.46 — Direct Mobility Command V2 closure

- consume backend `MOBILITY_COMMAND_V2` directly and fail closed without V1 fallback once the V2 contract is present;
- take command support, readiness, blocked reason and placement from the producer-owned V2 contract;
- execute commands only through `rhi_mobility.execute_command` with exact `asset_id` + `command_key`;
- remove V1 command-index and slot-index authority from the V2 path;
- keep charger Start/Stop/Unlock/Restart/Identify complete even when legacy slot materialization is partial;
- keep vehicle engineering commands out of quick actions according to backend placement;
- preserve rc.45 picker sequencing, semantic transport translation and visual identity safety;
- advance the tested backend baseline to Mobility M0.9.43.

## 1.0.0-rc.45 — Picker transport and visual consistency closure

- translate canonical semantic profile ids to Home Assistant select option labels at the transport boundary;
- await profile persistence before writing vehicle/charger appearance keys;
- keep failed writes visible instead of silently closing the picker;
- reject stale cross-model vehicle artwork when the current Mobility profile identifies another vehicle;
- align Charger picker hierarchy layout with the Vehicle picker;
- preserve M0.9.41 as the backend baseline.

## 1.0.0-rc.44 — V2 picker closure

- fixes the Charger Management picker open/close render guard so the panel actually materializes on click;
- moves Vehicle and Charger picker product selection onto Mobility-owned `asset.profile_id` and keeps colour/appearance on `vehicle.image_key` / `charger.image_key`;
- adds a V2-native semantic-property resolver before legacy compatibility fallback;
- requires backend M0.9.41, whose canonical scalar property sensors expose complete write capability and structured profile choices;
- preserves local draft editing and prevents normal HA refresh from reconstructing an active picker;
- saves profile intent first, then appearance, and relies on canonical backend readback as durable truth;
- removes the obsolete appearance-only/read-only V1 picker assumption.

## 1.0.0-rc.43 — UX-first status simplification on Mobility V2

- migrates user-facing Mobility status consumption to backend M0.9.40 direct V2 surfaces: `MOBILITY_PUBLIC_RUNTIME_V2`, `MOBILITY_EXPERIENCE_V2` and `MOBILITY_POLICY_V2`;
- keeps UX ownership to select / aggregate / format / present: range, security, maintenance, charge demand, availability and fault conclusions are no longer reconstructed in frontend code;
- Overview now answers the four agreed user questions directly: Charging, Range, Security and Maintenance, each in a compact three-line card;
- charging totals and aggregate power come from Runtime V2 fleet facts, including aggregate-power completeness; physical vehicle→charger labels appear only when `observed_identity_proven=true`;
- range low/ok, security secure/unsafe/incomplete/unknown and maintenance overdue/due_soon/scheduled/ok/unknown come directly from Experience V2;
- thresholds are read from Policy V2 rather than duplicated in UX;
- Vehicle Management consumes Experience V2 configuration/profile and charging-relationship facts;
- Charger Management consumes Runtime V2 fleet totals and Experience V2 availability/fault/configuration conclusions;
- Vehicle Detail consumes Experience V2 Range / Charging / Security / Maintenance;
- Charger Detail consumes Experience V2 State / Power / Vehicle and renders Issue only when `fault.state=active`;
- normal/available/connected/scheduled/secure states remain visually neutral; action colour is reserved for backend-owned actionable states;
- renames Vehicles and Chargers to Vehicle Management and Charger Management across navigation, heroes and dashboard view titles;
- reduces Planning, Strategies, History and Log headers to user-value facts instead of technical source/contract KPIs;
- preserves rc.42 picker write/readback and refresh-session fixes.

## 1.0.0-rc.42 — picker write/readback + refresh stability

- builds strictly on the already-published rc.41 V2-first status architecture;
- prefers the richest canonical V2-backed property row when duplicate V1 projections expose the same semantic property, preventing writable visual properties from being shadowed by read-only rows;
- keeps open Vehicle Management and Charger Management picker sessions stable during normal Home Assistant state refreshes;
- keeps focused Vehicle/Charger Detail pickers stable while runtime state changes;
- preserves backend-owned vehicle identity while restoring canonical `vehicle.image_key` / `charger.image_key` write capability when published by Mobility M0.9.39;
- adds regression coverage for picker write metadata and refresh-session invariants;
- does not alter rc.41 status semantics or introduce a new V1-only dependency.

## 1.0.0-rc.41 — V2-first status architecture

- freezes the top-level information architecture around user questions: daily Overview, Vehicle Management and Charger Management;
- removes frontend security and maintenance text/regex inference from Overview;
- counts vehicle charger setup from the selected relationship instead of editor sentinel values;
- makes Overview Attention conditional and driven only by backend-published intelligence states;
- reshapes Charger Management around Configuration, Site and Runtime using canonical charger state;
- leaves configuration completeness, runtime-data-health, site capacity and low-range policy as explicit V2 contract gaps tracked by backend issue #107;
- adds a release-blocking regression gate that forbids reintroducing the removed frontend semantic inference;
- introduces no new V1-only dependency while the V2 authority matrix is being confirmed.

## 1.0.0-rc.40 — V2 picker session hardening

- keep vehicle colour edits in local draft state and update preview without reconstructing the Home Assistant card;
- keep charger brand/model/variant/appearance edits in the active picker DOM so native comboboxes stay open and focused;
- add a reusable V2 semantic picker blueprint for Mobility and future Energy UX;
- add regression coverage that rejects picker-triggered card rerenders.

## 1.0.0-rc.39 — Clean heroes + canonical asset detail layout

- removes navigation/location eyebrow copy from every top-level Mobility hero;
- removes breadcrumb and Back-to-Dashboard chrome from vehicle and charger detail heroes;
- aligns vehicle and charger detail heroes to the same title/purpose/visual geometry as Mobility Overview;
- keeps the canonical detail scene as translucent background while foregrounding the actual selected asset image;
- moves asset status out of the hero into its own top-level status row;
- keeps Quick Actions in the next row, followed by domain detail cards;
- adds regressions for clean hero copy and hero → status → actions detail hierarchy;
- preserves rc.38 top-level layout, rc.37 nested HACS assets and all backend semantics.

## 1.0.0-rc.38 — Unified Overview-style top-level tab layout

- Promoted Mobility Overview hero geometry to the shared top-level tab presentation.
- Removed hero-level mini status/meta rows from Vehicles, Chargers, Planning, Strategies, History and Log.
- Added one shared four-card top status system and one shared Overview-style quick-action bar.
- Replaced generic five-column outcome strips at top level with domain-specific status cards.
- Kept lower-level content, commands, backend semantics and the nine approved hero assets unchanged.
- Preserved rc.37 nested HACS packaging and rc.36 charger occupancy semantics.

## 1.0.0-rc.37 — Energy-aligned nested assets + hero runtime fix

- Preserves the rc.36 charger occupancy semantics correction.
- Restores the proven Energy-aligned nested runtime package layout under `assets/`.
- Removes the rc.35 flat `asset--...` packaging workaround from the candidate.
- Restores canonical runtime URLs under `/hacsfiles/rhi-mobility-ux/assets/**`.
- Fixes double resolution of already-complete hero HACS URLs in the shared page-hero renderer.
- Adds exact final hero URL regression coverage while keeping all nine hero master bytes and semantic mappings unchanged.

## 1.0.0-rc.36 — charger occupancy semantics fix

- Fixed the Mobility Overview free-charger count: an idle or stopped charger is no longer assumed to be free.
- A charger is counted as free only when canonical physical connection evidence says it is disconnected and its operating state is idle/stopped.
- Physically connected chargers remain in use even when they are not actively charging.
- Unresolved occupancy fails closed to N/A instead of inflating the free count.
- Added regression coverage for disconnected, connected, physical-relationship, unresolved and faulted charger states.
- Qualified against Mobility backend M0.9.36 diagnostics.

## 1.0.0-rc.35 — HACS runtime asset delivery hotfix

- Fixed HACS packaging so runtime images are files directly under the plugin `dist/` root, matching HACS frontend-plugin download semantics.
- Preserved structured canonical assets in `src/assets/` and added deterministic collision-safe flat package filenames.
- Updated the runtime asset resolver to the installed HACS filenames.
- Replaced the previous recursive install simulation with an exact flat-file HACS plugin simulation.
- Added byte-parity and flat-inventory gates so a release cannot validate while its runtime images are absent from the actual HACS install.

## 1.0.0-rc.34 — Canonical nine-image Mobility hero library

- Replaced legacy/reused tab hero artwork with the approved nine-image canonical Mobility hero library.
- Added unique hero scenes for Overview, Vehicles, Chargers, Planning, Strategies, History and Log.
- Added dedicated Vehicle Detail and Charging Detail scenes while preserving asset-specific vehicle/charger identity artwork.
- Centralized hero resolution in the package-owned semantic hero catalog.
- Removed superseded active SVG/WebP hero assets.
- Added release gates for exact nine-image inventory, unique semantic mapping, 2172×724 PNG masters and source/dist byte parity.
- No Mobility runtime semantics or backend contract ownership changed.

## 1.0.0-rc.33 — Overview hero binary hotfix

- Replaced the corrupt/truncated rc.32 Overview hero WebP with validated image bytes.
- Added WebP RIFF size validation so truncated assets fail CI before release.
- No other UX or semantic behavior changed from rc.32.

## 1.0.0-rc.32 — pixel-perfect Mobility Overview

- Rebuilt Overview against the approved premium mock without removing existing Mobility data or controls.
- Added the approved generated floating hero asset and removed duplicate hero status/meta.
- Replaced generic Overview KPIs with Charging, Climate / Comfort, Security and Maintenance domain status.
- Kept status derivation contract-backed and fail-closed; Home Assistant provides outdoor temperature.
- Preserved Quick Actions, charger assignment and vehicle command controls.
- Removed superseded Overview-only secondary panels while leaving all other tabs on rc.31 behavior.
- Added/updated regression gates for the approved Overview composition and hero package asset.

## 1.0.0-rc.31 — premium Mobility cleanup + Energy projections

- Extended the shared premium Mobility grammar across Mobility, Intelligence and Insights without removing existing data, actions or controls.
- Tightened hero height, spacing, card density and responsive behavior for desktop, tablet and phone portrait.
- Replaced routed placeholder styling with the same shared hero/fact/card system.
- Made Mobility Planning a read-only projection of Energy public planning truth.
- Added Energy-owned Mobility-relevant strategy profiles and effective policies under Intelligence.
- Added Energy-owned per-vehicle metering and financial value to Mobility Insights via exact canonical asset-id joins.
- Kept Mobility execution/activity/audit ownership separate and fail-closed when Energy data is unavailable.
- Added owned contract regressions for both cross-domain projections.

## 1.0.0-rc.30 — Mobility UX coherence + identity-safe picker

- Promoted Overview spacing/density into the shared presentation layer for Overview, Vehicles and Chargers.
- Removed the synthetic standalone Charging tab/page/hero.
- Made Vehicle & colour appearance-only under frozen V1: backend/profile identity remains authoritative.
- Cleared picker drafts on close/reopen and rejected cross-model image overrides.
- Fixed no-charger fallback semantics.
- Upgraded the three tab hero scenes to a premium home-mobility visual language.
- Added a governed UX backlog for richer no-charger/disconnected/maintenance/ready/charging illustrations and actions.

## 1.0.0-rc.29 — shared presentation runtime hotfix

- Supersedes broken rc.28 without mutating the published tag.
- Fixed escaped-newline source serialization that turned `src/app/presentation.js` into a non-executing comment block.
- Added an execution-level regression test so shared presentation code must actually define and render its public functions.
- Preserved the rc.28 shared premium Mobility presentation scope and all existing product functionality.

## 1.0.0-rc.28 — shared premium Mobility presentation

- Added one shared Mobility presentation layer for typography, spacing, density, page geometry and responsive behavior.
- Added compact premium tab heroes for Overview, Vehicles, Chargers and Charging.
- Added package-owned contextual home/mobility hero scenes without treating generated visuals as product truth.
- Moved Overview, Vehicles and Chargers onto one hero grammar while preserving all existing content and actions.
- Added Charging to the same hero pattern and route-aware placeholder presentation where applicable.
- Added phone portrait, tablet and desktop responsive rules to the shared presentation layer.
- Preserved frozen V1 semantics and screen/domain ownership.

## 1.0.0-rc.27 — shared Vehicle and Charger visual library

- Introduced one governed UX-owned visual catalog/resolver pattern for Vehicles and Chargers on frozen V1.
- Added Wallbox Commander 2 White/Black, Peblar Business Socket and Fibaro Wall Plug 2 to the managed Charger library.
- Replaced duplicate Charger placeholders with package-owned premium scalable masters and enforced asset quality/inventory gates.
- Integrated Charger artwork into Overview, linked Vehicle relationships, Charger Management and Charger Detail.
- Added a hierarchical Charger & colour picker; frozen-V1 read-only persistence remains fail-closed.
- Fixed double-prefixed package artwork URLs that could force selected Vehicle/Charger visuals to fallback art.
- Reworked phone Vehicle hero and Charger management density without changing Mobility semantics.
- Added cross-domain visual-library and provenance governance for later Energy reuse.

# Changelog

## 1.0.0-rc.26 — zero-debt current vehicle artwork

- Completes canonical package artwork for all five current real vehicle models.
- Replaces the corrupted legacy ID.4/Scenic duplicate paths with distinct package masters.
- Renames canonical BMW artwork from iX1 naming to X1 PHEV and retains old keys only as aliases.
- Removes duplicate hero/default/unknown/guest artwork files.
- Removes runtime profile-name artwork inference; one canonical visual resolver remains.
- Strengthens asset-policy validation to require exact current-scope coverage, distinct hashes and an exact legacy-free vehicle file inventory.

## 1.0.0-rc.25 — hierarchical vehicle picker pilot

- Replaces the flat vehicle dropdown with Brand → Model → Variant → Colour.
- Preserves the current Mobility vehicle identity and removes all implicit first-row defaults.
- Covers all seven current Mobility vehicle profiles and recognises their current source/profile image keys.
- Keeps profile/source artwork for ID.4 and Scenic until dedicated package artwork is processed.
- Adds a machine-readable artwork provenance registry and the 10-brand × 4-model expansion target.
- Keeps one shared picker across Vehicle Management and Vehicle Detail.

## 1.0.0-rc.24 — hero artwork + visible Vehicle & colour

- Uses vehicle artwork as large background-art within the hero surface.
- Uses the same treatment for charger artwork at a smaller, cropped supporting scale.
- Moves the Vehicle / Colour entrypoint into the vehicle hero as an explicit edit control.
- Removes the duplicate bottom Appearance action.
- Preserves rc.23 mobile density and rc.22 shared picker behavior.

## 1.0.0-rc.23 — compact mobile Vehicles

- Rewrites phone Vehicle cards for compact density while preserving desktop/tablet behavior.
- Compresses vehicle + charger presentation, metrics and controls into purpose-built mobile layouts.
- Keeps inactive vehicle cards to one compact row with inline actions.
- Makes management/detail Vehicle Pickers one-column with 44 px touch targets on phones.
- Preserves rc.22 shared picker, verified-model gating and backend contracts.

## 1.0.0-rc.22 — shared Vehicle Detail picker

- Reuses one verified Vehicle / Colour picker model on Vehicle Management and Vehicle Detail.
- Replaces the raw `vehicle.image_key` detail editor with the catalog picker.
- Adds live type/colour preview on management cards and the Vehicle Detail hero.
- Fixes the Overview vehicle-row undeclared `visualFilter` runtime regression.
- Adds execution-level rendering regression coverage.
- Keeps rc.21 Option A asset-quality rules unchanged.

## 1.0.0-rc.21 — vehicle picker

- Adds a package-owned vehicle type and colour picker to Vehicles.
- Persists one canonical visual key through backend-owned `vehicle.image_key`.
- Adds structured model/color catalog entries with verified selectable artwork; legacy placeholder model keys remain backward-compatible but fail safe to the generic fallback.
- Keeps old image keys as aliases and keeps visual assets/rendering UX-owned.
- Requires Mobility backend M0.9.29 for picker persistence and readback.
- Includes rc.19 navigation alignment and rc.20 vehicle-management improvements.


## 1.0.0-rc.20 — vehicle management workspace

- Promotes Vehicles into the user-facing vehicle-management workspace.
- Adds All / Active / Disabled / Attention filtering and configured-order / name sorting.
- Adds a Home Assistant-native entry point to Mobility vehicle/profile configuration instead of duplicating the backend Options flow.
- Makes lifecycle Activate / Disable explicit while preserving backend-owned charger assignment, controls and quick actions.
- Removes generic supervisor emphasis from Vehicles and keeps inactive vehicles compact.
- Preserves `MOBILITY_PUBLIC_RUNTIME_V1` and the R43.2.65 backend baseline.

## 1.0.0-rc.19 — shared top-navigation alignment

- Aligns Mobility / Intelligence / Insights into three equal-width primary navigation columns.
- Centers top-level navigation actions and prevents tablet-width clipping into the Robotix brand area.
- Uses the same primary-row geometry as Energy.
- Preserves all routes, second-level tabs, product semantics and backend contracts.

## 1.0.0-rc.18 — HACS full-tree delivery correction

- Removes all GitHub Release assets from tagged HACS plugin releases.
- Fixes clean-install behavior where evidence-only release assets displaced the immutable tag `dist/` package.
- Makes zero release assets a hard publication and stable-promotion invariant.
- Makes HACS install simulation model actual tagged-release selection before installing `dist/`.
- Preserves rc.17 Mobility runtime behavior and `MOBILITY_PUBLIC_RUNTIME_V1`.

## 1.0.0-rc.17 — HACS runtime install hardening

- Makes standard HACS `dist/` plugin semantics explicit with `content_in_root: false`.
- Binds immutable tag verification to HACS/package metadata as well as generated `dist/` bytes.
- Makes Overview the only visible Lovelace Mobility view; all internal routes are subviews.
- Separates HACS plugin installation from required Lovelace dashboard migration.
- Preserves all rc.16 Overview/product behavior and `MOBILITY_PUBLIC_RUNTIME_V1`.
- Adds runtime qualification gates for resource loading, custom-element registration and subview migration.

## 1.0.0-rc.16 — Overview completion and contract hardening

- Evolves the existing Overview in place; no screen rewrite.
- Makes the current URL route authoritative so refresh preserves Overview/Vehicle tab state.
- Persists/restores route-specific browser position.
- Centralizes selected-charger semantics and exposes backend-owned unset as **No charger**.
- Uses one shared charger availability projection for truthful free/in-use/unavailable/disabled/N/A counts.
- Fails closed for invalid comfort duration presentation and missing activity messages.
- Formalizes one-model/one-ownership UX governance and a backend interface backlog.
- Keeps HA-native user→vehicle focus and per-user permissions out of V1 until the backend publishes them.
- Keeps `MOBILITY_PUBLIC_RUNTIME_V1` and backend R43.2.65 baseline unchanged.

## 1.0.0-rc.15 — source ownership and structured HACS package

- Establishes explicit `app / runtime / domain / ui / assets` source ownership.
- Moves build order into `src/manifest.json` instead of numeric filenames.
- Makes `src/assets/` the only canonical asset tree and mirrors categories one-to-one into `dist/assets/`.
- Removes the duplicate root `assets/` output.
- Generates a hashed `dist/PACKAGE_MANIFEST.json`.
- Makes immutable-tag `dist/` the HACS package source so nested assets are installed with the plugin.
- Makes GitHub Release assets evidence-only to avoid HACS single-file mode.
- Adds source ownership and complete-package regression gates.
- Leaves Mobility backend semantics and UX behavior unchanged.


## 1.0.0-rc.14 — Overview navigation and inline company brand

- Makes Overview and Vehicles switch reliably inside the dashboard card even when a separate Lovelace Overview route has not been provisioned.
- Removes invalid `/vehicles` internal targets in favor of the canonical Vehicles dashboard route.
- Builds the approved Robotix company SVG directly into the runtime bundle from the canonical source asset.
- Removes the runtime dependency on a separately served company-logo SVG, preventing broken-logo/alt-text rendering in HACS.
- Preserves the Energy-aligned company brand slot, all existing screens and Mobility backend semantics.

## 1.0.0-rc.13 — Mobility-first Energy-style Overview

- Reworks the Overview into the same calm information hierarchy used by Energy while preserving Mobility ownership.
- Promotes Vehicles, Charging now, Chargers and Attention as the four primary Mobility status signals.
- Removes `Energy today` from the primary Mobility overview instead of reconstructing Energy-domain semantics.
- Keeps range/charge, security, comfort, maintenance, selected charger and direct commands on each vehicle row.
- Adds backend-owned Next action, Recent activity and a concise conclusion.
- Preserves all existing routes, detail screens, rc.12 footer/cache fixes and `MOBILITY_PUBLIC_RUNTIME_V1`.
- Adds regression coverage locking the Mobility-first overview structure.

## 1.0.0-rc.12 — readable footer and cache-safe company asset

- Makes the shared UX footer readable at 11px desktop / 10.5px phone with full opacity.
- Replaces hover-only issue disclosure with expandable concrete runtime/backend details.
- Adds backend release/contract context and verification guidance in the expanded footer.
- Adds package-version cache busting to the shared company-logo URL so Chrome cannot reuse a stale logo after HACS updates.
- Keeps header geometry, company artwork, routes, screens and Mobility semantics unchanged.


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
