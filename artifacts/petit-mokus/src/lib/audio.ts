import dogBarkUrl    from "@assets/10243_1369416216_1777221073239.mp3";
import catMeowUrl    from "@assets/18688_1517423084_1777221307666.mp3";
import horseNeighUrl from "@assets/18697_1517424136_1777221429193.mp3";
import cowMooUrl     from "@assets/18691_1517423527_1777221546285.mp3";
import foxCallUrl    from "@assets/Fox-calls_1777225514788.mp3";
import wolfHowlUrl   from "@assets/wolf_1777225717457.mp3";
import squirrelUrl   from "@assets/squirrel_1777226634633.mp3";
import pigUrl        from "@assets/schwein_1777226753094.mp3";
import sheepUrl      from "@assets/schafe_1777226874835.mp3";
import roosterUrl    from "@assets/hahn_kikeriki_1777226970579.mp3";

const MAX_SOUND_DURATION = 5;

// ── Shared sound state (animals + vehicles use the same slot) ─────────────────

let currentAudio: HTMLAudioElement | null = null;
let currentTimeout: ReturnType<typeof setTimeout> | null = null;

const stopCurrentSound = () => {
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

const playAudioFile = (url: string) => {
  stopCurrentSound();
  const audio = new Audio(url);
  currentAudio = audio;
  audio.play().catch(() => {});
  currentTimeout = setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
    currentAudio = null;
  }, MAX_SOUND_DURATION * 1000);
};

// ── Animal sounds ─────────────────────────────────────────────────────────────

const animalSounds: Record<string, string> = {
  dog:      dogBarkUrl,
  cat:      catMeowUrl,
  horse:    horseNeighUrl,
  cow:      cowMooUrl,
  fox:      foxCallUrl,
  wolf:     wolfHowlUrl,
  squirrel: squirrelUrl,
  pig:      pigUrl,
  sheep:    sheepUrl,
  rooster:  roosterUrl,
};

export const playAnimalSound = (animal: string) => {
  const url = animalSounds[animal];
  if (url) playAudioFile(url);
};

// ── Vehicle sounds ────────────────────────────────────────────────────────────

const vehicleSounds: Record<string, string> = {
  'fire-truck': '/vehicles/fire-truck.wav',
  ambulance:    '/vehicles/ambulance-sound.wav',
  police:       '/vehicles/police-sound.wav',
  construction: '/vehicles/construction-sound.mp3',
  train:        '/vehicles/train-sound.wav',
  'school-bus': '/vehicles/bus-sound.wav',
  airplane:     '/vehicles/plane-sound.wav',
  helicopter:   '/vehicles/helicopter-sound.wav',
};

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

/** Generates a 5-second rising-falling siren as a WAV Blob URL. */
function generateSirenBlobUrl(): string {
  const sampleRate = 22050;
  const duration = MAX_SOUND_DURATION;
  const numSamples = sampleRate * duration;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV header
  const write = (off: number, val: number, size: number) => {
    if (size === 4) view.setUint32(off, val, true);
    else if (size === 2) view.setUint16(off, val, true);
  };
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  write(4, 36 + numSamples * 2, 4);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  write(16, 16, 4);        // chunk size
  write(20, 1, 2);         // PCM
  write(22, 1, 2);         // mono
  write(24, sampleRate, 4);
  write(28, sampleRate * 2, 4); // byte rate
  write(32, 2, 2);         // block align
  write(34, 16, 2);        // bits per sample
  writeStr(36, 'data');
  write(40, numSamples * 2, 4);

  // PCM samples: sawtooth oscillator with sweeping frequency
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // frequency sweeps 600 → 1000 → 600 Hz with period ~1.2 s
    const freq = 700 + 300 * Math.sin((2 * Math.PI * t) / 1.2);
    // sawtooth wave
    const phase = (t * freq) % 1;
    const sample = (phase * 2 - 1) * 0.35;
    // fade in/out
    const env = t < 0.05 ? t / 0.05 : t > duration - 0.1 ? (duration - t) / 0.1 : 1;
    view.setInt16(44 + i * 2, Math.round(sample * env * 32767), true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

export const playVehicleSound = (vehicle: string) => {
  // Use real audio file if available
  const url = vehicleSounds[vehicle];
  if (url) {
    playAudioFile(url);
    return;
  }

  // Fire truck: synthesized siren as WAV blob → same playAudioFile path as all other sounds
  if (vehicle === 'fire-truck') {
    playAudioFile(generateSirenBlobUrl());
  }
};

// ── Nature sounds ─────────────────────────────────────────────────────────────

const natureSounds: Record<string, string> = {
  waves:          '/Nature/waves2.m4a',
  fire:           '/Nature/fire.m4a',
  thunder:        '/Nature/thunder.m4a',
  tornado:        '/Nature/tornado.m4a',
  waterfall:      '/Nature/waterfall.m4a',
  'summer-night': '/Nature/night-insects.mp3',
};

export const playNatureSound = (id: string) => {
  const url = natureSounds[id];
  if (url) playAudioFile(url);
};

// ── Song / lullaby playback ───────────────────────────────────────────────────

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
      try { currentSongOscillator?.stop(); } catch (e) {}
    }, 100);
  }
};
