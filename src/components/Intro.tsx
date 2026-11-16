"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { profile } from "@/data/cv";

const IntroContext = createContext(false);

/** True once the intro curtain has lifted (or was skipped). Gate entrance animations on it. */
export function useIntroDone() {
  return useContext(IntroContext);
}

const EASE = [0.16, 1, 0.3, 1] as const;

function Curtain({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const ctrl = animate(0, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => window.setTimeout(onDone, 120),
    });
    return () => {
      ctrl.stop();
      lenis?.start();
    };
  }, [lenis, onDone]);

  const letters = profile.name.split("");

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian"
      initial={{ clipPath: "inset(0 0 0 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.9, ease: EASE }}
      aria-hidden
    >
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="relative">
        <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
          Portfolio
        </p>
        <h1 className="flex overflow-hidden text-4xl font-semibold tracking-[-0.03em] text-fg sm:text-6xl">
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.035 }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </h1>
        <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-2"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
      <p className="absolute bottom-8 right-8 font-mono text-5xl font-medium tabular-nums tracking-tight text-fg/90 sm:text-7xl">
        {String(count).padStart(3, "0")}
      </p>
      <p className="absolute bottom-10 left-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {profile.location}
      </p>
    </motion.div>
  );
}

const noSubscribe = () => () => {};

/** Skip the curtain if it already played this session or the user prefers reduced motion. */
function readSkip(): boolean {
  try {
    if (sessionStorage.getItem("intro-seen") === "1") return true;
  } catch {}
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function IntroProvider({ children }: { children: ReactNode }) {
  // null on the server and during hydration, then the real decision.
  const skip = useSyncExternalStore(noSubscribe, readSkip, () => null);
  const [dismissed, setDismissed] = useState(false);
  const [done, setDone] = useState(false);

  const finish = () => {
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    setDismissed(true);
    window.setTimeout(() => setDone(true), 350);
  };

  return (
    <IntroContext.Provider value={skip === true || done}>
      {children}
      <AnimatePresence>
        {skip === false && !dismissed ? <Curtain key="curtain" onDone={finish} /> : null}
      </AnimatePresence>
      {/* Before hydration decides, keep the page covered to avoid a flash. */}
      {skip === null ? <div aria-hidden className="fixed inset-0 z-[100] bg-obsidian" /> : null}
    </IntroContext.Provider>
  );
}
