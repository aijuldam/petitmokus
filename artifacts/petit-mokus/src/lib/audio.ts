import dogBarkUrl from "@assets/10243_1369416216_1777221073239.mp3";
import catMeowUrl from "@assets/18688_1517423084_1777221307666.mp3";
import horseNeighUrl from "@assets/18697_1517424136_1777221429193.mp3";
import cowMooUrl from "@assets/18691_1517423527_1777221546285.mp3";
import foxCallUrl from "@assets/Fox-calls_1777225514788.wav";
import wolfHowlUrl from "@assets/wolf_1777225717457.mp3";

const MAX_SOUND_DURATION = 5;

const playAudioFile = (url: string) => {
  const audio = new Audio(url);
  audio.play().catch(() => {});
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, MAX_SOUND_DURATION * 1000);
};

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playAnimalSound = (animal: string) => {
  const ctx = initAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  switch (animal) {
    case 'dog':
      playAudioFile(dogBarkUrl);
      return;
    case 'cat':
      playAudioFile(catMeowUrl);
      return;
    case 'horse':
      playAudioFile(horseNeighUrl);
      return;
    case 'cow':
      playAudioFile(cowMooUrl);
      return;
    case 'fox':
      playAudioFile(foxCallUrl);
      return;
    case 'wolf':
      playAudioFile(wolfHowlUrl);
      return;
    case 'squirrel':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2000, now);
      osc.frequency.linearRampToValueAtTime(1800, now + 0.05);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'mouse':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3000, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'sheep':
      osc.type = 'square';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.1);
      osc.frequency.linearRampToValueAtTime(250, now + 0.2);
      osc.frequency.linearRampToValueAtTime(300, now + 0.3);
      osc.frequency.linearRampToValueAtTime(250, now + 0.4);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
  }
};

let currentSongOscillator: OscillatorNode | null = null;
let currentSongGain: GainNode | null = null;
let songTimeout: NodeJS.Timeout | null = null;
let isPlaying = false;

export const playSongLoop = () => {
  if (isPlaying) {
    stopSong();
    return;
  }
  
  const ctx = initAudio();
  isPlaying = true;
  
  const playNote = (freq: number, time: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.3, time + duration * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    
    osc.start(time);
    osc.stop(time + duration);
    
    currentSongOscillator = osc;
    currentSongGain = gain;
  };

  const melody = [
    { f: 261.63, d: 0.5 }, // C4
    { f: 329.63, d: 0.5 }, // E4
    { f: 392.00, d: 0.5 }, // G4
    { f: 329.63, d: 0.5 }, // E4
  ];

  let step = 0;
  
  const loop = () => {
    if (!isPlaying) return;
    const note = melody[step % melody.length];
    playNote(note.f, ctx.currentTime, note.d);
    step++;
    songTimeout = setTimeout(loop, note.d * 1000);
  };
  
  loop();
};

export const stopSong = () => {
  isPlaying = false;
  if (songTimeout) clearTimeout(songTimeout);
  if (currentSongGain && currentSongOscillator) {
    currentSongGain.gain.exponentialRampToValueAtTime(0.01, initAudio().currentTime + 0.1);
    setTimeout(() => {
      try {
        currentSongOscillator?.stop();
      } catch (e) {}
    }, 100);
  }
};
