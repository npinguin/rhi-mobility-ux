# HACS migration status

Target branch: `migration/hacs-current`

Prepared migration baseline:

- UX version: `1.0.0-rc.1`
- legacy source: `R22.12.11.30`
- public contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- deployed backend baseline: `R43.2.60`
- local validation: PASS
- runtime/HACS parity proof: PENDING

This branch must be merged only after GitHub CI and official HACS validation pass. The first release is an RC; the previous manual `/local/homebrain/...` deployment remains available for rollback until HACS install/update/rollback is proven.
