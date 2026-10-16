/* ---------- test build only: a Test tab to dial things in ----------
   Levels per subskill, gear straight into a slot, any item at any count, time of day and tide, a wipe.
   The play build never shows it. The map's island taps (warps) live in the map. */
const TSEC={skills:1,gear:0,items:0,world:0,memory:0};
function testHTML(){const sec=(k,t,body)=>`<div class="tsec"><button class="tsh" data-ts="${k}">${TSEC[k]?'\u25be':'\u25b8'} ${t}</button>${TSEC[k]?body:''}</div>`;let h='<div class="tbody">';
 h+=sec('skills','Skills',Object.keys(SUBS).filter(k=>SUBS[k].icon).map(k=>`<div class="trow"><span>${SUBS[k].name} <b>${hasSkill(k)?lv(k):'-'}</b></span><span>${[-10,-1,1,10,99].map(d=>`<button data-tl="${k}:${d}">${d===99?'99':d>0?'+'+d:d}</button>`).join('')}</span></div>`).join(''));
 h+=sec('gear','Gear (tap to wear, again to take off)',`<div class="tgrid">${Object.keys(EQUIP).map(id=>`<button data-tg="${id}" class="${S.eq[EQUIP[id].slot]===id?'on':''}"><img src="${icon(id)}" alt="">${EQUIP[id].name}</button>`).join('')}</div>`);
 h+=sec('items','Items to pack',`<div class="tgrid">${Object.keys(ITEMS).filter(id=>typeof ITEMS[id].name==='string'&&!EQUIP[id]).map(id=>`<div class="titem"><img src="${icon(itemIcon({id}))}" alt=""><span>${ITEMS[id].name} <b>${cnt(id)}</b></span><span>${[1,10,100,1000].map(n=>`<button data-ti="${id}:${n}">+${n}</button>`).join('')}<button data-ti="${id}:0">0</button></span></div>`).join('')}</div>`);
 const hr=Math.floor(S.day*24),mn=Math.floor((S.day*24-hr)*60);
 h+=sec('world','World',`<div class="trow"><span>Time ${hr}:${String(mn).padStart(2,'0')}</span><span><button data-tw="d:-3">-3h</button><button data-tw="d:3">+3h</button><button data-tw="d:0">now</button></span></div>
  <div class="trow"><span>Tide ${tideF==null?'live':tideF>.5?'high':'low'}</span><span><button data-tw="t:0">low</button><button data-tw="t:1">high</button><button data-tw="t:live">live</button></span></div>
  <div class="trow"><span>Weather ${WXT.force||'auto'}</span><span>${['auto','clear','cloudy','fog','shower','monsoon'].map(k=>`<button data-tw="w:${k}">${k}</button>`).join('')}</span></div>
  <div class="trow"><span>Weather dial <b id="twdv">${WXT.force==='dial'?Math.round((WXT.dv||0)*100):'off'}</b></span><span><input type="range" min="0" max="100" value="${Math.round((WXT.dv||0)*100)}" data-twd="1" style="width:150px" aria-label="Weather dial: clear to monsoon"></span></div>
  <div class="trow"><span>Monsoon ${(()=>{const t=gNow(),c=stormAt(t),n=nextStorm(t);return c?'now':n?'in '+Math.round((n.s-t)/HOUR)+'h':'none';})()}</span><span><button data-tw="m:start">jump to start</button><button data-tw="m:peak">peak</button><button data-tw="m:after">after</button></span></div>
  <div class="trow"><span>Sky reading (Survival) <b>${survL()}</b></span><span>${[1,3,5,8].map(l=>`<button data-tw="sl:${l}">${l}</button>`).join('')}<button data-tw="sl:0">real</button></span></div>
  <div class="trow"><span>Wind ${Math.round(((WX.wa*180/Math.PI)%360+360)%360)}°</span><span><button data-tw="wt:1">turn 45°</button><button data-tw="wt:0">reset</button></span></div>
  <div class="trow"><span>Frame meter ${PMON?'on':'off'}</span><span><button data-tw="pm:1">on</button><button data-tw="pm:0">off</button></span></div>
  <div class="trow"><span>Test save</span><span><button data-tw="wipe">Wipe and restart</button></span></div>`);
 h+=sec('memory','World memory',wmTestHTML());
 return h+'</div>';}
/* frame meter: median and slow frames over the last 240, the resolution in use and frames per second, so a phone's real numbers can be read off */
let PMON=null;function perfMeter(on){if(PMON){clearInterval(PMON.t);PMON.el.remove();PMON=null;}if(!on)return;const el=document.createElement('div');el.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:4px;z-index:99;font:12px monospace;background:rgba(0,0,0,.6);color:#fff;padding:2px 6px;border-radius:6px;pointer-events:none';document.body.appendChild(el);
 PMON={el,t:setInterval(()=>{const a=Array.from(PERF.hist).filter(x=>x>0).sort((x,y)=>x-y);if(!a.length)return;const med=a[a.length>>1],p95=a[Math.floor(a.length*.95)];el.textContent=`${Math.round(1000/med)} fps  med ${med.toFixed(0)}ms  p95 ${p95.toFixed(0)}ms  max ${a[a.length-1].toFixed(0)}ms  res ${DPR}`;},500)};}
function testSetLevel(k,d){unlockSkill(k);const L=d===99?99:Math.max(1,Math.min(99,lv(k)+d));S.sk[k].xp=XP[L]||0;if(L===1)S.sk[k].xp=0;}
if(MODE==='test'){
 const x=panel.querySelector('.tabs .x'),b=document.createElement('button');b.className='tab';b.dataset.t='test';b.textContent='Test';x.parentNode.insertBefore(b,x);panel.querySelector('.tabs').classList.add('t6');
 b.onclick=()=>{tab='test';sel=-1;renderPanel();};
 pbody.addEventListener('input',e=>{if(tab!=='test'||!e.target.dataset||!e.target.dataset.twd)return;WXT.force='dial';WXT.dv=+e.target.value/100;const b=document.getElementById('twdv');if(b)b.textContent=e.target.value;});
pbody.addEventListener('click',e=>{if(tab!=='test')return;const t=e.target.closest('button');if(!t)return;const D=t.dataset;
  if(D.ts){TSEC[D.ts]=TSEC[D.ts]?0:1;}
  else if(D.tm)wmTestAct(D.tm);
  else if(D.tl){const [k,d]=D.tl.split(':');testSetLevel(k,+d);}
  else if(D.tg){const sl=EQUIP[D.tg].slot;S.eq[sl]=S.eq[sl]===D.tg?null:D.tg;}
  else if(D.ti){const [id,n]=D.ti.split(':');if(+n===0)takeItem(id,cnt(id));else if(!addItem(id,+n))toast('No room in the pack');}
  else if(D.tw){const [k,v]=D.tw.split(':');if(k==='d')DAYOFF=v==='0'?0:DAYOFF+(+v)*DAY_PERIOD/24;else if(k==='t')tideF=v==='live'?null:+v;else if(k==='w')WXT.force=v==='auto'?null:v;else if(k==='m'){WXT.force=null;const t=gNow(),st=stormAt(t)||nextStorm(t),tg=v==='start'?st.s-60000:v==='peak'?st.s+.5*(st.e-st.s):st.e+HOUR;DAYOFF+=tg-t;WFC=null;}else if(k==='sl')WXL=+v;else if(k==='pm')perfMeter(v==='1');else if(k==='wt')WXT.turn=v==='0'?0:WXT.turn+Math.PI/4;else if(k==='wipe'){WIPED=true;try{localStorage.removeItem(SAVE);}catch(err){}location.reload();return;}}
  else return;
  save();const st=pbody.querySelector('.tbody'),y=st?st.scrollTop:0;renderPanel();const nb=pbody.querySelector('.tbody');if(nb)nb.scrollTop=y;});}
