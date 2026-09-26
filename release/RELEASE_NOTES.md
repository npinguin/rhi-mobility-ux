# v1.0.0-rc.62 — maintainability and test-ownership cleanup TEST CANDIDATE

## Scope

rc.62 reduces release friction without weakening Mobility V2 product safety.

- keeps behavior-oriented contract, projection, write/readback and view-model coverage;
- removes historical source-shape, literal CSS and exact implementation-expression smoke tests from the active release path;
- retains the negative architecture boundary preventing UI/screens from bypassing runtime/domain projection ownership;
- makes `release/product.json` the single release identity owner;
- projects package, compatibility, manifest, status and qualification metadata through `release:sync`;
- reduces target qualification to evidence that only a real Home Assistant runtime can prove;
- adds `npm run preflight` as the local CI-parity entrypoint;
- preserves Mobility M0.10.10 compatibility and zero accepted technical/feature debt.

Required/tested backend: `M0.10.10`.
Rollback: `v1.0.0-rc.61`.

Target Home Assistant qualification and rollback proof remain required before stable promotion.
