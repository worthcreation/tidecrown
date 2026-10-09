/* ---------- update ---------- */
function update(dt){
 {const q=Date.now()/DAY_PERIOD;S.day=q%1;S.dayN=Math.floor(q);}const light=.5-.5*Math.cos(S.day*6.2832);dark=Math.min(1,Math.max(0,(.42-light)/.3))*.62;
 if(intro!=null){intro+=dt;if(intro>3.2)intro=null;}
 if(P.path.length){P.pathT+=dt;const [tx,ty]=P.path[0];const dx=tx-P.x,dy=ty-P.y,d=Math.hypot(dx,dy),sp=175*dt;
  if(Math.abs(dx)>1)P.face=dx>0?1:-1;
  if(d<=sp){P.x=tx;P.y=ty;P.path.shift();}
  else{const nx=P.x+dx/d*sp,ny=P.y+dy/d*sp;
   if(walkable(nx,ny)){P.x=nx;P.y=ny;}else if(walkable(nx,P.y))P.x=nx;else if(walkable(P.x,ny))P.y=ny;
   else{const c=Math.hypot(P.x,P.y)||1,mx=P.x-P.x/c*sp,my=P.y-P.y/c*sp;if(walkable(mx,my)){P.x=mx;P.y=my;}}}
  if(P.pathT>14)P.path=[];
  P.moving=true;
  if(!P.path.length){P.moving=false;const f=P.then;P.then=null;if(f)f();if(S.hint===0)advanceHint(1);}
 }else P.moving=false;
 const T=P.task&&!P.task.chop?P.task:null;
 if(T){T.t+=dt;
  if(T.sp.st==='out'&&T.sp.al<.5){P.task=null;think('The water went still under my line.');}
  else if(T.sp.type==='moon'&&dark<.12){P.task=null;think('The glow faded. The moonkoi slipped away.');}
  else if(T.phase==='cast'&&T.t>.55){T.phase='wait';T.t=0;T.wait=Math.max(.8,1.6+Math.random()*3.2-(T.baited?.7:0)-eff('wait'));}
  else if(T.phase==='wait'&&T.t>T.wait){T.phase='bite';T.t=0;T.fish=rollFish(T.sp);T.win=(T.fish==='bottle'?800:FISH[T.fish].win)+(T.baited?220:0)+Math.min(150,lv('fishing')*5)+eff('win');if(navigator.vibrate)try{navigator.vibrate(35);}catch(e){}}
  else if(T.phase==='bite'&&T.t*1000>T.win){T.phase='miss';T.t=0;pop('It got away...',P.x,P.y-70,'#fff',19);}
  else if((T.phase==='miss'&&T.t>.8)||(T.phase==='reel'&&T.t>.7)){if(S.inv.length>=PACK)P.task=null;else cast(T);}}
 // crab
 kindleMove(dt);
 CRAB.wait-=dt;if(CRAB.hop>0)CRAB.hop-=dt;
 if(CRAB.wait<=0){const dx=CRAB.tx-CRAB.x,dy=CRAB.ty-CRAB.y,d=Math.hypot(dx,dy);
  if(d<2){CRAB.wait=1+Math.random()*3;const a=Math.random()*6.28,r=Math.random()*90;const nx=crabHome[0]+Math.cos(a)*r,ny=crabHome[1]+Math.sin(a)*r;if(onIsland(nx,ny)){CRAB.tx=nx;CRAB.ty=ny;}}
  else{const s=Math.min(d,40*dt);CRAB.x+=dx/d*s;CRAB.y+=dy/d*s;}}
 if(dark>.3&&!S.journal.moonpool&&Math.hypot(P.x-MOON.x,P.y-MOON.y)<340){discover('moonpool');think('The water to the west is glowing...');}
 pops=pops.filter(p=>(p.t+=dt)<1.5);
 if(bub&&(bub.t+=dt)>4.4)bub=null;
 flies=flies.filter(f=>(f.t+=dt)<.75);
 if(mark&&(mark.t+=dt)>.6)mark=null;
 if(cele&&(cele.t+=dt)>3.2)cele=null;
 const k=Math.min(1,dt*5),tx=C?C.fr.x:P.x,ty=C?C.fr.y-50:P.y;cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;camZ+=((C?cookZoom():(P.task&&P.task.chop?1.25:1))-camZ)*Math.min(1,dt*4);Z=ZB*camZ;
 if(C)cookUpdate(dt);tideUpdate(dt);spotsUpdate(dt);updOrbs(dt);guideT-=dt;if(guideT<=0){guideT=1;hearthGuide();}buffT-=dt;if(buffT<=0){buffT=.5;buffUI();kindleTick();if(S.ground&&S.ground.length){const T=Date.now(),n0=S.ground.length;S.ground=S.ground.filter(g=>g.exp>T);if(S.ground.length!==n0)save();}(S.fires||[]).slice().forEach(fr=>{if(!fireLit(fr)&&!(C&&C.fr===fr))burnOut(fr);});}
}

