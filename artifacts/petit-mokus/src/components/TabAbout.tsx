import { Language } from "../lib/i18n";

interface TabAboutProps {
  language: Language;
}

export function TabAbout({ language: _language }: TabAboutProps) {
  return (
    <div className="px-6 pt-6 pb-36 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-5">About Petit Mokus</h2>

      <div className="bg-card border border-card-border rounded-[1.25rem] p-5 shadow-sm flex flex-col gap-4">
        <p className="text-[15px] text-foreground/70 leading-relaxed">
          Petit Mokus is a gentle digital companion for families, supporting children's growth through calming routines, soothing sounds, and simple learning — wherever life takes you.
        </p>
        <p className="text-[15px] text-foreground/70 leading-relaxed">
          Petit Mokus is multicultural at its core, crafted by a French &amp; Hungarian family in Amsterdam. <em>Mokus</em> means squirrel in Hungarian — a small, curious animal that thrives through play, exploration, and a love of small, meaningful moments. This mirrors the way Petit Mokus turns bedtime songs, quiet sounds, and simple games into building blocks for children's emotional and cognitive development.
        </p>
        <p className="text-[15px] text-foreground/70 leading-relaxed">
          Like a little squirrel gathering nuts, Petit Mokus gathers gentle interactions that help families feel more connected and secure, one small moment at a time.
        </p>
      </div>
    </div>
  );
}
