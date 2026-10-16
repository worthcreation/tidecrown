/* ---------- the shell hatchet ----------
   The Key is sand: no flint, almost no stone. Islanders on low sandy atolls made adze blades from giant clam shell,
   the thick hinge ground down on rock with sand and seawater. Here: pry an empty giant clam shell off a reef with a
   driftwood stick, grind its hinge on the rocks (wet sand does the cutting; slow, and progress keeps between visits),
   then lash the blade to driftwood with kelp twine. */
const GRIND_N=48,CLAM_BACK=15*60000;
var GRD=null,grindDust=[];
/* the three reefs nearest the Key each hold one old, empty shell; prying it out leaves room for another to show later */
var CLAMS=null;
function clams(){if(!CLAMS)CLAMS=KFEAT.filter(f=>f.kind==='reef').sort((a,b)=>Math.hypot(a.x,a.y)-Math.hypot(b.x,b.y)).slice(0,3).map((f,i)=>({i,x:f.x+f.rx*.15,y:f.y,seed:300+i}));return CLAMS;}
function clamHere(c){return !((S.clam||{})[c.i]>Date.now()-CLAM_BACK);}
/* flint from older saves becomes a blade, so nobody loses their start */
for(const it of S.inv)if(it.id==='flint')it.id='shellblade';
function clamObjects(o){for(const c of clams()){if(!clamHere(c))continue;o.push({x:c.x,y:c.y-6,r:22,name:'Giant clam shell',key:'clam',act:'Pry it loose',onAct:()=>walkStraight(c.x-18,c.y+6,()=>pryClam(c)),onExamine:()=>{discover('clam');think(pick(['An old giant clam shell, long empty, wedged into the reef. The hinge is thick as my wrist.','Ribbed and heavy. Nothing lives in it now.']));}});}}
function pryClam(c){if(!clamHere(c))return;if(Math.hypot(P.x-c.x,P.y-c.y)>60){think('I need to stand right by it.');return;}
 if(!(cnt('wood')>0)){think(pick(['Wedged fast in the reef. I need something to lever it with.','My fingers will not shift it. A stick, maybe.']));return;}
 if(!canAdd('clamshell')){think('No room in my pack.');return;}
 S.clam=S.clam||{};S.clam[c.i]=Date.now();addItem('clamshell');sfx('scrape');flies.push({id:'misc',img:'clamshell',x0:c.x,y0:c.y,t:0});discover('clam');
 const first=!hasSkill('foraging');if(first){unlockSkill('foraging');discover('foraging');toast('New skill: Foraging');}addXP('foraging',4,first?'first':'normal',[c.x,c.y-20]);
 think(pick(['The stick bends, the reef gives, and it is mine. Heavy.','Out it comes. That hinge could take an edge.']));save();}
/* grinding: walk up to a rock with a shell in the pack, then tap near yourself, steady strokes */
function grindAct(k){return cnt('clamshell')>0?'Grind a shell':null;}
/* regrinding the longaxe's edge: the same rock, a dozen strokes */
function startAxeGrind(k){const c=clampLand(k.x+(SH.on?36:0)-(SH.on?0:Math.sign(k.x)*22),k.y+(SH.on?10:8));routeTo(c[0],c[1],()=>{if(!axeGrindAct())return;GRD={k,last:0,rock:0,mode:'axe',n:0};P.face=k.x>P.x?1:-1;think('Wet sand on the rock, the edge flat to it. Steady strokes.');});}
function startGrind(k){const c=clampLand(k.x+(SH.on?36:0)-(SH.on?0:Math.sign(k.x)*22),k.y+(SH.on?10:8));routeTo(c[0],c[1],()=>{if(!(cnt('clamshell')>0))return;GRD={k,last:0,rock:0};P.face=k.x>P.x?1:-1;
 if(!S.st.grindHint){S.st.grindHint=1;hint('Tap near yourself to grind. Wet sand on the rock does the cutting. You can stop and come back.',7000);}think((S.grind||0)>0?'Back to it. The edge is where I left it.':'Wet sand, a flat rock, and patience.');});}
function grindStroke(){if(!GRD)return;if(now-GRD.last<.2)return;GRD.last=now;GRD.rock=1;if(GRD.mode==='axe'){GRD.n++;sfx('scrape',.7);hap(4);for(let i=0;i<3;i++)grindDust.push({x:GRD.k.x+(Math.random()-.5)*14,y:GRD.k.y-6,vx:(Math.random()-.5)*40,vy:-20-Math.random()*30,t:0});if(GRD.n>=12){GRD=null;axeGrindDone();}return;}if(!(cnt('clamshell')>0)){GRD=null;return;}
 S.grind=(S.grind||0)+1;sfx('scrape',.7);hap(4);for(let i=0;i<3;i++)grindDust.push({x:GRD.k.x+(Math.random()-.5)*14,y:GRD.k.y-6,vx:(Math.random()-.5)*40,vy:-20-Math.random()*30,t:0});
 const g=S.grind;if(g===12)think('A pale line where the hinge is wearing through.');else if(g===24)think('Halfway. My arms know it.');else if(g===36)think('It is starting to look like an edge.');
 if(g>=GRIND_N){S.grind=0;takeItem('clamshell');addItem('shellblade');flies.push({id:'misc',img:'shellblade',x0:GRD.k.x,y0:GRD.k.y,t:0});discover('shellblade');sfx('burst');GRD=null;think('A blade. Ground out of a shell, by hand. Now something to hold it.');}
 save();}
function drawGrind(){grindDust=grindDust.filter(d=>(d.t+=1/60)<.5);for(const d of grindDust){ctx.globalAlpha=1-d.t*2;dot(d.x+d.vx*d.t,d.y+d.vy*d.t+60*d.t*d.t,1.6,'#e9dcc0');}ctx.globalAlpha=1;
 if(!GRD)return;GRD.rock=Math.max(0,GRD.rock-.08);const k=GRD.k,x=k.x+Math.sin(now*14)*3*GRD.rock,y=k.y-k.ry*.4;ctx.drawImage(iconImg('clamshell'),x-12,y-14,24,24);
 const p=(S.grind||0)/GRIND_N;if(p>0)ln([[x-8,y-6],[x-8+16*p,y-6]],990,2,'#fffaf0',.2);}
/* clams on the reefs, drawn half sunk */
function drawClams(){if(SH.on)return;for(const c of clams()){if(!clamHere(c))continue;const b=Math.sin(now*1.1+c.i)*1;drawClamShell(c.x,c.y+b,.8,c.seed);ctx.globalAlpha=.35;sketch(ell(c.x,c.y+8,20,5,10),true,c.seed+5,1,null,'#fff',1.4);ctx.globalAlpha=1;}}
function drawClamShell(x,y,s,seed){const pts=[];for(let i=0;i<=10;i++){const a=Math.PI+i/10*Math.PI,w=i%2?1:.9;pts.push([x+Math.cos(a)*22*s*w,y+Math.sin(a)*15*s*w]);}pts.push([x+6*s,y+4*s],[x-6*s,y+4*s]);
 sketch(pts,true,seed,.6,'#efe6d2',INK,2.2);for(let i=1;i<5;i++){const a=Math.PI+i/5*Math.PI;ln([[x,y+2*s],[x+Math.cos(a)*19*s,y+Math.sin(a)*13*s]],seed+i,1.4,'rgba(42,33,64,.45)',.3);}ln([[x-12*s,y-2*s],[x+12*s,y-2*s]],seed+9,1.2,'rgba(150,120,170,.5)',.4);}
