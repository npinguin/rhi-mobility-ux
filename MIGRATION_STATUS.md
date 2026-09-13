# HACS migration status

Target branch: `migration/hacs-current`

Prepared migration baseline:

- UX version: `1.0.0-rc.1`
- legacy source: `R22.12.11.30`
- public contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- deployed backend baseline: `R43.2.60`
- Robotix workspace import package SHA-256: `2e71382afd54a9c6e9ea4577c7d29187933e5148be601bb901800ed8b027f683`
- local validation: PASS
- release mechanics aligned to Energy UX: PASS
- runtime/HACS parity proof: PENDING

Next action is deliberately the same as Energy UX: import the complete prepared repository tree from the Robotix workspace into this branch, run GitHub CI/HACS validation, merge to `main`, and then run the Release workflow for `1.0.0-rc.1`. Do not merge a partial tree and do not retire the legacy `/local/homebrain/...` deployment until HACS install/update/rollback is proven.
