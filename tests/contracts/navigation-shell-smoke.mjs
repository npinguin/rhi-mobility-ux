import fs from 'node:fs';

const header=fs.readFileSync(new URL('../../src/app/header-and-navigation.js',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../../src/ui/screens/mobility-dashboard.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/ui/screens/charger-maintenance.js',import.meta.url),'utf8');
const routes=fs.readFileSync(new URL('../../documentation/homebrain_mobility.hacs.yaml',import.meta.url),'utf8');
const required = [
  'key: "mobility"',
  'key: "intelligence"',
  'key: "insights"',
  '{ key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline", path: "/overview" }',
  '{ key: "vehicles", label: "Vehicle Management", icon: "mdi:car-outline", path: "/dashboard" }',
  '{ key: "chargers", label: "Charger Management", icon: "mdi:ev-station", path: "/charger-maintenance" }',
  '{ key: "planning", label: "Planning", icon: "mdi:calendar-clock-outline", path: "/planning" }',
  '{ key: "strategies", label: "Strategies", icon: "mdi:target", path: "/strategies" }',
  '{ key: "history", label: "History", icon: "mdi:chart-timeline-variant", path: "/history" }',
  '{ key: "log", label: "Log", icon: "mdi:format-list-bulleted", path: "/log" }',
  'class="hi-domain-shell hi-nav-',
  'class="hi-module-tabs"',
  'class="domain-tab-icon"',
];
for (const needle of required) if (!header.includes(needle)) throw new Error(`navigation shell missing: ${needle}`);

const mobilityBlock = header.slice(header.indexOf('key: "mobility"'), header.indexOf('key: "intelligence"'));
if (/Planning|Strategies|History|Log/.test(mobilityBlock)) throw new Error('Mobility submenu contains Intelligence/Insights items');

const intelligenceBlock = header.slice(header.indexOf('key: "intelligence"'), header.indexOf('key: "insights"'));
if (!intelligenceBlock.includes('Planning') || !intelligenceBlock.includes('Strategies')) throw new Error('Intelligence submenu drift');

const insightsBlock = header.slice(header.indexOf('key: "insights"'), header.indexOf('const HB_MOBILITY_NAV_ITEMS'));
if (!insightsBlock.includes('History') || !insightsBlock.includes('Log')) throw new Error('Insights submenu drift');

if (!dashboard.includes('const navActive = this.dashboardTabFromRoute()')) throw new Error('dashboard route is not authoritative for Overview/Vehicles state');
if (!dashboard.includes('hbMobilityNav(navActive)')) throw new Error('dashboard does not render canonical navigation from normalized active route');
if (!chargers.includes('hbMobilityNav(this.config?.nav_active || "chargers")')) throw new Error('charger screen does not preserve grouped navigation');

for (const path of ['overview','dashboard','charger-maintenance','planning','strategies','history','log']) {
  if (!routes.includes(`path: ${path}`)) throw new Error(`dashboard route missing: ${path}`);
}

if (!routes.includes('title: Overview\n    path: overview')) throw new Error('Overview route definition missing');
if (!routes.includes('title: Vehicle Management\n    path: dashboard')) throw new Error('Vehicle Management route /dashboard must be preserved');
if (!dashboard.includes('rt.navigate(target)')) throw new Error('Overview/Vehicles navigation must update the canonical URL so refresh preserves the current tab');
if (!dashboard.includes('rememberViewPosition()') || !dashboard.includes('restoreViewPositionOnce()') || !dashboard.includes('window.addEventListener("pagehide"')) throw new Error('Mobility route/refresh position persistence missing');
if (dashboard.includes('hbMobilityPath("/vehicles")')) throw new Error('invalid /vehicles route leaked into dashboard');
if (!routes.includes('title: Charger Management\n    path: charger-maintenance')) throw new Error('Charger Management route must be preserved');
console.log('PASS Mobility route mapping, management naming, URL-authoritative tab state and refresh/position persistence');

if(header.includes('key: "charging"') || routes.includes('path: charging')) throw new Error('synthetic Charging tab/route returned');
