/* ---------- examine for everything: the ground, the sea, you, and the camp's hearth ----------
   Every object already has its own line; these cover the rest of what is drawn. */
function groundName(x,y){if(onDock(x,y))return 'The pier';if(SH.on)return 'Forest floor';if(onIsletK(x,y))return 'A tiny island';
 const r=Math.hypot(x,y),a=Math.atan2(y,x);if(r>iR(a)-4)return 'Wet sand';const m=keyMat(x,y,hKey(x,y));return ['','Sand','Grass','Scrub','Fog forest','Summit rock'][m]||'Ground';}
function groundLine(x,y){const n=groundName(x,y),L={
 'The pier':['Grey planks, salt-stiff, every nail a different size. Someone built it in a hurry and it has outlasted them.'],
 'Forest floor':['Black needles and soft rot. Nothing grows down here that does not like the dark.','The ground gives a little underfoot, like it is breathing out.'],
 'A tiny island':['A patch of sand the sea forgot to cover. Barely room to turn around.'],
 'Wet sand':['Wet sand, packed hard by the last wave. It drinks my footprints.','The swash line: shells, weed and whatever the sea is done with.'],
 'Sand':['Sand. Warm. Slightly judgmental.','Dry sand, piled by the wind into soft ridges. Palms like it here.','Tiny footprints here. Not mine. Not the crab\u2019s either.'],
 'Scrub':['Low, tough scrub with leathery leaves. It holds the sand down against the wind.'],
 'Grass':['The grass is softer than it has any right to be.','Grass, flowers here and there. The hill rises behind it.'],
 'Fog forest':['Mossy ground under the wobble trees. The fog keeps everything damp up here.','Cool and wet. The cloud sits on this part of the hill most mornings.'],
 'Summit rock':['Bare rock at the top of the Key. The wind never stops up here.']}[n]||['Ground.'];return pick(L);}
function seaName(x,y){const d=seaDepth(x,y);if(curK&&curK(x,y)>.2)return 'The current';if(onIsletK&&KFEAT){for(const f of KFEAT)if(f.kind==='reef'&&fDepth(f,x,y)<STAND&&Math.hypot(x-f.x,y-f.y)<f.rx*1.2)return 'A reef';}return d<STAND?'The shallows':'The sea';}
function seaLine(x,y){const n=seaName(x,y),L={
 'The current':['The water runs hard to the west here. It would carry me straight back to the Key.'],
 'A reef':['Shallow water over coral and old shells. I could stand out there.'],
 'The shallows':['Clear and warm. Little fish dart off at my shadow.','Shallow enough to wade. The sand ripples underneath.'],
 'The sea':['The Lantern Sea. Somewhere out there is the Far Light.','Big. Wet. Full of fish and secrets.','Deep, dark water. Swimmable, if I keep moving.']}[n];return pick(L);}
/* you */
function youObject(o){o.push({x:P.x,y:P.y-24,r:14,name:S.char&&S.char.name?S.char.name:'You',key:'self',onExamine:()=>think(pick(['Still here. Still a bit salty.','Washed up, dried off, getting on with it.','Me. Mostly in one piece.']))});}
/* Brimble's two flat hearthstones by the tripod */
function hearthObject(o){o.push({x:FIRE.x+66,y:FIRE.y+14,r:12,name:'Hearthstones',key:'hearthstone',onExamine:()=>think(pick(['Two flat stones by the tripod, where the teapot goes when it comes off the heat.','A ring of fire stones round Brimble, and two flat ones for setting things down. Warm to the touch.']))});}
