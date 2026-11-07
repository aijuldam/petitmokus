/**
 * Product symbols for the Petit Mokus worlds, as data, so the site component
 * and the published sprite (/suite/symbols.svg) draw exactly the same shapes.
 *
 * They are symbols, not logos: the squirrel is the only brand mark. They all
 * share one system: a 24-unit grid, rounded strokes, one soft filled shape
 * plus a little line detail, and no enclosing badge. "simple" is for 24px
 * uses; "full" adds the finer lines from 48px up.
 */
export type SymbolId = "babynaming" | "wishes" | "planit" | "kids" | "cotton";

export interface Shape {
  tag: "path" | "circle" | "ellipse" | "rect";
  cls: "soft" | "line";
  attrs: Record<string, string>;
  /** Drawn only at this detail level; both when absent. */
  only?: "full" | "simple";
}

/** Colours per symbol: the pastel fill and the readable ink (tokens.css). */
export const SYMBOL_COLOURS: Record<SymbolId, { soft: string; ink: string }> = {
  babynaming: { soft: "#d897a8", ink: "#7e3043" },
  wishes: { soft: "#b8cce0", ink: "#2f5578" },
  planit: { soft: "#f2c49b", ink: "#8c4a1f" },
  kids: { soft: "#a6c9b5", ink: "#326748" },
  cotton: { soft: "#fdfdfc", ink: "#6b4f2a" },
};

export const SYMBOLS: Record<SymbolId, Shape[]> = {
  babynaming: [
    { tag: "ellipse", cls: "soft", attrs: { cx: "12", cy: "9.2", rx: "3.7", ry: "4.7" } },
    { tag: "path", cls: "line", attrs: { d: "M3.5 12.5 Q12 22 20.5 12.5" } },
    { tag: "path", cls: "line", attrs: { d: "M8.5 20.8 H15.5" }, only: "full" },
    { tag: "path", cls: "line", attrs: { d: "M19.8 10.6 Q20 7.2 23.2 6.4 Q23.6 9.8 19.8 10.6 Z" }, only: "full" },
  ],
  wishes: [
    { tag: "rect", cls: "soft", attrs: { x: "4", y: "10", width: "16", height: "11", rx: "2.5" } },
    { tag: "path", cls: "line", attrs: { d: "M12 10 V21" } },
    {
      tag: "path",
      cls: "line",
      attrs: { d: "M12 9.5 Q7 9.5 7 6.2 Q7 3.8 9.2 4.4 Q11.2 5.2 12 9.5 Q12.8 5.2 14.8 4.4 Q17 3.8 17 6.2 Q17 9.5 12 9.5 Z" },
    },
    { tag: "path", cls: "line", attrs: { d: "M4 14.5 H20" }, only: "full" },
  ],
  // A small house with two people inside: getting together.
  planit: [
    { tag: "path", cls: "soft", attrs: { d: "M5 11.2 L12 5.4 L19 11.2 V20 Q19 21 18 21 H6 Q5 21 5 20 Z" } },
    { tag: "path", cls: "line", attrs: { d: "M2.6 12.6 L12 4.4 L21.4 12.6" } },
    { tag: "circle", cls: "line", attrs: { cx: "9.4", cy: "13.4", r: "1.2" } },
    { tag: "circle", cls: "line", attrs: { cx: "14.6", cy: "13.4", r: "1.2" } },
    { tag: "path", cls: "line", attrs: { d: "M7.6 21 V18.6 Q7.6 16.6 9.4 16.6 Q11.2 16.6 11.2 18.6 V21 M12.8 21 V18.6 Q12.8 16.6 14.6 16.6 Q16.4 16.6 16.4 18.6 V21" }, only: "full" },
  ],
  kids: [
    { tag: "path", cls: "soft", attrs: { d: "M9 3.5 Q10 10 16.5 11 Q10 12 9 18.5 Q8 12 1.5 11 Q8 10 9 3.5 Z" }, only: "full" },
    {
      tag: "path",
      cls: "soft",
      attrs: { transform: "translate(3 1)", d: "M9 3.5 Q10 10 16.5 11 Q10 12 9 18.5 Q8 12 1.5 11 Q8 10 9 3.5 Z" },
      only: "simple",
    },
    { tag: "path", cls: "line", attrs: { d: "M18.4 7.6 Q20.6 11 18.4 14.4" }, only: "full" },
    { tag: "path", cls: "line", attrs: { d: "M21 5.4 Q24.6 11 21 16.6" }, only: "full" },
  ],
  cotton: [
    { tag: "circle", cls: "soft", attrs: { cx: "8.4", cy: "11.4", r: "4.3" } },
    { tag: "circle", cls: "soft", attrs: { cx: "15.6", cy: "11.4", r: "4.3" } },
    { tag: "circle", cls: "soft", attrs: { cx: "12", cy: "7.2", r: "4.3" } },
    { tag: "path", cls: "line", attrs: { d: "M7.2 16.6 Q12 20.4 16.8 16.6" }, only: "full" },
    { tag: "path", cls: "line", attrs: { d: "M12 18.6 V22" }, only: "full" },
  ],
};

export function shapesFor(id: SymbolId, detail: "simple" | "full"): Shape[] {
  return SYMBOLS[id].filter((s) => !s.only || s.only === detail);
}

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/**
 * The standalone sprite: one <symbol> per product, full detail, with colours
 * as presentation attributes so it renders the same in any app.
 */
export function spriteSvg(): string {
  const symbols = (Object.keys(SYMBOLS) as SymbolId[]).map((id) => {
    const { soft, ink } = SYMBOL_COLOURS[id];
    const shapes = shapesFor(id, "full").map((s) => {
      const paint =
        s.cls === "soft"
          ? `fill="${soft}" stroke="${ink}" stroke-width="1.3" stroke-linejoin="round"`
          : `fill="none" stroke="${ink}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;
      const attrs = Object.entries(s.attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(" ");
      return `    <${s.tag} ${attrs} ${paint}/>`;
    });
    return `  <symbol id="pm-${id}" viewBox="0 0 24 24" overflow="visible">\n${shapes.join("\n")}\n  </symbol>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join("\n")}\n</svg>\n`;
}
