import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext.jsx';

/**
 * Types, holds, deletes and cycles through `words`.
 * Screen readers get the full list once; reduced motion shows it statically.
 */
export default function Typewriter({ words, typeMs = 70, deleteMs = 35, holdMs = 1500 }) {
  const { reducedMotion } = useGame();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const word = words[index % words.length];
    let t;
    if (!deleting && text === word) {
      t = setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      t = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteMs : typeMs,
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, index, words, typeMs, deleteMs, holdMs, reducedMotion]);

  if (reducedMotion) return <span className="typewriter is-static">{words.join(' · ')}</span>;

  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span className="typewriter" aria-hidden="true">
        {text}
        <span className="caret">_</span>
      </span>
    </>
  );
}
