# Known Defects at Migration Baseline

These defects predate the HACS migration and are intentionally not hidden by packaging work.

1. Charger component placement can still surface valid product properties under Engineering/Unmapped depending on the deployed component contract/materialization.
2. Some charger commands such as Restart, Identify or Unlock may still be missing if the deployed placement/runtime parsing path does not materialize them correctly.
3. Requested versus actual/readback is structurally separated on the Mobility overview: requested charge power is an explicit control intent and actual charging power comes from the physically connected charger's canonical `charger.power_kw`. Cross-screen target-HA parity still requires runtime qualification before this migration-baseline defect can be fully closed.
4. Cross-screen runtime parity against backend R43.2.65 remains to be proven after HACS deployment.

## Closed structurally after migration baseline

- Frontend-derived supervisory/dashboard meaning was removed in v1.0.0-rc.5. Global supervisor status, trust, attention, opportunity and recommendation now consume backend-owned Mobility Intelligence Index semantics and fail closed when those semantics are not published.

The first stable HACS release must not silently close remaining items without explicit tests and target-runtime evidence.
