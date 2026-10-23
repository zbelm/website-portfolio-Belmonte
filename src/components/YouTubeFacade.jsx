import { useState } from 'react';

/**
 * Lightweight YouTube embed: shows the thumbnail + play button and
 * only loads the (heavy) iframe after a click. Big Lighthouse win.
 */
export default function YouTubeFacade({ id, title }) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button type="button" className="video-frame video-facade" onClick={() => setActive(true)}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" width="480" height="360" />
      <span className="video-play" aria-hidden="true">
        ▶
      </span>
      <span className="sr-only">Play video: {title}</span>
    </button>
  );
}
