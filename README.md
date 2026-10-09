# Tidecrown

**Tidecrown: Isles Unclaimed.** A hand-drawn, mobile-first skilling RPG set in the Lantern Sea.

Pillars: explore, discover, take dominion. Influences: Runescape skills, One Piece sea adventure, Adventure Time weirdness.

The journey begins on Driftwood Key. Save data still uses the key `driftwood_key_v1` so existing progress carries over.

## Workflow

- Claude works in its own clone, ships each build as `tidecrown-bNN.zip`, and prints the commit line. Ross unzips into `~\tidecrown` and pushes; GitHub Pages serves `index.html` from the root of `main`.
- `npm run dev` (or `node tools/build.js --watch --serve`) rebuilds on save and serves at http://localhost:5173.
- Add `#dev` to the URL to expose `window.DK` in the console.

## Structure

```
index.html          built game (single self-contained file, served by Pages)
src/index.html      page shell
src/css/, src/js/   concatenated in filename order; all JS shares one closure
tools/build.js      build, watch, and local server
tools/ship-local.js packs a build zip and prints the commit lines
docs/               design rules, history
HANDOFF.md          current state and next task
```

All docs: docs/design-rules.md, docs/HISTORY.md, HANDOFF.md, PROJECT_INSTRUCTIONS.md.
