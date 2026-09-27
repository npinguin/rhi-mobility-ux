import fs from "node:fs";
import vm from "node:vm";

const core=fs.readFileSync("src/vendor/rhi-ux-core.js","utf8");
const runtime=fs.readFileSync("src/runtime/ha-contract-runtime.js","utf8");
if(!core.includes("function rhiUxRegisterDomainNavigation(")) throw new Error("Core 1.5.1 navigation registry missing");
if(!runtime.includes('domain: "rhi_mobility"')) throw new Error("Mobility must register its producer domain navigation");
if(!runtime.includes('this.assetDetailRoute("{asset_id}")')) throw new Error("Mobility must derive cross-domain route from canonical route factory");
if(runtime.includes('rhiUxRegisterDomainNavigation({ domain: "rhi_energy"')) throw new Error("Mobility may register only its own domain route");

const storage=(()=>{const data={};return {getItem:k=>data[k]??null,setItem:(k,v)=>{data[k]=String(v)}}})();
const context={globalThis:{localStorage:storage},String,Object,Array,JSON,encodeURIComponent};
vm.createContext(context);
vm.runInContext(core,context);
if(!context.rhiUxRegisterDomainNavigation({domain:"rhi_mobility",assetDetailTemplate:"/custom-mobility/asset-detail?asset={asset_id}"},storage)) throw new Error("route registration failed");
const url=context.rhiUxResolveDomainAssetNavigation("rhi_mobility","vehicle one",storage);
if(url!=="/custom-mobility/asset-detail?asset=vehicle%20one") throw new Error("route resolution drift");
console.log("PASS producer-owned cross-domain navigation");
