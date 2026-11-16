"use client";

import { useCallback, useState, type MouseEvent } from "react";
import { projects, type Project } from "@/data/cv";
import { Section, Tag } from "./Section";
import { SpotlightCard } from "./SpotlightCard";
import { TiltCard } from "./TiltCard";
import { Stagger, StaggerItem } from "./Reveal";
import { ProjectModal } from "./ProjectModal";
import { ArrowUpRightIcon } from "./Icons";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const open = (p: Project) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setSelected(p);
  };

  return (
    <Section
      id="projects"
      index="02"
      title="Projects & Research"
      lead="Shipped software, published research, and robotics. Open a card for the details."
    >
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <StaggerItem key={p.slug} className={i === 0 ? "sm:col-span-2" : undefined}>
            <TiltCard>
              <SpotlightCard as="article" className="h-full">
                {/* Full-card hit target that keeps the content semantic. */}
                <button
                  type="button"
                  onClick={open(p)}
                  data-cursor="open"
                  aria-label={`Open details: ${p.title}`}
                  className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
                />
                <div className="flex h-full flex-col p-6 md:p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    {p.role}
                    {p.period ? <span className="text-muted"> · {p.period}</span> : null}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-fg md:text-xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.summary}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <Tag key={s}>{s}</Tag>
                      ))}
                      {p.stack.length === 0 && p.context ? <Tag>{p.context}</Tag> : null}
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted transition-colors group-hover:text-fg">
                      Details
                      <ArrowUpRightIcon
                        width={12}
                        height={12}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
      <ProjectModal project={selected} origin={origin} onClose={close} />
    </Section>
  );
}
