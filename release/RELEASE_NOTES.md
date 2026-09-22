# v1.0.0-rc.32 — pixel-perfect Mobility Overview

## Scope

- rebuilds the Mobility Overview against the approved premium mock while preserving existing Mobility data, controls and backend ownership;
- packages the approved generated Overview hero as `assets/heroes/mobility-overview-approved.webp`;
- makes the hero a floating background composition with no duplicate hero-meta/status line;
- replaces the old generic Overview summary with one four-domain status bar:
  - Charging: free/active chargers, current aggregate charger power and remaining energy-to-charge when published;
  - Climate / Comfort: Home Assistant outdoor temperature plus climate state of the next-departure vehicle when published;
  - Security: backend/public-contract evidence for unlocked/open vehicles, doors and windows;
  - Maintenance: backend-published tire/oil/inspection/service attention;
- keeps missing truth fail-closed as N/A/unavailable;
- preserves Quick Actions, vehicle charger assignment, vehicle commands and per-vehicle readiness/security/comfort/maintenance context;
- removes the superseded Overview-only Next action / Chargers / Recent activity / Conclusion composition;
- isolates the new presentation to Overview; Vehicles, Chargers, Intelligence and Insights keep their rc.31 behavior.

## Runtime contract

- Mobility contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum Mobility backend: `M0.9.29`
- No Mobility backend contract extension is introduced.
- Outdoor temperature is read from Home Assistant weather/temperature state when available.
- No frontend positive fallback is introduced.

## Rollback

Rollback candidate: `v1.0.0-rc.31`.

## Qualification

Before publication: full contract/UX/package/release tests, executable bundle proof, deterministic two-build proof, committed package/source equality and HACS validation.

Runtime qualification after install: approved hero rendering; Overview status-bar truth and N/A behavior; tablet/desktop/mobile layout; existing vehicle controls and charger assignment; route refresh; resource load; restart/reload; rollback.
