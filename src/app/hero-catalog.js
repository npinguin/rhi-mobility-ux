// Canonical Mobility hero family.
// The visual family is package-owned and embedded to make HACS delivery atomic:
// no external hero path can drift or disappear independently from the UX bundle.
const HB_MOBILITY_HERO_DATA = Object.create(null);

const HB_MOBILITY_HERO_KEYS = Object.freeze([
  "overview","vehicles","chargers","planning","strategies","history","log",
  "vehicle-detail","charger-detail"
]);

function hbMobilityHeroData(key) {
  return HB_MOBILITY_HERO_DATA[String(key || "")] || "";
}
