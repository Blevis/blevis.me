import { skills } from "@/data/cv";
import { Section } from "./Section";
import { SpotlightCard } from "./SpotlightCard";
import { Stagger, StaggerItem } from "./Reveal";

export function Skills() {
  return (
    <Section id="skills" index="03" title="Technical Skills">
      <Stagger className="grid gap-4 md:grid-cols-2">
        {skills.map((g, i) => (
          <StaggerItem
            key={g.group}
            className={i === skills.length - 1 ? "md:col-span-2" : undefined}
          >
            <SpotlightCard className="h-full p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                {g.group}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-lg border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-fg/85 transition-colors hover:border-accent/40 hover:text-fg"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
