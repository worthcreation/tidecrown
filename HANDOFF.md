# Tidecrown: handoff (build 9, 9 Oct 2026)
Current state only. Build by build changes are in docs/HISTORY.md. Design rules and story are in docs/design-rules.md.

## Where the work happens
- Start of every chat: `git clone https://github.com/worthcreation/tidecrown.git` into /home/claude, `node tools/build.js`, check `const BUILD` in src/js/99-main-loop.js (next build is main's plus one), read Next task.
- Edit src/, never index.html. Test headlessly (Playwright) at 375x548 and 390x760; add #dev to the URL for window.DK.
- Ship: add one line at the top of docs/HISTORY.md, then `node tools/ship-local.js NN "Build NN: ..."`. Deliver the zip with present_files, also publish the play-test artifact, and end the reply with the printed PowerShell and zsh lines and the play link. Claude never commits or pushes. An unzip never deletes: list any deleted file for Ross to remove by hand.

## Layout
- src/index.html shell; src/css/*.css and src/js/*.js concatenated in filename order (numeric prefixes) into one closure.
- tools/build.js builds index.html (--watch --serve for local dev; npm run dev). tools/ship-local.js packs builds.
- Code map: items in ITEMS (03-data, one entry per item id; cooked fish and bottles use functions of the item). Skill tree in 12: SKILLS (five skills with subs) and SUBS (subskills with p: parent); skd(k) looks up either. XP lives on subskills only, S.sk[sub]={xp}; a skill's XP is derived. hasSkill, xpOf, lv work for both; addXP takes a subskill id and toasts skill level-ups. ACH is keyed by subskill. Skill pages: parentPage and skillPage (13), skView/subView (08). World objects come from objects() (06), each with its own journal key, cached per frame. Fuel rules in stoke() (20). Use fdt for any per-frame motion in draw code. Trees: leafOf(t) and treeReady(t) in 19 read S.treeCut; the canopy and bare branches scale off leafOf in drawTree (11). Tide: tideLevel() and wetR(a) in 02-world (walkable follows the tide); breaking waves (BREAKS, spawnBreak, coverBreak), the beach's items (S.shore, grabShore), SURF sparkle and Foraging XP in 23-tide-foraging. Waves spawn near the player every 5 to 9 seconds with a size (spawnBreak: small, medium, rare large) that sets reach, width, foam weight and how many items; items drop on walkable sand inside the foam's reach. Salt surfaces (SURF) go wet when a wave's front reaches them and sparkle when it recedes past. Fishing spots roam: spotsUpdate, spotAngle, spotHere in 02-world; each has al (fade) and st (in, on, out).
- Pages serves index.html from the root of main at https://tidecrown.worthcreation.com. The CNAME file in the root keeps the custom domain; never delete it.

## Current game
Skills: Fishing, Hearth, Shipwright (woodcutting). Hidden: Delving, Grit, Sailing.
Systems: creator and still pool, gear, 20-slot pack with stacks, Gull Post bank (30 slots), ground drops (3 min despawn), fire life timers and ash byproducts, Kindle, journal, skill pages, XP sparks.

## Next task
Build 9: salt pans and the Salt Tin. Read the planned loops in docs/design-rules.md (Skills section). The zoomed salt-raking scene at low tide (drag to rake pools and flats before the swell, several pools crusting at different speeds) is the Foraging level 10 unlock already promised in SUBS.foraging.unl; pans placed on the flats and built by Tinkering; the tin holds salt and seasons a pan while cooking. Then Build 10 gull posts.
Also pending: Mortimer competing for shiny wash-ups; Brimble's galley growing from rare wash-ups; spark behavior; rod as gear. Tune wave frequency and drop rates once Ross has played: a new player needs a few driftwood within a couple of minutes to feed Brimble.
