import vm from 'vm';
import { sourceModule } from '../helpers/source-fixtures.mjs';

const src = sourceModule('domain/adapters/charger-adapter.js')
  + '\n;globalThis.HomeBrainChargerAdapter = HomeBrainChargerAdapter;';
const ctx = { console, globalThis: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const Adapter = ctx.HomeBrainChargerAdapter;

function availability({ operating, operatingResolved = true, connection, connectionResolved = true, connectedVehicle = false, lifecycle = 'active' }) {
  const rt = {
    lifecycleStatus: () => lifecycle,
    chargerProductSnapshot: () => ({
      operating: { resolved: operatingResolved, value: operating },
      connection: { resolved: connectionResolved, value: connection },
      connected_vehicle: { resolved: connectedVehicle }
    })
  };
  const adapter = new Adapter(rt, 'test', { registry_entry: { asset_id: 'charger_test' } });
  return adapter.overviewAvailability();
}

const free = availability({ operating:'stopped', connection:'disconnected' });
if (free.bucket !== 'free') throw new Error(`expected stopped+disconnected to be free, got ${free.bucket}`);

const occupiedIdle = availability({ operating:'stopped', connection:'connected' });
if (occupiedIdle.bucket !== 'in_use') throw new Error(`idle connected charger must be in_use, got ${occupiedIdle.bucket}`);

const occupiedRelation = availability({ operating:'idle', connection:'disconnected', connectedVehicle:true });
if (occupiedRelation.bucket !== 'in_use') throw new Error(`physical vehicle relation must dominate idle state, got ${occupiedRelation.bucket}`);

const unknownOccupancy = availability({ operating:'stopped', connection:'', connectionResolved:false });
if (unknownOccupancy.bucket !== 'unknown') throw new Error(`unresolved occupancy must not be called free, got ${unknownOccupancy.bucket}`);

const charging = availability({ operating:'running', connection:'connected' });
if (charging.bucket !== 'in_use') throw new Error(`running charger must be in_use, got ${charging.bucket}`);

const fault = availability({ operating:'fault', connection:'disconnected' });
if (fault.bucket !== 'unavailable') throw new Error(`faulted charger must be unavailable, got ${fault.bucket}`);

console.log('PASS overview charger availability distinguishes free from idle-but-occupied');
console.log('PASS unresolved occupancy fails closed instead of inflating free charger count');

// Charger Management must show configured assignment, not merely physical
// connection. The same canonical backend projection owns both independently.
const charger={asset_id:'charger_a',asset_type:'charger',display_name:'Garage Charger'};
const car={asset_id:'vehicle_a',asset_type:'vehicle',display_name:'Audi Q8'};
const baseField={resolved:true,value:'idle',display:'Idle',unit:'',state:'ok'};
const rt={
  lifecycleStatus:()=> 'active',
  chargerById:()=>charger,assetById:id=>id==='vehicle_a'?car:charger,
  vehicleById:id=>id==='vehicle_a'?car:null,
  semanticProperty:(_asset,key)=>key==='asset.profile_id'?{value:'wallbox_ocpp'}:null,
  profileRows:()=>[{profile_id:'wallbox_ocpp',display_name:'Wallbox Commander 2'}],
  relationshipFor:()=>({assigned_vehicle:'vehicle_a',effective_vehicle:'vehicle_a',connected_vehicle:'none',relationship_resolution:'MOBILITY_EXPERIENCE_V2'}),
  chargerProductSnapshot:()=>({operating:baseField,connection:{...baseField,value:'disconnected',display:'Disconnected'},connected_vehicle:{resolved:false,value:null},power:baseField,health:baseField}),
  chargerExperienceProjection:()=>({}),commandActionsFor:()=>[],
  canonicalChargerPropertyValue:()=>baseField,canonicalChargerPropertyDisplay:()=> '—',
  assetDisplayName:id=>id==='vehicle_a'?'Audi Q8':id,assetDetailRoute:id=>'/detail/'+String(id?.asset_id||id),
  titleize:x=>x,visualImageKey:()=>'',visualImageUrl:()=>'',
};
const projection=new Adapter(rt,'charger_a',{registry_entry:charger}).productProjection();
if(projection.relationships.assigned_vehicle_id!=='vehicle_a' ||
   projection.relationships.assigned_vehicle_display_name!=='Audi Q8' ||
   projection.relationships.connected_vehicle_id!=='')
  throw new Error('configured vehicle must be shown without faking physical connection');
if(new Adapter(rt,'charger_a',{registry_entry:charger}).profile()!=='Wallbox Commander 2')
  throw new Error('charger display profile must use its canonical backend catalog');
console.log('PASS charger assignment and profile keep producer identity separate from physical connection');
