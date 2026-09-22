// Package-owned visual catalog. Backend owns image_key; this layer maps keys to immutable package assets.
const RHI_MOBILITY_IMAGE_CATALOG = Object.freeze([
  { image_key:"vehicle_audi_q8", package_path:"vehicles/vehicle_audi_q8.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_bmw_x1_phev", package_path:"vehicles/vehicle_bmw_x1_phev.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_mercedes_gla", package_path:"vehicles/vehicle_mercedes_gla.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_vw_id4", package_path:"vehicles/vehicle_vw_id4.webp", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_renault_scenic_techno_ev", package_path:"vehicles/vehicle_renault_scenic_techno_ev.webp", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_guest", package_path:"vehicles/vehicle_fallback.png", fallback_image_key:"vehicle_fallback" },
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


/**
 * Package-owned vehicle visual catalog.
 * Backend stores only the selected vehicle.image_key. UX owns type/color choices,
 * asset paths and presentation.
 */
const RHI_MOBILITY_VEHICLE_VISUALS = Object.freeze([
  {
    id:"audi.q8.4m.2024-2026.tfsi-e", label:"Audi Q8 TFSI-e", brand:"Audi", model:"Q8",
    generation:"4M", years:"2024–2026", variant:"TFSI-e", image_key:"vehicle_audi_q8", selectable:true, visual_quality:"verified_model",
    colors:[
      { id:"daytona-grey", label:"Daytona Grey", filter:"none" },
      { id:"mythos-black", label:"Mythos Black", filter:"brightness(.42) contrast(1.14) saturate(.7)" },
      { id:"glacier-white", label:"Glacier White", filter:"brightness(1.35) saturate(.45) contrast(.88)" },
      { id:"navarra-blue", label:"Navarra Blue", filter:"sepia(.32) saturate(2.4) hue-rotate(170deg) brightness(.78)" },
      { id:"tango-red", label:"Tango Red", filter:"sepia(.45) saturate(3.2) hue-rotate(305deg) brightness(.82)" }
    ]
  },
  {
    id:"bmw.x1.u11.2025-2026.phev", label:"BMW X1 PHEV", brand:"BMW", model:"X1",
    generation:"U11", years:"2025–2026", variant:"PHEV", image_key:"vehicle_bmw_x1_phev", selectable:true, visual_quality:"verified_model",
    colors:[
      { id:"mineral-white", label:"Mineral White", filter:"none" },
      { id:"black-sapphire", label:"Black Sapphire", filter:"brightness(.40) contrast(1.18) saturate(.7)" },
      { id:"skyscraper-grey", label:"Skyscraper Grey", filter:"grayscale(.55) brightness(.86)" },
      { id:"phytonic-blue", label:"Phytonic Blue", filter:"sepia(.28) saturate(2.5) hue-rotate(170deg) brightness(.82)" },
      { id:"fire-red", label:"Fire Red", filter:"sepia(.45) saturate(3.1) hue-rotate(305deg) brightness(.85)" }
    ]
  },
  {
    id:"mercedes.gla.h247.2023-2026.phev", label:"Mercedes-Benz GLA PHEV", brand:"Mercedes-Benz", model:"GLA",
    generation:"H247", years:"2023–2026", variant:"PHEV", image_key:"vehicle_mercedes_gla", selectable:true, visual_quality:"verified_model",
    colors:[
      { id:"mountain-grey", label:"Mountain Grey", filter:"none" },
      { id:"night-black", label:"Night Black", filter:"brightness(.42) contrast(1.15) saturate(.7)" },
      { id:"polar-white", label:"Polar White", filter:"brightness(1.35) saturate(.45) contrast(.88)" },
      { id:"spectral-blue", label:"Spectral Blue", filter:"sepia(.30) saturate(2.5) hue-rotate(170deg) brightness(.80)" },
      { id:"patagonia-red", label:"Patagonia Red", filter:"sepia(.45) saturate(3.1) hue-rotate(305deg) brightness(.82)" }
    ]
  },
  {
    id:"renault.scenic.e-tech.2024-2026.techno", label:"Renault Scenic E-Tech", brand:"Renault", model:"Scenic",
    generation:"E-Tech", years:"2024–2026", variant:"Techno EV", image_key:"vehicle_renault_scenic_techno_ev", selectable:true, visual_quality:"verified_model",
    colors:[
      { id:"pearl-white", label:"Pearl White", filter:"none" },
      { id:"starry-black", label:"Starry Black", filter:"brightness(.42) contrast(1.16) saturate(.65)" },
      { id:"schiste-grey", label:"Schiste Grey", filter:"grayscale(.55) brightness(.82)" },
      { id:"midnight-blue", label:"Midnight Blue", filter:"sepia(.28) saturate(2.2) hue-rotate(170deg) brightness(.72)" },
      { id:"flame-red", label:"Flame Red", filter:"sepia(.45) saturate(3.0) hue-rotate(305deg) brightness(.84)" }
    ]
  },
  {
    id:"volkswagen.id4.2024-2026.ev", label:"Volkswagen ID.4", brand:"Volkswagen", model:"ID.4",
    generation:"ID.4", years:"2024–2026", variant:"EV", image_key:"vehicle_vw_id4", selectable:true, visual_quality:"verified_model",
    colors:[
      { id:"costa-azul", label:"Costa Azul", filter:"none" },
      { id:"moonstone-grey", label:"Moonstone Grey", filter:"grayscale(.65) brightness(.78)" },
      { id:"mythos-black", label:"Black", filter:"brightness(.40) contrast(1.18) saturate(.65)" },
      { id:"glacier-white", label:"Glacier White", filter:"brightness(1.35) saturate(.42) contrast(.88)" },
      { id:"scale-silver", label:"Scale Silver", filter:"grayscale(.85) brightness(1.05)" }
    ]
  },
  {
    id:"generic.guest.current.phev-1phase", label:"Guest PHEV 1-phase", brand:"Generic", model:"Guest PHEV",
    generation:"Current", years:"Any", variant:"PHEV 1-phase", image_key:"vehicle_guest", selectable:true, visual_quality:"generic",
    colors:[
      { id:"slate-grey", label:"Slate Grey", filter:"none" },
      { id:"carbon-black", label:"Carbon Black", filter:"brightness(.42) contrast(1.16)" },
      { id:"pearl-white", label:"Pearl White", filter:"brightness(1.32) saturate(.40)" },
      { id:"deep-blue", label:"Deep Blue", filter:"sepia(.3) saturate(2.4) hue-rotate(170deg) brightness(.76)" },
      { id:"urban-green", label:"Urban Green", filter:"sepia(.4) saturate(1.9) hue-rotate(70deg) brightness(.72)" }
    ]
  },
  {
    id:"generic.guest.current.ev-3phase", label:"Guest EV 3-phase", brand:"Generic", model:"Guest EV",
    generation:"Current", years:"Any", variant:"EV 3-phase", image_key:"vehicle_guest", selectable:true, visual_quality:"generic",
    colors:[
      { id:"slate-grey", label:"Slate Grey", filter:"none" },
      { id:"carbon-black", label:"Carbon Black", filter:"brightness(.42) contrast(1.16)" },
      { id:"pearl-white", label:"Pearl White", filter:"brightness(1.32) saturate(.40)" },
      { id:"deep-blue", label:"Deep Blue", filter:"sepia(.3) saturate(2.4) hue-rotate(170deg) brightness(.76)" },
      { id:"urban-green", label:"Urban Green", filter:"sepia(.4) saturate(1.9) hue-rotate(70deg) brightness(.72)" }
    ]
  }
]);

const RHI_MOBILITY_VEHICLE_VISUAL_ALIASES = Object.freeze({
  // Current Mobility profile/source keys
  audi_q8_daytona_grey_23:"audi.q8.4m.2024-2026.tfsi-e.daytona-grey",
  vw_id4_business_pro_silver_grey:"volkswagen.id4.2024-2026.ev.scale-silver",
  mercedes_gla_phev:"mercedes.gla.h247.2023-2026.phev.mountain-grey",
  bmw_x1_phev:"bmw.x1.u11.2025-2026.phev.mineral-white",
  renault_scenic_techno_ev:"renault.scenic.e-tech.2024-2026.techno.pearl-white",
  guest_phev:"generic.guest.current.phev-1phase.slate-grey",
  guest_ev:"generic.guest.current.ev-3phase.slate-grey",

  // Existing UX/package aliases kept for backward compatibility
  vehicle_audi_q8:"audi.q8.4m.2024-2026.tfsi-e.daytona-grey",
  vehicle_audi_q8_hero:"audi.q8.4m.2024-2026.tfsi-e.daytona-grey",
  vehicle_bmw_x1_phev:"bmw.x1.u11.2025-2026.phev.mineral-white",
  vehicle_bmw_ix1_phev:"bmw.x1.u11.2025-2026.phev.mineral-white",
  vehicle_bmw_x1:"bmw.x1.u11.2025-2026.phev.mineral-white",
  vehicle_bmw_ix1_phev_hero:"bmw.x1.u11.2025-2026.phev.mineral-white",
  vehicle_mercedes_gla:"mercedes.gla.h247.2023-2026.phev.mountain-grey",
  vehicle_mercedes_gla_hero:"mercedes.gla.h247.2023-2026.phev.mountain-grey",
  vehicle_renault_scenic_techno_ev:"renault.scenic.e-tech.2024-2026.techno.pearl-white",
  vehicle_renault_scenic:"renault.scenic.e-tech.2024-2026.techno.pearl-white",
  vehicle_renault_scenic_techno_ev_hero:"renault.scenic.e-tech.2024-2026.techno.pearl-white",
  vehicle_vw_id4:"volkswagen.id4.2024-2026.ev.scale-silver",
  vehicle_vw_id4_hero:"volkswagen.id4.2024-2026.ev.scale-silver",
  vehicle_guest:"generic.guest.current.phev-1phase.slate-grey",
  vehicle_guest_generic:"generic.guest.current.phev-1phase.slate-grey"
});

function rhiMobilityVehicleVisualCatalog() {
  return RHI_MOBILITY_VEHICLE_VISUALS.map((row)=>({
    ...row,
    colors: row.colors.map((color)=>({ ...color })),
    package_file: rhiMobilityImageCatalog().find((item)=>item.image_key===row.image_key)?.package_file || ""
  }));
}

function rhiMobilitySelectableVehicleVisualCatalog() {
  return rhiMobilityVehicleVisualCatalog().filter((row)=>row.selectable !== false);
}

function rhiMobilityParseVehicleVisualKey(value = "") {
  const raw = String(value || "").trim();
  const canonical = RHI_MOBILITY_VEHICLE_VISUAL_ALIASES[raw] || raw;
  for (const vehicle of RHI_MOBILITY_VEHICLE_VISUALS) {
    const prefix = vehicle.id + ".";
    if (!canonical.startsWith(prefix)) continue;
    const colorId = canonical.slice(prefix.length);
    const color = vehicle.colors.find((row)=>row.id===colorId) || vehicle.colors[0];
    return { key:vehicle.id + "." + color.id, vehicle, color };
  }
  return null;
}

function rhiMobilityVehicleVisualKey(vehicleId = "", colorId = "") {
  const vehicle = RHI_MOBILITY_VEHICLE_VISUALS.find((row)=>row.id===String(vehicleId));
  if (!vehicle) return "";
  const color = vehicle.colors.find((row)=>row.id===String(colorId)) || vehicle.colors[0];
  return vehicle.id + "." + color.id;
}


/**
 * Package-owned charger visual catalog.
 * Same contract shape as vehicle visuals: one product identity, explicit
 * appearances, one central alias surface and package-owned rendering.
 * Frozen V1 may only provide a readonly charger.image_key; the catalog remains
 * the presentation authority so V2 can replace only the runtime adapter.
 */
const RHI_MOBILITY_CHARGER_VISUALS = Object.freeze([
  {
    id:"wallbox.commander2.22kw", label:"Wallbox Commander 2", brand:"Wallbox", model:"Commander 2",
    variant:"", years:"Current", max_power_kw:22, selectable:true, visual_quality:"verified_model",
    appearances:[
      { id:"white", label:"White", image_key:"charger_wallbox_white" },
      { id:"black", label:"Black", image_key:"charger_wallbox_black" }
    ]
  },
  {
    id:"peblar.business.socket.22kw", label:"Peblar Business", brand:"Peblar", model:"Business",
    variant:"Socket", years:"Current", max_power_kw:22, selectable:true, visual_quality:"verified_model",
    appearances:[
      { id:"factory", label:"Factory finish", image_key:"charger_peblar" }
    ]
  },
  {
    id:"fibaro.wall-plug-2.zwave-plus.be-fr", label:"Fibaro Wall Plug 2", brand:"Fibaro", model:"Wall Plug 2",
    variant:"Z-Wave Plus BE/FR", years:"Current", max_power_kw:2.5, selectable:true, visual_quality:"verified_model",
    appearances:[
      { id:"white", label:"White", image_key:"charger_utility_plug" }
    ]
  }
]);

const RHI_MOBILITY_CHARGER_VISUAL_ALIASES = Object.freeze({
  // Frozen V1 profile image keys.
  wallbox_ocpp:"wallbox.commander2.22kw.white",
  peblar_22kw:"peblar.business.socket.22kw.factory",
  fibaro_utility_plug:"fibaro.wall-plug-2.zwave-plus.be-fr.white",
  utility_plug:"fibaro.wall-plug-2.zwave-plus.be-fr.white",

  // Existing package keys.
  charger_wallbox:"wallbox.commander2.22kw.white",
  charger_wallbox_white:"wallbox.commander2.22kw.white",
  charger_wallbox_black:"wallbox.commander2.22kw.black",
  charger_peblar:"peblar.business.socket.22kw.factory",
  charger_utility_plug:"fibaro.wall-plug-2.zwave-plus.be-fr.white",

  // Frozen V1 instance compatibility only. V2 identity/color replaces these.
  charger_driveway_left:"wallbox.commander2.22kw.white",
  charger_driveway_right:"wallbox.commander2.22kw.black",
  charger_sideway:"peblar.business.socket.22kw.factory",
  charger_utility_plug:"fibaro.wall-plug-2.zwave-plus.be-fr.white"
});

function rhiMobilityChargerVisualCatalog() {
  const images = rhiMobilityImageCatalog();
  return RHI_MOBILITY_CHARGER_VISUALS.map((row)=>({
    ...row,
    appearances: row.appearances.map((appearance)=>({
      ...appearance,
      package_file: images.find((item)=>item.image_key===appearance.image_key)?.package_file || ""
    }))
  }));
}

function rhiMobilitySelectableChargerVisualCatalog() {
  return rhiMobilityChargerVisualCatalog().filter((row)=>row.selectable !== false);
}

function rhiMobilityParseChargerVisualKey(value = "", assetId = "") {
  const raw = String(value || "").trim();
  const instanceAlias = RHI_MOBILITY_CHARGER_VISUAL_ALIASES[String(assetId || "").trim()];
  const canonical = instanceAlias || RHI_MOBILITY_CHARGER_VISUAL_ALIASES[raw] || raw;
  for (const charger of rhiMobilityChargerVisualCatalog()) {
    const prefix = charger.id + ".";
    if (!canonical.startsWith(prefix)) continue;
    const appearanceId = canonical.slice(prefix.length);
    const appearance = charger.appearances.find((row)=>row.id===appearanceId) || charger.appearances[0] || null;
    return appearance ? { key:charger.id + "." + appearance.id, charger, appearance } : null;
  }
  return null;
}

function rhiMobilityChargerVisualKey(chargerId = "", appearanceId = "") {
  const charger = rhiMobilityChargerVisualCatalog().find((row)=>row.id===String(chargerId));
  if (!charger) return "";
  const appearance = charger.appearances.find((row)=>row.id===String(appearanceId)) || charger.appearances[0];
  return appearance ? charger.id + "." + appearance.id : "";
}

function rhiMobilityResolveChargerVisual(asset = {}, rawKey = "") {
  const assetId = String(asset?.asset_id || asset || "").trim();
  const parsed = rhiMobilityParseChargerVisualKey(rawKey || asset?.image_key || asset?.raw?.image_key || "", assetId);
  if (parsed?.appearance?.package_file) return parsed;
  return null;
}
