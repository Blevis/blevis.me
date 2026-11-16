"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/** Buttery inertial scrolling on the window; anchor links get the same easing. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        anchors: { offset: -96 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
