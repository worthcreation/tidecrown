/* ---------- dunes drawn as ink (build 39) ----------
   The sand is clean flat colour, so each dune reads by its own shape: the dune field alone (duneAt, 30-terrain) is
   sampled on an 8px grid once, traced with marching squares into smooth closed outlines at two heights, and drawn
   lifted onto the ground: a warm body with an ink outline, a faint inner line near the top, wind ripples on the backs,
   and a grass tuft on each hummock where a plant caught the sand. Nothing saved; built a few ms a frame after the
   height cache, while the title shows. */
const DNG=8,DNR=1150,DUNE={row:0,v:null,n:0,done:false,lo:null,hi:null,rip:null,tuft:null};
function duneBuild(ms){if(DUNE.done)return true;const n=DUNE.n||(DUNE.n=Math.ceil(2*DNR/DNG)+1);if(!DUNE.v)DUNE.v=new Float32Array(n*n);const t0=performance.now(),v=DUNE.v;
 while(DUNE.row<n&&performance.now()-t0<ms){const j=DUNE.row,y=-DNR+j*DNG;for(let i=0;i<n;i++){const x=-DNR+i*DNG,r=Math.hypot(x,y),a=Math.atan2(y,x),ir=iR(a);v[j*n+i]=r>ir||ir-r>beachFB(a)+140?0:duneAD(x,y,a,ir-r);}DUNE.row++;}
 if(DUNE.row<n)return false;
 DUNE.lo=duneTrace(v,n,2.4);DUNE.hi=duneTrace(v,n,6.5);
 /* wind ripples: short strokes along the contour on the dune backs, a few per dune */
 DUNE.rip=[];for(let j=1;j<n-1;j+=2)for(let i=1;i<n-1;i+=2){const h=v[j*n+i];if(h<3.2||hash1(j*977+i*31)>.16)continue;const gx=v[j*n+i+1]-v[j*n+i-1],gy=v[(j+1)*n+i]-v[(j-1)*n+i],gl=Math.hypot(gx,gy);if(gl<.4)continue;
  const tx=-gy/gl,ty=gx/gl,x=-DNR+i*DNG,y=-DNR+j*DNG,k=7,bx=gx/gl*2,by=gy/gl*2;DUNE.rip.push(duneLift([[x-tx*k,y-ty*k],[x+bx,y+by],[x+tx*k,y+ty*k]]));}
 DUNE.tuft=[];for(const B of HUMS)for(const [hx,hy,,hh] of B)if(hh>3.2)DUNE.tuft.push([hx,hy-liftAt(hx,hy)]);
 DUNE.v=null;DUNE.done=true;return true;}
function duneLift(pts){return pts.map(([x,y])=>[x,y-liftAt(x,y)]);}
/* marching squares, chained into polylines; saddles split by the centre value; two passes of corner cutting smooth them */
function duneTrace(v,n,L){const P={},segs=[],pt=(id,x0,y0,x1,y1,a,b)=>{if(!P[id]){const t=(L-a)/(b-a);P[id]=[x0+(x1-x0)*t,y0+(y1-y0)*t];}return id;};
 for(let j=0;j<n-1;j++)for(let i=0;i<n-1;i++){const tl=v[j*n+i],tr=v[j*n+i+1],br=v[(j+1)*n+i+1],bl=v[(j+1)*n+i];const c=(tl>L?8:0)|(tr>L?4:0)|(br>L?2:0)|(bl>L?1:0);if(c===0||c===15)continue;
  const X=-DNR+i*DNG,Y=-DNR+j*DNG,T=()=>pt('h'+(j*n+i),X,Y,X+DNG,Y,tl,tr),R=()=>pt('v'+(j*n+i+1),X+DNG,Y,X+DNG,Y+DNG,tr,br),B=()=>pt('h'+((j+1)*n+i),X,Y+DNG,X+DNG,Y+DNG,bl,br),Lf=()=>pt('v'+(j*n+i),X,Y,X,Y+DNG,tl,bl);
  const mid=(tl+tr+br+bl)/4>L,s=(a,b)=>segs.push([a(),b()]);
  switch(c){case 1:case 14:s(Lf,B);break;case 2:case 13:s(B,R);break;case 3:case 12:s(Lf,R);break;case 4:case 11:s(T,R);break;case 6:case 9:s(T,B);break;case 7:case 8:s(T,Lf);break;
   case 5:if(mid){s(T,Lf);s(B,R);}else{s(T,R);s(Lf,B);}break;case 10:if(mid){s(T,R);s(Lf,B);}else{s(T,Lf);s(B,R);}break;}}
 const at={};segs.forEach((g,k)=>{for(const e of g)(at[e]=at[e]||[]).push(k);});const used=new Uint8Array(segs.length),out=[];
 for(let k=0;k<segs.length;k++){if(used[k])continue;used[k]=1;const ch=[segs[k][0],segs[k][1]];
  for(let dir=0;dir<2;dir++){for(;;){const e=dir?ch[0]:ch[ch.length-1],nx=(at[e]||[]).find(q=>!used[q]);if(nx==null)break;used[nx]=1;const o=segs[nx][0]===e?segs[nx][1]:segs[nx][0];if(dir)ch.unshift(o);else ch.push(o);}}
  if(ch.length<5)continue;const closed=ch[0]===ch[ch.length-1];let p=ch.map(e=>P[e]);if(closed)p.pop();
  for(let it=0;it<2;it++){const q=[],m=p.length;for(let a=0;a<(closed?m:m-1);a++){const A=p[a],Bq=p[(a+1)%m];q.push([A[0]*.75+Bq[0]*.25,A[1]*.75+Bq[1]*.25],[A[0]*.25+Bq[0]*.75,A[1]*.25+Bq[1]*.75]);}p=q;}
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const lp=duneLift(p);for(const [x,y] of lp){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}out.push({p:lp,closed,b:[x0,y0,x1,y1]});}
 return out;}
function drawDunes(vw,vh){if(SH.on||!DUNE.done)return;const inView=b=>b[2]>cam.x-vw&&b[0]<cam.x+vw&&b[3]>cam.y-vh&&b[1]<cam.y+vh;
 const path=(list,close)=>{ctx.beginPath();for(const D of list){if(!inView(D.b))continue;const p=D.p;ctx.moveTo(p[0][0],p[0][1]);for(let k=1;k<p.length;k++)ctx.lineTo(p[k][0],p[k][1]);if(close&&D.closed)ctx.closePath();}};
 ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 /* the body: a warmer sand, so a dune shows on any light */
 path(DUNE.lo,true);ctx.fillStyle='rgba(214,170,82,.32)';ctx.fill('evenodd');ctx.strokeStyle='rgba(42,33,64,.42)';ctx.lineWidth=1.7;ctx.stroke();
 /* near the top: a faint line, and the top a touch lighter where the sun bleaches it */
 path(DUNE.hi,true);ctx.fillStyle='rgba(255,246,214,.22)';ctx.fill('evenodd');ctx.strokeStyle='rgba(42,33,64,.18)';ctx.lineWidth=1.2;ctx.stroke();
 ctx.strokeStyle='rgba(150,112,50,.5)';ctx.lineWidth=1.3;ctx.beginPath();for(const r of DUNE.rip){if(Math.abs(r[1][0]-cam.x)>vw||Math.abs(r[1][1]-cam.y)>vh)continue;ctx.moveTo(r[0][0],r[0][1]);ctx.quadraticCurveTo(r[1][0],r[1][1],r[2][0],r[2][1]);}ctx.stroke();
 ctx.restore();
 for(const [x,y] of DUNE.tuft){if(Math.abs(x-cam.x)>vw||Math.abs(y-cam.y)>vh)continue;ln([[x-6,y-7],[x-1,y],[x+1,y-9],[x+2,y],[x+7,y-6]],(x*7|0)&1023,2,'#5a9a3f',.6);}}
