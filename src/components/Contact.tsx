import { profile } from "@/data/cv";
import { Reveal } from "./Reveal";
import { CopyEmailButton, DownloadCVButton } from "./Buttons";
import { Magnetic } from "./Magnetic";
import { LocalTime } from "./LocalTime";
import {
  ArrowUpRightIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PinIcon,
} from "./Icons";

const rows = [
  { icon: MailIcon, label: profile.email, href: `mailto:${profile.email}`, external: false },
  {
    icon: GithubIcon,
    label: profile.links.github.label,
    href: profile.links.github.href,
    external: true,
  },
  {
    icon: LinkedinIcon,
    label: profile.links.linkedin.label,
    href: profile.links.linkedin.href,
    external: true,
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-28 py-20 md:py-32"
      aria-labelledby="contact-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(139,92,246,0.10),transparent_70%)]"
      />
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-white/[0.02] px-6 py-12 text-center md:px-12 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_0%,rgba(6,182,212,0.14),transparent_70%)]"
          />
          <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-accent">
            06 <span className="text-muted">—</span> Contact
          </p>
          <h2
            id="contact-title"
            className="relative mt-4 text-3xl font-semibold tracking-tight text-fg md:text-5xl"
          >
            Let&apos;s build something.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
            Open to AI/ML and full-stack engineering work. The fastest way to reach me is email.
          </p>
          <p className="relative mt-6 break-all font-mono text-base text-fg sm:text-lg">
            {profile.email}
          </p>
          <p className="relative mt-2 font-mono text-xs text-muted">
            {profile.location} · <LocalTime className="tabular-nums text-fg/80" /> local
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <CopyEmailButton />
            </Magnetic>
            <Magnetic>
              <DownloadCVButton />
            </Magnetic>
          </div>

          <ul className="relative mx-auto mt-12 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
            {rows.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target={r.external ? "_blank" : undefined}
                  rel={r.external ? "noreferrer" : undefined}
                  className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 font-mono text-xs text-muted transition-colors hover:border-line hover:bg-white/[0.03] hover:text-fg"
                >
                  <r.icon width={14} height={14} className="shrink-0 text-accent" />
                  <span className="truncate">{r.label}</span>
                  <ArrowUpRightIcon
                    width={12}
                    height={12}
                    className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3 px-3 py-2.5 font-mono text-xs text-muted">
              <PinIcon width={14} height={14} className="shrink-0 text-accent" />
              {profile.location}
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
