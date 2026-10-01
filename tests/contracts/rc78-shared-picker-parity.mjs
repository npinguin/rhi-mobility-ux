import fs from "node:fs";
const vehicle=fs.readFileSync("src/ui/components/vehicle-visual-picker.js","utf8");
const charger=fs.readFileSync("src/ui/components/charger-visual-picker.js","utf8");
const dashboard=fs.readFileSync("src/ui/screens/mobility-dashboard.js","utf8");
const shell=fs.readFileSync("src/ui/components/asset-shell.js","utf8");
const core=fs.readFileSync("src/vendor/rhi-ux-core.js","utf8");
for(const [name,src] of [["vehicle",vehicle],["charger",charger]]){
  if(!src.includes("rhiUxVisualPickerShell")) throw new Error(name+" picker must use shared Core shell");
  if(!src.includes("current.brand ? catalog.filter")) throw new Error(name+" picker must filter visible tiles by brand");
}
for(const [name,src] of [["dashboard",dashboard],["asset-shell",shell]]){
  if(!src.includes("rhiUxVisualPickerStyles")) throw new Error(name+" must consume shared bounded picker styles");
}
for(const token of ["max-height:min(82vh,760px)","overflow-y:auto","object-fit:contain","grid-auto-rows:142px"]){
  if(!core.includes(token)) throw new Error("vendored Core picker geometry missing: "+token);
}
console.log("PASS Mobility shared bounded appearance picker parity");
