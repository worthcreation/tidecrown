const INK='#2a2140';
const cv=document.getElementById('c');
let ctx=cv.getContext('2d');
const dk=document.createElement('canvas'),dctx=dk.getContext('2d');
let W=0,H=0,DPR=1,Z=1,ZB=1,camZ=1;
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);dk.width=cv.width;dk.height=cv.height;ZB=Math.max(.85,Math.min(1.4,Math.min(W,H)/430));Z=ZB*camZ;}
addEventListener('resize',resize);resize();
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

