"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Card with a radial cursor spotlight: a soft fill glow plus a brighter
 * 1px border ring that both follow the pointer.
 */
export function SpotlightCard({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const Comp = as;

  return (
    <Comp
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-white/[0.02] transition-colors duration-500 hover:border-white/15",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(560px circle at var(--mx, 50%) var(--my, 50%), rgba(6,182,212,0.11), rgba(139,92,246,0.05) 40%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="spotlight-ring pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(6,182,212,0.7), rgba(139,92,246,0.35) 45%, transparent 70%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </Comp>
  );
}
