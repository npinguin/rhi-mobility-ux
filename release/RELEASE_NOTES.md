# v1.0.0-rc.82 — single Mobility projection authority closure

- make VehicleProjection and ChargerProjection the sole semantic entry points for normal Mobility screens;
- route Overview, Vehicle Management, Charger Management and detail composition through the same projected Experience, relationship, command and configuration truth;
- remove screen-side reads of raw Experience, policy, fleet, relationship, property and charger snapshot surfaces;
- make fleet Overview consume only MOBILITY_PUBLIC_RUNTIME_V2 fleet truth instead of rebuilding missing fleet counts from cards;
- make range Overview consume the canonical policy projection and fail closed when the policy value is absent;
- keep physical charger/vehicle identity separate from configured assignment and preserve charger-owned Start/Stop charging commands introduced in rc.81;
- retain rc.81 mobile layout and user-safe relationship wording;
- keep cross-domain Energy consumption exclusively on RHI_ENERGY_PUBLIC_CONTRACT_V2.

Rollback: **v1.0.0-rc.81**.
Known accepted technical debt: **0**.
Known accepted feature debt: **0**.
Target Home Assistant runtime and rollback qualification remain separate gates before stable promotion.
