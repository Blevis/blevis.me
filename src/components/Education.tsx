import { education } from "@/data/cv";
import { Section } from "./Section";
import { Stagger, StaggerItem } from "./Reveal";

export function Education() {
  return (
    <Section id="education" index="04" title="Education">
      <Stagger as="ol" className="relative flex flex-col border-l border-line pl-6 md:pl-10">
        {education.map((e) => (
          <StaggerItem key={e.degree} as="li" className="relative pb-10 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-accent bg-obsidian shadow-[0_0_0_4px_rgba(6,182,212,0.12)] md:-left-[47px]"
            />
            <p className="font-mono text-xs text-muted">{e.period}</p>
            <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-fg md:text-xl">
              {e.degree}
            </h3>
            <p className="mt-0.5 text-sm text-muted">
              {e.institution}
              {e.location ? <span> · {e.location}</span> : null}
            </p>
            {e.bullets.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {e.bullets.map((b) => (
                  <li
                    key={b}
                    className="relative pl-4 text-[15px] leading-relaxed text-fg/80 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-accent/70"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
