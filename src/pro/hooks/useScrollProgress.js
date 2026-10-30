import { useEffect } from 'react';

/** Page scroll progress as `transform: scaleX()` on the bar (compositor-only; works without GSAP). */
export function useScrollProgress(barRef) {
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;
    let raf = 0;
    let max = 0;
    const update = () => {
      raf = 0;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // the page height only changes on layout changes, so measure it there, not on every scroll frame
    const ro = new ResizeObserver(() => {
      max = document.documentElement.scrollHeight - window.innerHeight;
      onScroll();
    });
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [barRef]);
}
