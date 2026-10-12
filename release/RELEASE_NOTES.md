# v1.0.0-rc.93 — Mobile layout recovery (TEST CANDIDATE)

- Restore readable vehicle facts and bound vehicle artwork on narrow phones.
- Preserve canonical V2 commands and backend-owned semantics.
- Target HA qualification remains pending; Overview and Chargers require further visual acceptance.

# v1.0.0-rc.92 — Charger actual-power evidence and lifecycle UX (HACS TEST CANDIDATE)

- Charging state and actual measured power are independent facts. Charging/Running with canonical 0 kW is now explicitly disclosed instead of treating current limit or session energy as real-time power.
- Unknown charger power remains unavailable; no ampere-derived estimate or backend compensation.
- Zero active vehicles are not falsely green on range, security or maintenance.
- Existing canonical vehicle assignments and physical connection identities remain distinct.
- This test candidate requires full Validate, immutable HACS package publication and Home Assistant runtime qualification before stable promotion.

Compatibility: Mobility backend M0.10.45 or newer, UX Core 1.6.3. Rollback: v1.0.0-rc.91.
