/* count badge: plain up to 9999 (999 in the bank's small cells), then k, then M */
function cntFmt(n,sm){return n<(sm?1e3:1e4)?''+n:n<1e7?Math.floor(n/1e3)+'k':Math.floor(n/1e6)+'M';}
/* ---------- panel ---------- */
let tab='pack',sel=-1,selG=null;
function openPanel(t){sfx('open');tab=t||tab;sel=-1;selG=null;jPage=0;skView=null;methView=null;ddSel=null;renderPanel();panel.classList.add('on');scrim.style.display='block';closeCtx();bag.classList.remove('pulse');if(S.hint===4)advanceHint(5);}
function closePanel(){panel.classList.remove('on');scrim.style.display='none';}
const BANKSLOTS=30,bankEl=$('bank');let bankOpen=false,bankMode='all';
function openBank(){discover('gullbank');S.bank=S.bank||[];bankOpen=true;closeCtx();closePanel();bankEl.classList.add('on');scrim.style.display='block';renderBank();}
function closeBank(){bankOpen=false;bankEl.classList.remove('on');scrim.style.display='none';}
function renderBank(note){const st=getComputedStyle(bankEl),W2=bankEl.clientWidth-24,H2=bankEl.clientHeight-20-44-40-24;const bs=Math.max(34,Math.floor(Math.min((W2-30)/6,(H2-8*6)/9)));bankEl.style.setProperty('--bs',bs+'px');
 const b=S.bank;let h='';for(let i=0;i<BANKSLOTS;i++){const e=b[i];h+=e?`<button class="slot f" data-b="${i}" aria-label="${itemName(e.it)}"><img src="${stackIcon(itemIcon(e.it),e.n)}" alt=""><i class="cnt">${cntFmt(e.n,1)}</i></button>`:'<div class="slot"></div>';}
 $('bgrid').innerHTML=h;h='';for(let i=0;i<PACK;i++){const it=S.inv[i];h+=it?`<button class="slot f" data-p="${i}" aria-label="${itemName(it)}"><img src="${stackIcon(itemIcon(it),it.n)}" alt="">${(it.n||1)>1?'<i class="cnt">'+cntFmt(it.n,1)+'</i>':''}</button>`:'<div class="slot"></div>';}
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
bag.onclick=()=>openPanel('pack');$('snd').onclick=sndToggle;scrim.onclick=()=>{if(bankOpen)closeBank();else closePanel();};panel.querySelector('.x').onclick=closePanel;
panel.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{tab=b.dataset.t;sel=-1;renderPanel();});
function hasHatchet(){return S.eq.weapon==='hatchet'||S.inv.some(i=>i.id==='hatchet');}
let skSel=-1,jPage=0,jPages=[];
/* gear slots, Runescape-shaped: a paperdoll, three across. Empty cells are spacers. */
const SLOTS=[['back','head','neck'],['weapon','body','trinket'],['hand','legs','ring'],[null,'feet',null]];
const SLOTLAB={head:'Head',body:'Body',hand:'Hands',trinket:'Charm',back:'Back',neck:'Neck',weapon:'Weapon',legs:'Legs',feet:'Feet',ring:'Ring'};
/* the map: a sea chart, nothing else on the tab. Every island drawn with its name, the bridges, you. Tap an island to go there; that is for testing until travel is a system, and the chart says so in its corner. */
let MAPHIT=[];
function drawMapTo(c){const w=c.clientWidth||300,h=c.clientHeight||300,d=Math.min(2,devicePixelRatio||1);c.width=Math.round(w*d);c.height=Math.round(h*d);const k=ctx;ctx=c.getContext('2d');ctx.setTransform(d,0,0,d,0,0);
 /* the chart is turned so east is up: the Key at the bottom, the dark islands above it, the sea between them shortened */
 const KX=-2350,KY=0,X0=-1560,X1=1260,Y0=-1730,Y1=-KX+640,sc=Math.min((w-24)/(X1-X0),(h-78)/(Y1-Y0)),ox=w/2-(X0+X1)/2*sc,oy=h/2+2-(Y0+Y1)/2*sc,M=(x,y)=>[ox+y*sc,oy-x*sc];MAPHIT=[];
 ctx.fillStyle='#2b6d7c';ctx.fillRect(0,0,w,h);ctx.globalAlpha=.35;for(let i=0;i<40;i++){const x=(i*73)%w,y=((i*131)%(h-40))+20;ln([[x-7,y],[x,y-3],[x+7,y]],700+i,1.8,'#9fc4cc',.8);}ctx.globalAlpha=1;
 const kp=sandPts.map(p=>M(KX+p[0],KY+p[1])),gp=grassPts.map(p=>M(KX+p[0]*.98,KY+p[1]*.98));sketch(kp,true,880,2,'#f3d27a',INK,2);sketch(gp,true,881,2,'#86c25e',INK,1.5);
 const dk=M(KX+DOCK.x0,KY),dk2=M(KX+DOCK.x1,KY);ln([dk,dk2],883,3,'#c98f56',.3);{const [kx,ky]=M(KX,KY);MAPHIT.push({x:kx,y:ky,r:Math.max(26,560*sc),id:'key'});}
 BRIDGES.forEach(B=>{if(B.v)ln([M(B.x,B.y0),M(B.x,B.y1)],899,2.5,'#9a6236',.3);else ln([M(B.x0,B.y),M(B.x1,B.y)],898,2.5,'#9a6236',.3);});
 ISLES.forEach((I,n)=>{const [x,y]=M(I.x,I.y),rx=Math.max(7,I.rx*sc),ry=Math.max(6,I.ry*sc);sketch(islePts(I,1,28).map(p=>M(p[0],p[1])),true,882+n,2,I.sand,INK,1.5);sketch(islePts(I,.84,24).map(p=>M(p[0],p[1])),true,890+n,2,I.ground,null);MAPHIT.push({x,y,r:Math.max(22,Math.max(rx,ry)),id:'sh'+n});});
 /* names on the chart */
 const lab=(t,x,y,s)=>{ctx.font=(s||12)+"px 'Patrick Hand','Comic Sans MS',cursive";ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.lineJoin='round';ctx.strokeStyle='rgba(43,109,124,.9)';ctx.strokeText(t,x,y);ctx.fillStyle='#fffaf0';ctx.fillText(t,x,y);};
 {const [x,y]=M(KX,KY);lab('Driftwood Key',x,y+Math.max(24,600*sc)+6,13);}
 ISLES.forEach((I,n)=>{const [x,y]=M(I.x,I.y),big=I.rx*sc>34;lab(I.name,x,big?y:y+Math.max(6,I.rx*sc)+8,11);});
 {const [x,y]=M(KX+520,KY-1050);lab('The Lantern Sea',x,y,15);}
 const [px,py]=SH.on?M(P.x,P.y):M(KX+P.x,KY+P.y);const pu=1+.15*Math.sin(now*4);dot(px,py,5*pu,INK);dot(px,py,3*pu,'#ff6b6b');lab('you',px,py-11,11);
 ctx.font="18px 'Patrick Hand','Comic Sans MS',cursive";ctx.textAlign='left';ctx.fillStyle='rgba(255,250,240,.8)';ctx.fillText('N',8,38);ln([[34,32],[20,32]],884,2,'rgba(255,250,240,.8)',.3);ln([[26,28],[20,32],[26,36]],885,2,'rgba(255,250,240,.8)',.3);
 ctx.font="12px 'Patrick Hand','Comic Sans MS',cursive";ctx.textAlign='right';ctx.fillStyle='rgba(255,250,240,.7)';ctx.fillText('Tap an island to go there. Testing, until there is a way to travel.',w-8,h-8);ctx=k;}
function MAPDEST(){return [{id:'key',name:'Driftwood Key',kind:'home'}].concat(ISLES.map((I,i)=>({id:'sh'+i,name:I.name,kind:I.kind,I})));}
function mapHTML(){return `<canvas id="mapc" class="mapc" aria-label="Sea chart"></canvas>`;}
function mapTap(e){const c=$('mapc');if(!c)return;const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,bd=1e9;for(const h of MAPHIT){const d=Math.hypot(h.x-x,h.y-y);if(d<h.r+8&&d<bd){bd=d;best=h;}}if(best){sfx('whoosh');warpTo(best.id);}}
function warpTo(id){if(id==='key'){if(SH.on)shLeave();SW.on=false;P.x=DOCK.x0-60;P.y=0;P.path=[];cam.x=P.x;cam.y=P.y;}
 else{const I=MAPDEST().find(d=>d.id===id).I;SW.on=false;if(!SH.on){SH.on=true;S.isle='shadow';hintEl.classList.remove('on');}const c=shClamp(I.x,I.y+I.ry*.45);P.x=c[0];P.y=c[1];P.path=[];P.task=null;cam.x=P.x;cam.y=P.y;if(!S.journal.shadow)discover('shadow');}
 save();closePanel();}
function youCanvas(){const c=document.createElement('canvas');c.width=180;c.height=220;const k=ctx;ctx=c.getContext('2d');ctx.setTransform(2.1,0,0,2.1,90,206);drawChar(S.char||DEFAULT_LOOK,S.eq,0,0,-1,false,false);ctx=k;return c.toDataURL();}
function youHTML(){const tot=Object.keys(SUBS).reduce((a,k)=>a+(hasSkill(k)?lv(k):0),0),built=Object.keys(SUBS).filter(hasSkill).length;
 const slots=SLOTS.map(row=>row.map(sl=>sl?gearSlot(sl):'<div class="slot none"></div>').join('')).join('');
 return `<div class="you"><div class="youdoll"><img src="${youCanvas()}" alt=""><div class="youname"><b>${esc(S.char?S.char.name:'')}</b><small>${S.origin?ORIGINS[S.origin].name:''}</small><small>Total level ${tot}, ${built} subskill${built===1?'':'s'} found</small><small>Essence: none yet</small></div></div><div class="grid g3">${slots}</div><div class="info">${infoHTML()}</div></div>`;}
function gearSlot(sl){const id=S.eq[sl],lab=SLOTLAB[sl];if(sl==='weapon')return `<button class="slot f${selG==='weapon'?' sel':''}" data-g="weapon" data-gs="weapon" aria-label="Weapon"><img src="${icon(S.eq.weapon==='hatchet'?'hatchet':'scarf'+(S.char||DEFAULT_LOOK).acc)}" alt=""><span class="tag">${S.eq.weapon==='hatchet'?'Hatchet':'Scarf'}</span></button>`;
 return id?`<button class="slot f${selG===sl?' sel':''}" data-g="${sl}" data-gs="${sl}" aria-label="${lab}: ${EQUIP[id].name}"><img src="${icon(id)}" alt=""><span class="tag">${lab}</span></button>`:`<button class="slot gearE${selG===sl?' sel':''}" data-g="${sl}" data-gs="${sl}" aria-label="${lab}, empty"><span class="tag">${lab}</span></button>`;}
/* the pack is a grid of cells. Each thing remembers its cell (it.c), so anything can sit anywhere and gaps are real. Drag a thing onto the middle of another to swap, onto an edge or a gap between two to push them apart, onto an empty cell to put it there. Tapping selects, as ever. Wearing is done from the You tab. */
function invLayout(){const used=new Set();S.inv.forEach(it=>{if(it.c!=null&&it.c<PACK&&!used.has(it.c))used.add(it.c);else it.c=null;});S.inv.forEach(it=>{if(it.c==null){let c=0;while(used.has(c))c++;it.c=c;used.add(c);}});const cells=Array(PACK).fill(-1);S.inv.forEach((it,i)=>cells[it.c]=i);return cells;}
function invAt(c){const i=S.inv.findIndex(it=>it.c===c);return i;}
function invPlace(i,c){const it=S.inv[i];if(!it||c<0||c>=PACK)return;const j=invAt(c);if(j===i)return;if(j>=0){const t=S.inv[j].c;S.inv[j].c=it.c;it.c=t;}else it.c=c;}
/* push apart: the thing goes into cell c and whatever is there and after it slides along until a gap; if there is no gap that way, the things before slide back instead */
function invInsert(i,c){const it=S.inv[i];if(!it)return;const from=it.c;it.c=-1;const occ=()=>{const m=new Map();S.inv.forEach((x,k)=>{if(x.c>=0)m.set(x.c,k);});return m;};
 let m=occ();if(!m.has(c)){it.c=c;return;}
 let end=c;while(end<PACK&&m.has(end))end++;if(end<PACK){for(let k=end-1;k>=c;k--)S.inv[m.get(k)].c=k+1;it.c=c;return;}
 let start=c-1;while(start>=0&&m.has(start))start--;if(start>=0){for(let k=start+1;k<=c-1;k++)S.inv[m.get(k)].c=k-1;it.c=c-1;return;}
 it.c=from;}
let DG=null,dgGhost=null,dgSkip=false;
function slotFor(it){return EQUIP[it.id]?EQUIP[it.id].slot:it.id==='hatchet'?'weapon':null;}
function canFit(sl){return S.inv.map((it,i)=>[i,it]).filter(([i,it])=>slotFor(it)===sl);}
function wearFrom(i,sl){const it=S.inv[i];if(!it||slotFor(it)!==sl)return;const cell=it.c;S.inv.splice(i,1);if(sl==='weapon'){if(S.eq.weapon==='hatchet')S.inv.push({id:'hatchet',c:cell});S.eq.weapon='hatchet';sfx('chop',.6);toast('Hatchet in hand. The scarf stays on.');}else{const old=S.eq[sl];S.eq[sl]=it.id;if(old)S.inv.push({id:old,c:cell});sfx('open');toast('Wearing: '+EQUIP[it.id].name);}save();}
function dgStart(e,i){const it=S.inv[i];if(!it)return;DG={i,it,x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY,moved:false,id:e.pointerId};}
function dgMakeGhost(it){const g=document.createElement('div');g.className='dgghost';g.innerHTML='<img src="'+stackIcon(itemIcon(it),it.n)+'" alt="">';document.body.appendChild(g);g.style.left=DG.x+'px';g.style.top=DG.y+'px';return g;}
function dgMove(e){if(!DG||e.pointerId!==DG.id)return;DG.x=e.clientX;DG.y=e.clientY;if(!DG.moved&&Math.hypot(DG.x-DG.x0,DG.y-DG.y0)>14){DG.moved=true;dgGhost=dgMakeGhost(DG.it);const src=pbody.querySelector('[data-i="'+DG.i+'"]');if(src)src.classList.add('dgsrc');}
 if(dgGhost){dgGhost.style.left=DG.x+'px';dgGhost.style.top=DG.y+'px';pbody.querySelectorAll('.over').forEach(x=>x.classList.remove('over'));const r=dgDrop(DG.x,DG.y);if(r){const slots=[...pbody.querySelectorAll('.grid .slot')];if(r[0]==='swap'){const t=slots[r[1]];if(t)t.classList.add('over');}else{const a=slots[Math.min(r[1],slots.length-1)],b=slots[r[1]-1];if(a)a.classList.add('over');if(b)b.classList.add('over');}}}}
function dgEnd(e){if(!DG||e.pointerId!==DG.id)return;const d=DG;DG=null;if(dgGhost){dgGhost.remove();dgGhost=null;}pbody.querySelectorAll('.over,.dgsrc').forEach(x=>x.classList.remove('over','dgsrc'));
 if(d.moved){dgSkip=true;if(S.inv[d.i]===d.it){const r=dgDrop(d.x,d.y);if(r){if(r[0]==='swap')invPlace(d.i,r[1]);else invInsert(d.i,r[1]);sfx('open',.5);save();}}sel=-1;renderPanel();}}
/* where a drop lands: on the middle of a cell swaps with (or fills) it, on a cell's edge or in the gap between two pushes apart and goes in between */
function dgDrop(x,y){const slots=[...pbody.querySelectorAll('.grid .slot')].map((el,i)=>({i,r:el.getBoundingClientRect()}));if(!slots.length)return null;
 let row=slots.filter(s=>y>=s.r.top-6&&y<=s.r.bottom+6);if(!row.length){let best=null,bd=1e9;for(const s of slots){const d=Math.abs((s.r.top+s.r.bottom)/2-y);if(d<bd){bd=d;best=s;}}if(bd>60)return null;row=slots.filter(s=>Math.abs(s.r.top-best.r.top)<2);}
 for(const s of row){const cx=(s.r.left+s.r.right)/2,hw=s.r.width/2;if(x>=s.r.left&&x<=s.r.right){if(Math.abs(x-cx)<hw*.55)return ['swap',s.i];return ['ins',x<cx?s.i:s.i+1];}}
 let best=null,bd=1e9;for(const s of row){const cx=(s.r.left+s.r.right)/2,d=Math.abs(cx-x);if(d<bd){bd=d;best=s;}}if(!best||bd>best.r.width)return null;const cx=(best.r.left+best.r.right)/2;return ['ins',x<cx?best.i:best.i+1];}
pbody.addEventListener('pointerdown',e=>{if(tab!=='pack')return;const s=e.target.closest('[data-i]');if(!s)return;dgStart(e,+s.dataset.i);});
document.addEventListener('pointermove',dgMove);document.addEventListener('pointerup',dgEnd);pbody.addEventListener('dragstart',e=>e.preventDefault());pbody.addEventListener('contextmenu',e=>{if(DG)e.preventDefault();});
document.addEventListener('touchend',e=>{if(!DG)return;const t=e.changedTouches[0];if(t)dgEnd({pointerId:DG.id,clientX:t.clientX,clientY:t.clientY});},{passive:true});document.addEventListener('touchmove',e=>{if(!DG)return;const t=e.changedTouches[0];if(t)dgMove({pointerId:DG.id,clientX:t.clientX,clientY:t.clientY});},{passive:true});
pbody.addEventListener('click',e=>{if(dgSkip){dgSkip=false;e.stopImmediatePropagation();e.preventDefault();}},true);

function infoHTML(){
 if(sel>=0&&S.inv[sel]){const it=S.inv[sel];let a='';if(it.id==='bottle')a+='<button data-a="read">Read it</button>';if(it.id==='flint')a+='<button data-a="craft">Make a hatchet</button>';if(it.id==='hatchet'&&S.eq.weapon!=='hatchet')a+='<button data-a="wield">Take in hand</button>';if(EQUIP[it.id])a+='<button data-a="wear">Wear it</button>';if(it.id==='cook')a+='<button data-a="eat">Eat it</button>';
  if(it.id!=='hatchet')a+='<button data-a="drop">Drop '+((it.n||1)>1?'one':'it')+'</button>';if((FISH[it.id]&&S.inv.filter(x=>x.id===it.id).length>1)||(it.n||1)>1)a+='<button data-a="dropall">Drop all</button>';
  return `<b>${itemName(it)}${(it.n||1)>1?' ×'+it.n:''}</b><p>${itemDesc(it)}</p><div class="acts">${a}</div>`;}
 if(selG==='weapon'){if(S.eq.weapon==='hatchet')return `<b>Stone hatchet, in hand</b><p>Hews and sweeps, and hits everything in reach on that side. Three sweeps in rhythm spin into a swirl. It chops trees from here too. No gentle side: wrapping and binding wait for the scarf.</p><div class="acts"><button data-a="sheathe">Back to the scarf</button></div>`;const a=(S.char||DEFAULT_LOOK).acc;return `<b>Your scarf (${ACCN[a]})</b><p>Everyone out here wears one; yours is the weapon in hand. It reaches ${reach()}, and Dominion stretches it. Tap a thing to slap it, slide at it to trip it, slide from it to you to wrap it, slide back again to bind it. Change the colour at the still pool. A hatchet in the pack can be taken in hand instead.</p>`;}
 if(selG&&S.eq[selG]){const id=S.eq[selG];return `<b>${EQUIP[id].name}</b><p>${EQUIP[id].desc}</p><div class="acts"><button data-a="off">Take it off</button>${canFit(selG).map(([i,it])=>`<button data-fit="${i}">Swap for ${ITEMS[it.id].name}</button>`).join('')}</div>`;}
 if(selG&&SLOTLAB[selG]){const c=canFit(selG);return `<b>${SLOTLAB[selG]}: nothing worn</b>${c.length?`<p>In your pack, this would go here:</p><div class="acts">${c.map(([i,it])=>`<button data-fit="${i}">Wear ${ITEMS[it.id].name}</button>`).join('')}</div>`:'<p class="muted">Nothing in your pack goes here yet.</p>'}`;}
 if(tab==='you')return `<p class="muted">Tap a piece of gear to look at it. Most slots wait for things the islands have not given up yet.</p>`;
 return `<p class="muted">${S.inv.length?'Tap something to look at it.':'Empty. The sea is full of things that would love to be in here.'}</p>`;}
function sizePack(){const cs=getComputedStyle(pbody),W=pbody.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),H=pbody.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
 const s=Math.max(38,Math.floor(Math.min((W-24)/4,(H-14-138)/5)));pbody.style.setProperty('--s',s+'px');}
function renderPanel(){panel.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));let h='';
 if(tab==='skills'){if(subView&&methView&&METHODS[subView]&&METHODS[subView][methView]){pbody.innerHTML=methodPage(subView,methView);return;}if(subView&&hasSkill(subView)){pbody.innerHTML=skillPage(subView);return;}if(skView&&hasSkill(skView)){pbody.innerHTML=parentPage(skView);return;}
  if(S.char)h+=`<p class="muted" style="margin:0 0 2px">${esc(S.char.name)}${S.origin?', '+ORIGINS[S.origin].name.replace(/^The /,'the '):''}</p>`;
  Object.keys(SKILLS).forEach(k=>{if(hasSkill(k))h+=skillCard(k);});
  const hid=Object.keys(SKILLS).filter(k=>!hasSkill(k)).map(k=>SKILLS[k].clue);
  h+=`<p class="muted lockt">${['No','One','Two','Three','Four','Five'][hid.length]} skill${hid.length===1?' is':'s are'} still hidden.</p><div class="lockrow">`+hid.map((c,i)=>`<button class="lk${skSel===i?' sel':''}" data-sk="${i}" aria-label="Hidden skill ${i+1}">?</button>`).join('')+`</div><div class="clue">${skSel>=0&&hid[skSel]?hid[skSel]:'Tap one for a clue.'}</div>`;
  pbody.innerHTML=h;return;}
 if(tab==='pack'){
  h+=`<div class="grid">`;
  const cells=invLayout();for(let c=0;c<PACK;c++){const i=cells[c],it=i>=0?S.inv[i]:null;h+=it?`<button class="slot f${sel===i?' sel':''}" data-i="${i}" aria-label="${itemName(it)}"><img src="${stackIcon(itemIcon(it),it.n)}" alt="">${(it.n||1)>1||stackOf(it.id)?'<i class="cnt">'+cntFmt(it.n||1)+'</i>':''}</button>`:'<div class="slot"></div>';}
  h+=`</div><div class="info">${infoHTML()}</div>`;pbody.innerHTML=h;sizePack();return;}
 if(tab==='you'){pbody.innerHTML=youHTML();return;}
 if(tab==='map'){pbody.innerHTML=mapHTML();drawMapTo($('mapc'));return;}
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
pbody.addEventListener('click',e=>{if(e.target.id==='mapc'){mapTap(e);return;}const sp_=e.target.closest('[data-skp]');if(sp_){skView=sp_.dataset.skp;subView=null;ddSel=null;renderPanel();return;}const sb_=e.target.closest('[data-sub]');if(sb_){subView=sb_.dataset.sub;methView=null;ddSel=null;renderPanel();return;}const mt_=e.target.closest('[data-meth]');if(mt_){methView=mt_.dataset.meth;ddSel=null;renderPanel();return;}const dd_=e.target.closest('[data-dd]');if(dd_){ddSel=ddSel===dd_.dataset.dd?null:dd_.dataset.dd;renderPanel();return;}if(e.target.closest('[data-skb]')){if(methView)methView=null;else if(subView)subView=null;else skView=null;ddSel=null;renderPanel();return;}const pq=e.target.closest('[data-p]');if(pq){jPage+=+pq.dataset.p;showJPage();return;}const sk=e.target.closest('[data-sk]');if(sk){skSel=+sk.dataset.sk;renderPanel();return;}const s=e.target.closest('[data-i]');if(s){sel=+s.dataset.i;selG=null;renderPanel();return;}const g=e.target.closest('[data-g]');if(g){selG=g.dataset.g;sel=-1;renderPanel();return;}
 const f_=e.target.closest('[data-fit]');if(f_){wearFrom(+f_.dataset.fit,selG);sel=-1;renderPanel();return;}const a=e.target.closest('[data-a]');if(!a)return;
 if(a.dataset.a==='off'){if(S.inv.length>=PACK){toast('No room in your pack');return;}S.inv.push({id:S.eq[selG]});S.eq[selG]=null;selG=null;save();renderPanel();return;}
 if(a.dataset.a==='sheathe'){if(S.inv.length>=PACK){toast('No room in your pack');return;}S.inv.push({id:'hatchet'});S.eq.weapon=null;sfx('open');save();renderPanel();return;}
 const it=S.inv[sel];if(!it)return;
 if(a.dataset.a==='craft'){if(!((S.wood||0)>0&&(S.kelp||0)>0)){toast('Needs 1 driftwood and 1 dry kelp');return;}S.wood--;S.kelp--;S.inv.splice(sel,1);S.inv.push({id:'hatchet'});unlockSkill('tinkering');S.owned.hatchet=1;sel=-1;discover('hatchet');toast('New skill: Tinkering');addXP('tinkering',30,'first',[P.x,P.y-30]);save();renderPanel();return;}
 if(a.dataset.a==='wield'){S.inv.splice(sel,1);S.eq.weapon='hatchet';sel=-1;sfx('chop',.6);toast('Hatchet in hand. The scarf stays on.');save();renderPanel();return;}
 if(a.dataset.a==='eat'){sfx('eat');S.inv.splice(sel,1);const B=BUFF[it.q];if(B){S.buff={q:it.q,until:Date.now()+B.dur*1000,dur:B.dur};toast('Well fed: '+B.txt);}else think(it.q==='charred'?'Crunchy. Regrettable.':'My stomach has filed a complaint.');sel=-1;save();renderPanel();return;}
 if(a.dataset.a==='wear'){const E=EQUIP[it.id],old=S.eq[E.slot];S.inv.splice(sel,1);S.eq[E.slot]=it.id;if(old)S.inv.push({id:old});sel=-1;save();renderPanel();toast('Wearing: '+E.name);return;}
 if(a.dataset.a==='read'){discover('bottle'+it.msg);closePanel();say('Message in a bottle',BOTTLES[it.msg],[{l:'Keep it',f:closeDlg}]);return;}
 if(a.dataset.a==='drop'){if((it.n||1)>1){it.n--;dropGround(Object.assign({},it,{n:1}));}else{S.inv.splice(sel,1);dropGround(it);}}else if(a.dataset.a==='dropall'){if(stackOf(it.id)){S.inv.splice(sel,1);dropGround(it);}else{const id=it.id;S.inv.filter(x=>x.id===id).forEach(x=>dropGround(x));S.inv=S.inv.filter(x=>x.id!==id);}}
 sel=-1;save();renderPanel();});

