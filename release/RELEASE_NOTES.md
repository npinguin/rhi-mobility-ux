# v1.0.0-rc.70 — shared appearance picker TEST CANDIDATE

## User-facing behavior

- Vehicle and Charger appearance editors now use the same RHI UX Core 1.5.2 visual-picker shell as Energy.
- The existing Mobility Brand → Model → Variant → Colour/Finish hierarchy is preserved.
- Vehicle and Charger image persistence remains Mobility-owned through Public Runtime V2; profile selection is written first when needed, then the concrete image key.
- Existing producer-owned Mobility `visual_ref` publication remains unchanged for Energy and other consumers.

## Engineering

- converges Mobility UX to **RHI UX Core 1.5.2** at source commit `16a217a33f6a7cc90d42ad83492e90ba1d364eee`;
- removes legacy picker presentation classes from the active picker markup so Core owns the shared visual grammar;
- retains local picker draft/live preview behavior and authoritative write/readback semantics;
- no Energy semantics or cross-domain product inference is introduced.

Rollback: **v1.0.0-rc.69**.

Target Home Assistant proof remains required for vehicle/charger save-readback, refresh/restart, upgrade and rollback before stable promotion.
