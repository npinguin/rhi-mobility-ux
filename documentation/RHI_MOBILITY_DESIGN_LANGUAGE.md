# RHI Mobility Design Language

## Purpose

Mobility UX uses one coherent Robotix Home Intelligence visual language across Mobility, Intelligence and Insights. Screens may differ in information architecture, but they must not look like separate products or design generations.

## Hero family

All routed workspaces use the same premium architectural perspective family:

- Overview — house, driveway, vehicle and charger context.
- Vehicles — same camera and architecture, vehicle in focus.
- Chargers — same camera and architecture, charger infrastructure in focus.
- Planning — same environment with subtle planning/forecast visual.
- Strategies — same environment with strategy/control visual.
- History — same environment with measured-energy/value visual.
- Log — same environment with operational evidence visual.

Hero artwork is decorative only. It never carries status, identity, availability or other product truth.

Canonical properties:
- logical canvas: 1200 × 420;
- light architectural palette;
- same driveway/home perspective and horizon;
- restrained blue/green accents;
- no slogans, labels or product claims inside artwork;
- compact hero composition on desktop, tablet and phone portrait;
- artwork may crop, but copy and controls may not be displaced by it.

## Shared visual grammar

Canonical hierarchy:

```text
RHI shell / branding
workspace navigation
compact perspective hero
status / facts
primary task content
secondary details / diagnostics
release footer
```

Shared rules:
- page max width and spacing are owned by `src/app/presentation.js`;
- radii use the shared 10 / 14 / 18 / 22 px scale;
- strong shadows are reserved for overlays; normal surfaces use border-first, subtle-shadow styling;
- functional icons use Home Assistant / MDI;
- primary actions stay visible; secondary diagnostics collapse progressively;
- no data, commands or backend-owned semantics are removed to achieve visual simplicity;
- unavailable backend truth renders unavailable/N/A rather than inferred UI state.

## Domain ownership

- Mobility owns vehicle/charger readiness, assignment, execution, commands and operational evidence.
- Energy owns planning, strategy, metering and value semantics.
- Cross-domain projections are read-only and joined on exact canonical asset ids only.

## Responsive contract

Desktop:
- compact two-column hero;
- dense but readable cards;
- diagnostics in secondary folds.

Tablet:
- same hierarchy with reduced page margins;
- controls remain touch-friendly.

Phone portrait:
- hero remains compact rather than stacking into a tall marketing banner;
- actions reflow to one or two columns;
- data is preserved, with secondary information folded rather than removed.
