import { useEffect, useRef } from 'react';
import profile from '../data/profile.json';
import { useGame } from '../context/GameContext.jsx';
import { loadGsap } from '../lib/motion.js';
import Avatar from '../components/Avatar.jsx';
import HeroCube from '../components/HeroCube.jsx';
import HeroScene from '../components/HeroScene.jsx';
import ResumeButton from '../components/ResumeButton.jsx';
import Typewriter from '../components/Typewriter.jsx';

/**
 * LEVEL START — Title screen.
 * Recruiter test: name, what I do, school, status and the 3 CTAs
 * are all readable in the first screen, inside a solid "dialog box"
 * so the animated scene never hurts contrast.
 */
export default function Hero() {
  const ref = useRef(null);
  const { reducedMotion } = useGame();

  useEffect(() => {
    const hero = ref.current;
    if (!hero || reducedMotion) return undefined;

    // scroll parallax: far layers lag behind, near layers keep up
    let ctx;
    let alive = true;
    loadGsap().then(({ gsap }) => {
      if (!alive) return;
      ctx = gsap.context(() => {
        gsap.utils.toArray('[data-depth]').forEach((layer) => {
          const depth = Number(layer.dataset.depth);
          gsap.to(layer, {
            y: (1 - depth) * 160,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          });
        });
      }, hero);
    });

    // mouse parallax via CSS vars (layers use translate: calc(var(--mx) * var(--d)))
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        hero.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3));
        hero.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3));
      });
    };
    hero.addEventListener('pointermove', onMove);

    return () => {
      alive = false;
      ctx?.revert();
      hero.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <section id="title" ref={ref} className="hero" aria-labelledby="hero-title">
      <HeroScene />

      <div className="container hero-grid">
        <div className="hero-copy panel">
          <p className="hero-kicker">
            <span className="blink" aria-hidden="true">
              ▶
            </span>{' '}
            Player 1 · {profile.class}
          </p>
          <h1 id="hero-title" className="hero-name glitch" data-text={fullName}>
            {profile.firstName} <span className="hero-name-last">{profile.lastName}</span>
          </h1>
          <p className="hero-role">
            <span className="hero-role-label">I&apos;m a</span> <Typewriter words={profile.roles} />
          </p>
          <p className="hero-pitch">{profile.pitch}</p>

          <ul className="hero-facts">
            <li>
              <span className="fact-key">School</span> {profile.courseShort} · {profile.school}
            </li>
            <li>
              <span className="fact-key">Base</span> {profile.location}
            </li>
            <li className="fact-status">
              <span className="pulse-dot" aria-hidden="true" />
              <span className="fact-key">Status</span> {profile.status}
            </li>
          </ul>

          <div className="hero-ctas">
            <ResumeButton />
            <a className="btn btn-cyan" href="#projects">
              View Projects
            </a>
            <a className="btn btn-pink" href="#contact">
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-stage">
          <HeroCube />
          <div className="hero-player">
            <p className="speech" aria-hidden="true">
              Click me!
            </p>
            <Avatar scale={7} />
            <div className="platform" aria-hidden="true" />
          </div>
        </div>
      </div>

      <a href="#about" className="scroll-cue">
        <span>Scroll to start</span>
        <span className="scroll-cue-arrow" aria-hidden="true">
          ▼
        </span>
      </a>
    </section>
  );
}
