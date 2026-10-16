const DESPAWN=180000;
function dropGround(it){S.ground=S.ground||[];const k=S.ground.filter(g=>Math.hypot(g.x-P.x,g.y-P.y)<30).length,a=k*1.3;S.ground.push({x:P.x+Math.cos(a)*14*(k?1:0)+P.face*10,y:P.y+6+Math.sin(a)*8*(k?1:0),it:Object.assign({},it),exp:Date.now()+DESPAWN});save();}
function pickGround(g){const i=(S.ground||[]).indexOf(g);if(i<0)return;const it=g.it,n=it.n||1;
 if(stackOf(it.id)){const got=addItem(it.id,n);if(!got){think('No room in my pack.');return;}if(got<n){it.n=n-got;think('My pack only fit some of it.');}else S.ground.splice(i,1);}
 else{if(S.inv.length>=PACK){think('No room in my pack.');return;}const c=Object.assign({},it);delete c.n;S.inv.push(c);S.ground.splice(i,1);}
 flies.push({id:'misc',img:itemIcon(it),x0:g.x,y0:g.y,t:0});if(g.storm&&S.ground.indexOf(g)<0)stormFishPicked(g);save();}
function drawGround(){const T=Date.now();for(const g of (S.ground||[])){if(Math.abs(g.x-cam.x)>W/Z/2+60||Math.abs(g.y-cam.y)>H/Z/2+60)continue;drawOcc(g.x,g.y,()=>drawGroundOne(g,T),true);}}
function drawGroundOne(g,T){{const left=g.exp-T;if(left<20000&&Math.floor(now*5)%2)return;
 shadow(g.x,g.y+2,10,3.5);if(g.storm){/* a stranded fish flops */const f=Math.max(0,Math.sin(now*5+g.x))**3,a=Math.sin(now*9+g.y)*.5*f;ctx.save();ctx.translate(g.x,g.y-10-f*8);ctx.rotate(a);ctx.drawImage(iconImg(itemIcon(g.it)),-12,-10,24,24);ctx.restore();}else ctx.drawImage(iconImg(itemIcon(g.it)),g.x-12,g.y-20+Math.sin(now*2+g.x)*1.2,24,24);if((g.it.n||1)>1)otext(String(g.it.n),g.x+11,g.y-2,12,'#fff');}}
function drawGull(){if(mortShooed()){drawGullAloft();return;}const {y}=GULL,x0=GULL.x,lean=Math.min(1,Math.max(0,wmPeek('mortimer').f))*8,x=x0,b=Math.sin(now*2.2)*1.2,talk=(dlgOn&&curWho==='Mortimer Gull')||bankOpen;
 shadow(x,y+3,14,4);ln([[x,y],[x,y-26]],1001,8,INK,.6);ln([[x,y],[x,y-26]],1001,4.5,'#a8703f',.6);sketch(rrPts(x-17,y-22,34,13,3),true,1002,1,'#e8d6b0',INK,2.4);ln([[x-10,y-16],[x+9,y-16]],1003,1.8,INK,.8);
 ctx.save();ctx.translate(-(P.x>x?1:-1)*lean,0);
 const gy=y-38+b;ln([[x-3,y-27],[x-3,gy+8]],1004,1.8,'#e8a23a',.2);ln([[x+3,y-27],[x+3,gy+8]],1005,1.8,'#e8a23a',.2);
 blob(x,gy,13,10,1006,'#fbfbff',2.6,.8);sketch([[x-11,gy-3],[x-1,gy-2],[x-6,gy+6]],true,1007,.4,'#c9c3d6',INK,2);
 blob(x+8,gy-11,7,6.5,1008,'#fbfbff',2.4,.4);dot(x+10,gy-12,1.5);sketch([[x+13,gy-11],[x+21,gy-9+(talk?Math.abs(Math.sin(now*14))*2:0)],[x+13,gy-8]],true,1009,.2,'#ffcf3a',INK,1.8);
 sketch([[x+2,gy-15],[x+15,gy-15],[x+17,gy-12],[x+4,gy-13]],true,1010,.3,'#5fae6a',INK,1.8);ctx.restore();}
function talkGull(){if(mortShooed())return;discover('gullbank');const mo=[{l:'Open the bank',f:()=>{closeDlg();openBank();}}];gheldOpt(mo);if(wmMood('mortimer')==='warm')mo.push({l:'Any news?',f:()=>say('Mortimer Gull',mortimerNews(),[{l:'Open the bank',f:()=>{closeDlg();openBank();}},{l:'See you',f:closeDlg}])});
 {const hl=S.metGull&&wmHeard('mortimer');if(hl){say('Mortimer Gull',hl,mo.concat([{l:'See you',f:closeDlg}]));return;}}
 say('Mortimer Gull',S.metGull?pick(['SQUAWK. Ahem. Still here. Still counting.','Your things are safe. We already stole them once, no need to do it twice.','The Gull Post never closes. We tried closing once. Someone stole the door.']):'SQUAWK. Ahem. Mortimer Gull, the Gull Post. Leave anything with us and it’s safe. Gulls steal everything, so nobody steals from gulls. Very secure.',
 mo.concat([{l:'Can you come to me?',f:()=>say('Mortimer Gull','Gulls don’t make house calls. Unless there’s something crunchy in it for us. Find me something truly crunchy and we’ll talk.',[{l:'Open the bank',f:()=>{closeDlg();openBank();}},{l:'See you',f:closeDlg}])},{l:'See you',f:closeDlg}]));S.metGull=1;}
