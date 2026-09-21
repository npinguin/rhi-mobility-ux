// Package-owned visual catalog. Backend owns image_key; this layer maps keys to immutable package assets.
const RHI_MOBILITY_IMAGE_CATALOG = Object.freeze([
  { image_key:"vehicle_audi_q8", package_path:"vehicles/vehicle_audi_q8.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_audi_q8_hero", package_path:"vehicles/vehicle_audi_q8_hero.png", fallback_image_key:"vehicle_audi_q8" },
  { image_key:"vehicle_mercedes_gla", package_path:"vehicles/vehicle_mercedes_gla.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_vw_id4", package_path:"vehicles/vehicle_vw_id4.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_bmw_ix1_phev", package_path:"vehicles/vehicle_bmw_ix1_phev.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_bmw_x1", package_path:"vehicles/vehicle_bmw_ix1_phev.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_bmw_ix1_phev_hero", package_path:"vehicles/vehicle_bmw_ix1_phev_hero.png", fallback_image_key:"vehicle_bmw_ix1_phev" },
  { image_key:"vehicle_renault_scenic_techno_ev", package_path:"vehicles/vehicle_renault_scenic_techno_ev.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_renault_scenic", package_path:"vehicles/vehicle_renault_scenic_techno_ev.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_renault_scenic_techno_ev_hero", package_path:"vehicles/vehicle_renault_scenic_techno_ev_hero.png", fallback_image_key:"vehicle_renault_scenic_techno_ev" },
  { image_key:"vehicle_unknown_profile", package_path:"vehicles/vehicle_unknown_profile.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_unknown_profile_hero", package_path:"vehicles/vehicle_unknown_profile_hero.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_guest", package_path:"vehicles/vehicle_unknown_profile.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_guest_generic", package_path:"vehicles/vehicle_unknown_profile.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_fallback", package_path:"vehicles/vehicle_fallback.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"charger_wallbox", package_path:"chargers/charger_wallbox.png", fallback_image_key:"charger_fallback" },
  { image_key:"charger_wallbox_white", package_path:"chargers/charger_wallbox_white.png", fallback_image_key:"charger_wallbox" },
  { image_key:"charger_wallbox_black", package_path:"chargers/charger_wallbox_black.png", fallback_image_key:"charger_wallbox" },
  { image_key:"charger_peblar", package_path:"chargers/charger_peblar.png", fallback_image_key:"charger_fallback" },
  { image_key:"charger_utility_plug", package_path:"chargers/charger_utility_plug.png", fallback_image_key:"charger_fallback" },
  { image_key:"charger_fallback", package_path:"chargers/charger_fallback.png", fallback_image_key:"charger_fallback" }
]);

function rhiMobilityImageCatalog() {
  return RHI_MOBILITY_IMAGE_CATALOG.map((row)=>({
    image_key: row.image_key,
    package_file: rhiMobilityAssetUrl(row.package_path),
    fallback_image_key: row.fallback_image_key
  }));
}
