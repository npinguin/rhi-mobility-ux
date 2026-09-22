import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const source = fs.readFileSync("src/runtime/energy-mobility-insights-projection.js", "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(source + "\nthis.__Projection = HomeBrainEnergyMobilityInsightsProjection;", context);
const Projection = context.__Projection;
assert.equal(typeof Projection, "function");

const hass = { states: {
  "sensor.energy_asset_metering_index": {
    state: "ready",
    attributes: {
      contract_version: "R1.89.44_CONTRACT",
      records_json: JSON.stringify([
        { period_id:"today", record_role:"flexible_load_detail", ux_visible:true, asset_id:"vehicle_audi_q8", display_name:"Audi Q8", energy_kwh:8.5, unit:"kWh", measurement_state:"TRUSTED" },
        { period_id:"today", record_role:"flexible_load_detail", ux_visible:true, asset_id:"home_battery", display_name:"Home Battery", energy_kwh:4.2, unit:"kWh", measurement_state:"TRUSTED" }
      ])
    }
  },
  "sensor.energy_value_accounting_index": {
    state: "ready",
    attributes: {
      contract_version: "R1.89.44_CONTRACT",
      status:"OK",
      summary_json: JSON.stringify({
        currency:"EUR",
        consumer_allocation:[
          { asset_id:"vehicle_audi_q8", display_name:"Audi Q8", attributed_eur:1.42 },
          { asset_id:"home_battery", display_name:"Home Battery", attributed_eur:0.20 }
        ]
      })
    }
  }
}};
const mobilityRuntime = { mobilityRegistry: () => [{ asset_id:"vehicle_audi_q8", display_name:"Audi Q8" }] };
const model = new Projection(hass, mobilityRuntime).viewModel("today");

assert.equal(model.meteringAvailable, true);
assert.equal(model.valueAvailable, true);
assert.equal(model.rows.length, 1);
assert.equal(model.rows[0].assetId, "vehicle_audi_q8");
assert.equal(model.rows[0].energyKwh, 8.5);
assert.equal(model.rows[0].attributedEur, 1.42);
assert.equal(model.totalVehicleEnergyKwh, 8.5);
assert.equal(model.totalAttributedEur, 1.42);
assert.equal(model.source, "Energy public UX metering/value contracts");

const unavailable = new Projection({states:{}}, mobilityRuntime).viewModel("today");
assert.equal(unavailable.meteringAvailable, false);
assert.equal(unavailable.valueAvailable, false);
assert.equal(unavailable.rows.length, 0);
assert.equal(unavailable.totalAttributedEur, null);

console.log("Energy Mobility Insights projection smoke PASS");
