# v1.0.0-rc.95 — Object navigation and charger/vehicle presentation parity (HACS TEST CANDIDATE)

- One consistent linked-value and chevron navigation treatment for related Vehicle/Charger details, replacing misleading circular plus controls and the extra status column.
- Vehicle detail five status facts are one desktop row; charger status retains the identical presentation with three facts. Device widths reflow progressively.
- Explicit Back to source asset or list, with parent asset retained in the URL across refresh in multi-view and bootstrap flows.
- Details actions consistently live alongside direct actions rather than beside the asset title; Charger statuses/KPIs use compact label/value fact grammar.
- Correct localized action verbs Activate/Disable (distinct from state Active/Disabled), without changing backend lifecycle intent or canonical readback.
- Render regression and source/contract/UX/HACS validation required; target HA device and navigation qualification still PENDING.

Compatibility is read from release/product.json. UX Core 1.6.3 unchanged. Rollback v1.0.0-rc.94.
