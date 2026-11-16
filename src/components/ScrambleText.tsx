"use client";

import { useEffect, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#%&";

/** Decodes `text` from random glyphs, left to right. Renders the real text until `start`. */
export function ScrambleText({
  text,
  start = true,
  duration = 1100,
  className,
}: {
  text: string;
  start?: boolean;
  duration?: number;
  className?: string;
}) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const n = Math.floor(eased * text.length);
      const tail = text
        .slice(n)
        .split("")
        .map((c) => (/[\s·/]/.test(c) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join("");
      setOut(text.slice(0, n) + tail);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, text, duration]);

  return (
    <span className={className} aria-label={text}>
      {out}
    </span>
  );
}
