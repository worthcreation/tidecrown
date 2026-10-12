/* ---------- Sir Thimble's quest: the sailmaker's kit ----------
   His helmet is the Grinning Gull's sailmaker's thimble; it floated here with Brimble. Three salutes and he asks,
   in mime, for the rest of the kit. Three real sailmaker's tools are scattered by the sea: a palm (the leather hand
   guard that pushes a needle through canvas), a fid (a tapered bone spike for opening rope and canvas) and a coil of
   waxed twine. Bring all three: he keeps them, gives you his spare helm, and shows you how a seam holds (S.know.sewing).
   No needle in the kit on purpose: making one is an Invention task, still to be designed. */
S.q=S.q||{};S.know=S.know||{};
/* saves that already had the helm finished the old way */
if(S.owned.thimble&&!S.q.thimble){S.q.thimble={st:2};S.know.sewing=1;}
function tq(){return S.q.thimble||{st:0};}
const KIT=['palm','fid','twine'];
/* where each piece lies, and when it can be seen */
function kitSpot(id){if(id==='palm'){const a=2.75;return {p:polar(a,iR(a)+30),vis:()=>walkable(...polar(a,iR(a)+30)),where:'the west beach, under the low tide'};}
 if(id==='fid'){const c=clams()[1]||clams()[0];return {p:[c.x-40,c.y+14],vis:()=>true,where:'a reef'};}
 const k=rocks[2];return {p:[k.x*1.04,k.y*1.04],vis:()=>tideLevel()<.4,where:'a crevice in the north rocks, at low tide'};}
function kitOut(id){const q=tq();return q.st===1&&!(q.got||{})[id]&&!(cnt(id)>0);}
function thimbleObjects(o){if(SH.on||tq().st!==1)return;for(const id of KIT){if(!kitOut(id))continue;const s=kitSpot(id);if(!s.vis())continue;
 o.push({x:s.p[0],y:s.p[1]-4,r:18,name:itemName({id}),key:'kit',act:'Pick up',onAct:()=>{const go=id==='fid'?walkStraight:routeTo;go(s.p[0]-14,s.p[1]+6,()=>takeKit(id,s));},onExamine:()=>think(itemDesc({id}))});}}
function takeKit(id,s){if(!kitOut(id))return;if(Math.hypot(P.x-s.p[0],P.y-s.p[1])>60){think('Closer.');return;}if(!canAdd(id)){think('No room in my pack.');return;}
 addItem(id);flies.push({id:'misc',img:id,x0:s.p[0],y0:s.p[1],t:0});sfx('grab');const left=KIT.filter(k=>!(cnt(k)>0)).length;
 think(left?pick(['One of Sir Thimble\u2019s. '+(left===1?'One more.':'Two more.'),'The sea kept this one for him. '+(left===1?'One to go.':'Two to go.')]):'That is all three. Sir Thimble will want these.');save();}
/* the crab: three salutes start it; a salute with the whole kit finishes it */
function thimbleSalute(){const q=tq();
 if(q.st===0&&S.salutes>=3){S.q.thimble={st:1,got:{}};discover('thimblekit');toast('Quest: The sailmaker\u2019s kit');think('He taps his helmet, then mimes a strap round his claw, a spike, a coil. Then points at the sea. Three times.');save();return true;}
 if(q.st===1){if(KIT.every(k=>cnt(k)>0)){if(!canAdd('thimble')){think('He has something for me. My pack is too full.');return true;}KIT.forEach(k=>takeItem(k));S.q.thimble={st:2};S.owned.thimble=1;S.know.sewing=1;addItem('thimble');
   discover('sewing');toast('Quest done: The sailmaker\u2019s kit');sfx('burst');think('He lays out the palm, the fid and the twine like old friends. Then he hands me his spare helm, and shows me, very slowly, how a seam holds.');save();return true;}
  const left=KIT.filter(k=>!(cnt(k)>0)).map(k=>kitSpot(k).where);think('He waits. Still missing: '+left.join('; ')+'.');return true;}
 return false;}
function drawKit(){if(SH.on||tq().st!==1)return;for(const id of KIT){if(!kitOut(id))continue;const s=kitSpot(id);if(!s.vis())continue;ctx.drawImage(iconImg(id),s.p[0]-11,s.p[1]-14,22,22);}}
