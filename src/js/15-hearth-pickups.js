/* hearth: fires, fuel, Old Wick */
const MAINFIRE={x:FIRE.x,y:FIRE.y,main:true,seed:0};
function allFires(){return [MAINFIRE].concat((S.fires||[]).map((f,i)=>{if(!f.seed)f.seed=10+i;return f;}));}
const PICK=[];{const r=mulberry(77);let i=0;
 while(PICK.length<10&&i<400){i++;const a=r()*6.2832,p=polar(a,iR(a)-24-r()*16);if(Math.hypot(p[0]-(R0-25),p[1])<90||Math.hypot(p[0]-MOON.ax,p[1]-MOON.ay)<40)continue;if(PICK.some(q=>Math.hypot(q.x-p[0],q.y-p[1])<130))continue;PICK.push({x:p[0],y:p[1],type:'wood',seed:600+i,rot:r()*3,until:0});}
 [-2.05,-1.65,-2.6,-2.2,Math.PI+.28,Math.PI-.32].forEach((a,j)=>{const p=polar(a,iR(a)-20);PICK.push({x:p[0],y:p[1],type:'kelp',seed:700+j,rot:0,until:0});});}
function pickUp(p){if(p.until>now)return;const k=p.type;if(!canAdd(k)){think('No room in my pack for more '+(k==='wood'?'driftwood.':'kelp.'));return;}
 S[k]=(S[k]||0)+1;p.until=now+90+Math.random()*60;pop('+1 '+(k==='wood'?'driftwood':'dry kelp'),p.x,p.y-30,'#fff',17);discover(k==='wood'?'driftwood':'kelp');save();}
function drawAsh(){for(const a of (S.ashp||[])){if(Math.abs(a.x-cam.x)>W/Z/2+60||Math.abs(a.y-cam.y)>H/Z/2+60)continue;const r=10+a.n*2;
 blob(a.x,a.y,r,r*.5,980+a.n,'#b8b2c4',2.4,.8);blob(a.x-2,a.y-2,r*.55,r*.25,981,'#cdc8d6',0,.5);for(let i=0;i<a.n+2;i++)dot(a.x-r*.6+((i*37)%(r*1.2)),a.y-1+((i*13)%5)-2,1.3,'#5a5266');
 (a.items||[]).forEach((id,j)=>{const gx=a.x-5+j*7,gy=a.y-4,tw=.5+.5*Math.sin(now*4+j);if(id==='sunstone'){ctx.globalAlpha=.6+.4*tw;dot(gx,gy,6,'rgba(255,207,58,.45)');dot(gx,gy,3,'#ffcf3a');ctx.globalAlpha=1;}else if(id==='charcoal')dot(gx,gy,3,'#2a2430');else if(id==='seasalt'){ctx.globalAlpha=.6+.4*tw;star(gx,gy,3.4,'#ffffff');ctx.globalAlpha=1;}else{ctx.globalAlpha=.6+.4*tw;dot(gx,gy,4.5,'rgba(255,180,90,.5)');dot(gx,gy,2.6,'#ffb347');ctx.globalAlpha=1;}});}}
