import fs from 'node:fs';

const pkg=JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url),'utf8'));
const q=JSON.parse(fs.readFileSync(new URL('../release/QUALIFICATION.json', import.meta.url),'utf8'));

if(q.candidate_version!==pkg.version) throw new Error(`qualification version ${q.candidate_version} != package ${pkg.version}`);
if(q.candidate_tag!==`v${pkg.version}`) throw new Error(`qualification tag ${q.candidate_tag} != v${pkg.version}`);

const metadata=new Set(['candidate_version','candidate_tag','candidate_sha']);
const allowed=new Set(['pending','pass','blocked']);
for(const [key,value] of Object.entries(q)) {
  if(metadata.has(key) || key==='stable_promotion') continue;
  if(!allowed.has(String(value))) throw new Error(`invalid qualification state ${key}=${value}`);
}
if(q.candidate_sha!=='pending' && !/^[0-9a-f]{40}$/i.test(String(q.candidate_sha||''))) {
  throw new Error('candidate_sha must be pending or an exact 40-character commit SHA');
}
if(!['blocked','pass'].includes(String(q.stable_promotion))) throw new Error('stable_promotion must be blocked or pass');

const requirePass=process.argv.includes('--require-pass');
if(requirePass) {
  if(!/^[0-9a-f]{40}$/i.test(String(q.candidate_sha||''))) throw new Error('stable release blocked; candidate_sha is not bound to the immutable candidate');
  const pending=Object.entries(q).filter(([key,value])=>!metadata.has(key) && key!=='stable_promotion' && value!=='pass');
  if(pending.length) throw new Error('stable release blocked; qualification not PASS: '+pending.map(([k,v])=>`${k}=${v}`).join(', '));
  if(q.stable_promotion!=='pass') throw new Error('stable release blocked; stable_promotion != pass');
}
console.log(`PASS qualification record ${pkg.version}${requirePass?' (stable gate)':''}`);
