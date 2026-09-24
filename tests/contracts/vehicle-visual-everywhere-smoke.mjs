import assert from 'node:assert/strict';
import fs from 'node:fs';

const router = fs.readFileSync('src/ui/screens/router.js','utf8');
const runtime = fs.readFileSync('src/runtime/ha-contract-runtime.js','utf8');

for (const token of [
  'vehicleIdentity(rt, assetId = ""',
  'this.vehicleIdentity(rt,id,row)',
  'this.vehicleIdentity(rt,assetId,row)',
  'rhiVehicleThumb',
  'visualImageUrl?.'
]) {
  assert.ok(router.includes(token), 'missing routed vehicle visual usage: ' + token);
}
assert.ok(runtime.includes('sensor.mobility_release_identity'));
assert.ok(runtime.includes('contractEntity || identityEntity'));

console.log('PASS vehicle visuals across routed Mobility UX and canonical release identity fallback');
