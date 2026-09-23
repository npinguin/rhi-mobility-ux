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
