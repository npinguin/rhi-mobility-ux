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


const transportStart=source.indexOf('propertyTransportValue(prop = {}, semanticValue = "")');
const transportEnd=source.indexOf('canonicalWriteValueEqual(',transportStart);
const transportBlock=source.slice(transportStart,transportEnd);
for(const token of [
  'prop.transport_value_field || "transport_value"',
  'match[transportField] ?? match.transport_value',
  'return transport'
]) {
  if(!transportBlock.includes(token)) throw new Error(`select transport projection regression: missing ${token}`);
}
const labelIndex=transportBlock.indexOf('const label = match.label');
const transportIndex=transportBlock.indexOf('const transport = match[transportField]');
if(transportIndex<0 || labelIndex<0 || transportIndex>labelIndex) throw new Error('producer transport_value must take precedence over presentation label');
if(!source.includes('waitForCanonicalPropertyReadback(assetId, propertyKey, value, options)')) throw new Error('canonical readback must remain semantic-value based after transport mapping');
console.log('PASS select writes honor producer transport_value while canonical readback remains semantic');
