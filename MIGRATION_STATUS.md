# HACS migration status

Target branch: `migration/hacs-current`

Prepared migration baseline:

- UX version: `1.0.0-rc.1`
- legacy source: `R22.12.11.30`
- public contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- deployed backend baseline: `R43.2.60`
- repository package SHA-256: `f3aec3b1cda8741e6ddbb046ba897a5467f9fa6984aebb83012cfd9f845b6325`
- generated runtime JS SHA-256: `37e73d4b110f89127a51f25b99a9615e4139207d158fba3c1bc572a59b189c14`
- local validation: PASS
- runtime/HACS parity proof: PENDING

The complete repository import has been built and validated outside GitHub. Do not merge this branch until the complete generated tree (including `dist/rhi-mobility-ux.js` and runtime assets) has been imported and GitHub CI/HACS validation is green.
