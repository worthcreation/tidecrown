const BUILD=3;
let last=performance.now(),fdt=1/60;
function frame(t){const dt=Math.min(.05,(t-last)/1000);fdt=dt;last=t;now=t/1000;boil=RM?0:Math.floor(now*3.5)%3;if(ccOn)renderPreview();else{update(dt);render();}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
if(S.char)begin();else openCreator('new');
if(location.hash==='#dev')window.DK={BUILD,S,P,trees,chopPer:()=>chopPer(),nowT:()=>now,w2s:(x,y)=>w2s(x,y),MF:MAINFIRE,enterCook:f=>enterCook(f||MAINFIRE),addXP,lv,hasSkill,get C(){return C;},fn:{hook,startFish,rollFish,finishPan,panTap,buildFire,feedFire,burnOut,scoopAsh,searchRocks,openBank,deposit,withdraw,sellPick,renderSell,dropGround,pickGround,addItem,cnt,objects,openPanel,renderPanel,strike,startChop,finishChop,feedWick,offerAsh,kindleTick,ashTalk,talkGull,saluteCrab,exitCook,fuel}};
