import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const shared=fs.readFileSync("src/runtime/energy-public-v2-projection.js","utf8");
const source=fs.readFileSync("src/runtime/energy-mobility-strategy-projection.js","utf8");
const context={};
vm.createContext(context);
vm.runInContext(shared+"\n"+source+"\nthis.__Projection=HomeBrainEnergyMobilityStrategyProjection;",context);
const Projection=context.__Projection;

const hass={states:{
  "sensor.rhi_energy_public_contract_v2":{
    state:"OK",
    attributes:{
      contract_id:"RHI_ENERGY_PUBLIC_CONTRACT_V2",
      contract_version:"2.0",
      configuration:{strategy:{
        configured:{status:"AVAILABLE",properties:[
          {asset_id:"vehicle_audi_q8",property_id:"vehicle_audi_q8.deadline",value:"07:30"},
          {asset_id:"battery",property_id:"battery.reserve",value:20}
        ]},
        effective:{status:"AVAILABLE",properties:[
          {asset_id:"vehicle_audi_q8",property_id:"vehicle_audi_q8.mode",value:"ready_by"},
          {asset_id:"battery",property_id:"battery.mode",value:"reserve"}
        ]}
      }}
    }
  }
}};
const mobilityRuntime={mobilityRegistry:()=>[{asset_id:"vehicle_audi_q8",display_name:"Audi Q8"}]};
const model=new Projection(hass,mobilityRuntime).viewModel();
assert.equal(model.profilesAvailable,false);
assert.equal(model.effectiveAvailable,true);
assert.equal(model.configured.length,1);
assert.equal(model.effective.length,1);
assert.equal(model.effective[0].asset_id,"vehicle_audi_q8");
assert.equal(model.source,"RHI_ENERGY_PUBLIC_CONTRACT_V2.configuration.strategy");

const legacyOnly={states:{"sensor.energy_strategy_effective_index":{state:"ready",attributes:{effective_strategies:[{asset_id:"vehicle_audi_q8"}]}}}};
const unavailable=new Projection(legacyOnly,mobilityRuntime).viewModel();
assert.equal(unavailable.effectiveAvailable,false);
assert.equal(unavailable.configured.length,0);
assert.equal(unavailable.effective.length,0);
console.log("Energy Mobility Strategy Public V2 projection smoke PASS");
