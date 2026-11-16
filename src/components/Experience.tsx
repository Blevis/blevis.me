import { experience } from "@/data/cv";
import { Section, Tag } from "./Section";
import { SpotlightCard } from "./SpotlightCard";
import { Stagger, StaggerItem } from "./Reveal";
import { Timeline, TimelineNode } from "./Timeline";

export function Experience() {
  return (
    <Section
      id="experience"
      index="01"
      title="Experience"
      lead="From a production system for a municipal government to national-broadcast post-production."
    >
      <Timeline>
        <Stagger as="ol" className="relative flex flex-col gap-4">
          {experience.map((job) => (
            <StaggerItem key={`${job.role}-${job.company}`} as="li" className="relative">
              <TimelineNode />
              <SpotlightCard as="article" className="p-6 md:p-7">
                <div className="grid gap-5 md:grid-cols-[180px_1fr] md:gap-8">
                  <div className="flex flex-col gap-1 font-mono text-xs text-muted">
                    <span className="text-fg/80">{job.period}</span>
                    <span>{job.location}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-fg md:text-xl">
                      {job.role}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{job.company}</p>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {job.bullets.map((b) => (
                        <li
                          key={b}
                          className="relative pl-4 text-[15px] leading-relaxed text-fg/80 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-accent/70"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                    {job.tags.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {job.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Timeline>
    </Section>
  );
}
