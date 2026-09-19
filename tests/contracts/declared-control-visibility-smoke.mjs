import fs from 'node:fs';

const source = fs.readFileSync('src/runtime/10-ha-contract-runtime.js', 'utf8');

if (!source.includes('prop.write_declared')) {
  throw new Error('declared backend controls must remain visible while unavailable');
}
if (!source.includes('return this.propertyEditorRow(prop)')) {
  throw new Error('declared controls must render through the property editor row');
}
if (!source.includes('prop.write_blocked_reason')) {
  throw new Error('disabled controls must render the backend-published blocked reason');
}
