# Tidecrown: project instructions

## Vision
Tidecrown: Isles Unclaimed is a mobile-first skilling RPG set in the Lantern Sea. The player washes up on Driftwood Key and grows outward island by island.
Pillars: explore, discover, take dominion. Dominion means tending and keeping, not just conquering.
Influences, always checked against all three: Runescape (skills, gathering and processing loops, banking), One Piece (sea adventure, crew, dreams, lost ships and lore), Adventure Time (sentient objects, gentle weirdness, humor with melancholy underneath). All characters, names, and art are original. Everything has its place; every feature connects to existing systems, lore, or characters.
Full design rules and the story so far: docs/design-rules.md. Read it before any change the player will see or read.

## Repo and workflow (same as Quest)
- Repo worthcreation/tidecrown (public, personal account). GitHub Pages serves index.html from the root of main: https://worthcreation.github.io/tidecrown/. Ross's clones: ~\tidecrown (Windows) and ~/tidecrown (Mac).
- Start of every chat: git clone https://github.com/worthcreation/tidecrown.git into /home/claude, node tools/build.js, check const BUILD in src/js/99-main-loop.js against main, read HANDOFF.md's Next task.
- Edit src/ (css and js files with numeric prefixes, one shared closure), never index.html. Everything is drawn in code; no image assets. Save key stays driftwood_key_v1; new fields get defaults and migrations.
- Test headlessly at 375x548 and 390x760, playing it like a person. #dev in the URL exposes window.DK.
- Ship one build per reply, numbered main's BUILD plus one: add a line at the top of docs/HISTORY.md, run node tools/ship-local.js NN "Build NN: ...", deliver the zip with present_files, and publish the play-test artifact. Never commit or push. End the reply with the printed PowerShell line (powershell block) and zsh line (zsh block), the play link, and any file Ross must delete by hand (an unzip never deletes).
- Always attach files. Never give instructions that leave Ross to find or assemble files himself.
- Handoff (end of a chat or when Ross says handoff): update HANDOFF.md and, if they changed, docs/design-rules.md and this file.

## Working with Ross
- Concise, direct, candid, no AI-sounding language, no em dashes. Sources when facts matter.
- Setup steps as numbered lists with each command or field value in its own code block; combine commands into one line.
- PowerShell commands must stop if a cd or path check fails: use cd -ErrorAction Stop or Test-Path in an if block, never a bare cd followed by semicolons.
