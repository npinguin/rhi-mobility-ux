# Engineering History and Lessons Learned

This document is a durable engineering history for RHI Mobility UX. It explains why the current architecture and gates exist. It is not release authority: current version/backend identity comes from `package.json`, `release/product.json`, GitHub Releases and `release/QUALIFICATION.json`.

## Architectural evolution

### 1. V1 compatibility era

The original UX consumed broad Home Assistant compatibility surfaces and property indexes. This made delivery fast, but it also encouraged the frontend to know too much about transport details and to reconstruct product meaning from low-level state.

Durable lesson:

> Compatibility projections may keep an older consumer alive, but they must never become the semantic authority for new UX work.

Frozen V1 remains compatibility-only.

### 2. V2 product authority

Mobility moved toward explicit contract ownership:

```text
MOBILITY_PUBLIC_RUNTIME_V2 = canonical facts
MOBILITY_POLICY_V2         = thresholds / interpretation rules
MOBILITY_EXPERIENCE_V2     = user-facing conclusions
canonical per-asset V2 properties = configuration read/write
UX                         = select / aggregate / format / present
```

This removed frontend-derived security, maintenance and range interpretation. Missing backend meaning must now fail closed instead of being recreated in JavaScript.

Durable lesson:

> If a conclusion affects product meaning, the producer domain must publish it. The UX must not infer it from text, thresholds, entity names or transport-specific state.

### 3. Picker lifecycle hardening

Vehicle and charger pickers exposed a different class of failure:

- rerendering the whole card during a native select interaction destroyed the active control;
- a service call being accepted was incorrectly treated as durable persistence;
- product identity and visual appearance were initially mixed;
- backend profile IDs and Home Assistant select display labels were confused at the transport boundary.

The reusable picker lifecycle is now:

```text
canonical V2 property
→ local draft
→ in-place dependent controls + preview
→ semantic write
→ await transport result
→ canonical backend readback
→ refresh/reload/restart proof
```

Durable lessons:

1. An active editor is local transient UI state. Normal Home Assistant refreshes may not reconstruct it.
2. Semantic values and transport values are different concepts. Stable profile IDs remain domain truth; labels are transport/presentation only.
3. Service acceptance is not persistence proof. Canonical readback wins.
4. Profile identity and appearance must be written deliberately and sequenced when one depends on the other.
5. Picker behavior is a reusable engineering pattern intended for Energy as well.

See `documentation/SEMANTIC_PICKER_BLUEPRINT.md`.

### 4. Runtime proof after static green

Several regressions survived static/package validation and only appeared on the target Home Assistant:

- HACS nested asset URL assumptions;
- picker comboboxes closing because the card rerendered;
- writable properties appearing read-only because the UX consumed the wrong projection;
- profile IDs being sent directly to Home Assistant selects that required display labels;
- product selection changing while stale or wrong artwork remained visible.

Durable lesson:

> Green CI proves source/package invariants. It does not prove target Home Assistant behavior.

Any persistence, resource-path, HACS-package or native-control behavior needs target runtime qualification before stable promotion.

### 5. Canonical visual ownership

Visual drift became visible when an ID.4 could display Renault artwork or when a known product rendered blank.

The current rule is:

- Mobility owns semantic product/profile identity and persists the selected image key;
- UX owns the visual catalog, canonical masters, colour rendering, crop and scene composition;
- one supported real model maps to one canonical visual family;
- no known model may silently fall back to another real model;
- missing artwork fails visibly to a neutral/non-branded fallback;
- premium asset work comes only after identity/render correctness is proven.

Durable lesson:

> Identity safety is more important than showing an image. A blank/neutral failure is preferable to a convincing but wrong product.

### 6. Release and package governance

Release engineering converged on:

```text
branch
→ structural fix + owned regression test
→ PR
→ clean build
→ complete tests
→ deterministic second-build proof
→ committed-dist equality
→ HACS validation
→ squash merge
→ publish exact committed package without rebuild
→ immutable test candidate
→ target HA qualification + rollback
→ stable promotion of exact candidate
```

Durable lessons:

- published tags are immutable;
- publication/promotion do not rebuild;
- any runtime-impacting correction after publication needs a new version;
- zero accepted technical/feature debt means unresolved defects remain explicit, not hidden.

## Important failed patterns

Do not reintroduce these patterns:

- V1-only dependencies in new features;
- frontend reconstruction of backend conclusions;
- direct screen/component calls to raw helper entities or domain services;
- whole-card rerender on every picker change;
- optimistic local state becoming durable truth without readback;
- profile/display-label string matching as semantic identity;
- wrong-model image fallback;
- runtime image generation for canonical vehicle identity;
- duplicate test ownership of the same invariant;
- release publication that rebuilds artifacts;
- documentation that copies current release identity and becomes a competing authority.

## Current open work

The authoritative open-issue list is `documentation/KNOWN_DEFECTS.md`.

In particular, the next engineer must treat the following as active until target evidence proves otherwise:

- full V2 interface migration and retirement of remaining V1-shaped assumptions;
- vehicle/charger picker write/readback/restart qualification;
- semantic-value versus Home Assistant transport-value runtime proof;
- blank/wrong visual rendering closure;
- premium vehicle/charger imagery after functional identity correctness;
- remaining charger placement/command materialization gaps.

## Anti-drift model

Drift prevention is deliberately layered:

- `src/OWNERSHIP.json` — one source concern, one owner;
- `tests/OWNERSHIP.json` — one invariant, one test owner;
- `tools/check-architecture.mjs` — blocks forbidden HA/backend access outside the runtime boundary;
- `tools/check-source-ownership.mjs` — blocks source-tree ownership drift;
- `tools/check-documentation-drift.mjs` — blocks stale architecture/handover/open-issue claims;
- `tools/check-asset-policy.mjs` — blocks missing/wrong canonical visual package state;
- release governance + qualification — blocks promotion without immutable target-runtime evidence.

If an engineer finds a new recurring failure mode, the fix is incomplete until an anti-drift invariant is added to the appropriate owner.
