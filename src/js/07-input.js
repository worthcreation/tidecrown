/* ---------- input ---------- */
let pd=null;
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;
 const cur={x:e.clientX,y:e.clientY,id:e.pointerId,moved:false,lp:false,edge:e.clientX>W-30?'r':(e.clientX<30?'l':null)};pd=cur;
 cur.timer=setTimeout(()=>{if(pd===cur&&!cur.moved){cur.lp=true;longPress(cur.x,cur.y);}},430);});
cv.addEventListener('pointermove',e=>{if(!pd||e.pointerId!==pd.id)return;const dx=e.clientX-pd.x,dy=e.clientY-pd.y;
 if(Math.hypot(dx,dy)>14){pd.moved=true;clearTimeout(pd.timer);}
 if(pd.edge==='r'&&dx<-45){clearTimeout(pd.timer);pd=null;openPanel('pack');}else if(pd&&pd.edge==='l'&&dx>45){clearTimeout(pd.timer);pd=null;openPanel('journal');}});
cv.addEventListener('pointerup',e=>{if(!pd||e.pointerId!==pd.id)return;clearTimeout(pd.timer);const p=pd;pd=null;if(!p.moved&&!p.lp)tap(p.x,p.y);});
cv.addEventListener('pointercancel',()=>{if(pd){clearTimeout(pd.timer);pd=null;}});
cv.addEventListener('contextmenu',e=>{e.preventDefault();if(pd){clearTimeout(pd.timer);pd=null;}longPress(e.clientX,e.clientY);});
dlg.addEventListener('click',e=>{if(e.target===dlg||e.target.classList.contains('say')){if(dlg.querySelectorAll('.opt').length===1)closeDlg();}});

