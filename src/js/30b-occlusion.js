/* ---------- occlusion: land in front hides what is behind it ----------
   With the height lift tall enough to read, a ridge near you can stand in front of ground, water and things
   behind it. This file draws the Key's land as it really stands (column by column, back to front), puts ink on
   every edge where land hides land, clips objects at the ground in front of them, shows a soft outline of you and
   of anything you can use when a ridge hides it, and lets a tap on that outline reach it.
   The dark islands' slopes are gentle enough that nothing folds there, so only the Key needs the land pass. */
let LANDK=null;
function landKey(){if(LANDK)return LANDK;const C=[],step=6;
 for(let x=-760;x<=760;x+=step){let ly1=null,ly2=null,gy1=null,gy2=null;
  for(let y=-760;y<=760;y+=2){const r=Math.hypot(x,y),a=Math.atan2(y,x);if(r<=iR(a)){if(ly1===null)ly1=y;ly2=y;if(r<=gR(a)){if(gy1===null)gy1=y;gy2=y;}}}
  if(ly1===null)continue;const s=y=>y-liftAt(x,y),span=(a,b)=>{let t=1e9,u=-1e9;for(let y=a;y<=b;y+=2){const v=s(y);if(v<t)t=v;if(v>u)u=v;}return [t,u];};
  const c={x,top:span(ly1,ly2)[0],bot:span(ly1,ly2)[1]};
  if(gy1!==null){c.n=span(ly1,gy1);c.g=span(gy1,gy2);c.s=gy2<ly2?span(gy2,ly2):null;}else c.n=span(ly1,ly2);
  /* crests that hide ground behind them: scan front to back, note where the view drops behind a crest and later reappears above it */
  c.crests=[];let m=1e9,hid=false,cr=null;for(let y=ly2;y>=ly1;y-=2){const v=s(y);if(v<m-.5){if(hid&&cr!==null)c.crests.push(cr);m=v;hid=false;}else if(v>m+1.5&&!hid){hid=true;cr=m;}}
  C.push(c);}
 /* runs of columns with each band, as polygons */
 const poly=(k)=>{const runs=[];let cur=null;for(const c of C){const b=c[k];if(!b){cur=null;continue;}if(!cur){cur=[];runs.push(cur);}cur.push([c.x,b[0],b[1]]);}
  return runs.filter(r=>r.length>1).map(r=>r.map(p=>[p[0],p[1]]).concat(r.slice().reverse().map(p=>[p[0],p[2]])));};
 const edge=(f)=>{const runs=[];let cur=null;for(const c of C){const v=f(c);if(v==null){cur=null;continue;}if(!cur){cur=[];runs.push(cur);}cur.push([c.x,v]);}return runs.filter(r=>r.length>1);};
 const crests=[];{let prev=[];for(const c of C){const now2=[];for(const y of c.crests){const p=prev.find(q=>Math.abs(q.y-y)<9);const run=p?p.run:[];run.push([c.x,y]);if(!p)crests.push(run);now2.push({y,run});}prev=now2;}}
 LANDK={north:poly('n'),grass:poly('g'),south:poly('s'),top:edge(c=>c.top),bot:edge(c=>c.bot),
  grassTop:edge(c=>c.g?c.g[0]:null),grassBot:edge(c=>c.g&&!(c.s&&c.s[0]<c.g[1]-1)?c.g[1]:null),southTop:edge(c=>c.g&&c.s&&c.s[0]<c.g[1]-1?c.s[0]:null),
  crests:crests.filter(r=>r.length>=6)};
 /* the whole land silhouette as one closed outline (top edge, then the bottom edge back) */
 LANDK.sil=LANDK.top.map((t,i)=>t.concat(LANDK.bot[i].slice().reverse()));return LANDK;}
/* the Key's land, back to front: the north sand, the grass, the south sand; ink on the silhouette, the grass edge where seen, the crests */
function drawLandKey(outline){const L=landKey(),fillP=(ps,f,st,lw)=>{for(const p of ps)sketch(p,true,p.length,st?1.5:0,f,st||null,lw);};
 const ink=(runs,col,lw)=>{for(const r of runs)sketch(r,false,r.length+3,1.5,null,col,lw);};
 fillP(L.north,'#f3d27a');
 /* the grass with its whole outline; any of it the south dune hides is painted over next */
 fillP(L.grass,'#86c25e',INK,3);
 fillP(L.south,'#f3d27a');ink(L.southTop,INK,3);
 for(const p of L.sil)sketch(p,true,p.length+7,1.5,null,outline,3.5);
 ctx.globalAlpha=.55;ink(L.crests,INK,2.2);ctx.globalAlpha=1;}
/* the ground in front of a world point, in lifted screen-world y: anything of the point drawn below this is hidden */
function horizonAt(x,y){let m=1e9;const ml=maxLift();for(let d=3;d<=ml+6;d+=3){const v=y+d-liftAt(x,y+d);if(v<m)m=v;}return m;}
function occludedBy(x,y){const base=y-liftAt(x,y),h=Math.min(horizonAt(x-8,y),horizonAt(x,y),horizonAt(x+8,y));return h<base-2?h:null;}
/* drawing a thing with occlusion: the part above the ground in front draws normally; with soft=true the hidden part
   shows as a faint ink silhouette with a soft outline, drawn from an offscreen copy */
const OC=document.createElement('canvas'),ocx=OC.getContext('2d'),OC2=document.createElement('canvas'),oc2=OC2.getContext('2d');
function drawOcc(x,y,fn,soft){const L=liftAt(x,y);if(SH.on){if(L){ctx.save();ctx.translate(0,-L);fn();ctx.restore();}else fn();return;}
 const hz=occludedBy(x,y);if(hz===null){if(L){ctx.save();ctx.translate(0,-L);fn();ctx.restore();}else fn();return;}
 /* visible part: clip above the horizon (in the translated space the horizon sits L lower) */
 ctx.save();ctx.translate(0,-L);ctx.beginPath();ctx.rect(x-400,hz+L-2000,800,2000);ctx.clip();fn();ctx.restore();
 if(!soft)return;
 /* hidden part as a soft silhouette: draw the thing offscreen with the same transform, tint it, outline it */
 if(OC.width!==cv.width||OC.height!==cv.height){OC.width=OC2.width=cv.width;OC.height=OC2.height=cv.height;}
 const T=ctx.getTransform(),keep=ctx;ocx.setTransform(1,0,0,1,0,0);ocx.clearRect(0,0,OC.width,OC.height);ocx.setTransform(T);ocx.translate(0,-L);ctx=ocx;try{fn();}finally{ctx=keep;}
 ocx.setTransform(1,0,0,1,0,0);ocx.globalCompositeOperation='source-in';ocx.fillStyle='rgb(42,33,64)';ocx.fillRect(0,0,OC.width,OC.height);ocx.globalCompositeOperation='source-over';
 oc2.setTransform(1,0,0,1,0,0);oc2.clearRect(0,0,OC2.width,OC2.height);const o=2*DPR;for(const [dx,dy] of [[o,0],[-o,0],[0,o],[0,-o]])oc2.drawImage(OC,dx,dy);oc2.globalCompositeOperation='destination-out';oc2.drawImage(OC,0,0);oc2.globalCompositeOperation='source-over';
 const sy=(hz-cam.y)*Z+H/2;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.beginPath();ctx.rect(0,sy*DPR,cv.width,cv.height);ctx.clip();ctx.globalAlpha=.14;ctx.drawImage(OC,0,0);ctx.globalAlpha=.6;ctx.drawImage(OC2,0,0);ctx.restore();}
/* which draw-list things get a soft outline when hidden: you, creatures, people, things to pick up */
function softFn(fn){return fn===drawSwimmer||fn===drawCrab||fn===drawGull||fn===drawGubbins||fn===drawKindle;}
