import { useEffect, useRef } from 'react';

/**
 * Accessible modal built on native <dialog>:
 * focus is trapped, Esc closes, and focus returns to the opener automatically.
 */
export default function Modal({ open, onClose, labelledBy, className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.classList.toggle('is-locked', open);
    return () => document.documentElement.classList.remove('is-locked');
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        // click on the backdrop (outside the inner panel) closes
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="modal-inner">
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
