/* World memory registry (build 42). Pure data, no code and no references to anything else in the game:
   tools/world-graph.js loads this file on its own, writes docs/world-graph.md and fails the build on orphans,
   single-outcome events and dead ends. 33-world-memory.js is the engine that runs it.
   who: everyone who can see, tell, feel or be the subject of a deed.
     kind 'dweller' feels (regard: t trust, f fear, w warmth) and can witness; 'flock' witnesses and talks but has
     no feelings of its own; 'creature' is only ever a deed's subject.
     sees: places where they witness deeds ('key' the Key, 'forest' the dark islands).
     talks: [to, game hours before it passes on, how much certainty survives the telling].
     care: how much a deed done to someone moves this dweller (default .5).
     hear: what they say, the next time you talk, about a deed they learned of: [sure, unsure] by the deed's line group.
   deeds: to whom, the hand, where it can happen, tags for the style picture, fx: regard moves (pulled toward the sign,
     so recent deeds count most and nothing fades with time; Ross, 16 Oct 2026: feelings change only by deeds).
   events: read a dweller's regard; each outcome needs a gift (engine-implemented, listed in GIFTS) and a line.
   style: the player's style picture, axes and the tags that feed them (an axis with no source yet is waiting). */
const WREG={
 who:{
  mortimer:{name:'Mortimer Gull',kind:'dweller',sees:['key'],talks:[['gubbins',1,.85],['gulls',2,.8]],care:{mossbacks:.4},
   hear:{mosskind:['SQUAWK. The flock says you fed a mossback. Generous. Unprofitable, but generous.','The flock says someone was kind to a mossback. Flock can’t count, mind.'],
         mosscruel:['The flock saw you scatter a mossback. Noted. The ledger is open, friend.','Rumour on the wing: somebody’s been rough with the mossbacks. Just rumour. For now.'],
         down:['SQUAWK. The flock says you went under. Your account remains open. Out of respect, mostly.','Rumour on the wing: someone went under. The Gull Post extends its condolences, provisionally.']}},
  gubbins:{name:'Gubbins',kind:'dweller',sees:['key'],talks:[['mortimer',1,.85]],care:{mortimer:.8,mossbacks:.3},
   hear:{mortkind:['Saw you bring Mortimer a golden fish. Golden! He’s been preening all day. Nice of you, though.','Mortimer’s telling everyone someone brought him a fancy fish. Reckon that was you?'],
         mortcruel:['I saw that. Swatting Mortimer off his own post. He’s a banker, friend, not a fly.','Word is somebody knocked Mortimer off his post. Don’t suppose you know anything.'],
         mosskind:['Gulls say you’ve been kind to some mossy thing out east. Soft, you are. I like it.','Gulls are going on about a mossy creature and someone being nice to it. Gulls exaggerate.'],
         mosscruel:['Gulls say you’ve been kicking mossy little things about out east. That true?','Something about you and a mossy creature out east. Gulls tell it worse every time.'],
         down:['Heard you went under. Bucket’s honest opinion? Swim less, fish more.','Gulls say somebody went under out past the reef. Not you, I hope. Who’d sell me fish?']}},
  brimble:{name:'Brimble',kind:'dweller',sees:['key'],talks:[],care:{mortimer:.5,mossbacks:.8},
   hear:{mortkind:['The gulls tell me you fed Mortimer a golden fish. Golden both sides, I hope. Someone listens to me.','A golden fish for that featherbrained banker, the gulls say? If it was you, I approve.'],
         mortcruel:['You chased Mortimer off his post. I’m a flame. I know what it is to be swatted at. Don’t.','The gulls are screaming about someone knocking Mortimer about. Gulls scream about everything. Was it you?'],
         mosskind:['Word from the gulls: you warmed some starving mossy thing. Good. Cold is the worst of it. Ask any fire.','The gulls say somebody’s been kind to the mossy things out east. I hope it was you.'],
         mosscruel:['The gulls saw you scatter those mossy creatures. Hungry, cold, and now kicked. Hm.','Something’s been scaring the mossy creatures out east, the gulls say. Not you, surely.'],
         down:['There you are. You came to at my hearth, grey as ash. Sit. Warm up. Don’t do that again.','The gulls say someone went under out there. I do hope it wasn’t you.']}},
  gulls:{name:'the gulls',kind:'flock',sees:['key','forest'],talks:[['mortimer',1,.7],['brimble',3,.7]]},
  mossbacks:{name:'the Mossbacks',kind:'creature'}
 },
 deeds:{
  mort_gift:{to:'mortimer',hand:'accord',where:['key'],line:'mortkind',tags:['generous'],fx:{t:.2,f:-.1,w:.4},say:'gave Mortimer a golden fish'},
  mort_shoo:{to:'mortimer',hand:'strife',where:['key'],line:'mortcruel',tags:['rough'],fx:{t:-.3,f:.5,w:-.4},say:'shooed Mortimer off his post'},
  moss_feed:{to:'mossbacks',hand:'accord',where:['forest'],line:'mosskind',tags:['generous'],fx:{t:.1,f:-.05,w:.35},say:'fed a Mossback'},
  moss_warm:{to:'mossbacks',hand:'accord',where:['forest'],line:'mosskind',tags:['patient'],fx:{t:.1,w:.3},say:'warmed a shivering Mossback'},
  moss_bind:{to:'mossbacks',hand:'accord',where:['forest'],line:'mosskind',tags:[],fx:{t:.2,w:.4},say:'kept a Mossback'},
  moss_drive:{to:'mossbacks',hand:'strife',where:['forest'],line:'mosscruel',tags:['rough'],fx:{t:-.15,f:.3,w:-.3},say:'drove off a Mossback'},
  /* to 'you' with hand 'none': something that happened to you, seen and talked about, moving no one's regard (yet) */
  went_down:{to:'you',hand:'none',where:['key','forest'],line:'down',tags:['reckless'],fx:{},say:'went under (drowned or collapsed)'}
 },
 /* fear gets you labour and goods; warmth gets you knowledge (the standing principle, agreed 16 Oct 2026) */
 events:{
  gubbins_mood:{who:'gubbins',outcomes:{
   warm:{when:{w:.25},gift:'tip',line:'Between us? They’re biting {dir} of you. Don’t tell the gulls.'},
   afraid:{when:{f:.25},gift:'price',line:'Extra shell in there for each one. No need for... any of that.'}}},
  brimble_mood:{who:'brimble',outcomes:{
   warm:{when:{w:.25},gift:'forecast',line:'Sit, sit. Let a flame read the sky for you.'},
   afraid:{when:{f:.25},gift:'cooks',line:'Fine. Give them here. I’ll do it. Just... stand back.'}}},
  mortimer_mood:{who:'mortimer',outcomes:{
   warm:{when:{w:.25},gift:'news',line:'News from the wing, for a friend of the Post.'},
   afraid:{when:{f:.25},gift:'tithe',line:'Mortimer slides a few shells across the counter without meeting my eye.'}}}
 },
 GIFTS:{tip:'Gubbins says which way the fish are biting (knowledge)',price:'Gubbins pays a shell more per fish (goods)',
  forecast:'Brimble reads the next shower and monsoon for you, a day ahead (knowledge)',cooks:'Brimble cooks your raw fish for you: always plain cooked, no XP (labour)',
  news:'Mortimer tells you how Gubbins and Brimble feel about you (knowledge)',tithe:'Mortimer slides you five shells at the bank, once a day (goods)'},
 style:{
  hand:{ends:['Strife','Accord'],from:'deed hands'},
  roam:{ends:['homebody','roamer'],from:'where deeds happen (the Key or beyond)'},
  pace:{ends:['hasty','patient'],tags:['hasty','patient']},
  care:{ends:['reckless','careful'],tags:['reckless','careful']}
 }
};
