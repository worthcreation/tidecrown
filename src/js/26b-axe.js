/* ---------- the longaxe (build 41) ----------
   Nothing is given: the player washes up bare-handed. The first axe is made: a clam-shell head ground at the rocks, a
   long driftwood haft, dry kelp for the lashing. Wobblewood makes a better haft later (springier, tougher, one more
   splice). Two ends: the blade slices (Strife, and chopping); the haft knocks things down (blunt) and, at its longest
   reach, prods (the gentle use for now, until Accord is redesigned).
   Every use wears the part doing the work. The lashing frays, then snaps and the head flies off (into the sand, or
   lost in water). The head dulls; a regrind at the rocks restores it but leaves it smaller, so it cuts a little worse
   for good, and after three it is ground away. The haft cracks; a splice holds it but shortens it, so it reaches a
   little less for good, and past its splices it needs replacing. A full rebuild is fresh again. Wear shows on the axe
   and in words, never as a meter. Every act of making and mending gives XP in the skill it uses; repairs a bit less. */
const AX={lash:150,dull:60,haft:220,grinds:3,splice:{drift:2,wobble:3}};
function axeHave(){return S.eq.weapon==='hatchet'||S.inv.some(i=>i.id==='hatchet');}
function axeWhole(){const A=S.axe;return !!(axeHave()&&A&&A.h&&A.f&&A.l&&!A.f.cr);}
/* how well it cuts and how far it reaches, from the head's and the haft's history */
function axeCut(){const A=S.axe;if(!axeWhole())return 0;return (1-.12*A.h.g)*(A.h.w>=1?.55:1-.25*A.h.w);}
function axeReach(){const A=S.axe;if(!A||!A.f)return 1;return 1.15+(A.f.k==='wobble'?.1:0)-.1*A.f.s;}
function axeNew(){return {h:{w:0,g:0},f:{k:'drift',w:0,s:0,cr:0},l:{w:0}};}
function axeXP(sk,n,pos){const p=pos||[P.x,P.y-40];if(sk==='woodcutting'&&!hasSkill('woodcutting'))sk='tinkering';if(!hasSkill(sk)){unlockSkill(sk);toast('New skill: '+((SUBS[sk]&&SUBS[sk].name)||sk));}addXP(sk,n,'normal',p);}
/* wear by use: cut (the edge), blunt (the haft, hard), prod (the haft, lightly); every use tugs the lashing */
function axeWear(kind){const A=S.axe;if(!axeWhole())return;const hk=A.f.k==='wobble'?.7:1;
 if(kind==='cut'){A.h.w+=1/AX.dull;A.f.w+=hk/AX.haft;}else if(kind==='blunt')A.f.w+=1.8*hk/AX.haft;else A.f.w+=1.2*hk/AX.haft;
 A.l.w+=(kind==='blunt'?1.3:1)/AX.lash;
 if(A.h.w>=1&&!A.h.dull){A.h.dull=1;think('The edge has gone dull. It bites like a spoon now. The grinding rocks would bring it back.');}
 else if(A.h.w>=.7&&!A.h.warn){A.h.warn=1;think('The edge is going. It’s tearing more than cutting.');}
 if(A.l.w>=1){axeSnap();return;}if(A.l.w>=.8&&!A.l.warn){A.l.warn=1;think('The lashing is fraying. Fresh kelp, before it lets go.');}
 if(A.f.w>=1){A.f.cr=1;P.task=null;sfx('thud');think('Crack. The haft split along the grain. A splice might hold it.');}
 else if(A.f.w>=.8&&!A.f.warn){A.f.warn=1;think('The haft creaks when I swing. There’s a crack coming.');}}
/* the lashing lets go: the head flies off, onto the ground if it lands on land, or into the water and gone */
function axeSnap(){const A=S.axe,h=A.h;P.task=null;A.l=null;A.h=null;sfx('ring');hap(30);S.ground=S.ground||[];
 for(let k=0;k<10;k++){const a=Math.random()*6.2832,d=30+Math.random()*60,x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d*.7;
  if(k<9&&(!walkable(x,y)||(!SH.on&&inSea(x,y))))continue;
  if(!walkable(x,y)||(!SH.on&&inSea(x,y))){S.st.headsLost=(S.st.headsLost||0)+1;think('The lashing snapped and the head spun off into the water. Gone.');save();return;}
  S.ground.push({x,y,it:{id:'axehead',g:h.g,w:h.w},exp:Date.now()+3*86400000});pop('*ping*',x,y-30,'#fff',17);think('The lashing snapped and the head flew off. There, on the ground.');save();return;}}
/* the axe's state in words, for the pack and the hand */
function axeWords(){const A=S.axe;if(!A)return 'A longaxe.';const h=!A.h?'no head':A.h.w>=1?'a dull head':A.h.w>.5?'an edge going dull':'a keen edge',
 g=A.h&&A.h.g?' (ground '+A.h.g+(A.h.g===1?' time':' times')+')':'',f=!A.f?'no haft':(A.f.k==='wobble'?'a wobblewood haft':'a driftwood haft')+(A.f.cr?', cracked':A.f.s?', spliced '+A.f.s+(A.f.s===1?' time':' times'):''),
 l=!A.l?'no lashing':A.l.w>.8?'lashing about to go':A.l.w>.4?'lashing fraying':'tight lashing';return 'Longaxe: '+h+g+', '+f+', '+l+'.';}
/* what can be done with what is in the pack: buttons for the gear and pack panels */
function axeActs(){const A=S.axe;if(!A)return '';const kelp=(S.kelp||0)>0,b=[];
 if(A.h&&A.f&&A.l&&A.l.w>.15)b.push(['relash','Relash ('+(kelp?'1 dry kelp':'needs dry kelp')+')']);
 if(!A.h&&A.f&&(S.inv.some(i=>i.id==='axehead')||cnt('shellblade')>0))b.push(['fithead','Fit '+(S.inv.some(i=>i.id==='axehead')?'the head':'the shell blade')+' (1 dry kelp)']);
 if(A.f&&A.f.cr&&A.f.s<AX.splice[A.f.k])b.push(['splice','Splice the haft (1 dry kelp)']);
 if((S.wood||0)>0&&(!A.f||A.f.cr||A.f.k==='drift'&&A.f.s>0))b.push(['haft:drift','New driftwood haft (1 driftwood, 1 dry kelp)']);
 if((S.wobble||0)>0&&(!A.f||A.f.k!=='wobble'||A.f.cr||A.f.s>0))b.push(['haft:wobble','New wobblewood haft (1 wobblewood, 1 dry kelp)']);
 return b.map(([k,l])=>`<button data-ax="${k}">${l}</button>`).join('');}
function axeDo(k){const A=S.axe;if(!A)return;const needK=()=>{if(!((S.kelp||0)>0)){toast('Needs 1 dry kelp');return false;}S.kelp--;return true;};
 if(k==='relash'){if(!needK())return;A.l={w:0};sfx('open');axeXP('tinkering',6);think('Fresh kelp, wound tight. That will hold a while.');}
 else if(k==='fithead'){if(!needK())return;const i=S.inv.findIndex(x=>x.id==='axehead');if(i>=0){const it=S.inv.splice(i,1)[0];A.h={w:it.w||0,g:it.g||0};axeXP('tinkering',8);}else{takeItem('shellblade');A.h={w:0,g:0};axeXP('tinkering',12);}
  A.l={w:0};sfx('chop',.6);think('Head on, lashed tight. It’s an axe again.');}
 else if(k==='splice'){if(!A.f||!A.f.cr||A.f.s>=AX.splice[A.f.k]){toast('Too short to splice again. It needs a new haft.');return;}if(!needK())return;A.f.s++;A.f.w=0;A.f.cr=0;A.f.warn=0;sfx('chop',.5);axeXP('woodcutting',6);axeXP('tinkering',3);think(A.f.s>=AX.splice[A.f.k]?'Spliced again. It’s short now. One more crack and it needs a new haft.':'Spliced and bound. A little shorter, but it’ll swing.');}
 else if(k.startsWith('haft:')){const kind=k.slice(5);if(!needK())return;if(kind==='drift'){S.wood--;}else{S.wobble--;}A.f={k:kind,w:0,s:0,cr:0};if(A.h)A.l={w:0};sfx('chop',.7);axeXP('woodcutting',12);axeXP('tinkering',6);
  think(kind==='wobble'?'A wobblewood haft. It springs in the hand like it wants to swing.':'A fresh driftwood haft, long and straight.');}
 save();}
/* the first axe, from a shell blade in the pack */
function axeCraft(){if(!((S.wood||0)>0&&(S.kelp||0)>0)){toast('Needs 1 driftwood and 1 dry kelp');return false;}S.wood--;S.kelp--;takeItem('shellblade');S.inv.push({id:'hatchet'});S.axe=axeNew();S.owned.hatchet=1;
 const first=!hasSkill('tinkering');if(first){unlockSkill('tinkering');toast('New skill: Tinkering');}addXP('tinkering',30,first?'first':'normal',[P.x,P.y-30]);discover('hatchet');think('A shell edge on a long driftwood haft, lashed with kelp. It’s mine. I made it.');return true;}
/* regrinding at the rocks: a dozen steady strokes */
function axeGrindAct(){const A=S.axe;return A&&A.h&&A.h.w>.3&&axeHave()?'Regrind the axe':null;}
function axeGrindDone(){const A=S.axe;if(!A||!A.h)return;A.h.g++;A.h.w=0;A.h.dull=0;A.h.warn=0;axeXP('tinkering',8);
 if(A.h.g>AX.grinds){A.h=null;A.l=null;think('Ground down past saving. There’s no edge left in it. I need a new shell blade.');}
 else think(A.h.g===AX.grinds?'Sharp again, but there’s hardly any shell left. One more grind will finish it.':'Sharp again. A little smaller than it was.');save();}
/* wear drawn on the axe: a frayed lashing, a crack in the haft, a notch in the edge */
function axeMarks(){const A=S.axe;return {fray:A&&A.l?A.l.w:1,crack:A&&A.f&&(A.f.cr||A.f.w>.8),dull:A&&A.h?A.h.w:0,head:!!(A&&A.h),lash:!!(A&&A.l),haftK:A&&A.f?(A.f.k==='wobble'?'#b9a074':'#d9cdb5'):'#d9cdb5',len:axeReach()};}
function drawAxeIn(L){const m=axeMarks(),hl=L*m.len;ln([[0,6],[0,-hl]],952,3.8,INK,.3);ln([[0,6],[0,-hl]],952,2,m.haftK,.3);if(m.crack)ln([[-1,-hl*.45],[1.5,-hl*.55]],957,1.2,INK,.2);
 if(m.head){sketch([[-1.5,-hl-3],[7,-hl-1.5],[5.5,-hl+5],[0,-hl+3]],true,953,.3,'#efe6d2',INK,1.5);if(m.dull>.7)ln([[5,-hl],[6.5,-hl+2]],958,1.2,INK,.2);}
 if(m.lash){ln([[-2.5,-hl+2],[2.5,-hl+3]],954,2.2,'#5f6b3a',.3);if(m.fray>.5)ln([[2.5,-hl+3],[5,-hl+7]],955,1,'#5f6b3a',.4);}}
