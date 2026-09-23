# RHI UX Semantic Picker Blueprint

This document is normative for contract-driven hierarchical pickers in RHI UX packages.

## Purpose

Vehicle, charger and future Energy pickers share one editing model. UX owns presentation catalogs and transient draft state. The producer domain owns canonical identity/configuration persistence and readback.

## Contract boundary

A picker consumes canonical V2 semantic property rows. Home Assistant entities/services are transport metadata only.

```text
Domain public runtime V2
        ↓
canonical semantic properties
        ↓
UX domain adapter / picker model
        ↓
local draft + live preview
        ↓
ordered semantic write set
        ↓
transport acknowledgement
        ↓
canonical backend readback
```

Rules:

- V2 canonical rows are primary authority.
- Frozen V1 compatibility may project V2 truth but may not become a second authority.
- Do not combine V1 and V2 truth for the same property.
- UX never derives product identity from artwork selection or display text.
- The backend never owns image files, paint filters, crops or presentation scenes.
- Capability is determined from published contract/write metadata, not hard-coded backend version checks.

## Editing-session rule

Opening a picker creates transient local UI state. Brand/model/variant/appearance changes update the existing picker DOM and preview in place.

A select change must not trigger a complete Home Assistant card render. Replacing `shadowRoot.innerHTML` while a native select is active destroys the control, closes the combobox and loses browser focus/state.

Allowed render boundaries:

1. open picker;
2. cancel/close picker;
3. successful canonical readback after save;
4. authoritative backend topology/profile change that invalidates the current selection.

Normal HA state churn must not reconstruct an active picker.

## Product identity versus appearance

Product identity and appearance are separate semantic concerns.

For supported assets:

- `asset.profile_id` owns the backend product/profile identity when the backend publishes it as writable;
- `vehicle.image_key` owns vehicle appearance;
- `charger.image_key` owns charger appearance;
- brand/model/variant controls are editable only when the corresponding canonical profile property is writable;
- appearance controls are editable only when the corresponding image property is writable.

If profile identity is not writable, the picker may expose it read-only but must never fake a write through an image key.

Cross-model artwork overrides are rejected.

## Vehicle picker

Vehicle hierarchy:

```text
Brand → Model → Variant
        ↓
asset.profile_id
        ↓
Colour
        ↓
vehicle.image_key
```

When the selected profile changes, save is an ordered write set:

1. write `asset.profile_id`;
2. await transport completion;
3. write `vehicle.image_key`;
4. await transport completion;
5. wait for canonical V2 readback;
6. close/commit the editor only after authoritative state is observed.

If step 1 fails, step 2+ must not continue. A partial profile/image combination must not be presented as durable truth.

## Charger picker

Charger hierarchy:

```text
Brand → Model → Variant
        ↓
asset.profile_id
        ↓
Appearance
        ↓
charger.image_key
```

The same ordered-write/readback rules apply as for Vehicle.

## Semantic value versus transport value

Stable semantic IDs remain domain truth. Home Assistant select helpers may accept a human display label rather than the semantic ID.

Therefore:

```text
semantic value
→ canonical choice row
→ transport_value / exact HA option
→ select.select_option
→ canonical semantic readback
```

Display labels and transport values may never become product identity in the UX.

## Write capability

UX consumes backend-published write capability and transport metadata. Picker components call one generic semantic-property write boundary; they do not call raw helper entities or domain-specific services directly.

A configured property is writable only when the domain publishes complete write capability.

## Readback

Save is complete only after canonical readback:

```text
draft
→ ordered semantic write(s)
→ transport acknowledgement
→ pending readback
→ canonical V2 value observed
→ editor commit/close
```

Service acceptance alone is not persistence proof. On failed or missing readback the authoritative value wins and the UX surfaces the mismatch.

## Reuse by Energy

Energy UX must use the same lifecycle for strategy, tariff, battery mode, flexible-load profile or other hierarchical selectors:

- canonical V2 property rows;
- local draft;
- in-place dependent controls;
- ordered semantic write set when multiple properties are coupled;
- semantic-value to transport-value mapping at the generic runtime boundary only;
- canonical readback;
- no card rebuild during selection.

Only the domain adapter and catalog/schema differ. Editing-session behavior and tests are shared engineering rules.
