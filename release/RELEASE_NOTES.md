# v1.0.0-rc.27 — shared Vehicle and Charger visual library

## Scope

- keeps Mobility UX on frozen `MOBILITY_PUBLIC_RUNTIME_V1`; no new V1 product, profile or intelligence semantics are introduced;
- fixes package artwork URL resolution so selected Vehicle and Charger masters are rendered directly instead of being double-prefixed and falling back;
- establishes one governed visual-library pattern for Vehicles and Chargers, designed for later reuse by other RHI domains;
- adds the current Charger catalog: Wallbox Commander 2 (White/Black), Peblar Business Socket and Fibaro Wall Plug 2 Z-Wave Plus BE/FR;
- replaces duplicate/placeholder Charger raster files with package-owned 1600×1600 scalable masters;
- centralizes frozen-V1 Charger compatibility aliases in the catalog boundary;
- integrates Charger visual resolution into Overview, linked-charger Vehicle presentation, Charger Management and Charger Detail;
- adds the Charger & colour picker with preview now and persistence only when the active backend contract exposes a writable `charger.image_key`;
- tightens phone composition for Vehicle heroes and Charger management;
- enforces visual provenance, exact Charger asset inventory, minimum master dimensions and maximum runtime size.

## Runtime contract

- Contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Minimum backend: `M0.9.29`
- Tested backend baseline: `M0.9.29`
- V1 status for this scope: frozen compatibility input only

## Qualification

Static validation and HACS packaging are required before publication. Target Home Assistant runtime, mobile rendering, visual picker readback/persistence where writable, restart persistence and rollback remain qualification evidence and are not implied by CI.
