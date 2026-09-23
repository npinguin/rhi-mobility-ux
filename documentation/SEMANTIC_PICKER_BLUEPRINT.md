# RHI UX Semantic Picker Blueprint

This document is normative for contract-driven hierarchical pickers in RHI UX packages.

## Purpose

Vehicle, charger and future Energy pickers must share one editing model. The UX owns presentation catalogs and transient draft state; the backend owns canonical domain identity, configuration persistence and readback.

## Contract boundary

A picker consumes a canonical public property row. The property row is semantic authority; Home Assistant editor entities/services are transport metadata only.

```text
Domain public runtime V2
        ↓
canonical property row
        ↓
UX domain adapter
        ↓
picker selection model
        ↓
local draft + live preview
        ↓
one semantic property write
        ↓
canonical backend readback
```

Rules:

- Prefer a V2 canonical row when `canonical_contract` identifies the domain V2 runtime.
- V1 compatibility may project that V2 row, but may not become a second semantic authority.
- Do not combine V1 and V2 truth for the same property.
- UX never derives product identity from artwork selection.
- The backend never owns image files, paint filters or presentation crops.

## Editing-session rule

Opening a picker creates transient local UI state. Brand/model/variant/appearance changes update the existing picker DOM and preview in place.

A select change must not trigger a complete Home Assistant card render. Replacing `shadowRoot.innerHTML` while a native select is active destroys the control, closes the combobox and loses browser focus/state.

Allowed render boundaries:

1. open picker;
2. cancel/close picker;
3. successful save followed by canonical readback;
4. authoritative backend topology change that invalidates the current selection.

Normal HA state churn must not reconstruct an active picker.

## Vehicle picker

Vehicle identity is backend/profile owned for an existing physical asset.

- brand: read-only;
- model: read-only;
- variant: read-only;
- colour/appearance: UX selectable;
- persistence key: `vehicle.image_key`;
- save is enabled only when the canonical property is writable;
- canonical readback is durable truth.

Cross-model artwork overrides are rejected.

## Charger picker

Charger product identity and appearance are separate concerns.

When brand/model/variant are presentation-only, they select a catalog visual and do not change backend product identity. When product/profile identity is editable, that change must use the domain V2 product/profile configuration contract rather than overloading `charger.image_key`.

`charger.image_key` owns visual appearance only.

Brand → model → variant → appearance edits are local until Save. Dependent selects and preview update in place.

## Write capability

UX must consume backend-published write capability. A configured presentation property is writable only when the domain publishes a complete write transport for that semantic property.

The UX calls one generic semantic-property write function; picker components do not call raw helper entities or domain-specific services themselves.

## Readback

Save has three phases:

```text
draft
→ write dispatched
→ pending readback
→ canonical value observed
```

The picker must not treat service acceptance as durable truth. On failed or missing readback the authoritative value wins and the UX surfaces the mismatch.

## Reuse by Energy

Energy UX should implement the same lifecycle for strategy, tariff, battery mode, flexible-load profile or other hierarchical selectors:

- domain V2 property row;
- local draft;
- in-place dependent controls;
- one semantic write;
- canonical readback;
- no card rebuild during selection.

Only the domain adapter and catalog/schema differ. Editing-session behavior and tests are shared engineering rules.
