/* ---------- interactions ---------- */
function routeTo(x,y,then){P.task=null;const path=[];const pd=onDock(P.x,P.y)&&!onIsland(P.x,P.y),td=onDock(x,y)&&!onIsland(x,y);
 if(pd!==td)path.push([R0-25,0]);path.push([x,y]);P.path=path;P.then=then||null;P.pathT=0;mark={x,y,t:0};}
function goFish(sp){const L=lv('fishing');if(L<REQ[sp.type]){think(sp.type==='deep'?'This water is too wild for me yet. (Fishing '+REQ.deep+')':'The pale fish ignore my line. (Fishing '+REQ.moon+')');return;}
 if(S.inv.length>=PACK){think('My satchel is stuffed. Gubbins on the dock might want these.');return;}
 routeTo(sp.ax,sp.ay,()=>startFish(sp));}
function cast(T){T.phase='cast';T.t=0;T.baited=false;if(S.bait>0){S.bait--;T.baited=true;}}
function startFish(sp){if(S.inv.length>=PACK){think('No room left in my satchel.');return;}P.task={sp,phase:'cast',t:0};P.face=sp.x>P.x?1:-1;cast(P.task);if(S.hint===1)advanceHint(2);}
function rollFish(sp){if(sp.type==='shallow'&&S.bottles<BOTTLES.length&&Math.random()<.05)return'bottle';const L=lv('fishing');
 const pool=Object.keys(FISH).filter(k=>FISH[k].spot===sp.type&&FISH[k].lvl<=L);let tot=pool.reduce((s,k)=>s+FISH[k].w,0),r=Math.random()*tot;for(const k of pool){r-=FISH[k].w;if(r<=0)return k;}return pool[0];}
function hook(){const T=P.task;const perfect=T.t*1000<T.win*(.35+eff('perfect'));const f=T.fish;
 if(f==='bottle'){S.inv.push({id:'bottle',msg:S.bottles});S.bottles++;addXP('fishing',5,'first',[P.x,P.y-30]);flies.push({id:'bottle',x0:T.sp.x,y0:T.sp.y,t:0});}
 else{const F=FISH[f];S.inv.push({id:f});let xp=F.xp;if(perfect)xp=Math.round(xp*1.5);
  addXP('fishing',xp,perfect?'perfect':(!S.journal['fish_'+f]?'first':'normal'),[P.x,P.y-30]);if(perfect)S.st.perf=(S.st.perf||0)+1;S.st.fc=S.st.fc||{};S.st.fc[f]=(S.st.fc[f]||0)+1;if(perfect){S.st.fp=S.st.fp||{};S.st.fp[f]=(S.st.fp[f]||0)+1;}discover('fish_'+f);flies.push({id:f,x0:T.sp.x,y0:T.sp.y,t:0});}
 rollGear(T.sp);S.catches++;T.phase='reel';T.t=0;
 if(S.hint===2)advanceHint(3);if(S.catches>=4&&S.hint===3)advanceHint(4);
 if(S.inv.length>=PACK){think('Satchel\u2019s full. Gubbins on the dock trades fish for shells.');}
 save();}
function tooEarly(){const T=P.task;T.phase='miss';T.t=0;pop('Too soon! They scattered.',P.x,P.y-70,'#fff',19);}

function talkG(){discover('gubbins');G.talk=true;P.face=1;
 if(!S.metG){S.metG=true;say('Gubbins','Oi! Mind the paint. Name\u2019s Gubbins. I\u2019m a bucket. A talking one, which is rarer. You washed up here, so you\u2019re a fisher now. Them bubbles off the shore? Fish. Go on.',gOpts());return;}
 say('Gubbins',pick(['Back again. Smells like you brought snacks.','Bucket business is slow. Got fish?','The sea\u2019s been chatty today. Never says anything useful.','You\u2019ve got that look. The far-off look. Dangerous, that.']),gOpts());}
function gOpts(){const o=[];const n=S.inv.filter(i=>itemVal(i)>0).length;if(n)o.push({l:'Sell to Gubbins ('+n+')',f:sellPick});
 o.push({l:'Glitter bait, 5 casts (20 shells)',f:buyBait});if(!S.owned.coat)o.push({l:'Oilskin coat (60 shells)',f:buyCoat});o.push({l:'What is this place?',f:lore});o.push({l:'See you',f:closeDlg});return o;}
function buyBait(){if(S.shells<20){say('Gubbins','That\u2019s 20 shells, friend. You\u2019ve got '+S.shells+'. Fish more, talk less.',gOpts());return;}
 if(!canAdd('bait',5)){say('Gubbins','No room in that pack for bait, friend.',gOpts());return;}S.shells-=20;S.bait+=5;save();say('Gubbins','Glitter bait. Fish go silly for it. Bites come quicker and hang on longer.',gOpts());}
function valOf(it){const v=itemVal(it);return v?v+(S.eq.trinket==='salttin'?1:0)+(S.eq.head==='stache'?1:0):0;}
let sellSel=new Set();
function sellPick(){sellSel=new Set();renderSell();}
function renderSell(){const list=S.inv.map((it,i)=>[it,i]).filter(([it])=>valOf(it)>0);if(!list.length){say('Gubbins','Nothing I can eat. Fish, friend. Fish.',gOpts());return;}
 const tot=[...sellSel].reduce((a,i)=>a+valOf(S.inv[i]),0);curWho='Gubbins';
 dlg.querySelector('.who').textContent='Gubbins';dlg.querySelector('.say').textContent=sellSel.size?'Mm. '+sellSel.size+' for me, then?':(S.eq.head==='stache'?'That mustache... magnificent. Pick what I get to eat. I’ll pay extra.':'Pick what I get to eat.');
 dlg.querySelector('.opts').innerHTML='<div class="sellg">'+list.map(([it,i])=>`<button class="st${sellSel.has(i)?' on':''}" data-si="${i}" aria-label="${itemName(it)}"><img src="${icon(itemIcon(it))}" alt=""><b>${valOf(it)}</b></button>`).join('')+
  `</div><div class="sellrow"><button class="go" data-sa="sell"${sellSel.size?'':' disabled'}>Sell for ${tot} shells</button><button data-sa="all">${sellSel.size===list.length?'None':'All'}</button><button data-sa="back">Back</button></div>`;
 dlg.style.display='block';dlgOn=true;G.talk=true;}
dlg.querySelector('.opts').addEventListener('click',e=>{const t=e.target.closest('[data-si]');if(t){const i=+t.dataset.si;sellSel.has(i)?sellSel.delete(i):sellSel.add(i);renderSell();e.stopPropagation();return;}
 const a=e.target.closest('[data-sa]');if(!a)return;e.stopPropagation();const act=a.dataset.sa;
 if(act==='back'){say('Gubbins','Changed your mind? Buckets understand.',gOpts());return;}
 if(act==='all'){const list=S.inv.map((it,i)=>[it,i]).filter(([it])=>valOf(it)>0);sellSel=sellSel.size===list.length?new Set():new Set(list.map(x=>x[1]));renderSell();return;}
 if(act==='sell'&&sellSel.size){let v=0;[...sellSel].sort((a,b)=>b-a).forEach(i=>{v+=valOf(S.inv[i]);S.inv.splice(i,1);});S.shells+=v;sellSel=new Set();save();
  say('Gubbins',pick(['*slurp* Lovely. That’s '+v+' shells. Don’t ask where I keep them.','*crunch* Ooh, that one had character. '+v+' shells for you.','*gulp* Bucket’s happy. Here’s '+v+' shells.']),gOpts());}});
function buyCoat(){if(S.shells<60){say('Gubbins','Sixty shells for the coat. It was my uncle’s. He was a mop.',gOpts());return;}
 if(S.inv.length>=PACK){say('Gubbins','Your pack’s full. Make some room first.',gOpts());return;}
 S.shells-=60;S.owned.coat=1;S.inv.push({id:'coat'});save();say('Gubbins','There. Keeps the spray off and the dark back. Put it on from your satchel.',gOpts());}
function spyglass(){discover('horizon');think(dark<.2?'Through the spyglass: a crooked tower, far to the northeast. Something on top blinks.':'Too dark for detail. Just one tiny light blinking, far to the northeast.');}
function rollGear(sp){const L=lv('fishing');let g=null;
 if(sp.type==='shallow'&&L>=3&&!S.owned.cap&&Math.random()<.03)g='cap';else if(sp.type==='deep'&&!S.owned.gloves&&Math.random()<.04)g='gloves';
 if(!g)return;if(S.inv.length>=PACK){think('Something was tangled on the hook, but my satchel is full. It slipped away.');return;}
 S.inv.push({id:g});S.owned[g]=1;toast('Found: '+EQUIP[g].name);pop('Something tangled on the line!',P.x,P.y-120,'#ffcf3a',18);}
function lore(){discover('gubbinslore');say('Gubbins','Driftwood Key. Smallest island in the Lantern Sea. Folk say past the last lighthouse there\u2019s the Far Light, where dreams go to come true. Folk say lots of things. Mostly to buckets.',gOpts());}
function examineHead(){discover('head');think(dark>.25?'A stone head, half buried. Its eyes are glowing faintly. Its mouth is open.':'A stone head, half buried in the sand. Eyes shut, mouth shut, very old.');}
function listenHead(){if(dark>.25){discover('headnight');think('It’s humming. Something about the west shore, and the moon.');}else think(pick(['Nothing. Just wind whistling through a stone ear.','I press my ear to it. Silence. It feels like it’s waiting for dark.']));}
function saluteCrab(){discover('crab');CRAB.hop=.5;S.salutes=(S.salutes||0)+1;
 if(S.salutes>=3&&!S.owned.thimble){if(S.inv.length>=PACK){think('Sir Thimble wants to give me something. My satchel is too full.');return;}
  S.owned.thimble=1;S.inv.push({id:'thimble'});save();toast('Found: Thimble Helm');think('Sir Thimble takes off his helmet and offers it to me. He has a spare.');return;}
 think(S.salutes>1?pick(['Sir Thimble salutes again. Crisper this time.','We salute. He clicks approvingly.','He salutes with both claws. Showing off.']):'A crab wearing a thimble for a helmet. He salutes. I salute back. Friends now.');}

let objT=-1,objC=null;
function objects(){if(objT===now&&objC)return objC;const o=[];objT=now;objC=o;
 spots.forEach(sp=>{if(sp.type==='moon'&&dark<.15)return;o.push({x:sp.x,y:sp.y,r:42,name:{shallow:'Bubbling water',deep:'Wild water',moon:'Glowing pool'}[sp.type],act:'Fish',onAct:()=>goFish(sp),
  onExamine:()=>think({shallow:'Little fish, busy with little fish business.',deep:'Something heavy is thrashing down there.',moon:'Pale shapes circling slowly. Waiting for something.'}[sp.type])});});
 o.push({x:G.x,y:G.y-20,r:30,name:'Gubbins',key:'gubbins',act:'Talk',onAct:()=>routeTo(G.x-36,6,talkG),onExamine:()=>think('A bucket with opinions.')});
 o.push({x:SIGN.x,y:SIGN.y-30,r:30,name:'Sign',key:'sign',act:'Read',onAct:()=>{discover('sign');say('Sign','DRIFTWOOD KEY. Population: one bucket. Two now, probably.');},onExamine:()=>think('A crooked sign. Someone wrote on it with a burnt stick.')});
 o.push({x:FIRE.x,y:FIRE.y-14,r:30,name:S.metWick?'Brimble':'Campfire',key:S.metWick?'wick':'fire',act:S.metWick?(hasSkill('hearth')&&rawCount()?'Cook':'Talk'):'Poke',onAct:()=>tapFire(MAINFIRE),more:S.metWick&&hasSkill('hearth')&&rawCount()?[{l:'Talk',f:()=>routeTo(FIRE.x-34,FIRE.y+26,talkWick)}]:null,onExamine:()=>{discover('fire');think(S.metWick?'Brimble, crackling to himself.':'A little campfire. Wait. Did it just snore?');}});
 (S.fires||[]).forEach(fr=>{if(!fireLit(fr))return;const more=[{l:'Add driftwood',f:()=>feedFire(fr,'wood')}];if((S.wobble||0)>0)more.push({l:'Add wobblewood',f:()=>feedFire(fr,'wobble')});if(cnt('charcoal')>0)more.push({l:'Add charcoal',f:()=>feedFire(fr,'charcoal')});
  o.push({x:fr.x,y:fr.y-14,r:fr.big?36:28,name:fr.big?'Your bonfire':'Your fire',act:'Cook',onAct:()=>tapFire(fr),more,onExamine:()=>{const m=Math.max(1,Math.ceil((fr.until-Date.now())/60000));const h=lifeHeat(fr);think((fr.big?'My bonfire is ':'My fire is ')+(h>1?'roaring white-hot':h>.7?'burning strong':h>.45?'burning steady':'getting low')+'. About '+m+' minute'+(m>1?'s':'')+' left.');}});});
 if(KW.active){const k=S.kindle,here=KW.mode==='fire'&&Math.hypot(KW.x-KW.tx,KW.y-KW.ty)<8;
  o.push({x:KW.x,y:KW.y-7,r:22,name:k.seen?'Kindle':'Driftwood',act:KW.mode==='fire'?(here?'Offer ash':null):'Pick up',onAct:()=>KW.mode==='fire'?offerAsh():spookKindle(),
   onExamine:()=>think(KW.mode==='fire'?'The little log is warming himself by my fire, eyes half shut. He keeps glancing at the ash.':(k.seen?'The runaway log. He’s pretending to be ordinary driftwood. Badly.':'Driftwood. With eyes. That just blinked.'))});}
 o.push({x:GULL.x,y:GULL.y-30,r:30,name:'Mortimer Gull',key:'gullbank',act:'Bank',onAct:()=>routeTo(GULL.x+30,GULL.y+18,openBank),more:[{l:'Talk',f:()=>routeTo(GULL.x+30,GULL.y+18,talkGull)}],onExamine:()=>{discover('gullbank');think('A seagull in a tiny green visor, standing on a post marked BANK. He’s counting something with great seriousness.');}});
 (S.ground||[]).forEach(g=>o.push({x:g.x,y:g.y-6,r:18,name:itemName(g.it),act:'Pick up',onAct:()=>{const c=clampLand(g.x-14,g.y+6);routeTo(c[0],c[1],()=>pickGround(g));},onExamine:()=>think(itemDesc(g.it))}));
 (S.ashp||[]).forEach(a=>o.push({x:a.x,y:a.y-4,r:22,name:'Ash',key:'ash',act:'Scoop',onAct:()=>{const c=clampLand(a.x-18,a.y+6);routeTo(c[0],c[1],()=>scoopAsh(a));},onExamine:()=>think('Soft grey ash, still faintly warm. Smells like a story ending.')}));
 o.push({x:HEAD.x,y:HEAD.y-16,r:34,name:'Stone head',key:'head',act:'Listen',onAct:listenHead,onExamine:examineHead});
 o.push({x:CRAB.x,y:CRAB.y-6,r:22,name:'Thimble crab',key:'crab',act:'Salute',onAct:saluteCrab,onExamine:()=>{discover('crab');think(S.salutes?'Sir Thimble. My crab friend. His helmet is spotless.':'A crab wearing a thimble for a helmet. He’s staring at me like he expects something.');}});
 trees.forEach(t=>o.push({x:t.x+t.lean*t.s,y:t.y-50*t.s,r:34*t.s,name:'Wobble tree',key:'tree',act:'Chop',onAct:()=>chopTree(t),onExamine:()=>{discover('tree');think('It sways with no wind. I think it just sighed.');}}));
 const flintGone=S.owned.flint||S.owned.hatchet;
 for(const it of (S.shore||[]))if(!underFoam(it))o.push({x:it.x,y:it.y-6,r:20,name:itemName({id:it.id}),key:it.id==='wood'?'driftwood':it.id==='kelp'?'kelp':'wash',act:'Grab',onAct:()=>routeTo(it.x,it.y+4,()=>grabShore(it)),onExamine:()=>think(pick(['The sea dropped it. It wants it back.','Grab it before the next wave does.']))});
 for(const s of SURF)if(s.pile&&s.st==='sparkle')o.push({x:s.x,y:s.y-4,r:14,name:s.name,key:'piling',act:'Scrape salt',onAct:()=>scrapeSalt(s),onExamine:()=>think('Barnacled and briny. Between waves, it sparkles.')});
 rocks.forEach(k=>{const sf=SURF.find(s=>s.x===k.x&&s.y===k.y),sp=sf&&sf.st==='sparkle';o.push({x:k.x,y:k.y,r:k.rx+4,name:'Rocks',key:'rocks',act:sp?'Scrape salt':flintGone?null:'Search',onAct:sp?()=>scrapeSalt(sf):flintGone?null:()=>searchRocks(k),onExamine:()=>{discover('rocks');think('Barnacled rocks. The water past them churns like it’s hiding something big.');}})});
 o.push({x:POOL.x,y:POOL.y,r:44,name:'Still pool',key:'pool',act:'Look in',onAct:()=>routeTo(POOL.x,POOL.y+32,()=>{discover('pool');openCreator('mirror');}),onExamine:()=>{discover('pool');think('A pond so still it looks like glass. My reflection keeps trying on new faces.');}});
 return o;}
function objAt(wx,wy){let best=null,bd=1e9;for(const o of objects()){const d=Math.hypot(o.x-wx,o.y-wy);if(d<o.r+14&&d/o.r<bd){bd=d/o.r;best=o;}}return best;}
function s2w(sx,sy){return[(sx-W/2)/Z+cam.x,(sy-H/2)/Z+cam.y];}
function w2s(x,y){return[(x-cam.x)*Z+W/2,(y-cam.y)*Z+H/2];}

function tap(sx,sy){
 if(ctxOpen){closeCtx();return;}
 if(dlgOn){closeDlg();return;}
 if(intro!=null&&intro<2.2)intro=2.2;
 if(C){cookTap(sx,sy);return;}
 const T=P.task;
 if(T&&T.chop){const [px,py]=w2s(P.x,P.y-20);if(Math.hypot(sx-px,sy-py)<160*Z){strike();return;}}
 if(T&&!T.chop){if(T.phase==='bite'){hook();return;}
  const [px,py]=w2s(P.x,P.y-20);const near=Math.hypot(sx-px,sy-py)<110*Z;
  if(near){if(T.phase==='wait')tooEarly();return;}}
 const [wx,wy]=s2w(sx,sy);const o=objAt(wx,wy);
 if(o){(o.onAct||o.onExamine)();return;}
 const c=clampLand(wx,wy);routeTo(c[0],c[1]);}
function longPress(sx,sy){if(C)return;const [wx,wy]=s2w(sx,sy);const o=objAt(wx,wy);const items=[];let title;
 if(navigator.vibrate)try{navigator.vibrate(12);}catch(e){}
 if(o){title=o.name;if(o.act)items.push({l:o.act,f:o.onAct});if(o.more)o.more.forEach(m=>items.push(m));items.push({l:'Examine',f:o.onExamine});}
 else if(walkable(wx,wy)){title='Ground';items.push({l:'Walk here',f:()=>routeTo(wx,wy)});if(lv('survival')>=3){items.push({l:'Build a campfire (3 driftwood)',f:()=>buildFire(wx,wy,false)});if((S.wobble||0)>=2)items.push({l:'Build a bonfire (2 wobblewood, 2 driftwood)',f:()=>buildFire(wx,wy,true)});}items.push({l:'Examine',f:()=>think(pick(['Sand. Warm. Slightly judgmental.','Tiny footprints here. Not mine. Not the crab\u2019s either.','The grass is softer than it has any right to be.']))});}
 else{title='The sea';if(S.eq.trinket==='spyglass')items.push({l:'Look through spyglass',f:spyglass});items.push({l:'Walk to shore',f:()=>{const c=clampLand(wx,wy);routeTo(c[0],c[1]);}});items.push({l:'Examine',f:()=>think(pick(['The Lantern Sea. Somewhere out there is the Far Light.','Big. Wet. Full of fish and secrets.','I can\u2019t swim that far. Yet.']))});}
 showCtx(sx,sy,title,items);if(S.hint===3)advanceHint(4);}

