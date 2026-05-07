import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  const available: Language[] = [
    'EN', 'FR', 'HU', 'DE',
    'ES', 'PT', 'IT', 'NL', 'DA', 'SV', 'NB', 'IS', 'GA',
    'PL', 'CS', 'SK', 'RO', 'HR', 'SR', 'SL', 'BS', 'MK', 'SQ', 'BG',
    'ET', 'LV', 'LT', 'EL', 'MT', 'ME',
  ];
  return available.includes(code as Language) ? (code as Language) : 'EN';
}

function currentLang(language: Language) {
  return ALL_LANGUAGES.find(l => l.code === language);
}

// ── Language row (shared by mobile and desktop) ───────────────────────────────

function LangRow({
  native,
  english,
  selected,
  available,
  focused = false,
  onClick,
}: {
  native: string;
  english: string;
  selected: boolean;
  available: boolean;
  focused?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      data-lang-row
      className={`w-full flex items-center justify-between px-6
                  min-h-[60px] transition-colors duration-100 text-left
                  ${available
                    ? selected
                      ? 'bg-primary/10 active:bg-primary/15'
                      : focused
                        ? 'bg-muted'
                        : 'hover:bg-muted/60 active:bg-muted'
                    : 'opacity-40 cursor-default'
                  }`}
    >
      <span className="flex items-baseline gap-2">
        <span className={`text-[16px] font-semibold leading-tight ${selected ? 'text-primary' : 'text-foreground'}`}>
          {native}
        </span>
        <span className="text-[13px] text-muted-foreground">
          · {english}
        </span>
      </span>
      {selected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
      {!available && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-foreground/8 text-foreground/40 ml-2 shrink-0">
          soon
        </span>
      )}
    </button>
  );
}

// ── Full-screen mobile picker (portal, unchanged) ─────────────────────────────

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
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = query.length > 0
    ? REST.filter(l =>
        l.native.toLowerCase().includes(query.toLowerCase()) ||
        l.english.toLowerCase().includes(query.toLowerCase()) ||
        l.code.toLowerCase().includes(query.toLowerCase())
      )
    : REST;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const slideVariants = shouldReduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      }
    : {
        hidden: { y: '100%' },
        visible: { y: 0, transition: { type: 'spring' as const, stiffness: 320, damping: 32 } },
        exit: { y: '100%', transition: { type: 'spring' as const, stiffness: 400, damping: 40 } },
      };

  return createPortal(
    <>
      <motion.div
        key="lang-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        key="lang-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Choose language"
        variants={slideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[9999] flex flex-col bg-card"
        style={{ height: '100dvh' }}
      >
        <div className="shrink-0 flex items-center justify-between px-5 border-b border-border/40 bg-card"
             style={{ height: '56px' }}>
          <p className="text-[16px] font-bold text-foreground">Choose language</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/60
                       hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="pt-4 pb-2">
            <p className="px-6 pb-2 text-[11px] font-bold tracking-widest uppercase text-muted-foreground/60 select-none">
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
          <div className="border-t border-border/40 mt-2" />
          <div className="pt-4 pb-2">
            <p className="px-6 pb-3 text-[11px] font-bold tracking-widest uppercase text-muted-foreground/60 select-none">
              Coming soon
            </p>
            <div className="relative px-4 pb-3">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                ref={searchRef}
                id="mobile-lang-search"
                name="mobile-lang-search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search a language…"
                autoComplete="off"
                spellCheck={false}
                className="w-full pl-9 pr-8 py-3 text-[14px] rounded-xl border border-border/60
                           bg-muted/40 text-foreground placeholder:text-muted-foreground/50
                           outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20
                           transition-all"
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
            {filtered.length === 0
              ? (
                <p className="px-6 py-6 text-sm text-muted-foreground text-center">
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
          </div>
          <div className="h-10" />
        </div>
      </motion.div>
    </>,
    document.body,
  );
}

// ── Desktop picker (portal, Mobiscroll-style) ─────────────────────────────────
//
// Root cause of the old bug: the previous `Popover` was `position: absolute`
// inside the header, inheriting its overflow/stacking context, and had no
// max-height on the "Available now" list (~30 rows × 60px = 1800px). It was
// clipped by parent overflow and ran off-screen.
//
// Fix: portal → fixed positioning via getBoundingClientRect, unified
// searchable list, max-height capped to viewport, keyboard nav.

function DesktopPicker({
  language,
  triggerRect,
  onSelect,
  onClose,
}: {
  language: Language;
  triggerRect: DOMRect;
  onSelect: (code: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Unified ordered list: available languages first, then coming soon
  const allOrdered = [...SUGGESTED, ...REST];
  const filtered = query.trim().length > 0
    ? allOrdered.filter(l =>
        l.native.toLowerCase().includes(query.toLowerCase()) ||
        l.english.toLowerCase().includes(query.toLowerCase()) ||
        l.code.toLowerCase().includes(query.toLowerCase())
      )
    : allOrdered;

  const availableFiltered = filtered.filter(l => l.available);
  const comingSoonFiltered = filtered.filter(l => !l.available);

  // Compute viewport-aware position
  const POPOVER_WIDTH = 304;
  const GAP = 8;
  const rawLeft = triggerRect.right - POPOVER_WIDTH;
  const left = Math.max(8, Math.min(rawLeft, window.innerWidth - POPOVER_WIDTH - 8));
  const top = triggerRect.bottom + GAP;
  const maxHeight = Math.min(520, window.innerHeight - top - 16);

  // Auto-focus search on mount
  useEffect(() => {
    requestAnimationFrame(() => searchRef.current?.focus());
  }, []);

  // Keyboard: Escape, ArrowUp/Down, Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(i => {
          const next = Math.min(i + 1, filtered.length - 1);
          return next;
        });
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(i => {
          if (i <= 0) {
            searchRef.current?.focus();
            return -1;
          }
          return i - 1;
        });
        return;
      }
      if (e.key === 'Enter' && focusedIndex >= 0) {
        const lang = filtered[focusedIndex];
        if (lang?.available) onSelect(lang.code);
        return;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onSelect, filtered, focusedIndex]);

  // Click outside to close
  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
    };
    // Small delay so the trigger click that opened the picker doesn't immediately close it
    const id = setTimeout(() => document.addEventListener('mousedown', onPointer), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [onClose]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const rows = listRef.current.querySelectorAll('[data-lang-row]');
    rows[focusedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [focusedIndex]);

  // Reset keyboard focus when query changes
  useEffect(() => { setFocusedIndex(-1); }, [query]);

  return createPortal(
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-label="Select language"
      aria-modal="true"
      initial={{ opacity: 0, scale: 0.96, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -6 }}
      transition={{ duration: 0.13, ease: 'easeOut' }}
      style={{ position: 'fixed', top, left, width: POPOVER_WIDTH, maxHeight, zIndex: 9999 }}
      className="flex flex-col rounded-2xl bg-card border border-border/60 shadow-2xl overflow-hidden"
    >
      {/* ── Search input ── */}
      <div className="shrink-0 px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            ref={searchRef}
            id="desktop-lang-search"
            name="desktop-lang-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              // Let ArrowDown move focus into the list
              if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(0); }
            }}
            placeholder="Search language…"
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-8 pr-7 py-2 text-[13px] rounded-xl border border-border/50
                       bg-muted/40 text-foreground placeholder:text-muted-foreground/50
                       outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20
                       transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); searchRef.current?.focus(); }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/40" />

      {/* ── Scrollable list ── */}
      <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain">

        {/* Available languages */}
        {availableFiltered.length > 0 && (
          <>
            {!query && (
              <p className="px-5 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 select-none">
                Available now
              </p>
            )}
            {availableFiltered.map(l => {
              const idx = filtered.indexOf(l);
              return (
                <LangRow
                  key={l.code}
                  native={l.native}
                  english={l.english}
                  selected={l.code === language}
                  available={true}
                  focused={focusedIndex === idx}
                  onClick={() => onSelect(l.code)}
                />
              );
            })}
          </>
        )}

        {/* Coming soon languages */}
        {comingSoonFiltered.length > 0 && (
          <>
            <div className="border-t border-border/40 mt-1" />
            {!query && (
              <p className="px-5 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 select-none">
                Coming soon
              </p>
            )}
            {comingSoonFiltered.map(l => {
              const idx = filtered.indexOf(l);
              return (
                <LangRow
                  key={l.code}
                  native={l.native}
                  english={l.english}
                  selected={false}
                  available={false}
                  focused={focusedIndex === idx}
                />
              );
            })}
          </>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted-foreground text-center">
            No language found — try another spelling.
          </p>
        )}

        <div className="h-2" />
      </div>
    </motion.div>,
    document.body,
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lang = currentLang(language);

  const handleOpen = useCallback(() => {
    if (!open && wrapperRef.current) {
      setTriggerRect(wrapperRef.current.getBoundingClientRect());
    }
    setOpen(o => !o);
  }, [open]);

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
        onClick={handleOpen}
        aria-haspopup="dialog"
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
        {open && !isMobile && triggerRect && (
          <DesktopPicker
            language={language}
            triggerRect={triggerRect}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />
        )}
        {open && isMobile && (
          <FullScreenPicker
            language={language}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
