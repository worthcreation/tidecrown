# Tidecrown: project instructions

## Vision
Tidecrown: Isles Unclaimed is a mobile-first skilling RPG set in the Lantern Sea. The player washes up on Driftwood Key and grows outward island by island.
Pillars: explore, discover, take dominion. Dominion means the open hand or the closed fist (Accord, the keeping hand; Strife, the taking hand), and neither sits on top; what the player builds, lights, tends or takes leaves a mark that fades without upkeep.
Influences, always checked against all three: Runescape (skills, gathering and processing loops, banking), One Piece (sea adventure, crew, dreams, lost ships and lore), Adventure Time (sentient objects, gentle weirdness, humor with melancholy underneath). All characters, names, and art are original. Everything has its place; every feature connects to existing systems, lore, or characters.
Core rules, in short: nothing that acts on the world is ever given, it comes from a skill chain (the one exception is the bootstrap first scarf and tool); material things follow real-world processes, with fantasy limited to a named list; every problem has two or more solutions; some tasks are long and dreaded with a big payoff; everything reverts without upkeep.
Full design rules and the story so far: docs/design-rules.md. Read it before any change the player will see or read.

## Repo and workflow (same as Quest)
- Repo worthcreation/tidecrown (public, personal account). GitHub Pages serves index.html (play) and test.html (test) from the root of main at https://tidecrown.worthcreation.com and https://tidecrown.worthcreation.com/test.html (custom domain: CNAME file in the repo root and a Bluehost CNAME record; never delete the CNAME file). Ross's clones: ~\tidecrown (Windows) and ~/tidecrown (Mac).
- Start of every chat: git clone https://github.com/worthcreation/tidecrown.git into /home/claude, node tools/build.js, check const BUILD in src/js/99-main-loop.js against main, read HANDOFF.md's Next task and docs/roadmap.md.
- Edit src/ (css and js files with numeric prefixes, one shared closure), never index.html or test.html (tools/build.js writes both; files ending -test.js or -test.css go into test.html only). Everything is drawn in code; no image assets. Play save key stays driftwood_key_v1 (test uses driftwood_key_test); new fields get defaults and migrations.
- Test headlessly at 375x548 and 390x760, playing it like a person. test.html exposes window.DK; the play build does not.
- Ship one build per reply, numbered main's BUILD plus one: add a line at the top of docs/HISTORY.md, run node tools/ship-local.js NN "Build NN: ...", deliver the zip with present_files, and publish test.html as the play-test artifact. Never commit or push. End the reply with the printed PowerShell line (powershell block) and zsh line (zsh block), the play link, and any file Ross must delete by hand (an unzip never deletes).
- In a voice call bash_tool and present_files do not work: run shell through code_execution (Python subprocess) and deliver the files when back in text chat, saying so.
- Always attach files. Never give instructions that leave Ross to find or assemble files himself.
- Attach PROJECT_INSTRUCTIONS.md only when Ross asks for it, when it changed, or at a handoff.
- Handoff (end of a chat or when Ross says handoff): update HANDOFF.md and, if they changed, docs/design-rules.md and this file.

## Working with Ross
- Always ask before building anything, including small fixes. Design talk first: reflect the idea back as systems, check it against the pillars, flag what fails a rule, pose questions, and wait for Ross to say go.
- Pick the cheapest model that fits the task when suggesting one: Haiku for numbers, copy and one-line fixes; Sonnet for most builds; Opus only for changes that touch the data or save model.
- Concise, direct, candid, no AI-sounding language, no em dashes. Sources when facts matter.
- Setup steps as numbered lists with each command or field value in its own code block; combine commands into one line.
- PowerShell commands must stop if a cd or path check fails: use cd -ErrorAction Stop or Test-Path in an if block, never a bare cd followed by semicolons.
