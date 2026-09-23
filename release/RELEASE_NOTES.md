# v1.0.0-rc.47 — Direct V2 property, placement and relationship closure

This candidate removes another legacy-authority layer from Mobility UX on backend M0.9.43.

Canonical per-asset Home Assistant property entities carrying `canonical_contract=MOBILITY_PUBLIC_RUNTIME_V2` are now the primary property surface. Their backend-published `component_id` and `section_id` drive Vehicle and Charger detail placement directly. Frozen V1 property/component indexes are used only when the direct V2 surface is absent.

A V2 property with missing placement metadata now fails visibly as a **Layout contract gap**. The UX does not invent an Engineering/Unmapped destination. Engineering-visible properties remain isolated from product sections.

Vehicle↔charger relationship consumption also moves to `MOBILITY_PUBLIC_RUNTIME_V2.vehicle_charger_relationships`. Configured, effective and physically connected identities remain distinct; a physical vehicle identity is accepted only when `observed_identity_proven=true`. The V1 relationship index is compatibility-only on older backends.

rc.46 direct `MOBILITY_COMMAND_V2` execution is preserved unchanged.

Required/tested backend: `M0.9.43`.
Rollback: `v1.0.0-rc.46`.

Target Home Assistant qualification remains mandatory before stable promotion.
