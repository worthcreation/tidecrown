function drawPickups(){drawGround();drawAsh();}
function drawFireAt(fr){if(fr.big){ctx.save();ctx.translate(fr.x,fr.y);ctx.scale(1.45,1.45);ctx.translate(-fr.x,-fr.y);drawFireBody(fr);ctx.restore();}else drawFireBody(fr);}
function drawFireBody(fr){const {x,y}=fr,sd=(fr.seed||0)*7,hot=C&&C.fr===fr?C.heat:lifeHeat(fr);shadow(x,y+3,22,6);
 if(!fr.main&&!fireLit(fr))return;
 if(C&&C.fr===fr&&C.out){blob(x,y,22,9,985,'#b8b2c4',2.4,.8);for(let i=0;i<4;i++)dot(x-12+i*8,y-1+(i%2)*2,1.3,'#5a5266');const ph=(now*.6)%1;ctx.globalAlpha=.8;blob(x,y-30-Math.sin(now*2)*3,10,13,986,'#e4e0ea',2,.9);dot(x-3.5,y-32-Math.sin(now*2)*3,1.7);dot(x+3.5,y-32-Math.sin(now*2)*3,1.7);ctx.globalAlpha=(1-ph)*.5;ln([[x,y-44-ph*20],[x+5,y-52-ph*20],[x-2,y-60-ph*20]],987,2.4,'#cfc8dc',.4);ctx.globalAlpha=1;return;}
 ln([[x-18,y+2],[x+16,y-6]],70+sd,8,INK,1);ln([[x-18,y+2],[x+16,y-6]],70+sd,4.5,'#9a6236',1);ln([[x-16,y-6],[x+18,y+2]],71+sd,8,INK,1);ln([[x-16,y-6],[x+18,y+2]],71+sd,4.5,'#a8703f',1);
 const ck=C&&C.fr===fr,f=Math.sin(now*13+sd)*2.5*(.5+hot),fh=ck?16+hot*30:6+hot*19,fw=ck?8+hot*6:6+hot*7,fy=y-4-fh*.55-(ck?14:0);
 blob(x,fy,fw+3,fh+f,72+sd,hot<.4?'#d9553a':'#ff8a3d',2.5);blob(x+1,fy+fh*.3,fw*.55,fh*.55+f*.6,73+sd,hot>1?'#fff6d0':'#ffd23f',0);
 const sp=(now*.9+sd)%1;dot(x+Math.sin(now*3+sd)*6,fy-fh-sp*26,2*(1-sp),'#ffcf3a');
 if(hot>1&&Math.random()<24*fdt)sparks.push({x:x+(Math.random()-.5)*12,y:fy-fh*.6,vx:(Math.random()-.5)*50,vy:-70-Math.random()*60,t:0});
 if(fr.main){const ey=ck?fy-fh*.35:fy+1;
  if(!S.metWick){ln([[x-7,ey],[x-3,ey+1]],74,2,INK,.2);ln([[x+3,ey+1],[x+7,ey]],75,2,INK,.2);const zp=(now*.5)%1;ctx.globalAlpha=1-zp;otext('z',x+12+zp*10,fy-fh-zp*20,14,'#fff');ctx.globalAlpha=1;}
  else{dot(x-4,ey,2);dot(x+4,ey,2);const talking=(C&&C.fr===fr&&C.sayT>0)||(dlgOn&&curWho==='Brimble');
   if(talking)blob(x,ey+6,2.6,1.4+Math.abs(Math.sin(now*14))*2.2,76,INK,0);else ln([[x-3,ey+6],[x+3,ey+5.5]],77,1.8,INK,.2);}}}
function talkWick(){const first=!S.metWick;S.metWick=1;discover('wick');
 if(!hasSkill('cooking')){say('Brimble',first?'Hm? Oh. An audience. Brimble, galley flame of the Grinning Gull, finest ship that ever sank. Forty years I fed that crew. Now I feed myself, badly, from a teapot. Bring me driftwood from the beach and I’ll teach you to cook. Properly.':
  ((S.wood||0)>0?'Is that driftwood I smell? Don’t tease a stove.':'Still starving. Driftwood. Flames don’t beg, as a rule. Consider this the exception.'),wickOpts());return;}
 if(!rawCount()){say('Brimble',pick(['Nothing to cook? The sea’s full of fish. Catch one and bring it here.','Empty hands, empty pans. Go fish, then tap me.']),wickOpts());return;}
 say('Brimble',pick(['Back! Bring me something to sizzle?','Crackle crackle. That’s hello, in stove.','The Gull’s cook used to sing to me. You don’t have to. Please don’t.','Driftwood again? Notes of salt and regret. Fine. Hand it over.']),wickOpts());}
const WTIPS=['Smoke does strange things to fish. Throw on some kelp and let the flare ride.','Two pans is a dance. Three is a brawl. Both are fun. Want a third sooner? Build bigger.','Every fire dies if you starve it. What’s left is ash, and ash is never nothing. Ask me about it.','Our captain wrote letters and tossed them overboard. Signed them just C. Never did learn the rest.','Golden on both sides. That’s the whole secret. That, and not wandering off.'];
function wickOpts(){const o=[];
 if(!hasSkill('cooking')){if((S.wood||0)>0)o.push({l:'Feed him driftwood',f:feedWick});else o.push({l:'Where’s driftwood?',f:()=>say('Brimble','The waves bring it in. Watch the foam pull back and it’ll be lying there, grey as old bones. Grab it before the next wave does.',wickOpts())});o.push({l:'See you',f:closeDlg});return o;}
 const n=rawCount();if(n)o.push({l:'Cook ('+n+' raw fish)',f:()=>{closeDlg();goCook(MAINFIRE);}});
 if((S.ash||0)>0)o.push({l:'About this ash...',f:ashTalk});
 if(S.kindle&&S.kindle.seen&&!S.kindle.joined)o.push({l:'A log ran away from me',f:()=>say('Brimble','A runaway log? That’s a Kindle! Wild ones spook easy, but they can’t resist a fire at night. Light one of your own, keep it fed past dark, and bring something tasty. Kindles eat ash, the weirdos. Takes a few nights before they trust you.',wickOpts())});
 o.push({l:'Any tips?',f:()=>{const i=Math.floor(Math.random()*WTIPS.length);if(i===3)discover('gull');say('Brimble',WTIPS[i],wickOpts());}});o.push({l:'See you',f:closeDlg});return o;}
function feedWick(){S.wood--;unlockSkill('cooking');discover('hearth');save();addXP('firemaking',20,'first',[FIRE.x,FIRE.y-24]);toast('New skill: Cooking');
 say('Brimble','Ahhh. That’s the stuff. Lesson one: a fire is a promise. Keep it fed and it keeps you. Put a fish on, flip it when it goes golden, pull it when the other side matches. Driftwood burns steady, kelp burns wild. I’ll holler if you’re doing it wrong. '+(rawCount()?'You’ve got fish on you. Let’s cook!':'Now go catch me a fish and come back. A Minnowbit will do.'),wickOpts());}
function ashTalk(){const a=S.ash||0;
 if(S.owned.stache){say('Brimble','Ash keeps. Hang onto it. I’ve got more tricks, once there’s more fire in you.',wickOpts());return;}
 if(a<10){say('Brimble','Ash! Wonderful stuff. The Gull’s head cook could do things with ash that’d make a grown bucket weep. Bring me ten scoops. You’ve got '+a+'.',wickOpts());return;}
 if(S.inv.length>=PACK){say('Brimble','Ten scoops! Make some room in that satchel first, this is going to be glorious.',wickOpts());return;}
 S.ash-=10;S.owned.stache=1;S.inv.push({id:'stache'});discover('stache');toast('Found: Ash Mustache');save();
 say('Brimble','Hold still. A pinch here. A braid there. Little curl... THERE. The head cook’s own mustache, braided proper. Wear it with pride. Gubbins is going to lose his mind.',wickOpts());}
