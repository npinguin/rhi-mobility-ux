# v1.0.0-rc.33 — Overview hero binary hotfix

## Scope
- replaces the corrupt/truncated rc.32 Overview hero WebP with the validated approved image bytes;
- keeps rc.32 Overview layout, status bar, controls and semantics unchanged;
- adds an asset-policy gate that rejects invalid/truncated WebP files before publication.

## Rollback
Rollback candidate: `v1.0.0-rc.32`.

## Qualification
Static/package/HACS validation before publication; runtime proof must confirm the Overview hero renders in Home Assistant/Safari.
