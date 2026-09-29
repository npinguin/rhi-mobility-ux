# Product acceptance governance

Green engineering CI proves implementation and integration. It does **not** prove product acceptance.

## Acceptance gates

1. **Implementation** — root cause fixed in the owning layer with regression evidence.
2. **Integration** — canonical contracts, package and CI gates are green.
3. **First-party consumer** — every declared first-party consumer of a changed public contract behaves correctly.
4. **Target product** — the immutable candidate behaves correctly in real Home Assistant, including rendered/operational and relevant non-functional invariants.

Issues whose acceptance includes user-visible behavior, cross-domain behavior, controls/readback, runtime freshness, lifecycle, startup/performance or Home Assistant interaction remain open after merge until the required consumer and target-product gates pass.

## Mandatory guardrails

- Merge means implementation integrated; it is not Done.
- A failed target qualification reopens the affected issue or creates a linked regression issue.
- Fail-closed/conflict-rejection changes require both a negative-path regression and a known-valid positive-path regression.
- Public-contract changes require first-party consumer acceptance.
- Rendered UX acceptance cannot be satisfied solely by source-string, CSS-token or DOM-fragment presence tests.
- Candidate failure is evidence to fix the owning concern; do not weaken acceptance or add consumer-side semantic reconstruction.
