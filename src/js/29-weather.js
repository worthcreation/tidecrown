/* ---------- weather ----------
   Two layers, both pure functions of time and place, nothing saved: everyone sees the same sky.
   Base: a trade wind from the east that wanders, cloud that travels with it, squalls now and then, dawn fog.
   Terrain modifiers: open sand burns fog off fast, grass slower, the sea holds it, the cold dark water over the
   current holds a sea fog that rarely clears, dense forest holds fog longest, clearings clear first, the Fallow worst.
   WXT is the test build's override. */
const WXT={force:null,turn:0};
let WX={wa:Math.PI,ws:.4,cover:.3,rain:0,fog:0,seaFog:0};
function hash1(n){const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);}
function wxUpdate(){const t=Date.now()/1000,sm=x=>Math.max(0,Math.min(1,x));
 /* squalls: a 15 minute slot holds one about one time in seven; rain swells, peaks and passes in about five minutes */
 const slot=Math.floor(t/900),ph=(t%900)/900;let rain=hash1(slot)<.14?sm(1-Math.abs(ph-.45)/.17):0;rain=Math.pow(rain,.7);
 let cover=sm(.28+.22*Math.sin(t/1100)+.14*Math.sin(t/333+1)+rain*.8);
 /* dawn radiation fog: some mornings none, some thick; builds before sunrise, burns off by late morning */
 const amt=hash1(S.dayN*3.7+1),a=amt<.35?0:(amt-.35)/.65,d=S.day;let fog=0;
 if(d>.16&&d<.42)fog=a*(d<.23?(d-.16)/.07:d<.29?1:1-(d-.29)/.13);
 let seaFog=sm(.35+.3*Math.sin(t/1500+2)+.5*fog);
 let wa=Math.PI+.55*Math.sin(t/1900+1)+.25*Math.sin(t/640),ws=sm(.32+.22*Math.sin(t/1300)+.12*Math.sin(t/410+2)+rain*.45);
 const F=WXT.force;if(F==='clear'){cover=.05;rain=0;fog=0;seaFog=0;}else if(F==='cloudy'){cover=.85;rain=0;}else if(F==='fog'){fog=1;seaFog=1;}else if(F==='squall'){rain=1;cover=1;ws=.85;}
 wa+=WXT.turn;WX={wa,ws,cover,rain,fog,seaFog};}
/* how much fog sits at a place, 0 to 1 */
/* valleys hold fog, high ground sheds it */
function fogAt(x,y){const cap=capAt(x,y)*.85,th=terrH(x,y),tk=(1+Math.min(1,Math.max(0,-th/30))*.6)*(1-Math.min(1,Math.max(0,th/80))*.5);return Math.min(1,Math.max(cap,fogAt0(x,y)*tk));}
function fogAt0(x,y){if(SH.on){const I=ISLES.find(I=>isleK(I,x,y)<=1.05),n=I?I.name:'';const k=n==='The Clearing'?.55:n==='The Fallow'?1.4:n==='The Tangle'?1.25:n==='Landing'?1:1.15;return Math.min(1,Math.max(WX.fog*k,WX.seaFog*.6));}
 const r=Math.hypot(x,y),a=Math.atan2(y,x);let k;if(walkable(x,y))k=r>gR(a)?.5:.8;else k=1;
 const sea=curK(x,y)>0||x>CUR0()-400?WX.seaFog*Math.min(1,(x-CUR0()+400)/500):0;return Math.min(1,Math.max(WX.fog*k,sea));}
/* the Key's summit cloud cap: a cloud that sits on the hilltop most of the time, thickest in the morning, thinner
   in the afternoon, gone when the sky is forced clear. It is what keeps the wobble trees' fog belt wet. */
function capAmt(){if(WXT.force==='clear')return 0;const d=S.day,morn=d>.15&&d<.45?Math.sin((d-.15)/.3*Math.PI):0;return Math.max(0,Math.min(1,.35+.45*morn+.2*Math.sin(Date.now()/1700000)+.3*WX.rain));}
function capAt(x,y){if(SH.on)return 0;const h=hKey(x,y);return h<CLO-6?0:Math.min(1,(h-CLO+6)/(KPEAK-CLO))*capAmt();}
function fogR(){const f=fogAt(P.x,P.y);return f<.04?1e9:(120+(1-f)*900)*(1+Math.max(0,terrH(P.x,P.y))/50);}
function fogHides(x,y){const R=fogR();return R<1e8&&Math.hypot(x-P.x,y-P.y)>R*.95;}
/* clouds: fair-weather cumulus, each a silhouette of overlapping lobes with a flatter base, on a 3000px tile.
   They drift slowly with the wind: the drift builds up frame by frame (CLOFF), so a wandering wind bends their
   path instead of moving them all at once. Speed is a slow walk, well under yours. */
const CLOUDS=[],CL_SP=16;{const r=mulberry(77);for(let i=0;i<16;i++){const rx=110+r()*190,ry=55+r()*70,lobes=[],n=4+Math.floor(r()*4);
 for(let k=0;k<n;k++){const u=(k+.5)/n*2-1,lr=ry*(.55+r()*.5)*(1-Math.abs(u)*.35);lobes.push([u*rx*.75,-lr*.35-r()*ry*.25,lr]);}
 lobes.push([0,ry*.15,rx*.8,ry*.35]);CLOUDS.push({x:r()*3000,y:r()*3000,rx,ry,lobes,low:r()<.6,h:r(),seed:600+i});}}
let CLOFF=null;
function cloudDrift(dt){if(!CLOFF){const t=Date.now()/1000;CLOFF={x:-CL_SP*t%3000,y:0};}CLOFF.x=(CLOFF.x+Math.cos(WX.wa)*CL_SP*dt)%3000;CLOFF.y=(CLOFF.y+Math.sin(WX.wa)*CL_SP*dt)%3000;}
function cloudPos(c){const o=CLOFF||{x:0,y:0},m=v=>((v%3000)+3000)%3000;let x=m(c.x+o.x),y=m(c.y+o.y);x+=Math.floor((cam.x-x+1500)/3000)*3000;y+=Math.floor((cam.y-y+1500)/3000)*3000;return [x,y];}
/* a cloud shows when the cover is high enough for it, fading in and out rather than popping */
function cloudK(c){return Math.max(0,Math.min(1,(WX.cover-c.h)/.08));}
/* a cloud forming or thinning grows or shrinks its lobes instead of popping */
function cloudShapes(){const out=[];for(const c of CLOUDS){const k=cloudK(c);if(k<.03)continue;const [x,y]=cloudPos(c);if(Math.abs(x-cam.x)>W/Z/2+c.rx+60||Math.abs(y-cam.y)>H/Z/2+c.ry+60)continue;
 for(const L of c.lobes)out.push(L.length===4?[x+L[0]*k,y+L[1]*k,L[2]*k,L[3]*k,0]:[x+L[0]*k,y+L[1]*k,L[2]*k,L[2]*.62*k,0]);}return out;}
function cloudOver(x,y){for(const c of CLOUDS){if(cloudK(c)<.5)continue;const [cx,cy]=cloudPos(c);if(((x-cx)/c.rx)**2+((y-cy)/c.ry)**2<1)return 1;}return 0;}
function drawWeatherWorld(){const sun=SKY.sun,sa=sun?Math.min(1,sun.a/.24):0;
 /* the cap on the summit, seen from below: soft white over the hilltop */
 if(!SH.on){const c=capAmt();if(c>.05){const L=liftAt(HILL.x,HILL.y),sh=[];for(let i=0;i<9;i++){const a=i/9*6.2832+Date.now()/90000,rr=(60+30*Math.sin(i*1.7))*KSC;sh.push([HILL.x+Math.cos(a)*rr,HILL.y-L-40+Math.sin(a)*rr*.45,(70+20*Math.sin(i*2.3))*KSC,40*KSC,0]);}layer(sh,.42*c,'#f4f6f8');}}
 /* the odd low cloud passes below the view: a soft white cumulus, not often */
 const low=[];for(const c of CLOUDS){const k=cloudK(c)*Math.max(0,Math.min(1,(.1+WX.rain*.2-c.h)/.03));if(k<.03||!c.low)continue;const [x,y]=cloudPos(c);for(const L of c.lobes)low.push(L.length===4?[x-80+L[0]*k,y-120+L[1]*k,L[2]*.85*k,L[3]*.85*k,0]:[x-80+L[0]*k,y-120+L[1]*k,L[2]*.85*k,L[2]*.55*k,0]);}
 if(low.length)layer(low,.3*(.4+.6*sa),'#f4f6f8');
 /* fog wisps drifting with the wind */
 {const o=CLOFF||{x:0,y:0},T=900,m=v=>((v%T)+T)%T;for(let i=0;i<14;i++){let px=m(i*431+o.x*.5),py=m(i*277+i*i*13+o.y*.5);px+=Math.floor((cam.x-px+T/2)/T)*T;py+=Math.floor((cam.y-py+T/2)/T)*T;const f=fogAt(px,py);if(f<.05)continue;ctx.globalAlpha=.16*f;blob(px,py-liftAt(px,py),150,52,700+i,'#eef2f4',0,8);}}
 ctx.globalAlpha=1;}
function drawWeatherScreen(){const r=WX.rain;
 if(r>.02){const t=now,n=Math.floor(170*r),wx=Math.cos(WX.wa)*WX.ws*9;ctx.strokeStyle='rgba(220,232,245,.55)';ctx.lineWidth=1.3;ctx.beginPath();
  for(let i=0;i<n;i++){const sx=((i*97.3+t*(60+wx*20))%(W+80))-40,sy=((i*53.7+t*620*(.8+(i%5)*.1))%(H+60))-30;ctx.moveTo(sx,sy);ctx.lineTo(sx+wx,sy+14);}ctx.stroke();
  ctx.fillStyle='rgba(60,70,90,'+(.12*r)+')';ctx.fillRect(0,0,W,H);}
 const f=fogAt(P.x,P.y);if(f>.04){const [sx,sy]=w2s(P.x,P.y-20),R=fogR()*Z;const g=ctx.createRadialGradient(sx,sy,R*.25,sx,sy,R);g.addColorStop(0,'rgba(232,238,242,0)');g.addColorStop(1,'rgba(232,238,242,'+(.92*f)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}}
/* rain on the world: small fires drown, big ones burn down faster, Brimble keeps his hearth; drying salt washes off */
let rainSaid=0;
function wxTick(dt){wxUpdate();cloudDrift(dt);const r=WX.rain;if(r<.3)return;
 if(!SH.on){for(const f of S.fires||[]){if(f.main||!fireLit(f))continue;f.until-=dt*1000*r*(f.big?2:7);if(!fireLit(f)&&!rainSaid){rainSaid=1;think('The rain put my fire out.');}}
  for(const s of SURF)if(s.st==='sparkle')s.st='dry';}
 if(r>.6&&!S.st.rainHint){S.st.rainHint=1;think('Rain. Squalls blow through here fast. Fires will not like it.');}}
/* waves: they still come at every shore, but the big ones come from where the wind blows */
function waveAlign(a0){return .5+.5*Math.cos(angDiff(a0,WX.wa+Math.PI));}
