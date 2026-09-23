import fs from 'node:fs';

const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');

for (const needle of [
  'overviewRangeStatus(rt, vehicles = [])',
  '?.security_intelligence || null',
  '?.maintenance_intelligence || null',
  'attentionCount:security.unsafeCount + maintenance.actionableCount',
  'label:"Configuration", value:"V2 contract gap"',
  'label:"Charging setup"',
  'label:"Data health", value:"V2 contract gap"',
  'const selected = String(rel?.selected || "")',
  'Low-range policy pending V2'
]) if (!dashboard.includes(needle)) throw new Error(`rc.41 V2-first dashboard contract missing: ${needle}`);

for (const forbidden of [
  'const physicalIssues = rows.filter',
  '/unlocked|\\bopen\\b|door|window|check vehicle/i',
  '/tire|tyre|pressure|oil|inspection|service|maintenance.*due|overdue|check/i',
  'assignment?.editor_value ?? assignment?.value',
  'label:"Assigned"',
  'label:"Connected now"'
]) if (dashboard.includes(forbidden)) throw new Error(`rc.41 frontend semantic inference returned: ${forbidden}`);

for (const needle of [
  'const chargerHeaderCards = [',
  'label:"Configuration", value:"V2 contract gap"',
  'label:"Site"',
  'label:"Runtime"',
  'connectedCount} connected · ${chargingCount} charging',
  'charger.available_for_connection',
  'if (faultCount) chargerHeaderCards.push'
]) if (!chargers.includes(needle)) throw new Error(`rc.41 charger management architecture missing: ${needle}`);

for (const forbidden of [
  'label:"Operational"',
  'label:"Power now"',
  'label:"Attention", value:activeChargers.length === operational'
]) if (chargers.includes(forbidden)) throw new Error(`rc.41 obsolete charger top KPI returned: ${forbidden}`);

console.log('PASS rc.41 V2-first status architecture and no-new-frontend-semantics stop/go');
