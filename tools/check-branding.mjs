import fs from 'node:fs';
import crypto from 'node:crypto';

const source=new URL('../src/assets/files/branding/company-logo.svg',import.meta.url);
const runtimeAsset=new URL('../assets/branding/company-logo.svg',import.meta.url);
const distAsset=new URL('../dist/assets/branding/company-logo.svg',import.meta.url);
const header=new URL('../src/entry/00-header-and-navigation.js',import.meta.url);
const expected='264f0d86798a2a53e30b8beb5cae366e4b0916adbb3716b3deb23b5ddbed053d';

for(const file of [source,runtimeAsset,distAsset]) if(!fs.existsSync(file)) throw new Error('missing canonical company brand asset: '+file.pathname);
const sourceBytes=fs.readFileSync(source);
const sourceText=sourceBytes.toString('utf8');
const digest=crypto.createHash('sha256').update(sourceBytes).digest('hex');
if(digest!==expected) throw new Error('company-logo.svg drift: '+digest+' != '+expected);
for(const file of [runtimeAsset,distAsset]){
  if(!sourceBytes.equals(fs.readFileSync(file))) throw new Error('generated company logo does not match canonical source: '+file.pathname);
}
for(const token of ['Robotix.be','DomotiX · Network · Security','#0B4C86','#5B95C8']) if(!sourceText.includes(token)) throw new Error('canonical company logo missing approved token: '+token);
if(sourceText.includes('<rect') || /background/i.test(sourceText)) throw new Error('company logo must remain transparent');

const headerText=fs.readFileSync(header,'utf8');
for(const token of [
  'const HB_MOBILITY_COMPANY_LOGO = "branding/company-logo.svg";',
  'rhiMobilityAssetUrl(HB_MOBILITY_COMPANY_LOGO)',
  '--rhi-company-area-min',
  '--rhi-company-area-max',
  '--rhi-company-logo-max-width',
  '--rhi-company-logo-max-height',
  '--rhi-company-logo-padding',
  '--rhi-company-divider',
  'object-fit:contain',
  'object-position:center'
]) if(!headerText.includes(token)) throw new Error('shared company-brand contract missing: '+token);
for(const forbidden of ['robotix-logo.webp','filter:saturate','data:image/']) if(headerText.includes(forbidden)) throw new Error('company-brand drift: '+forbidden);

console.log('PASS shared Robotix company-brand asset, hash, source/generated parity and portable header slot');
