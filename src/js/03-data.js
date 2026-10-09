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
 foraging:['Foraging','The tide gives and the tide takes back. Grab what the waves drop before the backwash, and scrape the salt they leave on rock and piling.'],
 tide:['The tide','Twice an hour or so the sea breathes in and out. High water brings wash-ups. Low water bares a band of wet sand, and the rocks sit in their pools.'],
 hearth:['Cooking','Brimble taught me to cook. A fire is a promise: keep it fed and it keeps you.'],
 driftwood:['Driftwood','Bleached and bone dry. The beach coughs up more every so often. Burns steady.'],
 kelp:['Dry kelp','Brittle seaweed from the rocky shores. Burns hot and wild, and the smoke smells like the deep.'],
 perfectcook:['Golden both sides','Flip at golden, pull at golden. Eat one and my hands get sharper for a while.'],
 smoky:['Smoky fish','Cooked over a kelp flare, fish come out smoky. The smell gets on my hands and the fish come running.'],
 firstfire:['A fire of my own','I lit a fire with my own hands. Brimble says a fire is a promise. Starve it and all it leaves you is ash.'],
 ash:['Ash','What a starved fire leaves behind. Soft, grey, faintly warm. Brimble gets suspiciously excited about it.'],
 stache:['The Ash Mustache','Brimble braided ten scoops of ash into a mustache, exactly like the one the Gull’s head cook wore. It is ridiculous. It is magnificent. Gubbins pays extra to anyone wearing it.'],
 flint:['Flint','A sharp shard wedged between the north rocks. It wants to be a tool.'],
 hatchet:['A hatchet','Flint, driftwood and kelp twine. Ugly, but it bites. The wobble trees went very quiet when I made it.'],
 wobblelog:['Wobblewood','The wobble trees give up a log if you chop in time with their sway. Burns long and bright.'],
 bonfire:['Bonfire','Wobblewood and driftwood stacked high. Burns twice as long and lights half the island.'],
 charcoal:['Charcoal','A black lump left in the ash of a driftwood fire. Hotter than anything I’ve burned.'],
 seasalt:['Sea salt','White crystals, scraped off wet rock between waves or left where kelp burned down. Brimble would have opinions.'],
 gullbank:['Mortimer Gull','A seagull in a banker’s visor runs the Gull Post. Gulls steal everything, so naturally they’re the only ones trusted to keep it safe.'],
 sunstone:['Sunstone','A stone left behind by a long, white-hot fire. Warm all the way through. It remembers being part of the sun.'],
 pearl:['Ember pearl','A warm bead that formed in the heart of a wobblewood fire. It hums when I hold it.'],
 kindleseen:['The runaway log','A piece of driftwood on the beach blinked at me, then ran off on tiny legs. Logs are not supposed to do that.'],
 kindle:['Kindle','A wild little log who moved into my woodpile after three nights of firelight and ash. When a fire is about to die he leaps in. He runs on ash, the weirdo.'],
 gull:['The Grinning Gull','Brimble’s old ship. Her captain wrote letters and tossed them overboard, signed only with a C.'],
 pool:['The still pool','A pond so calm it shows who you could be. Looking in lets me change how I look, and new looks surface as I discover things.'],
 horizon:['A tower to the northeast','Through the spyglass I saw a crooked tower far to the northeast, with a light blinking on top. A heading, if I ever get a boat.'],
 moonpool:['Moonlit pool','When it\u2019s dark, the water off the west shore glows. Something pale circles underneath.'],
 fish_minnow:['Minnowbit',FISH.minnow.desc],fish_perch:['Pebble Perch',FISH.perch.desc],fish_grump:['Grumpfish',FISH.grump.desc],fish_eel:['Jellybean Eel',FISH.eel.desc],fish_koi:['Moonkoi',FISH.koi.desc],
 bottle0:['A letter in a bottle',BOTTLES[0]],bottle1:['A second letter',BOTTLES[1]],bottle2:['A third letter',BOTTLES[2]]
};
const XP=[0,0];{let p=0;for(let l=1;l<99;l++){p+=Math.floor(l+300*Math.pow(2,l/7));XP[l+1]=Math.floor(p/12);}}
function lvl(x){let L=1;while(L<99&&x>=XP[L+1])L++;return L;}
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
 thimble:{name:'Thimble Helm',slot:'head',desc:'A gift from Sir Thimble. The fish seem to respect it. Bites come sooner.',eff:{wait:.6}},
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
 nobody:{name:'The Nobody',line:'No name you remember, no past you can prove. Only a map that draws itself.',keep:'blankmap'}
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
 flint:{name:'Flint shard',desc:'Sharp as a grudge. Lashed to a stick with something stringy, it would make a fine hatchet.'},
 hatchet:{name:'Stone hatchet',desc:'Flint, driftwood and kelp twine. Wobble trees eye it nervously.'},
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

