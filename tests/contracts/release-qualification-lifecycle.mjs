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
if(!publish.includes('reason=identical_immutable_version_verified')) throw new Error('Published version may be skipped only after byte identity is proved');
if(!publish.includes('diff -qr /tmp/rhi-mobility-published-candidate/dist dist')) throw new Error('Published dist subtree must be compared byte-for-byte');
if(!publish.includes('cmp /tmp/rhi-mobility-published-candidate/hacs.json hacs.json') ||
   !publish.includes('cmp /tmp/rhi-mobility-published-candidate/package.json package.json')) {
  throw new Error('Existing tag skip must verify complete HACS metadata');
}
if(publish.includes('  workflow_dispatch:')) throw new Error('Candidate publication must not bypass successful main Validate');
if(!publish.includes("needs.scope.outputs.publish == 'true'")) throw new Error('candidate publication is not gated by version scope');

const verifyStart=publish.indexOf('\n  verify:');
const publishStart=publish.indexOf('\n  publish:',verifyStart+1);
const verifyBlock=publish.slice(verifyStart,publishStart);
if((verifyBlock.match(/^    if:/gm)||[]).length!==1) throw new Error('Publish HACS verify job must have exactly one YAML if condition');

const rhiGate = JSON.parse(fs.readFileSync(new URL('../../release/COORDINATED_PUBLICATION_GATE.json', import.meta.url),'utf8'));
if(publish.includes('runtime-qa-') || publish.includes('Build isolated non-HACS TEST archive') ||
   publish.includes('QA_SOURCE_LOCK.json')) throw new Error('Parallel non-HACS QA publication reintroduced');
if(!publish.includes('Enforce coordinated source-closure publication freeze') ||
   !publish.includes('needs.scope.outputs.publish')) throw new Error('Canonical HACS release gate missing');
if(rhiGate.publication_hold !== true || rhiGate.mode !== 'MANUAL_COORDINATED_SOURCE_CLOSURE_ONLY' ||
   Object.values(rhiGate.approval).some(v=>v!==null)) throw new Error('Unauthorised HACS test publication');

// Explicit HACS TEST pilot is the ONLY permitted pre-runtime publication mode.
const approvalPilot = rhiGate.test_pilot;
const approvedMatrix = {
  foundation:"v1.8.46",mobility:"v0.10.52",energy:"v0.15.138",
  mobility_ux:"v1.0.0-rc.100",energy_ux:"v4.3.36-rc.21"
};
if (JSON.stringify(approvalPilot.matrix) !== JSON.stringify(approvedMatrix) ||
    approvalPilot.status !== "APPROVED_FOR_TEST_PUBLICATION" ||
    approvalPilot.expected_version !== "1.0.0-rc.100" ||
    approvalPilot.expected_tag !== "v1.0.0-rc.100" ||
    approvalPilot.stable_promotion !== "NO_GO" ||
    approvalPilot.runtime_qualification !== "NOT_EXECUTED" ||
    approvalPilot.channel !== "COORDINATED_HACS_TEST_ONLY" ||
    approvalPilot.release_count_limit !== 1 ||
    approvalPilot.immutable_candidate !== true)
  throw new Error("HACS pilot must match exact five-package matrix; stable remains blocked");
for (const token of [
  "source==main==event.get(\"head_sha\")",
  "event.get(\"conclusion\")==\"success\"",
  "event.get(\"head_branch\")==\"main\"",
  "pilot.get(\"matrix\")==approved_matrix",
  "pilot.get(\"stable_promotion\")==\"NO_GO\"",
]) if(!publish.includes(token)) throw new Error("HACS pilot gate must fail closed: "+token);
