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
console.log('PASS bundle load and custom-element registration smoke');
