import fs from 'node:fs';

const headerUrl=new URL('../src/app/header-and-navigation.js',import.meta.url);
const docUrl=new URL('../documentation/UX_FOOTER_STANDARD.md',import.meta.url);
const source=fs.readFileSync(headerUrl,'utf8');
const doc=fs.readFileSync(docUrl,'utf8');

const required=[
  'class="rhiUxFooter"',
  '<details class="rhiUxFooterDetails">',
  'class="rhiUxFooterPanel"',
  'class="rhiUxFooterProblem"',
  'class="rhiUxFooterAction"',
  'RHI Mobility UX ${esc(UX_VERSION)}',
  'Backend ${esc(backend)}',
  '.rhiUxFooter{display:flex!important;justify-content:center!important;align-items:center!important;flex-wrap:wrap!important;gap:5px 10px!important;',
  'color:#64748b!important',
  'font-size:11px!important',
  'opacity:1!important',
  '.rhiUxFooter>span+span:before{content:"·";margin-right:10px;color:#cbd5e1}',
  '.rhiUxFooterIssue.warning{color:#9a6700!important}',
  '.rhiUxFooterIssue.error{color:#b42318!important}',
  '.rhiUxFooter{font-size:10.5px!important;gap:4px 8px!important;'
];
for(const token of required) if(!source.includes(token)) throw new Error('shared footer/asset contract missing: '+token);
for(const forbidden of ['hi-release-footer','Source Mobility release contract']) if(source.includes(forbidden)) throw new Error('legacy Mobility-specific footer structure remains: '+forbidden);
if(!doc.includes('Hover-only disclosure is not sufficient')) throw new Error('shared footer documentation missing disclosure rule');
console.log('PASS shared readable/actionable footer contract');
