import assert from 'node:assert/strict';
import fs from 'node:fs';

const dash=fs.readFileSync('src/ui/screens/mobility-dashboard.js','utf8');
const shell=fs.readFileSync('src/ui/components/asset-shell.js','utf8');
const runtime=fs.readFileSync('src/runtime/ha-contract-runtime.js','utf8');

for(const token of [
  'assetPicture(rt, assetOrId',
  'assetIdentityInline(rt, assetOrId',
  'mobilityAssetPicture',
  'this.assetPicture(rt,asset,"vehicle","sm"',
  'this.assetPicture(rt,charger,"charger","xs"',
  'this.assetIdentityInline(rt,a,"vehicle"'
]) assert.ok(dash.includes(token), 'missing Mobility-wide picture primitive: '+token);

assert.ok(runtime.includes('related_asset_type:"vehicle"'));
assert.ok(runtime.includes('related_asset_type:"charger"'));
assert.ok(shell.includes('relatedAssetVisual(row = {})'));
assert.ok(shell.includes('this.relatedAssetVisual(row)'));

console.log('PASS Mobility-wide picture-first asset identity');
