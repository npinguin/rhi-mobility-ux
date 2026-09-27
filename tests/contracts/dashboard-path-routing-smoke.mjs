import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const nav = fs.readFileSync("src/app/header-and-navigation.js","utf8");
const runtime = fs.readFileSync("src/runtime/ha-contract-runtime.js","utf8");
const vehicle = fs.readFileSync("src/ui/screens/vehicle-detail.js","utf8");
const charger = fs.readFileSync("src/ui/screens/charger-detail.js","utf8");
const maintenance = fs.readFileSync("src/ui/screens/charger-maintenance.js","utf8");
const install = fs.readFileSync("documentation/HACS_INSTALLATION.md","utf8");

const sandbox = {
  window:{ location:{ pathname:"/robotix-mobility/overview" } },
  Set,
  String,
};
vm.createContext(sandbox);
vm.runInContext(nav, sandbox);

assert.equal(sandbox.hbMobilityDashboardBase("/robotix-mobility/overview"), "/robotix-mobility");
assert.equal(sandbox.hbMobilityDashboardBase("/robotix-mobility/0"), "/robotix-mobility");
assert.equal(sandbox.hbMobilityDashboardBase("/mobility-supervisor/overview"), "/mobility-supervisor");
assert.equal(sandbox.hbMobilityDashboardBase("/custom-dashboard"), "/custom-dashboard");
assert.equal(sandbox.hbMobilityPath("/planning"), "/robotix-mobility/planning");
assert.equal(sandbox.hbMobilityPath("/history", "/another-root/overview"), "/another-root/history");

assert.doesNotMatch(nav, /const HB_MOBILITY_BASE_PATH\s*=\s*["']\/mobility-supervisor/);
assert.doesNotMatch(vehicle, /dashboard_path:\s*["']\/mobility-supervisor\/dashboard/);
assert.doesNotMatch(charger, /dashboard_path:\s*["']\/mobility-supervisor\/dashboard/);
assert.doesNotMatch(maintenance, /dashboard_path:\s*["']\/mobility-supervisor\/dashboard/);
assert.match(runtime, /hbMobilityDashboardBase\(configured \|\| window\.location/);
assert.match(runtime, /bootstrap_mode === true[\s\S]*mobility_view=detail/);
assert.doesNotMatch(install, /dashboard URL\/path must remain `mobility-supervisor`/);
assert.match(install, /dashboard URL\/path may be chosen freely/);

console.log("PASS Mobility dashboard routing is path-relative and legacy-compatible");
