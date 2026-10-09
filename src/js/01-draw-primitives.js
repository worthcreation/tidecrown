/* ---------- hand-drawn primitives ---------- */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let now=0,boil=0;
function sketch(pts,closed,seed,amp,fill,stroke,lw){
  const r=mulberry(seed*9973+boil*7919+1);
  const q=pts.map(p=>[p[0]+(r()-.5)*amp,p[1]+(r()-.5)*amp]);
  const n=q.length;ctx.beginPath();
  if(closed){let a=q[n-1],b=q[0];ctx.moveTo((a[0]+b[0])/2,(a[1]+b[1])/2);
    for(let i=0;i<n;i++){a=q[i];b=q[(i+1)%n];ctx.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}ctx.closePath();}
  else{ctx.moveTo(q[0][0],q[0][1]);for(let i=1;i<n-1;i++){const a=q[i],b=q[i+1];ctx.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}ctx.lineTo(q[n-1][0],q[n-1][1]);}
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||3;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();}
}
function ell(x,y,rx,ry,n){const a=[];n=n||14;for(let i=0;i<n;i++){const t=i/n*6.2832;a.push([x+Math.cos(t)*rx,y+Math.sin(t)*ry]);}return a;}
function blob(x,y,rx,ry,seed,fill,lw,amp){sketch(ell(x,y,rx,ry,Math.max(8,Math.round((rx+ry)/3))),true,seed,amp==null?Math.min(3,(rx+ry)*.08):amp,fill,lw===0?null:INK,lw==null?3:lw);}
function ln(pts,seed,lw,col,amp){const o=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];o.push(a,[a[0]+(b[0]-a[0])/3,a[1]+(b[1]-a[1])/3],[a[0]+(b[0]-a[0])*2/3,a[1]+(b[1]-a[1])*2/3]);}o.push(pts[pts.length-1]);sketch(o,false,seed,amp==null?1.6:amp,null,col||INK,lw||3);}
function rrPts(x,y,w,h,r){const p=[];const c=[[x+w-r,y+r,-Math.PI/2],[x+w-r,y+h-r,0],[x+r,y+h-r,Math.PI/2],[x+r,y+r,Math.PI]];for(const [cx,cy,a0] of c){for(let i=0;i<=2;i++){const a=a0+i/2*Math.PI/2;p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}}return p;}
function dot(x,y,r,col){ctx.fillStyle=col||INK;ctx.beginPath();ctx.arc(x,y,r,0,6.3);ctx.fill();}
function otext(t,x,y,size,fill,stroke){ctx.font=size+"px 'Patrick Hand','Comic Sans MS',cursive";ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=Math.max(3,size/5);ctx.strokeStyle=stroke||INK;ctx.strokeText(t,x,y);ctx.fillStyle=fill||'#fff';ctx.fillText(t,x,y);}
function star(x,y,r,col){ctx.beginPath();for(let i=0;i<10;i++){const a=i/10*6.2832-Math.PI/2,rr=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}ctx.closePath();ctx.fillStyle=col;ctx.fill();}
function wrap(t,maxW){const words=t.split(' ');const lines=[];let cur='';for(const w of words){const tst=cur?cur+' '+w:w;if(ctx.measureText(tst).width>maxW&&cur){lines.push(cur);cur=w;}else cur=tst;}if(cur)lines.push(cur);return lines;}

