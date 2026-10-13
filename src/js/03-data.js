/* ---------- game data ---------- */
const FISH={
 minnow:{name:'Minnowbit',lvl:1,xp:12,win:900,w:10,col:'#a9dbe9',val:2,spot:'shallow',desc:'Small, silver, and mildly offended to be here.'},
 perch:{name:'Pebble Perch',lvl:5,xp:22,win:760,w:6,col:'#d4ab6f',val:4,spot:'shallow',desc:'Speckled like a beach. Tastes a bit like one, too.'},
 grump:{name:'Grumpfish',lvl:10,xp:40,win:660,w:8,col:'#8f84c0',val:7,spot:'deep',desc:'Has never once been happy about anything. Respect.'},
 eel:{name:'Jellybean Eel',lvl:15,xp:60,win:560,w:5,col:'#ff8fb1',val:10,spot:'deep',desc:'Wiggly, striped, and faintly sugary.'},
 koi:{name:'Moonkoi',lvl:20,xp:120,win:520,w:1,col:'#eef3ff',val:25,spot:'moon',desc:'Glows softly. Looks at you like it knows something you don\u2019t.'}
};
const BOTTLES=[
 'If you\u2019re reading this, the Lantern Sea took you too. Don\u2019t be scared. It only takes people it has plans for. \u2014 C.',
 'Day forty. The stone head on the Key sings at night. I think it\u2019s singing directions.',
 'The Far Light is real. I saw it once from the crow\u2019s nest, and it blinked back. Keep going. \u2014 C.'
];
const JOURNAL={
 washed:['Washed ashore','Woke up on warm sand with salt in my ears and no idea how I got here. There\u2019s a dock. There\u2019s a bucket on the dock. The bucket is looking at me.'],
 gubbins:['Gubbins','A talking bucket who lives on the dock. Eats fish whole, pays in shells, claims he was once a very important bucket.'],
 gubbinslore:['The Far Light','Past the last lighthouse of the Lantern Sea, they say, there\u2019s a light where dreams come true. Gubbins says folk say lots of things.'],
 sign:['The sign','Population: one bucket. Two now, probably. I think I\u2019m the two.'],
 fire:['The campfire','Somebody keeps this fire lit. It smells like it wants to cook something.'],
 tree:['Wobble trees','The trees here sway even when there\u2019s no wind. One of them sighed at me.'],
 rocks:['North rocks','The water past the barnacled rocks churns like something big lives down there.'],
 crab:['Sir Thimble','A crab in a thimble helmet. We salute each other now. It\u2019s our thing.'],
 head:['Stone head','Half buried in the west sand. Eyes closed, like it\u2019s trying to remember a song.'],
 headnight:['The humming','At night the stone head hums. Something about the west shore, and the moon.'],
 wick:['Brimble','A living galley flame, keeping house in a hollow in the dunes. He fed the crew of the Grinning Gull for forty years and floated here in a teapot. Proud, fussy, always hungry.'],
 islet:['The small islands','Each island here has its own shape and temper: a grove to land on, the Tangle and the Thicket thick with twisted trees, two fallow mudflats with something dead in them, a clearing that glows at night, and a far grove of the oldest, most twisted wood.'],
 fallow:['Fallow ground','Grey, bubbling, sour. Parts of the forest have given up growing. Something is draining them.'],
 shadowtree:['Shadow tree','Black bark, hollow heart, and canopies that hide what walks under them. Cut one and the way opens; nothing here grows back.'],
 shadow:['The Shadow Forest','A cluster of dark islands past the Key, each its own shape and mood. The big ones are forest, twisted black trees in clumps with paths between, and the trees seem to listen.'],
 shallows:['The shallows','The water is not one depth. It shelves out from every shore, slow in some places, all at once in others; the colour says which. Out at sea there are sandbars to stand on, reefs, and little islands nobody has named.'],
 tinyisle:['A little island','A scrap of land in the open sea, a few trees and nobody. There are more out there. There is no end to them, maybe.'],
 blackwood:['Black wood','A log from a plain shadow tree. Lighter than it looks and it burns long.'],
 twistwood:['Twisted wood','The gnarled trees of the forest give hard wood with grain like rope. The more twisted the tree, the harder the log. This is what real projects want.'],
 ironbark:['Ironbark','The worst-twisted trees give a black wood nearly as hard as stone. Rare, heavy, and worth the fight.'],
 thehollow:['The Hollow','Something the size of a ship lies across the heart of the forest, breathing. Everything keeps its distance. Everything else here is a symptom of it.'],
 hollowmaw:['Hollowmaw','A dead tree until it unfolds. Its heartwood is rotting, so it eats living trees to feel warm. It wants warmth, not me.'],
 mossback:['Mossback','Soft, round, mossy, and starving. It used to eat what the Hollowmaws left. Fed, it follows.'],
 moonlapper:['Moonlapper','Pale, long-necked, eyeless. It laps the moon off the water at night, and the moon thins. It is drinking light because the forest has none.'],
 swimming:['Swimming','I waded in and kept going. There is a rhythm to it: keep stroking and the sea keeps you up; stop and it takes you under and carries you back to the last shore. People say they have swum between islands. Even past the Shadow Forest.'],
 jelly:['Lantern jelly','A glowing bell with trailing threads, drifting where it pleases. Brush one and everything tingles for a while.'],
 swamfar:['The long swim','I swam east off the Key until the dark islands took me in. So the rumour is true.'],
 foraging:['Foraging','The tide gives and the tide takes back. Grab what the waves drop before the backwash, and scrape the salt they leave on rock and piling.'],
 tide:['The tide','Twice a day the sea breathes in and out. High water brings wash-ups. Low water bares a band of wet sand, and the rocks sit in their pools.'],
 hearth:['Cooking','Brimble taught me to cook. A fire is a promise: keep it fed and it keeps you.'],
 driftwood:['Driftwood','Bleached and bone dry. The waves leave it on the sand, and take it back if you dawdle. Burns steady.'],
 kelp:['Dry kelp','Brittle seaweed from the rocky shores. Burns hot and wild, and the smoke smells like the deep.'],
 perfectcook:['Golden both sides','Flip at golden, pull at golden. Eat one and my hands get sharper for a while.'],
 smoky:['Smoky fish','Cooked over a kelp flare, fish come out smoky. The smell gets on my hands and the fish come running.'],
 firstfire:['A fire of my own','I lit a fire with my own hands. Brimble says a fire is a promise. Starve it and all it leaves you is ash.'],
 ash:['Ash','What a starved fire leaves behind. Soft, grey, faintly warm. Brimble gets suspiciously excited about it.'],
 stache:['The Ash Mustache','Brimble braided ten scoops of ash into a mustache, exactly like the one the Gull’s head cook wore. It is ridiculous. It is magnificent. Gubbins pays extra to anyone wearing it.'],
 thimblekit:['The sailmaker’s kit','Sir Thimble’s helmet was the Grinning Gull’s sailmaker’s thimble. He wants the rest of the kit: a palm, a fid and waxed twine, all somewhere the sea put them.'],
 sewing:['How a seam holds','Sir Thimble showed me: the palm pushes, the fid opens, the twine is waxed so it bites. I could sew canvas, given a needle. I do not have one. Yet.'],
 teapot:['Brimble’s teapot','He cooks in it, hung on a driftwood tripod beside his fire. It has never once made tea, and he is proud of that.'],
 palm:['Palms','They grow on the sand, leaning the way the trade wind pushes them. Up the hill it is too cool and foggy for them; the wobble trees have that.'],
 cairn:['The cairn','Someone stacked stones on the very top of the Key. From there every shore shows, and the sea all round. Brimble says he watches for ships from just below it.'],
 stumpcache:['Something the forest swallowed','A rotted pouch tangled in the roots of a stump, still holding shells. Somebody lost it here long before me.'],
 clam:['A giant clam shell','Old, empty, wedged into the reef nearest the Key. A driftwood stick levers it out. The hinge is the thickest shell I have ever held.'],
 shellblade:['A shell blade','Ground out of a clam hinge on the north rocks, wet sand doing the cutting. Islanders with no stone did exactly this.'],
 hatchet:['A hatchet','A shell blade, driftwood and kelp twine. Ugly, but it bites. The wobble trees went very quiet when I made it.'],
 wobblelog:['Wobblewood','The wobble trees give up a log if you chop in time with their sway. Burns long and bright.'],
 bonfire:['Bonfire','Wobblewood and driftwood stacked high. Burns twice as long and lights half the island.'],
 charcoal:['Charcoal','A black lump left in the ash of a driftwood fire. Hotter than anything I’ve burned.'],
 seasalt:['Sea salt','White crystals a wave leaves on rock or piling, or what is left where kelp burned down. Brimble would have opinions.'],
 gullbank:['Mortimer Gull','A seagull in a banker’s visor runs the Gull Post. Gulls steal everything, so naturally they’re the only ones trusted to keep it safe.'],
 sunstone:['Sunstone','A stone left behind by a long, white-hot fire. Warm all the way through. It remembers being part of the sun.'],
 pearl:['Ember pearl','A warm bead that formed in the heart of a wobblewood fire. It hums when I hold it.'],
 kindleseen:['The runaway log','A piece of driftwood on the beach blinked at me, then ran off on tiny legs. Logs are not supposed to do that.'],
 kindle:['Kindle','A wild little log who moved into my woodpile after three nights of firelight and ash. When a fire is about to die he leaps in. He runs on ash, the weirdo.'],
 gull:['The Grinning Gull','Brimble’s old ship. Her captain wrote letters and tossed them overboard, signed only with a C.'],
 strife:['Strife','The scarf. Everyone out here wears one; mine is a weapon now. Tap to slap, slide at a thing to trip it. Slap to provoke, read the tell, trip on the tell to break it.'],
 accord:['Accord','The scarf, the other way. Slide from a thing to me to wrap it, slide back again to bind it. Mirror the tell and what I win stays won.'],
 bollard:['Old Bollard','An iron mooring post at the root of the pier, with a face. The Grinning Gull tied up to him once. A hundred years of ropes and he misses every one. Happy to be walloped, happier to be tied.'],
 deadwood:['Dead wood','A grey limb that came off a Hollowmaw when a trip put it down. It burns, sulkily. Brimble says it tastes of sulking too.'],
 planted:['Planted','A Hollowmaw, held calm and bound, took an ember pearl into its hollow and put roots down. It is a tree again, with a little warm light in it. A little light got in.'],
 pool:['The still pool','A pond so calm it shows who you could be. Looking in lets me change how I look, and new looks surface as I discover things.'],
 horizon:['A tower to the northeast','Through the spyglass I saw a crooked tower far to the northeast, with a light blinking on top. A heading, if I ever get a boat.'],
 moonpool:['Moonlit pool','When it\u2019s dark, the water off the west shore glows. Something pale circles underneath.'],
 fish_minnow:['Minnowbit',FISH.minnow.desc],fish_perch:['Pebble Perch',FISH.perch.desc],fish_grump:['Grumpfish',FISH.grump.desc],fish_eel:['Jellybean Eel',FISH.eel.desc],fish_koi:['Moonkoi',FISH.koi.desc],
 bottle0:['A letter in a bottle',BOTTLES[0]],bottle1:['A second letter',BOTTLES[1]],bottle2:['A third letter',BOTTLES[2]]
};
const XP=[0,0];{let p=0;for(let l=1;l<99;l++){p+=Math.floor(l+300*Math.pow(2,l/7));XP[l+1]=Math.floor(p/12);}}
function lvl(x){let L=1;while(L<99&&x>=XP[L+1])L++;return L;}
/* parent skills run 1 to 10 on their own scale: each level needs 2^(1/1.43), about 1.62 times, the XP of the one before. */
const PXP=[0,0,100];for(let l=3;l<=10;l++)PXP[l]=Math.round(PXP[l-1]*Math.pow(2,1/1.43));
function plvl(x){let L=1;while(L<10&&x>=PXP[L+1])L++;return L;}
const PACK=20;
const KIN={human:{name:'Human',tones:['#ffe0bd','#e8b48a','#b9825a','#7a4f33'],toneN:['Sand','Honey','Cocoa','Umber'],blurb:'Ordinary, which out here is the strangest thing of all.'},
 moss:{name:'Mossling',tones:['#c6e29a','#a8d07e','#8dbb6a','#6f9e58'],toneN:['Sprout','Fern','Moss','Bog'],feat:'leaf',blurb:'A leaf grows from your head. It turns toward the sun on its own.'},
 ember:{name:'Ember-kin',tones:['#ffc48a','#ffa36b','#f7c56b','#e8805a'],toneN:['Cinder','Flare','Gold','Kiln'],feat:'glow',blurb:'A small flame burns on top. You glow farther in the dark.'},
 drift:{name:'Driftling',tones:['#bfe6ef','#a9dbe9','#8cc7d6','#7fb3c9'],toneN:['Foam','Shallows','Lagoon','Fathom'],feat:'fins',blurb:'Fins for ears. The sea took you, and gave you back changed.'}};
const SHAPES={bean:[14,15,'Bean'],round:[16,13,'Round'],tall:[12,18,'Lanky'],wee:[12,12,'Wee']};
const HAIRS={none:'Bare',mop:'Mop',knot:'Topknot',swoop:'Swoop',braid:'Stone braid'};
const EYES={dots:'Dots',wide:'Wide',sleepy:'Sleepy',sly:'Sly'};
const MARKS={none:'None',freckles:'Freckles',scar:'Scar',star:'Star',moon:'Moonscale'};
const COLS=['#ff6b6b','#4f8fd6','#7bc96f','#b07ad6','#ffb347','#3fb0a0','#e8e2d0'],COLN=['Coral','Harbor blue','Kelp','Plum','Marigold','Lagoon','Bone'];
const HAIRC=['#3a2d5c','#7a4f2c','#c98f56','#ffe08a','#d9533f','#e8e2d0','#6fd6ff','#5fae6a'],HAIRCN=['Ink','Chestnut','Toffee','Straw','Rust','Silver','Sky','Seaweed'];
const ACCS=['#ffcf3a','#ff8fb1','#fffaf0','#3a2d5c','#6fd6ff','#ff7a3d'],ACCN=['Sunflower','Bubblegum','Chalk','Night','Sky','Ember'];
const LOCKS={kin:{drift:['fish_koi','Locked. The sea has to claim you first.']},hair:{braid:['headnight','Locked. Something old hums this style after dark.']},mark:{moon:['fish_koi','Locked. Hold something that glows from beneath.']}};
const DEFAULT_LOOK={name:'Wanderer',kin:'human',tone:0,shape:'bean',hair:'none',hc:0,eyes:'dots',mark:'none',col:0,acc:0};
const NAME1=['Pip','Bram','Wex','Tully','Odo','Fen','Juno','Quill','Sable','Rook','Nell','Marlo','Kit','Ione','Gus','Wren'];
const NAME2=['Tidewhistle','Saltbrook','Quickhook','Lanternfoot','Mudd','Barnaby','Driftley','Gullsworth','Hollowell','Brinebottom','Tuck'];
const EQUIP={
 stache:{name:'Ash Mustache',slot:'head',desc:'Braided from ash by Brimble. Ridiculous. Magnificent. Gubbins pays an extra shell for everything you sell him.',eff:{}},
 cap:{name:'Barnacle Cap',slot:'head',desc:'Crusty, damp, weirdly lucky. Perfect catches come easier.',eff:{perfect:.12}},
 thimble:{name:'Thimble Helm',slot:'head',desc:'Sir Thimble’s spare, for bringing home the sailmaker’s kit. The fish seem to respect it. Bites come sooner.',eff:{wait:.6}},
 coat:{name:'Oilskin Coat',slot:'body',desc:'Keeps the spray off. Your glow reaches farther at night.',eff:{light:70}},
 gloves:{name:'Kelp Gloves',slot:'hand',desc:'Slick outside, grippy inside. Bites hang on longer.',eff:{win:120}},
 spyglass:{name:'Brass Spyglass',slot:'trinket',desc:'Hold your finger on the sea to look far out with it.',eff:{}},
 salttin:{name:'Salt Tin',slot:'trinket',desc:'Every fish you trade is worth one more shell.',eff:{}},
 whisper:{name:'Whisper Shell',slot:'trinket',desc:'The sea mutters right before a bite. Watch for the shimmer.',eff:{}},
 blankmap:{name:'Blank Map',slot:'trinket',desc:'Fills itself in. Things you haven’t discovered yet glimmer.',eff:{}}
};
const ORIGINS={
 lighthouse:{name:'The Lighthouse Kid',line:'Raised at the top of a lonely tower. You know how to look far.',keep:'spyglass'},
 cook:{name:'The Galley Runaway',line:'Fled a ship’s kitchen with the one thing worth stealing.',keep:'salttin'},
 tide:{name:'The Tide-Touched',line:'Fell overboard as a baby. The sea still talks to you.',keep:'whisper'},
 nobody:{name:'The Nobody',line:'No name, no past you can prove. Only a map that draws itself.',keep:'blankmap'}
};
/* items: one registry. Plain fields, or functions of the item for cooked fish and bottles. */
const ITEMS={
 shells:{name:'Shells',desc:'Gubbins’ currency. Stacks forever. Don’t ask where he keeps his.',stack:1e9},
 bait:{name:'Glitter bait',desc:'Fish go silly for it. Used up one per cast while you have it.',stack:50},
 wood:{name:'Driftwood',desc:'Bleached and bone dry. Burns steady. Stacks five to a slot.',stack:5},
 kelp:{name:'Dry kelp',desc:'Brittle and smoky. Burns hot and fast. Stacks ten to a slot.',stack:10},
 ash:{name:'Ash',desc:'What a fire leaves behind. Brimble and Kindle both get oddly excited about it.',stack:20},
 wobble:{name:'Wobblewood',desc:'A springy log from a wobble tree. Burns long and bright.',stack:3},
 charcoal:{name:'Charcoal',desc:'A black lump from the ashes. Burns hotter than anything. Someone will want this.',stack:5},
 seasalt:{name:'Sea salt',desc:'Crystals from the sea, scraped off wet rock or left where kelp burned. Brimble’s eyes would light up. Well, more.',stack:10},
 pearl:{name:'Ember pearl',desc:'A warm, glowing bead from the heart of a wobblewood fire. It hums when you hold it.',stack:5},
 sunstone:{name:'Sunstone',desc:'Smooth, and warm all the way through. It remembers being part of the sun. Nobody knows what it does yet.',stack:3},
 br_blackwood:{name:'Black wood branches',desc:'Branches from a shadow tree. Kindling, stakes, small work. Stacks ten.',stack:10},
 lb_blackwood:{name:'Black wood limb',desc:'A limb off a shadow tree. Smaller than a log, same wood. Stacks five.',stack:5},
 br_twistwood:{name:'Twisted wood branches',desc:'Branches from a twisted tree. Kindling, stakes, small work. Stacks ten.',stack:10},
 lb_twistwood:{name:'Twisted wood limb',desc:'A limb off a twisted tree. Smaller than a log, same wood. Stacks five.',stack:5},
 br_ironbark:{name:'Ironbark branches',desc:'Branches from a gnarled tree. Kindling, stakes, small work. Stacks ten.',stack:10},
 lb_ironbark:{name:'Ironbark limb',desc:'A limb off a gnarled tree. Smaller than a log, same wood. Stacks five.',stack:5},
 pole:{name:'Pole',desc:'A sapling cut straight. Handles, frames, a raft one day. Stacks five.',stack:5},
 rootwood:{name:'Root wood',desc:'Knotted root dug out with a stump. Tough and oddly shaped, good for things that need a crook. Stacks five.',stack:5},
 fatwood:{name:'Fatwood',desc:'Resin-soaked heartwood from an old stump. It lights even damp, and burns hot. Stacks ten.',stack:10},
 burl:{name:'Burl',desc:'A knob of swirled grain from the root crown. Fine work wants it.'},
 blackwood:{name:'Black wood',desc:'A log from a shadow tree. Light, dark, and it burns longer than driftwood. Stacks five to a slot.',stack:5},
 twistwood:{name:'Twisted wood',desc:'A log from a twisted tree. Hard as a knuckle, grain like rope. The stuff of real projects. Stacks three to a slot.',stack:3},
 ironbark:{name:'Ironbark',desc:'From a tree gnarled past reason. Heavy, black, nearly stone. Whatever is built from this will outlast you. Stacks two to a slot.',stack:2},
 deadwood:{name:'Dead wood',desc:'A grey limb off a Hollowmaw, dry as old bones. Burns, sulkily. Stacks five to a slot.',stack:5},
 palm:{name:'Sailmaker’s palm',desc:'A leather strap with a dimpled iron disc in the palm. Sailmakers push needles through canvas with it. Sir Thimble will want it.'},
 fid:{name:'Bone fid',desc:'A tapered spike of polished bone, for opening up rope and stiff canvas. Sir Thimble will want it.'},
 twine:{name:'Waxed twine',desc:'A coil of sail twine, waxed against the wet. Still good. Sir Thimble will want it.'},
 clamshell:{name:'Giant clam shell',desc:'Heavy, ribbed, long empty. The hinge is thick enough to grind an edge on. The north rocks and some wet sand would do it.'},
 shellblade:{name:'Shell blade',desc:'Ground from a clam hinge. Lashed to a stick with something stringy, it would make a fine hatchet.'},
 hatchet:{name:'Shell hatchet',desc:'A shell blade, driftwood and kelp twine. Wobble trees eye it nervously.'},
 bottle:{name:'Message in a bottle',desc:'Cork still in. Something rolled up inside.',key:it=>'bottle:'+it.msg},
 cook:{name:it=>QN[it.q]+' '+FISH[it.f].name,desc:it=>QD[it.q],icon:it=>'ck_'+it.f+'_'+it.q,val:it=>Math.ceil(FISH[it.f].val*QV[it.q]),key:it=>'cook:'+it.f+':'+it.q}};
for(const k in FISH)ITEMS[k]={name:FISH[k].name,desc:FISH[k].desc,val:FISH[k].val};
for(const k in EQUIP)ITEMS[k]={name:EQUIP[k].name,desc:EQUIP[k].desc};
function iget(it,f,d){const D=ITEMS[it.id],v=D&&D[f];return typeof v==='function'?v(it):v==null?d:v;}
function itemName(it){return iget(it,'name',it.id);}
function itemDesc(it){return iget(it,'desc','');}
function itemIcon(it){return iget(it,'icon',it.id);}
function itemVal(it){return iget(it,'val',0);}
function itemKey(it){return iget(it,'key',it.id);}
function stackOf(id){return (ITEMS[id]&&ITEMS[id].stack)||0;}
function eff(k){let t=0;for(const sl in S.eq){const id=S.eq[sl];if(id&&EQUIP[id]&&EQUIP[id].eff[k])t+=EQUIP[id].eff[k];}if(S.buff&&S.buff.until>Date.now()){const B=BUFF[S.buff.q];if(B&&B[k])t+=B[k];}return t;}

