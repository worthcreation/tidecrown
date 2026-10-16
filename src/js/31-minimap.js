/* ---------- the minimap (build 41) ----------
   A small round map in the top-right corner, north up like the camera, about 600 world px across its radius. It shows
   the ground and the sea (a low-resolution top-down image of the whole reachable realm, depth bands following the tide), you as an arrow, and only what you have met
   or been told: dwellers you know, things lying on the ground, your lit fires, the tracked quest's next spot (an arrow
   on the rim when it is off the map). Where you have not been is dark: exploring is what draws the map, and what you
   have seen is saved (S.mm, a run-length string per realm). Tap it to walk there; tap the sea to walk to the nearest
   shore (or swim there if swimming). Long-press it for the full Map tab. It can be hidden from the You tab. */
/* size (You tab): small, medium, large; the view widens with it, so larger shows more of the island */
const MMSZ={s:35,m:45,l:60},MMC=24;let MMR=45,MMK=MMR/600;
function mmSize(){MMR=MMSZ[(S.opt&&S.opt.mmSz)||'m']||45;MMK=45/600;document.documentElement.style.setProperty('--mmw',(S.opt&&S.opt.mmOff?0:MMR*2+28)+'px');}
/* the phone's safe area, measured once from a probe */let MMSAFE=null;function mmSafe(){if(MMSAFE)return MMSAFE;const d=document.createElement('div');d.style.cssText='position:fixed;top:0;right:0;padding-top:env(safe-area-inset-top,0px);padding-right:env(safe-area-inset-right,0px);visibility:hidden';document.body.appendChild(d);const cs=getComputedStyle(d);MMSAFE={t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0};d.remove();return MMSAFE;}
const MM={img:{},fog:{},seen:{},t:0,dirty:true};
function mmRealm(){return SH.on?'sh':'key';}
/* the realm's box: the whole sea you can reach, not just the land (build 43) */
const MMB={};function mmBox(r){if(MMB[r])return MMB[r];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const add=(x,y,m)=>{x0=Math.min(x0,x-m);x1=Math.max(x1,x+m);y0=Math.min(y0,y-m);y1=Math.max(y1,y+m);};
 if(r==='key'){let R=0;for(let a=0;a<6.28;a+=.1)R=Math.max(R,iR(a));add(0,0,R+TIDE_REACH+700);for(const f of KFEAT)add(f.x,f.y,f.reach+120);x1=Math.min(x1,FAR_X()+300);}
 else{for(const I of ISLES)add(I.x,I.y,Math.max(I.rx,I.ry)*1.3+500);for(const f of SHFEAT)add(f.x,f.y,f.reach+120);x0=Math.min(x0,SH_WEST-300);}
 return MMB[r]={x0:Math.floor(x0),y0:Math.floor(y0),x1:Math.ceil(x1),y1:Math.ceil(y1)};}
/* the boxes before build 43, to carry explored ground over */
function mmOldBox(r){if(r==='key')return {x0:-1250,y0:-1250,x1:1250,y1:1250};let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const I of ISLES){x0=Math.min(x0,I.x-I.rx*1.3);x1=Math.max(x1,I.x+I.rx*1.3);y0=Math.min(y0,I.y-I.ry*1.3);y1=Math.max(y1,I.y+I.ry*1.3);}return {x0,y0,x1,y1};}
function mmPos(){const sa=mmSafe();return {cx:W-MMR-14-sa.r,cy:MMR+14+sa.t};}
function mmShown(){return !(S.opt&&S.opt.mmOff)&&!ccOn&&intro==null&&!C;}
/* the ground and the sea, top down. The base (what each pixel is, and the sea's depth at mid tide) is worked out a few
   rows a frame and kept; the picture is recoloured from it as the tide moves, so bars bare and islets grow a beach at
   low tide on the map as they do in the world. Sea is drawn in the same depth bands as the world, reefs show coral. */
const MMST=10,MMCOL={1:[243,210,122],2:[132,196,96],3:[170,186,96],4:[96,150,84],5:[168,160,170],6:[243,210,122],7:[134,194,94],8:[110,120,92],9:[122,111,88],10:[58,74,51]};
function mmPal(r){const far=r==='sh'?1:0,dp=DEEP0.map((c,i)=>c+(DEEP1[i]-c)*far),sh=SHAL0.map((c,i)=>c+(SHAL1[i]-c)*far);return [...DLEVELS].reverse().concat([3]).map(v=>{const t=Math.pow(Math.max(0,1-v/2.7),1.4);return dp.map((c,i)=>Math.round(c+(sh[i]-c)*t));});}
function mmImage(r){let M=MM.img[r];if(!M){const B=mmBox(r),w=Math.ceil((B.x1-B.x0)/MMST),h=Math.ceil((B.y1-B.y0)/MMST),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
  M=MM.img[r]={c,g,B,st:MMST,w,h,row:0,kind:new Uint8Array(w*h),d0:new Float32Array(w*h),reef:new Uint8Array(w*h),hl:new Float32Array(w*h),id:g.createImageData(w,h),off:null,pal:mmPal(r)};}
 if(M.row<M.h){const t0=performance.now(),keep=tideF;tideF=.5;const B=M.B,FT=r==='key'?KFEAT:SHFEAT;
  while(M.row<M.h&&performance.now()-t0<3){const j=M.row++;for(let i=0;i<M.w;i++){const x=B.x0+i*MMST,y=B.y0+j*MMST,k=j*M.w+i;
   const isl=r==='key'?onIsletK(x,y):onIsletS(x,y);if(isl){M.kind[k]=fLocal(isl,x,y)<-Math.min(isl.rx,isl.ry)*.32?(r==='key'?7:10):(r==='key'?6:9);continue;}
   if(r==='key'){const hh=hKey(x,y);if(hh>0||onIsland(x,y)||onDock(x,y)){M.kind[k]=onDock(x,y)?5:keyMat(x,y,hh);M.hl[k]=hh;continue;}}
   else if(shWalkable(x,y)||shIsle(x,y)){M.kind[k]=8;continue;}
   M.d0[k]=depthAt(x,y);for(const f of FT)if(f.kind==='reef'&&Math.abs(x-f.x)<f.rx*1.4&&Math.abs(y-f.y)<f.rx*1.4&&fLocal(f,x,y)<=0){M.reef[k]=1;break;}}}
  tideF=keep;if(M.row>=M.h||now-(M.rct||0)>.3){M.rct=now;M.off=null;}}
 const off=tideOff();if(M.off==null||Math.abs(off-M.off)>.01){M.off=off;const D=M.id.data,P=M.pal,wet=r==='key'?[226,201,142]:[109,101,80],n=M.row*M.w;
  for(let k=0;k<n;k++){const o=k*4,kd=M.kind[k];let c3;if(kd){c3=MMCOL[kd]||MMCOL[2];if(r==='key'&&kd!==1&&kd<5){const f=1+Math.min(1,M.hl[k]/100)*.18;c3=c3.map(v=>Math.min(255,v*f));}}
   else{const d=M.d0[k]+off;if(d<=0)c3=wet;else{let b=P.length-1;for(let q=0;q<DLEVELS.length;q++){if(d<=DLEVELS[DLEVELS.length-1-q]){b=q;break;}}c3=P[b];if(M.reef[k])c3=[Math.round(c3[0]*.6+233*.4),Math.round(c3[1]*.6+138*.4),Math.round(c3[2]*.6+122*.4)];}}
   D[o]=c3[0];D[o+1]=c3[1];D[o+2]=c3[2];D[o+3]=255;}
  M.g.putImageData(M.id,0,0);}
 return M;}
/* explored cells, saved as a run-length string */
function mmGrid(r){if(MM.seen[r])return MM.seen[r];const B=mmBox(r),w=Math.ceil((B.x1-B.x0)/MMC),h=Math.ceil((B.y1-B.y0)/MMC),a=new Uint8Array(w*h);S.mm=S.mm||{};const s=S.mm[r];
 S.mmv=S.mmv||{};const dec=(str,arr)=>{let k=0,v=0;for(const part of str.split('.')){const n=parseInt(part,36)||0;arr.fill(v,k,Math.min(arr.length,k+n));k+=n;v=1-v;}};
 if(s&&S.mmv[r]===2)dec(s,a);
 else if(s){/* build 43 widened the box to the whole sea: carry old explored cells over */const O=mmOldBox(r),ow=Math.ceil((O.x1-O.x0)/MMC),oh=Math.ceil((O.y1-O.y0)/MMC),oa=new Uint8Array(ow*oh);dec(s,oa);
  for(let j=0;j<oh;j++)for(let i=0;i<ow;i++){if(!oa[j*ow+i])continue;const x=O.x0+(i+.5)*MMC,y=O.y0+(j+.5)*MMC,ni=Math.floor((x-B.x0)/MMC),nj=Math.floor((y-B.y0)/MMC);if(ni>=0&&nj>=0&&ni<w&&nj<h)a[nj*w+ni]=1;}}
 MM.seen[r]={a,w,h,B};if(s&&S.mmv[r]!==2){S.mmv[r]=2;mmSave(r);}else S.mmv[r]=2;return MM.seen[r];}
function mmSave(r){const G=MM.seen[r];if(!G)return;const out=[];let v=0,n=0;for(let k=0;k<G.a.length;k++){if(G.a[k]===v)n++;else{out.push(n.toString(36));v=1-v;n=1;}}out.push(n.toString(36));S.mm=S.mm||{};S.mm[r]=out.join('.');}
/* what you can see from where you stand: about a screen's half-width round you */
function mmTick(dt){if((MM.t-=dt)>0)return;MM.t=.5;const r=mmRealm(),G=mmGrid(r),R=(SW.on||(SH.on?!shIsle(P.x,P.y)&&!shWalkable(P.x,P.y):inSea(P.x,P.y)))?420:280,ci=Math.floor((P.x-G.B.x0)/MMC),cj=Math.floor((P.y-G.B.y0)/MMC),n=Math.ceil(R/MMC);let ch=0;
 for(let j=cj-n;j<=cj+n;j++)for(let i=ci-n;i<=ci+n;i++){if(i<0||j<0||i>=G.w||j>=G.h)continue;if((i-ci)**2+(j-cj)**2>n*n)continue;const k=j*G.w+i;if(!G.a[k]){G.a[k]=1;ch=1;}}
 if(ch){MM.dirty=true;mmSave(r);}}
function mmFog(r){if(MM.fog[r]&&!MM.dirty)return MM.fog[r];const G=mmGrid(r);const c=MM.fog[r]&&MM.fog[r].c||document.createElement('canvas');c.width=G.w;c.height=G.h;const g=c.getContext('2d'),im=g.createImageData(G.w,G.h);
 for(let k=0;k<G.a.length;k++){const o=k*4;im.data[o]=30;im.data[o+1]=24;im.data[o+2]=52;im.data[o+3]=G.a[k]?0:235;}g.putImageData(im,0,0);MM.dirty=false;return MM.fog[r]={c,G};}
/* what you know about, as [x,y,colour,size] */
function mmMarks(){const m=[],j=S.journal||{};if(SH.on){for(const f of PLANTED)m.push([f.x,f.y,'#6fbf4a',2.5]);}
 else{if(S.metWick)m.push([FIRE.x,FIRE.y,'#ffcf3a',3]);if(S.metG)m.push([G.x,G.y,'#ffcf3a',3]);if(j.crab||j.thimble||j.thimblekit)m.push([CRAB.x,CRAB.y,'#ffcf3a',3]);if(j.bollard)m.push([BOLLARD.x,BOLLARD.y,'#ffcf3a',2.5]);if(j.gullbank)m.push([GULL.x,GULL.y,'#ffcf3a',2.5]);
  for(const f of S.fires||[])if(fireLit(f)&&!f.main)m.push([f.x,f.y,'#ff8a3d',2.5]);if(j.clam)for(const c of clams())m.push([c.x,c.y,'#e98a7a',2.2]);}
 wreckMarks(m);for(const g of S.ground||[])m.push([g.x,g.y,'#ff5a4a',2]);for(const it of S.shore||[])m.push([it.x,it.y,'#ff5a4a',1.6]);return m;}
function drawMinimap(dt){mmSize();if(!mmShown())return;mmTick(dt);const r=mmRealm(),{cx,cy}=mmPos(),I=mmImage(r),F=mmFog(r),k=MMK;
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,MMR,0,6.2832);ctx.fillStyle='#1e1834';ctx.fill();ctx.clip();
 const px=cx-(P.x-I.B.x0)*k,py=cy-(P.y-I.B.y0)*k;ctx.imageSmoothingEnabled=true;ctx.drawImage(I.c,px,py,I.c.width*I.st*k,I.c.height*I.st*k);
 ctx.drawImage(F.c,cx-(P.x-F.G.B.x0)*k,cy-(P.y-F.G.B.y0)*k,F.G.w*MMC*k,F.G.h*MMC*k);
 for(const [x,y,col,s] of mmMarks()){const sx=cx+(x-P.x)*k,sy=cy+(y-P.y)*k;if(Math.hypot(sx-cx,sy-cy)>MMR-2)continue;const G=mmGrid(r),gi=Math.floor((x-G.B.x0)/MMC),gj=Math.floor((y-G.B.y0)/MMC);if(!G.a[gj*G.w+gi])continue;ctx.beginPath();ctx.arc(sx,sy,s,0,6.2832);ctx.fillStyle=col;ctx.fill();ctx.lineWidth=1;ctx.strokeStyle=INK;ctx.stroke();}
 /* you: an arrow the way you last moved */const a=P.hd!=null?P.hd:(P.face<0?Math.PI:0);ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-4,4);ctx.lineTo(-2,0);ctx.lineTo(-4,-4);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
 ctx.restore();
 /* the tracked quest: a mark on the map, or an arrow on the rim pointing the way */
 const q=typeof questMarks==='function'?questMarks():[];if(q.length&&!SH.on){let best=null,bd=1e9;for(const s of q){const d=Math.hypot(s[0]-P.x,s[1]-P.y);if(d<bd){bd=d;best=s;}}const dx=best[0]-P.x,dy=best[1]-P.y,d=Math.hypot(dx,dy)*k;
  if(d<MMR-4){star(cx+dx*k,cy+dy*k,4.5,'#ffcf3a');}else{const an=Math.atan2(dy,dx);ctx.save();ctx.translate(cx+Math.cos(an)*(MMR-1),cy+Math.sin(an)*(MMR-1));ctx.rotate(an);ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-4,5);ctx.lineTo(-4,-5);ctx.closePath();ctx.fillStyle='#ffcf3a';ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1.4;ctx.stroke();ctx.restore();}}
 /* the rim, hand-inked, and a small N */sketch(ell(cx,cy,MMR,MMR,28),true,1201,.6,null,INK,3);otext('N',cx,cy-MMR+9,11,'#fff');}
/* a drag that starts on the minimap strokes at the map's scale: a short drag there pushes like a full slide on the main screen (build 43) */
const MMDRAG=4.7;function mmSwipe(x0,y0,x1,y1,ms){if(C||ccOn||dlgOn)return;const dx=x1-x0,dy=y1-y0,d=Math.hypot(dx,dy);if(d<5)return;
 if(!SW.on&&inSea(P.x,P.y)&&seaDepth(P.x,P.y)>=SWIMD)swimStart(P.x,P.y);if(!SW.on)return;
 const D=d*MMDRAG,sp=D/Math.max(60,ms),pw=Math.max(.5,Math.min(2.4,(D/140)*(.5+Math.min(1.5,sp))));SW.tx=P.x+dx/d*(160+140*pw);SW.ty=P.y+dy/d*(160+140*pw);swimStroke(pw);}
function mmHit(sx,sy){if(!mmShown())return false;const {cx,cy}=mmPos();return Math.hypot(sx-cx,sy-cy)<=MMR+4;}
/* tap: walk (or swim) to that spot */
function mmTap(sx,sy){const {cx,cy}=mmPos(),wx=P.x+(sx-cx)/MMK,wy=P.y+(sy-cy)/MMK;
 if(SW.on){swimTo(wx,wy);return;}if(!SH.on&&inSea(wx,wy)){const c=clampLand(wx,wy);routeTo(c[0],c[1]);return;}if(!walkable(wx,wy)){const c=clampLand(wx,wy);routeTo(c[0],c[1]);return;}routeTo(wx,wy);}
