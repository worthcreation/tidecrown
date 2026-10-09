/* hearth: fires, fuel, Brimble */
const MAINFIRE={x:FIRE.x,y:FIRE.y,main:true,seed:0};
function allFires(){return [MAINFIRE].concat((S.fires||[]).map((f,i)=>{if(!f.seed)f.seed=10+i;return f;}));}
function drawAsh(){for(const a of (S.ashp||[])){if(Math.abs(a.x-cam.x)>W/Z/2+60||Math.abs(a.y-cam.y)>H/Z/2+60)continue;const r=10+a.n*2;
 blob(a.x,a.y,r,r*.5,980+a.n,'#b8b2c4',2.4,.8);blob(a.x-2,a.y-2,r*.55,r*.25,981,'#cdc8d6',0,.5);for(let i=0;i<a.n+2;i++)dot(a.x-r*.6+((i*37)%(r*1.2)),a.y-1+((i*13)%5)-2,1.3,'#5a5266');
 (a.items||[]).forEach((id,j)=>{const gx=a.x-5+j*7,gy=a.y-4,tw=.5+.5*Math.sin(now*4+j);if(id==='sunstone'){ctx.globalAlpha=.6+.4*tw;dot(gx,gy,6,'rgba(255,207,58,.45)');dot(gx,gy,3,'#ffcf3a');ctx.globalAlpha=1;}else if(id==='charcoal')dot(gx,gy,3,'#2a2430');else if(id==='seasalt'){ctx.globalAlpha=.6+.4*tw;star(gx,gy,3.4,'#ffffff');ctx.globalAlpha=1;}else{ctx.globalAlpha=.6+.4*tw;dot(gx,gy,4.5,'rgba(255,180,90,.5)');dot(gx,gy,2.6,'#ffb347');ctx.globalAlpha=1;}});}}
