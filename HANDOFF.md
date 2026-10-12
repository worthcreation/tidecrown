# Tidecrown: handoff (build 18, 12 Oct 2026)
Current state only. Changes by build: docs/HISTORY.md. Design and story: docs/design-rules.md. Milestones and work order: docs/roadmap.md.

## Workflow
- Start of chat: clone https://github.com/worthcreation/tidecrown.git into /home/claude, `node tools/build.js`, check `const BUILD` in src/js/99-main-loop.js (next build is main's plus one), read Next.
- Edit src/ only. `node tools/build.js` writes two files: index.html (play, MODE 'play', save driftwood_key_v1) and test.html (test, MODE 'test', save driftwood_key_test). Files ending -test.js or -test.css go into test.html only. Test headlessly (Playwright) at 375x548 and 390x760 on test.html, where window.DK exists (state, fn.*, setTide, shEnter, swimTo, clams, curK); for play-only behaviour, copy index.html with the DK line's MODE guard removed.
- Ship: one line at the top of docs/HISTORY.md, `node tools/ship-local.js NN "Build NN: ..."`, present the zip, publish test.html as the play-test artifact, end with the PowerShell and zsh lines and the play link. Claude never commits or pushes. Name any deleted file (an unzip never deletes).
- If Ross has not committed the previous zip, main's BUILD is still the old one: unzip the last zip over the clone and reship under the same number.
- Always ask Ross before building anything, small fixes included; design talk first (reflect as systems, check the pillars, flag, wait for go). Suggest the cheapest fitting model: Haiku for numbers, copy and one-liners; Sonnet for most builds; Opus only for data or save model changes.
- Handoff: rewrite this file, docs/design-rules.md and the project instructions; audit, condense, keep only what is true now.

## Layout
- src/index.html shell; src/css/*.css and src/js/*.js concatenated in filename order into one closure. tools/build.js builds; tools/ship-local.js packs.
- Root also holds CNAME, manifest.webmanifest, icon.svg, icon-512.png, icon-180.png. Never delete them. Pages serves index.html from main at https://tidecrown.worthcreation.com.
- Save key driftwood_key_v1. New fields get defaults; migrations live in 04-state-inventory.

## Code map
- 02-world: Key geometry (iR, gR, wetR), DOCK, tide (tideLevel, DAY_PERIOD 24 min real time, TIDE_PERIOD half), roaming fishing spots, walkable/clampLand (SH-aware, tiny islets walkable via onIsletK).
- 03-data: FISH, EQUIP, ITEMS registry (iget, itemName/Desc/Icon/Val/Key, stackOf; hatchet, dead wood, black, twist and ironbark wood), JOURNAL, ORIGINS, PXP (parent skill levels, 10 levels).
- 04-state-inventory: S, migrations, skill helpers, inventory (addItem, canAdd, cnt); items keep a persistent pack cell (it.c) so gaps survive save and reload.
- 06-interactions: routeTo (land taps and actions; Key detours via the dock root between dock and island), walkStraight (water taps: one straight leg, P.straight, stops where canStep fails), objects(), tap, swipe, longPress, fishing.
- 09-icons: icon(id) cached data URLs, ICV canvases, stackIcon(id,n) and stackTier for count models.
- 23b-shell: the shell hatchet chain (CLAMS on the three nearest reefs, pryClam needs driftwood, startGrind/grindStroke at rocks, GRIND_N strokes saved in S.grind, flint in old saves becomes shellblade).
- 23c-thimble: Sir Thimble's quest (S.q.thimble st 0/1/2, KIT palm/fid/twine, kitSpot with visibility by tide, thimbleSalute, S.know.sewing).
- 29-weather: wxUpdate (WX: wind angle wa, strength ws, cover, rain, fog, seaFog; all from the clock, nothing saved; WXT is the test override), fogAt/fogR/fogHides (objAt skips what fog hides), CLOUDS on a 3000px tile sliding with the wind, drawWeatherWorld (cloud shade, rare low cloud, fog wisps), drawWeatherScreen (rain, fog veil), wxTick (rain drowns fires, washes salt), waveAlign (spawnBreak sizes waves by wind).
- 28-test (test only): Test tab (levels, gear, items, time via DAYOFF, tide via tideF, weather and wind via WXT, wipe via WIPED).
- 08-panel-bank: cntFmt badge; tabs Skills, Pack (true grid, pointer drag and drop: dgMove/dgDrop swap, push-apart insert, drop on a You slot to wear), Journal, You (SLOTS paperdoll, every slot tappable via canFit/wearFrom; Weapon slot holds scarf or hatchet), Map (drawMapTo sea chart; test: names and warps; play: the Key plus an unnamed smudge, no taps), bank.
- 10-update: movement (wading slows with depth; a walk into deep water turns into a swim), day/dark, Key-only logic guarded by !SH.on.
- 11-render: skyLights() each frame sets SKY.sun and SKY.moon (tropical path from S.day) and SHF (lit fires); shadow(x,y,rx,ry,h,cr,m) draws a contact patch plus one cast per light, cr for a tree canopy, m for denser shade with sun flecks. dark comes from the day alone. Key world draw (drawDepthBands, drawIsletLand, islet palms); shWorld() replaces it when SH.on.
- 12-skills-status: SKILLS (five), SUBS, METHODS (the ways under Strife and Accord: scarf, hatchet, thrown, food, ember, light). 13-skill-pages: parentPage, skillPage, ways pages.
- 14-xp-orbs: addXP(sub,...), bursts, HUD bar. 19-woodcutting: chop rhythm, regrow (Key 3 min), shadow trees by twist. 20-fire-life-ash: fires in seconds. 21-cooking. 22-character-creator. 23-tide-foraging: breaking waves, S.shore items, salt.
- 24-shadow: ISLES (seven, irregular outlines via isleR: Landing, Tangle, Thicket, Fallow, Hollow's Isle, Clearing, Far Grove), BRIDGES, shTrees (density-scattered, canopy pass dims the player under it; cuts in S.shCut, no regrowth yet), shWalkable/shClamp, MAWS and DEAD (decoys), MOSS, LAPPERS, HOLLOW, shEnter/shLeave.
- 24b-depth: depthAt(x,y) (0 land to 3 deep; keyDepth on the live tide line, isleDepth per dark island, bars, reefs and tiny islets in KFEAT and SHFEAT), waterCol, drawDepthBands (contour bands), drawIsletLand, drawPalm, onIsletK/onIsletS, nearestIslet. Constants STAND 1, SWIMD .55, SEA_R, FAR_X, SH_WEST.
- 25-swim: the play-only current (CUR0, curK, drawCurrent) past the outer reefs; seaCross only in test. SW state, seaDepth (alias of depthAt), canStep/inSea, swimStart/Stroke/Update (no timer: stop stroking past standing depth and you sink, then wash up at the last shore or islet via noteShore), seaCross (scene swap mid-swim), swimZoom, strokeLen.
- 26-scarf: scarf and hatchet combat (slap, trip, wrap, bind, hew, sweep, swirl), Old Bollard, Hollowmaw and Mossback tells, planting, bursts.
- 27-sound: synthesized music, ambience and SFX with haptics; mute button (#snd, S.st.mute).
- Use fdt for per-frame motion in draw code. Player-facing text: no em dashes.

## Current game
Two builds: play (index.html) is the Key and its sea only, the swim east turned back by a current; test (test.html) opens everything.
Key: creator, Gubbins (fish buyer), Brimble (galley flame, teaches Cooking), Mortimer's bank at the pier, Kindle, stone head, still pool, Old Bollard (practice post), roaming fishing spots, tide and breaking waves, salt, regrowing trees, fires, cooking with buffs, journal, XP bursts, giant clam shells on the nearest reefs and grinding at the rocks for the shell hatchet, and a sea of sandbars, reefs and tiny islands. Five skills on a slow 10-level parent scale; built subskills: Fishing, Woodcutting, Foraging, Cooking, Firemaking, Tinkering, Swimming, Strife, Accord, with ways under Dominion. Scarf and hatchet combat, pack drag and drop, sea chart, synthesized sound.
Shadow Forest (test build only for now): seven islands, reached by map warp or the swim east, long gradual swim with a mid-swim scene change, forests of twisted trees (black wood, twisted wood, ironbark), creatures with tells that Strife and Accord can each set right.

## Next
Work order is docs/roadmap.md. Ross approved the pipeline: terrain height, then shadow regrowth (light and day done in 17, weather in 18); each starts on "next" with a short design check. Then Invention design, which gates the fire ladder, glass and the lantern.
- Tune by play: wave rates, swim feel, depth shelves, jelly density, day and tide lengths, the current's strength, grind stroke count (48), squall frequency, fog thickness, cloud shade strength.
- Open for Ross: the Oilskin Coat's upgrade or take-apart path; at the next handoff, add to the project instructions: attach PROJECT_INSTRUCTIONS.md only when asked, when it changed, or at a handoff; whether to run builds in Claude Code on a branch per build; move the Playwright tests into the repo (tools/tests/).
