# Tidecrown: handoff (build 13, 9 Oct 2026)
Current state only. Changes by build: docs/HISTORY.md. Design and story: docs/design-rules.md.

## Workflow
- Start of chat: clone https://github.com/worthcreation/tidecrown.git into /home/claude, `node tools/build.js`, check `const BUILD` in src/js/99-main-loop.js (next build is main's plus one), read Next.
- Edit src/ only. Test headlessly (Playwright) at 375x548 and 390x760; #dev exposes window.DK (state, fn.*, warps, setTide, shEnter, swimTo).
- Ship: one line at the top of docs/HISTORY.md, `node tools/ship-local.js NN "Build NN: ..."`, present the zip, publish the play-test artifact, end with the PowerShell and zsh lines and the play link. Claude never commits or pushes. Name any deleted file (an unzip never deletes).
- If Ross has not committed the previous zip, main's BUILD is still the old one: unzip the last zip over the clone and reship under the same number.
- Handoff: rewrite this file, docs/design-rules.md and the project instructions; audit, condense, keep only what is true now.

## Layout
- src/index.html shell; src/css/*.css and src/js/*.js concatenated in filename order into one closure. tools/build.js builds; tools/ship-local.js packs.
- Root also holds CNAME, manifest.webmanifest, icon.svg, icon-512.png, icon-180.png. Never delete them. Pages serves index.html from main at https://tidecrown.worthcreation.com.
- Save key driftwood_key_v1. New fields get defaults; migrations live in 04-state-inventory.

## Code map
- 02-world: Key geometry (iR, gR, wetR), DOCK, tide (tideLevel, DAY_PERIOD 24 min real time, TIDE_PERIOD half), roaming fishing spots, walkable/clampLand (SH-aware).
- 03-data: FISH, EQUIP, ITEMS registry (iget, itemName/Desc/Icon/Val/Key, stackOf), JOURNAL, ORIGINS.
- 04-state-inventory: S, migrations, skill helpers (hasSkill, unlockSkill, xpOf, lv), inventory (addItem, canAdd, cnt).
- 06-interactions: routeTo, objects() (per-frame cache, Key objects incl. rowboat), tap, swipe, longPress, fishing (goFish, hook).
- 08-panel-bank: tabs Skills, Pack, Journal, You (SLOTS paperdoll), Map (warpTo, testing only), bank.
- 10-update: movement (canStep allows wading; P.swimTo turns a walk into a swim), day/dark, Key-only logic guarded by !SH.on.
- 11-render: Key world draw; shWorld() replaces it when SH.on; dark overlay uses shLights() in the forest; drawFarIsles while swimming east.
- 12-skills-status: SKILLS (five), SUBS (subskills, p: parent, unl), ACH by subskill. 13-skill-pages: parentPage, skillPage.
- 14-xp-orbs: addXP(sub,...), bursts (burst, streak), HUD bar.
- 19-woodcutting: chop rhythm, pulse cue, leafOf/treeReady (S.treeCut, REGROW 3 min), shadow trees chop via shChop.
- 20-fire-life-ash: fires in seconds (FUELSEC, FIRESEC 90, FIRECAP 300), stoke(), burnOut drops.
- 21-cooking: pans, QN/QV/QD, buffs.
- 23-tide-foraging: breaking waves (spawnBreak sizes, coverBreak), S.shore items (grabShore), SURF salt (wet on hit, sparkle on recede, stays until the next hit), Foraging XP.
- 24-shadow: the Shadow Forest cluster. ISLES (seven, each a kind), BRIDGES, one odd-sized cell grid over the cluster (bridges run through cell middles), mazes per maze island, shWalkable/shClamp, grid BFS routing (gridBuild/shRoute), shTrees (walls; middle tree holds a wall; cuts saved in S.shCut, no regrowth), MAWS (real) and DEAD (decoys, same drawing), MOSS, LAPPERS, HOLLOW, FLIES, MUD, SHSPOTS/SHROCK/SHFORAGE, shEnter/shLeave (S.isle, S.shPos).
- 25-swim: SW state, seaDepth/canStep/inSea (both scenes), swimTo/swimStroke/swimUpdate (beat, breath, sink, jellies, floaters, swell drift), drawSwimmer (offscreen tint on the submerged body, flowing sheet), FAR_X lands the long swim at the Landing.
- Use fdt for per-frame motion in draw code. Player-facing text: no em dashes.

## Current game
Key: creator, Gubbins (fish buyer), Brimble (galley flame, teaches Cooking, north-east dunes), Mortimer's bank at the pier, Kindle, stone head, still pool, roaming fishing spots, tide and breaking waves, salt on rocks and pilings, wobble trees that regrow, fires, cooking with buffs, journal, XP bursts, rowboat (placeholder travel). Five skills, built subskills: Fishing, Woodcutting, Foraging, Cooking, Firemaking, Tinkering, Swimming.
Shadow Forest: seven islands (Landing, Maze, Lesser Maze, Fallow, Hollow's Isle, Clearing, Far Grove), two bridges, swims between, creatures with presence and tells, no Dominion loop yet.

## Next
1. Ross is refining the feel of XP bursts: base XP, burst size, shower, label. Planned kinds: Streak, Tempo, Stint (2, 5, 10 min), Mark.
2. Scarf (slap, trip, wrap, bind; reach grows with Dominion; tap and slide; try tap combos), then projectiles (hold on player, drag to target, swipe speed sets propulsion), then the Dominion loop on the forest beasts (Strife counters the tell, Accord mirrors it). Hollowmaw fragments and essence after that.
3. Camps (lean-to, tent, shack, bathtub, auras, wrong-element hazards), where fragments combine.
4. Salt pans and the Salt Tin (Foraging 10 raking scene), gull posts, rod as gear, Mortimer competing for wash-ups, Brimble's galley growing from wash-ups, sparks behavior.
5. Tune by play: wave rates (a new player needs driftwood for Brimble within minutes), swim beat and breath, jelly density, day and tide lengths.
