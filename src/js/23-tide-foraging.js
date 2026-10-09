/* tide and foraging. The tide is a real-time cycle shared by everyone: high water brings wash-ups, low water exposes the wet band (and later the flats). */
const wetPts=[];for(let i=0;i<NP;i++)wetPts.push([0,0]);
function tideGeom(){const t=tideLevel();for(let i=0;i<NP;i++){const a=i/NP*6.2832,r=iR(a)+(1-t)*TIDE_REACH;wetPts[i][0]=Math.cos(a)*r;wetPts[i][1]=Math.sin(a)*r;}}
function drawWet(){const t=tideLevel();if(t>.985)return;sketch(wetPts,true,1,4,'#e3c27a',INK,3.5);
 ctx.globalAlpha=.35;for(let i=0;i<NP;i+=5){const a=i/NP*6.2832,r=iR(a)+(1-t)*TIDE_REACH*.5+Math.sin(a*9+i)*4;ln([[Math.cos(a)*r-5,Math.sin(a)*r],[Math.cos(a)*r+5,Math.sin(a)*r+1]],2000+i,1.5,'#fff',.4);}ctx.globalAlpha=1;}
function drawFoam(){const t=tideLevel();ctx.setLineDash([16,12]);ctx.lineDashOffset=-now*8;ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=3;ctx.beginPath();
 for(let i=0;i<NP;i++){const a=i/NP*6.2832,r=iR(a)+(1-t)*TIDE_REACH+9+Math.sin(now*1.4+a*7)*3;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();ctx.setLineDash([]);}

/* wash-ups: a glint rides in on a wave, rests on the wet sand for a window, then the backwash takes it. */
const washes=[];let washT=6;
const WASH=[['wood',44,10],['kelp',30,8],['shells',16,12],['bait',6,14],['wobble',4,24]];
function washWindow(){return Math.min(14,7+lv('foraging')*.25);}
function spawnWash(){if(washes.filter(w=>w.st!=='out').length>=3)return;const pa=Math.atan2(P.y,P.x);let a=pa+(Math.random()-.5)*2.4;if(Math.abs(a)<.55||Math.abs(a)>6)a=pa+1.3;
 const r=Math.random()*100;let acc=0,id='wood';for(const [k,wt] of WASH){acc+=wt;if(r<acc){id=k;break;}}
 washes.push({a,id,n:id==='shells'?1+Math.floor(Math.random()*3):1,st:'in',t:0,x:0,y:0,seed:Math.floor(Math.random()*999)});}
function washPos(w,k){const r0=wetR(w.a)+86,r1=wetR(w.a)-16,r=r0+(r1-r0)*k;w.x=Math.cos(w.a)*r;w.y=Math.sin(w.a)*r;}
function tideUpdate(dt){tideGeom();if(ccOn||C)return;if(tideLevel()<.5&&!S.journal.tide&&!dlgOn)discover('tide');
 washT-=dt;if(washT<=0){washT=9+(1-tideLevel())*14+Math.random()*4;spawnWash();if(!S.st.sawWash){S.st.sawWash=1;think('Something is riding in on that wave.');}}
 for(const w of washes){w.t+=dt;
  if(w.st==='in'){const k=Math.min(1,w.t/1.8);washPos(w,1-(1-k)*(1-k));if(k>=1){w.st='rest';w.t=0;}}
  else if(w.st==='rest'){washPos(w,1);if(w.t>washWindow()){w.st='out';w.t=0;}}
  else{const k=Math.min(1,w.t/1.6);washPos(w,1-k*k);}}
 for(let i=washes.length-1;i>=0;i--)if(washes[i].st==='out'&&washes[i].t>1.6)washes.splice(i,1);
 for(const s of SURF){s.t-=dt;if(s.t<=0){if(s.st==='dry'){s.st='wet';s.t=3;}else if(s.st==='wet'){s.st='sparkle';s.t=3.4;}else{s.st='dry';s.t=10+Math.random()*10;}}}}
function drawWashes(list){for(const w of list){const vis=w.st==='out'?1-w.t/1.6:1;ctx.save();ctx.globalAlpha=vis;
  if(w.st==='rest'){const left=washWindow()-w.t;if(left<2.5&&Math.floor(now*6)%2){ctx.restore();continue;}shadow(w.x,w.y+2,10,3.5);}
  else{const ph=(now*1.2)%1;ctx.globalAlpha=vis*(1-ph)*.8;sketch(ell(w.x,w.y+2,10+ph*16,(10+ph*16)*.4,10),true,w.seed,1.2,null,'#fff',2);ctx.globalAlpha=vis;}
  ctx.drawImage(iconImg(itemIcon({id:w.id})),w.x-12,w.y-20+Math.sin(now*2+w.seed)*1.2,24,24);if(w.n>1)otext(String(w.n),w.x+11,w.y-2,12,'#fff');
  if(w.st==='in'){const tw=.5+.5*Math.sin(now*14+w.seed);ctx.globalAlpha=vis*tw;star(w.x+8,w.y-22,5,'#fff');ctx.globalAlpha=1;}
  ctx.restore();}}
function grabWash(w){if(w.st!=='rest'){think(pick(['The sea took it back.','Too slow. Next wave.']));return;}
 const n=w.n,got=addItem(w.id,n);if(!got){think('No room in my pack.');return;}w.st='out';w.t=0;
 flies.push({id:'misc',img:itemIcon({id:w.id}),x0:w.x,y0:w.y,t:0});const xp=WASH.find(x=>x[0]===w.id)[2];
 const first=!hasSkill('foraging');if(first){unlockSkill('foraging');discover('foraging');toast('New skill: Foraging');}
 S.st.found=S.st.found||{};S.st.found[w.id]=(S.st.found[w.id]||0)+got;S.st.washes=(S.st.washes||0)+1;
 addXP('foraging',xp,first?'first':'normal',[w.x,w.y-20]);save();}

/* salt sparkle: hard surfaces the waves touch go wet, then sparkle for a moment before the next wave. Sand never holds it. */
const SURF=[];{const r=mulberry(31);rocks.forEach(k=>SURF.push({x:k.x,y:k.y,rx:k.rx,ry:k.ry,name:'Rocks',st:'dry',t:r()*20}));
 [DOCK.x0+60,DOCK.x0+130,DOCK.x1-6].forEach(px=>SURF.push({x:px,y:DOCK.y1+6,rx:7,ry:5,name:'Dock piling',st:'dry',t:r()*20,pile:1}));}
function drawSurf(){for(const s of SURF){if(s.st==='dry')continue;if(Math.abs(s.x-cam.x)>W/Z/2+60||Math.abs(s.y-cam.y)>H/Z/2+60)continue;
 if(s.st==='wet'){ctx.globalAlpha=.22*Math.min(1,s.t);blob(s.x,s.y-s.ry*.3,s.rx*.9,s.ry*.8,s.x,INK,0);ctx.globalAlpha=1;}
 else{for(let i=0;i<4;i++){const tw=.5+.5*Math.sin(now*9+i*1.9+s.x);ctx.globalAlpha=tw*Math.min(1,s.t*2);const sx=s.x-s.rx*.6+((i*17+s.x)%(s.rx*1.2)),sy=s.y-s.ry*.6+((i*11)%(s.ry*1.1));dot(sx,sy,5*tw,'rgba(255,255,255,.35)');star(sx,sy,4.2,'#fff');}ctx.globalAlpha=1;}}}
function scrapeSalt(s){const c=s.pile?[s.x,DOCK.y1-8]:clampLand(s.x+s.rx+10,s.y+8);routeTo(c[0],c[1],()=>{if(s.st!=='sparkle'){think(pick(['Washed off. Wait for the next one.','Gone. The sea keeps its salt.']));return;}
 if(!addItem('seasalt',1)){think('No room in my pack.');return;}s.st='dry';s.t=12+Math.random()*8;pop('+1 sea salt',s.x,s.y-30,'#fff',17);
 const first=!hasSkill('foraging');if(first){unlockSkill('foraging');discover('foraging');toast('New skill: Foraging');}
 S.st.found=S.st.found||{};S.st.found.seasalt=(S.st.found.seasalt||0)+1;S.st.pinches=(S.st.pinches||0)+1;discover('seasalt');
 addXP('foraging',6,first?'first':'normal',[s.x,s.y-20]);save();});}
