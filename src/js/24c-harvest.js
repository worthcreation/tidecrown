/* ---------- shadow tree harvest and regrowth ----------
   Every shadow tree has three layers: branches, limbs, trunk. Woodcutting level sets the deepest layer you may take
   on each wood (branches always; limbs at LIMREQ; the trunk at WOODREQ). Each harvest also yields the layers below
   it, in lesser amounts, and a branches-only harvest gives the most branches. The tree loses only what you took:
   branches regrow fast, limbs slower, a felled trunk goes stump, sapling, young tree, full. Pace is by wood, in
   elapsed real time: black wood a day, twisted wood two, ironbark three. Stumps keep the size the tree had reached.
   Digging a stump always gives root wood, with a chance of fatwood, a burl, grubs, or rarely something lost; the
   spot then sits bare a while before a sapling shows, so digging slows regrowth and never stops it.
   S.shTree[seed] = {cut, ss, br, lim, dug}: times of each harvest and the stump's size. Nothing else is saved:
   a forest's starting mix of saplings, young trees, giants and dead snags comes from the seeds. */
var H24=3600000*24,FULLT={blackwood:H24,twistwood:H24*2,ironbark:H24*3},LIMREQ={blackwood:1,twistwood:5,ironbark:12},BRF=.05,LIMF=.25,LAYK={br:.45,lim:.7,trunk:1,snag:.6,stump:.8,sap:.3};
S.shTree=S.shTree||{};/* var above: tstage runs during load, before this file */
/* older saves: a felled tree (S.shCut) becomes a fresh stump at load, so it grows back from today */
{const c=S.shCut||{},t0=Date.now();for(const k in c)if(!S.shTree[k])S.shTree[k]={cut:t0,ss:1};delete S.shCut;}
function natural(t){const h=hash1(t.seed*.37+.11);return h<.06?'sapling':h<.14?'young':h>.96?'snag':null;}
function tstage(t){if(!FULLT)return {st:"full",g:1,br:1,lim:1,c:1};const w=woodOf(t),F=FULLT[w],r=(S.shTree||{})[t.seed],n=Date.now(),fr=(k,f)=>r&&r[k]?Math.min(1,(n-r[k])/(f*F)):1;
 const br=fr('br',BRF),lim=fr('lim',LIMF);
 if(r&&r.cut){const base=r.dug?r.dug+.1*F:r.cut,e=(n-base)/F;
  if(e<.1)return {st:r.dug?'hole':'stump',g:r.ss||1,br:0,lim:0,c:0};
  if(e<.33)return {st:'sapling',g:.15+.3*(e-.1)/.23,br,lim,c:.3};
  if(e<1)return {st:'young',g:.45+.55*(e-.33)/.67,br,lim,c:(.35+.65*lim)*(.7+.3*br)};}
 const nat=r&&r.cut?null:natural(t);
 if(nat==='sapling')return {st:'sapling',g:.3,br,lim,c:.3};if(nat==='young')return {st:'young',g:.62,br,lim,c:(.35+.65*lim)*(.7+.3*br)};if(nat==='snag')return {st:'snag',g:1,br:0,lim:0,c:0};
 return {st:'full',g:1,br,lim,c:(.35+.65*lim)*(.7+.3*br)};}
function treeSolid(t){const s=tstage(t).st;return s!=='hole'&&s!=='sapling';}
/* the drawn tree: a scaled copy for growth */
function vtree(t,g){return g>=1?t:{x:t.x,y:t.y,s:t.s*g,tw:t.tw,lean:t.lean*g,seed:t.seed,sh:1,isle:t.isle};}
function drawStump(t,g,dug){const s=t.s*g,x=t.x,y=t.y;if(dug){ctx.globalAlpha=.35;blob(x,y+2,12*s,4*s,t.seed+40,'#2a2230',0,1);ctx.globalAlpha=1;return;}shadow(x,y+2,10*s,3.5*s,8*s);
 blob(x,y-2*s,8*s,5*s,t.seed+41,t.tw>.6?'#241a2a':'#2b2433',2.2,.5);ctx.globalAlpha=.6;sketch(ell(x,y-3*s,5*s,3*s,10),true,t.seed+42,.4,null,'#a89bb3',1.2);ctx.globalAlpha=1;}
function drawSapling(t,g){const s=t.s*g,x=t.x,y=t.y,h=34*s;shadow(x,y+2,3,1.2,h,8*s);ln([[x,y],[x+t.lean*g*.5,y-h]],t.seed,2.2,INK,.4);
 for(let i=0;i<3;i++)blob(x+t.lean*g*.5+(i-1)*6*s,y-h-(i%2)*5*s,6*s+2,4*s+1,t.seed+50+i,'#2a3c2e',1.6,.4);}
/* actions on a tree, by stage and level */
function harvestObj(t){const w=woodOf(t),T=tstage(t),L=lv('woodcutting'),nm=w==='ironbark'?'Gnarled tree':w==='twistwood'?'Twisted tree':'Shadow tree';
 const base={x:t.x,y:t.y-30*t.s*T.g,r:Math.max(14,22*t.s*T.g),key:'shadowtree'};
 if(T.st==='hole')return null;
 if(T.st==='stump')return Object.assign(base,{y:t.y-6,r:16,name:'Stump',act:'Dig it out',onAct:()=>chopTree(t,'stump'),onExamine:()=>think(T.g>.9?'A big stump. The roots will go deep.':'A stump. It was only young.')});
 if(T.st==='sapling')return Object.assign(base,{name:'Sapling',act:'Cut a pole',onAct:()=>chopTree(t,'sap'),onExamine:()=>think('A sapling, straight as a rule. It would make a good pole, or a tree, given time.')});
 if(T.st==='snag')return Object.assign(base,{name:'Dead snag',act:L>=WOODREQ[w]?'Fell it':null,onAct:()=>chopTree(t,'snag'),onExamine:()=>{think(L>=WOODREQ[w]?'Dead and standing. Dry wood all the way through.':'Dead and standing. Too hard for me yet. (Woodcutting '+WOODREQ[w]+')');}});
 const ops=[];if(L>=WOODREQ[w])ops.push({l:'Fell it',k:'trunk'});if(T.st==='full'&&T.lim>=.95&&L>=LIMREQ[w])ops.push({l:'Take limbs',k:'lim'});if(T.br>=.95)ops.push({l:'Take branches',k:'br'});
 const nmS=T.st==='young'?'Young '+nm.toLowerCase():nm;
 return Object.assign(base,{name:nmS,act:ops.length?ops[0].l:null,onAct:ops.length?()=>chopTree(t,ops[0].k):null,more:ops.slice(1).map(o=>({l:o.l,f:()=>chopTree(t,o.k)})),
  onExamine:()=>{discover('shadowtree');think(ops.length?treeTwistTxt(t):'Stripped bare. The branches will come back.');if(L<WOODREQ[w])setTimeout(()=>think('I can take '+(L>=LIMREQ[w]?'branches and limbs':'branches')+' from it. Felling it needs Woodcutting '+WOODREQ[w]+'.'),1600);}});}
function harvestReady(t,k){const T=tstage(t),w=woodOf(t),L=lv('woodcutting');
 if(k==='stump')return T.st==='stump';if(k==='sap')return T.st==='sapling';if(k==='snag')return T.st==='snag'&&L>=WOODREQ[w];
 if(T.st!=='full'&&T.st!=='young')return false;if(k==='br')return T.br>=.95;if(k==='lim')return T.st==='full'&&T.lim>=.95&&L>=LIMREQ[w];return L>=WOODREQ[w];}
function give(id,n,x,y){if(n<=0)return 0;let lost=0;for(let i=0;i<n;i++){if(canAdd(id))addItem(id,1);else{dropGround({id});lost++;}}if(n-lost>0)flies.push({id:'misc',img:id,x0:x,y0:y,t:0});return lost;}
/* the end of a harvest: yields, xp, and what the tree loses */
function harvestFinish(T){const t=T.tree,k=T.layer,w=woodOf(t),L=lv('woodcutting'),st=tstage(t),x=t.x,y=t.y-30*t.s*st.g,n=Date.now(),R=S.shTree[t.seed]=S.shTree[t.seed]||{};
 const BR='br_'+w,LB='lb_'+w,xpW={blackwood:9,twistwood:18,ironbark:34}[w],ov=Math.max(0,L-WOODREQ[w]);let lost=0,xp=0,say='';
 if(k==='br'){lost+=give(BR,4+Math.floor(L/15),x,y);R.br=n;xp=xpW*.3;say=pick(['An armful of branches. The tree hardly noticed.','Branches down. It still stands.']);}
 else if(k==='lim'){lost+=give(LB,2+Math.floor((L-LIMREQ[w])/15),x,y);lost+=give(BR,Math.round(2*st.br),x,y);R.lim=n;R.br=n;xp=xpW*.6;say='Limbs off. More light gets in now.';}
 else if(k==='trunk'||k==='snag'){const logs=st.st==='young'&&st.g<.75?1:1+Math.min(2,Math.floor(ov/15));lost+=give(w,logs,x,y);if(k==='trunk'){lost+=give(LB,Math.round(st.lim),x,y);lost+=give(BR,Math.round(st.br),x,y);}
  S.shTree[t.seed]={cut:n,ss:st.g};xp=xpW*(k==='snag'?.8:1)+(logs-1)*xpW*.3;S.st.logs=(S.st.logs||0)+1;discover(w);
  for(let i=0;i<10;i++)leaves.push({x:t.x+(Math.random()-.5)*30*t.s,y:t.y-38*t.s+(Math.random()-.5)*20*t.s,vx:(Math.random()-.5)*40,vy:10+Math.random()*30,t:0,s:Math.random()*6.28});
  say=k==='snag'?'Dry right through. It came down in one piece.':w==='ironbark'?'It took everything I had. The log is heavier than it looks.':w==='twistwood'?'Hard going. The grain twists like rope.':pick(['It comes down without a sound.','The trunk was hollow. Something had been in it.']);}
 else if(k==='sap'){lost+=give('pole',1,x,y);lost+=give(BR,1,x,y);S.shTree[t.seed]={cut:n,ss:st.g};xp=xpW*.25;say='A straight pole. The spot will try again.';}
 else if(k==='stump'){const r=Math.random;lost+=give('rootwood',1+(r()<.5?1:0),t.x,t.y);let found=[];
  if(r()<.35){lost+=give('fatwood',1+(r()<.4?1:0),t.x,t.y);found.push('fatwood');}if(r()<.12+t.tw*.15){lost+=give('burl',1,t.x,t.y);found.push('a burl');}
  if(r()<.4){lost+=give('bait',2+(r()<.5?1:0),t.x,t.y);found.push('grubs');}
  if(r()<.03){lost+=give('shells',12,t.x,t.y);discover('stumpcache');found.push('a rotted pouch of shells');}
  R.dug=n;xp=xpW*.5*st.g;say=found.length?'Roots, and '+found.join(', ')+'.':'Roots. Just roots. Good wood all the same.';}
 grid=null;if(xp)addXP('woodcutting',Math.round(T.miss?xp*.75:xp),'normal',[x,y]);if(lost)setTimeout(()=>think('My pack is full. The rest is on the ground.'),1400);P.task=null;think(say);save();}
