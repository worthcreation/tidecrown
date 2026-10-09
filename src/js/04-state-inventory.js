/* ---------- state ---------- */
const SAVE='driftwood_key_v1';
let S={x:R0-80,y:24,sk:null,inv:[],shells:0,bait:0,journal:{},day:.27,hint:0,bottles:0,catches:0,metG:false,char:null,origin:null,eq:{head:null,body:null,hand:null,trinket:null},owned:{},salutes:0,wobble:0,wood:0,kelp:0,fires:[],st:{},buff:null,metWick:0};
try{const raw=localStorage.getItem(SAVE);if(raw)S=Object.assign(S,JSON.parse(raw));}catch(e){}
if(!walkable(S.x,S.y)){S.x=R0-80;S.y=24;}
/* skills: S.sk[id]={xp}. A skill is unlocked when its entry exists. Migrates the build 1-2 fields. */
if(!S.sk){S.sk={fishing:{xp:S.xp||0}};if(S.hearth)S.sk.hearth={xp:S.hx||0};if(S.shipwright)S.sk.shipwright={xp:S.sx||0};}
for(const k of ['xp','hx','sx','hearth','shipwright'])delete S[k];
/* build 4: Hearth became Cooking (and Firemaking), Shipwright became Woodcutting (and Tinkering, unlocked by the hatchet) */
if(S.sk.hearth){S.sk.cooking=S.sk.hearth;S.sk.firemaking={xp:0};delete S.sk.hearth;}
if(S.sk.shipwright){S.sk.woodcutting=S.sk.shipwright;S.sk.tinkering={xp:30};delete S.sk.shipwright;}
S.st=S.st||{};S.st.fires=Math.max(S.st.fires||0,(S.fires||[]).length,S.journal&&S.journal.firstfire?1:0);
/* k may be a skill (gathering) or a subskill (fishing). A skill is unlocked when any subskill is; its XP sums its subskills plus achievements. */
function hasSkill(k){return SKILLS[k]?SKILLS[k].subs.some(s=>!!S.sk[s]):!!S.sk[k];}
function unlockSkill(k){if(!S.sk[k])S.sk[k]={xp:0};}
function xpOf(k){if(SKILLS[k])return SKILLS[k].subs.reduce((a,s)=>a+xpOf(s)+(ACH[s]||[]).filter(x=>x[2]()).length*50,0);return S.sk[k]?S.sk[k].xp:0;}
function lv(k){return lvl(xpOf(k));}
function cnt(id){return S.inv.reduce((a,i)=>a+(i.id===id?(i.n||1):0),0);}
function canAdd(id,n){n=n||1;const cap=stackOf(id);if(!cap)return S.inv.length+n<=PACK;let room=(PACK-S.inv.length)*cap;for(const i of S.inv)if(i.id===id)room+=cap-(i.n||1);return room>=n;}
function addItem(id,n){n=n||1;const cap=stackOf(id);let added=0;
 if(!cap){while(added<n&&S.inv.length<PACK){S.inv.push({id});added++;}return added;}
 for(const i of S.inv){if(added>=n)break;if(i.id===id&&(i.n||1)<cap){const k=Math.min(cap-(i.n||1),n-added);i.n=(i.n||1)+k;added+=k;}}
 while(added<n&&S.inv.length<PACK){const k=Math.min(cap,n-added);S.inv.push({id,n:k});added+=k;}return added;}
function takeItem(id,n){n=n||1;if(cnt(id)<n)return false;for(let j=S.inv.length-1;j>=0&&n>0;j--){const i=S.inv[j];if(i.id!==id)continue;const k=Math.min(i.n||1,n);i.n=(i.n||1)-k;n-=k;if(i.n<=0)S.inv.splice(j,1);}return true;}
{const tot={};S.inv=S.inv.filter(i=>{if(stackOf(i.id)){tot[i.id]=(tot[i.id]||0)+(i.n||1);return false;}return true;});for(const id in tot)addItem(id,tot[id]);}
for(const k of ['shells','bait','wood','kelp','ash','wobble']){const v=S[k];delete S[k];if(typeof v==='number'&&v>0)addItem(k,v);
 Object.defineProperty(S,k,{get(){return cnt(k);},set(v){const c=cnt(k);if(v>c)addItem(k,v-c);else if(v<c)takeItem(k,c-v);},enumerable:false,configurable:true});}
function save(){S.x=P.x;S.y=P.y;try{localStorage.setItem(SAVE,JSON.stringify(S));}catch(e){}}
const P={x:S.x,y:S.y,path:[],then:null,face:-1,moving:false,task:null,pathT:0};
const cam={x:P.x,y:P.y};
(S.fires||[]).forEach(f=>{if(!f.until)f.until=Date.now()+90000;if(f.until>Date.now()+8*60000)f.until=Date.now()+90000;if(!f.fuel)f.fuel={wood:3};});
setInterval(save,5000);document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});

let flies=[],pops=[],bub=null,cele=null,fly=null,mark=null,intro=null,dark=0;

