"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { navSections, profile } from "@/data/cv";
import { cn } from "@/lib/cn";
import { useToast } from "./Toast";
import {
  ArrowUpRightIcon,
  CopyIcon,
  DownloadIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "./Icons";

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Actions" | "Links";
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  run: () => void | Promise<void>;
};

/** Open with Ctrl/⌘ K, or by dispatching a "palette:open" window event. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lenis = useLenis();
  const toast = useToast();

  // Closing always resets the query, so opening never needs to.
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        close();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, [close]);

  useEffect(() => {
    if (open) {
      lenis?.stop();
      const id = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
    lenis?.start();
  }, [open, lenis]);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => {
      if (lenis) lenis.scrollTo(`#${id}`, { offset: -96, duration: 1.4 });
      else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    return [
      ...navSections.map<Command>((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        group: "Navigate",
        icon: ArrowUpRightIcon,
        run: () => go(s.id),
      })),
      {
        id: "copy-email",
        label: "Copy email address",
        hint: profile.email,
        group: "Actions",
        icon: CopyIcon,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            toast(`Copied ${profile.email}`);
          } catch {
            toast("Clipboard blocked. Email is in the contact section.");
          }
        },
      },
      {
        id: "download-cv",
        label: "Download PDF CV",
        hint: profile.cvFileName,
        group: "Actions",
        icon: DownloadIcon,
        run: () => {
          const a = document.createElement("a");
          a.href = profile.cvPdf;
          a.download = profile.cvFileName;
          a.click();
          toast("Downloading CV");
        },
      },
      {
        id: "mail",
        label: "Send an email",
        hint: "opens your mail app",
        group: "Actions",
        icon: MailIcon,
        run: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        hint: profile.links.github.label,
        group: "Links",
        icon: GithubIcon,
        run: () => {
          window.open(profile.links.github.href, "_blank", "noopener");
        },
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: profile.links.linkedin.label,
        group: "Links",
        icon: LinkedinIcon,
        run: () => {
          window.open(profile.links.linkedin.href, "_blank", "noopener");
        },
      },
    ];
  }, [lenis, toast]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q))
    : commands;
  const active = Math.min(index, Math.max(0, filtered.length - 1));

  const runAt = (i: number) => {
    const cmd = filtered[i];
    if (!cmd) return;
    close();
    void cmd.run();
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(active);
    }
  };

  const groups: Command["group"][] = ["Navigate", "Actions", "Links"];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="palette-backdrop"
          className="fixed inset-0 z-[85] bg-obsidian/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="mx-auto mt-[14vh] w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0f] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="font-mono text-xs text-accent">›</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                className="h-12 flex-1 bg-transparent text-sm text-fg placeholder:text-muted/70 focus:outline-none"
              />
              <kbd className="rounded-md border border-line bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-muted">
                esc
              </kbd>
            </div>

            <div data-lenis-prevent className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center font-mono text-xs text-muted">No matches.</p>
              ) : (
                groups.map((g) => {
                  const items = filtered.filter((c) => c.group === g);
                  if (items.length === 0) return null;
                  return (
                    <div key={g} className="mb-1">
                      <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/80">
                        {g}
                      </p>
                      {items.map((c) => {
                        const i = filtered.indexOf(c);
                        const isActive = i === active;
                        const Icon = c.icon;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onMouseEnter={() => setIndex(i)}
                            onClick={() => runAt(i)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                              isActive ? "bg-white/[0.07] text-fg" : "text-fg/80",
                            )}
                          >
                            {Icon ? (
                              <Icon
                                width={14}
                                height={14}
                                className={cn("shrink-0", isActive ? "text-accent" : "text-muted")}
                              />
                            ) : null}
                            <span className="flex-1 truncate">{c.label}</span>
                            {c.hint ? (
                              <span className="truncate font-mono text-[11px] text-muted">
                                {c.hint}
                              </span>
                            ) : null}
                            {isActive ? (
                              <kbd className="font-mono text-[10px] text-muted">↵</kbd>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[10px] text-muted">
              <span>↑↓ navigate · ↵ select</span>
              <span>⌘K / Ctrl K</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
