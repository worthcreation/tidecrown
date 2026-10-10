/* swimming: the first way off the Key. Tap the water to wade in, then tap in rhythm to stroke toward where you tapped. Breath runs down; strokes on the beat cost less. Lantern jellies drift and sting; floating things are yours if you swim through them. Swim far enough east and the dark islands take you in. */
const SW={on:false,vx:0,vy:0,tx:0,ty:0,breath:1,beat:0,stun:0,streak:0,t:0,dist:0,idle:0,sink:0};
const SEA_R=()=>iR(0)+2300,WADE=34,FAR_X=()=>iR(0)+1500;
/* depth past the shore: 0 on land or dock, growing offshore. Wading is allowed down to WADE. */
function seaDepth(x,y){if(SH.on)return shDepth(x,y);if(onDock(x,y)||onIsland(x,y))return 0;const a=Math.atan2(y,x);return Math.max(0,Math.hypot(x,y)-wetR(a)+10);}
function inSea(x,y){if(SH.on)return !shIsle(x,y)&&Math.abs(x)<2200&&Math.abs(y)<2100;return !walkable(x,y)&&!onDock(x,y)&&Math.hypot(x,y)<SEA_R();}
function canStep(x,y){if(walkable(x,y))return true;const d=seaDepth(x,y);return d>0&&d<=WADE&&inSea(x,y);}
function swimBeat(){return .85-Math.min(.2,lv('swimming')*.01);}
function breathSec(){return 28+lv('swimming')*2.2;}
function swimStart(tx,ty){SW.on=true;SW.vx=0;SW.vy=0;SW.tx=tx;SW.ty=ty;SW.beat=0;SW.stun=0;SW.t=0;SW.idle=0;SW.sink=0;P.path=[];P.task=null;P.then=null;
 const first=!hasSkill('swimming');if(first){unlockSkill('swimming');discover('swimming');toast('New skill: Swimming');hint('Tap in rhythm with the ring to stroke. Tap where you want to go.',7000);}
 splashAt(P.x,P.y,8);}
function swimTo(wx,wy){if(SW.on){SW.tx=wx;SW.ty=wy;swimStroke();return;}
 /* walk in: the shallows are walkable, and the walk turns into a swim where it gets deep */
 P.swimTo=[wx,wy];routeTo(wx,wy,()=>{P.swimTo=null;});}
function swimStroke(sc){sc=sc||1;if(SW.stun>0)return;const ph=SW.beat/swimBeat(),e=Math.min(ph,1-ph)*swimBeat(),win=.13+Math.min(.07,lv('swimming')*.004),good=e<win;
 SW.idle=0;SW.sink=Math.max(0,SW.sink-.45);const dx=SW.tx-P.x,dy=SW.ty-P.y,d=Math.hypot(dx,dy)||1,pw=(good?210:110)*sc;SW.vx+=dx/d*pw;SW.vy+=dy/d*pw;if(dx)P.face=dx>0?1:-1;
 splashAt(P.x,P.y+6,good?6:3);SW.beat=0;
 if(good){SW.breath=Math.min(1,SW.breath+.012);streak('swim',true,'swimming','In the groove',2,[P.x,P.y-40]);addXP('swimming',1,'normal',[P.x,P.y-20]);}
 else{SW.breath-=.02;streak('swim',false);}}
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
 splashes2=splashes2.filter(p=>(p.t+=dt)<.6);
 if(!SW.on)return;
 SW.t+=dt;SW.beat+=dt;if(SW.beat>=swimBeat())SW.beat-=swimBeat();
 /* stop stroking and you sink: the water climbs you, and breath goes faster */
 SW.idle+=dt;if(SW.idle>1.1)SW.sink=Math.min(1,SW.sink+dt*.28);
 if(SW.stun>0)SW.stun-=dt;
 const drag=Math.exp(-dt*1.6);SW.vx*=drag;SW.vy*=drag;SW.vx+=Math.sin(now*.55)*14*dt;SW.vy+=Math.cos(now*.4)*10*dt;
 const dx=SW.tx-P.x,dy=SW.ty-P.y,d=Math.hypot(dx,dy);if(d>6&&SW.stun<=0){SW.vx+=dx/d*22*dt;SW.vy+=dy/d*22*dt;}
 const nx=P.x+SW.vx*dt,ny=P.y+SW.vy*dt;const moved=Math.hypot(nx-P.x,ny-P.y);
 if(seaDepth(nx,ny)<=WADE*.55&&canStep(nx,ny)){P.x=nx;P.y=ny;const tx=SW.tx,ty=SW.ty;swimEnd(false);addXP('swimming',Math.max(1,Math.round(SW.dist/40)),'normal',[P.x,P.y-20]);SW.dist=0;if(canStep(tx,ty)||walkable(tx,ty))routeTo(tx,ty);return;}
 if(inSea(nx,ny)){P.x=nx;P.y=ny;SW.dist+=moved;}
 P.moving=moved>4;
 SW.breath-=dt/breathSec()*(1+2.2*SW.sink);
 for(let i=floaters.length-1;i>=0;i--){const f=floaters[i];if(Math.hypot(f.x-P.x,f.y-P.y)<22){floaters.splice(i,1);
  if(f.id==='bottle'){S.inv.push({id:'bottle',msg:S.bottles});S.bottles++;}else if(!addItem(f.id,f.id==='shells'?2:1)){think('No room in my pack.');continue;}
  flies.push({id:'misc',img:itemIcon({id:f.id}),x0:f.x,y0:f.y,t:0});addXP('swimming',4,'normal',[f.x,f.y-20]);S.st.swum=(S.st.swum||0)+1;}}
 for(const j of jellies){if(SW.stun<=0&&Math.hypot(j.x-P.x,j.y-P.y)<24){SW.stun=1.4;SW.breath-=.18;const ax=P.x-j.x,ay=P.y-j.y,n=Math.hypot(ax,ay)||1;SW.vx=ax/n*160;SW.vy=ay/n*160;streak('swim',false);pop('*zap*',P.x,P.y-50,'#fff',19);discover('jelly');think(pick(['Stung. Everything tingles.','A lantern jelly. It did not like me.']));}}
 if(SW.breath<=0){SW.breath=.35;if(SH.on){const c=shClamp(P.x,P.y);P.x=c[0];P.y=c[1];}else{const a=Math.atan2(P.y,P.x),e=polar(a,wetR(a)-14);P.x=e[0];P.y=e[1];}swimEnd(false);think(pick(['The sea spat me out. Breathe.','Out of breath. The shore found me.']));return;}
 if(!SH.on&&P.x>FAR_X()){swimEnd(false);SW.breath=1;discover('swamfar');shEnter();think('Something dark on the horizon. I swam right into it.');}}
function drawSwimWorld(){const vw=W/Z/2+80,vh=H/Z/2+80;
 for(const f of floaters){if(Math.abs(f.x-cam.x)>vw||Math.abs(f.y-cam.y)>vh)continue;const b=Math.sin(now*1.8+f.seed)*2;ctx.globalAlpha=.4;sketch(ell(f.x,f.y+6,14,5,10),true,900+(f.seed*7|0),1,null,'#fff',1.5);ctx.globalAlpha=1;ctx.drawImage(iconImg(itemIcon({id:f.id})),f.x-11,f.y-14+b,22,22);}
 for(const j of jellies){if(Math.abs(j.x-cam.x)>vw||Math.abs(j.y-cam.y)>vh)continue;const b=Math.sin(now*2.2+j.seed)*2,gl=.5+.5*Math.sin(now*3+j.seed);
  ctx.globalAlpha=.25+dark*.4;dot(j.x,j.y-6+b,22,'#ffd9a8');ctx.globalAlpha=.85;blob(j.x,j.y-6+b,13,10,920+(j.seed*5|0),'#ffe7c2',2,.5);for(let k=0;k<4;k++)ln([[j.x-8+k*5,j.y+2+b],[j.x-9+k*5+Math.sin(now*4+k+j.seed)*3,j.y+16+b]],930+k,1.8,'#ffc98a',.8);
  ctx.globalAlpha=gl*.9;dot(j.x-3,j.y-8+b,2,'#ff8a3d');dot(j.x+4,j.y-7+b,2,'#ff8a3d');ctx.globalAlpha=1;}
 for(const p of splashes2){const k=p.t/.6;ctx.globalAlpha=1-k;dot(p.x+p.vx*p.t,p.y+p.vy*p.t+140*p.t*p.t,3-k*2,'#fff');}ctx.globalAlpha=1;}
/* the player in water: only the submerged part of the body changes colour (drawn through an offscreen canvas so the tint lands on the player alone), a transparent layer flows over it, and the waves move you. */
const pcv=document.createElement('canvas'),pctx=pcv.getContext('2d');
function drawTinted(x,y,dy,rot,wl){const sc=Z*DPR*1.2,w=200,h=240;pcv.width=w*sc;pcv.height=h*sc;const k=ctx;ctx=pctx;ctx.setTransform(sc,0,0,sc,w/2*sc,(h-40)*sc);ctx.clearRect(-w/2,-(h-40),w,h);
 if(rot){ctx.translate(0,-4);ctx.rotate(rot);ctx.translate(0,4);}drawChar(S.char||DEFAULT_LOOK,S.eq,0,dy,P.face,true,false);
 if(rot){ctx.setTransform(sc,0,0,sc,w/2*sc,(h-40)*sc);}
 ctx.globalCompositeOperation='source-atop';ctx.beginPath();const rel=wl-y;ctx.moveTo(-w/2,rel+Math.sin(now*5)*1.6);for(let i=1;i<=20;i++)ctx.lineTo(-w/2+i*(w/20),rel+Math.sin(now*5+i*.9)*1.6);ctx.lineTo(w/2,h);ctx.lineTo(-w/2,h);ctx.closePath();ctx.fillStyle='rgba(20,60,110,.62)';ctx.fill();ctx.globalCompositeOperation='source-over';
 ctx=k;ctx.drawImage(pcv,x-w/2,y-(h-40),w,h);}
function drawSwimmer(){const depth=SW.on?0:seaDepth(P.x,P.y);if(!SW.on&&depth<=0){drawPlayer();return;}
 const x=P.x,y=P.y,bob=Math.sin(now*1.7)*2,wl=y+2+bob*.5;
 if(!SW.on){const k=Math.min(1,depth/WADE);drawTinted(x,y,k*26+bob*.4,0,wl);waterFlow(x,wl,24);return;}
 ctx.globalAlpha=.4;sketch(ell(x,y+4,26+Math.hypot(SW.vx,SW.vy)*.05,8,12),true,940,1,null,'#fff',2);ctx.globalAlpha=1;
 drawTinted(x,y,16+SW.sink*22+bob*.6,P.face*1.25,wl);waterFlow(x,wl,32);
 const ph=SW.beat/swimBeat(),r=10+(1-ph)*22;ctx.globalAlpha=.2+ph*.55;sketch(ell(x,y+6,r,r*.5,14),true,941,1,null,'#fffaf0',2.4);
 const e=Math.min(ph,1-ph)*swimBeat(),win=.13+Math.min(.07,lv('swimming')*.004);if(e<win){const q=1-e/win;ctx.globalAlpha=.5*q;sketch(ell(x,y+6,6+q*4,(6+q*4)*.5,10),true,942,.6,null,'#fffaf0',2);}ctx.globalAlpha=1;
 if(SW.stun>0){ctx.globalAlpha=.8;for(let i=0;i<3;i++)star(x-12+i*12+Math.sin(now*9+i)*3,y-44-i%2*6,4,'#ffd23f');ctx.globalAlpha=1;}
 const bw=44,bx=x-bw/2,by=y-54;sketch(rrPts(bx-2,by-2,bw+4,9,4),true,943,1,'#fffaf0',INK,2);ctx.fillStyle=SW.breath<.25?'#ff6b6b':'#6fd6ff';ctx.fillRect(bx,by,bw*Math.max(0,SW.breath),5);}
/* a transparent sheet of water flowing over the body at the waterline */
function waterFlow(x,wl,hw){const wave=i=>wl+Math.sin(now*5+i*.9+x*.01)*1.6,N=10;ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#cdeaf4';ctx.beginPath();ctx.moveTo(x-hw,wave(0));for(let i=1;i<=N;i++)ctx.lineTo(x-hw+i*(2*hw/N),wave(i));
 for(let i=N;i>=0;i--)ctx.lineTo(x-hw+i*(2*hw/N),wave(i)+6+Math.sin(now*3.2+i*1.1)*2.5);ctx.closePath();ctx.fill();ctx.restore();
 ctx.strokeStyle='rgba(215,245,255,.9)';ctx.lineWidth=1.8;ctx.beginPath();for(let i=0;i<=N;i++){const px=x-hw+i*(2*hw/N),py=wave(i);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
