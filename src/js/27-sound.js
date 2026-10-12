/* sound: everything synthesised in code, no assets. A lofi loop that follows the place and the hour (warm chords, a soft swung beat by day, hats only at night, a slow minor drone in the Shadow Forest), the sea breathing under it, vinyl dust, and small sounds for what you do. The first tap starts it. The note bottom-left mutes. Haptics live here too: hap(pattern). */
let AC=null;const SND={on:!S.st.mute,step:0,next:0,scene:'',timer:null,creak:8,fly:1};
const NOTE=n=>440*Math.pow(2,(n-69)/12);
function hap(p){if(navigator.vibrate)try{navigator.vibrate(p);}catch(e){}}
function sndInit(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
 const g=(v,to)=>{const x=AC.createGain();x.gain.value=v;x.connect(to);return x;};
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(AC.destination);
 SND.master=g(SND.on?1:0,comp);SND.mus=g(.3,SND.master);SND.sfx=g(.55,SND.master);SND.amb=g(.5,SND.master);
 /* a dusty echo for chords and chimes */
 SND.dl=AC.createDelay(2);SND.dl.delayTime.value=.33;const fb=g(.34,SND.dl),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1500;SND.dl.connect(lp);lp.connect(fb);lp.connect(g(.6,SND.mus));SND.send=g(1,SND.dl);
 /* noise once, reused */
 const n=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=n.getChannelData(0);let b0=0,b1=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;b0=.96*b0+w*.03;b1=.6*b1+w*.2;d[i]=w*.5+b0*6+b1;}SND.noise=n;
 const loop=(f,gn,to)=>{const s=AC.createBufferSource();s.buffer=n;s.loop=true;const x=AC.createGain();x.gain.value=gn;s.connect(f);f.connect(x);x.connect(to);s.start();return x;};
 const sea=AC.createBiquadFilter();sea.type='lowpass';sea.frequency.value=500;SND.seaF=sea;SND.seaG=loop(sea,.1,SND.amb);
 const wind=AC.createBiquadFilter();wind.type='bandpass';wind.frequency.value=380;wind.Q.value=.6;SND.windF=wind;SND.windG=loop(wind,0,SND.amb);
 const dust=AC.createBiquadFilter();dust.type='highpass';dust.frequency.value=4000;SND.dustG=loop(dust,.012,SND.amb);
 SND.timer=setInterval(sndSched,90);document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else if(SND.on)AC.resume();});}
function sndToggle(){SND.on=!SND.on;S.st.mute=SND.on?0:1;save();sndUI();if(!AC){if(SND.on)sndInit();return;}if(SND.on){AC.resume();SND.master.gain.setTargetAtTime(1,AC.currentTime,.1);}else SND.master.gain.setTargetAtTime(0,AC.currentTime,.1);}
function sndUI(){const b=$('snd');if(b)b.classList.toggle('off',!SND.on);}
/* voices */
function env(gn,t,a,dur,peak){gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(peak,t+a);gn.gain.exponentialRampToValueAtTime(.0008,t+a+dur);}
function tone(f,type,dur,peak,o){o=o||{};const t=o.at||AC.currentTime,s=AC.createOscillator(),gn=AC.createGain();s.type=type;s.frequency.setValueAtTime(f,t);if(o.to)s.frequency.exponentialRampToValueAtTime(o.to,t+dur*(o.slide||.6));
 let out=gn;if(o.lp){const F=AC.createBiquadFilter();F.type='lowpass';F.frequency.value=o.lp;s.connect(F);F.connect(gn);}else s.connect(gn);
 env(gn,t,o.a||.008,dur,peak);gn.connect(o.to_||SND.sfx);if(o.send){const sg=AC.createGain();sg.gain.value=o.send;gn.connect(sg);sg.connect(SND.send);}s.start(t);s.stop(t+(o.a||.008)+dur+.05);return gn;}
function noise(dur,peak,o){o=o||{};const t=o.at||AC.currentTime,s=AC.createBufferSource();s.buffer=SND.noise;s.loop=true;s.playbackRate.value=o.rate||1;const gn=AC.createGain();let last=s;
 if(o.hp){const F=AC.createBiquadFilter();F.type='highpass';F.frequency.value=o.hp;last.connect(F);last=F;}if(o.lp){const F=AC.createBiquadFilter();F.type='lowpass';F.frequency.value=o.lp;last.connect(F);last=F;}if(o.bp){const F=AC.createBiquadFilter();F.type='bandpass';F.frequency.setValueAtTime(o.bp,t);if(o.bpTo)F.frequency.exponentialRampToValueAtTime(o.bpTo,t+dur);F.Q.value=o.q||1;last.connect(F);last=F;}
 last.connect(gn);env(gn,t,o.a||.005,dur,peak);gn.connect(o.to_||SND.sfx);s.start(t);s.stop(t+(o.a||.005)+dur+.05);}
function rhodes(n,at,peak,dur){const f=NOTE(n);tone(f,'sine',dur||1.6,peak,{at,a:.012,send:.3,to_:SND.mus});tone(f,'triangle',(dur||1.6)*.7,peak*.35,{at,a:.012,lp:1300,to_:SND.mus});tone(f*2,'sine',.25,peak*.18,{at,a:.004,to_:SND.mus});}
function pad(n,at,peak){const f=NOTE(n);tone(f,'sine',4,peak,{at,a:1.2,to_:SND.mus,send:.25});tone(f*1.003,'triangle',3.5,peak*.3,{at,a:1.4,lp:600,to_:SND.mus});}
function kick(at,v){tone(150,'sine',.26,v,{at,to:42,slide:.4,to_:SND.mus});}
function snare(at,v){noise(.14,v,{at,bp:1900,q:.7,to_:SND.mus});tone(190,'triangle',.07,v*.5,{at,to_:SND.mus});}
function hat(at,v){noise(.035,v,{at,hp:7500,to_:SND.mus});}
/* the loop */
const CHORDS={day:[[53,57,60,64],[57,60,64,67],[50,53,57,60],[46,50,53,57]],night:[[57,60,64,67],[53,57,60,64],[50,53,57,60],[52,55,59,62]],shadow:[[50,53,57,64],[46,50,53,57],[43,46,50,53],[45,50,52,57]]};
const SCALE={day:[65,67,69,72,74,77,79,81],night:[64,67,69,72,76,79],shadow:[62,65,69,70,74,77]};
function sndScene(){return farness()>.8?'shadow':dark>.3?'night':'day';}
function sndSched(){if(!AC||!SND.on||AC.state!=='running')return;const sc=sndScene();if(sc!==SND.scene){SND.scene=sc;SND.step=Math.floor(SND.step/32)*32;}
 const bpm=sc==='shadow'?58:sc==='night'?66:74,spb=60/bpm,st8=spb/2;
 const now_=AC.currentTime;if(SND.next<now_)SND.next=now_+.05;
 while(SND.next<now_+.35){const s=SND.step,t=SND.next+(s%2?st8*.12:0),bar=s%8,ch=CHORDS[sc][Math.floor(s/16)%4];
  if(bar===0&&(s%16===0||sc!=='shadow'&&Math.random()<.5)){if(sc==='shadow')ch.forEach((n,i)=>pad(n,t+i*.05,.09));else ch.forEach((n,i)=>rhodes(n,t+i*.018,s%16===0?.13:.07,s%16===0?1.9:1.1));}
  if(bar===5&&sc==='day'&&Math.random()<.6)ch.slice(1).forEach((n,i)=>rhodes(n,t+i*.014,.06,.7));
  if(sc==='day'){if(bar===0||bar===5&&Math.random()<.7)kick(t,bar===0?.5:.3);if(bar===2||bar===6)snare(t,.11);hat(t,bar%2?.045:.08);}
  else if(sc==='night'){if(bar%2===0)hat(t,.03);if(bar===0&&Math.random()<.4)kick(t,.22);}
  const mp=sc==='shadow'?.07:sc==='night'?.16:.2;if(s%2===1&&Math.random()<mp){const m=SCALE[sc],n=m[Math.floor(Math.random()*m.length)];tone(NOTE(n),'sine',sc==='shadow'?1.2:.7,sc==='shadow'?.05:.08,{at:t,a:.02,send:.5,to_:SND.mus});}
  SND.step++;SND.next+=st8;}
 /* the sea breathes; the forest has wind and creaks; the clearings have fireflies */
 const T=Date.now()/1000,sw=.5+.5*Math.sin(T*.55)*.7+.3*Math.sin(T*.23);const near=SH.on?0:Math.max(0,1-Math.hypot(P.x,P.y)/900*.5);
 SND.seaF.frequency.setTargetAtTime(SH.on?250:260+sw*520,AC.currentTime,.3);SND.seaG.gain.setTargetAtTime(SH.on?.03:(.05+sw*.08)*(1+near*.3)+(SW.on?.06:0),AC.currentTime,.4);
 const wg=SH.on?.035+.03*Math.sin(T*.31):0;SND.windG.gain.setTargetAtTime(wg,AC.currentTime,.6);SND.windF.frequency.setTargetAtTime(300+120*Math.sin(T*.17),AC.currentTime,.6);
 SND.dustG.gain.setTargetAtTime(sc==='shadow'?.006:.012,AC.currentTime,1);if(Math.random()<.04)noise(.006,.05,{hp:2500,to_:SND.amb});
 if(SH.on){SND.creak-=.09;if(SND.creak<=0){SND.creak=10+Math.random()*22;sfx('creak',.5);}const I=onIsle(P.x,P.y);if(I&&I.kind==='clearing'){SND.fly-=.09;if(SND.fly<=0){SND.fly=.6+Math.random()*2;tone(NOTE(84+[0,2,4,7,9][Math.floor(Math.random()*5)]),'sine',.5,.05,{a:.01,send:.6,to_:SND.mus});}}}}
/* the small sounds */
function sfx(k,v){if(!AC||!SND.on||AC.state!=='running')return;v=v==null?1:v;const t=AC.currentTime;
 switch(k){
 case 'bite':tone(660,'triangle',.11,.3*v);tone(880,'triangle',.14,.25*v,{at:t+.08});break;
 case 'hook':noise(.2,.3*v,{lp:900});tone(300,'sine',.12,.25*v,{to:120});break;
 case 'hookGood':noise(.2,.3*v,{lp:900});[76,83].forEach((n,i)=>tone(NOTE(n),'sine',.4,.14*v,{at:t+.05+i*.07,send:.5}));break;
 case 'miss':tone(170,'triangle',.28,.22*v,{to:80,lp:900});break;
 case 'chop':noise(.06,.35*v,{lp:1400});tone(170,'sine',.09,.45*v,{to:70});break;
 case 'chopGood':noise(.06,.35*v,{lp:1400});tone(170,'sine',.09,.45*v,{to:70});tone(523,'sine',.14,.14*v,{at:t+.01,send:.3});break;
 case 'chopMiss':tone(110,'triangle',.13,.3*v,{to:70,lp:500});break;
 case 'burst':[72,76,79,84,88].forEach((n,i)=>tone(NOTE(n),'sine',.5,.16*v,{at:t+i*.065,send:.6}));hap([18,30,42]);break;
 case 'level':[60,64,67,72,76,79].forEach((n,i)=>{tone(NOTE(n),'sine',.7,.18*v,{at:t+i*.09,send:.6});tone(NOTE(n),'triangle',.4,.06*v,{at:t+i*.09,lp:1200});});hap([30,40,60,40,90]);break;
 case 'journal':[79,84].forEach((n,i)=>tone(NOTE(n),'sine',.45,.1*v,{at:t+i*.1,send:.5}));break;
 case 'skill':[67,71,74,79,83].forEach((n,i)=>tone(NOTE(n),'sine',.8,.15*v,{at:t+i*.08,send:.6}));hap([20,40,20,40,80]);break;
 case 'slap':noise(.07,.45*v,{hp:1800});tone(900,'sine',.06,.2*v,{to:280});hap(8);break;
 case 'trip':noise(.13,.4*v,{lp:800});tone(140,'sine',.14,.4*v,{to:55});hap([10,20,18]);break;
 case 'wrap':noise(.4,.22*v,{bp:1100,bpTo:350,q:1.4,a:.08});hap(14);break;
 case 'bind':noise(.3,.22*v,{bp:1100,bpTo:350,q:1.4,a:.06});noise(.35,.22*v,{at:t+.16,bp:900,bpTo:300,q:1.4,a:.06});tone(NOTE(74),'sine',.5,.08*v,{at:t+.3,send:.5});hap([14,40,22]);break;
 case 'ring':tone(880,'sine',1.4,.3*v,{send:.5});tone(1770,'sine',.9,.1*v);tone(2640,'sine',.4,.05*v);noise(.03,.2*v,{hp:2000});hap([20,20,40]);break;
 case 'hew':noise(.08,.4*v,{bp:1600,bpTo:400,q:1.2});tone(190,'sine',.1,.4*v,{to:70});hap(12);break;
 case 'sweep':noise(.2,.35*v,{bp:900,bpTo:250,q:1});tone(130,'sine',.14,.35*v,{to:55});hap([10,20,14]);break;
 case 'swirl':noise(.5,.4*v,{bp:1400,bpTo:300,q:1.2,a:.04});[0,.12,.24,.36].forEach(d=>noise(.07,.3*v,{at:t+d,hp:1500}));tone(110,'sine',.5,.4*v,{to:45});hap([20,20,20,20,20,20,60]);break;
 case 'thud':tone(120,'sine',.16,.4*v,{to:60});noise(.04,.25*v,{lp:1200});hap(10);break;
 case 'squeak':tone(900,'sine',.13,.2*v,{to:1500,slide:.5});hap(6);break;
 case 'creak':{const s=AC.createOscillator(),gn=AC.createGain(),F=AC.createBiquadFilter();s.type='sawtooth';s.frequency.setValueAtTime(95,t);s.frequency.linearRampToValueAtTime(55,t+.6);F.type='lowpass';F.frequency.value=380;const tr=AC.createOscillator(),tg=AC.createGain();tr.frequency.value=23;tg.gain.value=.05;tr.connect(tg);tg.connect(gn.gain);s.connect(F);F.connect(gn);env(gn,t,.08,.6,.12*v);gn.connect(SND.sfx);s.start(t);tr.start(t);s.stop(t+.8);tr.stop(t+.8);}break;
 case 'lunge':noise(.28,.5*v,{lp:500});tone(90,'sine',.32,.55*v,{to:38});hap([60,30,40]);break;
 case 'planted':[62,66,69,74,81].forEach((n,i)=>tone(NOTE(n),'sine',1.6,.12*v,{at:t+i*.12,a:.05,send:.7}));hap([20,60,20,60,20,120]);break;
 case 'stroke':noise(.16,.28*v,{lp:1100});break;
 case 'strokeGood':noise(.16,.28*v,{lp:1100});tone(523,'sine',.12,.08*v,{send:.4});break;
 case 'zap':tone(1400,'sawtooth',.16,.18*v,{to:300,lp:2200});noise(.05,.2*v,{hp:3000});hap([40,30,40]);break;
 case 'stoke':for(let i=0;i<6;i++)noise(.012,.18*v,{at:t+Math.random()*.4,bp:2600,q:2});noise(.4,.12*v,{bp:1200,q:.8,a:.05});break;
 case 'flip':noise(.26,.25*v,{hp:3200});break;
 case 'plate':noise(.1,.18*v,{hp:2800});tone(NOTE(84),'sine',.25,.08*v,{send:.3});break;
 case 'grab':tone(500,'sine',.09,.2*v,{to:760,slide:.9});hap(8);break;
 case 'scrape':noise(.2,.25*v,{hp:2500});break;
 case 'shells':[0,.07].forEach(d=>tone(1400,'sine',.07,.12*v,{at:t+d}));break;
 case 'eat':[0,.14].forEach(d=>noise(.07,.3*v,{at:t+d,lp:600}));break;
 case 'splash':noise(.3,.3*v,{lp:1400,a:.01});break;
 case 'whoosh':noise(.5,.25*v,{bp:700,bpTo:180,q:.8,a:.06});break;
 case 'open':noise(.05,.12*v,{hp:1500});break;
 case 'talk':tone(NOTE(74),'triangle',.07,.08*v);tone(NOTE(76),'triangle',.07,.08*v,{at:t+.07});break;}}
