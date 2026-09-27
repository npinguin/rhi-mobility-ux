# v1.0.0-rc.66 — Core 1.4.1 and presentation convergence TEST CANDIDATE

Mobility now consumes RHI UX Core 1.4.1 and removes the remaining domain-local authority over shared page geometry and typography.

Changes:
- upgrades the vendored build-time Core snapshot from 1.4.0 to 1.4.1 at 7e035980b690719ff9c05876e905322194d52df2;
- enforces the shared Hero → Status → Page Controls → Body stack invariant;
- removes Mobility-owned page width/padding and shared section typography overrides;
- removes all `!important` declarations from `src/app/presentation.js`;
- adds a release-blocking presentation-debt gate so shared authority and `!important` debt cannot return;
- keeps Mobility-specific vehicle, charger, context and responsive body behavior domain-owned;
- clarifies that the domain branding asset is a packaged Core-owned copy, not a second authority;
- synchronizes Core provenance through release metadata.

Rollback: v1.0.0-rc.65.

Target Home Assistant rendering, vehicle/charger journeys, write/readback, refresh/restart, upgrade and rollback proof remain mandatory before stable promotion.
