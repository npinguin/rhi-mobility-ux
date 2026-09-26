# v1.0.0-rc.64 — cross-screen semantic parity TEST CANDIDATE

Mobility now keeps vehicle range, electric range and battery information coherent between Overview, Vehicle Management and detail-oriented product surfaces.

Changes:
- uses canonical Runtime V2 properties when materialized and the backend-owned Experience V2 semantic projection when the same truth is already available there;
- removes empty metric chrome instead of showing `—` for values that the canonical vehicle projection already knows;
- shows battery percentage and current battery energy together when both are published;
- keeps total and electric range distinct where useful;
- adds release-blocking regression coverage for the shared summary projection.

Required/tested backend: M0.10.10.
Rollback: v1.0.0-rc.63.

Target Home Assistant render, write/readback, restart and rollback proof remain required before stable promotion.
