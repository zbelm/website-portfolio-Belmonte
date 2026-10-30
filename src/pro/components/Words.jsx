import { Fragment } from 'react';

/**
 * Splits a heading into words, each inside a clipping mask, so CSS can raise type from its
 * baseline (a typographic reveal instead of a generic fade). Reads as normal text to assistive tech.
 */
export default function Words({ text }) {
  const words = text.split(' ');
  return words.map((w, i) => (
    <Fragment key={`${w}-${i}`}>
      <span className="pro-word" style={{ '--w': i }}>
        <span>{w}</span>
      </span>
      {i < words.length - 1 && ' '}
    </Fragment>
  ));
}
