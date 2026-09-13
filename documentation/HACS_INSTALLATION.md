# HACS Installation and Rollback

Repository: `npinguin/rhi-mobility-ux`
Category: **Dashboard**

## Install RC

1. HACS → Custom repositories.
2. Add `npinguin/rhi-mobility-ux` as type **Dashboard**.
3. Download the desired release.
4. Confirm the Lovelace resource resolves to `/hacsfiles/rhi-mobility-ux/rhi-mobility-ux.js` as a JavaScript module.
5. Refresh Home Assistant frontend resources/browser.

No `/local/homebrain/...` Mobility resource or image copy is required by the HACS bundle.

## Rollback

HACS → RHI Mobility UX → Redownload → select the previous immutable release version.

Do not overwrite an existing Git tag/release asset. A defective version is superseded by a new patch/RC version.

## Legacy retirement

Do not delete the legacy `/local/homebrain/...` files until HACS install, refresh, rollback and runtime parity are proven. After proof, remove the old resource reference first, then retire the old files in a separate controlled cleanup.
