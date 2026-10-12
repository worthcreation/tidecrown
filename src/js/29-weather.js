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
function fogAt(x,y){const th=terrH(x,y),tk=(1+Math.min(1,Math.max(0,-th/30))*.6)*(1-Math.min(1,Math.max(0,th/80))*.5);return Math.min(1,fogAt0(x,y)*tk);}
function fogAt0(x,y){if(SH.on){const I=ISLES.find(I=>isleK(I,x,y)<=1.05),n=I?I.name:'';const k=n==='The Clearing'?.55:n==='The Fallow'?1.4:n==='The Tangle'?1.25:n==='Landing'?1:1.15;return Math.min(1,Math.max(WX.fog*k,WX.seaFog*.6));}
 const r=Math.hypot(x,y),a=Math.atan2(y,x);let k;if(walkable(x,y))k=r>gR(a)?.5:.8;else k=1;
 const sea=curK(x,y)>0||x>CUR0()-400?WX.seaFog*Math.min(1,(x-CUR0()+400)/500):0;return Math.min(1,Math.max(WX.fog*k,sea));}
function fogR(){const f=fogAt(P.x,P.y);return f<.04?1e9:(120+(1-f)*900)*(1+Math.max(0,terrH(P.x,P.y))/50);}
function fogHides(x,y){const R=fogR();return R<1e8&&Math.hypot(x-P.x,y-P.y)>R*.95;}
/* clouds: puffs on a 3000px tile that slides with the wind; low cumulus casts crisp shade, high cirrus faint */
const CLOUDS=[];{const r=mulberry(77);for(let i=0;i<16;i++)CLOUDS.push({x:r()*3000,y:r()*3000,rx:120+r()*200,ry:60+r()*90,low:r()<.6,h:r(),seed:600+i});}
function cloudPos(c){const t=Date.now()/1000,sp=14,ox=Math.cos(WX.wa)*sp*t,oy=Math.sin(WX.wa)*sp*t;const m=v=>((v%3000)+3000)%3000;
 let x=m(c.x+ox),y=m(c.y+oy);x+=Math.floor((cam.x-x+1500)/3000)*3000;y+=Math.floor((cam.y-y+1500)/3000)*3000;return [x,y];}
function cloudOn(c){return c.h<WX.cover;}
function cloudOver(x,y){let v=0;for(const c of CLOUDS){if(!cloudOn(c))continue;const [cx,cy]=cloudPos(c),u=((x-cx)/c.rx)**2+((y-cy)/c.ry)**2;if(u<1)v=Math.max(v,(c.low?.85:.35)*(1-u*.4));}return v;}
function drawWeatherWorld(){const sun=SKY.sun,sa=sun?Math.min(1,sun.a/.24):0;ctx.fillStyle='rgb(42,33,64)';
 if(sa>0)for(const c of CLOUDS){if(!cloudOn(c))continue;const [x,y]=cloudPos(c);ctx.globalAlpha=(c.low?.13:.05)*sa*(1-WX.rain*.5);sketch(ell(x,y,c.rx,c.ry,16),true,c.seed,c.low?12:20,'rgb(42,33,64)',null);}
 /* the odd low cloud passes below the view: soft white, not often */
 for(const c of CLOUDS){if(!cloudOn(c)||!c.low||c.h>.12+WX.rain*.2)continue;const [x,y]=cloudPos(c);ctx.globalAlpha=.32*(.4+.6*sa);sketch(ell(x-80,y-120,c.rx*.8,c.ry*.8,16),true,c.seed+3,14,'#f4f6f8',null);}
 /* fog wisps drifting with the wind */
 const f=fogAt(P.x,P.y);if(f>.05){const t=Date.now()/1000;for(let i=0;i<8;i++){const px=P.x+((i*431+Math.cos(WX.wa)*t*10)%900+900)%900-450,py=P.y+((i*277+Math.sin(WX.wa)*t*10)%700+700)%700-350;ctx.globalAlpha=.16*f;blob(px,py,140,50,700+i,'#eef2f4',0,8);}}
 ctx.globalAlpha=1;}
function drawWeatherScreen(){const r=WX.rain;
 if(r>.02){const t=now,n=Math.floor(170*r),wx=Math.cos(WX.wa)*WX.ws*9;ctx.strokeStyle='rgba(220,232,245,.55)';ctx.lineWidth=1.3;ctx.beginPath();
  for(let i=0;i<n;i++){const sx=((i*97.3+t*(60+wx*20))%(W+80))-40,sy=((i*53.7+t*620*(.8+(i%5)*.1))%(H+60))-30;ctx.moveTo(sx,sy);ctx.lineTo(sx+wx,sy+14);}ctx.stroke();
  ctx.fillStyle='rgba(60,70,90,'+(.12*r)+')';ctx.fillRect(0,0,W,H);}
 const f=fogAt(P.x,P.y);if(f>.04){const [sx,sy]=w2s(P.x,P.y-20),R=fogR()*Z;const g=ctx.createRadialGradient(sx,sy,R*.25,sx,sy,R);g.addColorStop(0,'rgba(232,238,242,0)');g.addColorStop(1,'rgba(232,238,242,'+(.92*f)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}}
/* rain on the world: small fires drown, big ones burn down faster, Brimble keeps his hearth; drying salt washes off */
let rainSaid=0;
function wxTick(dt){wxUpdate();const r=WX.rain;if(r<.3)return;
 if(!SH.on){for(const f of S.fires||[]){if(f.main||!fireLit(f))continue;f.until-=dt*1000*r*(f.big?2:7);if(!fireLit(f)&&!rainSaid){rainSaid=1;think('The rain put my fire out.');}}
  for(const s of SURF)if(s.st==='sparkle')s.st='dry';}
 if(r>.6&&!S.st.rainHint){S.st.rainHint=1;think('Rain. Squalls blow through here fast. Fires will not like it.');}}
/* waves: they still come at every shore, but the big ones come from where the wind blows */
function waveAlign(a0){return .5+.5*Math.cos(angDiff(a0,WX.wa+Math.PI));}
