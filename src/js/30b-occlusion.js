/* ---------- the Key's ground as one lifted surface ----------
   The ground is painted point by point into a cached image, every point already lifted by its height, back to
   front (north to south) so nearer ground covers what it stands in front of: a painter's pass per column of the
   image. Alongside the colours it keeps, for every pixel, the world y of the ground seen there (KS.fy), which
   answers "what is in front" for taps, shading and occlusion. Ink lines (the coast, the grass edge, crests that
   hide ground) are traced from the image as smooth vector lines, so they stay crisp at any coast shape. Until the
   image is built (a few columns a frame, nearest first) the old flat outlines stand in. Forest islands come later. */
const KS={x0:-1200,y0:-1500,res:2,w:1200,h:1350,done:0,cols:null,fy:null,mat:null,cv:null,ink:null,order:null};
function ksInit(){KS.fy=new Float32Array(KS.w*KS.h).fill(NaN);KS.mat=new Uint8Array(KS.w*KS.h);KS.cv=document.createElement('canvas');KS.cv.width=KS.w;KS.cv.height=KS.h;KS.im=KS.cv.getContext('2d').createImageData(KS.w,KS.h);
 const cx=Math.round((P.x-KS.x0)/KS.res),o=[];for(let i=0;i<KS.w;i++)o.push(i);o.sort((a,b)=>Math.abs(a-cx)-Math.abs(b-cx));KS.order=o;KS.done=0;}
function ksColumn(i){const R=KS.res,x=KS.x0+i*R+R/2,W2=KS.w,D=KS.im.data;let prev=null;
 for(let y=-1200;y<=1200;y+=1.5){const r=Math.hypot(x,y),a=Math.atan2(y,x);if(r>iR(a)){prev=null;continue;}
  const L=liftAt(x,y),m=keyMat(x,y,L/LKs()),s=y-L,row=(s-KS.y0)/R,pr=prev===null?row:prev,py=prev===null?y:y-1;prev=row;
  /* fill every image row between the last sample and this one, with the ground y interpolated across them */
  const r0=Math.min(pr,row),r1=Math.max(pr,row);
  for(let j=Math.max(0,Math.floor(r0));j<=Math.min(KS.h-1,Math.ceil(r1));j++){const k=j*W2+i,t=r1>r0?(j+.5-pr)/(row-pr):1;KS.fy[k]=Math.max(py,Math.min(y,py+(y-py)*t));KS.mat[k]=m;const o=k*4,c=KCOL[m];D[o]=c[0];D[o+1]=c[1];D[o+2]=c[2];D[o+3]=255;}}}
/* sand, grass, scrub, cloud-forest floor, summit rock */
const KCOL=[null,[243,210,122],[134,194,94],[168,182,102],[96,148,94],[184,177,156]];
function ksBuild(budgetMs){if(!KS.fy)ksInit();if(KS.done>=KS.w)return true;const t0=performance.now();
 while(KS.done<KS.w&&performance.now()-t0<budgetMs){ksColumn(KS.order[KS.done]);KS.done++;}
 if(KS.done>=KS.w){ksSoften();KS.cv.getContext('2d').putImageData(KS.im,0,0);KS.ink=ksTrace();KS.im=null;return true;}return false;}
/* soften the edges between ground colours (the image is 2px a pixel): average each edge pixel with its neighbours */
function ksSoften(){const W2=KS.w,H2=KS.h,D=KS.im.data,M=KS.mat,out=new Uint8ClampedArray(D);for(let j=1;j<H2-1;j++)for(let i=1;i<W2-1;i++){const k=j*W2+i,m=M[k];if(!m)continue;
 if(M[k-1]===m&&M[k+1]===m&&M[k-W2]===m&&M[k+W2]===m)continue;let r=0,g=0,b=0,n=0;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const q=k+dj*W2+di;if(!M[q])continue;const o=q*4;r+=D[o];g+=D[o+1];b+=D[o+2];n++;}const o=k*4;out[o]=r/n;out[o+1]=g/n;out[o+2]=b/n;}D.set(out);}
/* what ground is seen at a lifted point: its world y, or null for water */
function ksFront(x,s){if(!KS.ink)return undefined;const i=Math.floor((x-KS.x0)/KS.res),j=Math.floor((s-KS.y0)/KS.res);if(i<0||j<0||i>=KS.w||j>=KS.h)return null;const v=KS.fy[j*KS.w+i];return isNaN(v)?null:v;}
/* ink: marching squares on land and grass fields, chained into polylines; crests from jumps in the seen y */
function ksTrace(){const W2=KS.w,H2=KS.h,R=KS.res,X=i=>KS.x0+i*R+R/2,Y=j=>KS.y0+j*R+R/2;
 const iso=f=>{const segs=[];for(let j=0;j<H2-1;j++)for(let i=0;i<W2-1;i++){const a=f(i,j),b=f(i+1,j),c=f(i+1,j+1),d=f(i,j+1),n=a+b*2+c*4+d*8;if(n===0||n===15)continue;
   const T=[X(i)+R/2,Y(j)],Rr=[X(i+1),Y(j)+R/2],B=[X(i)+R/2,Y(j+1)],L=[X(i),Y(j)+R/2],tab={1:[[L,T]],2:[[T,Rr]],3:[[L,Rr]],4:[[Rr,B]],5:[[L,T],[Rr,B]],6:[[T,B]],7:[[L,B]],8:[[B,L]],9:[[B,T]],10:[[T,Rr],[B,L]],11:[[B,Rr]],12:[[Rr,L]],13:[[Rr,T]],14:[[T,L]]}[n];for(const q of tab)segs.push(q);}
  return chain(segs);};
 const land=(i,j)=>KS.mat[j*W2+i]>0?1:0,grass=(i,j)=>KS.mat[j*W2+i]>=2?1:0;
 const crestPts=[];for(let i=0;i<W2;i+=2)for(let j=1;j<H2;j++){const u=KS.fy[(j-1)*W2+i],v=KS.fy[j*W2+i];if(!isNaN(u)&&!isNaN(v)&&u<v-10)crestPts.push([X(i),Y(j)]);}
 const crests=[];{const byX=new Map();for(const p of crestPts){const k=p[0];if(!byX.has(k))byX.set(k,[]);byX.get(k).push(p[1]);}let prev=[];for(const x of [...byX.keys()].sort((a,b)=>a-b)){const now2=[];for(const y of byX.get(x)){const p=prev.find(q=>Math.abs(q.y-y)<8&&x-q.x<=8);const run=p?p.run:[];run.push([x,y]);if(!p)crests.push(run);now2.push({x,y,run});}prev=now2;}}
 return {coast:iso(land),grass:iso(grass),crests:crests.filter(r=>r.length>=5)};}
function chain(segs){const key=p=>Math.round(p[0]*2)+','+Math.round(p[1]*2),adj=new Map();segs.forEach((s,n)=>{for(const e of [0,1]){const k=key(s[e]);if(!adj.has(k))adj.set(k,[]);adj.get(k).push(n);}});
 const used=new Uint8Array(segs.length),out=[];
 for(let n=0;n<segs.length;n++){if(used[n])continue;used[n]=1;const line=[segs[n][0],segs[n][1]];
  for(const dir of [1,0]){for(;;){const end=dir?line[line.length-1]:line[0],c=(adj.get(key(end))||[]).find(m=>!used[m]);if(c===undefined)break;used[c]=1;const s=segs[c],nx=key(s[0])===key(end)?s[1]:s[0];if(dir)line.push(nx);else line.unshift(nx);}}
  if(line.length>=4)out.push(line.filter((p,i)=>i%2===0||i===line.length-1));}
 return out;}
/* drawing the Key's ground: the surface image, then the ink. Fallback: build 23's outlines */
function drawLandKey(outline){if(!ksBuild(10)){sketch(sandPts,true,1,4,'#f3d27a',outline,3.5);sketch(grassLifted(),true,2,4,'#86c25e',INK,3);return;}
 ctx.imageSmoothingEnabled=true;ctx.drawImage(KS.cv,KS.x0,KS.y0,KS.w*KS.res,KS.h*KS.res);
 const I=KS.ink,ink=(runs,col,lw)=>{for(const r of runs)sketch(r,r.length>8&&Math.hypot(r[0][0]-r[r.length-1][0],r[0][1]-r[r.length-1][1])<6,r.length,1.2,null,col,lw);};
 ink(I.grass,INK,3);ink(I.coast,outline,3.5);ctx.globalAlpha=.55;ink(I.crests,INK,2.2);ctx.globalAlpha=1;}
/* occlusion: the ground seen in front of a thing hides the part of it drawn below that ground's edge */
function occludedBy(x,y){if(SH.on||!KS.ink)return null;const base=y-liftAt(x,y);let hz=null;
 for(const dx of [-6,0,6])for(let s=base;s>=base-maxLift();s-=2){const f=ksFront(x+dx,s);if(f!=null&&f>y+3){if(hz===null||s<hz)hz=s;}}return hz!==null&&hz<base-2?hz:null;}
const OC=document.createElement('canvas'),ocx=OC.getContext('2d');
function drawOcc(x,y,fn,soft){const L=liftAt(x,y),hz=occludedBy(x,y);
 if(hz===null){if(L){ctx.save();ctx.translate(0,-L);fn();ctx.restore();}else fn();return;}
 ctx.save();ctx.translate(0,-L);ctx.beginPath();ctx.rect(x-400,hz+L-2000,800,2000);ctx.clip();fn();ctx.restore();
 if(!soft)return;
 /* the hidden part as a soft ink silhouette: draw the thing offscreen, tint it ink, lay it down below the ground edge */
 if(OC.width!==cv.width||OC.height!==cv.height){OC.width=cv.width;OC.height=cv.height;}
 const T=ctx.getTransform(),keep=ctx;ocx.setTransform(1,0,0,1,0,0);ocx.globalCompositeOperation='source-over';ocx.clearRect(0,0,OC.width,OC.height);ocx.setTransform(T);ocx.translate(0,-L);ctx=ocx;try{fn();}finally{ctx=keep;}
 ocx.setTransform(1,0,0,1,0,0);ocx.globalCompositeOperation='source-in';ocx.fillStyle='rgb(42,33,64)';ocx.fillRect(0,0,OC.width,OC.height);ocx.globalCompositeOperation='source-over';
 const sy=((hz-cam.y)*Z+H/2)*DPR;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.beginPath();ctx.rect(0,sy,cv.width,cv.height-sy);ctx.clip();
 ctx.globalAlpha=.3;ctx.drawImage(OC,0,0);const o=1.5*DPR;ctx.globalAlpha=.22;for(const [dx,dy] of [[o,0],[-o,0],[0,o],[0,-o]])ctx.drawImage(OC,dx,dy);ctx.restore();}
function softFn(fn){return fn===drawSwimmer||fn===drawCrab||fn===drawGull||fn===drawGubbins||fn===drawKindle;}
