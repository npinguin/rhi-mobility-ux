import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const source=fs.readFileSync(fileURLToPath(new URL('../../src/ui/screens/bootstrap.js',import.meta.url)),'utf8');

for(const token of [
  'this._children = new Map()',
  'cacheKey:"dashboard"',
  'cacheKey:"chargers"',
  'let child = this._children.get(childKey)',
  'if (!child)',
  'this._children.set(childKey, child)',
  'mount.replaceChildren(child)',
  'child.hass = this._hass'
]) {
  if(!source.includes(token)) throw new Error(`stable Mobility view identity missing: ${token}`);
}

const createIndex=source.indexOf('child = document.createElement(spec.tag)');
const guardedIndex=source.lastIndexOf('if (!child)',createIndex);
if(createIndex<0 || guardedIndex<0 || createIndex-guardedIndex>200) {
  throw new Error('Mobility bootstrap recreates view children instead of reusing stable instances');
}

const renderStart=source.indexOf('  render() {');
const renderBody=source.slice(renderStart);
const destructive=renderBody.indexOf('this.shadowRoot.innerHTML =');
const mountGuard=renderBody.indexOf('if (!mount)');
if(destructive<0 || mountGuard<0 || destructive<mountGuard) {
  throw new Error('bootstrap root replacement is not guarded by initial mount creation');
}

console.log('PASS Mobility child identity survives backend refresh and tab switches');
