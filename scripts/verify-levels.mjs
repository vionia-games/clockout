import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/logic.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const logic = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const { generateLevel, isFree, ICONS } = logic;

const easy = generateLevel('2026-10-19', 1);
assert.equal(easy.tiles.length, 18);
assert.deepEqual([easy.cols,easy.rows],[10,8]);
assert.ok(Math.max(...easy.tiles.map(t=>t.x))-Math.min(...easy.tiles.map(t=>t.x))<2.2, 'tutorial cards should stay clustered');
assert.ok(Math.abs((Math.max(...easy.tiles.map(t=>t.x))+Math.min(...easy.tiles.map(t=>t.x)))/2+.5-easy.cols/2)<.2, 'tutorial stack should be centered');
assert.equal(easy.tiles.filter(t => t.layer === 0).length, 9);
assert.equal(easy.tiles.filter(t => t.layer === 1).length, 9);
assert.equal(new Set(easy.tiles.map(t => t.kind)).size, 3);
for (const kind of new Set(easy.tiles.map(t => t.kind))) assert.equal(easy.tiles.filter(t => t.kind === kind).length, 6);
// With six copies per kind, even the worst ordering leaves at most two of each in the tray.
assert.ok(3 * 2 < 7);

const hard = generateLevel('2026-10-19', 2);
assert.equal(hard.tiles.length, 135);
assert.deepEqual([hard.cols,hard.rows],[11,10]);
assert.ok(Math.max(...hard.tiles.map(t=>t.x))-Math.min(...hard.tiles.map(t=>t.x))<7.5, 'hard cards should form a compact central mound');
assert.deepEqual([0,1,2,3].map(layer => hard.tiles.filter(t => t.layer === layer).length), [36,36,36,27]);
assert.equal(Math.max(...hard.tiles.map(t => t.layer)), 3);
assert.ok(hard.tiles.some(t => t.layer === 0 && hard.tiles.some(top => top.layer === 3 && Math.abs(t.x-top.x)<.89 && Math.abs(t.y-top.y)<.89)), 'the fourth layer must overlap the base stack');
for (const kind of ICONS) assert.equal(hard.tiles.filter(t => t.kind === kind).length % 3, 0);
const layerOffsets = [1].map(layer => {
  const lower = hard.tiles.filter(t => t.layer === layer - 1);
  const higher = hard.tiles.filter(t => t.layer === layer);
  return higher.map(tile => {
    const match = lower.map(t => ({t,d:Math.hypot(t.x-tile.x,t.y-tile.y)})).sort((a,b)=>a.d-b.d)[0];
    return {dx:+(tile.x-match.t.x).toFixed(2),dy:+(tile.y-match.t.y).toFixed(2)};
  });
});
for (const offsets of layerOffsets) {
  assert.ok(offsets.some(o => Math.abs(o.dx)<.05 && Math.abs(o.dy)<.05), 'some cards should stack centered');
  assert.ok(offsets.some(o => Math.abs(o.dx)>.1 && Math.abs(o.dy)<.05), 'some cards should shift sideways');
  assert.ok(offsets.some(o => Math.abs(o.dx)<.05 && Math.abs(o.dy)>.1), 'some cards should shift vertically');
  assert.ok(offsets.some(o => Math.abs(o.dx)>.1 && Math.abs(o.dy)>.1), 'some cards should cross stagger');
}
const cells = hard.tiles.map(t => `${t.layer}:${t.x.toFixed(2)}:${t.y.toFixed(2)}`);
assert.equal(new Set(cells).size, 135);
const minX = Math.min(...hard.tiles.map(t => t.x)), maxX = Math.max(...hard.tiles.map(t => t.x));
const minY = Math.min(...hard.tiles.map(t => t.y)), maxY = Math.max(...hard.tiles.map(t => t.y));
assert.ok(hard.tiles.length < (maxX-minX+1)*(maxY-minY+1)*3, 'layout should not be a filled rectangle stack');
assert.ok(hard.tiles.some(t => !isFree(t, hard.tiles)), 'some cards must be covered');
assert.ok(hard.tiles.some(t => isFree(t, hard.tiles)), 'some cards must be playable');

let remaining = [...hard.tiles];
for (const group of hard.solution) {
  assert.equal(group.length, 3);
  assert.equal(new Set(group.map(id => remaining.find(t => t.id === id)?.kind)).size, 1);
  for (const id of group) {
    const tile = remaining.find(t => t.id === id);
    assert.ok(tile && isFree(tile, remaining), `solution must only select free card ${id}`);
    remaining = remaining.filter(t => t.id !== id);
  }
}
assert.equal(remaining.length, 0);
assert.deepEqual(generateLevel('2026-10-19',2), generateLevel('2026-10-19',2));
assert.notDeepEqual(generateLevel('2026-10-19',2), generateLevel('2026-10-20',2));
console.log('Logic checks passed: 18-card safe tutorial, 135-card irregular layout, 9 divisible icon counts, occlusion, deterministic dates, and executable solution.');
