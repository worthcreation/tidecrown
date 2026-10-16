// node tools/world-graph.js: reads the world memory registry (src/js/32-world-registry.js, pure data), checks it and
// writes docs/world-graph.md. Exits 1 on errors. tools/build.js runs it first and stops the build if it fails.
// Errors: unknown names; a deed nobody who reacts can ever learn of (orphan deed); a dweller or flock that never
// reacts and passes nothing on (orphan witness); a creature no deed is done to; an event with fewer than two outcomes;
// an outcome with no gift or no line, or a gift the registry does not define (dead end); a hearer with no line for a
// deed it can learn of. Style axes with no source are listed as waiting, not errors.
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');

function load() {
  const code = fs.readFileSync(path.join(root, 'src/js/32-world-registry.js'), 'utf8');
  return vm.runInNewContext(code + '\n;WREG', {});
}

function check(R) {
  const err = [], who = R.who, W = Object.keys(who), deeds = R.deeds, ev = R.events;
  const reacts = new Set(Object.values(ev).map(e => e.who));
  for (const w of W) for (const [to] of (who[w].talks || [])) if (!who[to]) err.push(`${w} talks to unknown ${to}`);
  for (const k in ev) if (!who[ev[k].who]) err.push(`event ${k}: unknown dweller ${ev[k].who}`);
  // who can learn of a deed: its subject (if it feels), witnesses where it happens, then everyone along talk edges
  const learners = {};
  for (const d in deeds) {
    const D = deeds[d];
    if (!who[D.to]) { err.push(`deed ${d}: unknown subject ${D.to}`); continue; }
    if (!['strife', 'accord'].includes(D.hand)) err.push(`deed ${d}: hand must be strife or accord`);
    const L = new Set(), q = [];
    if (who[D.to].kind === 'dweller') q.push(D.to);
    for (const w of W) if (who[w].sees && who[w].sees.some(p => D.where.includes(p))) q.push(w);
    while (q.length) { const w = q.shift(); if (L.has(w)) continue; L.add(w); for (const [to] of (who[w].talks || [])) q.push(to); }
    learners[d] = L;
    if (![...L].some(w => reacts.has(w))) err.push(`orphan deed ${d}: nobody who reacts can learn of it`);
    for (const w of L) if (w !== D.to && who[w].hear && !(who[w].hear[D.line])) err.push(`${w} can learn of ${d} but has no line for '${D.line}'`);
  }
  for (const w of W) {
    const k = who[w].kind;
    if (k === 'creature' && !Object.values(deeds).some(D => D.to === w)) err.push(`orphan creature ${w}: no deed is done to it`);
    if (k !== 'creature' && !reacts.has(w) && !(who[w].talks || []).length) err.push(`orphan witness ${w}: never reacts, tells nobody`);
  }
  for (const k in ev) {
    const O = Object.keys(ev[k].outcomes);
    if (O.length < 2) err.push(`event ${k}: only ${O.length} outcome(s), needs two or more`);
    for (const o of O) {
      const x = ev[k].outcomes[o];
      if (!x.gift || !x.line) err.push(`dead end ${k}.${o}: needs a gift and a line`);
      else if (!R.GIFTS[x.gift]) err.push(`dead end ${k}.${o}: gift '${x.gift}' is not defined in GIFTS`);
      if (!x.when || !Object.keys(x.when).length) err.push(`event ${k}.${o}: no condition`);
    }
  }
  return { err, learners };
}

function md(R, learners) {
  const who = R.who, L = [];
  L.push('# Tidecrown world graph', '', 'Written by tools/world-graph.js from src/js/32-world-registry.js. Do not edit by hand.', '');
  L.push('## Who', '', '| Who | Kind | Sees | Tells (game hours, certainty kept) |', '|---|---|---|---|');
  for (const w in who) { const x = who[w]; L.push(`| ${x.name} (${w}) | ${x.kind} | ${(x.sees || []).join(', ') || '-'} | ${(x.talks || []).map(([t, h, k]) => `${t} (${h}h, ${k})`).join(', ') || '-'} |`); }
  L.push('', '```mermaid', 'graph LR');
  for (const w in who) for (const [t, h] of (who[w].talks || [])) L.push(`  ${w} -->|${h}h| ${t}`);
  for (const d in R.deeds) L.push(`  ${d}([${d}]) -.-> ${R.deeds[d].to}`);
  L.push('```', '');
  L.push('## Deeds', '', '| Deed | Hand | Subject | Where | Regard moves | Can reach |', '|---|---|---|---|---|---|');
  for (const d in R.deeds) { const D = R.deeds[d]; L.push(`| ${d}: ${D.say} | ${D.hand} | ${D.to} | ${D.where.join(', ')} | ${Object.entries(D.fx).map(([a, v]) => a + (v > 0 ? '+' : '') + v).join(' ')} | ${[...learners[d]].join(', ')} |`); }
  L.push('', '## Events', '', '| Event | Outcome | When | Gift |', '|---|---|---|---|');
  for (const k in R.events) for (const o in R.events[k].outcomes) { const x = R.events[k].outcomes[o]; L.push(`| ${k} | ${o} | ${Object.entries(x.when).map(([a, v]) => a + ' >= ' + v).join(', ')} | ${R.GIFTS[x.gift] || x.gift} |`); }
  L.push('', '## Style picture', '', '| Axis | Ends | Fed by |', '|---|---|---|');
  const tags = new Set(Object.values(R.deeds).flatMap(D => D.tags));
  for (const a in R.style) { const s = R.style[a], src = s.from || (s.tags.filter(t => tags.has(t)).join(', ') || 'waiting: no deed carries its tags yet'); L.push(`| ${a} | ${s.ends.join(' / ')} | ${src} |`); }
  L.push('');
  return L.join('\n');
}

function run() {
  let R;
  try { R = load(); } catch (e) { console.log('world graph: registry does not load: ' + e.message); return false; }
  const { err, learners } = check(R);
  if (err.length) { console.log('world graph FAILED:\n  ' + err.join('\n  ')); return false; }
  fs.writeFileSync(path.join(root, 'docs/world-graph.md'), md(R, learners));
  console.log(`world graph ok (${Object.keys(R.who).length} who, ${Object.keys(R.deeds).length} deeds, ${Object.keys(R.events).length} events): docs/world-graph.md`);
  return true;
}
module.exports = { run, check, load };
if (require.main === module) process.exit(run() ? 0 : 1);
