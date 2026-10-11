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

// Activity is not a historical event stream when the producer publishes live
// vehicle/charger snapshots. Only execution evidence may carry an event time.
const activitySource=fs.readFileSync('src/ui/screens/router.js','utf8');
const start=activitySource.indexOf('  renderLog(rt) {');
const stop=activitySource.indexOf('  renderContextCards(rt, data) {',start);
assert.ok(start>0 && stop>start,'Activity renderer must have a stable owner');
class ActivityChargerArtwork { chargerImageFromId(){return '/assets/chargers/charger_utility_plug.svg';} }
const activityRenderer=new Function('HomeBrainChargerAdapter',
  'return ({'+activitySource.slice(start,stop)+'})')(ActivityChargerArtwork).renderLog;
const rows=[
  {asset_id:'vehicle_a',activity_type:'vehicle',activity_state:'not_charging',summary:'Vehicle current status'},
  {asset_id:'charger_a',activity_type:'charging',activity_state:'idle',summary:'Charger current status'},
  {asset_id:'charger_a',activity_type:'execution',activity_state:'SUCCEEDED',operation_key:'charger.command.start',observed_at:'2026-10-11T08:30:00Z'}
];
const activityRuntime={activityRowsFor:()=>rows,mobilityActivityV2:()=>({activity_count:rows.length}),
  escape:v=>String(v),assetDisplayName:id=>id,cache:v=>v,
  chargerById:id=>id==='charger_a'?{asset_id:id}:null,
  vehicleById:id=>id==='vehicle_a'?{asset_id:id}:null,
  visualImageUrl:()=>'/assets/vehicles/vehicle_audi_q8.webp'};
const controls={_activityType:'all',_activitySort:'newest',_activityGroup:'type'};
const activityHtml=activityRenderer.call(controls,activityRuntime);
for(const evidence of ['data-activity-type','data-activity-sort','data-activity-group',
  'Current status · no event timestamp','charger.command.start','charger_utility_plug.svg','vehicle_audi_q8.webp'])
  assert.ok(activityHtml.includes(evidence),'Activity lost meaningful evidence: '+evidence);
assert.ok(!activityHtml.includes('undefined'));
controls._activityType='execution';
const commandsOnly=activityRenderer.call(controls,activityRuntime);
assert.ok(commandsOnly.includes('charger.command.start'));
assert.ok(!commandsOnly.includes('Vehicle current status'));
console.log('PASS Activity supports actual event times, subject visuals, filtering and grouping without invented timestamps');
