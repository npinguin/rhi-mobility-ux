# Changelog

## 1.0.0-rc.3

- aligns Mobility release identity with the shared RHI compact footer standard;
- shows only UX and backend release while healthy;
- exposes contract/runtime details via tooltip and colors only actual warnings/errors;
- reads backend and contract identity strictly from `sensor.mobility_release_contract`;
- aligns package, compatibility and release manifest metadata;
- adds foolproof HACS install, migration and rollback instructions.

## 1.0.0-rc.1 — HACS migration baseline

- Migrates legacy Mobility UX `R22.12.11.30` into a dedicated public HACS Dashboard/plugin repository.
- Preserves the current custom-element names and screen behavior.
- Embeds the exact legacy PNG image bytes in the generated JS bundle so no `/local/homebrain/...` runtime deployment is required.
- Adds deterministic source-to-dist build, contract/architecture/render smoke tests and public-repository hygiene validation.
- Adds `COMPATIBILITY.json` for `MOBILITY_PUBLIC_RUNTIME_V1` / backend R43.2.60 migration baseline.
- Does not redesign UX semantics or repair known product defects as part of the packaging migration.
