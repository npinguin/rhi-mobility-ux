import fs from "node:fs";
const meta=JSON.parse(fs.readFileSync("src/vendor/RHI_UX_CORE.json","utf8"));
const manifest=JSON.parse(fs.readFileSync("src/manifest.json","utf8"));
const product=JSON.parse(fs.readFileSync("release/product.json","utf8"));
const compat=JSON.parse(fs.readFileSync("COMPATIBILITY.json","utf8"));
const releaseManifest=JSON.parse(fs.readFileSync("RELEASE_MANIFEST.json","utf8"));
const header=fs.readFileSync("src/app/header-and-navigation.js","utf8");
const vendor=fs.readFileSync("src/vendor/rhi-ux-core.js","utf8");
if(meta.version!==product.ux_core?.version || meta.source_commit!==product.ux_core?.source_commit) throw new Error("UX Core vendor pin must match release/product.json authority");
if(compat.ux_core?.version!==meta.version || compat.ux_core?.source_commit!==meta.source_commit) throw new Error("UX Core compatibility dependency drift");
if(releaseManifest.ux_core?.version!==meta.version || releaseManifest.ux_core?.source_commit!==meta.source_commit) throw new Error("UX Core release-manifest dependency drift");
if(meta.runtime_dependency!==false) throw new Error("RHI UX Core must remain build-time only");
if(!manifest.modules.includes("vendor/rhi-ux-core.js")) throw new Error("Core vendor module missing from build");
if(manifest.modules.indexOf("vendor/rhi-ux-core.js")>manifest.modules.indexOf("app/header-and-navigation.js")) throw new Error("Core must load before Mobility shell adapter");
if(/\/hacsfiles\/rhi-ux-core/i.test(header+vendor)) throw new Error("runtime dependency on RHI UX Core is forbidden");
if(!header.includes("rhiUxDomainShell(")) throw new Error("Mobility shell must use shared Core primitive");
for(const legacy of [".hi-domain-shell{",".hi-module-tabs{",".hi-module-tab{",".domain-tab{",".hi-company-brand{"]){
  if(header.includes(legacy)) throw new Error("legacy duplicated shell CSS remains: "+legacy);
}
for(const primitive of ["function rhiUxPageHero(","function rhiUxStatusGrid(","function rhiUxQuickActionBar(","function rhiUxCoreStyles("]){
  if(!vendor.includes(primitive)) throw new Error("missing shared page primitive: "+primitive);
}
if(!vendor.includes("function rhiUxRegisterDomainNavigation(") || !vendor.includes("function rhiUxResolveDomainAssetNavigation(")) throw new Error("cross-domain navigation primitives missing from Core");
if(vendor.includes("__RHI_ASSET_ID__")) throw new Error("stale build-placeholder-style navigation token in Core vendor");
if(!vendor.includes("{asset_id}")) throw new Error("runtime-safe navigation token missing from Core vendor");
if(!vendor.includes("function rhiUxCompanyBrand(") || !vendor.includes("Robotix.be") || !vendor.includes("DomotiX · Network · Security")) throw new Error("canonical Core company brand missing");
if(header.includes("HB_MOBILITY_COMPANY_LOGO") || header.includes("hbMobilityCompanyBrand")) throw new Error("Mobility must not own company branding");
if(!vendor.includes("function rhiUxVisualPickerShell(")) throw new Error("shared Core visual picker shell missing");
console.log("PASS Mobility consumes pinned RHI UX Core 1.5.2 including shared visual picker shell without runtime coupling");
