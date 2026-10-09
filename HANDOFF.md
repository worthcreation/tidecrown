# Tidecrown: handoff (build 1, 9 Oct 2026)
Current state only. Build by build changes are in docs/HISTORY.md. Design rules and story are in docs/design-rules.md.

## Where the work happens
- Start of every chat: `git clone https://github.com/worthcreation/tidecrown.git` into /home/claude, `node tools/build.js`, check `const BUILD` in src/js/99-main-loop.js (next build is main's plus one), read Next task.
- Edit src/, never index.html. Test headlessly (Playwright) at 375x548 and 390x760; add #dev to the URL for window.DK.
- Ship: add one line at the top of docs/HISTORY.md, then `node tools/ship-local.js NN "Build NN: ..."`. Deliver the zip with present_files, also publish the play-test artifact, and end the reply with the printed PowerShell and zsh lines and the play link. Claude never commits or pushes. An unzip never deletes: list any deleted file for Ross to remove by hand.

## Layout
- src/index.html shell; src/css/*.css and src/js/*.js concatenated in filename order (numeric prefixes) into one closure.
- tools/build.js builds index.html (--watch --serve for local dev; npm run dev). tools/ship-local.js packs builds.
- Pages serves index.html from the root of main.

## Current game
Skills: Fishing, Hearth, Shipwright (woodcutting). Hidden: Delving, Grit, Sailing.
Systems: creator and still pool, gear, 20-slot pack with stacks, Gull Post bank (30 slots), ground drops (3 min despawn), fire life timers and ash byproducts, Kindle, journal, skill pages, XP sparks.

## Next task
Ross picks. Candidates: Shipwright crafting (first raft from wobblewood), the gull-summoning consumable ("something crunchy"), Sailing groundwork.
