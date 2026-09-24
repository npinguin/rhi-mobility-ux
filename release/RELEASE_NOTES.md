# v1.0.0-rc.55 — canonical visual library refresh TEST CANDIDATE

## Scope

rc.55 completes the current Mobility vehicle and charger artwork refresh.

- Replaces the Audi Q8 with the new normalized transparent canonical master.
- Guest PHEV and Guest EV now intentionally resolve to one covered Audi Q8 master.
- Replaces Wallbox Commander 2 white/black, Peblar Business and Fibaro Wall Plug 2 with new transparent product masters.
- Keeps all vehicle masters on the governed 640×380 canvas.
- Standardizes current charger masters on an exact 1254×1254 transparent WebP canvas.
- Removes the superseded Audi PNG and charger SVG masters.
- Preserves package-local artwork authority and source/dist parity.

Required/tested backend: `M0.10.1`.
Rollback: `v1.0.0-rc.54`.

Accepted technical debt: 0.
Accepted feature debt: 0.
Target Home Assistant qualification remains mandatory.
