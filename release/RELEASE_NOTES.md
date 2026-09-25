# v1.0.0-rc.57 — unified Mobility design language TEST CANDIDATE

## Scope

rc.57 is a design-language convergence release for all top-level Mobility tabs. It deliberately preserves body semantics, command grouping, backend ownership and functional capability.

- Uses Overview as the visual direction without forcing one identical page template.
- Sharpens typography with lighter weights, clearer hierarchy and readable secondary text.
- Tightens white space, baseline alignment, control heights, card geometry and icon sizing.
- Retains premium hero imagery while bounding its responsive height, especially in tablet landscape.
- Keeps normal/healthy states visually quiet; colour remains semantic and attention-driven.
- Hardens the Mobility / Intelligence / Insights module navigation so labels cannot render beneath the Robotix branding region.
- Preserves the Status → Quick Actions → Filters → Body grammar where those layers are applicable.
- Keeps asset-specific actions and commands in their owning body cards.
- Adds release-blocking regression coverage for responsive navigation integrity and the shared design-language tokens.

Required/tested backend: `M0.10.7`.
Rollback: `v1.0.0-rc.56`.

Accepted technical debt: 0.
Accepted feature debt: 0.
Target Home Assistant qualification remains mandatory across phone portrait, tablet portrait, tablet landscape and desktop.
