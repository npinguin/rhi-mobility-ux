# RHI Mobility UX Test Governance

This document is normative for Mobility UX engineering.

## Core rule

**One invariant has exactly one active test owner.**

The active ownership map is `tests/OWNERSHIP.json`. Historical tests may remain for forensic context, but being present in the repository does not make them release authority.

## What active tests may own

### Contract/domain behavior

Tests may prove backend → runtime normalization, projection semantics, fail-closed behavior, command placement, writable configuration, authoritative readback, relationships and cross-domain Energy projections.

### UX behavior

Tests may prove user-observable interaction such as management rendering, picker lifecycle, interaction-state preservation and view-model behavior.

### Architecture boundaries

Source inspection is allowed for **negative dependency rules only**, for example:

- screens/app code must not read Home Assistant state directly;
- screens must not bypass VehicleProjection or ChargerProjection;
- legacy V1 surfaces must not become authority on the supported V2 path.

### Package/release

Package tests own deterministic output, source/dist integrity, HACS delivery and installability. Release tests own descriptor projection, immutable publication and qualification binding.

## What active tests must not do

Active release gates must not freeze:

- a private helper name;
- an exact local variable expression;
- literal property-access syntax;
- an exact HTML fragment when behavior can be tested instead;
- literal CSS declarations or pixel values;
- a historical rc/milestone implementation shape;
- duplicated assertions already owned by another layer.

A refactor that preserves public behavior and architecture boundaries should not require teaching multiple tests the new implementation.

## Release qualification

`release/QUALIFICATION.json` contains only evidence that static CI cannot prove: target Home Assistant load/render, required V2 contracts, real vehicle/charger rendering, real write/readback, restart/reload, upgrade and rollback.

Static contract, layout, package and source checks do not get copied into qualification.

## Local-first workflow

```text
edit
→ npm run preflight
→ commit/push
→ CI confirms
→ publish immutable candidate
```

`npm run preflight` is intentionally the same complete local validation used by the PR source gate. CI is confirmation, not the primary debugging loop.

## Change rule

When a change causes unrelated tests to fail, first determine whether multiple product invariants truly changed. If not, treat it as ownership/test-design drift instead of updating every test to the latest implementation shape.
