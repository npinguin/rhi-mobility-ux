import fs from "node:fs";

const adapter = fs.readFileSync("src/domain/adapters/vehicle-adapter.js","utf8");
const presentation = fs.readFileSync("src/app/presentation.js","utf8");

for (const token of [
  '"charger.command.start" || key === "charger.command.start_charging"',
  '"charger.command.stop" || key === "charger.command.stop_charging"',
  'physical_executor_asset_id || command?.asset_id',
  'semanticCommandRole(command)'
]) {
  if (!adapter.includes(token)) throw new Error(`missing semantic command alias closure: ${token}`);
}
if (!adapter.includes('key === "charger.command.start" || key === "charger.command.stop"')) {
  throw new Error("canonical charger start/stop preference missing");
}

for (const token of [
  '@media(max-width:1200px) and (min-width:761px)',
  '.vehicle-intelligence-strip.status-top-row',
  'grid-template-columns:repeat(3,minmax(0,1fr))',
  'overflow:hidden',
  'text-overflow:ellipsis'
]) {
  if (!presentation.includes(token)) throw new Error(`missing tablet containment rule: ${token}`);
}

console.log("PASS rc82 tablet status containment + semantic charger command dedupe");
