interface TabIntroProps {
  emoji: string;
  title: string;
  body: string;
}

export function TabIntro({ emoji, title, body }: TabIntroProps) {
  return (
    <div className="mb-5 bg-accent/10 border border-accent/20 rounded-[1.25rem] p-4 flex gap-3 items-start">
      <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
      <div>
        <p className="font-bold text-foreground text-sm mb-1">{title}</p>
        <p className="text-xs text-foreground/60 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
