/* ---------- skills, xp orbs, hearth ---------- */
let buffT=0,buffQ=null;const buffb=$('buffb');
function buffUI(){const B=buffOn();if(!B||C||ccOn){buffb.style.display='none';return;}const D=BUFF[B.q],left=(B.until-Date.now())/1000,p=Math.max(0,Math.min(100,left/(B.dur||D.dur)*100));
 buffb.style.display='block';buffb.style.setProperty('--p',p.toFixed(1));buffb.classList.toggle('low',left<30);if(buffQ!==B.q){buffQ=B.q;buffb.querySelector('img').src=icon('ck_minnow_'+B.q);}}
buffb.onclick=()=>{const B=buffOn();if(!B)return;const left=Math.ceil((B.until-Date.now())/1000);toast('Well fed: '+BUFF[B.q].txt+'. '+Math.floor(left/60)+'m '+String(left%60).padStart(2,'0')+'s left');};
let ddSel=null,skView=null,curWho='',guideT=2;
function hearthGuide(){if(!hasSkill('hearth')||(S.st.cooked||0)>0||C||ccOn||dlgOn||S.hint<3)return;if(hintEl.classList.contains('on')&&hintEl.textContent===HINTS[S.hint])return;
 const t=rawCount()?'Tap Old Wick to cook your catch.':'Catch a fish, then bring it to Old Wick.';if(hintEl.textContent!==t||!hintEl.classList.contains('on'))hint(t);}
/* skills: display data, level unlocks and the clue shown while hidden. Unbuilt skills carry only name and clue. */
const SKILLS={
 fishing:{name:'Fishing',icon:'rod',col:'#6fd6ff',desc:'Patience and a quick hand. The Lantern Sea feeds those who wait, and every catch pulls you a little further out.',
  unl:{5:'Pebble Perch are biting now',10:'The wild water by the north rocks is yours',15:'Something sweet wriggles in the deep',20:'The moon is tugging at your line'}},
 shipwright:{name:'Shipwright',icon:'hatchet',col:'#a8d07e',clue:'Ask the wobble trees.',desc:'It starts with a hatchet and a tree that sighs. Wood becomes fire, then tools, then a hull. Every voyage begins with a log.',
  unl:{3:'Wobblewood burns longer in your fires',8:'Wobble trees sway slower for you',12:'Wick has a project in mind for your wood'}},
 hearth:{name:'Hearth',icon:'flame',col:'#ffb347',clue:'It starts with a spark. Someone on this island is very hungry.',desc:'Keep a fire, keep a crew. Juggle the heat, flip at golden, and a catch becomes strength.',
  unl:{3:'You can build your own fires',5:'A second pan by the fire',6:'Something on the beach starts blinking at night',10:'A third pan by the fire',15:'Kelp flares burn longer',20:'Your golden window widens'}},
 delving:{name:'Delving',clue:'Something is buried under your feet.'},
 grit:{name:'Grit',clue:'Not everything out there is friendly. Yet.'},
 sailing:{name:'Sailing',clue:'Past the last lighthouse.'}};
const ACH={
 shipwright:[['Sharp idea','Lash together a hatchet',()=>hasSkill('shipwright')],['First log','Earn a log from a wobble tree',()=>!!S.journal.wobblelog],['In the groove','Land 10 clean chops in a row',()=>!!S.st.groove],['Bonfire','Build a bonfire',()=>!!S.journal.bonfire],['Ember pearl','Find an ember pearl in the ashes',()=>!!S.journal.pearl]],
 fishing:[['First bite','Catch your first fish',()=>S.catches>=1],['Steady hand','Land 10 perfect catches',()=>(S.st.perf||0)>=10],['Wild water','Catch a Grumpfish',()=>!!S.journal.fish_grump],['Letters from C.','Find a message in a bottle',()=>S.bottles>=1],['Moonlit','Catch a Moonkoi',()=>!!S.journal.fish_koi]],
 hearth:[['Kindled','Feed Old Wick',()=>!!hasSkill('hearth')],['Golden','Cook a fish golden on both sides',()=>(S.st.perfC||0)>=1],['Smoke signals','Discover smoky fish',()=>!!S.journal.smoky],['Three pans','Keep three pans going at once',()=>!!S.st.pans3],['Keeper of flames','Build three fires of your own',()=>(S.st.fires||0)>=3]]};
function rawCount(){return S.inv.filter(i=>FISH[i.id]).length;}
function buffOn(){return S.buff&&S.buff.until>Date.now()?S.buff:null;}

