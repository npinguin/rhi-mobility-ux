import fs from 'node:fs';

const headerUrl=new URL('../src/entry/00-header-and-navigation.js',import.meta.url);
const docUrl=new URL('../documentation/UX_FOOTER_STANDARD.md',import.meta.url);
const source=fs.readFileSync(headerUrl,'utf8');
const doc=fs.readFileSync(docUrl,'utf8');

const required=[
  'class="rhiUxFooter"',
  'class="rhiUxFooterIssue ${severity || "warning"}"',
  'RHI Mobility UX ${esc(UX_VERSION)}',
  'Backend ${esc(backend)}',
  '.rhiUxFooter{display:flex!important;justify-content:center!important;align-items:center!important;flex-wrap:wrap!important;gap:4px 9px!important;',
  'color:#94a3b8!important',
  'font-size:9px!important',
  '.rhiUxFooter span+span:before{content:"·";margin-right:9px;color:#cbd5e1}',
  '.rhiUxFooterIssue.warning{color:#b7791f!important}',
  '.rhiUxFooterIssue.error{color:#b42318!important}',
  '.rhiUxFooter{font-size:8.5px!important;gap:3px 7px!important}'
];
for(const token of required) if(!source.includes(token)) throw new Error('shared footer contract missing: '+token);
for(const forbidden of ['hi-release-footer','Source Mobility release contract']) if(source.includes(forbidden)) throw new Error('legacy Mobility-specific footer structure remains: '+forbidden);
if(!doc.includes('RHI <Module> UX <version> · Backend <version>')) throw new Error('shared footer documentation missing healthy information model');
console.log('PASS shared RHI UX footer structure, styling and information model');
