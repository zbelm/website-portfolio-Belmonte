import { useEffect, useRef } from 'react';
import { IconClose } from '../icons.jsx';

/**
 * Detail drawer on a native modal <dialog>: inert page, focus containment, Esc and
 * back-gesture dismissal and focus return come from the browser. `closedby="any"` adds
 * click-outside where supported. Slides in from the right (bottom sheet on phones).
 * The caller keeps `children` rendered while `open` goes false so the exit can animate.
 */
export default function Drawer({ open, onClose, labelledBy, resetKey, children }) {
  const ref = useRef(null);
  const bodyRef = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // stepping to another project starts it from the top
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [resetKey]);

  return (
    <dialog ref={ref} className="pro-drawer" aria-labelledby={labelledBy} closedby="any" onClose={onClose}>
      <button type="button" className="pro-drawer-close" onClick={onClose} aria-label="Close details">
        <IconClose />
      </button>
      <div ref={bodyRef} className="pro-drawer-body">{children}</div>
    </dialog>
  );
}
