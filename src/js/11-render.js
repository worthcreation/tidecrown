/* ---------- draw ---------- */
function shadow(x,y,rx,ry){ctx.fillStyle='rgba(42,33,64,.16)';ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.3);ctx.fill();}
function drawTree(t){const x=t.x,y=t.y,s=t.s;shadow(x,y+2,24*s,8*s);const tx=x+t.lean*s,ty=y-52*s,pts=[[x,y],[x+t.lean*.4*s,y-26*s],[tx,ty]];
 ln(pts,t.seed,11*s,INK,1.2);ln(pts,t.seed,6*s,'#b07a4a',1.2);const g=['#4fa14a','#5fb35a','#3f9356'][Math.floor(t.hue*3)];
 const ch=P.task&&P.task.chop&&P.task.tree===t,sw=ch?Math.cos(Math.PI*(now-P.task.t0)/chopPer())*7*s:Math.sin(now*1.3+t.seed)*2*((t.rest||0)>now?.3:1);blob(tx-16*s+sw,ty+4*s,20*s,17*s,t.seed+1,g);blob(tx+16*s+sw,ty+2*s,20*s,17*s,t.seed+2,g);blob(tx+sw*1.4,ty-12*s,24*s,20*s,t.seed+3,g);
 ln([[tx-8*s+sw,ty-18*s],[tx-2*s+sw,ty-22*s]],t.seed+4,3,'rgba(255,255,255,.45)',.5);}
function drawRock(k){blob(k.x,k.y,k.rx,k.ry,k.seed,'#a39db6');ln([[k.x-k.rx*.4,k.y-k.ry*.3],[k.x,k.y-k.ry*.55]],k.seed+1,2.5,'rgba(255,255,255,.5)',.4);}
function drawPool(){const {x,y}=POOL;blob(x,y,44,22,170,'#8fd3dc',3);const ph=(now*.4)%1;ctx.globalAlpha=.6*(1-ph);sketch(ell(x,y,8+ph*30,(8+ph*30)*.45,12),true,171,1,null,'#fff',2);ctx.globalAlpha=1;
 ln([[x-16,y-7],[x-4,y-10]],172,2.5,'rgba(255,255,255,.85)',.5);for(const [ox,h] of [[-46,26],[-40,19],[43,24]])ln([[x+ox,y+4],[x+ox+2,y+4-h]],173+ox,2.5,'#3f7f3a',.6);}
function drawSign(){const {x,y}=SIGN;shadow(x,y+2,14,5);ln([[x,y],[x+1,y-30]],61,5,INK,.8);ln([[x,y],[x+1,y-30]],61,2.5,'#b07a4a',.8);sketch(rrPts(x-24,y-52,48,26,6),true,62,1.5,'#d9a066',INK,2.8);ln([[x-15,y-44],[x+12,y-45]],63,2,INK,1);ln([[x-15,y-36],[x+6,y-36]],64,2,INK,1);}
function drawHome(){const {x,y}=FIRE;const tx=x-54,ty=y+6;shadow(tx,ty+2,26,8);
 blob(tx,ty-18,24,20,300,'#7fa8c9',2.6);blob(tx,ty-34,10,4,301,'#5d86a8',2.2,.5);dot(tx,ty-37,3.5,'#ffcf3a');
 ln([[tx+20,ty-24],[tx+34,ty-38],[tx+36,ty-26]],302,4,INK,.5);ln([[tx+20,ty-24],[tx+34,ty-38],[tx+36,ty-26]],302,2,'#7fa8c9',.5);
 ln([[tx-22,ty-26],[tx-34,ty-18],[tx-24,ty-8]],303,4,INK,.5);ln([[tx-22,ty-26],[tx-34,ty-18],[tx-24,ty-8]],303,2,'#7fa8c9',.5);
 ln([[tx-8,ty-14],[tx+8,ty-14]],304,2,'rgba(42,33,64,.3)',.5);
 if(hasSkill('cooking')){const st=(now*.6)%1;ctx.globalAlpha=.5*(1-st);dot(tx-2+Math.sin(now*2)*3,ty-44-st*18,3+st*3,'#fff');ctx.globalAlpha=1;}
 const px=x+52,py=y+4;shadow(px,py+2,20,6);ln([[px-16,py],[px,py-46],[px+16,py]],305,3.5,'#9a6236',.8);ln([[px-16,py],[px,py-46],[px+16,py]],305,1.8,'#c98f56',.8);
 ln([[px,py-44],[px,py-26]],306,1.5,INK,.3);blob(px,py-18,11,8,307,'#4a3a3a',2.4,.5);blob(px,py-26,9,3,308,'#5a4a4a',2,.4);
 for(let i=0;i<3;i++){const sx=x+24+i*14,sy=y+30;blob(sx,sy-5,5,4.5,310+i,['#d6d0e2','#b9b3c9','#d9a066'][i],2,.4);}}
function drawHead(){const {x,y}=HEAD;blob(x,y-16,27,24,80,'#b9b3c9');ln([[x-2,y-34],[x+3,y-30]],81,2,'rgba(42,33,64,.4)',.5);
 if(dark>.25){blob(x-9,y-19,3.5,3.5,82,'#ffe58a',1.5,.3);blob(x+9,y-19,3.5,3.5,83,'#ffe58a',1.5,.3);blob(x,y-8,3,4,84,INK,0);
  const ph=(now*.5)%1;ctx.globalAlpha=1-ph;otext('\u266A',x+18+ph*14,y-40-ph*30,18,'#ffe58a');ctx.globalAlpha=1;}
 else{ln([[x-13,y-19],[x-5,y-18]],85,2.5,INK,.4);ln([[x+5,y-18],[x+13,y-19]],86,2.5,INK,.4);ln([[x-4,y-8],[x+4,y-8]],87,2.5,INK,.4);}
 blob(x,y+2,38,11,88,'#ecd28b',2.5);}
function drawCrab(){const {x}=CRAB,y=CRAB.y-(CRAB.hop>0?Math.sin(CRAB.hop/.5*Math.PI)*10:0);shadow(CRAB.x,CRAB.y+2,12,4);const w=Math.sin(now*14)*(CRAB.wait>0?0:1.5);
 for(const sd of[-1,1])for(let i=0;i<3;i++)ln([[x+sd*6,y-3+i*2],[x+sd*(13+w),y+1+i*3]],90+i+(sd>0?5:0),2,INK,.3);
 blob(x,y-4,11,7,95,'#ff6b6b',2.4,.6);blob(x,y-11,7,5,96,'#cfc8dc',2.2,.5);dot(x-3,y-12,.9,'#2a2140');dot(x+2,y-13,.9,'#2a2140');
 ln([[x-4,y-6],[x-5,y-15]],97,1.8,INK,.2);ln([[x+4,y-6],[x+5,y-15]],98,1.8,INK,.2);dot(x-5,y-16,2.2);dot(x+5,y-16,2.2);}
function drawGubbins(){const {x,y}=G;shadow(x,y+2,17,5);const sq=G.talk?Math.sin(now*16)*1.5:0;
 ln([[x-16,y-34],[x-10,y-52],[x+10,y-52],[x+16,y-34]],100,2.6,INK,1);
 sketch([[x-17,y-34-sq],[x+17,y-34-sq],[x+13,y],[x-13,y]],true,101,1.5,'#7fa8c9',INK,3);
 blob(x,y-34-sq,17,5,102,'#5d86a8',2.6,.6);
 ln([[x-13,y-12],[x+13,y-12]],103,2,'rgba(42,33,64,.35)',.6);
 const lx=Math.max(-2,Math.min(2,(P.x-x)/40));blob(x-6,y-22-sq,5,5.5,104,'#fff',2,.4);blob(x+6,y-22-sq,5,5.5,105,'#fff',2,.4);dot(x-6+lx,y-21-sq,2);dot(x+6+lx,y-21-sq,2);
 if(G.talk)blob(x,y-12,4,2+Math.abs(Math.sin(now*12))*3,106,INK,0);else ln([[x-4,y-12],[x+4,y-13]],107,2,INK,.3);}
function drawPlayer(){drawChar(S.char||DEFAULT_LOOK,S.eq,P.x,P.y,P.face,P.moving,!!P.task&&!P.task.chop);if(P.task&&P.task.chop){const f=P.face,a=-1.1+(P.task.swing>0?(1-P.task.swing/.22)*2.2:0),hx=P.x+f*8,hy=P.y-20;ctx.save();ctx.translate(hx,hy);ctx.scale(f,1);ctx.rotate(a);ln([[0,0],[0,-20]],950,5,INK,.3);ln([[0,0],[0,-20]],950,2.6,'#d9cdb5',.3);sketch([[-2,-24],[8,-22],[6,-14],[0,-17]],true,951,.3,'#8a8494',INK,1.8);ctx.restore();}if(buffOn()){const ph=(now*.5)%1;ctx.globalAlpha=(1-ph)*.7;ln([[P.x+4,P.y-62-ph*24],[P.x+9,P.y-70-ph*24],[P.x+4,P.y-78-ph*24]],890,2.2,'#fff',.4);ctx.globalAlpha=1;}}
function drawChar(a,eq,x,y,f,mv,fishing){
 const K=KIN[a.kin]||KIN.human,skin=K.tones[a.tone]||K.tones[0],sh=SHAPES[a.shape]||SHAPES.bean,rx=sh[0],ry=sh[1],acc=ACCS[a.acc]||ACCS[0],hc=HAIRC[a.hc]||HAIRC[0];
 const b=mv?Math.abs(Math.sin(now*12))*3:Math.sin(now*2);shadow(x,y+2,rx,5);
 if(mv){const s=Math.sin(now*12)*5;ln([[x-5,y-6],[x-5+s,y]],110,3.5,INK,.3);ln([[x+5,y-6],[x+5-s,y]],111,3.5,INK,.3);}else{ln([[x-5,y-6],[x-6,y]],110,3.5,INK,.3);ln([[x+5,y-6],[x+6,y]],111,3.5,INK,.3);}
 const by=y-ry-3-b,ny=by-ry+3,hx=x+f*2,hy=ny-9,coat=eq.body==='coat';
 const sp=mv?10:4,w=Math.sin(now*sp)*(mv?2.5:1.2),w2=Math.sin(now*sp+1.3)*(mv?3.2:1.6),kx=x-f*rx*.55,ky=ny+1;
 sketch([[kx,ky-2],[kx-f*9,ky+w],[kx-f*17,ky-2+w2],[kx-f*13,ky+3+w],[kx-f*19,ky+8+w2],[kx-f*8,ky+7+w],[kx,ky+4]],true,113,.4,acc,INK,2.2);
 blob(x,by,rx,ry,112,coat?'#f2c230':(COLS[a.col]||COLS[0]));
 if(coat){ln([[x+f*1,ny+3],[x+f*2,by+ry-3]],119,2,INK,.5);dot(x+f*5,by,1.6);dot(x+f*5,by+7,1.6);}
 if(K.feat==='fins'){for(const sd of[-1,1])sketch([[hx+sd*8,hy-2],[hx+sd*17,hy-8],[hx+sd*14,hy+3]],true,120+sd,.6,skin,INK,2.2);}
 blob(hx,hy,10,9.5,114,skin,2.6);
 if(a.hair==='mop'){blob(hx-f*8,hy-2,4.5,5.5,121,hc,2.2,.4);blob(hx-f*2,hy-7,8,5.5,122,hc,2.3,.5);blob(hx+f*5,hy-7,6.5,5,123,hc,2.3,.5);ln([[hx+f*2,hy-4],[hx+f*4,hy-1]],124,2,INK,.2);}
 else if(a.hair==='knot'){ln([[hx-9,hy-5],[hx,hy-9.5],[hx+9,hy-5]],125,4,hc,.4);blob(hx-f,hy-14,4.5,4,126,hc,2.2);}
 else if(a.hair==='swoop')sketch([[-10,-3],[-8,-10],[2,-11],[11,-5],[4,-6]].map(p=>[hx+p[0]*f,hy+p[1]]),true,127,.6,hc,INK,2.4);
 else if(a.hair==='braid'){blob(hx,hy-6,10.5,5,128,hc,2.4);ln([[hx-f*9,hy-2],[hx-f*14,hy+6],[hx-f*13,hy+14]],129,4,hc,.5);dot(hx-f*13,hy+15,2.2,'#b9b3c9');}
 if(K.feat==='leaf'&&(eq.head==null||eq.head==='stache')){ln([[hx,hy-9],[hx+f*2,hy-15]],130,2.2,'#3f7f3a',.3);sketch([[hx+f*2,hy-15],[hx+f*10,hy-20],[hx+f*6,hy-13]],true,131,.5,'#6fbf4a',INK,2);}
 if(K.feat==='glow'&&(eq.head==null||eq.head==='stache')){const fl=Math.sin(now*11)*1.5;blob(hx,hy-15,4,6+fl,132,'#ffb347',2,.5);dot(hx,hy-13,1.8,'#fff6a8');}
 const e1=hx-2*f,e2=hx+4*f,ey=hy-.5;
 if(a.eyes==='wide'){blob(e1,ey,3.2,3.4,133,'#fff',1.6,.2);blob(e2,ey,3.2,3.4,134,'#fff',1.6,.2);dot(e1+f*.8,ey,1.5);dot(e2+f*.8,ey,1.5);}
 else if(a.eyes==='sleepy'){ln([[e1-2,ey],[e1+2,ey+.5]],135,2,INK,.2);ln([[e2-2,ey],[e2+2,ey+.5]],136,2,INK,.2);}
 else if(a.eyes==='sly'){dot(e1,ey+.5,1.8);dot(e2,ey+.5,1.8);ln([[e1-2.5,ey-2.5],[e1+2.5,ey-1.5]],137,1.6,INK,.2);ln([[e2-2.5,ey-1.5],[e2+2.5,ey-2.5]],138,1.6,INK,.2);}
 else{dot(e1,ey,1.9);dot(e2,ey,1.9);}
 const mx=hx+f*6,my=hy+3.5;
 if(a.mark==='freckles'){dot(mx-1,my,1,'#a0603a');dot(mx+1.5,my+1,1,'#a0603a');dot(hx-f*4,my,1,'#a0603a');}
 else if(a.mark==='scar')ln([[hx-f*6,hy-5],[hx-f*2,hy+3]],139,1.6,'#c0504d',.2);
 else if(a.mark==='star')star(mx,my-1,2.8,'#ffcf3a');
 else if(a.mark==='moon'){ctx.globalAlpha=.7+.3*Math.sin(now*2);dot(mx,my,1.6,'#dff4ff');dot(mx-2,my+2,1.3,'#dff4ff');dot(hx-f*5,my,1.3,'#dff4ff');ctx.globalAlpha=1;}
 sketch(rrPts(x-rx*.8,ny-3.5,rx*1.6,7.5,3.5),true,115,.5,acc,INK,2.4);
 blob(kx,ky+.5,3.4,3.2,116,acc,2.2,.3);
 if(eq.head==='stache')drawStache(hx+f*1.5,hy+3.8,1.1,Math.sin(now*3)*.6);
 if(eq.head==='cap'){blob(hx,hy-7,11.5,6,140,'#9d97b0',2.4);dot(hx-4,hy-9,1.5,'#fff');dot(hx+3,hy-10,1.3,'#fff');dot(hx+6,hy-7,1.2,'#fff');}
 else if(eq.head==='thimble'){sketch([[hx-10,hy-4],[hx-9,hy-12],[hx,hy-16],[hx+9,hy-12],[hx+10,hy-4]],true,141,.5,'#d6d0e2',INK,2.4);dot(hx-3,hy-10,1);dot(hx+2,hy-11,1);dot(hx+5,hy-8,1);dot(hx-6,hy-7,1);}
 if(eq.hand==='gloves')blob(x+f*(rx-1),by+3,4.5,4,142,'#4f9a5a',2);
 else if(fishing)ln([[x-f*1,by-1],[x+f*10,by+1]],143,3,INK,.3);
 if(eq.trinket)dot(x-f*(rx*.4),by+ry*.5,2.4,'#ffcf3a');}
function drawSpot(sp){let a=1;if(sp.type==='moon'){a=Math.min(1,(dark-.1)/.25);if(a<=.02)return;}ctx.save();ctx.globalAlpha=a;
 if(sp.type==='deep')sketch(ell(sp.x,sp.y,36,17,14),true,sp.seed,3,'#2f8ea2',null);
 if(sp.type==='moon'){const g=ctx.createRadialGradient(sp.x,sp.y,4,sp.x,sp.y,70);g.addColorStop(0,'rgba(225,238,255,.85)');g.addColorStop(1,'rgba(225,238,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sp.x,sp.y,70,0,6.3);ctx.fill();
  const t=now*.7;dot(sp.x+Math.cos(t)*18,sp.y+Math.sin(t)*8,4,'rgba(255,255,255,.8)');}
 for(let k=0;k<3;k++){const ph=(now*.55+k/3+sp.seed*.1)%1,r=6+ph*28;ctx.globalAlpha=a*(1-ph)*.9;sketch(ell(sp.x,sp.y,r,r*.45,12),true,sp.seed+k,1.5,null,sp.type==='moon'?'#eaf2ff':'#fff',2.5);}
 ctx.globalAlpha=a;for(let i=0;i<3;i++){const ph=(now*.8+i*.33+sp.seed)%1;dot(sp.x+Math.sin(i*2+sp.seed)*12,sp.y-ph*12,2.6*(1-ph)+.5,'#fff');}ctx.restore();}
function drawDock(){for(const px of[DOCK.x0+60,DOCK.x0+130,DOCK.x1-6])for(const py of[DOCK.y0-2,DOCK.y1+2])blob(px,py+4,5,5,px+py,'#7a4f2c',2.4,.6);
 sketch(rrPts(DOCK.x0,DOCK.y0,DOCK.x1-DOCK.x0,DOCK.y1-DOCK.y0,5),true,120,2,'#c98f56',INK,3);
 for(let px=DOCK.x0+24;px<DOCK.x1-8;px+=24)ln([[px,DOCK.y0+3],[px+1,DOCK.y1-3]],121+px,2,'rgba(42,33,64,.55)',.8);}
function drawLine(){const T=P.task;if(!T||T.chop)return;const f=P.face,tip=[P.x+f*30,P.y-54];const sp=T.sp;let bx=sp.x+(P.x-sp.x)*.18,by=sp.y+(P.y-sp.y)*.18;
 ln([[P.x+f*8,P.y-18],[P.x+f*20,P.y-36],tip],130,4,'#a8703f',.8);
 if(T.phase==='cast'){const k=Math.min(1,T.t/.5);bx=tip[0]+(bx-tip[0])*k;by=tip[1]+(by-tip[1])*k-Math.sin(k*Math.PI)*50;}
 const bite=T.phase==='bite';if(bite)by+=5+Math.sin(now*40)*2;else if(T.phase!=='cast')by+=Math.sin(now*3)*1.5;
 ctx.strokeStyle='rgba(42,33,64,.8)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(tip[0],tip[1]);ctx.quadraticCurveTo((tip[0]+bx)/2,Math.max(tip[1],by)+20,bx,by);ctx.stroke();
 if(T.phase!=='reel'){blob(bx,by-3,4.5,4.5,131,'#fff',2,.3);ctx.save();ctx.beginPath();ctx.rect(bx-8,by-10,16,8);ctx.clip();blob(bx,by-3,4.5,4.5,131,'#ff6b6b',2,.3);ctx.restore();}
 if(T.phase==='wait'&&S.eq.trinket==='whisper'&&T.t>T.wait-.5){const ph=(now*4)%1;for(let i=0;i<4;i++){const a=i*1.57+now*3;dot(bx+Math.cos(a)*(10+ph*6),by-3+Math.sin(a)*(5+ph*3),2,'#ffe58a');}}
 if(bite){const ph=(T.t*3)%1;ctx.globalAlpha=1-ph;sketch(ell(bx,by,8+ph*22,(8+ph*22)*.45,10),true,132,1.2,null,'#fff',2.5);ctx.globalAlpha=1;}}
function drawFly(){for(const f of flies){const k=Math.min(1,f.t/.6),x=f.x0+(P.x-f.x0)*k,y=f.y0+(P.y-34-f.y0)*k-Math.sin(k*Math.PI)*80,sc=k<1?1:1-(f.t-.6)/.15;if(sc<=0)continue;
 ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ctx.rotate(k<1?Math.sin(now*22)*.35:0);
 if(f.id==='misc'){ctx.drawImage(iconImg(f.img),-14,-14,28,28);}else if(f.id==='bottle')sketch(rrPts(-6,-9,12,18,5),true,4,.6,'#9fd8b4',INK,2.2);else drawFish(f.id,0,0,1.05,P.x>f.x0?1:-1,f.col);ctx.restore();}}

function render(){
 ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#3fa7b8';ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(W/2,H/2);ctx.scale(Z,Z);ctx.translate(-cam.x,-cam.y);
 const vw=W/Z/2+80,vh=H/Z/2+80;
 ctx.globalAlpha=.5;for(const w of waves){const x=w.x+Math.sin(now*.6+w.s)*12,y=w.y;if(Math.abs(x-cam.x)>vw||Math.abs(y-cam.y)>vh)continue;ln([[x-10,y],[x,y-4],[x+10,y]],w.seed,2.5,'#fff',1);}ctx.globalAlpha=1;
 sketch(shallowPts,true,3,6,'#5fbecb',null);
 spots.forEach(drawSpot);
 drawFoam();drawWet();
 sketch(sandPts,true,1,4,'#f3d27a',tideLevel()>.985?INK:'rgba(42,33,64,.25)',3.5);
 drawDock();
 sketch(grassPts,true,2,4,'#86c25e',INK,3);
 for(const t of tufts){if(Math.abs(t.x-cam.x)>vw||Math.abs(t.y-cam.y)>vh)continue;if(t.f){dot(t.x,t.y,3.2,t.c>.5?'#ff8fb1':'#fff6a8');dot(t.x,t.y,1.2,'#ffcf3a');}else ln([[t.x-5,t.y-6],[t.x,t.y],[t.x+5,t.y-7]],t.seed,2,'#5a9a3f',.6);}
 drawPickups();
 if(mark){const k=mark.t/.6;ctx.globalAlpha=1-k;sketch(ell(mark.x,mark.y,10*(1-k*.5),5*(1-k*.5),10),true,140,1,null,INK,2.5);ctx.globalAlpha=1;}
 const d=[];trees.forEach(t=>d.push([t.y,()=>drawTree(t)]));rocks.forEach(k=>d.push([k.y,()=>drawRock(k)]));d.push([DOCK.y1+40,drawSurf]);
 washes.forEach(w=>d.push([w.y,()=>drawWashes([w])]));washes.forEach(w=>d.push([w.y,()=>drawWashes([w])]));d.push([FIRE.y-20,drawHome],[POOL.y-40,drawPool],[GULL.y,drawGull],[SIGN.y,drawSign],[HEAD.y,drawHead],[CRAB.y,drawCrab],[G.y,drawGubbins],[P.y,drawPlayer]);allFires().forEach(fr=>d.push([fr.y,()=>drawFireAt(fr)]));if(KW.active)d.push([KW.y,drawKindle]);
 d.sort((a,b)=>a[0]-b[0]).forEach(x=>{if(x[1]===drawPlayer){drawPlayer();drawLine();}else x[1]();});
 drawFly();drawChopFX();if(C)drawCook();
 if(S.eq.trinket==='blankmap'){ctx.strokeStyle='#fffbe0';ctx.lineWidth=2.2;for(const o of objects()){if(!o.key||S.journal[o.key])continue;const tw=(Math.sin(now*3+o.x*.05)+1)/2,sx=o.x+o.r*.6,sy=o.y-o.r*.6,r=3+tw*3.5;
  ctx.globalAlpha=.35+tw*.65;ctx.beginPath();ctx.moveTo(sx-r,sy);ctx.lineTo(sx+r,sy);ctx.moveTo(sx,sy-r);ctx.lineTo(sx,sy+r);ctx.stroke();}ctx.globalAlpha=1;}
 ctx.restore();
 if(dark>.01){dctx.setTransform(1,0,0,1,0,0);dctx.globalCompositeOperation='source-over';dctx.clearRect(0,0,dk.width,dk.height);dctx.fillStyle='rgba(22,17,62,'+dark+')';dctx.fillRect(0,0,dk.width,dk.height);
  dctx.globalCompositeOperation='destination-out';const L=[[P.x,P.y-20,120+eff('light')+(S.char&&S.char.kin==='ember'?45:0)],[FIRE.x,FIRE.y-10,180+Math.sin(now*9)*8]];(S.fires||[]).forEach(f=>{if(fireLit(f))L.push([f.x,f.y-10,(f.big?250:160)+Math.sin(now*9+f.x)*6]);});if(dark>.15)L.push([MOON.x,MOON.y,140]);if(dark>.25)L.push([HEAD.x,HEAD.y-18,55]);
  for(const [x,y,r] of L){const [sx,sy]=w2s(x,y),R=r*Z*DPR;const g=dctx.createRadialGradient(sx*DPR,sy*DPR,0,sx*DPR,sy*DPR,R);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.5,'rgba(0,0,0,.7)');g.addColorStop(1,'rgba(0,0,0,0)');dctx.fillStyle=g;dctx.beginPath();dctx.arc(sx*DPR,sy*DPR,R,0,6.3);dctx.fill();}
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(dk,0,0);ctx.setTransform(DPR,0,0,DPR,0,0);}
 ctx.save();ctx.translate(W/2,H/2);ctx.scale(Z,Z);ctx.translate(-cam.x,-cam.y);
 if(P.task&&P.task.phase==='bite'){const s=1+Math.sin(now*20)*.12;ctx.save();ctx.translate(P.x,P.y-82);ctx.scale(s,s);otext('!',0,0,40,'#ffcf3a');ctx.restore();}
 for(const p of pops){ctx.globalAlpha=p.t>1?1-(p.t-1)/.5:1;otext(p.txt,p.x,p.y-p.t*30,p.size,p.col);}ctx.globalAlpha=1;
 if(bub){ctx.font="18px 'Patrick Hand','Comic Sans MS',cursive";const lines=wrap(bub.txt,210),lh=21,w=Math.max(...lines.map(l=>ctx.measureText(l).width))+26,h=lines.length*lh+16,bx=P.x-w/2,by=P.y-78-h;
  ctx.globalAlpha=bub.t>3.9?1-(bub.t-3.9)/.5:Math.min(1,bub.t*6);blob(P.x+8,P.y-58,4,3.5,150,'#fffaf0',2,.3);blob(P.x+3,P.y-68,6,5,151,'#fffaf0',2,.3);
  sketch(rrPts(bx,by,w,h,12),true,152,2,'#fffaf0',INK,2.6);ctx.fillStyle=INK;ctx.textAlign='center';ctx.textBaseline='top';lines.forEach((l,i)=>ctx.fillText(l,P.x,by+9+i*lh));ctx.globalAlpha=1;}
 ctx.restore();
 drawOrbsHUD();
 if(cele){const k=cele.t,sc=k<.25?k/.25*1.1:k<.4?1.1-(k-.25)/.15*.1:1,a=k>2.7?1-(k-2.7)/.5:1;ctx.save();ctx.globalAlpha=Math.max(0,a);ctx.translate(W/2,Math.max(120,H*.24));ctx.scale(sc,sc);
  const pts=[];for(let i=0;i<22;i++){const r=i%2?60:86,t=i/22*6.2832+k*.35;pts.push([Math.cos(t)*r*1.45,Math.sin(t)*r*.72]);}sketch(pts,true,77,5,'#ffcf3a',INK,4);
  otext((cele.name||'Fishing')+' '+cele.l,0,-6,40,'#fff');otext(cele.msg,0,74,19,'#fff');ctx.restore();}
 if(intro!=null){const k=intro,a=k<.5?k/.5:k>2.4?1-(k-2.4)/.8:1;ctx.globalAlpha=Math.max(0,a);otext('Tidecrown',W/2,H*.3,50,'#fff');otext('Driftwood Key, somewhere in the Lantern Sea',W/2,H*.3+42,19,'#fff');ctx.globalAlpha=1;}
}

