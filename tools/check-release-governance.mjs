import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const pkg = JSON.parse(read('package.json'));
const compat = JSON.parse(read('COMPATIBILITY.json'));
const manifest = JSON.parse(read('RELEASE_MANIFEST.json'));
const readme = read('README.md');
const changelog = read('CHANGELOG.md');
const status = read('MIGRATION_STATUS.md');

const version = pkg.version;
if (compat.ux_version !== version) throw new Error(`COMPATIBILITY ux_version ${compat.ux_version} != package ${version}`);
if (manifest.version !== version) throw new Error(`RELEASE_MANIFEST version ${manifest.version} != package ${version}`);
if (!readme.includes(`Source candidate: \`v${version}\``)) throw new Error('README source candidate does not match package version');
if (!changelog.includes(`## ${version} `)) throw new Error('CHANGELOG has no current source-candidate entry');
if (!status.includes(`UX version: \`${version}\``)) throw new Error('MIGRATION_STATUS source candidate does not match package version');
if (manifest.publication_authority !== 'github_releases') throw new Error('GitHub Releases must remain publication authority');
console.log(`PASS release governance for source candidate ${version}; published releases remain GitHub Release authority`);
