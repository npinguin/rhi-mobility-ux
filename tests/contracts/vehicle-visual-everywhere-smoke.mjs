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
assert.ok(runtime.includes('mobilityRuntimeV2()?.release'), 'canonical Runtime V2 release identity missing');
assert.ok(runtime.includes('sensor.rhi_mobility_release'), 'modern release entity compatibility fallback missing');
assert.ok(runtime.includes('sensor.mobility_release_identity'), 'legacy release identity compatibility fallback missing');

console.log('PASS vehicle visuals across routed Mobility UX and Runtime V2 release identity authority');
