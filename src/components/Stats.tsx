"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { stats } from "@/data/cv";
import { Stagger, StaggerItem } from "./Reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export function Stats() {
  return (
    <Stagger
      as="div"
      className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line/80 md:grid-cols-4"
    >
      {stats.map((s) => (
        <StaggerItem key={s.label} className="group relative bg-obsidian/90 p-5 md:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_120%,rgba(6,182,212,0.14),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <dl className="relative flex flex-col-reverse">
            <dt className="mt-2 text-xs leading-relaxed text-muted">{s.label}</dt>
            <dd className="font-mono text-3xl font-medium tracking-tight text-fg md:text-4xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </dl>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
