import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const order = [
  'src/assets/asset-paths.js',
  'src/entry/00-header-and-navigation.js',
  'src/adapters/06-intelligence-model-alignment.js',
  'src/runtime/10-ha-contract-runtime.js',
  'src/view-models/20-asset-factory.js',
  'src/adapters/30-vehicle-adapter.js',
  'src/adapters/40-charger-adapter.js',
  'src/components/50-asset-shell-components.js',
  'src/screens/60-vehicle-detail-card.js',
  'src/screens/70-charger-detail-card.js',
  'src/screens/80-charger-maintenance-card.js',
  'src/screens/90-mobility-dashboard-card.js',
  'src/screens/95-placeholder-and-router-cards.js'
];
const missing = order.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missing.length) throw new Error(`Missing build inputs: ${missing.join(', ')}`);
const banner = `/**\n * Robotix Home Intelligence Mobility UX v${pkg.version}\n * GENERATED FILE - DO NOT EDIT.\n * License: GPL-3.0-only\n */\n\n`;
const rawBody = order.map((rel) => `// ---- ${rel} ----\n${fs.readFileSync(path.join(root, rel), 'utf8').trim()}`).join('\n\n');
const companyLogoSvg = fs.readFileSync(path.join(root, 'src/assets/files/branding/company-logo.svg'), 'utf8').trim();
let body = rawBody.replace('"__RHI_COMPANY_LOGO_INLINE__"', JSON.stringify(companyLogoSvg));
if (body === rawBody) throw new Error('Company logo inline build placeholder not found');
const versionPlaceholder = '"__RHI_UX_VERSION__"';
if (!body.includes(versionPlaceholder)) throw new Error('UX version build placeholder not found');
body = body.replace(versionPlaceholder, JSON.stringify(pkg.version));
const out = path.join(root, 'dist/rhi-mobility-ux.js');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, banner + body + '\n');
const digest = crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex');
fs.writeFileSync(path.join(root, 'dist/rhi-mobility-ux.js.sha256'), `${digest}  rhi-mobility-ux.js\n`);
const assetSource = path.join(root, 'src/assets/files');
const assetDist = path.join(root, 'dist/assets');
const assetRuntime = path.join(root, 'assets');
fs.rmSync(assetDist, { recursive: true, force: true });
fs.rmSync(assetRuntime, { recursive: true, force: true });
fs.cpSync(assetSource, assetDist, { recursive: true });
fs.cpSync(assetSource, assetRuntime, { recursive: true });

console.log(`Built ${order.length} modules -> ${path.relative(root, out)}, checksum ${digest}, and copied runtime assets to dist/assets and assets`);
