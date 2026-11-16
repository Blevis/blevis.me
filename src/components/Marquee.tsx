import type { CSSProperties } from "react";
import { skills } from "@/data/cv";
import { cn } from "@/lib/cn";

const items = skills.flatMap((g) => g.items);

function Row({ reverse = false, offset = 0 }: { reverse?: boolean; offset?: number }) {
  const ordered = [...items.slice(offset), ...items.slice(0, offset)];
  const list = [...ordered, ...ordered]; // duplicated so -50% translate loops seamlessly
  return (
    <div className="marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <div
        className={cn("marquee-track flex w-max gap-3 py-2", reverse && "marquee-reverse")}
        style={{ "--dur": reverse ? "70s" : "58s" } as CSSProperties}
      >
        {list.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="whitespace-nowrap rounded-full border border-line bg-white/[0.02] px-4 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two counter-scrolling rows of every skill in the CV. */
export function Marquee() {
  return (
    <section aria-label="Skills ticker" className="border-y border-line/60 py-3">
      <Row />
      <Row reverse offset={Math.floor(items.length / 2)} />
    </section>
  );
}
