# RHI Mobility UX Test Governance

This document is normative for Mobility UX engineering.

## Core rule

**One invariant has exactly one test owner.**

Testing follows the same ownership model as runtime code. A test may depend on another owned invariant, but it may not re-implement or independently assert that invariant.

Examples:

- Branding owns artwork and asset delivery. Footer, navigation and layout tests may rely on the brand component existing, but they do not test how the logo bytes are delivered.
- Navigation owns route mapping and active-state behavior. Overview and screen-preservation tests do not inspect the implementation of navigation state.
- Screen preservation owns whether screens remain registered and documented. It does not test how navigation reaches them.
- Layout owns geometry. It does not test brand hashes, asset URLs or navigation semantics.

The machine-readable ownership map is `tests/OWNERSHIP.json`. `tools/check-test-ownership.mjs` fails CI when a known foreign invariant leaks back into another owner.

## Test layers

### 1. Contract

Owner: contract/runtime tests.

Purpose:
- backend → UX contract consumption;
- actual/readback versus requested intent;
- command placement/readiness;
- writable configuration;
- supervisor authority;
- fail-closed behavior.

These tests do not own visual shell structure.

### 2. UX behavior

Owners:
- navigation;
- Overview;
- screen preservation;
- viewmodel/component behavior.

Purpose:
- what users can reach, see and do;
- which actions are exposed;
- which screens remain available.

Prefer behavior/state assertions. Literal source-string assertions are acceptable only when the source declaration itself is the owned contract.

### 3. Shared UX shell

Owners:
- branding;
- footer;
- layout.

Each shared concern has one owner. Cross-checking another owner's implementation is forbidden.

### 4. Packaging

Owner: build/package verification.

Purpose:
- generated bundle loads;
- canonical generated assets are present where required;
- bundle checksum matches;
- committed distribution equals a clean deterministic build;
- HACS validation passes.

Packaging tests do not redefine product behavior.

### 5. Release

Owner: release governance and qualification.

Purpose:
- candidate identity;
- contract/backend compatibility metadata;
- immutable publication;
- qualification state;
- rollback evidence.

Release governance references test results; it does not duplicate their assertions.

## Change rule

When a change requires edits to more than one test owner, the engineer must determine whether the product truly changed in multiple owned areas.

If only one invariant changed but several owners fail, that is **test ownership drift** and must be fixed in the test architecture rather than by teaching every test the new implementation.

## Implementation-detail rule

Do not freeze incidental implementation details such as:

- a specific local variable expression;
- a private helper name;
- an asset transport mechanism outside the branding/package owner;
- navigation internals outside navigation ownership.

Tests should freeze externally meaningful contracts and owned structure.

## Release/build rule

A candidate is built and fully validated on the pull request.

Required PR gate:

```text
clean build
→ complete tests
→ deterministic second-build proof
→ committed-dist equality
→ HACS validation
```

After squash merge, publication **must not rebuild the runtime**. It verifies and publishes the exact committed artifact that passed the PR gate.

Stable promotion also does not rebuild. It qualifies and promotes the exact immutable published candidate.

Target result: two builds for a normal candidate (candidate build + reproducibility build), zero rebuilds during publication/promotion.

## Engineer checklist

Before adding or changing a test:

1. Identify the invariant.
2. Find its owner in `tests/OWNERSHIP.json`.
3. Extend that owner rather than adding a second assertion elsewhere.
4. Prefer behavior over implementation.
5. Run `npm test`.
6. If another owner fails, classify whether this is a real cross-domain change or test ownership drift.

Do not weaken coverage to make CI green. Remove duplicate assertions only when the owning test already proves the invariant.


## Maintainability rule

Active release gates protect observable behavior, public contracts, package integrity, or a true architecture boundary.

They MUST NOT freeze a positive implementation expression, private helper name, exact property-access syntax, CSS declaration, historical release shape, or arbitrary source fragment.

Source inspection is permitted as a negative architecture boundary: for example preventing direct Home Assistant state access in screens, legacy V1 authority, or bypass of VehicleProjection/ChargerProjection.

Historical smoke tests may remain in the repository for forensic context without belonging to the active release gate.

## Local-first rule

`npm run preflight` is the mandatory developer gate and is intentionally identical to the complete local validation. CI confirms a clean candidate; it is not the primary discovery loop.
