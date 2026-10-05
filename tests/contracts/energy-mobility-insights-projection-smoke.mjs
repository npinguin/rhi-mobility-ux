import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const shared=fs.readFileSync("src/runtime/energy-public-v2-projection.js","utf8");
const source=fs.readFileSync("src/runtime/energy-mobility-insights-projection.js","utf8");
const context={};
vm.createContext(context);
vm.runInContext(shared+"\n"+source+"\nthis.__Projection=HomeBrainEnergyMobilityInsightsProjection;",context);
const Projection=context.__Projection;

const hass={states:{
  "sensor.rhi_energy_public_contract_v2":{
    state:"OK",
    attributes:{
      contract_id:"RHI_ENERGY_PUBLIC_CONTRACT_V2",
      contract_version:"2.0",
      metering:{records:[
        {period_id:"today",record_role:"flexible_load_detail",ux_visible:true,asset_id:"vehicle_audi_q8",display_name:"Audi Q8",energy_kwh:8.5,measurement_state:"TRUSTED"},
        {period_id:"today",record_role:"flexible_load_detail",ux_visible:true,asset_id:"home_battery",energy_kwh:4.2,measurement_state:"TRUSTED"}
      ]},
      value_accounting:{currency:"EUR",status:"OK",periods:{today:{consumer_allocation:[
        {asset_id:"vehicle_audi_q8",display_name:"Audi Q8",attributed_eur:1.42},
        {asset_id:"home_battery",attributed_eur:0.20}
      ]}}}
    }
  }
}};
const mobilityRuntime={mobilityRegistry:()=>[{asset_id:"vehicle_audi_q8",display_name:"Audi Q8"}]};
const model=new Projection(hass,mobilityRuntime).viewModel("today");
assert.equal(model.meteringAvailable,true);
assert.equal(model.valueAvailable,true);
assert.equal(model.rows.length,1);
assert.equal(model.rows[0].energyKwh,8.5);
assert.equal(model.rows[0].attributedEur,1.42);
assert.equal(model.totalVehicleEnergyKwh,null);
assert.equal(model.totalAttributedEur,null);
assert.equal(model.source,"RHI_ENERGY_PUBLIC_CONTRACT_V2.metering/value_accounting");

const legacyOnly={states:{"sensor.energy_value_accounting_index":{state:"ready",attributes:{summary:{consumer_allocation:[{asset_id:"vehicle_audi_q8",attributed_eur:99}]}}}}};
const unavailable=new Projection(legacyOnly,mobilityRuntime).viewModel("today");
assert.equal(unavailable.meteringAvailable,false);
assert.equal(unavailable.valueAvailable,false);
assert.equal(unavailable.rows.length,0);
console.log("Energy Mobility Insights Public V2 projection smoke PASS");
