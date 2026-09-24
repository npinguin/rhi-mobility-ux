import assert from 'node:assert/strict';
import fs from 'node:fs';

const runtime=fs.readFileSync('src/runtime/ha-contract-runtime.js','utf8');

for(const required of [
  'async writePropertyValueAsync(',
  'async writePublishedPropertyAsync(',
  'async writeLifecycleStatusAsync(',
  'waitForCanonicalPropertyReadback('
]){
  assert.ok(runtime.includes(required), 'missing canonical readback write path: '+required);
}

for(const forbidden of [
  '\n  writePropertyValue(prop = {}, value = "")',
  '\n  writePublishedProperty(assetId = "", propertyKey = "", value = "")',
  '\n  writeLifecycleStatus(assetOrId = "", desiredStatus = "")',
  '\n  setMobilityPolicy(policyKey = "", value = "")'
]){
  assert.ok(!runtime.includes(forbidden), 'optimistic/no-readback write API reintroduced: '+forbidden.trim());
}

console.log('PASS all retained Mobility configuration writes use canonical async readback');
