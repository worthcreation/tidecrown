/* Water depth. Every point of sea has a depth in body units: 0 at the waterline, about .5 at the waist, 1 where you can no longer stand, capped at 3 for the open deep. Around every shore the bottom shelves out and then drops; how long the shelf runs and how steep the drop is changes as you go round, so one stretch is a long gentle wade and the next falls away in a few steps. Out at sea there are sandbars, reefs and tiny islands, some with trees. The shallowest thing at a point wins. The water's colour is drawn from the same numbers as contour bands, so a gentle slope reads as wide bands and a drop-off as tight ones. */
const SEA_R=()=>iR(0)+4600,FAR_X=()=>iR(0)+3600,SH_WEST=-3600,SH_IN=[-3150,380];
const STAND=1,SWIMD=.55,DLEVELS=[2.4,1.6,1,.7,.45,.25,.1];
function nz(s,t){return Math.max(0,Math.min(1,.5+.5*(.6*Math.sin(2*t+s)+.3*Math.sin(5*t+s*1.7)+.12*Math.sin(11*t+s*2.9))));}
/* a shore profile: a shelf down to the waist over L, then a drop of one body height per D */
function prof(s,L,D){return s<=0?0:s<=L?.5*s/L:.5+(s-L)/D;}
function profInv(v,L,D){return v<=.5?v/.5*L:L+(v-.5)*D;}
/* ---- the Key ---- */
const KSH=[];for(let i=0;i<NP;i++){const a=i/NP*6.2832,n1=nz(3.1,a),n2=nz(7.7,a*1.3);KSH.push([30+250*n1*n1,22+270*n2]);}
function keyShelf(a){const f=((a/6.2832)%1+1)%1*NP,i=Math.floor(f)%NP,j=(i+1)%NP,k=f-Math.floor(f);return [KSH[i][0]+(KSH[j][0]-KSH[i][0])*k,KSH[i][1]+(KSH[j][1]-KSH[i][1])*k];}
function keyDepth(x,y){const a=Math.atan2(y,x),s=Math.hypot(x,y)-wetR(a);if(s<=0)return 0;const [L,D]=keyShelf(a);return prof(s,L,D);}
/* ---- features: bars, reefs, islets ---- */
function fShape(f,t){return 1+f.k[0]*Math.sin(3*t+f.seed)+f.k[1]*Math.sin(5*t+f.seed*2.3)+f.k[2]*Math.sin(7*t+f.seed*.7);}
function fLocal(f,x,y){const dx=x-f.x,dy=y-f.y,c=Math.cos(-f.rot),s=Math.sin(-f.rot),lx=dx*c-dy*s,ly=dx*s+dy*c,t=Math.atan2(ly/f.ry,lx/f.rx),R=fShape(f,t);return Math.hypot(lx,ly)-Math.hypot(Math.cos(t)*f.rx*R,Math.sin(t)*f.ry*R);}
function fDepth(f,x,y){if(Math.abs(x-f.x)>f.reach||Math.abs(y-f.y)>f.reach)return 9;const s=fLocal(f,x,y);if(f.kind==='islet')return s<=0?-1:prof(s,f.L,f.D);return s<=0?f.top:f.top+s/f.D;}
function fOffset(f,v){if(f.kind==='islet')return v<=0?0:profInv(v,f.L,f.D);return v<=f.top?null:(v-f.top)*f.D;}
function fPts(f,off,n){const a=[],c=Math.cos(f.rot),s=Math.sin(f.rot);for(let i=0;i<n;i++){const t=i/n*6.2832,R=fShape(f,t),lx=Math.cos(t)*(f.rx*R+off),ly=Math.sin(t)*(f.ry*R+off);a.push([f.x+lx*c-ly*s,f.y+lx*s+ly*c]);}return a;}
function makeFeat(r,kind,x,y){const f={kind,x,y,rot:r()*3.14,seed:r()*20,k:[(r()-.5)*.24,(r()-.5)*.16,(r()-.5)*.1]};
 if(kind==='bar'){f.rx=70+r()*190;f.ry=18+r()*44;f.top=.1+r()*.35;f.D=50+r()*200;}
 else if(kind==='reef'){f.rx=40+r()*90;f.ry=30+r()*60;f.top=.3+r()*.35;f.D=24+r()*60;}
 else{f.rx=36+r()*60;f.ry=28+r()*46;f.L=16+r()*110;f.D=24+r()*140;f.trees=[];const nt=Math.floor(r()*5);for(let i=0;i<nt;i++){const a=r()*6.28,d=Math.sqrt(r())*.55;f.trees.push({x:x+Math.cos(a)*f.rx*d,y:y+Math.sin(a)*f.ry*d,s:.75+r()*.4,seed:Math.floor(r()*9999),tw:r()});}}
 f.reach=Math.max(f.rx,f.ry)*1.35+(fOffset(f,2.4)||0)+10;return f;}
function scatter(r,n,place,ok){const out=[];let tries=0;while(out.length<n&&tries<n*60){tries++;const u=r(),kind=u<.48?'bar':u<.76?'reef':'islet',[x,y]=place(r),f=makeFeat(r,kind,x,y);if(!ok(f))continue;if(out.some(g=>Math.hypot(g.x-f.x,g.y-f.y)<(Math.max(g.rx,g.ry)+Math.max(f.rx,f.ry))*1.15))continue;out.push(f);}return out;}
/* the Key's sea: most of it scattered along the crossing east, some round the Key */
var KFEAT=(()=>{const r=mulberry(91),k0=iR(0);const ok=f=>{const a=Math.atan2(f.y,f.x);return Math.hypot(f.x,f.y)-iR(a)-TIDE_REACH>Math.max(f.rx,f.ry)*1.3+90&&f.x<FAR_X()-Math.max(f.rx,f.ry)-160&&!(f.x>k0-40&&f.x<k0+300&&Math.abs(f.y)<160);};
 const a=scatter(r,30,r=>[k0+350+r()*(FAR_X()-k0-500),(r()-.5)*2*(300+r()*1000)],ok),b=scatter(r,12,r=>{const t=r()*6.28,d=iR(t)+300+r()*1200;return [Math.cos(t)*d,Math.sin(t)*d];},f=>ok(f)&&!a.some(g=>Math.hypot(g.x-f.x,g.y-f.y)<(Math.max(g.rx,g.ry)+Math.max(f.rx,f.ry))*1.15));
 const all=a.concat(b);if(all.filter(f=>f.kind==='islet').length<4){const extra=scatter(mulberry(92),40,r=>[k0+600+r()*(FAR_X()-k0-1000),(r()-.5)*1400],f=>f.kind==='islet'&&ok(f)&&!all.some(g=>Math.hypot(g.x-f.x,g.y-f.y)<(Math.max(g.rx,g.ry)+Math.max(f.rx,f.ry))*1.15));all.push(...extra.slice(0,4));}
 all.forEach((f,i)=>f.id='k'+i);return all;})();
/* the dark water: between the islands and out along the western approach */
var SHFEAT=(()=>{const r=mulberry(93);const ok=f=>ISLES.every(I=>isleK(I,f.x,f.y)>1.3+Math.max(f.rx,f.ry)/Math.min(I.rx,I.ry)*1.2)&&!BRIDGES.some(B=>B.v?Math.abs(f.x-B.x)<f.rx+60&&f.y>B.y0-80&&f.y<B.y1+80:Math.abs(f.y-B.y)<f.ry+60&&f.x>B.x0-80&&f.x<B.x1+80)&&(f.kind!=='islet'||Math.abs(f.x)<2000&&Math.abs(f.y)<1900);
 const all=scatter(r,22,r=>[SH_WEST+200+r()*(2000-SH_WEST-200),(r()-.5)*3600],ok);all.forEach((f,i)=>f.id='s'+i);return all;})();
function onIsletK(x,y){if(!KFEAT)return null;for(const f of KFEAT)if(f.kind==='islet'&&fDepth(f,x,y)<0&&fLocal(f,x,y)<-4)return f;return null;}
function onIsletS(x,y){if(!SHFEAT)return null;for(const f of SHFEAT)if(f.kind==='islet'&&fDepth(f,x,y)<0&&fLocal(f,x,y)<-4)return f;return null;}
/* islet trees: on the dark side they are shadow trees like any other (choppable, twisted, the wood by twist); on the Key's side, small sea palms */
{const cut=S.shCut||{};SHFEAT.forEach((f,n)=>{if(f.kind!=='islet')return;f.trees.forEach((q,j)=>{const seed=20000+n*10+j;if(cut[seed])return;const t={x:q.x,y:q.y,s:q.s,seed,lean:(q.tw-.5)*16,sh:1,tw:Math.min(1,.2+q.tw*.8),isle:-1};shTrees.push(t);tbAdd(t);});});}
/* ---- per-island shelves on the dark side ---- */
function isleShelf(I,t){return [20+180*Math.pow(nz(I.seed*1.3,t),1.5),20+220*nz(I.seed*2.1+1,t)];}
function isleDepth(I,x,y){if(Math.abs(x-I.x)>I.rx*1.3+700||Math.abs(y-I.y)>I.ry*1.3+700)return 9;const u=(x-I.x)/I.rx,v=(y-I.y)/I.ry,t=Math.atan2(v,u),R=isleR(I,t),s=Math.hypot(x-I.x,y-I.y)-Math.hypot(Math.cos(t)*I.rx*R,Math.sin(t)*I.ry*R);if(s<=0)return 0;const [L,D]=isleShelf(I,t);return prof(s,L,D);}
/* ---- the one call everything uses ---- */
function depthAt(x,y){let d;if(SH.on){if(shIsle(x,y))return 0;d=3;for(const I of ISLES)d=Math.min(d,isleDepth(I,x,y));for(const f of SHFEAT)d=Math.min(d,fDepth(f,x,y));}
 else{if(onDock(x,y)||onIsland(x,y)||onIsletK(x,y))return 0;d=Math.min(3,keyDepth(x,y));for(const f of KFEAT)d=Math.min(d,fDepth(f,x,y));}
 return Math.max(0,Math.min(3,d));}
/* nearest dry land to a point in this scene, for washing up */
function nearestIslet(x,y,within){const L=SH.on?SHFEAT:KFEAT;let best=null,bd=within;for(const f of L){if(f.kind!=='islet')continue;const s=fLocal(f,x,y);if(s<bd){bd=s;best=f;}}return best;}
/* ---- colour ---- */
function hexRGB(c){return [1,3,5].map(i=>parseInt(c.slice(i,i+2),16));}
const DEEP0=hexRGB('#2f93a8'),DEEP1=hexRGB('#1b4350'),SHAL0=hexRGB('#a4e2d6'),SHAL1=hexRGB('#4f7a74');
function waterCol(v){const far=farness(),dp=DEEP0.map((c,i)=>c+(DEEP1[i]-c)*far),sh=SHAL0.map((c,i)=>c+(SHAL1[i]-c)*far),t=Math.pow(Math.max(0,1-v/2.7),1.4);return 'rgb('+dp.map((c,i)=>Math.round(c+(sh[i]-c)*t)).join(',')+')';}
function fillPts(p){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();ctx.fill();}
function inView(x,y,r,vw,vh){return Math.abs(x-cam.x)<vw+r&&Math.abs(y-cam.y)<vh+r;}
/* contour bands, deepest first; each band covers where the water is at most that deep */
function drawDepthBands(){const vw=W/Z/2+80,vh=H/Z/2+80;
 for(const v of DLEVELS){ctx.fillStyle=waterCol(v);
  if(SH.on){for(const I of ISLES){const ext=Math.max(I.rx,I.ry)*1.3+profInv(v,200,240);if(!inView(I.x,I.y,ext,vw,vh))continue;const n=Math.max(48,Math.round((I.rx+I.ry)/12)),p=[];for(let i=0;i<n;i++){const t=i/n*6.2832,R=isleR(I,t),[L,D]=isleShelf(I,t),o=profInv(v,L,D),ex=Math.cos(t)*I.rx*R,ey=Math.sin(t)*I.ry*R,el=Math.hypot(ex,ey)||1;p.push([I.x+ex*(1+o/el),I.y+ey*(1+o/el)]);}fillPts(p);}}
  else{const p=[];for(let i=0;i<NP;i++){const a=i/NP*6.2832,o=profInv(v,KSH[i][0],KSH[i][1]),r=wetR(a)+o;p.push([Math.cos(a)*r,Math.sin(a)*r]);}fillPts(p);}
  for(const f of SH.on?SHFEAT:KFEAT){if(!inView(f.x,f.y,f.reach,vw,vh))continue;const o=fOffset(f,v);if(o==null)continue;fillPts(fPts(f,o,40));}}
 /* reefs show their tops; bars their pale sand where they nearly break the surface */
 for(const f of SH.on?SHFEAT:KFEAT){if(!inView(f.x,f.y,f.reach,vw,vh))continue;if(f.kind==='reef'){const r=mulberry(Math.floor(f.seed*100));ctx.globalAlpha=.55;for(let i=0;i<9;i++){const a=r()*6.28,d=Math.sqrt(r())*.8,x=f.x+Math.cos(a)*f.rx*d,y=f.y+Math.sin(a)*f.ry*d;blob(x,y,4+r()*5,3+r()*3,7000+i,SH.on?'#6a5a6e':'#e98a7a',1.4,.4);}ctx.globalAlpha=1;}
  else if(f.kind==='bar'&&f.top<.22){ctx.globalAlpha=.35*(1-f.top/.22);ctx.fillStyle=SH.on?'#8d7f63':'#f3d27a';fillPts(fPts(f,-Math.min(f.rx,f.ry)*.35,32));ctx.globalAlpha=1;}}}
/* islet land, drawn over the bands */
function drawIsletLand(){const vw=W/Z/2+80,vh=H/Z/2+80;for(const f of SH.on?SHFEAT:KFEAT){if(f.kind!=='islet'||!inView(f.x,f.y,f.reach,vw,vh))continue;sketch(fPts(f,0,36),true,7100+(f.seed*10|0),2.5,SH.on?'#7a6f58':'#f3d27a',INK,3);sketch(fPts(f,-Math.min(f.rx,f.ry)*.32,30),true,7200+(f.seed*10|0),2.5,SH.on?'#3a4a33':'#86c25e',INK,2.2);}}
/* a small sea palm for the Key's islets */
function drawPalm(t){const x=t.x,y=t.y,s=t.s,sw=Math.sin(now*1.2+t.seed)*(2+WX.ws*2)+Math.cos(WX.wa)*WX.ws*4;shadow(x,y+2,5*s,2*s,40*s,16*s);const top=[x+8*s+sw,y-38*s];ln([[x,y],[x+3*s,y-18*s],top],t.seed,6*s,INK,.5);ln([[x,y],[x+3*s,y-18*s],top],t.seed,3.4*s,'#b08452',.5);
 for(let i=0;i<5;i++){const a=-2.6+i*.55+Math.sin(now*1.5+i+t.seed)*.08,e=[top[0]+Math.cos(a)*20*s,top[1]+Math.sin(a)*12*s+8*s];ln([top,[(top[0]+e[0])/2,top[1]+Math.sin(a)*6*s-3],e],t.seed+i,4.5*s,INK,.5);ln([top,[(top[0]+e[0])/2,top[1]+Math.sin(a)*6*s-3],e],t.seed+i,2.6*s,'#5fae4a',.5);}}
