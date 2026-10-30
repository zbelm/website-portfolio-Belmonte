import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import ModeSwitch from '../../components/ModeSwitch.jsx';
import { fullName, monogram } from '../data.js';
import { NAV } from '../labels.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { IconMenu, IconMoon, IconSun } from '../icons.jsx';
import ResumeLink from './ResumeLink.jsx';

/** Sticky top bar: name, section links with scroll-spy, mode switch, theme toggle; popover menu on small screens. */
export default function ProNav({ activeId }) {
  const { theme, toggleTheme } = useGame();
  const barRef = useRef(null);
  const menuRef = useRef(null);
  const listRef = useRef(null);
  const indRef = useRef(null);
  useScrollProgress(barRef);

  // one indicator that slides to the active link (measured on change/resize only, applied as a transform)
  useEffect(() => {
    const list = listRef.current;
    const ind = indRef.current;
    if (!list || !ind) return undefined;
    const place = () => {
      const a = list.querySelector('a[aria-current="true"]');
      if (!a) return ind.classList.remove('is-on');
      ind.style.transform = `translateX(${a.offsetLeft + 12}px) scaleX(${a.offsetWidth - 24})`;
      ind.classList.add('is-on');
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, [activeId]);

  const closeMenu = () => menuRef.current?.hidePopover?.();
  const themeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  const links = (onClick) =>
    NAV.map((l) => (
      <li key={l.id}>
        <a href={`#${l.id}`} aria-current={activeId === l.id ? 'true' : undefined} onClick={onClick}>
          {l.label}
        </a>
      </li>
    ));

  return (
    <header className="pro-nav">
      <div className="pro-nav-bar pro-container">
        <a className="pro-brand" href="#title" aria-label={`${monogram} ${fullName}, back to top`}>
          <span className="pro-brand-mark" aria-hidden="true">
            {monogram}
          </span>
          <span className="pro-brand-name" aria-hidden="true">
            {fullName}
          </span>
        </a>

        <nav className="pro-nav-links" aria-label="Sections">
          <ul ref={listRef}>
            {links()}
            <li className="pro-nav-ind" ref={indRef} aria-hidden="true" />
          </ul>
        </nav>

        <div className="pro-nav-tools">
          <ModeSwitch className="pro-mode" />
          <button type="button" className="pro-icon-btn" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
          <button type="button" className="pro-icon-btn pro-menu-btn" popovertarget="pro-menu" aria-label="Menu">
            <IconMenu />
          </button>
        </div>
      </div>

      <div className="pro-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>

      <div id="pro-menu" ref={menuRef} popover="auto" className="pro-menu">
        <nav aria-label="Sections (menu)">
          <ul>{links(closeMenu)}</ul>
        </nav>
        <ModeSwitch className="pro-mode-menu" />
        <ResumeLink className="pro-btn pro-btn-secondary" showSize={false} />
      </div>
    </header>
  );
}
