# Robotix Home Intelligence — Company Brand Contract

Mobility uses the same Robotix company mark and header-slot contract as the other RHI UX modules.

## Canonical asset

- Source of truth: `src/assets/branding/company-logo.svg`
- Runtime copy: `assets/branding/company-logo.svg`
- Distribution copy: `dist/assets/branding/company-logo.svg`
- Background: transparent
- Primary company/building colour: `#0B4C86`
- Slogan colour: `#5B95C8`
- Slogan: `DomotiX · Network · Security`
- Canonical SHA-256: `264f0d86798a2a53e30b8beb5cae366e4b0916adbb3716b3deb23b5ddbed053d`

The asset is shared branding, not Mobility artwork. Do not redraw it, recolour it, add a background, apply CSS filters, or reconstruct the typography locally.

## Header slot contract

The header owns layout; the asset owns brand geometry. Module-specific sizing is expressed only through:

```css
--rhi-company-area-min
--rhi-company-area-max
--rhi-company-logo-max-width
--rhi-company-logo-max-height
--rhi-company-logo-padding
--rhi-company-divider
```

The logo itself remains `display:block`, `height:auto`, `object-fit:contain`, `object-position:center`.

## Shared navigation hierarchy

The uniform RHI header has:

1. Home Intelligence + current domain identity on the left.
2. Mobility / Intelligence / Insights as the primary navigation.
3. Contextual domain items as a smaller second line with compact gray icons.
4. The canonical Robotix company mark in the right brand area.

Active section colour may differ by section. The company mark must not change with module state.

## Ownership

- Shared company mark: canonical brand asset.
- Mobility: route labels, icons and active state only.
- Build: preserves the canonical source tree under `dist/assets/` and injects the canonical SVG into the JS bundle for runtime delivery.
- Branding validation: pinned hash, source/generated parity, transparent asset, inline runtime parity and no runtime redraw/filter.
- Layout validation: owns header-slot geometry separately; branding tests do not own responsive sizing.
- Footer/navigation tests must not assert logo transport or artwork details.

Any future module should copy this asset unchanged and reuse the same `--rhi-company-*` slot contract.
