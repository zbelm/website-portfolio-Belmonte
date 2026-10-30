/* Inline SVG icons, one stroke style (1.75, round). Decorative by default: pair with visible or sr-only text. */
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

const icon = (children) =>
  function Icon(props) {
    return (
      <svg {...base} {...props}>
        {children}
      </svg>
    );
  };

export const IconSun = icon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
);
export const IconMoon = icon(<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />);
export const IconMenu = icon(<path d="M4 7h16M4 12h16M4 17h16" />);
export const IconClose = icon(<path d="M6 6l12 12M18 6 6 18" />);
export const IconDownload = icon(<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />);
export const IconArrowUpRight = icon(<path d="M7 17 17 7M8 7h9v9" />);
export const IconArrowUp = icon(<path d="M12 19V5m0 0-5 5m5-5 5 5" />);
export const IconCheck = icon(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const IconCopy = icon(
  <>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </>,
);
