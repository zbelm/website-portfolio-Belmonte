import { useRef } from 'react';
import streams from '../data/streams.json';
import { useReveal } from '../hooks/useReveal.js';
import { formatMonth, isPlaceholder } from '../lib/format.js';
import PixelDivider from '../components/PixelDivider.jsx';
import ReplaceTag from '../components/ReplaceTag.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import YouTubeFacade from '../components/YouTubeFacade.jsx';

const channels = streams.channels.filter((c) => c.url);

function VideoCard({ video }) {
  if (video.type === 'youtube' && video.id) {
    return (
      <li className="clip clip-wide panel" data-reveal>
        <YouTubeFacade id={video.id} title={video.title} />
        <p className="clip-title">{video.title}</p>
      </li>
    );
  }
  return (
    <li className="clip panel" data-reveal>
      <a className="clip-link" href={video.url} target="_blank" rel="noopener noreferrer">
        <span className="clip-thumb">
          <img src={video.thumbnail} alt="" loading="lazy" decoding="async" width="360" height="640" />
          <span className="clip-play" aria-hidden="true">
            ▶
          </span>
          <span className="clip-platform">{video.type === 'tiktok' ? 'TikTok' : 'Video'}</span>
        </span>
        <span className="clip-title">{video.title}</span>
        <span className="clip-date">{formatMonth(video.date)}</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {video.placeholder && <ReplaceTag />}
    </li>
  );
}

/** LEVEL 2-2 — Streamer Mode: content creation + streaming. Content: src/data/streams.json */
export default function Streamer() {
  const ref = useRef(null);
  useReveal(ref);
  const live = streams.isLive;

  return (
    <section id="stream" ref={ref} className="section" aria-labelledby="stream-title">
      <PixelDivider color="var(--bg-2)" />
      <div className="container">
        <SectionHeader
          id="stream-title"
          levelId="stream"
          kicker="Content creation & streaming"
          title="Streamer Mode"
          sub="I build games — and I also build an audience around them."
        />

        <div className="stream-top">
          <div className="panel stream-status" data-reveal>
            <p className={`live-badge ${live ? 'is-live' : ''}`}>
              <span className="live-dot" aria-hidden="true" />
              {live ? 'Live now' : 'Offline'}
            </p>
            <h3 className={isPlaceholder(streams.channelName) ? 'is-placeholder' : ''}>{streams.channelName}</h3>
            <p>{streams.about}</p>
            <p className={`stream-schedule ${isPlaceholder(streams.schedule) ? 'is-placeholder' : ''}`}>
              <strong>Schedule:</strong> {streams.schedule}
            </p>
            <div className="stream-links">
              {live && streams.liveUrl && (
                <a className="btn btn-sm btn-pink" href={streams.liveUrl} target="_blank" rel="noopener noreferrer">
                  ● Watch live<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {channels.map((c) => (
                <a key={c.platform} className="btn btn-sm btn-cyan" href={c.url} target="_blank" rel="noopener noreferrer">
                  <span className="key-cap" aria-hidden="true">
                    {c.icon}
                  </span>
                  {c.platform}
                  {c.handle && <span className="btn-handle">{c.handle}</span>}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>

          <div className="panel stream-what" data-reveal>
            <h3>What I stream &amp; post</h3>
            <ul className="pixel-list">
              {streams.whatIStream.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="sub-heading" data-reveal>
          Latest clips
        </h3>
        <ul className="clip-grid">
          {streams.videos.map((v) => (
            <VideoCard key={`${v.title}-${v.date}`} video={v} />
          ))}
        </ul>

        <h3 className="sub-heading" data-reveal>
          Why streaming makes me a better developer
        </h3>
        <div className="why-grid">
          {streams.whyItMatters.map((w, i) => (
            <article key={w.title} className="panel why-card" data-reveal>
              <p className="why-num" aria-hidden="true">
                0{i + 1}
              </p>
              <h4>{w.title}</h4>
              <p>{w.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
