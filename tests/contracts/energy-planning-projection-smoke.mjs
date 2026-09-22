import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const source = fs.readFileSync("src/runtime/energy-planning-projection.js", "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(source + "\nthis.__Projection = HomeBrainEnergyPlanningProjection;", context);
const Projection = context.__Projection;
assert.equal(typeof Projection, "function");

const hass = { states: {
  "sensor.energy_planning_index": {
    state: "ready",
    attributes: {
      contract_version: "R1.89.44_CONTRACT",
      planning_today_totals_json: JSON.stringify({ planned_flexible_kwh: 12.4, still_to_plan_kwh: 3.2 }),
      planning_tomorrow_totals_json: JSON.stringify({ planned_flexible_kwh: 8.1 }),
      planning_assets_json: JSON.stringify([
        { asset_id:"vehicle_audi_q8", display_name:"Audi Q8", planning_state:"planned" },
        { asset_id:"home_battery", display_name:"Home Battery", planning_state:"planned" }
      ])
    }
  },
  "sensor.energy_planning_experience_index": { state:"ready", attributes:{} }
}};
const mobilityRuntime = { mobilityRegistry: () => [{ asset_id:"vehicle_audi_q8" }, { asset_id:"charger_driveway_left" }] };
const model = new Projection(hass, mobilityRuntime).viewModel();

assert.equal(model.available, true);
assert.equal(model.today.plannedKwh, 12.4);
assert.equal(model.today.stillToPlanKwh, 3.2);
assert.equal(model.mobilityPlanningRows.length, 1);
assert.equal(model.mobilityPlanningRows[0].asset_id, "vehicle_audi_q8");
assert.equal(model.source, "Energy public UX contract");

const unavailable = new Projection({states:{}}, mobilityRuntime).viewModel();
assert.equal(unavailable.available, false);
assert.equal(unavailable.today.plannedKwh, null);
console.log("Energy planning projection smoke PASS");
