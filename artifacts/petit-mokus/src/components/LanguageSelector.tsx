import { useState, useRef, useEffect, useCallback } from "react";
import { Globe, Check, Search, X } from "lucide-react";
import { Language } from "../lib/i18n";
import { useIsMobile } from "../hooks/use-mobile";
import { ALL_LANGUAGES, SUGGESTED, REST, LangOption } from "../lib/languages";

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function currentNative(language: Language): string {
  return ALL_LANGUAGES.find(l => l.code === language)?.native ?? language;
}

function resolveLanguage(code: string): Language {
  const available = ['EN', 'FR', 'HU', 'DE'] as Language[];
  return available.includes(code as Language) ? (code as Language) : 'EN';
}

// ── sub-components ────────────────────────────────────────────────────────────

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
        id="lang-search"
        name="lang-search"
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
      className={`w-full flex items-center justify-between px-4 text-sm transition-colors
        ${tall ? 'py-4' : 'py-2.5'}
        ${selected ? 'text-foreground font-semibold' : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'}
        ${!item.available ? 'opacity-40' : ''}`}
    >
      <span>{item.native}</span>
      <span className="flex items-center gap-2 shrink-0">
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

function LanguageList({
  query,
  language,
  onSelect,
  tall,
}: {
  query: string;
  language: Language;
  onSelect: (code: string) => void;
  tall?: boolean;
}) {
  const q = query.toLowerCase();

  const filterGroup = (items: LangOption[]) =>
    items.filter(l => l.native.toLowerCase().includes(q) || l.code.toLowerCase().includes(q));

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
          {suggested.map(l => (
            <LangRow
              key={l.code}
              item={l}
              selected={l.code === language}
              onSelect={() => onSelect(l.code)}
              tall={tall}
            />
          ))}
        </>
      )}
      {rest.length > 0 && (
        <>
          <SectionLabel label="All languages" />
          {rest.map(l => (
            <LangRow
              key={l.code}
              item={l}
              selected={l.code === language}
              onSelect={() => onSelect(l.code)}
              tall={tall}
            />
          ))}
        </>
      )}
    </div>
  );
}

// ── Popover (desktop) ─────────────────────────────────────────────────────────

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
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
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
      className="absolute top-full right-0 mt-2 w-60 rounded-2xl bg-card border border-border/60
                 shadow-xl z-50 overflow-hidden flex flex-col"
      style={{ maxHeight: 380 }}
    >
      <SearchInput value={query} onChange={setQuery} autoFocus />
      <div className="overflow-y-auto pb-2">
        <LanguageList query={query} language={language} onSelect={onSelect} />
      </div>
    </div>
  );
}

// ── Bottom Sheet (mobile) ─────────────────────────────────────────────────────

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
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on backdrop tap
  const onBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    // Prevent body scroll while open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm"
      onClick={onBackdrop}
    >
      <div
        ref={sheetRef}
        className="bg-card rounded-t-3xl flex flex-col overflow-hidden"
        style={{ maxHeight: '85dvh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-foreground/20" />
        </div>

        {/* Title */}
        <p className="text-base font-bold text-center text-foreground pb-3 px-4 shrink-0">
          Choose your language
        </p>

        {/* Search */}
        <div className="shrink-0">
          <SearchInput value={query} onChange={setQuery} autoFocus />
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 pb-8">
          <LanguageList query={query} language={language} onSelect={onSelect} tall />
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

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      {/* Trigger */}
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

      {/* Panel */}
      {open && !isMobile && (
        <Popover language={language} onSelect={handleSelect} onClose={handleClose} />
      )}
      {open && isMobile && (
        <BottomSheet language={language} onSelect={handleSelect} onClose={handleClose} />
      )}
    </div>
  );
}
