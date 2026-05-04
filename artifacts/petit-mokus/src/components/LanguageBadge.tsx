import { useState, useRef, useEffect, useCallback } from "react";
import { Globe, ChevronRight, Check, Search, X } from "lucide-react";
import { Language } from "../lib/i18n";
import { useIsMobile } from "../hooks/use-mobile";
import { ALL_LANGUAGES, SUGGESTED, REST, LangOption } from "../lib/languages";

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

// ── Search input ──────────────────────────────────────────────────────────────

function SearchInput({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative px-3 py-2 border-b border-border/50">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      <input
        id="badge-lang-search"
        name="badge-lang-search"
        autoFocus={autoFocus}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search…"
        className="w-full pl-6 pr-6 py-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        aria-label="Search languages"
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ── Language row ──────────────────────────────────────────────────────────────

function LangRow({
  item,
  selected,
  onSelect,
  tall,
}: {
  item: LangOption;
  selected: boolean;
  onSelect: () => void;
  tall?: boolean;
}) {
  return (
    <button
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      disabled={!item.available}
      className={`w-full flex items-center justify-between px-4 text-sm transition-colors
        ${tall ? 'py-4' : 'py-2.5'}
        ${selected ? 'text-foreground font-semibold' : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'}
        ${!item.available ? 'opacity-40 cursor-default' : ''}`}
    >
      <span>{item.native}</span>
      <span className="flex items-center gap-1.5 shrink-0">
        {!item.available && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-foreground/8 text-foreground/40">
            soon
          </span>
        )}
        {selected && <Check className="w-3.5 h-3.5 text-primary" />}
      </span>
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="px-4 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 select-none">
      {label}
    </p>
  );
}

// ── Language list (shared by popover + sheet) ─────────────────────────────────

function LanguageList({
  query,
  language,
  onSelect,
  tall,
  twoCol,
}: {
  query: string;
  language: Language;
  onSelect: (code: string) => void;
  tall?: boolean;
  twoCol?: boolean;
}) {
  const q = query.toLowerCase();
  const filterGroup = (items: LangOption[]) =>
    items.filter(l =>
      l.native.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
    );
  const suggested = filterGroup(SUGGESTED);
  const rest = filterGroup(REST);
  const noResults = suggested.length === 0 && rest.length === 0;

  if (noResults) {
    return (
      <p className="px-4 py-8 text-sm text-muted-foreground text-center">
        No language found — try another spelling.
      </p>
    );
  }

  return (
    <div role="listbox" aria-label="Languages">
      {suggested.length > 0 && (
        <>
          <SectionLabel label="Suggested" />
          <div className={twoCol ? 'grid grid-cols-2' : ''}>
            {suggested.map(l => (
              <LangRow
                key={l.code}
                item={l}
                selected={l.code === language}
                onSelect={() => onSelect(l.code)}
                tall={tall}
              />
            ))}
          </div>
        </>
      )}
      {rest.length > 0 && (
        <>
          <SectionLabel label="All languages" />
          <div className={twoCol ? 'grid grid-cols-2' : ''}>
            {rest.map(l => (
              <LangRow
                key={l.code}
                item={l}
                selected={l.code === language}
                onSelect={() => onSelect(l.code)}
                tall={tall}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Desktop 2-column popover ──────────────────────────────────────────────────

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
      className="absolute left-0 top-full mt-2 w-[480px] max-w-[90vw] rounded-2xl bg-card
                 border border-border/60 shadow-xl z-50 overflow-hidden flex flex-col"
      style={{ maxHeight: 420 }}
    >
      <SearchInput value={query} onChange={setQuery} autoFocus />
      <div className="overflow-y-auto pb-2">
        <LanguageList query={query} language={language} onSelect={onSelect} twoCol />
      </div>
    </div>
  );
}

// ── Mobile full-screen bottom sheet ──────────────────────────────────────────

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
        style={{ maxHeight: '90dvh' }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-foreground/20" />
        </div>
        <p className="text-base font-bold text-center text-foreground pb-3 px-4 shrink-0">
          Choose your language
        </p>
        <div className="shrink-0">
          <SearchInput value={query} onChange={setQuery} autoFocus />
        </div>
        <div className="overflow-y-auto flex-1 pb-8">
          <LanguageList query={query} language={language} onSelect={onSelect} tall />
        </div>
      </div>
    </div>
  );
}

// ── Main badge component ──────────────────────────────────────────────────────

export function LanguageBadge({ language, setLanguage }: LanguageBadgeProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (code: string) => {
      setLanguage(resolveLanguage(code));
      setOpen(false);
    },
    [setLanguage],
  );

  return (
    <div
      ref={wrapperRef}
      aria-label={`${TOTAL} official European languages. Tap to choose your language.`}
      className="relative mb-5 bg-accent/10 border border-accent/20 rounded-[1.25rem] p-4
                 flex items-center justify-between gap-3"
    >
      {/* Left: icon + text */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl shrink-0 select-none" aria-hidden>🌍</span>
        <div className="min-w-0">
          {/* Number + label on one line */}
          <p className="font-extrabold leading-tight text-foreground/80 flex items-baseline gap-1.5 flex-wrap">
            <span
              className="text-2xl text-primary
                         animate-in fade-in zoom-in-95 duration-[180ms]
                         motion-reduce:animate-none"
              style={{ animationFillMode: 'both' }}
            >
              {TOTAL}
            </span>
            <span className="text-sm font-bold">official European languages</span>
          </p>
          {/* Microcopy */}
          <p className="text-xs text-foreground/45 mt-0.5 leading-snug">
            from every EU country to Iceland and the Balkans
          </p>
        </div>
      </div>

      {/* Right: language trigger */}
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

      {/* Picker panels */}
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
