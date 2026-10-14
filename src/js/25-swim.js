/* swimming: the first way off the Key. Tap the water to wade in, then tap in rhythm or slide to stroke toward where you tapped. There is no clock on a swim: as long as you keep stroking you keep going. Stop attending and you sink, the breath bar drains, and the sea carries you back to the last shore you left or passed. Lantern jellies drift and sting; floating things are yours if you swim through them. Swim far enough east and the dark islands take you in. */
const SW={on:false,vx:0,vy:0,tx:0,ty:0,breath:1,beat:0,stun:0,streak:0,t:0,dist:0,idle:0,sink:0,shore:null,blk:0,fade:0};let bubbles=[];
const WADE=1;
/* how far into the dark water you are, 0 at the Key's shore to 1 at the Shadow cluster. The sea, the sky and the sound all follow it. */
function farness(){if(SH.on)return .6+.4*Math.max(0,Math.min(1,(P.x-SH_WEST)/1700));return .6*Math.max(0,Math.min(1,(P.x-(iR(0)+700))/(FAR_X()-iR(0)-700)));}
function mixCol(a,b,t){const h=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));const A=h(a),B=h(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')';}
/* depth in body units (see 24b): wade below 1, swim from .55, sink past 1 if you stop */
function seaDepth(x,y){return depthAt(x,y);}
function inSea(x,y){if(SH.on)return !shIsle(x,y)&&x>SH_WEST-300&&x<2200&&Math.abs(y)<2100;return !walkable(x,y)&&!onDock(x,y)&&Math.hypot(x,y)<SEA_R();}
function canStep(x,y){return walkable(x,y)||inSea(x,y);}
function swimBeat(){return .85-Math.min(.2,lv('swimming')*.01);}
function sinkRate(){return .9*Math.max(.35,1-lv('swimming')*.012);}
/* the camera pulls back on open water and eases in again as a shore comes near */
function swimZoom(){const d=seaDepth(P.x,P.y),near=Math.max(0,Math.min(1,1-(d-.9)/1.3));return .6+.4*near;}
function strokeLen(){return 1+lv('swimming')*.02;}
/* the shore to wash up on: where you got in, then any shore you pass close to on the way */
function noteShore(){const it=nearestIslet(P.x,P.y,150);if(it){SW.shore={sh:SH.on?1:0,x:it.x,y:it.y,name:'the little island'};return;}if(SH.on){let best=null,bd=1e9;for(const I of ISLES){const k=isleK(I,P.x,P.y),d=(k-1)*Math.min(I.rx,I.ry);if(d<bd){bd=d;best=I;}}if(best&&bd<150){const a=Math.atan2((P.y-best.y)/best.ry,(P.x-best.x)/best.rx),R=isleR(best,a);SW.shore={sh:1,x:best.x+Math.cos(a)*best.rx*R*.88,y:best.y+Math.sin(a)*best.ry*R*.88,name:best.name};}}
 else{const a=Math.atan2(P.y,P.x);if(Math.hypot(P.x,P.y)-wetR(a)<150){const e=polar(a,wetR(a)-16);SW.shore={sh:0,x:e[0],y:e[1],name:'Driftwood Key'};}}}
function swimStart(tx,ty){SW.on=true;SW.vx=0;SW.vy=0;SW.tx=tx;SW.ty=ty;SW.beat=0;SW.stun=0;SW.t=0;SW.idle=0;SW.sink=0;SW.breath=1;P.path=[];P.task=null;P.then=null;noteShore();
 const first=!hasSkill('swimming');if(first){unlockSkill('swimming');discover('swimming');toast('New skill: Swimming');hint('Slide to stroke: direction, length and speed. Tap to tread water and catch the beat.',7000);}
 splashAt(P.x,P.y,8);sfx('splash');}
function swimTo(wx,wy){if(SW.on){tread();return;}
 /* walk in: the shallows are walkable, and the walk turns into a swim where it gets deep */
 P.swimTo=[wx,wy];walkStraight(wx,wy,()=>{P.swimTo=null;});}
/* tread water: a tap keeps you up and holds your place; on the beat it costs nothing and builds the streak */
function tread(){if(SW.stun>0)return;const ph=SW.beat/swimBeat(),e=Math.min(ph,1-ph)*swimBeat(),win=.13+Math.min(.07,lv('swimming')*.004),good=e<win;
 SW.idle=0;SW.sink=Math.max(0,SW.sink-.35);SW.vx*=.7;SW.vy*=.7;SW.tx=P.x;SW.ty=P.y;splashAt(P.x,P.y+6,good?4:2);SW.beat=0;sfx(good?'strokeGood':'stroke',.6);hap(good?8:4);
 if(good){SW.breath=Math.min(1,SW.breath+.08);streak('swim',true,'swimming','In the groove',2,[P.x,P.y-40]);}else{SW.breath=Math.min(1,SW.breath+.03);streak('swim',false);}}
/* a stroke: the slide's direction is the heading, its length and speed the push */
function swimStroke(sc){sc=sc||1;if(SW.stun>0)return;const ph=SW.beat/swimBeat(),e=Math.min(ph,1-ph)*swimBeat(),win=.13+Math.min(.07,lv('swimming')*.004),good=e<win;
 SW.idle=0;SW.sink=Math.max(0,SW.sink-.45);const dx=SW.tx-P.x,dy=SW.ty-P.y,d=Math.hypot(dx,dy)||1,pw=(good?210:110)*sc*strokeLen();SW.vx+=dx/d*pw;SW.vy+=dy/d*pw;if(dx)P.face=dx>0?1:-1;
 splashAt(P.x,P.y+6,good?6:3);SW.beat=0;sfx(good?'strokeGood':'stroke');hap(good?10:5);
 if(good){SW.breath=Math.min(1,SW.breath+.1);streak('swim',true,'swimming','In the groove',2,[P.x,P.y-40]);addXP('swimming',1,'normal',[P.x,P.y-20]);}
 else{SW.breath=Math.min(1,SW.breath+.04);streak('swim',false);}}
function swimEnd(land){SW.on=false;SW.vx=SW.vy=0;if(land){const c=clampLand(P.x,P.y);P.x=c[0];P.y=c[1];}splashAt(P.x,P.y,5);}
let floaters=[],jellies=[],splashes2=[];
function splashAt(x,y,n){for(let i=0;i<n;i++)splashes2.push({x:x+(Math.random()-.5)*16,y,vx:(Math.random()-.5)*70,vy:-40-Math.random()*60,t:0});}
function seaSpawn(){const a=Math.atan2(P.y,P.x)+(Math.random()-.5)*1.2,r=Math.hypot(P.x,P.y)+60+Math.random()*260;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(!inSea(x,y))return;
 if(Math.random()<.55){const id=pick(['shells','shells','kelp','kelp','bait','bottle']);floaters.push({x,y,id,seed:Math.random()*99,t:0});}
 else jellies.push({x,y,seed:Math.random()*99,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8,t:0});}
let seaT=1;
function swimUpdate(dt){
 seaT-=dt;if(seaT<=0&&SW.on){seaT=1.4+Math.random();if(floaters.length+jellies.length<14)seaSpawn();}
 floaters=floaters.filter(f=>(f.t+=dt)<60&&Math.hypot(f.x-P.x,f.y-P.y)<700);jellies=jellies.filter(j=>(j.t+=dt)<90&&Math.hypot(j.x-P.x,j.y-P.y)<800);
 for(const j of jellies){j.x+=j.vx*dt;j.y+=j.vy*dt;}
 splashes2=splashes2.filter(p=>(p.t+=dt)<.6);bubbles=bubbles.filter(b=>(b.t+=dt)<1.6);if(SW.fade>0)SW.fade=Math.max(0,SW.fade-dt*.9);
 if(!SW.on)return;
 SW.t+=dt;SW.beat+=dt;if(SW.beat>=swimBeat())SW.beat-=swimBeat();
 /* no clock: breath only drains while you sink, and you only sink when you stop attending */
 SW.idle+=dt;const dHere=seaDepth(P.x,P.y);if(SW.idle>.9&&dHere<.85&&SW.sink<.3){swimEnd(false);addXP('swimming',Math.max(1,Math.round(SW.dist/40)),'normal',[P.x,P.y-20]);SW.dist=0;return;}
 if(SW.idle>1.1&&dHere>=.85)SW.sink=Math.min(1,SW.sink+dt*sinkRate());if(SW.t-Math.floor(SW.t)<dt)noteShore();
 if(SW.stun>0)SW.stun-=dt;
 const drag=Math.exp(-dt*1.6);SW.vx*=drag;SW.vy*=drag;
 /* play: past the outer reefs a strong outgoing current sets west, back toward the Key, and stronger the farther you go; you cannot out-swim it, and it says so once */
 {const c=curK(P.x,P.y);if(c>0){SW.vx-=c*420*dt;if(c>=1&&SW.vx>0)SW.vx*=Math.exp(-dt*6);if(c>.25&&!S.st.curHint){S.st.curHint=1;think('The sea is pulling the wrong way out here.');}}}SW.vx+=Math.sin(now*.55)*14*dt;SW.vy+=Math.cos(now*.4)*10*dt;
 const dx=SW.tx-P.x,dy=SW.ty-P.y,d=Math.hypot(dx,dy);if(d>6&&SW.stun<=0){SW.vx+=dx/d*22*dt;SW.vy+=dy/d*22*dt;}
 const nx=P.x+SW.vx*dt,ny=P.y+SW.vy*dt;const moved=Math.hypot(nx-P.x,ny-P.y);
 if(seaDepth(nx,ny)<.42&&canStep(nx,ny)){P.x=nx;P.y=ny;const tx=SW.tx,ty=SW.ty;swimEnd(false);addXP('swimming',Math.max(1,Math.round(SW.dist/40)),'normal',[P.x,P.y-20]);SW.dist=0;if(seaDepth(tx,ty)<STAND&&canStep(tx,ty)){if(inSea(tx,ty))walkStraight(tx,ty);else routeTo(tx,ty);}return;}
 if(inSea(nx,ny)){P.x=nx;P.y=ny;SW.dist+=moved;}
 P.moving=moved>4;
 if(SW.sink>0)SW.breath-=dt*SW.sink*.96;
 /* no gauge: you can see you are under. Bubbles leave you, then you shake, then it goes black. */
 SW.blk=SW.breath<.3?Math.min(1,(1-SW.breath/.3)*1.1):0;if(SW.sink>.55&&Math.random()<dt*(4+8*(1-SW.breath)))bubbles.push({x:P.x+(Math.random()-.5)*10,y:P.y-6,vx:(Math.random()-.5)*12,r:1.5+Math.random()*2.2,t:0});
 for(let i=floaters.length-1;i>=0;i--){const f=floaters[i];if(Math.hypot(f.x-P.x,f.y-P.y)<22){floaters.splice(i,1);
  if(f.id==='bottle'){S.inv.push({id:'bottle',msg:S.bottles});S.bottles++;}else if(!addItem(f.id,f.id==='shells'?2:1)){think('No room in my pack.');continue;}
  flies.push({id:'misc',img:itemIcon({id:f.id}),x0:f.x,y0:f.y,t:0});addXP('swimming',4,'normal',[f.x,f.y-20]);S.st.swum=(S.st.swum||0)+1;}}
 for(const j of jellies){if(SW.stun<=0&&Math.hypot(j.x-P.x,j.y-P.y)<24){SW.stun=1.4;SW.breath-=.18;sfx('zap');const ax=P.x-j.x,ay=P.y-j.y,n=Math.hypot(ax,ay)||1;SW.vx=ax/n*160;SW.vy=ay/n*160;streak('swim',false);pop('*zap*',P.x,P.y-50,'#fff',19);discover('jelly');think(pick(['Stung. Everything tingles.','A lantern jelly. It did not like me.']));}}
 if(SW.breath<=0){SW.breath=1;const s=SW.shore;if(s&&s.sh!==(SH.on?1:0)){if(s.sh)shEnter();else shLeave();}
  if(s){const c=SH.on?shClamp(s.x,s.y):walkable(s.x,s.y)?[s.x,s.y]:clampLand(s.x,s.y);P.x=c[0];P.y=c[1];}else if(SH.on){const c=shClamp(P.x,P.y);P.x=c[0];P.y=c[1];}else{const a=Math.atan2(P.y,P.x),e=polar(a,wetR(a)-14);P.x=e[0];P.y=e[1];}
  cam.x=P.x;cam.y=P.y;SW.blk=0;SW.fade=1;bubbles=[];swimEnd(false);sfx('splash');think(s?'I went under. The sea carried me back to '+(s.name==='Driftwood Key'?'the Key':s.name)+'.':pick(['The sea spat me out. Breathe.','I went under. The shore found me.']));save();return;}
 if(!SH.on&&P.x>FAR_X()){if(MODE==='test')seaCross(true);else P.x=FAR_X();}else if(SH.on&&P.x<SH_WEST){seaCross(false);}}
/* crossing between the Key's water and the forest's: the scene changes under you, still swimming, far out; the islands are approached, never arrived at */
function seaCross(toShadow){const dx=SW.tx-P.x,dy=SW.ty-P.y;if(toShadow){SH.on=true;S.isle='shadow';P.x=SH_IN[0];P.y=SH_IN[1];hintEl.classList.remove('on');if(!S.journal.swamfar){discover('swamfar');think('The water has gone dark and cold. Land ahead, if I keep going.');}}
 else{SH.on=false;S.isle='key';P.x=FAR_X()-40;P.y=0;think('The water is warming. The Key is that way.');}
 SW.tx=P.x+dx;SW.ty=P.y+dy;cam.x=P.x;cam.y=P.y;floaters=[];jellies=[];save();}
/* the current: where it starts, how hard it pulls (0 to 1), and the streaks on the water that show it */
const CUR0=()=>FAR_X()-1100;
function curK(x,y){if(MODE!=='play'||SH.on)return 0;return Math.max(0,Math.min(1,(x-CUR0())/700));}
function drawCurrent(){if(MODE!=='play'||SH.on)return;const vw=W/Z/2+60,vh=H/Z/2+60;if(cam.x+vw<CUR0())return;ctx.save();ctx.lineCap='round';
 for(let i=0;i<70;i++){const sx=((i*397)%1600)/1600,sy=((i*631)%1000)/1000,len=40+(i%5)*14,sp=60+(i%7)*12;let x=CUR0()+sx*1400-((now*sp+i*90)%400),y=cam.y-vh+sy*vh*2;const k=curK(x,y);if(k<=0||Math.abs(x-cam.x)>vw)continue;
  ctx.globalAlpha=.18+.32*k;ctx.strokeStyle='#e8f6f8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-len/2,y+3*Math.sin(now+i),x-len,y);ctx.stroke();}
 ctx.restore();}
function drawSwimWorld(){const vw=W/Z/2+80,vh=H/Z/2+80;drawCurrent();
 for(const f of floaters){if(Math.abs(f.x-cam.x)>vw||Math.abs(f.y-cam.y)>vh)continue;const b=Math.sin(now*1.8+f.seed)*2;ctx.globalAlpha=.4;sketch(ell(f.x,f.y+6,14,5,10),true,900+(f.seed*7|0),1,null,'#fff',1.5);ctx.globalAlpha=1;ctx.drawImage(iconImg(itemIcon({id:f.id})),f.x-11,f.y-14+b,22,22);}
 for(const j of jellies){if(Math.abs(j.x-cam.x)>vw||Math.abs(j.y-cam.y)>vh)continue;const b=Math.sin(now*2.2+j.seed)*2,gl=.5+.5*Math.sin(now*3+j.seed);
  ctx.globalAlpha=.25+dark*.4;dot(j.x,j.y-6+b,22,'#ffd9a8');ctx.globalAlpha=.85;blob(j.x,j.y-6+b,13,10,920+(j.seed*5|0),'#ffe7c2',2,.5);for(let k=0;k<4;k++)ln([[j.x-8+k*5,j.y+2+b],[j.x-9+k*5+Math.sin(now*4+k+j.seed)*3,j.y+16+b]],930+k,1.8,'#ffc98a',.8);
  ctx.globalAlpha=gl*.9;dot(j.x-3,j.y-8+b,2,'#ff8a3d');dot(j.x+4,j.y-7+b,2,'#ff8a3d');ctx.globalAlpha=1;}
 for(const p of splashes2){const k=p.t/.6;ctx.globalAlpha=1-k;dot(p.x+p.vx*p.t,p.y+p.vy*p.t+140*p.t*p.t,3-k*2,'#fff');}
 for(const b of bubbles){const k=b.t/1.6,x=b.x+b.vx*b.t+Math.sin(b.t*9+b.r)*2,y=b.y-k*34;ctx.globalAlpha=.85*(1-k*k);sketch(ell(x,y,b.r,b.r*.9,8),true,960+(b.r*10|0),.3,'rgba(255,255,255,.35)','#fffaf0',1.2);}ctx.globalAlpha=1;}
/* the player in water: only the submerged part of the body changes colour (drawn through an offscreen canvas so the tint lands on the player alone), a transparent layer flows over it, and the waves move you. */
const pcv=document.createElement('canvas'),pctx=pcv.getContext('2d');
function drawTinted(x,y,dy,rot,wl){const sc=Math.round(Z*DPR*12)/10,w=200,h=240;/* resizing a canvas reallocates it, so only when the scale changed */if(pcv.width!==Math.round(w*sc)||pcv.height!==Math.round(h*sc)){pcv.width=Math.round(w*sc);pcv.height=Math.round(h*sc);}const k=ctx;ctx=pctx;ctx.setTransform(sc,0,0,sc,w/2*sc,(h-40)*sc);ctx.clearRect(-w/2,-(h-40),w,h);
 if(rot){ctx.translate(0,-4);ctx.rotate(rot);ctx.translate(0,4);}drawChar(S.char||DEFAULT_LOOK,S.eq,0,dy,P.face,true,false);
 if(rot){ctx.setTransform(sc,0,0,sc,w/2*sc,(h-40)*sc);}
 ctx.globalCompositeOperation='source-atop';ctx.beginPath();const rel=wl-y;ctx.moveTo(-w/2,rel+Math.sin(now*5)*1.6);for(let i=1;i<=20;i++)ctx.lineTo(-w/2+i*(w/20),rel+Math.sin(now*5+i*.9)*1.6);ctx.lineTo(w/2,h);ctx.lineTo(-w/2,h);ctx.closePath();ctx.fillStyle='rgba(20,60,110,.62)';ctx.fill();ctx.globalCompositeOperation='source-over';
 ctx=k;ctx.drawImage(pcv,x-w/2,y-(h-40),w,h);}
function drawSwimmer(){const depth=SW.on?0:seaDepth(P.x,P.y);if(!SW.on&&depth<=0){drawPlayer();return;}
 const x=P.x,y=P.y,bob=Math.sin(now*1.7)*2,wl=y+2+bob*.5;
 if(!SW.on){const k=Math.min(1,depth);drawTinted(x,y,k*30+bob*.4*k,0,wl);waterFlow(x,wl,14+k*12);return;}
 ctx.globalAlpha=.4;sketch(ell(x,y+4,26+Math.hypot(SW.vx,SW.vy)*.05,8,12),true,940,1,null,'#fff',2);ctx.globalAlpha=1;
 const shake=SW.breath<.5&&SW.sink>.5?(1-SW.breath/.5)*2.4:0,sx=shake?Math.sin(now*47)*shake:0,sy2=shake?Math.cos(now*53)*shake*.6:0;
 drawTinted(x+sx,y+sy2,16+SW.sink*34+bob*.6,P.face*1.25*(1-SW.sink),wl);waterFlow(x,wl,32);
 const ph=SW.beat/swimBeat(),r=10+(1-ph)*22;ctx.globalAlpha=.2+ph*.55;sketch(ell(x,y+6,r,r*.5,14),true,941,1,null,'#fffaf0',2.4);
 const e=Math.min(ph,1-ph)*swimBeat(),win=.13+Math.min(.07,lv('swimming')*.004);if(e<win){const q=1-e/win;ctx.globalAlpha=.5*q;sketch(ell(x,y+6,6+q*4,(6+q*4)*.5,10),true,942,.6,null,'#fffaf0',2);}ctx.globalAlpha=1;
 if(SW.stun>0){ctx.globalAlpha=.8;for(let i=0;i<3;i++)star(x-12+i*12+Math.sin(now*9+i)*3,y-44-i%2*6,4,'#ffd23f');ctx.globalAlpha=1;}
 }
/* a transparent sheet of water flowing over the body at the waterline */
function waterFlow(x,wl,hw){const wave=i=>wl+Math.sin(now*5+i*.9+x*.01)*1.6,N=10;ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#cdeaf4';ctx.beginPath();ctx.moveTo(x-hw,wave(0));for(let i=1;i<=N;i++)ctx.lineTo(x-hw+i*(2*hw/N),wave(i));
 for(let i=N;i>=0;i--)ctx.lineTo(x-hw+i*(2*hw/N),wave(i)+6+Math.sin(now*3.2+i*1.1)*2.5);ctx.closePath();ctx.fill();ctx.restore();
 ctx.strokeStyle='rgba(215,245,255,.9)';ctx.lineWidth=1.8;ctx.beginPath();for(let i=0;i<=N;i++){const px=x-hw+i*(2*hw/N),py=wave(i);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
