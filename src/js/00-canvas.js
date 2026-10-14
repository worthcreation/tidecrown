const INK='#2a2140';
const cv=document.getElementById('c');
let ctx=cv.getContext('2d');
const dk=document.createElement('canvas'),dctx=dk.getContext('2d');
let W=0,H=0,DPR=1,Z=1,ZB=1,camZ=1;
/* render resolution (build 37): at most 1.5 pixels per CSS pixel, and it steps down by .25 (to 1) when frames run
   slow for a while and back up when they run fast; the hand-drawn look hides it, and filling pixels is most of the
   cost. The night layer (dk) is drawn at half that: its edges are all soft gradients. */
const DPRCAP=Math.min(1.5,window.devicePixelRatio||1);let DPRQ=DPRCAP;const DKS=.5;
function resize(){DPR=DPRQ;W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);dk.width=Math.round(cv.width*DKS);dk.height=Math.round(cv.height*DKS);ZB=Math.max(.85,Math.min(1.4,Math.min(W,H)/430));Z=ZB*camZ;}
addEventListener('resize',resize);resize();
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;


/* frame-time watch: an average of the last frames; slow for 2 s drops the resolution a step, fast for 6 s raises it */
const PERF={ema:16,slow:0,fast:0,hist:new Float32Array(240),hi:0};
function perfTick(dt){const ms=dt*1000;PERF.hist[PERF.hi++%240]=ms;if(intro!=null||ccOn)return;PERF.ema+=(ms-PERF.ema)*.05;
 if(PERF.ema>26){PERF.slow+=dt;PERF.fast=0;}else if(PERF.ema<13){PERF.fast+=dt;PERF.slow=0;}else{PERF.slow=0;PERF.fast=0;}
 if(PERF.slow>2&&DPRQ>1){DPRQ=Math.max(1,DPRQ-.25);PERF.slow=0;PERF.ema=18;resize();}
 else if(PERF.fast>6&&DPRQ<DPRCAP){DPRQ=Math.min(DPRCAP,DPRQ+.25);PERF.fast=0;PERF.ema=16;resize();}}
