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
if (occupiedRelation.bucket !== 'unknown') throw new Error(`source/relationship contradiction must fail closed, got ${occupiedRelation.bucket}`);
const falseCharging = availability({ operating:'running', connection:'no_asset_connected' });
if (falseCharging.bucket !== 'unknown') throw new Error('disconnected EVSE running flag cannot imply charging');
const unconfirmedCharging = availability({ operating:'running', connection:'', connectionResolved:false });
if (unconfirmedCharging.bucket !== 'unknown') throw new Error('unverified physical connection cannot imply occupancy');

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
if (projection.intelligence !== undefined || projection.experience !== undefined)
  throw new Error('charger DETAIL must not import Intelligence projections');

function powerEvidence({operating, power, powerResolved = true}) {
  const rt = { chargerProductSnapshot:()=>({
    operating:{resolved:true,value:operating},
    power:{resolved:powerResolved,value:power}
  }) };
  return new Adapter(rt,'charger_test',{registry_entry:{asset_id:'charger_test'}}).chargingPowerEvidence();
}
if (powerEvidence({operating:'charging',power:0}).state !== 'no_measured_power')
  throw new Error('charging with canonical zero must not be presented as live power');
if (powerEvidence({operating:'running',power:0}).state !== 'no_measured_power')
  throw new Error('running with canonical zero must disclose a measured zero');
if (powerEvidence({operating:'charging',power:null,powerResolved:false}).state !== 'unknown')
  throw new Error('missing charger power must not be presented as measured zero');
if (powerEvidence({operating:'charging',power:3.2}).state !== 'measured')
  throw new Error('measured positive power must remain distinct from charging state');
if (powerEvidence({operating:'idle',power:0}).state !== 'measured')
  throw new Error('idle with real measured zero is not a charging contradiction');
console.log('PASS charging state, measured zero and unknown actual power are distinct');

const canonicalModelFixture = (connection, operating, power, requested=2.771) => {
  const a={asset_id:'charger_a',asset_type:'charger',display_name:'Wallbox black'};
  const row=(value,unit='')=>({resolved:value !== null,value,display:value===null?'—':unit?String(value)+' '+unit:String(value),unit,state:value===null?'unknown':'ok'});
  const modelRt={
    ...rt,
    chargerProductSnapshot:()=>({operating:row(operating),connection:row(connection),
      power:row(power,'kW'),connected_vehicle:row(null),health:row('OK')}),
    canonicalChargerPropertyValue:(_id,key)=>key==='charger.requested_charge_power_kw'?row(requested,'kW'):row(null),
    canonicalChargerPropertyDisplay:(_id,key)=>key==='charger.requested_charge_power_kw'?String(requested)+' kW':'—',
    lifecycleStatus:()=> 'active',
    commandActionsFor:()=>[],
    chargerExperienceProjection:()=>{throw Error('Intelligence must not be read by DETAIL')},
    cache:x=>x,assetUrl:()=>'',activityRowsFor:()=>[],
    chargerComponentDetailSections:()=>[],addRelatedAssetDetailLinks:x=>x,
    lifecycleContractGapSection:()=>null,detailRoute:()=>'/detail',visualImageUrl:()=>'',visualImageKey:()=>'', 
    t:(_key,_params,fallback)=>fallback
  };
  return new Adapter(modelRt,'charger_a',{registry_entry:a,dashboard_path:'/dashboard'}).build();
};
const unpluggedRunning=canonicalModelFixture('no_asset_connected','running',2.771);
if(unpluggedRunning.status[0].value!=='State conflict') throw Error('disconnected running charger must show conflict');
if(unpluggedRunning.status[1].value!=='Power conflict') throw Error('disconnected positive charger power is not actual charging');
if(!unpluggedRunning.status[1].subvalue.includes('setpoint')) throw Error('requested power needs separate setpoint label');
const unpluggedIdle=canonicalModelFixture('no_asset_connected','idle',0);
if(unpluggedIdle.status[0].value!=='Not connected') throw Error('disconnected charger is not charging');
if(unpluggedIdle.status[1].value!=='0 kW') throw Error('measured zero is not unavailable');
const suspended=canonicalModelFixture('asset_connected','suspended',0,4.16);
if(suspended.status[0].value!=='suspended') throw Error('connected suspended Peblar must preserve raw operating state');
if(suspended.status[1].value!=='0 kW') throw Error('suspended Peblar has actual zero; requested power is setpoint');
const unknown=canonicalModelFixture('unknown','running',2.771);
if(unknown.status[0].value!=='Connection unverified'||unknown.status[1].value!=='Power unverified')
  throw Error('unknown connector cannot assert charging or actual power');
console.log('PASS DETAIL canonical status vs physical connection, 0/unknown, requested setpoint and contradiction detection');
