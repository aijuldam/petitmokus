import { Language, dictionary } from "../lib/i18n";

interface TabAboutProps {
  language: Language;
}

export function TabAbout({ language }: TabAboutProps) {
  const ui = dictionary.ui;
  return (
    <div className="px-6 pt-6 pb-36 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-5">{ui.aboutTitle[language]}</h2>

      <div className="bg-card border border-card-border rounded-[1.25rem] p-5 shadow-sm flex flex-col gap-4">
        <p className="text-[15px] text-foreground/70 leading-relaxed">{ui.aboutP1[language]}</p>
        <p className="text-[15px] text-foreground/70 leading-relaxed">{ui.aboutP2[language]}</p>
        <p className="text-[15px] text-foreground/70 leading-relaxed">{ui.aboutP3[language]}</p>
      </div>
    </div>
  );
}
