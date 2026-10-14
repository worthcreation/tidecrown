/* ---------- tropical weather (build 36) ----------
   On the game clock (Date.now()+DAYOFF), pure functions of time, nothing saved but what the player did.
   Showers: most days one short light shower in the afternoon.
   Monsoons: rare (about one day in eight, never two days running), long, heavy rain and high wind that veers as
   the system passes. During one: low ground floods (the swales behind the foredune fill to their spill level and
   drain after), fish are thrown up onto land, heavier things wash ashore (drift logs, crates, old nets, wreck
   timber; never hulls or anchors), and old big wobble trees come down. A fallen tree lies where the wind put it
   until its branches are gathered by hand and its trunk bucked with a hatchet, or until it rots away (three days,
   in stages); then a sapling comes up and grows back over a day and a half.
   Reading the weather scales with the Survival level (the parent skill): the swell, high cloud and gulls show
   for everyone; a higher Survival level turns them into an earlier, clearer thought. Brimble warns everyone. */
const HOUR=DAY_PERIOD/24,MON_P=.12,MON_LEN=.4,ROT=3*DAY_PERIOD,REGROW_WF=1.5*DAY_PERIOD;
function gNow(){return Date.now()+DAYOFF;}
const sm01=x=>Math.max(0,Math.min(1,x));
/* showers: about six days in seven, one in the afternoon, about an hour and three quarters of game time */
function showerOf(n){if(hash1(n*5.13+2)>.85)return null;const s=(n+.54+hash1(n*7.7+3)*.22)*DAY_PERIOD;return{s,e:s+.075*DAY_PERIOD};}
function showerK(t){const n=Math.floor(t/DAY_PERIOD),sh=showerOf(n);if(!sh||t<sh.s||t>sh.e)return 0;return Math.pow(Math.sin((t-sh.s)/(sh.e-sh.s)*Math.PI),.7);}
/* monsoons: day n holds one if its hash says so and day n-1 did not; it starts any time that day and lasts .4 day */
const isStormDay=n=>hash1(n*3.31+9)<MON_P&&!(hash1((n-1)*3.31+9)<MON_P);
const STORMC={};
function stormOf(n){if(n in STORMC)return STORMC[n];let st=null;if(isStormDay(n)){const s=(n+hash1(n*1.9+4))*DAY_PERIOD;st={id:n,s,e:s+MON_LEN*DAY_PERIOD};}return STORMC[n]=st;}
function stormAt(t){const n=Math.floor(t/DAY_PERIOD);for(const k of [n,n-1]){const st=stormOf(k);if(st&&t>=st.s&&t<st.e)return st;}return null;}
function nextStorm(t){const n=Math.floor(t/DAY_PERIOD);for(let k=n;k<n+40;k++){const st=stormOf(k);if(st&&st.s>t)return st;}return null;}
function lastStorm(t){const n=Math.floor(t/DAY_PERIOD);for(let k=n;k>n-40;k--){const st=stormOf(k);if(st&&st.s<=t)return st;}return null;}
function stormsSince(t0,t1){const out=[];for(let k=Math.floor(t0/DAY_PERIOD)-1;k<=Math.floor(t1/DAY_PERIOD);k++){const st=stormOf(k);if(st&&st.s<=t1&&st.e>=t0)out.push(st);}return out;}
/* strength through a storm: builds over the first quarter, holds through the middle half, eases off in the last quarter */
function monK(st,t){const p=(t-st.s)/(st.e-st.s);if(p<0||p>1)return 0;return p<.25?sm01(p/.25)**1.5:p<.75?1:sm01((1-p)/.25);}
function monNow(){if(WXT.force==='monsoon')return 1;if(WXT.force)return 0;const t=gNow(),st=stormAt(t);return st?monK(st,t):0;}
/* the swell and high cloud arrive ahead of a storm: 1 at its start, 0 six hours before */
function preStorm(){if(WXT.force)return WXT.force==='monsoon'?1:0;const t=gNow(),st=nextStorm(t);return st?sm01(1-(st.s-t)/(6*HOUR)):0;}
/* the wind backs as the system passes: up to about 70 degrees either side of the trade wind */
function stormVeer(st,t){const p=sm01((t-st.s)/(st.e-st.s));return (p-.5)*2.4;}

/* ---------- floods: priority flood on a 20px grid, so water fills each real hollow to its spill height ---------- */
let FLG=null;const FLC=20;
function floodGrid(){if(FLG)return FLG;let R=0;for(let i=0;i<64;i++)R=Math.max(R,iR(i/64*6.2832));R=Math.ceil(R/FLC)*FLC+FLC;
 const nx=Math.round(2*R/FLC)+1,N=nx*nx,h=new Float32Array(N),sp=new Float32Array(N),vis=new Uint8Array(N),x0=-R;
 for(let j=0;j<nx;j++)for(let i=0;i<nx;i++)h[j*nx+i]=hKey(x0+i*FLC,x0+j*FLC);
 /* binary heap of [level, cell] */
 const HL=[],HC=[];const push=(l,c)=>{let k=HL.length;HL.push(l);HC.push(c);while(k){const p=(k-1)>>1;if(HL[p]<=HL[k])break;[HL[p],HL[k]]=[HL[k],HL[p]];[HC[p],HC[k]]=[HC[k],HC[p]];k=p;}};
 const pop=()=>{const l=HL[0],c=HC[0],ll=HL.pop(),lc=HC.pop();if(HL.length){HL[0]=ll;HC[0]=lc;let k=0;for(;;){const a=2*k+1,b=a+1;let m=k;if(a<HL.length&&HL[a]<HL[m])m=a;if(b<HL.length&&HL[b]<HL[m])m=b;if(m===k)break;[HL[m],HL[k]]=[HL[k],HL[m]];[HC[m],HC[k]]=[HC[k],HC[m]];k=m;}}return[l,c];};
 for(let c=0;c<N;c++)if(h[c]<=0){vis[c]=1;sp[c]=0;push(0,c);}
 while(HL.length){const [l,c]=pop(),i=c%nx,j=(c-i)/nx;for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=i+di,b=j+dj;if(a<0||b<0||a>=nx||b>=nx)continue;const q=b*nx+a;if(vis[q])continue;vis[q]=1;sp[q]=Math.max(h[q],l);push(sp[q],q);}}
 /* depth to spill; the still pool already holds its own water, so its hollow is left out */
 const dep=new Float32Array(N);for(let c=0;c<N;c++){const i=c%nx,j=(c-i)/nx,x=x0+i*FLC,y=x0+j*FLC;if(Math.hypot(x-POOL.x,y-POOL.y)<110)continue;dep[c]=sp[c]-h[c];}
 /* each basin's deepest point, so a filling flood rises from the bottom */
 const bas=new Int32Array(N).fill(-1),bmax=[];for(let c=0;c<N;c++){if(dep[c]<.3||bas[c]>=0)continue;const id=bmax.length;let m=0;const st=[c];bas[c]=id;while(st.length){const q=st.pop();m=Math.max(m,dep[q]);const i=q%nx,j=(q-i)/nx;for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=i+di,b=j+dj;if(a<0||b<0||a>=nx||b>=nx)continue;const r=b*nx+a;if(bas[r]<0&&dep[r]>=.3){bas[r]=id;st.push(r);}}}bmax.push(m);}
 const cells=[];for(let c=0;c<N;c++)if(bas[c]>=0&&bmax[bas[c]]>=.6)cells.push(c);
 return FLG={nx,x0,dep,bas,bmax,cells};}
/* how full the hollows are, 0 to 1: rising through the storm's peak, holding, draining over six hours after */
/* the grid takes a moment to build; do it soon after load, not mid-storm */
setTimeout(()=>{try{floodGrid();}catch(e){}},5000);
function floodK(){if(WXT.force==='monsoon')return 1;const t=gNow(),st=lastStorm(t);if(!st)return 0;const d=st.e-st.s,p=(t-st.s)/d;
 if(p<.3)return 0;if(p<.6)return (p-.3)/.3;if(t<st.e)return 1;return sm01(1-(t-st.e)/(6*HOUR));}
function floodAt(x,y){const k=floodK();if(k<=0||SH.on)return 0;const G=floodGrid(),i=Math.round((x-G.x0)/FLC),j=Math.round((y-G.x0)/FLC);if(i<0||j<0||i>=G.nx||j>=G.nx)return 0;const c=j*G.nx+i,b=G.bas[c];if(b<0||G.bmax[b]<.6)return 0;return Math.max(0,G.dep[c]-(1-k)*G.bmax[b]);}
/* the water is an image with one pixel per grid cell, scaled up with smoothing, so its edge comes out soft and
   round instead of a row of circles. Rebuilt only when the level moves. Swales sit low, so one lift fits them. */
let FLIM=null,FLIMK=-1,FLLIFT=0;
function drawFlood(vw,vh){const k=floodK();if(k<=0)return;const G=floodGrid();
 if(!FLIM||Math.abs(k-FLIMK)>.02){FLIMK=k;FLIM=FLIM||document.createElement('canvas');FLIM.width=FLIM.height=G.nx;const f=FLIM.getContext('2d'),im=f.createImageData(G.nx,G.nx);let L=0,n=0;
  for(const c of G.cells){const d=G.dep[c]-(1-k)*G.bmax[G.bas[c]];if(d<=0)continue;const a=sm01(d/.7),dp=sm01(d/2.2),o=c*4;im.data[o]=118-40*dp;im.data[o+1]=170-35*dp;im.data[o+2]=190-15*dp;im.data[o+3]=255*(.15+.5*a);
   if(n<60){const i=c%G.nx,j=(c-i)/G.nx;L+=liftAt(G.x0+i*FLC,G.x0+j*FLC);n++;}}
  f.putImageData(im,0,0);FLLIFT=n?L/n:0;}
 ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(FLIM,G.x0-FLC/2,G.x0-FLC/2-FLLIFT,G.nx*FLC,G.nx*FLC);ctx.restore();
 /* rain on standing water: rings */
 if(WX.rain>.2){ctx.strokeStyle='rgba(235,245,250,.6)';ctx.lineWidth=1;ctx.beginPath();for(let q=0;q<G.cells.length;q+=3){const c=G.cells[q],i=c%G.nx,j=(c-i)/G.nx,x=G.x0+i*FLC,y=G.x0+j*FLC;if(Math.abs(x-cam.x)>vw||Math.abs(y-cam.y)>vh)continue;if(floodAt(x,y)<.6)continue;const ph=(now*1.3+hash1(c))%1,r=2+ph*7,yl=y-liftAt(x,y)+(hash1(c*3)-.5)*12,xx=x+(hash1(c*7)-.5)*14;ctx.moveTo(xx+r,yl);ctx.ellipse(xx,yl,r,r*.5,0,0,6.2832);}ctx.globalAlpha=.6*WX.rain;ctx.stroke();ctx.globalAlpha=1;}}

/* ---------- windfall: old big wobble trees come down, worked through every storm in order ---------- */
let WFC=null,WFT=0;
function wfKey(st,t){return st.id+':'+t.seed;}
/* every storm in the last fortnight, oldest first; a tree is a candidate only if it has grown back from any earlier fall */
function windfalls(){const t=gNow();if(WFC&&Math.abs(t-WFT)<4000)return WFC;WFT=t;const out=[],gone={};
 for(const st of stormsSince(t-14*DAY_PERIOD,t)){const cand=trees.filter(tr=>{const g=gone[tr.seed];return !g||t>0&&growAt(g,st.s)>=.95;}).map(tr=>({tr,sc:tr.s+hash1(tr.seed*1.3+st.id)*.12}));
  cand.sort((a,b)=>b.sc-a.sc);const n=2+(hash1(st.id*.77)<.45?1:0);
  for(const {tr} of cand.slice(0,n)){const fall=st.s+(.35+.3*hash1(tr.seed+st.id))*(st.e-st.s),key=wfKey(st,tr),rec=(S.wf||{})[key]||{};
   const ang=Math.PI+stormVeer(st,fall)+(hash1(tr.seed*2.1+st.id)-.5)*.6,end=rec.c||fall+ROT;const w={key,st,tr,fall,end,ang,rec,len:78*tr.s};
   gone[tr.seed]=w;out.push(w);}}
 return WFC=out;}
/* sapling growth after a fallen tree is cleared or has rotted: .2 to 1 over a day and a half */
function growAt(w,t){if(t<w.fall)return 1;if(t<w.end)return 0;return .2+.8*sm01((t-w.end)/REGROW_WF);}
function wfFor(tr){let last=null;for(const w of windfalls())if(w.tr===tr&&w.fall<=gNow())last=w;return last;}
/* lying: fallen and not yet cleared or rotted */
function wfLying(){const t=gNow();return windfalls().filter(w=>t>=w.fall&&t<w.end);}
function treeGrow(tr){const w=wfFor(tr);return w?growAt(w,gNow()):1;}
/* rot: sound for a day, worn the second, failing the third */
function wfStage(w){const a=(gNow()-w.fall)/DAY_PERIOD;return a<1?0:a<2?1:2;}
function wfSections(w){return Math.round(2+w.tr.s*1.5);}
function wfBranches(w){return wfStage(w)>=2?0:Math.max(0,(wfStage(w)?2:3)-(w.rec.b||0));}
function wfNeed(w){return w.tr.s>=1.1?6:w.tr.s>=1?3:1;}
function wfPts(w){const c=Math.cos(w.ang),s=Math.sin(w.ang)*.7,pts=[];for(let i=0;i<=6;i++){const u=i/6;pts.push([w.tr.x+c*w.len*u,w.tr.y+s*w.len*u]);}return pts;}
function wfSeg(w,from){const left=wfSections(w)-(w.rec.n||0),u0=from?1-left/wfSections(w):0;const c=Math.cos(w.ang),s=Math.sin(w.ang)*.7;return[[w.tr.x+c*w.len*u0,w.tr.y+s*w.len*u0],[w.tr.x+c*w.len*.82,w.tr.y+s*w.len*.82]];}
function wfSave(w,f){S.wf=S.wf||{};const r=S.wf[w.key]=S.wf[w.key]||{};f(r);w.rec=r;if(wfBranches(w)<=0&&(r.n||0)>=wfSections(w)){r.c=gNow();w.end=r.c;S.st.windfall=(S.st.windfall||0)+1;WFC=null;think(pick(['That’s the last of it. The path’s clear again.','Cleared. A sapling will have the spot soon enough.']));}save();}
function drawWindfall(w){const raw=wfPts(w),st=wfStage(w),pts=raw.map(([x,y])=>[x,y-liftAt(x,y)]),s=w.tr.s,left=wfSections(w)-(w.rec.n||0),cut=1-left/wfSections(w);
 const bark=['#6b5a4a','#7d6f62','#8d8794'][st],leaf=['#5fb35a','#9a9a4a','#8a7a5a'][st];
 /* root plate, torn up on its edge at the base */
 if(!w.rec.n){const [bx,by]=pts[0];sketch(ell(bx-Math.cos(w.ang)*6,by-10*s,14*s,16*s,10),true,w.tr.seed+70,1.2,'#7a5e44',INK,2.4);for(let i=0;i<4;i++)ln([[bx-Math.cos(w.ang)*6,by-10*s],[bx-Math.cos(w.ang)*6+(i-1.5)*9*s,by-24*s+i%2*6]],w.tr.seed+71+i,2,INK,.6);}
 /* the trunk, shortened as sections are bucked from the root end */
 const k0=Math.min(5,Math.floor(cut*6)),tp=pts.slice(k0);if(tp.length>1){const rm=raw[Math.min(5,k0+2)];shadow(rm[0],rm[1]+3,Math.max(8,w.len*.3*(1-cut)),5*s,8);ln(tp,w.tr.seed+80,13*s,INK,1);ln(tp,w.tr.seed+80,9*s,bark,1);if(st)for(let i=1;i<tp.length;i+=2)dot(tp[i][0],tp[i][1]-1,2.2*s,st>1?'#7fa060':'#9a8a70');}
 /* the crown at the far end: leaves fade and fall as it rots; gathered branches thin it */
 const nb=wfBranches(w);if(st<2||nb){const [cx,cy]=pts[6],n=2+nb*2;for(let i=0;i<n;i++){const a=w.ang+(i-n/2)*.5;blob(cx+Math.cos(a)*14*s,cy+Math.sin(a)*8*s-6*s,(13-st*3)*s,(10-st*2)*s,w.tr.seed+90+i,leaf,1.8,1);}}}
function windfallObjects(o){for(const w of wfLying()){const p=wfPts(w)[3],nb=wfBranches(w),left=wfSections(w)-(w.rec.n||0),h=hasHatchet();
 const buck=left>0?{l:'Buck the trunk',f:()=>buckWF(w)}:null,gath=nb>0?{l:'Gather branches',f:()=>gatherWF(w)}:null;const first=gath||buck;
 o.push({x:p[0],y:p[1],r:34*w.tr.s,name:'Fallen wobble tree',key:'windfall',act:first?first.l.split(' ')[0]:null,onAct:first?first.f:null,more:gath&&buck?[buck]:null,
  onExamine:()=>{discover('windfall');const st=wfStage(w);think(st===0?'The storm pulled it up by the roots. It still sighs, a little.':st===1?'The leaves have gone brown. It is quieter now.':'Soft and grey, with grubs in it. A day more and it’s gone.');}});}}
function gatherWF(w){const p=wfPts(w)[6],c=clampLand(p[0]+(P.x<p[0]?-24:24),p[1]+8);routeTo(c[0],c[1],()=>{if(wfBranches(w)<=0){think('Nothing left in the crown worth taking.');return;}
 const n=wfStage(w)?2:3;if(!canAdd('br_wobble',n)){think('No room in my pack for the branches.');return;}addItem('br_wobble',n);sfx('grab');flies.push({id:'misc',img:'br_wobble',x0:p[0],y0:p[1],t:0});
 const first=!hasSkill('foraging');if(first){unlockSkill('foraging');toast('New skill: Foraging');}addXP('foraging',4,first?'first':'normal',[p[0],p[1]-30]);discover('windfall');wfSave(w,r=>{r.b=(r.b||0)+1;});});}
function buckWF(w){const L=lv('woodcutting');if(!hasHatchet()){think('A trunk that size wants a hatchet. The branches I can manage by hand.');return;}
 if(L<wfNeed(w)){think('Too thick for me yet. Woodcutting '+wfNeed(w)+', maybe. The branches are fair game.');return;}
 const [a]=wfSeg(w,1),pt={x:a[0],y:a[1],s:w.tr.s*.8,lean:0,seed:w.tr.seed+500,wf:w};const c=clampLand(a[0]+(P.x<a[0]?-26:26),a[1]+8);routeTo(c[0],c[1],()=>startChop(pt));}
/* a bucked section: a wobble log, more with Woodcutting 10; a rotting trunk gives grubs (bait) as often as wood */
function buckDone(T){const t=T.tree,w=t.wf;P.task=null;if((w.rec.n||0)>=wfSections(w))return;const st=wfStage(w),L=lv('woodcutting');
 const log=st<2||Math.random()<.5,n=log?(L>=10&&st<1?2:1):0;if(log&&!canAdd('wobble',n)){think('My pack is full. Nowhere to put a log.');return;}
 if(log){addItem('wobble',n);flies.push({id:'misc',img:'wobble',x0:t.x,y0:t.y-20,t:0});}if(st===2&&canAdd('bait')){addItem('bait',1);pop('+1 grubs',t.x,t.y-50,'#fff',16);}
 addXP('woodcutting',T.miss?7:9,'normal',[t.x,t.y-30]);if(!T.miss)burst('woodcutting','Clean log',10,[t.x,t.y-60]);for(let i=0;i<8;i++)chips.push({x:t.x,y:t.y-10,vx:(Math.random()-.5)*120,vy:-60-Math.random()*90,t:0});
 think(st===2?'It falls apart more than it cuts. Grubs everywhere.':pick(['A clean round off the trunk.','One more length bucked. My shoulders know it.']));wfSave(w,r=>{r.n=(r.n||0)+1;});}
/* lying trunks slow you down: you climb over, or go round */
function wfBlock(x,y){for(const w of wfLying()){const left=wfSections(w)-(w.rec.n||0);if(left<=0)continue;const [a,b]=wfSeg(w,1),dx=b[0]-a[0],dy=b[1]-a[1],l2=dx*dx+dy*dy||1,u=sm01(((x-a[0])*dx+(y-a[1])*dy)/l2),px=a[0]+dx*u,py=a[1]+dy*u;if(Math.hypot(x-px,y-py)<9*w.tr.s)return w;}return null;}

/* ---------- storm wash-ups and fish thrown ashore ---------- */
const STORMWASH=[['wood',26,4],['kelp',16,3],['driftlog',12,8],['crate',9,8],['net',8,6],['timber',9,10],['shells',10,5],['wobble',10,10]];
function rollStormWash(){const tot=STORMWASH.reduce((a,x)=>a+x[1],0);let r=Math.random()*tot;for(const [k,wt] of STORMWASH){if((r-=wt)<0)return k;}return 'wood';}
function washXP(id){const e=WASH.find(x=>x[0]===id)||STORMWASH.find(x=>x[0]===id);return e?e[2]:4;}
let fishT=4;
function stormFish(dt){const m=monNow();if(m<.8||SH.on||C||ccOn)return;fishT-=dt;if(fishT>0)return;fishT=5+Math.random()*6;S.ground=S.ground||[];if(S.ground.filter(g=>g.storm).length>=7)return;
 /* near the shore you are facing: up the beach, or into a flooded hollow if one is close */
 for(let k=0;k<12;k++){const a=Math.atan2(P.y,P.x)+(Math.random()-.5)*1.4,i=iR(a),r=i-12-Math.random()*90,x=Math.cos(a)*r,y=Math.sin(a)*r;if(!walkable(x,y)||onDock(x,y))continue;
  const id=Math.random()<.7?'minnow':Math.random()<.75?'perch':'grump';S.ground.push({x,y,it:{id},exp:Date.now()+8*60000,storm:1});return;}}
function stormFishPicked(g){S.st.stormfish=(S.st.stormfish||0)+1;const first=!hasSkill('foraging');if(first){unlockSkill('foraging');toast('New skill: Foraging');}addXP('foraging',3,first?'first':'normal',[g.x,g.y-20]);discover('stormfish');}

/* ---------- reading the sky, by Survival level ---------- */
let WXL=0;/* test build: a Survival level override for the sky reading */
function survL(){return Math.max(lv('survival'),WXL);}
const LEADH=[0,1,2,3,5,7,9,12,15,18];
function whenWords(t){const h=(t-gNow())/HOUR;if(h<1.5)return 'within the hour or so';if(h<4)return 'in a few hours';const d=((t/DAY_PERIOD)%1);return d<.2||d>.85?'by tonight':d<.45?'by morning':d<.7?'by midday':'by evening';}
let readT=1;
function wxRead(dt){if((readT-=dt)>0||ccOn)return;readT=2;S.wx=S.wx||{};S.wx.r=S.wx.r||{};const t=gNow(),L=survL(),ns=nextStorm(t),cur=stormAt(t);
 if(cur&&!S.wx.r[cur.id]&&!SH.on){S.wx.r[cur.id]=2;think('The wind is coming up hard, out of nowhere. Something big is on its way.');}
 if(ns&&!S.wx.r[ns.id]){const h=(ns.s-t)/HOUR;if(h>0&&h<=LEADH[L-1]){S.wx.r[ns.id]=1;S.st.sawstorm=1;
  think(L<4?'The swell is long and heavy, and the gulls are all flying inland. I don’t like it.':L<7?'Long swell, high streaky cloud, gulls coming in. A big blow, '+whenWords(ns.s)+'.':'A monsoon, about '+Math.max(1,Math.round(h))+' hours out. Wood off the low ground, and no fires worth keeping.');}}
 /* the daily shower: from Survival 3, an hour's warning, more with level */
 if(L>=3&&S.wx.sr!==S.dayN){const sh=showerOf(Math.floor(t/DAY_PERIOD));if(sh&&sh.s>t&&(sh.s-t)/HOUR<=Math.min(3,L-2)&&!stormAt(sh.s)){S.wx.sr=S.dayN;think(pick(['Rain '+whenWords(sh.s)+'. A light one, by the look of it.','Those clouds are stacking up. A shower '+whenWords(sh.s)+'.']));}}
 /* the peak of a monsoon, ridden out on the Key */
 if(cur&&monK(cur,t)>=.99&&!SH.on&&!S.st.rodeout){S.st.rodeout=1;think('So this is a monsoon. Hold on to something.');}
 /* prune old windfall records */
 if(S.wf)for(const k in S.wf){const id=+k.split(':')[0];if(id<Math.floor(t/DAY_PERIOD)-16)delete S.wf[k];}}
/* Brimble calls out when you come near his camp before a monsoon */
function brimbleWarn(){S.wx=S.wx||{};S.wx.b=S.wx.b||{};const t=gNow(),ns=nextStorm(t),cur=stormAt(t);if(SH.on||ccOn||!S.metWick)return;
 const st=cur||(ns&&(ns.s-t)<=8*HOUR?ns:null);if(!st||S.wx.b[st.id]||Math.hypot(P.x-FIRE.x,P.y-FIRE.y)>320)return;S.wx.b[st.id]=1;pop(cur?'Hold on to your hat!':'Big blow coming!',FIRE.x,FIRE.y-90,'#ffcf3a',19);sfx('stoke');}
function brimbleStormLine(){const t=gNow(),ns=nextStorm(t),cur=stormAt(t);if(cur)return 'Hear that? That’s a monsoon, and I’m a flame in a teapot. Lid on, chin up. Stay off the low ground; it fills.';
 if(ns&&(ns.s-t)<=8*HOUR)return 'My smoke won’t rise straight and my ash won’t settle. A monsoon’s coming, '+whenWords(ns.s)+'. Old trees will come down. The sea will throw up all sorts.';return null;}
/* gulls flying inland ahead of a storm: a few small v's crossing toward the hill */
function drawStormGulls(){const k=preStorm()*(1-monNow());if(k<.2||SH.on)return;ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.globalAlpha=Math.min(1,k*1.4);ctx.beginPath();
 for(let i=0;i<5;i++){const ph=((now*.04+i*.21)%1),a=i*1.3+.4,r=(1-ph)*900+80,x=HILL.x+Math.cos(a)*r,y=HILL.y+Math.sin(a)*r*.7-60-i*14,f=Math.sin(now*8+i)*3;ctx.moveTo(x-7,y-f);ctx.quadraticCurveTo(x-3,y-4,x,y);ctx.quadraticCurveTo(x+3,y-4,x+7,y-f);}
 ctx.stroke();ctx.globalAlpha=1;}
/* per frame on the Key */
function stormTick(dt){wxRead(dt);if(!SH.on){brimbleWarn();stormFish(dt);}}
/* walking: headwind in a storm, wading through flood water, climbing over a trunk */
let climbSaid=0;
function stormWalkK(x,y,ux,uy){let k=1;const m=monNow();if(m>.2){const d=ux*Math.cos(WX.wa)+uy*Math.sin(WX.wa);if(d<0)k*=1+.38*m*d;}
 const f=floodAt(x,y);if(f>.3)k*=1-Math.min(.5,f*.1);const w=wfBlock(x,y);if(w){k*=.35;if(!climbSaid){climbSaid=1;think('Over the trunk. Not gracefully.');}}return k;}
