/* ---------- UI helpers ---------- */
const $=id=>document.getElementById(id);
const hintEl=$('hint'),toastEl=$('toast'),ctxEl=$('ctx'),dlg=$('dlg'),panel=$('panel'),scrim=$('scrim'),pbody=$('pbody'),bag=$('bag');
let hintTimer,toastTimer;
function hint(t,ms){hintEl.textContent=t;hintEl.classList.add('on');clearTimeout(hintTimer);if(ms)hintTimer=setTimeout(()=>hintEl.classList.remove('on'),ms);}
const HINTS={0:'Tap anywhere to walk.',1:'See the bubbles in the water? Tap them to fish.',2:'When the bobber dips, tap fast!',3:'Hold your finger on anything to see more options.',4:'Your satchel, bottom right, holds your catch and skills.'};
function showHint(){if(SH.on)return;if(HINTS[S.hint])hint(HINTS[S.hint],S.hint>=3?7000:0);else hintEl.classList.remove('on');}
function advanceHint(to){if(S.hint<to){S.hint=to;showHint();if(to===4){bag.classList.remove('pulse');void bag.offsetWidth;bag.classList.add('pulse');}}}
function toast(t){toastEl.textContent=t;toastEl.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('on'),2600);}
function discover(k){if(S.journal[k])return;S.journal[k]=Date.now();toast('Journal: '+JOURNAL[k][0]);save();if(k==='fish_koi'||k==='headnight')setTimeout(()=>toast('A new look waits at the still pool'),2900);}
function think(t){bub={txt:t,t:0};}
function pop(t,x,y,col,size){pops.push({txt:t,x,y,t:0,col:col||'#fff',size:size||20});}
function pick(a){return a[Math.floor(Math.random()*a.length)];}

let ctxOpen=false;
function showCtx(sx,sy,title,items){ctxEl.innerHTML='';const t=document.createElement('div');t.className='t';t.textContent=title;ctxEl.appendChild(t);
 items.forEach(it=>{const b=document.createElement('button');b.textContent=it.l;b.onclick=e=>{e.stopPropagation();closeCtx();it.f();};ctxEl.appendChild(b);});
 ctxEl.style.display='flex';const r=ctxEl.getBoundingClientRect();
 ctxEl.style.left=Math.max(8,Math.min(W-r.width-8,sx-r.width/2))+'px';ctxEl.style.top=Math.max(8,Math.min(H-r.height-8,sy-r.height-18))+'px';ctxOpen=true;}
function closeCtx(){ctxEl.style.display='none';ctxOpen=false;}
let dlgOn=false;
function say(who,txt,opts){curWho=who;dlg.querySelector('.who').textContent=who;dlg.querySelector('.say').textContent=txt;const o=dlg.querySelector('.opts');o.innerHTML='';
 (opts||[{l:'Okay',f:closeDlg}]).forEach(x=>{const b=document.createElement('button');b.className='opt';b.textContent=x.l;b.onclick=e=>{e.stopPropagation();x.f();};o.appendChild(b);});
 dlg.style.display='block';dlgOn=true;}
function closeDlg(){dlg.style.display='none';dlgOn=false;G.talk=false;}

