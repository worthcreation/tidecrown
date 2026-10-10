/* ---------- panel ---------- */
let tab='pack',sel=-1,selG=null;
function openPanel(t){tab=t||tab;sel=-1;selG=null;jPage=0;skView=null;ddSel=null;renderPanel();panel.classList.add('on');scrim.style.display='block';closeCtx();bag.classList.remove('pulse');if(S.hint===4)advanceHint(5);}
function closePanel(){panel.classList.remove('on');scrim.style.display='none';}
const BANKSLOTS=30,bankEl=$('bank');let bankOpen=false,bankMode='all';
function openBank(){discover('gullbank');S.bank=S.bank||[];bankOpen=true;closeCtx();closePanel();bankEl.classList.add('on');scrim.style.display='block';renderBank();}
function closeBank(){bankOpen=false;bankEl.classList.remove('on');scrim.style.display='none';}
function renderBank(note){const st=getComputedStyle(bankEl),W2=bankEl.clientWidth-24,H2=bankEl.clientHeight-20-44-40-24;const bs=Math.max(34,Math.floor(Math.min((W2-30)/6,(H2-8*6)/9)));bankEl.style.setProperty('--bs',bs+'px');
 const b=S.bank;let h='';for(let i=0;i<BANKSLOTS;i++){const e=b[i];h+=e?`<button class="slot f" data-b="${i}" aria-label="${itemName(e.it)}"><img src="${icon(itemIcon(e.it))}" alt=""><i class="cnt">${e.n>999?Math.floor(e.n/1000)+'k':e.n}</i></button>`:'<div class="slot"></div>';}
 $('bgrid').innerHTML=h;h='';for(let i=0;i<PACK;i++){const it=S.inv[i];h+=it?`<button class="slot f" data-p="${i}" aria-label="${itemName(it)}"><img src="${icon(itemIcon(it))}" alt="">${(it.n||1)>1?'<i class="cnt">'+it.n+'</i>':''}</button>`:'<div class="slot"></div>';}
 $('bpack').innerHTML=h;$('bnote').textContent=note||(b.length+' of '+BANKSLOTS+' bank slots used');bankEl.querySelectorAll('.bmode button').forEach(x=>x.classList.toggle('on',x.dataset.m===bankMode));}
function deposit(i){const it=S.inv[i];if(!it)return false;const k=itemKey(it);let e=S.bank.find(q=>q.k===k);if(!e){if(S.bank.length>=BANKSLOTS){renderBank('The bank is full.');return false;}const proto=Object.assign({},it);delete proto.n;e={k,it:proto,n:0};S.bank.push(e);}e.n+=it.n||1;S.inv.splice(i,1);return true;}
function withdraw(j){const e=S.bank[j];if(!e)return;const want=bankMode==='1'?1:e.n;let got=0;
 if(stackOf(e.it.id))got=addItem(e.it.id,want);else{while(got<want&&S.inv.length<PACK){S.inv.push(Object.assign({},e.it));got++;}}
 if(!got){renderBank('Your pack is full.');return;}e.n-=got;if(e.n<=0)S.bank.splice(j,1);save();renderBank();}
$('bgrid').addEventListener('click',e=>{const t=e.target.closest('[data-b]');if(t)withdraw(+t.dataset.b);});
$('bpack').addEventListener('click',e=>{const t=e.target.closest('[data-p]');if(t){deposit(+t.dataset.p);save();renderBank();}});
$('bdep').onclick=()=>{for(let i=S.inv.length-1;i>=0;i--){if(S.inv[i].id==='hatchet')continue;deposit(i);}save();renderBank();};
bankEl.querySelectorAll('.bmode button').forEach(x=>x.onclick=()=>{bankMode=x.dataset.m;renderBank();});
$('bankx').onclick=closeBank;addEventListener('resize',()=>{if(bankOpen)renderBank();});
bag.onclick=()=>openPanel('pack');scrim.onclick=()=>{if(bankOpen)closeBank();else closePanel();};panel.querySelector('.x').onclick=closePanel;
panel.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{tab=b.dataset.t;sel=-1;renderPanel();});
function hasHatchet(){return S.inv.some(i=>i.id==='hatchet');}
let skSel=-1,jPage=0,jPages=[];
/* gear slots, Runescape-shaped: a paperdoll, three across. Empty cells are spacers. */
const SLOTS=[['back','head','neck'],['scarf','body','trinket'],['hand','legs','ring'],[null,'feet',null]];
const SLOTLAB={head:'Head',body:'Body',hand:'Hands',trinket:'Charm',back:'Back',neck:'Neck',scarf:'Scarf',legs:'Legs',feet:'Feet',ring:'Ring'};
/* the map: every island, and a warp to each. Warping is for testing until travel is a system; it says so on the tab. */
function MAPDEST(){return [{id:'key',name:'Driftwood Key',kind:'home'}].concat(ISLES.map((I,i)=>({id:'sh'+i,name:I.name,kind:I.kind,I})));}
function mapCanvas(){const c=document.createElement('canvas');c.width=300;c.height=140;const k=ctx;ctx=c.getContext('2d');ctx.fillStyle='#2b6d7c';ctx.fillRect(0,0,300,140);
 const sc=.038,ox=192,oy=70;ctx.setTransform(1,0,0,1,0,0);
 sketch(ell(46,70,22,18,16),true,880,2,'#f3d27a',INK,2);sketch(ell(46,68,15,12,14),true,881,2,'#86c25e',INK,1.5);
 ISLES.forEach((I,n)=>{const x=ox+I.x*sc,y=oy+I.y*sc;sketch(ell(x,y,Math.max(6,I.rx*sc),Math.max(5,I.ry*sc),14),true,882+n,2,'#8d7f63',INK,1.5);sketch(ell(x,y,Math.max(4,I.rx*sc*.8),Math.max(3,I.ry*sc*.8),12),true,890+n,2,I.kind==='clearing'?'#4a6a3f':I.kind==='fallow'?'#4a4034':'#3a4a33',null);});
 BRIDGES.forEach(B=>{if(B.v)ln([[ox+B.x*sc,oy+B.y0*sc],[ox+B.x*sc,oy+B.y1*sc]],899,2.5,'#9a6236',.3);else ln([[ox+B.x0*sc,oy+B.y*sc],[ox+B.x1*sc,oy+B.y*sc]],898,2.5,'#9a6236',.3);});
 const px=SH.on?ox+P.x*sc:46+(P.x/900)*18,py=SH.on?oy+P.y*sc:70+(P.y/900)*16;dot(px,py,4,INK);dot(px,py,2.5,'#ff6b6b');ctx=k;return c.toDataURL();}
function mapHTML(){const here=SH.on?(onIsle(P.x,P.y)||{}).name:'Driftwood Key';
 return `<img class="mapimg" src="${mapCanvas()}" alt=""><p class="muted" style="margin:6px 0 4px">You are at ${here||'sea'}. Warping is for testing, until there is a proper way to travel.</p><div class="maplist">`+MAPDEST().map(d=>`<button class="mapb${d.name===here?' here':''}" data-warp="${d.id}">${d.name}<small>${d.kind}</small></button>`).join('')+`</div>`;}
function warpTo(id){if(id==='key'){if(SH.on)shLeave();SW.on=false;P.x=DOCK.x0-60;P.y=0;P.path=[];cam.x=P.x;cam.y=P.y;}
 else{const I=MAPDEST().find(d=>d.id===id).I;SW.on=false;if(!SH.on){SH.on=true;S.isle='shadow';hintEl.classList.remove('on');}const c=shClamp(I.x,I.y+I.ry*.45);P.x=c[0];P.y=c[1];P.path=[];P.task=null;cam.x=P.x;cam.y=P.y;if(!S.journal.shadow)discover('shadow');}
 save();closePanel();}
function youCanvas(){const c=document.createElement('canvas');c.width=180;c.height=220;const k=ctx;ctx=c.getContext('2d');ctx.setTransform(2.1,0,0,2.1,90,206);drawChar(S.char||DEFAULT_LOOK,S.eq,0,0,-1,false,false);ctx=k;return c.toDataURL();}
function youHTML(){const tot=Object.keys(SUBS).reduce((a,k)=>a+(hasSkill(k)?lv(k):0),0),built=Object.keys(SUBS).filter(hasSkill).length;
 const slots=SLOTS.map(row=>row.map(sl=>sl?gearSlot(sl):'<div class="slot none"></div>').join('')).join('');
 return `<div class="you"><div class="youdoll"><img src="${youCanvas()}" alt=""><div class="youname"><b>${esc(S.char?S.char.name:'')}</b><small>${S.origin?ORIGINS[S.origin].name:''}</small><small>Total level ${tot}, ${built} subskill${built===1?'':'s'} found</small><small>Essence: none yet</small></div></div><div class="grid g3">${slots}</div><div class="info">${infoHTML()}</div></div>`;}
function gearSlot(sl){const id=S.eq[sl],lab=SLOTLAB[sl];if(sl==='scarf')return `<button class="slot f${selG==='scarf'?' sel':''}" data-g="scarf" aria-label="Scarf"><img src="${icon('scarf'+(S.char||DEFAULT_LOOK).acc)}" alt=""><span class="tag">${lab}</span></button>`;
 return id?`<button class="slot f${selG===sl?' sel':''}" data-g="${sl}" aria-label="${lab}: ${EQUIP[id].name}"><img src="${icon(id)}" alt=""><span class="tag">${lab}</span></button>`:`<div class="slot gearE"><span class="tag">${lab}</span></div>`;}
function infoHTML(){
 if(sel>=0&&S.inv[sel]){const it=S.inv[sel];let a='';if(it.id==='bottle')a+='<button data-a="read">Read it</button>';if(it.id==='flint')a+='<button data-a="craft">Make a hatchet</button>';if(EQUIP[it.id])a+='<button data-a="wear">Wear it</button>';if(it.id==='cook')a+='<button data-a="eat">Eat it</button>';
  if(it.id!=='hatchet')a+='<button data-a="drop">Drop '+((it.n||1)>1?'one':'it')+'</button>';if((FISH[it.id]&&S.inv.filter(x=>x.id===it.id).length>1)||(it.n||1)>1)a+='<button data-a="dropall">Drop all</button>';
  return `<b>${itemName(it)}${(it.n||1)>1?' ×'+it.n:''}</b><p>${itemDesc(it)}</p><div class="acts">${a}</div>`;}
 if(selG==='scarf'){const a=(S.char||DEFAULT_LOOK).acc;return `<b>Your scarf (${ACCN[a]})</b><p>Everyone out here wears one. Yours reaches ${reach()}; Dominion stretches it. Tap a thing to slap it, slide at it to trip it, slide from it to you to wrap it, and slide back again to bind it. Change the colour at the still pool.</p>`;}
 if(selG&&S.eq[selG]){const id=S.eq[selG];return `<b>${EQUIP[id].name}</b><p>${EQUIP[id].desc}</p><div class="acts"><button data-a="off">Take it off</button></div>`;}
 if(tab==='you')return `<p class="muted">Tap a piece of gear to look at it. Most slots wait for things the islands have not given up yet.</p>`;
 return `<p class="muted">${S.inv.length?'Tap something to look at it.':'Empty. The sea is full of things that would love to be in here.'}</p>`;}
function sizePack(){const cs=getComputedStyle(pbody),W=pbody.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),H=pbody.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
 const s=Math.max(38,Math.floor(Math.min((W-24)/4,(H-14-138)/5)));pbody.style.setProperty('--s',s+'px');}
function renderPanel(){panel.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));let h='';
 if(tab==='skills'){if(subView&&hasSkill(subView)){pbody.innerHTML=skillPage(subView);return;}if(skView&&hasSkill(skView)){pbody.innerHTML=parentPage(skView);return;}
  if(S.char)h+=`<p class="muted" style="margin:0 0 2px">${esc(S.char.name)}${S.origin?', '+ORIGINS[S.origin].name.replace(/^The /,'the '):''}</p>`;
  Object.keys(SKILLS).forEach(k=>{if(hasSkill(k))h+=skillCard(k);});
  const hid=Object.keys(SKILLS).filter(k=>!hasSkill(k)).map(k=>SKILLS[k].clue);
  h+=`<p class="muted lockt">${['No','One','Two','Three','Four','Five'][hid.length]} skill${hid.length===1?' is':'s are'} still hidden.</p><div class="lockrow">`+hid.map((c,i)=>`<button class="lk${skSel===i?' sel':''}" data-sk="${i}" aria-label="Hidden skill ${i+1}">?</button>`).join('')+`</div><div class="clue">${skSel>=0&&hid[skSel]?hid[skSel]:'Tap one for a clue.'}</div>`;
  pbody.innerHTML=h;return;}
 if(tab==='pack'){
  h+=`<div class="grid">`;
  for(let i=0;i<PACK;i++){const it=S.inv[i];h+=it?`<button class="slot f${sel===i?' sel':''}" data-i="${i}" aria-label="${itemName(it)}"><img src="${icon(itemIcon(it))}" alt="">${(it.n||1)>1||stackOf(it.id)?'<i class="cnt">'+(it.n||1)+'</i>':''}</button>`:'<div class="slot"></div>';}
  h+=`</div><div class="info">${infoHTML()}</div>`;pbody.innerHTML=h;sizePack();return;}
 if(tab==='you'){pbody.innerHTML=youHTML();return;}
 if(tab==='map'){pbody.innerHTML=mapHTML();return;}
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
pbody.addEventListener('click',e=>{const wp=e.target.closest('[data-warp]');if(wp){warpTo(wp.dataset.warp);return;}const sp_=e.target.closest('[data-skp]');if(sp_){skView=sp_.dataset.skp;subView=null;ddSel=null;renderPanel();return;}const sb_=e.target.closest('[data-sub]');if(sb_){subView=sb_.dataset.sub;ddSel=null;renderPanel();return;}const dd_=e.target.closest('[data-dd]');if(dd_){ddSel=ddSel===dd_.dataset.dd?null:dd_.dataset.dd;renderPanel();return;}if(e.target.closest('[data-skb]')){if(subView)subView=null;else skView=null;ddSel=null;renderPanel();return;}const pq=e.target.closest('[data-p]');if(pq){jPage+=+pq.dataset.p;showJPage();return;}const sk=e.target.closest('[data-sk]');if(sk){skSel=+sk.dataset.sk;renderPanel();return;}const s=e.target.closest('[data-i]');if(s){sel=+s.dataset.i;selG=null;renderPanel();return;}const g=e.target.closest('[data-g]');if(g){selG=g.dataset.g;sel=-1;renderPanel();return;}
 const a=e.target.closest('[data-a]');if(!a)return;
 if(a.dataset.a==='off'){if(S.inv.length>=PACK){toast('No room in your pack');return;}S.inv.push({id:S.eq[selG]});S.eq[selG]=null;selG=null;save();renderPanel();return;}
 const it=S.inv[sel];if(!it)return;
 if(a.dataset.a==='craft'){if(!((S.wood||0)>0&&(S.kelp||0)>0)){toast('Needs 1 driftwood and 1 dry kelp');return;}S.wood--;S.kelp--;S.inv.splice(sel,1);S.inv.push({id:'hatchet'});unlockSkill('tinkering');S.owned.hatchet=1;sel=-1;discover('hatchet');toast('New skill: Tinkering');addXP('tinkering',30,'first',[P.x,P.y-30]);save();renderPanel();return;}
 if(a.dataset.a==='eat'){S.inv.splice(sel,1);const B=BUFF[it.q];if(B){S.buff={q:it.q,until:Date.now()+B.dur*1000,dur:B.dur};toast('Well fed: '+B.txt);}else think(it.q==='charred'?'Crunchy. Regrettable.':'My stomach has filed a complaint.');sel=-1;save();renderPanel();return;}
 if(a.dataset.a==='wear'){const E=EQUIP[it.id],old=S.eq[E.slot];S.inv.splice(sel,1);S.eq[E.slot]=it.id;if(old)S.inv.push({id:old});sel=-1;save();renderPanel();toast('Wearing: '+E.name);return;}
 if(a.dataset.a==='read'){discover('bottle'+it.msg);closePanel();say('Message in a bottle',BOTTLES[it.msg],[{l:'Keep it',f:closeDlg}]);return;}
 if(a.dataset.a==='drop'){if((it.n||1)>1){it.n--;dropGround(Object.assign({},it,{n:1}));}else{S.inv.splice(sel,1);dropGround(it);}}else if(a.dataset.a==='dropall'){if(stackOf(it.id)){S.inv.splice(sel,1);dropGround(it);}else{const id=it.id;S.inv.filter(x=>x.id===id).forEach(x=>dropGround(x));S.inv=S.inv.filter(x=>x.id!==id);}}
 sel=-1;save();renderPanel();});

