/* ---------- skills, xp orbs, hearth ---------- */
let buffT=0,buffQ=null;const buffb=$('buffb');
function buffUI(){const B=buffOn();if(!B||C||ccOn){buffb.style.display='none';return;}const D=BUFF[B.q],left=(B.until-Date.now())/1000,p=Math.max(0,Math.min(100,left/(B.dur||D.dur)*100));
 buffb.style.display='block';buffb.style.setProperty('--p',p.toFixed(1));buffb.classList.toggle('low',left<30);if(buffQ!==B.q){buffQ=B.q;buffb.querySelector('img').src=icon('ck_minnow_'+B.q);}}
buffb.onclick=()=>{const B=buffOn();if(!B)return;const left=Math.ceil((B.until-Date.now())/1000);toast('Well fed: '+BUFF[B.q].txt+'. '+Math.floor(left/60)+'m '+String(left%60).padStart(2,'0')+'s left');};
let ddSel=null,skView=null,subView=null,curWho='',guideT=2;
function hearthGuide(){if(!hasSkill('cooking')||(S.st.cooked||0)>0||C||ccOn||dlgOn||S.hint<3)return;if(hintEl.classList.contains('on')&&hintEl.textContent===HINTS[S.hint])return;
 const t=rawCount()?'Tap Brimble to cook your catch.':'Catch a fish, then bring it to Brimble.';if(hintEl.textContent!==t||!hintEl.classList.contains('on'))hint(t);}
/* skill tree: five skills, each a family of specific subskills. XP lives on subskills (S.sk[sub]={xp}); a skill's XP is the sum of its subskills plus 50 per achievement done. A skill or subskill is unlocked when its entry exists; unbuilt ones carry only name and clue. */
const SKILLS={
 gathering:{name:'Gathering',icon:'basket',col:'#6fd6ff',clue:'The island gives to those who wait.',desc:'Everything the island gives up, if you know how to ask. Patience, rhythm and quick hands.',subs:['fishing','woodcutting','foraging','growing']},
 survival:{name:'Survival',icon:'flame',col:'#ffb347',clue:'It starts with a spark. Someone on this island is very hungry.',desc:'Keep yourself fed and warm, and a crew will follow. Juggle the heat and nothing goes cold.',subs:['cooking','firemaking'],
  unl:{3:'You can build your own fires',6:'Something on the beach starts blinking at night'}},
 invention:{name:'Invention',icon:'hatchet',col:'#a8d07e',clue:'Something sharp, something to hold, something to tie them.',desc:'Fit what you gathered into tools, then fit tools into grander things. No clock, just the right parts in the right order.',subs:['tinkering','shipwright'],
  unl:{12:'Brimble has a project in mind for your wood'}},
 exploration:{name:'Exploration',icon:'spyglass',col:'#c9a7ff',clue:'Past the last lighthouse, and under your feet.',desc:'The known edge, and what lies past it. Down into the ground and out over the water.',subs:['delving','sailing']},
 dominion:{name:'Dominion',icon:'crown',col:'#ff8aa8',clue:'Not everything out there is friendly. Yet.',desc:'When something faces you, read its tell and commit. Break it, or win it over.',subs:['strife','accord']}};
const SUBS={
 fishing:{p:'gathering',name:'Fishing',icon:'rod',col:'#6fd6ff',desc:'Patience and a quick hand. The Lantern Sea feeds those who wait, and every catch pulls you a little further out.',
  unl:{5:'Pebble Perch are biting now',10:'The wild water by the north rocks is yours',15:'Something sweet wriggles in the deep',20:'The moon is tugging at your line'}},
 woodcutting:{p:'gathering',name:'Woodcutting',icon:'hatchet',col:'#a8d07e',clue:'Ask the wobble trees.',desc:'A hatchet, a tree that sighs, and a beat to keep. Every voyage begins with a log.',
  unl:{8:'Wobble trees sway slower for you'}},
 foraging:{p:'gathering',name:'Foraging',icon:'basket',col:'#f3d27a',clue:'The tide gives, and the tide takes back.',desc:'Read the waves. Grab what they drop before they take it back, and scrape the salt they leave behind.',
  unl:{5:'Wash-ups linger a little longer',10:'The salt flats open to you at low tide',15:'Rarer things ride the waves'}},
 growing:{p:'gathering',name:'Growing',clue:'Plant something. Leave. Come back.'},
 cooking:{p:'survival',name:'Cooking',icon:'pan',col:'#ffb347',clue:'Brimble is very hungry.',desc:'Juggle the pans, flip at golden, and a catch becomes strength.',
  unl:{5:'A second pan by the fire',10:'A third pan by the fire',15:'Kelp flares burn longer',20:'Your golden window widens'}},
 firemaking:{p:'survival',name:'Firemaking',icon:'flame',col:'#ff8a3d',clue:'Feed a fire and it keeps you.',desc:'Build them, feed them, keep them. Some fires leave more than ash.',
  unl:{3:'Wobblewood burns longer in your fires'}},
 tinkering:{p:'invention',name:'Tinkering',icon:'flint',col:'#a8d07e',clue:'Something sharp, something to hold, something to tie them.',desc:'Small things, fitted right. A hatchet first. Then whatever the island needs.',unl:{}},
 shipwright:{p:'invention',name:'Shipwright',clue:'A hull begins with a lot of logs.'},
 delving:{p:'exploration',name:'Delving',clue:'Something is buried under your feet.'},
 sailing:{p:'exploration',name:'Sailing',clue:'Past the last lighthouse.'},
 strife:{p:'dominion',name:'Strife',clue:'Counter the tell.'},
 accord:{p:'dominion',name:'Accord',clue:'Mirror the tell.'}};
function skd(k){return SKILLS[k]||SUBS[k];}
const ACH={
 fishing:[['First bite','Catch your first fish',()=>S.catches>=1],['Steady hand','Land 10 perfect catches',()=>(S.st.perf||0)>=10],['Wild water','Catch a Grumpfish',()=>!!S.journal.fish_grump],['Letters from C.','Find a message in a bottle',()=>S.bottles>=1],['Moonlit','Catch a Moonkoi',()=>!!S.journal.fish_koi]],
 woodcutting:[['First log','Earn a log from a wobble tree',()=>!!S.journal.wobblelog],['In the groove','Land 10 clean chops in a row',()=>!!S.st.groove],['Bonfire','Build a bonfire',()=>!!S.journal.bonfire]],
 cooking:[['Golden','Cook a fish golden on both sides',()=>(S.st.perfC||0)>=1],['Smoke signals','Discover smoky fish',()=>!!S.journal.smoky],['Three pans','Keep three pans going at once',()=>!!S.st.pans3]],
 firemaking:[['Kindled','Feed Brimble',()=>hasSkill('cooking')],['Keeper of flames','Build three fires of your own',()=>(S.st.fires||0)>=3],['Ember pearl','Find an ember pearl in the ashes',()=>!!S.journal.pearl]],
 foraging:[['Beachcomber','Grab your first wash-up',()=>(S.st.washes||0)>=1],['Salt of the sea','Scrape salt off wet rock',()=>(S.st.pinches||0)>=1],['Quick hands','Grab 25 wash-ups before the backwash',()=>(S.st.washes||0)>=25],['Springy','Catch a wobblewood log on the tide',()=>!!(S.st.found&&S.st.found.wobble)]],
 tinkering:[['Sharp idea','Lash together a hatchet',()=>hasSkill('tinkering')]]};
function rawCount(){return S.inv.filter(i=>FISH[i.id]).length;}
function buffOn(){return S.buff&&S.buff.until>Date.now()?S.buff:null;}

