let chips=[];
function chopPer(){return lv('woodcutting')>=8?1.25:1.05;}
function chopTree(t){if(!hasHatchet()){discover('tree');think('I’d need a hatchet. Something sharp, something to hold, something to tie them together.');return;}
 if((t.rest||0)>now){think('This one needs a breather. It’s sighing at me.');return;}
 const side=P.x<t.x?-1:1,c=clampLand(t.x+side*26,t.y+6);routeTo(c[0],c[1],()=>startChop(t));}
function startChop(t){if((t.rest||0)>now)return;if(!canAdd('wobble')){think('My pack is full. Nowhere to put a log.');return;}P.task={chop:1,tree:t,t0:now,prog:0,combo:0,miss:0,swing:0};P.face=t.x>P.x?1:-1;
 if(!S.chopHint){S.chopHint=1;hint('Tap as the ring closes on the trunk. Keep the rhythm.',7000);}}
function beatPh(T){return((now-T.t0)/chopPer())%1;}
function strike(){const T=P.task;T.swing=.22;const ph=beatPh(T),e=Math.min(ph,1-ph)*chopPer(),win=.11+Math.min(.06,lv('woodcutting')*.003),t=T.tree,cx=t.x+t.lean*.4*t.s,cy=t.y-24*t.s;
 const chip=n=>{for(let i=0;i<n;i++)chips.push({x:cx,y:cy,vx:(Math.random()-.5)*120,vy:-60-Math.random()*90,t:0});};
 if(e<win){T.combo++;T.prog+=1+Math.min(T.combo,6)*.15;chip(8);if(T.combo>=10)S.st.groove=1;}
 else if(e<win*2.2){T.prog+=.5;chip(4);}
 else{T.combo=0;T.miss++;T.prog+=.15;pop('thunk',cx,cy-20,'#fff',15);}
 if(T.prog>=6)finishChop();}
function finishChop(){const T=P.task,t=T.tree;if(!canAdd('wobble')){P.task=null;think('My pack filled up. The tree keeps its log.');return;}S.wobble+=1;S.st.logs=(S.st.logs||0)+1;const first=!S.journal.wobblelog;
 addXP('woodcutting',T.miss?18:24,first?'first':(T.miss?'normal':'perfect'),[t.x,t.y-30]);flies.push({id:'misc',img:'wobble',x0:t.x,y0:t.y-30,t:0});discover('wobblelog');
 t.rest=now+45;P.task=null;think(pick(['The tree sighs and lets a log drop. Thanks, tree.','A log falls loose. The tree seems relieved, honestly.','It shudders, then drops a log at my feet.']));save();}
function drawChopFX(){const T=P.task;if(T&&T.chop){const t=T.tree,cx=t.x+t.lean*.4*t.s+Math.cos(Math.PI*(now-T.t0)/chopPer())*5*t.s,cy=t.y-24*t.s,ph=beatPh(T),r=12+(1-ph)*30;
  ctx.globalAlpha=.25+ph*.6;sketch(ell(cx,cy,r,r*.8,16),true,940,1,null,'#fffaf0',3);ctx.globalAlpha=1;
  if(T.combo>1){otext('x'+T.combo,cx+26,cy-30,15,'#fff');}
  T.swing=Math.max(0,T.swing-fdt);}
 chips=chips.filter(c=>(c.t+=fdt)<.7);for(const c of chips){c.x+=c.vx*fdt;c.y+=c.vy*fdt;c.vy+=360*fdt;ctx.globalAlpha=1-c.t/.7;dot(c.x,c.y,2,'#d9cdb5');}ctx.globalAlpha=1;}
