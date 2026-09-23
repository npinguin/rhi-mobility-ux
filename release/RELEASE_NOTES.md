# v1.0.0-rc.36 — Hero runtime URL resolution hotfix

## Scope
- fixes double resolution of canonical hero URLs in the shared page-hero renderer;
- preserves rc.35 flat HACS asset delivery unchanged;
- adds exact rendered URL regression tests for Overview and Strategies;
- rejects any future `asset--hacsfiles--...` double-packaging path.

## Rollback
Rollback candidate: `v1.0.0-rc.35`.

## Qualification
Static/package/HACS validation must pass before publication. Target Home Assistant proof must confirm heroes render after HACS update without manual file moves.
