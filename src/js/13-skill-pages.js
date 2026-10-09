/* skill pages */
function skBar(k){const D=SKILLS[k],x=xpOf(k),L=lvl(x),c=XP[L],n=XP[L+1]||c,pct=L>=99?100:(x-c)/(n-c)*100;
 return `<img src="${icon(D.icon)}" alt=""><div class="m"><div class="top"><b>${D.name}</b><span>Level ${L}</span></div><div class="bar"><i style="width:${pct.toFixed(1)}%;background:${D.col}"></i></div><small>${L>=99?'Mastered':Math.ceil(n-x)+' xp to level '+(L+1)}</small></div>`;}
function skillCard(k){return `<button class="skill skb" data-skp="${k}">${skBar(k)}<span class="chev">›</span></button>`;}
function dxb(key,img,ok,badge){return `<button class="dx${ddSel===key?' sel':''}" data-dd="${key}" aria-label="Details"><img class="${ok?'':'sil'}" src="${img}" alt="">${badge||''}</button>`;}
function xGot(id){return !!S.journal[id==='wobble'?'wobblelog':id];}
function discHTML(k){
 if(k==='shipwright')return ['hatchet','wobble','charcoal','seasalt','pearl','sunstone'].map(id=>dxb('x:'+id,icon(id),xGot(id))).join('');
 if(k==='fishing')return Object.keys(FISH).map(id=>dxb('f:'+id,icon(id),S.journal['fish_'+id])).join('')+dxb('bottle',icon('bottle'),S.bottles,`<i>${S.bottles||0}/3</i>`);
 const ck=(S.st&&S.st.ck)||{};
 return Object.keys(FISH).map(id=>dxb('c:'+id,icon('ck_'+id+'_good'),ck[id])).join('')+dxb('gold',icon('ck_minnow_perfect'),S.journal.perfectcook)+dxb('smoky',icon('ck_minnow_smoky'),S.journal.smoky);}
const WHERE={shallow:'bubbling water',deep:'the wild water by the north rocks',moon:'the glowing pool, only after dark'};
function ddText(key){const st=S.st||{},fc=st.fc||{},fp=st.fp||{},cc=st.cc||{};
 if(key.startsWith('a:')){const [,k,i]=key.split(':'),[n,d,f]=ACH[k][+i];return `<b>${n}</b><br>${d}.${f()?' Done.':''}`;}
 if(key.startsWith('x:')){const id=key.slice(2),M=ITEMS[id],got=xGot(id);
  if(!got)return {hatchet:'<b>???</b><br>Something sharp, something to hold, something to tie them.',wobble:'<b>???</b><br>The wobble trees are holding onto something.',charcoal:'<b>???</b><br>Some fires leave more than ash.',seasalt:'<b>???</b><br>Some fires leave more than ash.',sunstone:'<b>???</b><br>Only the longest, hottest fires leave this behind.',pearl:'<b>???</b><br>Some fires leave more than ash. Rarely.'}[id];
  const extra=id==='wobble'?` Chopped ${st.logs||0}. You carry ${S.wobble||0}.`:id==='hatchet'?' Keep it in your pack to chop.':` Found ${(st.found||{})[id]||0}.`;return `<b>${M.name}</b><br>${M.desc}${extra}`;}
 if(key==='bottle')return `<b>Letters from C.</b><br>${S.bottles||0} of 3 found. They tangle on your line in the shallows. Read them from your pack.`;
 if(key==='gold'){const n=st.perfC||0;return S.journal.perfectcook?`<b>Golden</b><br>Gold band on both sides. Eat one for sharper timing and longer bites, 5 min. Made ${n}.`:`<b>Golden</b><br>Flip and plate while the marker sits in the gold band. Not made yet.`;}
 if(key==='smoky'){const n=Object.values(cc).reduce((a,c)=>a+(c.s||0),0);return S.journal.smoky?`<b>Smoky</b><br>Cooked mostly over a kelp flare. Eat one and fish bite sooner, 4 min. Made ${n}.`:`<b>Something smoky</b><br>Wick keeps muttering about kelp and smoke.`;}
 const [t,id]=key.split(':'),F=FISH[id];
 if(t==='f'){if(!S.journal['fish_'+id])return `<b>Unknown fish</b><br>Bites in ${WHERE[F.spot]}${F.lvl>1?' once you reach Fishing '+F.lvl:''}.`;
  return `<b>${F.name}</b><br>Caught ${fc[id]||0}${fp[id]?', '+fp[id]+' perfect':''}. Found in ${WHERE[F.spot]}. Gubbins pays ${F.val} shell${F.val>1?'s':''}.`;}
 const c=cc[id];if(!c||!(st.ck||{})[id])return `<b>Not cooked yet</b><br>${S.journal['fish_'+id]?'Bring a '+F.name+' to a fire.':'Catch it first. The sea is hiding this one.'}`;
 const parts=[c.g?c.g+' golden':'',c.s?c.s+' smoky':'',c.c?c.c+' charred':''].filter(Boolean).join(', ');
 return `<b>Cooked ${F.name}</b><br>Cooked ${c.n}${parts?': '+parts:''}. Eat for longer bites, 3 min. Sells for ${Math.ceil(F.val*2)}+ shells.`;}
function skillPage(k){const D=SKILLS[k],L=lv(k),B=buffOn();
 let h=`<button class="back2" data-skb="1">‹ All skills</button><div class="skill">${skBar(k)}</div><p class="sdesc${ddSel?' dd':''}">${ddSel?ddText(ddSel):D.desc}</p><div class="sh">Discoveries</div><div class="disc">${discHTML(k)}</div><div class="sh">Achievements</div><div class="ach">`;
 h+=ACH[k].map(([n,,f],i)=>{const ok=f(),key='a:'+k+':'+i;return `<button class="${ok?'ok':''}${ddSel===key?' sel':''}" data-dd="${key}"><span class="ck">${ok?'✓':''}</span><b>${n}</b></button>`;}).join('')+'</div>';
 const nl=Object.keys(D.unl).map(Number).sort((a,b)=>a-b).find(l=>l>L);
 h+=`<div class="next">${nl?`At level ${nl}: ${D.unl[nl]}.`:'Every secret this skill holds, you’ve heard. For now.'}`+
  (k==='fishing'&&B&&BUFF[B.q]?`<br><span class="muted">Well fed: ${BUFF[B.q].txt}, ${Math.ceil((B.until-Date.now())/60000)}m left</span>`:'')+
  (k==='hearth'?`<br><span class="muted">Fires built: ${S.st.fires||0}. Fish cooked: ${S.st.cooked||0}.</span>`:'')+'</div>';
 return h;}

