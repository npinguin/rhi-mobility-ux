# v1.0.0-rc.65 — Unified Home Intelligence UX TEST CANDIDATE

Mobility now consumes the same RHI UX Core 1.4.0 visual primitives as Energy instead of owning a parallel shared presentation system.

Changes:
- moves hero rendering onto the canonical Core background-image hero;
- moves the page status row onto the canonical Core status layer;
- moves page Quick Actions onto the canonical Core blue primary / outlined secondary action bar;
- moves font-family and typography authority to Core using the Home Assistant font stack;
- applies the shared Core body/card grammar while preserving Mobility-specific content and workflows;
- removes the local shared hero/status/action stylesheet authority from Mobility presentation code;
- adds a release-blocking shared-visual-ownership check preventing local font and shared-component drift;
- keeps the HACS artifact standalone through the pinned build-time Core snapshot.

RHI UX Core: 1.4.0 at 50cf7e135c90af15cf34b4f41dfba78aa1a5fc5e.
Rollback: v1.0.0-rc.64.

Target Home Assistant rendering, vehicle/charger journeys, write/readback, refresh/restart, upgrade and rollback proof remain mandatory before stable promotion.
