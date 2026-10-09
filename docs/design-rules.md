# Tidecrown design rules

## Vision
Tidecrown: Isles Unclaimed is a mobile-first skilling RPG set in the Lantern Sea. The player washes up on Driftwood Key and grows outward island by island.
Pillars: explore, discover, take dominion. Dominion means tending and keeping, not just conquering: what the player builds, lights, and cares for leaves a lasting mark on the world.
Influences, always checked against all three: Runescape (skills, leveling, gathering and processing loops, banking), One Piece (sea adventure, crew, dreams, lost ships and lore), Adventure Time (sentient objects, gentle weirdness, humor with melancholy underneath). All characters, names, and art are original.
Everything has its place. Every new feature connects to existing systems, lore, or characters.

## Rules
- Intuitive first. Tap does the obvious thing; hold opens options. Examine is always present, and every other option does something different from Examine.
- Mobile first, full screen, minimal overlay. No scrolling menus anywhere. Test at 375x548 and 390x760.
- Show, don't label: icons hopping to the player, flame size and color, XP spark paths.
- Five skills, each a family of specific subskills (see Skills below). A skill is a way of interacting with the world; its subskills share that feel but each is one concrete act with its own loop, levels and unlocks. A subskill earns its place only if it has a loop worth repeating a hundred times. Traversal (climbing, swimming) is gated by gear and skill level, not trained.
- Skill XP is the sum of its subskills plus achievements. Skill levels gate cross-cutting things (building fires, Kindle, islands); subskill levels gate their own content.
- Grind comes from the interlock, not tedium: each skill's output feeds another (fish to pans, wood to hulls), so repetition always has a reason.
- Unlocks are earned through story, discovery, or effort, not just levels. Helpers cost something.
- Islands are discovered by seeing, hearing, reading, or experiencing them, or by wandering the sea at risk.
- Player-facing text: short, warm, a little wry. No em dashes.
- Everything is drawn in code on canvas with the hand-drawn helpers and line boil. No image assets.
- Save key stays driftwood_key_v1. New save fields get safe defaults and old saves are migrated.

## Skills
| Skill | Interaction | Subskills (built ones first) |
|---|---|---|
| Gathering | Wait, then react | Fishing, Woodcutting, Foraging, Growing |
| Survival | Juggle several things at once | Cooking, Firemaking |
| Invention | Fit parts together, no clock | Tinkering (small tools, pans, posts), Shipwright (hulls) |
| Exploration | Read the way through | Delving, Sailing |
| Dominion | Read the tell, then commit | Strife (counter it), Accord (mirror it) |

Planned loops, agreed 9 Oct 2026:
- Tide: a real-time cycle read off the beach (foam line, wet sand, shallows). High tide brings wash-ups; low tide exposes salt flats, tide pools, later a sandbar.
- Foraging: breaking waves run up the beach and reveal what they carried when they pull back; the next wave may take it again; everything on the sand comes from the waves (Mortimer competing still planned); salt sparkle only where a wave has just broken on a hard surface (rocks, pilings, never sand): wet on the hit, sparkle as the foam pulls back, a pinch if you reach it in time; big salt harvest from pools and flats at low tide in a zoomed scene (drag to rake, before the swell). Salt types: rock salt by day, moon salt from glowing pools at night.
- Salt pans: placed anywhere on the flats, more allowed as Foraging levels; built by Tinkering from Foraging and Invention materials. Tiers: driftwood tray, stone-lined (ash sealant), slate, sunstone pan (its own salt). Light upkeep.
- Salt Tin: holds salt apart from the pack; a third button beside the woodpile while cooking seasons the next pan. Brimble gives everyone a tin later; the Galley Runaway's is a head start.
- Gull posts: mobile banking. Tinkering builds a post from driftwood and twine, baited; one gull perches at a time, one bank visit each, then flies; bait sets how soon the next comes (scraps slow, minnows steady, glitter bait fast); materials set how long the post stands (driftwood, wobblewood, charred wobblewood). When it runs out it collapses and leaves guano: flares hotter and faster than kelp, later fertilizer for Growing. A summoning consumable calls one gull now.
- Rod as gear built from parts (blank, line, hook, float), the home for fishing stats; gloves, thimble and cap then get new jobs or go.
- Dominion: every creature telegraphs; counter the tell to break it (materials now) or mirror it to win it over (a lasting helper). Thimble crab's salute is the seed of Accord; Kindle can only be won over.
- Sparks: plain by default; gear and buffs change their behavior; the Blank Map makes some lead to undiscovered things on the current island. Still open.

- Fishing spots roam: they fade in, live a minute or two, fade out and reappear elsewhere. Wild water stays near the north rocks; the glowing pool is a place and stays put.

## Story so far
Driftwood Key, smallest island in the Lantern Sea. Gubbins the talking bucket buys fish. Brimble, a living galley flame, was the stove of the Grinning Gull and floated here in a teapot. Proud, fussy and theatrical, he keeps house in a hollow in the north-east dunes, rebuilding his galley from whatever the tide brings, and teaches Cooking. His dream is to be a ship's galley fire again. The Gull's captain wrote letters signed "C." that wash up in bottles; the Far Light lies past the last lighthouse. Mortimer Gull runs the Gull Post bank and hints he'd fly to you for something crunchy. Kindle, a wild living log, joins your woodpile after three nights of firelight and ash. A stone head hums about the west shore and the moon. A crooked tower blinks on the horizon to the northeast.
