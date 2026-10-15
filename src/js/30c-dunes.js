/* ---------- dunes drawn as ink (build 39) ----------
   The sand is clean flat colour, so each dune reads by its own shape: the dune field alone (duneAt, 30-terrain) is
   sampled on an 8px grid once, traced with marching squares into smooth closed outlines at two heights, and drawn
   lifted onto the ground: a warm body with an ink outline, a faint inner line near the top, wind ripples on the backs,
   and a grass tuft on each hummock where a plant caught the sand. Nothing saved; built a few ms a frame after the
   height cache, while the title shows. */
const DNG=8,DNR=1150,DUNE={row:0,v:null,n:0,done:false,lo:null,hi:null,rip:null,tuft:null,act:null,sh:null,shKey:null,shJob:null};
function duneBuild(ms){if(DUNE.done)return true;const n=DUNE.n||(DUNE.n=Math.ceil(2*DNR/DNG)+1);if(!DUNE.v)DUNE.v=new Float32Array(n*n);const t0=performance.now(),v=DUNE.v;
 while(DUNE.row<n&&performance.now()-t0<ms){const j=DUNE.row,y=-DNR+j*DNG;for(let i=0;i<n;i++){const x=-DNR+i*DNG,r=Math.hypot(x,y),a=Math.atan2(y,x),ir=iR(a);v[j*n+i]=r>ir||ir-r>beachFB(a)+140?0:duneAD(x,y,a,ir-r);}DUNE.row++;}
 if(DUNE.row<n)return false;
 DUNE.lo=duneTrace(v,n,2.4);DUNE.hi=duneTrace(v,n,6.5);
 /* wind ripples: short strokes along the contour on the dune backs, a few per dune */
 DUNE.rip=[];for(let j=1;j<n-1;j+=2)for(let i=1;i<n-1;i+=2){const h=v[j*n+i];if(h<3.2||hash1(j*977+i*31)>.16)continue;const gx=v[j*n+i+1]-v[j*n+i-1],gy=v[(j+1)*n+i]-v[(j-1)*n+i],gl=Math.hypot(gx,gy);if(gl<.4)continue;
  const tx=-gy/gl,ty=gx/gl,x=-DNR+i*DNG,y=-DNR+j*DNG,k=7,bx=gx/gl*2,by=gy/gl*2;DUNE.rip.push(duneLift([[x-tx*k,y-ty*k],[x+bx,y+by],[x+tx*k,y+ty*k]]));}
 DUNE.tuft=[];for(const B of HUMS)for(const [hx,hy,,hh] of B)if(hh>3.2)DUNE.tuft.push([hx,hy-liftAt(hx,hy)]);
 DUNE.act=duneActive(v,n);DUNE.done=true;return true;}
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
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const lp=duneLift(p);for(const [x,y] of lp){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}/* too small to read as a dune: no outline or shade (a hummock keeps its tuft) */if(closed&&Math.max(x1-x0,y1-y0)<14)continue;out.push({p:lp,closed,b:[x0,y0,x1,y1]});}
 return out;}
/* cells on or near a dune (within 80px), the only ones the light needs to look at */
function duneActive(v,n){const R=10,out=[],mark=new Uint8Array(n*n);for(let j=0;j<n;j++)for(let i=0;i<n;i++){if(v[j*n+i]<.3)continue;for(let b=Math.max(0,j-R);b<=Math.min(n-1,j+R);b++)for(let a=Math.max(0,i-R);a<=Math.min(n-1,i+R);a++){const c=b*n+a;if(!mark[c]){mark[c]=1;out.push(c);}}}return out;}
/* the shade (build 40): where a dune's face turns from the sun more steeply than the sun stands (self-shade), plus
   where a taller dune stands between a spot and a low sun (cast), traced as one smooth flat shape. Heights are in
   units of about 2.4px, so a slope in units per px is multiplied by 2.4 to compare with the sun's elevation. At high
   sun the test is capped so the steepest faces always keep a sliver: a dune reads at any hour. Re-traced when the
   sun has moved, a few ms a frame. */
function duneShadeTick(){const sun=SKY.sun;if(!sun||SH.on){DUNE.sh=null;DUNE.shKey=null;DUNE.shJob=null;return;}
 const key=Math.round(Math.atan2(sun.dy,sun.dx)*30)+':'+Math.round(Math.min(5,sun.k)*12);
 if(!DUNE.shJob&&key!==DUNE.shKey)DUNE.shJob={key,dx:sun.dx,dy:sun.dy,tn:Math.min(1.1,1/Math.max(.2,sun.k)),k:sun.k,g:new Float32Array(DUNE.n*DUNE.n).fill(-9),i:0};
 const J=DUNE.shJob;if(!J)return;const v=DUNE.v,n=DUNE.n,act=DUNE.act,t0=performance.now(),dS=DNG,H=(x,y)=>{const fx=x/DNG,fy=y/DNG,i=fx|0,j=fy|0;if(i<0||j<0||i>=n-1||j>=n-1)return 0;const u=fx-i,w=fy-j,k=j*n+i;return(v[k]*(1-u)+v[k+1]*u)*(1-w)+(v[k+n]*(1-u)+v[k+n+1]*u)*w;};
 const tnC=1/Math.max(.2,J.k);/* the true elevation for cast shadows */
 while(J.i<act.length&&performance.now()-t0<3){for(let e=0;e<400&&J.i<act.length;e++,J.i++){const c=act[J.i],i=c%n,j=(c-i)/n;if(i<1||j<1||i>=n-1||j>=n-1)continue;const h0=v[c];
  let g=-9;if(h0>2.4){const gx=(v[c+1]-v[c-1])/(2*dS),gy=(v[c+n]-v[c-n])/(2*dS),down=-(gx*J.dx+gy*J.dy)*2.4;g=down-J.tn;}
  /* cast: march toward the sun */if(tnC<1.4){const x=i*DNG,y=j*DNG;for(let s=8;s<=72;s+=8){const o=H(x-J.dx*s,y-J.dy*s)-(h0+s*tnC/2.4);if(o>.6){g=Math.max(g,.2);break;}}}
  J.g[c]=g;}}
 if(J.i<act.length)return;DUNE.sh=duneTrace(J.g,n,0);DUNE.shKey=J.key;DUNE.shJob=null;}
/* lost and found edges: each piece of outline is weighed by how much it faces the shade side or the viewer (ink),
   or the sun (no line at all); in between it is a warm brown */
function edgeBuckets(list){const sun=SKY.sun,out=[[],[],[]];for(const D of list){if(!D.closed)continue;const p=D.p,m=p.length;let A=0;for(let k=0;k<m;k++){const a=p[k],b=p[(k+1)%m];A+=a[0]*b[1]-b[0]*a[1];}const sg=A>0?1:-1;
  for(let k=0;k<m;k++){const a=p[k],b=p[(k+1)%m],ex=b[0]-a[0],ey=b[1]-a[1],el=Math.hypot(ex,ey)||1,nx=ey/el*sg,ny=-ex/el*sg;
   const w=sun?Math.max(nx*sun.dx+ny*sun.dy,ny*.85):ny*.85;out[w>.4?0:w>-.15?1:2].push(a,b);}}
 return out;}
function drawDunes(vw,vh){if(SH.on||!DUNE.done)return;duneShadeTick();const inView=b=>b[2]>cam.x-vw&&b[0]<cam.x+vw&&b[3]>cam.y-vh&&b[1]<cam.y+vh;
 const vis=l=>(l||[]).filter(D=>inView(D.b)),path=(list)=>{ctx.beginPath();for(const D of list){const p=D.p;ctx.moveTo(p[0][0],p[0][1]);for(let k=1;k<p.length;k++)ctx.lineTo(p[k][0],p[k][1]);if(D.closed)ctx.closePath();}};
 const lo=vis(DUNE.lo),hi=vis(DUNE.hi),sh=vis(DUNE.sh),sun=SKY.sun,sa=sun?Math.min(1,sun.a/.24):0;
 ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 /* a whisper of warmer sand, so the form has a body even at noon */
 path(lo);ctx.fillStyle='rgba(214,170,82,.12)';ctx.fill('evenodd');
 /* the shade, one flat tone like every shadow */
 if(sh.length&&sa>0){path(sh);ctx.fillStyle=`rgba(42,33,64,${(.17*sa).toFixed(3)})`;ctx.fill('evenodd');}
 /* the sunlit crest */
 if(sun&&sa>.2){const b=edgeBuckets(hi);ctx.strokeStyle=`rgba(255,248,225,${(.75*sa).toFixed(3)})`;ctx.lineWidth=1.6;ctx.beginPath();for(let k=0;k<b[2].length;k+=2){ctx.moveTo(b[2][k][0],b[2][k][1]);ctx.lineTo(b[2][k+1][0],b[2][k+1][1]);}ctx.stroke();}
 /* the outline, found on the shade side and the base, lost toward the sun */
 const B=edgeBuckets(lo),seg=(L,col,w)=>{if(!L.length)return;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();for(let k=0;k<L.length;k+=2){ctx.moveTo(L[k][0],L[k][1]);ctx.lineTo(L[k+1][0],L[k+1][1]);}ctx.stroke();};
 seg(B[1],'rgba(150,112,50,.18)',1.1);seg(B[0],'rgba(42,33,64,.2)',1.4);
 ctx.strokeStyle='rgba(150,112,50,.45)';ctx.lineWidth=1.2;ctx.beginPath();for(const r of DUNE.rip){if(Math.abs(r[1][0]-cam.x)>vw||Math.abs(r[1][1]-cam.y)>vh)continue;ctx.moveTo(r[0][0],r[0][1]);ctx.quadraticCurveTo(r[1][0],r[1][1],r[2][0],r[2][1]);}ctx.stroke();
 ctx.restore();
 for(const [x,y] of DUNE.tuft){if(Math.abs(x-cam.x)>vw||Math.abs(y-cam.y)>vh)continue;ln([[x-6,y-7],[x-1,y],[x+1,y-9],[x+2,y],[x+7,y-6]],(x*7|0)&1023,2,'#5a9a3f',.6);}}
