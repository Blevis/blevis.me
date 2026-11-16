"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { profile } from "@/data/cv";
import { LocalTime } from "./LocalTime";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line/70 pt-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 font-mono text-[11px] text-muted sm:flex-row sm:items-center">
        <p className="flex items-center gap-3">
          <span className="text-fg">{profile.name}</span>
          <span className="h-3 w-px bg-line" aria-hidden />
          <span>
            Tirana <LocalTime className="tabular-nums text-fg/80" />
          </span>
        </p>
        <p>Next.js · React Three Fiber · Framer Motion · Tailwind CSS</p>
        <button
          type="button"
          onClick={toTop}
          className="group inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 transition-colors hover:border-fg/30 hover:text-fg"
        >
          Back to top
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
            ↑
          </span>
        </button>
      </div>

      {/* Giant outlined watermark that rises as the footer scrolls in */}
      <motion.div
        aria-hidden
        style={{ y, opacity }}
        className="text-outline pointer-events-none -mb-[0.22em] mt-6 select-none whitespace-nowrap text-center text-[17vw] font-semibold leading-none tracking-[-0.05em]"
      >
        {profile.name.toUpperCase()}
      </motion.div>
    </footer>
  );
}
