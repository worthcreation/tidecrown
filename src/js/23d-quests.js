/* ---------- quests: a small table, a log in the Journal, one pinned quest tracked on screen and on the map ----------
   Each quest: name, who gave it, why, and steps. A step has a label, a where-hint in directions and things you
   can see, a done-check, and a spot (for the map mark). A quest shows once started; the pinned one shows a line
   above the bottom-left corner and marks its outstanding spots on the map. New quests are new rows here. */
function compass(x,y){const a=Math.atan2(y,x),k=Math.round(((a+Math.PI*2)%(Math.PI*2))/(Math.PI/4))%8;return ['east','south-east','south','south-west','west','north-west','north','north-east'][k];}
const QUESTS={
 thimble:{name:'The sailmaker\u2019s kit',giver:'Sir Thimble',why:'His helmet was the Grinning Gull\u2019s sailmaker\u2019s thimble. He wants the rest of the kit back.',
  started:()=>tq().st>=1,done:()=>tq().st>=2,
  steps:()=>[...KIT.map(id=>{const s=kitSpot(id);return {txt:itemName({id}),where:s.where,done:tq().st>=2||cnt(id)>0,spot:s.p};}),
   {txt:'Bring all three to Sir Thimble',where:'he paces the beach by his rock',done:tq().st>=2,spot:[CRAB.x,CRAB.y]}]}};
function questsActive(){return Object.keys(QUESTS).filter(k=>QUESTS[k].started()&&!QUESTS[k].done());}
function questNext(k){const st=QUESTS[k].steps();return st.find(s=>!s.done&&(s.txt.indexOf('Bring')<0||st.slice(0,-1).every(t=>t.done)))||null;}
/* the tracker line: the pinned quest's next step */
const QT=document.createElement('button');QT.id='qtrack';QT.className='sk';document.body.appendChild(QT);
QT.onclick=()=>{tab='journal';jView='quests';openPanel('journal');};
let qtT=0;
function questTick(dt){qtT-=dt;if(qtT>0)return;qtT=.5;
 if(S.qpin&&(!QUESTS[S.qpin]||!QUESTS[S.qpin].started()||QUESTS[S.qpin].done()))S.qpin=null;
 if(!S.qpin){const a=questsActive();if(a.length&&!S.qunpin)S.qpin=a[0];}
 const k=S.qpin,n=k&&questNext(k);if(!k||!n||ccOn||SH.on&&k==='thimble'){QT.classList.remove('on');return;}
 QT.innerHTML='<b>'+QUESTS[k].name+'</b><span>'+n.txt+': '+n.where+'</span>';QT.classList.add('on');}
/* the Journal: Quests or Found */
let jView='quests';
function questsHTML(){const act=questsActive(),fin=Object.keys(QUESTS).filter(k=>QUESTS[k].done());let h='';
 if(!act.length&&!fin.length)h+='<p class="muted">No quests yet. Someone on this island wants something. They usually find a way to say so.</p>';
 for(const k of act){const Q=QUESTS[k],st=Q.steps(),nx=questNext(k);h+=`<div class="quest"><div class="qh"><b>${Q.name}</b><button data-qpin="${k}" class="${S.qpin===k?'on':''}">${S.qpin===k?'Tracking':'Track'}</button></div><p class="qwhy">${Q.giver}: ${Q.why}</p><ul>${st.map(s=>`<li class="${s.done?'ok':s===nx?'nx':''}">${s.done?'\u2713':'\u25cb'} ${s.txt}${!s.done?`<i>${s.where}</i>`:''}</li>`).join('')}</ul></div>`;}
 if(fin.length)h+=`<p class="muted qdone">Done: ${fin.map(k=>QUESTS[k].name).join(', ')}</p>`;return h;}
function journalSwitch(){return `<div class="jsw"><button data-jv="quests" class="${jView==='quests'?'on':''}">Quests</button><button data-jv="found" class="${jView==='found'?'on':''}">Found</button></div>`;}
pbody.addEventListener('click',e=>{if(tab!=='journal')return;const b=e.target.closest('button');if(!b)return;
 if(b.dataset.jv){jView=b.dataset.jv;renderPanel();}else if(b.dataset.qpin){const k=b.dataset.qpin;if(S.qpin===k){S.qpin=null;S.qunpin=1;}else{S.qpin=k;S.qunpin=0;}save();renderPanel();}});
/* map marks for the pinned quest's outstanding steps */
function questMarks(){const k=S.qpin;if(!k||!QUESTS[k].started()||QUESTS[k].done())return [];return QUESTS[k].steps().filter(s=>!s.done&&s.spot).map(s=>s.spot);}
