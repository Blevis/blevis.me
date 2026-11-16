import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

export function Section({
  id,
  index,
  title,
  lead,
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-28 py-20 md:py-28", className)}
      aria-labelledby={`${id}-title`}
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal as="header" className="mb-10 md:mb-14">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {index} <span className="text-muted">—</span> {title}
          </p>
          <h2
            id={`${id}-title`}
            className="text-3xl font-semibold tracking-tight text-fg md:text-4xl"
          >
            {title}
          </h2>
          {lead ? (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{lead}</p>
          ) : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function Tag({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] leading-5 tracking-tight",
        accent
          ? "border-accent/25 bg-accent/10 text-accent"
          : "border-line bg-white/[0.03] text-muted",
      )}
    >
      {children}
    </span>
  );
}
