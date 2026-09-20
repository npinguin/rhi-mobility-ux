# Changelog

## 1.0.0-rc.2 — V1 configuration editable candidate

- Renders `asset.profile_id` as a V1-owned configuration control for vehicle and charger assets even when its current value is unset.
- Uses only V1-published choices/options, write metadata and write targets for configuration editors.
- Applies the same unset configuration-control pattern to `vehicle.selected_charger`.
- Keeps runtime controls such as requested charging power fail-closed unless V1 publishes actual runtime write capability.
- Removes editor-type inference from property names/units and avoids retaining a second local truth after write dispatch.
- Adds vehicle and charger regression coverage for these semantics.
- Makes bundle/runtime version checks derive from `package.json` instead of hard-coded RC strings.
- Status: source candidate until an immutable GitHub Release/tag is created.

## 1.0.0-rc.1 — HACS migration baseline

- Migrates legacy Mobility UX `R22.12.11.30` into a dedicated public HACS Dashboard/plugin repository.
- Preserves the current custom-element names and screen behavior.
- Embeds the exact legacy PNG image bytes in the generated JS bundle so no `/local/homebrain/...` runtime deployment is required.
- Adds deterministic source-to-dist build, contract/architecture/render smoke tests and public-repository hygiene validation.
- Adds `COMPATIBILITY.json` for `MOBILITY_PUBLIC_RUNTIME_V1` / backend R43.2.60 migration baseline.
- Does not redesign UX semantics or repair known product defects as part of the packaging migration.
