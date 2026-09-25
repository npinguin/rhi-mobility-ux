import assert from 'node:assert/strict';
import fs from 'node:fs';

const vehicle = fs.readFileSync('src/ui/components/vehicle-visual-picker.js','utf8');
const charger = fs.readFileSync('src/ui/components/charger-visual-picker.js','utf8');
const dashboard = fs.readFileSync('src/ui/screens/mobility-dashboard.js','utf8');
const maintenance = fs.readFileSync('src/ui/screens/charger-maintenance.js','utf8');
const styles = fs.readFileSync('src/app/header-and-navigation.js','utf8');

assert.match(vehicle, /visual-choice-grid/);
assert.match(vehicle, /data-vehicle-visual-choice/);
assert.match(vehicle, /row\.package_file/);
assert.match(vehicle, /current\.color\?\.filter/);
assert.match(vehicle, /Apply appearance/);

assert.match(charger, /visual-choice-grid/);
assert.match(charger, /data-charger-visual-choice/);
assert.match(charger, /appearance\.package_file/);
assert.match(charger, /Apply appearance/);

assert.match(dashboard, /data-vehicle-visual-choice/);
assert.match(maintenance, /data-charger-visual-choice/);
assert.match(styles, /\.visual-choice-image img/);
assert.match(styles, /object-fit:contain/);

assert.doesNotMatch(vehicle, /Visual key/);
assert.doesNotMatch(charger, /Visual key/);

console.log('PASS image-first Mobility appearance pickers');
