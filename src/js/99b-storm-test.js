/* test build only: storm hooks for headless tests */
if(MODE==='test')Object.assign(window.DK,{gNow,stormAt,nextStorm,lastStorm,monNow,floodK,floodAt,floodGrid,windfalls,wfLying,wfStage,wfBranches,wfSections,gatherWF,buckWF,showerOf,showerK,hKey,stormWalkK,wfBlock,survL,setWXL:v=>{WXL=v},STORMWASH,rollStormWash,grabShore,treeGrow,
 jump:ms=>{DAYOFF+=ms;WFC=null;},skipCC:()=>{if(S.char)return;S.char=randomLook();S.origin=Object.keys(ORIGINS)[0];closeCC();save();begin();},get WFC(){return WFC;},brimbleStormLine});
