# v1.0.0-rc.67 — canonical cross-domain visual manifest TEST CANDIDATE

Mobility now publishes one generated visual identity manifest from the same canonical vehicle/charger catalog used by the Mobility UX.

Changes:
- generates `dist/assets/metadata/mobility-visual-manifest.json` during the normal build;
- exports canonical vehicle/charger `visual_ref`, model, appearance, image key and package path;
- keeps generic fallbacks explicit;
- adds release-blocking coverage for representative Audi, VW, BMW, Wallbox and Peblar refs;
- removes the need for downstream UX packages to maintain a hand-copied Mobility identity table.

Rollback: v1.0.0-rc.66.

Target Home Assistant qualification remains required before stable promotion.
