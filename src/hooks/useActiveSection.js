import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently in the middle of the viewport.
 * `ready` re-subscribes once lazily rendered sections exist.
 */
export function useActiveSection(ids, ready = true) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, ready]);

  return active;
}
