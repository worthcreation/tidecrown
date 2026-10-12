/* ---------- terrain height ----------
   A height field per scene, a pure function of place, nothing saved. Heights are in world pixels of rise.
   The Key stays small: low dunes along the sand and one low rise inland, where the stone head sits.
   The dark islands each get their own landform: the Thicket rolls, the Tangle runs in ravines, the Far Grove has
   the tallest hill (a lookout), the Clearing is a shallow bowl, the Fallow a sunken basin, the Hollow a real hollow.
   Drawn as soft contour lines plus hillshade from the sun (slopes facing away stay shaded and the shade swings
   through the day). Walking speed follows Tobler's hiking function. Valleys hold fog; high ground sees farther.
   No impassable ground yet: cliffs and scree wait for Climbing. */
const gs=(x,y,cx,cy,r,h)=>h*Math.exp(-((x-cx)**2+(y-cy)**2)/(2*r*r));
function hKey(x,y){const r=Math.hypot(x,y),a=Math.atan2(y,x),g=gR(a),i=iR(a);if(r>i)return 0;let h=0;
 if(r>g&&r<i){const t=(r-g)/(i-g);h+=10*Math.sin(t*Math.PI)*(.6+.4*Math.sin(a*13+1.3));}
 else if(r<=g)h+=4*Math.max(0,1-(g-r)/40);
 h+=gs(x,y,HEAD.x,HEAD.y,170,34);return h;}
function hShadow(x,y){let best=null,bk=9;for(const I of ISLES){const k=isleK(I,x,y);if(k<bk){bk=k;best=I;}}if(!best||bk>1)return 0;
 const I=best,f=Math.min(1,(1-bk)/.25),n=I.name,cx=I.x,cy=I.y,m=Math.min(I.rx,I.ry);let h;
 if(n==='The Thicket')h=18+gs(x,y,cx-I.rx*.35,cy-I.ry*.2,m*.32,34)+gs(x,y,cx+I.rx*.3,cy+I.ry*.15,m*.28,30)+gs(x,y,cx,cy+I.ry*.4,m*.25,22);
 else if(n==='The Tangle')h=10+30*Math.abs(Math.sin(x/110+Math.sin(y/140)));
 else if(n==='The Far Grove')h=8+gs(x,y,cx,cy,m*.42,90);
 else if(n==='The Clearing')h=6+14*Math.min(1,bk);
 else if(n==='The Fallow')h=-30*(1-bk);
 else h=8+10*Math.sin(x/180)*Math.cos(y/220);
 if(typeof HOLLOW!=='undefined')h+=gs(x,y,HOLLOW.x,HOLLOW.y,200,-40);
 return h*f;}
function terrH(x,y){return SH.on?hShadow(x,y):hKey(x,y);}
/* grid cache per scene for drawing: heights on a 20px grid, contour segments bucketed */
const TG=20,TCACHE={};let TSC=null,TSX=null;
function tgrid(){const key=SH.on?'sh':'key';if(TCACHE[key])return TCACHE[key];
 let x0,x1,y0,y1;if(SH.on){x0=1e9;y0=1e9;x1=-1e9;y1=-1e9;for(const I of ISLES){x0=Math.min(x0,I.x-I.rx*1.2);x1=Math.max(x1,I.x+I.rx*1.2);y0=Math.min(y0,I.y-I.ry*1.2);y1=Math.max(y1,I.y+I.ry*1.2);}}else{x0=y0=-720;x1=y1=720;}
 x0=Math.floor(x0/TG)*TG;y0=Math.floor(y0/TG)*TG;const nx=Math.ceil((x1-x0)/TG)+1,ny=Math.ceil((y1-y0)/TG)+1,h=new Float32Array(nx*ny);
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)h[j*nx+i]=SH.on?hShadow(x0+i*TG,y0+j*TG):hKey(x0+i*TG,y0+j*TG);
 const seg=new Map(),add=(ax,ay,bx,by)=>{const k=Math.floor(ax/400)+','+Math.floor(ay/400);let a=seg.get(k);if(!a)seg.set(k,a=[]);a.push(ax,ay,bx,by);};
 for(let L=-40;L<=100;L+=10){if(L===0)continue;for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=h[j*nx+i],b=h[j*nx+i+1],c=h[(j+1)*nx+i+1],d=h[(j+1)*nx+i];
  const pts=[],X=x0+i*TG,Y=y0+j*TG,e=(p,q)=>(L-p)/(q-p);
  if((a<L)!==(b<L))pts.push([X+e(a,b)*TG,Y]);if((b<L)!==(c<L))pts.push([X+TG,Y+e(b,c)*TG]);if((d<L)!==(c<L))pts.push([X+e(d,c)*TG,Y+TG]);if((a<L)!==(d<L))pts.push([X,Y+e(a,d)*TG]);
  if(pts.length>=2)add(pts[0][0],pts[0][1],pts[1][0],pts[1][1]);if(pts.length===4)add(pts[2][0],pts[2][1],pts[3][0],pts[3][1]);}}
 return TCACHE[key]={x0,y0,nx,ny,h,seg};}
function drawTerrain(vw,vw2){const G=tgrid(),vh=vw2;const i0=Math.max(0,Math.floor((cam.x-vw-G.x0)/TG)),i1=Math.min(G.nx-2,Math.ceil((cam.x+vw-G.x0)/TG)),j0=Math.max(0,Math.floor((cam.y-vh-G.y0)/TG)),j1=Math.min(G.ny-2,Math.ceil((cam.y+vh-G.y0)/TG));
 /* hillshade: one pixel per grid cell in a small canvas, drawn scaled up with smoothing so it reads as soft light */
 const sun=SKY.sun;if(sun){const el=Math.atan(1/sun.k),ce=Math.cos(el),se=Math.sin(el),lx=-sun.dx*ce,ly=-sun.dy*ce,str=Math.min(1,sun.a/.24),w=i1-i0+1,hh=j1-j0+1;
  if(w>0&&hh>0){if(!TSC||TSC.width<w||TSC.height<hh){TSC=document.createElement('canvas');TSC.width=w+20;TSC.height=hh+20;TSX=TSC.getContext('2d');}
   const im=TSX.createImageData(w,hh),D=im.data;let any=false;
   for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const a=G.h[j*G.nx+i];if(a===0)continue;const gx=(G.h[j*G.nx+i+1]-a)/TG,gy=(G.h[(j+1)*G.nx+i]-a)/TG;
    const nl=Math.hypot(gx,gy,1),dlt=((-gx*lx-gy*ly+se)/nl-se)*str,o=((j-j0)*w+(i-i0))*4;
    if(dlt<-.01){D[o]=42;D[o+1]=33;D[o+2]=64;D[o+3]=Math.min(.32,-dlt*1.4)*255;any=true;}else if(dlt>.01){D[o]=255;D[o+1]=248;D[o+2]=220;D[o+3]=Math.min(.18,dlt*.9)*255;any=true;}}
   if(any){TSX.clearRect(0,0,TSC.width,TSC.height);TSX.putImageData(im,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(TSC,0,0,w,hh,G.x0+i0*TG+TG/2,G.y0+j0*TG+TG/2,w*TG,hh*TG);}}}
 ctx.globalAlpha=1;ctx.strokeStyle='rgba(42,33,64,.13)';ctx.lineWidth=1.3;ctx.beginPath();
 for(let bx=Math.floor((cam.x-vw)/400);bx<=Math.floor((cam.x+vw)/400);bx++)for(let by=Math.floor((cam.y-vh)/400);by<=Math.floor((cam.y+vh)/400);by++){const s=G.seg.get(bx+','+by);if(!s)continue;for(let k=0;k<s.length;k+=4){ctx.moveTo(s[k],s[k+1]);ctx.lineTo(s[k+2],s[k+3]);}}
 ctx.stroke();}
/* Tobler: speed = 6 exp(-3.5 |slope + 0.05|) km/h, fastest on a gentle downhill; scaled so flat ground is 1 */
function slopeK(x,y,ux,uy){const s=(terrH(x+ux*6,y+uy*6)-terrH(x,y))/6;return Math.max(.35,Math.min(1.2,Math.exp(-3.5*Math.abs(s+.05))/Math.exp(-.175)));}
function hillZoom(){return 1/(1+Math.max(0,terrH(P.x,P.y))/520);}
