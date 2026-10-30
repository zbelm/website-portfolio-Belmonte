import Words from './Words.jsx';

/** Section title (h2) + optional one-line intro. The heading carries the weight: no eyebrow label. */
export default function SectionHead({ id, title, sub }) {
  return (
    <header className="pro-section-head">
      <h2 id={id} className="pro-h2">
        <Words text={title} />
      </h2>
      {sub && <p className="pro-section-sub">{sub}</p>}
    </header>
  );
}
