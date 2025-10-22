
/* Human Pause script - bilingual */
(function(){
  const pauseBtn = document.getElementById('pauseBtn');
  const timerEl = document.getElementById('timer');
  const quoteEl = document.getElementById('quote');
  const moodPill = document.getElementById('moodPill');
  const soundBtn = document.getElementById('soundBtn');
  const breathBtn = document.getElementById('breathBtn');
  const shareBtn = document.getElementById('shareBtn');
  const shareArea = document.getElementById('shareArea');
  const copyBtn = document.getElementById('copyBtn');
  const shareInput = document.getElementById('shareInput');

  const quotes = [
    "This moment is enough.",
    "You don’t need to rush to be worthy.",
    "Slow mornings build steady minds.",
    "Sip slowly. Breathe slowly. Be here now.",
    "Rest is a creative act.",
    "Peace hides between the pages and the steam.",
    "You are enough, even when you rest.",
    "Take a breath. It's allowed.",
    "The world can wait for 30 seconds.",
    "Silence is also a sound.",
    "Be where your coffee is.",
    "A short pause can change your day."
  ];

  let audioCtx = null;
  let noiseNode = null;
  let currentSound = null; // will be set randomly per pause

  function createNoise(type){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2;
    const bufferSize = 2 * audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++){
      data[i] = (Math.random()*2-1) * 0.12;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = (type==='rain')? 1600 : (type==='coffee'? 900 : 1200);
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.0;
    source.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    source.start();
    return {source, noiseGain, filter};
  }

  function startSound(type){
    if(type==='silence') return;
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(!noiseNode){
      noiseNode = createNoise(type);
      noiseNode.noiseGain.gain.cancelScheduledValues(audioCtx.currentTime);
      noiseNode.noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
      noiseNode.noiseGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.4);
    }
  }
  function stopSound(){
    if(noiseNode){
      try{
        noiseNode.noiseGain.gain.cancelScheduledValues(audioCtx.currentTime);
        noiseNode.noiseGain.gain.setValueAtTime(noiseNode.noiseGain.gain.value, audioCtx.currentTime);
        noiseNode.noiseGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
        setTimeout(()=>{ try{ noiseNode.source.stop(); }catch(e){} noiseNode=null; }, 600);
      }catch(e){ noiseNode=null; }
    }
  }

  function pickRandomSound(){
    const types = ['rain','coffee','silence'];
    return types[Math.floor(Math.random()*types.length)];
  }

  function cycleSoundLabel(type){
    soundBtn.textContent = 'Sound / Zvuk: ' + (type==='rain'?'Rain / Kiša':(type==='coffee'?'Coffee / Kafić':'Off / Isključeno'));
  }

  function startBreathingGuide(){
    if(!('speechSynthesis' in window)) return alert('Breathing guide not supported in this browser.');
    const utterances = [
      {text:'Breathe in slowly.', delay:0},
      {text:'Hold.', delay:4000},
      {text:'Breathe out slowly.', delay:6000},
      {text:'Breathe in.', delay:10000},
      {text:'Hold.', delay:14000},
      {text:'Breathe out.', delay:16000},
      {text:'Breathe in.', delay:20000},
      {text:'Hold.', delay:24000},
      {text:'Breathe out slowly.', delay:26000}
    ];
    window.speechSynthesis.cancel();
    utterances.forEach((u)=>{ const s = new SpeechSynthesisUtterance(u.text); s.rate=0.95; s.pitch=0.9; s.lang='en-US'; setTimeout(()=>{ window.speechSynthesis.speak(s); }, u.delay); });
  }

  let countdown = null;

  function beginPause(){
    pauseBtn.disabled = true;
    moodPill.classList.add('hidden');
    timerEl.classList.remove('hidden');
    let seconds = 30;
    timerEl.textContent = seconds;
    quoteEl.textContent = quotes[Math.floor(Math.random()*quotes.length)];
    currentSound = pickRandomSound();
    cycleSoundLabel(currentSound);
    if(currentSound!=='silence') startSound(currentSound);
    countdown = setInterval(()=>{
      seconds--;
      timerEl.textContent = seconds;
      if(seconds<=0){
        clearInterval(countdown);
        timerEl.classList.add('hidden');
        moodPill.classList.remove('hidden');
        pauseBtn.disabled = false;
        stopSound();
        if(window.speechSynthesis) window.speechSynthesis.cancel();
      }
    },1000);
  }

  pauseBtn.addEventListener('click', ()=>{
    if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    beginPause();
  });

  soundBtn.addEventListener('click', ()=>{
    if(!currentSound) currentSound = pickRandomSound();
    if(currentSound==='silence') currentSound = 'rain';
    else if(currentSound==='rain') currentSound = 'coffee';
    else currentSound = 'silence';
    cycleSoundLabel(currentSound);
    stopSound();
    if(currentSound!=='silence') startSound(currentSound);
  });

  breathBtn.addEventListener('click', ()=> startBreathingGuide());

  shareBtn.addEventListener('click', async ()=>{
    const shareText = "Take a 30s Human Pause / Napravi 30s pauzu: a moment of calm.";
    if(navigator.share){
      try{ await navigator.share({title:'Human Pause', text:shareText, url:location.href}); }catch(e){} 
    } else {
      shareArea.classList.toggle('hidden');
      shareInput.value = location.href;
    }
  });

  copyBtn.addEventListener('click', ()=>{
    shareInput.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied! / Kopirano!';
    setTimeout(()=>copyBtn.textContent='Copy link / Kopiraj link',1200);
  });

  document.addEventListener('keydown',(e)=>{ if(e.code==='Space'){ e.preventDefault(); if(!pauseBtn.disabled) beginPause(); } });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    document.querySelectorAll('[style*="animation"]').forEach(el=>el.style.animation='none');
  }

  cycleSoundLabel('rain');
})();
