# Mobility responsive UX acceptance — rc.95

## Purpose and authority

This is a product acceptance matrix for the same Mobility backend-owned facts, actions,
readback and asset identity on phone, tablet and desktop. It does not authorize frontend
inference, optimistic values, duplicated controls or a new navigation model.

The shared final responsive presentation authority is
`hbMobilityResponsiveFinishStyles()` (source: `src/app/header-and-navigation.js`).
Overview, Vehicles, Chargers, Planning, Strategies, History, Activity, vehicle detail
and charger detail consume it. Keep domain-specific semantic projections unchanged.

## Visible UX invariants

1. Identity precedes status details in every vehicle/charger card; asset artwork has
   its own bounded area and cannot cover the model or primary status.
2. Primary signals are readable, including unknown/incomplete states. Full reason
   remains accessible as title/detail evidence, not letter-by-letter in a narrow tile.
3. Detail navigation is an explicit, contextual **Details** action. Do not place floating
   unlabelled plus icons over asset media or duplicate detail links in random footers.
4. Consistent fact grammar: label + value + optional secondary reason. Use separators
   within a logical fact group, not a different tinted/rounded box around every field.
5. One action owner per command: backend-published controls only, readback confirms
   success. Requested charging power never substitutes for measured power.
6. Missing optional location must not say "Not configured" immediately under a charger
   name when the profile itself is configured. Missing product commands show an honest
   unavailable state.
7. No horizontally clipped content or touch controls, no blank spacer placeholders,
   no overlay of title, actions or image at supported viewport sizes.
8. Main navigation and current view must persist across refresh; browser Back, internal
   details and HA-hosted dashboards remain coherent.
9. One data-presentation and responsive rule set covers all seven main screens plus
   asset details; no screen-specific competing mini-design system.

## Consistent Mobility object/detail navigation (rc.95)

- Lists: one explicit **Details →** action per asset, placed in the card action row.
- Detail status: always label + value (+ explanatory subtext). A published related-asset value is the **link**, indicated by blue text and chevron; no second column, circular plus control or redundant action row.
- Detail property rows: use the identical linked-value treatment for published related assets. No link if the backend has not identified a real related asset.
- Back: every detail view exposes **Back to Vehicles/Chargers** or **Back to [parent asset]** if reached by a published object relationship. Parent context is encoded as `from_asset` in the URL so refresh does not lose it. Cross-domain navigation never guesses identity.
- Vehicle desktop details: all five published status facts form one row; charger uses the same grammar with three facts. Narrower viewports reflow without changing semantics.
- Lifecycle: **Disable/Activate** are action verbs; **Disabled/Active** are statuses. Vehicle and Charger lifecycle controls have the same visual semantics, and canonical readback still owns confirmation.
- Acceptance: clicking a vehicle's Charging value opens that exact charger, whose Back link returns to the vehicle; a charger Vehicle link works symmetrically. Navigation from list shows Back to that list. Check direct URL, browser Back, reload and bootstrap and legacy multi-view routes on target Home Assistant.

## Viewport acceptance matrix

| Device class | CSS viewport sample | Required visual checks |
|---|---|---|
| Small phone portrait | 320 × 640 | 1-column details, asset identity first, long statuses readable, no x-overflow |
| Phone portrait | 375 × 812 | 2-column compact status/facts when readable, commands wrap, detail link visible |
| Large phone portrait | 430 × 932 | Full CTA/tap targets, vehicle and charger images bounded |
| Phone landscape | 667 × 375 | No oversized hero, no hidden controls, short scroll path |
| Tablet portrait | 768 × 1024 | 2-column summaries, details remain readable, normal navigation |
| Tablet landscape | 1024 × 768 | Full-width workspace with sensible grid, no narrow desktop detail columns |
| Desktop | 1280 × 800 | Dense but legible summary, bounded page width, predictable hierarchy |
| Wide desktop | 1920 × 1080 | No huge whitespace or stretched text, consistent section density |

Run across: Overview, Vehicles (active, disabled, unavailable, two distinct same-model
vehicles), Chargers (idle/connected/charging/unavailable), Intelligence/Planning,
Strategies, Insights/History, Activity, Vehicle Detail, Charger Detail, appearance
picker and configuration/write/readback interactions.

## Qualification evidence

- Automated source/build/contract/asset-first rendering checks pass on the exact
  SHA before creating an immutable candidate.
- Target-HA screenshots are required for at least 320, 375, 430, 768, 1024 and
  1280 CSS-pixel viewports (or representative physical devices).
- Capture both normal and long/unknown/incomplete data, open appearance picker,
  visual detail navigation and command pending/error/readback.
- Test portrait/landscape rotation, refresh, browser Back, HACS upgrade and rollback.
- Record tested backend releases, HACS bundle tag/SHA and results in
  `release/QUALIFICATION.json`. **Do not mark product acceptance complete
  merely because CI is green.**

## Known open qualification

The rc.95 branch corrects source structure and responsive presentation but is
not target-HA runtime-qualified until the exact immutable candidate has been
installed and exercised. Known V2 backend gaps in Planning, strategy and Energy
insights remain backend-owned and cannot be concealed by UI layout changes.
