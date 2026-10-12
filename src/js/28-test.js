/* ---------- test build only: a Test tab to dial things in ----------
   Levels per subskill, gear straight into a slot, any item at any count, time of day and tide, a wipe.
   The play build never shows it. The map's island taps (warps) live in the map. */
const TSEC={skills:1,gear:0,items:0,world:0};
function testHTML(){const sec=(k,t,body)=>`<div class="tsec"><button class="tsh" data-ts="${k}">${TSEC[k]?'\u25be':'\u25b8'} ${t}</button>${TSEC[k]?body:''}</div>`;let h='<div class="tbody">';
 h+=sec('skills','Skills',Object.keys(SUBS).filter(k=>SUBS[k].icon).map(k=>`<div class="trow"><span>${SUBS[k].name} <b>${hasSkill(k)?lv(k):'-'}</b></span><span>${[-10,-1,1,10,99].map(d=>`<button data-tl="${k}:${d}">${d===99?'99':d>0?'+'+d:d}</button>`).join('')}</span></div>`).join(''));
 h+=sec('gear','Gear (tap to wear, again to take off)',`<div class="tgrid">${Object.keys(EQUIP).map(id=>`<button data-tg="${id}" class="${S.eq[EQUIP[id].slot]===id?'on':''}"><img src="${icon(id)}" alt="">${EQUIP[id].name}</button>`).join('')}</div>`);
 h+=sec('items','Items to pack',`<div class="tgrid">${Object.keys(ITEMS).filter(id=>typeof ITEMS[id].name==='string'&&!EQUIP[id]).map(id=>`<div class="titem"><img src="${icon(itemIcon({id}))}" alt=""><span>${ITEMS[id].name} <b>${cnt(id)}</b></span><span>${[1,10,100,1000].map(n=>`<button data-ti="${id}:${n}">+${n}</button>`).join('')}<button data-ti="${id}:0">0</button></span></div>`).join('')}</div>`);
 const hr=Math.floor(S.day*24),mn=Math.floor((S.day*24-hr)*60);
 h+=sec('world','World',`<div class="trow"><span>Time ${hr}:${String(mn).padStart(2,'0')}</span><span><button data-tw="d:-3">-3h</button><button data-tw="d:3">+3h</button><button data-tw="d:0">now</button></span></div>
  <div class="trow"><span>Tide ${tideF==null?'live':tideF>.5?'high':'low'}</span><span><button data-tw="t:0">low</button><button data-tw="t:1">high</button><button data-tw="t:live">live</button></span></div>
  <div class="trow"><span>Weather ${WXT.force||'auto'}</span><span>${['auto','clear','cloudy','fog','squall'].map(k=>`<button data-tw="w:${k}">${k}</button>`).join('')}</span></div>
  <div class="trow"><span>Wind ${Math.round(((WX.wa*180/Math.PI)%360+360)%360)}°</span><span><button data-tw="wt:1">turn 45°</button><button data-tw="wt:0">reset</button></span></div>
  <div class="trow"><span>Test save</span><span><button data-tw="wipe">Wipe and restart</button></span></div>`);
 return h+'</div>';}
function testSetLevel(k,d){unlockSkill(k);const L=d===99?99:Math.max(1,Math.min(99,lv(k)+d));S.sk[k].xp=XP[L]||0;if(L===1)S.sk[k].xp=0;}
if(MODE==='test'){
 const x=panel.querySelector('.tabs .x'),b=document.createElement('button');b.className='tab';b.dataset.t='test';b.textContent='Test';x.parentNode.insertBefore(b,x);panel.querySelector('.tabs').classList.add('t6');
 b.onclick=()=>{tab='test';sel=-1;renderPanel();};
 pbody.addEventListener('click',e=>{if(tab!=='test')return;const t=e.target.closest('button');if(!t)return;const D=t.dataset;
  if(D.ts){TSEC[D.ts]=TSEC[D.ts]?0:1;}
  else if(D.tl){const [k,d]=D.tl.split(':');testSetLevel(k,+d);}
  else if(D.tg){const sl=EQUIP[D.tg].slot;S.eq[sl]=S.eq[sl]===D.tg?null:D.tg;}
  else if(D.ti){const [id,n]=D.ti.split(':');if(+n===0)takeItem(id,cnt(id));else if(!addItem(id,+n))toast('No room in the pack');}
  else if(D.tw){const [k,v]=D.tw.split(':');if(k==='d')DAYOFF=v==='0'?0:DAYOFF+(+v)*DAY_PERIOD/24;else if(k==='t')tideF=v==='live'?null:+v;else if(k==='w')WXT.force=v==='auto'?null:v;else if(k==='wt')WXT.turn=v==='0'?0:WXT.turn+Math.PI/4;else if(k==='wipe'){WIPED=true;try{localStorage.removeItem(SAVE);}catch(err){}location.reload();return;}}
  else return;
  save();const st=pbody.querySelector('.tbody'),y=st?st.scrollTop:0;renderPanel();const nb=pbody.querySelector('.tbody');if(nb)nb.scrollTop=y;});}
