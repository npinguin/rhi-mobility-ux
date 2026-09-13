# Known Defects at Migration Baseline

These defects predate the HACS migration and are intentionally not hidden by packaging work.

1. Charger component placement can still surface valid product properties under Engineering/Unmapped depending on the deployed component contract/materialization.
2. Some charger commands such as Restart, Identify or Unlock may still be missing if the deployed placement/runtime parsing path does not materialize them correctly.
3. Requested versus actual/readback presentation still requires structural product cleanup; normal UX should ultimately be actual-first.
4. Some supervisory/dashboard summaries are still frontend-derived and need replacement by explicit backend-owned intelligence semantics.
5. Cross-screen runtime parity against backend R43.2.60 remains to be proven after HACS deployment.

The first stable HACS release must not silently close these items without explicit tests and release notes.
