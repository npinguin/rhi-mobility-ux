import fs from "node:fs";
import { buildMobilityVisualManifest } from "../../tools/visual-manifest.mjs";

const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const source=JSON.parse(fs.readFileSync("src/assets/metadata/mobility-visual-manifest.json","utf8"));
const expected=buildMobilityVisualManifest(process.cwd(),pkg.version);
if(JSON.stringify(source)!==JSON.stringify(expected)) throw new Error("source visual manifest drifted from canonical Mobility catalog");
const dist=JSON.parse(fs.readFileSync("dist/assets/metadata/mobility-visual-manifest.json","utf8"));
if(JSON.stringify(source)!==JSON.stringify(dist)) throw new Error("dist visual manifest drifted from source asset");

const refs=new Map(source.refs.map(r=>[r.visual_ref,r]));
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
for(const row of source.refs){ if(!row.package_path) throw new Error("missing package path "+row.visual_ref); }
console.log("PASS canonical cross-domain Mobility visual manifest");
