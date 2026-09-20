# HACS Installation, Dashboard Migration and Rollback

Repository: `npinguin/rhi-mobility-ux`  
Category: **Dashboard**

## Install RC

1. HACS → Custom repositories.
2. Add `npinguin/rhi-mobility-ux` as type **Dashboard**.
3. For a TEST CANDIDATE (`-rc.N`), enable **Show beta versions** in the HACS repository settings before downloading. HACS otherwise tracks the default-branch commit and shows short commit SHAs instead of the immutable prerelease tag.
4. Download/select the desired immutable version (for example `v1.0.0-rc.2`), not the default branch.
5. Verify the HACS dialog shows semantic versions such as `v1.0.0-rc.2` for Installed/Latest. If it shows short commit hashes (for example `abcdef0`), the repository is still in default-branch mode; use **Redownload** and select the tagged prerelease after enabling beta versions.
6. Confirm the Lovelace resource resolves to `/hacsfiles/rhi-mobility-ux/rhi-mobility-ux.js` as a JavaScript module.
7. Refresh Home Assistant frontend resources/browser.

No `/local/homebrain/...` Mobility resource or image copy is required by the HACS bundle.

## Migrate an existing Mobility YAML dashboard

The HACS bundle keeps the current custom card names and dashboard routes. The existing dashboard YAML can therefore be migrated without redesigning the dashboard.

Important:
- the dashboard URL/path must remain `mobility-supervisor`, because internal navigation uses `/mobility-supervisor/...`;
- remove the legacy `resource_version: 'R22.12.11.30'` entries so the HACS bundle version owns cache busting;
- keep the HACS resource `/hacsfiles/rhi-mobility-ux/rhi-mobility-ux.js` configured as a JavaScript module;
- do not remove the old `/local/homebrain/...` resource/files until HACS install, refresh, navigation and rollback have been proven.

### Copy/paste dashboard YAML

```yaml
title: Home Intelligence Mobility

views:
  - title: Vehicles
    path: dashboard
    icon: mdi:car-electric
    panel: true
    cards:
      - type: custom:homebrain-mobility-dashboard-card
        dashboard_path: /mobility-supervisor/dashboard
        contract_mode: external_only
        outcome_renderer: shared_asset_outcome
        command_source: mobility_command_index
        relationship_source: mobility_relationship_index
        release_info_position: bottom

  - title: Vehicle & Charger Detail
    path: asset-detail
    icon: mdi:shape-outline
    subview: true
    panel: true
    cards:
      - type: custom:homebrain-mobility-asset-detail-card
        dashboard_path: /mobility-supervisor/dashboard
        contract_mode: external_only
        show_contract_inspector: true
        show_widget_contract_trace: true
        outcome_renderer: shared_asset_outcome
        command_source: mobility_command_index
        relationship_source: mobility_relationship_index
        release_info_position: bottom

  - title: Chargers
    path: charger-maintenance
    icon: mdi:ev-station
    panel: true
    cards:
      - type: custom:homebrain-mobility-charger-maintenance-card
        dashboard_path: /mobility-supervisor/dashboard
        contract_mode: external_only
        show_contract_inspector: true
        outcome_renderer: shared_asset_outcome
        command_source: mobility_command_index
        release_info_position: bottom
```

The same YAML is available as `documentation/homebrain_mobility.hacs.yaml`.

### Migration procedure

1. Keep the current working Mobility dashboard as rollback reference.
2. Install the HACS release and confirm the HACS Lovelace resource is loaded.
3. Open the existing Mobility dashboard Raw configuration editor.
4. Replace the dashboard YAML with the copy/paste YAML above.
5. Save and hard-refresh the browser.
6. Verify:
   - `/mobility-supervisor/dashboard` renders the vehicle overview;
   - vehicle detail navigation opens `/mobility-supervisor/asset-detail?asset=...`;
   - `/mobility-supervisor/charger-maintenance` renders chargers;
   - charger detail navigation works;
   - packaged images load from `/hacsfiles/rhi-mobility-ux/assets/...`;
   - the footer reports the installed Mobility UX version;
   - browser refresh on overview and detail pages preserves rendering;
   - no `Custom element doesn't exist` or JavaScript runtime errors appear.
7. Only after runtime parity and rollback are proven, remove the old `/local/homebrain/...` Lovelace resource and then retire the legacy files.

## Release announcement links

A valid versioned HACS install must show an immutable tag such as `v1.0.0-rc.2`. The HACS **Read release announcement** link is only reliable in that versioned mode. If Installed/Latest are short commit hashes, HACS is tracking the default branch and can generate a non-existent `/releases/<commit>` URL. Switch to the tagged prerelease as described above; do not treat a branch commit as a governed release.

## Rollback

HACS → RHI Mobility UX → Redownload → enable beta versions when rolling back to an RC → select the previous immutable release version.

If the dashboard YAML itself must be rolled back, restore the previous dashboard Raw configuration before removing the HACS resource.

Do not overwrite an existing Git tag/release asset. A defective version is superseded by a new patch/RC version.

## Legacy retirement

Do not delete the legacy `/local/homebrain/...` files until HACS install, refresh, navigation, rollback and runtime parity are proven. After proof, remove the old resource reference first, then retire the old files in a separate controlled cleanup.
