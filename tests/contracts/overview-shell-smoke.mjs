import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/screens/90-mobility-dashboard-card.js',import.meta.url),'utf8');
const shell=fs.readFileSync(new URL('../../src/components/50-asset-shell-components.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/screens/80-charger-maintenance-card.js',import.meta.url),'utf8');
const placeholder=fs.readFileSync(new URL('../../src/screens/95-placeholder-and-router-cards.js',import.meta.url),'utf8');

for (const needle of [
  'class="ov-hero"',
  'Your mobility at a glance',
  'Energy today',
  'class="ov-quickbar"',
  'class="ov-two-col"',
  '<h2>Vehicles</h2>',
  '<h2>Chargers</h2>',
  '<h2>Recent activity</h2>',
  '<h2>Next actions</h2>',
  'this.renderChargerAssignmentSelect(rt, asset)',
  'this.dashboardVehicleCommands(rt, assetId).slice(0, 2)',
  'Range, charge, security, comfort and maintenance',
  'Backend reported',
  'Not published'
]) if (!dashboard.includes(needle)) throw new Error(`canonical Overview missing: ${needle}`);

if (!dashboard.includes('navActive === "overview"')) throw new Error('Overview/vehicles surface split missing');
if (!dashboard.includes('hbMobilityNav(navActive)')) throw new Error('dashboard does not use canonical shell');

const shellNav = shell.indexOf('${hbMobilityNav(model.type === "charger" ? "chargers" : "vehicles")}');
const hero = shell.indexOf('<section class="hero">');
if (shellNav < 0 || hero < 0 || shellNav > hero) throw new Error('asset detail shell must render canonical navigation before hero');
const heroEnd = shell.indexOf('</section>', hero);
if (shell.slice(hero, heroEnd).includes('hbMobilityNav(')) throw new Error('embedded detail navigation regression');

for (const [name, source] of [['detail',shell],['chargers',chargers],['placeholder',placeholder]]) {
  if (!source.includes('1560px')) throw new Error(`${name} shell width is not aligned to 1560px canonical width`);
}

for (const forbidden of [
  'Energy today</span><b>12.6',
  'All ready</small>',
  '3 available</small>'
]) if (dashboard.includes(forbidden)) throw new Error(`mock-only hardcoded runtime value leaked into product: ${forbidden}`);

console.log('PASS canonical Mobility shell and action-first Overview regression');
