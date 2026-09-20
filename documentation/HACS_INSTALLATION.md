# HACS Installation and Rollback

Repository: `npinguin/rhi-mobility-ux`  
Category: **Dashboard**

## Foolproof install

Use this exact order:

1. In **HACS → Custom repositories**, add `https://github.com/npinguin/rhi-mobility-ux` as type **Dashboard**.
2. Install the latest published Mobility UX release.
3. Open **Settings → Dashboards → Resources** and confirm exactly one Mobility UX resource: `/hacsfiles/rhi-mobility-ux/rhi-mobility-ux.js` as **JavaScript Module**.
4. Remove any old `/local/homebrain/...` Mobility JavaScript resource. Do not load the legacy and HACS bundles together.
5. Do not paste a top-level `lovelace:` / `resources:` block into a dashboard raw configuration editor. That editor expects a top-level `views:` array.
6. Keep your existing Mobility dashboard YAML/card declarations unless the release notes explicitly say otherwise.
7. Hard-refresh Home Assistant and validate desktop and iPad.
8. Check the compact footer. Healthy state is intentionally quiet and gray: `RHI Mobility UX <version> · Backend <release>`. Contract/runtime details are in the hover tooltip; warnings/errors appear in color only when a problem exists.
9. Only after runtime proof, retire old `/config/www/homebrain/...` Mobility files.

## If resources are explicitly YAML-managed

Only in `configuration.yaml`, use:

```yaml
lovelace:
  resources:
    - url: /hacsfiles/rhi-mobility-ux/rhi-mobility-ux.js
      type: module
```

Do not paste that block into **Edit dashboard → Raw configuration editor**.

## Rollback

HACS → RHI Mobility UX → **Redownload / Need a different version?** → select the previous immutable release.

Do not overwrite an existing Git tag/release asset. A defective version is superseded by a new patch/RC version.

## Legacy retirement

Do not delete legacy `/local/homebrain/...` files until HACS install, refresh and runtime parity are proven. Remove the old resource reference first; retire files later in a separate controlled cleanup.
