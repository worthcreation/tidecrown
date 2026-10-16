# Tidecrown roadmap
Milestones in two groups: what can be built now (designed enough to start), then what needs design before any building. Order inside each group is the working order; Ross can reorder. Design detail lives in docs/design-rules.md; what shipped lives in docs/HISTORY.md.

## Done
- 0 Foundations (builds 1 to 15): the Key, five skills, fishing, woodcutting, foraging, cooking, fires, tide, waves and salt, bank, swimming and water depth, scarf and hatchet combat, sound, the Shadow Forest prototype, straight water taps, stack models.
- 1 Two versions (build 16): play (index.html, Key only, a current turns back the swim east) and test (test.html, open world, map warps, Test tab, own save); both rowboats removed; the shell hatchet chain replaces flint.
- 2 Given-things cleanup, first part (build 16): Sir Thimble's helm is now a quest reward (the sailmaker's kit) with sewing knowledge; the earned/bought/source rules written into design-rules.
- 3 Light and day (build 17): the sky alone sets the light, no darkness floor anywhere; tropical sun, moon and fire shadows on everything; canopy shade with sun flecks.
- 4 Weather (build 18): wandering trade wind that moves trees, the scarf (since removed), smoke and rain; cloud shade; rare low clouds; squalls that drown small fires and wash off salt; dawn fog and sea fog that hide what is out of sight; big waves from the windward side.
- 5 Terrain height (build 19): dunes and a rise on the Key, a landform per dark island, contours and sun hillshade, Tobler walking speed, fog pooling in valleys, wider view from high ground.
- 6 Shadow harvest and regrowth (build 20): branches, limbs and trunk by Woodcutting level, yields that include the lower layers, per-layer regrowth paced by wood, stumps that keep their size, stump digging, sapling poles, a seeded forest age mix with snags.
- Fix (build 21): clouds no longer jump (their drift now builds up frame by frame), cumulus silhouettes drift slowly, and shadows are non-stacking layers per light with cloud cutouts.
- Terrain rework (build 22): real dunes on the Key, smooth cached shading (sky light, sun, hill shadows, height tint), subtler contours, leaning on slopes, sand slides. 
- Height lift (build 23): a 3/4 read of the land, with the shoreline cliff near the stone head fixed and contours made barely visible.
- Occlusion (build 24, replaced in 25): column bands broke on north-south coasts.
- Whole-map ground (build 25): landforms across the whole Key, the ground drawn as one lifted surface with traced ink, occlusion from that surface, Brimble's camp sheltered in dunes, a smaller teapot. Next for this: the same surface for the dark islands.
- Camp move (build 26): Brimble's camp on a sheltered shelf below a central hill, his teapot on the tripod, Walk here in every menu, the Map tab north up.
- High island (build 27): the Key reshaped as a real high island with a summit, windward and lee sides, height zones (sand and palms, scrub, grass, cloud-forest belt of wobble trees, summit rock) and a summit cloud cap. Tune by play: summit height.
- Fixes and scale (build 28): the Key 67% larger with a summit about seven characters up, more trees and palms, dawn moon shadows gone, tighter tap areas, no-hatchet taps walk, bubbles lifted, see-through and paged, long lines shortened, a hearth ring for Brimble, outcrop behind the tripod, softer ground colour edges.
- Fixes (build 29): real sun path (no noon flip), longer bubbles (three lines a page), slower clouds, world-fixed fog wisps, summit cap sized to the island, wash-ups kept to the beach (old ones moved down), curved vegetation edges.
- Taps show only new lines, a quest log with tracking and map marks, a rounded summit with a cairn (build 30).
- Health, death and wrecks (build 43): jelly stings with a beat to catch, drowning, collapse, waking ashore, wrecks that float, sink and get scavenged, the Gull Post's finder's fee. Same build: the tide on every shore, and the minimap covering the whole sea with live tide.
- World memory, first part (build 42): deeds, witnesses, gossip, regard that changes only by deeds, the style picture, the registry and its graph check; Mortimer, Gubbins and Brimble react.
- 6b Weather, tropical (build 36): daily showers, rare monsoons with floods, fish and heavier wash-ups ashore, windfall, Brimble's warning, sky reading by Survival level.

## Buildable now (the approved pipeline, in order)
| # | Milestone | Holds |
|---|---|---|
| 6c | Swimming pickup | While swimming, things in reach are picked up; reach grows with Swimming and Foraging |

After the pipeline: design Invention, then the made-things milestones it unlocks.

## Next batch (agreed at the build 35 handoff)
- 6b Weather, tropical: done in 36. 6c Swimming pickup by reach (Swimming and Foraging levels). 6d Summit to about 13 character heights with a lookout vista at the cairn. 6e Pier to the lee shore and the stone head onto an east headland, moonlit-calm fishing there (confirm).

## Needs design first
| # | Milestone | Missing |
|---|---|---|
| 7 | Invention | Pacing, interactions and feel; many processes, each feeling different (fitting, experiment, shaping, more). The shell needle is its first task |
| 8 | Fire ladder | Waits on Invention: fire ring, real charcoal clamp, hearth with grate, smoking rack, clay oven |
| 9 | Glass and containers | Waits on Invention: sea glass and cullet, furnace, annealing, bottles and jars |
| 10 | Jelly oil and lantern | Waits on Invention: jelly trap, raw and rendered oil, wick, frame, pane, lantern posts |
| 11 | The opening | Scenarios, trait axes, four starting areas, earned keepsakes; idea: arrival on a stormy evening, trees crashing down |
| 12 | Shipwright and Sailing | Boat materials, building, sailing; likely what opens the Shadow Forest in play |
| 13 | Climbing | Rope, knots and grip gear chains |
| 14 | Salvage ladder | Diving, grapnel, dredge (dredging needs a boat) |
| 15 | Dwellers and standing | Name, relocation rules, shelters, jobs, staged decay |
| 16 | The Hollow | Its answer is unwritten |
| 17 | Delving | Underground, untouched |
| Open | Salt's second route | Salt has one way to get it today |

## Audit to do: work that earns nothing
Every task should have at least a chance of reward. Check a missed fishing strike, a cancelled grind, a fire that drowned in the rain and similar, and give each something small (xp, a scrap, knowledge).

## Given today (audit)
Judged against the rules: equippables earned behind a task; bought things never dead ends; each item keeps its own source.
- Origin keepsakes (spyglass, salt tin, whisper shell, blank map) are equipped free at creation. Fails. Fix with The opening: earned in the starting areas.
- Oilskin Coat, bought from Gubbins for shells: allowed as a finished good, but today it is a dead end, and since build 37 it has no effect (its light was removed: a coat does not glow). Needs an upgrade, take-apart or repair path (re-oiling with jelly oil, patching with sewing, cloth for a sail patch).
- Glitter bait: a material used up per cast; passes.
- Barnacle Cap and Kelp Gloves: rare fishing drops gated by level and spot; pass.
- Ash Mustache: Brimble makes it from ash you bring; passes.
- Thimble Helm: now a quest reward; passes (build 16).
- Charcoal comes from ash; the fire ladder's real clamp replaces it.
- Nothing is given: the player washes up bare-handed and makes the longaxe (build 41). The scarf is shelved.
