import fs from 'node:fs';
const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
const compat=JSON.parse(fs.readFileSync(new URL('../COMPATIBILITY.json',import.meta.url),'utf8'));
if(pkg.version!==compat.ux_version) throw new Error(`package/compatibility version mismatch: ${pkg.version} vs ${compat.ux_version}`);
const header=fs.readFileSync(new URL('../src/entry/00-header-and-navigation.js',import.meta.url),'utf8');
if(!header.includes(`const UX_VERSION = "${pkg.version}";`)) throw new Error('UX_VERSION does not match package version');
const isTagRef=process.env.GITHUB_REF_TYPE==='tag'||String(process.env.GITHUB_REF||'').startsWith('refs/tags/');
if(isTagRef && process.env.GITHUB_REF_NAME && process.env.GITHUB_REF_NAME!==`v${pkg.version}`) throw new Error(`tag ${process.env.GITHUB_REF_NAME} does not match v${pkg.version}`);
console.log(`PASS version alignment ${pkg.version}`);
