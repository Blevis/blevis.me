"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef, useState, useSyncExternalStore } from "react";
import type { HeroLayout } from "./Hero3D";
import { motion, useInView, type Variants } from "framer-motion";
import { profile } from "@/data/cv";
import { CopyEmailButton, DownloadCVButton } from "./Buttons";
import { HeroGlow } from "./HeroGlow";
import { Magnetic } from "./Magnetic";
import { ScrambleText } from "./ScrambleText";
import { Stats } from "./Stats";
import { useIntroDone } from "./Intro";
import { ArrowUpRightIcon, GithubIcon, LinkedinIcon } from "./Icons";

// Lazy-load the Three.js bundle only when the hero decides to render it.
const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => null,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

const nameContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};

const letter: Variants = {
  hidden: { y: "115%", rotate: 4 },
  show: { y: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } },
};

/** Subscribe to a media query; false during SSR and before hydration. */
function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

let webglCache: boolean | null = null;
function hasWebGL() {
  if (webglCache === null) {
    try {
      const c = document.createElement("canvas");
      webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
}
const noSubscribe = () => () => {};

export function Hero() {
  const motionOk = useMedia("(prefers-reduced-motion: no-preference)");
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL, () => false);
  const wide = useMedia("(min-width: 1024px)");
  const touch = useMedia("(pointer: coarse)");
  const should3D = motionOk && webgl;
  const layout: HeroLayout = wide ? "wide" : "stacked";

  const done = useIntroDone();
  const canvasRef = useRef<HTMLDivElement>(null);
  const inView = useInView(canvasRef, { margin: "100px" });
  const [interacted, setInteracted] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-28">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_40%,rgba(6,182,212,0.10),transparent_70%),radial-gradient(40%_40%_at_20%_80%,rgba(139,92,246,0.08),transparent_70%)]"
      />

      {/* Full-bleed 3D layer. Spans the whole viewport width; the camera rig
          places the object right of the text (desktop) or above it (mobile). */}
      <motion.div
        ref={canvasRef}
        data-cursor={touch ? undefined : "drag"}
        onPointerDown={() => setInteracted(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        className="absolute inset-x-0 top-0 h-[600px] [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)] sm:h-[640px] lg:h-svh lg:min-h-[640px] lg:[mask-image:linear-gradient(to_bottom,#000_70%,transparent_100%)]"
      >
        {should3D ? (
          <Suspense fallback={null}>
            <Hero3D
              active={inView && done}
              layout={layout}
              touch={touch}
              onInteract={() => setInteracted(true)}
            />
          </Suspense>
        ) : (
          <div className="flex h-[440px] items-center justify-center pt-24 lg:ml-auto lg:h-full lg:w-[55%] lg:pt-0">
            <HeroGlow compact={!wide} />
          </div>
        )}
      </motion.div>

      {/* Readability scrim between scene and text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_340px,rgba(9,9,11,0.75)_520px)] lg:bg-[linear-gradient(to_right,rgba(9,9,11,0.85)_0%,rgba(9,9,11,0.55)_38%,transparent_62%)]"
      />

      {/* Content layer lets pointer events fall through to the canvas except on
          the actual text and buttons. */}
      <div className="pointer-events-none relative mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-6xl flex-col justify-center px-6">
        {/* Mobile: keep the top of the hero clear for the object. */}
        <div className="relative h-[290px] shrink-0 sm:h-[330px] lg:hidden">
          {should3D ? (
            <motion.p
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: interacted ? 0 : done ? 1 : 0 }}
              transition={{ duration: 0.6, delay: interacted ? 0 : 1.6 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-muted/80"
            >
              tap to shatter
            </motion.p>
          ) : null}
        </div>

        <div className="relative lg:min-h-[560px] lg:content-center">
          {should3D ? (
            <motion.p
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: interacted ? 0 : done ? 1 : 0 }}
              transition={{ duration: 0.6, delay: interacted ? 0 : 1.6 }}
              className="absolute bottom-0 right-0 hidden w-[36%] text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted/80 lg:block"
            >
              drag to rotate · click to shatter
            </motion.p>
          ) : null}

          {/* Identity */}
          <motion.div
            initial="hidden"
            animate={done ? "show" : "hidden"}
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
            className="pointer-events-auto max-w-xl"
          >
            <motion.p
              variants={item}
              className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-muted"
            >
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {profile.location}
              </span>
              <span className="text-line">/</span>
              <span>BSc AI · expected 2027</span>
            </motion.p>

            <motion.h1
              variants={nameContainer}
              aria-label={profile.name}
              className="text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-fg sm:text-6xl lg:text-7xl"
            >
              {profile.name.split(" ").map((word, wi) => (
                <span
                  key={wi}
                  className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] align-bottom last:mr-0"
                  aria-hidden
                >
                  {word.split("").map((ch, ci) => (
                    <motion.span
                      key={ci}
                      variants={letter}
                      className="inline-block origin-bottom-left will-change-transform"
                    >
                      {ch}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p variants={item} className="mt-4 font-mono text-lg sm:text-xl">
              <span className="bg-gradient-to-r from-accent via-fg to-accent-2 bg-clip-text text-transparent">
                <ScrambleText text={profile.headline} start={done} duration={1400} />
              </span>
            </motion.p>

            <motion.p
              variants={item}
              className="mt-6 text-[15px] leading-relaxed text-muted sm:text-base"
            >
              {profile.summary}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <DownloadCVButton />
              </Magnetic>
              <Magnetic>
                <CopyEmailButton />
              </Magnetic>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href={profile.links.github.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-fg"
              >
                <GithubIcon width={14} height={14} />
                {profile.links.github.label}
                <ArrowUpRightIcon
                  width={12}
                  height={12}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={profile.links.linkedin.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-fg"
              >
                <LinkedinIcon width={13} height={13} />
                LinkedIn
                <ArrowUpRightIcon
                  width={12}
                  height={12}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Headline numbers */}
        <div className="pointer-events-auto mt-14 lg:mt-10">
          <Stats />
        </div>
      </div>
    </section>
  );
}
