import assert from 'node:assert/strict';
import fs from 'node:fs';

const vehicle = fs.readFileSync('src/ui/components/vehicle-visual-picker.js','utf8');
const charger = fs.readFileSync('src/ui/components/charger-visual-picker.js','utf8');
const shell = fs.readFileSync('src/ui/components/asset-shell.js','utf8');

assert.match(vehicle, /visual-picker-preview/);
assert.match(vehicle, /data-picker-visual-preview="vehicle"/);
assert.match(vehicle, /current\.vehicle\?\.package_file/);
assert.match(vehicle, /current\.color\?\.filter/);

assert.match(charger, /visual-picker-preview/);
assert.match(charger, /data-picker-visual-preview="charger"/);
assert.match(charger, /current\.appearance\?\.package_file/);

assert.match(shell, /data-picker-visual-preview="vehicle"/);
assert.match(shell, /data-picker-visual-preview="charger"/);
assert.match(shell, /pickerPreview\.style\.filter/);
assert.match(shell, /\.visual-picker-preview\{/);

console.log('PASS picture-first Mobility appearance pickers');
