// Packaging-only HACS asset resolver. Backend still owns image_key only.
const RHI_MOBILITY_HACS_BASE = "/hacsfiles/rhi-mobility-ux";
function rhiMobilityAssetUrl(path) {
  const normalized = String(path || "").replace(/^\/+/, "");
  return normalized ? `${RHI_MOBILITY_HACS_BASE}/assets/${normalized}` : "";
}
