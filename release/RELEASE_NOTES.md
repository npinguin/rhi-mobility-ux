# v1.0.0-rc.11 — Shared UX release and footer governance TEST CANDIDATE

## Scope

Cross-package release-governance and footer convergence over rc.10. Existing Mobility routes, screens, actions, backend semantics, header geometry and company branding remain intact.

## Included

- publishes TEST CANDIDATE versions as normal GitHub Releases so HACS exposes them without enabling beta/prerelease versions;
- keeps TEST CANDIDATE state in release metadata and qualification evidence instead of the GitHub prerelease flag;
- keeps candidate tags/runtime payloads immutable;
- makes stable promotion evidence-only against the exact published candidate;
- standardizes the footer with the shared RHI UX footer contract;
- healthy footer is `RHI Mobility UX <version> · Backend <version>`;
- runtime health, acceptance proof and diagnostics collapse into one short amber/red issue label with tooltip detail instead of Mobility-specific visible footer rows;
- keeps the unified Energy/Mobility header and canonical company-logo asset introduced in rc.10;
- adds shared release/footer standards and drift tests.

## Compatibility

- Mobility UX: 1.0.0-rc.11
- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Rollback release: `v1.0.0-rc.10`

Stable promotion remains blocked until target Home Assistant runtime and rollback proof are PASS.
