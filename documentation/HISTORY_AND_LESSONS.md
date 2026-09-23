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

### 4a. HACS asset-path regression: do not redesign packaging from a runtime symptom

A previous runtime incident initially looked like HACS could not serve nested assets. A flattening change was attempted, but target evidence later showed the nested package tree was valid and the actual defect was a double-resolved asset URL in the UX.

Durable lessons:

- treat the generated/installed package tree as evidence before changing package structure;
- distinguish "file missing" from "URL resolver produced the wrong path";
- never flatten or duplicate canonical assets to mask a resolver defect;
- verify the exact installed HACS path and browser-requested URL on the target system;
- keep source → dist asset parity and deterministic package inventory machine-checked.

### 4b. Corrupt/truncated artwork can pass higher-level visual review

A broken/truncated WebP once reached the visual pipeline and required a package hotfix. Asset validity therefore cannot rely on browser behavior or catalog references alone.

Durable lessons:

- binary asset headers/declared lengths must be validated in CI;
- source and dist bytes must match exactly;
- supported visual masters must exist, be decodable and be governed by the asset catalog;
- visual packaging failures are release defects, not cosmetic issues.

### 4c. Capability contracts beat release-number branching

Backend release metadata is important for qualification and compatibility reporting, but UX behavior must not branch on a hard-coded backend release number when the contract can publish the capability directly.

Durable lesson:

> Release versions qualify a package; published capabilities drive runtime behavior.

Use contract presence, writable metadata and canonical properties to decide what the UX can do. Version strings remain release/diagnostic metadata, not a substitute for interface negotiation.

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

### 5a. Visual quality strategy: canonical family first, context second

The scalable visual strategy is not "one bitmap for every screen × colour × context".

Vehicle visuals should use:

- one canonical, validated model master per supported real model/variant family;
- runtime colour treatment only where it remains visually credible;
- explicit curated colour overrides only when needed;
- shared presentation contexts/crops/scenes that never redefine identity.

Chargers follow the same identity discipline, with explicit appearance masters where enclosure/faceplate variants are materially different.

Runtime generative image creation is forbidden for canonical identity because it can silently change grille, body, model year, connector, enclosure or proportions.

Premium contextual scenes come after canonical identity/render correctness. Cards, pickers, detail and hero may present the same visual family differently, but may not invent a different product.

### 5b. Shared visual grammar must be reused, not imitated

Cross-domain UX drift appeared when one package recreated the Mobility hero/status/action structure with lookalike local components instead of reusing the shared presentation grammar.

Durable lesson:

> If a visual structure is meant to be identical across RHI packages, share the primitive/token/contract rather than copy its appearance.

Energy is the first reuse target: hero geometry, status-row grammar, quick actions, picker lifecycle and footer/header rules should be consumed as shared standards where applicable.

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

### 6a. One authoritative validation per source SHA

Repeated branch replacement, close/reopen cycles and overlapping validation can create multiple identical GitHub runs without adding evidence.

Durable lessons:

- one source SHA should have one authoritative Validate result;
- superseded PRs/branches are closed explicitly rather than kept as competing release histories;
- publication verifies the validated committed package and does not rebuild it;
- qualification adds target-runtime evidence to the exact immutable candidate instead of creating another build.

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
