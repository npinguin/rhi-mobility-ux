# Migration Baseline

## Source

Legacy UX release: `R22.12.11.30`.

The migration intentionally starts from the existing source modules and custom-element registrations. The initial HACS RC changes packaging and repository mechanics only:

- source directory organization;
- deterministic build;
- self-contained HACS-managed runtime images;
- HACS metadata;
- CI/release workflows;
- architecture and hygiene gates;
- public compatibility declaration.

No backend contract redesign, screen redesign, feature removal or new fallback logic is authorized by this migration.

## Runtime target

- Public contract: `MOBILITY_PUBLIC_RUNTIME_V1`
- Deployed migration baseline: backend `R43.2.60`
- Runtime parity/physical proof: pending until installed through HACS and exercised in Home Assistant.

## Traceability

`archive/legacy/LEGACY_SOURCE.sha256` records the original package checksum. Exact legacy JS and dashboard YAML are preserved as text evidence.
