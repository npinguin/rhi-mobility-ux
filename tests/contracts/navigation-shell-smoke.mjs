import fs from 'node:fs';

const header=fs.readFileSync(new URL('../../src/entry/00-header-and-navigation.js',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../../src/screens/90-mobility-dashboard-card.js',import.meta.url),'utf8');
const chargers=fs.readFileSync(new URL('../../src/screens/80-charger-maintenance-card.js',import.meta.url),'utf8');
const routes=fs.readFileSync(new URL('../../documentation/homebrain_mobility.hacs.yaml',import.meta.url),'utf8');
const officialLogo=new URL('../../src/assets/files/branding/company-logo.svg',import.meta.url);
if (!fs.existsSync(officialLogo)) throw new Error('canonical shared Robotix.be logo asset is not packaged in source assets');

const required = [
  'key: "mobility"',
  'key: "intelligence"',
  'key: "insights"',
  '{ key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline", path: "/overview" }',
  '{ key: "vehicles", label: "Vehicles", icon: "mdi:car-outline", path: "/dashboard" }',
  '{ key: "chargers", label: "Chargers", icon: "mdi:ev-station", path: "/charger-maintenance" }',
  '{ key: "charging", label: "Charging", icon: "mdi:lightning-bolt-outline", path: "/charging" }',
  '{ key: "planning", label: "Planning", icon: "mdi:calendar-clock-outline", path: "/planning" }',
  '{ key: "strategies", label: "Strategies", icon: "mdi:target", path: "/strategies" }',
  '{ key: "history", label: "History", icon: "mdi:chart-timeline-variant", path: "/history" }',
  '{ key: "log", label: "Log", icon: "mdi:format-list-bulleted", path: "/log" }',
  'class="hi-domain-shell"',
  'class="hi-module-tabs"',
  'class="hi-product-area"',
  'class="hi-company-brand"',
  'branding/company-logo.svg',
  'class="hi-company-logo"',
  'class="domain-tab-icon"',
  '--rhi-company-logo-max-width',
  'font-family:Inter,ui-sans-serif'
];
for (const needle of required) if (!header.includes(needle)) throw new Error(`navigation shell missing: ${needle}`);

const mobilityBlock = header.slice(header.indexOf('key: "mobility"'), header.indexOf('key: "intelligence"'));
if (/Planning|Strategies|History|Log/.test(mobilityBlock)) throw new Error('Mobility submenu contains Intelligence/Insights items');

const intelligenceBlock = header.slice(header.indexOf('key: "intelligence"'), header.indexOf('key: "insights"'));
if (!intelligenceBlock.includes('Planning') || !intelligenceBlock.includes('Strategies')) throw new Error('Intelligence submenu drift');

const insightsBlock = header.slice(header.indexOf('key: "insights"'), header.indexOf('const HB_MOBILITY_NAV_ITEMS'));
if (!insightsBlock.includes('History') || !insightsBlock.includes('Log')) throw new Error('Insights submenu drift');

if (!dashboard.includes('const navActive = this.config?.nav_active || "vehicles"')) throw new Error('legacy dashboard mount does not default to Vehicles navigation');
if (!dashboard.includes('hbMobilityNav(navActive)')) throw new Error('dashboard does not render canonical navigation from normalized active route');
if (!chargers.includes('hbMobilityNav(this.config?.nav_active || "chargers")')) throw new Error('charger screen does not preserve grouped navigation');

for (const path of ['overview','dashboard','charger-maintenance','charging','planning','strategies','history','log']) {
  if (!routes.includes(`path: ${path}`)) throw new Error(`dashboard route missing: ${path}`);
}

if (!routes.includes('title: Overview\n    path: overview')) throw new Error('Overview must be additive on /overview');
if (!routes.includes('title: Vehicles\n    path: dashboard')) throw new Error('legacy Vehicles route /dashboard must be preserved');
console.log('PASS unified RHI Mobility header, shared brand asset, compact secondary icons and additive grouped navigation');
