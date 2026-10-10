/* The Shadow Forest: a collection of islands, each its own kind (maze, grove, clearing, fallow), some bridged, most reached by swimming. Its own scene and coordinates; the Key's code is untouched. Travel from the Key is a placeholder rowboat, or the long swim east. */
const ISLES=[
 {x:0,y:920,rx:430,ry:320,kind:'grove',name:'Landing',landing:1},
 {x:0,y:0,rx:620,ry:520,kind:'maze',name:'The Maze'},
 {x:-1180,y:-200,rx:430,ry:380,kind:'maze',name:'The Lesser Maze'},
 {x:1260,y:300,rx:470,ry:390,kind:'fallow',name:'The Fallow'},
 {x:0,y:-1250,rx:520,ry:290,kind:'fallow',name:'The Hollow’s Isle',hollow:1},
 {x:-950,y:-1150,rx:270,ry:210,kind:'clearing',name:'The Clearing'},
 {x:1150,y:-900,rx:250,ry:210,kind:'grove',name:'The Far Grove'}];
const BRIDGES=[{v:1,x:0,y0:500,y1:620,hw:16},{v:0,y:336,x0:440,x1:810,hw:16}];
function onIsle(x,y){for(const I of ISLES){const u=(x-I.x)/I.rx,v=(y-I.y)/I.ry;if(u*u+v*v<=1)return I;}return null;}
function onBridge(x,y){return BRIDGES.some(B=>B.v?(Math.abs(x-B.x)<=B.hw&&y>=B.y0&&y<=B.y1):(Math.abs(y-B.y)<=B.hw&&x>=B.x0&&x<=B.x1));}
function shIsle(x,y){return !!onIsle(x,y)||onBridge(x,y);}
/* depth of water past the nearest shore, roughly: 0 on land, grows offshore. Used for wading. */
function shDepth(x,y){if(shIsle(x,y))return 0;let best=1e9;for(const I of ISLES){const u=(x-I.x)/I.rx,v=(y-I.y)/I.ry,k=Math.hypot(u,v);if(k<=1)return 0;const d=(k-1)*Math.min(I.rx,I.ry);if(d<best)best=d;}return best;}

/* one cell grid lies over the whole cluster; a cell belongs to whichever island is under its centre. Maze walls exist only on maze islands. */
/* odd counts so a cell sits centred on (0,0): the bridges run through cell middles, never along a wall line */
const CELL=84,MC=45,MR=41,MX0=-MC*CELL/2,MY0=-MR*CELL/2;
function cellC(i,j){return [MX0+(j+.5)*CELL,MY0+(i+.5)*CELL];}
function cellOf(x,y){return [Math.floor((y-MY0)/CELL),Math.floor((x-MX0)/CELL)];}
function inMaze(i,j){return i>=0&&i<MR&&j>=0&&j<MC;}
function isleAtCell(i,j){const c=cellC(i,j);for(const I of ISLES){const u=(c[0]-I.x)/I.rx,v=(c[1]-I.y)/I.ry;if(u*u+v*v<=.86)return I;}return null;}
function zoneOf(i,j){const I=isleAtCell(i,j);return I?I.kind:'sea';}
function cellLand(i,j){return !!isleAtCell(i,j);}
const MZ=[];{const r=mulberry(77);for(let i=0;i<MR;i++){MZ.push([]);for(let j=0;j<MC;j++)MZ[i].push([1,1,1,1]);}
 const seen=[];for(let i=0;i<MR;i++){seen.push([]);for(let j=0;j<MC;j++)seen[i].push(!cellLand(i,j));}
 const D=[[-1,0,0,2],[0,1,1,3],[1,0,2,0],[0,-1,3,1]];let st=[];
 for(let i=0;i<MR;i++)for(let j=0;j<MC;j++){if(seen[i][j]||zoneOf(i,j)!=='maze')continue;st=[[i,j]];seen[i][j]=true;
 while(st.length){const [i,j]=st[st.length-1];const opts=D.filter(([di,dj])=>inMaze(i+di,j+dj)&&!seen[i+di][j+dj]);
  if(!opts.length){st.pop();continue;}const [di,dj,w,ow]=opts[Math.floor(r()*opts.length)];MZ[i][j][w]=0;MZ[i+di][j+dj][ow]=0;seen[i+di][j+dj]=true;st.push([i+di,j+dj]);}}
 for(let k=0;k<60;k++){const i=1+Math.floor(r()*(MR-2)),j=1+Math.floor(r()*(MC-2));if(cellLand(i,j)&&cellLand(i,j+1)){MZ[i][j][1]=0;MZ[i][j+1][3]=0;}}
 for(let i=0;i<MR;i++)for(let j=0;j<MC;j++){if(zoneOf(i,j)==='maze'&&cellLand(i,j))continue;MZ[i][j]=[0,0,0,0];for(const [di,dj,w,ow] of D){if(inMaze(i+di,j+dj))MZ[i+di][j+dj][ow]=0;}}
 for(let i=0;i<MR;i++)for(let j=0;j<MC;j++){if(!cellLand(i,j))continue;const w=MZ[i][j],mz=zoneOf(i,j)==='maze';if(i===0||!cellLand(i-1,j))w[0]=mz?1:0;if(i===MR-1||!cellLand(i+1,j))w[2]=mz?1:0;if(j===0||!cellLand(i,j-1))w[3]=mz?1:0;if(j===MC-1||!cellLand(i,j+1))w[1]=mz?1:0;}}
const WALLW=16;
function nearWall(x,y){const [i,j]=cellOf(x,y);for(let a=i-1;a<=i+1;a++)for(let b=j-1;b<=j+1;b++){if(!inMaze(a,b))continue;const w=MZ[a][b],x0=MX0+b*CELL,y0=MY0+a*CELL,x1=x0+CELL,y1=y0+CELL;
 if(w[0]&&Math.abs(y-y0)<WALLW&&x>x0-WALLW&&x<x1+WALLW)return true;if(w[2]&&Math.abs(y-y1)<WALLW&&x>x0-WALLW&&x<x1+WALLW)return true;
 if(w[3]&&Math.abs(x-x0)<WALLW&&y>y0-WALLW&&y<y1+WALLW)return true;if(w[1]&&Math.abs(x-x1)<WALLW&&y>y0-WALLW&&y<y1+WALLW)return true;}return false;}
const HOLLOW={x:ISLES[4].x,y:ISLES[4].y,r:120};
{const I=ISLES[1];const [bi,bj]=cellOf(I.x,I.y+I.ry*.9);for(let i=bi;i>bi-3;i--)if(inMaze(i,bj)&&zoneOf(i,bj)==='maze'){MZ[i][bj][2]=0;if(inMaze(i+1,bj))MZ[i+1][bj][0]=0;}const ti=cellOf(0,336)[0];let tj=cellOf(I.x,336)[1];while(inMaze(ti,tj+1)&&isleAtCell(ti,tj+1)===I)tj++;MZ[ti][tj][1]=0;if(inMaze(ti,tj+1))MZ[ti][tj+1][3]=0;}
const SHROCK={x:ISLES[0].x-ISLES[0].rx*.8,y:ISLES[0].y+ISLES[0].ry*.3,rx:30,ry:18,seed:66};
function shWalkable(x,y){if(!shIsle(x,y))return false;if(Math.hypot(x-SHROCK.x,y-SHROCK.y)<28)return false;if(nearWall(x,y))return false;const hx=(x-HOLLOW.x)/205,hy=(y-HOLLOW.y)/78;if(hx*hx+hy*hy<1)return false;return true;}
function shClamp(x,y){if(shWalkable(x,y))return [x,y];for(let r=8;r<160;r+=8)for(let a=0;a<6.28;a+=.5){const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(shWalkable(px,py))return [px,py];}return [P.x,P.y];}

/* routing: a walkability grid over the whole cluster, breadth-first. Rebuilt when a wall opens. */
const GR=24,GX0=-2200,GY0=-2100,GW=Math.ceil(4400/GR),GH=Math.ceil(4200/GR);let grid=null;
function gridBuild(){grid=new Uint8Array(GW*GH);for(let j=0;j<GH;j++)for(let i=0;i<GW;i++)grid[j*GW+i]=shWalkable(GX0+(i+.5)*GR,GY0+(j+.5)*GR)?1:0;}
function gcell(x,y){return [Math.floor((x-GX0)/GR),Math.floor((y-GY0)/GR)];}
function gnear(x,y){const [i,j]=gcell(x,y);if(i>=0&&j>=0&&i<GW&&j<GH&&grid[j*GW+i])return [i,j];for(let r=1;r<10;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.abs(a)!==r&&Math.abs(b)!==r)continue;const ii=i+a,jj=j+b;if(ii>=0&&jj>=0&&ii<GW&&jj<GH&&grid[jj*GW+ii])return [ii,jj];}return null;}
function shRoute(x,y,then){P.task=null;if(!grid)gridBuild();const s0=gnear(P.x,P.y),t0=gnear(x,y),path=[];
 if(s0&&t0&&(s0[0]!==t0[0]||s0[1]!==t0[1])){const prev=new Int32Array(GW*GH).fill(-1),q=[s0[1]*GW+s0[0]];prev[q[0]]=q[0];const T=t0[1]*GW+t0[0];let found=false,qi=0;
  while(qi<q.length){const c=q[qi++];if(c===T){found=true;break;}const ci=c%GW,cj=(c-ci)/GW;for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){const ii=ci+di,jj=cj+dj;if(ii<0||jj<0||ii>=GW||jj>=GH)continue;const n=jj*GW+ii;if(!grid[n]||prev[n]>=0)continue;prev[n]=c;q.push(n);}}
  if(found){const cells=[];let c=T;while(prev[c]!==c){cells.unshift(c);c=prev[c];}
   let last=null,dir=null;cells.forEach(c=>{const ci=c%GW,cj=(c-ci)/GW;const d=last?(ci-last[0])+','+(cj-last[1]):null;if(last&&d!==dir)path.push([GX0+(last[0]+.5)*GR,GY0+(last[1]+.5)*GR]);dir=d;last=[ci,cj];});}}
 path.push([x,y]);P.path=path;P.then=then||null;P.pathT=0;mark={x,y,t:0};}

const BOAT_KEY={x:DOCK.x1-10,y:DOCK.y1+22},BOAT_SH={x:ISLES[0].x,y:ISLES[0].y+ISLES[0].ry*.75};
/* trees. Walls of maze zones are rows of black trees; groves have scattered ones; the islets have their own. The middle tree of a wall holds it. Cuts are saved and nothing grows back here. */
const shTrees=[];{const r=mulberry(78);for(let i=0;i<MR;i++)for(let j=0;j<MC;j++){if(!cellLand(i,j))continue;const w=MZ[i][j],x0=MX0+j*CELL,y0=MY0+i*CELL,z=zoneOf(i,j);
 let wk=0;const row=(ax,ay,bx,by)=>{const n=4;for(let k=0;k<=n;k++){const t=k/n;shTrees.push({x:ax+(bx-ax)*t+(r()-.5)*8,y:ay+(by-ay)*t+(r()-.5)*8,s:.8+r()*.4,seed:5000+i*40+j*5+k+wk*2000,lean:0,sh:1,wall:[i,j,wk],mid:k===2});}};
 wk=0;if(w[0])row(x0,y0,x0+CELL,y0);wk=3;if(w[3])row(x0,y0,x0,y0+CELL);wk=2;if(w[2]&&(i===MR-1||!cellLand(i+1,j)))row(x0,y0+CELL,x0+CELL,y0+CELL);wk=1;if(w[1]&&(j===MC-1||!cellLand(i,j+1)))row(x0+CELL,y0,x0+CELL,y0+CELL);
 if(z==='grove'&&r()<.75){const n=1+Math.floor(r()*2);for(let k=0;k<n;k++)shTrees.push({x:x0+12+r()*(CELL-24),y:y0+12+r()*(CELL-24),s:.9+r()*.5,seed:9000+i*40+j*5+k,lean:0,sh:1,grove:1});}}
 ISLES.forEach((I,n)=>{const ring=Math.round((I.rx+I.ry)/14);for(let k=0;k<ring;k++){const a=r()*6.28,d=.86+r()*.1,x=I.x+Math.cos(a)*I.rx*d,y=I.y+Math.sin(a)*I.ry*d;if(nearWall(x,y)||onBridge(x,y)||Math.abs(y-336)<40&&x>400||Math.abs(x)<40&&y>460&&y<660||Math.hypot(x-BOAT_SH.x,y-BOAT_SH.y)<90)continue;shTrees.push({x,y,s:.9+r()*.5,seed:12000+n*200+k,lean:0,sh:1,ring:1});}
  if(I.kind==='clearing')for(let k=0;k<6;k++){const a=r()*6.28,d=.5+r()*.3;shTrees.push({x:I.x+Math.cos(a)*I.rx*d,y:I.y+Math.sin(a)*I.ry*d,s:.9+r()*.5,seed:14000+n*100+k,lean:0,sh:1,ring:1});}});}
function shOpen([i,j,wk]){MZ[i][j][wk]=0;const D=[[-1,0,2],[0,1,3],[1,0,0],[0,-1,1]][wk],a=i+D[0],b=j+D[1];if(inMaze(a,b))MZ[a][b][D[2]]=0;grid=null;}
function shChop(t){const i=shTrees.indexOf(t);if(i<0)return;S.shCut=S.shCut||{};S.shCut[t.seed]=1;if(t.wall&&t.mid){shOpen(t.wall);think('That one was holding the wall. A way through.');}shTrees.splice(i,1);}
{const cut=S.shCut||{};for(let i=shTrees.length-1;i>=0;i--){const t=shTrees[i];if(!cut[t.seed])continue;if(t.wall&&t.mid)shOpen(t.wall);shTrees.splice(i,1);}}

/* the shore: fishing, flint, forage. What you need is found near you. */

const SHSPOTS=[],SHFORAGE=[];{let k=0;ISLES.forEach((I,n)=>{const spots=n===0?[[.9,'shallow'],[2.4,'shallow']]:n===3||n===4?[[1.1+n,'deep']]:[[1.2+n*1.3,'shallow']];
 spots.forEach(([a,type])=>SHSPOTS.push({x:I.x+Math.cos(a)*I.rx*1.12,y:I.y+Math.sin(a)*I.ry*1.12,ax:I.x+Math.cos(a)*I.rx*.9,ay:I.y+Math.sin(a)*I.ry*.9,type,seed:300+n*3+k,a,al:1,st:'on',life:1e9}));
 const items=n===0?[[.3,'wood'],[.6,'kelp'],[1.3,'wood'],[2.1,'kelp'],[2.7,'shells'],[-2.3,'wood'],[-1.6,'kelp']]:[[.4+n,'shells'],[2.5+n,'kelp'],[4.2+n,'wood']];
 items.forEach(([a,id])=>SHFORAGE.push({a,id,x:I.x+Math.cos(a)*I.rx*.9,y:I.y+Math.sin(a)*I.ry*.9,seed:80+k++,taken:0}));});}

/* who lives here */
const MAWS=[],DEAD=[];{const r=mulberry(79);const cells=[];for(let i=0;i<MR;i++)for(let j=0;j<MC;j++){if(!cellLand(i,j))continue;const z=zoneOf(i,j),w=MZ[i][j];if((z==='maze'&&w.reduce((a,b)=>a+b,0)>=2)||z==='fallow')cells.push([i,j,z]);}
 const fal=cells.filter(c=>c[2]==='fallow'),mz=cells.filter(c=>c[2]==='maze');
 const take=(arr,n,real)=>{for(let k=0;k<n&&arr.length;k++){const [i,j]=arr.splice(Math.floor(r()*arr.length),1)[0];const c=cellC(i,j),x=c[0]+(r()-.5)*40,y=c[1]-6+(r()-.5)*30;if(real)MAWS.push({x,y,st:'still',t:0,seed:MAWS.length+DEAD.length,cell:[i,j]});else DEAD.push({x,y,st:'still',t:0,seed:MAWS.length+DEAD.length,creak:0});}};
 take(mz,5,true);take(fal,4,true);take(mz,16,false);take(fal,14,false);
}
const MOSS=[];{const r=mulberry(80);const open=[];for(let i=0;i<MR;i++)for(let j=0;j<MC;j++){if(!cellLand(i,j))continue;const z=zoneOf(i,j);if(z==='grove'||z==='clearing')open.push([i,j]);}
 for(let k=0;k<12&&open.length;k++){const [i,j]=open.splice(Math.floor(r()*open.length),1)[0];const c=cellC(i,j);MOSS.push({x:c[0],y:c[1],cell:[i,j],t:r()*3,seed:k,fed:false,follow:false,dir:1});}}
const LAPPERS=[];for(let k=0;k<5;k++)LAPPERS.push({x:ISLES[4].x-400+k*200,y:ISLES[4].y-ISLES[4].ry-30,ph:k*2.1,st:'lap',t:0});
/* clearings glow a little: fireflies. Fallow ground bubbles. */
const FLIES=[],MUD=[];{const r=mulberry(82);for(let i=0;i<MR;i++)for(let j=0;j<MC;j++){if(!cellLand(i,j))continue;const z=zoneOf(i,j),c=cellC(i,j);
 if(z==='clearing'&&r()<.5)FLIES.push({x:c[0]+(r()-.5)*70,y:c[1]+(r()-.5)*70,ph:r()*6.28,sp:.6+r()*.8});
 if(z==='fallow'&&r()<.35)MUD.push({x:c[0]+(r()-.5)*50,y:c[1]+(r()-.5)*50,rx:18+r()*18,ry:9+r()*9,seed:200+i*40+j,ph:r()*6.28});}
}

function shEnter(){if(SH.on)return;SH.on=true;save();S.isle='shadow';P.path=[];P.task=null;hintEl.classList.remove('on');const p=S.shPos||[BOAT_SH.x,BOAT_SH.y-40];P.x=p[0];P.y=p[1];cam.x=P.x;cam.y=P.y;
 if(!S.journal.shadow){discover('shadow');think('The trees are listening.');}save();}
function shLeave(){if(!SH.on)return;S.shPos=[P.x,P.y];SH.on=false;S.isle='key';P.path=[];P.task=null;P.x=DOCK.x1-30;P.y=0;cam.x=P.x;cam.y=P.y;save();}
function shObjects(){const o=[];
 o.push({x:BOAT_SH.x,y:BOAT_SH.y,r:34,name:'Rowboat',key:'rowboat',act:'Row back to the Key',onAct:()=>{const c=shClamp(BOAT_SH.x,BOAT_SH.y-30);routeTo(c[0],c[1],shLeave);},onExamine:()=>think('Still here. Good.')});
 SHSPOTS.forEach(sp=>o.push({x:sp.x,y:sp.y,r:42,name:sp.type==='deep'?'Black water':'Bubbling water',act:'Fish',onAct:()=>goFish(sp),onExamine:()=>think(sp.type==='deep'?'Something heavy turns over down there.':'Little fish. Even here.')}));
 o.push({x:SHROCK.x,y:SHROCK.y,r:34,name:'Rocks',key:'rocks',act:S.owned.flint||S.owned.hatchet?null:'Search',onAct:()=>searchRocks(SHROCK),onExamine:()=>think('Black rock, wet all over. Something sharp glints in a crack.')});
 for(const f of SHFORAGE){if(f.taken>Date.now())continue;o.push({x:f.x,y:f.y-6,r:20,name:itemName({id:f.id}),key:f.id==='wood'?'driftwood':f.id==='kelp'?'kelp':'wash',act:'Grab',onAct:()=>{const c=shClamp(f.x,f.y+6);routeTo(c[0],c[1],()=>{if(f.taken>Date.now())return;const got=addItem(f.id,f.id==='shells'?2:1);if(!got){think('No room in my pack.');return;}f.taken=Date.now()+90000;flies.push({id:'misc',img:itemIcon({id:f.id}),x0:f.x,y0:f.y,t:0});const first=!hasSkill('foraging');if(first){unlockSkill('foraging');discover('foraging');toast('New skill: Foraging');}addXP('foraging',3,first?'first':'normal',[f.x,f.y-20]);save();});},onExamine:()=>think('The dark water left it. It will leave more.')});}
 o.push({x:HOLLOW.x,y:HOLLOW.y,r:HOLLOW.r,name:'The Hollow',key:'thehollow',act:null,onExamine:()=>{discover('thehollow');think(pick(['It’s breathing.','Everything here keeps its distance from it.','I don’t think it’s asleep. I think it’s waiting.']));}});
 for(const t of shTrees){if(Math.hypot(t.x-P.x,t.y-P.y)>260)continue;o.push({x:t.x,y:t.y-36*t.s,r:24*t.s,name:'Shadow tree',key:'shadowtree',act:'Chop',onAct:()=>chopTree(t),onExamine:()=>{discover('shadowtree');think(pick(['Black bark. It leans in when I’m not looking.','Dead, or close to it. Something has been eating at the roots.']));}});}
 const deadTxt=()=>pick(['A dead tree. Bark hanging off it like skin.','Dead. Probably dead.','It is not moving. I am going to assume that is good.']);
 for(const m of MAWS)o.push({x:m.x,y:m.y-20,r:30,name:m.st==='still'?'Dead tree':'Hollowmaw',key:m.st==='still'?null:'hollowmaw',act:null,onExamine:()=>think(m.st==='still'?deadTxt():m.st==='down'?'Flat on its roots, rocking. It will get up.':m.st==='calm'?'Held still, chest open. The hollow inside is black and cold. It is waiting for something warm.':'Its chest is creaking open. Back away.')});
 for(const p of PLANTED)o.push({x:p.x,y:p.y-24,r:26,name:'Planted Hollowmaw',key:'planted',act:null,onExamine:()=>think('A tree again. The pearl glows low in the trunk, and the bark is warm.')});
 for(const d of DEAD)o.push({x:d.x,y:d.y-20,r:30,name:'Dead tree',key:null,act:null,onExamine:()=>think(deadTxt())});
 for(const m of MOSS)o.push({x:m.x,y:m.y-10,r:24,name:'Mossback',key:'mossback',act:S.inv.some(i=>i.id==='cook')?'Feed':null,onAct:()=>{const c=shClamp(m.x+20,m.y+8);routeTo(c[0],c[1],()=>feedMoss(m));},onExamine:()=>think(m.bound?'Mine, by a knot and its own choosing. It hums.':m.fed?'It keeps close now. Warm, for a mossy thing.':m.sh>0?'Shivering. It is cold more than hungry, just now.':m.follow?'Warm from the scarf, and sticking close while it lasts.':pick(['Too thin. It looks at my pack.','Moss on its back, nothing in its belly.','Every so often it shivers.']))});
 for(const l of LAPPERS)if(nightNow()&&l.st!=='gone')o.push({x:l.x,y:l.y,r:26,name:'Moonlapper',key:'moonlapper',act:null,onExamine:()=>{discover('moonlapper');think('Eyeless. Drinking the moon off the water.');}});
 for(const m of MUD)o.push({x:m.x,y:m.y,r:m.rx+4,name:'Mud',key:'fallow',act:null,onExamine:()=>{discover('fallow');think(pick(['It bubbles. It smells like something gave up.','Fallow ground. Nothing has grown here in a long while.']));}});
 return o;}
function feedMoss(m){const i=S.inv.findIndex(x=>x.id==='cook');if(i<0)return;S.inv.splice(i,1);m.fed=true;m.follow=true;discover('mossback');pop('*munch*',m.x,m.y-30,'#fff',17);think(pick(['It ate the lot. It’s looking at me differently.','Fed. It’s following. I suppose I have a Mossback now.']));save();}
function nightNow(){const light=.5-.5*Math.cos(S.day*6.2832);return light<.4;}
function shUpdate(dt){if(!SW.on&&!P.path.length&&!shWalkable(P.x,P.y)&&shDepth(P.x,P.y)<=0){const c=shClamp(P.x,P.y);P.x=c[0];P.y=c[1];}
 for(const p of PLANTED)p.t+=dt;
 for(const m of MAWS){const d=Math.hypot(P.x-m.x,P.y-m.y);m.t+=dt;if(m.dazed>0)m.dazed-=dt;
  if(m.st==='down'){if(m.t>(lv('strife')>=10?14:9)){m.st='still';m.t=0;m.dazed=2;}}
  else if(m.st==='calm'){if(m.t>(lv('accord')>=10?20:12)){m.st='still';m.t=0;m.dazed=3;}}
  else if(m.st==='still'&&d<80&&!(m.dazed>0)){m.st='creak';m.t=0;}
  else if(m.st==='creak'&&m.t>.9){m.st='lunge';m.t=0;discover('hollowmaw');if(d<110&&!SW.on){const dx=P.x-m.x,dy=P.y-m.y,n=Math.hypot(dx,dy)||1;const c=shClamp(P.x+dx/n*70,P.y+dy/n*70);P.x=c[0];P.y=c[1];P.path=[];P.task=null;think(pick(['It lunged. The bark smells of rot.','It wants warmth, not me. I think.']));}}
  else if(m.st==='lunge'&&m.t>.6){m.st='open';m.t=0;}
  else if(m.st==='open'&&m.t>4&&d>120){m.st='still';m.t=0;}}
 for(const d of DEAD){d.creak-=dt;if(d.creak<=0){d.creak=18+Math.random()*40;if(Math.hypot(P.x-d.x,P.y-d.y)<160){d.st='creak';d.t=0;}}if(d.st==='creak'){d.t+=dt;if(d.t>.5)d.st='still';}}
 for(const m of MOSS){m.t-=dt;const dp=Math.hypot(P.x-m.x,P.y-m.y);
  if(m.tumble>0)m.tumble-=dt;if(m.sh>0)m.sh-=dt;
  if(m.flee>0){m.flee-=dt;const dx=m.x-P.x,dy=m.y-P.y,n=Math.hypot(dx,dy)||1;const c=shClamp(m.x+dx/n*90*dt,m.y+dy/n*90*dt);m.x=c[0];m.y=c[1];m.dir=dx>0?1:-1;if(m.flee<=0){m.cell=cellOf(m.x,m.y);}continue;}
  if(m.follow&&!m.fed&&!m.bound&&m.warm&&m.warm<Date.now()){m.follow=false;m.warm=0;}
  if(!m.follow&&!m.fed&&!m.bound){m.shT=(m.shT==null?4+Math.random()*6:m.shT)-dt;if(m.shT<=0){m.shT=6+Math.random()*6;if(dp<300)m.sh=1.6;}}
  if(m.follow){if(dp>46&&!SW.on){const k=Math.min(1,dt*2.2);m.x+=(P.x-24*m.dir-m.x)*k;m.y+=(P.y+6-m.y)*k;}continue;}
  if(m.t<=0){m.t=2+Math.random()*3;const [i,j]=m.cell,w=MZ[i][j],D=[[-1,0,0],[0,1,1],[1,0,2],[0,-1,3]].filter(([di,dj,k])=>!w[k]&&inMaze(i+di,j+dj)&&cellLand(i+di,j+dj));if(D.length){const [di,dj]=pick(D);m.cell=[i+di,j+dj];m.dir=dj||m.dir;}}
  const c=cellC(m.cell[0],m.cell[1]);m.x+=(c[0]-m.x)*Math.min(1,dt*1.2);m.y+=(c[1]-m.y)*Math.min(1,dt*1.2);}
 for(const l of LAPPERS){l.t+=dt;const d=Math.hypot(P.x-l.x,P.y-l.y);if(l.st==='lap'&&d<120){l.st='still';l.t=0;}else if(l.st==='still'&&l.t>1.1){l.st='gone';l.t=0;}else if(l.st==='gone'&&l.t>25&&d>240)l.st='lap';}
 const I=onIsle(P.x,P.y);if(I&&!I.landing&&!S.journal.islet)discover('islet');if(I&&I!==SH.isle){SH.isle=I;if(I.name&&!SH.said){toast(I.name);}}}

function drawShTree(t){const s=t.s,x=t.x,y=t.y;ln([[x,y],[x+2*s,y-30*s]],t.seed,7*s,INK,.6);ln([[x,y],[x+2*s,y-30*s]],t.seed,3.5*s,'#2b2433',.6);
 blob(x-9*s,y-30*s,13*s,11*s,t.seed+1,'#1f2b24',2.4,.7);blob(x+9*s,y-32*s,13*s,11*s,t.seed+2,'#1f2b24',2.4,.7);blob(x+1*s,y-42*s,15*s,12*s,t.seed+3,'#243429',2.4,.7);}
/* dead trees and Hollowmaws share one drawing, shaped by seed, in the forest's palette. A real one shows only a seam down the chest and, rarely, the faintest warm fleck in it. */
function drawMaw(m){const x=m.x,y=m.y,real=!('creak' in m),open=m.st==='open'||m.st==='lunge',creak=real&&m.st==='creak',sway=!real&&m.st==='creak',down=m.st==='down',calm=m.st==='calm';
 ctx.save();if(down){const k=Math.min(1,m.t/.45),e=1-(1-k)*(1-k),side=m.seed%2?1:-1,rock=Math.sin(m.t*3)*.05;ctx.translate(x,y);ctx.rotate(side*1.25*e+rock*e);ctx.translate(-x,-y);}
 const r=mulberry(400+m.seed),h=46+r()*22,lean=(r()-.5)*10,nb=2+Math.floor(r()*3),sh=creak?Math.sin(now*40)*2:sway?Math.sin(now*12)*1.2:0,tx=x+sh,ty=y-h;
 shadow(x,y+2,20,6);ln([[x,y],[tx+lean,ty]],300+m.seed,15,INK,.5);ln([[x,y],[tx+lean,ty]],300+m.seed,10,'#2f2a3a',.5);
 for(let i=0;i<nb;i++){const by=y-h*(.45+.5*(i/nb)),side=i%2?1:-1,len=18+r()*16,up=10+r()*18;const bx=tx+lean*(1-(y-by)/h);
  ln([[bx,by],[bx+side*len,by-up]],310+m.seed*3+i,5,INK,.9);ln([[bx,by],[bx+side*len,by-up]],310+m.seed*3+i,2.6,'#2f2a3a',.9);
  if(r()<.5){const ex=bx+side*len,ey=by-up;ln([[ex,ey],[ex+side*8,ey+6]],320+m.seed*3+i,3,INK,.8);}}
 const ns=2+Math.floor(r()*3);for(let i=0;i<ns;i++){const px=x-8+r()*16,py=y-6-r()*24;ln([[px,py],[px+1,py+8+r()*8]],330+m.seed*5+i,2.5,'#4a4458',.9);}
 if(r()<.6){blob(tx+lean+(r()-.5)*16,ty-6,9+r()*6,6+r()*4,340+m.seed,'#1f2b24',2,.7);}
 if(real&&!open){ln([[tx+lean*.7,y-h*.72],[tx+lean*.5,y-h*.42]],350+m.seed,1.4,'rgba(0,0,0,.5)',.4);const fl=Math.max(0,Math.sin(now*.9+m.seed*2)-.82)*5;if(fl>0){ctx.globalAlpha=fl*.6;dot(tx+lean*.6,y-h*.56,2,'#ff8a3d');ctx.globalAlpha=1;}}
 if(open||creak){const g=open?1:.25,cy=y-h*.55;sketch([[x-9,cy-8],[x+9,cy-8],[x+12,cy+6+8*g],[x+2,cy+14+10*g],[x-8,cy+6+8*g]],true,360+m.seed,1,'#0d0a12',INK,2);for(let i=0;i<4;i++){const px=x-7+i*5;ln([[px,cy-7],[px+1,cy-g*5]],370+i,2,'#e9dfc8',.6);ln([[px,cy+12+g*6],[px+1,cy+6+g*2]],374+i,2,'#e9dfc8',.6);}dot(x-4,cy-14,2,'#ff8a3d');dot(x+3,cy-14,2,'#ff8a3d');}
 if(open||down){ln([[x-14,y+2],[x-34,y+8]],380+m.seed,6,INK,.6);ln([[x+14,y+2],[x+34,y+10]],381+m.seed,6,INK,.6);}
 if(calm){const g=1,cy=y-h*.55;sketch([[x-9,cy-8],[x+9,cy-8],[x+12,cy+14],[x+2,cy+24],[x-8,cy+14]],true,360+m.seed,1,'#0d0a12',INK,2);ctx.globalAlpha=.5+.3*Math.sin(now*2);dot(x+1,cy+6,3,'#2a2140');ctx.globalAlpha=1;}
 ctx.restore();}
function drawMoss(m){const sh=m.sh>0?Math.sin(now*42)*1.6:0,x=m.x+sh,y=m.y,b=Math.sin(now*3+m.seed)*1.5;shadow(m.x,y+2,16,5);ctx.save();if(m.tumble>0){ctx.translate(x,y);ctx.rotate(Math.sin(m.tumble*8)*.6);ctx.translate(-x,-y);}
 if(m.sh>0){for(let i=0;i<3;i++){const a=now*9+i*2.1,px=x+Math.cos(a)*20,py=y-12+Math.sin(a)*8;ln([[px-3,py],[px,py-3],[px+3,py]],420+i,1.6,'#cfe6ff',.3);}}blob(x,y-10+b,15,12,400+m.seed,'#8a9d7a',2.6,1);blob(x-2,y-19+b,11,6,401+m.seed,'#5fa352',2,.5);
 ln([[x-6,y],[x-6,y+6]],402+m.seed,3,INK,.4);ln([[x+6,y],[x+6,y+6]],403+m.seed,3,INK,.4);dot(x-5*m.dir+10*m.dir,y-11+b,2,INK);dot(x+2*m.dir+10*m.dir,y-11+b,2,INK);
 if((m.fed||m.bound||(m.warm&&m.warm>Date.now()))&&Math.floor(now*2)%3===0)dot(x+14*m.dir,y-22+b,2.5,m.bound?'#ffcf3a':'#ff8fb1');ctx.restore();}
function drawLapper(l){if(!nightNow()||l.st==='gone')return;const x=l.x,y=l.y,dip=l.st==='lap'?Math.sin(now*1.6+l.ph)*6:0;
 ctx.globalAlpha=.85;blob(x,y-6,16,9,500+l.ph,'#d9d6e8',2.2,.6);ln([[x+10,y-10],[x+26,y-40+dip],[x+36,y-30+dip]],501+l.ph,9,INK,.4);ln([[x+10,y-10],[x+26,y-40+dip],[x+36,y-30+dip]],501+l.ph,5,'#e4e1f0',.4);
 blob(x+37,y-30+dip,7,5,502+l.ph,'#e4e1f0',2,.5);if(l.st==='lap'){ctx.globalAlpha=.35;sketch(ell(x+42,y-18,16+dip,5,10),true,503,1,null,'#fff',1.5);}ctx.globalAlpha=1;}
function drawHollow(){const x=HOLLOW.x,y=HOLLOW.y,br=Math.sin(now*.7)*4;shadow(x,y+40,170,30);
 sketch(ell(x,y+br*.3,190,62+br,22),true,600,3,'#1a1620',INK,4);sketch(ell(x-150,y+br*.3,42,52+br,14),true,601,2,'#0d0a12',INK,3);
 for(let i=0;i<5;i++)ln([[x-110+i*50,y-48+br*.3],[x-100+i*50,y+30]],602+i,3,'rgba(255,255,255,.08)',.8);
 ctx.globalAlpha=.1+.06*Math.sin(now*.7);dot(x-150,y,36,'#ff8a3d');ctx.globalAlpha=1;}
function drawZones(vw,vh){
 for(const m of MUD){if(Math.abs(m.x-cam.x)>vw||Math.abs(m.y-cam.y)>vh)continue;sketch(ell(m.x,m.y,m.rx,m.ry,12),true,m.seed,1.5,'#2d2620',INK,2);const bt=(now*.5+m.ph)%1;if(bt<.35){ctx.globalAlpha=.6*(1-bt/.35);sketch(ell(m.x+Math.sin(m.ph)*m.rx*.4,m.y-bt*8,3+bt*8,2+bt*4,8),true,m.seed+1,.5,null,'#6a5a4a',1.2);ctx.globalAlpha=1;}}}
function drawFlies(vw,vh){for(const f of FLIES){const x=f.x+Math.sin(now*f.sp+f.ph)*26,y=f.y+Math.cos(now*f.sp*.7+f.ph)*16;if(Math.abs(x-cam.x)>vw||Math.abs(y-cam.y)>vh)continue;const tw=.4+.6*Math.max(0,Math.sin(now*2.2+f.ph));ctx.globalAlpha=tw*.35;dot(x,y,7,'#f5e27a');ctx.globalAlpha=tw;dot(x,y,2,'#fff6a8');}ctx.globalAlpha=1;}
function drawIslets(){const vw=W/Z/2+80,vh=H/Z/2+80;ISLES.forEach((I,n)=>{if(Math.abs(I.x-cam.x)>vw+I.rx||Math.abs(I.y-cam.y)>vh+I.ry)return;sketch(ell(I.x,I.y,I.rx,I.ry,Math.max(20,Math.round((I.rx+I.ry)/30))),true,760+n,5,'#8d7f63',INK,3.5);sketch(ell(I.x,I.y,I.rx*.9,I.ry*.9,Math.max(18,Math.round((I.rx+I.ry)/32))),true,770+n,6,I.kind==='clearing'?'#4a6a3f':I.kind==='fallow'?'#4a4034':'#3a4a33',INK,2.5);});}
function drawBridge(){BRIDGES.forEach((B,n)=>{if(B.v){const {x,y0,y1,hw}=B;sketch([[x-hw,y0-6],[x+hw,y0-6],[x+hw,y1+6],[x-hw,y1+6]],true,790+n,2,'#7a5a3a',INK,3);for(let y=y0;y<y1;y+=18)ln([[x-hw+2,y],[x+hw-2,y]],791+y,1.5,'rgba(42,33,64,.35)',.5);}
 else{const {x0,x1,y,hw}=B;sketch([[x0-6,y-hw],[x1+6,y-hw],[x1+6,y+hw],[x0-6,y+hw]],true,790+n,2,'#7a5a3a',INK,3);for(let x=x0;x<x1;x+=18)ln([[x,y-hw+2],[x,y+hw-2]],791+x,1.5,'rgba(42,33,64,.35)',.5);ln([[x0,y-hw-6],[x1,y-hw-6]],795,2.5,INK,.4);ln([[x0,y+hw+6],[x1,y+hw+6]],796,2.5,INK,.4);}});}
function shWorld(){const vw=W/Z/2+80,vh=H/Z/2+80;
 ctx.fillStyle='#1f4a57';ctx.fillRect(cam.x-vw,cam.y-vh,vw*2,vh*2);
 ctx.globalAlpha=.3;for(let i=0;i<90;i++){const x=-2100+(i*131)%4200+Math.sin(now*.6+i)*12,y=-2000+(i*257)%4000;if(Math.abs(x-cam.x)>vw||Math.abs(y-cam.y)>vh)continue;ln([[x-10,y],[x,y-4],[x+10,y]],800+i,2.5,'#9fc4cc',1);}ctx.globalAlpha=1;
 drawIslets();drawBridge();drawZones(vw,vh);
 SHSPOTS.forEach(drawSpot);drawSwimWorld();blob(SHROCK.x,SHROCK.y,SHROCK.rx,SHROCK.ry,SHROCK.seed,'#4a4658');ln([[SHROCK.x-10,SHROCK.y-6],[SHROCK.x,SHROCK.y-11]],67,2.5,'rgba(255,255,255,.35)',.4);
 for(const f of SHFORAGE){if(f.taken>Date.now())continue;if(Math.abs(f.x-cam.x)>vw||Math.abs(f.y-cam.y)>vh)continue;shadow(f.x,f.y+2,10,3.5);ctx.drawImage(iconImg(itemIcon({id:f.id})),f.x-12,f.y-20+Math.sin(now*2+f.seed)*1.2,24,24);}
 if(mark){const k=mark.t/.6;ctx.globalAlpha=1-k;sketch(ell(mark.x,mark.y,10*(1-k*.5),5*(1-k*.5),10),true,140,1,null,INK,2.5);ctx.globalAlpha=1;}
 shadow(BOAT_SH.x,BOAT_SH.y+4,30,8);sketch([[BOAT_SH.x-32,BOAT_SH.y-6],[BOAT_SH.x+32,BOAT_SH.y-6],[BOAT_SH.x+22,BOAT_SH.y+8],[BOAT_SH.x-22,BOAT_SH.y+8]],true,803,2,'#9a6236',INK,3);
 const d=[];for(const t of shTrees){if(Math.abs(t.x-cam.x)>vw||Math.abs(t.y-cam.y)>vh)continue;d.push([t.y,()=>drawShTree(t)]);}
 const near=o=>Math.abs(o.x-cam.x)<vw&&Math.abs(o.y-cam.y)<vh;
 MAWS.forEach(m=>{if(near(m))d.push([m.y,()=>drawMaw(m)]);});DEAD.forEach(m=>{if(near(m))d.push([m.y,()=>drawMaw(m)]);});PLANTED.forEach(p=>{if(near(p))d.push([p.y,()=>drawPlanted(p)]);});MOSS.forEach(m=>{if(near(m))d.push([m.y,()=>drawMoss(m)]);});LAPPERS.forEach(l=>{if(near(l))d.push([l.y,()=>drawLapper(l)]);});d.push([HOLLOW.y+40,drawHollow],[P.y,drawSwimmer]);
 d.sort((a,b)=>a[0]-b[0]).forEach(x=>{if(x[1]===drawSwimmer){drawSwimmer();if(!SW.on)drawLine();}else x[1]();});drawFlies(vw,vh);}
function shLights(){const L=[[P.x,P.y-20,95+eff('light')]];MAWS.forEach(m=>{if(m.st==='open'||m.st==='lunge')L.push([m.x,m.y-46,40]);});PLANTED.forEach(p=>L.push([p.x,p.y-16,55+15*Math.min(1,p.t/8)]));L.push([HOLLOW.x-150,HOLLOW.y,70]);
 ISLES.forEach(I=>{if(I.kind==='clearing')L.push([I.x,I.y,Math.max(I.rx,I.ry)*.9]);});return L;}
