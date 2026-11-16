"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ComponentType, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type TagName = "div" | "section" | "header" | "ul" | "ol" | "li";

// Typed as div props so JSX accepts a single prop shape for every tag.
const tags = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
} as unknown as Record<TagName, ComponentType<HTMLMotionProps<"div">>>;

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: TagName;
}) {
  const Tag = tags[as];
  return (
    <Tag
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: TagName;
}) {
  const Tag = tags[as];
  return (
    <Tag
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px 0px" }}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: TagName;
}) {
  const Tag = tags[as];
  return (
    <Tag variants={staggerItem} className={className}>
      {children}
    </Tag>
  );
}
