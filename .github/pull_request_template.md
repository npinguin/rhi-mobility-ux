## Engineering Closure

### User / problem statement
### Classification
<!-- DEFECT / FEATURE_DEBT / TECH_DEBT / RUNTIME_PROOF_GAP / CONFIG -->
### Ownership and impact
- Owner:
- Packages/contracts impacted:
- Authoritative source:
- Generated projections:
### Acceptance
<!-- Separate implementation, first-party consumer and target-product acceptance where relevant. -->
- Implementation acceptance:
- First-party consumer acceptance:
- Target-HA/rendered acceptance:
- Non-functional acceptance:
- [ ] Fail-closed/conflict guard has both negative-path and known-valid positive-path regression coverage where applicable

### Preflight before push
- [ ] Source/build inputs complete
- [ ] Generated projections regenerated from authority
- [ ] Package preflight and relevant tests pass locally
- [ ] Deterministic rebuild leaves a clean tree
- [ ] Version/release authority and dependency pins are coherent
### Independent confirmation
- [ ] CI confirms implementation/integration only; it is not treated as product acceptance
- [ ] Changed public contracts are proven by each declared first-party consumer
- [ ] Runtime proof status is explicit
- [ ] Rendered/operational behavior is proven on target Home Assistant where required
- [ ] Restart/readback/failure-safety proof is explicit where applicable

### Lessons / prevention
- Unexpected finding:
- Root cause:
- Prevention action:
- [ ] Predictable failure class is caught before push, or reason recorded
### Release-note projection
- User-visible change:
- Internal-only engineering lesson:
- Release-note category:
- [ ] Release notes/changelog generated or reconciled from this record
### Closure
MERGED means implementation integrated. It does **not** mean Done.

CLOSED means implementation + integration + declared first-party consumer acceptance + target-product acceptance are complete where applicable, including persistence, failure-safety, restart/readback, contract completeness, diagnosability and required non-functional proof.

- [ ] Issue remains open after merge when consumer/target-HA acceptance is still pending
- [ ] Failed target qualification reopens the affected issue or creates a linked regression issue

> CI is independent confirmation. It is not the debugger.
