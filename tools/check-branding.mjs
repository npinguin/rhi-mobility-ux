import fs from 'node:fs';
import crypto from 'node:crypto';

const source=new URL('../src/assets/branding/company-logo.svg',import.meta.url);
const distAsset=new URL('../dist/assets/branding/company-logo.svg',import.meta.url);
const header=new URL('../src/app/header-and-navigation.js',import.meta.url);
const expected='264f0d86798a2a53e30b8beb5cae366e4b0916adbb3716b3deb23b5ddbed053d';

for(const file of [source,distAsset]) if(!fs.existsSync(file)) throw new Error('missing canonical company brand asset: '+file.pathname);
const sourceBytes=fs.readFileSync(source);
const sourceText=sourceBytes.toString('utf8');
const digest=crypto.createHash('sha256').update(sourceBytes).digest('hex');
if(digest!==expected) throw new Error('company-logo.svg drift: '+digest+' != '+expected);
if(!sourceBytes.equals(fs.readFileSync(distAsset))) throw new Error('packaged company logo does not match canonical source');
for(const token of ['Robotix.be','DomotiX · Network · Security','#0B4C86','#5B95C8']) if(!sourceText.includes(token)) throw new Error('canonical company logo missing approved token: '+token);
if(sourceText.includes('<rect') || /background/i.test(sourceText)) throw new Error('company logo must remain transparent');

const headerText=fs.readFileSync(header,'utf8');
for(const token of [
  'const HB_MOBILITY_COMPANY_LOGO_SVG = "__RHI_COMPANY_LOGO_INLINE__";',
  'HB_MOBILITY_COMPANY_LOGO_SVG',
  'class="hi-company-brand"',
  'class="hi-company-logo"'
]) if(!headerText.includes(token)) throw new Error('shared company-brand contract missing: '+token);
for(const forbidden of ['robotix-logo.webp','filter:saturate','data:image/','rhiMobilityAssetUrl(HB_MOBILITY_COMPANY_LOGO']) if(headerText.includes(forbidden)) throw new Error('company-brand drift: '+forbidden);

const distText=fs.readFileSync(new URL('../dist/rhi-mobility-ux.js',import.meta.url),'utf8');
if(distText.includes('__RHI_COMPANY_LOGO_INLINE__')) throw new Error('company logo inline placeholder leaked into runtime bundle');
for(const token of ['Robotix.be','DomotiX · Network · Security','#0B4C86','#5B95C8']) if(!distText.includes(token)) throw new Error('runtime bundle missing inline canonical brand token: '+token);
if(distText.includes('/assets/branding/company-logo.svg')) throw new Error('runtime bundle still depends on external company-logo URL');
console.log('PASS branding ownership: canonical source -> inline runtime + packaged dist asset');
