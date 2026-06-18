interface PresentationHeroProps {
  title: string;
  subtitle: string;
}

export function PresentationHero({ title, subtitle }: PresentationHeroProps) {
  return (
    <header className="presentation-hero">
      <div>
        <p className="presentation-hero__kicker">Rain Camp Sequence</p>
        <h1>{title}</h1>
        <p className="presentation-hero__subtitle">{subtitle}</p>
      </div>
      <div aria-label="汇报提示框" className="presentation-hero__note-frame" />
    </header>
  );
}
