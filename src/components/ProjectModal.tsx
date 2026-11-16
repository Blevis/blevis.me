"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import type { Project } from "@/data/cv";
import { Tag } from "./Section";
import { ArrowUpRightIcon, CloseIcon, GithubIcon } from "./Icons";

export function ProjectModal({
  project,
  origin,
  onClose,
}: {
  project: Project | null;
  origin: { x: number; y: number } | null;
  onClose: () => void;
}) {
  const lenis = useLenis();

  // Esc to close + freeze page scroll while open.
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose, lenis]);

  // Emerge from the card that was clicked.
  const from = origin
    ? { x: origin.x - window.innerWidth / 2, y: origin.y - window.innerHeight / 2 }
    : { x: 0, y: 40 };

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[60] flex items-end justify-center bg-obsidian/70 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.72, x: from.x, y: from.y, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, x: from.x * 0.3, y: from.y * 0.3, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.9 }}
            className="relative flex max-h-[88svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0c0c0f] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-3xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_80%_at_20%_0%,rgba(6,182,212,0.18),transparent_70%),radial-gradient(50%_80%_at_90%_0%,rgba(139,92,246,0.15),transparent_70%)]"
            />
            <div className="relative flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  {project.role}
                  {project.period ? (
                    <span className="text-muted"> · {project.period}</span>
                  ) : null}
                </p>
                <h3
                  id="project-title"
                  className="mt-2 text-xl font-semibold leading-snug tracking-tight text-fg sm:text-2xl"
                >
                  {project.title}
                </h3>
                {project.context ? (
                  <p className="mt-1 text-sm text-muted">{project.context}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.03] text-muted transition-colors hover:border-white/20 hover:text-fg"
              >
                <CloseIcon />
              </button>
            </div>

            <div
              data-lenis-prevent
              className="relative overflow-y-auto px-6 pb-6 pt-5 sm:px-8 sm:pb-8"
            >
              <p className="text-[15px] leading-relaxed text-fg/85">{project.summary}</p>

              <h4 className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Architecture &amp; details
              </h4>
              <ul className="mt-3 flex flex-col gap-2.5">
                {project.details.map((d, i) => (
                  <motion.li
                    key={d}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                    className="relative pl-4 text-[15px] leading-relaxed text-fg/80 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-accent-2/80"
                  >
                    {d}
                  </motion.li>
                ))}
              </ul>

              {project.stack.length > 0 ? (
                <>
                  <h4 className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    Stack
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <Tag key={s} accent>
                        {s}
                      </Tag>
                    ))}
                  </div>
                </>
              ) : null}

              <h4 className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Links
              </h4>
              {project.links.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 text-sm text-fg transition-colors hover:border-white/25 hover:bg-white/[0.06]"
                    >
                      {/github\.com/i.test(l.href) ? <GithubIcon width={14} height={14} /> : null}
                      {l.label}
                      <ArrowUpRightIcon width={12} height={12} />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 font-mono text-xs text-muted">
                  No public links listed for this project yet.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
