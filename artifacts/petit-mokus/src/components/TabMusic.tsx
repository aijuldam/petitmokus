import { useState, useEffect } from "react";
import { Language, dictionary } from "../lib/i18n";
import { playSongLoop, stopSong } from "../lib/audio";
import { Play, Square } from "lucide-react";
import { motion } from "framer-motion";

interface TabMusicProps {
  language: Language;
}

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

  useEffect(() => {
    return () => { stopSong(); };
  }, []);

  const handlePlay = (id: string) => {
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
      {songs.map((song) => (
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
            {playingId === song.id ? <Square fill="currentColor" size={20} /> : <Play fill="currentColor" className="ml-1" size={24} />}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
