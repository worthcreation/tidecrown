/* xp orbs + level bar */
const probe=document.createElement('div');probe.style.cssText='position:fixed;top:0;left:0;padding-top:env(safe-area-inset-top,0px);visibility:hidden;pointer-events:none';document.body.appendChild(probe);
let satC=null;function SAT(){if(satC==null)satC=parseFloat(getComputedStyle(probe).paddingTop)||0;return satC;}
addEventListener('resize',()=>{satC=null;});
const HUD={sk:null,a:0,disp:0,hold:0,glint:-1,plus:0,plusT:0,bump:0};let orbs=[];
function barGeo(){const w=Math.min(230,W*.56);return{x:(W-w)/2+14,y:SAT()+16,w,h:15};}
function fracOf(x){const L=lvl(x),c=XP[L],n=XP[L+1]||c;return L>=99?1:(x-c)/(n-c);}
function barTarget(){const g=barGeo();return[g.x+g.w*Math.max(.03,fracOf(HUD.disp)),g.y+g.h/2];}
function pendingSum(k){return orbs.filter(o=>o.sk===k).reduce((s,o)=>s+o.v,0);}
function nearestSecret(){let best=null,bd=900;for(const o of objects()){if(!o.key||S.journal[o.key])continue;const d=Math.hypot(o.x-P.x,o.y-P.y);if(d<bd&&d>70){bd=d;best=o;}}
 if(dark>.3&&!S.journal.moonpool){const d=Math.hypot(MOON.x-P.x,MOON.y-P.y);if(d<bd)best=MOON;}return best;}
function addXP(k,n,kind,src){const before=xpOf(k),p=SUBS[k].p,pl=lv(p);unlockSkill(k);S.sk[k].xp+=n;if(lv(p)>pl){const P=SKILLS[p],u=(P.unl||{})[lv(p)];toast(P.name+' '+lv(p)+(u?': '+u:''));}
 if(HUD.sk!==k){HUD.sk=k;HUD.disp=before-pendingSum(k);HUD.plus=0;}
 const s0=w2s(src[0],src[1]),m=Math.max(2,Math.min(5,Math.round(n/14)+1)),bag=[W-42,H-42];
 let wh=-1,wt=null;if((kind==='normal'||kind==='perfect')&&Math.random()<.35){const t=nearestSecret();if(t){wh=Math.floor(Math.random()*m);wt=w2s(t.x,t.y);wt=[Math.max(30,Math.min(W-30,wt[0])),Math.max(80,Math.min(H-80,wt[1]))];}}
 for(let i=0;i<m;i++){const r=Math.random,sx=s0[0]+(r()-.5)*16,sy=s0[1]+(r()-.5)*10;let kd=kind,pts,dur=1+r()*.35;
  if(i===wh){kd='lead';pts=[[sx,sy],[(sx+wt[0])/2,Math.min(sy,wt[1])-40],wt,[wt[0]+12,wt[1]-8],[wt[0]-6,wt[1]+6],wt,[(wt[0]+W/2)/2,wt[1]/2]];dur=3.2;}
  else if(kd==='perfect'){const a0=r()*6.28,R=30;pts=[[sx,sy]];for(let j=1;j<=5;j++){const a=a0+j*1.57;pts.push([sx+Math.cos(a)*R,sy-16+Math.sin(a)*R*.75]);}pts.push([sx+(r()-.5)*40,sy-100]);dur=1.7;}
  else if(kd==='first'){pts=[[sx,sy],[(sx+bag[0])/2+(r()-.5)*40,Math.max(sy,bag[1])-30],bag,[bag[0]-50-r()*30,bag[1]-150]];dur=1.9;}
  else if(kd==='burnt'){pts=[[sx,sy],[sx+(r()-.5)*70,sy-50]];dur=2.1;}
  else pts=[[sx,sy],[sx+(r()-.5)*130,sy-60-r()*90]];
  orbs.push({sk:k,v:n/m,kind:kd,pts,t:-i*.07,dur,trail:[],x:sx,y:sy});}}
function cr(a,b,c,d,t){const t2=t*t,t3=t2*t;return[0,1].map(j=>.5*(2*b[j]+(-a[j]+c[j])*t+(2*a[j]-5*b[j]+4*c[j]-d[j])*t2+(-a[j]+3*b[j]-3*c[j]+d[j])*t3));}
function pathAt(Q,u){const n=Q.length-1,f=Math.min(n-1e-6,Math.max(0,u)*n),i=Math.floor(f),t=f-i;return cr(Q[Math.max(0,i-1)],Q[i],Q[i+1],Q[Math.min(n,i+2)],t);}
function updOrbs(dt){for(const o of orbs){o.t+=dt;if(o.t<0)continue;const k=Math.min(1,o.t/o.dur),u=(o.kind==='normal'||o.kind==='smoky')?Math.pow(k,1.5):k*k*(3-2*k);
  const p=pathAt(o.pts.concat([barTarget()]),u);if(o.kind==='burnt')p[0]+=Math.sin(o.t*18)*8*(1-k);
  o.trail.unshift([o.x,o.y]);if(o.trail.length>(o.kind==='smoky'?5:2))o.trail.pop();o.x=p[0];o.y=p[1];if(k>=1){o.hit=true;orbHit(o);}}
 orbs=orbs.filter(o=>!o.hit);
 if(HUD.sk&&!orbs.some(o=>o.sk===HUD.sk))HUD.disp=xpOf(HUD.sk);
 HUD.hold-=dt;HUD.plusT-=dt;if(HUD.plusT<=0)HUD.plus=0;if(HUD.glint>=0){HUD.glint+=dt*2.6;if(HUD.glint>1)HUD.glint=-1;}HUD.bump=Math.max(0,HUD.bump-dt*4);
 const show=HUD.sk&&(orbs.length||HUD.hold>0);HUD.a+=((show?1:0)-HUD.a)*Math.min(1,dt*7);}
function orbHit(o){if(HUD.sk!==o.sk)return;const L0=lvl(HUD.disp+.001);HUD.disp+=o.v;HUD.glint=0;HUD.plus+=o.v;HUD.plusT=1.4;HUD.hold=2.2;HUD.bump=1;
 const L1=lvl(HUD.disp+.001);if(L1>L0){const D=skd(o.sk);cele={t:0,l:L1,name:D.name,msg:(D.unl||{})[L1]||'You feel a little steadier'};}}
function drawOrbsHUD(){
 for(const o of orbs){if(o.t<0)continue;const col=o.kind==='perfect'?'#ffeab0':o.kind==='burnt'?'#8a8494':o.kind==='lead'?'#eaf2ff':o.kind==='smoky'?'#e2c9a8':(o.sk==='hearth'?'#ffd2a1':'#bfeaf6');
  o.trail.forEach((q,i)=>{ctx.globalAlpha=(o.kind==='smoky'?.25:.3)*(1-i/o.trail.length);dot(q[0],q[1],o.kind==='smoky'?5-i*.4:Math.max(.6,3-i*.6),o.kind==='smoky'?'#b8aa9a':col);});
  ctx.globalAlpha=o.kind==='lead'?.3+.5*Math.abs(Math.sin(o.t*9)):.8;
  const g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,8);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,255,255,0)');ctx.globalAlpha*=.6;ctx.fillStyle=g;ctx.beginPath();ctx.arc(o.x,o.y,8,0,6.3);ctx.fill();ctx.globalAlpha/=.6;
  star(o.x,o.y,3.6,col);dot(o.x,o.y,1.1,'#fff');ctx.globalAlpha=1;}
 if(HUD.a<.02||!HUD.sk)return;const g=barGeo(),D=skd(HUD.sk),y=g.y-(1-HUD.a)*70,L=lvl(HUD.disp+.001),fr=fracOf(HUD.disp+.001),bp=HUD.bump;
 ctx.save();ctx.globalAlpha=Math.min(1,HUD.a*1.4);
 sketch(rrPts(g.x-3,y-3,g.w+6,g.h+6,8),true,601,1.5,'#fffaf0',INK,3);
 ctx.save();ctx.beginPath();ctx.rect(g.x,y,g.w*fr,g.h);ctx.clip();ctx.fillStyle=D.col;ctx.fillRect(g.x,y,g.w,g.h);
 if(bp>0){ctx.fillStyle=`rgba(255,255,255,${bp*.35})`;ctx.fillRect(g.x,y,g.w,g.h);}
 if(HUD.glint>=0){const gx=g.x+g.w*fr*HUD.glint;ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.moveTo(gx-8,y+g.h);ctx.lineTo(gx+2,y);ctx.lineTo(gx+10,y);ctx.lineTo(gx,y+g.h);ctx.fill();}
 ctx.restore();
 if(fr>.06)ln([[g.x+4,y+4],[g.x+g.w*fr-4,y+4]],602,2,'rgba(255,255,255,.55)',.3);
 const ix=g.x-22,iy=y+g.h/2;blob(ix,iy,15+bp*2,15+bp*2,603,D.col,3,1);
 ctx.drawImage(iconImg(D.icon),ix-13,iy-13,26,26);
 otext(String(L),g.x+g.w+18,iy,22,'#fff');
 if(HUD.plus>0){ctx.globalAlpha=Math.min(1,HUD.plusT)*HUD.a;otext('+'+Math.round(HUD.plus)+' '+D.name,g.x+g.w/2,y+g.h+18,17,'#fff');}
 ctx.restore();}

