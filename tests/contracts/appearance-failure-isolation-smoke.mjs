import fs from 'node:fs';
import assert from 'node:assert/strict';
const runtime=fs.readFileSync('src/runtime/ha-contract-runtime.js','utf8');
const picker=fs.readFileSync('src/ui/components/vehicle-visual-picker.js','utf8');
assert.match(runtime,/prop = prop && typeof prop === "object" \? prop : \{\}/);
assert.match(picker,/if \(!profileProp \|\| typeof profileProp !== "object"\) return ""/);
assert.match(picker,/Appearance is temporarily unavailable\. Vehicle data remains available\./);
console.log('PASS appearance failure isolation');
