/* World memory engine (build 42). Runs the registry in 32-world-registry.js.
   S.wm = {n: deed counter, d: deeds [seq, id, game time, x, y, realm 0 Key / 1 forest] (last WM_CAP kept),
           k: {who: {seq: [certainty, game time learned, shown]}}, r: {who: {t, f, w}}, shoo: until (ms), tithe: day}.
   A deed is seen by its subject and by witnesses in sight (fog, night and canopy hide it); the gulls see open ground
   anywhere in daylight. Gossip passes along WREG talk edges on the game clock (seeded, so a reload agrees) and blurs:
   certainty drops each telling. A dweller's regard moves only when they learn a deed, pulled toward the deed's sign
   by its weight, certainty and how much they care, so the latest deeds count most and nothing fades with time.
   Fear gets you labour and goods, warmth gets you knowledge (events, read when you talk). */
const WM_CAP=120,WM_SIGHT=360;
function wmS(){const m=S.wm=S.wm||{};m.n=m.n||0;m.d=m.d||[];m.k=m.k||{};m.r=m.r||{};return m;}
function wmR(who){const m=wmS();return m.r[who]=m.r[who]||{t:0,f:0,w:0};}
function wmPeek(who){const m=S.wm;return (m&&m.r&&m.r[who])||{t:0,f:0,w:0};}
function wmPos(who){return who==='mortimer'?GULL:who==='gubbins'?G:who==='brimble'?MAINFIRE:null;}
function wmCanopy(x,y){if(!SH.on)return false;for(const t of shTrees){if(Math.abs(t.x-x)>60||Math.abs(t.y-y)>90)continue;if(tstage(t).c>0&&Math.hypot(t.x-x,t.y-(y+30))<30*t.s)return true;}return false;}
/* how sure a witness is that they saw it: 0 not seen, 1 seen */
function wmSees(who,x,y,realm,seq){const W=WREG.who[who];if(!W||!W.sees||!W.sees.includes(realm?'forest':'key'))return 0;
 const fog=fogR();
 if(W.kind==='flock'){if(dark>.3||fog<400||wmCanopy(x,y))return 0;return hash1(seq*3.7+11)<.75?1:0;}
 if(realm)return 0;const p=wmPos(who);if(!p)return 0;const sight=Math.min(who==='brimble'?WM_SIGHT:WM_SIGHT*(1-dark)+90*dark,fog);
 return Math.hypot(p.x-x,p.y-y)<=sight?1:0;}
function wmDeed(id,x,y){const D=WREG.deeds[id];if(!D)return;const m=wmS(),seq=++m.n,t=gNow(),realm=SH.on?1:0;
 m.d.push([seq,id,t,Math.round(x),Math.round(y),realm]);
 while(m.d.length>WM_CAP){const old=m.d.shift();for(const w in m.k)delete m.k[w][old[0]];}
 if(WREG.who[D.to].kind==='dweller')wmLearn(D.to,seq,1,t,1);
 for(const w in WREG.who)if(w!==D.to&&wmSees(w,x,y,realm,seq))wmLearn(w,seq,1,t,0);
 wmTick();save();}
function wmFind(seq){const d=S.wm.d;for(let i=d.length-1;i>=0;i--)if(d[i][0]===seq)return d[i];return null;}
function wmLearn(who,seq,cert,t,shown){const m=wmS(),K=m.k[who]=m.k[who]||{};if(K[seq])return false;const dd=wmFind(seq);if(!dd)return false;
 K[seq]=[Math.round(cert*100)/100,t,shown?1:0];const W=WREG.who[who];if(W.kind!=='dweller')return true;
 const D=WREG.deeds[dd[1]],care=D.to===who?1:((W.care&&W.care[D.to])||.5),R=wmR(who);
 for(const a of ['t','f','w']){const v=D.fx[a];if(!v)continue;const goal=v>0?1:a==='f'?0:-1,k=Math.min(1,Math.abs(v)*cert*care*.5);R[a]=Math.round((R[a]+(goal-R[a])*k)*1000)/1000;}
 return true;}
/* gossip: every known deed passes along each talk edge once its delay has passed on the game clock */
function wmTick(){const m=S.wm;if(!m||!m.d||!m.d.length)return;const T=gNow();let ch=false;
 for(let pass=0;pass<6;pass++){let any=false;
  for(const w in WREG.who){const W=WREG.who[w],K=m.k[w];if(!W.talks||!K)continue;
   for(const s in K){const [c,t0]=K[s];W.talks.forEach(([to,h,keep],i)=>{const tK=m.k[to];if(tK&&tK[s])return;const at=t0+h*HOUR*(.75+.5*hash1(+s*13.1+i*7.3));
    if(T>=at&&wmLearn(to,+s,c*keep,at,0))any=ch=true;});}}
  if(!any)break;}
 if(ch)save();}
setInterval(()=>{try{wmTick();}catch(e){}},2000);
/* the line a dweller says about the latest thing they heard and have not spoken of yet */
function wmHeard(who){const m=S.wm,K=m&&m.k&&m.k[who],W=WREG.who[who];if(!K||!W.hear)return null;let best=null;
 for(const s in K){const e=K[s];if(e[2])continue;e[2]=1;const dd=wmFind(+s);if(!dd)continue;const D=WREG.deeds[dd[1]];if(!W.hear[D.line])continue;if(!best||e[1]>best.t)best={t:e[1],c:e[0],line:D.line};}
 if(!best)return null;save();return W.hear[best.line][best.c>=.8?0:1];}
/* which event outcome a dweller is in now (null: neither) */
function wmMood(who){let best=null,bm=0;for(const k in WREG.events){const E=WREG.events[k];if(E.who!==who)continue;const R=wmPeek(who);
 for(const o in E.outcomes){const wh=E.outcomes[o].when;let mg=1e9;for(const a in wh)mg=Math.min(mg,R[a]-wh[a]);if(mg>=0&&(best===null||mg>bm)){best=o;bm=mg;}}}return best;}
function wmLine(who,o){for(const k in WREG.events){const E=WREG.events[k];if(E.who===who&&E.outcomes[o])return E.outcomes[o].line;}return '';}
/* the style picture: the last 40 deeds, each axis -1..1, null where nothing has fed it yet */
function wmStyle(){const d=(S.wm&&S.wm.d||[]).slice(-40),st={};if(!d.length)return st;let h=0,r=0;const tg={};
 for(const x of d){const D=WREG.deeds[x[1]];h+=D.hand==='accord'?1:-1;r+=x[5]?1:-1;for(const t of D.tags)tg[t]=(tg[t]||0)+1;}
 st.hand=h/d.length;st.roam=r/d.length;for(const k of ['pace','care']){const [a,b]=WREG.style[k].tags,n=(tg[a]||0)+(tg[b]||0);st[k]=n?((tg[b]||0)-(tg[a]||0))/n:null;}return st;}

/* ---- gifts: what each outcome gives (the registry's GIFTS) ---- */
function gubbinsTip(){let b=null,bd=1e9;for(const s of spots){if(s.type==='moon'||s.st!=='on')continue;const d=Math.hypot(s.x-P.x,s.y-P.y);if(d<bd){bd=d;b=s;}}
 if(!b)return 'Nothing biting this minute. Give it a breath and look for bubbles.';return wmLine('gubbins','warm').replace('{dir}',compass(b.x-P.x,b.y-P.y));}
function brimbleForecast(){const t=gNow(),day=24*HOUR;let sh=null;const n0=Math.floor(t/DAY_PERIOD);
 for(let n=n0;n<n0+3&&!sh;n++){const s=showerOf(n);if(s&&s.e>t&&s.s-t<day&&!stormAt(s.s))sh=s;}
 const cur=stormAt(t),ns=nextStorm(t);let a=wmLine('brimble','warm')+' ';
 if(cur)a+='We’re in it now. It eases '+whenWords(cur.e)+'.';
 else if(ns&&ns.s-t<day)a+='A monsoon, '+whenWords(ns.s)+'. Get your wood up high.';
 else a+='No monsoon this side of tomorrow.';
 a+=sh?(sh.s<=t?' And this rain passes soon.':' A shower, '+whenWords(sh.s)+'.'):' No rain worth the name.';return a;}
function brimbleCooks(){let n=0;S.inv.forEach((it,i)=>{if(FISH[it.id]){S.inv[i]={id:'cook',f:it.id,q:'good',c:it.c};n++;}});if(!n)return;sfx('plate');save();
 say('Brimble',wmLine('brimble','afraid')+' There. '+n+' cooked. Plain. Don’t expect golden from a nervous stove.',wickOpts());}
function mortimerNews(){const f=w=>{const o=wmMood(w);return o==='warm'?'thinks you’re alright':o==='afraid'?'gets twitchy when your name comes up':'hasn’t made up his mind about you';};
 return wmLine('mortimer','warm')+' Gubbins '+f('gubbins')+'. Brimble '+f('brimble')+'. The flock sees everything, mind. Mostly.';}
function mortTithe(){if(wmMood('mortimer')!=='afraid')return;const day=Math.floor(gNow()/DAY_PERIOD);if(S.wm.tithe===day)return;S.wm.tithe=day;S.shells+=5;sfx('shells');think(wmLine('mortimer','afraid'));save();}
/* ---- Mortimer: the two deeds ---- */
function mortShooed(){return !!(S.wm&&S.wm.shoo>Date.now());}
function goldenIdx(){return S.inv.findIndex(i=>i.id==='cook'&&i.q==='perfect');}
function mortGift(){const i=goldenIdx();if(i<0){think('I’d need something golden. Truly crunchy.');return;}S.inv.splice(i,1);sfx('eat');pop('*CRUNCH*',GULL.x,GULL.y-60,'#fff',18);
 wmDeed('mort_gift',GULL.x,GULL.y);
 say('Mortimer Gull',pick(['Golden. Both sides. *CRUNCH*. This is a deposit the Gull Post will remember.','For me? *CRUNCH*. Oh, that’s the good stuff. You have an account in good standing, friend.']),[{l:'Open the bank',f:()=>{closeDlg();openBank();}},{l:'See you',f:closeDlg}]);}
function mortShoo(){if(!axeWhole()){think('Flapping my arms at a banker won’t do it. I’d need some reach.');return;}if(mortShooed())return;
 P.face=GULL.x>P.x?1:-1;SC.fx=[{kind:'sweep',tx:GULL.x,ty:GULL.y-30,t:0,r:30}];sfx('sweep');S.st.sweeps=(S.st.sweeps||0)+1;
 if(!hasSkill('strife')){unlockSkill('strife');discover('strife');toast('New skill: Dominion, Strife');}addXP('strife',2,'normal',[GULL.x,GULL.y-70]);axeWear('blunt');
 S.wm=wmS();S.wm.shoo=Date.now()+HOUR;pop('*SQUAWK*',GULL.x,GULL.y-70,'#fff',19);sfx('squeak');
 wmDeed('mort_shoo',GULL.x,GULL.y);think(pick(['Off he goes, circling and squawking. The Gull Post is shut until he lands.','He’s up, wheeling over the post and swearing in gull. No banking for a while.']));}
/* body tells: Brimble's flame, Mortimer leaning away; Gubbins is in drawGubbins */
function wmFlame(){const R=wmPeek('brimble');return Math.max(.6,1+.22*Math.max(0,R.w)-.38*R.f);}
function drawGullAloft(){const {x,y}=GULL;shadow(x,y+3,14,4);ln([[x,y],[x,y-26]],1001,8,INK,.6);ln([[x,y],[x,y-26]],1001,4.5,'#a8703f',.6);sketch(rrPts(x-17,y-22,34,13,3),true,1002,1,'#e8d6b0',INK,2.4);ln([[x-10,y-16],[x+9,y-16]],1003,1.8,INK,.8);
 const a=now*1.6,gx=x+Math.cos(a)*46,gy=y-110+Math.sin(a)*14,fl=Math.sin(now*14)*7,f=Math.cos(a+1.57)>0?1:-1;
 blob(gx,gy,9,6,1012,'#fbfbff',2.2,.6);ln([[gx-2,gy-2],[gx-13,gy-8-fl],[gx-22,gy-4-fl*.6]],1013,2,INK,.4);ln([[gx+2,gy-2],[gx+13,gy-8-fl],[gx+22,gy-4-fl*.6]],1014,2,INK,.4);
 dot(gx+f*6,gy-3,1.2);sketch([[gx+f*8,gy-2],[gx+f*13,gy-1],[gx+f*8,gy+1]],true,1015,.2,'#ffcf3a',INK,1.2);}
