function fireLit(fr){return fr.main||(fr.until||0)>Date.now();}
function addAsh(x,y,n,items){S.ashp=S.ashp||[];const a=S.ashp.find(q=>Math.hypot(q.x-x,q.y-y)<30);if(a){a.n=Math.min(9,a.n+n);a.items=(a.items||[]).concat(items||[]);}else S.ashp.push({x,y,n,items:items||[]});save();}
function scoopAsh(a){const i=(S.ashp||[]).indexOf(a);if(i<0)return;if(a.n>0&&!canAdd('ash',a.n)){think('No room in my pack for the ash.');return;}S.ash=(S.ash||0)+a.n;pop('+'+a.n+' ash',a.x,a.y-26,'#fff',17);discover('ash');
 const left=[];(a.items||[]).forEach(id=>{if(canAdd(id)){addItem(id);S.st.found=S.st.found||{};S.st.found[id]=(S.st.found[id]||0)+1;flies.push({id:'misc',img:id,x0:a.x,y0:a.y,t:0});discover(id);}else left.push(id);});
 if(left.length){a.n=0;a.items=left;think('Something else is in the ash, but my satchel is full.');}else S.ashp.splice(i,1);save();
 if(!S.ashHint&&S.metWick){S.ashHint=1;setTimeout(()=>think('Old Wick got weirdly excited about ash once. Maybe ask him.'),900);}}
function feedFire(fr,kind){const c=clampLand(fr.x+34,fr.y+16);routeTo(c[0],c[1],()=>{const nm={wood:'driftwood',wobble:'wobblewood',charcoal:'charcoal'}[kind];if(!(cnt(kind)>0)){think('No '+nm+' on me.');return;}takeItem(kind);fr.fuel=fr.fuel||{};fr.fuel[kind]=(fr.fuel[kind]||0)+1;
 const mins=kind==='wood'?4:kind==='charcoal'?3:(sl()>=3?10:8),add=mins*60000,cap=(fr.big?45:30)*60000;fr.mins=(fr.mins||8)+mins;fr.until=Math.min(Date.now()+cap,Math.max(fr.until,Date.now())+add);pop('+ '+nm,fr.x,fr.y-40,'#fff',16);save();});}
function lifeHeat(fr){if(fr.main)return .6;const rem=(fr.until-Date.now())/60000,f=fr.fuel||{};let v=Math.min(1,.22+rem/7)+(f.charcoal?.15:0)+(f.wobble?.08:0)+(fr.big?.1:0);if(rem<1)v=.18+.22*Math.abs(Math.sin(now*6+fr.seed)*Math.sin(now*2.3));return v;}
function burnOut(fr){const i=(S.fires||[]).indexOf(fr);if(i<0)return;S.fires.splice(i,1);const f=fr.fuel||{wood:3},items=[],mins=fr.mins||(fr.big?20:8);
 const heatF=1+.25*(f.wobble||0)+.5*(f.charcoal||0)+.1*(f.kelp||0)+(fr.big?.5:0)+(fr.hot||0)/120,score=mins*heatF,R=Math.random;
 if(R()<Math.min(.6,score/60))items.push('charcoal');if((f.kelp||0)>0&&R()<Math.min(.7,.15*f.kelp+score/200))items.push('seasalt');
 if((f.wobble||0)>0&&R()<Math.min(.4,score/150))items.push('pearl');if(score>80&&R()<Math.min(.25,(score-80)/300))items.push('sunstone');
 addAsh(fr.x,fr.y,Math.min(9,1+Math.floor(mins/6)),items);save();}
function searchRocks(k){const c=clampLand(k.x,k.y);routeTo(c[0],c[1],()=>{discover('rocks');if(!S.owned.flint&&!S.owned.hatchet){if(S.inv.length>=PACK){think('Something sharp is wedged in here, but my satchel is full.');return;}S.owned.flint=1;S.inv.push({id:'flint'});flies.push({id:'misc',img:'flint',x0:k.x,y0:k.y,t:0});discover('flint');think('One of these has a wicked edge. Flint!');save();}
 else think(pick(['Barnacles, and a crab-shaped dent. Nothing else.','Just wet rock. The flint was a one-off.']));});}

function tapFire(fr){if(!fr.main&&!fireLit(fr))return;if(fr.main&&(!S.hearth||!rawCount())){routeTo(fr.x-34,fr.y+26,talkWick);return;}
 if(!S.hearth){think('A fire. Strange, it seems to know me.');return;}
 if(!rawCount()){think('Nothing raw to cook. The sea has plenty.');return;}goCook(fr);}
function goCook(fr){const c=clampLand(fr.x+88,fr.y-34);routeTo(c[0],c[1],()=>enterCook(fr));}
function buildFire(x,y,big){if(!onIsland(x,y)){think('Not here.');return;}if(allFires().some(f=>Math.hypot(f.x-x,f.y-y)<(big?140:110))){think('Too close to another fire.');return;}
 const needW=big?2:3,needB=big?2:0;if((S.wood||0)<needW||(S.wobble||0)<needB){think(big?'A bonfire needs 2 wobblewood and 2 driftwood.':'I need 3 driftwood to build a fire.');return;}if((S.fires||[]).length>=5){think('Five fires is plenty. Wick says so.');return;}
 const c=clampLand(x+(big?44:34),y+16);routeTo(c[0],c[1],()=>{if((S.wood||0)<needW||(S.wobble||0)<needB)return;S.wood-=needW;S.wobble-=needB;S.fires=S.fires||[];
  S.fires.push({x,y,seed:10+S.fires.length,big:!!big,until:Date.now()+(big?20:8)*60000,mins:big?20:8,fuel:big?{wood:2,wobble:2}:{wood:3}});addXP('hearth',big?40:25,S.journal.firstfire?'normal':'first',[x,y-10]);discover('firstfire');if(big)discover('bonfire');save();});}

