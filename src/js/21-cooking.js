/* cooking: quality data, then the cooking scene */
const QN={under:'Underdone',good:'Cooked',perfect:'Golden',smoky:'Smoky',charred:'Charred'};
const QCOL={under:'#efd2b0',good:'#e0a245',perfect:'#f5bf45',smoky:'#b9773d',charred:'#4a3a3a'};
const QV={under:1,good:2,perfect:3,smoky:3,charred:.5};
const QD={under:'Still a bit see-through. Your stomach has opinions.',good:'Flaky and warm. Eat it to steady your hands: bites hang on longer.',perfect:'Golden on both sides. Eat it and your timing gets sharper for a good while.',smoky:'Kissed by kelp smoke. The smell on your hands makes fish bite sooner.',charred:'Crunchy. Regrettable. Gubbins might still eat it.'};
const BUFF={good:{win:100,dur:180,txt:'bites hang on longer'},perfect:{win:160,perfect:.06,dur:300,txt:'sharper timing, longer bites'},smoky:{wait:.8,dur:240,txt:'fish bite sooner'}};
const CXP={minnow:15,perch:25,grump:45,eel:65,koi:140},CK={minnow:1.2,perch:1,grump:.85,eel:.8,koi:.7};
let C=null,sparks=[];const cookbar=$('cookbar'),cookinfo=$('cookinfo');
function pz(){return lv('hearth')>=20?.72:.8;}function bT(){return 1.12+Math.min(30,lv('hearth'))*.006;}
function endCookBurn(){const fr=C.fr;exitCook();burnOut(fr);hint('The fire burned out. Only ash is left.',5000);}
function enterCook(fr){if(!hasSkill('hearth'))return;const L=lv('hearth'),n=Math.min(3,1+(L>=5?1:0)+(L>=10?1:0)+(fr.big?1:0));
 C={fr,base:.55,flare:0,feed:0,heat:.55,pans:Array.from({length:n},()=>({f:null})),say:'',sayT:0,zone:'sweet'};
 P.face=-1;P.path=[];P.task=null;cookbar.style.display='flex';bag.style.display='none';buffb.style.display='none';fwood.querySelector('img').src=icon('wood');fkelp.querySelector('img').src=icon('kelp');fuelUI();hintEl.classList.remove('on');closeCtx();
 if(!S.cookHint){S.cookHint=1;hint('Tap a pan to add a fish. Tap it again to flip, once more to plate. Tap the woodpile to feed the fire.',9000);}}
function exitCook(){if(!C)return;C.pans.forEach(p=>{if(p.f)finishPan(p);});C=null;cookbar.style.display='none';bag.style.display='';save();}
$('cookx').onclick=exitCook;
function panPos(i,n){return [[[0,-2]],[[-32,0],[32,0]],[[-58,4],[0,-4],[58,4]]][n-1][i];}
function sideQ(d){return d<.6?'under':d>bT()?'burnt':(d>=pz()&&d<=1)?'perfect':'good';}
function mixC(a,b,t){t=Math.max(0,Math.min(1,t));const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),m=sh=>Math.round(((A>>sh)&255)+(((B>>sh)&255)-((A>>sh)&255))*t);return'#'+((1<<24)+(m(16)<<16)+(m(8)<<8)+m(0)).toString(16).slice(1);}
function doneCol(f,d){if(d<.8)return mixC(FISH[f].col,'#e8b04a',d/.8);if(d<=1)return'#f0b444';const b=bT();if(d<b)return mixC('#f0b444','#9a5a2a',(d-1)/(b-1));return mixC('#9a5a2a','#2e2626',(d-b)/.25);}
function cookUpdate(dt){const L=lv('hearth');C.flare=Math.max(0,C.flare-dt*(L>=15?.09:.12));C.base=Math.max(.12,C.base-dt*(C.fr.big?.018:.028));
 if(!C.fr.main){C.fr.until-=dt*1500;if(C.heat>.95)C.fr.hot=(C.fr.hot||0)+dt;if(!fireLit(C.fr)){endCookBurn();return;}}
 if(C.feed>0){const a=Math.min(C.feed,dt*.2);C.base+=a;C.feed-=a;}C.base=Math.min(1.15,C.base);C.heat=C.out?0:Math.min(1.4,C.base+C.flare);
 if(!C.out&&C.heat<.03&&C.feed<=0){C.outT=(C.outT||0)+dt;if(C.outT>1.2){C.outT=0;if(!C.fr.main){endCookBurn();return;}C.out=true;C.base=0;C.flare=0;addAsh(C.fr.x-34,C.fr.y+16,1);
  C.say='...I’m out. Driftwood. Please.';C.sayT=3;hint('Wick went out. Add driftwood to relight him.',5000);}}else if(!C.out)C.outT=0;
 let warn=false;for(const p of C.pans){if(p.flipT>0)p.flipT-=dt;if(!p.f)continue;p.d[p.side]+=.15*Math.pow(C.heat,1.2)*CK[p.f]*dt;p.tot+=dt;if(C.flare>.15)p.fl+=dt;const d=p.d[p.side];if(d>1&&d<bT())warn=true;}
 C.sayT-=dt;const z=C.heat<.4?'cold':C.heat>.95?'hot':'sweet';
 if(C.fr.main&&C.sayT<=0){let t=null;if(warn)t=pick(['Flip it! Flip it!','That one’s ready!','Golden! Move!']);
  else if(z!==C.zone)t=z==='cold'?pick(['Feed me!','I’m fading here.','Wood! Wood!']):z==='hot'?pick(['Too hot, too hot!','Whoa, easy!','I’m scorching everything!']):pick(['Lovely.','Now that’s cooking.','Mm, just right.']);
  if(t){C.say=t;C.sayT=2.4;}}C.zone=z;
 const n=rawCount(),txt=n+' raw fish';if(cookinfo.textContent!==txt)cookinfo.textContent=txt;
 const kd=S.kindle;if(kd&&kd.joined&&!C.kh&&(S.wood||0)>0){C.kcd=(C.kcd||0)-dt;if(C.kcd<=0&&(C.out||C.base+C.feed<.18)){if(!(kd.hops>0)&&(S.ash||0)>0){S.ash--;kd.hops=2;pop('Kindle munches some ash',C.fr.x-56,C.fr.y+24,'#fff',14);}if(kd.hops>0){kd.hops--;C.kcd=6;C.kh={t:0};}}}
 if(C.kh){C.kh.t+=dt;if(C.kh.t>=.6){C.kh=null;fuel('wood',true);}}
 fuelUI();}
const fwood=$('fwood'),fkelp=$('fkelp');
function cookZoom(){return Math.max(1.4,Math.min(2.3,(W/2/96)/ZB,(H/2/108)/ZB));}
function fuelUI(){for(const [b,k] of [[fwood,'wood'],[fkelp,'kelp']]){const n=S[k]||0,t=String(n),bb=b.querySelector('b');if(bb.textContent!==t)bb.textContent=t;b.classList.toggle('empty',!n);}{const kd=S.kindle,on=!!(kd&&kd.joined);fwood.classList.toggle('auto',on);if(on){const t=kd.hops>0?'Kindle '+kd.hops:((S.ash||0)>0?'Kindle':'Kindle zzz'),e=fwood.querySelector('.kd');if(e.textContent!==t)e.textContent=t;}}}
function fuel(k,auto){if(!C)return;if(!((S[k]||0)>0)){if(!auto)pop(k==='wood'?'No driftwood left':'No dry kelp left',C.fr.x,C.fr.y-60,'#fff',15);return;}
 if(C.out&&k==='kelp'){pop('Kelp won’t catch on cold coals',C.fr.x,C.fr.y-60,'#fff',15);return;}
 S[k]--;if(C.out&&k==='wood'){C.out=false;C.base=.22;if(C.fr.main){C.say='Ahh. Back from the dead.';C.sayT=2.4;}}
 stoke(C.fr,k);if(k==='wood')C.feed+=.32;else C.flare+=.5;if(auto)discover('kindle');
 for(let i=0;i<7;i++)sparks.push({x:C.fr.x+(Math.random()-.5)*14,y:C.fr.y-16,vx:(Math.random()-.5)*60,vy:-60-Math.random()*80,t:0});
 const b=k==='wood'?fwood:fkelp;b.classList.add('pop');setTimeout(()=>b.classList.remove('pop'),120);fuelUI();}
fwood.onclick=()=>fuel('wood');fkelp.onclick=()=>fuel('kelp');
function panTap(i){const p=C.pans[i];
 if(!p.f){const idx=S.inv.findIndex(it=>FISH[it.id]);if(idx<0){pop('No raw fish',C.fr.x,C.fr.y+30,'#fff',17);return;}
  const it=S.inv.splice(idx,1)[0];Object.assign(p,{f:it.id,side:0,d:[0,0],tot:0,fl:0,flipT:0});if(C.pans.filter(q=>q.f).length>=3)S.st.pans3=1;return;}
 if(p.side===0){p.side=1;p.flipT=.35;return;}finishPan(p);}
function finishPan(p){const a=sideQ(p.d[0]),b=sideQ(p.d[1]);let q=(a==='burnt'||b==='burnt')?'charred':(a==='under'||b==='under')?'under':(a==='perfect'&&b==='perfect')?'perfect':'good';
 const gold=q==='perfect',smoky=(q==='good'||gold)&&p.tot>0&&p.fl/p.tot>.4;if(smoky)q='smoky';
 S.st.cc=S.st.cc||{};const cs=S.st.cc[p.f]=S.st.cc[p.f]||{n:0,g:0,s:0,c:0};cs.n++;if(gold)cs.g++;if(smoky)cs.s++;if(q==='charred')cs.c++;
 S.st.ck=S.st.ck||{};const okCook=q!=='charred'&&q!=='under',first=okCook&&!S.st.ck[p.f];if(okCook)S.st.ck[p.f]=1;
 let xp=CXP[p.f];if(q==='under')xp*=.3;if(q==='charred')xp=2;if(gold)xp*=1.5;if(smoky)xp*=1.25;xp=Math.max(1,Math.round(xp));
 S.inv.push({id:'cook',f:p.f,q});S.st.cooked=(S.st.cooked||0)+1;if(gold)S.st.perfC=(S.st.perfC||0)+1;
 const i=C.pans.indexOf(p),pp=panPos(i,C.pans.length),wx=C.fr.x+pp[0],wy=C.fr.y+pp[1];
 addXP('hearth',xp,q==='charred'?'burnt':smoky?'smoky':gold?'perfect':first?'first':'normal',[wx,wy]);
 flies.push({id:p.f,x0:wx,y0:wy-4,t:0,col:QCOL[q]});
 if(gold)discover('perfectcook');if(smoky)discover('smoky');p.f=null;save();}
function cookTap(sx,sy){const [wx,wy]=s2w(sx,sy),{x,y}=C.fr,n=C.pans.length;
 for(let i=0;i<n;i++){const [dx,dy]=panPos(i,n);if(Math.hypot(wx-x-dx,(wy-y-dy)*1.3)<30){panTap(i);return;}}
  if(Math.hypot(wx-x,wy-y+44)<26)fuel((S.wood||0)>0?'wood':'kelp');}
function drawCook(){const {x,y}=C.fr,n=C.pans.length,h=C.heat;
 if(C.kh){const k=C.kh.t/.6,kx=x-80+(74*k),ky=y+40-(52*k)-Math.sin(k*Math.PI)*46;ctx.save();ctx.translate(kx,ky);ctx.rotate(k*5);
  ln([[-9,0],[9,0]],960,10,INK,.6);ln([[-9,0],[9,0]],960,6.5,'#d9cdb5',.6);dot(-2,-1,1.3);dot(3,-1,1.3);ln([[-4,4],[-6,9]],961,1.8,INK,.2);ln([[4,4],[6,9]],962,1.8,INK,.2);ctx.restore();}
 const gx=x,gy=y-112,R=24,A=v=>Math.PI+Math.min(1.4,Math.max(0,v))/1.4*Math.PI;
 ctx.lineCap='round';ctx.strokeStyle=INK;ctx.lineWidth=11;ctx.beginPath();ctx.arc(gx,gy,R,Math.PI,2*Math.PI);ctx.stroke();
 for(const [a,b,c] of [[0,.4,'#9fc4d8'],[.4,.95,'#ffcf3a'],[.95,1.4,'#ff6b4a']]){ctx.strokeStyle=c;ctx.lineWidth=6;ctx.beginPath();ctx.arc(gx,gy,R,A(a)+.03,A(b)-.03);ctx.stroke();}
 const na=A(h);ln([[gx,gy],[gx+Math.cos(na)*(R+3),gy+Math.sin(na)*(R+3)]],820,3,INK,.3);dot(gx,gy,3.5);
 C.pans.forEach((p,i)=>{const [dx,dy]=panPos(i,n),px=x+dx,py=y+dy;
  if(dx!==0){ln([[px-18,py+12],[px+18,py+6]],880+i,7,INK,.8);ln([[px-18,py+12],[px+18,py+6]],880+i,3.8,'#9a6236',.8);}
  const fl=Math.sin(now*13+i*2)*2*(.5+h);
  if(!C.out)for(const [ox,sc] of [[-20,.85],[20,.85],[-8,1],[8,1]]){const fh2=(8+h*15)*sc;blob(px+ox,py-2-fh2*.45,(5+h*3)*sc,fh2+fl,890+i*4+ox,h<.4?'#d9553a':'#ff8a3d',2.2,.6);if(h>.4)blob(px+ox,py-fh2*.3,(2.5+h*1.5)*sc,fh2*.5,895+i*4+ox,'#ffd23f',0,.4);}
  blob(px,py+3,22,13,840+i,'#4a4458',3,.8);blob(px,py+2,16,8,850+i,'#5d5670',0,.6);
  if(!C.out)for(const ox of[-14,0,14]){const th=4+h*7+Math.sin(now*15+ox+i)*1.5;blob(px+ox,py+14-th*.5,3+h*1.5,th,900+i*3+ox,h<.4?'#d9553a':'#ff9a4a',1.8,.4);}
  ln([[px,py+13],[px+(dx>=0?4:-4),py+28]],830+i,4.5,INK,.4);
  const rx=27,ry=17,a0=-Math.PI/2,ang=d=>a0+Math.min(1.3,Math.max(0,d))/1.3*2*Math.PI;
  const arc=(a,b,c,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.ellipse(px,py+2,rx,ry,0,ang(a),ang(b));ctx.stroke();};
  ctx.lineCap='butt';arc(0,1.3,'rgba(42,33,64,.22)',4);
  if(p.f){arc(.6,pz(),'#a6d07e',4);arc(pz(),1,'#ffcf3a',6);arc(1,bT(),'#e0a245',4);arc(bT(),1.3,'#e05a4a',4);
   const d=p.d[p.side],a=ang(d);dot(px+Math.cos(a)*rx,py+2+Math.sin(a)*ry,5);dot(px+Math.cos(a)*rx,py+2+Math.sin(a)*ry,2.4,'#fff');
   for(let s2=0;s2<2;s2++)blob(px-11+s2*22,py+26,3,3,860+s2,s2<p.side?'#ffcf3a':'#fffaf0',1.5,.2);
   const fp=p.flipT>0?Math.cos((1-p.flipT/.35)*Math.PI):1;ctx.save();ctx.translate(px,py);ctx.scale(1,Math.max(.12,Math.abs(fp)));drawFish(p.f,0,0,.9,(p.side?-1:1)*(fp<0?-1:1),doneCol(p.f,d));ctx.restore();
   if(h>.35&&Math.random()<h*15*fdt)sparks.push({x:px+(Math.random()-.5)*20,y:py-6,vx:(Math.random()-.5)*10,vy:-26,t:0,steam:1});
   if(d>bT()&&Math.random()<18*fdt)sparks.push({x:px+(Math.random()-.5)*14,y:py-8,vx:(Math.random()-.5)*8,vy:-20,t:0,smoke:1});}
  else{ctx.globalAlpha=.55+.3*Math.sin(now*3);otext(rawCount()?'+':'-',px,py+1,22,'#fffaf0');ctx.globalAlpha=1;}});
 ctx.lineCap='round';
 sparks=sparks.filter(s=>(s.t+=fdt)<(s.smoke?1.4:s.steam?.9:.8));
 for(const s of sparks){s.x+=s.vx*fdt;s.y+=s.vy*fdt;const life=s.smoke?1.4:s.steam?.9:.8;ctx.globalAlpha=(1-s.t/life)*(s.steam?.6:1);dot(s.x,s.y,s.smoke?3+s.t*5:s.steam?2+s.t*3:1.8,s.smoke?'#5a5266':s.steam?'#fff':'#ffcf3a');}ctx.globalAlpha=1;
 if(C.fr.main&&C.sayT>0){ctx.font="16px 'Patrick Hand','Comic Sans MS',cursive";const w=ctx.measureText(C.say).width+22,bx=x-w/2,by=y-176;ctx.globalAlpha=Math.min(1,C.sayT*3);
  sketch(rrPts(bx,by,w,27,10),true,870,1.5,'#fffaf0',INK,2.4);ln([[x-5,by+26],[x,by+34],[x+6,by+26]],871,2.2,INK,.3);ctx.fillStyle=INK;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(C.say,bx+w/2,by+14);ctx.globalAlpha=1;}}
