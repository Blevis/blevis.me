/**
 * Lightweight CSS-only stand-in for the 3D canvas. Used on small screens,
 * for reduced-motion users, and as the Suspense fallback while the
 * Three.js chunk loads.
 */
export function HeroGlow({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden
      className={
        compact
          ? "relative mx-auto aspect-square w-[220px] sm:w-[280px]"
          : "relative mx-auto aspect-square w-full max-w-[460px]"
      }
    >
      <div className="glow-drift absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_30%,rgba(6,182,212,0.55),transparent_58%),radial-gradient(circle_at_70%_72%,rgba(139,92,246,0.55),transparent_58%)] blur-3xl" />
      <div
        className="absolute inset-[22%] rotate-12 border border-white/10 bg-white/[0.03] backdrop-blur-sm"
        style={{
          clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 80px -20px rgba(6,182,212,0.6)",
        }}
      />
      <div className="absolute inset-[8%] rounded-full border border-accent/20 [transform:rotateX(70deg)]" />
      <div className="absolute inset-[2%] rounded-full border border-accent-2/15 [transform:rotateX(70deg)_rotateZ(35deg)]" />
    </div>
  );
}
