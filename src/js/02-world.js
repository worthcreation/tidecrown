/* ---------- world ---------- */
function iR(a){return 520+60*Math.sin(3*a+1)+35*Math.sin(5*a+2.3)+20*Math.sin(9*a+.7);}
function gR(a){return iR(a)*.8+14*Math.sin(7*a+1.3)-10;}
function polar(a,r){return [Math.cos(a)*r,Math.sin(a)*r];}
const NP=150,sandPts=[],grassPts=[],shallowPts=[],foamPts=[];
for(let i=0;i<NP;i++){const a=i/NP*6.2832,c=Math.cos(a),s=Math.sin(a);sandPts.push([c*iR(a),s*iR(a)]);grassPts.push([c*gR(a),s*gR(a)]);shallowPts.push([c*(iR(a)+60),s*(iR(a)+60)]);foamPts.push([c*(iR(a)+9),s*(iR(a)+9)]);}
const R0=iR(0);
/* tide: 1 is high water, 0 is low. Low water exposes a wet band of TIDE_REACH outside the dry sand. */
/* a day is 24 minutes; like real tides there are two highs a day, so the tide cycles every 12 and the water is always on the move. */
const DAY_PERIOD=24*60000,TIDE_PERIOD=DAY_PERIOD/2,TIDE_REACH=46;let tideF=null;
function tideLevel(){if(tideF!=null)return tideF;return .5+.5*Math.cos(Date.now()/TIDE_PERIOD*6.2832);}
function wetR(a){return iR(a)+(1-tideLevel())*TIDE_REACH;}
const DOCK={x0:R0-40,x1:R0+192,y0:-24,y1:24};
function onIsland(x,y){return Math.hypot(x,y)<=wetR(Math.atan2(y,x))-10;}
function onDock(x,y){return x>=DOCK.x0&&x<=DOCK.x1-10&&y>=DOCK.y0+6&&y<=DOCK.y1-6;}
const SH={on:false};
function walkable(x,y){if(SH.on)return shWalkable(x,y);return onIsland(x,y)||onDock(x,y);}
function clampLand(x,y){if(SH.on)return shClamp(x,y);if(walkable(x,y))return[x,y];const a=Math.atan2(y,x);return polar(a,wetR(a)-18);}

/* fishing spots roam: a spot fades in, lives a couple of minutes, fades out, and a new one bubbles up somewhere else. The glowing pool is a place and stays put. */
const spots=[];
function spotHere(a,type){const p=polar(a,iR(a)+60),ap=polar(a,iR(a)-24);return {x:p[0],y:p[1],ax:ap[0],ay:ap[1],type,seed:Math.floor(Math.random()*900)+5,a,al:0,st:'in',life:120+Math.random()*180};}
function spotAngle(type){for(let i=0;i<40;i++){let a;if(type==='deep')a=-2.7+Math.random()*1.2;else{a=Math.random()*6.2832;if(a>Math.PI)a-=6.2832;if(Math.abs(a)<.5||(a<-1.4&&a>-2.8)||Math.abs(Math.abs(a)-Math.PI)<.4)continue;}
 if(spots.some(s=>Math.abs(angDiff(s.a,a))<.42))continue;return a;}return null;}
function addSpot(a,type){spots.push(spotHere(a,type));}
addSpot(.85,'shallow');addSpot(2.35,'shallow');addSpot(-1.85,'deep');addSpot(-2.35,'deep');
spots.push({x:polar(Math.PI,iR(Math.PI)+60)[0],y:polar(Math.PI,iR(Math.PI)+60)[1],ax:polar(Math.PI,iR(Math.PI)-24)[0],ay:polar(Math.PI,iR(Math.PI)-24)[1],type:'moon',seed:57,a:Math.PI,al:1,st:'on',life:1e9});
spots.push(spotHere(.42,'shallow'));
const MOON=spots.find(s=>s.type==='moon');
function spotsUpdate(dt){for(const sp of spots){if(sp.type==='moon')continue;
 if(sp.st==='in'){sp.al=Math.min(1,sp.al+dt/2.5);if(sp.al>=1)sp.st='on';}
 else if(sp.st==='on'){sp.life-=dt;if(sp.life<=0)sp.st='out';}
 else{sp.al=Math.max(0,sp.al-dt/2.5);}}
 for(let i=spots.length-1;i>=0;i--){const sp=spots[i];if(sp.st==='out'&&sp.al<=0){spots.splice(i,1);const a=spotAngle(sp.type);if(a!=null)spots.push(spotHere(a,sp.type));}}}
const REQ={shallow:1,deep:10,moon:20};

const G={x:R0+170,y:-2,talk:false};
const SIGN={x:R0-95,y:-58};
const FIRE=(()=>{const p=polar(-.95,iR(-.95)-42);return{x:Math.round(p[0]),y:Math.round(p[1])};})();
const HEAD=(()=>{const a=Math.PI-.45,p=polar(a,iR(a)-70);return{x:p[0],y:p[1]};})();
const POOL=(()=>{const p=polar(2.05,250);return{x:p[0],y:p[1]};})();
const GULL={x:R0-150,y:-34};
const crabHome=polar(1.6,iR(1.6)-60);
const CRAB={x:crabHome[0],y:crabHome[1],tx:crabHome[0],ty:crabHome[1],wait:1,hop:0};
const rocks=[];
[-1.85,-2.35].forEach((a,j)=>{[-.09,-.03,.05,.1].forEach((d,i)=>{const p=polar(a+d,iR(a+d)+(i%2?2:-8));rocks.push({x:p[0],y:p[1],rx:14+((i*7+j*3)%9),ry:10+((i*5)%6),seed:200+j*10+i});});});

const trees=[];
{const r=mulberry(7);let tries=0;const avoid=[[GULL.x,GULL.y],[POOL.x,POOL.y],[R0-80,24],[FIRE.x,FIRE.y],[SIGN.x,SIGN.y],[HEAD.x,HEAD.y],[R0-25,0],crabHome,...spots.map(s=>[s.ax,s.ay])];
 while(trees.length<18&&tries<800){tries++;const a=r()*6.2832,d=Math.sqrt(r())*.74;const x=Math.cos(a)*gR(a)*d,y=Math.sin(a)*gR(a)*d;
  if(avoid.some(p=>Math.hypot(p[0]-x,p[1]-y)<120))continue;if(trees.some(t=>Math.hypot(t.x-x,t.y-y)<90))continue;
  trees.push({x,y,s:.85+r()*.45,seed:trees.length*31+3,lean:(r()-.5)*18,hue:r()});}}
const tufts=[];{const r=mulberry(11);for(let i=0;i<80;i++){const a=r()*6.2832,d=Math.sqrt(r())*.93;tufts.push({x:Math.cos(a)*gR(a)*d,y:Math.sin(a)*gR(a)*d,f:r()<.18,seed:i+500,c:r()});}}
const waves=[];{const r=mulberry(23);for(let i=0;i<140;i++){const a=r()*6.2832,d=iR(a)+110+r()*1100;waves.push({x:Math.cos(a)*d,y:Math.sin(a)*d,s:r()*6,seed:i+900});}}

