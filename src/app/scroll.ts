const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function scrollToTop(duration = 600) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = window.scrollY;
  if (reduce || start === 0 || duration <= 0) {
    window.scrollTo(0, 0);
    return;
  }
  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start * (1 - easeInOutCubic(p)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
