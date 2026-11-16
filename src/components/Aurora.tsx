/** Slow-drifting colour fields behind the whole page. Pure CSS, transform-only animation. */
export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="aurora-a absolute -left-[10%] top-[-10%] h-[55vh] w-[55vw] rounded-full bg-accent/20 blur-[120px]" />
      <div className="aurora-b absolute right-[-10%] top-[20%] h-[50vh] w-[45vw] rounded-full bg-accent-2/20 blur-[120px]" />
      <div className="aurora-a absolute bottom-[-20%] left-[25%] h-[45vh] w-[50vw] rounded-full bg-accent/10 blur-[140px] [animation-delay:-12s]" />
    </div>
  );
}
