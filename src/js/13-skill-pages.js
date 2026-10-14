/* skill pages */
function skBar(k){const D=skd(k),x=xpOf(k),par=!!SKILLS[k],T=par?PXP:XP,top=par?10:99,L=par?plvl(x):lvl(x),c=T[L],n=T[L+1]||c,pct=L>=top?100:(x-c)/(n-c)*100;
 return `<img src="${icon(D.icon)}" alt=""><div class="m"><div class="top"><b>${D.name}</b><span>Level ${L}${par?' of 10':''}</span></div><div class="bar"><i style="width:${pct.toFixed(1)}%;background:${D.col}"></i></div><small>${L>=top?'Mastered':Math.ceil(n-x)+' xp to level '+(L+1)}</small></div>`;}
function skillCard(k,sub){return `<button class="skill skb" data-${sub?'sub':'skp'}="${k}">${skBar(k)}<span class="chev">›</span></button>`;}
function subRow(k){const D=SUBS[k];return hasSkill(k)?skillCard(k,1):`<div class="skill hid"><span class="q">?</span><div class="m"><div class="top"><b>${D.name}</b></div><small>${D.clue}</small></div></div>`;}
function dxb(key,img,ok,badge){return `<button class="dx${ddSel===key?' sel':''}" data-dd="${key}" aria-label="Details"><img class="${ok?'':'sil'}" src="${img}" alt="">${badge||''}</button>`;}
function xGot(id){return !!S.journal[id==='wobble'?'wobblelog':id];}
function discHTML(k){
 if(k==='foraging'){const f=S.st.found||{};return ['wood','kelp','shells','bait','wobble','seasalt'].map(id=>dxb('g:'+id,icon(id),f[id])).join('');}
 const X={woodcutting:['wobble','blackwood','twistwood','ironbark'],firemaking:['charcoal','seasalt','pearl','sunstone'],tinkering:['hatchet'],strife:['deadwood'],accord:['pearl']}[k];
 if(X)return X.map(id=>dxb('x:'+id,icon(id),xGot(id))).join('');
 if(k==='fishing')return Object.keys(FISH).map(id=>dxb('f:'+id,icon(id),S.journal['fish_'+id])).join('')+dxb('bottle',icon('bottle'),S.bottles,`<i>${S.bottles||0}/3</i>`);
 const ck=(S.st&&S.st.ck)||{};
 return Object.keys(FISH).map(id=>dxb('c:'+id,icon('ck_'+id+'_good'),ck[id])).join('')+dxb('gold',icon('ck_minnow_perfect'),S.journal.perfectcook)+dxb('smoky',icon('ck_minnow_smoky'),S.journal.smoky);}
const WHERE={shallow:'bubbling water',deep:'the wild water by the north rocks',moon:'the glowing pool, only after dark'};
function ddText(key){const st=S.st||{},fc=st.fc||{},fp=st.fp||{},cc=st.cc||{};
 if(key.startsWith('w:')){const [,s_,m]=key.split(':'),M=METHODS[s_][m];return `<b>${M.name}</b><br>${M.clue}`;}
 if(key.startsWith('a:')){const [,k,i]=key.split(':'),[n,d,f]=ACH[k][+i];return `<b>${n}</b><br>${d}.${f()?' Done.':''}`;}
 if(key.startsWith('g:')){const id=key.slice(2),n=(S.st.found||{})[id]||0;if(!n)return `<b>???</b><br>${id==='seasalt'?'Hard surfaces sparkle between waves.':'The tide brings it in, sometimes.'}`;return `<b>${ITEMS[id].name}</b><br>${ITEMS[id].desc} Foraged ${n}.`;}
 if(key.startsWith('x:')){const id=key.slice(2),M=ITEMS[id],got=xGot(id),k=subView;
  if(!got)return {hatchet:'<b>???</b><br>Something sharp, something to hold, something to tie them.',wobble:'<b>???</b><br>The wobble trees are holding onto something.',charcoal:'<b>???</b><br>Some fires leave more than ash.',seasalt:'<b>???</b><br>Some fires leave more than ash.',sunstone:'<b>???</b><br>Only the longest, hottest fires leave this behind.',pearl:'<b>???</b><br>'+(k==='accord'?'Something warm, for a hollow to hold.':'Some fires leave more than ash. Rarely.'),deadwood:'<b>???</b><br>Something comes off a Hollowmaw when it goes down.',blackwood:'<b>???</b><br>The dark islands have trees of their own.',twistwood:'<b>???</b><br>The more twisted the tree, the harder the wood.',ironbark:'<b>???</b><br>Some trees are gnarled past reason.'}[id];
  const extra=id==='wobble'?` Chopped ${st.logs||0}. You carry ${S.wobble||0}.`:id==='hatchet'?' In your pack or in hand, it chops. In hand, it hews and sweeps too.':` Found ${(st.found||{})[id]||0}.`;return `<b>${M.name}</b><br>${M.desc}${extra}`;}
 if(key==='bottle')return `<b>Letters from C.</b><br>${S.bottles||0} of 3 found. They tangle on your line in the shallows. Read them from your pack.`;
 if(key==='gold'){const n=st.perfC||0;return S.journal.perfectcook?`<b>Golden</b><br>Gold band on both sides. Eat one for sharper timing and longer bites, 5 min. Made ${n}.`:`<b>Golden</b><br>Flip and plate while the marker sits in the gold band. Not made yet.`;}
 if(key==='smoky'){const n=Object.values(cc).reduce((a,c)=>a+(c.s||0),0);return S.journal.smoky?`<b>Smoky</b><br>Cooked mostly over a kelp flare. Eat one and fish bite sooner, 4 min. Made ${n}.`:`<b>Something smoky</b><br>Brimble keeps muttering about kelp and smoke.`;}
 const [t,id]=key.split(':'),F=FISH[id];
 if(t==='f'){if(!S.journal['fish_'+id])return `<b>Unknown fish</b><br>Bites in ${WHERE[F.spot]}${F.lvl>1?' once you reach Fishing '+F.lvl:''}.`;
  return `<b>${F.name}</b><br>Caught ${fc[id]||0}${fp[id]?', '+fp[id]+' perfect':''}. Found in ${WHERE[F.spot]}. Gubbins pays ${F.val} shell${F.val>1?'s':''}.`;}
 const c=cc[id];if(!c||!(st.ck||{})[id])return `<b>Not cooked yet</b><br>${S.journal['fish_'+id]?'Bring a '+F.name+' to a fire.':'Catch it first. The sea is hiding this one.'}`;
 const parts=[c.g?c.g+' golden':'',c.s?c.s+' smoky':'',c.c?c.c+' charred':''].filter(Boolean).join(', ');
 return `<b>Cooked ${F.name}</b><br>Cooked ${c.n}${parts?': '+parts:''}. Eat for longer bites, 3 min. Sells for ${Math.ceil(F.val*2)}+ shells.`;}
function methRow(sub,m){const M=METHODS[sub][m],key='w:'+sub+':'+m;if(!M.found())return `<button class="way hid${ddSel===key?' sel':''}" data-dd="${key}"><span class="q">?</span><small>${M.name}</small></button>`;
 return `<button class="way" data-meth="${m}"><img src="${icon(M.icon)}" alt=""><small>${M.name}</small></button>`;}
function methodPage(sub,m){const M=METHODS[sub][m],D=SUBS[sub];
 let h=`<button class="back2" data-skb="1">‹ ${D.name}</button><div class="skill"><img src="${icon(M.icon)}" alt=""><div class="m"><div class="top"><b>${M.name}</b><span>${D.name}</span></div><small>${M.desc||''}</small></div></div><div class="sh">Moves</div><div class="moves">`;if(m==='scarf')h=h.replace('</small></div></div><div class="sh">Moves','. Reach now: '+reach()+'.</small></div></div><div class="sh">Moves');
 h+=M.moves.map(([n,d,st])=>`<div class="mv"><b>${n}</b>${st?`<span>${S.st[st]||0}</span>`:''}<small>${d}</small></div>`).join('')+'</div>';
 const got=Object.keys(S.st.bursts||{}).filter(x=>x.startsWith(sub+':')).map(x=>x.slice(sub.length+1)),b=M.bursts.filter(x=>got.includes(x));
 h+=`<div class="next">Bursts found this way: ${b.length?b.join(', '):'none yet'}.${M.bursts.length>b.length?' Others are still hidden in it.':''}</div>`;return h;}
function parentPage(k){const D=SKILLS[k];
 return `<button class="back2" data-skb="1">‹ All skills</button><div class="skill">${skBar(k)}</div><p class="sdesc pd">${D.desc}</p>`+D.subs.map(subRow).join('')+(ACH[k]?`<p class="sdesc${ddSel?' dd':''}">${ddSel&&ddSel.startsWith('a:'+k+':')?ddText(ddSel):'Achievements of its own:'}</p><div class="ach">`+ACH[k].map(([n,,f],i)=>{const ok=f(),key='a:'+k+':'+i;return `<button class="${ok?'ok':''}${ddSel===key?' sel':''}" data-dd="${key}"><span class="ck">${ok?'✓':''}</span><b>${n}</b></button>`;}).join('')+'</div>':'');}
function skillPage(k){const D=SUBS[k],L=lv(k),B=buffOn();
 let h=`<button class="back2" data-skb="1">‹ ${SKILLS[D.p].name}</button><div class="skill">${skBar(k)}</div><p class="sdesc${ddSel?' dd':''}">${ddSel?ddText(ddSel):D.desc}</p>`;
 if(METHODS[k])h+=`<div class="sh">Ways</div><div class="ways">${Object.keys(METHODS[k]).map(m=>methRow(k,m)).join('')}</div>`;
 h+=`<div class="sh">Discoveries</div><div class="disc">${discHTML(k)}</div><div class="sh">Achievements</div><div class="ach">`;
 h+=(ACH[k]||[]).map(([n,,f],i)=>{const ok=f(),key='a:'+k+':'+i;return `<button class="${ok?'ok':''}${ddSel===key?' sel':''}" data-dd="${key}"><span class="ck">${ok?'✓':''}</span><b>${n}</b></button>`;}).join('')+'</div>';
 const nl=Object.keys(D.unl).map(Number).sort((a,b)=>a-b).find(l=>l>L);
 h+=`<div class="next">${nl?`At level ${nl}: ${D.unl[nl]}.`:'Every secret this skill holds, you’ve heard. For now.'}`+
  (k==='fishing'&&B&&BUFF[B.q]?`<br><span class="muted">Well fed: ${BUFF[B.q].txt}, ${Math.ceil((B.until-Date.now())/60000)}m left</span>`:'')+
  (['fishing','woodcutting','cooking','foraging','swimming','strife','accord'].includes(k)?`<br><span class="muted">Bursts found: ${Object.keys(S.st.bursts||{}).filter(n=>n.startsWith(k+':')).map(n=>n.slice(k.length+1)).join(', ')||'none yet'}.</span>`:'')+
 (k==='foraging'?`<br><span class="muted">Wash-ups grabbed: ${S.st.washes||0}. Salt scraped: ${S.st.pinches||0}. Tide is ${tideLevel()>.66?'high':tideLevel()<.33?'low':tideLevel()>.5?'going out':'coming in'}.</span>`:k==='cooking'?`<br><span class="muted">Fish cooked: ${S.st.cooked||0}.</span>`:k==='firemaking'?`<br><span class="muted">Fires built: ${S.st.fires||0}.</span>`:'')+'</div>';
 return h;}

