# v1.0.0-rc.5 — backend-owned supervisor semantics TEST CANDIDATE

## Scope

This candidate preserves `MOBILITY_PUBLIC_RUNTIME_V1` and the existing UX architecture. It removes the remaining proven frontend-derived global supervisor conclusions without introducing a new semantic layer or fallback framework.

## Included

- global supervisor status, trust, attention, opportunity and recommendation consume the existing backend-owned Mobility Intelligence Index;
- missing global supervisor intelligence fails closed as Unknown/unavailable instead of defaulting to OK, None, charge_when_optimal, Supervised or No immediate action;
- per-vehicle attention rendering uses published supervisor attention semantics and reports unavailable evidence when a vehicle has no published supervisor outcome;
- factual charging state/power remains available as factual presentation but no longer generates supervisor recommendations or opportunities;
- requested charge power remains explicit control intent while actual charging power remains canonical charger readback;
- adds a focused regression proving backend-owned supervisor semantics and prohibiting the removed frontend fallbacks;
- keeps the rc.4 immutable-candidate qualification and checksum governance unchanged.

## Compatibility

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `R43.2.60`
- Tested backend baseline: `R43.2.65`
- Legacy migration source: `R22.12.11.30`

## Qualification status

Static validation and HACS validation are required before TEST CANDIDATE publication. Target Home Assistant cross-screen/runtime/write-readback/restart/rollback proof remains pending. Stable promotion remains blocked until qualification is PASS and bound to the immutable candidate SHA.
