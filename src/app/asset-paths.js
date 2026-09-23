// HACS frontend-plugin asset resolver.
// Source/catalog paths remain structured; HACS installs plugin files directly in
// www/community/rhi-mobility-ux, so build flattens every runtime asset.
const RHI_MOBILITY_HACS_BASE = "/hacsfiles/rhi-mobility-ux";
const RHI_MOBILITY_ASSET_PATH = /^(?:[a-z0-9][a-z0-9_-]*\/)*[a-z0-9][a-z0-9_.-]*\.(?:png|webp|svg|jpg|jpeg)$/;

function rhiMobilityPackagedAssetName(path) {
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
  return `asset--${normalized.replaceAll("/", "--")}`;
}

function rhiMobilityAssetUrl(path, revision = "") {
  const packaged = rhiMobilityPackagedAssetName(path);
  if (!packaged) return "";
  const base = `${RHI_MOBILITY_HACS_BASE}/${packaged}`;
  return revision ? `${base}?v=${encodeURIComponent(String(revision))}` : base;
}
