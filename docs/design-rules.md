# Tidecrown design rules

## Vision
Tidecrown: Isles Unclaimed is a mobile-first skilling RPG set in the Lantern Sea. The player washes up on Driftwood Key and grows outward island by island.
Pillars: explore, discover, take dominion. Dominion is not tending over conquering; it is the open hand or the closed fist, and neither sits on top. What the player builds, lights, tends or takes leaves a lasting mark, and that mark can fade without upkeep.
Influences, each feature checked against all three: Runescape (skills, loops, banking, timing in its ballpark), One Piece (sea, crew, dreams, lost ships), Adventure Time (sentient objects, gentle weirdness, humour with melancholy underneath). All characters, names and art are original. Everything has its place; every feature connects to existing systems, lore or characters.

## Rules
- Intuitive first. Tap does the obvious thing; hold opens options; Examine is always there and every other option does something different.
- Mobile first, full screen, no scrolling menus. Test at 375x548 and 390x760.
- Show, don't label: icons hop to the player, flames change size and colour, sparks have paths.
- Five skills, each a family of specific subskills. A skill is a way of interacting with the world; a subskill is one concrete act with its own loop, levels and unlocks, and earns its place only if the loop is worth repeating a hundred times.
- Skill XP is the sum of its subskills plus achievements. Skill levels gate cross-cutting things; subskill levels gate their own content.
- XP is a quiet trickle; the pay is in bursts (Streak, Tempo, Stint, Mark) hidden in each subskill, found by doing, named only when earned.
- What you need is found near you, in most instances.
- Grind comes from the interlock, not tedium: every skill's output feeds another.
- Unlocks are earned through story, discovery or effort, not just levels. Helpers cost something.
- Beasts are dangerous unless avoided. Approaching one means combat, or being prepared with the right equipment to help, harvest, solve, guide and be generous. Preparation is the Accord path.
- Nothing that lets the player act on the world is ever simply given. Every tool and object comes from a skill chain: gathered, refined and crafted, or dropped by a creature through Strife or Accord. The one exception is bootstrapping (see Character creation): the player starts with nothing, and the very first scarf and first crude tool exist only to get hands moving. After that first craft, the rule is absolute.
- Real-world fidelity: anything made of matter follows real-world processes, simplified for play but never invented or bent. Fantasy is confined to a short, named list (see Named fantasy) and nothing outside it bends reality's rules.
- Equippables are earned, never free: made, dropped by a creature, or a reward, and every drop or reward sits behind a real task, quest or gate.
- Bought things are never dead ends. Finished goods may be bought, but anything bought can be upgraded, taken apart into parts, or wears out and needs repair, so it stays tied to the skills.
- Items keep their own source: some are only made, some only found, some both. No item needs two routes.
- Every real-world problem has at least two solutions, through different skills or different materials, so no single path is mandatory. This is judged on needs (staying warm, crossing water), not on single items. Audit new systems against this; Salt currently may only have one route and needs a second.
- Some tasks are meant to be long and a little dreaded, run mostly on real time, with a big payoff and a real risk of loss if rushed or neglected (a charcoal clamp, annealing glass, smoking fish, a salt pan, rendering oil).
- Standing, not a fixed balance: Strife and Accord are both always valid, and neither is mechanically superior across the board. At any one moment one may clearly be the better call for a given problem, but the world keeps moving under the player (weather, seasons, a hunted population thinning, a tended one paying off), so a method that was correct can quietly stop being correct. The player must keep reading the world, not lock in one dominant strategy.
- Entropy: everything the player changes reverts toward how it was without upkeep, moving through visible stages (sound, worn, failing, reverted) with cheap repair before the final stage, never vanishing in one step.
- Player-facing text: short, warm, a little wry. No em dashes.
- Everything is drawn in code on canvas with the hand-drawn helpers and line boil. No image assets (app icons excepted).
- Save key stays driftwood_key_v1; old saves migrate.

## Named fantasy
Everything else in the world follows real-world rules, simplified but not bent. These are the exceptions, and the list stays short:
- Sentient things: Gubbins, Brimble, Kindle, and dwellers like them.
- Creatures with no real-world equivalent: Mossbacks, Hollowmaws, Moonlappers.
- Materials: jelly oil (real process, fantastic source), ember pearl, sunstone, moonkoi.
- Miasma, the Hollow's dark atmosphere; unlike real fog it retreats from a lit lantern post.

## Skills
| Skill | Interaction | Subskills (built first) |
|---|---|---|
| Gathering | Wait, then react | Fishing, Woodcutting, Foraging, Growing |
| Survival | Juggle several things at once | Cooking, Firemaking |
| Invention | Fit parts together, no clock | Tinkering, Shipwright |
| Exploration | Read the way through | Swimming, Delving, Sailing, and likely Climbing |
| Dominion | Read the tell, then commit | Strife (the taking hand), Accord (the keeping hand) |

Parent skill XP is 5% of its subskills' XP plus 50 per achievement, on its own 10-level scale (so a parent always trails its subskills).

## Character creation (planned rework)
No menu, no sliders, no picking a kin or a colour from a list. The player is never shown on screen until the opening sequence resolves.
- The opening is a short series of forced, embodied scenes, not explained as a personality test: something sinking, a choice to save someone or save yourself, an obstacle to force, go around or wait out, a pull toward light or dark. The player responds; nothing is scored visibly.
- Appearance accumulates as a readout of those responses (brave or cautious, forceful or careful, drawn to light or dark, and so on) the same way scars, build and bearing will keep accumulating for the rest of the game from later play. The still pool is where the player sees this readout, not where they set it.
- The four origins survive in spirit but change shape: the opening's choices sort the player toward one of four starting areas rather than the player picking one from a list, and each area's keepsake item must be found and earned there through play. A player who does not go looking does not get it.
- This is the first instance of the earn-everything rule: the opening produces a first crude scarf and a first crude tool, just enough to gather and craft the player's first real item. Every item after that follows the full chain.
- Not yet fleshed out: the actual scenarios, the trait axes they write to, and the four starting areas themselves.

## World systems (built)
- Timing in the Runescape ballpark: fires of 90 s you feed, trees back in 3 min, fishing spots that roam every 2 to 5 min, a 24-minute real-time day with two tides, the water always moving. Dial by play.
- Tide: read off the beach (foam line, wet sand). High tide brings wash-ups; low tide bares the wet band and the rock pools.
- Waves: a swell builds, foam runs up the beach, and what it carried lies there when it pulls back; the next wave may take it. Small waves break on shore, rocks and pier and carry at most one thing; rare big ones run far up and carry up to three. Everything on the sand comes from waves, and only small things wash up (shells, pebbles, kelp, salt, sticks, bottles). Heavier things (anchors, hull timbers, brass, lenses) stay on the bottom and need salvage.
- Salvage ladder: reach by hand in the shallows, free-dive for the deeper, a grapnel line for deep, a dredge net worked from a boat for the heaviest. Iron corrodes in sea water; brass and bronze hold up better, and salvaged scrap is what a forge later turns into a permanent metal lantern frame.
- Salt: only where a wave has just broken on a hard surface (rocks, pilings, never sand), wet on the hit, sparkle on the pull-back about half the time, staying until the next wave hits that surface; waves aim at salted surfaces more often than not.
- Trees: a chopped Key tree drops a branch, loses its canopy, grows back in minutes; a small pulse marks the beat window.
- Shadow trees (built, build 20) have three layers: branches, limbs, trunk. Woodcutting level sets the deepest layer you may take on each wood (branches always; limbs at 1, 5, 12 and the trunk at 1, 10, 20 for black wood, twisted wood, ironbark). Each harvest also yields the layers below it in lesser amounts, and a branches-only harvest gives the most branches; above the wood's level a felled trunk gives more logs. The tree loses only what you took: branches regrow in about a twentieth of the tree's time, limbs a quarter, and a felled trunk goes stump, sapling, young tree, full. Paced by wood in elapsed time: black wood about a day, twisted wood two, ironbark three. Stumps keep the size the tree had reached. Digging out a stump always gives root wood, with a chance of fatwood, a burl, grubs (bait) or, rarely, something the forest swallowed; the spot then sits bare before a sapling shows, so digging slows regrowth and never stops it. Saplings cut for a pole go back to a small stump. Each forest starts with a mix of saplings, young trees and dead standing snags from its seeds (no simulated life cycle); snags are dry wood, felled at the wood's level. The more twisted a shadow tree, the harder its wood (black wood, twisted wood, ironbark), and the hardest wood is what big projects want.
- Any work has at least a chance of reward; failed or partial work still leaves something.
- Water depth: every point of sea has a depth in body units, 0 at the waterline to 1 where the player can no longer stand. Every shore (the Key's live tide line and each dark island's) shelves out then drops, with shelf length and drop steepness varying around the shore, so some stretches are a long gentle wade and others fall away in a few steps. Colour is drawn from the same depth numbers as contour bands, deepest first, so gentle slopes read as wide bands and drop-offs as a tight edge.
- Open water has variety, not just empty crossing: sandbars (some nearly breaking the surface), reefs, and tiny islands, some with trees, scattered through both the Key's waters and the dark islands' waters. No end to how many can exist as new regions are built.
- Swimming: walk straight into the water and slow as it deepens (to about a third speed at chest height), body sinking to match. Past standing depth you are swimming; a slide strokes with the slide's direction as heading and its length and speed as the push, a tap treads water and holds position, on the beat for breath and a streak. Stop stroking past standing depth and you sink: bubbles, then shaking, then black, then the sea carries you back to the last shore (island or tiny islet) you passed. Stand up again the moment you reach water you can stand in. The crossing to the Shadow Forest is long and the water darkens gradually as you go (farness; the sky does not), with the scene itself changing far out at sea, mid-swim, so the dark islands are always approached, never arrived at. The camera pulls back on open water and eases in as a shore nears.
- Tap in water walks straight at the point, no detour, and stops where something blocks the way (a tree, the edge of the sea); wading past standing depth turns it into a swim. Taps on land still route.
- Stacks show their count the Runescape way, in pack and bank: one to five laid out (six to nine look like five), a small pile from 10, a pile from 25, a heap from 100, a big heap from 250, a mound from 1000. The count badge stays.
- Two builds from one source: play is the game as it stands for a player (today the Key and its sea; the Shadow Forest waits for a real way there); test opens the world, warps from the map and dials levels, gear, items, time and tide. Test keeps its own save.
- The current: past the Key's outer reefs a strong outgoing current sets back toward the Key, harder the farther out, shown as streaks on the water. It is the play build's edge, a real thing rather than a wall.
- The first tool is a shell hatchet. The Key is sand with almost no stone, so, as on real low atolls, the blade comes from a giant clam shell: pried off a reef with a driftwood lever, its thick hinge ground on rock with wet sand over many strokes (progress keeps), then lashed to driftwood with kelp twine. No flint, no boats: nothing on the Key exists for the player unless they make it.
- Gear: the You tab is a Runescape-shaped paperdoll with ten slots and the character drawn as they are.

## Planned (not built)

## Light and darkness (built, build 17)
- One true light source: the sky. The day and night cycle runs everywhere, including the Shadow Forest; nothing holds a fixed darkness floor. The sky dims only for a reason: climate (weather, later) or an island's own theme, such as a canopy.
- The Lantern Sea is tropical: the sun rises east, passes nearly overhead and sets west. Everything casts a shadow away from the sun: long west at dawn, almost none at noon, long east at dusk, so the ground tells the hour. A moon on the opposite path casts faint shadows at night. Every lit fire casts shadows outward, stronger after dark; lanterns will too.
- Light stacks: sky light, then cloud shade (weather, later), then canopy shade. Only fire and lanterns add light.
- Canopy shade is the trees' own shadows: dense forest overlaps them into deep shade, with a few coins of sunlight through the gaps. By island: the Tangle darkest, the Thicket and Far Grove dim, Landing mixed, the Clearing open, the Fallow flat grey. Felling a canopy (Strife) lets light in; pruning, coppicing or a lit lantern post (Accord) are the tending routes.
- Dark seas are a water property: forest runoff stains the water (tannins, silt), tea-dark to black near the dark islands. The sky does not dim for distance.
- Night with no light of your own is near black under canopy; light sources are few today and more come as the game grows.
- The cycle has to matter: Moonlappers need the moon and thin it; open ground keeps moonlight and stays navigable at night; jellies, fireflies and moonkoi read differently after dark; Kindle's three-night trust needs real nights.

## Weather (built, build 18)
- Two layers, both pure functions of time and place, nothing saved, so everyone sees the same sky: a travelling base system (wind, cloud, squalls, fog) plus fixed terrain modifiers that lessen or enhance whatever passes through a place.
- Wind: a trade wind from the east that wanders slowly in direction and strength, stronger in a squall. It touches everything it can, gently: trees and palms sway with it, the scarf streams with it, smoke drifts with it, rain slants with it, clouds and fog travel with it. Strong wind is kept for places where it is the narrative or the challenge.
- Waves still reach every shore of the Key, but the biggest ones come from the windward side; the lee gets small ones.
- Clouds travel with the wind. Low puffy cloud casts crisp moving shade, thin high cloud faint shade, none at night; under a cloud every shadow goes faint because the sun is covered. Now and then a low cloud passes below the view as soft white; not often.
- Squalls: about one fifteen-minute stretch in seven holds a squall that swells, peaks and passes in about five minutes. Rain greys the light a little, small fires drown in seconds, big fires burn down faster, Brimble keeps his hearth going, and drying salt washes off and cannot form until it passes.
- Fog: dawn radiation fog, some mornings none and some thick, building before sunrise and burning off by late morning. Fog cuts how far you can see without darkening anything, and what lies beyond your sight cannot be seen or touched. Terrain: open sand clears fastest, grass slower, the sea holds it; the cold dark water over the current keeps a sea fog most of the time, hiding the dark islands; in the forest the Clearing clears first, the Tangle holds longest, the Fallow worst.
- Not built yet: miasma (tied to the Hollow and the Fallow, retreats from a lit lantern post), sea and land breezes, and weather shaping (windbreaks, planting, felling, fog nets, lantern posts), which is late game, local only, and needs upkeep. Reading the sky comes before shaping it.

## Terrain height (first part built, build 19)
- Built in 19: the Key has low dunes along the sand and one low rise inland under the stone head; the dark islands each have a landform (the Thicket rolling hills, the Tangle ravines, the Far Grove the tallest hill as a lookout, the Clearing a shallow bowl, the Fallow a sunken basin, the Hollow a real hollow). Soft contour lines and hillshade from the sun, so slopes facing away stay shaded and the shade swings through the day. Walking speed follows Tobler's hiking function (fastest on a gentle downhill, slower climbing or on steep descents). Valleys hold fog longer, high ground sheds it and sees farther through it, and the camera eases out a little on high ground. No impassable ground yet; cliffs and scree wait for Climbing, and every one will have a way around.
- Each island (beyond the Key, which stays small, dunes and one low rise) can carry a height field from its seed, drawn as contour bands and slope shading, nothing saved. Slope sets walking speed on a real hiking-pace basis (time scales with distance and more steeply with climb).
- Landforms: hills (wider view, good for spotting islands and reading weather), valleys (easy going, water and fog pool here, good soil), saddles (the natural pass between peaks), cliffs and scree (steep rock, loose stone), mountains (real cooling with altitude, a snow line, cloud sitting on peaks, rain on the windward side and a dry rain shadow beyond). Slopes facing away from the sun stay shaded, which shows on the ground through the day.
- Impassable terrain is gated by gear and knowledge together, never a bare level number: rope and knots for rock, grip (boots, a staff) for scree and mud, an axe and warm clothing for snow and ice, weather sense before climbing under building cloud, a lantern for caves. The player can see what a stretch needs before they can pass it, which turns it into a visible goal. Knowledge is found by exploring, taught by a dweller, or read in a washed-up letter, never bought.
- Several ways through any obstacle, per the two-solutions rule: find a natural pass, build and maintain a trail (tend, lasts, usable by crew), climb direct on rope (fast, risky), cut steps or burn brush (conquer, fast, reverts), or go around by water. Failure costs time, not items; trails and rope decay under the entropy rule like everything else.
- Likely a new Exploration subskill, Climbing, alongside Swimming, Delving (kept underground) and Sailing.

## Invention (needs design)
Invention is huge and holds many processes, and different parts should feel different: fitting parts together, experimenting to find what works, shaping by hand (the shell grind is one), and more. Knowledge gates what can be made (quests, examining, trying); hands-on work sets how well. Pacing, interaction and feel are not designed yet. The fire ladder, glass, the jelly trap and the lantern are all made things and wait on this design. The shell needle (for sewing, after the sailmaker's kit) is the first Invention task waiting on it.

## Sir Thimble and the sailmaker's kit (built)
Sir Thimble's helmet is the Grinning Gull's sailmaker's thimble. Three salutes start his quest: bring back the rest of the kit (a sailmaker's palm on the west beach under the low tide, a bone fid on a reef, waxed twine in a crevice of the north rocks at low tide). He keeps the kit, gives his spare helm, and teaches how a seam holds (sewing knowledge, S.know.sewing). Sewing needs a needle, which is the first Invention task. Sewing leads toward cloth goods and, later, sails.

## Fire (ladder)
Fire structures train Firemaking as ways on its page; Tinkering supplies the parts that go into them (grates, vents, bellows, moulds).
- Open fire: wood on the ground. Cooks, warms, lights; leaves ash and charcoal. Weak: burns fast, wind and waves take it, it can spread, heat tops out at cooking. Charcoal should come from an actual low-air burn (a clamp or pit over real time), not from ash as it does today.
- Fire ring: beach stones stop spread, block wind, burn longer.
- Hearth with grate or spit: several pans at once.
- Smoking rack: preserves fish; the smoky quality becomes deliberate, not incidental.
- Clay oven: fires pots and moulds.
- Glass furnace: a crucible plus forced draft, built for sustained heat around 1,100C or more; the structure that actually enables glassworking.
- Brazier and lantern: fire carried or hung; the lantern is the smallest fire structure that exists.
- Forge: works salvaged metal with charcoal, bellows and an anvil.
- Beacon: the top rung, tied to the Far Light and the Gull's lost crew.
- Heat comes from fuel and draft, shown through flame colour and sound, never a gauge: kelp flashes hot and fast, driftwood is steady, charcoal is clean and hot, hard shadow wood lasts longest, ember pearl and sunstone top the scale, a bellows pushes further. Low heat smokes and dries, medium cooks, high melts glass and fires clay.
- Material tiers for structures, cheapest to best: stone (free, heavy), clay, metal (needs salvage, permanent). A wood-framed structure works but burns down with use, the same rule as a wood lantern frame.
- Build above the tide's foam line; a structure on wet sand washes out.

## Glass and containers
- Sources, all one material: sea glass pebbles (small, many colours, wash up on the tide), bottles, and broken glass (cullet). Cullet melts at meaningfully lower heat than raw batch, so it is the quick path; raw batch is sand, soda (from burnt kelp) and lime (from burnt shell), the historical real-world recipe.
- Melting needs a glass furnace (see Fire); a plain open fire cannot do it.
- Poured glass must anneal, cooling slowly over real time, or it cracks; this is one of the long, dreaded, high-payoff tasks.
- Moulds, cheapest to best: dry sand above the foam line (free, single use, rough; wet sand would steam and spit, so this is not a tidal mechanic), clay or stone (reusable), metal (precise, needs salvage). A pure single-colour batch keeps its colour; mixed colours muddy.
- Products: panes, bottles, jars, vials, lenses. Capiz-shell panes (thin-scraped shell) are a cheaper, dimmer, more fragile beach-only alternative to glass panes, the same "a lesser way exists" rule as wood versus metal frames.
- Bottles store a limited quantity of one kind of thing, so they relieve pack pressure the way a stack cannot. Real causes of breakage: thermal shock, pressure from fermenting contents, freezing, impact; thicker jars and kelp padding resist. Broken glass goes back in the furnace. A message bottle, once read and emptied, becomes a jar.

## Jelly oil and the lantern
- Jelly oil is the one named-fantasy material in this chain; everything done to it afterward is real.
- Raw oil, burned as found: dim, short, smoky, sooty on panes, like burning crude, unrendered fat.
- Rendered oil: gentle heat, strain, settle, over real time; too much heat scorches and wastes the batch. Burns much longer, brighter and clean. A long, dreaded, high-payoff task.
- Oily fish render the same way as a lesser substitute: dimmer, smellier, draws gulls.
- Harvest methods, per the standing rule, none strictly dominant:
  - Accord (mirror a jelly's pulse): a clean bead, the jelly is unharmed and recovers to be harvested again later.
  - Strife, direct kill (needs the hatchet): a bigger one-time batch, dirtier, needs extra straining; the jelly is gone and that stretch of sea thins for a while, no further penalty. A real dead jelly is mostly water and breaks down fast, which is why the yield is capped even at a kill.
  - Foraging (washed-up jellies): the poorest yield, oil already stale.
  - Kill yield rises with both Foraging and Strife together (knowing what to take, and a clean quick kill keeping tissue sound); at very high levels in both it approaches Accord's yield, never passes it.
  - Gloves (Hands slot) reduce stings when handling jellies; all jelly work happens from footing (shallows, a sandbar, the dock), never while treading water.
- A craftable jelly trap, passive fishing-style gear: taught early for a comfortable, guided opening, set near shore in spots the player learns are good, checked later on real time like the other long tasks. A caught jelly gives a real choice: release for nothing now but goodwill, keep harvesting it while alive (repeated smaller takes, declining), or take everything at once (the kill option, arrived at through the trap). Several managed traps in one stretch amount to a jelly farm; how it is run, for steady yield or for drain, is the same Strife-versus-Accord choice expressed as husbandry versus hunting, and it must be crafted through gathering and Invention like any other tool, never given.
- The lantern itself: a wick (twisted dune grass, Foraging plus Tinkering), a frame (wood, chars and shortens lantern life, longer with harder wood; or metal, permanent, needs salvage), and a pane (glass shelters the flame from wind and improves the draw, so it burns brighter; no pane means the flame gutters quickly in any wind).
- Fuels beyond jelly oil: rendered fish oil (lesser), ember pearl (hot enough to threaten a wood frame).
- Uses: carried light at night and in the forest; Moonlappers drink from a carried lantern instead of the moon (the hidden Accord way under Moonlappers); hung on a post, the bollard, or a planted Hollowmaw, a lantern lights that place for good while it is tended; a strong enough light shows wrecks underwater, which is how the lantern chain feeds back into salvage and metal frames.

## Dwellers, camps and settlements
- A dweller is won over through Strife or Accord, like any creature, and settles where the player chooses: an island the player already holds, or somewhere new the dweller asks for or discovers.
- A dweller needs shelter the player builds (never dweller-built for free), following real building order (foundation, frame, cladding, roof) and real material properties (ironbark rots slowest, dune grass thatches, shell lime makes mortar, stone and clay are free but heavy).
- Settled, a dweller works a job tied to the local economy (lantern keeper, woodcutter, net mender, ferryman, fog-net keeper, sky-reader) and produces slowly over real time, the same dreaded-task rhythm as everything else.
- Decay still applies to a settled place under the entropy rule, but a dweller's presence slows it rather than stopping it: an island with a dweller drifts back toward wild much more slowly than an empty one, but never stops it. Decay runs in stages while the player is away too, capped so a week off never wipes the work.
- Moving a dweller elsewhere costs standing at the place they leave (recoverable over time) and gives a head start on standing at the place they arrive, since the player is visibly investing there.
- The crew is not one party on a ship. Each won-over dweller settles into their own dominion on whatever island the player builds for them; the player's reach is distributed across many small holds or concentrated into one larger settlement, entirely the player's shape to choose, with real tradeoffs (wide reach and exposure versus a strong, single, vulnerable hub). The ship is how the player visits, resupplies and relocates dwellers between dominions, not a mobile home base.
- Not yet settled: the final name for the Strife/Accord balance concept (candidates include "the two hands" and "standing," leaning toward standing since it naturally explains why old methods can stop working); whether a dweller can ever refuse a relocation; the first dwellers' names and roles (must be original).

## The Shadow Forest
A collection of dark islands far east of the Key, never one big island, each with its own irregular shape and character (its own outline, ground and sand colour, tree density and twist), not fixed circles. A few are bridged; most crossings are swims, now long and gradual rather than a jump. Dim and foreboding with serene pockets; a sad place the player can tend back to life or clear by force, and both are real options under the standing rule.
- The Tangle and the Thicket (formerly "the Maze" and "the Lesser Maze") are forests, not literal grid mazes: twisted black trees scattered by density so there are real clumps and corridors, canopies drawn over everything they shade so walking under one visibly dims the player. The more twisted a tree, the harder its wood (black wood, twisted wood, ironbark), which is where the Far Grove's oldest, most twisted trees matter most.
- Hollowmaws eat the trees: a dead tree until it unfolds, mouth in the trunk, root-legs, bark like skin; heartwood rotting, so it eats living trees for warmth. Tell: the chest creaks open before the lunge. Strife (slap to provoke and read the tell, trip on the tell to break it) drives it off for dead wood; Accord (wrap on the tell to calm it, bind with an ember pearl in hand) plants it instead, and it becomes a small lit tree for good. They hide among dead trees drawn the same; a real one shows only a seam and, rarely, a warm fleck.
- Moonlappers eat the moon: pale, long-necked, eyeless, lapping its reflection at night so the real moon thins. Tell: the pack goes silent before turning. Strife scatters them; Accord gives them a carried lantern's light to drink instead of the moon.
- Mossbacks: soft, mossy, starving, pitiable, with a shiver as a tell. Strife drives one off; Accord warms a shivering one with a wrap so it follows, and binding a wrapped one keeps it for good. The first crew member that is not a person.
- The Hollow lies across its own isle, breathing. Everything else is a symptom of it. Its answer is unwritten; it may not be a fight.
No faces from other worlds; hungers for warmth and light, not meat; each can be set right, by one hand or the other.

## Scarf and weapon (built)
- Every character wears a scarf; its own tail is the weapon, snapping to the target and back, never a separate thing shooting out of the character. The Weapon slot defaults to the scarf and the scarf never leaves the neck; a crafted hatchet can be taken in hand instead from the same slot.
- Scarf moves: tap a thing in reach to slap it (Strife), slide at it to trip it (Strife, breaks a tell), slide from it to the player to wrap it (Accord, mirrors a tell), slide back again while wrapped to bind it (Accord, keeps what was won). Reach grows with Dominion level.
- Hatchet in hand: tap to hew, slide to sweep, both hitting everything in reach on that side; three sweeps in rhythm spin into a swirl hitting everything round the player. No gentle side: wrap and bind stay the scarf's alone.
- Strife and Accord each hold multiple named ways on their subskill pages (the scarf, the hatchet, feeding, the ember pearl, and more to come), each with its own moves and bursts, which is the live example of the two-or-more-solutions rule inside Dominion itself.

## Story so far
Driftwood Key, smallest island in the Lantern Sea. Gubbins the talking bucket buys fish. Brimble, a living galley flame, was the stove of the Grinning Gull and floated here in a teapot; proud, fussy, theatrical, he keeps house in the north-east dunes, rebuilding his galley from what the tide brings, and teaches Cooking; his dream is to be a ship's fire again. The Gull's captain wrote letters signed "C." that wash up in bottles; the Far Light lies past the last lighthouse. Mortimer Gull runs the Gull Post bank. Kindle, a wild little log, joins the player's woodpile after three nights of firelight and ash. A stone head hums about the west shore and the moon. A crooked tower blinks on the horizon. Old Bollard, an iron mooring post with a face, is the practice post for Strife and Accord at the dock. A rowboat appeared at the pier one morning; people say they have swum between islands, even past the Shadow Forest, and the crossing itself is long enough now to prove it.

## Open questions
- Can a settled dweller ever refuse to move?
- Final name for the Strife/Accord balance idea: "standing" versus other options.
- The character creator's actual scenarios, trait axes and four starting areas.
- Does every system, Salt specifically, truly have two solutions yet?
- Regional weather assumptions above need confirming against play, not just real-world logic.
- Which 10 to 15 real-world facts used in this document (glassmaking, charcoal, fog, mountain travel times) should carry a source citation.
