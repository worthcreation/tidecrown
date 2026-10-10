/* ---------- character creation ---------- */
let ccOn=false,ccMode='new',ccStep=1,draft=null,ccOrigin=null,view={};
const ccEl=$('cc'),ccBody=$('ccbody'),ccGo=$('ccgo'),ccT=$('cct'),ccS=$('ccs');
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const PICKS=[
 ['kin','Kin',()=>Object.keys(KIN),v=>KIN[v].name],
 ['tone','Tone',()=>[0,1,2,3],v=>(KIN[draft.kin]||KIN.human).toneN[v],v=>(KIN[draft.kin]||KIN.human).tones[v]],
 ['shape','Shape',()=>Object.keys(SHAPES),v=>SHAPES[v][2]],
 ['eyes','Eyes',()=>Object.keys(EYES),v=>EYES[v]],
 ['hair','Hair',()=>Object.keys(HAIRS),v=>HAIRS[v]],
 ['hc','Hair color',()=>HAIRC.map((c,i)=>i),v=>HAIRCN[v],v=>HAIRC[v]],
 ['mark','Mark',()=>Object.keys(MARKS),v=>MARKS[v]],
 ['col','Outfit',()=>COLS.map((c,i)=>i),v=>COLN[v],v=>COLS[v]],
 ['acc','Scarf',()=>ACCS.map((c,i)=>i),v=>ACCN[v],v=>ACCS[v]]];
function isLocked(k,v){const L=LOCKS[k]&&LOCKS[k][v];return L&&!S.journal[L[0]]?L[1]:null;}
function rName(){return pick(NAME1)+' '+pick(NAME2);}
function randomLook(){const o={name:rName()};PICKS.forEach(([k,,opts])=>{o[k]=pick(opts().filter(x=>!isLocked(k,x)));});return o;}
function rowsHTML(){return PICKS.map(([k,l,,name,sw])=>{const cur=view[k]!=null?view[k]:draft[k],lk=isLocked(k,cur);
 const inner=lk?'???':(sw?`<i class="sw" style="background:${sw(cur)}"></i>`:'')+name(cur);
 return `<div class="pk"><button data-k="${k}" data-d="-1" aria-label="Previous ${l}">‹</button><span class="val${lk?' lock':''}"><small>${l}</small><span>${inner}</span></span><button data-k="${k}" data-d="1" aria-label="Next ${l}">›</button></div>`;}).join('');}
function renderCC(){ccEl.classList.add('on');const m=ccMode==='mirror';
 if(ccStep===1){ccT.textContent=m?'The still pool':'Who washed up?';
  ccBody.innerHTML=`<div class="cctop"><canvas id="pv" aria-label="Your character"></canvas><div class="ccid"><div class="sub">${m?'New looks surface here as you discover things.':'Some of this can change later, if you find the right place.'}</div>`+
   (m?'':`<div class="namerow"><input id="ccname" maxlength="18" autocomplete="off" value="${esc(draft.name)}" aria-label="Name"><button class="dice" id="ccdice" aria-label="Random name">⚄</button></div>`)+
   `<button class="dice" id="ccrand">Surprise me</button></div></div><div id="ccrows" class="pgrid">${rowsHTML()}</div><div class="lockhint" id="cclock">${KIN[draft.kin].blurb}</div>`;
  ccGo.textContent=m?'Step back':'Next: how you got here';ccGo.disabled=false;}
 else{ccT.textContent='How did you get here?';const sel=ccOrigin?EQUIP[ORIGINS[ccOrigin].keep]:null;
  ccBody.innerHTML=`<div class="cctop otop"><canvas id="pv" aria-label="Your character"></canvas><div class="odetail">${sel?'<b>'+sel.name+'.</b> '+sel.desc:'<b>'+esc(draft.name)+'</b> washed up with nothing but a scarf. Pick a past. Each comes with a keepsake.'}</div></div><div class="origins">`+Object.keys(ORIGINS).map(k=>{const O=ORIGINS[k];return `<button class="org sk${ccOrigin===k?' on':''}" data-o="${k}"><b>${O.name}</b><span>${O.line}</span><span class="keep">Keepsake: ${EQUIP[O.keep].name}</span></button>`;}).join('')+
   `</div><button class="back" id="ccback">Back to looks</button>`;
  ccGo.textContent='Wash ashore';ccGo.disabled=!ccOrigin;}}
ccBody.addEventListener('click',e=>{const b=e.target.closest('[data-k]');
 if(b){const k=b.dataset.k,d=+b.dataset.d,vals=PICKS.find(p=>p[0]===k)[2]();const cur=view[k]!=null?view[k]:draft[k];let i=vals.indexOf(cur);i=(i+d+vals.length)%vals.length;
  const nv=vals[i];view[k]=nv;const lk=isLocked(k,nv);if(!lk)draft[k]=nv;SCF.k=1;SCF.dir=d;$('ccrows').innerHTML=rowsHTML();$('cclock').textContent=lk||(k==='kin'?KIN[nv].blurb:'');return;}
 if(e.target.id==='ccdice'){draft.name=rName();$('ccname').value=draft.name;return;}
 if(e.target.id==='ccrand'){const n=draft.name;draft=randomLook();draft.name=n;view={};$('ccrows').innerHTML=rowsHTML();$('cclock').textContent=KIN[draft.kin].blurb;return;}
 if(e.target.id==='ccback'){ccStep=1;renderCC();return;}
 const o=e.target.closest('[data-o]');if(o){ccOrigin=o.dataset.o;SCF.k=1.3;SCF.dir=1;renderCC();}});
ccBody.addEventListener('input',e=>{if(e.target.id==='ccname')draft.name=e.target.value;});
ccGo.onclick=()=>{
 if(ccMode==='mirror'){S.char=draft;save();closeCC();return;}
 if(ccStep===1){if(!draft.name.trim())draft.name=rName();ccStep=2;renderCC();return;}
 if(!ccOrigin)return;draft.name=draft.name.trim().slice(0,18);S.char=draft;S.origin=ccOrigin;
 const k=ORIGINS[ccOrigin].keep;if(!S.eq.trinket)S.eq.trinket=k;else S.inv.push({id:k});S.owned[k]=1;save();closeCC();begin();};
function openCreator(mode){ccMode=mode;ccStep=1;view={};draft=Object.assign({},S.char||randomLook());if(draft.hc==null)draft.hc=0;ccOrigin=S.origin||null;ccOn=true;closeCtx();closeDlg();closePanel();renderCC();}
function closeCC(){ccOn=false;ccEl.classList.remove('on');}
function renderPreview(){const c=$('pv');if(!c)return;const d=Math.min(2,devicePixelRatio||1),w=c.clientWidth||112,h=c.clientHeight||124;
 if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);}
 const keep=ctx;ctx=c.getContext('2d');ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
 const g=ctx.createRadialGradient(w/2,h*.55,6,w/2,h*.55,w*.55);g.addColorStop(0,'rgba(255,255,255,.75)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const sc=(h-16)/60;blob(w/2,h-12,w*.4,8,300,'#f3d27a',2.5);ctx.save();ctx.translate(w/2,h-13);ctx.scale(sc,sc);
 SCF.k=Math.max(0,SCF.k-fdt*1.6);drawChar(draft,ccMode==='mirror'?S.eq:(ccOrigin?{trinket:ORIGINS[ccOrigin].keep}:{}),0,0,1,false,false);ctx.restore();ctx=keep;}
/* the scarf is alive while you decide: it stretches and twists on its own, and flicks when you change something */
const SCF={k:0,dir:1};
function scarfIdle(){if(!ccOn)return [1,0];const st=1+.22*Math.sin(now*.9)+.14*Math.sin(now*2.3+1)+SCF.k*.6,tw=Math.sin(now*1.3)*5+Math.cos(now*.5)*3-SCF.k*8*SCF.dir;return [st,tw];}
function begin(){intro=RM?null:0;setTimeout(showHint,RM?300:2600);if(!S.journal.washed)setTimeout(()=>discover('washed'),3400);}

