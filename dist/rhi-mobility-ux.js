/**
 * Robotix Home Intelligence Mobility UX v1.0.0-rc.24
 * GENERATED FILE - DO NOT EDIT.
 * License: GPL-3.0-only
 */

// ---- src/app/asset-paths.js ----
// Packaging-only HACS asset resolver. Backend owns image_key only; UX maps it to packaged relative paths.
const RHI_MOBILITY_HACS_BASE = "/hacsfiles/rhi-mobility-ux";
const RHI_MOBILITY_ASSET_PATH = /^(?:[a-z0-9][a-z0-9_-]*\/)*[a-z0-9][a-z0-9_.-]*\.(?:png|webp|svg|jpg|jpeg)$/;

function rhiMobilityAssetUrl(path, revision = "") {
  const normalized = String(path || "").trim().replace(/^\/+/, "");
  if (!normalized) return "";
  if (
    normalized.includes("..")
    || normalized.includes("\\")
    || normalized.includes("?")
    || normalized.includes("#")
    || normalized.includes(":")
    || !RHI_MOBILITY_ASSET_PATH.test(normalized)
  ) return "";
  const base = `${RHI_MOBILITY_HACS_BASE}/assets/${normalized}`;
  return revision ? `${base}?v=${encodeURIComponent(String(revision))}` : base;
}

// ---- src/app/asset-catalog.js ----
// Package-owned visual catalog. Backend owns image_key; this layer maps keys to immutable package assets.
const RHI_MOBILITY_IMAGE_CATALOG = Object.freeze([
  { image_key:"vehicle_audi_q8", package_path:"vehicles/vehicle_audi_q8.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_audi_q8_hero", package_path:"vehicles/vehicle_audi_q8_hero.png", fallback_image_key:"vehicle_audi_q8" },
  { image_key:"vehicle_mercedes_gla", package_path:"vehicles/vehicle_mercedes_gla.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_vw_id4", package_path:"vehicles/vehicle_fallback.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_bmw_ix1_phev", package_path:"vehicles/vehicle_bmw_ix1_phev.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_bmw_x1", package_path:"vehicles/vehicle_bmw_ix1_phev.png", fallback_image_key:"vehicle_unknown_profile" },
  { image_key:"vehicle_bmw_ix1_phev_hero", package_path:"vehicles/vehicle_bmw_ix1_phev_hero.png", fallback_image_key:"vehicle_bmw_ix1_phev" },
  { image_key:"vehicle_renault_scenic_techno_ev", package_path:"vehicles/vehicle_fallback.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_renault_scenic", package_path:"vehicles/vehicle_fallback.png", fallback_image_key:"vehicle_fallback" },
  { image_key:"vehicle_renault_scenic_techno_ev_hero", package_path:"vehicles/vehicle_fallback.png", fallback_image_key:"vehicle_fallback" },
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
    id:"bmw.ix1.u11.2022-2026.ev", label:"BMW iX1", brand:"BMW", model:"iX1",
    generation:"U11", years:"2022–2026", variant:"EV", image_key:"vehicle_bmw_ix1_phev", selectable:true, visual_quality:"verified_model",
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
    generation:"E-Tech", years:"2024–2026", variant:"Techno EV", image_key:"vehicle_fallback", selectable:false, visual_quality:"fallback_only",
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
    generation:"ID.4", years:"2024–2026", variant:"EV", image_key:"vehicle_fallback", selectable:false, visual_quality:"fallback_only",
    colors:[
      { id:"costa-azul", label:"Costa Azul", filter:"none" },
      { id:"moonstone-grey", label:"Moonstone Grey", filter:"grayscale(.65) brightness(.78)" },
      { id:"mythos-black", label:"Black", filter:"brightness(.40) contrast(1.18) saturate(.65)" },
      { id:"glacier-white", label:"Glacier White", filter:"brightness(1.35) saturate(.42) contrast(.88)" },
      { id:"scale-silver", label:"Scale Silver", filter:"grayscale(.85) brightness(1.05)" }
    ]
  },
  {
    id:"generic.guest.current.generic", label:"Guest vehicle", brand:"Generic", model:"Guest vehicle",
    generation:"Current", years:"Any", variant:"Generic", image_key:"vehicle_guest", selectable:true, visual_quality:"generic",
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
  vehicle_audi_q8:"audi.q8.4m.2024-2026.tfsi-e.daytona-grey",
  vehicle_audi_q8_hero:"audi.q8.4m.2024-2026.tfsi-e.daytona-grey",
  vehicle_bmw_ix1_phev:"bmw.ix1.u11.2022-2026.ev.mineral-white",
  vehicle_bmw_x1:"bmw.ix1.u11.2022-2026.ev.mineral-white",
  vehicle_bmw_ix1_phev_hero:"bmw.ix1.u11.2022-2026.ev.mineral-white",
  vehicle_mercedes_gla:"mercedes.gla.h247.2023-2026.phev.mountain-grey",
  vehicle_mercedes_gla_hero:"mercedes.gla.h247.2023-2026.phev.mountain-grey",
  vehicle_renault_scenic_techno_ev:"renault.scenic.e-tech.2024-2026.techno.pearl-white",
  vehicle_renault_scenic:"renault.scenic.e-tech.2024-2026.techno.pearl-white",
  vehicle_renault_scenic_techno_ev_hero:"renault.scenic.e-tech.2024-2026.techno.pearl-white",
  vehicle_vw_id4:"volkswagen.id4.2024-2026.ev.costa-azul",
  vehicle_vw_id4_hero:"volkswagen.id4.2024-2026.ev.costa-azul",
  vehicle_guest:"generic.guest.current.generic.slate-grey",
  vehicle_guest_generic:"generic.guest.current.generic.slate-grey"
});

function rhiMobilityVehicleVisualCatalog() {
  return RHI_MOBILITY_VEHICLE_VISUALS.map((row)=>({
    ...row,
    colors: row.colors.map((color)=>({ ...color })),
    package_file: rhiMobilityImageCatalog().find((item)=>item.image_key===row.image_key)?.package_file || rhiMobilityAssetUrl("vehicles/vehicle_fallback.png")
  }));
}

function rhiMobilitySelectableVehicleVisualCatalog() {
  return rhiMobilityVehicleVisualCatalog().filter((row)=>row.selectable !== false && row.visual_quality !== "fallback_only");
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

// ---- src/app/header-and-navigation.js ----
// 00-header-and-navigation.js
// Constants, navigation shell helpers and shared shell styles.

/**
 * Home Brain Mobility Assets Bundle
 * Release version is defined by UX_VERSION below and package.json.
 *
 * Purpose:
 * - Provides the bundled frontend custom elements for the Mobility domain.
 * - Keeps the YAML thin: dashboard pages mount custom cards, while this bundle owns registry parsing,
 *   asset grouping, route generation, detail rendering, empty states and safe action rendering.
 *
 * Architecture boundaries:
 * - Backend owns consumer-facing public indexes. The frontend consumes them only through HomeBrainAssetRuntime; asset registry and reverse relationship matching are forbidden for dashboard runtime rendering.
 * - Frontend owns presentation and generated navigation only. It must not require detail_route in backend.
 * - Command placement comes from command-slot contracts; readiness/execution metadata comes from the canonical Command Index; execution uses the canonical Mobility command ingress.
 *
 * R22.12.11.30 charger contract materialization closure:
 * - Uses one shared charger product snapshot for overview and detail: operating_state, connection_state, power_kw, health/health_reason and physical connected vehicle.
 * - Consumes only R43.2.54 charger_actions.commands / vehicle_actions.commands for normal command placement and preserves backend order.
 * - Renders every frontend-allowed backend-placed command exactly once on desktop and mobile; responsive CSS may wrap but never suppress actions.
 * - Uses mobility_command_index exclusively for readiness, blocked reason and invoke metadata; no status/power/capability-derived readiness.
 * - Removes product lifecycle fallback to deprecated aggregate runtime publications; missing lifecycle is a contract gap.
 * - Removes frontend kW↔A/phase synchronization and secondary writes; editable properties write only their own backend-owned property binding.
 * - Centralizes property writes in HomeBrainAssetRuntime instead of constructing service payloads in cards.
 * - Keeps runtime health separate from physical/release acceptance in the release footer.
 * - HACS migration baseline: single self-contained rhi-mobility-ux.js; no /local runtime dependency
 */
/*
Robotix Home Intelligence Mobility UX

Defines:
- custom:homebrain-vehicle-asset-detail-card
- custom:homebrain-charger-asset-detail-card

Internal structure:
- HomeBrainAssetRuntime: shared HA/entity helpers
- HomeBrainAssetShell: generic asset detail shell
- HomeBrainVehicleAdapter: vehicle contract mapping
- HomeBrainChargerAdapter: charger contract mapping
*/

const UX_VERSION = "1.0.0-rc.24";
const HB_MOBILITY_COMPANY_LOGO_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"75 116 1624 688\" role=\"img\" aria-labelledby=\"title desc\">\n<title id=\"title\">Robotix.be</title>\n<desc id=\"desc\">DomotiX · Network · Security</desc>\n<path fill=\"#0B4C86\" fill-rule=\"evenodd\" d=\"M536,549 L516,554 L512,556 L501,558 L497,560 L497,609 L512,608 L513,607 L525,606 L537,603 L537,551ZM1698,698 L1696,696 L1692,695 L1678,695 L1677,694 L1658,694 L1657,693 L1638,693 L1637,692 L1618,692 L1617,691 L1573,690 L1572,689 L1552,689 L1551,688 L1524,688 L1523,687 L1494,687 L1493,686 L1447,685 L1446,684 L1441,684 L1440,683 L1441,682 L1440,679 L1440,636 L1419,633 L1418,632 L1397,630 L1396,629 L1381,628 L1380,627 L1364,625 L1362,623 L1362,542 L1360,539 L1334,531 L1327,530 L1313,525 L1310,525 L1293,519 L1262,511 L1255,508 L1245,506 L1211,495 L1201,493 L1175,484 L1172,484 L1148,476 L1145,476 L1122,468 L1115,467 L1092,459 L1085,458 L1076,454 L1059,450 L1049,446 L1036,443 L1033,441 L1030,441 L1013,435 L1006,434 L997,430 L987,428 L964,420 L957,419 L944,414 L941,414 L928,409 L925,409 L909,403 L906,403 L890,397 L887,397 L867,404 L857,406 L848,410 L832,414 L819,419 L809,421 L784,430 L781,430 L771,434 L761,436 L752,440 L749,440 L721,450 L714,451 L683,462 L680,462 L639,476 L623,480 L620,482 L614,483 L601,488 L598,488 L595,490 L583,493 L573,497 L563,496 L562,495 L554,495 L547,499 L538,508 L343,571 L342,572 L342,638 L338,640 L332,640 L321,643 L315,643 L314,644 L309,644 L301,646 L300,648 L300,683 L296,685 L252,686 L251,687 L231,687 L230,688 L210,688 L209,689 L191,689 L190,690 L170,690 L169,691 L152,691 L151,692 L135,692 L134,693 L82,695 L81,696 L77,696 L76,700 L78,701 L121,701 L122,702 L299,704 L300,705 L300,729 L302,732 L306,733 L315,733 L316,734 L334,735 L335,736 L360,738 L361,739 L371,739 L372,740 L380,740 L381,741 L400,742 L401,743 L408,743 L409,744 L417,744 L418,745 L427,745 L428,746 L436,746 L437,747 L453,748 L454,749 L472,750 L473,751 L489,752 L490,753 L514,755 L515,756 L522,756 L523,757 L558,760 L559,761 L591,764 L599,766 L607,766 L608,767 L625,768 L632,770 L657,772 L665,774 L691,776 L692,777 L698,777 L706,779 L713,779 L714,780 L721,780 L729,782 L752,784 L753,785 L765,786 L766,787 L781,788 L789,790 L812,792 L813,793 L819,793 L820,794 L826,794 L827,795 L833,795 L841,797 L848,797 L849,798 L855,798 L856,799 L862,799 L870,801 L884,802 L885,801 L906,799 L907,798 L913,798 L914,797 L920,797 L921,796 L927,796 L928,795 L934,795 L935,794 L941,794 L942,793 L948,793 L949,792 L955,792 L956,791 L962,791 L970,789 L985,788 L986,787 L992,787 L999,785 L1006,785 L1007,784 L1035,781 L1036,780 L1042,780 L1050,778 L1057,778 L1058,777 L1065,777 L1066,776 L1072,776 L1080,774 L1103,772 L1104,771 L1112,771 L1113,770 L1127,769 L1128,768 L1149,766 L1150,765 L1157,765 L1165,763 L1173,763 L1174,762 L1190,761 L1191,760 L1205,759 L1213,757 L1223,757 L1224,756 L1256,753 L1257,752 L1264,752 L1265,751 L1272,751 L1273,750 L1316,746 L1324,744 L1332,744 L1333,743 L1341,743 L1342,742 L1350,742 L1351,741 L1359,741 L1360,740 L1369,740 L1370,739 L1378,739 L1379,738 L1387,738 L1388,737 L1398,737 L1399,736 L1416,735 L1417,734 L1424,734 L1425,733 L1434,733 L1440,731 L1440,708 L1441,707 L1440,706 L1442,704 L1513,704 L1514,703 L1524,703 L1527,704 L1528,703 L1657,702 L1658,701 L1695,701ZM1408,720 L1404,722 L1400,721 L1400,652 L1399,651 L1384,649 L1383,648 L1377,648 L1376,647 L1369,647 L1368,646 L1349,644 L1349,726 L1348,727 L1341,727 L1340,728 L1333,728 L1332,729 L1314,730 L1313,729 L1313,640 L1307,638 L1278,635 L1277,634 L1271,634 L1263,632 L1224,628 L1224,738 L1222,740 L1189,743 L1188,744 L1180,744 L1179,745 L1171,745 L1170,746 L1163,746 L1162,747 L1139,749 L1138,750 L1131,750 L1130,751 L1122,751 L1121,752 L1114,752 L1113,753 L1096,754 L1095,753 L1095,611 L1071,608 L1070,607 L1048,605 L1047,604 L1040,604 L1039,603 L1033,603 L1032,602 L1026,602 L1025,601 L1019,601 L1011,599 L1003,599 L995,597 L972,595 L971,594 L959,593 L958,592 L954,592 L953,593 L953,772 L951,774 L937,775 L936,776 L908,779 L900,781 L893,781 L885,783 L877,783 L876,782 L862,781 L861,780 L855,780 L847,778 L840,778 L839,777 L817,775 L816,774 L807,774 L806,773 L800,773 L799,772 L793,772 L785,770 L778,770 L777,769 L770,769 L769,768 L762,768 L761,767 L739,765 L738,764 L730,764 L729,763 L729,606 L714,607 L706,609 L676,612 L675,613 L661,614 L660,615 L646,616 L645,617 L631,618 L630,619 L623,619 L622,620 L622,750 L621,751 L588,748 L587,747 L571,746 L570,745 L562,745 L561,744 L552,744 L551,743 L544,743 L537,741 L537,631 L536,630 L507,633 L506,634 L500,634 L499,635 L485,636 L484,637 L476,638 L476,735 L475,736 L466,736 L465,735 L465,644 L464,643 L464,639 L402,648 L402,729 L401,730 L364,727 L361,725 L361,661 L364,659 L370,659 L371,658 L377,658 L378,657 L394,655 L395,654 L395,650 L394,649 L362,653 L361,654 L355,654 L354,655 L340,656 L339,657 L327,658 L326,659 L318,659 L317,660 L313,660 L312,659 L312,655 L322,652 L342,650 L355,647 L393,643 L406,640 L413,640 L414,639 L420,639 L421,638 L434,637 L435,636 L441,636 L449,634 L456,634 L457,633 L463,633 L471,631 L479,631 L480,630 L492,629 L493,628 L509,627 L510,626 L530,624 L536,622 L552,621 L553,620 L576,618 L583,616 L607,614 L608,613 L615,613 L616,612 L624,612 L632,610 L640,610 L648,608 L671,606 L672,605 L701,602 L702,601 L709,601 L710,600 L716,600 L717,599 L723,599 L731,597 L739,597 L747,595 L755,595 L762,593 L770,593 L771,592 L792,590 L800,588 L832,585 L833,584 L861,581 L862,580 L879,579 L880,578 L887,578 L888,577 L898,577 L906,579 L915,579 L916,580 L923,580 L924,581 L956,584 L963,586 L979,587 L986,589 L1002,590 L1003,591 L1031,594 L1039,596 L1046,596 L1054,598 L1062,598 L1063,599 L1069,599 L1076,601 L1083,601 L1084,602 L1090,602 L1098,604 L1106,604 L1107,605 L1113,605 L1114,606 L1120,606 L1121,607 L1127,607 L1135,609 L1143,609 L1144,610 L1166,612 L1167,613 L1181,614 L1189,616 L1197,616 L1198,617 L1210,618 L1211,619 L1218,619 L1219,620 L1233,621 L1234,622 L1242,622 L1243,623 L1272,626 L1273,627 L1279,627 L1287,629 L1312,631 L1313,632 L1319,632 L1320,633 L1339,635 L1340,636 L1347,636 L1354,638 L1362,638 L1363,639 L1369,639 L1376,641 L1404,644 L1408,646ZM885,440 L886,441 L886,560 L883,562 L875,562 L869,564 L861,564 L853,566 L846,566 L845,567 L817,570 L816,569 L816,460 L819,458 L822,458 L826,456 L829,456 L833,454 L836,454 L840,452 L843,452 L847,450 L858,448 L875,442ZM1339,551 L1339,612 L1338,613 L1338,620 L1337,621 L1332,620 L1330,617 L1330,589 L1331,588 L1331,578 L1330,577 L1331,559 L1330,558 L1330,554 L1316,549 L1283,541 L1276,538 L1269,537 L1251,531 L1248,531 L1248,606 L1246,608 L1238,608 L1237,607 L1230,607 L1222,605 L1215,605 L1214,604 L1208,604 L1207,603 L1201,603 L1200,602 L1194,602 L1193,601 L1187,601 L1186,600 L1180,600 L1172,598 L1149,596 L1142,594 L1135,594 L1128,592 L1086,587 L1085,586 L1066,584 L1065,583 L1058,583 L1057,582 L1035,580 L1034,579 L1021,578 L1020,577 L1014,577 L1013,576 L1007,576 L999,574 L992,574 L991,573 L985,573 L977,571 L963,570 L959,568 L959,524 L958,523 L958,509 L959,508 L959,455 L958,454 L958,448 L955,448 L941,443 L920,438 L891,429 L885,429 L860,437 L843,441 L823,448 L820,448 L813,451 L799,454 L786,459 L779,460 L766,465 L749,469 L743,472 L743,579 L741,581 L709,585 L708,586 L702,586 L701,587 L695,587 L694,588 L688,588 L687,589 L666,591 L665,592 L657,592 L656,593 L650,593 L649,594 L643,594 L635,596 L620,597 L612,599 L604,599 L603,598 L603,583 L602,582 L602,578 L603,577 L603,546 L602,545 L603,543 L603,523 L602,522 L602,513 L600,513 L556,527 L553,527 L543,531 L526,535 L488,548 L485,548 L482,550 L482,564 L480,566 L444,575 L440,577 L429,579 L425,581 L421,581 L414,584 L411,584 L395,589 L395,625 L396,626 L404,624 L416,623 L417,622 L423,622 L424,621 L451,618 L458,616 L464,616 L470,614 L478,614 L479,613 L489,612 L490,611 L490,556 L493,554 L522,547 L543,540 L545,547 L545,599 L544,600 L545,607 L543,609 L525,611 L518,613 L504,614 L503,615 L497,615 L496,616 L477,618 L476,619 L464,620 L463,621 L456,621 L455,622 L429,625 L428,626 L422,626 L421,627 L389,631 L388,632 L376,633 L375,634 L369,634 L362,636 L358,635 L358,583 L360,581 L372,578 L391,571 L394,571 L429,559 L432,559 L435,557 L444,555 L466,547 L469,547 L491,539 L494,539 L506,534 L509,534 L542,523 L545,523 L551,520 L564,517 L577,512 L580,512 L587,509 L590,509 L597,506 L610,503 L616,500 L636,495 L665,485 L679,482 L689,478 L692,478 L728,466 L735,465 L778,451 L785,450 L798,445 L818,440 L828,436 L848,431 L861,426 L870,424 L873,422 L884,420 L887,418 L913,426 L916,426 L926,430 L933,431 L936,433 L957,438 L999,451 L1006,452 L1023,458 L1030,459 L1033,461 L1065,469 L1085,476 L1092,477 L1099,480 L1120,485 L1130,489 L1141,491 L1147,494 L1182,503 L1212,513 L1231,517 L1265,528 L1268,528 L1272,530 L1303,538 L1309,541 L1316,542 L1326,546 L1336,548ZM1248,241 L1248,281 L1249,282 L1295,282 L1296,281 L1296,241 L1295,240 L1249,240ZM1493,178 L1490,184 L1487,195 L1487,246 L1488,247 L1489,255 L1493,263 L1498,270 L1503,274 L1515,280 L1523,282 L1533,282 L1534,283 L1640,282 L1641,280 L1641,250 L1640,246 L1549,246 L1546,245 L1541,240 L1540,237 L1541,234 L1639,234 L1641,226 L1641,198 L1640,197 L1640,191 L1635,178 L1625,167 L1618,163 L1602,159 L1526,159 L1525,160 L1517,161 L1505,166ZM1540,201 L1548,193 L1581,193 L1584,194 L1589,199 L1590,206 L1589,207 L1582,207 L1581,208 L1545,208 L1540,206ZM998,159 L995,161 L995,281 L996,282 L1049,282 L1049,160 L1048,159ZM1059,159 L1059,162 L1114,221 L1105,232 L1062,276 L1059,280 L1059,282 L1126,282 L1150,257 L1160,266 L1174,282 L1241,282 L1241,280 L1190,226 L1187,221 L1243,163 L1244,161 L1243,159 L1178,159 L1151,187 L1125,159 L1119,159 L1118,158 L1117,159ZM865,177 L852,165 L842,161 L834,160 L833,159 L819,159 L818,158 L815,159 L749,159 L748,160 L740,161 L728,166 L715,179 L712,185 L709,196 L709,245 L713,258 L718,266 L725,273 L737,279 L749,282 L831,282 L832,281 L841,280 L853,275 L866,262 L870,254 L872,246 L873,203 L872,202 L871,190ZM765,202 L770,198 L775,196 L805,196 L806,197 L810,197 L816,202 L819,211 L819,231 L816,239 L813,242 L804,245 L777,245 L768,242 L763,236 L763,230 L762,229 L762,211ZM514,177 L508,170 L499,164 L482,159 L456,159 L455,158 L446,158 L445,159 L392,159 L375,164 L365,171 L359,178 L353,193 L353,199 L352,200 L352,240 L353,241 L354,252 L358,261 L372,275 L385,280 L395,281 L396,282 L476,282 L477,281 L483,281 L491,279 L505,272 L513,264 L517,257 L520,248 L520,242 L521,241 L521,197 L520,196 L519,188ZM408,204 L414,198 L420,196 L450,196 L457,198 L463,204 L465,209 L465,232 L463,237 L457,243 L449,245 L422,245 L414,243 L409,239 L406,231 L406,210ZM894,134 L894,158 L893,159 L877,159 L876,160 L876,196 L893,196 L894,197 L894,247 L895,248 L896,257 L901,268 L911,277 L924,282 L929,282 L930,283 L965,283 L966,282 L980,281 L982,279 L982,245 L981,244 L959,245 L954,243 L951,240 L949,234 L949,197 L950,196 L979,196 L979,160 L978,159 L950,159 L949,158 L949,122 L948,121 L924,127 L920,127 L912,130 L899,132ZM134,122 L134,281 L135,282 L191,282 L192,281 L192,230 L193,229 L223,229 L272,282 L345,282 L343,277 L338,273 L295,227 L312,223 L323,217 L333,206 L336,199 L338,191 L338,155 L336,147 L332,139 L324,130 L315,125 L306,122 L289,121 L288,120 L137,120ZM192,163 L193,162 L266,162 L271,164 L275,168 L277,173 L277,178 L275,183 L271,187 L266,189 L193,189 L192,188ZM1311,117 L1310,118 L1310,260 L1311,261 L1310,263 L1310,280 L1311,282 L1358,282 L1362,272 L1372,279 L1383,282 L1435,282 L1448,279 L1458,274 L1467,265 L1471,258 L1474,247 L1474,240 L1475,239 L1474,193 L1471,183 L1465,173 L1458,167 L1451,163 L1435,159 L1390,159 L1375,163 L1366,169 L1365,168 L1365,118 L1364,117ZM1366,200 L1373,196 L1407,196 L1413,198 L1418,203 L1420,209 L1420,232 L1419,233 L1419,237 L1415,242 L1407,245 L1373,245 L1368,243 L1365,239 L1365,202ZM995,118 L995,151 L1049,151 L1049,117 L996,117ZM533,118 L533,281 L534,282 L582,282 L583,276 L585,272 L591,277 L597,280 L605,281 L606,282 L658,282 L674,278 L684,272 L690,266 L697,251 L698,239 L699,238 L699,229 L698,228 L698,193 L697,192 L697,188 L692,177 L684,168 L673,162 L661,159 L613,159 L600,162 L589,169 L588,168 L588,118 L587,117 L534,117ZM593,197 L596,196 L630,196 L638,199 L643,206 L643,234 L641,239 L638,242 L629,245 L598,245 L591,243 L588,239 L588,203Z\"/>\n<path fill=\"#5B95C8\" fill-rule=\"evenodd\" d=\"M1143,328 L1137,334 L1136,337 L1137,342 L1140,346 L1144,348 L1150,348 L1156,343 L1157,340 L1156,333 L1150,328ZM594,328 L588,334 L588,341 L593,347 L601,348 L607,344 L609,338 L608,334 L602,328ZM1591,313 L1590,314 L1609,341 L1609,360 L1617,360 L1618,359 L1618,341 L1635,317 L1636,313 L1635,312 L1628,312 L1614,331 L1612,330 L1605,319 L1599,312 L1598,313ZM1539,312 L1537,314 L1538,321 L1551,321 L1552,322 L1552,358 L1553,360 L1561,360 L1562,359 L1562,322 L1563,321 L1576,321 L1577,320 L1577,313 L1576,312ZM1519,312 L1512,313 L1512,360 L1520,360 L1521,358 L1521,314ZM1453,312 L1452,313 L1452,360 L1460,360 L1461,359 L1461,343 L1462,342 L1469,342 L1483,360 L1492,360 L1493,359 L1481,343 L1482,341 L1487,339 L1490,336 L1492,331 L1492,324 L1489,318 L1484,314 L1477,312ZM1461,322 L1462,321 L1478,321 L1482,324 L1483,329 L1478,334 L1462,334 L1461,333ZM1391,313 L1391,347 L1394,354 L1398,358 L1405,361 L1418,361 L1424,359 L1428,356 L1432,348 L1432,313 L1431,312 L1425,312 L1423,314 L1423,346 L1419,351 L1414,353 L1408,353 L1402,349 L1400,344 L1400,313 L1399,312ZM1273,313 L1273,359 L1274,360 L1308,360 L1308,352 L1283,352 L1282,351 L1282,341 L1283,340 L1305,340 L1306,339 L1306,332 L1283,332 L1282,331 L1282,322 L1283,321 L1306,321 L1308,319 L1308,314 L1306,312 L1275,312ZM1040,313 L1040,359 L1041,360 L1048,360 L1049,359 L1049,345 L1054,341 L1071,360 L1082,360 L1081,357 L1061,335 L1081,313 L1079,312 L1071,312 L1051,331 L1049,330 L1049,313 L1048,312ZM982,312 L981,313 L981,325 L980,326 L980,345 L981,346 L981,356 L980,358 L981,360 L989,360 L990,343 L991,342 L992,343 L993,342 L998,343 L1012,360 L1021,360 L1020,356 L1010,343 L1011,341 L1017,338 L1020,333 L1021,326 L1019,320 L1013,314 L1006,312ZM989,325 L991,321 L1007,321 L1011,324 L1012,328 L1006,334 L991,334 L990,333ZM832,313 L834,322 L838,332 L838,335 L847,360 L854,360 L856,358 L865,330 L867,332 L876,359 L877,360 L884,360 L885,359 L899,315 L898,312 L891,312 L890,313 L885,327 L883,337 L880,343 L870,313 L863,312 L861,314 L854,337 L851,342 L848,336 L841,313 L839,312ZM781,312 L780,313 L780,320 L781,321 L794,321 L795,322 L795,358 L796,360 L804,360 L804,329 L805,328 L805,322 L806,321 L818,321 L820,319 L820,314 L818,312ZM731,312 L729,314 L729,355 L730,356 L730,360 L765,360 L765,353 L764,352 L740,352 L739,351 L739,341 L740,340 L762,340 L763,339 L763,333 L762,332 L740,332 L739,331 L739,322 L740,321 L763,321 L765,319 L764,313 L763,312ZM664,313 L664,359 L665,360 L672,360 L673,359 L673,330 L674,329 L698,360 L707,360 L707,313 L706,312 L698,313 L698,342 L697,343 L673,312 L666,312ZM493,312 L492,314 L508,336 L491,359 L492,360 L501,360 L510,348 L515,344 L527,360 L536,360 L537,358 L521,337 L521,334 L536,315 L536,313 L535,312 L527,312 L514,328 L501,312ZM466,312 L465,313 L465,359 L466,360 L474,360 L474,312ZM410,312 L409,313 L409,319 L413,321 L423,321 L424,322 L424,359 L425,360 L432,360 L433,359 L433,322 L435,320 L436,321 L448,320 L449,319 L449,314 L448,312ZM274,313 L274,323 L273,324 L273,358 L275,360 L282,360 L283,359 L283,336 L284,335 L288,341 L296,358 L302,358 L307,350 L311,340 L313,338 L313,336 L315,334 L316,335 L316,359 L317,360 L324,360 L325,359 L325,313 L324,312 L315,312 L303,338 L299,343 L283,312 L275,312ZM139,312 L138,313 L138,359 L139,360 L161,360 L162,359 L166,359 L172,356 L179,349 L182,343 L182,330 L179,322 L172,315 L164,312ZM148,320 L163,321 L170,326 L173,333 L173,338 L171,344 L165,350 L162,351 L148,351 L147,350 L147,321ZM1344,312 L1339,314 L1330,322 L1326,332 L1327,345 L1330,351 L1338,358 L1346,361 L1357,361 L1368,356 L1371,353 L1371,351 L1366,346 L1361,350 L1354,353 L1349,353 L1343,351 L1338,346 L1336,342 L1336,331 L1338,327 L1343,322 L1348,320 L1358,321 L1365,326 L1368,325 L1371,320 L1366,315 L1359,312 L1354,312 L1353,311ZM1237,311 L1224,313 L1220,315 L1215,322 L1215,330 L1221,337 L1230,340 L1239,341 L1244,345 L1244,348 L1240,352 L1237,353 L1230,353 L1223,350 L1220,347 L1218,347 L1214,352 L1214,354 L1227,361 L1243,360 L1247,358 L1251,354 L1253,350 L1253,341 L1247,335 L1243,333 L1227,330 L1224,327 L1224,324 L1229,320 L1237,320 L1244,323 L1246,325 L1249,323 L1251,318 L1249,316ZM929,312 L922,315 L913,325 L911,331 L911,342 L915,351 L920,356 L927,360 L931,361 L946,360 L952,357 L959,350 L962,344 L962,329 L961,326 L954,317 L947,313 L939,311ZM930,321 L933,320 L944,321 L950,326 L953,333 L952,343 L943,352 L939,353 L930,352 L923,346 L920,339 L921,330 L924,325ZM355,315 L350,320 L345,330 L346,345 L352,354 L360,359 L367,361 L379,360 L387,356 L393,350 L397,340 L397,332 L394,323 L385,314 L377,311 L364,311ZM361,322 L365,320 L376,320 L381,322 L385,326 L387,330 L387,341 L385,345 L380,350 L375,352 L366,352 L358,347 L355,342 L354,333 L357,326ZM215,313 L205,322 L202,329 L201,338 L204,348 L211,356 L219,360 L230,361 L242,357 L249,351 L253,342 L253,336 L254,335 L253,334 L253,328 L250,322 L243,315 L234,311 L221,311ZM218,322 L222,320 L233,320 L237,322 L242,327 L244,332 L244,339 L241,346 L237,350 L232,352 L223,352 L217,349 L213,345 L211,340 L211,332 L213,327Z\"/>\n</svg>";

const HB_MOBILITY_BASE_PATH = "/mobility-supervisor";

const HB_MOBILITY_MODULES = [
  {
    key: "mobility",
    label: "Mobility",
    icon: "mdi:car-electric",
    path: "/overview",
    items: [
      { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline", path: "/overview" },
      { key: "vehicles", label: "Vehicles", icon: "mdi:car-outline", path: "/dashboard" },
      { key: "chargers", label: "Chargers", icon: "mdi:ev-station", path: "/charger-maintenance" },
      { key: "charging", label: "Charging", icon: "mdi:lightning-bolt-outline", path: "/charging" }
    ]
  },
  {
    key: "intelligence",
    label: "Intelligence",
    icon: "mdi:brain",
    path: "/planning",
    items: [
      { key: "planning", label: "Planning", icon: "mdi:calendar-clock-outline", path: "/planning" },
      { key: "strategies", label: "Strategies", icon: "mdi:target", path: "/strategies" }
    ]
  },
  {
    key: "insights",
    label: "Insights",
    icon: "mdi:chart-bar",
    path: "/history",
    items: [
      { key: "history", label: "History", icon: "mdi:chart-timeline-variant", path: "/history" },
      { key: "log", label: "Log", icon: "mdi:format-list-bulleted", path: "/log" }
    ]
  }
];

const HB_MOBILITY_NAV_ITEMS = HB_MOBILITY_MODULES.flatMap((module) =>
  module.items.map((item) => ({ ...item, module: module.key }))
);

function hbMobilityPath(path) {
  return `${HB_MOBILITY_BASE_PATH}${path}`;
}

function hbMobilityModuleFor(active = "overview") {
  const item = HB_MOBILITY_NAV_ITEMS.find((entry) => entry.key === active);
  return HB_MOBILITY_MODULES.find((module) => module.key === (item?.module || active))
    || HB_MOBILITY_MODULES[0];
}

function hbMobilityCompanyBrand() {
  return `<div class="hi-company-brand" aria-label="Robotix.be · DomotiX · Network · Security">
    <span class="hi-company-logo" role="img" aria-label="Robotix.be — DomotiX · Network · Security">${HB_MOBILITY_COMPANY_LOGO_SVG}</span>
  </div>`;
}

function hbMobilityNav(active = "overview") {
  const module = hbMobilityModuleFor(active);
  return `<header class="hi-domain-shell hi-nav-${module.key}">
    <div class="hi-product-area">
      <div class="hi-domain-shell-top">
        <div class="hi-domain-identity" aria-label="Home Intelligence Mobility">
          <span>Home Intelligence</span>
          <strong>MOBILITY</strong>
        </div>
        <nav class="hi-module-tabs" aria-label="Home Intelligence modules">
          ${HB_MOBILITY_MODULES.map((entry) => `<button type="button" class="hi-module-tab ${entry.key === module.key ? "active" : ""}" data-nav="${hbMobilityPath(entry.path)}" title="${entry.label}"><ha-icon icon="${entry.icon}"></ha-icon><span>${entry.label}</span></button>`).join("")}
        </nav>
      </div>
      <div class="hi-domain-shell-bottom">
        <nav class="domain-tabs" aria-label="${module.label} navigation">
          ${module.items.map((tab) => `<button type="button" class="domain-tab ${tab.key === active ? "active" : ""}" data-nav="${hbMobilityPath(tab.path)}" title="${tab.label}"><ha-icon class="domain-tab-icon" icon="${tab.icon}"></ha-icon><span>${tab.label}</span></button>`).join("")}
        </nav>
      </div>
    </div>
    ${hbMobilityCompanyBrand()}
    <style>${hbMobilitySharedShellStyles()}</style>
  </header>`;
}

function hbMobilityTitleBlock(title = "Mobility", description = "Vehicle readiness, charging, comfort and security in one calm control cockpit.") {
  return `<section class="title"><p class="eyebrow">HOME INTELLIGENCE / MOBILITY</p><h1>${title}</h1><p>${description}</p></section>`;
}

function hbMobilityReleaseFooter(rt) {
  const esc = (v) => rt && rt.escape ? rt.escape(v) : String(v ?? "").replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
  const rel = rt && rt.releaseContract ? rt.releaseContract() : {};
  const backend = rel.backend_release || rel.backend_version || "Unknown";
  const contract = rel.contract_version || "Unknown";
  const details = [];
  let severity = "";
  try {
    const summary = rt && rt.runtimeHealthSummary ? rt.runtimeHealthSummary() : null;
    if (backend === "Unknown") {
      severity = "error";
      details.push("Backend release contract unavailable.");
    }
    if (summary) {
      const status = String(summary.status || "Unknown").toUpperCase();
      if (status === "BLOCKED") {
        severity = "error";
        details.push("Canonical Mobility runtime health reports failure.");
      } else if (status === "DEGRADED") {
        if (!severity) severity = "warning";
        details.push("Canonical Mobility runtime health reports degradation.");
      } else if (!["OK","HEALTHY"].includes(status)) {
        if (!severity) severity = "warning";
        details.push("Canonical Mobility runtime health is unavailable.");
      }

      const physical = String(summary.physical_acceptance || "Unknown");
      const releaseAcceptance = String(summary.release_acceptance || "Unknown");
      if (["NOT_PROVEN","PENDING","UNKNOWN"].includes(physical.toUpperCase())) {
        if (!severity) severity = "warning";
        details.push("Physical execution proof pending.");
      }
      if (["NOT_PROVEN","PENDING","UNKNOWN"].includes(releaseAcceptance.toUpperCase())) {
        if (!severity) severity = "warning";
        details.push("Release acceptance proof pending.");
      }
      if (summary.diagnostic_bad_count) {
        if (!severity) severity = "warning";
        const rows = (summary.diagnostics || []).filter((row) => row.bad).slice(0, 5);
        details.push(`Diagnostics: ${summary.diagnostic_status || "degraded"}.`);
        rows.forEach((row) => details.push(`${row.label || "Diagnostic"}: ${row.state || "Unknown"}.`));
      }
    }
  } catch (e) {
    if (!severity) severity = "warning";
    details.push("Runtime diagnostics unavailable.");
  }

  const issueDetails = details.length ? `
    <details class="rhiUxFooterDetails">
      <summary class="rhiUxFooterIssue ${severity || "warning"}">${severity === "error" ? "Runtime issue" : `${details.length} issue${details.length === 1 ? "" : "s"}`} · details</summary>
      <div class="rhiUxFooterPanel" role="status">
        <div class="rhiUxFooterPanelMeta">Backend ${esc(backend)} · Contract ${esc(contract)}</div>
        ${details.map((line) => `<div class="rhiUxFooterProblem"><span class="rhiUxFooterProblemDot" aria-hidden="true"></span><span>${esc(line)}</span></div>`).join("")}
        <div class="rhiUxFooterAction">Resolve the listed runtime/backend condition, then reload this view to verify recovery.</div>
      </div>
    </details>` : "";

  return `<footer class="rhiUxFooter" aria-label="RHI Mobility release information"><span>RHI Mobility UX ${esc(UX_VERSION)}</span><span>Backend ${esc(backend)}</span>${issueDetails}</footer>`;
}

function hbMobilityOutcomeStrip(rt, contextId = "mobility", fallback = {}) {
  const esc = (v) => rt && rt.escape ? rt.escape(v) : String(v ?? "").replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
  const outcome = (field, fb) => (rt && rt.supervisorOutcome ? rt.supervisorOutcome(contextId, field, fb) : fb) || fb;
  const status = outcome("status", fallback.status || "OK");
  const trust = outcome("trust", fallback.trust || (rt && rt.backendVersion ? rt.backendVersion() : "Unknown"));
  const attention = outcome("attention", fallback.attention || "None");
  const opportunity = outcome("opportunity", fallback.opportunity || "None");
  const recommendation = outcome("recommended_action", fallback.recommended_action || "none");
  const items = [
    ["mdi:check-circle-outline", "Status", status, "green"],
    ["mdi:shield-check-outline", "Trust", trust, "blue"],
    ["mdi:alert-circle-outline", "Attention", attention, "orange"],
    ["mdi:lightbulb-outline", "Opportunity", opportunity, "green"],
    ["mdi:arrow-right-circle-outline", "Recommended action", recommendation, "blue"]
  ];
  return `<section class="status-strip dashboard-status-strip outcome-header">
    ${items.map(([icon,label,value,tone]) => `<div class="metric tone-${tone}"><ha-icon icon="${icon}"></ha-icon><div><span>${label}</span><b>${esc(value)}</b></div></div>`).join("")}
  </section>`;
}
function hbMobilitySharedShellStyles() {
  return `
    :host{
      --hi-primary:#1467F5;
      --hi-primary-soft:#EAF3FF;
      --hi-ink:#0F172A;
      --hi-muted:#64748B;
      --hi-line:#E2E8F0;
      --hi-surface:#FFFFFF;
      --hi-surface-soft:#F8FAFC;
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    }

    .hi-domain-shell{
      --nav-active-bg:#edf5ff;
      --nav-active-border:#cfdef1;
      --nav-active-text:#0f4ca4;
      --rhi-company-area-min:250px;
      --rhi-company-area-max:320px;
      --rhi-company-logo-max-width:286px;
      --rhi-company-logo-max-height:116px;
      --rhi-company-logo-padding:10px 16px;
      --rhi-company-divider:rgba(226,232,240,.82);
      position:relative;
      display:grid;
      grid-template-columns:minmax(0,1fr) minmax(var(--rhi-company-area-min),var(--rhi-company-area-max));
      gap:0;
      width:100%;
      box-sizing:border-box;
      margin:0 0 12px;
      background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(249,251,254,.91));
      border:1px solid rgba(207,217,230,.86);
      border-radius:22px;
      box-shadow:0 12px 30px rgba(15,23,42,.045);
      overflow:hidden;
      color:var(--hi-ink);
      backdrop-filter:blur(16px);
    }
    .hi-domain-shell.hi-nav-intelligence{--nav-active-bg:#f1edff;--nav-active-border:#dfd5fb;--nav-active-text:#5a38b3}
    .hi-domain-shell.hi-nav-insights{--nav-active-bg:#e7f7f4;--nav-active-border:#cdebe6;--nav-active-text:#176e67}

    .hi-product-area{min-width:0}
    .hi-domain-shell-top{
      min-height:78px;
      display:grid;
      grid-template-columns:minmax(270px,.72fr) minmax(430px,1.28fr);
      align-items:center;
      gap:24px;
      padding:10px 22px 9px;
    }
    .hi-domain-identity{display:grid;align-content:center;gap:2px;min-width:0;min-height:56px;padding:2px 0 0 4px}
    .hi-domain-identity span{font-size:15px;line-height:1.1;font-weight:520;letter-spacing:-.01em;color:#58708f;white-space:nowrap}
    .hi-domain-identity strong{font-size:24px;line-height:1.02;letter-spacing:.055em;font-weight:790;color:#0b467f;white-space:nowrap}

    .hi-module-tabs,.domain-tabs{
      display:flex;
      align-items:center;
      overflow-x:auto;
      overflow-y:hidden;
      white-space:nowrap;
      scrollbar-width:none;
      -webkit-overflow-scrolling:touch;
      overscroll-behavior-inline:contain;
    }
    .hi-module-tabs::-webkit-scrollbar,.domain-tabs::-webkit-scrollbar{display:none}
    .hi-module-tabs{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:0;background:transparent;border:0;border-radius:0;max-width:100%}
    .hi-module-tab{
      appearance:none;
      min-height:50px;
      border:0;
      border-radius:15px;
      background:transparent;
      padding:10px 20px;
      font:inherit;
      font-size:13px;
      font-weight:660;
      color:#53647d;
      cursor:pointer;
      white-space:nowrap;
      display:flex;
      align-items:center;
      gap:10px;
      transition:background .15s ease,color .15s ease,box-shadow .15s ease;
    }
    .hi-module-tab ha-icon{--mdc-icon-size:22px;color:currentColor}
    .hi-module-tab:hover{background:#f8fafc;color:#2f3f56}
    .hi-module-tab.active{background:var(--nav-active-bg);color:var(--nav-active-text);box-shadow:inset 0 0 0 1px var(--nav-active-border),0 6px 16px rgba(15,23,42,.035)}

    .hi-domain-shell-bottom{
      margin:0;
      padding:7px 22px 9px;
      border:0;
      border-top:1px solid rgba(226,232,240,.82);
      border-radius:0;
      background:rgba(255,255,255,.52);
      box-shadow:none;
      backdrop-filter:none;
      min-height:52px;
      box-sizing:border-box;
    }
    .domain-tabs{gap:10px;width:100%;min-height:34px}
    .domain-tab{
      appearance:none;
      flex:0 0 auto;
      min-height:34px;
      border:0;
      border-radius:11px;
      background:transparent;
      padding:7px 12px;
      font:inherit;
      font-size:11px;
      font-weight:600;
      color:#5f6d80;
      cursor:pointer;
      white-space:nowrap;
      display:flex;
      align-items:center;
      gap:6px;
      transition:background .15s ease,color .15s ease,box-shadow .15s ease;
    }
    .domain-tab-icon{--mdc-icon-size:13px;color:#7a8798;flex:0 0 13px}
    .domain-tab:hover{background:#f8fafc;color:#425269}
    .domain-tab:hover .domain-tab-icon{color:#66758a}
    .domain-tab.active{background:var(--nav-active-bg);color:var(--nav-active-text);box-shadow:inset 0 0 0 1px var(--nav-active-border)}
    .domain-tab.active .domain-tab-icon{color:#718096}

    .hi-company-brand{
      min-width:0;
      border-left:1px solid var(--rhi-company-divider);
      display:grid;
      place-items:center;
      padding:var(--rhi-company-logo-padding);
      background:linear-gradient(180deg,rgba(252,254,255,.78),rgba(247,250,253,.58));
    }
    .hi-company-logo{
      display:block;
      width:min(100%,var(--rhi-company-logo-max-width));
      max-height:var(--rhi-company-logo-max-height);
      line-height:0;
      overflow:hidden;
    }
    .hi-company-logo svg{
      display:block;
      width:100%;
      height:auto;
      max-height:var(--rhi-company-logo-max-height);
      object-fit:contain;
      object-position:center;
      filter:none;
      image-rendering:auto;
    }

    .placeholder-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .placeholder-card{background:#fff;border:1px solid #E8EEF7;border-radius:20px;padding:18px;box-shadow:0 16px 38px rgba(15,35,80,.07)}
    .placeholder-card h3{margin:0 0 8px;font-size:18px;color:#06142D}
    .placeholder-card p{margin:0;color:#66728B;font-size:13px;line-height:1.45}
    .placeholder-kicker{display:inline-flex;align-items:center;gap:8px;margin-bottom:10px;color:#1467F5;font-size:12px;font-weight:650;text-transform:uppercase;letter-spacing:.04em}
    .placeholder-kicker ha-icon{--mdc-icon-size:18px}
    .footer-note{margin-top:12px;color:#66728B;font-size:12px;font-weight:600}

    .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{width:100%!important;max-width:none!important;margin:8px 0 10px!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;border:1px solid #E0E8F2!important;border-radius:16px!important;background:#fff!important;box-shadow:0 10px 24px rgba(15,35,80,.045)!important;overflow:hidden!important}
    .status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{display:grid!important;grid-template-columns:28px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;min-width:0!important;padding:12px 14px!important;border-right:1px solid #E8EEF6!important;background:transparent!important}
    .status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child,.outcome-header .metric:last-child{border-right:0!important}
    .status-strip.dashboard-status-strip .metric ha-icon,.status-strip.ops-status-strip .metric ha-icon,.outcome-header .metric ha-icon{--mdc-icon-size:20px}
    .status-strip.dashboard-status-strip .metric>div,.status-strip.ops-status-strip .metric>div,.outcome-header .metric>div{min-width:0}
    .status-strip.dashboard-status-strip .metric span,.status-strip.ops-status-strip .metric span,.outcome-header .metric span{display:block!important;font-size:9px!important;font-weight:600!important;line-height:1.1!important;color:#708098!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .status-strip.dashboard-status-strip .metric b,.status-strip.ops-status-strip .metric b,.outcome-header .metric b{display:block!important;margin-top:2px!important;font-size:12.5px!important;font-weight:650!important;line-height:1.15!important;color:#10213A!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .status-strip .tone-green>ha-icon{color:#16A765!important}.status-strip .tone-blue>ha-icon{color:#1467F5!important}.status-strip .tone-orange>ha-icon{color:#F59E0B!important}
    .section-title{margin-top:4px!important;margin-bottom:8px!important}
    .hi-version-block{display:none!important}
    .rhiUxFooter{display:flex!important;justify-content:center!important;align-items:center!important;flex-wrap:wrap!important;gap:5px 10px!important;margin:10px 3px 0!important;padding:7px 4px!important;border:0!important;background:transparent!important;color:#64748b!important;font-size:11px!important;font-weight:520!important;line-height:1.35!important;opacity:1!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
    .rhiUxFooter>span+span:before{content:"·";margin-right:10px;color:#cbd5e1}
    .rhiUxFooterDetails{position:relative!important;margin:0!important}
    .rhiUxFooterDetails>summary{list-style:none!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;gap:4px!important;white-space:nowrap!important}
    .rhiUxFooterDetails>summary::-webkit-details-marker{display:none}
    .rhiUxFooterDetails>summary:after{content:"▾";font-size:9px;color:currentColor}
    .rhiUxFooterDetails[open]>summary:after{content:"▴"}
    .rhiUxFooterIssue{font-weight:700!important}
    .rhiUxFooterIssue.warning{color:#9a6700!important}
    .rhiUxFooterIssue.error{color:#b42318!important}
    .rhiUxFooterPanel{flex-basis:100%;width:min(720px,calc(100vw - 48px));box-sizing:border-box;margin:7px auto 2px;padding:10px 12px;border:1px solid #dbe5f0;border-radius:10px;background:#fff;color:#334155;font-size:11px;line-height:1.4;box-shadow:0 8px 20px rgba(15,23,42,.06)}
    .rhiUxFooterPanelMeta{font-size:10px;font-weight:650;color:#64748b;margin-bottom:6px}
    .rhiUxFooterProblem{display:grid;grid-template-columns:8px minmax(0,1fr);gap:7px;align-items:start;padding:3px 0}
    .rhiUxFooterProblemDot{width:6px;height:6px;margin-top:5px;border-radius:50%;background:#d97706}
    .rhiUxFooterAction{margin-top:7px;padding-top:7px;border-top:1px solid #eef2f7;color:#475569;font-weight:600}

    @media(max-width:1180px){
      .hi-domain-shell{--rhi-company-area-min:220px;--rhi-company-area-max:250px;--rhi-company-logo-max-width:220px;--rhi-company-logo-max-height:94px;--rhi-company-logo-padding:8px 12px}
      .hi-domain-shell-top{grid-template-columns:minmax(205px,.56fr) minmax(0,1.44fr);gap:12px;padding-inline:16px}
      .hi-module-tabs{gap:6px}
      .hi-module-tab{padding:9px 8px;font-size:11.5px}
      .hi-domain-identity span{font-size:13.5px}
      .hi-domain-identity strong{font-size:21px}
      .hi-domain-shell-bottom{padding-inline:16px}
      .domain-tabs{gap:7px}
      .domain-tab{padding:7px 13px;font-size:11px}
      .hi-company-brand{padding-inline:12px}
    }
    @media(max-width:920px){
      .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{grid-template-columns:repeat(5,minmax(150px,1fr))!important;overflow-x:auto!important}
      .status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric,.outcome-header .metric{min-width:150px!important}
    }
    @media(max-width:820px){
      .hi-domain-shell{--rhi-company-logo-max-width:126px;--rhi-company-logo-max-height:48px;display:block;border-radius:18px}
      .hi-product-area{min-width:0}
      .hi-company-brand{position:absolute;top:8px;right:10px;width:126px;height:48px;padding:0;border:0;background:transparent;pointer-events:none}
      .hi-company-logo{max-height:var(--rhi-company-logo-max-height)}
      .hi-domain-shell-top{display:grid;grid-template-columns:1fr;gap:7px;min-height:0;padding:10px 8px 7px}
      .hi-domain-identity{min-height:48px;padding:1px 138px 0 6px}
      .hi-domain-identity span{font-size:12.5px}
      .hi-domain-identity strong{font-size:19px}
      .hi-module-tabs{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
      .hi-module-tab{min-width:0;min-height:41px;justify-content:center;padding:7px 5px;font-size:10.5px;gap:6px}
      .hi-module-tab ha-icon{--mdc-icon-size:17px}
      .hi-domain-shell-bottom{padding:5px 8px 7px;min-height:48px}
      .domain-tabs{display:flex;overflow-x:auto;white-space:nowrap;gap:4px;min-height:35px}
      .domain-tab{min-height:35px;padding:6px 11px;font-size:10.5px}
      .placeholder-grid{grid-template-columns:1fr}
      .rhiUxFooter{font-size:10.5px!important;gap:4px 8px!important;padding:6px 3px!important}.rhiUxFooter>span+span:before{margin-right:8px!important}.rhiUxFooterPanel{width:min(100%,calc(100vw - 28px));font-size:10.5px}
    }
    @media(max-width:430px){
      .hi-domain-shell{--rhi-company-logo-max-width:102px;--rhi-company-logo-max-height:42px}
      .hi-company-brand{width:102px;right:8px}
      .hi-domain-identity{padding-right:112px}
      .hi-domain-identity strong{font-size:17px}
      .hi-module-tab{font-size:10px}
      .domain-tab{padding:6px 9px;font-size:10px}
    }
  `;
}

// ---- src/domain/adapters/intelligence-model-alignment.js ----
// 06-intelligence-model-alignment.js
// R22.11.17 intelligence model alignment.
//
// R39 backend introduces domain, subdomain and asset intelligence model contracts
// (mobility.*, fleet.*, connections.*, owners.*, vehicle.*, charger.*). The UX
// consumes intelligence only through the public runtime layer. It prepares the family
// resolver to render intelligence properties and insights when published through approved public runtime contracts.

const HI_MOBILITY_INTELLIGENCE_MODEL_ALIGNMENT = Object.freeze({
  backend_model_reference: "R22.8.1.39_INTELLIGENCE_PROPERTY_MODEL",
  active_runtime_baseline: "R22.8.1.37.1 / R22.8.1.16-compatible public indexes",
  runtime_policy: "no_hard_dependency_on_r39_runtime",
  allowed_publication_path: ["vehicle_property_index", "charger_property_index", "person_property_index", "intelligence_index"],
  prepared_prefixes: {
    "mobility.": "domain intelligence, rendered only when published",
    "fleet.": "subdomain/fleet intelligence, rendered only when published",
    "connections.": "connection/charger intelligence, rendered only when published",
    "owners.": "owner/presence intelligence, rendered only when published",
    "vehicle.": "asset intelligence, existing runtime path",
    "charger.": "asset intelligence, existing runtime path"
  }
});

// ---- src/runtime/ha-contract-runtime.js ----
// 10-ha-contract-runtime.js
// Home Assistant state reader, contract loaders, property/relationship/command resolvers, and release contract access.

class HomeBrainAssetRuntime {
  assetUrl(path) { return rhiMobilityAssetUrl(path); }
  constructor(hass, config = {}) {
    this.hass = hass;
    this.config = config;
    this._cache = HomeBrainAssetRuntime._cache || (HomeBrainAssetRuntime._cache = new Map());
    this._memo = new Map();
  }


  hardBackendGateSpecs() {
    return [
      { entity_id: "sensor.mobility_runtime_deployment_health", label: "Runtime deployment", blocking: true },
      { entity_id: "sensor.mobility_runtime_proof_health", label: "Runtime proof", blocking: true },
      { entity_id: "sensor.mobility_audit_closure_health", label: "Audit closure", blocking: true },
      { entity_id: "sensor.mobility_contract_version_consistency_health", label: "Contract version consistency", blocking: true },
      { entity_id: "sensor.mobility_home_intelligence_contract_standard_health", label: "Home Intelligence standard", blocking: true }
    ];
  }

  diagnosticHealthSpecs() {
    return [
      { entity_id: "sensor.mobility_range_normalization_health", label: "Range normalization", blocking: false },
      { entity_id: "sensor.mobility_wallbox_ocpp_phase_projection_health", label: "Wallbox OCPP phase projection", blocking: false },
      { entity_id: "sensor.mobility_source_authority_health", label: "Source authority", blocking: false },
      { entity_id: "sensor.mobility_source_evidence_health", label: "Source evidence", blocking: false },
      { entity_id: "sensor.mobility_index_integrity_health", label: "Index integrity", blocking: false },
      { entity_id: "sensor.mobility_index_schema_health", label: "Index schema", blocking: false },
      { entity_id: "sensor.mobility_energy_publication_health", label: "Energy publication", blocking: false },
      { entity_id: "sensor.mobility_relationship_integrity_health", label: "Relationship integrity", blocking: false },
      { entity_id: "sensor.mobility_runtime_binding_health", label: "Runtime binding", blocking: false },
      { entity_id: "sensor.mobility_command_integrity_health", label: "Command integrity", blocking: false },
      { entity_id: "sensor.mobility_command_publication_health", label: "Command publication", blocking: false },
      { entity_id: "sensor.mobility_contract_traceability_health", label: "Contract traceability", blocking: false },
      { entity_id: "sensor.mobility_property_editable_metadata_health", label: "Editable metadata", blocking: false },
      { entity_id: "sensor.mobility_property_projection_audit", label: "Property projection", blocking: false },
      { entity_id: "sensor.mobility_command_projection_audit", label: "Command projection", blocking: false }
    ];
  }


  contractAuthorityRegistry() {
    return {
      identity_navigation: { entity_id: "sensor.mobility_asset_index", role: "authority" },
      vehicle_properties: { entity_id: "vehicle_component_property_indexes", role: "authority" },
      charger_properties: { entity_id: "sensor.mobility_charger_property_index", role: "authority" },
      relationships: { entity_id: "sensor.mobility_relationship_index", role: "authority" },
      command_readiness: { entity_id: "sensor.mobility_command_index", role: "authority" },
      command_results: { entity_id: "sensor.mobility_activity_index", role: "authority" },
      component_layout: { entity_id: "component_contract_indexes", role: "authority" },
      command_placement: { entity_id: "command_slot_indexes", role: "authority" },
      energy_boundary: { entity_id: "sensor.mobility_energy_asset_publication", role: "external_consumer_only" },
      asset_runtime_compatibility: { entity_id: "sensor.mobility_asset_runtime_contract_index", role: "diagnostics_only_deprecated" },
      product_asset_compatibility: { entity_id: "sensor.mobility_product_asset_index", role: "diagnostics_only_deprecated" }
    };
  }

  compatibilityAssetRuntimeRow(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    if (!canonical) return null;
    const attrs = this.entity("sensor.mobility_asset_runtime_contract_index")?.attributes || {};
    const byId = this.parseJsonValue(attrs.assets_by_id, attrs.assets_by_id || {});
    if (byId && typeof byId === "object" && !Array.isArray(byId) && byId[canonical]) return byId[canonical];
    const rows = this.parseListValue(attrs.assets_json ?? attrs.assets ?? []);
    return rows.find((row)=>String(row?.asset_id || "") === canonical) || null;
  }

  compatibilityLifecyclePropertyRow(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    if (!canonical) return null;
    const legacyEntity = canonical.startsWith("vehicle_") ? "sensor.mobility_vehicle_property_index" : canonical.startsWith("charger_") ? "sensor.mobility_charger_property_index" : "";
    if (!legacyEntity) return null;
    return this.propertyRowsFromEntity(legacyEntity, canonical).find((p)=>["lifecycle_status", "asset.lifecycle_status", "vehicle.lifecycle_status", "charger.lifecycle_status"].includes(String(p.property_key || "").toLowerCase())) || null;
  }

  allowedContractEntityIds() {
    return new Set([
      "sensor.mobility_vehicle_property_index",
      "sensor.mobility_vehicle_component_contract_index",
      "sensor.mobility_charger_component_contract_index",
      "sensor.mobility_ux_runtime_consumption_map",
      "sensor.mobility_asset_runtime_contract_index",
      "sensor.mobility_canonical_asset_contract_registry",
      "sensor.mobility_vehicle_identity_property_index",
      "sensor.mobility_vehicle_battery_property_index",
      "sensor.mobility_vehicle_charging_property_index",
      "sensor.mobility_vehicle_range_property_index",
      "sensor.mobility_vehicle_access_property_index",
      "sensor.mobility_vehicle_comfort_property_index",
      "sensor.mobility_vehicle_location_property_index",
      "sensor.mobility_vehicle_maintenance_property_index",
      "sensor.mobility_vehicle_diagnostics_property_index",
      "sensor.mobility_charger_property_index",
      "sensor.mobility_person_property_index",
      "sensor.mobility_relationship_index",
      "sensor.mobility_command_index",
      "sensor.mobility_vehicle_command_slot_index",
      "sensor.mobility_charger_command_slot_index",
      "sensor.mobility_intelligence_index",
      "sensor.mobility_vehicle_intelligence_index",
      "sensor.mobility_charger_intelligence_index",
      "sensor.mobility_activity_index",
      "sensor.mobility_asset_index",
      "sensor.mobility_vehicle_profile_index",
      "sensor.mobility_charger_profile_index",
      "sensor.mobility_energy_asset_publication",
      "sensor.mobility_release_contract",
      ...this.hardBackendGateSpecs().map((g) => g.entity_id),
      ...this.diagnosticHealthSpecs().map((g) => g.entity_id)
    ]);
  }

  isAllowedContractEntity(entityId = "") {
    const id = String(entityId || "").trim();
    if (!id) return false;
    if (this.allowedContractEntityIds().has(id)) return true;
    // R41.90.1 model-driven component contracts may publish component-specific
    // property index entities. Allow only public property-index shaped entities;
    // do not allow candidate, binding, source evidence or raw runtime entities.
    if (/^sensor\.mobility_(vehicle|charger|person)_[a-z0-9_]+_property_index$/.test(id)) return true;
    return false;
  }

  assertAllowedContractEntity(entityId = "") {
    const id = String(entityId || "").trim();
    if (this.isAllowedContractEntity(id)) return true;
    return false;
  }

  attr(entityId, attr, fallback = undefined) {
    const entity = this.entity(entityId);
    return entity?.attributes?.[attr] ?? fallback;
  }

  parseListValue(value) {
    if (value === undefined || value === null || value === "") return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") {
      if (Array.isArray(value.items)) return value.items;
      if (Array.isArray(value.assets)) return value.assets;
      if (Array.isArray(value.vehicles)) return value.vehicles;
      if (Array.isArray(value.chargers)) return value.chargers;
      return Object.values(value);
    }
    const raw = String(value).trim();
    if (!raw || ["unknown", "unavailable", "none", "null"].includes(raw.toLowerCase())) return [];
    const parsed = this.parseJsonValue(raw, null);
    if (parsed && parsed !== raw) return this.parseListValue(parsed);
    return raw.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean);
  }



  runtimeHealthGateRows() {
    return this._healthRows(this.hardBackendGateSpecs(), { diagnosticsOnly: false });
  }

  runtimeDiagnosticRows() {
    return this._healthRows(this.diagnosticHealthSpecs(), { diagnosticsOnly: true });
  }

  _healthRows(rows = [], options = {}) {
    const diagnosticsOnly = Boolean(options.diagnosticsOnly);
    return rows.map((gate) => {
      const entity = this.entity(gate.entity_id);
      const state = String(entity?.state || "unavailable").trim();
      const normalized = state.toUpperCase();
      const ok = ["OK", "PASS", "PASSED", "READY"].includes(normalized);
      const absent = ["UNKNOWN", "UNAVAILABLE", "NONE", "", "RESTORED"].includes(normalized);
      // Hard gates are closed and explicit: unavailable or unknown is not trusted.
      // Diagnostics-only sensors are non-blocking context and may not create main backend runtime status.
      const bad = diagnosticsOnly ? (!ok && !absent) : !ok;
      const attrs = entity?.attributes || {};
      const rootCause = attrs.rule || attrs.release_gate || attrs.release_gate_rule || attrs.ux_rule || attrs.validation_rule || attrs.reason || "";
      return { ...gate, state, bad, ok, diagnostics_only: diagnosticsOnly, root_cause: rootCause, attributes: attrs };
    });
  }

  runtimeHealthSummary() {
    const hardRows = this.runtimeHealthGateRows();
    const diagnosticRows = this.runtimeDiagnosticRows();
    const diagnosticBad = diagnosticRows.filter((r) => r.bad);
    const release = this.releaseContract();
    const explicitRuntime = String(release.runtime_health || "").trim();
    const deploymentState = String(this.entity("sensor.mobility_runtime_deployment_health")?.state || "").trim();
    const rawRuntime = explicitRuntime && !["unknown","unavailable","none"].includes(explicitRuntime.toLowerCase()) ? explicitRuntime : deploymentState;
    const normalized = String(rawRuntime || "UNKNOWN").toUpperCase();
    let status = "UNKNOWN";
    if (["OK","PASS","PASSED","READY","HEALTHY"].includes(normalized)) status = "OK";
    else if (["DEGRADED","WARNING","WARN"].includes(normalized)) status = "DEGRADED";
    else if (["FAIL","FAILED","BLOCKED","ERROR","NOT_OK"].includes(normalized)) status = "BLOCKED";
    const runtimeBad = ["DEGRADED","BLOCKED"].includes(status);
    const diagnosticStatus = diagnosticBad.length ? "DEGRADED" : "OK";
    return {
      status,
      ok: status === "OK",
      bad_count: runtimeBad ? 1 : 0,
      blocking_count: status === "BLOCKED" ? 1 : 0,
      diagnostic_status: diagnosticStatus,
      diagnostic_bad_count: diagnosticBad.length,
      rows: hardRows,
      diagnostics: diagnosticRows,
      physical_acceptance: release.physical_acceptance || "Unknown",
      release_acceptance: release.release_acceptance || "Unknown",
      message: status === "OK" ? "Mobility runtime healthy." : status === "DEGRADED" ? "Mobility runtime degraded." : status === "BLOCKED" ? "Mobility runtime failed." : "Mobility runtime health unavailable."
    };
  }

  renderRuntimeHealthWarning() {
    const summary = this.runtimeHealthSummary();
    if (!["DEGRADED","BLOCKED"].includes(summary.status)) return "";
    const deployment = String(this.entity("sensor.mobility_runtime_deployment_health")?.state || summary.status);
    return `<div class="hi-contract-warning" title="Mobility runtime health warning"><div><strong>Runtime ${summary.status === "BLOCKED" ? "failed" : "degraded"}</strong> — ${this.escape(summary.message)}</div><div class="hi-contract-warning-list"><span>Runtime health: ${this.escape(deployment)}</span></div></div>`;
  }


  indexAttr(attr, fallback = []) {
    const key = `indexAttr:${attr}`;
    if (this._memo.has(key)) return this._memo.get(key);
    const raw = this.attr("sensor.mobility_asset_index", attr, undefined);
    const parsed = this.parseListValue(raw);
    const value = parsed.length ? parsed : fallback;
    this._memo.set(key, value);
    return value;
  }

  typeIndexEntity(kind = "all") {
    // R22.8: asset index is the only asset catalog/navigation source.
    // Vehicle/charger indexes are compatibility/transitional and must not drive UX asset discovery.
    return "sensor.mobility_asset_index";
  }

  assetIndexRows(kind = "all") {
    const cacheKey = `assetIndexRows:${kind}`;
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const entity = this.entity("sensor.mobility_asset_index");
    const attrs = entity?.attributes || {};
    const list = this.parseListValue(attrs.assets_json);
    let rows = list.map((v, index) => {
      if (typeof v === "string") {
        const asset_id = v;
        return this.normalizeAssetEntry({
          asset_id,
          asset_type: asset_id.startsWith("vehicle_") ? "vehicle" : asset_id.startsWith("charger_") ? "charger" : asset_id.startsWith("person_") ? "person" : "unknown",
          display_name: asset_id,
          frontend_allowed: true,
          lifecycle_state: "Active",
          sort_order: index
        });
      }
      return this.normalizeAssetEntry({ sort_order: index, ...(v || {}) });
    }).filter(Boolean);
    if (kind === "vehicle") rows = rows.filter((a) => String(a.asset_type || "").toLowerCase() === "vehicle");
    if (kind === "charger") rows = rows.filter((a) => String(a.asset_type || "").toLowerCase() === "charger");
    if (kind === "person") rows = rows.filter((a) => String(a.asset_type || "").toLowerCase() === "person");
    this._memo.set(cacheKey, rows);
    return rows;
  }

  consumerAssetIds(kind = "all") {
    return this.assetIndexRows(kind).map((a) => a.asset_id).filter(Boolean);
  }

  indexedAssets(kind = "all") {
    // R22.10.3: runtime UX must consume only the backend-owned consumer indexes.
    // Do not fall back to legacy registries, legacy relationship entities,
    // global charger lists or reverse charger matching. Missing indexes should be
    // visible as a contract/deployment issue rather than silently derived in UX.
    return this.assetIndexRows(kind);
  }

  registryEntryFromList(assetId, list = null) {
    const id = String(assetId || "");
    const items = list || [...this.assetIndexRows("all"), ...this.assetIndexRows("vehicle"), ...this.assetIndexRows("charger")];
    return items.find((a) => a.asset_id === id || a.asset_id === id.replace(/^vehicle_/, "").replace(/^charger_/, "") || a.asset_id === `vehicle_${id}` || a.asset_id === `charger_${id}`) || null;
  }

  assetDisplayName(assetId) {
    const entry = this.registryEntryFromList(assetId, [...this.assetIndexRows("all"), ...this.assetIndexRows("vehicle"), ...this.assetIndexRows("charger")]);
    return entry?.display_name || entry?.raw?.display_name || String(assetId || "Asset");
  }


  assetLiveProfile(assetId) {
    const entry = this.registryEntryFromList(assetId, [...this.assetIndexRows("all"), ...this.assetIndexRows("vehicle"), ...this.assetIndexRows("charger")]);
    return entry?.profile_display_name || entry?.profile || entry?.raw?.profile_display_name || "";
  }


  profileRows() {
    const key = "profileRows";
    if (this._memo.has(key)) return this._memo.get(key);
    const rows = [
      ...this.canonicalRowsFromAttrs("sensor.mobility_vehicle_profile_index", ["profiles", "profile_index", "rows"], "vehicle_profiles"),
      ...this.canonicalRowsFromAttrs("sensor.mobility_charger_profile_index", ["profiles", "profile_index", "rows"], "charger_profiles")
    ];
    this._memo.set(key, rows);
    return rows;
  }

  profileForAsset(asset = {}) {
    const profileId = String(asset?.profile_id || asset?.raw?.profile_id || "");
    if (!profileId) return null;
    return this.profileRows().find((p) => String(p.profile_id || p.id || "") === profileId) || null;
  }

  profileImageCompatibilityKey(asset = {}, role = "image") {
    // R22.12.11.24: package-owned visual mapping for known guest profiles.
    // Future profile-editor additions should publish explicit image_key/hero_image_key.
    // Unknown profiles intentionally resolve to a neutral image, never to a specific car.
    const profileId = String(asset?.profile_id || asset?.raw?.profile_id || "").trim().toLowerCase();
    const profileName = String(asset?.profile || asset?.profile_display_name || asset?.raw?.profile || asset?.raw?.profile_display_name || "").trim().toLowerCase();
    const haystack = `${profileId} ${profileName}`;
    const hero = role === "hero";
    if (profileId === "bmw_x1_2025_phev" || profileId === "bmw_ix1_2025_phev" || (haystack.includes("bmw") && (haystack.includes("x1") || haystack.includes("ix1")))) {
      return hero ? "vehicle_bmw_ix1_phev_hero" : "vehicle_bmw_ix1_phev";
    }
    if (profileId === "renault_scenic_techno_ev" || (haystack.includes("renault") && haystack.includes("scenic"))) {
      return hero ? "vehicle_renault_scenic_techno_ev_hero" : "vehicle_renault_scenic_techno_ev";
    }
    return "";
  }

  isGenericVehicleImageKey(imageKey = "") {
    return ["vehicle_guest", "vehicle_guest_generic", "vehicle_fallback", "vehicle_unknown_profile", "vehicle_unknown_profile_hero", "default_vehicle"].includes(String(imageKey || "").trim());
  }

  imageCatalog() {
    return rhiMobilityImageCatalog();
  }

  resolveImageCatalogEntry(imageKey = "") {
    const key = String(imageKey || "").trim();
    if (!key) return null;
    const direct = this.imageCatalog().find((row) => String(row.image_key || "") === key) || null;
    if (direct) return direct;
    const visual = typeof rhiMobilityParseVehicleVisualKey === "function" ? rhiMobilityParseVehicleVisualKey(key) : null;
    if (!visual) return null;
    const base = this.imageCatalog().find((row) => String(row.image_key || "") === String(visual.vehicle?.image_key || "")) || null;
    return base ? { ...base, visual_key:visual.key, vehicle_visual:visual } : null;
  }

  imageUrlFromCatalog(imageKey = "", fallbackKey = "") {
    const first = this.resolveImageCatalogEntry(imageKey);
    const fallback = this.resolveImageCatalogEntry(fallbackKey || first?.fallback_image_key || "");
    const file = first?.package_file || fallback?.package_file || "";
    return file ? this.cache(file) : "";
  }

  visualImageKey(asset = {}, role = "image") {
    const profile = this.profileForAsset(asset) || {};
    const compatibilityKey = this.profileImageCompatibilityKey(asset, role);
    const candidates = [];
    if (role === "hero") candidates.push(asset.hero_image_key, asset.raw?.hero_image_key, profile.hero_image_key);
    if (role === "thumbnail") candidates.push(asset.thumbnail_image_key, asset.raw?.thumbnail_image_key, profile.thumbnail_image_key);
    candidates.push(asset.image_key, asset.raw?.image_key, profile.image_key);
    const explicit = String(candidates.find((v) => v !== undefined && v !== null && String(v).trim() && !this.isGenericVehicleImageKey(v)) || "").trim();
    if (explicit) return explicit;
    if (compatibilityKey) return compatibilityKey;
    candidates.push(asset.fallback_image_key, asset.raw?.fallback_image_key, profile.fallback_image_key);
    return String(candidates.find((v) => v !== undefined && v !== null && String(v).trim()) || "vehicle_unknown_profile").trim();
  }

  visualImageUrl(asset = {}, kind = "vehicle", role = "image", fallback = "") {
    // R22.8 typed property contract: images resolve through mobility_image_catalog only.
    // Backend owns image keys only; URL/path fields are ignored.
    const key = this.visualImageKey(asset, role);
    const fallbackKey = asset.fallback_image_key || asset.raw?.fallback_image_key || fallback || `${kind}_fallback`;
    return this.imageUrlFromCatalog(key, fallbackKey);
  }

  mobilityRegistry() {
    // R22.8: one discovered asset catalog assembled only from mobility_asset_index.
    const rows = [...this.indexedAssets("all")];
    const seen = new Set();
    return rows.filter((a) => {
      const id = String(a?.asset_id || "");
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  normalizeAssetEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    const assetBlock = entry.asset || {};
    const lifecycleBlock = entry.lifecycle || {};
    const identityBlock = entry.identity || {};
    const trustBlock = entry.trust || {};
    const frontendBlock = entry.frontend || {};
    const relationshipBlock = entry.relationship || entry.relationships || {};
    const asset_id = entry.asset_id || assetBlock.id || entry.id || entry.key;
    if (!asset_id) return null;
    const rawRoles = entry.roles ?? assetBlock.roles;
    const roles = Array.isArray(rawRoles) ? rawRoles : (rawRoles ? String(rawRoles).split(",").map((r) => r.trim()) : []);
    const lifecycle = entry.lifecycle_status || lifecycleBlock.lifecycle_status || entry.lifecycle_state || lifecycleBlock.state || entry.lifecycle || "Unknown";
    return {
      schema_version: entry.schema_version || 1,
      asset_id,
      domain: entry.domain || assetBlock.domain || "mobility",
      asset_type: entry.asset_type || assetBlock.type || entry.type || "unknown",
      display_name: entry.display_name || identityBlock.display_name || entry.name || asset_id,
      profile: entry.profile || entry.profile_display_name || identityBlock.profile || "",
      profile_id: entry.profile_id || identityBlock.profile_id || "",
      profile_display_name: entry.profile_display_name || identityBlock.profile_display_name || entry.profile || identityBlock.profile || "",
      image_key: entry.image_key || identityBlock.image_key || "",
      hero_image_key: entry.hero_image_key || identityBlock.hero_image_key || "",
      thumbnail_image_key: entry.thumbnail_image_key || identityBlock.thumbnail_image_key || "",
      fallback_image_key: entry.fallback_image_key || identityBlock.fallback_image_key || "",
      location: entry.location || identityBlock.location || "",
      enabled: entry.enabled ?? lifecycleBlock.enabled ?? true,
      lifecycle_status: this.normalizeLifecycle(lifecycle),
      lifecycle_state: this.normalizeLifecycle(lifecycle),
      roles,
      execution_owner: entry.execution_owner || assetBlock.execution_owner || "",
      frontend_allowed: entry.frontend_allowed ?? frontendBlock.visible ?? true,
      detail_enabled: entry.detail_enabled ?? frontendBlock.detail_enabled ?? true,
      group: entry.group || frontendBlock.group || "",
      sort_order: entry.sort_order ?? frontendBlock.sort_order ?? 999,
      trust_status: entry.trust_status || trustBlock.status || "",
      trust_reason: entry.trust_reason || trustBlock.reason || "",
      last_seen: entry.last_seen ?? lifecycleBlock.last_seen ?? "",
      relationship: relationshipBlock,
      assigned_charger: relationshipBlock.assigned_charger ?? "",
      connected_charger: relationshipBlock.connected_charger ?? "",
      effective_charger: relationshipBlock.effective_charger ?? "",
      selected_charger: relationshipBlock.selected_charger ?? "",
      assigned_charger_display_name: relationshipBlock.assigned_charger_display_name ?? "",
      connected_charger_display_name: relationshipBlock.connected_charger_display_name ?? "",
      effective_charger_display_name: relationshipBlock.effective_charger_display_name ?? "",
      raw: entry
    };
  }

  normalizeLifecycle(value) {
    const s = String(value || "Unknown").trim().toLowerCase();
    if (s === "active") return "Active";
    if (["inactive", "not_present", "not present", "none"].includes(s)) return "Inactive";
    if (s === "disabled") return "Disabled";
    if (s === "retired") return "Retired";
    return "Unknown";
  }

  registryEntry(assetId) {
    return this.registryEntryFromList(assetId, this.mobilityRegistry());
  }

  vehicleChargerRelationship(assetId) {
    // R22.12.11.25 / R43.2.53: relationship_index is the sole topology owner.
    // Selected/effective/physical are distinct relationship rows; UX must not
    // infer physical connection from an assigned/effective charger.
    const canonical = this.canonicalAssetId(assetId);
    const rows = this.relationshipRows(canonical).filter((r) => String(r.source_asset_id || r.asset_id || "") === String(canonical));
    const selectedRow = rows.find((r) => String(r.relationship_type || "") === "vehicle_selected_charger") || null;
    const effectiveRow = rows.find((r) => String(r.relationship_type || "") === "vehicle_effective_charger") || null;
    const physicalRow = rows.find((r) => String(r.relationship_type || "") === "vehicle_physical_charger") || null;
    const valueOf = (row) => this.cleanValue(row?.effective_target_asset_id || row?.target_asset_id || "", "none") || "none";
    const selected = valueOf(selectedRow);
    const effective = valueOf(effectiveRow);
    const connected = valueOf(physicalRow);
    const assigned = selected !== "none" ? selected : effective;
    return {
      assigned, effective, selected, connected,
      assigned_display_name: this.assetDisplayName(assigned),
      effective_display_name: this.assetDisplayName(effective),
      connected_display_name: this.assetDisplayName(connected),
      relationship_resolution: physicalRow?.resolution_source || effectiveRow?.resolution_source || selectedRow?.resolution_source || "",
      row: effectiveRow || selectedRow || physicalRow || null,
      physical_row: physicalRow,
      effective_row: effectiveRow,
      selected_row: selectedRow
    };
  }


  releaseContract() {
    const e = this.entity("sensor.mobility_release_contract");
    const attrs = e?.attributes || {};
    const backend = this.cleanValue(
      attrs.backend_release ||
      attrs.backend_version ||
      attrs.backend_release_version ||
      attrs.release_version ||
      attrs.release ||
      attrs.version ||
      attrs.package_version ||
      e?.state ||
      "",
      "Unknown"
    ) || "Unknown";
    return {
      backend_release: backend,
      backend_version: backend,
      contract_version: this.cleanValue(attrs.contract_version || attrs.contract_release || attrs.contract || "", "Unknown") || "Unknown",
      schema_version: this.cleanValue(attrs.schema_version || attrs.schema || "", "Unknown") || "Unknown",
      build_date: this.cleanValue(attrs.build_date || attrs.release_date || attrs.generated_at || "", "Unknown") || "Unknown",
      contract_health: this.cleanValue(attrs.contract_health || attrs.health || attrs.status || "Unknown", "Unknown") || "Unknown",
      runtime_health: this.cleanValue(attrs.runtime_health || attrs.runtime_status || "", "Unknown") || "Unknown",
      physical_acceptance: this.cleanValue(attrs.physical_acceptance || attrs.physical_execution_acceptance || "", "Unknown") || "Unknown",
      release_acceptance: this.cleanValue(attrs.release_acceptance || attrs.acceptance || "", "Unknown") || "Unknown"
    };
  }

  backendVersion() {
    // R22.7.9.21 contract lock: backend/version source is sensor.mobility_release_contract only.
    return this.releaseContract().backend_release;
  }

  contractVersion() {
    return this.releaseContract().contract_version;
  }

  contractHealth() {
    return this.releaseContract().contract_health;
  }

  runtimeSignature(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const parts = [
      JSON.stringify(this.releaseContract()),
      JSON.stringify(this.assetIndexRows("all")),
      JSON.stringify(this.profileRows()),
      JSON.stringify(canonical ? this.propertyRows(canonical) : this.propertyRows("")),
      JSON.stringify(canonical ? this.relationshipRows(canonical) : this.relationshipRows("")),
      JSON.stringify(canonical ? this.commandRegistry(canonical) : this.publicCommandRows()),
      JSON.stringify(canonical ? this.activityRowsFor(canonical) : this.activityRowsFor("")),
      JSON.stringify(canonical ? this.intelligenceRowsFor(canonical) : this.intelligenceRowsFor("")),
      JSON.stringify(canonical ? this.energyAssetPublicationRows(canonical) : this.energyAssetPublicationRows(""))
    ];
    return parts.join("|");
  }

  publicCommandRows() {
    const rows = [];
    const entity = this.entity("sensor.mobility_command_index");
    const attrs = entity?.attributes || {};
    for (const attrName of ["commands", "commands_by_asset", "rows"]) {
      const value = this.parseJsonValue(attrs[attrName], attrs[attrName]);
      rows.push(...this.commandsFromIndexValue(value, ""));
    }
    const seen = new Set();
    return rows.map((r)=>this.normalizeCommandEntry(r, r?.asset_id || "")).filter(Boolean).filter((r)=>{
      const key = `${r.asset_id}:${r.command_key || r.command_id}:${r.command_role || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  publicRelationshipRows() {
    return this.relationshipRows("");
  }

  publicActivityRows() {
    return this.activityRowsFor("");
  }

  publicIntelligenceRows() {
    return this.intelligenceRowsFor("");
  }

  energyAssetPublicationRows(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const attrs = this.entity("sensor.mobility_energy_asset_publication")?.attributes || {};
    const rows = [];
    const collect = (value) => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) rows.push(...parsed);
      else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.rows)) rows.push(...parsed.rows);
        if (Array.isArray(parsed.assets)) rows.push(...parsed.assets);
        if (Array.isArray(parsed.publications)) rows.push(...parsed.publications);
        for (const [key, val] of Object.entries(parsed)) {
          if (["rows","assets","publications"].includes(key)) continue;
          if (Array.isArray(val)) rows.push(...val.map((r)=>({ asset_id:r?.asset_id || key, ...r })));
          else if (val && typeof val === "object") rows.push({ asset_id:val.asset_id || key, ...val });
        }
      }
    };
    for (const attrName of ["rows", "assets", "publications", "energy_assets", "published_assets"]) collect(attrs[attrName]);
    return rows.filter((r)=>!canonical || String(r.asset_id || r.source_asset_id || "") === canonical);
  }

  contractCoverageReport() {
    const assets = this.assetIndexRows("all");
    const vehicleProfiles = this.canonicalRowsFromAttrs("sensor.mobility_vehicle_profile_index", ["profiles", "profile_index", "rows"], "coverage_vehicle_profiles");
    const chargerProfiles = this.canonicalRowsFromAttrs("sensor.mobility_charger_profile_index", ["profiles", "profile_index", "rows"], "coverage_charger_profiles");
    const allProperties = this.propertyRows("").filter((p)=>String(p.access || "").toLowerCase() !== "internal");
    const vehicleProperties = allProperties.filter((p)=>String(p.asset_type || "").toLowerCase() === "vehicle");
    const chargerProperties = allProperties.filter((p)=>String(p.asset_type || "").toLowerCase() === "charger");
    const personProperties = allProperties.filter((p)=>String(p.asset_type || "").toLowerCase() === "person");
    const relationships = this.publicRelationshipRows();
    const commands = this.publicCommandRows();
    const intelligence = this.publicIntelligenceRows();
    const activities = this.publicActivityRows();
    const energyPublications = this.energyAssetPublicationRows("");
    const visibleCommands = commands.filter((c)=>this.contractBool(c.frontend_allowed, true) === true && !this.isConfigurationCommand(c));
    return {
      release: { ux_version: UX_VERSION, backend_version: this.backendVersion(), contract_version: this.contractVersion(), contract_health: this.contractHealth(), runtime_health: this.runtimeHealthSummary().status },
      health_gates: { published: this.runtimeHealthGateRows().length, consumed: this.runtimeHealthGateRows().length, bad: this.runtimeHealthSummary().bad_count, blocking: this.runtimeHealthSummary().blocking_count },
      assets: { published: assets.length, consumed: assets.length, rendered_or_categorized: assets.length, missing: 0 },
      profiles: { vehicle_published: vehicleProfiles.length, vehicle_consumed: vehicleProfiles.length, charger_published: chargerProfiles.length, charger_consumed: chargerProfiles.length, missing: 0 },
      properties: {
        published: allProperties.length, consumed: allProperties.length, primary_rendered: 0, detail_rendered: 0, engineering_overflow: allProperties.length, missing: 0,
        vehicle_published: vehicleProperties.length, vehicle_consumed: vehicleProperties.length,
        charger_published: chargerProperties.length, charger_consumed: chargerProperties.length,
        person_published: personProperties.length, person_consumed: personProperties.length
      },
      relationships: { published: relationships.length, consumed: relationships.length, missing: 0 },
      commands: {
        published: commands.length, consumed: commands.length, missing: 0,
        hidden_frontend_false: commands.filter((c)=>this.contractBool(c.frontend_allowed, true) === false).length,
        visible_disabled: visibleCommands.filter((c)=>this.contractBool(c.execution_allowed, false) === false).length,
        visible_enabled: visibleCommands.filter((c)=>this.contractBool(c.execution_allowed, false) === true).length
      },
      intelligence: { published: intelligence.length, consumed: intelligence.length, missing: 0 },
      activity: { published: activities.length, consumed: activities.length, missing: 0 },
      energy_publication: { published: energyPublications.length, consumed: energyPublications.length, missing: 0 },
      vehicle_components: {
        component_contract_available: this.vehicleComponentContractAvailable(),
        published: this.vehicleComponentContractRows().length,
        consumed: this.vehicleComponentRows().length,
        property_index_entities_consumed: this.vehicleComponentPropertyIndexEntities().length,
        detail_source: this.vehicleComponentContractAvailable() ? "component_property_indexes" : "component_contract_unavailable",
        missing: 0
      },
      charger_components: {
        component_contract_available: this.chargerComponentContractAvailable(),
        published: this.chargerComponentContractRows().length,
        consumed: this.chargerComponentRows().length,
        property_index_entities_consumed: this.chargerComponentPropertyIndexEntities().length,
        detail_source: this.chargerComponentContractAvailable() ? "component_contract" : "component_contract_unavailable",
        missing: 0
      }
    };
  }

  canonicalAssetId(assetId) {
    const id = String(assetId || "");
    if (id.startsWith("vehicle_") || id.startsWith("charger_")) return id;
    const reg = this.mobilityRegistry().find((a) =>
      a.asset_id === id ||
      a.asset_id === `vehicle_${id}` ||
      a.asset_id === `charger_${id}` ||
      a.asset_id.replace(/^vehicle_/, "") === id ||
      a.asset_id.replace(/^charger_/, "") === id
    );
    return reg?.asset_id || id;
  }

  uiId(assetId) {
    return String(assetId || "").replace(/^vehicle_/, "").replace(/^charger_/, "");
  }


  assetHasRole(entry, role) {
    return (entry?.roles || []).map((r) => String(r).toLowerCase()).includes(String(role).toLowerCase());
  }

  /**
   * Product classification helper used by the factory, asset viewer and detail card.
   * The backend contract should ideally provide roles, but during contract cleanup the
   * frontend accepts asset_id prefixes and common asset_type/profile words as safe fallbacks.
   */
  isVehicleAsset(entry) {
    const text = [entry?.asset_id, entry?.asset_type, entry?.profile, entry?.group, ...(entry?.roles || [])]
      .filter(Boolean).join(" ").toLowerCase();
    return this.assetHasRole(entry, "vehicle") || text.includes("vehicle") || text.startsWith("vehicle_");
  }

  isChargerAsset(entry) {
    const text = [entry?.asset_id, entry?.asset_type, entry?.profile, entry?.group, ...(entry?.roles || [])]
      .filter(Boolean).join(" ").toLowerCase();
    return this.assetHasRole(entry, "charger") || text.includes("charger") ||
      text.includes("evse") || text.includes("chargepoint") || text.includes("charging point") ||
      text.startsWith("charger_");
  }

  detailRoute(entry) {
    // R21.4: Registry does not own Lovelace routes. UX route factory owns navigation.
    return entry ? this.assetDetailRoute(entry) : "";
  }

  assetDetailRoute(entryOrAssetId) {
    const assetId = typeof entryOrAssetId === "string" ? entryOrAssetId : entryOrAssetId?.asset_id;
    if (!assetId) return "";
    const dashboardPath = this.config.dashboard_path || "/mobility-supervisor/dashboard";
    const base = String(dashboardPath).replace(/\/?dashboard\/?$/, "").replace(/\/$/, "") || "/mobility-supervisor";
    return `${base}/asset-detail?asset=${encodeURIComponent(assetId)}#asset=${encodeURIComponent(assetId)}`;
  }

  /**
   * Canonical R21.8 command registry lookup.
   *
   * The frontend deliberately does not read the old
   * legacy mobility_asset command registry pattern anymore. If the
   * new registry is missing, actions disappear and the maintenance/contract
   * views expose that as a backend contract issue.
   */
  commandRegistry(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    const cacheKey = `commandRegistry:${canonical}`;
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const rows = this.uiCommandSurface(canonical)
      .filter((c) => c && this.contractBool(c.frontend_allowed, true) === true)
      .sort((a, b) => (Number(a.sort_order ?? 999) - Number(b.sort_order ?? 999)) || String(a.label).localeCompare(String(b.label)));
    this._memo.set(cacheKey, rows);
    return rows;
  }


  uiCommandSurface(assetId = "") {
    const entityIds = ["sensor.mobility_command_index"];
    for (const entityId of entityIds) {
      const entity = this.entity(entityId);
      if (!entity) continue;
      const attrs = entity.attributes || {};
      // R43.2.54: same authority, multiple transport serializations. Do not stop at
      // the first partially populated attribute; union exact command-index rows and
      // deduplicate by command_id so Restart/Identify/Unlock cannot disappear simply
      // because START/STOP were present in an earlier serialization.
      const commandAttrs = ["commands", "commands_json", "commands_by_asset", "commands_by_asset_json", "commands_by_id", "commands_by_id_json"];
      const collected = [];
      for (const attrName of commandAttrs) {
        const raw = attrs[attrName];
        let value = this.parseJsonValue(raw, null);
        if (!value && raw && typeof raw === "object") value = raw;
        collected.push(...this.commandsFromIndexValue(value, assetId));
      }
      const seen = new Set();
      const normalized = collected
        .map((entry) => this.normalizeCommandEntry(entry, entry?.asset_id || assetId))
        .filter(Boolean)
        .filter((entry) => {
          const key = String(entry.command_id || entry.command_key || "");
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .sort((a, b) => (Number(a.sort_order ?? 999) - Number(b.sort_order ?? 999)) || String(a.label).localeCompare(String(b.label)));
      if (normalized.length) return normalized;
    }
    return [];
  }

  commandsFromIndexValue(value, assetId = "") {
    if (!value) return [];
    if (Array.isArray(value)) {
      if (value.some((x) => typeof x === "object" && (x?.command_id || x?.command_key))) return value.filter((entry) => !assetId || String(entry?.asset_id || "") === String(assetId));
      // index of command registry entity ids or rows
      const registries = value.map((x) => typeof x === "string" ? x : (x.registry || x.entity_id || x.command_registry || x.command_registry_entity || "")).filter(Boolean);
      return registries.flatMap((entityId) => this.commandsFromRegistryEntity(entityId, assetId));
    }
    if (typeof value === "object") {
      if (Array.isArray(value.commands)) return this.commandsFromIndexValue(value.commands, assetId);
      if (assetId && value[assetId]) return this.commandsFromIndexValue(value[assetId], assetId);
      const rows = Object.entries(value).flatMap(([key, row]) => {
        const keyAsset = String(key || "").includes(":") ? String(key).split(":")[0] : String(key || "");
        if (Array.isArray(row)) return row.map((c) => ({ asset_id: c.asset_id || keyAsset, ...c }));
        if (typeof row === "string") return this.commandsFromRegistryEntity(row, assetId || keyAsset);
        if (row?.commands) return this.commandsFromIndexValue(row.commands, assetId || keyAsset).map((c) => ({ asset_id: c.asset_id || keyAsset, ...c }));
        if (row?.command_id || row?.command_key) return [{ asset_id: row.asset_id || keyAsset, ...row }];
        return [];
      });
      return rows.filter((entry) => !assetId || String(entry?.asset_id || "") === String(assetId));
    }
    return [];
  }

  commandsFromRegistryEntity(entityId, assetId = "") {
    // Strict contract mode: per-asset command registries are not consumed by UX.
    return [];
  }


  /** Normalize the backend command contract into the UI action model. */
  normalizeCommandEntry(entry, assetId = "") {
    if (!entry || typeof entry !== "object") return null;
    const rawCommandKey = String(entry.command_key || entry.key || entry.command_id || entry.command || entry.id || entry.name || "").trim();
    const command_id = entry.command_id || (rawCommandKey.includes(".") ? rawCommandKey.split(".").pop() : rawCommandKey) || entry.command || entry.id || entry.name;
    if (!command_id && !rawCommandKey) return null;
    const parameter_schema = this.parseJsonValue(entry.parameter_schema, {});
    const currentSchema = parameter_schema?.current_a || {};
    const frontendAllowed = this.contractBool(entry.frontend_allowed, true);
    const intent = entry.intent_entity || entry.action_entity || entry.button_entity || entry.entity_id || entry.intent || "";
    const invoke = this.parseJsonValue(entry.invoke, entry.invoke || {});
    const invokeObject = invoke && typeof invoke === "object" && !Array.isArray(invoke) ? invoke : {};
    const invokeService = String(invokeObject.service || "").trim();
    const serviceParts = invokeService.includes(".") ? invokeService.split(".") : [];
    const invokeDomain = serviceParts.length > 1 ? serviceParts.shift() : "";
    const invokeAction = serviceParts.length ? serviceParts.join(".") : "";
    return {
      schema_version: entry.schema_version || 1,
      asset_id: entry.asset_id || assetId || "",
      command_id,
      label: entry.label || entry.display_name || this.titleize(command_id || rawCommandKey),
      category: entry.category || "secondary",
      command_key: entry.command_key || rawCommandKey || "",
      command_family: entry.command_family || entry.family || "",
      command_group: entry.command_group || entry.group || "",
      command_role: entry.command_role || entry.role || "",
      current_state_property: entry.current_state_property || "",
      opposite_command_key: entry.opposite_command_key || "",
      frontend_allowed: frontendAllowed,
      execution_allowed: this.contractBool(entry.execution_allowed, true),
      exists: this.contractBool(entry.exists, true),
      enabled: this.contractBool(entry.enabled, true),
      intent_entity: intent,
      intent_candidates: intent ? [intent] : [],
      capability_entity: entry.capability_entity || "",
      disabled_reason_entity: entry.disabled_reason_entity || "",
      execution_status: entry.execution_status || entry.ui_state || entry.effective_availability || "",
      execution_status_entity: entry.execution_status_entity || "",
      execution_reason: entry.blocked_reason || entry.execution_reason || entry.disabled_reason || "",
      execution_reason_entity: entry.execution_reason_entity || "",
      source_entity_id: entry.source_entity_id || "",
      service_domain: invokeDomain || entry.service_domain || entry.domain || "",
      service_action: invokeAction || entry.service_action || entry.service || entry.action || "",
      service_data: this.parseJsonValue(invokeObject.data, this.parseJsonValue(entry.service_data, entry.service_data || {})),
      service_target: this.parseJsonValue(invokeObject.target, entry.service_target || entry.target || {}),
      invoke: invokeObject,
      confirmation_status_entity: entry.confirmation_status_entity || "",
      confirmation_reason_entity: entry.confirmation_reason_entity || "",
      value_entity: entry.value_entity || "",
      current_value_entity: entry.current_value_entity || entry.current_entity || "",
      parameter_schema,
      primary_action: this.contractBool(entry.primary_action, false),
      confirmation_required: this.contractBool(entry.confirmation_required, false),
      physical_executor_asset_id: entry.physical_executor_asset_id || "",
      min: entry.min ?? entry.minimum ?? currentSchema.min ?? null,
      max: entry.max ?? entry.maximum ?? currentSchema.max ?? null,
      step: entry.step ?? currentSchema.step ?? null,
      unit: entry.unit || entry.unit_of_measurement || currentSchema.unit || "",
      supported: this.contractBool(entry.supported ?? currentSchema.supported, true),
      capability: entry.capability ?? entry.can_execute ?? entry.available ?? null,
      sort_order: entry.sort_order ?? 999,
      disabled_reason: entry.disabled_reason || "",
      raw: entry
    };
  }

  commandExists(assetId, commandId) {
    const registry = this.commandRegistry(assetId);
    if (!registry.length) return null;
    return registry.some((c) => {
      const wanted = this.norm(commandId);
      const parts = [c.command_id, c.command_key, c.command_group, c.command_role].filter(Boolean).map((v)=>this.norm(v));
      return c.exists !== false && (parts.includes(wanted) || parts.some((p)=>p.endsWith(wanted)));
    });
  }


  // R22.10.3 shared Mobility runtime contract access layer.
  // All Mobility screens must use these methods instead of view-specific index parsing.
  vehicles() {
    return this.indexedAssets("vehicle").filter((a) => a.frontend_allowed !== false && a.lifecycle_state !== "Retired");
  }

  chargers() {
    return this.indexedAssets("charger").filter((a) => a.frontend_allowed !== false && a.lifecycle_state !== "Retired");
  }

  assetById(assetId, kind = "all") {
    const canonical = this.canonicalAssetId(assetId);
    const pool = kind === "vehicle" ? this.vehicles() : kind === "charger" ? this.chargers() : [...this.vehicles(), ...this.chargers(), ...this.indexedAssets("all")];
    return pool.find((a) => String(a.asset_id || "") === String(canonical)) || null;
  }

  vehicleById(assetId) { return this.assetById(assetId, "vehicle"); }
  chargerById(assetId) { return this.assetById(assetId, "charger"); }

  canonicalRows(entityId, attrName, cacheKey = "") {
    const key = `canonicalRows:${cacheKey || entityId}:${attrName}`;
    if (this._memo.has(key)) return this._memo.get(key);
    const entity = this.entity(entityId);
    const attrs = entity?.attributes || {};
    let raw = attrs[attrName];
    let value = this.parseJsonValue(raw, null);
    if (!value && typeof raw === "object") value = raw;
    const rows = Array.isArray(value) ? value : (value && typeof value === "object" ? Object.values(value) : []);
    this._memo.set(key, rows.filter((r) => r && typeof r === "object"));
    return this._memo.get(key);
  }

  canonicalRowsFromAttrs(entityId, attrNames = [], cacheKey = "") {
    const key = `canonicalRowsFromAttrs:${cacheKey || entityId}:${attrNames.join("|")}`;
    if (this._memo.has(key)) return this._memo.get(key);
    const entity = this.entity(entityId);
    const attrs = entity?.attributes || {};
    const rows = [];
    for (const attrName of attrNames) {
      const raw = attrs[attrName];
      let value = this.parseJsonValue(raw, null);
      if (!value && raw && typeof raw === "object") value = raw;
      if (Array.isArray(value)) rows.push(...value);
      else if (value && typeof value === "object") rows.push(...Object.values(value));
    }
    const normalized = rows.filter((r) => r && typeof r === "object");
    this._memo.set(key, normalized);
    return normalized;
  }

  normalizedPropertyCatalog(assetType = "") {
    const rows = Array.isArray(globalThis.HI_MOBILITY_NORMALIZED_PROPERTY_CATALOG)
      ? globalThis.HI_MOBILITY_NORMALIZED_PROPERTY_CATALOG
      : (typeof HI_MOBILITY_NORMALIZED_PROPERTY_CATALOG !== "undefined" ? HI_MOBILITY_NORMALIZED_PROPERTY_CATALOG : []);
    const t = String(assetType || "").trim().toLowerCase();
    return rows.filter((r) => r && (!t || String(r.asset_type || "").toLowerCase() === t));
  }

  commandStandardCatalog(assetType = "") {
    const rows = Array.isArray(globalThis.HI_MOBILITY_COMMAND_STANDARD)
      ? globalThis.HI_MOBILITY_COMMAND_STANDARD
      : (typeof HI_MOBILITY_COMMAND_STANDARD !== "undefined" ? HI_MOBILITY_COMMAND_STANDARD : []);
    const t = String(assetType || "").trim().toLowerCase();
    return rows.filter((r) => r && (!t || String(r.asset_type || "").toLowerCase() === t));
  }

  propertyKeyCandidates(assetId = "", field = "") {
    const canonical = this.canonicalAssetId(assetId || "");
    const assetType = canonical.startsWith("vehicle_") ? "vehicle" : canonical.startsWith("charger_") ? "charger" : canonical.startsWith("person_") ? "person" : "";
    const raw = String(field || "").trim();
    const stripped = raw.replace(/^(vehicle|charger|person|asset)\./, "");
    const candidates = [];
    const add = (v) => {
      const x = String(v ?? "").trim();
      if (x && !candidates.includes(x)) candidates.push(x);
    };
    add(raw);
    add(stripped);
    if (assetType) {
      add(`${assetType}.${raw}`);
      add(`${assetType}.${stripped}`);
    }
    if (!raw.startsWith("asset.")) add(`asset.${stripped}`);

    const legacyAliases = {
      soc: ["soc_pct", "battery_pct", "battery", "state_of_charge", "battery_percent"],
      battery: ["soc_pct", "battery_pct", "state_of_charge"],
      battery_pct: ["soc_pct"],
      soc_pct: ["battery", "state_of_charge"],
      range_km: ["ev_range_km", "range_ev_km", "full_range_km", "range_total_km", "total_range_km"],
      ev_range: ["ev_range_km", "electric_range_km", "secondary_engine_range"],
      electric_range_km: ["ev_range_km"],
      total_range_km: ["range_total_km", "full_range_km", "total_range_km", "range_km", "hybrid_range_km", "primary_engine_range", "vehicle.range_total_km"],
      full_range: ["range_total_km", "full_range_km", "total_range_km"],
      full_range_km: ["range_total_km", "full_range_km", "total_range_km", "range_km", "hybrid_range_km"],
      selected_charger: ["vehicle.assigned_charger_id", "vehicle.selected_charger"],
      assigned_charger_id: ["vehicle.assigned_charger_id", "vehicle.selected_charger"],
      assigned_charger: ["vehicle.assigned_charger_id", "vehicle.assigned_charger", "vehicle.selected_charger"],
      effective_charger: ["vehicle.effective_charger_id", "vehicle.effective_charger"],
      effective_charger_id: ["vehicle.effective_charger_id", "vehicle.effective_charger"],
      connected_charger: ["vehicle.connected_charger_id", "vehicle.connected_charger"],
      connected_charger_id: ["vehicle.connected_charger_id", "vehicle.connected_charger"],
      preferred_charger_id: ["vehicle.preferred_charger_id", "vehicle.assigned_charger_id", "vehicle.selected_charger"],
      charging_power: ["charging_power_kw", "charge_power", "power_kw", "current_power_kw", "import_power_kw"],
      charge_power: ["charging_power_kw"],
      import_power_kw: ["charging_power_kw", "power_kw", "current_power_kw"],
      net_power_kw: ["charging_power_kw", "power_kw", "current_power_kw"],
      actual_power_kw: ["charging_power_kw", "power_kw", "current_power_kw"],
      current_power_kw: ["power_kw", "charging_power_kw"],
      charger_state: ["operating_state", "charger.operating_state"],
      operational_status: ["operating_state", "charger.operating_state"],
      connection_state: ["connection_state", "connected_state", "vehicle_connection_state", "ev_connection_state", "plug_state", "connector_state"],
      connected_vehicle_id: ["connected_vehicle_id", "connected_vehicle", "effective_vehicle_id", "effective_vehicle", "selected_vehicle"],
      effective_vehicle_id: ["effective_vehicle_id", "effective_vehicle", "connected_vehicle_id", "connected_vehicle", "selected_vehicle"],
      selected_vehicle: ["selected_vehicle", "effective_vehicle", "connected_vehicle"],
      session_state: ["status", "charging_state"],
      runtime_activity: ["status", "charging_state", "last_seen"],
      actual_current_a: ["current_a", "current_limit_a"],
      current_limit: ["current_limit_a", "requested_current_a", "requested_current_limit", "requested_power_kw"],
      current_limit_amps: ["current_limit_a"],
      requested_current_limit: ["requested_current_a", "current_limit_a"],
      requested_power: ["requested_power_kw"],
      requested_power_kw: ["requested_power_kw", "vehicle.requested_power_kw", "vehicle.requested_charge_power_kw", "vehicle.charge_power_kw", "vehicle.mobility_charge_power_kw", "current_limit_a"],
      requested_charge_power_kw: ["vehicle.requested_charge_power_kw", "requested_charge_power_kw", "vehicle.requested_power_kw", "requested_power_kw", "vehicle.charge_power_kw", "vehicle.mobility_charge_power_kw"],
      vehicle_charge_power_kw: ["vehicle.requested_charge_power_kw", "vehicle.requested_power_kw", "vehicle.charge_power_kw", "vehicle.mobility_charge_power_kw", "requested_power_kw"],
      vehicle_charge_power: ["vehicle.requested_charge_power_kw", "vehicle.requested_power_kw", "vehicle.charge_power_kw", "vehicle.mobility_charge_power_kw", "requested_power_kw"],
      active_phases: ["effective_phase_count", "phase_count", "phases"],
      effective_phases: ["effective_phase_count", "phase_count", "phases"],
      phases: ["effective_phase_count", "phase_count"],
      phase_count: ["effective_phase_count", "phase_count", "phases"],
      min_power_kw: ["effective_min_power_kw"],
      max_power_kw: ["effective_max_power_kw"],
      min_current_a: ["charger.min_current_a", "min_current_a", "effective_min_current_a"],
      max_current_a: ["charger.max_current_a", "max_current_a", "effective_max_current_a"],
      effective_min_current_a: ["charger.min_current_a", "min_current_a", "effective_min_current_a", "current_limit_a"],
      effective_max_current_a: ["charger.max_current_a", "max_current_a", "effective_max_current_a", "current_limit_a"],
      physical_min_power_kw: ["charger.physical_min_power_kw", "physical_min_power_kw", "effective_min_power_kw", "min_power_kw"],
      physical_max_power_kw: ["charger.physical_max_power_kw", "physical_max_power_kw", "effective_max_power_kw", "max_power_kw"],
      power_source: ["status"],
      data_freshness: ["last_seen", "health"],
      vehicle_health: ["health"],
      charger_health: ["health", "charger.health"],
      data_quality: ["health"],
      make_model: ["model", "vehicle.model", "charger.model"],
      manufacturer: ["vendor", "make"],
      vendor: ["manufacturer"],
      owner: ["owner_label"],
      present: ["person.present", "asset.present", "vehicle.present"],
      ready_by: ["vehicle.ready_by"],
      target_soc: ["target_soc_pct"],
      target_soc_pct: ["vehicle.target_soc_pct", "default_target_soc_pct"],
      climate: ["climate_state"],
      climate_status: ["climate_state"],
      security: ["lock_state"],
      lock: ["lock_state"],
      door: ["door_state"],
      doors: ["door_state"],
      windows: ["window_state"],
      trunk: ["trunk_state"],
      hood: ["hood_state"],
      roof: ["roof_state"],
      odometer: ["odometer_km"],
      mileage: ["odometer_km"],
      service_due: ["service_due_days", "service_due_distance_km"],
      oil_change: ["oil_change_due_days", "oil_change_due_distance_km"],
      voltage: ["voltage_v", "phase_voltage_l1_v"],
      current: ["current_a"],
      power: ["power_kw"],
      session_energy: ["session_energy_kwh"],
      lifetime_energy: ["lifetime_energy_kwh"]
    };
    for (const alias of (legacyAliases[raw] || legacyAliases[stripped] || [])) add(alias);

    // Latest foundation matrix: accept any normalized property as direct key and bridge
    // plain keys to their normalized form. This makes every published property readable
    // one way or another without raw/entity fallback.
    const catalog = this.normalizedPropertyCatalog(assetType);
    for (const row of catalog) {
      const key = String(row.property_key || "");
      const plain = String(row.plain_key || key.replace(/^(vehicle|charger|person|asset)\./, ""));
      if (raw === key || stripped === key || raw === plain || stripped === plain || raw.endsWith(`.${plain}`)) {
        add(key); add(plain);
      }
    }

    const expanded = [];
    for (const item of candidates) {
      add(item);
      expanded.push(item);
      const plain = String(item).replace(/^(vehicle|charger|person|asset)\./, "");
      expanded.push(plain);
      if (assetType) expanded.push(`${assetType}.${plain}`);
      if (!String(item).startsWith("asset.")) expanded.push(`asset.${plain}`);
    }
    for (const item of expanded) add(item);
    if (canonical.startsWith("charger_") && stripped === "charging_state") { add("operating_state"); add("charger.operating_state"); }
    return candidates;
  }


  canonicalFamilies() {
    return ["overview","vehicle","charging","battery","range","climate","security","openings","maintenance","tires","location","energy","metering","diagnostics"];
  }

  familyConfig(family = "overview") {
    const f = String(family || "overview").toLowerCase();
    const map = {
      overview: { title:"Overview", icon:"mdi:view-dashboard-outline", order:0 },
      vehicle: { title:"Vehicle", icon:"mdi:car-info", order:10 },
      charging: { title:"Charging", icon:"mdi:battery-charging", order:20 },
      battery: { title:"Battery", icon:"mdi:battery", order:30 },
      range: { title:"Range", icon:"mdi:map-marker-distance", order:40 },
      climate: { title:"Climate", icon:"mdi:fan", order:50 },
      security: { title:"Security", icon:"mdi:shield-check-outline", order:60 },
      openings: { title:"Openings", icon:"mdi:car-door", order:70 },
      maintenance: { title:"Maintenance", icon:"mdi:wrench-clock", order:80 },
      tires: { title:"Tires", icon:"mdi:car-tire-alert", order:90 },
      location: { title:"Location", icon:"mdi:map-marker", order:100 },
      energy: { title:"Energy", icon:"mdi:flash", order:110 },
      metering: { title:"Metering", icon:"mdi:counter", order:120 },
      diagnostics: { title:"Diagnostics", icon:"mdi:tools", order:900 }
    };
    return map[f] || { title:this.titleize(f), icon:"mdi:folder-outline", order:500 };
  }

  normalizedFamilyName(value = "") {
    const f = String(value || "").trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    if (!f) return "";
    const aliases = { comfort:"climate", access:"security", locks:"security", doors:"openings", windows:"openings", electrical:"charging", configuration:"overview", config:"overview", identity:"overview", trust:"diagnostics", health:"diagnostics" };
    return aliases[f] || f;
  }

  fallbackFamilyForPropertyKey(propertyKey = "", assetType = "") {
    const k = String(propertyKey || "").toLowerCase();
    const plain = k.replace(/^(vehicle|charger|person|asset|mobility|fleet|connections|owners)\./, "");
    if (!plain) return "overview";
    // R22.11.17 intelligence alignment: R39 introduces domain/subdomain intelligence
    // prefixes. These are only consumed when they are published through approved
    // runtime property indexes; the UX must not query new intelligence registries.
    if (k.startsWith("mobility.")) return plain.includes("diagnostic") || plain.includes("trust") ? "diagnostics" : "overview";
    if (k.startsWith("fleet.")) return plain.includes("location") ? "location" : plain.includes("energy") ? "energy" : "vehicle";
    if (k.startsWith("connections.")) return plain.includes("meter") || plain.includes("energy") || plain.includes("cost") ? "metering" : "charging";
    if (k.startsWith("owners.")) return plain.includes("present") || plain.includes("location") ? "location" : "vehicle";
    if (k.startsWith("asset.")) return "overview";
    if (plain.includes("diagnostic") || plain.includes("source_") || plain.includes("api_quota") || plain.includes("latency") || plain.includes("reconnect")) return "diagnostics";
    if (plain.includes("tire") || plain.includes("tyre")) return "tires";
    if (plain.includes("location") || plain.includes("position") || plain.includes("park_time")) return "location";
    if (plain.includes("climate") || plain.includes("cabin") || plain.includes("temperature") || plain.includes("precondition")) return "climate";
    if (plain.includes("lock") || plain.includes("security") || plain.includes("alarm")) return "security";
    if (plain.includes("door") || plain.includes("window") || plain.includes("hood") || plain.includes("trunk") || plain.includes("tailgate") || plain.includes("roof") || plain.includes("opening")) return "openings";
    if (plain.includes("service") || plain.includes("oil") || plain.includes("odometer") || plain.includes("mileage") || plain.includes("last_seen") || plain.includes("firmware") || plain.includes("serial")) return "maintenance";
    if (plain.includes("range") || plain.includes("fuel_range") || plain.includes("nominal_range")) return "range";
    if (plain.includes("soc") || plain.includes("battery")) return "battery";
    if (plain.includes("session_energy") || plain.includes("lifetime_energy") || plain.includes("grid_energy") || plain.includes("solar_energy") || plain.includes("meter") || plain.includes("cost")) return "metering";
    if (plain.includes("energy")) return "energy";
    if (plain.includes("charge") || plain.includes("charging") || plain.includes("plug") || plain.includes("ready_by") || plain.includes("target_soc") || plain.includes("current_limit") || plain.includes("requested_power") || plain.includes("power_kw") || plain.includes("current_a") || plain.includes("voltage") || plain.includes("phase") || plain.includes("status")) return "charging";
    if (assetType === "vehicle") return "vehicle";
    return "overview";
  }

  propertyFamilyContractValue(row = {}) {
    return this.normalizedFamilyName(row.family || row.property_family || row.ux_family || "");
  }

  propertyPresentationFamilyOverride(row = {}, explicit = "") {
    const assetType = String(row.asset_type || "").toLowerCase();
    const k = String(row.property_key || "").toLowerCase();
    const e = String(explicit || "").toLowerCase();

    // Runtime R40.7 observed: charger asset identity rows can be published with
    // family=vehicle. UX must remain readable while reporting the backend gap.
    if (assetType === "charger" && e === "vehicle" && k.startsWith("asset.")) return "overview";
    if (assetType === "person" && (e === "vehicle" || e === "charger") && k.startsWith("asset.")) return "overview";

    // Charger electrical and configuration settings belong to the charging
    // presentation family even when the backend temporarily publishes family=charger.
    if (assetType === "charger" && e === "charger") {
      if (/(current|voltage|power|phase|energy|meter|requested_power|current_limit|status|charging_policy|offered|export|import|session|lifetime)/.test(k)) return "charging";
      if (/(error|warning|latency|reconnect|uptime|firmware|last_seen|config_response)/.test(k)) return "maintenance";
    }
    return "";
  }

  propertyFamily(row = {}) {
    const explicit = this.propertyFamilyContractValue(row);
    const valid = this.canonicalFamilies();
    const override = this.propertyPresentationFamilyOverride(row, explicit);
    if (override) return override;
    if (explicit && valid.includes(explicit)) return explicit;
    return this.fallbackFamilyForPropertyKey(row.property_key || row.normalized_property || row.fact_type || "", row.asset_type || "");
  }

  propertyGroup(row = {}) {
    const explicitRaw = String(row.group || row.property_group || row.ux_group || "").trim();
    if (explicitRaw) {
      const explicit = explicitRaw.toLowerCase() === "main_info" ? "overview" : explicitRaw;
      return explicit;
    }
    const k = String(row.property_key || "").toLowerCase();
    if (k.startsWith("mobility.")) return "domain_intelligence";
    if (k.startsWith("fleet.")) return "fleet_intelligence";
    if (k.startsWith("connections.")) return "connection_intelligence";
    if (k.startsWith("owners.")) return "owner_intelligence";
    if (k.includes("lock")) return "locks";
    if (k.includes("door")) return "doors";
    if (k.includes("window")) return "windows";
    if (k.includes("climate")) return "cabin_climate";
    if (k.includes("soc") || k.includes("battery")) return "battery_state";
    if (k.includes("range")) return "range";
    if (k.includes("session") || k.includes("lifetime") || k.includes("meter")) return "metering";
    if (k.includes("current_limit") || k.includes("requested_power")) return "charge_settings";
    if (k.includes("status") || k.includes("charge") || k.includes("plug")) return "charging_state";
    return "general";
  }

  propertyParent(row = {}) {
    return String(row.parent || row.parent_property || row.parent_key || row.summary_parent || this.propertyGroup(row) || "general").trim();
  }

  propertyDetailLevel(row = {}) {
    const explicit = String(row.detail_level || row.visibility_level || row.ux_detail_level || "").trim().toLowerCase();
    if (["summary","operational","technical"].includes(explicit)) return explicit;
    const f = this.propertyFamily(row);
    const k = String(row.property_key || "").toLowerCase();
    if (f === "diagnostics" || k.includes("source_") || k.includes("diagnostic")) return "technical";
    if (["asset.display_name","asset.short_name","vehicle.soc_pct","vehicle.ev_range_km","vehicle.full_range_km","vehicle.lock_state","vehicle.climate_state","vehicle.charge_state","vehicle.charging_state","charger.operating_state","charger.connection_state","charger.power_kw"].includes(k)) return "summary";
    return "operational";
  }

  propertyDisplayLabel(row = {}) {
    const key = String(row.property_key || row.fact_type || "");
    const labels = {
      "vehicle.preferred_charger_id":"Preferred charger",
      "vehicle.connected_charger_id":"Connected charger",
      "vehicle.effective_charger_id":"Active charger",
      "vehicle.assigned_charger_id":"Preferred charger",
      "vehicle.selected_charger":"Preferred charger",
      "vehicle.effective_charger":"Active charger",
      "vehicle.connected_charger":"Connected charger",
      "vehicle.nominal_range_km":"Nominal range",
      "vehicle.max_ac_power_kw":"Max AC power",
      "vehicle.effective_max_charge_power_kw":"Effective max charge power",
      "vehicle.effective_phase_count":"Effective phases",
      "vehicle.phase_capability":"Phase capability",
      "charger.max_ac_power_kw":"Max AC power",
      "charger.physical_min_power_kw":"Physical min power",
      "charger.physical_max_power_kw":"Physical max power",
      "charger.phase_capability":"Phase capability",
      "charger.energy_kwh":"Energy",
      "vehicle.charge_mode":"Charge mode",
      "vehicle.billing_account_id":"Billing account",
      "charger.billing_account_id":"Billing account",
      "vehicle.requested_charge_power_kw":"Vehicle charge power",
      "requested_charge_power_kw":"Vehicle charge power",
      "requested_power_kw":"Vehicle charge power",
      "charge_power_kw":"Vehicle charge power",
      "vehicle.requested_power_kw":"Vehicle charge power",
      "vehicle.charge_power_kw":"Vehicle charge power",
      "vehicle.mobility_charge_power_kw":"Vehicle charge power",
      "charger.requested_power_kw":"Requested power",
      "charger.current_limit_a":"Current limit",
      "charger.connection_state":"Connection",
      "charger.connected_vehicle_id":"Connected vehicle",
      "charger.effective_vehicle_id":"Active vehicle",
      "charger.selected_vehicle":"Connected vehicle",
      "charger.effective_vehicle":"Active vehicle",
      "charger.connected_vehicle":"Connected vehicle",
      "charger.operating_state":"Operating state",
      "charger.status":"Source status",
      "lifecycle_status":"Lifecycle",
      "asset.lifecycle_status":"Lifecycle",
      "vehicle.lifecycle_status":"Lifecycle",
      "charger.lifecycle_status":"Lifecycle"
    };
    if (labels[key]) return labels[key];
    const explicit = String(row.display_name || row.label || row.name || "").trim();
    if (explicit && explicit !== key) return explicit;
    const labelKey = key.replace(/^(vehicle|charger|person|asset)\./, "");
    return this.titleize(labelKey.replace(/_/g, " "));
  }

  valueWithoutUnit(value, unit = "") {
    const raw = String(value ?? "").trim();
    const u = String(unit || "").trim();
    if (!raw || !u) return raw;
    const escaped = u.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");
    return raw.replace(new RegExp(`\\s*${escaped}$`, "i"), "").trim();
  }

  formatNumberForUnit(value, unit = "", propertyKey = "") {
    const raw = this.valueWithoutUnit(value, unit);
    const n = Number(String(raw).replace(",", "."));
    if (!Number.isFinite(n)) return String(value ?? "");
    const u = String(unit || "").trim();
    const key = String(propertyKey || "").toLowerCase();
    let decimals = 2;
    const ul = u.toLowerCase();
    if (ul === "kwh" || key.includes("energy") || key.includes("cost")) decimals = 4;
    else if (ul === "kw" || key.includes("power")) decimals = 2;
    else if (ul === "a" || key.includes("current")) decimals = 1;
    else if (ul === "km" || key.includes("range") || key.includes("odometer") || key.includes("distance")) decimals = 0;
    else if (u === "%" || key.includes("soc") || key.includes("pct")) decimals = Math.abs(n - Math.round(n)) < 0.05 ? 0 : 1;
    const fixed = n.toFixed(decimals);
    return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }

  formatValue(value, unit = "", propertyKey = "") {
    const s = String(value ?? "").trim();
    if (!s || ["Unknown","Not available","—","None"].includes(s)) return s || "—";
    const formatted = this.formatNumberForUnit(s, unit, propertyKey);
    const u = String(unit || "").trim();
    if (!u) return formatted;
    const noUnit = this.valueWithoutUnit(formatted, u);
    return `${noUnit} ${u}`.trim();
  }

  displayFactWithUnit(assetId, field, fallback = "—") {
    const row = this.factContractRow(assetId, field);
    if (!row) return fallback;
    return this.propertyDisplayValue(row, fallback);
  }

  propertyDisplayValue(row = {}, fallback = "Unknown") {
    const key = String(row.property_key || "").toLowerCase();
    const value = this.factContractValue(row.asset_id, row.property_key, fallback);
    if (["lifecycle_status", "asset.lifecycle_status", "vehicle.lifecycle_status", "charger.lifecycle_status"].includes(key)) {
      const v = String(value || "").trim().toLowerCase();
      if (v === "active") return "Active";
      if (v === "disabled") return "Disabled";
      return value || fallback;
    }
    if (key.includes("charger_id") || key.includes("charger") && String(value || "").startsWith("charger_")) return this.chargerLabel(value);
    if (key.includes("vehicle_id") || key.includes("vehicle") && String(value || "").startsWith("vehicle_")) return this.vehicleLabel(value);
    return this.formatValue(value, row.unit || "", row.property_key || "");
  }

  uxEditorControlKind(prop = {}) {
    // MOBILITY_PUBLIC_RUNTIME_V1 write metadata is the sole editor authority.
    // Do not infer editor type from property names, units, integrations or values.
    const binding = String(prop.write_binding_type || prop.editor || "").trim().toLowerCase();
    if (binding === "select") return "select";
    if (binding === "text") return "text";
    if (binding === "switch" || binding === "toggle" || binding === "boolean") return "toggle";
    if (binding === "number" || binding === "slider") return "slider";
    if (binding === "datetime" || binding === "datetime-local") return "datetime";
    return "";
  }

  isConfigurationCommand(command = {}) {
    const key = String(command.command_key || command.command_id || command.label || "").toLowerCase();
    const role = String(command.command_role || command.role || "").toLowerCase();
    const forbidden = [
      "set_current_limit", "set_requested_power", "set_target_soc", "set_ready_by",
      "set_display_name", "set_profile", "set_selected_charger", "set_owner", "set_short_name"
    ];
    return forbidden.some((part) => key.includes(part) || role.includes(part));
  }

  commandFamilyIssue(command = {}) {
    if (!command || command.frontend_allowed === false) return "";
    const explicit = this.normalizedFamilyName(command.command_family || command.family || "");
    const assetId = this.canonicalAssetId(command.asset_id || "");
    const currentKey = String(command.current_state_property || "").trim();
    const row = currentKey ? this.factContractRow(assetId, currentKey) : null;
    const propFamily = row ? this.propertyFamily(row) : (currentKey ? this.fallbackFamilyForPropertyKey(currentKey, command.asset_type || "") : "");
    if (explicit && propFamily && explicit !== propFamily) return `Command family '${explicit}' does not match property family '${propFamily}' for ${currentKey}`;
    return "";
  }

  resolvedCommandFamily(command = {}) {
    const explicit = this.normalizedFamilyName(command.command_family || command.family || "");
    if (explicit) return explicit;
    const currentKey = String(command.current_state_property || "").trim();
    if (currentKey) return this.fallbackFamilyForPropertyKey(currentKey, command.asset_type || "");
    return this.normalizedFamilyName(command.command_group || command.group || "") || "overview";
  }

  familyCommandRows(assetId = "", family = "") {
    const f = this.normalizedFamilyName(family);
    return this.commandsFor(assetId)
      .filter((cmd) => this.resolvedCommandFamily(cmd) === f)
      .map((cmd) => {
        const st = this.commandState(cmd);
        const label = cmd.label || this.titleize(cmd.command_id || cmd.command_key || "Command");
        const value = st.disabled ? `Blocked${st.reason ? ` — ${st.reason}` : ""}` : "Available";
        return { type:"readonly", icon:this.commandIcon(cmd), label, value, _command:true, detail_level:"operational", order:Number(cmd.sort_order ?? 999) };
      });
  }

  familyLogicalSectionForProperty(row = {}) {
    const level = this.propertyDetailLevel(row);
    const family = this.propertyFamily(row);
    const group = String(this.propertyGroup(row) || "").toLowerCase();
    const k = String(row.property_key || "").toLowerCase();
    const authority = String(row.authority || row.value_authority || row.source_layer || "").toLowerCase();
    if (level === "technical" || family === "diagnostics" || group === "diagnostics" || k.includes("diagnostic") || k.includes("error") || k.includes("warning") || k.includes("firmware") || k.includes("communication")) return "diagnostics";
    if (group === "metering" || family === "metering" || k.includes("session_energy") || k.includes("lifetime_energy") || k.includes("grid_energy") || k.includes("solar_energy") || k.includes("cost") || k.includes("meter") || k.includes("cycle_count") || k.includes("efficiency")) return "metering";
    if (group === "overview" || level === "summary") return "overview";
    if (group === "details") return "details";
    if (group === "actions") return "details"; // R41.4: actions are commands only; properties stay readable/editable elsewhere.
    if (authority.includes("diagnostic")) return "diagnostics";
    return "details";
  }

  familyLogicalSectionLabel(section = "details") {
    const key = String(section || "details").toLowerCase();
    const labels = { overview:"Overview", editors:"Editors", settings:"Editors", actions:"Actions", details:"Details", metering:"Metering", diagnostics:"Diagnostics" };
    return labels[key] || this.titleize(key);
  }

  familyLogicalSectionOrder(section = "details") {
    const order = { overview:0, editors:8, settings:8, actions:10, details:20, metering:30, diagnostics:40 };
    return order[String(section || "details").toLowerCase()] ?? 99;
  }


  isWritableProperty(prop = {}) {
    const editor = this.uxEditorControlKind(prop);
    return this.contractBool(prop.editable, false) === true
      && this.contractBool(prop.write_supported, false) === true
      && !!editor
      && !!prop.write_service_domain
      && !!prop.write_service_action
      && !!prop.write_target_entity;
  }

  propertyEditorChoices(prop = {}) {
    // V1-published choices/options are authoritative. UX never derives profile,
    // charger or other configuration options from integrations or device identity.
    const direct = this.parseJsonValue(prop.choices, prop.choices || null);
    if (Array.isArray(direct)) return direct;
    const options = this.parseJsonValue(prop.options, prop.options || null);
    if (Array.isArray(options)) return options;
    const validation = prop.validation && typeof prop.validation === "object" ? prop.validation : {};
    const validationChoices = this.parseJsonValue(validation.choices, validation.choices || null);
    if (Array.isArray(validationChoices)) return validationChoices;
    const validationOptions = this.parseJsonValue(validation.options, validation.options || null);
    if (Array.isArray(validationOptions)) return validationOptions;
    return [];
  }

  numericPropertyValue(assetId = "", propertyKey = "", fallback = null) {
    const v = this.factValue(assetId, propertyKey, fallback);
    const n = Number(String(this.valueWithoutUnit(v ?? "", "")).replace(",", "."));
    return Number.isFinite(n) ? n : fallback;
  }

  numericPropertyValueAny(assetId = "", propertyKeys = [], fallback = null) {
    for (const key of propertyKeys.filter(Boolean)) {
      const v = this.numericPropertyValue(assetId, key, null);
      if (Number.isFinite(v)) return v;
    }
    return fallback;
  }

  sliderBoundsForProperty(prop = {}) {
    // R43.2.54: min/max/step are property-contract metadata. UX does not derive
    // power from current/phases/voltage, clamp against local capability guesses,
    // or invent semantic fallback bounds.
    const validation = prop.validation && typeof prop.validation === "object" ? { ...prop.validation } : {};
    const min = validation.min ?? validation.minimum ?? prop.min;
    const max = validation.max ?? validation.maximum ?? prop.max;
    const step = validation.step ?? prop.step;
    const nMin = Number(String(min ?? "").replace(",", "."));
    const nMax = Number(String(max ?? "").replace(",", "."));
    const nStep = Number(String(step ?? "").replace(",", "."));
    const valid = Number.isFinite(nMin) && Number.isFinite(nMax) && nMax >= nMin;
    return {
      min: valid ? nMin : "",
      max: valid ? nMax : "",
      step: Number.isFinite(nStep) && nStep > 0 ? nStep : "",
      valid: valid && Number.isFinite(nStep) && nStep > 0,
      source: valid && Number.isFinite(nStep) && nStep > 0 ? "property_contract" : ""
    };
  }

  propertyEditorRow(prop) {
    const editor = this.uxEditorControlKind(prop);
    const validation = prop.validation && typeof prop.validation === "object" ? { ...prop.validation } : {};
    const slider = this.sliderBoundsForProperty(prop);
    if (slider.valid) {
      validation.min = slider.min;
      validation.max = slider.max;
      validation.step = slider.step;
    }
    const allowNone = this.contractBool(prop.allow_none, false);
    const noneValue = prop.none_value ?? "";
    const configuredValue = prop.value === undefined || prop.value === null || String(prop.value).trim() === ""
      ? (allowNone ? noneValue : "")
      : prop.value;
    return {
      type:"property-editor",
      property: prop,
      icon: prop.icon || this.propertyIcon(prop.property_key),
      label: this.propertyDisplayLabel(prop),
      value: this.propertyDisplayValue(prop),
      editor_value: configuredValue,
      help: prop.description || prop.meaning || "",
      editor,
      validation,
      slider_bounds_valid: slider.valid,
      slider_bounds_source: slider.source || "",
      choices: this.propertyEditorChoices(prop),
      choice_source: prop.choice_source || "",
      value_field: prop.value_field || "value",
      label_field: prop.label_field || "label",
      secondary_label_field: prop.secondary_label_field || "secondary_label",
      allow_none: allowNone,
      none_value: noneValue,
      disabled: !this.isWritableProperty(prop),
      disabled_reason: !this.contractBool(prop.write_supported, false) ? "Editing not available" : (!editor ? "Editor metadata missing" : (!prop.write_service_domain || !prop.write_service_action || !prop.write_target_entity) ? "Write binding incomplete" : "")
    };
  }

  propertyOperationalRow(prop) {
    if (this.isWritableProperty(prop)) return this.propertyEditorRow(prop);
    return { type:"readonly", icon: prop.icon || this.propertyIcon(prop.property_key), label:this.propertyDisplayLabel(prop), value:this.propertyDisplayValue(prop), detail_level:prop._ux_level, parent:prop._ux_parent, group:prop._ux_group };
  }

  propertyWriteSection(prop) {
    if (this.isWritableProperty(prop)) return "editors";
    return this.familyLogicalSectionForProperty(prop);
  }

  activityRowsFor(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const attrs = this.entity("sensor.mobility_activity_index")?.attributes || {};
    const rows = [];
    const collect = (value) => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) rows.push(...parsed);
      else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.rows)) rows.push(...parsed.rows);
        if (Array.isArray(parsed.activities)) rows.push(...parsed.activities);
        for (const [key, val] of Object.entries(parsed)) {
          if (["rows","activities"].includes(key)) continue;
          if (Array.isArray(val)) rows.push(...val.map((r)=>({ asset_id:r?.asset_id || key, ...r })));
          else if (val && typeof val === "object") rows.push({ asset_id:val.asset_id || key, ...val });
        }
      }
    };
    for (const attrName of ["activities", "activities_json", "current_activities", "current_activities_json", "rows", "rows_json", "activity_by_asset", "activities_by_asset"]) collect(attrs[attrName]);
    return rows.filter((a)=>!canonical || String(a.asset_id || a.subject_asset_id || a.related_asset_id || "") === canonical || String(a.related_asset_id || "") === canonical);
  }

  intelligenceRowsFor(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const attrs = this.entity("sensor.mobility_intelligence_index")?.attributes || {};
    const rows = [];
    const collect = (value) => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) rows.push(...parsed);
      else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.rows)) rows.push(...parsed.rows);
        if (Array.isArray(parsed.insights)) rows.push(...parsed.insights);
        if (Array.isArray(parsed.intelligence)) rows.push(...parsed.intelligence);
        for (const [key, val] of Object.entries(parsed)) {
          if (["rows","insights","intelligence"].includes(key)) continue;
          if (Array.isArray(val)) rows.push(...val.map((r)=>({ asset_id:r?.asset_id || key, ...r })));
          else if (val && typeof val === "object") rows.push({ asset_id:val.asset_id || val.subject_asset_id || key, ...val });
        }
      }
    };
    for (const attrName of ["insights", "insights_json", "intelligence", "intelligence_json", "rows", "rows_json", "insights_by_asset", "intelligence_by_asset"]) collect(attrs[attrName]);
    return rows.filter((r)=>!canonical || String(r.asset_id || r.subject_asset_id || r.related_asset_id || "") === canonical);
  }


  clusterIntelligenceRows(assetType = "vehicle", assetId = "") {
    const entityId = assetType === "charger" ? "sensor.mobility_charger_intelligence_index" : "sensor.mobility_vehicle_intelligence_index";
    const canonical = this.canonicalAssetId(assetId);
    const attrs = this.entity(entityId)?.attributes || {};
    const rows = [];
    const collect = (value, keyHint = "") => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) {
        for (const item of parsed) rows.push({ ...(item || {}), asset_id: item?.asset_id || item?.subject_asset_id || keyHint });
      } else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.rows)) collect(parsed.rows, keyHint);
        if (Array.isArray(parsed.intelligence)) collect(parsed.intelligence, keyHint);
        if (Array.isArray(parsed.clusters)) collect(parsed.clusters, keyHint);
        for (const [key, val] of Object.entries(parsed)) {
          if (["rows","intelligence","clusters","schema_version","contract_version","generated_at"].includes(key)) continue;
          if (Array.isArray(val)) collect(val.map((r)=>({ asset_id:r?.asset_id || r?.subject_asset_id || key, ...r })), key);
          else if (val && typeof val === "object") rows.push({ asset_id:val.asset_id || val.subject_asset_id || key, ...val });
        }
      }
    };
    for (const attrName of ["assets_json", "assets", "rows", "rows_json", "intelligence", "intelligence_json", "clusters", "clusters_json", "vehicles", "chargers", "by_asset", "intelligence_by_asset", "summary_by_asset"]) collect(attrs[attrName], "");
    return rows.filter((r)=>!canonical || String(r.asset_id || r.subject_asset_id || r.related_asset_id || "") === canonical);
  }

  clusterIntelligenceObject(assetId = "", assetType = "vehicle") {
    const rows = this.clusterIntelligenceRows(assetType, assetId);
    if (!rows.length) return null;
    const first = rows[0] || {};
    return first.summary && typeof first.summary === "object" ? { ...first, ...first.summary } : first;
  }

  contractGapTile(label = "Contract", icon = "mdi:alert-outline", detail = "Required intelligence contract missing") {
    return { icon, label, value:"Contract gap", subvalue:detail, tone:"attention", subIcon:"mdi:alert-outline" };
  }

  normalizedIntelligenceTile(raw = null, required = {}) {
    if (!raw || typeof raw !== "object" || !Object.keys(raw).length) {
      return this.contractGapTile(required.label || "Status", required.icon || "mdi:alert-outline", required.detail || "Missing from intelligence index");
    }
    const primary = raw.primary ?? raw.primary_display ?? raw.summary ?? raw.value ?? raw.display ?? raw.label ?? raw.state_label ?? "";
    const secondary = raw.secondary ?? raw.secondary_display ?? raw.reason ?? raw.detail ?? raw.message ?? raw.activity_display ?? raw.charging_activity_display ?? "";
    if (!String(primary || "").trim()) {
      return this.contractGapTile(required.label || raw.label || "Status", required.icon || raw.icon || "mdi:alert-outline", "Missing primary display");
    }
    const severity = String(raw.severity || raw.tone || raw.state || "neutral").toLowerCase();
    const tone = /error|critical|not_ok|not ok|fault/.test(severity) ? "error" : (/warn|attention|stale|due/.test(severity) ? "attention" : (/active|charging/.test(severity) ? "active" : "neutral"));
    return {
      icon: raw.icon || raw.primary_icon || required.icon || "mdi:information-outline",
      label: required.label || raw.label_text || raw.title || raw.label || "Status",
      value: String(primary || "Unknown"),
      subvalue: secondary ? String(secondary) : "",
      tone,
      subIcon: raw.reason_icon || raw.secondary_icon || ""
    };
  }

  vehicleIntelligenceStatusTiles(assetId = "") {
    const obj = this.clusterIntelligenceObject(assetId, "vehicle");
    if (!obj) {
      return [
        this.contractGapTile("Range", "mdi:road-variant", "sensor.mobility_vehicle_intelligence_index missing"),
        this.contractGapTile("Energy", "mdi:battery-charging", "sensor.mobility_vehicle_intelligence_index missing"),
        this.contractGapTile("Security", "mdi:lock-outline", "sensor.mobility_vehicle_intelligence_index missing"),
        this.contractGapTile("Maintenance", "mdi:wrench-outline", "sensor.mobility_vehicle_intelligence_index missing"),
        this.contractGapTile("Freshness", "mdi:clock-outline", "sensor.mobility_vehicle_intelligence_index missing")
      ];
    }
    const range = obj.range_intelligence || obj.range || obj.range_summary || obj.Range || null;
    const energy = obj.energy_intelligence || obj.energy || obj.energy_summary || obj.charging_energy || obj.Energy || null;
    const charging = obj.charging_intelligence || obj.charging || obj.charging_summary || null;
    const security = obj.security_intelligence || obj.security || obj.security_summary || obj.Security || null;
    const maintenance = obj.maintenance_intelligence || obj.maintenance || obj.maintenance_summary || obj.Maintenance || null;
    const freshness = obj.freshness_intelligence || obj.freshness || obj.freshness_summary || obj.data_freshness || obj.Freshness || null;
    const energyRaw = energy ? {
      ...energy,
      primary: energy.primary || energy.primary_display || [energy.ev_range_display, energy.battery_soc_display].filter(Boolean).join(" · ") || energy.display,
      secondary: energy.secondary || energy.secondary_display || energy.charging_activity_display || energy.activity_display || charging?.summary || charging?.primary || charging?.primary_display || [energy.actual_charge_power_display, energy.charge_state || energy.charging_state].filter(Boolean).join(" "),
      icon: energy.icon || "mdi:battery-charging"
    } : null;
    return [
      this.normalizedIntelligenceTile(range, { label:"Range", icon:"mdi:road-variant" }),
      this.normalizedIntelligenceTile(energyRaw, { label:"Energy", icon:"mdi:battery-charging" }),
      this.normalizedIntelligenceTile(security, { label:"Security", icon:"mdi:lock-outline" }),
      this.normalizedIntelligenceTile(maintenance, { label:"Maintenance", icon:"mdi:wrench-outline" }),
      this.normalizedIntelligenceTile(freshness, { label:"Freshness", icon:"mdi:clock-outline" })
    ];
  }

  // Charger product headline semantics intentionally have no intelligence-based
  // compatibility resolver. Use chargerProductSnapshot() only.

  lifecyclePropertyRow(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    // R43.2.54: lifecycle is a property concern. Deprecated aggregate runtime
    // publications and asset-index metadata are never product lifecycle fallbacks.
    return (this.propertyRows(canonical) || []).find((p) => String(p.property_key || "").toLowerCase() === "lifecycle_status") || null;
  }



  lifecycleStatus(assetOrId = "") {
    const asset = typeof assetOrId === "object" ? assetOrId : this.assetById(assetOrId);
    const canonical = this.canonicalAssetId(asset?.asset_id || assetOrId || "");
    const prop = canonical ? this.lifecyclePropertyRow(canonical) : null;
    const raw = String(prop?.value ?? "").trim().toLowerCase();
    if (raw === "active") return "active";
    if (raw === "disabled") return "disabled";
    if (raw === "retired") return "retired";
    return "unknown";
  }

  isLifecycleActive(assetOrId = "") {
    return this.lifecycleStatus(assetOrId) === "active";
  }

  isLifecycleDisabled(assetOrId = "") {
    return this.lifecycleStatus(assetOrId) === "disabled";
  }

  lifecycleWriteModel(assetOrId = "", desiredStatus = "") {
    const asset = typeof assetOrId === "object" ? assetOrId : this.assetById(assetOrId);
    const canonical = this.canonicalAssetId(asset?.asset_id || assetOrId || "");
    const value = String(desiredStatus || "").trim().toLowerCase();
    const prop = canonical ? this.lifecyclePropertyRow(canonical) : null;
    const writable = !!(prop && this.isWritableProperty(prop));
    const current = this.lifecycleStatus(asset || canonical);
    return {
      asset_id: canonical,
      property_key: prop?.property_key || "lifecycle_status",
      prop,
      current,
      desired: value,
      writable,
      disabled: !writable || !["active", "disabled"].includes(value),
      reason: prop ? (writable ? "" : "Lifecycle write binding incomplete") : "Lifecycle contract gap"
    };
  }

  writePropertyValue(prop = {}, value = "") {
    if (!prop || !this.hass || !this.isWritableProperty(prop)) return false;
    const domain = prop.write_service_domain;
    const action = prop.write_service_action;
    const target = prop.write_target_entity;
    const payload = { ...(prop.write_service_data && typeof prop.write_service_data === "object" ? prop.write_service_data : {}) };
    if (!payload.entity_id) payload.entity_id = target;
    const domainText = String(domain || "").toLowerCase();
    const actionText = String(action || "").toLowerCase();
    if (!["button", "input_button"].includes(domainText)) {
      const explicitField = String(prop.write_value_field || "").trim();
      if (explicitField) payload[explicitField] = value;
      else if (actionText.includes("select") || domainText.includes("select")) payload.option = value;
      else if (actionText.includes("datetime") || domainText.includes("datetime")) payload.datetime = value;
      else if (actionText.includes("time")) payload.time = value;
      else if (actionText.includes("turn_")) { /* entity_id only */ }
      else payload.value = value;
    }
    this.hass.callService(domain, action, payload);
    return true;
  }

  writePublishedProperty(assetId = "", propertyKey = "", value = "") {
    const prop = this.propertyByCompoundKey(this.canonicalAssetId(assetId), propertyKey);
    if (!prop) return false;
    return this.writePropertyValue(prop, value);
  }

  writeLifecycleStatus(assetOrId = "", desiredStatus = "") {
    const model = this.lifecycleWriteModel(assetOrId, desiredStatus);
    if (model.disabled) return false;
    return this.writePropertyValue(model.prop, model.desired);
  }

  lifecycleContractGapSection(assetId = "") {
    if (this.lifecyclePropertyRow(assetId)) return null;
    return {
      key:"lifecycle-contract-gap",
      title:"Lifecycle",
      icon:"mdi:alert-outline",
      header:"Contract gap",
      rows:[{ type:"readonly", icon:"mdi:alert-outline", label:"Lifecycle", value:"Contract gap" }],
      details:[{ label:"Required property", value:"property_key=lifecycle_status is missing; no fallback to mobility_enabled/Enabled" }]
    };
  }

  contractConsumptionSummary(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const props = this.propertyRows(canonical).filter((p)=>String(p.access || "").toLowerCase() !== "internal");
    const commands = this.commandRegistry(canonical).filter((c)=>this.contractBool(c.frontend_allowed, true) === true && !this.isConfigurationCommand(c));
    const activities = this.activityRowsFor(canonical);
    const insights = this.intelligenceRowsFor(canonical);
    const editable = props.filter((p)=>p.editable);
    const editableGaps = editable.filter((p)=>!this.isWritableProperty(p));
    const executableCommandGaps = commands.filter((c)=>this.contractBool(c.execution_allowed, false) === true && (!c.service_domain || !c.service_action));
    return { props, commands, activities, insights, editable, editableGaps, executableCommandGaps };
  }

  familyDetailSections(assetId = "", assetType = "") {
    const canonical = this.canonicalAssetId(assetId);
    const groups = new Map();
    const warnings = [];
    const publishedPublicPropertyKeys = new Set();
    const renderedPublicPropertyKeys = new Set();
    const engineeringPublicPropertyKeys = new Set();
    const addFamily = (family) => {
      const f = this.normalizedFamilyName(family) || "overview";
      if (!groups.has(f)) groups.set(f, { properties:[], commands:[] });
      return groups.get(f);
    };

    for (const prop of this.propertyRows(canonical)) {
      if (String(prop.access || "").toLowerCase() === "internal") continue;
      const propKeyLower = String(prop.property_key || prop.normalized_property || prop.fact_type || "").toLowerCase();
      if (["asset.mobility_enabled", "vehicle.mobility_enabled", "charger.mobility_enabled", "mobility_enabled"].includes(propKeyLower)) { engineeringPublicPropertyKeys.add(propKeyLower); continue; }
      publishedPublicPropertyKeys.add(String(prop.property_key || prop.normalized_property || prop.fact_type || ""));
      const family = this.propertyFamily(prop);
      const level = this.propertyDetailLevel(prop);
      const bucket = addFamily(family);
      const group = this.propertyGroup(prop);
      const parent = this.propertyParent(prop);
      const logical = this.propertyWriteSection(prop);
      bucket.properties.push({ ...prop, _ux_family:family, _ux_group:group, _ux_parent:parent, _ux_level:level, _ux_logical_section:logical });
      const contractFamily = this.propertyFamilyContractValue(prop);
      const overrideFamily = this.propertyPresentationFamilyOverride(prop, contractFamily);
      if (overrideFamily) warnings.push(`Backend grouping issue for ${prop.asset_id}:${prop.property_key}; contract family '${contractFamily}' rendered as '${overrideFamily}'.`);
      if (!prop.family) warnings.push(`Missing property.family for ${prop.property_key}; UX fallback '${family}' used.`);
      if (!prop.group) warnings.push(`Missing property.group for ${prop.property_key}; UX fallback '${group}' used.`);
      if (!prop.parent && !prop.parent_property && !prop.parent_key && !prop.summary_parent) warnings.push(`Missing property.parent for ${prop.property_key}; UX fallback '${parent}' used.`);
      if (prop.editable && !this.isWritableProperty(prop)) warnings.push(`Editable property ${prop.property_key} is not writable under R41.4; UX renders it read-only and reports backend contract gap.`);
      if (String(prop.group || "").toLowerCase() === "main_info") warnings.push(`Property ${prop.property_key} still uses deprecated group=main_info; R41.4 requires group=overview.`);
      if (String(prop.group || "").toLowerCase() === "actions") warnings.push(`Property ${prop.property_key} uses group=actions; R41.4 reserves Actions for command_index only.`);
    }


    const sections = [];
    const familyOrder = this.canonicalFamilies();
    const sortedFamilies = Array.from(groups.keys()).sort((a,b) => (this.familyConfig(a).order - this.familyConfig(b).order) || familyOrder.indexOf(a) - familyOrder.indexOf(b) || a.localeCompare(b));

    for (const family of sortedFamilies) {
      const bucket = groups.get(family) || { properties:[], commands:[] };
      const cfg = this.familyConfig(family);
      const props = bucket.properties.sort((a,b)=>(Number(a.display_order ?? a.sort_order ?? 999)-Number(b.display_order ?? b.sort_order ?? 999)) || String(a._ux_parent).localeCompare(String(b._ux_parent)) || String(a.property_key).localeCompare(String(b.property_key)));
      const primary = props.find((p)=>p._ux_level === "summary" || p._ux_logical_section === "overview") || props[0] || null;
      const logical = new Map();
      const addLogical = (name, item) => {
        const key = String(name || "details").toLowerCase();
        if (!logical.has(key)) logical.set(key, []);
        logical.get(key).push(item);
      };
      for (const p of props) {
        // Normal detail screens must not become a public property dump. Technical/diagnostic
        // rows stay available under Engineering details only.
        if (p._ux_logical_section === "diagnostics" || p._ux_level === "technical") {
          engineeringPublicPropertyKeys.add(String(p.property_key || ""));
          continue;
        }
        renderedPublicPropertyKeys.add(String(p.property_key || ""));
        addLogical(p._ux_logical_section, { kind:"property", row:p });
      }
      for (const cmd of bucket.commands.sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.command_key || a.label || "").localeCompare(String(b.command_key || b.label || "")))) addLogical("actions", { kind:"command", row:cmd });

      const rows = [];
      const details = [];
      const logicalKeys = Array.from(logical.keys()).sort((a,b)=>this.familyLogicalSectionOrder(a)-this.familyLogicalSectionOrder(b));
      for (const logicalKey of logicalKeys) {
        const items = logical.get(logicalKey) || [];
        if (!items.length) continue;
        rows.push({ type:"subheader", label:this.familyLogicalSectionLabel(logicalKey), value:"" });
        let currentParent = "";
        for (const item of items) {
          if (item.kind === "property") {
            const p = item.row;
            const parent = String(p._ux_parent || p._ux_group || "general");
            if (parent && parent !== currentParent && logicalKey !== "overview") {
              currentParent = parent;
              rows.push({ type:"subheader-small", label:this.titleize(parent.replace(/_/g," ")), value:"" });
            }
            rows.push(this.propertyOperationalRow(p));
          } else if (item.kind === "command") {
            const cmd = item.row;
            rows.push({ type:"action-row", icon:this.commandIcon(cmd), label:cmd.label || this.titleize(cmd.command_id || cmd.command_key), command:cmd, asset_id:canonical });
          }
        }
      }

      const technicalProps = props.filter((p)=>p._ux_level === "technical" || p._ux_logical_section === "diagnostics" || p.source_entity_id || p.source_adapter_id || p.source_candidate_id);
      for (const p of technicalProps) {
        engineeringPublicPropertyKeys.add(String(p.property_key || ""));
        details.push({ label:this.propertyDisplayLabel(p), value:`${this.propertyDisplayValue(p)} · key=${p.property_key}; quality=${p.quality || ""}; health=${p.health || ""}` });
      }
      // V1 contract-complete guard: every public property must be visible in normal UX or
      // traceable from Engineering details. This prevents silent drops when family,
      // group, detail_level or access metadata changes in runtime.
      const familyPublicKeys = props.map((p)=>String(p.property_key || "")).filter(Boolean);
      const unaccounted = familyPublicKeys.filter((k)=>!renderedPublicPropertyKeys.has(k) && !engineeringPublicPropertyKeys.has(k));
      for (const key of unaccounted) {
        const p = props.find((row)=>String(row.property_key || "") === key) || {};
        engineeringPublicPropertyKeys.add(key);
        details.push({ label:`unaccounted ${this.propertyDisplayLabel(p)}`, value:`${this.propertyDisplayValue(p)} · key=${key}; routed_to=engineering_guard` });
      }
      for (const cmd of bucket.commands) {
        const st = this.commandState(cmd);
        details.push({ label:`command ${cmd.command_key || cmd.command_id}`, value:`${st.disabled ? "disabled" : "enabled"}; reason=${st.reason || cmd.execution_reason || ""}` });
      }

      sections.push({ key:`family-${family}`, title:cfg.title, icon:cfg.icon, header: primary ? this.propertyDisplayValue(primary) : `${bucket.commands.length} actions`, rows, details });
    }

    const activities = this.activityRowsFor(canonical);
    if (activities.length) {
      sections.push({ key:"activity", title:"Current Activity", icon:"mdi:progress-clock", header:`${activities.length} active`, rows:activities.map((a)=>({type:"readonly", icon:"mdi:progress-clock", label:a.activity_type || a.family || "Activity", value:a.message || a.activity_state || "Active"})), details:activities.map((a,i)=>({label:`Activity ${i+1}`, value:`family=${a.family || ""}; state=${a.activity_state || ""}; confidence=${a.confidence || ""}`})) });
    }
    const insights = this.intelligenceRowsFor(canonical);
    if (insights.length) {
      sections.push({ key:"intelligence", title:"Insights", icon:"mdi:brain", header:`${insights.length} insights`, rows:insights.map((r)=>({type:"readonly", icon:"mdi:brain", label:r.title || r.insight_type || r.family || "Insight", value:r.message || r.meaning || r.value || "Published"})), details:insights.map((r,i)=>({label:`Insight ${i+1}`, value:`quality=${r.quality || ""}; confidence=${r.confidence || ""}; sources=${Array.isArray(r.source_properties) ? r.source_properties.join(",") : (r.source_property || "")}`})) });
    }

    const summary = this.contractConsumptionSummary(canonical);
    const silentDrops = Array.from(publishedPublicPropertyKeys).filter((k)=>k && !renderedPublicPropertyKeys.has(k) && !engineeringPublicPropertyKeys.has(k));
    if (silentDrops.length) warnings.push(`Silent property drops detected: ${silentDrops.join(", ")}`);
    const reportRows = [
      {type:"readonly", icon:"mdi:database-check", label:"Properties consumed", value:String(summary.props.length)},
      {type:"readonly", icon:"mdi:gesture-tap-button", label:"Commands surfaced", value:String(summary.commands.length)},
      {type:"readonly", icon:"mdi:tune", label:"Editable properties", value:String(summary.editable.length)},
      {type:"readonly", icon:"mdi:alert", label:"Gaps", value:String(warnings.length + summary.editableGaps.length + summary.executableCommandGaps.length)}
    ];
    // Keep contract consumption evidence out of normal detail UX. It belongs in validation
    // reports and Engineering details, not as a visible product section.
    if (this.config?.show_contract_consumption === true) {
      sections.push({ key:"contract-consumption", title:"Contract Consumption", icon:"mdi:file-check-outline", header:"UX v1 completeness", rows:reportRows, details:[...warnings.map((w,i)=>({label:`Warning ${i+1}`, value:w})), ...summary.editableGaps.map((p)=>({label:`Editable gap ${p.property_key}`, value:"Missing write_supported/write_service_domain/write_service_action/write_target_entity"})), ...summary.executableCommandGaps.map((c)=>({label:`Command gap ${c.command_key || c.command_id}`, value:"execution_allowed=true but service metadata incomplete"}))] });
    }
    return sections.filter((s)=>s.rows?.length || s.details?.length);
  }

  propertyDisplaySection(assetId = "", title = "Published Properties") {
    const rows = this.propertyRows(assetId)
      .slice()
      .sort((a,b)=>String(a.property_key || "").localeCompare(String(b.property_key || "")));
    const displayRows = rows.map((p) => {
      return { type:"readonly", icon:this.propertyIcon(p.property_key), label:this.propertyDisplayLabel(p), value:this.propertyDisplayValue(p) };
    });
    const details = rows.map((p) => ({
      label:p.property_key,
      value:`quality=${p.quality || ""}; health=${p.health || ""}; source=${p.source_layer || ""}; command=${p.write_command || ""}`
    }));
    return {
      key:"published-properties",
      title,
      icon:"mdi:database-eye-outline",
      header:`${rows.length} properties`,
      rows:displayRows,
      details
    };
  }

  propertyIcon(propertyKey = "") {
    const k = String(propertyKey || "").toLowerCase();
    if (k.includes("soc") || k.includes("battery")) return "mdi:battery";
    if (k.includes("range")) return "mdi:map-marker-distance";
    if (k.includes("power")) return "mdi:flash";
    if (k.includes("current")) return "mdi:current-ac";
    if (k.includes("voltage")) return "mdi:sine-wave";
    if (k.includes("lock") || k.includes("door") || k.includes("window") || k.includes("security")) return "mdi:shield-car";
    if (k.includes("climate") || k.includes("temperature")) return "mdi:fan";
    if (k.includes("energy")) return "mdi:counter";
    if (k.includes("profile")) return "mdi:card-account-details-outline";
    return "mdi:database";
  }

  vehicleComponentContractRows() {
    const cacheKey = "vehicleComponentContractRows";
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    // R22.12.11.30: components_json is the deployed serialized form of the
    // same component contract. Parsing it is transport normalization, not a
    // semantic fallback: ownership remains the single component-contract entity.
    const parsedRows = this.canonicalRowsFromAttrs(
      "sensor.mobility_vehicle_component_contract_index",
      ["components_json", "components", "component_contract", "component_contract_index", "rows"],
      "vehicle_component_contract"
    ).map((row, index) => {
      const component_id = String(row.component_id || row.id || row.key || "").trim();
      const property_index_entity = String(row.property_index_entity || row.property_index || "").trim();
      if (!component_id || !property_index_entity) return null;
      return {
        ...row,
        component_id,
        display_name: row.display_name || row.label || component_id,
        tab_id: row.tab_id || component_id,
        card_order: Number(row.card_order ?? row.order ?? index),
        property_index_entity,
        overview_properties: this.parseListValue(row.overview_properties),
        action_properties: this.parseListValue(row.action_properties),
        detail_properties: this.parseListValue(row.detail_properties),
        engineering_properties: this.parseListValue(row.engineering_properties),
        related_commands: this.parseListValue(row.related_commands)
      };
    }).filter(Boolean);
    // If a backend exposes both object and *_json serializations during a
    // rollout, consume the component exactly once.
    const byComponentId = new Map();
    for (const row of parsedRows) if (!byComponentId.has(row.component_id)) byComponentId.set(row.component_id, row);
    const rows = [...byComponentId.values()].sort((a,b)=>Number(a.card_order || 999) - Number(b.card_order || 999));
    this._memo.set(cacheKey, rows);
    return rows;
  }

  vehicleComponentContractAvailable() {
    return this.vehicleComponentContractRows().length > 0;
  }

  vehicleComponentRows() {
    // R43.2.54 fail-closed: layout comes only from the published component contract.
    return this.vehicleComponentContractRows();
  }

  vehicleComponent(assetId = "", componentId = "") {
    const id = String(componentId || "").trim();
    return this.vehicleComponentRows().find((c)=>String(c.component_id || "") === id) || null;
  }

  vehicleComponentPropertyIndexEntities() {
    const rows = this.vehicleComponentRows();
    const entities = rows.map((c)=>String(c.property_index_entity || "").trim()).filter(Boolean);
    return [...new Set(entities)];
  }

  componentPropertyRows(assetId = "", componentId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const component = this.vehicleComponent(canonical, componentId);
    if (!component?.property_index_entity) return [];
    return this.propertyRowsFromEntity(component.property_index_entity, canonical).map((row)=>({ ...row, component_id: component.component_id, component_display_name: component.display_name }));
  }

  vehicleComponentProperties(assetId = "", componentId = "") {
    return this.componentPropertyRows(assetId, componentId);
  }

  vehicleComponentCommands(assetId = "", componentId = "") {
    // R43.2.54: component contracts never invent command placement. Only explicit
    // vehicle command-slot placement may put a command inside a component.
    const rows = this.commandSlotRowsForSurface(assetId, componentId);
    if (rows === null || !rows.length) return [];
    return this.commandsForSurface(assetId, componentId);
  }

  vehicleComponentModel(assetId = "", componentId = "") {
    const component = this.vehicleComponent(assetId, componentId);
    if (!component) return null;
    const properties = this.vehicleComponentProperties(assetId, componentId);
    return {
      ...component,
      properties,
      commands: this.vehicleComponentCommands(assetId, componentId),
      property_count: properties.length
    };
  }

  vehicleComponentModels(assetId = "") {
    return this.vehicleComponentRows().map((c)=>this.vehicleComponentModel(assetId, c.component_id)).filter(Boolean);
  }

  vehicleOverviewMetricSlots(assetId = "") {
    // Product presentation is compact, but value ownership/placement stays
    // backend-driven. Each metric slot takes the exact Nth overview property
    // published by the named component; there is no property-name alias resolver.
    const canonical = this.canonicalAssetId(assetId);
    const specs = [
      { component_id:"range", property_index:0, label:"Full" },
      { component_id:"range", property_index:1, label:"EV" },
      { component_id:"battery", property_index:0, label:"Battery" }
    ];
    return specs.map((spec)=>{
      const component = this.vehicleComponent(canonical, spec.component_id);
      const propertyKey = String(component?.overview_properties?.[spec.property_index] || "").trim();
      const rows = component ? this.vehicleComponentProperties(canonical, component.component_id) : [];
      const prop = propertyKey ? rows.find((row)=>String(row.property_key || "") === propertyKey) || null : null;
      return {
        ...spec,
        property_key: propertyKey,
        property: prop,
        resolved: !!prop && prop.value !== undefined && prop.value !== null && String(prop.value).trim() !== "",
        display: prop ? this.propertyDisplayValue(prop) : "—"
      };
    });
  }

  vehicleComponentDetailSections(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const components = this.vehicleComponentRows();
    if (!components.length) {
      return [{
        key:"vehicle-layout-contract-gap",
        title:"Layout contract gap",
        icon:"mdi:alert-outline",
        header:"Component contract unavailable",
        rows:[{ type:"readonly", icon:"mdi:alert-outline", label:"Vehicle layout", value:"Contract gap" }],
        details:[{ label:"Required owner", value:"sensor.mobility_vehicle_component_contract_index" }]
      }];
    }
    const sections = [];
    const groupDefs = [
      { key:"overview", title:"Overview", list:"overview_properties" },
      { key:"actions", title:"Controls", list:"action_properties" },
      { key:"details", title:"Details", list:"detail_properties" },
      { key:"engineering", title:"Engineering", list:"engineering_properties", detailsOnly:true }
    ];
    for (const component of components) {
      const props = this.vehicleComponentProperties(canonical, component.component_id)
        .filter((p)=>String(p.access || "").toLowerCase() !== "internal")
        .sort((a,b)=>(Number(a.display_order ?? a.sort_order ?? 999)-Number(b.display_order ?? b.sort_order ?? 999)) || String(a.property_key || "").localeCompare(String(b.property_key || "")));
      const byKey = new Map(props.map((p)=>[String(p.property_key || ""), p]).filter(([key])=>!!key));
      const declared = new Set();
      for (const def of groupDefs) for (const key of (component[def.list] || [])) declared.add(String(key));
      const hasDeclaredPlacement = declared.size > 0;
      const rows = [];
      const details = [];
      const rendered = new Set();

      // A property listed in Actions is an editable-property placement, not a command.
      // Prefer that placement when the same key is also present in Overview.
      const actionKeys = new Set((component.action_properties || []).map(String));
      for (const def of groupDefs) {
        const keys = hasDeclaredPlacement
          ? (component[def.list] || []).map(String).filter((key)=>!(def.key === "overview" && actionKeys.has(key)))
          : (def.key === "overview" ? props.map((p)=>String(p.property_key || "")) : []);
        const placed = keys.map((key)=>byKey.get(key)).filter(Boolean).filter((p)=>!rendered.has(String(p.property_key || "")));
        if (!placed.length) continue;
        if (def.detailsOnly) {
          for (const p of placed) {
            const key = String(p.property_key || "");
            rendered.add(key);
            details.push({ label:this.propertyDisplayLabel(p), value:`${this.propertyDisplayValue(p)} · key=${key}; component=${component.component_id}; engineering=true` });
          }
          continue;
        }
        rows.push({ type:"subheader", label:def.title, value:"" });
        for (const p of placed) {
          const key = String(p.property_key || "");
          rendered.add(key);
          rows.push(this.propertyOperationalRow(p));
        }
      }

      // If the component declares exact placement lists, unlisted component properties
      // are a backend layout-contract gap. Do not reconstruct placement from families.
      if (hasDeclaredPlacement) {
        for (const p of props) {
          const key = String(p.property_key || "");
          if (!key || rendered.has(key)) continue;
          details.push({ label:`Unplaced: ${key}`, value:`owner=${component.property_index_entity}; component=${component.component_id}; layout_contract_gap=true` });
        }
      }

      sections.push({
        key:`vehicle-component-${component.component_id}`,
        title:component.display_name || this.titleize(component.component_id),
        icon:component.icon || (String(component.component_id).includes("charging") ? "mdi:ev-station" : String(component.component_id).includes("battery") ? "mdi:battery-charging" : String(component.component_id).includes("range") ? "mdi:map-marker-distance" : String(component.component_id).includes("access") ? "mdi:shield-car" : String(component.component_id).includes("comfort") ? "mdi:fan" : String(component.component_id).includes("location") ? "mdi:map-marker" : String(component.component_id).includes("maintenance") ? "mdi:wrench" : String(component.component_id).includes("diagnostic") ? "mdi:bug-check" : "mdi:car"),
        header:`${props.length} properties`,
        rows,
        details
      });
    }
    return sections.filter((s)=>s.rows?.length || s.details?.length);
  }


  chargerComponentContractRows() {
    const cacheKey = "chargerComponentContractRows";
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const entityId = "sensor.mobility_charger_component_contract_index";
    const attrs = this.entity(entityId)?.attributes || {};
    const rows = [];
    const collect = (value) => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) rows.push(...parsed);
      else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.cards)) rows.push(...parsed.cards);
        else if (Array.isArray(parsed.rows)) rows.push(...parsed.rows);
        else if (Array.isArray(parsed.components)) rows.push(...parsed.components);
        else rows.push(...Object.values(parsed).filter((r)=>r && typeof r === "object"));
      }
    };
    for (const attrName of ["ux_cards_json", "cards", "cards_json", "components", "component_contract", "component_contract_index", "rows"]) collect(attrs[attrName]);
    const sectionCommandMap = this.parseJsonValue(attrs.related_commands_by_section_json, attrs.related_commands_by_section_json || {});
    const fieldMap = this.parseJsonValue(attrs.ux_fields_by_property_json, attrs.ux_fields_by_property_json || {});
    const layoutRules = this.parseJsonValue(attrs.ux_layout_rules_json, attrs.ux_layout_rules_json || {});
    const forbiddenRendering = this.parseJsonValue(attrs.ux_forbidden_rendering_json, attrs.ux_forbidden_rendering_json || {});
    const normalized = rows.map((row, index) => {
      if (!row || typeof row !== "object") return null;
      const component_id = String(row.component_id || row.card_id || row.id || row.key || "").trim();
      const property_index_entity = String(row.property_index_entity || row.property_index || "").trim();
      if (!component_id || !property_index_entity) return null;
      const sections = this.parseListValue(row.sections || row.sections_json);
      const relatedFromRow = this.parseListValue(row.related_commands || row.commands || row.command_keys);
      return {
        ...row,
        component_id,
        card_id: row.card_id || component_id,
        display_name: row.display_name || row.title || row.label || component_id,
        tab_id: row.tab_id || row.tab || (component_id.includes("engineering") ? "engineering" : component_id.includes("metering") ? "details" : "overview"),
        card_order: Number(row.card_order ?? row.order ?? index),
        property_index_entity,
        runtime_contract_index_entity: "",
        command_index_entity: String(row.command_index_entity || attrs.command_index_entity || "sensor.mobility_command_index").trim(),
        sections,
        overview_properties: this.parseListValue(row.overview_properties),
        action_properties: this.parseListValue(row.action_properties),
        detail_properties: this.parseListValue(row.detail_properties),
        engineering_properties: this.parseListValue(row.engineering_properties),
        related_commands: relatedFromRow,
        related_commands_by_section: this.parseJsonValue(row.related_commands_by_section_json || row.related_commands_by_section, row.related_commands_by_section || sectionCommandMap || {}),
        ux_fields_by_property: fieldMap,
        ux_layout_rules: layoutRules,
        ux_forbidden_rendering: forbiddenRendering
      };
    }).filter(Boolean).sort((a,b)=>Number(a.card_order || 999) - Number(b.card_order || 999));
    this._memo.set(cacheKey, normalized);
    return normalized;
  }

  chargerComponentContractAvailable() {
    return this.chargerComponentContractRows().length > 0;
  }

  chargerComponentRows() {
    // R43.2.54 fail-closed: layout comes only from the published component contract.
    return this.chargerComponentContractRows();
  }

  chargerComponent(componentId = "") {
    const id = String(componentId || "").trim();
    return this.chargerComponentRows().find((c)=>String(c.component_id || c.card_id || "") === id) || null;
  }

  chargerComponentPropertyIndexEntities() {
    const rows = this.chargerComponentRows();
    const entities = rows.map((c)=>String(c.property_index_entity || "").trim()).filter(Boolean);
    return [...new Set(entities)];
  }

  chargerComponentPropertyRows(assetId = "", componentId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const component = this.chargerComponent(componentId);
    if (!component?.property_index_entity) return [];
    return this.propertyRowsFromEntity(component.property_index_entity, canonical).map((row)=>({ ...row, component_id: component.component_id, component_display_name: component.display_name }));
  }

  chargerComponentCommands(assetId = "", componentId = "", sectionId = "") {
    // R43.2.54 product rule: charger_actions.commands is rendered exactly once in
    // the shared top Actions surface. Component contracts own layout/properties and
    // may not cause a second command rendering path.
    return [];
  }

  chargerFieldConfig(propertyKey = "", component = {}) {
    const key = String(propertyKey || "").trim();
    const map = component?.ux_fields_by_property || this.parseJsonValue(this.attr("sensor.mobility_charger_component_contract_index", "ux_fields_by_property_json", {}), {});
    return (map && typeof map === "object" ? (map[key] || {}) : {}) || {};
  }

  chargerPropertyRowForContract(prop = {}, component = {}) {
    const field = this.chargerFieldConfig(prop.property_key, component);
    const row = { ...prop };
    if (field.display_name || field.label) row.display_name = field.display_name || field.label;
    if (field.icon) row.icon = field.icon;
    if (field.render_mode) row.render_mode = field.render_mode;
    if (field.detail_level) row.detail_level = field.detail_level;
    return this.propertyOperationalRow(row);
  }

  chargerSectionDefinitions(component = {}) {
    const parsed = this.parseListValue(component.sections || []);
    if (parsed.length) return parsed.map((section) => {
      if (typeof section === "string") return { section_id:section, display_name:this.titleize(section.replace(/_/g," ")) };
      return {
        section_id: section.section_id || section.id || section.key || section.name || "details",
        display_name: section.display_name || section.title || section.label || this.titleize(String(section.section_id || section.id || section.key || "details").replace(/_/g," ")),
        ...section
      };
    });
    // A component may be a single-card layout without sub-sections. Keep every
    // property in that backend-owned component rather than inventing UX families.
    return [{ section_id:"__component__", display_name:"" }];
  }

  chargerComponentDetailSections(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const components = this.chargerComponentRows();
    const forbiddenProductStatusKeys = new Set(["charger.status", "source_status", "charger.operational_state"]);
    const allProps = this.propertyRows(canonical).filter((p)=>String(p.access || "").toLowerCase() !== "internal");
    const productProps = allProps.filter((p)=>!forbiddenProductStatusKeys.has(String(p.property_key || "")) && String(p.access || "").toLowerCase() !== "diagnostics_only");
    const diagnosticsProps = allProps.filter((p)=>forbiddenProductStatusKeys.has(String(p.property_key || "")) || String(p.access || "").toLowerCase() === "diagnostics_only");
    const productByKey = new Map(productProps.map((p)=>[String(p.property_key || ""), p]));
    const diagnosticsByKey = new Map(diagnosticsProps.map((p)=>[String(p.property_key || ""), p]));
    const fieldMap = this.parseJsonValue(this.attr("sensor.mobility_charger_component_contract_index", "ux_fields_by_property_json", {}), {});
    const renderedKeys = new Set();
    const sections = [];

    const placementsFor = (component, sectionId) => {
      if (!fieldMap || typeof fieldMap !== "object" || Array.isArray(fieldMap)) return [];
      const componentId = String(component.component_id || component.card_id || "");
      return Object.entries(fieldMap).map(([mapKey, cfg]) => {
        if (!cfg || typeof cfg !== "object") return null;
        const propertyKey = String(cfg.property_key || mapKey || "").trim();
        const cardId = String(cfg.card_id || cfg.component_id || "").trim();
        const cfgSection = String(cfg.section_id || cfg.section || "").trim();
        if (!propertyKey || (cardId && cardId !== componentId) || (sectionId !== "__component__" && cfgSection !== sectionId)) return null;
        return { propertyKey, cfg, order:Number(cfg.display_order ?? cfg.order ?? 999) };
      }).filter(Boolean).sort((a,b)=>a.order-b.order || a.propertyKey.localeCompare(b.propertyKey));
    };

    const rowForPlacement = (placement, component, diagnostics = false) => {
      const source = diagnostics ? diagnosticsByKey : productByKey;
      const prop = source.get(placement.propertyKey);
      if (!prop) return null;
      renderedKeys.add(placement.propertyKey);
      return this.chargerPropertyRowForContract({ ...prop, ...placement.cfg, display_name:placement.cfg.label || placement.cfg.display_name || prop.display_name }, component);
    };

    let engineeringComponent = null;
    for (const component of components) {
      const componentId = String(component.component_id || component.card_id || "");
      if (componentId === "charger_actions") continue;
      if (componentId === "charger_engineering") engineeringComponent = component;
      const componentProps = this.chargerComponentPropertyRows(canonical, component.component_id)
        .filter((p)=>String(p.access || "").toLowerCase() !== "internal")
        .sort((a,b)=>(Number(a.display_order ?? a.sort_order ?? 999)-Number(b.display_order ?? b.sort_order ?? 999)) || String(a.property_key || "").localeCompare(String(b.property_key || "")));
      const rows = [];
      const details = [];
      for (const sectionDef of this.chargerSectionDefinitions(component)) {
        const sectionId = String(sectionDef.section_id || sectionDef.id || sectionDef.key || "details");
        const isDiagnosticsSection = componentId === "charger_engineering" && this.norm(sectionId) === "diagnostics";
        const isUnmappedSection = componentId === "charger_engineering" && this.norm(sectionId) === "unmapped";
        let placedRows = [];
        if (!isUnmappedSection) {
          const placements = placementsFor(component, sectionId);
          placedRows = placements.map((placement)=>rowForPlacement(placement, component, isDiagnosticsSection)).filter(Boolean);
        }
        if (isUnmappedSection) {
          // Explicit backend-owned catch-all section. Showing unplaced properties here
          // is allowed because the component contract itself declared `unmapped`.
          const leftovers = productProps.filter((p)=>!renderedKeys.has(String(p.property_key || "")));
          if (leftovers.length) {
            rows.push({ type:"subheader", label:sectionDef.display_name || "Unmapped", value:"" });
            for (const p of leftovers) {
              renderedKeys.add(String(p.property_key || ""));
              rows.push(this.chargerPropertyRowForContract(p, component));
            }
          }
          continue;
        }
        if (!placedRows.length) continue;
        if (sectionId !== "__component__") rows.push({ type:"subheader", label:sectionDef.display_name || this.titleize(sectionId.replace(/_/g," ")), value:"" });
        rows.push(...placedRows);
      }
      sections.push({
        key:`charger-component-${component.component_id}`,
        title:component.display_name || this.titleize(component.component_id),
        icon: component.icon || (componentId.includes("control") ? "mdi:tune" : componentId.includes("metering") ? "mdi:counter" : componentId.includes("engineering") ? "mdi:wrench" : "mdi:ev-station"),
        header:`${rows.filter((r)=>r.type !== "subheader").length} fields`,
        rows,
        details
      });
    }

    // If the contract has no explicit Engineering/Unmapped section, fail closed and
    // report the missing placement instead of inventing a product card.
    const unaccounted = productProps.filter((p)=>!renderedKeys.has(String(p.property_key || "")));
    if (unaccounted.length && !engineeringComponent) {
      sections.push({
        key:"charger-layout-contract-gap",
        title:"Layout contract gap",
        icon:"mdi:alert-outline",
        header:`${unaccounted.length} unplaced properties`,
        rows:[{ type:"readonly", icon:"mdi:alert-outline", label:"Component placement", value:"Contract gap" }],
        details:unaccounted.map((p)=>({ label:String(p.property_key || "Property"), value:`owner=${p._source_entity_id || "sensor.mobility_charger_property_index"}; missing component placement` }))
      });
    }

    const diagnosticsUnplaced = diagnosticsProps.filter((p)=>!renderedKeys.has(String(p.property_key || "")));
    if (diagnosticsUnplaced.length) {
      sections.push({
        key:"charger-component-source-diagnostics",
        title:"Engineering / Source diagnostics",
        icon:"mdi:stethoscope",
        header:`${diagnosticsUnplaced.length} diagnostics`,
        rows:[],
        details:diagnosticsUnplaced.map((p)=>({ label:this.propertyDisplayLabel(p), value:`${this.propertyDisplayValue(p)} · key=${p.property_key}; diagnostics_only=true` }))
      });
    }
    return sections.filter((section)=>section.rows?.length || section.details?.length);
  }

  propertyIndexEntityForAsset(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    if (canonical.startsWith("vehicle_")) return "sensor.mobility_vehicle_component_contract_index";
    if (canonical.startsWith("charger_")) return this.chargerComponentContractAvailable() ? "sensor.mobility_charger_component_contract_index" : "sensor.mobility_charger_property_index";
    if (canonical.startsWith("person_")) return "sensor.mobility_person_property_index";
    return "";
  }

  propertyRowsFromEntity(entityId = "", assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const attrs = this.entity(entityId)?.attributes || {};
    const rows = [];

    // Transport normalization only: preserve the structural keys published by the
    // same property-index owner. In particular, keyed maps may omit asset_id and/or
    // property_key because those values are encoded in the map key. Losing those
    // keys made valid canonical charger fields disappear from UX in R22.12.11.29.
    const addRow = (rawRow, keyHint = "", assetHint = "") => {
      if (!rawRow || typeof rawRow !== "object" || Array.isArray(rawRow)) return;
      const row = { ...rawRow, _source_entity_id: entityId };
      const hint = String(keyHint || "").trim();
      const hintedAsset = String(assetHint || "").trim();
      if (hint.includes(":")) {
        const splitAt = hint.indexOf(":");
        const keyAsset = hint.slice(0, splitAt);
        const keyProperty = hint.slice(splitAt + 1);
        if (!row.asset_id && keyAsset) row.asset_id = keyAsset;
        if (!row.property_key && !row.normalized_property && !row.fact_type && keyProperty) row.property_key = keyProperty;
        row._compound_key = row._compound_key || hint;
      } else {
        if (!row.asset_id && hintedAsset) row.asset_id = hintedAsset;
        if (!row.property_key && !row.normalized_property && !row.fact_type && hint && hint.includes(".")) row.property_key = hint;
      }
      rows.push(row);
    };

    const collectPropertyContainer = (value, assetHint = "") => {
      const parsed = this.parseJsonValue(value, value);
      if (Array.isArray(parsed)) {
        for (const row of parsed) addRow(row, "", assetHint);
        return;
      }
      if (!parsed || typeof parsed !== "object") return;
      for (const [key, row] of Object.entries(parsed)) {
        if (Array.isArray(row)) {
          for (const item of row) addRow(item, key, assetHint);
        } else if (row && typeof row === "object") {
          // Nested asset map: { charger_x: { charger.power_kw: {...} } }
          if (!row.asset_id && !row.property_key && !row.normalized_property && !row.fact_type && !key.includes(":")) {
            const nestedEntries = Object.entries(row);
            const looksLikeNestedPropertyMap = nestedEntries.some(([nestedKey, nestedRow]) => nestedRow && typeof nestedRow === "object" && (nestedKey.includes(".") || nestedKey.includes(":")));
            if (looksLikeNestedPropertyMap) {
              collectPropertyContainer(row, key.startsWith("vehicle_") || key.startsWith("charger_") || key.startsWith("person_") ? key : assetHint);
              continue;
            }
          }
          addRow(row, key, assetHint);
        }
      }
    };

    for (const attrName of ["properties", "properties_json", "property_index", "property_index_json", "rows", "rows_json", "properties_by_key", "properties_by_key_json", "properties_by_asset", "properties_by_asset_json"]) {
      collectPropertyContainer(attrs[attrName]);
    }

    // Some property-index schemas wrap the exact property rows per asset. Only
    // explicit nested property containers are consumed; top-level asset scalars are
    // not reinterpreted as properties.
    for (const attrName of ["assets", "assets_json"]) {
      const assets = this.parseJsonValue(attrs[attrName], attrs[attrName] || null);
      const assetRows = Array.isArray(assets) ? assets : (assets && typeof assets === "object" ? Object.values(assets) : []);
      for (const asset of assetRows) {
        if (!asset || typeof asset !== "object") continue;
        const assetKey = String(asset.asset_id || "").trim();
        for (const nestedName of ["properties", "properties_json", "property_index", "property_index_json", "rows", "rows_json", "source_properties", "properties_by_key", "properties_by_key_json"]) {
          collectPropertyContainer(asset[nestedName], assetKey);
        }
      }
    }

    const seen = new Set();
    return rows.map((r) => this.normalizePropertyRow(r)).filter(Boolean).filter((r) => {
      if (canonical && String(r.asset_id || "") !== String(canonical)) return false;
      const key = `${r.asset_id}:${r.property_key}:${String(r.value)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  propertyRows(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    const cacheKey = `propertyRows:${canonical || "all"}`;
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    let entities = [];
    if (canonical) {
      if (canonical.startsWith("vehicle_")) entities = ["sensor.mobility_vehicle_property_index", ...this.vehicleComponentPropertyIndexEntities()];
      else if (canonical.startsWith("charger_")) entities = ["sensor.mobility_charger_property_index", ...this.chargerComponentPropertyIndexEntities()];
      else entities = [this.propertyIndexEntityForAsset(canonical)];
    } else {
      entities = [
        "sensor.mobility_vehicle_property_index",
        ...this.vehicleComponentPropertyIndexEntities(),
        "sensor.mobility_charger_property_index",
        ...this.chargerComponentPropertyIndexEntities(),
        "sensor.mobility_person_property_index"
      ];
    }
    const rows = [];
    for (const entityId of [...new Set(entities.filter(Boolean))]) rows.push(...this.propertyRowsFromEntity(entityId, canonical));
    const seen = new Set();
    const normalized = rows.filter((r) => {
      const key = `${r.asset_id}:${r.property_key}:${String(r.value)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    this._memo.set(cacheKey, normalized);
    return normalized;
  }

  propertyControlModel(assetId = "", propertyKey = "") {
    const canonical = this.canonicalAssetId(assetId);
    const prop = this.propertyByCompoundKey(canonical, propertyKey);
    if (!prop) return { asset_id: canonical, property_key: propertyKey, resolved: false, writable: false, reason: "property_contract_gap" };
    const min = Number(prop.min ?? prop.validation?.min);
    const max = Number(prop.max ?? prop.validation?.max);
    const step = Number(prop.step ?? prop.validation?.step);
    const value = Number(prop.value);
    return {
      asset_id: canonical, property_key: prop.property_key, prop, resolved: true,
      value: Number.isFinite(value) ? value : prop.value, unit: prop.unit || "",
      min: Number.isFinite(min) ? min : null, max: Number.isFinite(max) ? max : null,
      step: Number.isFinite(step) && step > 0 ? step : null,
      writable: this.isWritableProperty(prop),
      write_target_entity: prop.write_target_entity || "",
      write_service_domain: prop.write_service_domain || "",
      write_service_action: prop.write_service_action || "",
      authority_entity: prop._source_entity_id || ""
    };
  }

  vehicleChargePowerControlModel(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    // R43.2.54: the vehicle property is the backend-owned delegated proxy. UX
    // reads/writes that exact vehicle property and never resolves a charger-side
    // property as a frontend authority fallback.
    const delegated = this.propertyControlModel(canonical, "vehicle.requested_charge_power_kw");
    return { ...delegated, consumer_asset_id: canonical, authority_asset_id: canonical, delegated: true };
  }

  writePropertyControl(model = {}, value = null) {
    if (!model?.resolved || !model?.prop || !model.writable) return false;
    let next = Number(value);
    if (!Number.isFinite(next)) return false;
    if (Number.isFinite(model.min)) next = Math.max(model.min, next);
    if (Number.isFinite(model.max)) next = Math.min(model.max, next);
    if (Number.isFinite(model.step) && model.step > 0 && Number.isFinite(model.min)) {
      next = model.min + Math.round((next - model.min) / model.step) * model.step;
      next = Number(next.toFixed(6));
    }
    return this.writePropertyValue(model.prop, next);
  }

  propertyByCompoundKey(assetId = "", propertyKey = "") {
    const canonical = this.canonicalAssetId(assetId);
    const wanted = String(propertyKey || "").trim();
    if (!canonical || !wanted) return null;
    const rows = this.propertyRows(canonical);
    return rows.find((r)=>String(r.property_key || "") === wanted || String(r._compound_key || "") === `${canonical}:${wanted}`) || null;
  }

  normalizePropertyRow(row = {}) {
    if (!row || typeof row !== "object") return null;
    const asset_id = row.asset_id || "";
    const asset_type = row.asset_type || (String(asset_id).startsWith("vehicle_") ? "vehicle" : String(asset_id).startsWith("charger_") ? "charger" : String(asset_id).startsWith("person_") ? "person" : "");
    const property_key = String(row.property_key || row.normalized_property || row.fact_type || row.key || "").trim();
    if (!asset_id || !property_key) return null;
    const fact_type = row.fact_type || property_key.split('.').pop();
    return {
      ...row,
      asset_id,
      asset_type,
      property_key,
      fact_type,
      normalized_property: row.normalized_property || property_key,
      value: row.value,
      unit: row.unit ?? row.unit_of_measurement ?? "",
      quality: row.quality || row.health || "Unknown",
      health: row.health || row.quality || "Unknown",
      access: row.access || (this.contractBool(row.editable, false) ? "editable" : "read_only"),
      persistence: row.persistence || "",
      editable: this.contractBool(row.editable, false),
      editor: row.editor || row.editor_type || "",
      validation: this.parseJsonValue(row.validation, row.validation || {}),
      choices: this.parseJsonValue(row.choices, row.choices || null),
      options: this.parseJsonValue(row.options, row.options || null),
      choice_source: row.choice_source || "",
      value_field: row.value_field || "value",
      label_field: row.label_field || "label",
      secondary_label_field: row.secondary_label_field || "secondary_label",
      allow_none: this.contractBool(row.allow_none, false),
      none_value: row.none_value ?? "",
      // V1 write metadata is authoritative. Never manufacture writeability from
      // the mere presence of a target/service binding.
      write_supported: this.contractBool(row.write_supported, false),
      write_binding_type: row.write_binding_type || row.editor || "",
      write_service_domain: row.write_service_domain || "",
      write_service_action: row.write_service_action || "",
      write_target_entity: row.write_target_entity || "",
      write_service_data: this.parseJsonValue(row.write_service_data, row.write_service_data || {}),
      write_value_field: row.write_value_field || row.write_field || "",
      write_command: row.write_command || "",
      family: row.family || row.property_family || row.ux_family || "",
      group: row.group || row.property_group || row.ux_group || "",
      parent: row.parent || row.parent_property || row.parent_key || row.summary_parent || "",
      parent_property: row.parent_property || row.parent || row.parent_key || row.summary_parent || "",
      detail_level: row.detail_level || row.visibility_level || row.ux_detail_level || "",
      logical_entity: row.logical_entity || "",
      display_order: row.display_order ?? row.sort_order ?? row.priority ?? 999,
      display_name: row.display_name || row.label || row.name || "",
      description: row.description || row.help || row.meaning || "",
      icon: row.icon || "",
      semantic_value_type: row.semantic_value_type || row.semantic_type || "",
      value_type: row.value_type || row.type || row.semantic_value_type || row.semantic_type || "",
      importance: row.importance || row.priority_level || ""
    };
  }

  factRows(assetId = "") {
    // R22.8: runtime values come only from typed property indexes.
    // Legacy mobility_fact_index and embedded vehicle/charger facts are not consumed.
    return this.propertyRows(assetId);
  }

  relationshipRows(assetId = "") {
    const canonical = assetId ? this.canonicalAssetId(assetId) : "";
    return this.canonicalRowsFromAttrs("sensor.mobility_relationship_index", ["relationships", "relationship_index", "rows"], "relationships")
      .filter((r) => !canonical || String(r.source_asset_id || r.asset_id || "") === String(canonical) || String(r.target_asset_id || "") === String(canonical));
  }

  relationshipFor(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    if (canonical.startsWith("vehicle_")) return this.vehicleChargerRelationship(canonical);
    const rows = this.relationshipRows(canonical).filter((r) => String(r.source_asset_id || r.asset_id || "") === String(canonical));
    if (!canonical.startsWith("charger_")) return { assigned:"none", connected:"none", effective:"none", selected:"none", row:null };
    const selectedRow = rows.find((r) => String(r.relationship_type || "") === "charger_selected_vehicle") || null;
    const effectiveRow = rows.find((r) => String(r.relationship_type || "") === "charger_effective_assigned_vehicle") || null;
    const connectedRow = rows.find((r) => String(r.relationship_type || "") === "charger_connected_vehicle") || null;
    const valueOf = (row) => this.cleanValue(row?.effective_target_asset_id || row?.target_asset_id || "", "none") || "none";
    const selected = valueOf(selectedRow);
    const effective = valueOf(effectiveRow);
    const connected = valueOf(connectedRow);
    const assigned = selected !== "none" ? selected : effective;
    return {
      assigned, connected, effective, selected,
      assigned_vehicle: assigned,
      connected_vehicle: connected,
      effective_vehicle: effective,
      selected_vehicle: selected,
      relationship_resolution: connectedRow?.resolution_source || effectiveRow?.resolution_source || selectedRow?.resolution_source || "",
      confidence: connectedRow?.confidence || effectiveRow?.confidence || selectedRow?.confidence || "",
      row: effectiveRow || selectedRow || connectedRow || null,
      connected_row: connectedRow,
      effective_row: effectiveRow,
      selected_row: selectedRow
    };
  }

  commandsFor(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    // Authoritative command rule: read only sensor.mobility_command_index.commands,
    // filter by asset_id, hide only frontend_allowed=false, and never infer commands
    // from properties, switches, buttons, locks, numbers or selects.
    return this.commandRegistry(canonical)
      .filter((c) => c && String(c.asset_id || "") === String(canonical))
      .filter((c) => this.contractBool(c.frontend_allowed, true) === true)
      .map((c) => this.withCommandEnumOptions(c))
      .sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.command_key || a.label || "").localeCompare(String(b.command_key || b.label || "")));
  }

  withCommandEnumOptions(command) {
    if (!command || !command.parameter_schema || typeof command.parameter_schema !== "object") return command;
    const out = { ...command, enum_options: {} };
    for (const [paramName, schema] of Object.entries(command.parameter_schema || {})) {
      if (!schema || typeof schema !== "object" || String(schema.type || "").toLowerCase() !== "enum") continue;
      const options = this.commandEnumOptions(schema);
      out.enum_options[paramName] = options;
    }
    return out;
  }

  commandEnumOptions(schema = {}) {
    const source = String(schema.source || "").trim();
    if (!source) return [];
    const valueField = schema.value_field || "value";
    const labelField = schema.label_field || "label";
    const rows = this.canonicalRowsFromAttrs(source, ["profiles", "chargers", "assets", "rows", "options"], `enum:${source}`);
    return rows
      .map((row) => ({
        value: row?.[valueField] ?? row?.asset_id ?? row?.profile_id ?? row?.id ?? "",
        label: row?.[labelField] ?? row?.display_name ?? row?.short_name ?? row?.name ?? row?.asset_id ?? row?.profile_id ?? ""
      }))
      .filter((o) => String(o.value || "").trim())
      .sort((a,b)=>String(a.label || a.value).localeCompare(String(b.label || b.value)));
  }

  commandFamily(command) {
    return this.resolvedCommandFamily(command);
  }

  commandsByFamily(assetId) {
    const grouped = new Map();
    this.commandsFor(assetId)
      .filter((cmd) => cmd && cmd.frontend_allowed !== false)
      .forEach((cmd) => {
        const family = this.commandFamily(cmd) || `__${String(cmd.command_id || cmd.label || "command").toLowerCase()}`;
        if (!grouped.has(family)) grouped.set(family, []);
        grouped.get(family).push(this.completeCommandIntent(cmd, assetId));
      });
    for (const [family, rows] of grouped.entries()) {
      grouped.set(family, rows.filter(Boolean).sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.label || "").localeCompare(String(b.label || ""))));
    }
    return grouped;
  }

  commandFromFamily(assetId, family, orderedIds = []) {
    const rows = this.commandsByFamily(assetId).get(String(family || "").toLowerCase()) || [];
    if (!rows.length) return null;
    for (const id of orderedIds) {
      const wanted = this.norm(id);
      const found = rows.find((cmd) => this.norm(cmd.command_id) === wanted);
      if (found) return found;
    }
    return rows.find((cmd) => this.commandUsable(cmd)) || rows[0] || null;
  }

  commandActionRank(command = {}) {
    const id = String(command.command_key || command.command_id || command.label || "").toLowerCase();
    const family = this.resolvedCommandFamily(command);
    const group = String(command.command_group || "").toLowerCase();
    const role = String(command.command_role || "").toLowerCase();
    const familyRank = { charging: 10, climate: 20, security: 30, access: 30, maintenance: 70, diagnostics: 75, vehicle: 80, charger: 80, overview: 90 };
    let actionRank = 50;
    if (id.includes("stop") || role.includes("stop")) actionRank = 10;
    else if (id.includes("pause")) actionRank = 15;
    else if (id.includes("start") || id.includes("force") || id.includes("resume")) actionRank = 20;
    else if (id.includes("toggle")) actionRank = 30;
    else if (id.includes("unlock")) actionRank = 35;
    else if (id.includes("lock")) actionRank = 40;
    else if (id.includes("restart")) actionRank = 70;
    else if (id.includes("identify") || id.includes("locate")) actionRank = 75;
    else if (id.includes("availability")) actionRank = 85;
    return [familyRank[family] ?? 60, actionRank, Number(command.sort_order ?? 999), group, id].join("|");
  }

  commandInteraction(command = {}) {
    const schema = command?.parameter_schema && typeof command.parameter_schema === "object" ? command.parameter_schema : {};
    const parameters = Object.entries(schema).map(([name, definition]) => ({
      name,
      ...(definition && typeof definition === "object" ? definition : {}),
      required: this.contractBool(definition?.required, false) === true
    }));
    const required = parameters.filter((parameter) => parameter.required);
    if (!required.length) return { mode: "immediate", parameters, required, supported: true, reason: "" };
    const supported = required.every((parameter) => {
      const type = String(parameter.type || "").toLowerCase();
      if (type !== "enum") return false;
      return this.commandEnumOptions(parameter).length > 0 || (Array.isArray(parameter.values) && parameter.values.length > 0);
    });
    return {
      mode: "form",
      parameters,
      required,
      supported,
      reason: supported ? "" : "Required command parameters are not supported by this control surface"
    };
  }

  commandSlotContract(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const entityId = canonical.startsWith("charger_")
      ? "sensor.mobility_charger_command_slot_index"
      : canonical.startsWith("vehicle_")
        ? "sensor.mobility_vehicle_command_slot_index"
        : "";
    if (!entityId || !this.entity(entityId)) return null;
    const attrs = this.entity(entityId)?.attributes || {};
    const actionKey = canonical.startsWith("charger_") ? "charger_actions" : "vehicle_actions";

    // Same slot owner; accept object/JSON transport forms only.
    for (const attrName of ["slots_by_asset", "slots_by_asset_json"]) {
      const byAsset = this.parseJsonValue(attrs[attrName], attrs[attrName] || {});
      if (byAsset && typeof byAsset === "object" && !Array.isArray(byAsset) && byAsset[canonical]) return byAsset[canonical];
    }

    for (const attrName of [actionKey, `${actionKey}_json`]) {
      const directActions = this.parseJsonValue(attrs[attrName], attrs[attrName] || null);
      if (directActions && typeof directActions === "object") {
        if (!Array.isArray(directActions) && directActions[canonical]) return { asset_id: canonical, [actionKey]: directActions[canonical] };
        if (!Array.isArray(directActions) && Array.isArray(directActions.commands)) {
          const owned = directActions.commands.filter((row)=>!row?.asset_id || this.canonicalAssetId(row.asset_id) === canonical);
          if (owned.length) return { asset_id: canonical, [actionKey]: { ...directActions, commands: owned } };
        }
      }
    }

    for (const attrName of ["slots_json", "slots", "rows", "rows_json"]) {
      const rows = this.parseJsonValue(attrs[attrName], attrs[attrName] || []);
      if (!Array.isArray(rows)) continue;
      const row = rows.find((entry)=>this.canonicalAssetId(entry?.asset_id || "") === canonical) || null;
      if (row) return row;
    }
    return null;
  }

  commandSlotRowsForSurface(assetId = "", surface = "quick_actions") {
    const canonical = this.canonicalAssetId(assetId);
    const slot = this.commandSlotContract(canonical);
    if (!slot) return null;
    const actionKey = canonical.startsWith("charger_") ? "charger_actions" : canonical.startsWith("vehicle_") ? "vehicle_actions" : "";
    if (!actionKey) return null;

    // R43.2.54: <asset_actions>.commands is one semantic placement container. Merge
    // only structural serializations of that exact container, then deduplicate. The
    // former first-array-wins parser could silently reduce four charger actions to
    // START/STOP when another serialization was only partially materialized.
    const candidates = [];
    if (canonical.startsWith("vehicle_") && surface === "quick_actions") candidates.push(slot.quick_actions);
    const nested = this.parseJsonValue(slot[actionKey], slot[actionKey] || null);
    if (nested && typeof nested === "object" && !Array.isArray(nested)) candidates.push(nested.commands);
    candidates.push(slot[`${actionKey}.commands`]);
    const cardSections = this.parseJsonValue(slot.card_sections, slot.card_sections || null);
    if (cardSections && typeof cardSections === "object" && !Array.isArray(cardSections)) {
      candidates.push(cardSections[`${actionKey}.commands`]);
      const section = this.parseJsonValue(cardSections[actionKey], cardSections[actionKey] || null);
      if (section && typeof section === "object" && !Array.isArray(section)) candidates.push(section.commands);
    }

    const commands = [];
    const seen = new Set();
    for (const candidate of candidates) {
      if (candidate === undefined || candidate === null || candidate === "") continue;
      const parsed = this.parseJsonValue(candidate, null);
      if (!Array.isArray(parsed)) continue;
      for (const row of parsed) {
        const key = typeof row === "string" ? row : String(row?.command_id || row?.command_key || row?.id || "");
        if (!key || seen.has(key)) continue;
        seen.add(key);
        commands.push(row);
      }
    }

    if (["quick_actions", "operational", actionKey].includes(surface)) return commands;
    const wanted = this.norm(surface);
    return commands.filter((row)=>{
      const explicit = [row?.surface, row?.surface_id, row?.section_id, row?.placement, row?.component_id && row?.section_id ? `${row.component_id}.${row.section_id}` : ""]
        .filter(Boolean).map((value)=>this.norm(value));
      return explicit.includes(wanted);
    });
  }

  commandsForSurface(assetId = "", surface = "operational") {
    const canonical = this.canonicalAssetId(assetId);
    const slotRows = this.commandSlotRowsForSurface(canonical, surface);
    if (slotRows === null) return [];

    // R43.2.54: placement comes only from the slot index; readiness/invoke comes only
    // from sensor.mobility_command_index. A placed command with a missing command row
    // remains visible but fail-closed as a contract gap.
    const commands = this.uiCommandSurface(canonical).map((command)=>this.completeCommandIntent(command, canonical)).filter(Boolean);
    const byId = new Map(commands.map((cmd)=>[String(cmd.command_id || ""), cmd]));
    const byKey = new Map(commands.map((cmd)=>[String(cmd.command_key || ""), cmd]));
    const seen = new Set();
    return slotRows.map((slot)=>{
      const rawPlacement = typeof slot === "string" ? { command_id: slot, command_key: slot } : (slot || {});
      const slotId = String(rawPlacement.command_id || rawPlacement.id || rawPlacement.command || "");
      const slotKey = String(rawPlacement.command_key || rawPlacement.key || rawPlacement.command || "");
      // R43.2.54 owner separation: slot rows are placement only. Even when an older
      // compatibility serialization still carries readiness/invoke fields, UX must
      // ignore them so they cannot override sensor.mobility_command_index.
      const placement = {
        command_id: slotId,
        command_key: slotKey,
        surface: rawPlacement.surface || rawPlacement.surface_id || "",
        section_id: rawPlacement.section_id || "",
        component_id: rawPlacement.component_id || "",
        display_order: rawPlacement.display_order ?? rawPlacement.order ?? null,
        primary_action: this.contractBool(rawPlacement.primary_action, false)
      };
      const command = byId.get(slotId) || byKey.get(slotKey) || byId.get(slotKey) || byKey.get(slotId);
      if (command) return { ...command, ...placement, command_id: command.command_id || slotId, command_key: command.command_key || slotKey };
      if (!slotId && !slotKey) return null;
      return {
        ...placement,
        asset_id: canonical,
        command_id: slotId || slotKey,
        command_key: slotKey || slotId,
        label: this.titleize(slotId || slotKey),
        frontend_allowed: true,
        execution_allowed: false,
        execution_reason: "Backend contract gap: placed command missing from mobility_command_index"
      };
    }).filter((command)=>{
      if (!command || this.contractBool(command.frontend_allowed, true) === false) return false;
      const key = String(command.command_id || command.command_key || "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map((command)=>{
      const interaction = this.commandInteraction(command);
      const enumOptions = {};
      for (const parameter of interaction.required) {
        if (String(parameter.type || "").toLowerCase() !== "enum") continue;
        const sourced = this.commandEnumOptions(parameter);
        enumOptions[parameter.name] = sourced.length ? sourced : (parameter.values || []).map((value)=>({ value, label:this.titleize(value) }));
      }
      return { ...command, interaction_mode:interaction.mode, interaction_supported:interaction.supported, interaction_reason:interaction.reason, required_parameters:interaction.required.map((parameter)=>parameter.name), enum_options:enumOptions };
    });
  }

  unifiedCommandsFor(assetId, surface = "operational") {
    // Compatibility method retained for callers, but semantics are now identical to
    // the R43.2.54 slot-owned command surface. No family/category filtering exists.
    return this.commandsForSurface(assetId, surface);
  }

  controlsFor(assetId = "") {
    // Public typed model: write controls are exposed on property rows as write_command.
    return [];
  }

  controlEntity(assetId, field, fallback = "") {
    const canonical = this.canonicalAssetId(assetId);
    const prop = this.propertyRows(canonical).find((p) => {
      const ft = String(p.fact_type || "");
      const pk = String(p.property_key || "");
      return ft === String(field) || pk === String(field) || pk.endsWith(`.${field}`);
    });
    if (prop?.write_command) return prop.write_command;
    const row = this.controlsFor(canonical).find((c) => String(c.field || c.control_id || c.id || "") === String(field));
    return row?.entity_id || row?.value_entity || fallback;
  }

  factTypeAliases(field, assetId = "") {
    return this.propertyKeyCandidates(assetId, field);
  }

  factContractRow(assetId, field) {
    const canonical = this.canonicalAssetId(assetId);
    const wanted = this.factTypeAliases(field, canonical);
    for (const key of wanted) {
      const direct = this.propertyByCompoundKey(canonical, key);
      if (direct) return direct;
    }
    const rows = this.factRows(canonical);
    for (const factType of wanted) {
      const wantedPlain = String(factType || "").replace(/^(vehicle|charger|person|asset)\./, "");
      const row = rows.find((f) => {
        const t = String(f.fact_type || f.field || "");
        const pk = String(f.property_key || f.normalized_property || "");
        const pkPlain = pk.replace(/^(vehicle|charger|person|asset)\./, "");
        return t === factType || t === wantedPlain || pk === factType || pkPlain === wantedPlain || pk.endsWith(`.${wantedPlain}`);
      });
      if (row) return row;
    }
    return null;
  }

  compatibilityFactRow(assetId) {
    // R22.8: embedded compatibility facts are transitional and forbidden for UX runtime values.
    return null;
  }

  factEntity(assetId, field) {
    const canonicalFact = this.factContractRow(assetId, field);
    return canonicalFact?.entity_id || "";
  }


  factContractValue(assetId, field, fallback = "") {
    const canonicalFact = this.factContractRow(assetId, field);
    if (!canonicalFact) return fallback;
    const value = canonicalFact.value;
    if (value === undefined || value === null) return fallback;
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return String(value);
    const s = String(value).trim();
    if (s === "") return fallback;
    const lower = s.toLowerCase();
    // A published property row is meaningful even when the backend explicitly says
    // unknown/unavailable/degraded. Do not hide it as if the contract row was missing.
    if (["unknown", "unavailable", "none", "null", "undefined", "nan", "invalid"].includes(lower)) {
      if (fallback === "—" || fallback === "") return "Unknown";
      return lower === "none" ? "None" : "Unknown";
    }
    return s;
  }


  factValue(assetId, field, fallback = "") {
    return this.factContractValue(assetId, field, fallback);
  }


  factEntityExists(assetId, field) {
    return !!this.factContractRow(assetId, field);
  }


  displayFactValue(assetId, field, fallback = "Not available") {
    const row = this.factContractRow(assetId, field);
    if (!row) return fallback;
    return this.factContractValue(assetId, field, fallback);
  }


  numberValue(entityId) {
    const raw = this.state(entityId, "");
    if (raw === "") return null;
    const n = Number(String(raw).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  factNumber(assetId, field) {
    const v = this.factContractValue(assetId, field, "");
    if (v === "") return null;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }


  completeCommandIntent(command, assetId = "") {
    if (!command) return null;
    const completed = { ...command };
    const canonical = assetId ? this.canonicalAssetId(assetId) : (completed.asset_id || "");
    if (!completed.asset_id && canonical) completed.asset_id = canonical;
    if (!completed.parameter_schema && typeof completed.parameter_schema_json === "string" && completed.parameter_schema_json.trim()) {
      const parsed = this.parseJsonValue(completed.parameter_schema_json, null);
      if (parsed && typeof parsed === "object") completed.parameter_schema = parsed;
    }
    return completed;
  }

  selectCommand(assetId, ids = []) {
    const canonical = this.canonicalAssetId(assetId);
    const commands = this.commandsFor(canonical).filter((c) => c.frontend_allowed !== false);
    for (const wanted of ids) {
      const normWanted = this.norm(wanted);
      const found = commands.find((cmd) => {
        const parts = [cmd.command_id, cmd.command_key, cmd.command_group, cmd.command_role, cmd.current_state_property, cmd.label].filter(Boolean).map((v)=>this.norm(v));
        return parts.includes(normWanted) || parts.some((p)=>p.endsWith(normWanted));
      });
      if (found) return this.completeCommandIntent(found, canonical);
    }
    return null;
  }

  vehicleCommandSafetyState(command) {
    // R41.5: vehicle charging proxy availability is owned by the backend command row.
    // UX must not locally disable vehicle charging actions by inspecting relationships.
    // If backend cannot bind the proxy, it must publish frontend_allowed=false or execution_allowed=false.
    return { disabled: false, reason: "" };
  }

  commandUsable(command) {
    if (!command || this.contractBool(command.frontend_allowed, true) === false) return false;
    return this.contractBool(command.execution_allowed, false) === true;
  }

  commandState(command) {
    // Command index row is authoritative. Do not inspect capability/status helper entities here.
    const status = command?.execution_status || command?.ui_state || command?.effective_availability || "";
    const reason = command?.blocked_reason || command?.execution_reason || command?.disabled_reason || "";
    const lower = String(status).toLowerCase();
    const frontendHidden = !command || this.contractBool(command.frontend_allowed, true) === false;
    const executionAllowed = this.contractBool(command?.execution_allowed, false) === true;
    const hasServiceCall = !!(command?.service_domain && command?.service_action);
    const missingExecutor = executionAllowed && !hasServiceCall;
    const unsupportedInteraction = command?.interaction_mode === "form" && command?.interaction_supported === false;
    return {
      disabled: frontendHidden || !executionAllowed || missingExecutor || unsupportedInteraction,
      busy: lower.includes("running") || lower.includes("pending") || lower.includes("queued") || lower.includes("in_progress"),
      failed: lower.includes("failed") || lower.includes("blocked") || lower.includes("unavailable") || lower.includes("error"),
      status,
      reason: reason || (unsupportedInteraction ? (command?.interaction_reason || "Required command parameters are not supported") : (missingExecutor ? "No executable service metadata published by command contract" : (!executionAllowed ? "Execution not allowed by command contract" : "")))
    };
  }

  commandVisibilityReport(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    return this.commandRegistry(canonical).map((cmd) => {
      const st = this.commandState(cmd);
      const hidden = cmd.frontend_allowed === false ? "frontend_allowed=false" : (this.isConfigurationCommand(cmd) ? "configuration-setting-command" : "visible");
      return {
        asset_id: cmd.asset_id || canonical,
        command_key: cmd.command_key || cmd.command_id || "",
        family: cmd.command_family || "",
        frontend_allowed: String(cmd.frontend_allowed !== false),
        execution_allowed: String(cmd.execution_allowed === true),
        render_decision: hidden === "visible" ? (st.disabled ? "visible_disabled" : "visible_enabled") : "hidden",
        reason: hidden === "visible" ? (st.reason || cmd.execution_reason || "") : hidden
      };
    });
  }

  normalizeRuntimeChargingStatus(value) {
    const s = String(value || "").trim();
    const l = s.toLowerCase();
    if (!s || ["unknown", "unavailable", "none", "null", "undefined", "empty_snapshots", "invalid"].includes(l)) return "Unknown";
    if (l === "off") return "Off";
    if (l === "on") return "On";
    if (l.includes("charging")) return "Charging";
    if (l.includes("connected") || l.includes("plugged")) return "Connected";
    return s;
  }

  chargingActive(status, power = null) {
    const l = String(status || "").toLowerCase();
    return l === "charging" || l.includes("charging now") || (power !== null && Number.isFinite(Number(power)) && Math.abs(Number(power)) > 0.05);
  }

  canonicalPropertyValue(assetId = "", propertyKey = "") {
    const canonical = this.canonicalAssetId(assetId);
    const row = this.propertyByCompoundKey(canonical, propertyKey);
    if (!row) return { resolved:false, value:"", row:null, reason:`${propertyKey} contract gap` };
    const value = this.cleanValue(row.value, "");
    if (value === "" || value === null || value === undefined) return { resolved:false, value:"", row, reason:`${propertyKey} missing value` };
    return { resolved:true, value:String(value).trim(), row, reason:"" };
  }

  canonicalPropertyDisplay(assetId = "", propertyKey = "", fallback = "—") {
    const prop = this.canonicalPropertyValue(assetId, propertyKey);
    if (!prop.resolved) return fallback;
    return this.formatValue(prop.value, prop.row?.unit || "", propertyKey);
  }

  canonicalChargerPropertyValue(assetId = "", propertyKey = "") {
    return this.canonicalPropertyValue(assetId, propertyKey);
  }

  canonicalChargerPropertyDisplay(assetId = "", propertyKey = "", fallback = "—") {
    // Exact-owner display helper. This intentionally does not use displayFactValue()
    // because that resolver supports historical aliases for non-cutover surfaces.
    const prop = this.canonicalChargerPropertyValue(assetId, propertyKey);
    if (!prop.resolved) return fallback;
    const row = prop.row || {};
    return this.formatValue(prop.value, row.unit || "", propertyKey);
  }

  chargerProductSnapshot(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const cacheKey = `chargerProductSnapshot:${canonical}`;
    if (this._memo.has(cacheKey)) return this._memo.get(cacheKey);
    const exact = (propertyKey) => this.canonicalChargerPropertyValue(canonical, propertyKey);
    const operating = exact("charger.operating_state");
    const connection = exact("charger.connection_state");
    const power = exact("charger.power_kw");
    const health = exact("charger.health");
    const healthReason = exact("charger.health_reason");
    const relationship = this.relationshipFor(canonical);
    const connectedRaw = String(relationship?.connected_vehicle || relationship?.connected || "").trim();
    const hasConnectedVehicle = !!connectedRaw && !["none", "unknown", "unavailable", "null", "undefined", "—"].includes(connectedRaw.toLowerCase());
    const vehicleId = hasConnectedVehicle ? this.canonicalAssetId(connectedRaw.startsWith("vehicle_") ? connectedRaw : `vehicle_${connectedRaw.replace(/^vehicle_/, "")}`) : "";
    const vehicleEntry = vehicleId ? (this.vehicleById(vehicleId) || this.assetById(vehicleId)) : null;
    const connectionRaw = connection.resolved ? String(connection.value).trim().toLowerCase() : "";
    const connectionDisplay = !connection.resolved ? "—" : (["connected", "asset_connected"].includes(connectionRaw) ? "Connected" : (["disconnected", "no_asset_connected"].includes(connectionRaw) ? "Disconnected" : this.titleize(connection.value)));
    const healthDisplay = health.resolved ? this.titleize(health.value) : "—";
    const reasonDisplay = healthReason.resolved && !["none", "ok", ""].includes(String(healthReason.value || "").toLowerCase()) ? this.titleize(healthReason.value) : "";
    const snapshot = {
      asset_id: canonical,
      operating: { ...operating, display: operating.resolved ? this.chargerOperatingStateDisplay(operating.value) : "—" },
      connection: { ...connection, display: connectionDisplay },
      power: { ...power, display: power.resolved ? this.formatValue(power.value, power.row?.unit || "kW", "charger.power_kw") : "—" },
      health: { ...health, display: healthDisplay, reason: reasonDisplay, reason_resolved: healthReason.resolved },
      connected_vehicle: { resolved: hasConnectedVehicle, asset_id: vehicleId, display: hasConnectedVehicle ? (vehicleEntry?.display_name || this.vehicleLabel(vehicleId)) : "—", relationship }
    };
    this._memo.set(cacheKey, snapshot);
    return snapshot;
  }


  chargerOperatingStateDisplay(value = "") {
    const raw = String(value || "").trim();
    const state = raw.toLowerCase();
    const labels = {
      idle:"Idle",
      stopped:"Stopped",
      running:"Charging",
      suspended:"Suspended",
      preparing:"Preparing",
      fault:"Fault",
      unknown:"Unknown"
    };
    return labels[state] || this.titleize(raw);
  }

  chargerOperationalStatus(assetId = "") {
    return this.chargerProductSnapshot(assetId).operating.display;
  }

  chargerConnectionState(assetId = "") {
    return this.chargerProductSnapshot(assetId).connection.display;
  }

  chargerConnectedVehicleLabel(assetId = "") {
    return this.chargerProductSnapshot(assetId).connected_vehicle.display;
  }

  physicalVehicleForCharger(assetId = "") {
    const connected = this.chargerProductSnapshot(assetId).connected_vehicle;
    if (!connected.resolved) return { assetId:"", displayName:"", detailRoute:"" };
    const entry = this.vehicleById(connected.asset_id) || this.assetById(connected.asset_id);
    return { assetId:connected.asset_id, displayName:connected.display, detailRoute:this.assetDetailRoute(entry || connected.asset_id) };
  }

  chargerHealthSummary(assetId = "") {
    const health = this.chargerProductSnapshot(assetId).health;
    return { value:health.display, reason:health.reason, resolved:health.resolved };
  }

  chargerCanonicalStatusTiles(assetId = "", vehicleTile = {}) {
    const snapshot = this.chargerProductSnapshot(assetId);
    const statusValue = snapshot.operating.display;
    const connectionValue = snapshot.connection.display;
    const connectedVehicle = snapshot.connected_vehicle.display;
    return [
      { label:"Status", value:statusValue, subvalue:snapshot.operating.resolved ? "Canonical operating state" : snapshot.operating.reason, icon:"mdi:ev-station", tone: !snapshot.operating.resolved ? "neutral" : (this.chargerStatusToneLabel(statusValue) === "red" ? "error" : this.chargerStatusToneLabel(statusValue) === "amber" ? "attention" : "neutral") },
      { label:"Connection", value:connectionValue, subvalue:snapshot.connection.resolved ? "Physical connection" : snapshot.connection.reason, icon:"mdi:ev-plug-type2", tone: connectionValue === "Connected" ? "active" : "neutral" },
      { label:"Power", value:snapshot.power.display, subvalue:snapshot.power.resolved ? "Actual canonical power" : snapshot.power.reason, icon:"mdi:flash", tone: snapshot.power.resolved && Number(snapshot.power.value) > 0.05 ? "active" : "neutral" },
      { label:"Vehicle", value:connectedVehicle === "—" ? "No vehicle connected" : connectedVehicle, subvalue:snapshot.connected_vehicle.resolved ? "Physical relationship" : "No physical vehicle relationship", icon:"mdi:car-electric", tone:snapshot.connected_vehicle.resolved ? "active" : "neutral", detailRoute:snapshot.connected_vehicle.resolved ? (vehicleTile.detailRoute || "") : "", detailTitle:vehicleTile.detailTitle || "Open vehicle details" },
      { label:"Health", value:snapshot.health.display, subvalue:snapshot.health.reason, icon:"mdi:shield-check-outline", tone:snapshot.health.resolved && String(snapshot.health.display).toLowerCase() === "ok" ? "active" : (snapshot.health.resolved ? "attention" : "neutral") }
    ];
  }

  chargerStatusToneLabel(value = "") {
    const l = String(value || "").toLowerCase();
    if (l.includes("running") || l.includes("charging")) return "green";
    if (["idle", "stopped", "suspended"].some((s)=>l.includes(s))) return "green";
    if (l.includes("fault") || l.includes("error")) return "red";
    if (l.includes("unavailable") || l.includes("unknown") || l === "—") return "amber";
    return "green";
  }


  relatedVehicleForCharger(assetId = "") {
    const canonical = this.canonicalAssetId(assetId);
    const rel = this.relationshipFor(canonical);
    const isReal = (value) => {
      const v = String(value || "").trim();
      return !!v && !["none", "unknown", "unavailable", "null", "undefined", "—"].includes(v.toLowerCase());
    };
    // Navigation may use the effective/selected relationship when physically disconnected,
    // but the displayed connection badge/connected-vehicle pill never does.
    const raw = [rel.connected_vehicle, rel.effective_vehicle, rel.assigned_vehicle, rel.connected, rel.effective, rel.assigned].find(isReal) || "";
    const vehicleId = raw ? this.canonicalAssetId(String(raw).startsWith("vehicle_") ? raw : `vehicle_${String(raw).replace(/^vehicle_/, "")}`) : "";
    const entry = vehicleId ? (this.vehicleById(vehicleId) || this.assetById(vehicleId)) : null;
    const displayName = entry?.display_name || (vehicleId ? this.vehicleLabel(vehicleId) : "");
    const detailRoute = vehicleId ? this.assetDetailRoute(entry || vehicleId) : "";
    return { assetId: vehicleId, displayName, detailRoute };
  }

  addRelatedAssetDetailLinks(sections = [], context = {}) {
    const chargerRoute = String(context.chargerDetailRoute || "");
    const chargerDisplay = String(context.chargerDisplay || "");
    const vehicleRoute = String(context.vehicleDetailRoute || "");
    const vehicleDisplay = String(context.vehicleDisplay || "");
    const decorateRow = (row) => {
      if (!row || typeof row !== "object" || row.detailRoute) return row;
      const label = String(row.label || "").toLowerCase();
      const value = String(row.value || "").trim();
      const isMissing = !value || ["—", "none", "unknown", "unavailable", "not available"].includes(value.toLowerCase());
      if (isMissing) return row;
      if (chargerRoute && (label.includes("active charger") || label.includes("connected charger") || label === "charger" || label.includes("effective charger"))) {
        return { ...row, detailRoute: chargerRoute, detailTitle: `Open ${chargerDisplay || "charger"} details` };
      }
      if (vehicleRoute && (label.includes("active vehicle") || label.includes("connected vehicle") || label === "vehicle" || label.includes("effective vehicle"))) {
        return { ...row, detailRoute: vehicleRoute, detailTitle: `Open ${vehicleDisplay || "vehicle"} details` };
      }
      return row;
    };
    return (sections || []).map((section) => section && typeof section === "object" ? {
      ...section,
      rows: (section.rows || []).map(decorateRow)
    } : section);
  }

  commandActionsFor(assetId, surface = "operational") {
    return this.commandsForSurface(assetId, surface);
  }

  liveChargerInfo(chargerAssetOrId) {
    const assetId = this.canonicalAssetId(typeof chargerAssetOrId === "string" ? chargerAssetOrId : chargerAssetOrId?.asset_id || "");
    if (!assetId) return { active:false, status:"—", power:null, current:null, evidence:"contract_gap" };
    const snapshot = this.chargerProductSnapshot(assetId);
    const current = this.canonicalChargerPropertyValue(assetId, "charger.actual_current_a");
    const power = snapshot.power.resolved && Number.isFinite(Number(snapshot.power.value)) ? Number(snapshot.power.value) : null;
    const operatingState = snapshot.operating.resolved ? String(snapshot.operating.value).toLowerCase() : "";
    return {
      active: operatingState === "running",
      status: snapshot.operating.display,
      power,
      current: current.resolved && Number.isFinite(Number(current.value)) ? Number(current.value) : null,
      evidence: snapshot.operating.resolved || snapshot.power.resolved ? "canonical_charger_property_index" : "contract_gap"
    };
  }

  vehicleChargePowerControl(vehicleAssetOrId) {
    const assetId = typeof vehicleAssetOrId === "string" ? this.canonicalAssetId(vehicleAssetOrId) : this.canonicalAssetId(vehicleAssetOrId?.asset_id || "");
    if (!assetId) return { value: null, display: "—", unit: "kW", property: null, entity: "", intent: "", visible: false, executable: false };
    const model = this.vehicleChargePowerControlModel(assetId);
    const prop = model?.prop || null;
    const value = model?.resolved && Number.isFinite(Number(model.value)) ? Number(model.value) : null;
    const display = value === null ? "—" : this.formatValue(Number.isInteger(value) ? String(value) : String(Number(value).toFixed(2)).replace(/\.00$/, ""), model?.unit || "kW", prop?.property_key || "charger.requested_charge_power_kw");
    return {
      value, display, unit: model?.unit || "kW", property: prop,
      entity: model?.write_target_entity || "", intent: "", visible: !!model?.resolved,
      executable: !!model?.writable,
      min: model?.min, max: model?.max, step: model?.step, authority_asset_id: model?.authority_asset_id || ""
    };
  }

  liveChargingContextForVehicle(vehicleAssetOrId) {
    const assetId = this.canonicalAssetId(typeof vehicleAssetOrId === "string" ? vehicleAssetOrId : vehicleAssetOrId?.asset_id || "");
    if (!assetId) return { active:false, status:"—", rawStatus:"", reason:"contract_gap", power:null, current:null, detail:"Charging context unavailable.", assigned:"", effective_charger:"", physical_charger:"", charger:null, chargerEvidence:"contract_gap", statusEntity:"" };
    const rel = this.vehicleChargerRelationship(assetId);
    const isReal = (value) => {
      const v = String(value || "").trim();
      return !!v && !["none","unknown","unavailable","null","undefined","—"].includes(v.toLowerCase());
    };
    const physicalId = isReal(rel.connected) ? this.canonicalAssetId(rel.connected) : "";
    const effectiveId = isReal(rel.effective) ? this.canonicalAssetId(rel.effective) : "";
    const chargerId = physicalId || effectiveId;
    const charger = chargerId ? (this.chargerById(chargerId) || { asset_id:chargerId }) : null;
    const snapshot = chargerId ? this.chargerProductSnapshot(chargerId) : null;
    const status = physicalId && snapshot?.operating?.resolved ? snapshot.operating.display : (physicalId ? "—" : "Not connected");
    const power = physicalId && snapshot?.power?.resolved && Number.isFinite(Number(snapshot.power.value)) ? Number(snapshot.power.value) : null;
    const active = physicalId && snapshot?.operating?.resolved && String(snapshot.operating.value).toLowerCase() === "running";
    return {
      active,
      status,
      rawStatus: snapshot?.operating?.resolved ? String(snapshot.operating.value) : "",
      reason: snapshot?.operating?.reason || "",
      power,
      current:null,
      detail: physicalId ? "Physical charger context from relationship_index and canonical charger properties." : "No physical charger relationship published.",
      assigned: effectiveId,
      effective_charger: effectiveId,
      physical_charger: physicalId,
      charger,
      chargerEvidence: physicalId ? "relationship_index+charger_property_index" : "relationship_index",
      statusEntity:""
    };
  }

  vehicleChargingInfo(vehicleAssetOrId) {
    return this.liveChargingContextForVehicle(vehicleAssetOrId);
  }

  assetViewModel(assetId) {
    const canonical = this.canonicalAssetId(assetId);
    const asset = this.assetById(canonical, canonical.startsWith("vehicle_") ? "vehicle" : canonical.startsWith("charger_") ? "charger" : "all") || this.registryEntry(canonical) || { asset_id: canonical };
    const facts = canonical.startsWith("vehicle_") ? { charging: this.liveChargingContextForVehicle(canonical) } : { charging: this.liveChargerInfo(canonical) };
    return {
      asset,
      asset_id: canonical,
      facts,
      relationship: canonical.startsWith("vehicle_") ? this.relationshipFor(canonical) : {},
      commands: this.commandsFor(canonical),
      controls: this.controlsFor(canonical),
      outcome: {
        status: this.supervisorOutcome(canonical, "status", this.assetStatus(canonical, "status", "Unknown")),
        trust: this.supervisorOutcome(canonical, "trust", this.assetStatus(canonical, "trust", "Unknown")),
        attention: this.supervisorOutcome(canonical, "attention", this.assetStatus(canonical, "attention", "None")),
        opportunity: this.supervisorOutcome(canonical, "opportunity", this.assetStatus(canonical, "opportunity", "None")),
        recommended_action: this.supervisorOutcome(canonical, "recommended_action", this.assetStatus(canonical, "recommended_action", "none"))
      }
    };
  }

  entity(entityId) {
    const id = String(entityId || "").trim();
    if (!id) return undefined;
    // UX consumption contract R22.11.9: all runtime/identity/selector reads
    // must go through the approved public Mobility indexes only.
    // This prevents accidental candidate/fact/adapter/diagnostics/raw entity fallback.
    if (!this.isAllowedContractEntity(id)) return undefined;
    return this.hass?.states?.[id];
  }

  exists(entityId) {
    return !!this.entity(entityId);
  }

  jsonAttr(entityId, attr, fallback = []) {
    const entity = this.entity(entityId);
    const raw = entity?.attributes?.[attr];
    const result = { ok: false, value: fallback, raw, error: "", exists: !!entity, attr_exists: raw !== undefined };
    if (!entity) { result.error = `Entity ${entityId} not found`; return result; }
    if (typeof raw !== "string" || !raw.trim()) { result.error = `Attribute ${attr} missing or not a JSON string`; return result; }
    try { result.value = JSON.parse(raw); result.ok = true; return result; }
    catch (e) { result.error = String(e?.message || e); return result; }
  }

  state(entityId, fallback = "") {
    const raw = this.entity(entityId)?.state;
    if (raw === undefined || raw === null) return fallback;
    const s = String(raw).trim();
    if (!s || ["unknown", "unavailable", "none", "null", "undefined"].includes(s.toLowerCase())) return fallback;
    return s;
  }

  cleanState(entityId, fallback = "") {
    const s = this.state(entityId, fallback);
    if (String(s).toLowerCase() === "none") return fallback;
    return s;
  }

  cleanValue(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    if (Array.isArray(value)) return value.length ? String(value[0] ?? "").trim() : fallback;
    if (typeof value === "object") {
      const candidate = value.asset_id ?? value.id ?? value.value ?? value.state ?? value.display_name ?? value.name;
      return this.cleanValue(candidate, fallback);
    }
    const s = String(value).trim();
    if (!s || ["unknown", "unavailable", "none", "null", "undefined", "nan"].includes(s.toLowerCase())) return fallback;
    return s;
  }

  firstCleanState(candidates = [], fallback = "") {
    for (const entityId of (candidates || []).filter(Boolean)) {
      const v = this.cleanState(entityId, "");
      if (v !== "") return this.normalizeOutcomeValue(key, v, fallback || "Unknown");
    }
    return fallback;
  }

  indexedEntity(assetId, indexAttrName, fieldName) {
    const canonical = this.canonicalAssetId(assetId);
    const rows = this.indexAttr(indexAttrName, []);
    const row = rows.find((r) => String(r?.asset_id || "") === canonical);
    return row?.[fieldName] || "";
  }

  assetStatus(assetId, statusName, fallback = "Unknown") {
    const canonical = this.canonicalAssetId(assetId);
    const mapped = {
      operational_status: "status",
      availability_status: "status",
      data_freshness_status: "data_freshness",
      trust_status: "trust"
    }[statusName] || statusName;
    if (["status", "trust", "attention", "recommended_action", "opportunity"].includes(mapped)) {
      return this.supervisorOutcome(canonical, mapped, fallback);
    }
    return this.displayFactValue(canonical, mapped, fallback);
  }


  energyFactEntity(assetId, fieldName) {
    const canonical = this.canonicalAssetId(assetId);
    return this.indexedEntity(canonical, "energy_fact_entities_json", fieldName);
  }

  energyFact(assetId, fieldName, fallback = "") {
    return this.cleanState(this.energyFactEntity(assetId, fieldName), fallback);
  }


  outcomeCatalogValues(kind = "") {
    return [];
  }

  normalizeOutcomeValue(kind, value, fallback = "Unknown") {
    const clean = this.cleanValue(value, "");
    if (!clean) return fallback;
    const allowed = this.outcomeCatalogValues(kind);
    // No catalog is currently published. If one is added later, only a real
    // non-empty Set constrains backend values.
    if (!(allowed instanceof Set) || allowed.size === 0) return clean;
    return allowed.has(clean) ? clean : fallback;
  }

  supervisorOutcome(assetId = "mobility", key = "status", fallback = "") {
    const canonical = this.canonicalAssetId(assetId || "");
    if (canonical && canonical !== "mobility") return this.factContractValue(canonical, key, fallback);

    // Global supervisor meaning is backend-owned and may only come from the
    // published Mobility Intelligence Index. Never derive it from local facts.
    for (const row of this.intelligenceRowsFor("")) {
      const scope = String(row?.asset_id || row?.subject_asset_id || row?.scope || row?.id || "").trim().toLowerCase();
      if (scope && !["mobility", "global"].includes(scope)) continue;
      const raw = this.parseSupervisorValue(row, "mobility", key);
      if (raw === undefined || raw === null || String(raw).trim() === "") continue;
      // "None" is a valid backend supervisor outcome (for example Attention=None),
      // not missing data. Preserve the published value exactly.
      return String(raw).trim();
    }
    return fallback;
  }

  parseSupervisorValue(raw, assetId, key) {
    if (raw === undefined || raw === null || raw === "") return "";
    const value = this.parseJsonValue(raw, raw);
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) {
      const row = value.find((r) => String(r?.asset_id || r?.id || r?.scope || "mobility") === String(assetId));
      return row?.[key] ?? row?.outcomes?.[key] ?? "";
    }
    if (typeof value === "object") {
      if (value[key] !== undefined && (assetId === "mobility" || value.asset_id === assetId || !value.asset_id)) return String(value[key]);
      if (value[assetId]) return this.parseSupervisorValue(value[assetId], assetId, key);
      if (value.outcomes) return this.parseSupervisorValue(value.outcomes, assetId, key);
    }
    return "";
  }

  vehicleState(assetId, stateName, fallback = "Unknown") {
    return this.displayFactValue(assetId, stateName, fallback);
  }


  chargerState(assetId, stateName, fallback = "Unknown") {
    return this.displayFactValue(assetId, stateName, fallback);
  }


  isOn(entityId) {
    return this.state(entityId) === "on";
  }

  boolPresent(entityId) {
    const s = this.state(entityId, "");
    if (!s) return true;
    return s !== "off";
  }

  contractBool(value, fallback = true) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "boolean") return value;
    const s = String(value).trim().toLowerCase();
    if (["true", "yes", "on", "1"].includes(s)) return true;
    if (["false", "no", "off", "0"].includes(s)) return false;
    return fallback;
  }

  parseJsonValue(value, fallback = {}) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "object") return value;
    if (typeof value === "string") {
      try { return JSON.parse(value); } catch (e) { return fallback; }
    }
    return fallback;
  }

  norm(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  cache(src) {
    if (!src || src.startsWith("data:")) return src;
    const v = this.config.resource_version || UX_VERSION;
    return src.includes("?") ? `${src}&v=${v}` : `${src}?v=${v}`;
  }

  formatAge(value) {
    if (!value && value !== 0) return "Unknown";
    const raw = String(value).trim();
    const n = Number(raw.replace(",", "."));
    if (Number.isNaN(n)) return raw;
    if (n < 60) return `${Math.round(n)} sec ago`;
    if (n < 3600) return `${Math.round(n / 60)} min ago`;
    if (n < 86400) return `${Math.round(n / 3600)} h ago`;
    return `${Math.round(n / 86400)} d ago`;
  }

  /** Convert command ids and contract values into calm product labels. */
  titleize(value) {
    return String(value || "")
      .replace(/^.*\./, "")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }


  /** Shared command icon resolver used by all screens and adapters. */
  commandIcon(command) {
    const id = String(command?.command_id || command?.id || "").toLowerCase();
    const family = String(command?.command_family || "").toLowerCase();
    const text = `${family} ${id}`;
    if (text.includes("restart") || text.includes("reboot") || text.includes("reset")) return "mdi:restart";
    if (text.includes("identify") || text.includes("locate") || text.includes("location")) return "mdi:crosshairs-gps";
    if (text.includes("stop") || text.includes("pause")) return "mdi:stop";
    if (text.includes("start") || text.includes("charge") || text.includes("resume")) return "mdi:lightning-bolt";
    if (text.includes("climate") || text.includes("heat") || text.includes("precondition")) return "mdi:fan";
    if (text.includes("unlock")) return "mdi:lock-open-outline";
    if (text.includes("lock") || text.includes("security")) return "mdi:lock-outline";
    if (text.includes("present") || text.includes("active")) return "mdi:power";
    return "mdi:gesture-tap-button";
  }

  assetLabelFromIndex(assetId, kind = "all") {
    const id = String(assetId || "").trim();
    if (!id || id.toLowerCase() === "none") return "None";
    const row = this.assetIndexRows(kind).find((a)=>String(a.asset_id || "") === id) || this.assetIndexRows("all").find((a)=>String(a.asset_id || "") === id);
    return row?.display_name || this.titleize(id);
  }

  chargerLabel(value) {
    return this.assetLabelFromIndex(value, "charger");
  }

  vehicleLabel(value) {
    return this.assetLabelFromIndex(value, "vehicle");
  }

  /**
   * Execute the exact invocation published by sensor.mobility_command_index.
   * The UI never reconstructs vendor/OEM producer bindings.
   */
  callCommand(command, data = {}) {
    if (!command || !this.hass) return;
    const st = this.commandState(command);
    if (st.disabled) return;
    if (command.service_domain && command.service_action) {
      const serviceData = { ...(command.service_data && typeof command.service_data === "object" ? command.service_data : {}) };
      if (data && Object.keys(data).length) Object.assign(serviceData, data);
      const target = command.service_target && typeof command.service_target === "object" ? command.service_target : {};
      this.hass.callService(command.service_domain, command.service_action, serviceData, target);
      return;
    }
    console.warn("HomeBrain Mobility: command has no executable service metadata", command.command_key || command.command_id || command);
  }

  toDateTimeLocalInputValue(value = "") {
    const raw = String(value ?? "").trim();
    if (!raw || ["unknown","unavailable","none","null","undefined","not available","—"].includes(raw.toLowerCase())) return "";
    // Already usable HA/input_datetime or datetime-local format.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) return raw.slice(0, 16);
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(raw)) return raw.replace(" ", "T").slice(0, 16);
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  navigate(path) {
    if (!path) return;
    try {
      const u = new URL(path, window.location.origin);
      const asset = u.searchParams.get("asset") || (u.hash || "").replace(/^#asset=/, "");
      if (asset) sessionStorage.setItem("homebrain_mobility_last_asset", decodeURIComponent(asset));
    } catch (e) {}
    history.pushState(null, "", path);
    window.dispatchEvent(new Event("location-changed"));
  }
}

// ---- src/domain/models/asset-factory.js ----
// 20-asset-factory.js
// Asset factory and common asset catalog shaping.

class HomeBrainAssetFactory {
  constructor(rt) { this.rt = rt; }
  assets() { return this.rt.indexedAssets("all").filter((a) => a.frontend_allowed !== false && a.lifecycle_state !== "Retired"); }
  vehicles() { return this.rt.indexedAssets("vehicle").filter((a) => a.frontend_allowed !== false && a.lifecycle_state !== "Retired"); }
  chargers() { return this.rt.indexedAssets("charger").filter((a) => a.frontend_allowed !== false && a.lifecycle_state !== "Retired"); }
  adapterFor(asset, config = {}) {
    if (this.rt.isVehicleAsset(asset)) return new HomeBrainVehicleAdapter(this.rt, asset.asset_id.replace(/^vehicle_/, ""), { ...config, registry_entry: asset });
    if (this.rt.isChargerAsset(asset)) return new HomeBrainChargerAdapter(this.rt, asset.asset_id.replace(/^charger_/, ""), { ...config, registry_entry: asset });
    return null;
  }
}

// ---- src/domain/adapters/vehicle-adapter.js ----
// 30-vehicle-adapter.js
// R22.12.11.30: vehicle view-model adapter for MOBILITY_PUBLIC_RUNTIME_V1; component-contract materialization is transport-safe and fail-closed.
// Product semantics are rendered from named backend owners only. No fact/source
// fallback, topology inference, command matrix, or frontend family reconstruction.

class HomeBrainVehicleAdapter {
  constructor(rt, vehicleId, config) { this.rt = rt; this.id = vehicleId; this.config = config; }
  assetId() { return String(this.id || "").startsWith("vehicle_") ? String(this.id) : `vehicle_${this.id}`; }
  registryEntry() { return this.config.registry_entry || this.rt.vehicleById(this.assetId()) || this.rt.assetById(this.assetId()) || null; }
  profile() { const reg = this.registryEntry(); return reg?.profile_display_name || reg?.profile || reg?.raw?.profile_display_name || this.config.fallback_profile || "Vehicle"; }
  displayName() { const reg = this.registryEntry(); return reg?.display_name || this.config.fallback_name || "Vehicle"; }
  imageFromProfile() { const reg = this.registryEntry() || {}; return this.rt.visualImageUrl(reg, "vehicle", "hero", "vehicle_fallback"); }
  chargerImage(assetId="") { const reg = assetId ? (this.rt.chargerById(assetId) || this.rt.assetById(assetId) || { asset_id: assetId }) : {}; return this.rt.visualImageUrl(reg, "charger", "image", "charger_fallback"); }

  chargerAssignmentModel() {
    const assetId = this.assetId();
    const prop = this.rt.propertyByCompoundKey(assetId, "vehicle.selected_charger");
    if (!prop) {
      return { resolved:false, property:null, writable:false, display:"N/A", value:"", editor_value:"", choices:[], allow_none:false, none_value:"" };
    }
    const editor = this.rt.propertyEditorRow(prop);
    const allowNone = editor.allow_none === true;
    const noneValue = editor.none_value ?? "";
    const rawCurrent = prop.value;
    const currentUnset = rawCurrent === undefined || rawCurrent === null || String(rawCurrent).trim() === "" || (allowNone && String(rawCurrent).trim() === String(noneValue ?? ""));
    const currentValue = currentUnset && allowNone ? String(noneValue ?? "") : String(rawCurrent ?? "").trim();
    const choices = [];
    if (allowNone) choices.push({ value:String(noneValue ?? ""), label:"No charger", is_none:true });
    for (const choice of (editor.choices || [])) {
      const value = String(choice?.value ?? choice?.id ?? choice?.asset_id ?? choice ?? "").trim();
      const label = String(choice?.label ?? choice?.display_name ?? choice?.name ?? (value ? this.rt.chargerLabel(value) : "")).trim();
      if (!value || choices.some((row)=>row.value === value)) continue;
      choices.push({ value, label:label || value, is_none:false });
    }
    const currentKnown = choices.some((choice)=>choice.value === String(editor.editor_value ?? currentValue));
    const display = currentUnset
      ? (allowNone ? "No charger" : "N/A")
      : (this.rt.chargerLabel(String(rawCurrent).trim()) || String(rawCurrent).trim());
    return {
      resolved:true,
      property:prop,
      writable:!editor.disabled && choices.length > 0,
      display,
      value:String(rawCurrent ?? "").trim(),
      editor_value:String(editor.editor_value ?? currentValue),
      choices,
      current_known:currentKnown,
      allow_none:allowNone,
      none_value:String(noneValue ?? "")
    };
  }

  latestActivityRows(assetId) {
    const activities = this.rt.activityRowsFor(assetId).slice(0, 3);
    const valueFor = (a) => String(a.result || a.result_code || a.activity_state || a.status || a.message || a.activity_type || a.command_key || a.command_id || "Unavailable");
    const labels = ["Latest activity", "Previous activity", "Earlier activity"];
    if (!activities.length) return [{ type:"readonly", icon:"mdi:history", label:"Latest activity", value:"Unavailable" }];
    return activities.map((a, index)=>({ type:"readonly", icon:index === 0 ? "mdi:history" : "mdi:history-clock", label:labels[index] || `Activity ${index+1}`, value:valueFor(a) }));
  }

  build() {
    const id = this.id;
    const assetId = this.assetId();
    const reg = this.registryEntry() || { asset_id: assetId };
    const lifecycleState = this.rt.lifecycleStatus(reg);
    const lifecycle = lifecycleState === "active" ? "Active" : lifecycleState === "disabled" ? "Disabled" : lifecycleState === "retired" ? "Retired" : "Contract gap";
    const present = lifecycleState === "active";
    const profile = this.profile();
    const display = this.displayName();

    const relationship = this.rt.vehicleChargerRelationship(assetId);
    const isReal = (value) => {
      const v = String(value || "").trim();
      return !!v && !["none", "unknown", "unavailable", "null", "undefined", "—"].includes(v.toLowerCase());
    };
    const physicalChargerId = isReal(relationship.connected) ? this.rt.canonicalAssetId(relationship.connected) : "";
    const effectiveChargerId = isReal(relationship.effective) ? this.rt.canonicalAssetId(relationship.effective) : "";
    // Hero navigation may show the effective charger when no physical charger is
    // connected, but this never changes the physical connection semantics.
    const chargerContextId = physicalChargerId || effectiveChargerId;
    const chargerEntry = chargerContextId ? (this.rt.chargerById(chargerContextId) || this.rt.assetById(chargerContextId)) : null;
    const chargerDisplay = chargerEntry?.display_name
      || (physicalChargerId ? relationship.connected_display_name : relationship.effective_display_name)
      || chargerContextId || "Not available";
    const chargerDetailRoute = chargerContextId ? this.rt.assetDetailRoute(chargerEntry || chargerContextId) : "";

    const profileImage = this.imageFromProfile();
    const imageKeyProp = this.rt.propertyByCompoundKey(assetId, "vehicle.image_key");
    const imageKey = imageKeyProp?.value ?? this.rt.visualImageKey(reg, "image") ?? reg?.image_key ?? "";
    const visual = typeof rhiMobilityParseVehicleVisualKey === "function" ? rhiMobilityParseVehicleVisualKey(imageKey) : null;
    // UX owns rendering. A resolved verified catalog key must drive both the
    // actual model artwork and its colour treatment. Profile/source artwork is
    // only the deterministic fallback when the persisted key is legacy/unknown.
    const visualPackageFile = visual?.vehicle?.selectable !== false && visual?.vehicle?.visual_quality !== "fallback_only"
      ? String(visual?.vehicle?.package_file || "")
      : "";
    const img = visualPackageFile ? this.rt.assetUrl(visualPackageFile) : profileImage;
    const imageFilter = visual?.color?.filter || "none";
    const actions = this.rt.commandActionsFor(assetId, "quick_actions").map((cmd, index) => ({
      label: cmd.label || this.rt.titleize(cmd.command_id || cmd.command_key),
      icon: this.rt.commandIcon(cmd), entity: cmd.intent_entity, command: cmd,
      primary: index === 0, hide: cmd.frontend_allowed === false
    }));
    const componentSections = this.rt.addRelatedAssetDetailLinks(
      this.rt.vehicleComponentDetailSections(assetId),
      { chargerDetailRoute, chargerDisplay }
    );

    return {
      type:"vehicle", id, present, display, subtitle:profile, readiness:lifecycle,
      image:this.rt.cache(img), fallbackImage:this.rt.cache(this.rt.assetUrl("vehicles/vehicle_fallback.png")), imageOpacity:present ? 1 : 0.34, imageGray:present ? 0 : 0.25, imageFilter,
      chargerImage:this.rt.cache(this.chargerImage(chargerContextId)), chargerFallbackImage:this.rt.cache(this.rt.assetUrl("chargers/charger_fallback.png")),
      chargerDisplay, chargerDetailRoute,
      backPath:this.config.dashboard_path || "/mobility-supervisor/dashboard", backLabel:this.config.back_label || "← Back to Dashboard", detailRoute:this.rt.detailRoute(reg), lifecycle, registryEntry:reg,
      breadcrumb:["Home", "Vehicles", display],
      // Vehicle hero strip is intelligence only: Range | Energy | Security | Maintenance | Freshness.
      status:this.rt.vehicleIntelligenceStatusTiles(assetId),
      actions,
      sections:[this.rt.lifecycleContractGapSection(assetId)].filter(Boolean).concat(componentSections).concat([
        { key:"activity", title:"Recent Activity", icon:"mdi:history", header:"Activity contract", rows:this.latestActivityRows(assetId), details:[] }
      ])
    };
  }
}

// ---- src/domain/adapters/charger-adapter.js ----
// 40-charger-adapter.js
// Charger view-model adapter mapping public contracts to charger card data.

class HomeBrainChargerAdapter {
  constructor(rt, chargerId, config) { this.rt = rt; this.id = chargerId; this.config = config; }
  assetId() { return String(this.id || "").startsWith("charger_") ? String(this.id) : `charger_${this.id}`; }
  registryEntry() { return this.config.registry_entry || this.rt.chargerById(this.assetId()) || this.rt.assetById(this.assetId()) || null; }
  commandExists(commandId) { return this.rt.commandExists(this.assetId(), commandId) !== false; }
  displayName() { const reg = this.registryEntry(); return reg?.display_name || this.config.fallback_name || this.rt.titleize(this.assetId()); }
  chargerImageFromId() { const reg = this.registryEntry(); return this.rt.visualImageUrl(reg, "charger", "image", "charger_fallback"); }
  profile() { const reg = this.registryEntry(); return reg?.profile_display_name || reg?.profile || this.config.fallback_profile || "Charger"; }
  status() { return this.rt.chargerOperationalStatus(this.assetId()); }
  can(capability) { return this.commandExists(capability); }
  overviewAvailability() {
    const assetId = this.assetId();
    const lifecycle = this.rt.lifecycleStatus(this.registryEntry() || assetId);
    if (lifecycle === "disabled") return { bucket:"disabled", resolved:true, label:"Disabled" };
    if (lifecycle !== "active") return { bucket:"unknown", resolved:false, label:"N/A" };
    const snapshot = this.rt.chargerProductSnapshot(assetId);
    if (!snapshot?.operating?.resolved) return { bucket:"unknown", resolved:false, label:"N/A" };
    const raw = String(snapshot.operating.value || "").trim().toLowerCase();
    if (["idle", "stopped"].includes(raw)) return { bucket:"free", resolved:true, label:"Free" };
    if (["running", "preparing"].includes(raw)) return { bucket:"in_use", resolved:true, label:"In use" };
    if (["fault"].includes(raw)) return { bucket:"unavailable", resolved:true, label:"Unavailable" };
    return { bucket:"unknown", resolved:false, label:"N/A" };
  }

  latestActivityRows(assetId) {
    const activities = this.rt.activityRowsFor(assetId).slice(0, 3);
    const valueFor = (a) => String(a.result || a.result_code || a.activity_state || a.status || a.message || a.activity_type || a.command_key || a.command_id || "Unavailable");
    const labels = ["Latest activity", "Previous activity", "Earlier activity"];
    if (!activities.length) return [{ type:"readonly", icon:"mdi:history", label:"Latest activity", value:"Unavailable" }];
    return activities.map((a, index)=>({ type:"readonly", icon:index === 0 ? "mdi:history" : "mdi:history-clock", label:labels[index] || `Activity ${index+1}`, value:valueFor(a) }));
  }
  build() {
    const id = this.id;
    const assetId = this.assetId();
    const reg = this.registryEntry() || { asset_id: assetId };
    const lifecycleState = this.rt.lifecycleStatus(reg);
    const lifecycle = lifecycleState === "active" ? "Active" : lifecycleState === "disabled" ? "Disabled" : lifecycleState === "retired" ? "Retired" : "Contract gap";
    const available = lifecycleState === "active";
    const name = this.displayName();
    const profile = this.profile();
    const chargerSnapshot = this.rt.chargerProductSnapshot(assetId);
    const status = chargerSnapshot.operating.display;
    const connectionState = chargerSnapshot.connection.display;
    const assignedVehicle = chargerSnapshot.connected_vehicle.display;
    const physicalVehicle = this.rt.physicalVehicleForCharger(assetId);
    const relatedVehicle = this.rt.relatedVehicleForCharger(assetId);
    const power = chargerSnapshot.power.display;
    const sessionEnergy = this.rt.canonicalChargerPropertyDisplay(assetId, "charger.session_energy_kwh", "—");
    const currentLimit = this.rt.canonicalChargerPropertyDisplay(assetId, "charger.current_limit_a", "—");
    const connector = connectionState;
    const limitSource = "sensor.mobility_charger_property_index";
    const phases = "—";
    const voltage = "—";
    const current = this.rt.canonicalChargerPropertyDisplay(assetId, "charger.actual_current_a", "—");
    const dataFreshness = "—";
    const trust = "—";
    const health = chargerSnapshot.health.display;
    const iconMap = { driveway_left:"mdi:ev-station", driveway_right:"mdi:ev-station", sideway:"mdi:ev-plug-type2", utility_plug:"mdi:power-socket-eu" };
    const ctlByField = (field, label, icon, opts = {}) => { const entity = this.rt.controlEntity(assetId, field, ""); return entity ? { type:"control", entity, label, icon, ...opts } : { type:"readonly", icon, label, value: opts.fallback || "Not available" }; };
    return {
      type:"charger", id, present:available, display:name, subtitle:profile, readiness:status, iconHero:iconMap[id] || "mdi:ev-station",
      image:this.rt.cache(this.chargerImageFromId()), fallbackImage:this.rt.cache(this.rt.assetUrl("chargers/charger_fallback.png")), imageOpacity:available ? 1 : 0.34, imageGray:available ? 0 : 0.25,
      backPath:this.config.dashboard_path || "/mobility-supervisor/dashboard", backLabel:this.config.back_label || "← Back to Dashboard", detailRoute:this.rt.detailRoute(reg), lifecycle, registryEntry:reg, breadcrumb:["Home","Chargers",name],
      status:this.rt.chargerCanonicalStatusTiles(assetId, { detailRoute: physicalVehicle.detailRoute, detailTitle: physicalVehicle.displayName ? `Open ${physicalVehicle.displayName} details` : "Open vehicle details" }),
      actions:this.rt.commandActionsFor(assetId, "quick_actions").map((cmd,index)=>({ label:cmd.label || this.rt.titleize(cmd.command_id || cmd.command_key), icon:this.rt.commandIcon(cmd), entity:cmd.intent_entity, command:cmd, primary:index === 0, hide:cmd.frontend_allowed === false })),
      // R22.12.11.24: charger detail sections come from the charger component contract.
      // UX must not infer charger layout from flat property family/group names.
      sections:[this.rt.lifecycleContractGapSection(assetId)].filter(Boolean).concat(
        this.rt.addRelatedAssetDetailLinks(this.rt.chargerComponentDetailSections(assetId), { vehicleDetailRoute: relatedVehicle.detailRoute, vehicleDisplay: relatedVehicle.displayName })
      ).concat([
        { key:"activity", title:"Recent Activity", icon:"mdi:history", header:"Activity contract", rows:this.latestActivityRows(assetId), details:[] }
      ])
    };
  }
}

// ---- src/ui/components/vehicle-visual-picker.js ----
// Shared vehicle visual picker model/presentation helper.
// UX owns catalog + rendering; Mobility persists only vehicle.image_key.
class HomeBrainVehicleVisualPicker {
  constructor(rt) { this.rt = rt; }

  catalog() {
    return typeof rhiMobilitySelectableVehicleVisualCatalog === "function"
      ? rhiMobilitySelectableVehicleVisualCatalog()
      : [];
  }

  selection(asset = {}, draft = {}) {
    const assetId = String(asset?.asset_id || asset || "").trim();
    const prop = assetId ? this.rt.propertyByCompoundKey(assetId, "vehicle.image_key") : null;
    const raw = prop?.value ?? this.rt.visualImageKey(asset || {}, "image") ?? asset?.image_key ?? "";
    const parsed = typeof rhiMobilityParseVehicleVisualKey === "function"
      ? rhiMobilityParseVehicleVisualKey(raw)
      : null;
    const catalog = this.catalog();
    const parsedSelectable = parsed?.vehicle
      ? catalog.find((row)=>row.id === parsed.vehicle.id) || null
      : null;
    const vehicle = catalog.find((row)=>row.id === String(draft.vehicle_id || ""))
      || parsedSelectable
      || catalog[0]
      || null;
    const colors = vehicle?.colors || [];
    const parsedColor = parsedSelectable?.id === vehicle?.id ? parsed?.color : null;
    const color = colors.find((row)=>row.id === String(draft.color_id || ""))
      || parsedColor
      || colors[0]
      || null;
    const key = vehicle && color && typeof rhiMobilityVehicleVisualKey === "function"
      ? rhiMobilityVehicleVisualKey(vehicle.id, color.id)
      : "";
    return {
      asset_id: assetId,
      prop,
      raw: String(raw || ""),
      parsed,
      parsed_selectable: !!parsedSelectable,
      vehicle,
      color,
      key,
      writable: !!(prop && this.rt.isWritableProperty(prop))
    };
  }

  render(asset = {}, options = {}) {
    const current = this.selection(asset, options.draft || {});
    const catalog = this.catalog();
    const vehicle = current.vehicle;
    const colors = vehicle?.colors || [];
    const color = current.color;
    const assetId = current.asset_id;
    const close = options.showClose === false ? "" :
      `<button class="vehicle-picker-close" data-vehicle-picker-close="${this.rt.escape(assetId)}" title="Close"><ha-icon icon="mdi:close"></ha-icon></button>`;
    return `<section class="vehicle-picker-panel ${options.context === "detail" ? "detail-vehicle-picker" : ""}" data-picker-panel="${this.rt.escape(assetId)}">
      <div class="vehicle-picker-head">
        <div><small>APPEARANCE</small><h3>Choose vehicle & colour</h3><p>The UX catalog owns visuals. Mobility stores only the selected <code>vehicle.image_key</code>.</p></div>
        ${close}
      </div>
      <div class="vehicle-picker-grid">
        <label><span>Vehicle</span><select data-vehicle-picker-type="${this.rt.escape(assetId)}">${catalog.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===vehicle?.id?"selected":""}>${this.rt.escape(row.label)} · ${this.rt.escape(row.years)}</option>`).join("")}</select></label>
        <label><span>Colour</span><select data-vehicle-picker-color="${this.rt.escape(assetId)}">${colors.map((row)=>`<option value="${this.rt.escape(row.id)}" ${row.id===color?.id?"selected":""}>${this.rt.escape(row.label)}</option>`).join("")}</select></label>
        <div class="vehicle-picker-key"><span>Visual key</span><code>${this.rt.escape(current.key || "Unavailable")}</code></div>
        <button class="vehicle-picker-save" data-vehicle-picker-save="${this.rt.escape(assetId)}" data-vehicle-key="${this.rt.escape(current.key)}" ${!current.writable || !current.key ? "disabled" : ""}><ha-icon icon="mdi:check"></ha-icon><span>Use this vehicle</span></button>
      </div>
      ${current.parsed && !current.parsed_selectable ? `<div class="vehicle-picker-gap"><ha-icon icon="mdi:image-off-outline"></ha-icon><span>Current legacy visual has no verified model artwork. It remains readable, but is not offered as a new picker choice.</span></div>` : ""}
      ${current.writable ? "" : `<div class="vehicle-picker-gap"><ha-icon icon="mdi:alert-outline"></ha-icon><span>Backend does not publish a writable vehicle.image_key yet. Picker stays fail-closed.</span></div>`}
    </section>`;
  }
}

// ---- src/ui/components/asset-shell.js ----
// 50-asset-shell-components.js
// Reusable asset detail shell rendering components.

class HomeBrainAssetShell {
  constructor(root, rt) {
    this.root = root;
    this.rt = rt;
  }

  pillClass(value) {
    const s = String(value || "").toLowerCase();
    if (s.includes("ready") || s.includes("secure") || s.includes("trusted") || s.includes("complete") || s.includes("fresh") || s.includes("available") || s.includes("healthy") || s.includes("ok") || s.includes("connected") || s.includes("locked")) return "ok";
    if (s.includes("charging") || s.includes("heating") || s.includes("active") || s.includes("forced") || s.includes("paused") || s.includes("limited")) return "warn";
    if (s.includes("degraded") || s.includes("unlocked") || s.includes("attention") || s.includes("failed") || s.includes("stale") || s.includes("unavailable") || s.includes("not present")) return "bad";
    return "muted";
  }

  pill(value) {
    return `<span class="pill ${this.pillClass(value)}">${this.rt.escape(value || "Unknown")}</span>`;
  }

  renderControl(row) {
    // R43.2.54: raw entity controls are not a Mobility product contract. Any
    // legacy control row fails closed; editable product controls are rendered
    // only through backend-published property metadata.
    return this.renderRow({ type:"readonly", icon:row.icon || "mdi:alert-outline", label:row.label || "Control", value:"Unavailable — property contract required" });
  }


  renderEditableProperty(row) {
    const prop = row.property || {};
    const validation = row.validation || {};
    const min = validation.min ?? validation.minimum ?? prop.min ?? 0;
    const max = validation.max ?? validation.maximum ?? prop.max ?? 100;
    const step = validation.step ?? prop.step ?? 1;
    const disabled = row.disabled ? "disabled" : "";
    const title = row.disabled_reason || row.help || "";
    // Editors show the configured/readback value published by V1. For an
    // explicitly nullable configuration property (profile/selected charger), use
    // the backend-published none token rather than hiding the control.
    const editorValue = row.editor_value ?? prop.value ?? "";
    const value = this.rt.valueWithoutUnit(editorValue, prop.unit || "");
    const controlKind = this.rt.uxEditorControlKind(prop);
    const unit = String(prop.unit || "").trim();
    const key = String(prop.property_key || "").toLowerCase();
    const assetId = this.rt.canonicalAssetId(prop.asset_id || row.asset_id || "");
    if (key === "vehicle.image_key") {
      const asset = this.rt.vehicleById(assetId) || this.rt.assetById(assetId) || { asset_id:assetId, asset_type:"vehicle", image_key:prop.value };
      return new HomeBrainVehicleVisualPicker(this.rt).render(asset, { showClose:false, context:"detail" });
    }
    const unitSuffix = unit && !["%"].includes(unit) ? `<span class="unit-suffix">${this.rt.escape(unit)}</span>` : "";
    let control = "";

    if (controlKind === "text") {
      control = `<input type="text" value="${this.rt.escape(value || "")}" data-write-asset="${this.rt.escape(assetId)}" data-write-key="${this.rt.escape(prop.property_key || "")}" ${disabled}/>${unitSuffix}`;
    } else if (controlKind === "toggle") {
      const on = [true,"true","on","yes","1"].includes(prop.value);
      control = `<button class="toggle ${on ? "on" : ""}" data-write-asset="${this.rt.escape(assetId)}" data-write-key="${this.rt.escape(prop.property_key || "")}" data-write-toggle="1" ${disabled}><span></span></button>`;
    } else if (controlKind === "datetime") {
      const type = "datetime-local";
      const dtValue = this.rt.toDateTimeLocalInputValue(prop.value ?? value ?? "");
      control = `<input class="datetime" type="${type}" value="${this.rt.escape(dtValue)}" data-write-asset="${this.rt.escape(assetId)}" data-write-key="${this.rt.escape(prop.property_key || "")}" data-datetime-editor="1" ${disabled}/>`;
    } else if (controlKind === "slider") {
      const boundsValid = row.slider_bounds_valid !== false && min !== "" && max !== "" && Number(max) > Number(min);
      const rawSliderValue = this.rt.valueWithoutUnit(value || min, prop.unit || "");
      const numericValue = Number(String(rawSliderValue).replace(",", "."));
      const boundedValue = boundsValid && Number.isFinite(numericValue) ? Math.min(Number(max), Math.max(Number(min), numericValue)) : rawSliderValue;
      const sliderDisplay = this.rt.formatValue(boundedValue || value || "—", prop.unit || "", prop.property_key || "");
      if (boundsValid) {
        control = `<div class="range-control" title="${this.rt.escape(`Range ${min}–${max}, step ${step}`)}"><input type="range" min="${this.rt.escape(min)}" max="${this.rt.escape(max)}" step="${this.rt.escape(step)}" value="${this.rt.escape(boundedValue || min)}" data-write-asset="${this.rt.escape(assetId)}" data-write-key="${this.rt.escape(prop.property_key || "")}" data-live-target="1" data-live-unit="${this.rt.escape(prop.unit || "")}" data-live-key="${this.rt.escape(prop.property_key || "")}" ${disabled}/><span class="live-value">${this.rt.escape(sliderDisplay || "—")}</span></div>`;
      } else {
        control = `<input type="number" value="${this.rt.escape(rawSliderValue || "")}" data-write-asset="${this.rt.escape(assetId)}" data-write-key="${this.rt.escape(prop.property_key || "")}" ${disabled}/>${unitSuffix}`;
      }
    } else {
      const options = Array.isArray(row.choices) && row.choices.length ? row.choices : (Array.isArray(validation.options) ? validation.options : []);
      const valueField = row.value_field || prop.value_field || "value";
      const labelField = row.label_field || prop.label_field || "label";
      const secondaryField = row.secondary_label_field || prop.secondary_label_field || "secondary_label";
      const opts = [];
      if (row.allow_none || prop.allow_none) opts.push({ value: row.none_value ?? prop.none_value ?? "", label: "None" });
      for (const o of options) {
        const v = typeof o === "object" ? (o[valueField] ?? o.value ?? o.asset_id ?? o.id ?? o.key ?? "") : o;
        let l = typeof o === "object" ? (o[labelField] ?? o.label ?? o.display_name ?? o.name ?? v) : o;
        const sec = typeof o === "object" ? (o[secondaryField] ?? o.secondary_label ?? "") : "";
        if (String(v).startsWith("charger_") && (!l || l === v)) l = this.rt.chargerLabel(v);
        if (String(v).startsWith("vehicle_") && (!l || l === v)) l = this.rt.vehicleLabel(v);
        opts.push({ value: v, label: sec ? `${l} — ${sec}` : l });
      }
      const display = String(value).startsWith("charger_") ? this.rt.chargerLabel(value) : String(value).startsWith("vehicle_") ? this.rt.vehicleLabel(value) : value;
      control = `<select data-write-asset="${this.rt.escape(assetId)}" data-write-key="${this.rt.escape(prop.property_key || "")}" ${disabled}>
        ${opts.length ? "" : `<option value="">${this.rt.escape(display || "No choices published")}</option>`}
        ${opts.map((o)=>`<option value="${this.rt.escape(o.value)}" ${String(o.value) === String(value) ? "selected" : ""}>${this.rt.escape(o.label)}</option>`).join("")}
      </select>`;
    }
    return `<div class="edit-row ${row.disabled ? "is-disabled" : ""}" title="${this.rt.escape(title)}">
      <ha-icon icon="${row.icon}"></ha-icon>
      <div class="edit-copy"><div class="label">${this.rt.escape(row.label)}</div>${row.help ? `<div class="help">${this.rt.escape(row.help)}</div>` : ""}</div>
      <div class="edit-control">${control}</div>
    </div>`;
  }

  renderRows(rows = []) {
    const out = [];
    let cluster = [];
    const flush = () => {
      if (cluster.length) {
        out.push(`<div class="action-cluster">${cluster.map((r) => this.renderAction({ label: r.label, icon: r.icon, command: r.command, asset_id: r.asset_id, primary: r.primary })).join("")}</div>`);
        cluster = [];
      }
    };
    for (const row of rows || []) {
      if (row && row.type === "action-row") cluster.push(row);
      else { flush(); out.push(this.renderRow(row)); }
    }
    flush();
    return out.join("");
  }

  renderRow(row) {
    if (!row || row.hide) return "";
    if (row.type === "control") return this.renderControl(row);
    if (row.type === "property-editor") return this.renderEditableProperty(row);
    if (row.type === "action-row") return this.renderAction({ label: row.label, icon: row.icon, command: row.command, asset_id: row.asset_id, primary: row.primary });
    if (row.type === "subheader") return `<div class="row-subheader">${this.rt.escape(row.label)}</div>`;
    if (row.type === "subheader-small") return `<div class="row-subheader-small">${this.rt.escape(row.label)}</div>`;
    return `
      <div class="row ${row.detailRoute ? "has-detail-link" : ""}">
        <ha-icon icon="${row.icon}"></ha-icon>
        <div class="label">${this.rt.escape(row.label)}</div>
        <div class="value row-value-with-link"><span>${this.rt.escape(row.value ?? "—")}</span>${row.detailRoute ? `<button class="row-detail-link" data-nav="${this.rt.escape(row.detailRoute)}" title="${this.rt.escape(row.detailTitle || "Open related asset details")}"><ha-icon icon="mdi:plus"></ha-icon></button>` : ""}</div>
      </div>`;
  }

  renderSection(section) {
    if (!section || section.hide) return "";
    const details = (section.details || []).filter((d) => d && d.value !== undefined && d.value !== null && String(d.value).trim() !== "");
    return `
      <section class="section-card section-${this.rt.escape(section.key)}">
        <div class="section-head">
          <div class="section-title">
            <ha-icon icon="${section.icon}"></ha-icon>
            <h2>${this.rt.escape(section.title)}</h2>
          </div>
          <div class="section-status">${this.rt.escape(section.header || "")}</div>
        </div>
        <div class="section-body">${this.renderRows(section.rows || [])}</div>
        ${details.length ? `<details class="detail-fold">
          <summary>Engineering details</summary>
          <div class="detail-block">
            ${details.map((d) => `<div class="detail-row"><span>${this.rt.escape(d.label)}</span><b>${this.rt.escape(d.value ?? "—")}</b></div>`).join("")}
          </div>
        </details>` : ""}
      </section>`;
  }

  renderAction(action) {
    if (!action || action.hide) return "";
    const command = action.command || null;
    const st = command ? this.rt.commandState(command) : { disabled:true, busy:false, failed:false, status:"contract_gap", reason:"Command contract gap" };
    const title = st.reason || st.status || "";
    const enums = command?.enum_options || {};
    const enumName = (command?.required_parameters || []).find((name) => Array.isArray(enums[name]) && enums[name].length) || "";
    if (command && command.interaction_mode === "form" && enumName) {
      return `<label class="action enum-action ${st.disabled ? "is-disabled" : ""}" title="${this.rt.escape(title)}">
        <ha-icon icon="${action.icon}"></ha-icon>
        <select aria-label="${this.rt.escape(action.label)}" data-command-asset="${this.rt.escape(command.asset_id || action.asset_id || "")}" data-command-id="${this.rt.escape(command.command_id || "")}" data-command-key="${this.rt.escape(command.command_key || command.command_id || "")}" data-command-param="${this.rt.escape(enumName)}" ${st.disabled ? "disabled" : ""}>
          <option value="">${this.rt.escape(action.label)}…</option>
          ${enums[enumName].map((o)=>`<option value="${this.rt.escape(o.value)}">${this.rt.escape(o.label || o.value)}</option>`).join("")}
        </select>
      </label>`;
    }
    return `
      <button class="${action.primary ? "action primary" : "action"}" data-asset-id="${this.rt.escape(command?.asset_id || action.asset_id || "")}" data-command-id="${this.rt.escape(command?.command_id || "")}" data-command-key="${this.rt.escape(command?.command_key || command?.command_id || "")}" ${st.disabled ? "disabled" : ""} title="${this.rt.escape(title)}">
        <ha-icon icon="${action.icon}"></ha-icon>
        <span>${this.rt.escape(action.label)}</span>
        ${title && st.disabled ? `<small>${this.rt.escape(title)}</small>` : ""}
      </button>`;
  }

  renderHeroVisual(model) {
    if (model.image) {
      return `<img src="${this.rt.escape(model.image)}"
                   data-vehicle-visual-preview="${model.type === "vehicle" ? "1" : "0"}"
                   data-image-gray="${this.rt.escape(model.imageGray ?? 0)}"
                   onerror="this.onerror=null;this.src='${this.rt.escape(model.fallbackImage || "")}';this.classList.add('image-fallback');"
                   style="opacity:${model.imageOpacity ?? 1};filter:grayscale(${model.imageGray ?? 0}) ${this.rt.escape(model.imageFilter || "none")} drop-shadow(0 24px 30px rgba(15,35,80,.15));" />`;
    }
    return `<div class="hero-icon" style="opacity:${model.imageOpacity ?? 1};filter:grayscale(${model.imageGray ?? 0});"><ha-icon icon="${model.iconHero || "mdi:cube-outline"}"></ha-icon></div>`;
  }

  renderFooter(model) {
    const activity = (model.sections || []).find((s) => s && s.key === "activity");
    const rows = (activity?.rows || []).slice(0, 3);
    const items = rows.length ? rows.map((r, i) => ({
      icon: r.icon || ["mdi:check-circle", "mdi:alert", "mdi:fan"][i] || "mdi:history",
      title: r.label || "Activity",
      value: r.value || "—",
      sub: i === 0 ? "Latest event" : i === 1 ? "Vehicle action" : "Data update",
      tone: i === 0 ? "ok" : i === 1 ? "warn" : "blue"
    })) : [
      { icon:"mdi:check-circle", title:"Charging", value:"No recent charging event", sub:"Today", tone:"ok" },
      { icon:"mdi:alert", title:"Attention", value:"No issue requiring attention", sub:"Today", tone:"warn" },
      { icon:"mdi:history", title:"Last update", value:"—", sub:"System", tone:"blue" }
    ];
    return `<section class="footer-activity">
      <div class="footer-title">Recent activity</div>
      <div class="footer-items">
        ${items.map((it) => `<div class="footer-item tone-${this.rt.escape(it.tone)}"><div class="footer-icon"><ha-icon icon="${it.icon}"></ha-icon></div><div><b>${this.rt.escape(it.title)}</b><span>${this.rt.escape(it.value)}</span><small>${this.rt.escape(it.sub)}</small></div></div>`).join("")}
        <button class="footer-more">View all activity <ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
    </section>`;
  }

  render(model) {
    const actions = (model.actions || []).map((a) => this.renderAction(a)).join("");
    const status = (model.status || []).map((m) => `
      <div class="metric tone-${this.rt.escape(m.tone || "neutral")} ${m.detailRoute ? "has-detail-link" : ""}">
        <ha-icon icon="${m.icon}"></ha-icon>
        <div class="metric-copy"><span>${this.rt.escape(m.label)}</span><b>${this.rt.escape(m.value)}</b>${m.subvalue ? `<small class="metric-sub">${m.subIcon ? `<ha-icon class="metric-sub-icon" icon="${this.rt.escape(m.subIcon)}"></ha-icon>` : ""}${this.rt.escape(m.subvalue)}</small>` : ""}</div>
        ${m.detailRoute ? `<button class="metric-detail-link" data-nav="${this.rt.escape(m.detailRoute)}" title="${this.rt.escape(m.detailTitle || "Open related asset details")}"><ha-icon icon="mdi:plus"></ha-icon></button>` : ""}
      </div>`).join("");
    const mainSections = (model.sections || []).filter((s) => s && s.key !== "activity");

    this.root.innerHTML = `
      <ha-card>
        <div class="page">
          <div class="hi-version-block" style="position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0;margin:0;z-index:3;pointer-events:none;"><div>UX ${this.rt.escape(UX_VERSION)}</div><div>Backend ${this.rt.escape(this.rt.backendVersion())}</div></div>
          ${hbMobilityNav(model.type === "charger" ? "chargers" : "vehicles")}
          <section class="hero">
            <div class="hero-left">
              <div class="hero-topline">
                <div class="breadcrumb">${(model.breadcrumb || []).map((b, i) => `${i ? "<span>›</span>" : ""}<b${i === (model.breadcrumb.length - 1) ? "" : " class='crumb-light'"}>${this.rt.escape(b)}</b>`).join("")}</div>
                <button class="back-inline" data-nav="${this.rt.escape(model.backPath)}">${this.rt.escape(model.backLabel || "← Back")}</button>
              </div>
              <div class="title-row">
                <h1>${this.rt.escape(model.display)}</h1>
              </div>
              <div class="subtitle">${this.rt.escape(model.subtitle)}</div>
              <div class="status-strip">${status}</div>
            </div>
            <div class="hero-image">${this.renderHeroVisual(model)}</div>
            ${model.type === "vehicle" ? `<div class="hero-charger-image">
              ${model.chargerDisplay && model.chargerDisplay !== "Not available" ? `<div class="hero-charger-name">${this.rt.escape(model.chargerDisplay)}</div>` : ""}
              <img src="${this.rt.escape(model.chargerImage || model.chargerFallbackImage || "")}" onerror="this.onerror=null;this.src='${this.rt.escape(model.chargerFallbackImage || "")}';" />
              ${model.chargerDetailRoute ? `<button class="mini-detail-button hero-charger-detail-link" data-nav="${this.rt.escape(model.chargerDetailRoute)}" title="Open charger details"><ha-icon icon="mdi:plus"></ha-icon></button>` : ""}
            </div>` : ""}
          </section>

          <section class="actions"><div class="actions-title">Quick actions</div>${actions || `<div class="no-actions">No actions available for this asset.</div>`}</section>
          <section class="grid">${mainSections.map((s) => this.renderSection(s)).join("")}</section>
          ${this.renderFooter(model)}
        </div>
        <style>${this.styles()}
/* R22.12.11.24 unified quick-action sizing */
.action.enum-action,.cmd.enum-command{height:43px!important;min-height:43px!important;max-height:43px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:0 11px!important;box-sizing:border-box!important;overflow:hidden!important}
.action.enum-action ha-icon,.cmd.enum-command ha-icon{flex:0 0 auto!important;grid-row:auto!important}
.action.enum-action select,.cmd.enum-command select{appearance:auto!important;-webkit-appearance:auto!important;min-width:0!important;max-width:170px!important;width:auto!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-size:12px!important;font-weight:600!important;padding:0 2px!important;line-height:1!important;box-shadow:none!important;cursor:pointer!important;grid-column:auto!important}
.action.enum-action select:focus,.cmd.enum-command select:focus{outline:2px solid rgba(20,103,245,.20)!important;outline-offset:3px!important;border-radius:6px!important}
.command-row>.cmd,.command-row>.enum-command{min-width:0!important;width:100%!important}
</style>
        ${hbMobilityReleaseFooter(this.rt)}
      </ha-card>`;
    this.wire();
  }

  wire() {
    this.root.querySelectorAll("button[data-command-id]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const assetId = btn.getAttribute("data-asset-id");
        const commandId = btn.getAttribute("data-command-id");
        const commandKey = btn.getAttribute("data-command-key") || commandId;
        const command = this.rt.commandsFor(assetId).find((c)=>String(c.command_key || c.command_id || "") === String(commandKey) || String(c.command_id || "") === String(commandId));
        if (command) this.rt.callCommand(command);
        btn.classList.add("sent");
      });
    });
    this.root.querySelectorAll("select[data-command-id]").forEach((el) => {
      el.addEventListener("change", () => {
        const assetId = el.getAttribute("data-command-asset");
        const commandId = el.getAttribute("data-command-id");
        const commandKey = el.getAttribute("data-command-key") || commandId;
        const param = el.getAttribute("data-command-param");
        const command = this.rt.commandsFor(assetId).find((c)=>String(c.command_key || c.command_id || "") === String(commandKey) || String(c.command_id || "") === String(commandId));
        if (command && el.value) this.rt.callCommand(command, { [param]: el.value });
      });
    });
    this.root.querySelectorAll("button[data-nav]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.rt.navigate(btn.getAttribute("data-nav"));
      });
    });
    this.root.querySelectorAll('input[type="range"][data-live-target]').forEach((el) => {
      const update = () => {
        const span = el.closest(".range-control")?.querySelector(".live-value");
        if (span) span.textContent = this.rt.formatValue(el.value, el.getAttribute("data-live-unit") || "", el.getAttribute("data-live-key") || "");
      };
      el.addEventListener("input", update);
      update();
    });


    this.root.querySelectorAll(".detail-vehicle-picker").forEach((panel) => {
      const typeSelect = panel.querySelector("[data-vehicle-picker-type]");
      const colorSelect = panel.querySelector("[data-vehicle-picker-color]");
      const saveButton = panel.querySelector("[data-vehicle-picker-save]");
      const keyNode = panel.querySelector(".vehicle-picker-key code");
      const assetId = typeSelect?.getAttribute("data-vehicle-picker-type") || "";
      const picker = new HomeBrainVehicleVisualPicker(this.rt);
      const updatePreview = (resetColor = false) => {
        const catalog = picker.catalog();
        const vehicle = catalog.find((row)=>row.id === String(typeSelect?.value || "")) || catalog[0] || null;
        if (!vehicle || !colorSelect) return;
        const priorColor = resetColor ? "" : colorSelect.value;
        colorSelect.innerHTML = (vehicle.colors || []).map((color)=>`<option value="${this.rt.escape(color.id)}">${this.rt.escape(color.label)}</option>`).join("");
        const color = (vehicle.colors || []).find((row)=>row.id === priorColor) || vehicle.colors?.[0] || null;
        if (color) colorSelect.value = color.id;
        const key = vehicle && color ? rhiMobilityVehicleVisualKey(vehicle.id, color.id) : "";
        if (keyNode) keyNode.textContent = key || "Unavailable";
        if (saveButton) saveButton.setAttribute("data-vehicle-key", key);
        const hero = this.root.querySelector('.hero-image img[data-vehicle-visual-preview="1"]');
        if (hero && vehicle?.package_file) {
          hero.src = this.rt.cache(vehicle.package_file);
          const gray = hero.getAttribute("data-image-gray") || "0";
          hero.style.filter = `grayscale(${gray}) ${color?.filter || "none"} drop-shadow(0 24px 30px rgba(15,35,80,.15))`;
        }
      };
      typeSelect?.addEventListener("change", ()=>updatePreview(true));
      colorSelect?.addEventListener("change", ()=>updatePreview(false));
      saveButton?.addEventListener("click", ()=>{
        if (saveButton.disabled) return;
        const key = saveButton.getAttribute("data-vehicle-key") || "";
        if (assetId && key) this.rt.writePublishedProperty(assetId, "vehicle.image_key", key);
      });
    });

    this.root.querySelectorAll("[data-write-asset][data-write-key]").forEach((el) => {
      const send = () => {
        const assetId = el.getAttribute("data-write-asset");
        const propertyKey = el.getAttribute("data-write-key");
        if (!assetId || !propertyKey) return;
        let value = el.type === "checkbox" ? el.checked : el.value;
        if (el.getAttribute("data-write-toggle") === "1") value = !el.classList.contains("on");
        // V1 readback remains the only durable UI truth. The browser control may
        // show the user's active edit while the write is pending, but UX does not
        // mutate a second local state after dispatch.
        this.rt.writePublishedProperty(assetId, propertyKey, value);
      };
      el.addEventListener(el.tagName === "BUTTON" ? "click" : "change", send);
    });
  }

  styles() {
    return `
      :host { display:block;width:100%;box-sizing:border-box;--hb-blue:#1467F5;--hb-ink:#06142D;--hb-muted:#66728B;--hb-line:#E8EEF7;--hb-card-shadow:0 16px 38px rgba(15,35,80,.070);font-family:inherit;user-select:text;-webkit-user-select:text; }
      ha-card { background:transparent;box-shadow:none;border:none; }
      .page { position:relative;width:min(100%,1560px);max-width:1560px;margin:0 auto;box-sizing:border-box;display:grid;gap:12px;padding:18px 26px 30px; }
      .release-badge { position:absolute;top:6px;right:26px;z-index:3;border:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#33415C;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:650;line-height:1;box-shadow:0 8px 20px rgba(15,35,80,.055); }
      .hero { position:relative;min-height:300px;display:grid;grid-template-columns:minmax(520px,1fr) minmax(420px,43%);gap:28px;align-items:center;padding:26px 42px 22px;border-radius:24px;border:1px solid rgba(14,35,72,.10);background:linear-gradient(135deg,#FFFFFF 0%,#F7FAFF 48%,#EDF4FF 100%);box-shadow:0 18px 42px rgba(15,35,80,.075);overflow:hidden; }
      .hero-topline { display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px; }
      .back-inline { border:0;background:transparent;color:var(--hb-ink);font-weight:650;cursor:pointer;padding:0;font-size:13px;white-space:nowrap; }
      .back-inline:hover { color:var(--hb-blue); }
      .breadcrumb { font-size:13px;font-weight:600;color:#596783;display:flex;gap:8px;align-items:center; }
      .crumb-light { color:#596783; }
      .title-row { display:flex;align-items:center;gap:16px;flex-wrap:wrap; }
      h1 { margin:0;font-size:54px;line-height:.98;letter-spacing:-.06em;font-weight:650;color:var(--hb-ink); }
      .subtitle { margin-top:12px;color:#34405A;font-size:18px;font-weight:650; }
      .pill { display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:8px 15px;font-size:13px;font-weight:650;border:1px solid rgba(14,35,72,.09);white-space:nowrap;line-height:1; }
      .pill.ok { background:#E7F6EA;color:#087A35; }.pill.warn { background:#FFF1D9;color:#B76500; }.pill.bad { background:#FDE4E4;color:#C21E1E; }.pill.muted { background:#EEF1F6;color:#64708A; }
      .status-strip { margin-top:18px;max-width:none;width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));border:1px solid rgba(14,35,72,.11);border-radius:16px;background:rgba(255,255,255,.95);box-shadow:0 14px 34px rgba(15,35,80,.07);overflow:hidden; }
      .metric { display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:center;padding:12px 16px;border-right:1px solid #E6ECF5;min-width:0; }
      .metric:last-child { border-right:0; }.metric ha-icon { --mdc-icon-size:23px;color:var(--hb-blue); }.metric ha-icon.green { color:#10A74C; }
      .metric b { display:block;font-size:15px;font-weight:650;color:var(--hb-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }.metric span { display:block;font-size:11px;font-weight:600;color:var(--hb-muted);margin-top:4px; }

      .metric-copy{min-width:0;}
      .metric-sub{display:block;font-size:10.5px;font-weight:500;color:var(--hb-muted,#66728B);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
      .metric.has-detail-link{grid-template-columns:34px minmax(0,1fr) 30px;}
      .metric-detail-link,.row-detail-link{width:28px;height:28px;border-radius:999px;border:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#1467F5;box-shadow:0 6px 14px rgba(15,35,80,.08);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto;}
      .metric-detail-link ha-icon,.row-detail-link ha-icon{--mdc-icon-size:16px;}
      .row-value-with-link{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;}
      .row-value-with-link span{min-width:0;overflow:hidden;text-overflow:ellipsis;}
      .hero-image { min-height:260px;display:flex;align-items:center;justify-content:center; }
      .hero-image img { width:100%;height:285px;object-fit:contain;object-position:center; }
      .hero-image img.image-fallback { opacity:.42!important; }
      .hero-icon { width:220px;height:220px;border-radius:48px;background:linear-gradient(135deg,#EAF2FF,#FFFFFF);display:flex;align-items:center;justify-content:center;box-shadow:0 24px 55px rgba(15,35,80,.10); }
      .hero-icon ha-icon { --mdc-icon-size:120px;color:var(--hb-blue); }
      .actions { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px; }.action { height:58px;border-radius:14px;border:1px solid rgba(14,35,72,.11);background:#fff;color:var(--hb-ink);font-weight:650;font-size:14px;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 12px 28px rgba(15,35,80,.06);cursor:pointer; }.action ha-icon { --mdc-icon-size:22px;color:var(--hb-blue); }.action.primary { background:linear-gradient(135deg,#1467F5,#3C7BFF);color:#fff;border-color:#1467F5; }.action.primary ha-icon { color:#fff; }
      .action small { display:block;font-size:9.5px;font-weight:650;line-height:1.05;opacity:.72;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; } .enum-action { flex-direction:column;height:auto;min-height:58px;padding:8px 10px; } .enum-action select { max-width:160px;border:1px solid rgba(14,35,72,.15);border-radius:10px;background:#fff;padding:4px 6px;font-size:11px;font-weight:600; } .enum-action.is-disabled { opacity:.55; } .no-actions { grid-column:1/-1;border:1px solid rgba(14,35,72,.10);border-radius:18px;background:#fff;padding:24px;color:var(--hb-muted);font-weight:600; }
      .grid { display:grid;grid-template-columns:repeat(4,minmax(260px,1fr));gap:12px; }
      .section-card { min-height:245px;border-radius:18px;border:1px solid rgba(14,35,72,.10);background:#fff;box-shadow:var(--hb-card-shadow);overflow:hidden; }
      .section-head { display:flex;align-items:center;justify-content:space-between;gap:14px;padding:22px 24px 16px; }.section-title { display:flex;align-items:center;gap:12px;min-width:0; }.section-title ha-icon { --mdc-icon-size:23px;color:var(--hb-blue);flex:none; }.section-title h2 { margin:0;color:var(--hb-ink);font-size:21px;font-weight:650;letter-spacing:-.035em;line-height:1.1; }.section-status { font-size:12px;font-weight:650;color:#50607B;max-width:135px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
      .section-body { border-top:1px solid var(--hb-line);margin:0 24px;padding-top:4px; }
      .action-cluster{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:8px 0 6px}.action-cluster .action{height:38px;min-width:116px;width:auto;padding:0 12px;border-radius:12px;font-size:13px;box-shadow:none}.action-cluster .action small{display:none}
      .unit-suffix{display:inline-flex;align-items:center;margin-left:6px;color:#66728B;font-size:12px;font-weight:600;white-space:nowrap}.row-subheader{margin:12px 0 4px;padding:7px 0 5px;border-bottom:1px solid #EDF2F8;color:#1467F5;font-size:11px;font-weight:650;text-transform:uppercase;letter-spacing:.08em}.row-subheader:first-child{margin-top:4px}.row-subheader-small{margin:7px 0 2px;color:#66728B;font-size:11px;font-weight:600}
      .row,.edit-row { display:grid;grid-template-columns:26px minmax(0,1fr) minmax(140px,auto);gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #EDF2F8; }
      .detail-vehicle-picker{margin:8px 0 12px;border:1px solid #cfe0f6;border-radius:14px;background:linear-gradient(135deg,#fbfdff,#f3f8ff);padding:12px 14px}.vehicle-picker-head{display:flex;justify-content:space-between;gap:14px;align-items:start}.vehicle-picker-head small{font-size:8.5px;letter-spacing:.13em;color:#64748b;font-weight:750}.vehicle-picker-head h3{margin:2px 0;font-size:15px;color:#0f172a}.vehicle-picker-head p{margin:0;font-size:9.5px;color:#64748b}.vehicle-picker-grid{display:grid;grid-template-columns:minmax(180px,1.3fr) minmax(140px,.8fr) minmax(220px,1.4fr) auto;gap:8px;align-items:end;margin-top:10px}.vehicle-picker-grid label,.vehicle-picker-key{display:flex;flex-direction:column;gap:4px}.vehicle-picker-grid label>span,.vehicle-picker-key>span{font-size:8.5px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em}.vehicle-picker-grid select{height:34px;border:1px solid #d7e2ef;border-radius:8px;background:#fff;color:#0f172a;padding:0 8px;font-size:10.5px;font-weight:600}.vehicle-picker-key code{height:34px;display:flex;align-items:center;border:1px solid #d7e2ef;border-radius:8px;background:#fff;padding:0 8px;font-size:8.5px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vehicle-picker-save{height:34px;border:1px solid #0b65ea;border-radius:8px;background:#0b65ea;color:#fff;padding:0 11px;display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;cursor:pointer}.vehicle-picker-save:disabled{background:#e2e8f0;border-color:#d5deea;color:#94a3b8;cursor:not-allowed}.vehicle-picker-gap{margin-top:8px;display:flex;align-items:center;gap:6px;color:#9a5a16;font-size:9.5px}.vehicle-picker-gap ha-icon{--mdc-icon-size:14px}
      @media(max-width:900px){.detail-vehicle-picker .vehicle-picker-grid{grid-template-columns:1fr 1fr}.detail-vehicle-picker .vehicle-picker-key{grid-column:1/-1}.detail-vehicle-picker .vehicle-picker-save{justify-content:center}}
      .row:last-child,.edit-row:last-child { border-bottom:0; }.row ha-icon,.edit-row ha-icon { --mdc-icon-size:19px;color:var(--hb-blue); }
      .label { font-size:13px;font-weight:600;color:#26334F; }.help { color:var(--hb-muted);font-size:11px;font-weight:600;margin-top:2px; }.help.warn{color:#A15C00}.edit-row.is-disabled{opacity:.74}.value { font-size:13px;font-weight:650;color:var(--hb-ink);text-align:right;max-width:155px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
      .edit-control { display:flex;justify-content:flex-end;align-items:center;min-width:0; }
      select,.datetime { height:36px;border:1px solid #DDE6F2;border-radius:10px;background:#fff;color:var(--hb-ink);font-weight:600;padding:0 12px;max-width:190px; }
      select:disabled,.datetime:disabled,input:disabled { opacity:.55;cursor:not-allowed; }
      .range-control { display:flex;align-items:center;gap:10px;min-width:190px; }.range-control input { width:130px;accent-color:var(--hb-blue); }.range-control span { font-size:13px;font-weight:650;color:var(--hb-ink);min-width:42px;text-align:right; }
      .toggle { width:48px;height:28px;border-radius:999px;border:0;background:#CBD5E1;padding:3px;display:flex;justify-content:flex-start;cursor:pointer; }.toggle span { width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18); }.toggle.on { background:var(--hb-blue);justify-content:flex-end; }
      .section-contract-consumption .detail-fold summary,.section-diagnostics .detail-fold summary{color:#66728B}.detail-fold summary { list-style:none;cursor:pointer;color:var(--hb-blue);font-size:13px;font-weight:650;padding:12px 24px 14px;display:flex;gap:6px;align-items:center; }.detail-fold summary::-webkit-details-marker { display:none; }
      .detail-block { border-top:1px solid #EDF2F8;margin:0 24px 18px;padding-top:12px; }.detail-row { display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid #EDF2F8;padding:8px 0;font-size:12px;color:var(--hb-muted);font-weight:600; }.detail-row b { color:var(--hb-ink);font-weight:650;text-align:right; }

      /* R22.10.3 premium hero layout: large profile-driven vehicle hero with compact intelligence strip and floating charger image. */
      .page { max-width:1540px; gap:16px; padding-top:14px; }
      .release-badge { top:10px; right:34px; font-weight:600; }
      .hero { min-height:390px; display:block; padding:28px 34px 26px; border:0; border-radius:0; background:linear-gradient(180deg,#fff 0%,#f7fbff 78%,#fff 100%); box-shadow:none; overflow:hidden; }
      .hero:after { content:""; position:absolute; left:44%; right:4%; bottom:22px; height:24px; border-radius:50%; background:rgba(15,35,80,.075); filter:blur(18px); z-index:0; }
      .hero-left { position:relative; z-index:2; width:58%; min-width:520px; }
      .hero-topline { margin-bottom:22px; max-width:720px; }
      .back-inline { font-weight:600; font-size:13px; }
      .breadcrumb { font-size:12px; font-weight:500; color:#536078; }
      h1 { font-size:52px; line-height:.96; letter-spacing:-.055em; font-weight:600; color:#071327; max-width:720px; }
      .subtitle { margin-top:14px; font-size:18px; font-weight:500; color:#536078; }
      .title-row { align-items:center; }
      .pill { padding:7px 13px; font-size:12px; font-weight:600; }
      .hero-image { position:absolute; z-index:1; right:122px; top:26px; width:54%; height:330px; min-height:0; display:flex; align-items:flex-start; justify-content:center; pointer-events:none; }
      .hero-image img { width:100%; height:330px; object-fit:contain; object-position:center top; filter:drop-shadow(0 28px 34px rgba(15,35,80,.18))!important; }
      .hero-charger-image { position:absolute; z-index:2; right:34px; top:82px; width:120px; height:218px; display:flex; align-items:center; justify-content:center; pointer-events:none; }
      .hero-charger-image img { max-width:112px; max-height:210px; object-fit:contain; filter:drop-shadow(0 18px 22px rgba(15,35,80,.14)); }
      .status-strip { position:relative; z-index:3; margin-top:46px; max-width:none;width:100%; grid-template-columns:repeat(5,minmax(0,1fr)); border-radius:17px; background:rgba(255,255,255,.94); backdrop-filter:blur(10px); box-shadow:0 16px 32px rgba(15,35,80,.08); }
      .metric { min-height:72px; grid-template-columns:30px minmax(0,1fr); gap:9px; padding:10px 13px; }
      .metric ha-icon { --mdc-icon-size:22px; color:#1467F5; }
      .metric.tone-green ha-icon { color:#18A957; }.metric.tone-orange ha-icon { color:#F59E0B; }.metric.tone-blue ha-icon { color:#1467F5; }
      .metric span { font-size:10px; font-weight:500; color:#536078; margin:0 0 4px; text-transform:none; }
      .metric b { font-size:14px; font-weight:650; color:#071327; }
      .actions { min-height:64px; border:1px solid rgba(14,35,72,.08); border-radius:18px; background:rgba(255,255,255,.94); box-shadow:0 10px 24px rgba(15,35,80,.045); padding:10px 18px; grid-template-columns:130px repeat(6,minmax(120px,170px)); align-items:center; justify-content:start; }
      .actions-title { font-size:14px; font-weight:650; color:#071327; }
      .action { height:42px; min-height:42px; border-radius:12px; font-size:13px; font-weight:600; box-shadow:none; }
      .action.primary { background:#1467F5; }
      .grid { grid-template-columns:repeat(4,minmax(250px,1fr)); gap:16px; }
      .section-card { border-radius:18px; min-height:310px; box-shadow:0 14px 32px rgba(15,35,80,.055); }
      .section-title h2 { font-size:19px; font-weight:650; letter-spacing:-.025em; }
      .section-status { font-weight:600; }
      .label { font-weight:500; color:#14213b; }
      .value, .range-control span, .detail-row b { font-weight:650; }
      select,.datetime { font-weight:500; }
      @media (max-width:1100px) { .grid { grid-template-columns:repeat(2,minmax(0,1fr)); }.actions { grid-template-columns:repeat(2,minmax(0,1fr)); }.hero { grid-template-columns:1fr; }.hero-image { min-height:220px; } }
      @media (max-width:760px) { .page { padding:14px; }.hero { padding:24px 20px 20px;grid-template-columns:1fr;min-height:0; } h1 { font-size:38px; }.status-strip { grid-template-columns:1fr 1fr; }.metric:nth-child(2){border-right:0}.metric:nth-child(1),.metric:nth-child(2){border-bottom:1px solid #E6ECF5}.grid { grid-template-columns:1fr; }.actions { grid-template-columns:1fr; }.hero-topline { align-items:flex-start; }.row,.edit-row { grid-template-columns:26px minmax(0,1fr); }.edit-control,.value { grid-column:2;justify-content:flex-start;text-align:left; } }

      @media (max-width:1100px) {
        .hero { min-height:560px; padding:24px 24px 22px; }
        .hero-left { width:100%; min-width:0; }
        .hero-image { position:relative; right:auto; top:auto; width:100%; height:260px; margin-top:12px; }
        .hero-image img { height:260px; }
        .hero-charger-image { right:24px; top:270px; width:96px; height:170px; }
        .hero-charger-image img { max-width:90px; max-height:165px; }
        .status-strip { margin-top:16px; max-width:100%; }
        .actions { grid-template-columns:1fr 1fr 1fr; }
        .actions-title { grid-column:1/-1; }
      }
      @media (max-width:760px) {
        .hero { min-height:0; padding:22px 16px 18px; }
        h1 { font-size:38px; }
        .subtitle { font-size:15px; }
        .hero-image { height:210px; }
        .hero-image img { height:210px; }
        .hero-charger-image { position:absolute; right:18px; top:220px; width:72px; height:120px; }
        .hero-charger-image img { max-width:70px; max-height:118px; }
        .status-strip { grid-template-columns:1fr; border-radius:16px; }
        .metric { border-right:0; border-bottom:1px solid #E6ECF5; min-height:58px; }
        .metric:last-child { border-bottom:0; }
        .actions { grid-template-columns:1fr; }
      }


      /* R22.10.3 implementation of approved premium mock: calm white hero, vehicle behind compact status strip, charger image only, footer activity bar. */
      .page { max-width:1560px; gap:14px; padding:18px 24px 32px; }
      .release-badge { top:10px; right:30px; font-weight:600; }
      .hero { min-height:350px; position:relative; padding:28px 34px 20px; background:#fff; border:0; border-radius:0; box-shadow:none; overflow:hidden; }
      .hero:before { content:""; position:absolute; inset:22px 0 auto 44%; height:330px; background:radial-gradient(circle at 54% 56%, rgba(20,103,245,.075), transparent 56%); z-index:0; pointer-events:none; }
      .hero:after { content:""; position:absolute; left:55%; right:9%; bottom:54px; height:22px; border-radius:50%; background:rgba(15,35,80,.10); filter:blur(18px); z-index:0; }
      .hero-left { position:relative; z-index:3; width:57%; min-width:540px; }
      .hero-topline { margin-bottom:24px; max-width:760px; }
      .breadcrumb { font-size:12px; font-weight:500; color:#536078; }
      .back-inline { font-size:13px; font-weight:650; color:#071327; }
      h1 { font-size:64px; line-height:.90; letter-spacing:-.06em; font-weight:600; color:#071327; max-width:760px; margin:0; }
      .subtitle { margin-top:14px; font-size:17px; font-weight:500; color:#536078; }
      .title-row { gap:16px; align-items:center; }
      .pill { padding:7px 14px; font-size:12px; font-weight:650; }
      .hero-image { position:absolute; z-index:1; right:110px; top:56px; width:56%; height:290px; min-height:0; display:flex; align-items:flex-start; justify-content:center; pointer-events:none; }
      .hero-image img { width:100%; height:300px; object-fit:contain; object-position:center top; filter:drop-shadow(0 26px 30px rgba(15,35,80,.17))!important; }
      .hero-charger-image { position:absolute; z-index:2; right:32px; top:92px; width:105px; height:178px; display:flex; align-items:center; justify-content:center; background:transparent; pointer-events:none; }
      .hero-charger-image img { max-width:102px; max-height:170px; object-fit:contain; filter:drop-shadow(0 16px 20px rgba(15,35,80,.13)); }
      .hero-charger-name{position:absolute;left:50%;top:-10px;transform:translateX(-50%);max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;font-weight:600;color:var(--hb-ink,#0F172A);text-align:center;}
      .hero-charger-detail-link{position:absolute;right:2px;bottom:12px;width:30px;height:30px;border-radius:999px;border:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#1467F5;box-shadow:0 8px 20px rgba(15,35,80,.10);display:flex;align-items:center;justify-content:center;pointer-events:auto;}
      .hero-charger-detail-link ha-icon{--mdc-icon-size:17px;}

      .status-strip { position:relative; z-index:4; margin-top:50px; max-width:none;width:100%; display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); border-radius:16px; border:1px solid rgba(14,35,72,.10); background:rgba(255,255,255,.96); backdrop-filter:blur(10px); box-shadow:0 14px 28px rgba(15,35,80,.075); overflow:hidden; }
      .metric { min-height:58px; grid-template-columns:26px minmax(0,1fr); gap:8px; padding:8px 12px; }
      .metric ha-icon { --mdc-icon-size:21px; }
      .metric span { font-size:10px; font-weight:500; color:#536078; margin:0 0 3px; text-transform:none; }
      .metric b { font-size:13px; font-weight:650; color:#071327; }
      .actions { min-height:56px; border:1px solid rgba(14,35,72,.08); border-radius:17px; background:rgba(255,255,255,.96); box-shadow:0 10px 22px rgba(15,35,80,.045); padding:9px 16px; grid-template-columns:130px repeat(6,minmax(118px,165px)); align-items:center; justify-content:start; gap:12px; }
      .actions-title { font-size:14px; font-weight:650; color:#071327; }
      .action { height:40px; min-height:40px; border-radius:12px; font-size:13px; font-weight:600; box-shadow:none; }
      .grid { grid-template-columns:repeat(4,minmax(250px,1fr)); gap:16px; }
      .section-card { min-height:300px; border-radius:18px; box-shadow:0 14px 32px rgba(15,35,80,.055); }
      .section-title h2 { font-size:19px; font-weight:650; letter-spacing:-.025em; }
      .section-status,.label,select,.datetime { font-weight:500; }
      .value,.range-control span,.detail-row b { font-weight:650; }
      .footer-activity { border:1px solid rgba(14,35,72,.08); border-radius:18px; background:#fff; box-shadow:0 14px 32px rgba(15,35,80,.055); padding:14px 18px; }
      .footer-title { font-size:16px; font-weight:650; color:#071327; margin-bottom:10px; }
      .footer-items { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)) auto; gap:14px; align-items:center; }
      .footer-item { display:grid; grid-template-columns:44px minmax(0,1fr); gap:12px; align-items:center; min-height:58px; border-right:1px solid #EDF2F8; padding-right:14px; }
      .footer-icon { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#F3F7FE; }
      .footer-icon ha-icon { --mdc-icon-size:22px; color:#1467F5; }
      .footer-item.tone-ok .footer-icon { background:#E9F8EF; }.footer-item.tone-ok .footer-icon ha-icon { color:#18A957; }
      .footer-item.tone-warn .footer-icon { background:#FFF3D8; }.footer-item.tone-warn .footer-icon ha-icon { color:#F59E0B; }
      .footer-item b { display:block; font-size:13px; font-weight:650; color:#071327; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .footer-item span { display:block; font-size:12px; font-weight:500; color:#34405A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px; }
      .footer-item small { display:block; font-size:11px; color:#66728B; margin-top:2px; }
      .footer-more { height:42px; border-radius:12px; border:1px solid rgba(14,35,72,.11); background:#fff; color:#071327; font-weight:650; display:flex; align-items:center; gap:8px; padding:0 16px; cursor:pointer; }
      .footer-more ha-icon { --mdc-icon-size:18px; color:#071327; }
      @media (max-width:1200px) { .hero-left{width:100%;min-width:0}.hero{min-height:520px}.hero-image{position:relative;right:auto;top:auto;width:100%;height:240px;margin-top:12px}.hero-image img{height:240px}.hero-charger-image{right:30px;top:280px}.status-strip{margin-top:12px;max-width:100%}.footer-items{grid-template-columns:1fr 1fr}.footer-more{justify-content:center}.grid{grid-template-columns:repeat(2,minmax(0,1fr));} }
      @media (max-width:760px) { .page{padding:14px}.hero{min-height:0;padding:22px 16px 18px} h1{font-size:40px}.subtitle{font-size:15px}.hero-image{height:190px}.hero-image img{height:190px}.hero-charger-image{top:225px;right:18px;width:72px;height:112px}.hero-charger-image img{max-width:70px;max-height:110px}.status-strip{grid-template-columns:1fr}.metric{border-right:0;border-bottom:1px solid #E6ECF5}.metric:last-child{border-bottom:0}.actions,.grid,.footer-items{grid-template-columns:1fr}.footer-item{border-right:0;border-bottom:1px solid #EDF2F8;padding-bottom:10px}.footer-item:last-of-type{border-bottom:0}.actions-title{grid-column:auto} }

      /* rc.23 mobile detail density + picker hardening */
      @media (max-width:560px) {
        .page{padding:8px!important;gap:8px!important}
        .hero{padding:16px 12px 12px!important;border-radius:16px!important}
        h1{font-size:30px!important}
        .hero-image{height:145px!important;margin-top:6px!important}
        .hero-image img{height:145px!important}
        .hero-charger-image{top:170px!important;right:12px!important;width:60px!important;height:86px!important}
        .hero-charger-image img{max-width:58px!important;max-height:82px!important}
        .status-strip{margin-top:8px!important}
        .metric{padding:9px 10px!important}
        .actions{gap:6px!important}
        .action{min-height:44px!important}
        .section-card{border-radius:14px!important}
        .section-head{padding:10px 12px!important}
        .section-body{padding:0 12px 8px!important}

        .detail-vehicle-picker{margin:6px 0 8px!important;padding:10px!important;border-radius:12px!important}
        .detail-vehicle-picker .vehicle-picker-grid{grid-template-columns:1fr!important;gap:7px!important}
        .detail-vehicle-picker .vehicle-picker-key{grid-column:auto!important}
        .detail-vehicle-picker select,
        .detail-vehicle-picker .vehicle-picker-key code,
        .detail-vehicle-picker .vehicle-picker-save{
          width:100%!important;height:44px!important;min-height:44px!important;box-sizing:border-box!important
        }
        .detail-vehicle-picker .vehicle-picker-save{justify-content:center!important}
        .detail-vehicle-picker .vehicle-picker-head h3{font-size:14px!important}
        .detail-vehicle-picker .vehicle-picker-head p{font-size:10px!important;line-height:1.25!important}
        .detail-vehicle-picker .vehicle-picker-grid label>span,
        .detail-vehicle-picker .vehicle-picker-key>span{font-size:9px!important}
      }


      /* R22.12.11.24 calm detail statusbar polish — icons are semantic hints, color only for active/attention. */
      :host{font-family:inherit!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
      *{font-family:inherit!important;}
      h1{font-size:38px!important;line-height:1.08!important;font-weight:650!important;letter-spacing:-.025em!important;}
      .subtitle,.breadcrumb{font-size:12.5px!important;font-weight:400!important;color:var(--hb-muted,#66728B)!important;}
      .back-inline{font-size:12.5px!important;font-weight:600!important;}
      .pill{font-size:11px!important;font-weight:500!important;}
      .metric span{font-size:10.5px!important;font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
      .metric b{font-size:13.5px!important;font-weight:650!important;}
      .metric-sub{font-size:10.5px!important;font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
      .metric.has-detail-link{grid-template-columns:26px minmax(0,1fr) 30px!important;}
      .actions-title{font-size:13px!important;font-weight:600!important;}
      .action{font-size:12.5px!important;font-weight:600!important;}
      .section-title h2{font-size:18px!important;font-weight:600!important;letter-spacing:-.01em!important;}
      .section-status,.label,.help{font-weight:500!important;}
      .label{font-size:12px!important;color:#26334F!important;}
      .help{font-size:10.5px!important;color:var(--hb-muted,#66728B)!important;}
      .value,.range-control span,.detail-row b{font-size:12.5px!important;font-weight:600!important;}
      .row-subheader{font-size:10.5px!important;font-weight:650!important;letter-spacing:.06em!important;}
      select,.datetime{font-size:12px!important;font-weight:500!important;}
      .title-row .pill{display:none!important;}
      .status-strip{grid-template-columns:repeat(5,minmax(0,1fr))!important;}
      .metric ha-icon{color:var(--secondary-text-color,#66728B)!important;}
      .metric.tone-neutral ha-icon{color:var(--secondary-text-color,#66728B)!important;}
      .metric.tone-active ha-icon{color:var(--primary-color,#1467F5)!important;}
      .metric.tone-attention ha-icon,.metric.tone-orange ha-icon,.metric.tone-warn ha-icon{color:var(--warning-color,#F59E0B)!important;}
      .metric.tone-error ha-icon,.metric.tone-bad ha-icon{color:var(--error-color,#C21E1E)!important;}
      .metric.tone-green ha-icon,.metric.tone-blue ha-icon{color:var(--secondary-text-color,#66728B)!important;}
      .metric.tone-active .metric-sub{color:var(--primary-color,#1467F5)!important;}
      .metric.tone-attention b,.metric.tone-attention .metric-sub,.metric.tone-orange b,.metric.tone-orange .metric-sub,.metric.tone-warn b,.metric.tone-warn .metric-sub{color:var(--warning-color,#A15C00)!important;}
      .metric-sub{display:flex!important;align-items:center;gap:4px;line-height:1.15;}
      .metric-sub .metric-sub-icon{--mdc-icon-size:13px!important;flex:0 0 auto;}
      .metric b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

    `;
  }
}

// ---- src/ui/screens/vehicle-detail.js ----
// 60-vehicle-detail-card.js
// Vehicle detail custom card registration.

class HomeBrainVehicleAssetDetailCard extends HTMLElement {
  setConfig(config) {
    this.config = {
      fallback_name: "Vehicle",
      fallback_profile: "Vehicle",
      fallback_image: rhiMobilityAssetUrl("vehicles/default_vehicle.png"),
      image_base: "",
      dashboard_path: "/mobility-supervisor/dashboard",
      resource_version: UX_VERSION,
      ...config
    };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._lastSignature = "";
  }

  set hass(hass) {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    const id = this.config.vehicle_id;
    const sig = [
      rt.runtimeSignature(id),
      JSON.stringify(rt.propertyRows(id)),
      JSON.stringify(rt.relationshipRows(id)),
      JSON.stringify(rt.commandsFor(id)),
      JSON.stringify(rt.activityRowsFor(id)),
      JSON.stringify(rt.intelligenceRowsFor(id))
    ].join("|");
    if (sig !== this._lastSignature) {
      this._lastSignature = sig;
      const model = new HomeBrainVehicleAdapter(rt, id, this.config).build();
      new HomeBrainAssetShell(this.shadowRoot, rt).render(model);
    }
  }
  getCardSize() { return 12; }
}

// ---- src/ui/screens/charger-detail.js ----
// 70-charger-detail-card.js
// Charger detail custom card registration.

class HomeBrainChargerAssetDetailCard extends HTMLElement {
  setConfig(config) {
    this.config = {
      fallback_name: "Charger",
      fallback_profile: "EV Charger",
      fallback_location: "Home",
      image_base: "",
      dashboard_path: "/mobility-supervisor/dashboard",
      resource_version: UX_VERSION,
      ...config
    };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._lastSignature = "";
  }

  set hass(hass) {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    const id = this.config.charger_id;
    const sig = [
      rt.runtimeSignature(id),
      JSON.stringify(rt.propertyRows(id)),
      JSON.stringify(rt.relationshipRows(id)),
      JSON.stringify(rt.commandsFor(id)),
      JSON.stringify(rt.activityRowsFor(id)),
      JSON.stringify(rt.intelligenceRowsFor(id))
    ].join("|");
    if (sig !== this._lastSignature) {
      this._lastSignature = sig;
      const model = new HomeBrainChargerAdapter(rt, id, this.config).build();
      new HomeBrainAssetShell(this.shadowRoot, rt).render(model);
    }
  }
  getCardSize() { return 12; }
}

if (!customElements.get("homebrain-vehicle-asset-detail-card")) {
  customElements.define("homebrain-vehicle-asset-detail-card", HomeBrainVehicleAssetDetailCard);
}
if (!customElements.get("homebrain-charger-asset-detail-card")) {
  customElements.define("homebrain-charger-asset-detail-card", HomeBrainChargerAssetDetailCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "homebrain-vehicle-asset-detail-card",
  name: "Home Brain Vehicle Asset Detail Card",
  description: "Home Brain asset detail shell with vehicle adapter."
});
window.customCards.push({
  type: "homebrain-charger-asset-detail-card",
  name: "Home Brain Charger Asset Detail Card",
  description: "Home Brain asset detail shell with charger adapter."
});

window.HomeBrainMobilityAssetsVersion = UX_VERSION;
console.info(`Home Intelligence Mobility UX bundle loaded ${UX_VERSION}; backend version is read from the Mobility release contract at runtime.`);



/**
 * Premium operational charger maintenance card.
 *
 * This card replaces the Mobility Asset Viewer in the product navigation. It is
 * not a contract/debug screen: it gives the household operator one calm view of
 * every charger, its connected vehicle, power/session state, trust/freshness and
 * safe maintenance actions. All assets come from the public asset catalog and all buttons from
 * the Mobility command index.
 */

// ---- src/ui/screens/charger-maintenance.js ----
// 80-charger-maintenance-card.js
// Charger overview/maintenance custom card.

class HomeBrainMobilityChargerMaintenanceCard extends HTMLElement {
  setConfig(config) {
    this.config = { dashboard_path: "/mobility-supervisor/dashboard", ...config };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._commandFeedback = this._commandFeedback || new Map();
    this._openPanels = this._openPanels || new Set();
    this._limitDrafts = this._limitDrafts || new Map();
    this._lastSignature = this._lastSignature || "";
    this._lastRenderAt = this._lastRenderAt || 0;
  }

  assetId(charger) { return charger?.asset_id || ""; }
  chargerId(charger) { return String(this.assetId(charger)).replace(/^charger_/, ""); }

  chargerRuntimeReady(rt, charger) {
    // R43.2.53 readiness for the product card means the canonical operational
    // property exists. Source/fact presence is not a substitute.
    return rt.canonicalChargerPropertyValue(this.assetId(charger), "charger.operating_state").resolved;
  }


  chargerImageFromId(id) {
    const rt = this._hass ? new HomeBrainAssetRuntime(this._hass, this.config) : null;
    const assetId = String(id || "").startsWith("charger_") ? String(id) : `charger_${id}`;
    const asset = rt ? (rt.chargerById(assetId) || rt.assetById(assetId) || { asset_id: assetId }) : { asset_id: assetId };
    return rt ? rt.visualImageUrl(asset, "charger", "image", "charger_fallback") : rhiMobilityAssetUrl("chargers/charger_fallback.png");
  }


  renderChargerHero(rt, id, name, status) {
    const img = rt.cache(this.chargerImageFromId(id));
    const tone = this.statusTone(status);
    return `<div class="charger-visual ${tone}">
      <img src="${rt.escape(img)}" alt="${rt.escape(name)}" loading="lazy"
           onerror="this.onerror=null;this.classList.add('failed');this.closest('.charger-visual')?.classList.add('image-missing');" />
      <div class="charger-visual-fallback"><ha-icon icon="${id === 'utility_plug' ? 'mdi:power-socket-eu' : 'mdi:ev-station'}"></ha-icon></div>
    </div>`;
  }

  statusTone(status) {
    const s = String(status || "").toLowerCase();
    if (["charging", "running", "active", "connected", "available", "ready", "healthy", "trusted"].some((w) => s.includes(w))) return "ok";
    if (["fault", "error", "failed", "blocked", "unavailable", "offline"].some((w) => s.includes(w))) return "bad";
    if (["waiting", "preparing", "suspended", "paused", "unknown", "contract gap", "starting", "initializing"].some((w) => s.includes(w))) return "warn";
    if (["idle", "stopped", "disconnected"].some((w) => s.includes(w))) return "muted";
    return "muted";
  }

  commandIcon(command) {
    const id = String(command.command_id || "").toLowerCase();
    if (id.includes("restart") || id.includes("reset")) return "mdi:restart";
    if (id.includes("identify") || id.includes("locate")) return "mdi:crosshairs-gps";
    if (id.includes("unlock")) return "mdi:lock-open-outline";
    if (id.includes("lock")) return "mdi:lock-outline";
    if (id.includes("enable") || id.includes("resume") || id.includes("start")) return "mdi:play";
    if (id.includes("disable") || id.includes("pause") || id.includes("stop")) return "mdi:stop";
    if (id.includes("current") || id.includes("limit")) return "mdi:current-ac";
    if (id.includes("diagnostic")) return "mdi:stethoscope";
    return "mdi:gesture-tap-button";
  }

  commandState(rt, command) {
    // R22.11.24: charger overview must use the same command-state resolver as
    // charger detail. Do not locally disable bound R41.9 commands because power is
    // 0, session is Completed/SuspendedEV, or legacy intent_entity is absent.
    return rt.commandState ? rt.commandState(command) : { disabled: !command, busy: false, failed: false, status: "", reason: "" };
  }


  groupedCommands(rt, assetId) {
    const groups = { primary: [], secondary: [], diagnostic: [], maintenance: [], advanced: [], destructive: [] };
    for (const command of rt.commandRegistry(assetId)) {
      if (command.frontend_allowed === false) continue;
      const category = groups[command.category] ? command.category : "secondary";
      groups[category].push(command);
    }
    return groups;
  }

  field(rt, label, value, icon = "mdi:information-outline") {
    return `<div class="field"><ha-icon icon="${icon}"></ha-icon><span>${rt.escape(label)}</span><b>${rt.escape(value || "—")}</b></div>`;
  }

  detailField(rt, label, value) {
    return `<div class="detail-field"><span>${rt.escape(label)}</span><b>${rt.escape(value || "—")}</b></div>`;
  }

  renderCommand(rt, command, compact = false) {
    const state = this.commandState(rt, command);
    const tone = state.failed ? "failed" : state.busy ? "busy" : "";
    const reason = state.reason || "";
    const enums = command?.enum_options || {};
    const enumName = (command?.required_parameters || []).find((name) => Array.isArray(enums[name]) && enums[name].length) || "";
    if (command?.interaction_mode === "form" && enumName) {
      return `<label class="cmd enum-command ${tone} ${compact ? "compact" : ""} ${state.disabled ? "is-disabled" : ""}" title="${rt.escape(reason || command.label)}">
        <ha-icon icon="${this.commandIcon(command)}"></ha-icon>
        <select aria-label="${rt.escape(command.label)}" data-command-asset="${rt.escape(command.asset_id || "")}" data-command-id="${rt.escape(command.command_id || "")}" data-command-key="${rt.escape(command.command_key || command.command_id || "")}" data-command-param="${rt.escape(enumName)}" ${state.disabled ? "disabled" : ""}>
          <option value="">${rt.escape(command.label)}…</option>
          ${enums[enumName].map((option)=>`<option value="${rt.escape(option.value)}">${rt.escape(option.label || option.value)}</option>`).join("")}
        </select>
      </label>`;
    }
    return `<button class="cmd ${tone} ${compact ? "compact" : ""}" data-command-asset="${rt.escape(command.asset_id || "")}" data-command-id="${rt.escape(command.command_id || "")}" data-command-key="${rt.escape(command.command_key || command.command_id || "")}" ${state.disabled ? "disabled" : ""} title="${rt.escape(reason || command.label)}">
      <ha-icon icon="${this.commandIcon(command)}"></ha-icon>
      <span>${rt.escape(command.label)}</span>
      ${state.busy ? `<small>Busy</small>` : state.failed ? `<small>${rt.escape(state.status)}</small>` : ""}
    </button>`;
  }


  formatKw(rt, value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "0.0";
    const n = Number(raw.replace(",", "."));
    if (!Number.isFinite(n)) return raw;
    const kw = Math.abs(n) > 100 ? n / 1000 : n;
    return kw.toFixed(kw >= 10 ? 1 : 1);
  }

  chargerProperty(rt, assetId, propertyKey, fallback = "—") {
    return rt.canonicalChargerPropertyDisplay(assetId, propertyKey, fallback);
  }

  chargerBinary(rt, assetId, id, fact, fallback = "") {
    const key = String(fact || "").startsWith("charger.") ? String(fact) : `charger.${fact}`;
    return rt.canonicalChargerPropertyDisplay(assetId, key, fallback);
  }



  displayVehicleName(rt, value) {
    const raw = String(value || "").trim();
    if (!raw || ["none", "unknown", "unavailable"].includes(raw.toLowerCase())) return "None";
    const canonical = raw.startsWith("vehicle_") ? raw : `vehicle_${raw.replace(/^vehicle_/, "")}`;
    const reg = rt.registryEntry(canonical);
    return reg?.display_name || rt.vehicleLabel(raw);
  }

  chargerCommands(rt, assetId) {
    // V1: no legacy charger command whitelist. The public command_index is authoritative.
    return rt.commandsFor(assetId).filter((cmd) => cmd.frontend_allowed !== false && cmd.exists !== false);
  }

  choosePrimaryChargerCommand(rt, assetId, chargerState) {
    // Return all published charging-family commands; command state is owned by the backend row.
    return this.chargerCommands(rt, assetId).filter((cmd) => rt.commandFamily(cmd) === "charging");
  }

  canonicalLimitCommand(rt, assetId) {
    return null;
  }

  lifecycleDisplay(rt, charger) {
    const status = rt.lifecycleStatus(charger);
    if (status === "active") return "Active";
    if (status === "disabled") return "Disabled";
    if (status === "retired") return "Retired";
    return "Contract gap";
  }

  lifecycleToggleButton(rt, charger, extraClass = "mini-detail-link lifecycle-toggle icon-only") {
    const status = rt.lifecycleStatus(charger);
    const desired = status === "disabled" ? "active" : "disabled";
    const model = rt.lifecycleWriteModel(charger, desired);
    const label = desired === "active" ? "Activate" : "Disable";
    const title = model.disabled ? (model.reason || "Lifecycle contract gap") : `${label} via lifecycle_status`;
    return `<button class="${extraClass}" data-lifecycle-asset="${rt.escape(this.assetId(charger))}" data-lifecycle-value="${rt.escape(desired)}" ${model.disabled ? "disabled" : ""} title="${rt.escape(title)}"><ha-icon icon="mdi:power"></ha-icon><span>${rt.escape(label)}</span></button>`;
  }

  renderCollapsedCharger(rt, charger) {
    const name = charger.display_name || rt.titleize(charger.asset_id);
    const subtitle = charger.location || charger.profile || "Charger";
    const route = rt.assetDetailRoute(charger);
    return `<article class="inactive-row lifecycle-collapsed-row charger-collapsed-row">
      <span class="inactive-state">${rt.escape(this.lifecycleDisplay(rt, charger))}</span>
      <div class="inactive-copy"><h3>${rt.escape(name)}</h3><p>${rt.escape(subtitle)}</p></div>
      <div class="inactive-actions">${this.lifecycleToggleButton(rt, charger, "cmd compact icon-only lifecycle-toggle")}<button class="cmd compact icon-only" data-nav="${rt.escape(route)}" title="Open charger details"><ha-icon icon="mdi:plus"></ha-icon><span>Details</span></button></div>
    </article>`;
  }

  renderCharger(rt, charger) {
    const id = this.chargerId(charger);
    const assetId = this.assetId(charger);
    const name = charger.display_name || rt.titleize(assetId);
    const runtimeReady = this.chargerRuntimeReady(rt, charger);
    // Each concern resolves independently from its exact R43.2.53 owner. A gap in
    // operating_state must not erase a valid connection/power/relationship value.
    const chargerSnapshot = rt.chargerProductSnapshot(assetId);
    const status = chargerSnapshot.operating.display;
    const connectionState = chargerSnapshot.connection.display;
    const connectedVehicle = chargerSnapshot.connected_vehicle.display;
    const power = chargerSnapshot.power.display;
    const actualCurrent = this.chargerProperty(rt, assetId, "charger.actual_current_a", "—");
    const currentLimit = this.chargerProperty(rt, assetId, "charger.current_limit_a", "—");
    const offeredCurrent = this.chargerProperty(rt, assetId, "charger.offered_current_a", "—");
    const activePhases = "—";
    const session = this.chargerProperty(rt, assetId, "charger.session_energy_kwh", "—");
    const connected = connectionState;
    const enabled = "—";
    const healthSummary = { value:chargerSnapshot.health.display, reason:chargerSnapshot.health.reason, resolved:chargerSnapshot.health.resolved };
    const freshness = "—";
    const trust = healthSummary.value;
    const connector = connectionState;
    const primary = rt.commandActionsFor(assetId, "quick_actions");
    // R43.2.54: all normal product commands render exactly once from
    // charger_actions.commands. Maintenance/diagnostic sections contain context only.
    const maintenance = [];
    const destructive = [];
    const issue = status.toLowerCase().includes("fault") || status.toLowerCase().includes("unavailable") || status.toLowerCase().includes("contract gap") || (healthSummary.resolved && !["ok", "healthy"].includes(String(healthSummary.value || "").toLowerCase()));
    const maintenanceOpen = this._openPanels.has(`${assetId}:maintenance`);
    const configOpen = this._openPanels.has(`${assetId}:config`);
    const mode = "Automatic";
    const dataQuality = trust;
    const lastUpdate = charger.last_seen || "Unknown";
    const roles = Array.isArray(charger.roles) ? charger.roles.join(", ") : (charger.roles || "—");
    const configFields = [
      this.detailField(rt, "Profile", charger.profile || "—"),
      this.detailField(rt, "Location", charger.location || "—"),
      this.detailField(rt, "Lifecycle", this.lifecycleDisplay(rt, charger)),
      this.detailField(rt, "Frontend allowed", String(charger.frontend_allowed !== false)),
      this.detailField(rt, "Mode", mode),
      this.detailField(rt, "Vehicle relationship", connectedVehicle),
      this.detailField(rt, "Connector state", connector),
      this.detailField(rt, "Current limit", currentLimit),
      this.detailField(rt, "Actual current", actualCurrent),
      this.detailField(rt, "Offered current", offeredCurrent),
      this.detailField(rt, "Active phases", activePhases),
      this.detailField(rt, "Power", power),
      this.detailField(rt, "Session energy", session),
      this.detailField(rt, "Execution owner", charger.execution_owner || "—"),
      this.detailField(rt, "Roles", roles),
      this.detailField(rt, "Health", healthSummary.value),
      this.detailField(rt, "Health reason", healthSummary.reason || "—"),
      this.detailField(rt, "Last update", lastUpdate),
      this.detailField(rt, "Command source", "mobility_command_index"),
      this.detailField(rt, "Published commands", String(rt.commandRegistry(assetId).length)),
      this.detailField(rt, "Asset id", assetId),
      this.detailField(rt, "Sort order", String(charger.sort_order ?? "—"))
    ].join("");

    return `<article class="charger-card ${issue ? "attention" : ""}">
      <div class="charger-hero-card premium-image-hero">
        ${this.renderChargerHero(rt, id, name, status)}
        <div class="charger-head">
          <div class="charger-icon"><ha-icon icon="mdi:ev-station"></ha-icon></div>
          <div class="charger-title"><h3>${rt.escape(name)}</h3><p>${rt.escape(charger.location || charger.profile || assetId)}</p></div>
          <span class="status ${this.statusTone(status)}">${rt.escape(status)}</span>
        </div>
      </div>
      <div class="charger-kpis">
        ${this.field(rt, "Power", power, "mdi:flash")}
        ${this.field(rt, "Actual", actualCurrent, "mdi:current-ac")}
        ${this.field(rt, "Limit", currentLimit, "mdi:gauge")}
        ${this.field(rt, "Session", session, "mdi:counter")}
      </div>
      <div class="soft-line">
        <span><ha-icon icon="mdi:ev-plug-type2"></ha-icon>${rt.escape(connector)}</span>
        <span><ha-icon icon="mdi:car-electric"></ha-icon>${rt.escape(connectedVehicle)}</span>
        <span title="Canonical charger health"><ha-icon icon="mdi:shield-check-outline" style="color:#1467F5;--mdc-icon-size:23px"></ha-icon>${rt.escape(healthSummary.value)}</span>
        <button class="mini-detail-link details-action icon-only" data-nav="${rt.escape(rt.assetDetailRoute(charger))}" title="Open charger details"><ha-icon icon="mdi:plus"></ha-icon></button>
        ${this.lifecycleToggleButton(rt, charger)}
      </div>
      <div class="command-row">${primary.length ? primary.map((c) => this.renderCommand(rt, c)).join("") : `<div class="empty-actions">No product command placement published for this charger.</div>`}</div>
      <section class="fold-section ${maintenanceOpen ? "open" : ""}" data-panel-key="${rt.escape(`${assetId}:maintenance`)}">
        <button class="fold-toggle" data-toggle-panel="${rt.escape(`${assetId}:maintenance`)}" type="button"><ha-icon icon="mdi:chevron-${maintenanceOpen ? "down" : "right"}"></ha-icon><span>Maintenance & diagnostics</span></button>
        <div class="fold-panel">
          <div class="detail-grid">
            ${this.detailField(rt, "Health", healthSummary.value)}
            ${this.detailField(rt, "Health reason", healthSummary.reason || "—")}
            ${this.detailField(rt, "Command placement", "charger_actions.commands")}
            ${this.detailField(rt, "Command readiness", "Command Index")}
          </div>
        </div>
      </section>
      <section class="fold-section config-details ${configOpen ? "open" : ""}" data-panel-key="${rt.escape(`${assetId}:config`)}">
        <button class="fold-toggle" data-toggle-panel="${rt.escape(`${assetId}:config`)}" type="button"><ha-icon icon="mdi:chevron-${configOpen ? "down" : "right"}"></ha-icon><span>Profile & detailed configuration</span></button>
        <div class="fold-panel"><div class="detail-grid">${configFields}</div></div>
      </section>
    </article>`;
  }

  set hass(hass) {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    const factory = new HomeBrainAssetFactory(rt);
    const chargers = factory.chargers().filter((a) => rt.lifecycleStatus(a) !== "retired").sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.display_name).localeCompare(String(b.display_name)));
    const activeChargers = chargers.filter((c) => rt.lifecycleStatus(c) === "active");
    const inactiveChargers = chargers.filter((c) => rt.lifecycleStatus(c) !== "active" && rt.lifecycleStatus(c) !== "retired");
    const operational = activeChargers.filter((c) => this.chargerRuntimeReady(rt, c)).length;
    const totalPower = activeChargers.reduce((sum, c) => {
      const exact = rt.canonicalChargerPropertyValue(c.asset_id, "charger.power_kw");
      const n = exact.resolved ? Number(String(exact.value).replace(",", ".")) : NaN;
      const kw = Number.isFinite(n) ? (Math.abs(n) > 100 ? n / 1000 : n) : 0;
      return sum + kw;
    }, 0);
    const signature = JSON.stringify({
      assets: chargers.map((c) => {
        const assetId = c.asset_id;
        const id = String(assetId || "").replace(/^charger_/, "");
        const commands = rt.commandRegistry(assetId).map((cmd) => [cmd.command_id, cmd.frontend_allowed, cmd.execution_allowed, cmd.execution_status || "", cmd.blocked_reason || cmd.execution_reason || ""]);
        return [assetId, c.display_name, c.profile, c.location, rt.lifecycleStatus(c),
          rt.chargerOperationalStatus(assetId),
          rt.chargerConnectionState(assetId),
          rt.chargerConnectedVehicleLabel(assetId),
          this.chargerProperty(rt, assetId, "charger.power_kw", ""),
          this.chargerProperty(rt, assetId, "charger.actual_current_a", this.chargerProperty(rt, assetId, "charger.current_a", "")),
          this.chargerProperty(rt, assetId, "charger.current_limit_a", ""),
          this.chargerProperty(rt, assetId, "charger.session_energy_kwh", ""),
          rt.chargerHealthSummary(assetId).value,
          rt.chargerHealthSummary(assetId).reason,
          commands];
      }),
      open: Array.from(this._openPanels || []).sort(),
      drafts: Array.from(this._limitDrafts || []),
      feedback: Array.from(this._commandFeedback || []).filter(([, until]) => Date.now() < until)
    });
    const activeEl = this.shadowRoot?.activeElement;
    if (this._lastSignature === signature && this._lastRenderOk && !(activeEl && ["SELECT", "INPUT"].includes(activeEl.tagName))) return;
    this._lastSignature = signature;
    this._lastRenderOk = true;

    this.shadowRoot.innerHTML = `<ha-card>
      <div class="page">
        <div class="hi-version-block" style="position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0;margin:0;z-index:3;pointer-events:none;"><div>UX ${rt.escape(UX_VERSION)}</div><div>Backend ${rt.escape(rt.backendVersion())}</div></div>
        ${hbMobilityNav(this.config?.nav_active || "chargers")}
        <section class="title ops-title"><h1>Chargers</h1><p>Vehicle readiness, charging, comfort and security in one calm control cockpit.</p></section>
        <section class="status-strip ops-status-strip" style="display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;border:1px solid rgba(14,35,72,.11)!important;border-radius:17px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 16px 32px rgba(15,35,80,.08)!important;overflow:hidden!important;max-width:none!important;width:100%!important;margin:8px 0 10px!important">
          <div class="metric tone-green" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:check-circle-outline" style="color:#18A957;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Status</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(operational === activeChargers.length ? "OK" : "Contract gap")}</b></div></div>
          <div class="metric tone-blue" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:shield-check-outline" style="color:#1467F5;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Trust</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(rt.supervisorOutcome("chargers", "trust", rt.supervisorOutcome("mobility", "trust", "Unknown")) || "Unknown")}</b></div></div>
          <div class="metric tone-orange" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:alert-circle-outline" style="color:#F59E0B;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Attention</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(activeChargers.length === operational ? "None" : "Contract gap")}</b></div></div>
          <div class="metric tone-green" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:lightbulb-outline" style="color:#18A957;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Opportunity</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(rt.supervisorOutcome("chargers", "opportunity", rt.supervisorOutcome("mobility", "opportunity", "charge_when_optimal")) || "charge_when_optimal")}</b></div></div>
          <div class="metric tone-blue" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important"><ha-icon icon="mdi:arrow-right-circle-outline" style="color:#1467F5;--mdc-icon-size:23px"></ha-icon><div><span style="display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1">Recommended action</span><b style="display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rt.escape(rt.supervisorOutcome("chargers", "recommended_action", activeChargers.length === operational ? "No immediate action" : "Review charger contract gaps") || (activeChargers.length === operational ? "No immediate action" : "Review charger contract gaps"))}</b></div></div>
        </section>
        <section class="section-title"><h2>Active chargers</h2><span>${activeChargers.length} active · ${operational} operational · ${totalPower.toFixed(1)} kW now</span></section>
        <section class="grid">
          ${activeChargers.length ? activeChargers.map((c) => this.renderCharger(rt, c)).join("") : `<div class="empty-state"><ha-icon icon="mdi:ev-station-off"></ha-icon><h2>No active chargers</h2><p>Activate a charger below when needed.</p></div>`}
        </section>
        ${inactiveChargers.length ? `<section class="section-title compact-title"><h2>Inactive chargers</h2><span>${inactiveChargers.length} inactive</span></section><section class="inactive-list">${inactiveChargers.map((c)=>this.renderCollapsedCharger(rt,c)).join("")}</section>` : `<section class="debt-strip"><ha-icon icon="mdi:information-outline"></ha-icon><b>Inactive chargers (0)</b><span>Disabled chargers are hidden.</span></section>`}
        <section class="bottom-grid"><div class="info"><h3><ha-icon icon="mdi:calendar-clock"></ha-icon>Charging Plan</h3><p>${rt.escape(rt.supervisorOutcome("mobility", "opportunity", "") || "Supervised")}</p></div><div class="info"><h3><ha-icon icon="mdi:shield-check-outline" style="color:#1467F5;--mdc-icon-size:23px"></ha-icon>System Trust</h3><p>${rt.escape(rt.supervisorOutcome("mobility", "trust", "") || "Unknown")}</p></div><div class="info"><h3><ha-icon icon="mdi:history"></ha-icon>Recent Activity</h3><p>No recent activity requiring attention.</p></div></section>
      </div>
      <style>${this.styles()}
/* R22.12.11.24 unified quick-action sizing */
.action.enum-action,.cmd.enum-command{height:43px!important;min-height:43px!important;max-height:43px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:0 11px!important;box-sizing:border-box!important;overflow:hidden!important}
.action.enum-action ha-icon,.cmd.enum-command ha-icon{flex:0 0 auto!important;grid-row:auto!important}
.action.enum-action select,.cmd.enum-command select{appearance:auto!important;-webkit-appearance:auto!important;min-width:0!important;max-width:170px!important;width:auto!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-size:12px!important;font-weight:600!important;padding:0 2px!important;line-height:1!important;box-shadow:none!important;cursor:pointer!important;grid-column:auto!important}
.action.enum-action select:focus,.cmd.enum-command select:focus{outline:2px solid rgba(20,103,245,.20)!important;outline-offset:3px!important;border-radius:6px!important}
.command-row>.cmd,.command-row>.enum-command{min-width:0!important;width:100%!important}
</style>
      ${hbMobilityReleaseFooter(rt)}
    </ha-card>`;

    this.shadowRoot.querySelectorAll("button[data-command-id]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (btn.disabled) return;
        const assetId = btn.getAttribute("data-command-asset");
        const commandId = btn.getAttribute("data-command-id");
        const command = rt.commandsFor(assetId).find((c)=>String(c.command_id || "") === String(commandId));
        if (!command) return;
        rt.callCommand(command);
      });
    });
    this.shadowRoot.querySelectorAll("select[data-command-id]").forEach((select) => {
      select.addEventListener("change", (ev) => {
        ev.stopPropagation();
        if (select.disabled || !select.value) return;
        const assetId = select.getAttribute("data-command-asset") || "";
        const commandId = select.getAttribute("data-command-id") || "";
        const commandKey = select.getAttribute("data-command-key") || commandId;
        const parameter = select.getAttribute("data-command-param") || "";
        const command = rt.commandsFor(assetId).find((candidate)=>String(candidate.command_key || candidate.command_id || "") === String(commandKey) || String(candidate.command_id || "") === String(commandId));
        if (!command || !parameter) return;
        rt.callCommand(command, { [parameter]: select.value });
        select.value = "";
      });
    });
    this.shadowRoot.querySelectorAll("button[data-toggle-panel]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const key = btn.getAttribute("data-toggle-panel");
        if (!key) return;
        const section = btn.closest(".fold-section");
        const icon = btn.querySelector("ha-icon");
        if (this._openPanels.has(key)) {
          this._openPanels.delete(key);
          section?.classList.remove("open");
          if (icon) icon.setAttribute("icon", "mdi:chevron-right");
        } else {
          this._openPanels.add(key);
          section?.classList.add("open");
          if (icon) icon.setAttribute("icon", "mdi:chevron-down");
        }
      });
    });
    this.shadowRoot.querySelectorAll("button[data-lifecycle-asset]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (btn.disabled) return;
        const assetId = btn.getAttribute("data-lifecycle-asset") || "";
        const value = btn.getAttribute("data-lifecycle-value") || "";
        if (!assetId || !value) return;
        const ok = rt.writeLifecycleStatus(assetId, value);
        if (!ok) return;
        btn.classList.add("sent");
        this._lastSignature = "";
        setTimeout(()=>{ if (this.isConnected) this.hass = this._hass; }, 650);
      });
    });
    this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const path = btn.getAttribute("data-nav");
        if (path) rt.navigate(path);
      });
    });
  }

  styles() {
    return `
      :host{display:block;--hb-blue:#1467F5;--hb-soft-blue:#EEF5FF;--hb-ink:#06142D;--hb-muted:#66728B;--hb-line:#E6EDF7;--hb-shadow:0 18px 44px rgba(15,35,80,.075);font-family:inherit;user-select:text;-webkit-user-select:text;color:var(--hb-ink)}
      ha-card{background:transparent;border:0;box-shadow:none}.page{position:relative;width:min(100%,1560px);margin:0 auto;padding:18px 26px 30px;box-sizing:border-box;display:grid;gap:12px}.release-badge{position:absolute;top:6px;right:26px;z-index:3;border:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#33415C;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:650;line-height:1;box-shadow:0 8px 20px rgba(15,35,80,.055)}.hero{border:1px solid rgba(14,35,72,.10);border-radius:24px;background:linear-gradient(135deg,#FFFFFF 0%,#F8FBFF 48%,#EEF5FF 100%);box-shadow:var(--hb-shadow);padding:28px 34px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center}.hero-side{display:grid;grid-template-columns:auto auto;gap:12px;align-items:center}.hero-side.no-registered-chargers{grid-template-columns:auto;justify-self:end}.charger-hero-visual{width:230px;height:112px;border-radius:24px;background:linear-gradient(135deg,rgba(238,245,255,.95),rgba(255,255,255,.7));border:1px solid rgba(20,103,245,.10);display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:inset 0 1px 0 rgba(255,255,255,.7)}.charger-device{position:relative;width:58px;height:82px;border-radius:18px;background:#FFFFFF;border:1px solid var(--hb-line);box-shadow:0 14px 30px rgba(15,35,80,.12);display:flex;align-items:center;justify-content:center}.charger-device ha-icon{--mdc-icon-size:34px;color:var(--hb-blue)}.charger-device span{position:absolute;top:9px;width:22px;height:4px;border-radius:99px;background:#2DD56F}.flow-line{width:64px;height:6px;border-radius:999px;background:linear-gradient(90deg,#CFE0FF,#1467F5);box-shadow:0 0 18px rgba(20,103,245,.25)}.charger-car{width:58px;height:58px;border-radius:20px;background:#fff;border:1px solid var(--hb-line);box-shadow:0 14px 30px rgba(15,35,80,.10);display:flex;align-items:center;justify-content:center}.charger-car ha-icon{--mdc-icon-size:34px;color:var(--hb-ink)}.eyebrow{font-size:12px;font-weight:650;letter-spacing:.08em;text-transform:uppercase;color:var(--hb-blue);margin-bottom:8px}h1{font-size:46px;line-height:1;letter-spacing:-.055em;margin:0 0 10px;font-weight:650}p{margin:0;color:#34405A;font-size:16px;line-height:1.45;font-weight:600;max-width:780px}.hero-metrics{display:grid;grid-template-columns:repeat(3,112px);gap:10px}.hero-metrics div{background:rgba(255,255,255,.92);border:1px solid var(--hb-line);border-radius:18px;padding:14px;text-align:center;box-shadow:0 10px 28px rgba(15,35,80,.055)}.hero-metrics b{display:block;font-size:28px;font-weight:650}.hero-metrics span{font-size:12px;color:var(--hb-muted);font-weight:600}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:16px;align-items:start}.inactive-list{display:grid;gap:10px}.inactive-row{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:0 12px 36px rgba(15,35,80,.055);padding:10px 12px;display:grid;grid-template-columns:82px 1fr auto;gap:14px;align-items:center}.inactive-state{background:#EEF2F7;color:#53627A;border-radius:999px;font-weight:650;font-size:12px;padding:7px 10px;text-align:center}.inactive-copy h3{margin:0 0 2px;font-size:16px;font-weight:650}.inactive-copy p{margin:0;color:#64708A;font-weight:600}.inactive-actions{display:flex;gap:8px}.cmd.icon-only{width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important}.cmd.icon-only span{display:none!important}.debt-strip{display:flex;align-items:center;gap:12px;background:#F8FBFF;border:1px solid #DDEAFF;border-radius:18px;padding:12px 18px;color:#45536C;font-size:13px;font-weight:600}.debt-strip ha-icon{color:#1467F5}.charger-card{background:#fff;border:1px solid var(--hb-line);border-radius:22px;box-shadow:var(--hb-shadow);padding:18px;display:grid;gap:15px;min-width:0;align-self:start;align-content:start}.charger-card.attention{border-color:rgba(242,140,0,.35);background:linear-gradient(180deg,#fff,#fffaf3)}.charger-hero-card{min-height:150px;border-radius:20px;border:1px solid rgba(20,103,245,.10);background:linear-gradient(135deg,#FFFFFF 0%,#F7FAFF 52%,#EEF5FF 100%);padding:14px;display:grid;grid-template-columns:minmax(0,1fr) 124px;gap:10px;align-items:center;overflow:hidden}.charger-head{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:13px;align-items:center}.charger-head.compact{grid-template-columns:44px minmax(0,1fr);align-content:start}.charger-head.compact .status{grid-column:1/-1;justify-self:start;margin-top:10px}.charger-icon{width:48px;height:48px;border-radius:16px;background:var(--hb-soft-blue);display:flex;align-items:center;justify-content:center}.charger-icon ha-icon{--mdc-icon-size:26px;color:var(--hb-blue)}h3{margin:0;font-size:18px;font-weight:650;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.charger-title p{font-size:12px;color:var(--hb-muted);font-weight:600;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.charger-visual{position:relative;height:128px;border-radius:18px;background:rgba(255,255,255,.72);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}.charger-visual:before{content:"";position:absolute;inset:auto 14px 14px;height:12px;border-radius:50%;background:rgba(15,35,80,.08);filter:blur(8px)}.charger-visual img{position:relative;z-index:2;max-width:118px;max-height:118px;object-fit:contain;filter:drop-shadow(0 18px 22px rgba(15,35,80,.16))}.charger-visual img.failed{display:none}.charger-visual-fallback{display:none;position:relative;z-index:1;width:86px;height:86px;border-radius:26px;background:#fff;border:1px solid var(--hb-line);align-items:center;justify-content:center;box-shadow:0 16px 30px rgba(15,35,80,.10)}.charger-visual.image-missing .charger-visual-fallback{display:flex}.charger-visual-fallback ha-icon{--mdc-icon-size:46px;color:var(--hb-blue)}.status{border-radius:999px;padding:7px 10px;font-size:12px;font-weight:650;border:1px solid rgba(14,35,72,.08);white-space:nowrap}.status.ok{background:#E7F6EA;color:#087A35}.status.warn{background:#FFF1D9;color:#B76500}.status.bad{background:#FDE4E4;color:#C21E1E}.status.muted{background:#EEF1F6;color:#64708A}.charger-kpis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.field{border:1px solid var(--hb-line);background:#FAFCFF;border-radius:15px;padding:11px;display:grid;grid-template-columns:24px minmax(0,1fr);column-gap:8px;align-items:center}.field ha-icon{--mdc-icon-size:20px;color:var(--hb-blue);grid-row:1/3}.field span{font-size:11px;color:var(--hb-muted);font-weight:600}.field b{font-size:14px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.soft-line{display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid rgba(14,35,72,.07);padding-top:12px}.soft-line span{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--hb-line);background:#fff;border-radius:999px;padding:6px 9px;color:#34405A;font-size:12px;font-weight:600}.soft-line ha-icon{--mdc-icon-size:16px;color:var(--hb-blue)}.mini-detail-link.icon-only{width:36px;height:36px;min-width:34px;border-radius:13px;border:1px solid var(--hb-line);background:#fff;color:#1467F5;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 10px 22px rgba(15,35,80,.05);padding:0;cursor:pointer}.mini-detail-link.icon-only ha-icon{--mdc-icon-size:18px;color:#1467F5}.mini-detail-link.icon-only span{display:none!important}.command-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px}.cmd{min-height:43px;border:1px solid rgba(14,35,72,.10);border-radius:13px;background:#fff;color:var(--hb-ink);box-shadow:0 10px 22px rgba(15,35,80,.05);font-weight:650;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;padding:0 10px}.cmd ha-icon{--mdc-icon-size:19px;color:var(--hb-blue)}.cmd.sent{background:#EEF5FF;border-color:#CFE0FF;color:#0B4BC1}.cmd.busy{background:#FFF8E8;border-color:#F8DB99}.cmd.failed{background:#FEF3F2;border-color:#FECDCA;color:#B42318}.cmd:disabled{opacity:.56;cursor:not-allowed;box-shadow:none}.cmd small{font-size:10px;color:var(--hb-muted);font-weight:650}.cmd.compact{min-height:38px;font-size:12px}.cmd.enum-command{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto auto;gap:4px 8px;padding:7px 10px}.cmd.enum-command ha-icon{grid-row:1/3}.cmd.enum-command span{text-align:left}.cmd.enum-command select{grid-column:2;border:1px solid var(--hb-line);border-radius:8px;background:#fff;color:var(--hb-ink);font:inherit;font-size:11px;padding:4px 6px;min-width:0}.cmd.enum-command.is-disabled{opacity:.56}.fold-section{border-top:1px solid rgba(14,35,72,.07);padding-top:8px}.fold-toggle{appearance:none;border:0;background:transparent;color:var(--hb-blue);font-size:13px;font-weight:650;display:flex;align-items:center;gap:4px;padding:0;cursor:pointer}.fold-toggle ha-icon{--mdc-icon-size:16px}.fold-panel{display:none;margin-top:10px}.fold-section.open .fold-panel{display:block}.maintenance-row{margin-top:0}.limit-control{grid-column:1/-1;border:1px solid var(--hb-line);border-radius:15px;background:#FAFCFF;padding:11px;display:grid;gap:9px}.limit-control.missing{grid-template-columns:1fr auto;align-items:center}.limit-control b{font-weight:650}.limit-control span{font-size:12px;color:var(--hb-muted);font-weight:600}.limit-head{display:flex;justify-content:space-between;gap:12px}.limit-slider{width:100%;accent-color:var(--hb-blue)}.limit-actions{display:grid;grid-template-columns:1fr auto;gap:8px}.limit-note{font-size:10px;color:var(--hb-muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.limit-number{border:1px solid var(--hb-line);border-radius:12px;background:#fff;padding:8px 10px;font-weight:600;color:var(--hb-ink);min-width:0}.detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.detail-field{border:1px solid var(--hb-line);border-radius:12px;background:#FAFCFF;padding:9px 10px;min-width:0}.detail-field span{display:block;font-size:10px;color:var(--hb-muted);font-weight:650;text-transform:uppercase;letter-spacing:.03em}.detail-field b{display:block;margin-top:3px;font-size:12px;color:var(--hb-ink);font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.empty-actions{grid-column:1/-1;border:1px dashed #CBD5E1;border-radius:13px;padding:13px;color:var(--hb-muted);font-size:13px;font-weight:600;text-align:center}.empty-state{grid-column:1/-1;border:1px dashed #CBD5E1;border-radius:20px;background:#fff;padding:34px;text-align:center;color:var(--hb-muted);font-weight:600}.empty-state ha-icon{--mdc-icon-size:48px;color:var(--hb-blue);opacity:.55}.empty-state h2{color:var(--hb-ink);margin:10px 0 6px}
      .charger-hero-visual.image-strip{width:310px;height:130px;gap:10px;padding:10px;box-sizing:border-box;overflow:hidden}.charger-hero-visual.image-strip img{max-width:92px;max-height:106px;object-fit:contain;filter:drop-shadow(0 18px 22px rgba(15,35,80,.16))}.premium-image-hero{min-height:226px;grid-template-columns:1fr;grid-template-rows:142px auto;padding:14px;background:linear-gradient(135deg,#FFFFFF 0%,#F8FBFF 48%,#EEF5FF 100%)}.premium-image-hero .charger-visual{height:142px;width:100%;background:linear-gradient(135deg,rgba(238,245,255,.95),rgba(255,255,255,.72));border:1px solid rgba(20,103,245,.10)}.premium-image-hero .charger-visual img{max-width:150px;max-height:132px}.premium-image-hero .charger-head{grid-template-columns:44px minmax(0,1fr) auto}.premium-image-hero .charger-icon{width:44px;height:44px;border-radius:15px}.premium-image-hero .status{align-self:center}.charger-visual.ok:after{content:"";position:absolute;top:14px;right:16px;width:34px;height:6px;border-radius:999px;background:#37D67A;box-shadow:0 0 16px rgba(55,214,122,.35)}.charger-visual.warn:after{content:"";position:absolute;top:14px;right:16px;width:34px;height:6px;border-radius:999px;background:#F8B84E}.charger-visual.bad:after{content:"";position:absolute;top:14px;right:16px;width:34px;height:6px;border-radius:999px;background:#F04438}
/* R22.10.3 shared horizontal outcome/status header */
.status-strip.dashboard-status-strip,.status-strip.ops-status-strip{
  display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;
  border:1px solid rgba(14,35,72,.11)!important;border-radius:17px!important;
  background:rgba(255,255,255,.96)!important;box-shadow:0 16px 32px rgba(15,35,80,.08)!important;
  overflow:hidden!important;max-width:none!important;width:100%!important;margin:8px 0 10px!important;
}
.status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric{
  display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;
  padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important;
}
.status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child{border-right:0!important;}
.status-strip.dashboard-status-strip .metric ha-icon,.status-strip.ops-status-strip .metric ha-icon{--mdc-icon-size:23px;color:#1467F5;}
.status-strip.dashboard-status-strip .metric.tone-green ha-icon,.status-strip.ops-status-strip .metric.tone-green ha-icon{color:#18A957!important;}
.status-strip.dashboard-status-strip .metric.tone-orange ha-icon,.status-strip.ops-status-strip .metric.tone-orange ha-icon{color:#F59E0B!important;}
.status-strip.dashboard-status-strip .metric span,.status-strip.ops-status-strip .metric span{display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1;}
.status-strip.dashboard-status-strip .metric b,.status-strip.ops-status-strip .metric b{display:block;font-size:16px;font-weight:600;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
@media(max-width:760px){.status-strip.dashboard-status-strip,.status-strip.ops-status-strip{grid-template-columns:1fr!important;max-width:100%!important}.status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric{border-right:0!important;border-bottom:1px solid #E6ECF5!important}.status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child{border-bottom:0!important}}
${hbMobilitySharedShellStyles()}
@media(max-width:900px){.page{padding:14px}.hero{grid-template-columns:1fr;padding:22px}.hero-side{grid-template-columns:1fr}.hero .charger-hero-visual{display:none}.hero-metrics{grid-template-columns:repeat(3,1fr)}h1{font-size:36px}.grid{grid-template-columns:1fr}.charger-hero-card{grid-template-columns:1fr}.charger-kpis{grid-template-columns:1fr}.charger-head{grid-template-columns:44px minmax(0,1fr);}.status{grid-column:1/-1;justify-self:start}.command-row{grid-template-columns:1fr 1fr}}
      @media(max-width:520px){.hero-metrics{grid-template-columns:1fr}.charger-hero-card{grid-template-columns:1fr}.charger-visual{height:120px}.command-row{grid-template-columns:1fr}.detail-grid{grid-template-columns:1fr}}


      /* R22.10.3 operations aligned with main dashboard */
      .title{position:relative;padding:6px 0 0}.title .eyebrow{font-size:12px;font-weight:650;letter-spacing:.08em;text-transform:uppercase;color:var(--hb-blue);margin-bottom:6px}.title h1{font-size:42px;line-height:1;letter-spacing:-.055em;margin:0 0 8px;font-weight:650}.title p{font-size:14px;color:#06142D;font-weight:600;max-width:780px}.top-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.summary{min-height:76px;border:1px solid var(--hb-line);border-radius:20px;background:#fff;box-shadow:var(--hb-shadow);padding:14px 18px;display:grid;grid-template-columns:56px 1fr;gap:14px;align-items:center}.summary.attention{border-color:#FFD8A8}.summary.recommendation{border-color:#C9DEFF}.summary-icon{width:44px;height:44px;border-radius:16px;background:#FFF1D9;display:flex;align-items:center;justify-content:center}.summary-icon.blue{background:#1467F5;color:white}.summary-icon ha-icon{color:#F39A1B}.summary-icon.blue ha-icon{color:white}.summary h3{margin:0 0 6px;font-size:16px;font-weight:650}.summary ul{margin:0;padding:0;list-style:none}.summary li{display:flex;gap:14px;font-size:12px;color:#34405A;font-weight:600}.section-title{display:flex;align-items:center;justify-content:space-between;margin-top:4px}.section-title h2{margin:0;font-size:20px;font-weight:650}.section-title span{font-size:12px;color:#66728B;border:1px solid var(--hb-line);border-radius:999px;padding:4px 10px;background:#fff;font-weight:650}.bottom-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.info{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:0 14px 34px rgba(15,35,80,.055);padding:14px 16px;min-height:82px}.info h3{display:flex;align-items:center;gap:8px;font-size:15px;margin:0 0 8px}.info h3 ha-icon{color:#1467F5}.info p{font-size:12px;font-weight:600;color:#34405A}@media(max-width:860px){.top-grid,.bottom-grid{grid-template-columns:1fr}}
      /* R22.10.3 charge speed restore: compact, contract-driven, no min/max helper text. */
      .charge-mini-strip.mock-controls{display:flex!important;align-items:stretch!important;gap:8px!important;height:42px!important;overflow:hidden!important;min-width:0!important;grid-template-columns:none!important}
      .charger-select{flex:1 1 230px!important;min-width:170px!important}
      .mode-select{flex:0 1 132px!important;min-width:112px!important}
      .mini-current-stepper.compact-current{flex:0 0 156px!important;display:grid!important;grid-template-columns:minmax(56px,1fr) 32px 32px!important;align-items:center!important;gap:6px!important;padding:0 8px!important;background:#fff!important;border:1px solid var(--hb-line)!important;border-radius:12px!important;box-shadow:none!important;min-width:0!important;height:42px!important;min-height:42px!important}
      .mini-current-stepper.compact-current .current-copy{display:flex!important;flex-direction:column!important;justify-content:center!important;min-width:0!important;line-height:1.05!important;overflow:hidden!important}
      .mini-current-stepper.compact-current small{display:block!important;font-size:9px!important;font-weight:500!important;color:#6A768D!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-transform:none!important;letter-spacing:0!important;margin:0!important}
      .mini-current-stepper.compact-current strong{font-size:13px!important;font-weight:600!important;color:#06142D!important;white-space:nowrap!important;line-height:1.15!important;margin-top:2px!important}
      .mini-current-stepper.compact-current.readonly{grid-template-columns:minmax(56px,1fr)!important;flex-basis:112px!important}
      .mini-current-stepper.compact-current .round-step{width:30px!important;height:30px!important;min-width:30px!important;border-radius:12px!important;background:#fff!important;border:1px solid var(--hb-line)!important;color:#1467F5!important;font-size:18px!important;font-weight:500!important;box-shadow:none!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important}
      .mini-power-read{display:none!important}
      .vehicle-actions.clean-actions{grid-template-columns:minmax(142px,1.05fr) minmax(130px,1fr) minmax(110px,.85fr) 1fr 42px 42px!important;align-items:center!important}
      .vehicle-actions.clean-actions .presence-toggle.icon-only,.vehicle-actions.clean-actions .details-action.icon-only{justify-self:end!important;background:#fff!important;color:#1467F5!important;border-color:var(--hb-line)!important}
      .vehicle-actions.clean-actions .presence-toggle.icon-only ha-icon,.vehicle-actions.clean-actions .details-action.icon-only ha-icon{color:#1467F5!important}
      @media(max-width:880px){.charge-mini-strip.mock-controls{height:auto!important;flex-wrap:wrap!important}.mini-current-stepper.compact-current{flex:1 1 150px!important}.vehicle-actions.clean-actions{grid-template-columns:1fr 1fr 1fr 42px 42px!important}.action-spacer{display:none!important}}

      /* R22.12.11.24 Energy typography alignment — charger maintenance. */
      :host{font-family:inherit!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
      *{font-family:inherit!important;}
      .title h1{font-size:34px!important;line-height:1.08!important;font-weight:650!important;letter-spacing:-.025em!important;}
      .title p{font-size:13px!important;font-weight:400!important;color:var(--hb-muted,#66728B)!important;}
      .eyebrow{font-size:11px!important;font-weight:650!important;}
      .charger-name,.charger-mini-copy b{font-weight:600!important;}
      .card-title,.info h3,.section-title h2{font-weight:600!important;}
      .label,.subtext,.charger-mini-copy span{font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
      .value,strong{font-weight:650!important;}
      .action{font-weight:600!important;}

    `;
  }

  getCardSize(){ return 10; }
}

if (!customElements.get("homebrain-mobility-charger-maintenance-card")) {
  customElements.define("homebrain-mobility-charger-maintenance-card", HomeBrainMobilityChargerMaintenanceCard);
}
window.customCards.push({
  type: "homebrain-mobility-charger-maintenance-card",
  name: "Home Brain Mobility Charger Maintenance Card",
  description: "Premium responsive operational view for all Mobility chargers."
});



/**
 * Home Brain Mobility Dashboard Card — 2.2.2
 *
 * Adds consistent charging visibility and charger restart/startup guards.
 * This replaces the legacy Lovelace/button-card dashboard composition. The YAML now
 * only mounts this custom element. The card consumes the canonical registry and
 * runtime contracts, then renders the premium Mobility product dashboard from the
 * bundled JavaScript.
 */

// ---- src/ui/screens/mobility-dashboard.js ----
// 90-mobility-dashboard-card.js
// Mobility dashboard and vehicle overview custom card.

class HomeBrainMobilityDashboardCard extends HTMLElement {
  setConfig(config) {
    this.config = { dashboard_path: "/mobility-supervisor/dashboard", ...config };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._sent = this._sent || new Map();
    this._selectedChargers = this._selectedChargers || new Map();
    this._currentOverrides = this._currentOverrides || new Map();
    this._vehicleFilter = this._vehicleFilter || "all";
    this._vehicleSort = this._vehicleSort || "default";
    this._vehiclePickerAsset = this._vehiclePickerAsset || "";
    this._vehiclePickerDraft = this._vehiclePickerDraft || new Map();
    this._lastDashboardRenderAt = this._lastDashboardRenderAt || 0;
    this._lastSignature = this._lastSignature || "";
    if (!this._viewPositionBound) {
      this._viewPositionListener = ()=>this.rememberViewPosition();
      window.addEventListener("pagehide", this._viewPositionListener);
      this._viewPositionBound = true;
    }
  }

  disconnectedCallback() {
    if (this._viewPositionBound && this._viewPositionListener) {
      window.removeEventListener("pagehide", this._viewPositionListener);
      this._viewPositionBound = false;
    }
  }

  assetId(asset) { return asset?.asset_id || ""; }
  vehicleId(asset) { return String(this.assetId(asset)).replace(/^vehicle_/, ""); }
  chargerId(assetOrId) { return String(assetOrId?.asset_id || assetOrId || "").replace(/^charger_/, ""); }

  /** Centralized charger image resolver.
   * Priority: profile/type words -> asset_id -> default. Keep this in one place
   * so Dashboard, Vehicle cards and Charger Maintenance remain visually aligned.
   */
  chargerImage(assetOrId) {
    const rt = this.rt || null;
    const asset = typeof assetOrId === "object"
      ? assetOrId
      : (rt && typeof rt.chargerById === "function" ? (rt.chargerById(assetOrId) || rt.assetById(assetOrId) || { asset_id: assetOrId }) : { asset_id: assetOrId });
    if (rt && typeof rt.visualImageUrl === "function") return rt.visualImageUrl(asset, "charger", "image", "charger_fallback");
    return rhiMobilityAssetUrl("chargers/charger_fallback.png");
  }

  chargerImageFromId(id) { return this.chargerImage(id); }

  displaySubtitle(asset, model = null) {
    const profile = String(asset?.profile || model?.subtitle || "").trim();
    return profile || model?.subtitle || asset?.asset_type || "Vehicle";
  }

  isGood(value) {
    const s = String(value || "").toLowerCase();
    return ["ready","on track","secure","trusted","complete","fresh","ok","comfort ready","charging","connected"].some((w)=>s.includes(w));
  }
  isBad(value) {
    const s = String(value || "").toLowerCase();
    return ["attention","degraded","failed","critical","issue","unsafe","unlocked","stale","not connected","open","blocked"].some((w)=>s.includes(w));
  }
  tone(value) {
    const s = String(value || "").toLowerCase();
    if (this.isGood(s)) return "ok";
    if (s.includes("charging") || s.includes("heating") || s.includes("waiting")) return "warn";
    if (this.isBad(s)) return "bad";
    return "muted";
  }

  commandState(rt, command) {
    // One command state model across overview and detail screens.
    return rt.commandState ? rt.commandState(command) : { disabled: !command, busy:false, failed:false, status:"", reason:"" };
  }

  completeCommandIntent(rt, command, assetId = "") {
    // R22.10.3 hotfix: Previous release called this helper but did not ship it.
    // Keep this function deliberately small: complete metadata that is already
    // discovered from the backend command contract, but never synthesize new
    // commands or hardcode known vehicle/charger identities.
    if (!command) return null;
    const completed = { ...command };
    const canonical = assetId ? rt.canonicalAssetId(assetId) : (completed.asset_id || "");
    if (!completed.asset_id && canonical) completed.asset_id = canonical;
    if (!completed.parameter_schema && typeof completed.parameter_schema_json === "string" && completed.parameter_schema_json.trim()) {
      const parsed = rt.parseJsonValue(completed.parameter_schema_json, null);
      if (parsed && typeof parsed === "object") completed.parameter_schema = parsed;
    }
    return completed;
  }

  selectCommand(rt, assetId, ids) {
    return rt.selectCommand(assetId, ids);
  }

  commandUsable(rt, command) {
    return rt.commandUsable(command);
  }

  chooseFirstUsable(rt, commands) {
    const list = (commands || []).filter(Boolean);
    return list.find((command) => this.commandUsable(rt, command)) || list[0] || null;
  }

  commandsByCategory(rt, assetId, categories) {
    const wanted = categories.map((c)=>String(c).toLowerCase());
    return rt.commandRegistry(assetId)
      .filter((c)=>c.frontend_allowed !== false)
      .filter((c)=>wanted.includes(String(c.category || "secondary").toLowerCase()));
  }

  commandKey(command) {
    return `${command?.asset_id || ""}::${command?.command_id || command?.command_key || ""}`;
  }

  renderCommand(rt, command, label, icon, extraClass = "") {
    const buttonLabel = command?.label || label;
    if (!command) return `<button class="action ${extraClass}" disabled><ha-icon icon="${icon}"></ha-icon><span>${rt.escape(buttonLabel)}</span></button>`;
    const completed = this.completeCommandIntent(rt, command, command.asset_id || "") || command;
    const st = this.commandState(rt, completed);
    const title = st.reason || st.status || "";
    const enums = completed?.enum_options || {};
    const requiredEnum = (completed.required_parameters || []).find((name) => Array.isArray(enums[name]) && enums[name].length);
    if (completed.interaction_mode === "form" && requiredEnum) {
      return `<label class="action enum-action ${extraClass} ${st.disabled ? "is-disabled" : ""}" title="${rt.escape(title)}"><ha-icon icon="${icon}"></ha-icon><select aria-label="${rt.escape(buttonLabel)}" data-command-asset="${rt.escape(completed.asset_id || "")}" data-command-id="${rt.escape(completed.command_id || "")}" data-command-key="${rt.escape(completed.command_key || completed.command_id || "")}" data-command-param="${rt.escape(requiredEnum)}" ${st.disabled ? "disabled" : ""}><option value="">${rt.escape(buttonLabel)}…</option>${enums[requiredEnum].map((option)=>`<option value="${rt.escape(option.value)}">${rt.escape(option.label || option.value)}</option>`).join("")}</select></label>`;
    }
    const backendSent = String(st.status || "").toLowerCase() === "sent";
    const cls = st.busy ? "busy" : st.failed ? "failed" : backendSent ? "sent-ack" : "";
    return `<button class="action ${extraClass} ${cls}" data-asset-id="${rt.escape(completed.asset_id || "")}" data-command-id="${rt.escape(completed.command_id || "")}" data-command-key="${rt.escape(completed.command_key || completed.command_id || "")}" ${st.disabled ? "disabled" : ""} title="${rt.escape(title)}"><ha-icon icon="${icon}"></ha-icon><span>${rt.escape(buttonLabel)}</span></button>`;
  }


  sourceUnavailable(rt, assetId) {
    // UX must not construct raw/source status entities. Backend contract health is exposed through runtime health gates.
    return false;
  }

  fmtKw(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
    return `${Number(value).toFixed(1)} kW`;
  }

  fmtAmp(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
    const n = Number(value);
    return `${Number.isInteger(n) ? n : n.toFixed(1)} A`;
  }

  metricWithUnit(rt, value, unit = "", propertyKey = "") {
    const raw = String(value ?? "").trim();
    if (!raw || ["—", "Unknown", "Not available", "Unavailable"].includes(raw)) return raw || "—";
    return rt.formatValue(raw, unit, propertyKey);
  }



  resolveEffectiveCharger(rt, vehicleAsset, chargers) {
    // R22.10.3 authoritative dashboard rule:
    // Vehicle -> charger relation comes only from mobility_relationship_index
    // assets_json[].relationship.effective_charger. No local selection cache,
    // no assigned fallback, no display-name token matching, no charger reverse scan.
    const rel = rt.vehicleChargerRelationship(this.assetId(vehicleAsset));
    const effective = String(rel.effective || "").trim();
    if (!effective || ["none", "unknown", "unavailable", "null", "undefined"].includes(effective.toLowerCase())) return null;
    return rt.chargerById(effective) || chargers.find((c)=>String(c.asset_id || "") === effective) || null;
  }

  vehicleChargingInfo(rt, vehicleAsset) {
    return rt.liveChargingContextForVehicle(this.assetId(vehicleAsset));
  }

  chargingContext(rt, vehicleAsset, chargers = []) {
    // R22.12.11.24: one contract-driven vehicle charging context used by
    // overview rendering and charge-power controls. This adapter does not
    // scan raw entities or reconstruct charger ownership.
    const assetId = this.assetId(vehicleAsset);
    const assigned = this.resolveEffectiveCharger(rt, vehicleAsset, chargers || []);
    const info = this.vehicleChargingInfo(rt, vehicleAsset) || {
      active: false, status: "Unknown", power: null, detail: "Charging context unavailable."
    };
    const limit = typeof rt.vehicleChargePowerControl === "function"
      ? rt.vehicleChargePowerControl(assetId)
      : { value: null, display: "—", entity: "", intent: "", visible: false, executable: false, property: null };
    return {
      assetId,
      assigned,
      info,
      limit,
      currentEntity: limit?.entity || ""
    };
  }


  commandIcon(command) {
    const id = String(command?.command_id || "").toLowerCase();
    if (id.includes("restart") || id.includes("reboot") || id.includes("reset")) return "mdi:restart";
    if (id.includes("identify") || id.includes("locate")) return "mdi:crosshairs-gps";
    if (id.includes("stop") || id.includes("pause")) return "mdi:stop";
    if (id.includes("start") || id.includes("charge") || id.includes("resume")) return "mdi:lightning-bolt";
    if (id.includes("climate") || id.includes("heat") || id.includes("precondition")) return "mdi:fan";
    if (id.includes("unlock")) return "mdi:lock-open-outline";
    if (id.includes("lock")) return "mdi:lock-outline";
    if (id.includes("present") || id.includes("active")) return "mdi:power";
    if (id.includes("profile")) return "mdi:card-account-details-outline";
    if (id.includes("selected_charger") || id.includes("charger")) return "mdi:ev-station";
    if (id.includes("target_soc")) return "mdi:battery-charging-80";
    if (id.includes("ready_by")) return "mdi:clock-outline";
    return "mdi:gesture-tap-button";
  }

  dashboardVehicleCommands(rt, assetId, context = {}) {
    // R22.10.3: dashboard quick actions are selected from discovered commands
    // grouped by the backend command_family contract. Asset identity discovery
    // remains dynamic; command IDs are only used inside a published family to
    // select the currently meaningful member of that family.
    return rt.commandActionsFor(assetId, "quick_actions");
  }

  lifecycleDisplay(rt, asset) {
    const status = rt.lifecycleStatus(asset);
    if (status === "active") return "Active";
    if (status === "disabled") return "Disabled";
    if (status === "retired") return "Retired";
    return "Contract gap";
  }

  lifecycleToggleButton(rt, asset, extraClass = "presence-toggle icon-only") {
    const status = rt.lifecycleStatus(asset);
    const desired = status === "disabled" ? "active" : "disabled";
    const model = rt.lifecycleWriteModel(asset, desired);
    const label = desired === "active" ? "Activate" : "Disable";
    const title = model.disabled ? (model.reason || "Lifecycle contract gap") : `${label} via lifecycle_status`;
    return `<button class="action ${extraClass}" data-lifecycle-asset="${rt.escape(this.assetId(asset))}" data-lifecycle-value="${rt.escape(desired)}" ${model.disabled ? "disabled" : ""} title="${rt.escape(title)}"><ha-icon icon="mdi:power"></ha-icon><span>${rt.escape(label)}</span></button>`;
  }

  chargingActivityDisplay(rt, asset) {
    const assetId = this.assetId(asset);
    const rel = rt.vehicleChargerRelationship(assetId);
    const physical = String(rel.connected || "").trim();
    const hasPhysical = !!physical && !["none","unknown","unavailable","null","undefined","—"].includes(physical.toLowerCase());
    if (!hasPhysical) return "Not connected";
    const snapshot = rt.chargerProductSnapshot(physical);
    const status = snapshot.operating.resolved ? snapshot.operating.display : "—";
    const power = snapshot.power.resolved ? snapshot.power.display : "—";
    return power === "—" ? status : `${status} · ${power}`;
  }

  renderChargerAssignmentSelect(rt, vehicleAsset) {
    const assetId = this.assetId(vehicleAsset);
    const adapter = new HomeBrainVehicleAdapter(rt, this.vehicleId(vehicleAsset), { ...this.config, registry_entry: vehicleAsset });
    const model = adapter.chargerAssignmentModel();
    if (!model.resolved) {
      return `<div class="mini-control charger-select readonly" title="vehicle.selected_charger is not published"><ha-icon icon="mdi:ev-station"></ha-icon><strong>N/A</strong></div>`;
    }
    if (!model.writable) {
      return `<div class="mini-control charger-select readonly" title="Selected charger from vehicle property contract"><ha-icon icon="mdi:ev-station"></ha-icon><strong>${rt.escape(model.display)}</strong></div>`;
    }
    const current = String(model.editor_value ?? "");
    const currentKnown = model.choices.some((choice)=>choice.value === current);
    return `<div class="mini-control charger-select" title="Selected charger from vehicle property contract"><ha-icon icon="mdi:ev-station"></ha-icon><select data-property-asset="${rt.escape(assetId)}" data-property-key="vehicle.selected_charger" aria-label="Selected charger">${current && !currentKnown ? `<option value="${rt.escape(current)}" selected disabled>${rt.escape(model.display || current)}</option>` : ""}${model.choices.map((choice)=>`<option value="${rt.escape(choice.value)}" ${choice.value === current ? "selected" : ""}>${rt.escape(choice.label)}</option>`).join("")}</select></div>`;
  }

  renderVehicleControlRow(rt, vehicleAsset, chargers) {
    const ctx = this.chargingContext(rt, vehicleAsset, chargers);
    const metricSlots = rt.vehicleOverviewMetricSlots(this.assetId(vehicleAsset));
    const chargePowerModel = rt.vehicleChargePowerControlModel(this.assetId(vehicleAsset));
    const limitValue = chargePowerModel?.resolved && Number.isFinite(Number(chargePowerModel.value)) ? Number(chargePowerModel.value) : null;
    const currentValue = limitValue === null ? "—" : (Number.isInteger(limitValue) ? String(limitValue) : Number(limitValue).toFixed(2).replace(/\.00$/, ""));
    const meta = {
      min: Number.isFinite(chargePowerModel?.min) ? chargePowerModel.min : 0,
      max: Number.isFinite(chargePowerModel?.max) ? chargePowerModel.max : 0,
      step: Number.isFinite(chargePowerModel?.step) ? chargePowerModel.step : 0
    };
    const canCurrent = !!(chargePowerModel?.resolved && chargePowerModel?.writable && meta.step > 0 && meta.max >= meta.min);
    const currentStepEntity = chargePowerModel?.write_target_entity || "";
    // R22.12.11.24: Vehicle charge power is the user-facing setting.
    // The connected/effective charger is the backend-owned execution target.
    const showCurrent = !!chargePowerModel?.resolved;
    const displayCurrent = currentValue === "—" ? "—" : `${currentValue} kW`;
    const atMin = canCurrent && limitValue !== null && limitValue <= meta.min + 0.000001;
    const atMax = canCurrent && limitValue !== null && limitValue >= meta.max - 0.000001;
    const currentControl = showCurrent ? `
      <div class="mini-current-stepper compact-current ${canCurrent ? "" : "readonly"}" title="Vehicle charge power. Same charger-owned property contract as the detail editor.">
        <span class="current-copy"><small>Vehicle charge power</small><strong>${rt.escape(displayCurrent)}</strong></span>
        ${canCurrent ? `<button class="round-step" data-property-step="vehicle.requested_charge_power_kw" data-vehicle-asset="${rt.escape(ctx.assetId)}" data-charge-power-value="${rt.escape(limitValue ?? meta.min)}" data-delta="-${rt.escape(meta.step)}" data-min="${rt.escape(meta.min)}" data-max="${rt.escape(meta.max)}" data-unit="kW" ${atMin ? "disabled" : ""}>−</button>
        <button class="round-step" data-property-step="vehicle.requested_charge_power_kw" data-vehicle-asset="${rt.escape(ctx.assetId)}" data-charge-power-value="${rt.escape(limitValue ?? meta.min)}" data-delta="${rt.escape(meta.step)}" data-min="${rt.escape(meta.min)}" data-max="${rt.escape(meta.max)}" data-unit="kW" ${atMax ? "disabled" : ""}>+</button>` : ``}
      </div>` : ``;
    const actualPowerNumber = Number(ctx.info?.power);
    const actualPowerDisplay = Number.isFinite(actualPowerNumber) ? `${Math.max(0, actualPowerNumber).toFixed(1).replace(/\.0$/, "")} kW` : "—";
    const hasPhysicalCharger = !!ctx.info?.physical_charger;
    const actualPowerControl = hasPhysicalCharger ? `
      <div class="mini-power-read actual-power-read" title="Actual power from the physically connected charger canonical property contract.">
        <span class="power-copy"><small>Power</small><strong>${rt.escape(actualPowerDisplay)}</strong></span>
      </div>` : ``;
    return `<section class="vehicle-control-row mock-row" title="${rt.escape(ctx.info.detail)}">
      <div class="vehicle-metrics-strip mock-metrics">
        ${metricSlots.map((slot, index)=>`<div class="metric-chip ${index === 2 ? "battery-chip" : ""}" title="${rt.escape(slot.property_key || "Component contract gap")}"><span>${rt.escape(slot.label)}</span><b>${rt.escape(slot.resolved ? slot.display : "—")}</b></div>`).join("")}
      </div>
      <div class="charge-mini-strip mock-controls ${showCurrent ? "has-speed" : "no-speed"} no-mode">
        ${this.renderChargerAssignmentSelect(rt, vehicleAsset)}
        ${currentControl}
        ${actualPowerControl}
      </div>
    </section>`;
  }

  vehiclePresent(rt, asset) {
    return rt.lifecycleStatus(asset) === "active";
  }


  renderInactiveVehicle(rt, asset) {
    const factory = new HomeBrainAssetFactory(rt);
    const model = factory.adapterFor(asset, this.config)?.build?.() || null;
    const display = model?.display || asset.display_name || rt.vehicleLabel(asset.asset_id);
    const subtitle = model?.subtitle || asset.profile || "Vehicle";
    const route = rt.assetDetailRoute(asset);
    const lifecycleLabel = this.lifecycleDisplay(rt, asset);
    const activateButton = this.lifecycleToggleButton(rt, asset, "activate-soft manage-lifecycle");
    return `<article class="inactive-row compact-present-row lifecycle-collapsed-row">
      <span class="inactive-state">${rt.escape(lifecycleLabel)}</span>
      <div class="inactive-copy"><h3>${rt.escape(display)}</h3><p>${rt.escape(subtitle)}</p></div>
      <div class="inactive-actions">${activateButton}<button class="action icon-only" data-nav="${rt.escape(route)}" title="Open details"><ha-icon icon="mdi:plus"></ha-icon><span>Details</span></button></div>
    </article>`;
  }

  vehicleVisualSelection(rt, asset, draft = {}) {
    return new HomeBrainVehicleVisualPicker(rt).selection(asset, draft);
  }

  renderVehiclePicker(rt, asset) {
    const assetId = this.assetId(asset);
    const draft = this._vehiclePickerDraft.get(assetId) || {};
    return new HomeBrainVehicleVisualPicker(rt).render(asset, { draft, showClose:true, context:"management" });
  }

  renderVehicle(rt, asset, chargers) {
    const factory = new HomeBrainAssetFactory(rt);
    const adapter = factory.adapterFor(asset, this.config);
    const model = adapter?.build?.() || null;
    const id = this.vehicleId(asset);
    const assetId = this.assetId(asset);
    const display = model?.display || asset.display_name || rt.vehicleLabel(assetId);
    const subtitle = this.displaySubtitle(asset, model);
    const image = model?.image || "";
    const route = rt.assetDetailRoute(asset);
    const ctx = this.chargingContext(rt, asset, chargers);
    const relLabels = rt.vehicleChargerRelationship(assetId);
    const assignedName = relLabels.effective_display_name || ctx.assigned?.display_name || "No active charger";
    const isRealAssetId = (v) => {
      const idv = String(v || "").trim();
      return !!idv && !["none","unknown","unavailable","null","undefined"].includes(idv.toLowerCase());
    };
    const hasEffectiveCharger = isRealAssetId(relLabels.effective);
    const hasConnectedCharger = isRealAssetId(relLabels.connected);
    const activeChargerId = [relLabels.connected, relLabels.effective, ctx.assigned?.asset_id].find(isRealAssetId) || "";
    const activeChargerAsset = activeChargerId ? (rt.chargerById(activeChargerId) || rt.assetById(activeChargerId) || { asset_id: activeChargerId, asset_type: "charger" }) : null;
    const activeChargerRoute = activeChargerAsset ? rt.assetDetailRoute(activeChargerAsset) : "";
    const chargerImage = this.chargerImage(activeChargerId || "default");
    const notPresentButton = this.lifecycleToggleButton(rt, asset, "presence-toggle manage-lifecycle");
    const vehicleCommands = this.dashboardVehicleCommands(rt, assetId);
    const chargingActivity = this.chargingActivityDisplay(rt, asset);
    const pickerOpen = this._vehiclePickerAsset === assetId;
    const pickerDraft = pickerOpen ? (this._vehiclePickerDraft.get(assetId) || {}) : {};
    const visual = this.vehicleVisualSelection(rt, asset, pickerDraft);
    const visualFilter = visual?.color?.filter || "none";
    const visualImage = pickerOpen && visual?.vehicle?.package_file ? visual.vehicle.package_file : image;
    return `<article class="vehicle-card premium-vehicle-card">
      <div class="status-top-row vehicle-intelligence-strip">
        ${(Array.isArray(model?.status) ? model.status : rt.vehicleIntelligenceStatusTiles(assetId)).slice(0, 5).map((tile) => this.intelligenceStatusRow(rt, tile)).join("")}
      </div>
      <div class="hero-split-row">
        <div class="vehicle-hero-panel">
          <div class="vehicle-copy"><h2>${rt.escape(display)}</h2><p>${rt.escape(subtitle)}</p><p class="vehicle-activity-inline">${rt.escape(chargingActivity)}</p></div>
          <div class="vehicle-image">${visualImage ? `<img src="${rt.escape(rt.cache(visualImage))}" alt="${rt.escape(display)}" style="filter:${rt.escape(visualFilter)}">` : `<ha-icon icon="mdi:car-estate"></ha-icon>`}</div>
          <button class="vehicle-visual-edit vehicle-appearance-action" data-vehicle-picker="${rt.escape(assetId)}" title="Choose vehicle and colour"><ha-icon icon="mdi:palette-outline"></ha-icon><span>Vehicle & colour</span></button>
          <button class="mini-detail-button vehicle-detail-link" data-nav="${rt.escape(route)}" title="Open vehicle details"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        <div class="charger-hero-panel">
          <div class="charger-mini-copy"><b>${rt.escape(assignedName)}</b></div>
          <div class="charger-mini-image"><img src="${rt.escape(rt.cache(chargerImage))}" alt="${rt.escape(assignedName)}" loading="lazy" onerror="this.style.display='none';this.closest('.charger-mini-image')?.classList.add('image-missing')"><ha-icon icon="mdi:ev-station"></ha-icon></div>
          ${activeChargerRoute ? `<button class="mini-detail-button charger-detail-link" data-nav="${rt.escape(activeChargerRoute)}" title="Open charger details"><ha-icon icon="mdi:plus"></ha-icon></button>` : ``}
        </div>
      </div>
      ${pickerOpen ? this.renderVehiclePicker(rt, asset) : ""}
      ${this.renderVehicleControlRow(rt, asset, chargers)}
      <div class="vehicle-actions clean-actions">
        ${vehicleCommands.map((cmd, index)=>this.renderCommand(rt, cmd, cmd?.label || "Action", this.commandIcon(cmd), index === 0 ? "primary-charge" : "")).join("")}
        ${Array.from({length: Math.max(0, 3 - vehicleCommands.length)}).map(()=>`<span class="action-spacer"></span>`).join("")}
        ${notPresentButton || ""}
      </div>
    </article>`;
  }

  overviewVehicleSignals(rt, assetId) {
    const tiles = rt.vehicleIntelligenceStatusTiles(assetId) || [];
    const byLabel = (label) => tiles.find((tile) => String(tile?.label || "").toLowerCase() === String(label).toLowerCase()) || null;
    const climate = (rt.propertyRows(assetId) || []).find((row) => {
      if (!row || row.value === undefined || row.value === null || String(row.value).trim() === "") return false;
      return rt.propertyFamily(row) === "climate" && rt.propertyDetailLevel(row) !== "technical";
    }) || null;
    return {
      range: byLabel("Range"),
      energy: byLabel("Energy"),
      security: byLabel("Security"),
      maintenance: byLabel("Maintenance"),
      climate: (() => {
        if (!climate) return "N/A";
        const display = String(rt.propertyDisplayValue(climate) || "").trim();
        if (!display || /^-\d+(?:[.,]\d+)?\s*(?:s|sec|secs|seconds|min|mins|minutes|h|hr|hrs|hours)$/i.test(display)) return "N/A";
        return display;
      })()
    };
  }

  renderOverviewVehicleRow(rt, asset, chargers) {
    const factory = new HomeBrainAssetFactory(rt);
    const model = factory.adapterFor(asset, this.config)?.build?.() || null;
    const assetId = this.assetId(asset);
    const display = model?.display || asset.display_name || rt.vehicleLabel(assetId);
    const image = model?.image || "";
    const visual = this.vehicleVisualSelection(rt, asset);
    const visualFilter = visual?.color?.filter || "none";
    const route = rt.assetDetailRoute(asset);
    const signals = this.overviewVehicleSignals(rt, assetId);
    const charging = this.chargingActivityDisplay(rt, asset);
    const commands = this.dashboardVehicleCommands(rt, assetId).slice(0, 2);
    const signalValue = (tile, fallback = "—") => tile?.value && !String(tile.value).toLowerCase().includes("contract gap") ? tile.value : fallback;
    const signalTone = (tile) => {
      const tone = String(tile?.tone || "").toLowerCase();
      const value = String(tile?.value || "").toLowerCase();
      if (!tile || !value || ["unknown","unavailable","contract gap"].some((token)=>value.includes(token))) return "muted";
      return tone === "error" ? "bad" : tone === "attention" ? "warn" : tone === "active" ? "active" : "ok";
    };
    return `<article class="ov-vehicle-row">
      <button class="ov-vehicle-main" data-nav="${rt.escape(route)}" title="Open vehicle details">
        <span class="ov-vehicle-image">${image ? `<img src="${rt.escape(rt.cache(image))}" alt="${rt.escape(display)}" style="filter:${rt.escape(visualFilter)}">` : `<ha-icon icon="mdi:car-electric"></ha-icon>`}</span>
        <span class="ov-vehicle-copy"><b>${rt.escape(display)}</b><small>${rt.escape(signalValue(signals.energy))} · ${rt.escape(signalValue(signals.range))}</small></span>
      </button>
      <div class="ov-signal ${signalTone(signals.security)}" title="${rt.escape(signals.security?.subvalue || "")}"><ha-icon icon="mdi:lock-outline"></ha-icon><span>Security</span><b>${rt.escape(signalValue(signals.security, "Unknown"))}</b></div>
      <div class="ov-signal" title="Published climate/comfort property"><ha-icon icon="mdi:fan"></ha-icon><span>Comfort</span><b>${rt.escape(signals.climate)}</b></div>
      <div class="ov-signal ${signalTone(signals.maintenance)}" title="${rt.escape(signals.maintenance?.subvalue || "")}"><ha-icon icon="mdi:wrench-outline"></ha-icon><span>Maintenance</span><b>${rt.escape(signalValue(signals.maintenance, "Unknown"))}</b></div>
      <div class="ov-charging-state"><ha-icon icon="mdi:lightning-bolt"></ha-icon><span>${rt.escape(charging)}</span></div>
      <div class="ov-assignment">${this.renderChargerAssignmentSelect(rt, asset)}</div>
      <div class="ov-row-actions">
        ${commands.map((cmd, index)=>this.renderCommand(rt, cmd, cmd?.label || "Action", this.commandIcon(cmd), index === 0 ? "primary-charge" : "")).join("")}
        <button class="action icon-only ov-detail" data-nav="${rt.escape(route)}" title="Open all vehicle details"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
    </article>`;
  }

  renderOverviewChargerRow(rt, charger) {
    const assetId = this.assetId(charger);
    const display = charger.display_name || rt.chargerLabel(assetId);
    const route = rt.assetDetailRoute(charger);
    const snapshot = rt.chargerProductSnapshot(assetId);
    const status = snapshot.operating?.resolved ? snapshot.operating.display : "Unknown";
    const power = snapshot.power?.resolved ? snapshot.power.display : "—";
    const image = this.chargerImage(charger);
    return `<article class="ov-charger-row">
      <span class="ov-charger-image"><img src="${rt.escape(rt.cache(image))}" alt="${rt.escape(display)}" onerror="this.style.display='none'"><ha-icon icon="mdi:ev-station"></ha-icon></span>
      <span class="ov-charger-copy"><b>${rt.escape(display)}</b><small><i class="ov-dot"></i>${rt.escape(status)}</small></span>
      <span class="ov-charger-power"><b>${rt.escape(power)}</b><small>Current power</small></span>
      <button class="action icon-only ov-detail" data-nav="${rt.escape(route)}" title="Open charger details"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
    </article>`;
  }

  dashboardTabFromRoute() {
    const path = String(window.location?.pathname || "").replace(/\/+$/, "");
    if (path.endsWith("/overview")) return "overview";
    if (path.endsWith("/dashboard")) return "vehicles";
    return this._localNavActive || this.config?.nav_active || "vehicles";
  }

  viewPositionKey() {
    try {
      const path = String(window.location?.pathname || "");
      const search = String(window.location?.search || "");
      return `rhi_mobility_scroll:${path}${search}`;
    } catch (e) {
      return "rhi_mobility_scroll:unknown";
    }
  }

  rememberViewPosition() {
    try { sessionStorage.setItem(this.viewPositionKey(), String(Math.max(0, window.scrollY || 0))); } catch (e) {}
  }

  restoreViewPositionOnce() {
    const key = this.viewPositionKey();
    if (this._restoredPositionKey === key) return;
    this._restoredPositionKey = key;
    let y = 0;
    try { y = Number(sessionStorage.getItem(key) || 0); } catch (e) { y = 0; }
    if (!Number.isFinite(y) || y <= 0) return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({ top:y, left:0, behavior:"auto" })));
  }

  overviewChargerSummary(rt, chargers) {
    const buckets = { free:0, in_use:0, unavailable:0, disabled:0, unknown:0 };
    for (const charger of chargers) {
      const adapter = new HomeBrainChargerAdapter(rt, this.chargerId(charger), { ...this.config, registry_entry:charger });
      const row = adapter.overviewAvailability();
      const key = Object.prototype.hasOwnProperty.call(buckets, row.bucket) ? row.bucket : "unknown";
      buckets[key] += 1;
    }
    const parts = [];
    if (buckets.free) parts.push(`${buckets.free} free`);
    if (buckets.in_use) parts.push(`${buckets.in_use} in use`);
    if (buckets.unavailable) parts.push(`${buckets.unavailable} unavailable`);
    if (buckets.disabled) parts.push(`${buckets.disabled} disabled`);
    if (buckets.unknown) parts.push(`${buckets.unknown} N/A`);
    return {
      ...buckets,
      total:chargers.length,
      label:chargers.length ? (parts.join(" · ") || "State N/A") : "No chargers published"
    };
  }

  activityDisplay(row = {}) {
    const message = String(row?.message || "").trim();
    return {
      message: message || "N/A",
      timestamp: String(row?.observed_at || row?.timestamp || "").trim()
    };
  }

  renderOverviewPage(rt, vehicles, chargers, activityRows, reco) {
    const activeVehicles = vehicles.filter((v)=>rt.lifecycleStatus(v) === "active");
    const heroVehicle = activeVehicles[0] || vehicles[0] || null;
    const heroModel = heroVehicle ? (new HomeBrainAssetFactory(rt).adapterFor(heroVehicle, this.config)?.build?.() || null) : null;
    const heroImage = heroModel?.image || "";
    const heroVisualFilter = heroVehicle ? (this.vehicleVisualSelection(rt, heroVehicle)?.color?.filter || "none") : "none";
    const chargingCount = activeVehicles.filter((v)=>!!this.vehicleChargingInfo(rt, v)?.active).length;
    const chargerSummary = this.overviewChargerSummary(rt, chargers);
    const attention = rt.supervisorOutcome("mobility", "attention", "Unknown") || "Unknown";
    const attentionReason = rt.supervisorOutcome("mobility", "attention_reason", "") || "";
    const recent = (activityRows || []).slice(0,3);
    const recommended = reco?.action && reco.action !== "Unknown" ? reco : null;
    const fleetLabel = activeVehicles.length === 1 ? "1 active vehicle" : `${activeVehicles.length} active vehicles`;
    const chargingLabel = chargingCount === 1 ? "1 active session" : `${chargingCount} active sessions`;
    const chargerLabel = chargerSummary.label;
    const attentionTone = ["none","ok","not applicable"].includes(String(attention).toLowerCase()) ? "ok" : String(attention).toLowerCase() === "unknown" ? "muted" : "warn";

    return `
      <section class="ov-energy-hero">
        <div class="ov-energy-hero-copy">
          <small>MOBILITY</small>
          <h1>Mobility Overview</h1>
          <p>Know if your vehicles are ready, secure and comfortable, what is charging, and where action is needed.</p>
          <div class="ov-energy-live-line"><strong>${rt.escape(fleetLabel)}</strong><span>Live Mobility status</span></div>
        </div>
        ${heroImage ? `<div class="ov-energy-hero-art"><img src="${rt.escape(rt.cache(heroImage))}" alt="" style="filter:${rt.escape(heroVisualFilter)}"></div>` : ""}
      </section>

      <section class="ov-status-grid" aria-label="Mobility status">
        <div class="ov-status-item">
          <span class="ov-status-icon"><ha-icon icon="mdi:car-electric"></ha-icon></span>
          <div><small>Vehicles</small><b>${activeVehicles.length}</b><em>${rt.escape(fleetLabel)}</em></div>
        </div>
        <div class="ov-status-item">
          <span class="ov-status-icon"><ha-icon icon="mdi:lightning-bolt"></ha-icon></span>
          <div><small>Charging now</small><b>${chargingCount}</b><em>${rt.escape(chargingLabel)}</em></div>
        </div>
        <div class="ov-status-item">
          <span class="ov-status-icon"><ha-icon icon="mdi:ev-station"></ha-icon></span>
          <div><small>Chargers</small><b>${chargerSummary.total}</b><em>${rt.escape(chargerLabel)}</em></div>
        </div>
        <div class="ov-status-item ${attentionTone}">
          <span class="ov-status-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></span>
          <div><small>Attention</small><b>${rt.escape(attentionTone === "muted" ? "N/A" : attention)}</b><em>${rt.escape(attentionReason || (attentionTone === "muted" ? "Supervisor attention unavailable" : "Backend supervisor status"))}</em></div>
        </div>
      </section>

      <section class="ov-quickbar energy-like" aria-label="Quick actions">
        <span class="ov-quick-title">Quick actions</span>
        <button class="ov-nav-action primary" data-nav="${hbMobilityPath("/dashboard")}"><ha-icon icon="mdi:car-cog"></ha-icon>Vehicle actions</button>
        <button class="ov-nav-action" data-nav="${hbMobilityPath("/planning")}"><ha-icon icon="mdi:calendar-clock"></ha-icon>Charging plan</button>
        <button class="ov-nav-action" data-nav="${hbMobilityPath("/dashboard")}"><ha-icon icon="mdi:fan"></ha-icon>Precondition</button>
        <button class="ov-nav-action" data-nav="${hbMobilityPath("/dashboard")}"><ha-icon icon="mdi:ev-station"></ha-icon>Change charger</button>
      </section>

      <section class="ov-core-grid">
        <section class="ov-panel ov-core-vehicles">
          <div class="ov-panel-head">
            <div><h2>Vehicles</h2><p>Readiness first: range and energy, security, comfort, maintenance, charger relationship and direct actions.</p></div>
            <button data-nav="${hbMobilityPath("/dashboard")}">All vehicles <ha-icon icon="mdi:chevron-right"></ha-icon></button>
          </div>
          <div class="ov-vehicle-list">${activeVehicles.length ? activeVehicles.map((vehicle)=>this.renderOverviewVehicleRow(rt,vehicle,chargers)).join("") : `<div class="ov-empty">No active vehicles.</div>`}</div>
        </section>

        <aside class="ov-core-aside">
          <section class="ov-panel ov-focus-panel">
            <div class="ov-panel-head"><div><h2>Next action</h2><p>Only backend-owned Mobility guidance.</p></div></div>
            ${recommended ? `<div class="ov-next-row"><ha-icon icon="mdi:arrow-right-circle-outline"></ha-icon><span><b>${rt.escape(recommended.action)}</b><small>${rt.escape(recommended.reason || "")}</small></span><button data-nav="${hbMobilityPath("/planning")}">Open</button></div>` : `<div class="ov-empty">No action currently published.</div>`}
          </section>

          <section class="ov-panel">
            <div class="ov-panel-head"><div><h2>Chargers</h2><p>Availability and current power.</p></div><button data-nav="${hbMobilityPath("/charger-maintenance")}">All chargers <ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
            <div class="ov-charger-list">${chargers.length ? chargers.map((charger)=>this.renderOverviewChargerRow(rt,charger)).join("") : `<div class="ov-empty">No chargers published.</div>`}</div>
          </section>

          <section class="ov-panel ov-activity-panel">
            <div class="ov-panel-head"><div><h2>Recent activity</h2><p>Latest Mobility events.</p></div><button data-nav="${hbMobilityPath("/history")}">History <ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
            <div class="ov-activity-list">${recent.length ? recent.map((row)=>{ const activity=this.activityDisplay(row); return `<div class="ov-activity-row"><ha-icon icon="mdi:history"></ha-icon><span><b>${rt.escape(activity.message)}</b><small>${rt.escape(activity.timestamp)}</small></span></div>`; }).join("") : `<div class="ov-empty">No recent activity published.</div>`}</div>
          </section>
        </aside>
      </section>

      <section class="ov-conclusion">
        <span class="ov-conclusion-icon">✦</span>
        <div>
          <small>Conclusion</small>
          <h2>${rt.escape(attentionTone === "ok" ? "Mobility is ready for normal use." : attentionTone === "warn" ? `Mobility needs attention: ${attention}` : "Mobility status is partially unavailable.")}</h2>
          <p>${rt.escape(recommended ? `Next recommended action: ${recommended.action}` : attentionReason || "Open vehicle or charger details for deeper evidence and controls.")}</p>
        </div>
      </section>`;
  }

  renderVehiclesPage(rt, activeVehicles, inactiveVehicles, chargers, reco, plan, trust, activity, intelligenceSummary) {
    const factory = new HomeBrainAssetFactory(rt);
    const vehicleLabel = (vehicle) => {
      const model = factory.adapterFor(vehicle, this.config)?.build?.() || null;
      return String(model?.display || vehicle?.display_name || rt.vehicleLabel(this.assetId(vehicle)) || this.assetId(vehicle));
    };
    const attentionRequired = (vehicle) => {
      const value = String(rt.supervisorOutcome(this.assetId(vehicle), "attention", "") || "").trim().toLowerCase();
      return !!value && !["none","ok","not applicable","unknown","unavailable"].includes(value);
    };
    const sortRows = (rows) => {
      const copy = [...rows];
      if (this._vehicleSort === "name") copy.sort((a,b)=>vehicleLabel(a).localeCompare(vehicleLabel(b)));
      return copy;
    };

    const allActive = sortRows(activeVehicles);
    const allInactive = sortRows(inactiveVehicles);
    const filter = this._vehicleFilter || "all";
    const visibleActive = filter === "disabled" ? [] : filter === "attention" ? allActive.filter(attentionRequired) : allActive;
    const visibleInactive = filter === "active" ? [] : filter === "attention" ? allInactive.filter(attentionRequired) : allInactive;

    const heroVehicle = allActive[0] || allInactive[0] || null;
    const heroModel = heroVehicle ? (factory.adapterFor(heroVehicle, this.config)?.build?.() || null) : null;
    const heroImage = heroModel?.image || "";
    const heroVisualFilter = heroVehicle ? (this.vehicleVisualSelection(rt, heroVehicle)?.color?.filter || "none") : "none";
    const activeCount = allActive.length;
    const inactiveCount = allInactive.length;
    const attentionCount = [...allActive, ...allInactive].filter(attentionRequired).length;
    const assignedCount = allActive.filter((vehicle)=>{
      const adapter = new HomeBrainVehicleAdapter(rt, this.vehicleId(vehicle), { ...this.config, registry_entry:vehicle });
      const assignment = adapter.chargerAssignmentModel();
      const value = String(assignment?.editor_value ?? assignment?.value ?? "").trim().toLowerCase();
      return !!value && !["none","unknown","unavailable","null","undefined","—"].includes(value);
    }).length;
    const connectedCount = allActive.filter((vehicle)=>{
      const rel = rt.vehicleChargerRelationship(this.assetId(vehicle));
      const connected = String(rel?.connected || "").trim().toLowerCase();
      return !!connected && !["none","unknown","unavailable","null","undefined","—"].includes(connected);
    }).length;
    const managementPath = "/config/integrations/integration/rhi_mobility";

    return `
      <section class="vehicles-hero">
        <div class="vehicles-hero-copy">
          <small>MOBILITY / VEHICLE MANAGEMENT</small>
          <h1>Vehicles</h1>
          <p>Manage the vehicles you use every day: readiness, charger assignment, charging controls, direct actions and lifecycle.</p>
          <div class="vehicles-live-line"><strong>${activeCount} active</strong><span>${inactiveCount} inactive · ${attentionCount} requiring published attention</span></div>
        </div>
        ${heroImage ? `<div class="vehicles-hero-art"><img src="${rt.escape(rt.cache(heroImage))}" alt="" style="filter:${rt.escape(heroVisualFilter)}"></div>` : ""}
      </section>

      <section class="vehicle-management-bar" aria-label="Vehicle management">
        <div class="vehicle-filter-group" role="group" aria-label="Filter vehicles">
          ${[
            ["all","All",activeCount+inactiveCount],
            ["active","Active",activeCount],
            ["disabled","Disabled",inactiveCount],
            ["attention","Attention",attentionCount]
          ].map(([key,label,count])=>`<button class="${filter===key?"active":""}" data-vehicle-filter="${key}"><span>${label}</span><b>${count}</b></button>`).join("")}
        </div>
        <label class="vehicle-sort-control"><span>Sort</span><select data-vehicle-sort><option value="default" ${this._vehicleSort==="default"?"selected":""}>Configured order</option><option value="name" ${this._vehicleSort==="name"?"selected":""}>Name</option></select></label>
        <button class="vehicle-manage-button" data-nav="${managementPath}" title="Open the Home Assistant Mobility integration options. Guest vehicles and vehicle profiles are managed there."><ha-icon icon="mdi:cog-outline"></ha-icon><span>Manage vehicles & profiles</span></button>
      </section>

      <section class="vehicle-page-summary" aria-label="Vehicle fleet summary">
        <div class="vehicle-page-summary-item"><ha-icon icon="mdi:car-electric"></ha-icon><span><small>Active</small><b>${activeCount}</b><em>Lifecycle active</em></span></div>
        <div class="vehicle-page-summary-item"><ha-icon icon="mdi:ev-station"></ha-icon><span><small>Assigned</small><b>${assignedCount}</b><em>Selected charger</em></span></div>
        <div class="vehicle-page-summary-item"><ha-icon icon="mdi:connection"></ha-icon><span><small>Connected now</small><b>${connectedCount}</b><em>Physical relationship</em></span></div>
        <div class="vehicle-page-summary-item ${attentionCount ? "warn" : ""}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span><small>Attention</small><b>${attentionCount}</b><em>Backend-published</em></span></div>
      </section>

      ${visibleActive.length ? `
        <section class="vehicle-workspace-head">
          <div><h2>Active vehicles</h2><p>Readiness and actions first. Charger assignment and lifecycle remain Mobility-owned controls.</p></div>
          <span class="vehicle-count-pill">${visibleActive.length} shown</span>
        </section>
        <section class="vehicles vehicle-workspace-list">${visibleActive.map((v)=>this.renderVehicle(rt,v,chargers)).join("")}</section>
      ` : (filter !== "disabled" && filter !== "all" ? `<div class="vehicle-filter-empty">No active vehicles match this filter.</div>` : "")}

      ${visibleInactive.length ? `
        <section class="vehicle-workspace-head inactive-head">
          <div><h2>Inactive vehicles</h2><p>Disabled vehicles stay available for deliberate reactivation and detail access.</p></div>
          <span class="vehicle-count-pill muted">${visibleInactive.length} shown</span>
        </section>
        <section class="inactive-list">${visibleInactive.map((v)=>this.renderInactiveVehicle(rt,v)).join("")}</section>
      ` : (filter === "disabled" ? `<div class="vehicle-filter-empty">No disabled vehicles.</div>` : "")}
    `;
  }

  versionBlock(rt) {
    return `<div class="hi-version-block" style="position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0;margin:0;z-index:3;pointer-events:none;"><div>UX ${rt.escape(UX_VERSION)}</div><div>Backend ${rt.escape(rt.backendVersion())}</div></div>`;
  }

  intelligenceStatusRow(rt, tile = {}) {
    const label = tile.label || "Intelligence";
    const value = tile.value || "Contract gap";
    const subvalue = tile.subvalue || "";
    const rawTone = String(tile.tone || "neutral").toLowerCase();
    const pillTone = rawTone === "error" ? "bad" : rawTone === "attention" ? "warn" : rawTone === "active" ? "ok" : "muted";
    const title = subvalue ? `${label}: ${value} — ${subvalue}` : `${label}: ${value}`;
    return `<div class="status-row intelligence-status-row" title="${rt.escape(title)}"><ha-icon icon="${rt.escape(tile.icon || "mdi:information-outline")}"></ha-icon><span>${rt.escape(label)}</span><b class="pill ${pillTone}">${rt.escape(value)}</b></div>`;
  }

  issueRows(rt, vehicles) {
    const rows = [];
    let missing = 0;
    for (const a of vehicles) {
      const label = a.display_name || rt.vehicleLabel(a.asset_id);
      const attention = rt.supervisorOutcome(a.asset_id, "attention", "");
      const reason = rt.supervisorOutcome(a.asset_id, "attention_reason", "");
      if (!attention) {
        missing += 1;
        continue;
      }
      const att = String(attention).toLowerCase();
      if (!["none", "ok", "not applicable"].includes(att)) {
        rows.push(`<li><b>${rt.escape(label)}</b><span>${rt.escape(reason || attention)}</span></li>`);
      }
    }
    if (rows.length) return rows.join("");
    if (missing) return `<li><b>Supervisor</b><span>Attention unavailable for ${missing} vehicle${missing === 1 ? "" : "s"}.</span></li>`;
    return `<li class="clear"><b>All vehicles</b><span>Backend supervisor reports no attention requiring action.</span></li>`;
  }

  recommended(rt) {
    const action = rt.supervisorOutcome("mobility", "recommended_action", "");
    const reason = rt.supervisorOutcome("mobility", "recommended_reason", "") || rt.supervisorOutcome("mobility", "attention", "");
    if (action) return { label: "Mobility", action, reason: reason || "Backend supervisor recommendation." };
    return { label: "Mobility", action: "Unknown", reason: "Backend supervisor recommendation unavailable." };
  }

  set hass(hass) {
    this._hass = hass;
    try {
          const now = Date.now();
          const forceRender = !!this._forceRender;
          this._forceRender = false;
          const activeEl = this.shadowRoot?.activeElement;
          if (!forceRender && (now < (this._holdRenderUntil || 0)) && this._lastRenderOk) return;
          if (!forceRender && activeEl && ["SELECT", "INPUT"].includes(activeEl.tagName) && this._lastRenderOk) return;
          if (!forceRender && this._lastRenderOk && now - (this._lastDashboardRenderAt || 0) < 900) return;
          this._lastDashboardRenderAt = now;
          const rt = new HomeBrainAssetRuntime(hass, this.config);
          this.rt = rt;
          const factory = new HomeBrainAssetFactory(rt);
          const vehicles = factory.vehicles().filter((a)=>a.lifecycle_state !== "Retired").sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.display_name).localeCompare(String(b.display_name)));
          const chargers = factory.chargers().filter((a)=>a.frontend_allowed !== false && rt.lifecycleStatus(a) === "active").sort((a,b)=>(Number(a.sort_order ?? 999)-Number(b.sort_order ?? 999)) || String(a.display_name).localeCompare(String(b.display_name)));
          const activeVehicles = vehicles.filter((v)=>rt.lifecycleStatus(v) === "active");
          const inactiveVehicles = vehicles.filter((v)=>rt.lifecycleStatus(v) !== "active" && rt.lifecycleStatus(v) !== "retired");
          const reco = this.recommended(rt);
          const plan = rt.supervisorOutcome("mobility", "opportunity", "Unknown") || "Unknown";
          const trust = rt.supervisorOutcome("mobility", "trust", "Unknown") || "Unknown";
          const activityRows = rt.activityRowsFor ? rt.activityRowsFor("") : [];
          const intelligenceRows = rt.intelligenceRowsFor ? rt.intelligenceRowsFor("") : [];
          const activity = activityRows.slice(0, 3).map((a)=>a.message || a.activity_state || a.activity_type || "Current activity");
          const intelligenceSummary = intelligenceRows.find((r)=>r.message || r.meaning || r.value || r.title || r.insight_type);
          const signature = JSON.stringify({
            vehicles: vehicles.map((v) => {
              const id = this.vehicleId(v);
              const assetId = v.asset_id;
              const cmds = rt.commandRegistry(assetId).map((cmd) => [cmd.command_id, cmd.frontend_allowed, cmd.execution_allowed, cmd.execution_status || "", cmd.blocked_reason || cmd.execution_reason || ""]);
              const relationship = rt.vehicleChargerRelationship(assetId);
              const intelligence = rt.vehicleIntelligenceStatusTiles(assetId).map((tile) => [tile.label, tile.value, tile.subvalue, tile.tone]);
              const compactMetrics = rt.vehicleOverviewMetricSlots(assetId).map((slot)=>[slot.property_key, slot.resolved ? slot.display : "—"]);
              return [assetId, v.display_name, rt.lifecycleStatus(v), relationship.connected, relationship.effective, intelligence, compactMetrics,
                rt.supervisorOutcome(assetId, "status", ""), rt.supervisorOutcome(assetId, "trust", ""), rt.supervisorOutcome(assetId, "attention", ""), cmds];
            }),
            chargers: chargers.map((c) => {
              const cid = this.chargerId(c);
              const aid = c.asset_id;
              return [aid,
                rt.chargerOperationalStatus(aid),
                rt.chargerConnectionState(aid),
                rt.canonicalChargerPropertyDisplay(aid, "charger.power_kw", ""),
                rt.canonicalChargerPropertyDisplay(aid, "charger.current_limit_a", "")
              ];
            }),
            reco, plan, trust, activity, sent: Array.from(this._sent || []).filter(([, t]) => Date.now() - t < 3000)
          });
          const activeElement = this.shadowRoot?.activeElement;
          if (!forceRender && this._lastSignature === signature && this._lastRenderOk && !(activeElement && ["SELECT", "INPUT"].includes(activeElement.tagName))) return;
          this._lastSignature = signature;
          this._lastRenderOk = true;
          const navActive = this.dashboardTabFromRoute();
          const pageContent = navActive === "overview"
            ? this.renderOverviewPage(rt, activeVehicles, chargers, activityRows, reco)
            : this.renderVehiclesPage(rt, activeVehicles, inactiveVehicles, chargers, reco, plan, trust, activity, intelligenceSummary);
          this.shadowRoot.innerHTML = `<ha-card><div class="page">${this.versionBlock(rt)}
            ${hbMobilityNav(navActive)}
            ${pageContent}
          </div>${hbMobilityReleaseFooter(rt)}<style>${this.styles()}
            /* Canonical action sizing */
            .action.enum-action,.cmd.enum-command{height:40px!important;min-height:40px!important;max-height:40px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;padding:0 10px!important;box-sizing:border-box!important;overflow:hidden!important}
            .action.enum-action ha-icon,.cmd.enum-command ha-icon{flex:0 0 auto!important}
            .action.enum-action select,.cmd.enum-command select{appearance:auto!important;min-width:0!important;max-width:170px!important;width:auto!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-size:12px!important;font-weight:600!important;padding:0 2px!important;box-shadow:none!important;cursor:pointer!important}
          </style></ha-card>`;
          this.wireEvents(rt);
          this.restoreViewPositionOnce();
    } catch (err) {
      console.error("HomeBrain Mobility dashboard render failed", err);
      const message = String((err && (err.stack || err.message)) || err || "Unknown render error");
      const safe = message.replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      let backendVersion = "Unknown";
      try { backendVersion = new HomeBrainAssetRuntime(this._hass || hass, this.config).backendVersion(); } catch (e) {}
      this.shadowRoot.innerHTML = `<ha-card>
        <div class="hb-error-page">
          <div class="hi-version-block" style="position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0;margin:0;z-index:3;pointer-events:none;"><div>UX ${String(UX_VERSION).replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]))}</div><div>Backend ${String(backendVersion).replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]))}</div></div>
          <h1>Mobility</h1>
          <h2>Dashboard temporarily unavailable</h2>
          <p>The frontend loaded, but the dashboard could not render the current backend contract safely.</p>
          <pre>${safe}</pre>
        </div>
        <style>
          ha-card{background:transparent;border:0;box-shadow:none}
          .hb-error-page{position:relative;margin:24px auto;width:min(100%,1100px);box-sizing:border-box;padding:28px;border:1px solid #F3B7B7;border-radius:22px;background:#FFF7F7;color:#061226;font-family:inherit;user-select:text;-webkit-user-select:text,sans-serif;box-shadow:0 18px 48px rgba(80,15,15,.08)}
          .hi-version-block{position:absolute;top:18px;right:22px;text-align:right;font-size:10.5px;line-height:1.25;font-weight:400;color:var(--secondary-text-color,#6B7280);opacity:.82;background:none;border:0;box-shadow:none;padding:0}
          h1{margin:0 0 8px;font-size:34px;letter-spacing:-.04em}
          h2{margin:0 0 8px;font-size:20px}
          p{font-weight:600;color:#5F6D84}
          pre{white-space:pre-wrap;overflow:auto;background:#fff;border:1px solid #F0D0D0;border-radius:14px;padding:14px;font-size:12px;max-height:360px}
        
/* R22.12.11.24 unified quick-action sizing */
.action.enum-action,.cmd.enum-command{height:43px!important;min-height:43px!important;max-height:43px!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:0 11px!important;box-sizing:border-box!important;overflow:hidden!important}
.action.enum-action ha-icon,.cmd.enum-command ha-icon{flex:0 0 auto!important;grid-row:auto!important}
.action.enum-action select,.cmd.enum-command select{appearance:auto!important;-webkit-appearance:auto!important;min-width:0!important;max-width:170px!important;width:auto!important;border:0!important;background:transparent!important;color:inherit!important;font:inherit!important;font-size:12px!important;font-weight:600!important;padding:0 2px!important;line-height:1!important;box-shadow:none!important;cursor:pointer!important;grid-column:auto!important}
.action.enum-action select:focus,.cmd.enum-command select:focus{outline:2px solid rgba(20,103,245,.20)!important;outline-offset:3px!important;border-radius:6px!important}
.command-row>.cmd,.command-row>.enum-command{min-width:0!important;width:100%!important}
</style>
        ${hbMobilityReleaseFooter(new HomeBrainAssetRuntime(this._hass || hass, this.config))}
      </ha-card>`;
    }
  }
  wireEvents(rt) {
    this.shadowRoot.querySelectorAll("button[data-intent]").forEach((btn)=>btn.addEventListener("click",()=>{
      const assetId = btn.getAttribute("data-asset-id") || "";
      const commandId = btn.getAttribute("data-command-id") || "";
      const commandKey = btn.getAttribute("data-command-key") || commandId;
      const command = commandKey ? rt.commandsFor(assetId).find((c)=>String(c.command_key || c.command_id || "") === String(commandKey) || String(c.command_id || "") === String(commandId)) : null;
      if (command) rt.callCommand(command);
    }));
    this.shadowRoot.querySelectorAll("select[data-command-id]").forEach((select)=>select.addEventListener("change",()=>{
      const value = select.value;
      if (!value || select.disabled) return;
      const assetId = select.getAttribute("data-command-asset") || "";
      const commandId = select.getAttribute("data-command-id") || "";
      const commandKey = select.getAttribute("data-command-key") || commandId;
      const parameter = select.getAttribute("data-command-param") || "";
      const command = rt.commandsFor(assetId).find((candidate)=>String(candidate.command_key || candidate.command_id || "") === String(commandKey) || String(candidate.command_id || "") === String(commandId));
      if (!command || !parameter) return;
      rt.callCommand(command, { [parameter]: value });
      select.value = "";
    }));
    this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn)=>btn.addEventListener("click",()=>{
      const target = btn.getAttribute("data-nav") || "";
      this.rememberViewPosition();
      if (!target) return;
      rt.navigate(target);
    }));
    this.shadowRoot.querySelectorAll("button[data-vehicle-filter]").forEach((btn)=>btn.addEventListener("click",()=>{
      const value = btn.getAttribute("data-vehicle-filter") || "all";
      if (!["all","active","disabled","attention"].includes(value)) return;
      this._vehicleFilter = value;
      this._forceRender = true;
      this._lastSignature = "";
      this._restoredPositionKey = this.viewPositionKey();
      if (this._hass) this.hass = this._hass;
    }));
    this.shadowRoot.querySelectorAll("select[data-vehicle-sort]").forEach((select)=>select.addEventListener("change",()=>{
      this._vehicleSort = select.value === "name" ? "name" : "default";
      this._forceRender = true;
      this._lastSignature = "";
      this._restoredPositionKey = this.viewPositionKey();
      if (this._hass) this.hass = this._hass;
    }));
    this.shadowRoot.querySelectorAll("button[data-vehicle-picker]").forEach((btn)=>btn.addEventListener("click",()=>{
      const assetId = btn.getAttribute("data-vehicle-picker") || "";
      this._vehiclePickerAsset = this._vehiclePickerAsset === assetId ? "" : assetId;
      this._forceRender = true; this._lastSignature = "";
      if (this._hass) this.hass = this._hass;
    }));
    this.shadowRoot.querySelectorAll("button[data-vehicle-picker-close]").forEach((btn)=>btn.addEventListener("click",()=>{
      this._vehiclePickerAsset = ""; this._forceRender = true; this._lastSignature = "";
      if (this._hass) this.hass = this._hass;
    }));
    this.shadowRoot.querySelectorAll("select[data-vehicle-picker-type]").forEach((select)=>select.addEventListener("change",()=>{
      const assetId = select.getAttribute("data-vehicle-picker-type") || "";
      const current = this._vehiclePickerDraft.get(assetId) || {};
      this._vehiclePickerDraft.set(assetId,{...current,vehicle_id:select.value,color_id:""});
      this._forceRender = true; this._lastSignature = "";
      if (this._hass) this.hass = this._hass;
    }));
    this.shadowRoot.querySelectorAll("select[data-vehicle-picker-color]").forEach((select)=>select.addEventListener("change",()=>{
      const assetId = select.getAttribute("data-vehicle-picker-color") || "";
      const current = this._vehiclePickerDraft.get(assetId) || {};
      this._vehiclePickerDraft.set(assetId,{...current,color_id:select.value});
      this._forceRender = true; this._lastSignature = "";
      if (this._hass) this.hass = this._hass;
    }));
    this.shadowRoot.querySelectorAll("button[data-vehicle-picker-save]").forEach((btn)=>btn.addEventListener("click",()=>{
      if (btn.disabled) return;
      const assetId = btn.getAttribute("data-vehicle-picker-save") || "";
      const key = btn.getAttribute("data-vehicle-key") || "";
      if (!assetId || !key || !rt.writePublishedProperty(assetId,"vehicle.image_key",key)) return;
      btn.classList.add("sent");
      this._vehiclePickerDraft.delete(assetId);
      setTimeout(()=>{ this._vehiclePickerAsset=""; this._forceRender=true; this._lastSignature=""; if(this._hass)this.hass=this._hass; },450);
    }));
    this.shadowRoot.querySelectorAll("button[data-lifecycle-asset]").forEach((btn)=>btn.addEventListener("click",()=>{
      if (btn.disabled) return;
      const assetId = btn.getAttribute("data-lifecycle-asset") || "";
      const value = btn.getAttribute("data-lifecycle-value") || "";
      if (!assetId || !value) return;
      const ok = rt.writeLifecycleStatus(assetId, value);
      if (!ok) return;
      btn.classList.add("sent");
      this._forceRender = true;
      this._holdRenderUntil = 0;
      setTimeout(()=>{ if (this.isConnected) this.hass = this._hass; }, 650);
    }));

    this.shadowRoot.querySelectorAll("button[data-property-step],button[data-charge-power-step],button[data-current-step]").forEach((btn)=>btn.addEventListener("click",()=>{
      const vehicleAsset = btn.getAttribute("data-vehicle-asset") || btn.getAttribute("data-charger-asset");
      const propertyKey = btn.getAttribute("data-property-step") || "";
      const unit = btn.getAttribute("data-unit") || "kW";
      const delta = Number(btn.getAttribute("data-delta") || 0);
      const min = Number(btn.getAttribute("data-min") || 0);
      const max = Number(btn.getAttribute("data-max") || 100);
      const attrValue = Number(btn.getAttribute("data-charge-power-value") || btn.getAttribute("data-current-value"));
      const cur = Number.isFinite(attrValue) ? attrValue : null;
      const next = Math.max(min, Math.min(max, (cur ?? min) + delta));
      if (vehicleAsset) this._currentOverrides.set(vehicleAsset, next);
      const wrap = btn.closest(".mini-current-stepper");
      if (wrap) {
        const strong = wrap.querySelector("strong");
        if (strong) strong.textContent = `${Number.isInteger(next) ? next : Number(next).toFixed(2).replace(/\.00$/, "")} ${unit}`;
        wrap.querySelectorAll("button[data-property-step],button[data-charge-power-step],button[data-current-step]").forEach((b)=>{
          b.setAttribute("data-charge-power-value", String(next));
          b.setAttribute("data-current-value", String(next));
          const d = Number(b.getAttribute("data-delta") || 0);
          b.disabled = (d < 0 && next <= min + 0.000001) || (d > 0 && next >= max - 0.000001);
        });
      }
      this._holdRenderUntil = Date.now() + 1200;
      if (!propertyKey || !vehicleAsset) return;
      const model = propertyKey === "vehicle.requested_charge_power_kw"
        ? rt.vehicleChargePowerControlModel(vehicleAsset)
        : rt.propertyControlModel(vehicleAsset, propertyKey);
      rt.writePropertyControl(model, next);
      setTimeout(()=>{ if (this.isConnected) this.hass = this._hass; }, 900);
    }));
    this.shadowRoot.querySelectorAll("select[data-property-asset][data-property-key]").forEach((select)=>{
      const hold = ()=>{ this._holdRenderUntil = Date.now() + 1200; };
      select.addEventListener("pointerdown", hold);
      select.addEventListener("focus", hold);
      select.addEventListener("change",()=>{
        const assetId = select.getAttribute("data-property-asset") || "";
        const propertyKey = select.getAttribute("data-property-key") || "";
        if (!assetId || !propertyKey || select.disabled) return;
        rt.writePublishedProperty(assetId, propertyKey, select.value);
        this._forceRender = true;
        this._holdRenderUntil = 0;
        setTimeout(()=>{ if (this.isConnected) this.hass = this._hass; }, 250);
      });
    });
  }

  styles() { return `
    :host{--hb-blue:#1467F5;--hb-ink:#061226;--hb-muted:#63718A;--hb-line:#E4ECF7;--hb-soft:#F6FAFF;--hb-shadow:0 22px 60px rgba(15,35,80,.08);font-family:inherit;color:var(--hb-ink);user-select:text;-webkit-user-select:text}
    *{user-select:text;-webkit-user-select:text} button,select,input,img,ha-icon{user-select:none;-webkit-user-select:none}
    ha-card{background:transparent;border:0;box-shadow:none}.page{position:relative;width:min(100%,1680px);margin:0 auto;padding:18px 34px 38px;display:grid;gap:12px;box-sizing:border-box}.release-badge{position:absolute;top:10px;right:34px;border:1px solid rgba(14,35,72,.10);background:#fff;border-radius:999px;padding:5px 10px;font-size:12px;font-weight:650;color:#33415C;box-shadow:0 8px 20px rgba(15,35,80,.055)}.eyebrow{margin:0 0 6px!important;color:#1467F5!important;font-size:12px;font-weight:650;letter-spacing:.12em}.title h1{font-size:38px;letter-spacing:-.055em;margin:0 0 6px;font-weight:650}.title p{margin:0;color:#34405A;font-weight:600}.top-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.summary{border:1px solid var(--hb-line);border-radius:22px;background:#fff;box-shadow:var(--hb-shadow);min-height:108px;padding:20px;display:grid;grid-template-columns:56px 1fr;gap:16px;align-items:center}.summary.attention{border-color:rgba(245,143,32,.30);background:linear-gradient(135deg,#FFFAF2,#fff)}.summary.recommendation{border-color:rgba(20,103,245,.22);background:linear-gradient(135deg,#F5FAFF,#fff)}.summary-icon{width:52px;height:52px;border-radius:16px;background:rgba(255,145,0,.12);display:flex;align-items:center;justify-content:center;color:#F28C00}.summary-icon.blue{background:#1467F5;color:#fff}.summary-icon ha-icon{--mdc-icon-size:30px}.summary h3,.info h3{margin:0 0 8px;font-size:16px;font-weight:650}.summary ul,.info ul{list-style:none;margin:0;padding:0}.summary li{display:flex;flex-direction:column;gap:3px;border-top:1px solid rgba(14,35,72,.06);padding:7px 0;font-size:13px;color:#34405A;font-weight:600}.summary li.clear b{color:#087A35}.section-title{display:flex;align-items:end;justify-content:space-between;margin:0 2px -8px}.section-title h2{font-size:20px;letter-spacing:-.035em;margin:0;font-weight:650}.section-title span{font-size:12px;font-weight:650;color:#6A768D;background:#F4F7FB;border:1px solid var(--hb-line);border-radius:999px;padding:5px 9px}.vehicles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.vehicle-card{background:#fff;border:1px solid var(--hb-line);border-radius:24px;box-shadow:var(--hb-shadow);overflow:hidden}.premium-vehicle-card{display:grid;gap:0}.status-top-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;padding:16px 18px 8px}.status-row{display:flex;align-items:center;justify-content:center;gap:7px;min-height:40px;border:1px solid var(--hb-line);border-radius:14px;background:#fff;min-width:0}.status-row span{display:none}.status-row ha-icon{--mdc-icon-size:18px;color:#17233B;flex:0 0 auto}.vehicle-intelligence-strip .intelligence-status-row{display:grid;grid-template-columns:20px minmax(0,1fr);grid-template-rows:auto auto;justify-content:stretch;align-content:center;column-gap:7px;row-gap:1px;padding:5px 8px;min-height:40px}.vehicle-intelligence-strip .intelligence-status-row ha-icon{grid-row:1 / span 2;align-self:center}.vehicle-intelligence-strip .intelligence-status-row span{display:block!important;grid-column:2;font-size:9px;line-height:1;color:#6A768D;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vehicle-intelligence-strip .intelligence-status-row .pill{grid-column:2;justify-content:flex-start;min-width:0;padding:3px 7px;font-size:10px}.pill{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:6px 10px;min-width:72px;max-width:100%;font-size:10px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pill.ok{background:#E7F6EA;color:#087A35}.pill.warn{background:#FFF1D9;color:#B76500}.pill.bad{background:#FDE4E4;color:#C21E1E}.pill.muted{background:#EEF1F6;color:#64708A}.hero-split-row{display:grid;grid-template-columns:2fr 1fr;gap:12px;padding:8px 18px 12px;align-items:stretch}.vehicle-hero-panel{display:grid;grid-template-columns:minmax(0,.86fr) minmax(220px,1.14fr);gap:12px;min-height:170px;border:1px solid rgba(14,35,72,.06);border-radius:18px;background:linear-gradient(135deg,#fff,#F8FBFF);padding:18px;overflow:hidden}.vehicle-copy h2{font-size:25px;margin:0 0 4px;font-weight:650;letter-spacing:-.045em}.vehicle-copy p{margin:0;color:#34405A;font-weight:600}.vehicle-image{display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at center,rgba(20,103,245,.09),transparent 62%);min-width:0}.vehicle-image img{max-width:100%;max-height:176px;object-fit:contain;filter:drop-shadow(0 18px 28px rgba(15,35,80,.16))}.vehicle-image ha-icon{--mdc-icon-size:76px;color:#B8C3D6}.charger-hero-panel{border:1px solid var(--hb-line);border-radius:18px;background:linear-gradient(135deg,#F8FBFF,#fff);padding:14px;display:grid;grid-template-rows:auto 1fr;gap:8px;align-items:center;min-width:0}.charger-mini-image{height:118px;border-radius:16px;background:radial-gradient(circle at center,rgba(20,103,245,.10),transparent 65%);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.charger-mini-image img{max-width:100%;max-height:112px;object-fit:contain;filter:drop-shadow(0 14px 24px rgba(15,35,80,.13))}.charger-mini-image ha-icon{display:none;--mdc-icon-size:46px;color:#8EA1BE}.charger-mini-image.image-missing ha-icon{display:block}.charger-mini-copy{display:flex;flex-direction:column;gap:2px;min-width:0}.charger-mini-copy b{font-size:15px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.charger-mini-copy span{display:none!important}.relationship-lines{display:flex;flex-direction:column;gap:2px;margin-top:6px;font-size:10.5px;color:#64708A;font-weight:500;line-height:1.25}.relationship-lines span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vehicle-control-row{display:grid;grid-template-columns:minmax(320px,1fr) minmax(420px,.95fr);gap:12px;padding:0 18px 12px;align-items:stretch}.vehicle-metrics-strip,.charge-mini-strip{display:grid;gap:8px}.vehicle-metrics-strip{grid-template-columns:repeat(3,minmax(92px,1fr))}.charge-mini-strip{grid-template-columns:minmax(170px,1.2fr) minmax(190px,1fr) minmax(110px,.7fr)}.metric-chip,.mini-control{min-height:42px;border:1px solid var(--hb-line);border-radius:13px;background:#fff;display:flex;align-items:center;gap:8px;padding:0 12px;min-width:0}.metric-chip{flex-direction:column;align-items:flex-start;justify-content:center;gap:2px}.metric-chip span{color:var(--hb-muted);font-size:10px;text-transform:uppercase;font-weight:650}.metric-chip b,.mini-control strong{font-size:14px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mini-control ha-icon{--mdc-icon-size:18px;color:var(--hb-blue);flex:0 0 auto}.charger-select select{width:100%;border:0;background:transparent;font-weight:650;color:#17233B;min-width:0;outline:0}.charger-select.readonly{opacity:.72}.current-edit input{width:54px;min-width:0;border:0;background:transparent;font-weight:650;color:#061226;outline:0;text-align:right}.current-edit span{font-weight:650;color:#63718A}.inline-apply{border:1px solid rgba(14,35,72,.10);background:#fff;border-radius:10px;padding:6px 8px;font-size:11px;font-weight:650;color:#1467F5;cursor:pointer}.inline-apply:disabled{opacity:.38;cursor:not-allowed}.power-read{justify-content:flex-start}.vehicle-actions{border-top:1px solid rgba(14,35,72,.07);display:grid;grid-template-columns:1.05fr 1fr 1fr 1fr;gap:8px;padding:11px 18px}.clean-actions .details-action{margin-left:auto;width:100%}.action{min-height:42px;border:1px solid rgba(14,35,72,.11);border-radius:13px;background:#fff;color:var(--hb-ink);font-weight:650;display:flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;box-shadow:0 10px 24px rgba(15,35,80,.035)}.action ha-icon{--mdc-icon-size:18px;color:var(--hb-blue)}.action.primary-charge{background:linear-gradient(135deg,#1467F5,#3B82F6);border-color:#1467F5;color:#fff}.action.primary-charge ha-icon{color:#fff}.action.sent{background:#EEF5FF;border-color:#CFE0FF;color:#0B4BC1}.action.busy{background:#FFF8E8}.action.failed{background:#FEF3F2;color:#B42318}.action:disabled{opacity:.55;cursor:not-allowed}.action.activate-soft{opacity:1;cursor:pointer}.inactive-list{display:grid;gap:10px}.inactive-row{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:0 12px 36px rgba(15,35,80,.055);padding:10px 12px;display:grid;grid-template-columns:78px 1fr auto;gap:14px;align-items:center}.inactive-image{width:78px;height:52px;border-radius:14px;background:#F4F8FF;display:flex;align-items:center;justify-content:center;overflow:hidden}.inactive-image img{max-width:100%;max-height:64px;object-fit:contain;filter:grayscale(.25) opacity(.82)}.inactive-image ha-icon{--mdc-icon-size:34px;color:#9AABC5}.inactive-copy h3{margin:0 0 2px;font-size:16px;font-weight:650}.inactive-copy p{margin:0;color:#64708A;font-weight:600}.inactive-actions{display:flex;gap:8px}.bottom-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.info{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:var(--hb-shadow);padding:18px;min-height:100px}.info h3{display:flex;align-items:center;gap:10px}.info h3 ha-icon{--mdc-icon-size:22px;color:var(--hb-blue)}.info p,.info li{color:#34405A;font-weight:600}.empty{grid-column:1/-1;border:1px dashed #CBD5E1;border-radius:18px;background:#fff;padding:28px;color:var(--hb-muted);font-weight:600;text-align:center}.domain-tabs-wrap{margin:8px 0 8px!important}.dashboard-status-strip.outcome-header{margin:8px 0 6px!important}.section-title{margin:0 2px -4px!important}.title h1{margin-bottom:3px!important}.title p{margin-bottom:0!important}@media(max-width:1500px){.vehicles{grid-template-columns:1fr}.vehicle-hero-panel{grid-template-columns:1fr 1.25fr}}@media(max-width:900px){.top-grid,.bottom-grid{grid-template-columns:1fr}.hero-split-row,.vehicle-control-row{grid-template-columns:1fr}.vehicle-hero-panel{grid-template-columns:1fr}.vehicle-actions{grid-template-columns:repeat(2,1fr)}.inactive-row{grid-template-columns:70px 1fr}.inactive-actions{grid-column:1/-1}.charge-mini-strip{grid-template-columns:1fr 1fr 1fr}.vehicle-image{min-height:150px}.status-top-row{grid-template-columns:repeat(5,minmax(54px,1fr));overflow:auto;padding-bottom:8px}}@media(max-width:640px){.page{padding:16px}.summary{grid-template-columns:1fr}.vehicle-metrics-strip,.charge-mini-strip,.vehicle-actions{grid-template-columns:1fr}.inactive-actions{flex-direction:column}.hero-split-row,.vehicle-control-row,.status-top-row{padding-left:12px;padding-right:12px}.pill{min-width:58px;font-size:9px}.vehicle-copy h2{font-size:22px}}
    /* 2.3.9 mock-aligned dashboard overrides */
    .hi-contract-warning{border:1px solid rgba(245,158,11,.32);background:#FFFBEB;color:#6B3F00;border-radius:16px;padding:10px 14px;font-size:12px;font-weight:600;display:grid;gap:6px;box-shadow:0 12px 28px rgba(80,55,0,.05)}.hi-contract-warning strong{font-weight:650}.hi-contract-warning-list{display:flex;flex-wrap:wrap;gap:6px}.hi-contract-warning-list span{border:1px solid rgba(245,158,11,.25);background:#fff;border-radius:999px;padding:4px 8px;font-weight:600;color:#7A4B00}
    .release-badge{display:grid;gap:2px;place-items:center;padding:8px 13px;border-radius:16px;font-size:13px}.release-badge b{font-size:16px;color:#1467F5}.release-badge span{font-size:12px;color:#33415C;font-weight:650}.vehicles{grid-template-columns:repeat(2,minmax(560px,1fr));gap:12px}.vehicle-card{border-radius:22px}.status-top-row{padding:12px 14px 8px;gap:8px}.status-row{min-height:36px;border-radius:999px;justify-content:flex-start;padding:0 12px}.status-row span{display:none}.pill{min-width:86px;font-size:11px;padding:7px 12px}.hero-split-row{grid-template-columns:2.35fr 1fr;padding:6px 14px 8px;gap:12px}.vehicle-hero-panel{grid-template-columns:.62fr 1.38fr;min-height:205px;padding:22px;border-radius:18px}.vehicle-copy h2{font-size:27px}.vehicle-image img{max-height:230px;transform:scale(1.15);transform-origin:center;max-width:105%}.charger-hero-panel{min-height:205px;border-radius:18px;padding:16px}.charger-mini-image{height:128px}.charger-mini-image img{max-width:142px;max-height:126px}.vehicle-control-row.mock-row{grid-template-columns:minmax(330px,1.35fr) minmax(250px,.9fr);padding:0 14px 10px;gap:10px}.vehicle-metrics-strip.mock-metrics{grid-template-columns:repeat(3,minmax(100px,1fr));gap:0;border:1px solid var(--hb-line);border-radius:16px;overflow:hidden;background:#fff}.vehicle-metrics-strip.mock-metrics .metric-chip{border:0;border-right:1px solid var(--hb-line);border-radius:0;min-height:62px;padding:10px 14px}.vehicle-metrics-strip.mock-metrics .metric-chip:last-child{border-right:0}.metric-chip span{font-size:11px}.metric-chip b{font-size:21px}.battery-chip{position:relative}.battery-chip i{position:absolute;right:16px;bottom:16px;width:26px;height:8px;border-radius:999px;background:linear-gradient(90deg,#2CBF61 60%,#DCEBE2 60%)}.charge-mini-strip.mock-controls{grid-template-columns:minmax(148px,1fr) minmax(164px,1fr);gap:10px}.mini-control,.mini-current-stepper{min-height:62px;border:1px solid var(--hb-line);border-radius:16px;background:#fff;display:flex;align-items:center;gap:10px;padding:0 12px;min-width:0}.charger-select select{font-size:14px}.mini-current-stepper ha-icon,.mini-control ha-icon{--mdc-icon-size:22px;color:#1467F5}.mini-current-stepper strong{font-size:18px;min-width:48px;text-align:center}.mini-current-stepper small{font-size:11px;color:#63718A;font-weight:600}.round-step{width:34px;height:34px;border-radius:999px;border:1px solid var(--hb-line);background:#F6FAFF;color:#1467F5;font-size:22px;font-weight:650;line-height:1;cursor:pointer}.mini-current-stepper.readonly{opacity:.55;justify-content:center}.mini-current-stepper.readonly .round-step{display:none}.power-read{display:none}.vehicle-actions{grid-template-columns:1.05fr 1fr 1fr .9fr .95fr;padding:10px 14px 14px;gap:10px}.action{min-height:43px;border-radius:14px;font-size:14px}.danger-action{border-color:rgba(230,57,70,.35)!important;color:#D11A2A!important;background:#FFF3F3!important}.danger-action ha-icon{color:#D11A2A!important}.inactive-row{grid-template-columns:auto 1fr auto;border-radius:16px}.inactive-image{display:none}.debt-strip{display:flex;align-items:center;gap:14px;background:#F8FBFF;border:1px solid #DDEAFF;border-radius:18px;padding:12px 18px;color:#45536C;font-size:13px;font-weight:600}.debt-strip ha-icon{color:#1467F5}.debt-strip span:before{content:"•";margin-right:12px;color:#8EA1BE}@media(max-width:1300px){.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:240px}}@media(max-width:760px){.hero-split-row,.vehicle-control-row.mock-row{grid-template-columns:1fr}.vehicle-hero-panel{grid-template-columns:1fr}.vehicle-actions{grid-template-columns:1fr 1fr}.debt-strip{flex-wrap:wrap}.charge-mini-strip.mock-controls{grid-template-columns:1fr}}

    /* 2.3.9 compact mock implementation and technical-debt burn-down */

    .hi-version-block{
      position:absolute!important;
      top:26px!important;
      right:28px!important;
      text-align:right!important;
      font-size:10.5px!important;
      line-height:1.25!important;
      font-weight:400!important;
      color:var(--secondary-text-color,#6B7280)!important;
      opacity:.82!important;
      background:none!important;
      border:0!important;
      box-shadow:none!important;
      padding:0!important;
      margin:0!important;
      z-index:2!important;
      pointer-events:none!important;
    }
    .release-badge{display:none!important;}.hi-version-block{display:none!important;}

    .page{width:min(100%,1640px);padding:24px 28px 38px;gap:16px}.title{margin-bottom:0}.title h1{font-size:38px}.top-grid{gap:16px}.summary{min-height:116px;padding:20px 24px;align-items:center}.summary h3{margin:0 0 8px}.summary-icon{width:58px;height:58px}.section-title{margin-top:0}.vehicles{gap:16px}.vehicle-card{border-radius:20px;overflow:hidden}.status-top-row{padding:10px 12px 6px;gap:7px;grid-template-columns:repeat(5,minmax(0,1fr))}.status-row{min-height:34px;padding:0 10px}.status-row ha-icon{--mdc-icon-size:18px}.pill{min-width:0;width:100%;font-size:10.5px;padding:7px 9px}.hero-split-row{grid-template-columns:minmax(0,2.45fr) minmax(180px,.85fr);padding:6px 12px 6px;gap:10px}.vehicle-hero-panel{min-height:215px;padding:20px;border-radius:16px;grid-template-columns:.54fr 1.46fr}.vehicle-copy h2{font-size:28px;line-height:1.02}.vehicle-copy p{font-size:14px}.vehicle-image{min-height:170px}.vehicle-image img{max-height:270px;transform:scale(1.28);max-width:118%}.charger-hero-panel{min-height:215px;padding:14px;border-radius:16px}.charger-mini-image{height:135px}.charger-mini-image img{max-width:154px;max-height:132px}.vehicle-control-row.mock-row{grid-template-columns:minmax(240px,.92fr) minmax(330px,1.08fr);padding:0 12px 8px;gap:8px;align-items:stretch}.vehicle-metrics-strip.mock-metrics{grid-template-columns:repeat(3,minmax(70px,1fr));height:56px}.vehicle-metrics-strip.mock-metrics .metric-chip{min-height:54px;padding:7px 10px}.metric-chip span{font-size:9.5px}.metric-chip b{font-size:18px}.battery-chip i{right:10px;bottom:12px;width:22px;height:7px}.charge-mini-strip.mock-controls{grid-template-columns:minmax(160px,1.15fr) minmax(190px,1fr);gap:8px;height:56px}.mini-control,.mini-current-stepper{min-height:54px;height:56px;border-radius:14px;padding:0 10px}.charger-select select{font-size:13.5px}.mini-current-stepper strong{font-size:16px}.mini-current-stepper small{font-size:10px}.round-step{width:30px;height:30px;font-size:20px}.vehicle-actions{grid-template-columns:1.05fr 1fr .85fr .82fr .9fr;padding:9px 12px 12px;gap:8px}.action{min-height:40px;border-radius:13px;font-size:13.5px}.inactive-row{min-height:62px;padding:10px 16px;grid-template-columns:82px 1fr auto}.inactive-state{background:#EEF2F7;color:#53627A;border-radius:999px;font-weight:650;font-size:12px;padding:7px 10px;text-align:center}.compact-present-row .action{min-width:118px}.debt-strip{font-size:12px;padding:10px 14px}.bottom-grid{display:none}.domain-tabs-wrap{margin:8px 0 8px!important}.dashboard-status-strip.outcome-header{margin:8px 0 6px!important}.section-title{margin:0 2px -4px!important}.title h1{margin-bottom:3px!important}.title p{margin-bottom:0!important}@media(max-width:1500px){.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:290px}.hero-split-row{grid-template-columns:minmax(0,2.3fr) minmax(190px,.9fr)}}@media(max-width:760px){.vehicle-control-row.mock-row{grid-template-columns:1fr}.charge-mini-strip.mock-controls{grid-template-columns:1fr 1fr}.vehicle-actions{grid-template-columns:1fr 1fr}.vehicle-image img{transform:scale(1.12)}}


    /* 2.3.9 contract-catalog aligned compact dashboard */
    .page{width:min(100%,1560px);padding:18px 26px 30px;gap:14px}.top-grid{gap:14px}.summary{min-height:104px;padding:18px 22px;display:grid;grid-template-columns:64px 1fr;align-items:center}.summary h3{margin:0 0 6px}.summary ul{margin:0;padding:0;list-style:none}.summary li{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:baseline}.summary li span{font-size:13px}.summary-icon{width:54px;height:54px}.vehicles{gap:14px}.vehicle-card{border-radius:20px}.status-top-row{padding:10px 12px 6px;gap:7px}.status-row{min-height:32px;padding:0 9px}.pill{font-size:10.5px;padding:6px 9px}.hero-split-row{grid-template-columns:minmax(0,2.7fr) minmax(160px,.85fr);gap:10px;padding:5px 12px 8px}.vehicle-hero-panel{min-height:188px;padding:18px;grid-template-columns:.50fr 1.50fr}.vehicle-copy h2{font-size:27px}.vehicle-image img{max-height:258px;transform:scale(1.24);max-width:116%}.charger-hero-panel{min-height:188px;padding:13px}.charger-mini-image{height:112px}.charger-mini-image img{max-width:138px;max-height:110px}.vehicle-control-row.mock-row{grid-template-columns:minmax(250px,.86fr) minmax(360px,1.14fr);padding:0 12px 8px;gap:8px;align-items:stretch}.vehicle-metrics-strip.mock-metrics{grid-template-columns:.9fr .8fr .75fr;height:48px}.vehicle-metrics-strip.mock-metrics .metric-chip{min-height:48px;padding:6px 10px}.metric-chip span{font-size:9px}.metric-chip b{font-size:17px}.charge-mini-strip.mock-controls{grid-template-columns:minmax(170px,1.25fr) minmax(150px,.95fr) minmax(86px,.65fr);gap:8px;height:48px}.charge-mini-strip.mock-controls.no-speed{grid-template-columns:minmax(190px,1fr) minmax(86px,.46fr)}.mini-control,.mini-current-stepper,.mini-power-read{min-height:48px;height:48px;border:1px solid var(--hb-line);border-radius:13px;background:#fff;display:flex;align-items:center;gap:8px;padding:0 10px;min-width:0}.mini-power-read ha-icon,.mini-current-stepper ha-icon,.mini-control ha-icon{--mdc-icon-size:20px;color:#1467F5}.mini-power-read strong,.mini-current-stepper strong{font-size:15px;font-weight:650;white-space:nowrap}.charger-select select{font-size:13px;max-width:100%}.round-step{width:28px;height:28px;font-size:19px}.mini-current-stepper small{display:none}.vehicle-actions{grid-template-columns:1.05fr 1fr .95fr .85fr .95fr;padding:8px 12px 12px;gap:8px}.action{min-height:38px;border-radius:13px;font-size:13px}.section-title{margin-top:0}.inactive-row{min-height:56px;padding:8px 14px}.debt-strip{margin-top:0;font-size:12px;padding:9px 14px}@media(max-width:1380px){.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:270px}.hero-split-row{grid-template-columns:minmax(0,2.45fr) minmax(170px,.9fr)}}@media(max-width:820px){.vehicle-control-row.mock-row,.hero-split-row{grid-template-columns:1fr}.charge-mini-strip.mock-controls,.charge-mini-strip.mock-controls.no-speed{grid-template-columns:1fr}.vehicle-actions{grid-template-columns:1fr 1fr}.vehicle-image img{transform:scale(1.10)}}


    /* 2.4.0 dashboard stabilization: compact cockpit, restored footer and icon navigation */
    .page{width:min(100%,1560px);padding:16px 24px 30px;gap:10px}.top-grid{gap:14px}.summary{min-height:96px;padding:16px 20px;align-items:center}.summary h3{margin:0 0 6px}.summary li{padding:5px 0}.vehicles{gap:14px}.vehicle-card{border-radius:20px}.hero-split-row{grid-template-columns:minmax(0,2.55fr) minmax(155px,.75fr);gap:9px;padding:5px 12px 8px}.vehicle-hero-panel{min-height:190px;padding:17px;grid-template-columns:.47fr 1.53fr}.vehicle-copy h2{font-size:27px}.vehicle-copy p{font-size:13px}.vehicle-image img{max-height:278px;transform:scale(1.33);max-width:122%}.charger-hero-panel{min-height:190px;padding:12px}.charger-mini-image{height:112px}.charger-mini-image img{max-width:142px;max-height:112px}.vehicle-control-row.mock-row{grid-template-columns:minmax(210px,.70fr) minmax(430px,1.30fr);padding:0 12px 8px;gap:8px}.vehicle-metrics-strip.mock-metrics{grid-template-columns:.85fr .75fr .70fr;height:44px}.vehicle-metrics-strip.mock-metrics .metric-chip{min-height:44px;padding:5px 9px}.metric-chip span{font-size:8.5px}.metric-chip b{font-size:16px}.battery-chip i{right:9px;bottom:10px;width:20px;height:7px}.charge-mini-strip.mock-controls{grid-template-columns:minmax(150px,1.25fr) minmax(118px,.82fr) minmax(126px,.95fr) minmax(78px,.48fr);height:44px;gap:7px}.charge-mini-strip.no-mode{grid-template-columns:minmax(170px,1.35fr) minmax(126px,.95fr) minmax(78px,.48fr)}.charge-mini-strip.no-speed{grid-template-columns:minmax(180px,1fr) minmax(118px,.75fr) minmax(78px,.40fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(190px,1fr) minmax(78px,.35fr)}.mini-control,.mini-current-stepper,.mini-power-read{height:44px;min-height:44px;border-radius:13px;padding:0 9px}.charger-select select,.mode-select select{font-size:12.5px}.mini-current-stepper strong,.mini-power-read strong{font-size:14px}.round-step{width:27px;height:27px;font-size:18px}.vehicle-actions{grid-template-columns:minmax(138px,1.05fr) minmax(130px,1fr) minmax(110px,.85fr) 1fr minmax(54px,.32fr) 42px;padding:8px 12px 12px;gap:8px}.action{min-height:38px;border-radius:13px;font-size:13px}.action-spacer{display:block}.icon-only{width:42px;min-width:42px;max-width:42px;padding:0!important}.icon-only span{display:none!important}.icon-only ha-icon{margin:0!important}.presence-toggle{background:#fff!important;color:#1467F5!important;border-color:var(--hb-line)!important}.presence-toggle ha-icon{color:#1467F5!important}.details-action{background:#fff!important;color:#1467F5!important}.details-action ha-icon{color:#1467F5!important}.inactive-actions .icon-only{width:42px}.bottom-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.info{background:#fff;border:1px solid var(--hb-line);border-radius:18px;box-shadow:0 14px 34px rgba(15,35,80,.055);padding:14px 16px;min-height:82px}.info h3{display:flex;align-items:center;gap:8px;font-size:15px;margin:0 0 8px}.info h3 ha-icon{color:#1467F5}.info p,.info li{font-size:12px;font-weight:600;color:#34405A}.debt-strip{display:none!important}@media(max-width:1380px){.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:285px}.hero-split-row{grid-template-columns:minmax(0,2.45fr) minmax(170px,.9fr)}}@media(max-width:860px){.top-grid,.vehicles,.hero-split-row,.vehicle-control-row.mock-row,.bottom-grid{grid-template-columns:1fr}.charge-mini-strip.mock-controls,.charge-mini-strip.no-mode,.charge-mini-strip.no-speed,.charge-mini-strip.no-speed.no-mode{grid-template-columns:1fr 1fr}.vehicle-actions{grid-template-columns:1fr 1fr 1fr minmax(54px,.35fr) 42px}.action-spacer{display:none}.vehicle-image img{transform:scale(1.12)}}


    /* 2.4.0 dashboard stabilization: density, alignment and unified controls */
    .page{width:calc(100% - 96px);max-width:1720px;margin:0 auto 0 48px;padding:18px 22px 30px;gap:12px;}
    .release-badge{top:6px;right:24px;min-width:58px;text-align:center;}
    .title h1{font-size:38px;margin-bottom:6px}.title p{font-size:14px}
    .top-grid{gap:12px;align-items:stretch}.summary{min-height:86px;padding:14px 18px;grid-template-columns:52px 1fr;gap:14px;align-items:center}.summary-icon{width:50px;height:50px;border-radius:16px}.summary h3{margin:0 0 5px;font-size:15px}.summary li{padding:4px 0;font-size:12px;display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:baseline}
    .section-title{margin:0 2px -7px}.section-title h2{font-size:19px}.vehicles{gap:12px}.vehicle-card{border-radius:21px}.status-top-row{padding:8px 10px 5px;gap:6px}.status-row{min-height:30px;border-radius:12px;padding:0 7px}.status-row ha-icon{--mdc-icon-size:16px}.pill{font-size:9.8px;padding:5px 8px;min-width:0;width:100%;}
    .hero-split-row{grid-template-columns:minmax(0,2.72fr) minmax(148px,.72fr);gap:8px;padding:4px 10px 6px;align-items:stretch}.vehicle-hero-panel{min-height:178px;padding:14px;border-radius:16px;grid-template-columns:.36fr 1.64fr;gap:8px}.vehicle-copy h2{font-size:25px;line-height:1.02;margin-bottom:4px}.vehicle-copy p{font-size:12px}.vehicle-image{justify-content:flex-start;align-items:center;overflow:visible;min-height:150px}.vehicle-image img{max-height:294px;max-width:126%;transform:translateX(-10px) scale(1.24);object-fit:contain}.charger-hero-panel{min-height:178px;border-radius:16px;padding:11px}.charger-mini-image{height:105px;border-radius:14px}.charger-mini-image img{max-width:132px;max-height:104px}.charger-mini-copy b{font-size:14px}.charger-mini-copy span{font-size:11px}
    .vehicle-control-row.mock-row{grid-template-columns:minmax(185px,.55fr) minmax(470px,1.45fr);gap:6px;padding:0 10px 7px;align-items:stretch}.vehicle-metrics-strip.mock-metrics{height:40px;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.vehicle-metrics-strip.mock-metrics .metric-chip{min-height:40px;height:40px;padding:4px 8px;border-radius:12px}.metric-chip span{font-size:7.8px;letter-spacing:.01em}.metric-chip b{font-size:14px;line-height:1.1}.battery-chip i{width:18px;height:6px;right:7px;bottom:8px}.charge-mini-strip.mock-controls{height:40px;gap:6px;grid-template-columns:minmax(155px,1.16fr) minmax(112px,.84fr) minmax(112px,.78fr) minmax(70px,.42fr)}.charge-mini-strip.no-mode{grid-template-columns:minmax(175px,1.35fr) minmax(112px,.78fr) minmax(70px,.42fr)}.charge-mini-strip.no-speed{grid-template-columns:minmax(185px,1.28fr) minmax(112px,.82fr) minmax(70px,.42fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(200px,1fr) minmax(70px,.35fr)}.mini-control,.mini-current-stepper,.mini-power-read{height:40px;min-height:40px;border-radius:12px;padding:0 8px;gap:6px}.mini-control ha-icon,.mini-current-stepper ha-icon,.mini-power-read ha-icon{--mdc-icon-size:17px}.charger-select select,.mode-select select{font-size:12px}.mini-current-stepper strong,.mini-power-read strong{font-size:13px}.round-step{width:25px;height:25px;font-size:17px}.mini-current-stepper small{display:none!important}
    .vehicle-actions{grid-template-columns:minmax(125px,1fr) minmax(122px,.96fr) minmax(105px,.84fr) 1fr 38px 38px;padding:7px 10px 10px;gap:7px}.action{min-height:36px;border-radius:12px;font-size:12.5px}.action ha-icon{--mdc-icon-size:17px}.icon-only{width:38px!important;min-width:38px!important;max-width:38px!important}.inactive-row{min-height:54px;padding:8px 12px;grid-template-columns:74px 1fr auto}.inactive-actions{gap:7px}.inactive-actions .icon-only{width:38px!important}.bottom-grid{gap:12px}.info{min-height:68px;padding:11px 13px;border-radius:16px}.info h3{font-size:14px;margin-bottom:6px}.info p,.info li{font-size:11.5px}.debt-strip{display:none!important}
    @media(max-width:1580px){.page{width:calc(100% - 56px);margin-left:28px}.vehicles{gap:12px}.vehicle-hero-panel{grid-template-columns:.32fr 1.68fr}.vehicle-image img{max-height:284px;transform:translateX(-14px) scale(1.22)}}
    @media(max-width:1380px){.page{width:min(100%,1280px);margin:0 auto}.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:284px;transform:translateX(-8px) scale(1.18)}}
    @media(max-width:860px){.page{width:100%;margin:0;padding:14px}.top-grid,.vehicles,.hero-split-row,.vehicle-control-row.mock-row,.bottom-grid{grid-template-columns:1fr}.charge-mini-strip.mock-controls,.charge-mini-strip.no-mode,.charge-mini-strip.no-speed,.charge-mini-strip.no-speed.no-mode{grid-template-columns:1fr 1fr}.vehicle-actions{grid-template-columns:1fr 1fr 1fr 38px 38px}.action-spacer{display:none}.vehicle-image img{transform:scale(1.08);max-width:100%}}

    /* 2.4.0 Consistency pass — single dashboard visual system.
       Keep this override near the end so the refactor remains safe while we
       converge duplicate legacy rules into reusable components in 2.4.x. */
    :host{--hb-font:inherit;--hb-font-size:13px;--hb-radius-pill:13px;--hb-control-h:38px;--hb-control-pad:0 9px}
    *{font-family:var(--hb-font);box-sizing:border-box}
    .page{width:calc(100vw - 72px);max-width:1640px;margin-left:28px;margin-right:auto;padding:18px 18px 30px;gap:12px}
    .title h1{font-size:36px;line-height:.98;letter-spacing:-.055em}.title p{font-size:13px;font-weight:600}.eyebrow{font-size:11px;letter-spacing:.10em}
    .release-badge{right:22px;top:14px;font-size:12px;padding:8px 12px;border-radius:17px}
    .top-grid{gap:12px}.summary{min-height:84px;padding:13px 18px;grid-template-columns:50px 1fr;gap:14px;border-radius:20px}.summary-icon{width:48px;height:48px;border-radius:15px}.summary h3{font-size:15px;line-height:1.1;margin:0 0 6px}.summary li,.summary li span{font-size:12px;line-height:1.25;font-weight:600}
    .section-title{margin:0 2px -5px}.section-title h2{font-size:18px;line-height:1}.section-title .count{font-size:11px;padding:6px 10px}
    .vehicles{grid-template-columns:repeat(2,minmax(610px,1fr));gap:12px}.vehicle-card{border-radius:20px;overflow:hidden}.status-top-row{padding:8px 10px 5px;gap:6px}.status-row{height:30px;min-height:30px;border-radius:999px;padding:0 8px;display:grid;grid-template-columns:18px 1fr;align-items:center}.status-row ha-icon{--mdc-icon-size:16px}.pill{height:22px;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:650;padding:0 8px;border-radius:999px;line-height:1;white-space:nowrap}
    .hero-split-row{grid-template-columns:minmax(0,2.65fr) minmax(146px,.78fr);gap:8px;padding:4px 10px 6px}.vehicle-hero-panel,.charger-hero-panel{border-radius:16px;border:1px solid var(--hb-line);background:linear-gradient(135deg,#fff,#F8FBFF)}.vehicle-hero-panel{min-height:178px;padding:13px 14px;grid-template-columns:.36fr 1.64fr;gap:6px}.vehicle-copy h2{font-size:25px;line-height:.96;letter-spacing:-.055em;margin:0 0 7px}.vehicle-copy p{font-size:12px;line-height:1.15;font-weight:600}.vehicle-image{justify-content:flex-start;overflow:visible}.vehicle-image img{max-height:286px;max-width:124%;transform:translateX(-18px) scale(1.19);object-fit:contain}.charger-hero-panel{min-height:178px;padding:11px;display:grid;align-content:space-between}.charger-mini-image{height:106px;border-radius:14px}.charger-mini-image img{max-width:132px;max-height:104px}.charger-mini-copy b{font-size:14px;line-height:1.05}.charger-mini-copy span{font-size:11px;font-weight:600}
    .vehicle-control-row.mock-row{grid-template-columns:minmax(178px,.50fr) minmax(500px,1.50fr);gap:6px;padding:0 10px 7px}.vehicle-metrics-strip.mock-metrics{height:38px;grid-template-columns:.95fr .8fr .72fr;gap:0;border:1px solid var(--hb-line);border-radius:12px;overflow:hidden;background:#fff}.vehicle-metrics-strip.mock-metrics .metric-chip{height:38px;min-height:38px;border:0;border-right:1px solid var(--hb-line);border-radius:0;padding:4px 8px;background:#fff}.vehicle-metrics-strip.mock-metrics .metric-chip:last-child{border-right:0}.metric-chip span{font-size:7.5px;line-height:1;text-transform:uppercase;letter-spacing:.045em;color:#64708A;font-weight:650}.metric-chip b{font-size:14px;line-height:1.05;font-weight:650}.battery-chip i{display:none!important}
    .charge-mini-strip.mock-controls{height:38px;gap:6px;grid-template-columns:minmax(190px,1.35fr) minmax(120px,.86fr) minmax(126px,.88fr) minmax(74px,.45fr);align-items:stretch}.charge-mini-strip.no-mode{grid-template-columns:minmax(218px,1.55fr) minmax(126px,.88fr) minmax(74px,.45fr)}.charge-mini-strip.no-speed{grid-template-columns:minmax(245px,1.65fr) minmax(128px,.85fr) minmax(74px,.45fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(270px,1fr) minmax(74px,.32fr)}.mini-control,.mini-current-stepper,.mini-power-read{height:38px;min-height:38px;border-radius:12px;padding:var(--hb-control-pad);gap:6px;background:#fff;border:1px solid var(--hb-line);overflow:hidden}.mini-control ha-icon,.mini-current-stepper ha-icon,.mini-power-read ha-icon{--mdc-icon-size:17px;flex:0 0 auto;color:#1467F5}.charger-select select,.mode-select select{appearance:none;-webkit-appearance:none;border:0;background:transparent;outline:0;width:100%;min-width:0;font-family:var(--hb-font)!important;font-size:12px!important;font-weight:650!important;color:#12213A;line-height:1.1;padding:0 16px 0 0}.charger-select,.mode-select{position:relative}.charger-select:after,.mode-select:after{content:"⌄";position:absolute;right:8px;top:50%;transform:translateY(-52%);font-size:12px;color:#64708A;pointer-events:none}.charger-select option,.mode-select option{font-family:var(--hb-font)!important;font-size:13px!important;color:#12213A}.mini-current-stepper{display:grid;grid-template-columns:minmax(54px,1fr) 24px 24px;justify-items:center;align-items:center}.mini-current-stepper .current-copy{justify-self:start;display:grid;gap:0;line-height:1.0}.mini-current-stepper strong{font-size:13px;white-space:nowrap}.round-step{width:24px;height:24px;border-radius:999px;font-size:17px}.mini-current-stepper.readonly{grid-template-columns:minmax(54px,1fr)}.mini-power-read strong{font-size:13px;white-space:nowrap}
    .vehicle-actions{grid-template-columns:minmax(122px,1fr) minmax(120px,.96fr) minmax(100px,.82fr) 1fr 38px 38px;padding:7px 10px 10px;gap:7px}.action{height:36px;min-height:36px;border-radius:12px;font-size:12.5px;font-weight:650}.action ha-icon{--mdc-icon-size:17px}.icon-only{width:38px!important;min-width:38px!important;max-width:38px!important}.inactive-row{border-radius:18px;min-height:54px;padding:8px 12px;grid-template-columns:74px 1fr auto}.inactive-actions{gap:7px}.inactive-actions .icon-only{width:38px!important}.bottom-grid{gap:12px}.info{min-height:66px;padding:11px 13px;border-radius:16px}.info h3{font-size:14px;line-height:1.1;margin-bottom:5px}.info p,.info li{font-size:11.5px;line-height:1.25}.debt-strip{display:none!important}
    @media(max-width:1500px){.page{width:calc(100vw - 56px);margin-left:20px}.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:286px;transform:translateX(-12px) scale(1.13)}}


    /* 2.4.0 Beta Consolidation — Product-wide visual system
       This block intentionally normalizes dashboard, cards, controls and footer
       using reusable visual primitives. No backend contract changes. */
    :host{
      --hb-font:inherit;
      --hb-ink:#06142D; --hb-muted:#66728B; --hb-blue:#1467F5;
      --hb-line:#E4EBF6; --hb-soft-blue:#EEF5FF;
      --hb-card-radius:22px; --hb-pill-radius:14px;
      --hb-control-h:36px; --hb-action-h:38px;
    }
    *{font-family:var(--hb-font)!important;box-sizing:border-box;user-select:text;-webkit-user-select:text}
    ha-card{background:transparent;border:0;box-shadow:none}
    .page{width:calc(100vw - 50px);max-width:1680px;margin:0 0 0 24px;padding:16px 18px 28px;gap:12px}
    .title{display:grid;gap:4px}.title h1{font-size:35px;line-height:.98;margin:0;letter-spacing:-.055em;font-weight:650}.title p{font-size:13px;line-height:1.35;font-weight:600;color:#1D2B45}.eyebrow{font-size:10.5px;line-height:1;letter-spacing:.11em;margin:0 0 3px;color:var(--hb-blue);font-weight:650}.release-badge{top:12px;right:22px;border-radius:17px;padding:8px 12px;background:rgba(255,255,255,.94)}.release-badge b{font-size:13px;color:#1467F5}.release-badge span{font-size:10.5px;color:#33415C}
    .top-grid{gap:12px;align-items:stretch}.summary{min-height:80px;border-radius:20px;padding:13px 18px;grid-template-columns:50px 1fr;gap:14px}.summary-icon{width:48px;height:48px;border-radius:15px}.summary h3{font-size:15px;line-height:1.05;margin:0 0 7px;font-weight:650}.summary ul{margin:0;padding:0;display:grid;gap:4px}.summary li{grid-template-columns:max-content 1fr;gap:12px;align-items:center}.summary li b,.summary li span{font-size:12px;line-height:1.25;font-weight:600}.summary.recommendation,.summary.attention{display:grid;align-content:center}.summary.recommendation h3,.summary.attention h3{transform:none}
    .section-title{margin:1px 2px -5px;align-items:center}.section-title h2{font-size:18px;line-height:1;margin:0;font-weight:650}.section-title span{font-size:11px;font-weight:650;padding:6px 10px;border-radius:999px;background:#F6F9FD;border:1px solid var(--hb-line);color:#64708A}
    .vehicles{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.vehicle-card{border-radius:20px;overflow:hidden;border:1px solid var(--hb-line);box-shadow:0 18px 44px rgba(15,35,80,.065)}
    .status-top-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:8px 10px 5px}.status-row{height:30px;min-height:30px;border-radius:999px;padding:0 8px;display:grid;grid-template-columns:18px minmax(0,1fr);gap:5px;align-items:center;border:1px solid var(--hb-line);background:#fff;min-width:0}.status-row ha-icon{--mdc-icon-size:15.5px}.status-row span{display:none}.status-row .pill{height:22px;padding:0 8px;border-radius:999px;font-size:9.5px;line-height:1;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .hero-split-row{grid-template-columns:minmax(0,2.62fr) minmax(142px,.78fr);gap:8px;padding:4px 10px 6px}.vehicle-hero-panel,.charger-hero-panel{border-radius:16px;border:1px solid var(--hb-line);background:linear-gradient(135deg,#fff 0%,#F9FCFF 58%,#F1F6FF 100%)}.vehicle-hero-panel{min-height:174px;padding:13px 14px;grid-template-columns:.35fr 1.65fr;gap:6px}.vehicle-copy h2{font-size:25px;line-height:.95;letter-spacing:-.055em;margin:0 0 7px;font-weight:650}.vehicle-copy p{font-size:11.5px;line-height:1.15;font-weight:600;color:#1D2B45}.vehicle-image{justify-content:flex-start;overflow:hidden}.vehicle-image img{max-height:278px;max-width:125%;object-fit:contain;transform:translateX(-16px) scale(1.17);filter:drop-shadow(0 20px 28px rgba(15,35,80,.16))}.charger-hero-panel{min-height:174px;padding:11px;display:grid;align-content:space-between}.charger-mini-image{height:102px;border-radius:14px;background:rgba(255,255,255,.75)}.charger-mini-image img{max-width:126px;max-height:100px;object-fit:contain}.charger-mini-copy b{font-size:14px;line-height:1.05;font-weight:650}.charger-mini-copy span{font-size:11px;font-weight:600;color:#66728B}
    .vehicle-control-row.mock-row{grid-template-columns:minmax(150px,.42fr) minmax(560px,1.58fr);gap:6px;padding:0 10px 7px;align-items:stretch}.vehicle-metrics-strip.mock-metrics{height:36px;grid-template-columns:.9fr .78fr .72fr;border:1px solid var(--hb-line);border-radius:12px;overflow:hidden;background:#fff;min-width:0}.vehicle-metrics-strip.mock-metrics .metric-chip{height:36px;min-height:36px;border:0;border-right:1px solid var(--hb-line);border-radius:0;padding:4px 8px;background:#fff;min-width:0}.vehicle-metrics-strip.mock-metrics .metric-chip:last-child{border-right:0}.metric-chip span{font-size:7.3px;line-height:1;text-transform:uppercase;letter-spacing:.045em;color:#64708A;font-weight:650}.metric-chip b{font-size:13.5px;line-height:1.05;font-weight:650;white-space:nowrap}.battery-chip i{display:none!important}
    .charge-mini-strip.mock-controls{height:36px;gap:6px;grid-template-columns:minmax(210px,1.35fr) minmax(126px,.78fr) minmax(116px,.72fr) minmax(80px,.42fr);align-items:stretch;min-width:0}.charge-mini-strip.no-mode{grid-template-columns:minmax(250px,1.5fr) minmax(116px,.72fr) minmax(80px,.42fr)}.charge-mini-strip.no-speed{grid-template-columns:minmax(290px,1.7fr) minmax(126px,.78fr) minmax(80px,.42fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(310px,1fr) minmax(80px,.32fr)}.mini-control,.mini-current-stepper,.mini-power-read{height:36px;min-height:36px;border-radius:12px;padding:0 9px;gap:6px;background:#fff;border:1px solid var(--hb-line);overflow:hidden;min-width:0;box-shadow:none}.mini-control ha-icon,.mini-current-stepper ha-icon,.mini-power-read ha-icon{--mdc-icon-size:16px;flex:0 0 auto;color:#1467F5}.charger-select select,.mode-select select{appearance:none;-webkit-appearance:none;border:0;background:transparent;outline:0;width:100%;min-width:0;font-family:var(--hb-font)!important;font-size:12px!important;font-weight:650!important;color:#12213A;line-height:1.1;padding:0 16px 0 0}.charger-select,.mode-select{position:relative}.charger-select:after,.mode-select:after{content:"⌄";position:absolute;right:8px;top:50%;transform:translateY(-52%);font-size:12px;color:#64708A;pointer-events:none}.charger-select option,.mode-select option{font-family:var(--hb-font)!important;font-size:13px!important;font-weight:600!important;color:#12213A;background:#fff}.mini-current-stepper{display:grid;grid-template-columns:22px 16px minmax(34px,1fr) 22px;justify-items:center}.mini-current-stepper strong{font-size:13px;white-space:nowrap}.round-step{width:22px;height:22px;border-radius:999px;font-size:16px;border:1px solid var(--hb-line);background:#F7FAFF;color:#1467F5}.mini-power-read strong{font-size:13px;white-space:nowrap}.mini-power-read{justify-content:center}
    .vehicle-actions{grid-template-columns:minmax(132px,1.05fr) minmax(126px,.95fr) minmax(104px,.82fr) 1fr 36px 36px;padding:7px 10px 10px;gap:7px;align-items:stretch}.action{height:36px;min-height:36px;border-radius:12px;font-size:12.3px;font-weight:650;padding:0 10px;border:1px solid var(--hb-line);box-shadow:none}.action ha-icon{--mdc-icon-size:16.5px}.action.primary{background:#1467F5;border-color:#1467F5;color:white}.icon-only{width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important}.icon-only span{display:none!important}.action-spacer{display:block}.presence-toggle{background:#fff;color:#1467F5}.details-action{background:#fff;color:#1467F5}
    .inactive-row{border-radius:18px;min-height:52px;padding:8px 12px;grid-template-columns:74px 1fr auto;border:1px solid var(--hb-line);box-shadow:0 14px 32px rgba(15,35,80,.05)}.inactive-row .inactive-actions{gap:7px}.inactive-row .inactive-actions .action{width:36px!important;min-width:36px!important}.inactive-row .inactive-actions .action span{display:none!important}.inactive-row h3{font-size:14px;margin:0 0 3px}.inactive-row p{font-size:12px;margin:0;color:#66728B;font-weight:600}
    .bottom-grid{gap:12px;grid-template-columns:repeat(3,minmax(0,1fr))}.info{min-height:62px;padding:10px 13px;border-radius:16px}.info h3{font-size:13.5px;line-height:1.1;margin:0 0 5px;font-weight:650}.info h3 ha-icon{--mdc-icon-size:17px}.info p,.info li{font-size:11px;line-height:1.25;font-weight:600;color:#1D2B45}.debt-strip{display:none!important}
    @media(max-width:1520px){.page{width:calc(100vw - 42px);margin-left:18px}.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:282px;transform:translateX(-8px) scale(1.12)}}

    /* R22.10.3 cross-screen consistency overrides */
    .vehicle-actions.clean-actions{display:flex!important;align-items:center!important;gap:7px!important;flex-wrap:nowrap!important;padding:7px 10px 10px!important}
    .vehicle-actions.clean-actions .action:not(.icon-only){flex:0 1 150px!important;min-width:92px!important;max-width:170px!important}
    .vehicle-actions.clean-actions .action-spacer{display:block!important;flex:1 1 auto!important;min-width:8px!important}
    .vehicle-actions.clean-actions .icon-only{flex:0 0 36px!important;width:36px!important;min-width:36px!important;max-width:36px!important}
    .charge-mini-strip.mock-controls{align-items:center!important}
    .mini-current-stepper.compact-current{justify-content:flex-end!important;min-width:128px!important}
    .hero-split-row{margin-bottom:0!important}
    .quick-actions,.quick-action-row{margin-top:-18px!important}

    /* R22.10.3 cross-screen state isolation and stable compact actions */
    .vehicle-actions.clean-actions{display:grid!important;grid-template-columns:minmax(138px,1.1fr) minmax(120px,.95fr) minmax(104px,.85fr) minmax(92px,.75fr) minmax(0,1fr) 38px 38px!important;align-items:center!important;gap:7px!important;flex-wrap:nowrap!important;overflow:hidden!important;}
    .vehicle-actions.clean-actions .action:not(.icon-only){min-width:0!important;max-width:none!important;width:100%!important;overflow:hidden!important;}
    .vehicle-actions.clean-actions .action:not(.icon-only) span{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;}
    .vehicle-actions.clean-actions .action-spacer{display:block!important;min-width:0!important;visibility:hidden!important;}
    .vehicle-actions.clean-actions .presence-toggle.icon-only,.vehicle-actions.clean-actions .details-action.icon-only{justify-self:end!important;grid-row:1!important;width:38px!important;min-width:38px!important;max-width:38px!important;height:38px!important;}
    .vehicle-actions.clean-actions .details-action.icon-only{grid-column:7!important;}
    .vehicle-actions.clean-actions .presence-toggle.icon-only{grid-column:6!important;}
    .charger-mini-image img{object-fit:contain!important;}
    .hero-split-row,.vehicle-control-row.mock-row,.vehicle-actions.clean-actions{min-width:0!important;}
    @media(max-width:900px){.vehicle-actions.clean-actions{grid-template-columns:repeat(2,minmax(0,1fr)) 38px 38px!important;overflow:visible!important}.vehicle-actions.clean-actions .action:not(.icon-only){display:inline-flex!important}.vehicle-actions.clean-actions .presence-toggle.icon-only{grid-column:3!important}.vehicle-actions.clean-actions .details-action.icon-only{grid-column:4!important}}
    .asset-detail .hero,.asset-hero{margin-bottom:8px!important}

    @media(max-width:850px){.page{width:100%;margin:0;padding:12px}.top-grid,.vehicles,.bottom-grid{grid-template-columns:1fr}.hero-split-row{grid-template-columns:1fr}.vehicle-control-row.mock-row{grid-template-columns:1fr}.charge-mini-strip.mock-controls,.charge-mini-strip.no-mode,.charge-mini-strip.no-speed,.charge-mini-strip.no-speed.no-mode{grid-template-columns:1fr 1fr}.status-top-row{grid-template-columns:1fr 1fr}.vehicle-actions{grid-template-columns:1fr 1fr 1fr 36px 36px}.action-spacer{display:none}}


    /* R22.0 Design System Foundation — final cross-screen beta consistency pass.
       Purpose: remove clipping, unify typography, and make dashboard controls behave
       as one component family. This is CSS-only and contract-safe. */
    :host{
      --hi-font:inherit;
      --hi-ink:#06142D; --hi-muted:#66728B; --hi-blue:#1467F5;
      --hi-line:#E4EBF6; --hi-panel:#FFFFFF; --hi-soft:#F7FAFF;
      --hi-radius:18px; --hi-radius-lg:24px;
      --hi-control-h:38px; --hi-gap:8px;
    }
    .page{width:calc(100vw - 56px);max-width:1660px;margin:0 0 0 24px;padding:18px 16px 30px;gap:12px;}
    .release-badge{top:12px;right:18px;border-radius:18px;padding:8px 12px;box-shadow:0 10px 24px rgba(15,35,80,.075)}
    .title{margin:0 0 2px}.title h1{font-size:34px;line-height:1;letter-spacing:-.055em}.title p{font-size:13px;line-height:1.35;color:#1d2b45}.eyebrow{font-size:11px;margin-bottom:7px}
    .top-grid{gap:12px}.summary{min-height:80px;padding:12px 18px;border-radius:20px;align-items:center}.summary h3{font-size:15px;line-height:1.1}.summary li,.summary li span{font-size:12px;line-height:1.25}.summary-icon{width:46px;height:46px;border-radius:15px}.summary-icon ha-icon{--mdc-icon-size:25px}
    .section-title{margin:2px 2px -4px}.section-title h2{font-size:18px}.section-title span,.section-title .count{font-size:11px;height:26px;display:inline-flex;align-items:center}
    .vehicles{grid-template-columns:repeat(2,minmax(640px,1fr));gap:12px;align-items:start}.vehicle-card{border-radius:20px;overflow:hidden;min-width:0}.status-top-row{padding:8px 10px 5px;gap:7px}.status-row{height:29px;min-height:29px;border-radius:999px;grid-template-columns:18px minmax(0,1fr);padding:0 8px;min-width:0}.status-row ha-icon{--mdc-icon-size:16px}.pill{height:21px;min-width:0;font-size:9.3px;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .hero-split-row{grid-template-columns:minmax(0,2.55fr) minmax(150px,.72fr);gap:8px;padding:4px 10px 6px;min-width:0}.vehicle-hero-panel,.charger-hero-panel{border-radius:16px;border:1px solid var(--hi-line);background:linear-gradient(135deg,#fff,#F8FBFF);min-width:0}.vehicle-hero-panel{min-height:168px;padding:12px;grid-template-columns:.34fr 1.66fr}.vehicle-copy h2{font-size:24px;line-height:.95;margin-bottom:6px}.vehicle-copy p{font-size:11.5px;line-height:1.15}.vehicle-image{overflow:hidden;justify-content:center;align-items:center}.vehicle-image img{max-width:105%;max-height:230px;transform:translateX(-4px) scale(1.03);object-fit:contain;filter:drop-shadow(0 18px 26px rgba(15,35,80,.16))}.charger-hero-panel{min-height:168px;padding:10px}.charger-mini-image{height:98px;border-radius:14px}.charger-mini-image img{max-width:122px;max-height:96px}.charger-mini-copy b{font-size:13px}.charger-mini-copy span{font-size:10.5px}
    .vehicle-control-row.mock-row{grid-template-columns:minmax(170px,.42fr) minmax(600px,1.58fr);gap:6px;padding:0 10px 7px;min-width:0}.vehicle-metrics-strip.mock-metrics{height:38px;min-width:0}.metric-chip{min-width:0}.metric-chip span{font-size:7.2px}.metric-chip b{font-size:13px}.charge-mini-strip.mock-controls{height:38px;gap:6px;grid-template-columns:minmax(220px,1.35fr) minmax(128px,.76fr) minmax(112px,.65fr) minmax(78px,.42fr);min-width:0}.charge-mini-strip.no-speed{grid-template-columns:minmax(300px,1.65fr) minmax(128px,.78fr) minmax(78px,.42fr)}.charge-mini-strip.no-mode{grid-template-columns:minmax(260px,1.48fr) minmax(112px,.65fr) minmax(78px,.42fr)}.charge-mini-strip.no-speed.no-mode{grid-template-columns:minmax(330px,1fr) minmax(78px,.28fr)}
    .mini-control,.mini-current-stepper,.mini-power-read{height:38px;min-height:38px;border-radius:12px;padding:0 9px;box-shadow:none;min-width:0}.charger-select select,.mode-select select{font-size:12px!important;font-weight:650!important;line-height:1!important;min-width:0;text-overflow:ellipsis}.mini-current-stepper{grid-template-columns:24px 16px minmax(32px,1fr) 24px}.mini-current-stepper strong,.mini-power-read strong{font-size:12.5px;white-space:nowrap}.round-step{width:24px;height:24px}.mini-power-read{justify-content:center;min-width:68px}
    .vehicle-actions{grid-template-columns:minmax(124px,1fr) minmax(116px,.92fr) minmax(98px,.78fr) minmax(0,1fr) 38px 38px;gap:7px;padding:7px 10px 10px}.action{height:38px;min-height:38px;border-radius:12px;font-size:12.2px}.icon-only{width:38px!important;min-width:38px!important;max-width:38px!important}.action-spacer{min-width:0}.inactive-row{min-height:52px;border-radius:18px;padding:8px 12px}.bottom-grid{gap:12px}.info{min-height:58px;padding:10px 13px}.info h3{font-size:13px}.info p,.info li{font-size:11px}
    /* R22.1 working beta cockpit alignment: one density system, no clipping. */
    .page{width:min(100%,1460px);max-width:1460px;gap:12px;padding:16px 22px 28px;margin:0 auto;overflow:visible}
    .title{padding-left:0}.title h1{font-size:34px;line-height:.94}.title p{font-size:13px}.eyebrow{font-size:11px}
    .top-grid{grid-template-columns:1fr 1fr;gap:12px}.summary{height:76px;min-height:76px;padding:10px 16px;box-sizing:border-box}.summary h3{font-size:15px}.summary li,.summary li span{font-size:12px}.summary-icon{width:44px;height:44px}.summary-icon ha-icon{--mdc-icon-size:24px}
    .section-title{margin:1px 0 -2px}.section-title h2{font-size:18px;line-height:1}.section-title span{height:24px;font-size:11px}
    .vehicles{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.vehicle-card{border-radius:20px;min-width:0;overflow:hidden}.status-top-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:7px 9px 5px}.status-row{height:27px;min-height:27px;border-radius:999px;display:grid;grid-template-columns:16px 1fr;align-items:center;gap:4px;padding:0 7px;min-width:0}.status-row>span{display:none}.status-row ha-icon{--mdc-icon-size:15px}.pill{height:19px;font-size:9px;padding:0 6px;min-width:0;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .hero-split-row{display:grid;grid-template-columns:minmax(0,2.9fr) minmax(132px,.82fr);gap:8px;padding:4px 9px 6px}.vehicle-hero-panel,.charger-hero-panel{border-radius:16px;min-width:0;box-sizing:border-box}.vehicle-hero-panel{position:relative;display:block;min-height:190px;height:190px;padding:14px 14px 10px;overflow:hidden}.vehicle-copy{position:absolute;z-index:2;left:14px;top:14px;max-width:42%;min-width:150px}.vehicle-copy h2{font-size:23px;line-height:.95;margin:0 0 5px;white-space:nowrap;letter-spacing:-.055em}.vehicle-copy p{font-size:11px;line-height:1.15;white-space:normal}.vehicle-image{position:absolute;inset:8px 10px 8px 118px;display:flex;align-items:center;justify-content:center;overflow:hidden}.vehicle-image img{max-width:100%;max-height:174px;object-fit:contain;transform:translateX(-4%) scale(.96);filter:drop-shadow(0 16px 25px rgba(15,35,80,.15))}.charger-hero-panel{min-height:190px;height:190px;padding:10px;display:grid;grid-template-rows:1fr auto;gap:8px}.charger-mini-image{height:auto;min-height:116px;border-radius:14px}.charger-mini-image img{max-width:112px;max-height:104px;object-fit:contain}.charger-mini-copy b{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.charger-mini-copy span{font-size:10.5px}
    .vehicle-control-row.mock-row{display:grid;grid-template-columns:minmax(165px,.42fr) minmax(0,1.58fr);gap:6px;padding:0 9px 6px;align-items:stretch;min-width:0}.vehicle-metrics-strip.mock-metrics{height:36px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-radius:12px;overflow:hidden;min-width:0}.metric-chip{height:36px;min-width:0;padding:4px 7px;border-radius:0;box-shadow:none;border-right:1px solid var(--hi-line)}.metric-chip:last-child{border-right:0}.metric-chip span{font-size:7px;line-height:1;text-transform:uppercase;letter-spacing:.04em}.metric-chip b{font-size:12.5px;line-height:1.05;white-space:nowrap}.battery-chip i{display:none!important}
    .charge-mini-strip.mock-controls{height:36px;display:flex;align-items:stretch;gap:6px;min-width:0;overflow:hidden}.mini-control,.mini-current-stepper,.mini-power-read{height:36px;min-height:36px;border-radius:12px;padding:0 8px;box-sizing:border-box;min-width:0;flex:0 1 auto}.charger-select{flex:1 1 210px;min-width:160px}.mode-select{flex:0 1 126px;min-width:108px}.mini-current-stepper{flex:0 0 112px;display:grid;grid-template-columns:22px 14px minmax(31px,1fr) 22px;gap:4px}.mini-power-read{flex:0 0 72px;justify-content:center}.charge-mini-strip.no-speed .mini-power-read{flex:0 0 82px}.charger-select select,.mode-select select{font-size:12px!important;font-weight:600!important;line-height:1!important;color:var(--hi-ink);height:100%;width:100%;border:0;background:transparent;min-width:0;outline:0}.mini-control ha-icon,.mini-power-read ha-icon{--mdc-icon-size:16px;flex:0 0 16px}.mini-current-stepper strong,.mini-power-read strong{font-size:12px;line-height:1;white-space:nowrap}.round-step{width:22px;height:22px;min-width:22px;border-radius:999px;font-size:15px}
    .vehicle-actions{display:grid;grid-template-columns:minmax(118px,1.05fr) minmax(112px,.95fr) minmax(92px,.78fr) minmax(0,1fr) 36px 36px;gap:7px;padding:7px 9px 9px;align-items:center}.action{height:36px;min-height:36px;border-radius:12px;font-size:12px;font-weight:600;line-height:1;gap:7px;padding:0 11px;box-sizing:border-box;white-space:nowrap;overflow:hidden}.action ha-icon{--mdc-icon-size:16px}.icon-only{width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important;display:inline-flex!important;justify-content:center!important}.icon-only span{display:none!important}.action-spacer{min-width:0}
    .inactive-row{min-height:52px;border-radius:18px;padding:8px 12px}.inactive-state{width:62px;height:42px;font-size:10px}.inactive-copy h3{font-size:13px}.inactive-copy p{font-size:11px}.inactive-actions{gap:7px}.inactive-actions .action:not(.icon-only){width:36px!important;min-width:36px!important;max-width:36px!important;padding:0!important}.inactive-actions .action:not(.icon-only) span{display:none!important}
    .bottom-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.info{min-height:58px;padding:10px 13px;border-radius:16px}.info h3{font-size:13px}.info p,.info li{font-size:11px}
    @media(max-width:1280px){.page{width:100%;padding:14px}.vehicles{grid-template-columns:1fr}.vehicle-image img{max-height:176px}.top-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:880px){.page{width:100%;margin:0;padding:12px}.top-grid,.vehicles,.hero-split-row,.vehicle-control-row.mock-row,.bottom-grid{grid-template-columns:1fr}.charge-mini-strip.mock-controls{flex-wrap:wrap;height:auto;overflow:visible}.mini-control,.mini-current-stepper,.mini-power-read{height:36px}.vehicle-actions{grid-template-columns:1fr 1fr 1fr 36px 36px}.action-spacer{display:none}.status-top-row{grid-template-columns:1fr 1fr}.vehicle-image{position:relative;inset:auto;height:150px}.vehicle-copy{position:relative;left:auto;top:auto;max-width:100%}.vehicle-hero-panel{height:auto;min-height:0}}

    /* R22.2 font and interaction polish: sharper, less heavy typography and safer command fallback. */
    :host{--hi-font:inherit;--hb-font:var(--hi-font);font-family:var(--hi-font)!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
    .title h1,h1{font-weight:600!important;letter-spacing:-.025em!important;}
    .vehicle-copy h2,h2{font-weight:600!important;letter-spacing:-.02em!important;}
    h3,.summary h3,.section-title h2,.charger-mini-copy b{font-weight:600!important;}
    .action,.mini-control select,.charger-select select,.mode-select select,.metric-chip b,.mini-current-stepper strong,.mini-power-read strong,.inactive-copy h3{font-weight:500!important;}
    .status-row .pill{font-weight:500!important;}
    .metric-chip span,.inactive-copy p,.charger-mini-copy span,.summary li b,.summary li span,.info p,.info li{font-weight:400!important;}
    .action:disabled{opacity:.45;filter:none;}


    /* R22.12.11.24 Energy look & feel alignment — CSS/token-level polish only. Card layout and contract behavior stay frozen. */
    :host{
      --hi-surface:var(--card-background-color);
      --hi-surface-soft:rgba(14,35,72,.025);
      --hi-surface-chip:rgba(14,35,72,.055);
      --hi-line:rgba(14,35,72,.10);
      --hi-line-soft:rgba(14,35,72,.075);
      --hi-muted:var(--secondary-text-color);
      --hi-ink:var(--primary-text-color);
      --hi-radius-card:18px;
      --hi-radius-inner:14px;
      --hi-radius-control:12px;
      --hi-shadow-soft:none;
      font-family:inherit;
    }
    .page{background:transparent!important;}
    .summary,.vehicle-card,.inactive-row,.info,.vehicle-hero-panel,.charger-hero-panel,.metric-chip,.mini-control,.mini-current-stepper,.mini-power-read,.status-row{
      background:var(--hi-surface)!important;
      border-color:var(--hi-line)!important;
      box-shadow:none!important;
    }
    .summary,.vehicle-card,.info{border-radius:var(--hi-radius-card)!important;}
    .vehicle-hero-panel,.charger-hero-panel,.inactive-row{border-radius:var(--hi-radius-card)!important;}
    .metric-chip,.mini-control,.mini-current-stepper,.mini-power-read,.status-row{border-radius:var(--hi-radius-control)!important;}
    .summary.attention,.summary.recommendation,.vehicle-hero-panel,.charger-hero-panel{background:linear-gradient(135deg,var(--hi-surface),var(--hi-surface-soft))!important;}
    .title h1{font-size:32px!important;font-weight:600!important;letter-spacing:-.025em!important;color:var(--hi-ink)!important;}
    .title p,.vehicle-copy p,.info p,.info li,.summary li,.inactive-copy p,.charger-mini-copy span,.relationship-lines{color:var(--hi-muted)!important;font-weight:400!important;}
    .eyebrow,.metric-chip span{color:var(--hi-muted)!important;font-weight:500!important;}
    .section-title h2,.summary h3,.info h3,.vehicle-copy h2,.charger-mini-copy b,.inactive-copy h3{font-weight:600!important;color:var(--hi-ink)!important;}
    .metric-chip b,.mini-control strong,.mini-current-stepper strong,.mini-power-read strong{font-weight:600!important;color:var(--hi-ink)!important;}
    .pill{font-weight:500!important;border:1px solid transparent!important;}
    .pill.ok{background:rgba(22,163,74,.10)!important;color:#166534!important;border-color:rgba(22,163,74,.12)!important;}
    .pill.warn{background:rgba(217,119,6,.11)!important;color:#92400E!important;border-color:rgba(217,119,6,.14)!important;}
    .pill.bad{background:rgba(220,38,38,.10)!important;color:#991B1B!important;border-color:rgba(220,38,38,.14)!important;}
    .pill.muted{background:var(--hi-surface-chip)!important;color:var(--hi-muted)!important;border-color:var(--hi-line-soft)!important;}
    .action{
      background:var(--hi-surface)!important;
      border-color:var(--hi-line)!important;
      border-radius:var(--hi-radius-control)!important;
      box-shadow:none!important;
      font-weight:500!important;
      color:var(--hi-ink)!important;
    }
    .action.primary-charge{background:rgba(20,103,245,.10)!important;border-color:rgba(20,103,245,.18)!important;color:#164AA8!important;}
    .action.primary-charge ha-icon{color:#1467F5!important;}
    .action.sent{background:rgba(20,103,245,.08)!important;border-color:rgba(20,103,245,.14)!important;color:#164AA8!important;}
    .action.busy{background:rgba(217,119,6,.08)!important;border-color:rgba(217,119,6,.14)!important;}
    .action.failed{background:rgba(220,38,38,.08)!important;border-color:rgba(220,38,38,.14)!important;color:#991B1B!important;}
    .vehicle-image,.charger-mini-image,.inactive-image{background:radial-gradient(circle at center,rgba(14,35,72,.045),transparent 62%)!important;}
    .section-title span{background:var(--hi-surface-chip)!important;border-color:var(--hi-line-soft)!important;color:var(--hi-muted)!important;font-weight:500!important;}
    .empty{background:var(--hi-surface)!important;border-color:var(--hi-line)!important;color:var(--hi-muted)!important;font-weight:400!important;}



    /* R22.6.2 tablet + hero stability pass
       - tablet keeps two columns longer
       - image cards stop blinking by preventing layout-driven reload pressure
       - attention cards hide positive/clear rows
       - vehicle hero becomes less boxed on tablet and phone-prep remains controlled */
    .summary.attention li.clear{display:none!important;}
    .summary.attention ul:empty:after{content:"No urgent mobility attention.";display:block;color:#34405A;font-size:13px;font-weight:400;}
    .vehicle-image img,.charger-mini-image img,.charger-visual img{will-change:auto;backface-visibility:hidden;}
    .vehicle-card{contain:layout paint style;}
    .vehicle-image{overflow:visible!important;}

    @media (min-width: 900px) and (max-width: 1320px){
      .page{width:100%!important;margin:0!important;padding:18px 18px 34px!important;gap:14px!important;}
      .top-grid{grid-template-columns:1fr 1fr!important;gap:12px!important;}
      .summary{min-height:92px!important;padding:14px 16px!important;grid-template-columns:46px 1fr!important;gap:12px!important;}
      .summary-icon{width:42px!important;height:42px!important;border-radius:14px!important;}
      .summary-icon ha-icon{--mdc-icon-size:24px!important;}
      .summary h3{font-size:15px!important;margin:0 0 5px!important;}
      .summary li{font-size:12px!important;padding:5px 0!important;gap:8px!important;}
      .vehicles{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;}
      .vehicle-card{border-radius:20px!important;min-width:0!important;}
      .status-top-row{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important;padding:8px 8px 5px!important;}
      .status-row{min-height:28px!important;height:28px!important;padding:0 6px!important;border-radius:999px!important;gap:3px!important;}
      .status-row ha-icon{--mdc-icon-size:14px!important;}
      .pill{font-size:8.8px!important;min-width:0!important;padding:0 5px!important;height:18px!important;}
      .hero-split-row{grid-template-columns:minmax(0,2.65fr) minmax(112px,.72fr)!important;gap:7px!important;padding:4px 8px 6px!important;}
      .vehicle-hero-panel{position:relative!important;display:block!important;height:178px!important;min-height:178px!important;padding:12px!important;overflow:hidden!important;border-radius:16px!important;}
      .vehicle-copy{position:absolute!important;left:12px!important;top:12px!important;z-index:2!important;max-width:45%!important;min-width:120px!important;}
      .vehicle-copy h2{font-size:21px!important;line-height:.95!important;white-space:nowrap!important;margin:0 0 4px!important;}
      .vehicle-copy p{font-size:10.5px!important;line-height:1.1!important;}
      .vehicle-image{position:absolute!important;inset:12px 10px 8px 110px!important;display:flex!important;align-items:center!important;justify-content:center!important;min-height:0!important;background:radial-gradient(circle at center,rgba(20,103,245,.08),transparent 60%)!important;}
      .vehicle-image img{max-height:148px!important;max-width:112%!important;transform:translateX(-4%) scale(1.02)!important;object-fit:contain!important;}
      .charger-hero-panel{height:178px!important;min-height:178px!important;padding:9px!important;border-radius:16px!important;grid-template-rows:auto 1fr!important;}
      .charger-mini-image{height:108px!important;min-height:108px!important;border-radius:14px!important;}
      .charger-mini-image img{max-width:96px!important;max-height:94px!important;}
      .charger-mini-copy b{font-size:12px!important;}
      .charger-mini-copy span{font-size:10px!important;}
      .vehicle-control-row.mock-row{grid-template-columns:1fr!important;gap:6px!important;padding:0 8px 7px!important;}
      .vehicle-metrics-strip.mock-metrics{height:34px!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;}
      .vehicle-metrics-strip.mock-metrics .metric-chip{min-height:34px!important;padding:4px 8px!important;}
      .metric-chip span{font-size:7.6px!important;}
      .metric-chip b{font-size:12px!important;}
      .charge-mini-strip.mock-controls{height:34px!important;grid-template-columns:minmax(170px,1.4fr) minmax(96px,.62fr) minmax(74px,.42fr)!important;gap:5px!important;}
      .charge-mini-strip.mock-controls.no-speed{grid-template-columns:minmax(210px,1.5fr) minmax(108px,.8fr) minmax(74px,.42fr)!important;}
      .mini-control,.mini-current-stepper,.mini-power-read{height:34px!important;min-height:34px!important;border-radius:11px!important;padding:0 7px!important;gap:5px!important;}
      .charger-select select,.mode-select select{font-size:11px!important;font-weight:500!important;}
      .mini-current-stepper{grid-template-columns:20px 14px minmax(28px,1fr) 20px!important;}
      .round-step{width:20px!important;height:20px!important;font-size:14px!important;}
      .mini-current-stepper strong,.mini-power-read strong{font-size:11.5px!important;}
      .vehicle-actions{grid-template-columns:minmax(118px,1fr) minmax(108px,.9fr) minmax(82px,.72fr) 1fr 34px 34px!important;gap:6px!important;padding:6px 8px 9px!important;}
      .action{min-height:34px!important;height:34px!important;font-size:11.5px!important;border-radius:11px!important;}
      .icon-only{width:34px!important;min-width:34px!important;max-width:34px!important;}
      .bottom-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important;}
      .info{min-height:58px!important;padding:10px 12px!important;}
    }

    @media (max-width: 899px){
      .page{width:100%!important;margin:0!important;padding:12px 12px 28px!important;gap:12px!important;}
      .top-grid{grid-template-columns:1fr!important;gap:10px!important;}
      .summary{min-height:auto!important;padding:14px!important;grid-template-columns:44px 1fr!important;gap:12px!important;}
      .vehicles{grid-template-columns:1fr!important;gap:12px!important;}
      .hero-split-row{grid-template-columns:1fr!important;gap:9px!important;}
      .vehicle-hero-panel{height:auto!important;min-height:230px!important;display:block!important;position:relative!important;padding:14px!important;}
      .vehicle-copy{position:relative!important;left:auto!important;top:auto!important;max-width:100%!important;z-index:2!important;}
      .vehicle-copy h2{white-space:nowrap!important;font-size:25px!important;}
      .vehicle-image{position:relative!important;inset:auto!important;height:160px!important;margin-top:8px!important;}
      .vehicle-image img{max-height:150px!important;transform:none!important;}
      .charger-hero-panel{height:auto!important;min-height:150px!important;}
      .vehicle-control-row.mock-row{grid-template-columns:1fr!important;}
      .vehicle-metrics-strip.mock-metrics{height:42px!important;}
      .charge-mini-strip.mock-controls,.charge-mini-strip.mock-controls.no-speed{grid-template-columns:1fr 1fr!important;height:auto!important;}
      .mini-control,.mini-current-stepper,.mini-power-read{height:38px!important;min-height:38px!important;}
      .vehicle-actions{grid-template-columns:1fr 1fr 1fr 36px 36px!important;}
      .bottom-grid{grid-template-columns:1fr!important;}
    }

    @media (max-width: 560px){
      .status-top-row{grid-template-columns:1fr 1fr!important;}
      .vehicle-metrics-strip.mock-metrics{grid-template-columns:repeat(3,minmax(0,1fr))!important;}
      .charge-mini-strip.mock-controls,.charge-mini-strip.mock-controls.no-speed{grid-template-columns:1fr!important;}
      .vehicle-actions{grid-template-columns:1fr 1fr 36px 36px!important;}
      .vehicle-actions .action:nth-child(3){grid-column:1 / 3;}
    }


    /* R22.10.3 hard visible charge-speed + bottom alignment gate
       This block is inside the dashboard styles() return, not in the missing-card branch. */
    .vehicle-control-row.mock-row{
      display:grid!important;
      grid-template-columns:minmax(176px,.44fr) minmax(220px,1fr) minmax(126px,.48fr) minmax(92px,.34fr)!important;
      gap:6px!important;
      align-items:stretch!important;
      padding:0 12px 8px!important;
      min-width:0!important;
      overflow:visible!important;
    }
    .vehicle-control-row.mock-row>.vehicle-metrics-strip.mock-metrics{
      grid-column:1!important;
      min-width:0!important;
      height:38px!important;
      display:grid!important;
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
    }
    .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{
      display:contents!important;
    }
    .vehicle-control-row.mock-row .charger-select{
      grid-column:2!important;
      min-width:0!important;
      width:100%!important;
      height:38px!important;
      min-height:38px!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current{
      grid-column:3!important;
      display:grid!important;
      grid-template-columns:minmax(42px,1fr) 24px 24px!important;
      gap:5px!important;
      align-items:center!important;
      min-width:0!important;
      width:100%!important;
      height:38px!important;
      min-height:38px!important;
      padding:0 7px!important;
      overflow:hidden!important;
      background:#fff!important;
      border:1px solid var(--hb-line)!important;
      border-radius:12px!important;
      box-sizing:border-box!important;
      opacity:1!important;
      visibility:visible!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current.readonly{
      grid-template-columns:minmax(56px,1fr)!important;
    }
    .vehicle-control-row.mock-row .mini-power-read.actual-power-read{
      grid-column:4!important;
      display:flex!important;
      align-items:center!important;
      min-width:0!important;
      width:100%!important;
      height:38px!important;
      min-height:38px!important;
      padding:0 8px!important;
      background:#fff!important;
      border:1px solid var(--hb-line)!important;
      border-radius:12px!important;
      box-sizing:border-box!important;
      overflow:hidden!important;
    }
    .vehicle-control-row.mock-row .mini-power-read.actual-power-read .power-copy{
      min-width:0!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      line-height:1.05!important;
      overflow:hidden!important;
    }
    .vehicle-control-row.mock-row .mini-power-read.actual-power-read small{
      display:block!important;
      font-size:8px!important;
      color:#64708A!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      font-weight:500!important;
    }
    .vehicle-control-row.mock-row .mini-power-read.actual-power-read strong{
      display:block!important;
      font-size:13px!important;
      color:#12213A!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      font-weight:500!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy{
      min-width:0!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      overflow:hidden!important;
      line-height:1.05!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy small{
      display:block!important;
      font-size:8px!important;
      color:#64708A!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      font-weight:500!important;
      letter-spacing:0!important;
      text-transform:none!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy strong{
      display:block!important;
      font-size:13px!important;
      color:#12213A!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      font-weight:500!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .round-step{
      width:24px!important;
      min-width:24px!important;
      height:24px!important;
      border-radius:999px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      padding:0!important;
      font-size:16px!important;
      line-height:1!important;
      background:#fff!important;
      color:#1467F5!important;
      border:1px solid var(--hb-line)!important;
      box-shadow:none!important;
    }
    .vehicle-actions.clean-actions{
      display:grid!important;
      grid-template-columns:minmax(132px,1.05fr) minmax(118px,.95fr) minmax(104px,.82fr) minmax(92px,.75fr) minmax(0,1fr) 42px 42px!important;
      gap:8px!important;
      align-items:center!important;
      padding:8px 12px 12px!important;
    }
    .vehicle-actions.clean-actions .action-spacer{display:block!important;min-width:0!important;visibility:hidden!important;}
    .vehicle-actions.clean-actions .presence-toggle.icon-only,
    .vehicle-actions.clean-actions .details-action.icon-only{
      justify-self:end!important;
      width:42px!important;
      min-width:42px!important;
      max-width:42px!important;
      background:#fff!important;
      color:#1467F5!important;
      border-color:var(--hb-line)!important;
    }
    .vehicle-actions.clean-actions .presence-toggle.icon-only ha-icon,
    .vehicle-actions.clean-actions .details-action.icon-only ha-icon{color:#1467F5!important;}
    .charger-hero-panel{position:relative!important;}
    .charger-hero-panel .mini-detail-button.charger-detail-link{
      position:absolute!important;
      right:10px!important;
      bottom:10px!important;
      width:30px!important;
      height:30px!important;
      min-width:30px!important;
      border-radius:999px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      padding:0!important;
      background:#fff!important;
      border:1px solid var(--hb-line)!important;
      color:#1467F5!important;
      box-shadow:0 8px 18px rgba(15,35,80,.06)!important;
      z-index:2!important;
      cursor:pointer!important;
    }
    .charger-hero-panel .mini-detail-button.charger-detail-link ha-icon{--mdc-icon-size:18px;color:#1467F5!important;}
    .vehicle-hero-panel{position:relative!important;}
    .vehicle-hero-panel .mini-detail-button.vehicle-detail-link{
      position:absolute!important;
      right:10px!important;
      bottom:10px!important;
      width:30px!important;
      height:30px!important;
      min-width:30px!important;
      border-radius:999px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      padding:0!important;
      background:#fff!important;
      border:1px solid var(--hb-line)!important;
      color:#1467F5!important;
      box-shadow:0 8px 18px rgba(15,35,80,.06)!important;
      z-index:2!important;
      cursor:pointer!important;
    }
    .vehicle-hero-panel .mini-detail-button.vehicle-detail-link ha-icon{--mdc-icon-size:18px;color:#1467F5!important;}
    .vehicle-activity-inline{margin:6px 0 0!important;color:#34405A!important;font-size:12px!important;font-weight:500!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}
    .vehicle-lifecycle-chip{
      align-self:center!important;
      justify-self:start!important;
      min-width:0!important;
      color:#17233B!important;
      font-size:13px!important;
      font-weight:500!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      padding:0 4px!important;
    }
    .vehicle-lifecycle-chip.empty{visibility:hidden!important;}

    @media (max-width: 1320px){
      .vehicle-control-row.mock-row{grid-template-columns:1fr!important;}
      .vehicle-control-row.mock-row>.vehicle-metrics-strip.mock-metrics{grid-column:1!important;}
      .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{display:grid!important;grid-template-columns:minmax(180px,1fr) minmax(108px,.50fr) minmax(124px,.52fr)!important;gap:6px!important;height:38px!important;}
      .vehicle-control-row.mock-row .charger-select{grid-column:1!important;}
      .vehicle-control-row.mock-row .mode-select{grid-column:2!important;}
      .vehicle-control-row.mock-row .mini-current-stepper.compact-current{grid-column:3!important;}
    }
    @media (max-width: 899px){
      .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{height:auto!important;grid-template-columns:1fr 1fr!important;}
      .vehicle-control-row.mock-row .charger-select{grid-column:1 / -1!important;}
      .vehicle-control-row.mock-row .mode-select{grid-column:1!important;}
      .vehicle-control-row.mock-row .mini-current-stepper.compact-current{grid-column:2!important;}
      .vehicle-actions.clean-actions{grid-template-columns:1fr 1fr 1fr minmax(0,1fr) 36px 36px!important;}
    }


    /* R22.10.3 stabilization: tighter vehicle charge power alignment */
    .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{
      align-items:stretch!important;
    }
    .vehicle-control-row.mock-row .charger-select,
    .vehicle-control-row.mock-row .mode-select,
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current{
      height:40px!important;
      min-height:40px!important;
      align-self:stretch!important;
      box-sizing:border-box!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current{
      grid-template-columns:minmax(66px,1fr) 26px 26px!important;
      gap:4px!important;
      padding:0 6px!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current.readonly{
      grid-template-columns:minmax(78px,1fr)!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy{
      text-align:left!important;
      padding-top:1px!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .round-step{
      width:26px!important;min-width:26px!important;height:26px!important;
    }

    /* R22.12.11.24 Energy typography alignment — no layout or contract changes. */
    :host{font-family:inherit!important;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
    *{font-family:inherit!important;}
    .title h1{font-size:34px!important;line-height:1.08!important;font-weight:650!important;letter-spacing:-.025em!important;}
    .title p{font-size:13px!important;line-height:1.4!important;font-weight:400!important;color:var(--hb-muted,#66728B)!important;}
    .eyebrow{font-size:11px!important;font-weight:650!important;letter-spacing:.10em!important;}
    .section-title h2{font-size:18px!important;line-height:1.25!important;font-weight:600!important;letter-spacing:-.01em!important;}
    .section-title .count{font-size:11px!important;font-weight:500!important;}
    .summary h3,.info h3{font-size:14px!important;font-weight:600!important;line-height:1.2!important;}
    .summary li,.summary li span,.info p,.info li{font-size:11.5px!important;line-height:1.35!important;font-weight:400!important;color:var(--hb-muted,#66728B)!important;}
    .vehicle-copy h2{font-size:23px!important;line-height:1.08!important;font-weight:650!important;letter-spacing:-.025em!important;}
    .vehicle-copy p,.charger-mini-copy span{font-size:12px!important;font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
    .charger-mini-copy b{font-size:13px!important;font-weight:600!important;line-height:1.15!important;}
    .metric-chip span{font-size:7.8px!important;font-weight:600!important;letter-spacing:.035em!important;color:var(--hb-muted,#66728B)!important;}
    .metric-chip b{font-size:14px!important;font-weight:650!important;line-height:1.1!important;}
    .pill{font-weight:500!important;}
    .status-strip .metric span{font-size:11px!important;font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
    .status-strip .metric b{font-size:15px!important;font-weight:650!important;line-height:1.2!important;}
    .mini-control small,.mini-current-stepper small,.mini-power-read small{font-size:9.5px!important;font-weight:500!important;color:var(--hb-muted,#66728B)!important;}
    .mini-current-stepper strong,.mini-power-read strong{font-size:13px!important;font-weight:600!important;}
    .charger-select select,.mode-select select{font-size:12px!important;font-weight:600!important;}
    .action{font-size:12.5px!important;font-weight:600!important;}
    .hi-release-footer{font-size:11px!important;font-weight:400!important;line-height:1.35!important;color:var(--secondary-text-color,#6B7280)!important;}
    .hi-release-footer .hi-release-health{font-weight:600!important;}


    /* rc.7 canonical Overview — approved Mobility mock, contract-owned data/actions only */
    .page{width:min(100%,1560px)!important;max-width:1560px!important;margin:0 auto!important;padding:18px 26px 30px!important;gap:12px!important}
    .ov-hero{position:relative;overflow:hidden;border:1px solid #DFE8F4;border-radius:20px;background:linear-gradient(110deg,#FFFFFF 0%,#FAFCFF 56%,#EEF5FD 100%);min-height:230px;box-shadow:0 14px 34px rgba(15,35,80,.055);display:grid;grid-template-rows:1fr auto}
    .ov-hero-copy{position:relative;z-index:2;display:flex;align-items:center;gap:18px;padding:24px 28px 12px;max-width:58%}
    .ov-hero-icon{width:58px;height:58px;border:1px solid #DDE8F6;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;color:#0B65EA;box-shadow:0 8px 18px rgba(15,35,80,.04)}
    .ov-hero-icon ha-icon{--mdc-icon-size:31px}.ov-kicker{display:block;color:#315A88;font-size:11px;font-weight:700;letter-spacing:.08em}.ov-hero h1{margin:3px 0 2px;font-size:38px;line-height:1;font-weight:720;letter-spacing:-.035em;color:#0B1830}.ov-hero h2{margin:0 0 5px;font-size:20px;font-weight:590;color:#183C6D}.ov-hero p{margin:0;color:#6B7B93;font-size:12.5px;font-weight:450}
    .ov-hero-time{position:absolute;z-index:3;right:24px;top:18px;display:grid;text-align:right;color:#294A73;font-size:12px}.ov-hero-time b{font-weight:600}.ov-hero-time span{margin-top:2px;font-weight:500}
    .ov-hero-vehicle{position:absolute;right:56px;top:20px;width:42%;height:150px;display:flex;align-items:center;justify-content:flex-end;overflow:visible;pointer-events:none}.ov-hero-vehicle:before{content:"";position:absolute;inset:10px 0 -10px 20%;background:radial-gradient(circle at center,rgba(76,139,213,.16),transparent 63%)}.ov-hero-vehicle img{position:relative;z-index:1;max-width:100%;max-height:170px;object-fit:contain;filter:drop-shadow(0 18px 28px rgba(15,35,80,.18))}
    .ov-kpis{position:relative;z-index:3;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:0 12px 12px}.ov-kpi{min-height:72px;border:1px solid #E1E9F3;border-radius:14px;background:rgba(255,255,255,.96);display:grid;grid-template-columns:38px 1fr;gap:10px;align-items:center;padding:10px 14px}.ov-kpi>ha-icon{--mdc-icon-size:24px;color:#0B65EA}.ov-kpi>div{display:grid;grid-template-columns:1fr auto;column-gap:8px;align-items:baseline;min-width:0}.ov-kpi span{font-size:11px;color:#48617F;font-weight:550}.ov-kpi b{font-size:22px;color:#0B1830;font-weight:700;white-space:nowrap}.ov-kpi small{grid-column:1/-1;margin-top:2px;color:#718199;font-size:10px;font-weight:500}
    .ov-quickbar{border:1px solid #DFE8F3;border-radius:17px;background:#fff;min-height:62px;display:flex;align-items:center;gap:10px;padding:9px 14px;box-shadow:0 10px 26px rgba(15,35,80,.035)}.ov-quick-title{text-transform:uppercase;color:#536B89;font-size:10px;font-weight:700;letter-spacing:.06em;margin-right:6px}.ov-nav-action{height:40px;border:1px solid #DDE7F3;border-radius:12px;background:#fff;color:#173251;padding:0 14px;display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:600;cursor:pointer}.ov-nav-action ha-icon{--mdc-icon-size:17px;color:#0B65EA}.ov-nav-action.primary{background:#0B65EA;color:#fff;border-color:#0B65EA}.ov-nav-action.primary ha-icon{color:#fff}.ov-nav-action.ov-more{margin-left:auto}
    .ov-two-col{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}.ov-panel{border:1px solid #E0E8F2;border-radius:18px;background:#fff;box-shadow:0 12px 30px rgba(15,35,80,.045);padding:12px;min-width:0}.ov-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:2px 2px 9px}.ov-panel-head h2{margin:0;font-size:18px;line-height:1.15;font-weight:650;color:#0E1C33}.ov-panel-head p{margin:2px 0 0;font-size:10.5px;color:#718199}.ov-panel-head button{height:32px;border:1px solid #DDE7F2;background:#fff;border-radius:10px;color:#244B79;font-size:10.5px;font-weight:600;display:flex;align-items:center;gap:3px;padding:0 9px;cursor:pointer}.ov-panel-head button ha-icon{--mdc-icon-size:15px}
    .ov-vehicle-list,.ov-charger-list,.ov-activity-list{display:grid;gap:7px}.ov-vehicle-row{display:grid;grid-template-columns:minmax(170px,1.4fr) minmax(88px,.7fr) minmax(82px,.62fr) minmax(100px,.72fr) minmax(105px,.8fr);grid-template-areas:"main security comfort maintenance charging" "assign assign assign actions actions";gap:7px;align-items:stretch;border:1px solid #E7EDF5;border-radius:13px;padding:7px;background:#FCFDFF}.ov-vehicle-main{grid-area:main;border:0;background:transparent;display:grid;grid-template-columns:64px minmax(0,1fr);gap:9px;align-items:center;text-align:left;padding:0;cursor:pointer;min-width:0}.ov-vehicle-image{height:48px;display:flex;align-items:center;justify-content:center}.ov-vehicle-image img{max-width:72px;max-height:48px;object-fit:contain;filter:drop-shadow(0 6px 8px rgba(15,35,80,.14))}.ov-vehicle-image ha-icon{--mdc-icon-size:34px;color:#8799B4}.ov-vehicle-copy{min-width:0}.ov-vehicle-copy b{display:block;color:#12213A;font-size:12.5px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ov-vehicle-copy small{display:block;margin-top:2px;color:#60728C;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .ov-signal{border-left:1px solid #E8EEF6;display:grid;grid-template-columns:17px minmax(0,1fr);grid-template-rows:auto auto;column-gap:5px;align-content:center;min-width:0;padding-left:8px}.ov-signal ha-icon{grid-row:1/3;align-self:center;--mdc-icon-size:15px;color:#476383}.ov-signal span{font-size:8.5px;color:#708098}.ov-signal b{font-size:10.5px;color:#203651;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ov-signal.warn b{color:#A85B00}.ov-signal.bad b{color:#B42318}
    .ov-charging-state{grid-area:charging;border-left:1px solid #E8EEF6;display:flex;align-items:center;gap:5px;padding-left:8px;color:#294767;min-width:0}.ov-charging-state ha-icon{--mdc-icon-size:15px;color:#0B65EA}.ov-charging-state span{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ov-assignment{grid-area:assign;min-width:0}.ov-assignment .mini-control{height:36px!important;min-height:36px!important;border-radius:10px!important}.ov-row-actions{grid-area:actions;display:flex;gap:6px;justify-content:flex-end;align-items:center}.ov-row-actions .action{height:36px!important;min-height:36px!important;font-size:10.5px!important;padding:0 9px!important;white-space:nowrap}.ov-row-actions .ov-detail{width:36px!important;min-width:36px!important;max-width:36px!important}
    .ov-charger-row{display:grid;grid-template-columns:48px minmax(0,1fr) auto 34px;gap:9px;align-items:center;border:1px solid #E7EDF5;border-radius:12px;padding:6px 7px}.ov-charger-image{height:44px;display:flex;align-items:center;justify-content:center}.ov-charger-image img{max-height:43px;max-width:38px;object-fit:contain}.ov-charger-image ha-icon{display:none;--mdc-icon-size:26px;color:#8799B4}.ov-charger-copy{min-width:0}.ov-charger-copy b{display:block;font-size:11.5px;color:#172B47;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ov-charger-copy small{display:flex;align-items:center;gap:5px;margin-top:2px;font-size:9.5px;color:#5F728D}.ov-dot{width:7px;height:7px;border-radius:99px;background:#16B86B}.ov-charger-power{text-align:right;display:grid}.ov-charger-power b{font-size:11px;color:#172B47}.ov-charger-power small{font-size:8.5px;color:#78879B}.ov-charger-row .ov-detail{width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;padding:0!important}
    .ov-small-panel{min-height:118px}.ov-activity-row,.ov-next-row{border:1px solid #E7EDF5;border-radius:12px;min-height:52px;display:flex;align-items:center;gap:9px;padding:7px 10px}.ov-activity-row>ha-icon,.ov-next-row>ha-icon{--mdc-icon-size:20px;color:#0B65EA}.ov-activity-row span,.ov-next-row span{display:grid;min-width:0}.ov-activity-row b,.ov-next-row b{font-size:11px;color:#172B47;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ov-activity-row small,.ov-next-row small{font-size:9.5px;color:#708098;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ov-next-row button{margin-left:auto;height:30px;border:1px solid #DDE7F2;background:#EAF3FF;color:#0B65EA;border-radius:9px;padding:0 10px;font-size:10px;font-weight:600;cursor:pointer}.ov-empty{border:1px dashed #DCE5F0;border-radius:11px;padding:14px;color:#718199;font-size:10.5px;text-align:center;background:#FAFCFF}
    @media(max-width:1280px){.ov-hero-copy{max-width:62%}.ov-vehicle-row{grid-template-columns:minmax(180px,1.5fr) repeat(3,minmax(80px,.7fr));grid-template-areas:"main security comfort maintenance" "charging charging charging charging" "assign assign actions actions"}.ov-two-col{grid-template-columns:1fr}.ov-hero-vehicle{width:38%}}
    @media(max-width:760px){.ov-hero{min-height:auto}.ov-hero-copy{max-width:100%;padding:18px}.ov-hero-vehicle,.ov-hero-time{display:none}.ov-kpis{grid-template-columns:1fr 1fr}.ov-quickbar{overflow-x:auto}.ov-quick-title{display:none}.ov-nav-action{flex:0 0 auto}.ov-nav-action.ov-more{margin-left:0}.ov-vehicle-row{grid-template-columns:1fr 1fr;grid-template-areas:"main main" "security comfort" "maintenance charging" "assign assign" "actions actions"}.ov-vehicle-main{grid-template-columns:58px 1fr}.ov-row-actions{justify-content:flex-start;overflow-x:auto}.ov-kpi b{font-size:18px}}

    /* Vehicle management workspace */
    .vehicles-hero{position:relative;overflow:hidden;min-height:150px;border:1px solid #dfe7f1;border-radius:18px;background:linear-gradient(135deg,#f8fbff 0%,#fff 58%,#edf5ff 100%);box-shadow:0 12px 30px rgba(15,35,80,.045);padding:18px 22px;display:flex;align-items:center}.vehicles-hero-copy{position:relative;z-index:2;max-width:760px}.vehicles-hero-copy>small{display:block;font-size:9px;letter-spacing:.14em;font-weight:750;color:#64748b}.vehicles-hero-copy h1{margin:4px 0 5px;font-size:30px;line-height:1.05;font-weight:650;letter-spacing:-.03em}.vehicles-hero-copy>p{margin:0 0 12px;max-width:700px;color:#64748b;font-size:11.5px;line-height:1.4}.vehicles-live-line{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.vehicles-live-line strong{font-size:11px;color:#334155}.vehicles-live-line span{font-size:10px;color:#64748b}.vehicles-hero-art{position:absolute;right:20px;top:3px;width:min(36%,420px);height:145px;display:flex;align-items:center;justify-content:flex-end;pointer-events:none}.vehicles-hero-art:before{content:"";position:absolute;inset:18px 0 0 18%;background:radial-gradient(circle at center,rgba(37,99,235,.12),transparent 66%)}.vehicles-hero-art img{position:relative;z-index:1;max-width:100%;max-height:140px;object-fit:contain;filter:drop-shadow(0 14px 24px rgba(15,35,80,.16))}
    .vehicle-management-bar{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:9px;align-items:center;border:1px solid #e2e8f0;border-radius:14px;background:#fff;padding:7px 8px;box-shadow:0 8px 24px rgba(15,35,80,.035)}.vehicle-filter-group{display:flex;gap:5px;min-width:0;overflow-x:auto}.vehicle-filter-group button{height:34px;border:1px solid #dde7f2;border-radius:9px;background:#fff;color:#334155;padding:0 9px;display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;white-space:nowrap;cursor:pointer}.vehicle-filter-group button b{min-width:20px;border-radius:999px;background:#f1f5f9;padding:2px 6px;font-size:9px;color:#64748b}.vehicle-filter-group button.active{background:#eaf3ff;border-color:#bfd6ff;color:#0b65ea}.vehicle-filter-group button.active b{background:#fff;color:#0b65ea}.vehicle-sort-control{height:34px;border:1px solid #dde7f2;border-radius:9px;display:flex;align-items:center;gap:6px;padding:0 8px;color:#64748b;font-size:9.5px;font-weight:600}.vehicle-sort-control select{border:0;background:transparent;color:#1e293b;font-size:10.5px;font-weight:600;outline:0}.vehicle-manage-button{height:34px;border:1px solid #bfd6ff;border-radius:9px;background:#eaf3ff;color:#0b65ea;padding:0 11px;display:inline-flex;align-items:center;gap:6px;font-size:10.5px;font-weight:650;cursor:pointer}.vehicle-manage-button ha-icon{--mdc-icon-size:16px}
    .vehicle-page-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.vehicle-page-summary-item{min-height:50px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;padding:7px 9px;display:grid;grid-template-columns:28px minmax(0,1fr);gap:7px;align-items:center}.vehicle-page-summary-item>ha-icon{--mdc-icon-size:16px;width:28px;height:28px;border-radius:8px;background:#eff6ff;color:#2563eb;padding:6px;box-sizing:border-box}.vehicle-page-summary-item>span{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:6px;min-width:0}.vehicle-page-summary-item small{font-size:9px;color:#64748b}.vehicle-page-summary-item b{font-size:14px;color:#0f172a}.vehicle-page-summary-item em{grid-column:1/-1;margin-top:1px;font-size:8.5px;font-style:normal;color:#94a3b8}.vehicle-page-summary-item.warn>ha-icon{background:#fff7ed;color:#c2410c}
    .vehicle-workspace-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin:3px 2px -2px}.vehicle-workspace-head h2{margin:0;font-size:18px;font-weight:650;color:#0f172a}.vehicle-workspace-head p{margin:2px 0 0;font-size:10px;color:#64748b}.vehicle-count-pill{border:1px solid #dbe5f0;border-radius:999px;background:#fff;color:#475569;padding:5px 9px;font-size:9.5px;font-weight:650;white-space:nowrap}.vehicle-count-pill.muted{background:#f8fafc}.vehicle-filter-empty{border:1px dashed #d9e3ef;border-radius:14px;background:#fbfdff;color:#64748b;padding:18px;text-align:center;font-size:11px;font-weight:600}
    .vehicle-workspace-list.vehicles{grid-template-columns:1fr!important}.vehicle-workspace-list .vehicle-card{box-shadow:0 10px 28px rgba(15,35,80,.05)}.vehicle-workspace-list .hero-split-row{grid-template-columns:minmax(0,2.7fr) minmax(155px,.72fr)}.vehicle-workspace-list .vehicle-hero-panel{min-height:168px}.vehicle-workspace-list .charger-hero-panel{min-height:168px}.vehicle-workspace-list .vehicle-image img{max-height:220px;transform:scale(1.18)}.manage-lifecycle span{display:inline!important}.manage-lifecycle{padding-inline:12px!important}
    .vehicle-appearance-action{min-width:112px}.vehicle-picker-panel{margin:0 12px 10px;border:1px solid #cfe0f6;border-radius:14px;background:linear-gradient(135deg,#fbfdff,#f3f8ff);padding:12px 14px;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}.vehicle-picker-head{display:flex;justify-content:space-between;gap:14px;align-items:start}.vehicle-picker-head small{font-size:8.5px;letter-spacing:.13em;color:#64748b;font-weight:750}.vehicle-picker-head h3{margin:2px 0 2px;font-size:15px;color:#0f172a}.vehicle-picker-head p{margin:0;font-size:9.5px;color:#64748b}.vehicle-picker-head code{font-size:9px}.vehicle-picker-close{width:30px;height:30px;border:1px solid #dbe5f0;border-radius:8px;background:#fff;color:#64748b;cursor:pointer}.vehicle-picker-close ha-icon{--mdc-icon-size:16px}.vehicle-picker-grid{display:grid;grid-template-columns:minmax(180px,1.3fr) minmax(140px,.8fr) minmax(220px,1.4fr) auto;gap:8px;align-items:end;margin-top:10px}.vehicle-picker-grid label,.vehicle-picker-key{display:flex;flex-direction:column;gap:4px}.vehicle-picker-grid label>span,.vehicle-picker-key>span{font-size:8.5px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em}.vehicle-picker-grid select{height:34px;border:1px solid #d7e2ef;border-radius:8px;background:#fff;color:#0f172a;padding:0 8px;font-size:10.5px;font-weight:600}.vehicle-picker-key code{height:34px;display:flex;align-items:center;border:1px solid #d7e2ef;border-radius:8px;background:#fff;padding:0 8px;font-size:8.5px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vehicle-picker-save{height:34px;border:1px solid #0b65ea;border-radius:8px;background:#0b65ea;color:#fff;padding:0 11px;display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;cursor:pointer}.vehicle-picker-save:disabled{background:#e2e8f0;border-color:#d5deea;color:#94a3b8;cursor:not-allowed}.vehicle-picker-save ha-icon{--mdc-icon-size:15px}.vehicle-picker-gap{margin-top:8px;display:flex;align-items:center;gap:6px;color:#9a5a16;font-size:9.5px}.vehicle-picker-gap ha-icon{--mdc-icon-size:14px}
    @media(max-width:900px){.vehicle-picker-grid{grid-template-columns:1fr 1fr}.vehicle-picker-save{justify-content:center}.vehicle-picker-key{grid-column:1/-1}}

    @media(max-width:980px){.vehicle-management-bar{grid-template-columns:1fr auto}.vehicle-manage-button{grid-column:1/-1;justify-content:center}.vehicle-page-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.vehicles-hero-copy{padding-right:30%}}
    @media(max-width:700px){.vehicles-hero{padding:16px;min-height:auto}.vehicles-hero-art{display:none}.vehicles-hero-copy{padding-right:0}.vehicle-management-bar{grid-template-columns:1fr}.vehicle-sort-control{justify-content:space-between}.vehicle-manage-button{grid-column:auto}.vehicle-page-summary{grid-template-columns:1fr 1fr}.vehicle-workspace-head{align-items:start}.vehicle-workspace-list .hero-split-row{grid-template-columns:1fr}}

    /* rc.24 mobile hero art + discoverable visual picker */
    .vehicle-hero-panel{position:relative!important;isolation:isolate!important}
    .vehicle-hero-panel:after{
      content:"";position:absolute;inset:0;pointer-events:none;z-index:1;
      background:linear-gradient(90deg,rgba(255,255,255,.98) 0%,rgba(255,255,255,.90) 34%,rgba(255,255,255,.18) 68%,rgba(255,255,255,0) 100%)
    }
    .vehicle-copy{position:relative;z-index:3}
    .vehicle-image{position:absolute!important;z-index:0!important;right:-4%!important;bottom:-14%!important;width:70%!important;height:126%!important;min-height:0!important;background:transparent!important;overflow:visible!important;pointer-events:none}
    .vehicle-image img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:right center!important;transform:none!important}
    .vehicle-visual-edit{
      position:absolute;z-index:4;left:12px;bottom:10px;height:34px;border:1px solid rgba(14,35,72,.11);
      border-radius:10px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
      color:var(--hb-ink);display:inline-flex;align-items:center;gap:6px;padding:0 10px;font-size:10px;font-weight:700;cursor:pointer
    }
    .vehicle-visual-edit ha-icon{--mdc-icon-size:15px;color:var(--hb-blue)}
    .charger-hero-panel{position:relative!important;overflow:hidden!important;isolation:isolate!important}
    .charger-hero-panel:after{
      content:"";position:absolute;inset:0;pointer-events:none;z-index:1;
      background:linear-gradient(90deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.82) 45%,rgba(255,255,255,.10) 100%)
    }
    .charger-mini-copy{position:relative;z-index:3}
    .charger-mini-image{
      position:absolute!important;z-index:0!important;right:-12%!important;bottom:-18%!important;
      width:58%!important;height:138%!important;background:transparent!important;overflow:hidden!important;pointer-events:none
    }
    .charger-mini-image img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:right center!important;transform:scale(1.16)!important}
    .charger-hero-panel .mini-detail-button{z-index:4!important}

    @media(max-width:700px){
      .vehicle-workspace-list .vehicle-hero-panel,.vehicle-hero-panel{
        min-height:126px!important;height:126px!important;display:block!important;padding:12px 12px!important
      }
      .vehicle-copy{max-width:58%!important;padding-bottom:42px!important}
      .vehicle-copy h2{font-size:19px!important;line-height:1.06!important}
      .vehicle-copy p{font-size:10px!important}
      .vehicle-image{right:-8%!important;bottom:-18%!important;width:76%!important;height:140%!important}
      .vehicle-hero-panel:after{background:linear-gradient(90deg,rgba(255,255,255,.99) 0%,rgba(255,255,255,.93) 38%,rgba(255,255,255,.20) 68%,rgba(255,255,255,0) 100%)!important}
      .vehicle-visual-edit{left:10px!important;bottom:8px!important;height:38px!important;font-size:10.5px!important;padding:0 11px!important}
      .vehicle-visual-edit span{display:inline!important}

      .charger-hero-panel{
        height:64px!important;min-height:64px!important;display:block!important;padding:8px 10px!important
      }
      .charger-mini-copy{max-width:62%!important;display:flex!important;justify-content:center!important;height:100%!important}
      .charger-mini-copy b{font-size:12px!important;align-self:center!important}
      .charger-mini-image{right:-12%!important;bottom:-34%!important;width:45%!important;height:166%!important}
      .charger-mini-image img{transform:scale(1.28)!important;object-position:right center!important}
      .charger-hero-panel:after{background:linear-gradient(90deg,rgba(255,255,255,.98) 0%,rgba(255,255,255,.88) 48%,rgba(255,255,255,.08) 100%)!important}
    }

    @media(max-width:390px){
      .vehicle-hero-panel{height:118px!important;min-height:118px!important}
      .vehicle-copy{max-width:61%!important}
      .vehicle-copy h2{font-size:17px!important}
      .vehicle-image{width:78%!important;right:-12%!important}
      .vehicle-visual-edit{height:36px!important;padding:0 9px!important}
      .charger-hero-panel{height:60px!important;min-height:60px!important}
    }

    /* Energy-style Mobility Overview — calm hierarchy, Mobility-owned semantics */
    .ov-energy-hero{position:relative;overflow:hidden;min-height:172px;border:1px solid #dfe7f1;border-radius:18px;background:linear-gradient(135deg,#f8fbff 0%,#ffffff 58%,#edf5ff 100%);box-shadow:0 12px 30px rgba(15,35,80,.045);display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.48fr);align-items:center;padding:20px 24px}
    .ov-energy-hero-copy{position:relative;z-index:2;max-width:760px}.ov-energy-hero-copy>small{display:block;font-size:9px;letter-spacing:.14em;font-weight:750;color:#64748b}.ov-energy-hero-copy h1{margin:4px 0 5px;font-size:28px;line-height:1.08;font-weight:650;letter-spacing:-.025em;color:#0f172a}.ov-energy-hero-copy>p{max-width:720px;margin:0 0 13px;font-size:11.5px;line-height:1.4;color:#64748b}.ov-energy-live-line{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.ov-energy-live-line strong{font-size:11px;color:#334155}.ov-energy-live-line span{font-size:10px;color:#64748b}
    .ov-energy-hero-art{position:absolute;right:24px;top:8px;width:min(38%,430px);height:160px;display:flex;align-items:center;justify-content:flex-end;pointer-events:none}.ov-energy-hero-art:before{content:"";position:absolute;inset:22px 0 0 16%;background:radial-gradient(circle at center,rgba(37,99,235,.12),transparent 66%)}.ov-energy-hero-art img{position:relative;z-index:1;max-width:100%;max-height:150px;object-fit:contain;filter:drop-shadow(0 16px 24px rgba(15,35,80,.16))}
    .ov-status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:0}.ov-status-item{min-height:48px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;display:grid;grid-template-columns:26px minmax(0,1fr);gap:7px;align-items:center;padding:7px 9px}.ov-status-icon{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:#eff6ff;color:#2563eb}.ov-status-icon ha-icon{--mdc-icon-size:15px}.ov-status-item>div{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:6px;align-items:baseline;min-width:0}.ov-status-item small{font-size:9px;line-height:1.05;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ov-status-item b{font-size:13px;line-height:1.05;color:#0f172a;white-space:nowrap}.ov-status-item em{grid-column:1/-1;margin-top:2px;font-size:8.5px;line-height:1.05;font-style:normal;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ov-status-item.warn .ov-status-icon{background:#fff7ed;color:#c2410c}.ov-status-item.muted .ov-status-icon{background:#f8fafc;color:#94a3b8}.ov-status-item.ok .ov-status-icon{background:#ecfdf5;color:#047857}
    .ov-quickbar.energy-like{min-height:0;padding:6px 8px;margin:0;border-radius:10px;box-shadow:none}.ov-quickbar.energy-like .ov-nav-action{height:34px;min-height:34px;border-radius:8px;font-size:10.5px;padding:0 10px}.ov-quickbar.energy-like .ov-quick-title{font-size:9px;letter-spacing:.10em}
    .ov-core-grid{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(330px,.72fr);gap:10px;align-items:start}.ov-core-vehicles{padding:14px}.ov-core-aside{display:grid;gap:10px}.ov-core-aside>.ov-panel{padding:12px}.ov-focus-panel{background:linear-gradient(135deg,#fbfdff,#f5f9ff)}.ov-activity-panel{min-height:0}.ov-core-grid .ov-panel-head{padding:0 0 9px}.ov-core-grid .ov-panel-head h2{font-size:16px;font-weight:570}.ov-core-grid .ov-panel-head p{font-size:10px;line-height:1.3}
    .ov-conclusion{display:grid;grid-template-columns:28px minmax(0,1fr);gap:8px;align-items:start;margin:0;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(247,250,252,.96))}.ov-conclusion-icon{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:rgba(3,169,244,.08)}.ov-conclusion small{font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:#64748b}.ov-conclusion h2{font-size:13px;line-height:1.2;margin:1px 0 2px;color:#0f172a}.ov-conclusion p{font-size:10px;line-height:1.3;margin:0;color:#64748b}
    @media(max-width:1180px){.ov-core-grid{grid-template-columns:1fr}.ov-core-aside{grid-template-columns:1fr 1fr}.ov-core-aside>.ov-panel:first-child{grid-column:1/-1}.ov-energy-hero{grid-template-columns:1fr}.ov-energy-hero-copy{padding-right:34%}.ov-status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:700px){.ov-energy-hero{padding:16px;min-height:auto}.ov-energy-hero-copy{padding-right:0}.ov-energy-hero-art{display:none}.ov-energy-hero-copy h1{font-size:22px}.ov-status-grid{grid-template-columns:1fr 1fr}.ov-core-aside{grid-template-columns:1fr}.ov-core-aside>.ov-panel:first-child{grid-column:auto}.ov-conclusion{grid-template-columns:24px minmax(0,1fr)}.ov-conclusion-icon{width:24px;height:24px}}

    /* rc.23 mobile density rewrite — presentation only, no semantic changes */
    @media(max-width:700px){
      .page{padding:8px 8px 18px!important;gap:8px!important}
      .vehicles{gap:8px!important}
      .vehicle-card{border-radius:16px!important}
      .status-top-row{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important;padding:8px 8px 4px!important;overflow:visible!important}
      .vehicle-intelligence-strip .intelligence-status-row{min-height:34px!important;padding:4px 7px!important}
      .vehicle-intelligence-strip .intelligence-status-row span{font-size:8.5px!important}
      .vehicle-intelligence-strip .intelligence-status-row .pill{font-size:9.5px!important;padding:3px 6px!important}

      .vehicle-workspace-list .hero-split-row,.hero-split-row{
        grid-template-columns:1fr!important;gap:6px!important;padding:4px 8px 6px!important
      }
      .vehicle-workspace-list .vehicle-hero-panel,.vehicle-hero-panel{
        min-height:0!important;height:auto!important;
        grid-template-columns:minmax(0,1fr) 138px!important;
        grid-template-rows:auto!important;
        gap:6px!important;padding:10px 10px 8px!important;border-radius:13px!important;align-items:center!important
      }
      .vehicle-copy{position:relative!important;left:auto!important;top:auto!important;align-self:center!important;min-width:0!important}
      .vehicle-copy h2{font-size:20px!important;line-height:1.08!important;margin:0 0 3px!important;letter-spacing:-.025em!important}
      .vehicle-copy p{font-size:10.5px!important;line-height:1.25!important}
      .vehicle-activity-inline{margin-top:3px!important}
      .vehicle-image{position:relative!important;inset:auto!important;height:108px!important;min-height:0!important;background:transparent!important}
      .vehicle-workspace-list .vehicle-image img,.vehicle-image img{
        max-height:108px!important;max-width:138px!important;transform:none!important;object-fit:contain!important
      }
      .vehicle-hero-panel .mini-detail-button{width:36px!important;height:36px!important;right:6px!important;bottom:6px!important}

      .charger-hero-panel{
        min-height:0!important;height:72px!important;
        grid-template-columns:minmax(0,1fr) 78px!important;grid-template-rows:1fr!important;
        gap:6px!important;padding:7px 9px!important;border-radius:13px!important
      }
      .charger-mini-copy{justify-self:start!important;align-self:center!important}
      .charger-mini-copy b{font-size:12.5px!important}
      .charger-mini-image{height:58px!important;width:72px!important;justify-self:end!important;background:transparent!important}
      .charger-mini-image img{max-width:66px!important;max-height:56px!important}
      .charger-hero-panel .mini-detail-button{width:34px!important;height:34px!important;right:4px!important;bottom:4px!important}

      .vehicle-control-row.mock-row,.vehicle-control-row{
        display:grid!important;grid-template-columns:1fr!important;gap:6px!important;padding:0 8px 6px!important
      }
      .vehicle-metrics-strip.mock-metrics,.vehicle-metrics-strip{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important}
      .metric-chip{min-height:44px!important;padding:5px 7px!important;border-radius:10px!important}
      .metric-chip span{font-size:8px!important}
      .metric-chip b{font-size:12.5px!important}

      .charge-mini-strip.mock-controls,.charge-mini-strip.no-mode,.charge-mini-strip.no-speed,.charge-mini-strip{
        display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:5px!important;align-items:center!important
      }
      .charge-mini-strip .charger-select{grid-column:1/-1!important;min-height:44px!important}
      .mini-current-stepper.compact-current{min-width:0!important;min-height:44px!important;justify-content:space-between!important}
      .mini-power-read{min-height:44px!important}
      .mini-control,.mini-current-stepper,.mini-power-read{border-radius:10px!important}

      .vehicle-actions.clean-actions{
        display:flex!important;gap:5px!important;padding:6px 8px 8px!important;overflow-x:auto!important;overflow-y:hidden!important;
        -webkit-overflow-scrolling:touch;scrollbar-width:none
      }
      .vehicle-actions.clean-actions::-webkit-scrollbar{display:none}
      .vehicle-actions.clean-actions .action-spacer{display:none!important}
      .vehicle-actions.clean-actions .action:not(.icon-only){
        flex:0 0 auto!important;width:auto!important;min-width:44px!important;max-width:none!important;height:44px!important;padding:0 11px!important
      }
      .vehicle-actions.clean-actions .icon-only,.vehicle-actions.clean-actions .presence-toggle.icon-only{
        flex:0 0 44px!important;width:44px!important;min-width:44px!important;max-width:44px!important;height:44px!important
      }

      .inactive-list{gap:7px!important}
      .inactive-row{
        min-height:68px!important;padding:8px 9px!important;border-radius:14px!important;
        grid-template-columns:auto minmax(0,1fr) auto!important;grid-template-rows:1fr!important;gap:8px!important;align-items:center!important
      }
      .inactive-state{align-self:center!important;font-size:10px!important;padding:6px 8px!important;white-space:nowrap!important}
      .inactive-copy{min-width:0!important}
      .inactive-copy h3{font-size:14px!important;line-height:1.15!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
      .inactive-copy p{font-size:10.5px!important}
      .inactive-actions{
        grid-column:auto!important;display:flex!important;flex-direction:row!important;gap:4px!important;align-items:center!important
      }
      .inactive-actions .action{width:42px!important;min-width:42px!important;height:42px!important;min-height:42px!important;padding:0!important}
      .inactive-actions .action span{display:none!important}

      .vehicle-picker-panel{margin:0 8px 7px!important;padding:10px!important;border-radius:12px!important}
      .vehicle-picker-head h3{font-size:14px!important}
      .vehicle-picker-head p{font-size:10px!important;line-height:1.25!important}
      .vehicle-picker-grid{grid-template-columns:1fr!important;gap:7px!important}
      .vehicle-picker-key{grid-column:auto!important}
      .vehicle-picker-grid select,.vehicle-picker-key code,.vehicle-picker-save{height:44px!important;min-height:44px!important}
      .vehicle-picker-grid label>span,.vehicle-picker-key>span{font-size:9px!important}
      .vehicle-picker-save{width:100%!important;justify-content:center!important}
    }

    @media(max-width:390px){
      .vehicle-hero-panel{grid-template-columns:minmax(0,1fr) 116px!important}
      .vehicle-image{height:92px!important}
      .vehicle-image img{max-height:92px!important;max-width:116px!important}
      .vehicle-copy h2{font-size:18px!important}
      .inactive-state{font-size:9px!important;padding:5px 6px!important}
    }


  `; }

  getCardSize(){ return 12; }
}

if (!customElements.get("homebrain-mobility-dashboard-card")) {
  customElements.define("homebrain-mobility-dashboard-card", HomeBrainMobilityDashboardCard);
}
window.customCards.push({
  type: "homebrain-mobility-dashboard-card",
  name: "Home Brain Mobility Dashboard Card",
  description: "Premium Mobility dashboard custom card with first-class charging controls and compact inactive vehicle rows."
});
/**
 * The former Mobility Asset Viewer was intentionally removed from the Mobility
 * product navigation in 2.1.16. Contract exploration now belongs to the Setup
 * domain. The product bundle keeps only operational Mobility cards.
 */

// ---- src/ui/screens/router.js ----
// 95-placeholder-and-router-cards.js
// Placeholder and generic routed asset detail cards plus custom element registration.

class HomeBrainMobilityPlaceholderCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.config = {};
  }
  setConfig(config = {}) { this.config = config; }
  getCardSize() { return 8; }
  set hass(hass) {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    const view = this.config.view || this.viewFromPath();
    const data = this.viewModel(view);
    this.shadowRoot.innerHTML = `<ha-card><div class="page">${this.versionBlock(rt)}
      ${hbMobilityNav(view)}
      ${hbMobilityOutcomeStrip(rt, view, data.outcome)}
      <section class="section-title"><h2>${rt.escape(data.title)}</h2><span>${rt.escape(data.subtitle)}</span></section>
      <section class="placeholder-grid">
        ${data.cards.map((card) => `<article class="placeholder-card"><div class="placeholder-kicker"><ha-icon icon="${card.icon}"></ha-icon>${rt.escape(card.kicker)}</div><h3>${rt.escape(card.title)}</h3><p>${rt.escape(card.text)}</p></article>`).join("")}
      </section>
      <section class="bottom-grid"><div class="info"><h3><ha-icon icon="mdi:calendar-clock"></ha-icon>Charging Plan</h3><p>${rt.escape(rt.supervisorOutcome("mobility", "opportunity", "Supervised"))}</p></div><div class="info"><h3><ha-icon icon="mdi:shield-check-outline"></ha-icon>System Trust</h3><p>${rt.escape(rt.supervisorOutcome("mobility", "trust", "Unknown"))}</p></div><div class="info"><h3><ha-icon icon="mdi:history"></ha-icon>Recent Activity</h3><p>No recent activity requiring attention.</p></div></section>
      <div class="footer-note">MVP placeholder — contract-backed content will appear here as backend indexes mature.</div>
      ${hbMobilityReleaseFooter(rt)}
    </div><style>${this.styles()}</style></ha-card>`;
    this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn)=>btn.addEventListener("click",()=>rt.navigate(btn.getAttribute("data-nav"))));
  }
  versionBlock(rt) { return ``; }
  viewFromPath() {
    const path = String(window.location?.pathname || "").toLowerCase();
    if (path.includes("planning")) return "planning";
    if (path.includes("strategies")) return "strategies";
    if (path.includes("history")) return "history";
    if (path.includes("/log")) return "log";
    return "planning";
  }
  viewModel(view) {
    const models = {
      planning: {
        title: "Planning", subtitle: "Mobility planning stays under Intelligence.", outcome: { opportunity: "planning", recommended_action: "review_plan" },
        cards: [
          { icon:"mdi:calendar-clock", kicker:"Planning", title:"Operational Planning", text:"Existing planning content can be mounted here without changing its product semantics." },
          { icon:"mdi:car-clock", kicker:"Readiness", title:"Vehicle Readiness", text:"Departure readiness and charging needs remain backend-owned." }
        ]
      },
      strategies: {
        title: "Strategies", subtitle: "Mobility strategy belongs to Intelligence.", outcome: { opportunity: "strategy", recommended_action: "review_strategy" },
        cards: [
          { icon:"mdi:tune-variant", kicker:"Strategy", title:"Strategy Profiles", text:"Existing Mobility strategy configuration can be mounted here without changing its contract ownership." },
          { icon:"mdi:shield-check-outline", kicker:"Effective", title:"Effective Strategy", text:"Configured intent and effective runtime policy remain separate." }
        ]
      },
      history: {
        title: "History", subtitle: "Historical Mobility outcomes and activity belong to Insights.", outcome: { status: "Unknown", opportunity: "history", recommended_action: "none" },
        cards: [
          { icon:"mdi:history", kicker:"History", title:"Mobility History", text:"Historical executions, recommendations and outcomes can be presented here." },
          { icon:"mdi:timeline-clock-outline", kicker:"Timeline", title:"Activity Timeline", text:"Time-ordered Mobility evidence remains read-only insight." }
        ]
      },
      log: {
        title: "Log", subtitle: "Operational and audit logging belongs to Insights.", outcome: { status: "Unknown", opportunity: "audit", recommended_action: "none" },
        cards: [
          { icon:"mdi:text-box-search-outline", kicker:"Log", title:"Mobility Log", text:"Commands, runtime events and audit evidence can be presented here." },
          { icon:"mdi:alert-outline", kicker:"Exceptions", title:"Exceptions", text:"Failed or rejected activity can be surfaced here with backend-owned reasons." }
        ]
      }
    };
    return models[view] || models.planning;
  }
  styles() { return `:host{display:block;width:100%;box-sizing:border-box;--hb-blue:#1467F5;--hb-ink:#06142D;--hb-muted:#66728B;--hb-line:#E8EEF7;font-family:inherit}ha-card{background:transparent;box-shadow:none;border:none}.page{position:relative;width:min(100%,1560px);margin:0 auto;padding:18px 26px 30px;box-sizing:border-box}.title h1{margin:2px 0 4px;font-size:38px;color:#06142D}.title p{margin:0;color:#66728B}.eyebrow{font-size:11px;font-weight:650;letter-spacing:.12em;color:#1467F5;text-transform:uppercase}.section-title{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin:10px 0 8px}.section-title h2{margin:0;font-size:24px;color:#06142D}.section-title span{color:#66728B;font-weight:600}.bottom-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px}.info{background:#fff;border:1px solid #E8EEF7;border-radius:18px;padding:16px;box-shadow:0 16px 38px rgba(15,35,80,.06)}.info h3{display:flex;align-items:center;gap:8px;margin:0 0 8px;color:#06142D}.info p{margin:0;color:#66728B}.status-strip.dashboard-status-strip{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;border:1px solid rgba(14,35,72,.11)!important;border-radius:17px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 16px 32px rgba(15,35,80,.08)!important;overflow:hidden!important;max-width:none!important;width:100%!important;margin:8px 0 10px!important}.status-strip.dashboard-status-strip .metric{display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important}.status-strip.dashboard-status-strip .metric:last-child{border-right:0!important}.status-strip.dashboard-status-strip .metric ha-icon{--mdc-icon-size:23px;color:#1467F5}.status-strip.dashboard-status-strip .metric.tone-green ha-icon{color:#18A957!important}.status-strip.dashboard-status-strip .metric.tone-orange ha-icon{color:#F59E0B!important}.status-strip.dashboard-status-strip .metric span{display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1}.status-strip.dashboard-status-strip .metric b{display:block;font-size:16px;font-weight:650;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}${hbMobilitySharedShellStyles()}@media(max-width:760px){.bottom-grid{grid-template-columns:1fr}.status-strip.dashboard-status-strip{grid-template-columns:1fr!important;max-width:100%!important}}`; }
}
if (!customElements.get("homebrain-mobility-placeholder-card")) {
  customElements.define("homebrain-mobility-placeholder-card", HomeBrainMobilityPlaceholderCard);
}
window.customCards.push({
  type: "homebrain-mobility-placeholder-card",
  name: "Home Brain Mobility Placeholder Card",
  description: "R22.10.3 navigation shell placeholder for Intelligence, Activity and Value."
});

class HomeBrainMobilityAssetDetailCard extends HTMLElement {
  constructor() {
    super();
    this.config = { dashboard_path: "/mobility-supervisor/dashboard" };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._lastSignature = "";
  }

  setConfig(config = {}) {
    this.config = { dashboard_path: "/mobility-supervisor/dashboard", ...(config || {}) };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._lastSignature = "";
  }

  selectedAssetId() {
    // HA keeps Lovelace view navigation in the browser URL. The generic detail card reads
    // ?asset=<asset_id>. Config asset_id remains supported for test cards or fixed mounts.
    let url;
    try { url = new URL(window.location.href); } catch (e) { url = { searchParams: new URLSearchParams(), hash: "" }; }
    let hashAsset = "";
    try {
      const hash = String(url.hash || "").replace(/^#/, "");
      if (hash.startsWith("asset=")) hashAsset = decodeURIComponent(hash.slice(6));
      else hashAsset = hash;
    } catch (e) {}
    return this.config.asset_id || url.searchParams.get("asset") || hashAsset || sessionStorage.getItem("homebrain_mobility_last_asset") || "";
  }

  set hass(hass) {
    try {
    this._hass = hass;
    const rt = new HomeBrainAssetRuntime(hass, this.config);
    let assetId = this.selectedAssetId();
    let entry = assetId ? rt.registryEntry(assetId) : null;
    if (!entry && this.config.default_asset_type) {
      const wanted = String(this.config.default_asset_type).toLowerCase();
      entry = rt.mobilityRegistry().find((a)=> wanted === "vehicle" ? rt.isVehicleAsset(a) : wanted === "charger" ? rt.isChargerAsset(a) : false) || null;
      assetId = entry?.asset_id || assetId;
    }
    if (!entry && !assetId) {
      entry = rt.mobilityRegistry().find((a)=>rt.isVehicleAsset(a)) || rt.mobilityRegistry().find((a)=>rt.isChargerAsset(a)) || null;
      assetId = entry?.asset_id || "";
    }

    if (!entry) {
      this.shadowRoot.innerHTML = `
        <ha-card>
          <div class="missing">
            <h2>Asset not registered</h2>
            <p>No registered Mobility asset was found for <b>${rt.escape(assetId || "missing asset id")}</b>.</p>
            <button data-nav="/mobility-supervisor/dashboard">← Back to Dashboard</button>
          </div>
          <style>
            ha-card{background:transparent;box-shadow:none;border:none}
            .missing{font-family:inherit;user-select:text;-webkit-user-select:text;margin:24px auto;padding:28px;width:min(100%,900px);background:#fff;border:1px solid #E5ECF6;border-radius:22px;box-shadow:0 16px 40px rgba(15,35,80,.07)}
            h2{margin:0 0 8px;color:#06142D}
            p{color:#66728B;font-weight:400}
            button{border:1px solid #DDE6F2;background:#fff;border-radius:12px;font-weight:500;padding:10px 14px;cursor:pointer;color:#06142D}
          

/* R22.10.3_CHARGE_SPEED_LAYOUT_ENFORCEMENT
   Vehicle card bottom row is source-driven and visible: metrics stay left in the
   existing order, charger selector + mode + charge speed render as real cells.
   The charge speed cell is not allowed to disappear due to nested grid overflow. */
.vehicle-control-row.mock-row{
  display:grid!important;
  grid-template-columns:minmax(176px,.58fr) minmax(260px,1.22fr) minmax(118px,.42fr) minmax(116px,.40fr)!important;
  gap:6px!important;
  align-items:stretch!important;
  padding:0 12px 8px!important;
  min-width:0!important;
  overflow:visible!important;
}
.vehicle-control-row.mock-row>.vehicle-metrics-strip.mock-metrics{
  grid-column:1!important;
  min-width:0!important;
}
.vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{
  display:contents!important;
}
.vehicle-control-row.mock-row .charger-select{
  grid-column:2!important;
  min-width:0!important;
  width:100%!important;
  flex:none!important;
}
.vehicle-control-row.mock-row .mode-select{
  grid-column:3!important;
  min-width:0!important;
  width:100%!important;
  flex:none!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current{
  grid-column:4!important;
  display:grid!important;
  grid-template-columns:minmax(44px,1fr) 24px 24px!important;
  gap:5px!important;
  align-items:center!important;
  justify-items:center!important;
  min-width:0!important;
  width:100%!important;
  height:38px!important;
  min-height:38px!important;
  padding:0 7px!important;
  overflow:hidden!important;
  flex:none!important;
  background:#fff!important;
  border:1px solid var(--hb-line)!important;
  border-radius:12px!important;
  box-sizing:border-box!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current.readonly{
  grid-template-columns:minmax(56px,1fr)!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy{
  min-width:0!important;
  width:100%!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:flex-start!important;
  justify-content:center!important;
  overflow:hidden!important;
  line-height:1.05!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy small{
  display:block!important;
  font-size:8px!important;
  font-weight:650!important;
  color:#64708A!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy strong{
  display:block!important;
  font-size:13px!important;
  font-weight:650!important;
  color:#12213A!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
.vehicle-control-row.mock-row .mini-current-stepper.compact-current .round-step{
  width:24px!important;
  min-width:24px!important;
  height:24px!important;
  border-radius:999px!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  padding:0!important;
  font-size:16px!important;
  line-height:1!important;
  background:#fff!important;
  color:#1467F5!important;
  border:1px solid var(--hb-line)!important;
  box-shadow:none!important;
}
.vehicle-actions.clean-actions{
  display:grid!important;
  grid-template-columns:minmax(140px,1.05fr) minmax(120px,.95fr) minmax(110px,.85fr) minmax(12px,1fr) 42px 42px!important;
  gap:8px!important;
  align-items:center!important;
  padding:8px 12px 12px!important;
}
.vehicle-actions.clean-actions .presence-toggle.icon-only,
.vehicle-actions.clean-actions .details-action.icon-only{
  justify-self:end!important;
  width:42px!important;
  min-width:42px!important;
  max-width:42px!important;
  background:#fff!important;
  color:#1467F5!important;
  border-color:var(--hb-line)!important;
}
.vehicle-actions.clean-actions .presence-toggle.icon-only ha-icon,
.vehicle-actions.clean-actions .details-action.icon-only ha-icon{
  color:#1467F5!important;
}
@media(max-width:1380px){
  .vehicle-control-row.mock-row{grid-template-columns:minmax(176px,.60fr) minmax(240px,1.20fr) minmax(112px,.42fr) minmax(112px,.42fr)!important;}
}
@media(max-width:880px){
  .vehicle-control-row.mock-row{grid-template-columns:1fr 1fr!important;overflow:visible!important;}
  .vehicle-control-row.mock-row>.vehicle-metrics-strip.mock-metrics{grid-column:1 / -1!important;}
  .vehicle-control-row.mock-row .charger-select{grid-column:1 / -1!important;}
  .vehicle-control-row.mock-row .mode-select{grid-column:1!important;}
  .vehicle-control-row.mock-row .mini-current-stepper.compact-current{grid-column:2!important;}
}



/* R22.10.3 shared horizontal outcome/status header */
.status-strip.dashboard-status-strip,.status-strip.ops-status-strip{
  display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;
  border:1px solid rgba(14,35,72,.11)!important;border-radius:17px!important;
  background:rgba(255,255,255,.96)!important;box-shadow:0 16px 32px rgba(15,35,80,.08)!important;
  overflow:hidden!important;max-width:none!important;width:100%!important;margin:8px 0 10px!important;
}
.status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric{
  display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;
  padding:14px 16px!important;border-right:1px solid #E6ECF5!important;min-width:0!important;background:transparent!important;
}
.status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child{border-right:0!important;}
.status-strip.dashboard-status-strip .metric ha-icon,.status-strip.ops-status-strip .metric ha-icon{--mdc-icon-size:23px;color:#1467F5;}
.status-strip.dashboard-status-strip .metric.tone-green ha-icon,.status-strip.ops-status-strip .metric.tone-green ha-icon{color:#18A957!important;}
.status-strip.dashboard-status-strip .metric.tone-orange ha-icon,.status-strip.ops-status-strip .metric.tone-orange ha-icon{color:#F59E0B!important;}
.status-strip.dashboard-status-strip .metric span,.status-strip.ops-status-strip .metric span{display:block;font-size:11px;font-weight:600;color:#66728B;line-height:1.1;}
.status-strip.dashboard-status-strip .metric b,.status-strip.ops-status-strip .metric b{display:block;font-size:16px;font-weight:650;color:#071327;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
@media(max-width:760px){.status-strip.dashboard-status-strip,.status-strip.ops-status-strip{grid-template-columns:1fr!important;max-width:100%!important}.status-strip.dashboard-status-strip .metric,.status-strip.ops-status-strip .metric{border-right:0!important;border-bottom:1px solid #E6ECF5!important}.status-strip.dashboard-status-strip .metric:last-child,.status-strip.ops-status-strip .metric:last-child{border-bottom:0!important}}
${hbMobilitySharedShellStyles()}

    /* R22.10.3 charger capability guard and outcome renderer alignment */
    .domain-tabs-wrap{margin:6px 0 8px!important}
    .status-strip.dashboard-status-strip,.status-strip.ops-status-strip,.outcome-header{width:100%!important;max-width:none!important;margin:8px 0 10px!important}
    .section-title{margin-top:8px!important;margin-bottom:8px!important}
    /* R22.11.8 dynamic release footer. Backend version is runtime data from the Mobility release contract. */
    .hi-version-block{display:none!important}
    .hi-release-footer{display:flex;align-items:center;gap:8px;flex-wrap:wrap;width:100%;box-sizing:border-box;margin:8px 0 0;padding:8px 14px;border-top:1px solid rgba(14,35,72,.10);background:rgba(255,255,255,.92);color:#53627A;font-size:11px;font-weight:500;line-height:1.2;white-space:normal;overflow:hidden}
    .hi-release-footer span+span::before{content:"•";margin-right:8px;color:#8A96AA}
    @media(max-width:760px){.hi-release-footer{font-size:10px;padding:8px 10px}}
    .page{gap:10px!important}

    /* R22.10.3 final dashboard enforcement: command framework + charge speed alignment */
    .vehicle-control-row.mock-row>.charge-mini-strip.mock-controls{
      display:grid!important;
      grid-template-columns:minmax(210px,1.28fr) minmax(124px,.74fr) minmax(136px,.78fr)!important;
      gap:7px!important;
      align-items:stretch!important;
      height:40px!important;
      overflow:visible!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current{
      grid-column:auto!important;
      height:40px!important;
      min-height:40px!important;
      flex:unset!important;
      display:grid!important;
      grid-template-columns:minmax(52px,1fr) 28px 28px!important;
      gap:5px!important;
      align-items:center!important;
      padding:0 7px!important;
      border-radius:12px!important;
      min-width:0!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current.readonly{
      grid-template-columns:minmax(52px,1fr)!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy{
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      align-items:flex-start!important;
      min-width:0!important;
      line-height:1.05!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy small{
      font-size:8px!important;
      line-height:1!important;
      color:#6A768D!important;
      margin:0 0 2px!important;
      white-space:nowrap!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .current-copy strong{
      font-size:13px!important;
      line-height:1!important;
      font-weight:600!important;
      color:#06142D!important;
      white-space:nowrap!important;
    }
    .vehicle-control-row.mock-row .mini-current-stepper.compact-current .round-step{
      width:28px!important;
      height:28px!important;
      min-width:28px!important;
      border-radius:11px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
    }
    .vehicle-actions.clean-actions{
      grid-template-columns:minmax(132px,1.05fr) minmax(124px,.95fr) minmax(106px,.82fr) minmax(0,1fr) 38px 38px!important;
      align-items:center!important;
    }
</style>
        ${hbMobilityReleaseFooter(rt)}
        </ha-card>`;
      this.shadowRoot.querySelectorAll("button[data-nav]").forEach((btn)=>btn.addEventListener("click",()=>rt.navigate(btn.getAttribute("data-nav"))));

      return;
    }

    const factory = new HomeBrainAssetFactory(rt);
    const adapter = factory.adapterFor(entry, this.config);
    if (!adapter) {
      this.shadowRoot.innerHTML = `<ha-card><div style="padding:24px">No adapter available for ${rt.escape(entry.asset_type)}</div></ha-card>`;
      return;
    }

    const sig = JSON.stringify({
      entry,
      assetId,
      lifecycle: rt.lifecycleStatus ? rt.lifecycleStatus(entry) : entry.lifecycle_state,
      properties: rt.propertyRows(assetId).map((p)=>[p.asset_id, p.property_key, p.value, p.health, p.write_supported, p.write_target_entity]),
      commands: rt.commandRegistry(assetId).map((c)=>[c.asset_id, c.command_id, c.command_key, c.frontend_allowed, c.execution_allowed, c.execution_status || ""]),
      intelligence: rt.intelligenceRowsFor ? rt.intelligenceRowsFor(assetId).map((r)=>[r.asset_id, r.cluster_id || r.cluster || r.key, r.summary || r.message || r.value, r.severity || ""]) : []
    });
    if (sig !== this._lastSignature) {
      this._lastSignature = sig;
      const model = adapter.build();
      model.backPath = this.config.dashboard_path || "/mobility-supervisor/dashboard";
      model.backLabel = "← Back to Dashboard";
      new HomeBrainAssetShell(this.shadowRoot, rt).render(model);
    }
  
    } catch (err) {
      console.error("HomeBrain Mobility asset detail render failed", err);
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const msg = String((err && (err.stack || err.message)) || err || "Unknown detail render error").replace(/[&<>]/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
      this.shadowRoot.innerHTML = `<ha-card><div style="font-family:inherit;margin:24px auto;width:min(100%,1100px);padding:28px;border:1px solid #F3B7B7;border-radius:22px;background:#FFF7F7;color:#061226;box-shadow:0 18px 48px rgba(80,15,15,.08)"><h2>Asset detail temporarily unavailable</h2><p>The selected Mobility asset could not render safely.</p><pre style="white-space:pre-wrap;font-size:12px">${msg}</pre><button data-back style="border:1px solid #DDE6F2;background:#fff;border-radius:12px;padding:10px 14px;font-weight:600">← Back to Dashboard</button></div></ha-card>`;
      this.shadowRoot.querySelector('[data-back]')?.addEventListener('click', () => { try { history.pushState(null, '', (this.config && this.config.dashboard_path) || '/mobility-supervisor/dashboard'); window.dispatchEvent(new Event('location-changed')); } catch(e) {} });
    }
  }

  getCardSize() { return 12; }
}

if (!customElements.get("homebrain-mobility-asset-detail-card")) {
  customElements.define("homebrain-mobility-asset-detail-card", HomeBrainMobilityAssetDetailCard);
}
window.customCards.push({
  type: "homebrain-mobility-asset-detail-card",
  name: "Home Brain Mobility Generic Asset Detail Card",
  description: "R21.6 generic registry-driven asset detail card."
});

console.info(`Home Intelligence Mobility UX bundle loaded ${UX_VERSION}; backend version is read from the Mobility release contract at runtime.`);
