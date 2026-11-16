"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { navSections, profile } from "@/data/cv";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/cn";
import { useIntroDone } from "./Intro";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { BAMark } from "./Logo";

const ids = navSections.map((s) => s.id);

export function Nav() {
  const active = useActiveSection(ids);
  const done = useIntroDone();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });

  return (
    <>
      {/* Reading progress */}
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-2 to-accent"
      />

      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3"
        aria-label="Primary"
      >
        <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-white/10 bg-obsidian/60 p-1.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
          <a
            href="#top"
            className="group hidden h-8 items-center rounded-full px-3 text-fg transition-colors hover:bg-white/5 sm:flex"
            aria-label="Back to top"
          >
            <BAMark small className="h-[18px] w-auto transition-colors group-hover:text-accent" />
          </a>
          <ul className="no-scrollbar flex items-center gap-0.5 overflow-x-auto">
            {navSections.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id} className="relative shrink-0">
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative z-10 flex h-8 items-center rounded-full px-3 text-[13px] transition-colors duration-300",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {s.label}
                  </a>
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-full bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      aria-hidden
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
          <span className="mx-1 hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
          <div className="hidden items-center sm:flex">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("palette:open"))}
              aria-label="Open command palette"
              className="flex h-8 items-center gap-1 rounded-full px-2.5 font-mono text-[10px] text-muted transition-colors hover:bg-white/5 hover:text-fg"
            >
              <kbd className="rounded border border-line px-1 py-px text-[9px]">⌘</kbd>
              <kbd className="rounded border border-line px-1 py-px text-[9px]">K</kbd>
            </button>
            <a
              href={profile.links.github.href}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-fg"
            >
              <GithubIcon width={15} height={15} />
            </a>
            <a
              href={profile.links.linkedin.href}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-fg"
            >
              <LinkedinIcon width={14} height={14} />
            </a>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
