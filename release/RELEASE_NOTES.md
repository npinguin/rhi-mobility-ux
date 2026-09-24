# v1.0.0-rc.54 — normalized vehicle masters and write-path cleanup TEST CANDIDATE

## Scope

rc.54 closes the vehicle-artwork consistency and optimistic-write cleanup identified in the Mobility UX audit.

- Replaces BMW X1 PHEV, Mercedes-Benz GLA PHEV, Renault Scenic E-Tech and Volkswagen ID.4 artwork with normalized transparent 640×380 canonical masters.
- Uses one governed vehicle geometry: centered presentation, preserved aspect ratio, maximum 590×300 vehicle box and shared baseline y=340.
- Standardizes the four updated vehicle masters on package-local WebP and removes superseded BMW/Mercedes PNG masters.
- Keeps one master per real model; Overview, Management, Detail, Planning, History and pickers resolve the same canonical artwork.
- Removes legacy optimistic/no-readback property write helpers; user writes remain on the asynchronous canonical backend-readback path.
- Adds a regression gate that forbids reintroducing no-readback write paths.
- Hardens asset policy so verified current vehicle masters must remain exact 640×380 package assets.

Required/tested backend: `M0.10.1`.
Rollback: `v1.0.0-rc.53`.

Accepted technical debt: 0.
Accepted feature debt: 0.
Target Home Assistant qualification remains mandatory.
