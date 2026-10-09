/* ---------- panel ---------- */
let tab='pack',sel=-1,selG=null;
function openPanel(t){tab=t||tab;sel=-1;selG=null;jPage=0;skView=null;ddSel=null;renderPanel();panel.classList.add('on');scrim.style.display='block';closeCtx();bag.classList.remove('pulse');if(S.hint===4)advanceHint(5);}
function closePanel(){panel.classList.remove('on');scrim.style.display='none';}
const BANKSLOTS=30,bankEl=$('bank');let bankOpen=false,bankMode='all';
function bkey(it){return it.id==='cook'?'cook:'+it.f+':'+it.q:it.id==='bottle'?'bottle:'+it.msg:it.id;}
function openBank(){discover('gullbank');S.bank=S.bank||[];bankOpen=true;closeCtx();closePanel();bankEl.classList.add('on');scrim.style.display='block';renderBank();}
function closeBank(){bankOpen=false;bankEl.classList.remove('on');scrim.style.display='none';}
function renderBank(note){const st=getComputedStyle(bankEl),W2=bankEl.clientWidth-24,H2=bankEl.clientHeight-20-44-40-24;const bs=Math.max(34,Math.floor(Math.min((W2-30)/6,(H2-8*6)/9)));bankEl.style.setProperty('--bs',bs+'px');
 const b=S.bank;let h='';for(let i=0;i<BANKSLOTS;i++){const e=b[i];h+=e?`<button class="slot f" data-b="${i}" aria-label="${itemName(e.it)}"><img src="${iconImg(iconKey(e.it)).src}" alt=""><i class="cnt">${e.n>999?Math.floor(e.n/1000)+'k':e.n}</i></button>`:'<div class="slot"></div>';}
 $('bgrid').innerHTML=h;h='';for(let i=0;i<PACK;i++){const it=S.inv[i];h+=it?`<button class="slot f" data-p="${i}" aria-label="${itemName(it)}"><img src="${iconFor(it)}" alt="">${(it.n||1)>1?'<i class="cnt">'+it.n+'</i>':''}</button>`:'<div class="slot"></div>';}
 $('bpack').innerHTML=h;$('bnote').textContent=note||(b.length+' of '+BANKSLOTS+' bank slots used');bankEl.querySelectorAll('.bmode button').forEach(x=>x.classList.toggle('on',x.dataset.m===bankMode));}
function deposit(i){const it=S.inv[i];if(!it)return false;const k=bkey(it);let e=S.bank.find(q=>q.k===k);if(!e){if(S.bank.length>=BANKSLOTS){renderBank('The bank is full.');return false;}const proto=Object.assign({},it);delete proto.n;e={k,it:proto,n:0};S.bank.push(e);}e.n+=it.n||1;S.inv.splice(i,1);return true;}
function withdraw(j){const e=S.bank[j];if(!e)return;const want=bankMode==='1'?1:e.n;let got=0;
 if(STACK[e.it.id])got=addItem(e.it.id,want);else{while(got<want&&S.inv.length<PACK){S.inv.push(Object.assign({},e.it));got++;}}
 if(!got){renderBank('Your pack is full.');return;}e.n-=got;if(e.n<=0)S.bank.splice(j,1);save();renderBank();}
$('bgrid').addEventListener('click',e=>{const t=e.target.closest('[data-b]');if(t)withdraw(+t.dataset.b);});
$('bpack').addEventListener('click',e=>{const t=e.target.closest('[data-p]');if(t){deposit(+t.dataset.p);save();renderBank();}});
$('bdep').onclick=()=>{for(let i=S.inv.length-1;i>=0;i--){if(S.inv[i].id==='hatchet')continue;deposit(i);}save();renderBank();};
bankEl.querySelectorAll('.bmode button').forEach(x=>x.onclick=()=>{bankMode=x.dataset.m;renderBank();});
$('bankx').onclick=closeBank;addEventListener('resize',()=>{if(bankOpen)renderBank();});
bag.onclick=()=>openPanel('pack');scrim.onclick=()=>{if(bankOpen)closeBank();else closePanel();};panel.querySelector('.x').onclick=closePanel;
panel.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{tab=b.dataset.t;sel=-1;renderPanel();});
const MISC={
 flint:{name:'Flint shard',desc:'Sharp as a grudge. Lashed to a stick with something stringy, it would make a fine hatchet.'},
 hatchet:{name:'Stone hatchet',desc:'Flint, driftwood and kelp twine. Wobble trees eye it nervously.'},
 wobble:{name:'Wobblewood',desc:'A springy log from a wobble tree. Burns long and bright.'},
 charcoal:{name:'Charcoal',desc:'A black lump from the ashes. Burns hotter than anything. Someone will want this.'},
 seasalt:{name:'Sea salt',desc:'Crystals left where kelp burned. Wick’s eyes would light up. Well, more.'},
 pearl:{name:'Ember pearl',desc:'A warm, glowing bead from the heart of a wobblewood fire. It hums when you hold it.'},
 sunstone:{name:'Sunstone',desc:'Smooth, and warm all the way through. It remembers being part of the sun. Nobody knows what it does yet.'},
 shells:{name:'Shells',desc:'Gubbins’ currency. Stacks forever. Don’t ask where he keeps his.'},
 bait:{name:'Glitter bait',desc:'Fish go silly for it. Used up one per cast while you have it.'},
 wood:{name:'Driftwood',desc:'Bleached and bone dry. Burns steady. Stacks five to a slot.'},
 kelp:{name:'Dry kelp',desc:'Brittle and smoky. Burns hot and fast. Stacks ten to a slot.'},
 ash:{name:'Ash',desc:'What a fire leaves behind. Wick and Kindle both get oddly excited about it.'}};
function hasHatchet(){return S.inv.some(i=>i.id==='hatchet');}
function iconFor(it){return it.id==='shells'?icon('shell'):it.id==='cook'?icon('ck_'+it.f+'_'+it.q):icon(it.id);}
function itemName(it){return MISC[it.id]?MISC[it.id].name:it.id==='cook'?QN[it.q]+' '+FISH[it.f].name:it.id==='bottle'?'Message in a bottle':EQUIP[it.id]?EQUIP[it.id].name:FISH[it.id].name;}
function itemDesc(it){return MISC[it.id]?MISC[it.id].desc:it.id==='cook'?QD[it.q]:it.id==='bottle'?'Cork still in. Something rolled up inside.':EQUIP[it.id]?EQUIP[it.id].desc:FISH[it.id].desc;}
let skSel=-1,jPage=0,jPages=[];
const HIDDEN_SK=['Someone on this island knows this one.','It starts with a spark.','Ask the wobble trees.','Something is buried under your feet.','Past the last lighthouse.'];
function gearHTML(){return ['head','body','hand','trinket'].map(sl=>{const id=S.eq[sl],lab={head:'Head',body:'Body',hand:'Hands',trinket:'Charm'}[sl];
 return id?`<button class="slot f${selG===sl?' sel':''}" data-g="${sl}" aria-label="${lab}: ${EQUIP[id].name}"><img src="${icon(id)}" alt=""><span class="tag">${lab}</span></button>`:`<div class="slot gearE"><span class="tag">${lab}</span></div>`;}).join('');}
function infoHTML(){
 if(sel>=0&&S.inv[sel]){const it=S.inv[sel];let a='';if(it.id==='bottle')a+='<button data-a="read">Read it</button>';if(it.id==='flint')a+='<button data-a="craft">Make a hatchet</button>';if(EQUIP[it.id])a+='<button data-a="wear">Wear it</button>';if(it.id==='cook')a+='<button data-a="eat">Eat it</button>';
  if(it.id!=='hatchet')a+='<button data-a="drop">Drop '+((it.n||1)>1?'one':'it')+'</button>';if((FISH[it.id]&&S.inv.filter(x=>x.id===it.id).length>1)||(it.n||1)>1)a+='<button data-a="dropall">Drop all</button>';
  return `<b>${itemName(it)}${(it.n||1)>1?' ×'+it.n:''}</b><p>${itemDesc(it)}</p><div class="acts">${a}</div>`;}
 if(selG&&S.eq[selG]){const id=S.eq[selG];return `<b>${EQUIP[id].name}</b><p>${EQUIP[id].desc}</p><div class="acts"><button data-a="off">Take it off</button></div>`;}
 return `<p class="muted">${S.inv.length?'Tap something to look at it.':'Empty. The sea is full of things that would love to be in here.'}</p>`;}
function sizePack(){const cs=getComputedStyle(pbody),W=pbody.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),H=pbody.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
 const s=Math.max(38,Math.floor(Math.min((W-24)/4,(H-14-40-138)/6)));pbody.style.setProperty('--s',s+'px');}
function renderPanel(){panel.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));let h='';
 if(tab==='skills'){if(skView&&hasSkill(skView)){pbody.innerHTML=skillPage(skView);return;}
  const tot=Object.keys(JOURNAL).length,disc=Object.keys(S.journal).filter(k=>JOURNAL[k]).length;
  if(S.char)h+=`<p class="muted" style="margin:0 0 2px">${esc(S.char.name)}${S.origin?', '+ORIGINS[S.origin].name.replace(/^The /,'the '):''}</p>`;
  Object.keys(SKILLS).forEach(k=>{if(hasSkill(k))h+=skillCard(k);});
  h+=`<div class="stats" style="padding-top:8px"><span>${S.catches||0} catches</span><span>${disc} of ${tot} discoveries</span></div>`;
  const hid=HIDDEN.filter(([k])=>!hasSkill(k));
  h+=`<p class="muted lockt">${['No','One','Two','Three','Four','Five'][hid.length]} skill${hid.length===1?' is':'s are'} still hidden.</p><div class="lockrow">`+hid.map((c,i)=>`<button class="lk${skSel===i?' sel':''}" data-sk="${i}" aria-label="Hidden skill ${i+1}">?</button>`).join('')+`</div><div class="clue">${skSel>=0&&hid[skSel]?hid[skSel][1]:'Tap one for a clue.'}</div>`;
  pbody.innerHTML=h;return;}
 if(tab==='pack'){
  h+=`<div class="grid">${gearHTML()}</div><div class="grid">`;
  for(let i=0;i<PACK;i++){const it=S.inv[i];h+=it?`<button class="slot f${sel===i?' sel':''}" data-i="${i}" aria-label="${itemName(it)}"><img src="${iconFor(it)}" alt="">${(it.n||1)>1||STACK[it.id]?'<i class="cnt">'+(it.n||1)+'</i>':''}</button>`:'<div class="slot"></div>';}
  h+=`</div><div class="info">${infoHTML()}</div>`;pbody.innerHTML=h;sizePack();return;}
 renderJournal();}
function entEl(k){const d=document.createElement('div');d.className='ent';d.innerHTML=`<b>${JOURNAL[k][0]}</b><p>${JOURNAL[k][1]}</p>`;return d;}
function renderJournal(){const keys=Object.keys(S.journal).filter(k=>JOURNAL[k]).sort((a,b)=>S.journal[b]-S.journal[a]),tot=Object.keys(JOURNAL).length;
 pbody.innerHTML=`<p class="muted jhead">${keys.length} of ${tot} discovered on Driftwood Key</p><div class="jlist" id="jlist"></div><div class="pager" id="jpager"><button data-p="-1" aria-label="Previous page">‹</button><span id="jpn"></span><button data-p="1" aria-label="Next page">›</button></div>`;
 const list=$('jlist');jPages=[];let cur=[];
 for(const k of keys){const el=entEl(k);list.appendChild(el);if(list.scrollHeight>list.clientHeight+1&&cur.length){jPages.push(cur);cur=[];list.innerHTML='';list.appendChild(el);}cur.push(k);}
 if(cur.length)jPages.push(cur);showJPage();}
function showJPage(){jPage=Math.max(0,Math.min(jPages.length-1,jPage));const list=$('jlist');list.innerHTML='';(jPages[jPage]||[]).forEach(k=>list.appendChild(entEl(k)));
 const pg=$('jpager'),b=pg.querySelectorAll('button');$('jpn').textContent=`Page ${jPage+1} of ${jPages.length}`;b[0].disabled=jPage===0;b[1].disabled=jPage>=jPages.length-1;pg.style.visibility=jPages.length>1?'visible':'hidden';}
let jsx=null;pbody.addEventListener('pointerdown',e=>{jsx=tab==='journal'?e.clientX:null;});
pbody.addEventListener('pointerup',e=>{if(jsx==null)return;const dx=e.clientX-jsx;jsx=null;if(Math.abs(dx)>50){jPage+=dx<0?1:-1;showJPage();}});
addEventListener('resize',()=>{if(panel.classList.contains('on'))renderPanel();});
pbody.addEventListener('click',e=>{const sp_=e.target.closest('[data-skp]');if(sp_){skView=sp_.dataset.skp;ddSel=null;renderPanel();return;}const dd_=e.target.closest('[data-dd]');if(dd_){ddSel=ddSel===dd_.dataset.dd?null:dd_.dataset.dd;renderPanel();return;}if(e.target.closest('[data-skb]')){skView=null;ddSel=null;renderPanel();return;}const pq=e.target.closest('[data-p]');if(pq){jPage+=+pq.dataset.p;showJPage();return;}const sk=e.target.closest('[data-sk]');if(sk){skSel=+sk.dataset.sk;renderPanel();return;}const s=e.target.closest('[data-i]');if(s){sel=+s.dataset.i;selG=null;renderPanel();return;}const g=e.target.closest('[data-g]');if(g){selG=g.dataset.g;sel=-1;renderPanel();return;}
 const a=e.target.closest('[data-a]');if(!a)return;
 if(a.dataset.a==='off'){if(S.inv.length>=PACK){toast('No room in your pack');return;}S.inv.push({id:S.eq[selG]});S.eq[selG]=null;selG=null;save();renderPanel();return;}
 const it=S.inv[sel];if(!it)return;
 if(a.dataset.a==='craft'){if(!((S.wood||0)>0&&(S.kelp||0)>0)){toast('Needs 1 driftwood and 1 dry kelp');return;}S.wood--;S.kelp--;S.inv.splice(sel,1);S.inv.push({id:'hatchet'});S.shipwright=1;S.owned.hatchet=1;sel=-1;discover('hatchet');toast('New skill: Shipwright');addXP('shipwright',30,'first',[P.x,P.y-30]);save();renderPanel();return;}
 if(a.dataset.a==='eat'){S.inv.splice(sel,1);const B=BUFF[it.q];if(B){S.buff={q:it.q,until:Date.now()+B.dur*1000,dur:B.dur};toast('Well fed: '+B.txt);}else think(it.q==='charred'?'Crunchy. Regrettable.':'My stomach has filed a complaint.');sel=-1;save();renderPanel();return;}
 if(a.dataset.a==='wear'){const E=EQUIP[it.id],old=S.eq[E.slot];S.inv.splice(sel,1);S.eq[E.slot]=it.id;if(old)S.inv.push({id:old});sel=-1;save();renderPanel();toast('Wearing: '+E.name);return;}
 if(a.dataset.a==='read'){discover('bottle'+it.msg);closePanel();say('Message in a bottle',BOTTLES[it.msg],[{l:'Keep it',f:closeDlg}]);return;}
 if(a.dataset.a==='drop'){if((it.n||1)>1){it.n--;dropGround(Object.assign({},it,{n:1}));}else{S.inv.splice(sel,1);dropGround(it);}}else if(a.dataset.a==='dropall'){if(STACK[it.id]){S.inv.splice(sel,1);dropGround(it);}else{const id=it.id;S.inv.filter(x=>x.id===id).forEach(x=>dropGround(x));S.inv=S.inv.filter(x=>x.id!==id);}}
 sel=-1;save();renderPanel();});

