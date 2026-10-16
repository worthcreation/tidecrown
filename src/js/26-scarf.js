/* The scarf: every character wears one, and it is the weapon. Four moves. Strife: tap a thing in reach to slap it, slide at it to trip it. Accord: slide from it toward you to wrap it, slide back again while it is wrapped to bind it. Every creature telegraphs; a trip or slap on the tell counters it, a wrap on the tell mirrors it. Reach grows with Dominion level. Old Bollard on the pier is the practice post. */
const SC={fx:[],wrap:null,slaps:[]};
function reach(){return 48+lv('dominion')*5;}
function scarfCol(){return '#d9cdb5';}
/* Old Bollard: a cast-iron mooring post at the root of the pier. The Grinning Gull tied up to him once. He leans toward you now and then; that is his tell. */
const BOLLARD={x:R0-30,y:62,st:'still',t:0,wait:4,lean:0,said:0};
function scarfTargets(){const o=[];if(SH.on){for(const m of MAWS)o.push({x:m.x,y:m.y,r:22,kind:'maw',ref:m});for(const d of DEAD)o.push({x:d.x,y:d.y,r:22,kind:'dead',ref:d});for(const m of MOSS)o.push({x:m.x,y:m.y,r:20,kind:'moss',ref:m});}
 else o.push({x:BOLLARD.x,y:BOLLARD.y,r:16,kind:'post',ref:BOLLARD});return o.filter(t=>Math.hypot(t.x-P.x,t.y-P.y)<reach()*axeReach()*1.25+t.r);}
function scarfAt(wx,wy){let best=null,bd=1e9;for(const t of scarfTargets()){if(t.kind==='moss'&&S.inv.some(i=>i.id==='cook'))continue;const d=Math.hypot(t.x-wx,t.y-(wy+10));if(d<t.r+16&&d<bd){bd=d;best=t;}}return best;}
function segDist(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy||1;const u=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/l2));return Math.hypot(px-(ax+u*dx),py-(ay+u*dy));}
/* a slide near a thing in reach: away from you trips it, toward you wraps it (and binds it if it is already wrapped) */
function scarfSlide(a,b){if(C||SW.on||ccOn||dlgOn)return false;let best=null,bd=1e9;for(const t of scarfTargets()){const d=segDist(t.x,t.y-10,a[0],a[1],b[0],b[1]);if(d<t.r+24&&d<bd){bd=d;best=t;}}
 if(!best)return false;/* straight at it: prod with the haft; across it (or back toward you): knock it with the haft */const sx=b[0]-a[0],sy=b[1]-a[1],tx=best.x-P.x,ty=best.y-P.y,cs=(sx*tx+sy*ty)/((Math.hypot(sx,sy)*Math.hypot(tx,ty))||1);
 scarfMove(cs>.8?'prod':'blunt',best);return true;}
function axeIn(){return S.eq.weapon==='hatchet';}
/* the longaxe (26b): tap slices with the blade; slide across knocks with the haft (three in rhythm spin into a swirl);
   slide straight at a thing prods it with the haft at the longest reach, the gentle way for now. Bare hands do nothing. */
function axeIn(){return S.eq.weapon==='hatchet';}
function scarfMove(kind,tg){if(C||SW.on||ccOn||dlgOn)return;const k=kind==='slap'?'slice':kind==='trip'?'blunt':kind==='wrap'||kind==='bind'?'prod':kind;
 if(tg.kind==='dead'){pop('Thunk.',tg.x,tg.y-50,'#fff',17);think(pick(['Just a tree.','Dead. Definitely dead.','Nothing. Good. Probably good.']));return;}
 if(!axeWhole()){think(axeHave()?'My axe needs mending first.':'Bare hands won’t do much here. I need a proper tool.');return;}
 if(!axeIn()){const i=S.inv.findIndex(x=>x.id==='hatchet');if(i>=0){S.inv.splice(i,1);S.eq.weapon='hatchet';}}
 axeMove(k,tg);}
function axeMove(kind,tg){P.path=[];P.then=null;P.task=null;P.face=tg.x>P.x?1:-1;const now_=now;let swirl=false;
 if(kind==='blunt'){SC.sweeps=(SC.sweeps||[]).filter(t=>now_-t<1.9);SC.sweeps.push(now_);if(SC.sweeps.length>=3){SC.sweeps=[];swirl=true;}}
 const ux=tg.x-P.x,uy=tg.y-P.y,un=Math.hypot(ux,uy)||1,R=reach()*axeReach()*(swirl?1.3:kind==='prod'?1.25:1);
 if(Math.hypot(ux,uy)>R+tg.r){think('Out of reach.');return;}
 const hits=kind==='prod'?[tg]:scarfTargets().filter(t=>t.kind!=='dead'&&(swirl||((t.x-P.x)*ux+(t.y-P.y)*uy)/(un*(Math.hypot(t.x-P.x,t.y-P.y)||1))>.35)&&Math.hypot(t.x-P.x,t.y-P.y)<R+t.r);
 SC.fx=[{kind:swirl?'swirl':kind==='slice'?'hew':kind==='blunt'?'sweep':'prod',tx:tg.x,ty:tg.y,t:0,r:tg.r}];
 {const mk2=swirl?'swirls':kind==='slice'?'hews':kind==='blunt'?'sweeps':'prods';S.st[mk2]=(S.st[mk2]||0)+1;}sfx(swirl?'swirl':kind==='slice'?'hew':kind==='blunt'?'sweep':'wrap');
 if(kind==='prod'){if(!hasSkill('accord')){unlockSkill('accord');discover('accord');toast('New skill: Dominion, Accord');}}
 else if(!hasSkill('strife')){unlockSkill('strife');discover('strife');toast('New skill: Dominion, Strife');}
 const mk=kind==='slice'?'slap':'trip';if(kind!=='prod')S.st[mk+'s']=(S.st[mk+'s']||0)+1;
 hits.forEach(t=>{let k2=mk;if(kind==='prod'){const r=t.ref;k2=t.kind==='maw'?(r.st==='calm'?'bind':'wrap'):t.kind==='moss'?(r.follow&&!r.bound?'bind':'wrap'):(r.st==='held'?'bind':'wrap');}({maw:mawHit,moss:mossHit,post:postHit})[t.kind](t.ref,k2,t);});
 if(swirl)burst('strife','Swirl',12+5*hits.length,[P.x,P.y-70]);else if(kind!=='prod'&&hits.length>=2)burst('strife','Cleave',5*hits.length,[P.x,P.y-70]);
 axeWear(kind==='slice'?'cut':kind);save();}
/* Hollowmaw: slap or trip it and it creaks, then lunges. Trip it on the creak and it goes down and a limb comes off. Wrap it on the creak and it holds still; bind it then, with an ember pearl in your pack, and it plants. */
function mawHit(m,kind,tg){const tell=m.st==='creak',pos=[m.x,m.y-96];
 if(m.st==='down'){addXP(kind==='slap'||kind==='trip'?'strife':'accord',1,'normal',pos);think(pick(['It is down. Leave it.','It is not getting up yet.']));return;}
 if(m.st==='planted')return;
 if(kind==='slap'){if(tell){m.st='still';m.t=0;m.dazed=3;S.st.countered=1;burst('strife','Countered',12,pos);think('The creak stopped. It is thinking about it.');}
  else if(m.st==='calm'){m.st='creak';m.t=0;addXP('strife',2,'normal',pos);think('That undid the calm. It is creaking again.');}
  else{m.st='creak';m.t=0;addXP('strife',2,'normal',pos);discover('hollowmaw');think(pick(['The bark creaked. That is no tree.','It felt that. Its chest is opening.']));}return;}
 if(kind==='trip'){if(tell){m.st='down';m.t=0;S.st.countered=1;burst('strife','Driven off',20,pos);
   if(addItem('deadwood',1)){flies.push({id:'misc',img:itemIcon({id:'deadwood'}),x0:m.x,y0:m.y-20,t:0});S.st.found=S.st.found||{};S.st.found.deadwood=(S.st.found.deadwood||0)+1;discover('deadwood');think('Down it went. A limb came off in the fall. Dead wood.');}
   else think('Down it went. A limb came off, but my pack is full.');}
  else if(m.st==='lunge'){addXP('strife',1,'normal',pos);}
  else{m.st='creak';m.t=0;addXP('strife',3,'normal',pos);discover('hollowmaw');think(pick(['Too soon. The trunk only swayed, and now it is creaking.','I tripped a tree. It did not like it.']));}return;}
 if(kind==='wrap'){if(tell){m.st='calm';m.t=0;S.st.mirrored=1;burst('accord','Mirrored',15,pos);think('I touched the haft to its chest on the creak. It stopped. It is holding still, waiting.');}
  else if(m.st==='calm'){m.t=0;addXP('accord',2,'normal',pos);}
  else{m.st='creak';m.t=0;addXP('accord',2,'normal',pos);discover('hollowmaw');think('It leaned into the prod. Now it wants more. The chest is creaking.');}return;}
 if(kind==='bind'){if(m.st!=='calm'){addXP('accord',1,'normal',pos);think('Nothing to hold onto. Calm it first.');return;}
  if(cnt('pearl')>0){takeItem('pearl');mawPlant(m);sfx('planted');burst('accord','Planted',40,pos);discover('planted');think('I pressed the pearl into the hollow. The roots went down. The bark went still, and warm.');}
  else{m.t=0;addXP('accord',4,'normal',pos);think('It is calm and still under the haft. The hollow wants something warm to hold. An ember pearl, maybe.');}}}
const PLANTED=[];
function mawPlant(m){const i=MAWS.indexOf(m);if(i>=0)MAWS.splice(i,1);S.shPlanted=S.shPlanted||{};S.shPlanted[m.seed]=1;PLANTED.push({x:m.x,y:m.y,seed:m.seed,t:0});}
{const pl=S.shPlanted||{};for(let i=MAWS.length-1;i>=0;i--){const m=MAWS[i];if(pl[m.seed]){MAWS.splice(i,1);PLANTED.push({x:m.x,y:m.y,seed:m.seed,t:9});}}}
/* Mossback: it shivers now and then; that is its tell. Wrap it on the shiver and it warms and follows for a while. Bind it while wrapped and it is yours. Slap or trip it and it runs; it is not a fighter. */
function mossHit(m,kind,tg){const pos=[m.x,m.y-40];
 if(kind==='slap'||kind==='trip'){if(!m.fed&&!m.bound)m.follow=false;m.flee=kind==='trip'?2.6:1.8;if(kind==='trip')m.tumble=.8;sfx('squeak');addXP('strife',kind==='trip'?2:1,'normal',pos);pop(kind==='trip'?'*flump*':'*squeak*',m.x,m.y-30,'#fff',17);think(pick(['That was not kind.','It ran. Of course it ran.','It looked at me the way Gubbins looks at an empty net.']));return;}
 if(kind==='wrap'){if(m.sh>0){m.sh=0;m.shT=30;m.warm=Date.now()+150000;m.follow=true;S.st.mirrored=1;S.st.mosswarm=1;burst('accord','Mirrored',15,pos);discover('mossback');think('I nudged it along with the haft. It stopped shaking and fell in behind me, for a while.');}
  else{addXP('accord',2,'normal',pos);think(pick(['It blinks at me. Not cold, just now.','Warm enough. Hungry, though.']));}return;}
 if(kind==='bind'){if(m.bound){addXP('accord',1,'normal',pos);think('It is already mine. It knows it.');return;}
  m.bound=1;m.follow=true;m.warm=0;burst('accord','Kept',25,pos);discover('mossback');think('One more nudge and it settles in at my heels. It is coming with me, and seems glad about it.');}}
/* Old Bollard: slaps and trips he enjoys, trips on the lean ring him, wraps on the lean make his day. His XP fades: he is practice. */
function postHit(b,kind,tg){const pos=[b.x,b.y-40],tell=b.st==='lean',n=S.st.postHits=(S.st.postHits||0)+1,fade=k=>Math.max(1,Math.round(k*Math.max(.15,1-n/40)));
 discover('bollard');b.said=1.6;b.t=0;b.wait=4+Math.random()*4;if(!S.st.scarfHint&&S.hint>=3){S.st.scarfHint=1;hint('Tap to slice. Slide across him to knock him. Slide straight at him to prod him. Watch for the lean.',8000);}
 if(kind==='slap'){if(tell){b.st='rung';sfx('ring');S.st.countered=1;S.st.rings=(S.st.rings||0)+1;burst('strife','Rung',fade(10),pos);b.line='Ha! Right on the lean.';}
  else{b.st='thud';sfx('thud');addXP('strife',fade(2),'normal',pos);b.line=pick(['Ooh.','Again.','Firmer.','That is a slap, is it.','The Gull tied to me once. Gentler than you.']);}return;}
 if(kind==='trip'){if(tell){b.st='rung';sfx('ring');S.st.countered=1;S.st.rings=(S.st.rings||0)+1;burst('strife','Rung',fade(12),pos);b.line=pick(['Rung like a bell!','Oh, that is the stuff.']);}
  else{b.st='thud';sfx('thud');addXP('strife',fade(3),'normal',pos);b.line=pick(['Trip me? I am bolted down.','Wait for the lean, friend.','Nearly.']);}return;}
 if(kind==='wrap'){if(tell){b.st='held';S.st.mirrored=1;burst('accord','Mirrored',fade(10),pos);b.line=pick(['Ha! A poke on the lean. You have a feel for it.','Gently does it. Happiest I have been since the Gull.']);}
  else{b.st='held';addXP('accord',fade(2),'normal',pos);b.line=pick(['Was that a poke?','Prod me when I lean and I will sing.','Mm. Gentle.']);}return;}
 if(kind==='bind'){b.st='held';addXP('accord',fade(4),'normal',pos);b.line=pick(['Steady now. Good lad.','Now that is a mooring.','She would have held in a gale, that gentle.']);}}
function bollardUpdate(dt){const b=BOLLARD,d=Math.hypot(P.x-b.x,P.y-b.y);b.t+=dt;if(b.said>0)b.said-=dt;
 if(b.st==='still'){if(d<110){b.wait-=dt;if(b.wait<=0){b.st='lean';b.t=0;}}}
 else if(b.st==='lean'){if(b.t>.9){b.st='still';b.t=0;b.wait=5+Math.random()*4;}}
 else if(b.t>(b.st==='held'?2.2:.6)){b.st='still';b.t=0;}
 const want=b.st==='lean'?(P.x>b.x?1:-1)*.22*Math.min(1,b.t/.25):b.st==='rung'?Math.sin(b.t*40)*.05:b.st==='thud'?Math.sin(b.t*25)*.03*(1-b.t/.6):0;b.lean+=(want-b.lean)*Math.min(1,dt*14);}
function drawBollard(){const b=BOLLARD,x=b.x,y=b.y;shadow(x,y+3,13,4);ctx.save();ctx.translate(x,y);ctx.rotate(b.lean);
 sketch([[-11,0],[-9,-30],[-12,-38],[12,-38],[9,-30],[11,0]],true,860,.8,'#4a4458',INK,2.6);blob(0,-39,13,6,861,'#5a5266',2.4,.5);
 ln([[-9,-12],[9,-12]],862,2,'rgba(255,255,255,.18)',.3);ln([[-12,-5],[12,-5]],863,4,'#9a6236',.5);ln([[-12,-9],[12,-9]],865,2.5,'#7a4f2c',.4);
 const held=b.st==='held';
 const ey=-28,sl=b.st==='lean'||held;if(sl){ln([[-6,ey],[-2,ey+1]],867,1.6,'#e9dfc8',.2);ln([[2,ey+1],[6,ey]],868,1.6,'#e9dfc8',.2);}else{dot(-4,ey,1.4,'#e9dfc8');dot(4,ey,1.4,'#e9dfc8');}
 if(b.st==='rung')ln([[-4,ey+7],[0,ey+10],[4,ey+7]],869,1.6,'#e9dfc8',.2);else ln([[-3,ey+8],[3,ey+8]],869,1.6,'#e9dfc8',.2);ctx.restore();
 if(b.st==='rung'){const k=b.t/.6;ctx.globalAlpha=1-k;sketch(ell(x,y-20,16+k*26,(16+k*26)*.6,12),false,870,1,null,'#fff',2);ctx.globalAlpha=1;}
 if(b.said>0&&b.line){ctx.globalAlpha=Math.min(1,b.said*2);otext(b.line,x,y+16,14,'#e9dfc8');ctx.globalAlpha=1;}}
/* the scarf's own tail is the weapon: it reaches for the target, snaps back, or stays looped around what it holds. Nothing else shoots out of the character. */
/* the tail drifts from one side of the player to the other, hanging down the chest as it passes, and streams behind while walking */
const SCD={d:-1};
function scarfTail(kx,ky,f,w,w2,acc,mv){const [st,tw]=scarfIdle();const fx=ccOn?null:SC.fx.find(x=>x.kind==='slap'||x.kind==='trip'||x.kind==='wrap'||x.kind==='bind');
 if(!fx){const wind=Math.sin(now*(ccOn?1.1:.6))*1.1+Math.sin(now*(ccOn?2.7:1.3)+1)*.25+(ccOn?0:Math.cos(WX.wa)*WX.ws*.9),want=mv?-f:Math.max(-1,Math.min(1,wind));SCD.d+=(want-SCD.d)*Math.min(1,fdt*(mv?6:1.6));const d=SCD.d,ad=Math.abs(d),sag=(1-ad)*12,th=(1-ad)*3.2;
  const P2=[[0,-2,0,1],[9,w+tw*.3,.3,1],[17,-2+w2+tw*.7,.6,1],[13,3+w+tw*.5,.75,1],[19,8+w2+tw,1,0],[8,7+w+tw*.3,.6,-1],[0,4,0,-1]];
  sketch(P2.map(([ox,oy,u,sd])=>[kx-ox*d*st+sd*th*(1-u*.6),ky+oy+sag*u*st]),true,113,.4,acc,INK,2.2);return;}
 const k=fx.t,isW=fx.kind==='wrap'||fx.kind==='bind',e=isW?Math.min(1,k/.3):Math.sin(Math.min(1,k/.42)*Math.PI);
 const tx=fx.tx,ty=fx.ty-(fx.kind==='trip'?-2:isW?24+fx.r*.4:16);let dx=tx-kx,dy=ty-ky;const L=Math.hypot(dx,dy)||1;dx/=L;dy/=L;const px=-dy,py=dx,len=Math.max(14,L*e-(isW?fx.r+6:0));
 const top=[],bot=[];for(let i=0;i<=8;i++){const u=i/8,x=kx+dx*len*u,y=ky+dy*len*u,wv=Math.sin(u*9-k*30)*5*(1-u*.4)*(isW?.35:e),h=4.5-u*2.2;top.push([x+px*(wv+h),y+py*(wv+h)]);bot.push([x+px*(wv-h),y+py*(wv-h)]);}
 sketch(top.concat(bot.reverse()),true,113,.4,acc,INK,2.2);}
function drawScarfFX(){SC.fx=SC.fx.filter(f=>(f.t+=fdt)<(f.kind==='wrap'?2.6:f.kind==='bind'?2.4:f.kind==='swirl'?.6:f.kind==='prod'?.36:.42)&&!(P.moving&&(f.kind==='wrap'||f.kind==='bind')));const col=scarfCol();
 for(const f of SC.fx){const k=f.t;if(f.ref&&f.kind!=='slap'&&f.kind!=='trip'&&f.kind!=='hew'){f.tx=f.ref.x;f.ty=f.ref.y;}
  if(f.kind==='slap'||f.kind==='trip'){const e=Math.sin(Math.min(1,k/.42)*Math.PI);if(e>.92)star(f.tx+(f.kind==='trip'?0:P.face*6),f.kind==='trip'?f.ty+2:f.ty-16,7,'#fff');}
  else if(f.kind==='wrap'||f.kind==='bind'){const n=f.kind==='bind'?2:1,a=Math.min(1,k/.3),fade=f.t>(f.kind==='bind'?1.8:2.1)?1-(f.t-(f.kind==='bind'?1.8:2.1))/.5:1;ctx.globalAlpha=Math.max(0,fade);
   const cy=f.ty-(f.kind==='bind'?30:24)-f.r*.4;for(let j=0;j<n;j++){const ry=f.r*.45,pts=ell(f.tx,cy+j*9,(f.r+8)*a,ry*a,14);sketch(pts,true,882+j,.8,null,INK,5.5);sketch(pts,true,882+j,.8,null,col,3.2);}
   blob(f.tx+(f.r+6)*a,cy-4,3.5,3.5,884,col,2,.3);ctx.globalAlpha=1;}
  else if(f.kind==='prod'){/* the haft thrust straight out and back */const u=Math.sin(Math.min(1,k/.36)*Math.PI),hx=P.x+P.face*6,hy=P.y-20,dx=f.tx-hx,dy=f.ty-14-hy,L=Math.hypot(dx,dy)||1,ex=hx+dx/L*L*.9*u,ey=hy+dy/L*L*.9*u;
   ln([[hx,hy],[ex,ey]],956,5,INK,.3);ln([[hx,hy],[ex,ey]],956,2.8,'#d9cdb5',.3);if(u>.9)star(ex,ey,6,'#fff');}
  else{/* axe: the hatchet swings round the hand, a trail behind it */
   const f0=P.face,hx=P.x+f0*6,hy=P.y-20,sw=f.kind==='swirl',dur=sw?.6:.36,u=Math.min(1,k/dur),ang=sw?u*12.6:f.kind==='hew'?-1.6+u*2.6:-.3+u*1.9,R=sw?reach()*.85:reach()*.7;
   ctx.save();ctx.globalAlpha=.5*(1-u);ctx.strokeStyle=col;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();if(sw)ctx.ellipse(P.x,P.y-6,R,R*.45,0,0,6.3);else{const a0=f0>0?-.9+(f.kind==='hew'?-.6:0):Math.PI-1.1-(f.kind==='hew'?-.6:0),a1=a0+f0*(u*2.4);ctx.ellipse(P.x,P.y-10,R,R*.5,0,Math.min(a0,a1),Math.max(a0,a1));}ctx.stroke();ctx.restore();
   ctx.save();ctx.translate(hx,hy);ctx.scale(f0,1);ctx.rotate(ang);drawAxeIn(24);ctx.restore();
   if(k<.1&&!f.hit){f.hit=1;}}}}
function drawPlanted(p){{const g=Math.min(1,p.t/8),x=p.x,y=p.y;shadow(x,y+2,16,5);ln([[x,y],[x+2,y-26-14*g]],900+p.seed,8,INK,.6);ln([[x,y],[x+2,y-26-14*g]],900+p.seed,5,'#5a4a3a',.6);
 for(const [sd,i] of [[-1,0],[1,1]])ln([[x+1,y-14-8*i*g],[x+sd*(10+8*g),y-24-10*i*g]],902+p.seed+i,3,'#5a4a3a',.5);
 blob(x-8*g,y-30-10*g,9*g,7*g,905+p.seed,'#6fbf4a',2.2,.6);blob(x+9*g,y-32-12*g,9*g,7*g,906+p.seed,'#5fb35a',2.2,.6);blob(x+1,y-40-14*g,11*g,8*g,907+p.seed,'#7bc96f',2.2,.6);
 const fl=.5+.5*Math.sin(now*1.3+p.seed);ctx.globalAlpha=.4+fl*.5;dot(x+1,y-14,2.5,'#ff8a3d');ctx.globalAlpha=1;}}
