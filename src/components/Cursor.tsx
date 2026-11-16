"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Mode = "hidden" | "default" | "link" | "drag" | "open";

const QUERY = "(pointer: fine) and (min-width: 1024px)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True for mouse/trackpad users on large screens; false during SSR. */
function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Custom cursor: a crisp dot plus a lagging ring that grows over links,
 * and turns into a labelled disc over the 3D canvas ("Drag") and project
 * cards ("Open"). Desktop pointers only; it also feeds --cx/--cy to CSS.
 */
export function Cursor() {
  const enabled = useFinePointer();
  const [mode, setMode] = useState<Mode>("hidden");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      root.style.setProperty("--cx", `${e.clientX}px`);
      root.style.setProperty("--cy", `${e.clientY}px`);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest?.("[data-cursor], a, button, [role='button']");
      const dc = el?.getAttribute("data-cursor");
      setMode(dc === "drag" ? "drag" : dc === "open" ? "open" : el ? "link" : "default");
    };
    const onLeave = () => setMode("hidden");
    const onEnter = () => setMode("default");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
      root.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const labelled = mode === "drag" || mode === "open";
  const size = labelled ? 76 : mode === "link" ? 44 : 30;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] h-1.5 w-1.5 rounded-full bg-fg mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: mode === "hidden" || labelled ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[94] flex items-center justify-center rounded-full border font-mono text-[9px] font-medium uppercase tracking-[0.22em]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: mode === "hidden" ? 0 : 1,
          backgroundColor: labelled ? "rgba(250,250,250,0.92)" : "rgba(250,250,250,0)",
          borderColor: labelled ? "rgba(250,250,250,0.92)" : "rgba(250,250,250,0.45)",
          color: labelled ? "#09090b" : "#fafafa",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {mode === "drag" ? "Drag" : mode === "open" ? "Open" : ""}
      </motion.div>
    </>
  );
}
