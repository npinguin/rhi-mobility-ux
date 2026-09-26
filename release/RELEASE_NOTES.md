# v1.0.0-rc.63 — RHI UX Core convergence TEST CANDIDATE

Mobility now consumes pinned RHI UX Core 1.2.0 at build time and remains a self-contained HACS artifact.

The shared Core owns shell geometry, tokens and common primitives. Mobility keeps domain semantics, routing targets, projections, commands and runtime interpretation.

This candidate also removes release/physical-acceptance proof from the product footer and fails closed when supervisor outcome values are absent.

Required/tested backend: M0.10.10.
Rollback: v1.0.0-rc.62.

Target Home Assistant render, write/readback, restart and rollback proof remain required before stable promotion.
