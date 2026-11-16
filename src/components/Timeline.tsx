"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";

/** Vertical spine whose gradient fill draws itself as you scroll past. */
export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 70%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: 0.3 });

  return (
    <div ref={ref} className="relative pl-8 md:pl-12">
      <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line md:left-[9px]" />
      <motion.div
        aria-hidden
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-accent via-accent-2 to-accent shadow-[0_0_14px_rgba(6,182,212,0.7)] md:left-[9px]"
      />
      {children}
    </div>
  );
}

/** Node on the spine that lights up while its card crosses the viewport centre. */
export function TimelineNode() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  return (
    <span
      ref={ref}
      aria-hidden
      className="absolute -left-8 top-8 flex h-4 w-4 items-center justify-center md:-left-12"
    >
      <motion.span
        animate={{
          scale: inView ? 1 : 0.55,
          opacity: inView ? 1 : 0.4,
          boxShadow: inView
            ? "0 0 0 6px rgba(6,182,212,0.15), 0 0 20px rgba(6,182,212,0.8)"
            : "0 0 0 0px rgba(6,182,212,0), 0 0 0px rgba(6,182,212,0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="block h-2.5 w-2.5 rounded-full bg-accent"
      />
    </span>
  );
}
