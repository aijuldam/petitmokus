import { useState, useEffect, useRef } from "react";
import { Language, dictionary } from "../lib/i18n";
import { playSongLoop, stopSong } from "../lib/audio";
import { Play, Square, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TabMusicProps {
  language: Language;
}

const PIROUETTE_ID = 'fr1';

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

const songs = [
  { id: 'fr1', title: dictionary.songs.fr1, emoji: '🎠', lang: 'FR' },
  { id: 'fr2', title: dictionary.songs.fr2, emoji: '🍎', lang: 'FR' },
  { id: 'fr3', title: dictionary.songs.fr3, emoji: '🌲', lang: 'FR' },
  { id: 'hu1', title: dictionary.songs.hu1, emoji: '🌙', lang: 'HU' },
  { id: 'hu2', title: dictionary.songs.hu2, emoji: '🌸', lang: 'HU' },
  { id: 'en1', title: dictionary.songs.en1, emoji: '⭐', lang: 'EN' },
  { id: 'en2', title: dictionary.songs.en2, emoji: '🌛', lang: 'EN' },
];

export function TabMusic({ language }: TabMusicProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => { stopSong(); };
  }, []);

  const handlePlay = (id: string) => {
    if (id === PIROUETTE_ID) return;
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
                  <h3 className="font-bold text-foreground truncate text-lg">{song.title}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-bold">
                    {song.lang}
                  </span>
                </div>
              </div>

              <div className="px-4 pb-3">
                <audio
                  ref={audioRef}
                  controls
                  src="/pirouette-cacahuete.mp3"
                  className="w-full h-10 rounded-full"
                  style={{ accentColor: 'var(--primary)' }}
                />
              </div>

              <div className="px-4 pb-4">
                <button
                  aria-expanded={lyricsOpen}
                  aria-controls="pirouette-lyrics"
                  onClick={() => setLyricsOpen(o => !o)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-250"
                    style={{ transform: lyricsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                  {lyricsOpen ? 'Masquer les paroles' : 'Voir les paroles'}
                </button>

                <AnimatePresence initial={false}>
                  {lyricsOpen && (
                    <motion.div
                      id="pirouette-lyrics"
                      key="lyrics"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
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
