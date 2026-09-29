import fs from 'node:fs';

const publish=fs.readFileSync(new URL('../../.github/workflows/publish-hacs.yml',import.meta.url),'utf8');
const validate=fs.readFileSync(new URL('../../.github/workflows/validate.yml',import.meta.url),'utf8');
const release=fs.readFileSync(new URL('../../.github/workflows/release.yml',import.meta.url),'utf8');
const q=JSON.parse(fs.readFileSync(new URL('../../release/QUALIFICATION.json',import.meta.url),'utf8'));
const pkg=JSON.parse(fs.readFileSync(new URL('../../package.json',import.meta.url),'utf8'));

const publishTrigger=publish.split('  workflow_dispatch:')[0];
if(publishTrigger.includes("'release/QUALIFICATION.json'")) throw new Error('qualification evidence must not republish immutable candidate');
if(q.candidate_tag!==`v${pkg.version}`) throw new Error('qualification tag/version drift');
if(q.candidate_sha!=='pending' && !/^[0-9a-f]{40}$/i.test(String(q.candidate_sha||''))) throw new Error('candidate_sha must be pending or exact SHA');
if(!release.includes('CANDIDATE_SHA=$(node -p "require(\'./release/QUALIFICATION.json\').candidate_sha")')) throw new Error('stable flow missing candidate SHA binding');
if(!release.includes('test "$TAG_SHA" = "$CANDIDATE_SHA"')) throw new Error('stable flow does not bind tag SHA to qualification evidence');
if(!release.includes('git archive "${TAG}" dist')) throw new Error('stable flow does not verify immutable complete dist package');
if(!release.includes('sha256sum -c rhi-mobility-ux.js.sha256')) throw new Error('stable flow does not verify immutable runtime checksum inside tag package');
if(!release.includes("'.assets | length'")) throw new Error('stable flow does not verify zero GitHub Release assets');
if(release.includes('test "$(git rev-parse "$TAG_SHA")" = "$(git rev-parse "$GITHUB_SHA")"')) throw new Error('main SHA deadlock regression');
if(release.includes('gh release upload')) throw new Error('stable promotion must not upload GitHub Release assets');

console.log('PASS immutable complete-package candidate qualification lifecycle with zero release assets');

if(validate.includes('Protect immutable published package')) throw new Error('engineering Validate must not force release-version churn');
if(!publish.includes('reason=version_already_published')) throw new Error('Publish HACS must skip an already-published engineering version');
if(!publish.includes("if: needs.scope.outputs.publish == 'true'")) throw new Error('candidate publication is not gated by version scope');

const verifyBlock=publish.slice(publish.indexOf('  verify:'),publish.indexOf('  publish:'));
if((verifyBlock.match(/^    if:/gm)||[]).length!==1) throw new Error('Publish HACS verify job must have exactly one YAML if condition');
