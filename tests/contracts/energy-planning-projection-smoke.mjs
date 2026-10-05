import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const shared = fs.readFileSync("src/runtime/energy-public-v2-projection.js", "utf8");
const source = fs.readFileSync("src/runtime/energy-planning-projection.js", "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(shared + "\n" + source + "\nthis.__Projection = HomeBrainEnergyPlanningProjection;", context);
const Projection = context.__Projection;

const hass={states:{
  "sensor.rhi_energy_public_contract_v2":{
    state:"OK",
    attributes:{
      contract_id:"RHI_ENERGY_PUBLIC_CONTRACT_V2",
      contract_version:"2.0",
      planning:{
        horizons:{
          D0:{flexible_planned_kwh:12.4,flexible_still_to_plan_kwh:3.2},
          D1:{flexible_planned_kwh:8.1}
        },
        assets:[
          {asset_id:"vehicle_audi_q8",display_name:"Audi Q8",planning_state:"planned"},
          {asset_id:"home_battery",display_name:"Home Battery",planning_state:"planned"}
        ]
      }
    }
  }
}};
const mobilityRuntime={mobilityRegistry:()=>[{asset_id:"vehicle_audi_q8"},{asset_id:"charger_driveway_left"}]};
const model=new Projection(hass,mobilityRuntime).viewModel();
assert.equal(model.available,true);
assert.equal(model.today.plannedKwh,12.4);
assert.equal(model.today.stillToPlanKwh,3.2);
assert.equal(model.mobilityPlanningRows.length,1);
assert.equal(model.source,"RHI_ENERGY_PUBLIC_CONTRACT_V2.planning");

const legacyOnly={states:{"sensor.energy_planning_index":{state:"ready",attributes:{planning_today_totals:{planned_flexible_kwh:99}}}}};
const unavailable=new Projection(legacyOnly,mobilityRuntime).viewModel();
assert.equal(unavailable.available,false);
assert.equal(unavailable.today.plannedKwh,null);
console.log("Energy planning Public V2 projection smoke PASS");
