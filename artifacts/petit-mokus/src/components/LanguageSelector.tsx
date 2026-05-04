import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Globe, Check, Search, X } from "lucide-react";
import { Language } from "../lib/i18n";
import { useIsMobile } from "../hooks/use-mobile";
import { ALL_LANGUAGES, SUGGESTED, REST } from "../lib/languages";

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

function resolveLanguage(code: string): Language {
  const available = ['EN', 'FR', 'HU', 'DE'] as Language[];
  return available.includes(code as Language) ? (code as Language) : 'EN';
}

function currentLang(language: Language) {
  return ALL_LANGUAGES.find(l => l.code === language);
}

// ── Dual-label row ────────────────────────────────────────────────────────────

function LangRow({
  native,
  english,
  selected,
  available,
  onClick,
}: {
  native: string;
  english: string;
  selected: boolean;
  available: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={`w-full flex items-center justify-between px-5 py-0
                  min-h-[52px] transition-colors duration-150
                  ${available
                    ? selected
                      ? 'bg-primary/10'
                      : 'hover:bg-muted/60 active:bg-muted'
                    : 'opacity-40 cursor-default'
                  }`}
    >
      <span className="flex items-baseline gap-2">
        <span className={`text-[15px] font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>
          {native}
        </span>
        <span className="text-[12px] text-muted-foreground">
          · {english}
        </span>
      </span>
      {available && !selected && (
        <span className="hidden" />
      )}
      {selected && (
        <Check className="w-4 h-4 text-primary shrink-0" />
      )}
      {!available && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-foreground/8 text-foreground/40">
          soon
        </span>
      )}
    </button>
  );
}

// ── Full-screen mobile overlay ────────────────────────────────────────────────

function FullScreenPicker({
  language,
  onSelect,
  onClose,
}: {
  language: Language;
  onSelect: (code: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const shouldReduce = useReducedMotion();

  const filtered = REST.filter(l =>
    query.length > 0 &&
    (l.native.toLowerCase().includes(query.toLowerCase()) ||
     l.english.toLowerCase().includes(query.toLowerCase()) ||
     l.code.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const overlayVariants = shouldReduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      }
    : {
        hidden: { clipPath: 'inset(0% 0% 97% 82% round 24px)' },
        visible: {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] },
        },
        exit: {
          clipPath: 'inset(0% 0% 97% 82% round 24px)',
          transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
        },
      };

  const contentVariants = shouldReduce
    ? {}
    : {
        hidden: { opacity: 0, y: -12 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.22 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      };

  return (
    <motion.div
      key="fullscreen-picker"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 bg-card flex flex-col"
    >
      {/* Sticky top bar */}
      <div className="shrink-0 flex items-center justify-between px-4 h-14 border-b border-border/40 bg-card/95 backdrop-blur-sm">
        <p className="text-[15px] font-bold text-foreground">Choose language</p>
        <button
          onClick={onClose}
          aria-label="Close language picker"
          className="w-9 h-9 flex items-center justify-center rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex-1 overflow-y-auto"
      >
        {/* Available languages */}
        <div className="pt-3 pb-1">
          <p className="px-5 pb-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">
            Available now
          </p>
          {SUGGESTED.map(l => (
            <LangRow
              key={l.code}
              native={l.native}
              english={l.english}
              selected={l.code === language}
              available={l.available}
              onClick={() => onSelect(l.code)}
            />
          ))}
        </div>

        {/* Coming soon — search gate */}
        <div className="border-t border-border/40 pt-3">
          <p className="px-5 pb-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">
            Coming soon
          </p>

          {/* Search bar — no autoFocus */}
          <div className="relative px-4 pb-2">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="lang-search"
              name="lang-search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search a language…"
              autoComplete="off"
              spellCheck={false}
              className="w-full pl-8 pr-8 py-2.5 text-[14px] rounded-xl border border-border/60 bg-muted/40
                         text-foreground placeholder:text-muted-foreground/50 outline-none
                         focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results or full list */}
          {query.length === 0
            ? REST.map(l => (
                <LangRow
                  key={l.code}
                  native={l.native}
                  english={l.english}
                  selected={false}
                  available={false}
                />
              ))
            : filtered.length === 0
              ? (
                <p className="px-5 py-6 text-sm text-muted-foreground text-center">
                  No language found — try another spelling.
                </p>
              )
              : filtered.map(l => (
                  <LangRow
                    key={l.code}
                    native={l.native}
                    english={l.english}
                    selected={false}
                    available={false}
                  />
                ))
          }
          <div className="h-8" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Desktop popover ───────────────────────────────────────────────────────────

function Popover({
  language,
  onSelect,
  onClose,
}: {
  language: Language;
  onSelect: (code: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = REST.filter(l =>
    query.length > 0 &&
    (l.native.toLowerCase().includes(query.toLowerCase()) ||
     l.english.toLowerCase().includes(query.toLowerCase()) ||
     l.code.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-card
                 border border-border/60 shadow-xl z-50 overflow-hidden"
      role="listbox"
      aria-label="Select language"
    >
      <p className="px-5 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">
        Available now
      </p>
      {SUGGESTED.map(l => (
        <LangRow
          key={l.code}
          native={l.native}
          english={l.english}
          selected={l.code === language}
          available={l.available}
          onClick={() => onSelect(l.code)}
        />
      ))}

      <div className="border-t border-border/40 pt-3 pb-1">
        <p className="px-5 pb-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">
          Coming soon
        </p>
        <div className="relative px-4 pb-2">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            id="desktop-lang-search"
            name="desktop-lang-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search more languages…"
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-7 pr-7 py-1.5 text-sm rounded-lg border border-border/50 bg-muted/40
                       text-foreground placeholder:text-muted-foreground/50 outline-none
                       focus:border-primary/40 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear" className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="max-h-44 overflow-y-auto">
          {query.length === 0
            ? null
            : filtered.length === 0
              ? <p className="px-5 py-3 text-sm text-muted-foreground text-center">No results.</p>
              : filtered.map(l => (
                  <LangRow key={l.code} native={l.native} english={l.english} selected={false} available={false} />
                ))
          }
        </div>
      </div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lang = currentLang(language);

  const handleSelect = useCallback(
    (code: string) => {
      setLanguage(resolveLanguage(code));
      setOpen(false);
    },
    [setLanguage],
  );

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
          transition-all duration-200
          ${open
            ? 'bg-muted text-foreground'
            : 'text-foreground/60 hover:text-foreground hover:bg-muted/60'
          }`}
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="text-[13px] font-semibold tracking-wide">
          {lang?.code ?? language}
        </span>
      </button>

      <AnimatePresence>
        {open && !isMobile && (
          <Popover language={language} onSelect={handleSelect} onClose={() => setOpen(false)} />
        )}
        {open && isMobile && (
          <FullScreenPicker language={language} onSelect={handleSelect} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
