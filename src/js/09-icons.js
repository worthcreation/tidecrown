/* ---------- icons ---------- */
const icache={};
function drawFish(id,x,y,s,dir,cOv){const F=FISH[id];dir=dir||1;const FC=cOv||F.col;const seed=id.length*17;let rx=14,ry=8;if(id==='eel'){rx=19;ry=5;}if(id==='grump'){rx=13;ry=10;}
 sketch([[x-rx*.7*s*dir,y],[x-(rx+9)*s*dir,y-8*s],[x-(rx+6)*s*dir,y],[x-(rx+9)*s*dir,y+8*s]],true,seed+1,.8,FC,INK,2.2);
 blob(x,y,rx*s,ry*s,seed,FC,2.4,.8);
 if(id==='eel'){for(let i=-1;i<=1;i++)ln([[x+i*8*s,y-4*s],[x+i*8*s+2*s,y+4*s]],seed+5+i,2.2,'#fff',.4);}
 if(id==='perch'){dot(x-4*s,y+2*s,1.6*s,'#8a6a3d');dot(x+2*s,y+4*s,1.4*s,'#8a6a3d');dot(x-1*s,y-3*s,1.2*s,'#8a6a3d');}
 if(id==='koi'){dot(x-3*s,y-2*s,2.5*s,'#ff9a6b');}
 dot(x+rx*.5*s*dir,y-2*s,1.9*s);
 if(id==='grump')ln([[x+rx*.25*s*dir,y-7*s],[x+rx*.75*s*dir,y-4*s]],seed+9,2,INK,.3);}
function drawGearIcon(id){
 if(id==='stache'){drawStache(32,26,2.7,0);}
 else if(id==='cap'){blob(32,36,20,12,401,'#9d97b0',2.6);ln([[12,40],[52,40]],402,2.5,INK,.5);dot(24,32,2.5,'#fff');dot(34,28,2,'#fff');dot(42,34,2.2,'#fff');}
 else if(id==='thimble'){sketch([[14,46],[16,26],[32,14],[48,26],[50,46]],true,403,.8,'#d6d0e2',INK,2.6);for(let i=0;i<6;i++)dot(22+(i%3)*10,28+Math.floor(i/3)*10,1.6);}
 else if(id==='coat'){sketch([[20,12],[44,12],[54,52],[10,52]],true,404,1,'#f2c230',INK,2.6);ln([[32,14],[32,50]],405,2,INK,.4);dot(36,26,2);dot(36,38,2);}
 else if(id==='gloves'){blob(23,37,11,13,406,'#4f9a5a',2.6);blob(42,31,11,13,407,'#5fae6a',2.6);}
 else if(id==='spyglass'){ctx.save();ctx.translate(32,32);ctx.rotate(-.6);sketch(rrPts(-22,-6,40,12,4),true,408,.8,'#d9a54a',INK,2.6);sketch(rrPts(12,-9,12,18,3),true,409,.6,'#b9853a',INK,2.4);ctx.restore();}
 else if(id==='salttin'){sketch(rrPts(14,18,36,32,8),true,410,1,'#c9c3d6',INK,2.6);sketch(rrPts(14,13,36,9,3),true,411,.6,'#9d97b0',INK,2.4);sketch(rrPts(20,28,24,12,3),true,412,.5,'#fffaf0',INK,2);}
 else if(id==='whisper'){blob(32,34,18,14,413,'#ffc2d1',2.6);ln([[32,34],[38,30],[40,36],[32,40],[26,32],[34,24]],414,2,INK,.4);}
 else if(id==='blankmap'){sketch(rrPts(10,14,44,36,4),true,415,1,'#fff3d6',INK,2.6);ctx.setLineDash([4,4]);ln([[16,40],[28,30],[40,36]],416,2,INK,.4);ctx.setLineDash([]);ln([[42,21],[48,28]],417,2.5,'#ff6b6b',.2);ln([[48,21],[42,28]],418,2.5,'#ff6b6b',.2);}}
function drawStache(cx,cy,s,w){for(const sd of[-1,1]){sketch([[cx,cy-1*s],[cx+sd*5*s,cy-2.6*s],[cx+sd*9.5*s,cy-.8*s+w],[cx+sd*8*s,cy+1.6*s],[cx+sd*3*s,cy+1.4*s]],true,960+sd,.3*s,'#9a94a8',INK,1.6*Math.sqrt(s));
  const br=[[cx+sd*8.5*s,cy],[cx+sd*10*s,cy+5*s],[cx+sd*9*s,cy+10*s+w]];ln(br,962+sd,4.2*Math.sqrt(s),INK,.2);ln(br,962+sd,2.4*Math.sqrt(s),'#9a94a8',.2);dot(cx+sd*9*s,cy+10.5*s+w,1.5*Math.sqrt(s),'#5a5266');}}
const imgCache={};function iconImg(id){if(!imgCache[id]){const im=new Image();im.src=icon(id);imgCache[id]=im;}return imgCache[id];}
function icon(id){if(icache[id])return icache[id];const c=document.createElement('canvas');c.width=c.height=96;const keep=ctx,kb=boil;ctx=c.getContext('2d');boil=0;ctx.scale(1.5,1.5);
 if(FISH[id])drawFish(id,36,32,1.25);
 else if(id.startsWith('ck_')){const [,f,q]=id.split('_');drawFish(f,34,36,1.2,1,QCOL[q]);if(q!=='charred'&&q!=='under')for(let i=0;i<3;i++)ln([[24+i*9,22],[21+i*9,14],[25+i*9,6]],450+i,2,'rgba(42,33,64,.45)',.3);
  if(q==='perfect')star(52,14,7,'#ffcf3a');if(q==='smoky'){ctx.globalAlpha=.7;dot(48,18,5,'#8a8494');dot(54,11,4,'#8a8494');ctx.globalAlpha=1;}if(q==='charred'){ctx.globalAlpha=.6;dot(40,18,4,'#5a5266');dot(46,11,3,'#5a5266');ctx.globalAlpha=1;}}
 else if(id==='flame'){blob(32,36,14,20,460,'#ff8a3d',2.8,1);blob(33,43,7,10,461,'#ffd23f',0,.6);}
 else if(id==='wood'){ln([[12,40],[52,26]],462,12,INK,1);ln([[12,40],[52,26]],462,7,'#d9cdb5',1);}
 else if(id==='kelp'){for(let i=-1;i<=1;i++)ln([[32+i*10,52],[38+i*10,34],[30+i*10,14]],465+i,4.5,'#5f6b3a',.8);}
 else if(id==='bottle'){ctx.save();ctx.translate(32,32);ctx.rotate(-.6);sketch(rrPts(-10,-14,20,32,8),true,4,1,'#9fd8b4',INK,2.6);sketch(rrPts(-5,-24,10,11,3),true,5,.6,'#c98f56',INK,2.4);ln([[-4,-2],[4,-2]],6,2,'#fffaf0',.3);ln([[-4,4],[3,4]],7,2,'#fffaf0',.3);ctx.restore();}
 else if(id==='shells'){sketch([[32,46],[14,30],[18,20],[32,15],[46,20],[50,30]],true,8,1,'#ffb3a7',INK,2.6);for(let i=-2;i<=2;i++)ln([[32,44],[32+i*7,20]],10+i,2,INK,.4);}
 else if(id==='bait'){sketch(rrPts(18,22,28,28,7),true,12,1,'#d8c8ff',INK,2.6);sketch(rrPts(16,15,32,9,3),true,13,.6,'#ffcf3a',INK,2.4);[[26,32],[36,38],[30,43],[38,28]].forEach(p=>dot(p[0],p[1],2.2,'#ff6bb5'));}
 else if(EQUIP[id])drawGearIcon(id);
 else if(id==='wobble'){ln([[12,42],[52,26]],472,13,INK,1);ln([[12,42],[52,26]],472,8.5,'#b9d88f',1);blob(52,26,6,6.5,473,'#e8dcb0',2,.4);ln([[50,25],[53,27]],474,1.4,INK,.2);}
 else if(id==='flint'){sketch([[16,46],[30,14],[48,22],[44,48]],true,475,1,'#8a8494',INK,2.6);ln([[30,18],[40,44]],476,1.6,'rgba(255,255,255,.5)',.3);}
 else if(id==='hatchet'){ln([[16,52],[40,16]],477,7,INK,.6);ln([[16,52],[40,16]],477,4,'#d9cdb5',.6);sketch([[34,10],[52,14],[48,30],[38,22]],true,478,.6,'#8a8494',INK,2.4);ln([[34,24],[42,26]],479,2.4,'#5f6b3a',.3);}
 else if(id==='charcoal'){blob(32,36,17,13,480,'#3a3340',2.6,1.2);dot(26,32,2,'#5a5266');dot(36,38,1.6,'#5a5266');}
 else if(id==='seasalt'){for(const q of[[24,40],[36,34],[42,44],[30,28]])sketch([[q[0],q[1]-8],[q[0]+6,q[1]],[q[0],q[1]+6],[q[0]-6,q[1]]],true,481+q[0],.4,'#f4f6ff',INK,2);}
 else if(id==='sunstone'){for(let i=0;i<8;i++){const a=i/8*6.28;ln([[32+Math.cos(a)*16,32+Math.sin(a)*16],[32+Math.cos(a)*24,32+Math.sin(a)*24]],490+i,2.4,'#ffcf3a',.3);}blob(32,32,13,12,489,'#ffb347',2.6,.6);blob(29,29,5,4,488,'#fff1b0',0,.3);}
 else if(id==='pearl'){const g=ctx.createRadialGradient(32,32,2,32,32,24);g.addColorStop(0,'rgba(255,200,120,.9)');g.addColorStop(1,'rgba(255,200,120,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);blob(32,32,11,11,485,'#ffb347',2.6,.4);dot(28,28,3,'#fff6d0');}
 else if(id==='ash'){blob(32,40,22,12,470,'#b8b2c4',2.6,1);blob(30,34,12,7,471,'#cdc8d6',0,.6);[[24,40],[38,42],[31,45],[42,37]].forEach(q=>dot(q[0],q[1],1.6,'#5a5266'));}
 else if(id==='rod'){ln([[14,52],[34,30],[50,10]],20,4.5,'#a8703f',1);ln([[50,10],[54,30],[52,44]],21,1.6,INK,.6);blob(52,46,4,4,22,'#ff6b6b',2,.4);}
 icache[id]=c.toDataURL();ctx=keep;boil=kb;return icache[id];}

