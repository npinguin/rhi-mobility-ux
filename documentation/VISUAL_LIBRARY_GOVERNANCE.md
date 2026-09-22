# Shared visual library governance

## Purpose

RHI visual presentation uses one simple pattern for every product-bearing object:

```text
canonical/runtime object
        +
local UX visual catalog
        +
instance appearance
        +
explicit image_key override when supported
        ↓
shared rendering and picker pattern
```

Mobility implements this first for Vehicles and Chargers. Future domains such as Energy may adopt the same pattern without importing Mobility semantics.

## Ownership

The backend owns object identity, runtime truth and persisted presentation choices that are explicitly part of its contract.

UX owns:

- package artwork;
- visual catalog entries;
- legacy visual-key aliases;
- default artwork matching;
- appearance rendering;
- hero/detail/overview crops;
- visual picker composition.

Artwork never owns product semantics, lifecycle, permissions, relationships, technical capabilities or intelligence.

## Catalog schema

Every real product entry follows the same conceptual fields:

- stable local catalog id;
- brand;
- model;
- variant only when it is a real product discriminator;
- model year/range when visually relevant;
- selectable state;
- visual quality classification;
- one or more explicit appearances;
- package artwork key per appearance.

Technical values such as charging power, current, battery capacity or phase count do not belong in the visual catalog.

## Asset rules

1. One real model/appearance maps to one canonical runtime artwork master.
2. Hero, detail, overview, thumbnail and mobile are presentation crops over the same master.
3. No `*_hero`, `*_mobile`, `*_thumbnail`, `*_new` or `*_final` duplicates.
4. Legacy keys are input aliases only.
5. A real product must never silently fall back to another real product.
6. Generic fallback art is explicit and may not masquerade as verified product art.
7. External media requires recorded provenance and verified redistribution rights before import.
8. Package artwork is validated for inventory, dimensions, duplicate bytes and package equality.
9. Current charger runtime assets target at least 900 px on the longest edge and at most 600 KiB. Higher-resolution source masters may be retained externally or regenerated when needed.
10. Visual quality gates are not reduced to make existing weak assets pass.

## Picker rules

Vehicle and Charger pickers follow the same interaction pattern:

```text
Brand → Model → Variant → Appearance/Colour
```

A step may be collapsed or omitted when only one meaningful option exists.

Opening a picker preserves the current selection. Unknown future keys never silently resolve to the first entry.

Frozen V1 remains the runtime source for the current release line. UX does not request or add new V1 semantics. A picker save action is enabled only when the active backend contract explicitly exposes a writable presentation property.

## Screen integration

Every screen displaying an object uses the same visual resolver. Screens must not:

- map asset ids to files locally;
- infer a model from display text;
- choose profile artwork independently;
- implement local colour tables;
- add special-case product image paths.

Overview, management, detail and relationship/assigned-object visuals all consume the same resolved visual.

## Future domains

Energy and later domains may reuse this pattern by adding domain-specific catalogs and thin adapters. Do not create a generic cross-domain semantic framework: reuse the presentation primitives and governance, while domain truth remains owned by each backend domain.
