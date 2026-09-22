import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const source = fs.readFileSync("src/runtime/energy-mobility-strategy-projection.js", "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(source + "\nthis.__Projection = HomeBrainEnergyMobilityStrategyProjection;", context);
const Projection = context.__Projection;
assert.equal(typeof Projection, "function");

const hass = { states: {
  "sensor.energy_strategy_profile_index": {
    state:"ready",
    attributes:{
      contract_version:"R1.89.44_CONTRACT",
      strategy_profiles_json:JSON.stringify([
        { profile_id:"vehicle_energy", profile_label:"Vehicle Energy", asset_type:"vehicle", objective_mode:"ready_by" },
        { profile_id:"home_battery", profile_label:"Home Battery", asset_type:"battery" }
      ])
    }
  },
  "sensor.energy_strategy_effective_index": {
    state:"ready",
    attributes:{
      contract_version:"R1.89.44_CONTRACT",
      effective_strategies_json:JSON.stringify([
        { asset_id:"vehicle_audi_q8", policy_id:"vehicle_energy", effective_state:"active", reason_label:"Ready by target" },
        { asset_id:"battery", policy_id:"home_battery", effective_state:"active" }
      ])
    }
  }
}};
const mobilityRuntime={mobilityRegistry:()=>[{asset_id:"vehicle_audi_q8",display_name:"Audi Q8"}]};
const model=new Projection(hass,mobilityRuntime).viewModel();
assert.equal(model.profilesAvailable,true);
assert.equal(model.effectiveAvailable,true);
assert.equal(model.profiles.length,1);
assert.equal(model.profiles[0].profile_id,"vehicle_energy");
assert.equal(model.effective.length,1);
assert.equal(model.effective[0].asset_id,"vehicle_audi_q8");

const unavailable=new Projection({states:{}},mobilityRuntime).viewModel();
assert.equal(unavailable.profilesAvailable,false);
assert.equal(unavailable.effectiveAvailable,false);
assert.equal(unavailable.profiles.length,0);
assert.equal(unavailable.effective.length,0);
console.log("Energy Mobility strategy projection smoke PASS");
