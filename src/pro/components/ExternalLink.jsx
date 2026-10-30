import { IconArrowUpRight } from '../icons.jsx';

export default function ExternalLink({ href, className = 'pro-link', children }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      <span>{children}</span>
      <IconArrowUpRight width={16} height={16} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
