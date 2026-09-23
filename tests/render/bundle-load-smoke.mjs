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
  semanticProperty:(_asset,key)=>key==='asset.profile_id'
    ? {asset_id:'vehicle_test',property_key:key,value:'audi_q8_55_tfsi_e_quattro_my2025',editable:true,write_supported:true,write_binding_type:'select',write_service_domain:'select',write_service_action:'select_option',write_target_entity:'select.vehicle_profile',choices:[{value:'audi_q8_55_tfsi_e_quattro_my2025',label:'Audi Q8'}]}
    : {asset_id:'vehicle_test',property_key:key,value:'audi.q8.4m.2024-2026.tfsi-e.daytona-grey',editable:true,write_supported:true,write_binding_type:'text',write_service_domain:'text',write_service_action:'set_value',write_target_entity:'text.vehicle_image'},
  propertyEditorChoices:(prop)=>prop?.choices || [],
  visualImageKey:()=> 'audi.q8.4m.2024-2026.tfsi-e.daytona-grey',
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
for(const needle of ['data-vehicle-picker-brand','data-vehicle-picker-model','data-vehicle-picker-variant','data-vehicle-picker-color']) {
  if(!detailPicker.includes(needle)) throw new Error(`Vehicle Detail hierarchical picker missing ${needle}`);
}
const Picker=vm.runInContext('HomeBrainVehicleVisualPicker',context);
const id4Rt={
  semanticProperty:(_asset,key)=>key==='asset.profile_id'
    ? {asset_id:'vehicle_id4',property_key:key,value:'volkswagen_id4_pro_my2026',editable:true,write_supported:true,write_binding_type:'select',write_service_domain:'select',write_service_action:'select_option',write_target_entity:'select.id4_profile',choices:[{value:'volkswagen_id4_pro_my2026',label:'Volkswagen ID.4 Pro'}]}
    : {asset_id:'vehicle_id4',property_key:key,value:'volkswagen.id4.2024-2026.ev.scale-silver',editable:true,write_supported:true,write_binding_type:'text',write_service_domain:'text',write_service_action:'set_value',write_target_entity:'text.id4_image'},
  propertyEditorChoices:(prop)=>prop?.choices || [],
  visualImageKey:()=> 'volkswagen.id4.2024-2026.ev.scale-silver',
  isWritableProperty:()=> true,
  assetUrl:(p)=>'/assets/'+p,
  escape:(v)=>String(v??'')
};
const id4Selection=new Picker(id4Rt).selection({asset_id:'vehicle_id4'});
if(id4Selection.brand!=='Volkswagen') throw new Error(`ID.4 picker drifted brand to ${id4Selection.brand}`);
if(id4Selection.model!=='ID.4') throw new Error(`ID.4 picker drifted model to ${id4Selection.model}`);
if(id4Selection.vehicle?.id!=='volkswagen.id4.2024-2026.ev') throw new Error('ID.4 picker did not preserve current variant identity');
if(detailPicker.includes('type="text"')) throw new Error('Vehicle Detail leaked raw vehicle.image_key text editor');

console.log('PASS bundle load, Overview execution, hierarchical Vehicle Detail picker and ID.4 identity prefill');
