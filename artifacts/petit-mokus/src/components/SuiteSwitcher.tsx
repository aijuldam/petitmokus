import { useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { LayoutGrid, X } from "lucide-react";
import logoSrc from "@assets/petitmokus-logo-128_1777320029918.png";
import { cn } from "@/lib/utils";
import { stopAllAudio } from "../lib/audio";
import { Language } from "../lib/i18n";
import { suiteCopy, suiteHomeHref, suiteItems } from "../lib/suite";

/** A product symbol from the main site's sprite (/suite/symbols.svg). */
function SuiteSymbol({ symbol }: { symbol: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" overflow="visible" className="size-8 shrink-0">
      <use href={`/suite/symbols.svg#pm-${symbol}`} />
    </svg>
  );
}

const DESKTOP = "(min-width: 64rem)";

/**
 * The suite switcher (NAV-4, NAV-6): every Petit Mokus product, two taps
 * away. An anchored panel from 1024px, a bottom sheet below it. It sits in
 * the header, outside the play area, and works with a normal single tap
 * (no parent gate). Leaving stops any sound.
 */
export function SuiteSwitcher({ language }: { language: Language }) {
  const copy = suiteCopy(language);
  const items = suiteItems(language);
  const homeHref = suiteHomeHref(language);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, right: 0 });
  const [drag, setDrag] = useState<{ start: number; dy: number } | null>(null);

  function onOpenChange(next: boolean) {
    if (next) {
      const wide = window.matchMedia(DESKTOP).matches;
      setDesktop(wide);
      const rect = trigger.current?.getBoundingClientRect();
      if (wide && rect) setAnchor({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    }
    setDrag(null);
    setOpen(next);
  }

  // Arrow keys move between the links, as well as Tab.
  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>("a[href]")];
    if (links.length === 0) return;
    event.preventDefault();
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    links[(at + step + links.length) % links.length]?.focus();
  }

  const row = "flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2 text-left";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger
        ref={trigger}
        aria-label={copy.label}
        className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full px-0 text-sm font-semibold text-foreground/60 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-expanded:bg-muted aria-expanded:text-foreground lg:px-4"
      >
        <LayoutGrid aria-hidden="true" className="size-5" />
        <span aria-hidden="true" className="hidden lg:inline">
          {copy.products}
        </span>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[9998]",
            !desktop &&
              "bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none",
          )}
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onKeyDown={onKeyDown}
          // The panel has no close button on desktop: start on the first
          // product, so arrows and Enter work at once.
          onOpenAutoFocus={(event) => {
            const first = (event.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>("a[href]");
            if (!desktop || !first) return;
            event.preventDefault();
            first.focus();
          }}
          style={
            desktop
              ? { top: anchor.top, right: anchor.right }
              : drag
                ? { transform: `translateY(${Math.max(0, drag.dy)}px)`, transition: "none" }
                : undefined
          }
          className={cn(
            "z-[9999] flex flex-col bg-card text-card-foreground shadow-xl outline-none motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none",
            desktop
              ? "fixed max-h-[calc(100dvh-6rem)] w-[22rem] max-w-[calc(100vw-1.5rem)] rounded-3xl border border-border p-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
              : "fixed inset-x-0 bottom-0 max-h-[80vh] rounded-t-[2rem] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
          )}
        >
          <div
            className={cn("flex items-center justify-between gap-2", desktop ? "px-3 pt-2" : "touch-none pt-2")}
            onPointerDown={desktop ? undefined : (e) => setDrag({ start: e.clientY, dy: 0 })}
            onPointerMove={desktop || !drag ? undefined : (e) => setDrag({ ...drag, dy: e.clientY - drag.start })}
            onPointerUp={desktop || !drag ? undefined : () => (drag.dy > 80 ? onOpenChange(false) : setDrag(null))}
            onPointerCancel={() => setDrag(null)}
          >
            {!desktop ? (
              <div aria-hidden="true" className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-border" />
            ) : null}
            <DialogPrimitive.Title className={cn("font-bold", desktop ? "text-base" : "px-2 pt-4 text-xl")}>
              {copy.label}
            </DialogPrimitive.Title>
            {!desktop ? (
              <DialogPrimitive.Close
                aria-label={copy.close}
                className="mt-3 grid size-11 shrink-0 place-items-center rounded-full bg-muted hover:bg-border"
              >
                <X aria-hidden="true" className="size-5" />
              </DialogPrimitive.Close>
            ) : null}
          </div>
          <nav aria-label={copy.label} className="min-h-0 overflow-y-auto overscroll-contain pt-2">
            <ul className="flex flex-col gap-1">
              {items.map((item) => {
                const here = item.id === "kids";
                const body = (
                  <>
                    <SuiteSymbol symbol={item.symbol} />
                    <span className="flex min-w-0 flex-col">
                      <span className="flex flex-wrap items-center gap-x-2 font-bold">
                        {item.name}
                        {here ? (
                          <span className="rounded-full bg-primary/15 px-2 text-xs font-bold text-foreground">
                            {copy.youAreHere}
                          </span>
                        ) : null}
                        {!item.href ? (
                          <span className="rounded-full bg-muted px-2 text-xs font-bold text-muted-foreground">
                            {copy.soon}
                          </span>
                        ) : null}
                      </span>
                      {/* Kids' muted colour is too pale on the card (WCAG 1.4.3). */}
                      <span className="text-sm text-foreground/85">{item.text}</span>
                    </span>
                  </>
                );
                return (
                  <li key={item.id}>
                    {here ? (
                      <div aria-current="true" className={cn(row, "bg-primary/10")}>
                        {body}
                      </div>
                    ) : item.href ? (
                      <a
                        href={item.href}
                        onClick={stopAllAudio}
                        className={cn(row, "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none")}
                      >
                        {body}
                      </a>
                    ) : (
                      <div aria-disabled="true" className={row}>
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
              <li className="mt-1 border-t border-border pt-1">
                <a
                  href={homeHref}
                  onClick={stopAllAudio}
                  className={cn(row, "font-bold hover:bg-muted focus-visible:bg-muted focus-visible:outline-none")}
                >
                  <img src={logoSrc} alt="" width={32} height={32} className="size-8 rounded-full" />
                  {copy.home}
                </a>
              </li>
            </ul>
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
