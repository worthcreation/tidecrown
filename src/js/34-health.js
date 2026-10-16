/* Health, death and wrecks (build 43). docs/body-and-technique.md (Health) and design-rules (Death).
   S.hp {v, max, low}: the only pool. Only harm drains it (a jelly sting, drowning, a Hollowmaw's lunge); effort never does.
   It refills on its own once you are out of danger, faster by a lit fire or with a cooked-fish buff, and the pool grows a
   little each time you come back from a hard knock. Shown on the body (slower, hunched) and as dimming screen edges.
   Empty: you collapse (land) or drown (water). You wake at the nearest shore (Brimble's fire on the Key, the last island
   you stood on in the forest) with little health. Your pack stays where you fell as a wreck: on land a heap that crabs
   and gulls pick at; at sea the floating things drift ashore over a few hours (some the tide keeps), salt and ash
   dissolve, the rest sinks where you went down, reachable by wading if it is in standing depth (low tide helps).
   What the gulls take turns up at the Gull Post (S.gheld). S.deaths keeps each death for the thief (build 44).
   S.wrecks [{id, x, y, r realm, sea, items, st last scavenged, due drift landing time (0: there now)}]. */
const HP0=10,HPCAP=20,HP_REGEN=120,STING=3,LUNGE=3,DROWN=.8;
const FLOATS=new Set(['wood','kelp','wobble','charcoal','driftlog','crate','plank','net','timber','pole','rootwood','fatwood','burl','blackwood','twistwood','deadwood','bottle','hatchet','twine','coat',
 'br_blackwood','br_twistwood','br_ironbark','br_wobble','lb_blackwood','lb_twistwood']);
const DISSOLVE=new Set(['seasalt','ash','bait']);
const CRAB_EATS=it=>it.id==='cook'||!!FISH[it.id]||it.id==='bait';
const GULL_TAKES=it=>it.id==='cook'||!!FISH[it.id]||['bottle','pearl','sunstone','shellblade','axehead'].includes(it.id);
function hpS(){const h=S.hp=S.hp||{};if(!(h.max>0))h.max=HP0;if(!(h.v>=0))h.v=h.max;if(h.low==null)h.low=1;return h;}
function hpFrac(){const h=hpS();return Math.max(0,Math.min(1,h.v/h.max));}
let HPT={hurt:0,dead:false,wade:0};
function harm(n,cause){if(HPT.dead)return;const h=hpS();h.v=Math.max(0,h.v-n);HPT.hurt=Date.now();h.low=Math.min(h.low,h.v/h.max);hap(n>=2?[40,30,40]:20);if(h.v<=0)hpDie(cause);}
function hpDanger(){return Date.now()-HPT.hurt<6000||(SW.on&&(SW.sink>.3||SW.stun>0||SW.breath<.5));}
function hpTick(dt){const h=hpS();if(HPT.dead)return;
 if(h.v<h.max&&!hpDanger()){let k=1;for(const f of [MAINFIRE].concat(S.fires||[]))if(fireLit(f)&&!SH.on&&Math.hypot(f.x-P.x,f.y-P.y)<150){k=2;break;}if(S.buff&&S.buff.until>Date.now())k*=1.5;
  h.v=Math.min(h.max,h.v+h.max/HP_REGEN*k*dt);
  if(h.v>=h.max&&h.low<.6){const g=Math.round((1-h.low)*.5*100)/100;h.max=Math.min(HPCAP,h.max+g);h.v=h.max;h.low=1;if(g>0)think('That one taught me something. I’m a little tougher for it.');save();}}
 else if(h.v>=h.max)h.low=1;}
function hpSpeed(){const f=hpFrac();return f<.5?.65+.7*f:1;}
function hpHunch(){const f=hpFrac();return f<.5?(.5-f)*.3:0;}
/* dimming edges when hurt: faint at half, close at the end */
function hpScreen(){const f=hpFrac();if(f>=.5||HPT.dead)return;const k=(.5-f)*2,p=.85+.15*Math.sin(now*(2+k*4));const g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*(.55-k*.25),W/2,H/2,Math.max(W,H)*.75);
 g.addColorStop(0,'rgba(60,8,20,0)');g.addColorStop(1,`rgba(70,6,18,${(.35+.5*k)*p})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
/* ---- death ---- */
function hpDie(cause){if(HPT.dead)return;HPT.dead=true;const r=SH.on?1:0,x=P.x,y=P.y,atSea=SW.on||inSea(x,y);
 S.deaths=S.deaths||[];S.deaths.push({t:gNow(),c:cause,r});if(S.deaths.length>50)S.deaths.shift();
 wmDeed('went_down',x,y);makeWreck(x,y,r,atSea);
 /* wake: Brimble's fire on the Key, the last island you stood on in the forest */
 const s=SW.shore;swimEnd(false);SW.breath=1;SW.sink=0;SW.stun=0;SW.rec=0;SW.cramp=0;SW.stung=false;SW.blk=0;bubbles=[];P.path=[];P.task=null;P.then=null;
 if(r){const c=s&&s.sh?shClamp(s.x,s.y):shClamp(x,y);P.x=c[0];P.y=c[1];}
 else{const c=clampLand(FIRE.x+46,FIRE.y+30);P.x=c[0];P.y=c[1];P.face=-1;const dd=S.wm.d[S.wm.d.length-1];if(dd)wmLearn('brimble',dd[0],1,gNow(),0);}
 cam.x=P.x;cam.y=P.y;SW.fade=1.8;const h=hpS();h.v=h.max*.3;h.low=1;/* dying is not a knock survived: no growth from it */HPT.hurt=Date.now();
 discover('wreck');HPT.dead=false;
 think(r?'I came to on the shore. My pack is gone. My things are where I went down.':(atSea?'Warmth. Brimble’s fire. The sea let me go, but it kept my pack.':'I woke by Brimble’s fire. My pack is back where I fell.'));save();}
function makeWreck(x,y,r,sea){const inv=S.inv.splice(0);if(!inv.length)return;S.wrecks=S.wrecks||[];const T=gNow(),id=(S.st.wreckN=(S.st.wreckN||0)+1);
 if(!sea){S.wrecks.push({id,x:Math.round(x),y:Math.round(y),r,sea:0,items:inv,st:T,due:0});return;}
 const sink=[],fl=[];for(const it of inv){if(DISSOLVE.has(it.id))continue;if(FLOATS.has(it.id)){if(hash1(id*7.1+fl.length*3.3)<.75)fl.push(it);}else sink.push(it);}
 if(sink.length)S.wrecks.push({id,x:Math.round(x),y:Math.round(y),r,sea:1,items:sink,st:T,due:0});
 if(fl.length){let lx,ly;if(r){const c=shClamp(x,y);lx=c[0];ly=c[1];}else{const a=Math.atan2(y,x)+(hash1(id*2.9)-.5)*.5,e=polar(a,iR(a)-14),c=clampLand(e[0],e[1]);lx=c[0];ly=c[1];}
  S.wrecks.push({id:id+.5,x:Math.round(lx),y:Math.round(ly),r,sea:0,items:fl,st:T,due:T+(1+hash1(id*5.3)*4)*HOUR,drift:1});}}
/* scavengers, by the game hour: crabs eat food on a heap, gulls take food and shiny things by day (to the Gull Post) */
function wreckTick(){const T=gNow();let ch=false;for(const w of S.wrecks||[]){if(w.due&&T<w.due){w.st=T;continue;}
 let n=0;while(T-w.st>=HOUR&&n<48){w.st+=HOUR;n++;if(w.sea)continue;const day=((w.st/DAY_PERIOD)%1),light=day>.27&&day<.75;
  for(let i=w.items.length-1;i>=0;i--){const it=w.items[i],h=hash1(w.id*9.7+w.st/HOUR*1.3+i);
   if(CRAB_EATS(it)&&h<.12){w.items.splice(i,1);ch=true;}
   else if(light&&GULL_TAKES(it)&&h>.86){w.items.splice(i,1);(S.gheld=S.gheld||[]).push(it);ch=true;}}}
 if(n)ch=true;}
 if(S.wrecks)S.wrecks=S.wrecks.filter(w=>w.items.length);if(ch)save();}
setInterval(()=>{try{wreckTick();}catch(e){}},2000);
function wreckHere(w){return w.r===(SH.on?1:0)&&!(w.due&&gNow()<w.due);}
function wreckReach(w){return !w.sea||depthAt(w.x,w.y)<STAND;}
function wreckTake(w){let took=0;for(let i=w.items.length-1;i>=0;i--){const it=w.items[i],n=it.n||1;
 if(stackOf(it.id)){const g=addItem(it.id,n);took+=g?1:0;if(g>=n)w.items.splice(i,1);else if(g)it.n=n-g;}
 else if(S.inv.length<PACK){const c=Object.assign({},it);delete c.c;S.inv.push(c);w.items.splice(i,1);took++;}}
 if(took){sfx('grab');addXP('foraging',2+took,'normal',[w.x,w.y-30]);}
 S.wrecks=(S.wrecks||[]).filter(x=>x.items.length);
 think(!took?'No room in my pack.':w.items.length?'My pack’s full. The rest is still here.':pick(['Got it all back. Mostly.','My things. A bit salty, but mine.']));save();}
function wreckObjects(o){for(const w of S.wrecks||[]){if(!wreckHere(w))continue;const reach=wreckReach(w),go=w.sea?()=>walkStraight(w.x,w.y-4,()=>wreckTake(w)):()=>{const c=clampLand(w.x-16,w.y+6);routeTo(c[0],c[1],()=>wreckTake(w));};
 o.push({x:w.x,y:w.y-8,r:24,name:w.drift?'My things, washed up':'My things',key:'wreck',act:reach?'Gather':null,onAct:reach?go:null,
  onExamine:()=>think(w.drift?'Bits of my pack the sea brought back. '+w.items.length+' thing'+(w.items.length>1?'s':'')+'.':w.sea?(reach?'My things, on the bottom. Shallow enough to reach.':'My things, down on the bottom, out of my depth. At low tide, maybe.'):'Where I fell. '+w.items.length+' thing'+(w.items.length>1?'s':'')+' left. The crabs have been at it.')});}}
function wreckDraws(d){for(const w of S.wrecks||[])if(wreckHere(w))d.push([w.y,()=>drawWreckOne(w),w.x]);}
function drawWreckOne(w){const {x,y}=w;if(w.sea){ctx.globalAlpha=depthAt(x,y)<STAND?.75:.4;}else shadow(x,y+2,16,5);
 for(let i=0;i<Math.min(4,w.items.length);i++){const a=i*2.1+w.id,ox=Math.cos(a)*9,oy=Math.sin(a)*4;ctx.drawImage(iconImg(itemIcon(w.items[i])),x+ox-11,y+oy-18+(w.sea?Math.sin(now*1.5+i)*1.2:0),22,22);}
 if(!w.sea)ln([[x-14,y+1],[x-4,y-3],[x+6,y],[x+14,y-2]],1101+(w.id|0),1.6,INK,.5);ctx.globalAlpha=1;}
function wreckMarks(m){for(const w of S.wrecks||[])if(wreckHere(w))m.push([w.x,w.y,'#c08a3a',2.6]);}
/* the Gull Post: what the gulls took, back for a fee that reads Mortimer's regard */
function gheldOpt(mo){const g=S.gheld||[];if(!g.length)return;mo.push({l:'The gulls took my things ('+g.length+')',f:gheldTalk});}
function gheldTalk(){const g=S.gheld||[],md=wmMood('mortimer'),fee=md?0:2*g.length;
 const back=()=>{let n=0;for(let i=g.length-1;i>=0;i--){const it=g[i];if(stackOf(it.id)){const k=it.n||1,got=addItem(it.id,k);if(got>=k){g.splice(i,1);n++;}else if(got)it.n=k-got;}else if(S.inv.length<PACK){const c=Object.assign({},it);delete c.c;S.inv.push(c);g.splice(i,1);n++;}}return n;};
 const bye=[{l:'See you',f:closeDlg}];
 if(!fee){const n=back();save();say('Mortimer Gull',(md==='warm'?'For a friend of the Post? No charge. The flock brought these in. Sorry about the beak marks.':'No... no fee. Take them. The flock didn’t know they were yours. Honestly.')+(g.length?' Your pack’s full, the rest waits here.':''),bye);return;}
 say('Mortimer Gull','The flock brought these in off a heap on the sand. Finder’s fee, '+fee+' shells. Rules of the Post.',[{l:'Pay '+fee+' shells',f:()=>{if(S.shells<fee){say('Mortimer Gull','You have '+S.shells+'. The Post can wait. The Post is very patient.',bye);return;}S.shells-=fee;sfx('shells');const n=back();save();say('Mortimer Gull','Pleasure doing business. '+(g.length?'Pack’s full; the rest waits here.':'All yours.'),bye);}},{l:'Not now',f:closeDlg}]);}
/* ---- stings: harm, a freeze, then a beat to catch or you go under ---- */
function stingHit(j){harm(STING,'sting');if(HPT.dead||!SW.on)return;SW.stun=1.4;SW.stung=true;SW.rec=0;SW.sink=Math.max(SW.sink,.5);SW.breath=Math.max(0,SW.breath-.18);sfx('zap');
 const ax=P.x-j.x,ay=P.y-j.y,n=Math.hypot(ax,ay)||1;SW.vx=ax/n*160;SW.vy=ay/n*160;streak('swim',false);pop('*zap*',P.x,P.y-50,'#fff',19);discover('jelly');
 think(pick(['Stung. I can’t move my arms.','A lantern jelly. Everything’s gone stiff.']));}
function recWin(){return .9+Math.min(.6,lv('swimming')*.02);}
function stingTick(dt){if(SW.stung&&SW.stun<=0&&SW.rec<=0&&!SW.cramp){SW.rec=recWin();pop('*gasp*',P.x,P.y-56,'#fff',18);hap(15);}
 if(SW.rec>0){SW.rec-=dt;if(SW.rec<=0&&SW.stung){SW.stung=false;SW.rec=0;SW.cramp=4;SW.sink=1;think('I missed it. I’m going under.');}}
 if(SW.cramp>0){SW.cramp=Math.max(0,SW.cramp-dt);SW.sink=Math.min(1,SW.sink+dt*.6);}}
/* called from a stroke or tread with whether it was on the beat; returns false if the stroke does nothing */
function stingStroke(good){if(SW.rec>0&&SW.stung){if(good){SW.stung=false;SW.rec=0;SW.sink=0;SW.breath=Math.min(1,SW.breath+.15);burst('swimming','Shook it off',8,[P.x,P.y-60]);think('Up. Breathe. Arms back.');}return true;}
 if(SW.cramp>0){if(!good)return false;SW.cramp=Math.max(0,SW.cramp-1.5);if(!SW.cramp)think('Up again. Barely.');}return true;}
/* wading: a sting hurts but you keep your feet */
function wadeSting(){if(SW.on||HPT.dead||!inSea(P.x,P.y)||Date.now()-HPT.wade<2000)return;for(const j of jellies)if(Math.hypot(j.x-P.x,j.y-P.y)<24){HPT.wade=Date.now();harm(2,'sting');sfx('zap');pop('*zap*',P.x,P.y-50,'#fff',19);discover('jelly');think('Stung, but I kept my feet.');return;}}
/* lantern jellies: a shimmer by day, a glow by night */
function jellyVis(){return .25+.75*Math.min(1,dark/.4);}
