# v1.0.0-rc.56 — compact asset workspaces and image-first picker TEST CANDIDATE

## Scope

rc.56 keeps Vehicles and Chargers as separate Mobility workspaces and preserves their functional content while replacing their outdated body/layout implementation.

- Converges Vehicles and Chargers on the compact density and whitespace discipline used by Overview.
- Replaces oversized hero/image stages with one bounded responsive image geometry for mobile, tablet and desktop.
- Keeps lifecycle, relationships, controls and operational content in place.
- Replaces dropdown-first appearance editing with image-first vehicle and charger selection plus optional refinement.
- Removes normal-user exposure of the technical visual key.
- Uses canonical async write + backend readback only.
- Pairs with Mobility M0.10.7, which closes editor-registration metadata convergence for profile/image configuration.

Required/tested backend: `M0.10.7`.
Rollback: `v1.0.0-rc.55`.

Accepted technical debt: 0.
Accepted feature debt: 0.
Target Home Assistant qualification remains mandatory.
