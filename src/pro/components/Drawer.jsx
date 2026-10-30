import { useEffect, useRef } from 'react';
import { IconClose } from '../icons.jsx';

/**
 * Detail drawer on a native modal <dialog>: inert page, focus containment, Esc and
 * back-gesture dismissal and focus return come from the browser. `closedby="any"` adds
 * click-outside where supported. Slides in from the right (bottom sheet on phones);
 * the last `children` stay mounted while it animates out.
 */
export default function Drawer({ open, onClose, labelledBy, children }) {
  const ref = useRef(null);
  const shown = useRef(null);
  if (open) shown.current = children;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="pro-drawer" aria-labelledby={labelledBy} closedby="any" onClose={onClose}>
      <button type="button" className="pro-drawer-close" onClick={onClose} aria-label="Close details">
        <IconClose />
      </button>
      <div className="pro-drawer-body">{shown.current}</div>
    </dialog>
  );
}
