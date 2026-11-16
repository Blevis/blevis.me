import type { SVGProps } from "react";

/**
 * BA "Carved" monogram: a solid B with one A cut through it.
 * Masters and usage rules live in /brand. Paths are on a 256 grid; the
 * viewBox crops tightly to the glyph (136 × 192).
 */
const MARK =
  "M56 32 H148 A44 44 0 0 1 148 120 A52 52 0 0 1 148 224 H146 L137.2 182 H90.8 L82 224 H56 Z M114 72 L133.4 164 H94.6 Z";
/** Heavier-counter cut for renders under ~32px tall. */
const MARK_SMALL =
  "M56 32 H148 A44 44 0 0 1 148 120 A52 52 0 0 1 148 224 H140 L132.6 184 H95.4 L88 224 H56 Z M114 80 L128.4 156 H99.6 Z";

export function BAMark({
  small = false,
  title,
  ...props
}: SVGProps<SVGSVGElement> & { small?: boolean; title?: string }) {
  return (
    <svg
      viewBox="56 32 136 192"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path fillRule="evenodd" d={small ? MARK_SMALL : MARK} />
    </svg>
  );
}
