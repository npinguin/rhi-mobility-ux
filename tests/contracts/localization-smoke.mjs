import fs from "node:fs";
import vm from "node:vm";

const core=fs.readFileSync("src/vendor/rhi-ux-core.js","utf8");
const i18n=fs.readFileSync("src/app/localization.js","utf8");
const context={String,Object,Array,Set,Number,Date,Intl,globalThis:{},document:{documentElement:{lang:"en"}}};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(core,context);
vm.runInContext(i18n,context);

const resources=vm.runInContext("RHI_MOBILITY_TRANSLATIONS",context);
for(const locale of ["en","nl","fr"]){
  if(!resources[locale]) throw new Error("missing locale: "+locale);
}
const english=Object.keys(resources.en).sort();
for(const locale of ["nl","fr"]){
  const keys=Object.keys(resources[locale]).sort();
  const missing=english.filter(key=>!keys.includes(key));
  const extra=keys.filter(key=>!english.includes(key));
  if(missing.length||extra.length) throw new Error(`${locale} translation key drift; missing=${missing.join(",")} extra=${extra.join(",")}`);
}
const t=(locale,key)=>vm.runInContext(`rhiUxTranslate(RHI_MOBILITY_TRANSLATIONS,${JSON.stringify(key)},{locale:${JSON.stringify(locale)}})`,context);
if(t("nl-BE","nav.vehicles")!=="Voertuigen") throw new Error("nl-BE fallback failed");
if(t("fr-BE","nav.chargers")!=="Bornes") throw new Error("fr-BE fallback failed");
if(t("en","hero.overview.title")!=="Mobility Overview") throw new Error("English baseline drifted");

const machineTokens=[/sensor\./i,/MOBILITY_[A-Z0-9_]+_V2/i,/property_key/i,/command_key/i,/asset_id/i];
for(const locale of ["en","nl","fr"]){
  for(const [key,value] of Object.entries(resources[locale])){
    for(const rx of machineTokens) if(rx.test(String(value))) throw new Error(`${locale}:${key} leaks machine terminology: ${value}`);
  }
}
const pilotFiles=[
  "src/app/header-and-navigation.js",
  "src/ui/components/asset-shell.js",
  "src/ui/components/charger-visual-picker.js",
  "src/ui/components/vehicle-visual-picker.js",
  "src/ui/screens/charger-maintenance.js",
  "src/ui/screens/mobility-dashboard.js",
  "src/ui/screens/router.js",
  "src/domain/adapters/vehicle-adapter.js",
  "src/domain/adapters/charger-adapter.js"
];
const forbiddenPilotLiterals=[
  "<p class=\\\"eyebrow\\\">HOME INTELLIGENCE / MOBILITY</p>",
  ">Active chargers<",
  ">Inactive chargers<",
  ">No active chargers<",
  ">Vehicles<",
  ">Active vehicles<",
  ">Inactive vehicles<",
  ">Dashboard temporarily unavailable<",
  ">Quick actions<",
  ">Save appearance<",
  "title:\"Choose appearance\"",
  "eyebrow:\"Appearance · Charger\"",
  "eyebrow:\"Appearance · Vehicle\"",
  "<h3>What will charge, and when?</h3>",
  "<h3>Mobility energy profiles</h3>",
  "<h3>Vehicle energy & value</h3>",
  "<h3>What happened?</h3>",
  "<h2>Asset not registered</h2>",
  "label:\"No charger\"",
  "label:\"In use\""

];
for(const file of pilotFiles){
  const source=fs.readFileSync(file,"utf8");
  for(const token of forbiddenPilotLiterals){
    if(source.includes(token)) throw new Error(`pilot-visible literal bypasses localization in ${file}: ${token}`);
  }
}
for(const key of [
  "shell.eyebrow","appearance.charger.eyebrow","appearance.vehicle.eyebrow",
  "charger.active","charger.inactive","dashboard.vehicles","dashboard.active_vehicles",
  "dashboard.inactive_vehicles","dashboard.temporarily_unavailable"
]){
  for(const locale of ["en","nl","fr"]) if(!resources[locale][key]) throw new Error(`missing pilot localization ${locale}:${key}`);
}
console.log("PASS Mobility localization: complete EN/NL/FR keys, HA locale fallback, pilot-surface enforcement and user-safe copy");
