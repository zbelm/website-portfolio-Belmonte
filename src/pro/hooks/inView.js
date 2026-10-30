/**
 * "Arrive in view" detection that is correct however the scroll got there (wheel, anchor jump,
 * End key, scrollbar drag, restored position). Unlike a scroll trigger it never misses an element
 * the visitor leapt past, so nothing stays hidden.
 *
 * On the first look at each element:
 *   - on screen, or already above the viewport -> left alone (stays visible, no animation)
 *   - below the fold -> "armed" (`onArm`), then `onIn` when it arrives
 * An armed element that is jumped over entirely is delivered with `instant: true`.
 */
export function watchInView(els, { rootMargin = '0px 0px -8% 0px', onArm, onIn }) {
  const list = [...els];
  if (!list.length) return () => {};
  const seen = new Set();
  const armed = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      const arrived = [];
      for (const e of entries) {
        const el = e.target;
        if (!seen.has(el)) {
          seen.add(el);
          if (!e.isIntersecting && e.boundingClientRect.top > 0) {
            armed.add(el);
            onArm?.(el);
          } else {
            io.unobserve(el);
          }
        } else if (armed.has(el) && (e.isIntersecting || e.boundingClientRect.bottom <= 0)) {
          armed.delete(el);
          io.unobserve(el);
          arrived.push({ el, instant: !e.isIntersecting });
        }
      }
      if (arrived.length) onIn(arrived);
    },
    { rootMargin },
  );
  list.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
