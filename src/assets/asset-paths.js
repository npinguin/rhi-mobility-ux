// Packaging-only HACS asset resolver. Backend still owns image_key only.
const RHI_MOBILITY_HACS_BASE = "/hacsfiles/rhi-mobility-ux";
function rhiMobilityAssetUrl(path, revision = "") {
  const normalized = String(path || "").replace(/^\/+/, "");
  if (!normalized) return "";
  const base = `${RHI_MOBILITY_HACS_BASE}/assets/${normalized}`;
  return revision ? `${base}?v=${encodeURIComponent(String(revision))}` : base;
}
