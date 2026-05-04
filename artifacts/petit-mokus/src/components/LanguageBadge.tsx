import { useState, useRef, useEffect, useCallback } from "react";
import { Globe, ChevronRight, Check, Search, X } from "lucide-react";
import { Language } from "../lib/i18n";
import { useIsMobile } from "../hooks/use-mobile";
import { ALL_LANGUAGES, SUGGESTED, REST } from "../lib/languages";

interface LanguageBadgeProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const TOTAL = ALL_LANGUAGES.length;

function resolveLanguage(code: string): Language {
  const available = ['EN', 'FR', 'HU', 'DE'] as Language[];
  return available.includes(code as Language) ? (code as Language) : 'EN';
}

function currentNative(language: Language): string {
  return ALL_LANGUAGES.find(l => l.code === language)?.native ?? language;
}

// ── Available language pills (primary tap targets) ────────────────────────────

function AvailablePills({
  language,
  onSelect,
}: {
  language: Language;
  onSelect: (code: string) => void;
}) {
  return (
    <div className="px-4 pt-4 pb-3 grid grid-cols-2 gap-2">
      {SUGGESTED.map(l => {
        const selected = l.code === language;
        return (
          <button
            key={l.code}
            role="option"
            aria-selected={selected}
            onClick={() => onSelect(l.code)}
            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl
                        text-sm font-semibold transition-all duration-150 min-h-[52px]
                        active:scale-[0.97]
                        ${selected
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground border border-transparent'
                        }`}
          >
            <span>{l.native}</span>
            {selected && <Check className="w-4 h-4 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Coming-soon search (optional, collapsed by default) ───────────────────────

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
          id="badge-lang-search"
          name="badge-lang-search"
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
                className="flex items-center justify-between px-4 py-2.5 opacity-40"
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
  anchorRef,
}: {
  language: Language;
  onSelect: (code: string) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}) {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onPointer = (e: MouseEvent) => {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [onClose, anchorRef]);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-card
                 border border-border/60 shadow-xl z-50 overflow-hidden"
      role="listbox"
      aria-label="Select language"
    >
      <p className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 select-none">
        Available now
      </p>
      <AvailablePills language={language} onSelect={onSelect} />
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
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-foreground/20" />
        </div>

        {/* Title */}
        <p className="text-base font-bold text-center text-foreground pt-2 px-4 shrink-0">
          Choose your language
        </p>
        <p className="text-xs text-center text-muted-foreground pb-1 px-4 shrink-0">
          Tap to switch instantly
        </p>

        {/* Primary tap targets — no scroll needed */}
        <div className="shrink-0" role="listbox" aria-label="Available languages">
          <AvailablePills language={language} onSelect={onSelect} />
        </div>

        {/* Optional search for coming-soon */}
        <div className="overflow-y-auto flex-1 pb-8">
          <ComingSoonSearch query={query} onChange={setQuery} />
        </div>
      </div>
    </div>
  );
}

// ── Main badge ────────────────────────────────────────────────────────────────

export function LanguageBadge({ language, setLanguage }: LanguageBadgeProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSelect = useCallback(
    (code: string) => {
      setLanguage(resolveLanguage(code));
      setOpen(false);
    },
    [setLanguage],
  );

  return (
    <div
      aria-label={`${TOTAL} official European languages. Tap to choose your language.`}
      className="relative mb-5 bg-accent/10 border border-accent/20 rounded-[1.25rem] p-4
                 flex items-center justify-between gap-3"
    >
      {/* Left: icon + text */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl shrink-0 select-none" aria-hidden>🌍</span>
        <div className="min-w-0">
          <p className="font-extrabold leading-tight text-foreground/80 flex items-baseline gap-1.5 flex-wrap">
            <span
              className="text-2xl text-primary animate-in fade-in zoom-in-95 duration-[180ms] motion-reduce:animate-none"
              style={{ animationFillMode: 'both' }}
            >
              {TOTAL}
            </span>
            <span className="text-sm font-bold">official European languages</span>
          </p>
          <p className="text-xs text-foreground/45 mt-0.5 leading-snug">
            from every EU country to Iceland and the Balkans
          </p>
        </div>
      </div>

      {/* Right: trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Current language: ${currentNative(language)}. Tap to switch.`}
        className={`flex items-center gap-1.5 shrink-0 px-3 rounded-full font-medium text-sm
                    min-h-[44px] min-w-[44px] transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                    ${open
                      ? 'bg-muted text-foreground'
                      : 'text-foreground/60 hover:text-foreground hover:bg-muted/60 active:scale-[0.97]'
                    }`}
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">{currentNative(language)}</span>
        <ChevronRight
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && !isMobile && (
        <Popover
          language={language}
          onSelect={handleSelect}
          onClose={() => setOpen(false)}
          anchorRef={triggerRef}
        />
      )}
      {open && isMobile && (
        <BottomSheet
          language={language}
          onSelect={handleSelect}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
