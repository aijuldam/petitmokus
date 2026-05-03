import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { dictionary } from '../../lib/i18n';
import type { Language } from '../../lib/i18n';

const ui = dictionary.ui;

interface SuccessOverlayProps {
  show: boolean;
  language: Language;
  subtitle: string;
  onPlayAgain: () => void;
}

// Synthesize a short, friendly applause: 4 quick percussive noise bursts
// shaped by a fast attack/decay envelope, layered with a low thump for body.
// Generated on the fly so we ship no extra audio asset.
function playClapSound(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const claps = 4;
    const interval = 0.13;
    for (let i = 0; i < claps; i++) {
      const t0 = now + i * interval;
      const duration = 0.12;
      const sampleRate = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
      const data = buffer.getChannelData(0);
      for (let s = 0; s < data.length; s++) {
        // White noise with very fast attack + exponential decay = clap pop.
        const env = Math.pow(1 - s / data.length, 4);
        data[s] = (Math.random() * 2 - 1) * env;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      // Bandpass-ish: high-pass to thin the noise, low-pass to soften the sizzle.
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 900;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 4500;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.55, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
      src.connect(hp).connect(lp).connect(gain).connect(ctx.destination);
      src.start(t0);
      src.stop(t0 + duration);
    }
    // Auto-close the context shortly after the last clap to free resources.
    setTimeout(() => {
      void ctx.close().catch(() => undefined);
    }, (claps * interval + 0.4) * 1000);
  } catch {
    // Audio failures are non-fatal — the visual celebration still plays.
  }
}

// Animated clapping hands: two emoji that swing toward each other in time
// with the synthesized claps, with a tiny scale pulse on impact for punch.
function ClappingHands() {
  const swing = (sign: 1 | -1) => ({
    x: [0, sign * 18, 0, sign * 18, 0, sign * 18, 0, sign * 18, 0],
    rotate: [0, sign * -18, 0, sign * -18, 0, sign * -18, 0, sign * -18, 0],
  });
  return (
    <div className="flex items-center justify-center gap-1 mb-4 h-20 select-none">
      <motion.span
        className="text-6xl inline-block"
        style={{ transformOrigin: '70% 50%' }}
        animate={swing(1)}
        transition={{ duration: 1.05, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.2 }}
      >
        👏
      </motion.span>
    </div>
  );
}

export function SuccessOverlay({ show, language, subtitle, onPlayAgain }: SuccessOverlayProps) {
  // Play the clap sound once each time the overlay appears.
  const wasShown = useRef(false);
  useEffect(() => {
    if (show && !wasShown.current) {
      wasShown.current = true;
      playClapSound();
    } else if (!show) {
      wasShown.current = false;
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm px-8"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 24 }}
            className="bg-card border border-card-border rounded-[2rem] p-8 text-center shadow-xl w-full max-w-sm"
          >
            <ClappingHands />
            <h2 className="text-2xl font-bold text-foreground mb-1">{ui.gameBravo[language]}</h2>
            <p className="text-sm text-foreground/45 mb-7">{subtitle}</p>
            <button
              onClick={onPlayAgain}
              className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-7 rounded-full text-sm hover:bg-primary/90 active:scale-95 transition-all"
            >
              <RefreshCw size={15} />
              {ui.gamePlayAgain[language]}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
