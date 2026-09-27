import fs from "node:fs";
const presentation=fs.readFileSync("src/app/presentation.js","utf8");
const important=(presentation.match(/!important/g)||[]).length;
if(important!==0) throw new Error("Mobility presentation debt regression: !important="+important);
for(const forbidden of [
  ".page{",
  ".rhiUxPageHero{",
  ".rhiUxStatusGrid{",
  ".rhiUxQuickActionBar{",
  "--rhi-page-pad-x:",
  "--rhi-page-pad-y:"
]){
  if(presentation.includes(forbidden)) throw new Error("shared presentation authority leaked into Mobility: "+forbidden);
}
console.log("PASS Mobility presentation debt baseline: no !important and no shared page/Core selector authority");
