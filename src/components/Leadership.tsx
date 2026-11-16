import { conferences, languages, leadership, programs } from "@/data/cv";
import { Section } from "./Section";
import { SpotlightCard } from "./SpotlightCard";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((i) => (
          <li
            key={i}
            className="relative pl-4 text-sm leading-relaxed text-fg/80 before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-accent-2/80"
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Leadership() {
  return (
    <Section
      id="leadership"
      index="05"
      title="Leadership & Community"
      lead="Teaching, team leadership, and public speaking alongside the engineering work."
    >
      <Stagger className="grid gap-4 md:grid-cols-2">
        {leadership.map((l, i) => (
          <StaggerItem key={l.title} className={i === 0 ? "md:col-span-2" : undefined}>
            <SpotlightCard className="h-full p-6">
              <h3 className="text-lg font-semibold tracking-tight text-fg">{l.title}</h3>
              {l.org ? <p className="mt-0.5 text-sm text-muted">{l.org}</p> : null}
              <ul className="mt-4 flex flex-col gap-2.5">
                {l.bullets.map((b) => (
                  <li
                    key={b}
                    className="relative pl-4 text-[15px] leading-relaxed text-fg/80 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-accent/70"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-12 grid gap-8 rounded-2xl border border-line bg-white/[0.015] p-6 md:grid-cols-3 md:p-8">
        <List title="Conferences" items={conferences} />
        <List title="Programs" items={programs} />
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Languages
          </h3>
          <ul className="mt-3 flex flex-col gap-3">
            {languages.map((l) => (
              <li key={l.name}>
                <p className="text-sm font-medium text-fg">{l.name}</p>
                <p className="text-sm leading-relaxed text-muted">{l.level}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
