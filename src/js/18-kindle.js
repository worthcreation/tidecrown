const KW={active:false,x:0,y:0,tx:0,ty:0,mode:'beach',flee:false,f:null};
function beachSpot(){const a=Math.random()*6.2832;return polar(a,iR(a)-30);}
function kindleTick(){const k=S.kindle||(S.kindle={trust:0,lastNight:-1,joined:0,hops:0,seen:0});
 if(k.joined||!hasSkill('hearth')||lv('hearth')<6||dark<.3||C){KW.active=false;return;}
 const lit=(S.fires||[]).filter(fireLit);
 if(lit.length){const f=lit.reduce((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)<=Math.hypot(b.x-P.x,b.y-P.y)?a:b);
  if(!KW.active){const sp=beachSpot();KW.x=sp[0];KW.y=sp[1];}if(KW.f!==f||KW.mode!=='fire'){KW.f=f;KW.mode='fire';const c=clampLand(f.x+40,f.y+18);KW.tx=c[0];KW.ty=c[1];KW.flee=false;}}
 else if(!KW.active||KW.mode!=='beach'){const sp=beachSpot();KW.x=KW.tx=sp[0];KW.y=KW.ty=sp[1];KW.mode='beach';KW.f=null;}
 KW.active=true;}
function kindleMove(dt){if(!KW.active)return;const dx=KW.tx-KW.x,dy=KW.ty-KW.y,d=Math.hypot(dx,dy);if(d<1){KW.flee=false;return;}const sp=Math.min(d,(KW.flee?170:45)*dt);KW.x+=dx/d*sp;KW.y+=dy/d*sp;}
function spookKindle(){const c=clampLand(KW.x-22,KW.y+6);routeTo(c[0],c[1],()=>{if(!KW.active||KW.mode!=='beach')return;const k=S.kindle;
 pop('!',KW.x,KW.y-30,'#ffcf3a',26);let sp;for(let i=0;i<12;i++){sp=beachSpot();if(Math.hypot(sp[0]-KW.x,sp[1]-KW.y)>260)break;}KW.tx=sp[0];KW.ty=sp[1];KW.flee=true;
 think(k.seen?'He bolts again. Wick said something about fire and nighttime.':'The driftwood blinked. Then it ran away on tiny legs.');k.seen=1;discover('kindleseen');save();});}
function offerAsh(){const c=clampLand(KW.x-26,KW.y+6);routeTo(c[0],c[1],()=>{const k=S.kindle;k.seen=1;discover('kindleseen');
 if(k.lastNight===(S.dayN||0)){think('He’s had his ash tonight. Snoring like a tiny kettle.');return;}
 if(!((S.ash||0)>0)){think('He keeps eyeing the ash at the edge of my fire. Maybe he eats it?');return;}
 S.ash--;k.trust++;k.lastNight=S.dayN||0;pop('♥',KW.x,KW.y-30,'#ff8fb1',22);
 if(k.trust>=3){k.joined=1;k.hops=4;KW.active=false;discover('kindle');toast('Kindle joined your woodpile');think('Kindle hops into my woodpile like he owns it. I think he does now.');addXP('hearth',60,'first',[KW.x,KW.y]);}
 else think(k.trust===1?'Crunch. He eats the ash and scoots a little closer to the fire. Same time tomorrow night?':'He eats it and leans against my boot. One more night, I think.');save();});}
function drawKindle(){const {x,y}=KW,mv=Math.hypot(KW.tx-x,KW.ty-y)>3,b=mv?Math.abs(Math.sin(now*16))*3:0,f=KW.mode==='fire'&&!mv?(KW.f&&KW.f.x<x?-1:1):(KW.tx<x?-1:1);shadow(x,y+2,16,4);
 if(mv){const s2=Math.sin(now*16)*4;ln([[x-6,y-4],[x-6+s2,y]],990,2,INK,.2);ln([[x+6,y-4],[x+6-s2,y]],991,2,INK,.2);}
 const yy=y-7-b;ln([[x-15,yy],[x+15,yy-2]],992,10,INK,.8);ln([[x-15,yy],[x+15,yy-2]],992,6.5,'#d9cdb5',.8);
 const blink=(now%3.2)<.15,ex=x+f*6;if(blink){ln([[ex-3,yy-2],[ex-1,yy-2]],994,1.6,INK,.1);ln([[ex+2,yy-2],[ex+4,yy-2]],995,1.6,INK,.1);}else{dot(ex-2,yy-2,1.6);dot(ex+3,yy-2.3,1.6);}
 if(S.kindle&&S.kindle.lastNight===(S.dayN||0)&&!mv&&KW.mode==='fire'){const zp=(now*.5)%1;ctx.globalAlpha=1-zp;otext('z',x+10+zp*8,yy-12-zp*16,12,'#fff');ctx.globalAlpha=1;}}
