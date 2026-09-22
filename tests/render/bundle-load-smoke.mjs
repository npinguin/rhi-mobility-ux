import fs from 'node:fs';
import vm from 'node:vm';
const bundle=fs.readFileSync(new URL('../../dist/rhi-mobility-ux.js',import.meta.url),'utf8');
const pkg=JSON.parse(fs.readFileSync(new URL('../../package.json',import.meta.url),'utf8'));
class HTMLElement { attachShadow(){this.shadowRoot={innerHTML:'',querySelector(){return null},querySelectorAll(){return []}};return this.shadowRoot;} }
const registry=new Map();
const customElements={get:(n)=>registry.get(n),define:(n,c)=>registry.set(n,c)};
const window={customCards:[],customElements,location:{pathname:'/mobility-supervisor/dashboard',search:'',hash:''},history:{pushState(){}}};
const context={console,HTMLElement,customElements,window,location:window.location,history:window.history,document:{},setTimeout,clearTimeout,globalThis:null};
context.globalThis=context; window.window=window; vm.createContext(context);
vm.runInContext(bundle,context,{timeout:10000});
for(const name of ['homebrain-mobility-dashboard-card','homebrain-vehicle-asset-detail-card','homebrain-charger-asset-detail-card','homebrain-mobility-charger-maintenance-card']){
  if(!registry.has(name)) throw new Error(`custom element not registered: ${name}`);
}
if(window.HomeBrainMobilityAssetsVersion!==pkg.version) throw new Error(`wrong runtime version ${window.HomeBrainMobilityAssetsVersion}; expected ${pkg.version}`);

// Execute the Overview vehicle row. This catches lexical/runtime regressions such
// as using a visual variable that was only declared in another render path.
const Dashboard=registry.get('homebrain-mobility-dashboard-card');
const Factory=vm.runInContext('HomeBrainAssetFactory',context);
Factory.prototype.adapterFor=()=>({build:()=>({display:'Test vehicle',image:'/vehicle.png'})});
const dashboard=new Dashboard();
dashboard.vehicleVisualSelection=()=>({color:{filter:'none'}});
dashboard.overviewVehicleSignals=()=>({energy:null,range:null,security:null,maintenance:null,climate:'N/A'});
dashboard.chargingActivityDisplay=()=> 'N/A';
dashboard.dashboardVehicleCommands=()=>[];
dashboard.renderChargerAssignmentSelect=()=> '';
const rtOverview={
  vehicleLabel:()=> 'Test vehicle',
  assetDetailRoute:()=> '/asset-detail?asset=vehicle_test',
  escape:(v)=>String(v??''),
  cache:(v)=>v
};
const overviewHtml=dashboard.renderOverviewVehicleRow(rtOverview,{asset_id:'vehicle_test'},[]);
if(!overviewHtml.includes('ov-vehicle-row')) throw new Error('Overview vehicle row did not execute');

// Vehicle Detail must use the same verified picker, never the generic raw text
// editor for vehicle.image_key.
const Shell=vm.runInContext('HomeBrainAssetShell',context);
const detailRt={
  propertyByCompoundKey:()=>({asset_id:'vehicle_test',property_key:'vehicle.image_key',value:'vehicle_audi_q8',editable:true}),
  visualImageKey:()=> 'vehicle_audi_q8',
  isWritableProperty:()=> true,
  valueWithoutUnit:(v)=>v,
  uxEditorControlKind:()=> 'text',
  canonicalAssetId:(v)=>v,
  vehicleById:()=>({asset_id:'vehicle_test',asset_type:'vehicle',image_key:'vehicle_audi_q8'}),
  assetById:()=>null,
  assetUrl:(p)=>'/assets/'+p,
  escape:(v)=>String(v??'')
};
const shell=new Shell({},detailRt);
const detailPicker=shell.renderEditableProperty({asset_id:'vehicle_test',property:{asset_id:'vehicle_test',property_key:'vehicle.image_key',value:'vehicle_audi_q8'},icon:'mdi:palette',label:'Vehicle visual'});
if(!detailPicker.includes('data-vehicle-picker-type')) throw new Error('Vehicle Detail does not render the shared vehicle picker');
if(detailPicker.includes('type="text"')) throw new Error('Vehicle Detail leaked raw vehicle.image_key text editor');

console.log('PASS bundle load, Overview execution and shared Vehicle Detail picker smoke');
