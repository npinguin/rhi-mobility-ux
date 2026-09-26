# v1.0.0-rc.63 — RHI UX Core baseline TEST CANDIDATE

Mobility UX now consumes a pinned build-time snapshot of RHI UX Core 1.1.0.

Shared ownership:
- Core: design tokens and generic presentation/footer primitives.
- Mobility: Runtime/Experience/Policy contracts, asset projections, navigation content, screen semantics and interactions.

There is no Home Assistant runtime dependency on rhi-ux-core. Core is bundled into the Mobility artifact.

Footer product health is now based only on canonical backend/runtime health. Physical acceptance, release qualification and optional diagnostics no longer create product-facing warnings.

RHI UX Core source commit:
`480eaef12955d56970ec172fdde6f5fe2e0ab9c6`

Required/tested backend: M0.10.10.
Rollback: v1.0.0-rc.62.

Target Home Assistant runtime qualification and rollback proof remain mandatory before stable promotion.
