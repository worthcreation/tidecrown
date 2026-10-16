/* test build only: the World memory section of the Test tab (regard, style, deeds and who knows them) and DK hooks */
function wmTestHTML(){const m=wmS(),f=v=>(v>=0?'+':'')+(+v).toFixed(2),st=wmStyle();let h='';
 for(const w in WREG.who){if(WREG.who[w].kind!=='dweller')continue;const R=wmPeek(w);h+=`<div class="trow"><span>${WREG.who[w].name}: trust ${f(R.t)} fear ${f(R.f)} warmth ${f(R.w)} <b>${wmMood(w)||'neutral'}</b></span></div>`;}
 h+=`<div class="trow"><span>Style: ${Object.keys(WREG.style).map(a=>a+' '+(st[a]==null?'-':f(st[a]))).join(', ')}</span></div>`;
 h+=m.d.slice(-6).reverse().map(d=>{const D=WREG.deeds[d[1]];const kn=Object.keys(m.k).filter(w=>m.k[w][d[0]]).map(w=>w+' '+m.k[w][d[0]][0]).join(', ');return `<div class="trow"><span>#${d[0]} ${D.say}: ${kn||'nobody'}</span></div>`;}).join('');
 h+=`<div class="trow"><span>${m.d.length} deeds kept${mortShooed()?', Mortimer aloft':''}</span><span><button data-tm="gossip">pass gossip</button><button data-tm="land">land Mortimer</button><button data-tm="reset">reset memory</button></span></div>`;
 return h;}
function wmTestAct(k){if(k==='gossip')wmTick();else if(k==='land'){if(S.wm)S.wm.shoo=0;}else if(k==='reset'){S.wm={n:0,d:[],k:{},r:{}};}save();}
if(MODE==='test')Object.assign(window.DK,{WREG,wmS,wmR,wmPeek,wmDeed,wmTick,wmHeard,wmMood,wmStyle,wmSees,mortGift,mortShoo,mortShooed,mortTithe,gubbinsTip,brimbleForecast,brimbleCooks,mortimerNews,wmFlame,G,GULL,FIRE,spots,talkG,talkWick,valOf,wickOpts,gOpts});
