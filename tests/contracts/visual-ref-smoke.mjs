import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const context = {
  rhiMobilityAssetUrl: path => `/hacsfiles/rhi-mobility-ux/assets/${path}`,
  UX_VERSION:"test"
};
vm.createContext(context);
vm.runInContext(fs.readFileSync("src/app/asset-catalog.js","utf8"), context);

const audi = context.rhiMobilityResolveVisualRef(
  "mobility.vehicle.audi.q8.4m.2024-2026.tfsi-e.mythos-black"
);
assert.ok(audi);
assert.match(audi.package_file, /vehicle_audi_q8\.webp/);
assert.equal(audi.visual_ref, "mobility.vehicle.audi.q8.4m.2024-2026.tfsi-e.mythos-black");

const wallbox = context.rhiMobilityResolveVisualRef("mobility.charger.wallbox.commander2.black");
assert.ok(wallbox);
assert.match(wallbox.package_file, /charger_wallbox_black\.webp/);

assert.equal(context.rhiMobilityResolveVisualRef("energy.battery.generic"), null);

const runtime = fs.readFileSync("src/runtime/ha-contract-runtime.js","utf8");
assert.match(runtime, /visual_ref:/);
assert.match(runtime, /rhiMobilityResolveVisualRef/);
assert.match(runtime, /rhiMobilityLocalVisualKeyFromRef/);

console.log("PASS canonical visual_ref resolution");
