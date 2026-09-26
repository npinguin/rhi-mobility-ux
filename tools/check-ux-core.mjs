import fs from "node:fs";
const meta=JSON.parse(fs.readFileSync("src/vendor/RHI_UX_CORE.json","utf8"));
const manifest=JSON.parse(fs.readFileSync("src/manifest.json","utf8"));
const header=fs.readFileSync("src/app/header-and-navigation.js","utf8");
const vendor=fs.readFileSync("src/vendor/rhi-ux-core.js","utf8");
if(meta.version!=="1.2.0" || meta.source_commit!=="9c3f60942a1cf68ce30f33c68b532213d7868570") throw new Error("unexpected RHI UX Core pin");
if(meta.runtime_dependency!==false) throw new Error("RHI UX Core must remain build-time only");
if(!manifest.modules.includes("vendor/rhi-ux-core.js")) throw new Error("Core vendor module missing from build");
if(manifest.modules.indexOf("vendor/rhi-ux-core.js")>manifest.modules.indexOf("app/header-and-navigation.js")) throw new Error("Core must load before Mobility shell adapter");
if(/\/hacsfiles\/rhi-ux-core/i.test(header+vendor)) throw new Error("runtime dependency on RHI UX Core is forbidden");
if(!header.includes("rhiUxDomainShell(")) throw new Error("Mobility shell must use shared Core primitive");
for(const legacy of [".hi-domain-shell{",".hi-module-tabs{",".hi-module-tab{",".domain-tab{",".hi-company-brand{"]){
  if(header.includes(legacy)) throw new Error("legacy duplicated shell CSS remains: "+legacy);
}
console.log("PASS Mobility consumes pinned RHI UX Core 1.2.0 without runtime coupling or duplicate shell");
