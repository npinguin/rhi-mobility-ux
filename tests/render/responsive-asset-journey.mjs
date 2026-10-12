import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Verify rendered product behavior rather than freezing CSS declarations or
// private helper shapes. Actual computed layout requires target-HA screenshots.
const bundle=fs.readFileSync(new URL('../../dist/rhi-mobility-ux.js',import.meta.url),'utf8');
class HTMLElement { attachShadow(){this.shadowRoot={querySelector(){return null},querySelectorAll(){return []}};return this.shadowRoot;} }
const registry=new Map();
const customElements={get:(name)=>registry.get(name),define:(name,klass)=>registry.set(name,klass)};
const window={customCards:[],customElements,location:{pathname:'/robotix-mobility/0',search:'',hash:''},history:{pushState(){}}};
const context={console,HTMLElement,customElements,window,location:window.location,history:window.history,document:{},setTimeout,clearTimeout};
context.globalThis=context;window.window=window;
vm.createContext(context);
vm.runInContext(bundle,context,{timeout:10000});

const Factory=vm.runInContext('HomeBrainAssetFactory',context);
Factory.prototype.adapterFor=()=>({build:()=>({
  display:'VW ID.4',image:'/assets/id4.webp',
  status:[
    {label:'Range',value:'387 km',subvalue:'Backend-published range evidence'},
    {label:'Security',value:'Incomplete',subvalue:'Security evidence is not fully available'}
  ],
  projection:{relationships:{},commands:[]}
})});
const Dashboard=registry.get('homebrain-mobility-dashboard-card');
const card=new Dashboard();
card._vehicleAppearanceError=new Map();
card._vehiclePickerDraft=new Map();
card._vehiclePickerAsset='';
card.displaySubtitle=()=> '80% battery';
card.chargingContext=()=>({assigned:null,info:{},projection:{}});
card.chargingActivityDisplay=()=> 'Not charging';
card.vehicleVisualSelection=()=>({vehicle:{package_file:'/assets/id4.webp'},color:{filter:'none'}});
card.pendingVehicleAppearance=()=>null;
card.renderVehicleControlRow=()=>'<section class="vehicle-control-row">Charge state</section>';

card.renderChargerAssignmentSelect=()=> '';
const rt={
  assetDetailRoute:(asset)=>'/asset-detail?asset='+asset.asset_id,
  escape:(value)=>String(value??'').replace(/[&<>"]/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])),
  cache:(url)=>url,t:(key,_params={},fallback='')=>({'state.active':'Active','state.disabled':'Disabled','action.activate':'Activate','action.disable':'Disable'}[key]||fallback),
  lifecycleStatus:()=> 'active', lifecycleWriteModel:()=>({disabled:false}),
  vehicleLabel:()=> 'VW ID.4'
};
const html=card.renderVehicle(rt,{asset_id:'vehicle_vw_id4',display_name:'VW ID.4'},[]);
assert.ok(html.includes('VW ID.4') && html.includes('387 km'),'Canonical identity and range must render');
assert.ok(html.indexOf('hero-split-row') < html.indexOf('status-top-row'),'Asset identity must precede secondary statuses');
assert.ok(html.includes('Security evidence is not fully available'),'Full reason must remain available');
assert.equal((html.match(/class="vehicle-card-details mobility-detail-action"/g)||[]).length,1,'One explicit vehicle detail destination');
assert.ok(!html.includes('vehicle-detail-link'),'No floating icon-only vehicle detail overlay');
assert.ok(html.includes('>Details <ha-icon'),'Text detail navigation must be visible');
assert.ok(html.includes('mobility-detail-action'),'Vehicle Details uses same action grammar as Chargers');
assert.ok(html.includes('>Disable</span>') && !html.includes('>Disabled</span>'),'Vehicle lifecycle uses a verb, not a status adjective');

const ChargerAdapter=vm.runInContext('HomeBrainChargerAdapter',context);
ChargerAdapter.prototype.build=()=>({
  display:'wallbox garage white',
  projection:{
    identity:{profile:'Wallbox Commander2 22kw'},
    facts:{operating:{resolved:true,display:'Idle'},connection:{display:'Disconnected'},
      connected_vehicle:{display:'—'},power:{display:'0 kW'},actual_current:{display:'0 A'},
      current_limit:{display:'16 A'},offered_current:{display:'0 A'},
      session_energy:{display:'0 kWh'},health:{resolved:true,display:'Healthy'}},
    relationships:{assigned_vehicle_id:''},commands:[]
  }
});
ChargerAdapter.prototype.chargingPowerEvidence=()=>({state:'measured',label:'',reason:''});
const Charger=registry.get('homebrain-mobility-charger-maintenance-card');
const chargerCard=new Charger();
chargerCard._openPanels=new Set();
chargerCard._chargerPickerAsset='';
chargerCard._chargerAppearanceError=new Map();

const chargerRt={...rt,
  titleize:(value)=>value, lifecycleStatus:()=> 'active',
  commandRegistry:()=>[],backendVersion:()=> 'test'
};
const chargerHtml=chargerCard.renderCharger(chargerRt,{asset_id:'charger_wallbox_white',display_name:'wallbox garage white',profile:'Wallbox Commander2 22kw'});
assert.ok(chargerHtml.includes('wallbox garage white'),'Charger name must render');
assert.ok(!chargerHtml.includes('class="charger-location"'),'Unset location must not appear as an unexplained Not configured label');
assert.equal((chargerHtml.match(/charger-card-details/g)||[]).length,1,'Exactly one contextual charger Details action');
assert.ok(chargerHtml.indexOf('charger-status-strip') < chargerHtml.indexOf('charger-command-row'),'Facts precede actions');
assert.ok(chargerHtml.indexOf('charger-command-row') < chargerHtml.indexOf('charger-card-details'),'Detail action belongs in action row');
assert.ok(chargerHtml.includes('mobility-fact-strip') && chargerHtml.includes('charger-status-fact'),'KPI and status use compact, labelled fact grammar');
assert.ok(chargerHtml.includes('data-lifecycle-value="disabled"') && chargerHtml.includes('>Disable</span>'),'Action is Disable verb, not Disabled status');
assert.ok(!chargerHtml.includes('details-action labeled-action'),'No misplaced detail link in operational badges');
assert.ok(chargerHtml.includes('No direct actions available for this charger.'),'Unavailable commands fail closed in product language');

const css=vm.runInContext('hbMobilityResponsiveFinishStyles()',context);
assert.ok(css.length>0,'Shared presentation grammar must be executable');
console.log('PASS identity-first Vehicles and Chargers, nonduplicated details and truthful missing-data presentation');
