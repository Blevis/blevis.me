"use client";

import { useState } from "react";
import { profile } from "@/data/cv";
import { cn } from "@/lib/cn";
import { useToast } from "./Toast";
import { CheckIcon, CopyIcon, DownloadIcon } from "./Icons";

const baseBtn =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out active:scale-[0.97]";

export function DownloadCVButton({ className }: { className?: string }) {
  return (
    <a
      href={profile.cvPdf}
      download={profile.cvFileName}
      className={cn(
        baseBtn,
        "bg-fg text-obsidian shadow-[0_0_0_1px_rgba(250,250,250,0.1),0_8px_24px_-8px_rgba(250,250,250,0.35)] hover:bg-white hover:shadow-[0_0_0_1px_rgba(250,250,250,0.2),0_12px_32px_-8px_rgba(6,182,212,0.45)]",
        className,
      )}
    >
      <DownloadIcon className="transition-transform duration-300 group-hover:translate-y-0.5" />
      Download PDF CV
    </a>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  }
}

export function CopyEmailButton({
  className,
  label = "Copy Email",
}: {
  className?: string;
  label?: string;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const ok = await copyText(profile.email);
    if (ok) {
      toast(`Copied ${profile.email}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } else {
      toast("Copy failed. The email is in the contact section.");
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        baseBtn,
        "border border-line bg-white/[0.02] text-fg hover:border-fg/30 hover:bg-white/[0.05]",
        className,
      )}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <CopyIcon
          className={cn(
            "absolute transition-all duration-300",
            copied ? "scale-50 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <CheckIcon
          className={cn(
            "absolute text-accent transition-all duration-300",
            copied ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>
      {copied ? "Copied" : label}
    </button>
  );
}
