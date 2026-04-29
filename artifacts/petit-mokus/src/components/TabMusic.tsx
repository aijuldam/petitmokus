import { useState, useEffect } from "react";
import { Language, dictionary } from "../lib/i18n";
import { playSongLoop, stopSong } from "../lib/audio";
import { Play, Square, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TabMusicProps {
  language: Language;
}

const PIROUETTE_ID = 'fr1';
const FRERE_JACQUES_ID = 'fr4';
const AU_CLAIR_ID = 'fr5';

const PIROUETTE_LYRICS = `Il était un petit homme
Pirouette cacahuète
Il était un petit homme
Qui avait une drôle de maison
Qui avait une drôle de maison

Sa maison est en carton
Pirouette cacahuète
Sa maison est en carton
Les escaliers sont en papier
Les escaliers sont en papier

Si vous voulez y monter
Pirouette cacahuète
Si vous voulez y monter
Vous vous casserez le bout du nez
Vous vous casserez le bout du nez

Le facteur y est monté
Pirouette cacahuète
Le facteur y est monté
Il s'est cassé le bout du nez
Il s'est cassé le bout du nez

On lui a raccommodé
Pirouette cacahuète
On lui a raccommodé
Avec du joli fil doré
Avec du joli fil doré

Le beau fil s'est cassé
Pirouette cacahuète
Le beau fil s'est cassé
Le bout du nez s'est envolé
Le bout du nez s'est envolé

Un avion à réaction
Pirouette cacahuète
Un avion à réaction
A rattrapé le bout du nez
A rattrapé le bout du nez

Mon histoire est terminée
Pirouette cacahuète
Mon histoire est terminée
Mesdames, Messieurs, applaudissez!
Mesdames, Messieurs, applaudissez!`;

const FRERE_JACQUES_FR = `Frère Jacques, Frère Jacques,
Dormez-vous? Dormez-vous?
Sonnez les matines! Sonnez les matines!
Ding, dang, dong. Ding, dang, dong.`;

const FRERE_JACQUES_EN = `Are you sleeping, are you sleeping,
Brother John? Brother John?
Morning bells are ringing! Morning bells are ringing!
Ding, dang, dong. Ding, dang, dong.`;

const AU_CLAIR_LYRICS = `Au clair de la lune,
Mon ami Pierrot,
Prête-moi ta plume
Pour écrire un mot.
Ma chandelle est morte,
Je n'ai plus de feu.
Ouvre-moi ta porte
Pour l'amour de Dieu.

Au clair de la lune,
Pierrot répondit :
"Je n'ai pas de plume,
Je suis dans mon lit.
Va chez la voisine,
Je crois qu'elle y est,
Car dans sa cuisine
On bat le briquet."

Au clair de la lune,
L'aimable Lubin;
Frappe chez la brune,
Elle répond soudain :
–Qui frappe de la sorte ?
Il dit à son tour :
–Ouvrez votre porte,
Pour le Dieu d'Amour.

Au clair de la lune,
On n'y voit qu'un peu.
On chercha la plume,
On chercha du feu.
En cherchant d'la sorte,
Je n'sais c'qu'on trouva ;
Mais je sais qu'la porte
Sur eux se ferma.`;

const songs = [
  { id: 'fr1', title: dictionary.songs.fr1, emoji: '🎠', lang: 'FR' },
  { id: 'fr4', title: dictionary.songs.fr4, emoji: '🔔', lang: 'FR' },
  { id: 'fr5', title: dictionary.songs.fr5, emoji: '🌙', lang: 'FR' },
  { id: 'fr2', title: dictionary.songs.fr2, emoji: '🍎', lang: 'FR' },
  { id: 'fr3', title: dictionary.songs.fr3, emoji: '🌲', lang: 'FR' },
  { id: 'hu1', title: dictionary.songs.hu1, emoji: '🌙', lang: 'HU' },
  { id: 'hu2', title: dictionary.songs.hu2, emoji: '🌸', lang: 'HU' },
  { id: 'en1', title: dictionary.songs.en1, emoji: '⭐', lang: 'EN' },
  { id: 'en2', title: dictionary.songs.en2, emoji: '🌛', lang: 'EN' },
];

const lyricsVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
};

export function TabMusic({ language }: TabMusicProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [pirouetteLyricsOpen, setPirouetteLyricsOpen] = useState(false);
  const [fjLyricsLang, setFjLyricsLang] = useState<'FR' | 'EN' | null>('FR');
  const [auClairLyricsOpen, setAuClairLyricsOpen] = useState(false);

  useEffect(() => {
    return () => { stopSong(); };
  }, []);

  const handlePlay = (id: string) => {
    if (id === PIROUETTE_ID || id === FRERE_JACQUES_ID) return;
    if (playingId === id) {
      stopSong();
      setPlayingId(null);
    } else {
      playSongLoop();
      setPlayingId(id);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 pb-32 max-w-md mx-auto">
      {songs.map((song) => {

        /* ── Pirouette ── */
        if (song.id === PIROUETTE_ID) {
          return (
            <motion.div
              key={song.id}
              className="bg-card rounded-[1.25rem] shadow-sm border border-card-border overflow-hidden"
            >
              <div className="flex items-center p-4">
                <div className="w-14 h-14 bg-muted rounded-[1rem] flex items-center justify-center text-3xl shrink-0 mr-4">
                  {song.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-lg leading-tight">{song.title}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-bold">
                    {song.lang}
                  </span>
                </div>
              </div>

              <div className="px-4 pb-3">
                <audio controls src="/pirouette-cacahuete.mp3" className="w-full h-10" style={{ accentColor: 'var(--primary)' }} />
              </div>

              <div className="px-4 pb-4">
                <button
                  aria-expanded={pirouetteLyricsOpen}
                  aria-controls="pirouette-lyrics"
                  onClick={() => setPirouetteLyricsOpen(o => !o)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <ChevronDown size={16} style={{ transform: pirouetteLyricsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }} />
                  {pirouetteLyricsOpen ? 'Masquer les paroles' : 'Voir les paroles'}
                </button>
                <AnimatePresence initial={false}>
                  {pirouetteLyricsOpen && (
                    <motion.div
                      id="pirouette-lyrics"
                      key="lyrics"
                      variants={lyricsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <pre className="mt-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">
                        {PIROUETTE_LYRICS}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        }

        /* ── Frère Jacques ── */
        if (song.id === FRERE_JACQUES_ID) {
          return (
            <motion.div
              key={song.id}
              className="bg-card rounded-[1.25rem] shadow-sm border border-card-border overflow-hidden"
            >
              <div className="flex items-center p-4 pb-2">
                <div className="w-14 h-14 bg-muted rounded-[1rem] flex items-center justify-center text-3xl shrink-0 mr-4">
                  {song.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-lg leading-tight">{song.title}</h3>
                  <p className="text-xs text-foreground/50 mt-0.5">Comptine d'origine française</p>
                  <p className="text-xs text-foreground/40 italic">Version anglaise : <span className="font-semibold not-italic">Brother John</span></p>
                </div>
              </div>

              <div className="px-4 pb-3">
                <audio controls src="/frere-jacques.mp3" className="w-full h-10" style={{ accentColor: 'var(--primary)' }} />
              </div>

              {/* Language tab buttons */}
              <div className="px-4 pb-1 flex gap-2">
                <button
                  aria-expanded={fjLyricsLang === 'FR'}
                  aria-controls="fj-lyrics-fr"
                  onClick={() => setFjLyricsLang(fjLyricsLang === 'FR' ? null : 'FR')}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    fjLyricsLang === 'FR'
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground/60 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <ChevronDown size={12} style={{ transform: fjLyricsLang === 'FR' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }} />
                  Paroles françaises
                </button>
                <button
                  aria-expanded={fjLyricsLang === 'EN'}
                  aria-controls="fj-lyrics-en"
                  onClick={() => setFjLyricsLang(fjLyricsLang === 'EN' ? null : 'EN')}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    fjLyricsLang === 'EN'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-foreground/60 hover:bg-accent/30 hover:text-foreground'
                  }`}
                >
                  <ChevronDown size={12} style={{ transform: fjLyricsLang === 'EN' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }} />
                  English (Brother John)
                </button>
              </div>

              <div className="px-4 pb-4">
                <AnimatePresence initial={false} mode="wait">
                  {fjLyricsLang === 'FR' && (
                    <motion.div
                      id="fj-lyrics-fr"
                      key="fr"
                      variants={lyricsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-foreground/40">Paroles originales en français</p>
                      <pre className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">
                        {FRERE_JACQUES_FR}
                      </pre>
                    </motion.div>
                  )}
                  {fjLyricsLang === 'EN' && (
                    <motion.div
                      id="fj-lyrics-en"
                      key="en"
                      variants={lyricsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-foreground/40">English version — Brother John</p>
                      <pre className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">
                        {FRERE_JACQUES_EN}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        }

        /* ── Au clair de la lune ── */
        if (song.id === AU_CLAIR_ID) {
          return (
            <motion.div
              key={song.id}
              className="bg-card rounded-[1.25rem] shadow-sm border border-card-border overflow-hidden"
            >
              <div className="flex items-center p-4 pb-2">
                <div className="w-14 h-14 bg-muted rounded-[1rem] flex items-center justify-center text-3xl shrink-0 mr-4">
                  {song.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-lg leading-tight">{song.title}</h3>
                  <p className="text-xs text-foreground/50 mt-0.5">Comptine française traditionnelle</p>
                </div>
              </div>

              <div className="px-4 pb-3">
                <audio controls src="/au-clair-de-la-lune.mp3" className="w-full h-10" style={{ accentColor: 'var(--primary)' }} />
              </div>

              <div className="px-4 pb-4">
                <button
                  aria-expanded={auClairLyricsOpen}
                  aria-controls="au-clair-lyrics"
                  onClick={() => setAuClairLyricsOpen(o => !o)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <ChevronDown size={16} style={{ transform: auClairLyricsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s' }} />
                  {auClairLyricsOpen ? 'Masquer les paroles' : 'Voir les paroles'}
                </button>
                <AnimatePresence initial={false}>
                  {auClairLyricsOpen && (
                    <motion.div
                      id="au-clair-lyrics"
                      key="lyrics"
                      variants={lyricsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <pre className="mt-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans">
                        {AU_CLAIR_LYRICS}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        }

        /* ── All other songs ── */
        return (
          <motion.div
            key={song.id}
            className="flex items-center bg-card p-4 rounded-[1.25rem] shadow-sm border border-card-border"
          >
            <div className="w-14 h-14 bg-muted rounded-[1rem] flex items-center justify-center text-3xl shrink-0 mr-4">
              {song.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground truncate text-lg">{song.title}</h3>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-bold">
                {song.lang}
              </span>
            </div>
            <button
              data-testid={`play-btn-${song.id}`}
              onClick={() => handlePlay(song.id)}
              className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center ml-2 hover:bg-primary/20 transition-colors shrink-0"
            >
              {playingId === song.id
                ? <Square fill="currentColor" size={20} />
                : <Play fill="currentColor" className="ml-1" size={24} />}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
