import { useState, useRef, useEffect, useCallback } from "react";
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

function currentNative(language: Language): string {
  return ALL_LANGUAGES.find(l => l.code === language)?.native ?? language;
}

// ── Available language pills ──────────────────────────────────────────────────

function AvailablePills({
  language,
  onSelect,
  compact,
}: {
  language: Language;
  onSelect: (code: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={`grid grid-cols-2 gap-2 ${compact ? 'px-3 py-3' : 'px-4 pt-4 pb-3'}`}>
      {SUGGESTED.map(l => {
        const selected = l.code === language;
        return (
          <button
            key={l.code}
            role="option"
            aria-selected={selected}
            onClick={() => onSelect(l.code)}
            className={`flex items-center justify-between px-3 rounded-xl
                        text-sm font-semibold transition-all duration-150 active:scale-[0.97]
                        ${compact ? 'py-2.5 min-h-[44px]' : 'py-3.5 min-h-[52px]'}
                        ${selected
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground border border-transparent'
                        }`}
          >
            <span>{l.native}</span>
            {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Coming-soon search ────────────────────────────────────────────────────────

function ComingSoonSearch({
  query,
  onChange,
}: {
  query: string;
  onChange: (v: string) => void;
}) {
  const filtered = REST.filter(l =>
    l.native.toLowerCase().includes(query.toLowerCase()) ||
    l.code.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="border-t border-border/40">
      <div className="relative px-3 py-2">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          id="header-lang-search"
          name="header-lang-search"
          value={query}
          onChange={e => onChange(e.target.value)}
          placeholder="Search more languages…"
          className="w-full pl-6 pr-7 py-1.5 text-sm bg-transparent outline-none
                     text-foreground placeholder:text-muted-foreground/60"
          aria-label="Search more languages"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            onClick={() => onChange('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {query && (
        <div className="pb-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted-foreground text-center">
              No language found — try another spelling.
            </p>
          ) : (
            filtered.map(l => (
              <div
                key={l.code}
                className="flex items-center justify-between px-4 py-2 opacity-40"
              >
                <span className="text-sm text-foreground/70">{l.native}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-foreground/8 text-foreground/40">
                  soon
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
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
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-card
                 border border-border/60 shadow-xl z-50 overflow-hidden"
      role="listbox"
      aria-label="Select language"
    >
      <p className="px-4 pt-3 pb-0 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 select-none">
        Available now
      </p>
      <AvailablePills language={language} onSelect={onSelect} compact />
      <ComingSoonSearch query={query} onChange={setQuery} />
    </div>
  );
}

// ── Mobile bottom sheet ───────────────────────────────────────────────────────

function BottomSheet({
  language,
  onSelect,
  onClose,
}: {
  language: Language;
  onSelect: (code: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');

  const onBackdrop = useCallback(
    (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); },
    [onClose],
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

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm
                 animate-in fade-in duration-200"
      onClick={onBackdrop}
    >
      <div
        className="bg-card rounded-t-3xl flex flex-col overflow-hidden
                   animate-in slide-in-from-bottom-4 duration-300"
        style={{ maxHeight: '85dvh' }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-foreground/20" />
        </div>
        <p className="text-base font-bold text-center text-foreground pt-2 px-4 shrink-0">
          Choose your language
        </p>
        <p className="text-xs text-center text-muted-foreground pb-1 px-4 shrink-0">
          Tap to switch instantly
        </p>

        <div className="shrink-0" role="listbox" aria-label="Available languages">
          <AvailablePills language={language} onSelect={onSelect} />
        </div>

        <div className="overflow-y-auto flex-1 pb-8">
          <ComingSoonSearch query={query} onChange={setQuery} />
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);

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
        <span className="hidden md:inline">{currentNative(language)}</span>
      </button>

      {open && !isMobile && (
        <Popover language={language} onSelect={handleSelect} onClose={() => setOpen(false)} />
      )}
      {open && isMobile && (
        <BottomSheet language={language} onSelect={handleSelect} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
