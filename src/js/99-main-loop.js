const BUILD=1;
let last=performance.now();
function frame(t){const dt=Math.min(.05,(t-last)/1000);last=t;now=t/1000;boil=RM?0:Math.floor(now*3.5)%3;if(ccOn)renderPreview();else{update(dt);render();}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
if(S.char)begin();else openCreator('new');
if(location.hash==='#dev')window.DK={BUILD,S,P,trees,chopPer:()=>chopPer(),nowT:()=>now,w2s:(x,y)=>w2s(x,y),MF:MAINFIRE,enterCook:f=>enterCook(f||MAINFIRE),addXP,get C(){return C;}};
