/* ---------- terrain height ----------
   A height field per scene, a pure function of place, nothing saved. Heights are in world pixels of rise.
   The Key stays small: low dunes along the sand and one low rise inland, where the stone head sits.
   The dark islands each get their own landform: the Thicket rolls, the Tangle runs in ravines, the Far Grove has
   the tallest hill (a lookout), the Clearing is a shallow bowl, the Fallow a sunken basin, the Hollow a real hollow.
   Drawn as faint survey contours plus smooth cached shading (sky light, sun, hill shadows, height tint). Walking speed follows Tobler's hiking function. Valleys hold fog; high ground sees farther.
   No impassable ground yet: cliffs and scree wait for Climbing. */
const gs=(x,y,cx,cy,r,h)=>h*Math.exp(-((x-cx)**2+(y-cy)**2)/(2*r*r));
/* the Key, as real beach dunes: flat wet beach, a foredune ridge along the shore (steep sea face, gentle back
   slope), a low swale behind it, then the grass plain; the ridge's height wanders along the shore and drops to a
   blowout where the wind has scooped a gap. One smooth knoll inland, under the stone head. No steps anywhere. */
const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
/* the Key is a small high island: a beach and a modest foredune, then land climbing steadily to a summit about
   four character heights up (HILL), steeper on the windward east, gentler and wider on the lee west; the stone
   head on a smaller western shoulder; a spring-fed pool on a level patch of the slope; Brimble's camp on a level
   shelf on the upper lee shoulder, just under the cloud belt where the wobble trees grow. */
const KPEAK=66,CLO=34,CHI=62;
function hKeyBase(x,y){const r=Math.hypot(x,y),a=Math.atan2(y,x),i=iR(a);if(r>i)return 0;const d=i-r;
 const Hc=(4+2*Math.sin(a*3+.7)+1.5*Math.sin(a*7+2))*(1-.6*Math.exp(-((angDiff(a,.9))**2)/.012));
 let h=Hc*ss(10,34,d)-Hc*.5*ss(34,60,d);
 const sx=x-HILL.x,sy=y-HILL.y,ds=Math.hypot(sx,sy),as=Math.atan2(sy,sx),R=Math.max(120,iR(as)-Math.cos(as)*HILL.x*0-0)+30,q=Math.min(1,ds/R),e=1.7-.55*Math.cos(as);
 h+=KPEAK*Math.pow(1-q,e)*ss(6,60,d);
 h+=gs(x,y,HEAD.x,HEAD.y,120,12)*ss(0,60,d);
 return h;}
const flatAt=(x,y,cx,cy,r0,r1,H)=>{const cr=Math.hypot(x-cx,y-cy);return cr<r1?1-ss(r0,r1,cr):0;};
let SHELF=null,POOLH=null;
function hKey(x,y){let h=hKeyBase(x,y);if(h===0)return 0;
 if(SHELF===null){SHELF=hKeyBase(FIRE.x,FIRE.y);POOLH=hKeyBase(POOL.x,POOL.y)-3;}
 let k=flatAt(x,y,FIRE.x,FIRE.y,50,80);if(k)h=h*(1-k)+SHELF*k;
 k=flatAt(x,y,POOL.x,POOL.y,45,75);if(k)h=h*(1-k)+POOLH*k;
 return h;}
/* the wobble trees live only in the fog belt on the upper slopes (a little cloud forest where the summit's cloud
   cap touches); palms grow on the sand, thickest on the lee; grass tufts only where there is grass */
{const r=mulberry(77);trees.length=0;let tries=0;while(trees.length<18&&tries<4000){tries++;const a=r()*6.2832,d=Math.sqrt(r())*220,x=HILL.x+Math.cos(a)*d,y=HILL.y+Math.sin(a)*d,h=hKey(x,y);
  if(h<CLO+2||h>CHI-1)continue;if(Math.hypot(x-FIRE.x,y-FIRE.y)<85)continue;if(trees.some(t=>Math.hypot(t.x-x,t.y-y)<62))continue;
  trees.push({x,y,s:.8+r()*.4,seed:trees.length*31+3,lean:(r()-.5)*18,hue:r()});}}
const KPALMS=[];{const r=mulberry(91);let tries=0;const avoid=[[DOCK.x0,0],[SIGN.x,SIGN.y],[GULL.x,GULL.y],[BOLLARD.x,BOLLARD.y],[G.x,G.y],[HEAD.x,HEAD.y],[R0-80,24]];
 while(KPALMS.length<16&&tries<3000){tries++;const a=r()*6.2832,i=iR(a),west=Math.max(0,-Math.cos(a));if(r()>.35+.65*west)continue;const d=18+r()*(50+40*west),x=Math.cos(a)*(i-d),y=Math.sin(a)*(i-d);
  if(keyMat(x,y,hKey(x,y))!==1)continue;if(avoid.some(p=>Math.hypot(p[0]-x,p[1]-y)<70)||KPALMS.some(p=>Math.hypot(p.x-x,p.y-y)<55))continue;KPALMS.push({x,y,s:.9+r()*.35,seed:700+KPALMS.length*13});}}
for(let i=tufts.length-1;i>=0;i--){const t=tufts[i];if(keyMat(t.x,t.y,hKey(t.x,t.y))===1)tufts.splice(i,1);}
/* what grows where, by distance from the sea and by height: wide sand (widest on the lee), a scrub belt, grass on
   the slopes, the cloud-forest floor in the fog belt, open rock at the very top */
function keyMat(x,y,h){const r=Math.hypot(x,y),a=Math.atan2(y,x),d=iR(a)-r,sw=80+70*Math.max(0,-Math.cos(a))+10*Math.sin(a*5);
 if(d<sw||h<7)return 1;if(d<sw+30||h<13)return 3;if(h>=CHI)return 5;if(h>=CLO)return 4;return 2;}
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
/* the height lift: things on high ground are drawn higher on screen by their height, exaggerated to suit the
   world's sideways compression, (the foredune lifts about a character's height,
   the knoll about two). Where a ridge folds over the ground behind it, 30b-occlusion draws what is really seen. The
   ground's own edges, its shading, contours, shadows, objects and you all lift together; taps are mapped back
   down so a tap lands where you see it. LK is the exaggeration per scene. */
function LKs(){return SH.on?1.3:2.4;}
function liftAt(x,y){return terrH(x,y)*LKs();}
/* screen-lifted y back to the ground y under it: solve y - lift(x,y) = ys */
/* the viewer looks from the south, so where the lifted ground folds over a ridge the nearest (southmost) surface is
   the one seen: scan down from the highest possible lift for the first ground at or above this screen line, then
   refine. Simple iteration fails on steep faces (it oscillates into stripes). */
function maxLift(){return SH.on?140:175;}
function unlift(x,ys){if(!SH.on&&typeof KS!=='undefined'&&KS.ink){const f=ksFront(x,ys);return f==null?ys:f;}const f=y=>y-liftAt(x,y)-ys;let hi=ys+maxLift(),fh=f(hi);if(fh<=0)return hi;
 for(let y=hi-8;y>=ys-2;y-=8){const fy=f(y);if(fy<=0){let a=y,b=y+8;for(let i=0;i<5;i++){const m=(a+b)/2;if(f(m)<=0)a=m;else b=m;}return (a+b)/2;}}return ys;}
function liftPts(pts){return pts.map(p=>[p[0],p[1]-liftAt(p[0],p[1])]);}
let GRASS_L=null;function grassLifted(){return GRASS_L||(GRASS_L=liftPts(grassPts));}
/* contours: a coarse grid per scene, cached once; lines every CI units of height, every fifth one a little
   stronger, very faint so they read as a survey map under the paint. Only where the ground has shape. */
const TG=16,TCACHE={};let TSC=null;
function tgrid(){const key=SH.on?'sh':'key';if(TCACHE[key])return TCACHE[key];
 let x0,x1,y0,y1;if(SH.on){x0=1e9;y0=1e9;x1=-1e9;y1=-1e9;for(const I of ISLES){x0=Math.min(x0,I.x-I.rx*1.2);x1=Math.max(x1,I.x+I.rx*1.2);y0=Math.min(y0,I.y-I.ry*1.2);y1=Math.max(y1,I.y+I.ry*1.2);}}else{x0=y0=-720;x1=y1=720;}
 x0=Math.floor(x0/TG)*TG;y0=Math.floor(y0/TG)*TG;const nx=Math.ceil((x1-x0)/TG)+1,ny=Math.ceil((y1-y0)/TG)+1,h=new Float32Array(nx*ny);
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)h[j*nx+i]=SH.on?hShadow(x0+i*TG,y0+j*TG):hKey(x0+i*TG,y0+j*TG);
 const CI=SH.on?10:4,seg=[new Map(),new Map()],add=(m,ax,ay,bx,by)=>{const sa=ay-liftAt(ax,ay),sb=by-liftAt(bx,by);if(Math.abs(unlift(ax,sa)-ay)>4||Math.abs(unlift(bx,sb)-by)>4)return;ay=sa;by=sb;const k=Math.floor(ax/400)+','+Math.floor(ay/400);let a=m.get(k);if(!a)m.set(k,a=[]);a.push(ax,ay,bx,by);};
 for(let n=-8;n<=20;n++){const L=n*CI;if(L===0)continue;const m=seg[n%5===0?1:0];for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=h[j*nx+i],b=h[j*nx+i+1],c=h[(j+1)*nx+i+1],d=h[(j+1)*nx+i];
  const pts=[],X=x0+i*TG,Y=y0+j*TG,e=(p,q)=>(L-p)/(q-p);
  if((a<L)!==(b<L))pts.push([X+e(a,b)*TG,Y]);if((b<L)!==(c<L))pts.push([X+TG,Y+e(b,c)*TG]);if((d<L)!==(c<L))pts.push([X+e(d,c)*TG,Y+TG]);if((a<L)!==(d<L))pts.push([X,Y+e(a,d)*TG]);
  if(pts.length>=2)add(m,pts[0][0],pts[0][1],pts[1][0],pts[1][1]);if(pts.length===4)add(m,pts[2][0],pts[2][1],pts[3][0],pts[3][1]);}}
 return TCACHE[key]={seg};}
/* shading tiles: 384px of world each, 4px a cell, heights from the formula (smooth, no stamps). Each tile's image
   is redrawn only when the sun has moved noticeably, a couple of tiles per frame at most.
   The light: a soft sky from above (valleys and the foot of slopes a touch darker all day), the sun on top (sides
   lit and shaded, strongest morning and evening), hills casting long soft shadows when the sun is low, and a faint
   tint by height (higher a shade warmer and drier, lower a shade cooler). */
const TT=384,TR=4,TN=TT/TR,TTILES={};let tBudget=0;
function sunKey(){const s=SKY.sun;return s?Math.round(Math.atan2(s.dy,s.dx)*20)+':'+Math.round(Math.atan(1/s.k)*20)+':'+Math.round(Math.min(1,s.a/.24)*8):'night';}
function tileFor(ti,tj){const scn=SH.on?'s':'k',k=scn+ti+','+tj;let T=TTILES[k];
 /* a tile shows lifted ground, which can come from below it, so look a lift's height further down for land */
 if(!T){const x0=ti*TT,y0=tj*TT;let any=false;for(let j=0;j<=24&&!any;j++)for(let i=0;i<=12&&!any;i++)if(terrH(x0+i*TT/12,y0+j*(TT+150)/24)!==0)any=true;T=TTILES[k]={x0,y0,any,key:null,cv:null};}
 /* new light is rendered into a back image; drawTerrain swaps all visible tiles together, so no seams while updating */
 if(!T.any)return T;const sk=sunKey();if(T.key===sk||T.nkey===sk||tBudget<=0)return T;tBudget--;T.nkey=sk;
 if(!T.nv){T.nv=document.createElement('canvas');T.nv.width=TN;T.nv.height=TN;}
 const g=T.nv.getContext('2d'),im=g.createImageData(TN,TN),D=im.data,sun=SKY.sun,E=1.6,R=TR;
 let lx=0,ly=0,se=1,str=0,el=1.5;if(sun){el=Math.atan(1/sun.k);const ce=Math.cos(el);se=Math.sin(el);lx=-sun.dx*ce;ly=-sun.dy*ce;str=Math.min(1,sun.a/.24);}
 for(let j=0;j<TN;j++)for(let i=0;i<TN;i++){const wx=T.x0+i*R,wy=unlift(wx,T.y0+j*R),h0=terrH(wx,wy);
  const hE=terrH(wx+R,wy),hW=terrH(wx-R,wy),hN=terrH(wx,wy-R),hS=terrH(wx,wy+R);if(h0===0&&hE===0&&hW===0&&hN===0&&hS===0)continue;
  const gx=(hE-hW)/(2*R)*E,gy=(hS-hN)/(2*R)*E,nl=Math.hypot(gx,gy,1),cav=(hE+hW+hN+hS)/4-h0;
  let v=-Math.max(0,cav)*.06-(1-1/nl)*.25;
  if(sun){v+=((-gx*lx-gy*ly+se)/nl-se)*str*.9;
   if(el<.7){const ddx=-sun.dx,ddy=-sun.dy,tn=Math.tan(el);for(let s=12;s<=96;s+=12){if(terrH(wx+ddx*s,wy+ddy*s)>h0+s*tn){v-=.14*str;break;}}}}
  v+=Math.max(-1,Math.min(1,h0/40))*.05;
  const o=(j*TN+i)*4;if(v<0){D[o]=42;D[o+1]=33;D[o+2]=64;D[o+3]=Math.min(.34,-v)*255;}else{D[o]=255;D[o+1]=244;D[o+2]=210;D[o+3]=Math.min(.2,v)*255;}}
 g.putImageData(im,0,0);return T;}
function drawTerrain(vw,vh){tBudget=SH.on?1:2;ctx.imageSmoothingEnabled=true;const vis=[],sk=sunKey();
 for(let tj=Math.floor((cam.y-vh)/TT);tj<=Math.floor((cam.y+vh+maxLift())/TT);tj++)for(let ti=Math.floor((cam.x-vw)/TT);ti<=Math.floor((cam.x+vw)/TT);ti++){const T=tileFor(ti,tj);if(T.any)vis.push(T);}
 /* swap when every visible tile has the new light (or has never had any) */
 if(vis.every(T=>T.key===sk||T.nkey===sk))for(const T of vis)if(T.nkey===sk&&T.key!==sk){const c=T.cv;T.cv=T.nv;T.nv=c;T.key=sk;T.nkey=null;}
 else for(const T of vis)if(!T.cv&&T.nkey){T.cv=T.nv;T.nv=null;T.key=T.nkey;T.nkey=null;}
 for(const T of vis)if(T.cv)ctx.drawImage(T.cv,0,0,TN,TN,T.x0+TR/2,T.y0+TR/2,TT,TT);
 const G=tgrid();ctx.lineCap='round';for(const [m,al,lw] of [[G.seg[0],.03,1],[G.seg[1],.055,1.2]]){ctx.strokeStyle='rgba(42,33,64,'+al+')';ctx.lineWidth=lw;ctx.beginPath();
  for(let bx=Math.floor((cam.x-vw)/400);bx<=Math.floor((cam.x+vw)/400);bx++)for(let by=Math.floor((cam.y-vh)/400);by<=Math.floor((cam.y+vh)/400);by++){const s=m.get(bx+','+by);if(!s)continue;for(let k=0;k<s.length;k+=4){ctx.moveTo(s[k],s[k+1]);ctx.lineTo(s[k+2],s[k+3]);}}
  ctx.stroke();}}
/* Tobler: speed = 6 exp(-3.5 |slope + 0.05|) km/h, fastest on a gentle downhill; scaled so flat ground is 1 */
function slopeK(x,y,ux,uy){const s=(terrH(x+ux*6,y+uy*6)-terrH(x,y))/6;return Math.max(.35,Math.min(1.2,Math.exp(-3.5*Math.abs(s+.05))/Math.exp(-.175)));}
/* feeling the slope: lean into a climb, lean back going down; a little sand slides off a dune face on the way down */
function walkFeel(ux,uy,dt){const s=(terrH(P.x+ux*8,P.y+uy*8)-terrH(P.x,P.y))/8;P.slope=s;
 if(!SH.on&&s<-.06&&Math.random()<dt*14){const r=Math.hypot(P.x,P.y),a=Math.atan2(P.y,P.x);if(r>gR(a))for(let i=0;i<2;i++)grindDust.push({x:P.x+(Math.random()-.5)*10,y:P.y+2,vx:ux*30+(Math.random()-.5)*30,vy:-12-Math.random()*16,t:0});}}
function leanNow(dt){const tgt=P.moving?Math.max(-.14,Math.min(.14,(P.slope||0)*1.6)):0;P.lean=(P.lean||0)+(tgt-(P.lean||0))*Math.min(1,dt*6);return P.lean;}
function hillZoom(){return 1/(1+Math.max(0,terrH(P.x,P.y))/520);}
