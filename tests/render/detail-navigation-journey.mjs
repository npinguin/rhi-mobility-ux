import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Render the exact built package. Navigation meaning and materialized HTML are
// asserted; CSS viewport pixels remain a target-HA acceptance requirement.
const bundle=fs.readFileSync(new URL('../../dist/rhi-mobility-ux.js',import.meta.url),'utf8');
class HTMLElement { attachShadow(){this.shadowRoot={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};return this.shadowRoot;} }
const registry=new Map();
const customElements={get:(n)=>registry.get(n),define:(n,c)=>registry.set(n,c)};
const location={origin:'https://example.test',href:'https://example.test/mobility/asset-detail?asset=vehicle_vw_id4',pathname:'/mobility/asset-detail',search:'?asset=vehicle_vw_id4',hash:''};
const history={state:null,pushState:(_state,_title,path)=>{const url=new URL(path,location.origin);location.href=url.href;location.pathname=url.pathname;location.search=url.search;location.hash=url.hash;}};
const window={customCards:[],customElements,location,history,dispatchEvent:()=>{}};
const sessionStorage={setItem:()=>{}};
const ctx={console,HTMLElement,customElements,window,location,history,sessionStorage,URL,Event:class Event{},setTimeout,clearTimeout};
ctx.globalThis=ctx;window.window=window;vm.createContext(ctx);
vm.runInContext(bundle,ctx,{timeout:12000});
vm.runInContext('HomeBrainVehicleVisualPicker = class { render(){return "";} }; HomeBrainChargerVisualPicker = class { render(){return "";} };',ctx);
vm.runInContext('hbMobilityNav=()=>""; hbMobilityReleaseFooter=()=>""; rhiMobilityHeroAsset=()=>"";',ctx);
const Shell=vm.runInContext('HomeBrainAssetShell',ctx);
const root={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
const escapes=(s)=>String(s??'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const vehicle={asset_id:'vehicle_vw_id4',display_name:'VW ID.4'};
const charger={asset_id:'charger_peblar',display_name:'Peblar Charger'};
const rt={
  escape:escapes,
  t:(_key,_params={},fallback='')=>fallback,
  cache:(x)=>x,
  backendVersion:()=> 'M0.10.45',
  assetDetailRoute:(asset)=>{
    const id=String(typeof asset==='string'?asset:asset?.asset_id||'');
    return '/mobility/asset-detail?asset='+encodeURIComponent(id)+'#asset='+encodeURIComponent(id);
  },
  assetById:(id)=>id===vehicle.asset_id?vehicle:id===charger.asset_id?charger:null,
  assetDisplayName:(id)=>id===vehicle.asset_id?'VW ID.4':id===charger.asset_id?'Peblar Charger':id
};
const shell=new Shell(root,rt);
shell.renderHeroVisual=()=>'';shell.renderFooter=()=>'';
const tiles=[
 {label:'Range',value:'387 km',icon:'mdi:road-variant'},
 {label:'Charging',value:'Peblar Charger',icon:'mdi:ev-station',detailRoute:rt.assetDetailRoute(charger),detailTitle:'Open Peblar Charger details',subvalue:'Assigned charger'},
 {label:'Security',value:'Security incomplete',icon:'mdi:lock-outline'},
 {label:'Comfort',value:'No comfort data',icon:'mdi:fan'},
 {label:'Maintenance',value:'No maintenance data',icon:'mdi:wrench-outline'}
];
const model=(type,asset,status)=>({
 type,id:asset.asset_id,registryEntry:asset,display:asset.display_name,
 actions:[],sections:[],status,image:'',fallbackImage:'',readiness:'unavailable'
});
shell.render(model('vehicle',vehicle,tiles));
const vehicleHtml=root.innerHTML;
assert.match(vehicleHtml,/class="detail-context-nav"/);
assert.match(vehicleHtml,/Back to Vehicles/);
assert.match(vehicleHtml,/status-count-5/);
assert.match(vehicleHtml,/class="metric-related-value"/);
assert.match(vehicleHtml,/Peblar Charger/);
assert.match(vehicleHtml,/from_asset=vehicle_vw_id4#asset=charger_peblar/);
assert.ok(!vehicleHtml.includes('metric-detail-link"'),'No detached overlay status action');
assert.ok(!vehicleHtml.includes('mdi:plus'),'No add icon for related navigation');
assert.equal((vehicleHtml.match(/class="metric tone-/g)||[]).length,5);
const markupCss=shell.styles();
assert.match(markupCss,/\.detail-status-grid\.status-count-5\{grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
assert.match(markupCss,/\.metric-related-value/);
assert.match(markupCss,/\.row-related-value/);

const linkedRow=shell.renderRow({icon:'mdi:car',label:'Assigned charger',value:'Peblar Charger',detailRoute:rt.assetDetailRoute(charger)});
assert.match(linkedRow,/class="row-related-value"/);
assert.match(linkedRow,/from_asset=vehicle_vw_id4/);
assert.ok(!linkedRow.includes('mdi:plus'));

// Following the link to the charger preserves the vehicle as return target,
// including direct refresh when the query parameters survive the navigation.
// Real browser getAttribute() decodes HTML attribute entities before routing.
const target=(vehicleHtml.match(/class="metric-related-value" data-nav="([^"]+)"/)?.[1]||'').replaceAll('&amp;','&');
assert.ok(target.includes('from_asset=vehicle_vw_id4'));
history.pushState(null,'',target);
const chargerTiles=[
 {label:'State',value:'Idle',icon:'mdi:ev-station'},
 {label:'Power',value:'0.00 kW actual',icon:'mdi:flash'},
 {label:'Vehicle',value:'VW ID.4',icon:'mdi:car',detailRoute:rt.assetDetailRoute(vehicle)}
];
shell.render(model('charger',charger,chargerTiles));
const chargerHtml=root.innerHTML;
assert.match(chargerHtml,/Back to VW ID\.4/);
assert.match(chargerHtml,/status-count-3/);
assert.match(chargerHtml,/from_asset=charger_peblar#asset=vehicle_vw_id4/);
assert.ok(!chargerHtml.includes('mdi:plus'));
assert.ok(!chargerHtml.includes('metric-detail-link"'));
assert.equal((chargerHtml.match(/class="metric tone-/g)||[]).length,3);

// Exercising bootstrap routing rather than only reading its source prevents
// a regression where 'from_asset' disappears during navigation/refresh.
const Runtime=vm.runInContext('HomeBrainAssetRuntime',ctx);
location.pathname='/mobility';location.search='?mobility_view=detail&asset=vehicle_vw_id4';
location.href=location.origin+location.pathname+location.search;
const bootstrap={config:{bootstrap_mode:true,bootstrap_path:'/mobility'}};
Runtime.prototype.navigate.call(bootstrap,rt.assetDetailRoute(charger).replace('/mobility/asset-detail?asset=','/mobility?mobility_view=detail&asset=').replace('#asset=charger_peblar','&from_asset=vehicle_vw_id4'));
assert.match(location.search,/from_asset=vehicle_vw_id4/);
assert.match(location.search,/asset=charger_peblar/);
console.log('PASS linked values not plus buttons, five-field vehicle strip, consistent three-field charger strip, explicit contextual return and bootstrap persistence');
