/* tide and foraging. The tide is a real-time cycle shared by everyone: high water brings wash-ups, low water exposes the wet band (and later the flats). */
const wetPts=[];for(let i=0;i<NP;i++)wetPts.push([0,0]);
function tideGeom(){const t=tideLevel();for(let i=0;i<NP;i++){const a=i/NP*6.2832,r=iR(a)+(1-t)*TIDE_REACH;wetPts[i][0]=Math.cos(a)*r;wetPts[i][1]=Math.sin(a)*r;}}
function drawWet(){const t=tideLevel();if(t>.985)return;sketch(wetPts,true,1,4,'#e3c27a',INK,3.5);
 ctx.globalAlpha=.35;for(let i=0;i<NP;i+=5){const a=i/NP*6.2832,r=iR(a)+(1-t)*TIDE_REACH*.5+Math.sin(a*9+i)*4;ln([[Math.cos(a)*r-5,Math.sin(a)*r],[Math.cos(a)*r+5,Math.sin(a)*r+1]],2000+i,1.5,'#fff',.4);}ctx.globalAlpha=1;}
function drawFoam(){const t=tideLevel();ctx.setLineDash([16,12]);ctx.lineDashOffset=-now*8;ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=3;ctx.beginPath();
 for(let i=0;i<NP;i++){const a=i/NP*6.2832,r=iR(a)+(1-t)*TIDE_REACH+9+Math.sin(now*1.4+a*7)*3;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();ctx.setLineDash([]);}

/* breaking waves: a swell builds offshore, foam runs up the beach, and whatever it carried is lying there when it pulls back. The next wave over an item may take it again. Everything on the sand comes from this. S.shore holds what the beach has right now. */
const BREAKS=[];let breakT=3;const SHORE_MAX=14;
const WASH=[['wood',44,10],['kelp',30,8],['shells',16,12],['bait',6,14],['wobble',4,24]];
function rollWash(){const r=Math.random()*100;let acc=0;for(const [k,wt] of WASH){acc+=wt;if(r<acc)return k;}return 'wood';}
function spawnBreak(){const pa=Math.atan2(P.y,P.x),a0=pa+(Math.random()-.5)*1.8,t=tideLevel();
 /* size: most waves are small and just break on the shore, rocks and pier. Big ones are rare, run far up the beach and can carry up to three things. */
 const r=Math.random(),size=r<.55?r*.5:r<.86?.4+(r-.55)*1.2:.8+(r-.86)*1.4;let n=0;
 if(size<.4){if(Math.random()<.22+.18*t)n=1;}
 else if(size<.8){const p=Math.random();n=p<.35+.3*t?1:0;if(p<.08+.1*t)n=2;}
 else{const p=Math.random();n=p<.9?1:0;if(p<.5)n=2;if(p<.14)n=3;}
 BREAKS.push({a0,hw:.16+size*.18+Math.random()*.05,t:-1.4,reach:10+size*52+8*t,size,n,seed:Math.floor(Math.random()*999),done:false});}
function frontR(w,a){const u=Math.abs(angDiff(a,w.a0))/w.hw;if(u>=1)return wetR(a)+70;const prof=Math.cos(u*1.5708),t=w.t;let k;
 if(t<0)k=0;else if(t<1.1){const q=t/1.1;k=1-(1-q)*(1-q);}else if(t<1.6)k=1;else{const q=Math.min(1,(t-1.6)/1.4);k=1-q*q;}
 return wetR(a)+70*(1-k)-w.reach*prof*k;}
function coverBreak(w){S.shore=S.shore||[];const inArc=it=>Math.abs(angDiff(it.a,w.a0))<w.hw*.95;
 for(let i=S.shore.length-1;i>=0;i--){const it=S.shore[i];if(!inArc(it))continue;const fr=frontR(w,it.a);if(it.r>=fr-4&&Math.random()<.5)S.shore.splice(i,1);}
 for(let i=0;i<w.n;i++){const a=w.a0+(Math.random()-.5)*w.hw*1.4,r=wetR(a)-6-Math.random()*(w.reach-10),x=Math.cos(a)*r,y=Math.sin(a)*r;
  if(!walkable(x,y)||onDock(x,y)||Math.abs(x-R0)<60&&Math.abs(y)<60)continue;if(S.shore.some(q=>Math.hypot(q.x-x,q.y-y)<22))continue;
  const id=rollWash();S.shore.push({a,r,x,y,id,n:id==='shells'?1+Math.floor(Math.random()*3):1,seed:Math.floor(Math.random()*999)});}
 while(S.shore.length>SHORE_MAX)S.shore.shift();save();}
function underFoam(it){for(const w of BREAKS)if(w.t>0&&w.t<3&&it.r>=frontR(w,it.a)-3)return true;return false;}
function tideUpdate(dt){tideGeom();if(ccOn||C)return;if(tideLevel()<.5&&!S.journal.tide&&!dlgOn)discover('tide');
 breakT-=dt;if(breakT<=0){breakT=5.5+Math.random()*3.5;if(BREAKS.length<3)spawnBreak();}
 for(const w of BREAKS){w.t+=dt;if(!w.done&&w.t>=1.6){w.done=true;coverBreak(w);if(w.n&&!S.st.sawWash){S.st.sawWash=1;think('The wave left something behind.');}}}
 for(const w of BREAKS){if(w.t<=0)continue;for(const s of SURF){const a=Math.atan2(s.y,s.x);if(Math.abs(angDiff(a,w.a0))>w.hw)continue;const r=Math.hypot(s.x,s.y),fr=frontR(w,a);
  if(s.hit!==w&&fr<=r+2){s.hit=w;s.st='wet';s.t=99;splash(s);}
  else if(s.hit===w&&w.t>1.6&&fr>r+6&&s.st==='wet'){s.st='sparkle';s.t=3.4;}}}
 for(let i=BREAKS.length-1;i>=0;i--)if(BREAKS[i].t>3)BREAKS.splice(i,1);
 for(const s of SURF){if(s.st!=='sparkle')continue;s.t-=dt;if(s.t<=0)s.st='dry';}
 splashes=splashes.filter(p=>(p.t+=dt)<.7);}
let splashes=[];function splash(s){for(let i=0;i<7;i++)splashes.push({x:s.x+(Math.random()-.5)*s.rx*1.4,y:s.y-s.ry*.5,vx:(Math.random()-.5)*60,vy:-60-Math.random()*70,t:0});}
function drawSplashes(){for(const p of splashes){const k=p.t/.7;ctx.globalAlpha=1-k;dot(p.x+p.vx*p.t,p.y+p.vy*p.t+160*p.t*p.t,3-k*2,'#fff');}ctx.globalAlpha=1;}
function drawBreaks(){for(const w of BREAKS){const t=w.t;ctx.save();
 if(t<0){const q=(t+1.4)/1.4,pts=[];for(let i=0;i<=16;i++){const a=w.a0-w.hw+2*w.hw*i/16,r=wetR(a)+96-q*24+Math.sin(a*11+now*3)*2;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
  ctx.globalAlpha=.25+.55*q;ln(pts,w.seed,2+w.size*3.5,'#fff',1.4+w.size);ctx.restore();continue;}
 const pts=[],N=26;for(let i=0;i<=N;i++){const a=w.a0-w.hw+2*w.hw*i/N,r=frontR(w,a);pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
 for(let i=N;i>=0;i--){const a=w.a0-w.hw+2*w.hw*i/N,r=Math.min(wetR(a)+100,frontR(w,a)+64);pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
 ctx.globalAlpha=t>2.3?1-(t-2.3)/.7:1;sketch(pts,true,w.seed,3,'rgba(170,225,235,.55)',null);
 const fp=pts.slice(3,N-2);ln(fp,w.seed+1,4+w.size*6,'rgba(255,255,255,.85)',2.2);ln(fp,w.seed+2,2+w.size*1.5,'#fff',3);ctx.restore();}}
function drawShore(it){if(underFoam(it))return;shadow(it.x,it.y+2,10,3.5);ctx.drawImage(iconImg(itemIcon({id:it.id})),it.x-12,it.y-20+Math.sin(now*2+it.seed)*1.2,24,24);if(it.n>1)otext(String(it.n),it.x+11,it.y-2,12,'#fff');}
function grabShore(it){const i=(S.shore||[]).indexOf(it);if(i<0||underFoam(it)){think(pick(['The sea took it back.','Too slow. Next wave.']));return;}
 const got=addItem(it.id,it.n);if(!got){think('No room in my pack.');return;}if(got<it.n)it.n-=got;else S.shore.splice(i,1);
 flies.push({id:'misc',img:itemIcon({id:it.id}),x0:it.x,y0:it.y,t:0});const xp=WASH.find(x=>x[0]===it.id)[2];
 const first=!hasSkill('foraging');if(first){unlockSkill('foraging');discover('foraging');toast('New skill: Foraging');}discover(it.id==='wood'?'driftwood':it.id==='kelp'?'kelp':'foraging');
 S.st.found=S.st.found||{};S.st.found[it.id]=(S.st.found[it.id]||0)+got;S.st.washes=(S.st.washes||0)+1;
 addXP('foraging',xp,first?'first':'normal',[it.x,it.y-20]);save();}

/* salt sparkle: hard surfaces the waves touch go wet, then sparkle for a moment before the next wave. Sand never holds it. */
const SURF=[];{const r=mulberry(31);rocks.forEach(k=>SURF.push({x:k.x,y:k.y,rx:k.rx,ry:k.ry,name:'Rocks',st:'dry',t:0}));
 [DOCK.x0+60,DOCK.x0+130,DOCK.x1-6].forEach(px=>SURF.push({x:px,y:DOCK.y1+6,rx:7,ry:5,name:'Dock piling',st:'dry',t:0,pile:1}));}
function drawSurf(){drawSplashes();for(const s of SURF){if(s.st==='dry')continue;if(Math.abs(s.x-cam.x)>W/Z/2+60||Math.abs(s.y-cam.y)>H/Z/2+60)continue;
 if(s.st==='wet'){ctx.globalAlpha=.22;blob(s.x,s.y-s.ry*.3,s.rx*.9,s.ry*.8,s.x,INK,0);ctx.globalAlpha=1;}
 else{for(let i=0;i<4;i++){const tw=.5+.5*Math.sin(now*9+i*1.9+s.x);ctx.globalAlpha=tw*Math.min(1,s.t*2);const sx=s.x-s.rx*.6+((i*17+s.x)%(s.rx*1.2)),sy=s.y-s.ry*.6+((i*11)%(s.ry*1.1));dot(sx,sy,5*tw,'rgba(255,255,255,.35)');star(sx,sy,4.2,'#fff');}ctx.globalAlpha=1;}}}
function scrapeSalt(s){const c=s.pile?[s.x,DOCK.y1-8]:clampLand(s.x+s.rx+10,s.y+8);routeTo(c[0],c[1],()=>{if(s.st!=='sparkle'){think(pick(['Washed off. Wait for the next one.','Gone. The sea keeps its salt.']));return;}
 if(!addItem('seasalt',1)){think('No room in my pack.');return;}s.st='dry';s.t=0;pop('+1 sea salt',s.x,s.y-30,'#fff',17);
 const first=!hasSkill('foraging');if(first){unlockSkill('foraging');discover('foraging');toast('New skill: Foraging');}
 S.st.found=S.st.found||{};S.st.found.seasalt=(S.st.found.seasalt||0)+1;S.st.pinches=(S.st.pinches||0)+1;discover('seasalt');
 addXP('foraging',6,first?'first':'normal',[s.x,s.y-20]);save();});}
