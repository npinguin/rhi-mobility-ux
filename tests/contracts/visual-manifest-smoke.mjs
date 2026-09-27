import fs from "node:fs";
import vm from "node:vm";
const manifest=JSON.parse(fs.readFileSync("dist/assets/metadata/mobility-visual-manifest.json","utf8"));
if(manifest.authority!=="mobility_visual_catalog") throw new Error("wrong visual manifest authority");
const refs=new Map(manifest.refs.map(r=>[r.visual_ref,r]));
for(const ref of [
  "mobility.vehicle.audi.q8.4m.2024-2026.tfsi-e.daytona-grey",
  "mobility.vehicle.volkswagen.id4.2024-2026.ev.scale-silver",
  "mobility.vehicle.bmw.x1.u11.2025-2026.phev.mineral-white",
  "mobility.charger.wallbox.commander2.white",
  "mobility.charger.wallbox.commander2.black",
  "mobility.charger.peblar.business.socket.factory",
  "mobility.vehicle.generic.fallback",
  "mobility.charger.generic.fallback"
]) if(!refs.has(ref)) throw new Error("missing visual ref "+ref);
for(const row of manifest.refs){ if(!row.package_path) throw new Error("missing package path "+row.visual_ref); }
console.log("PASS canonical cross-domain Mobility visual manifest");
