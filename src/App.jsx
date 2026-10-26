import { lazy, startTransition, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { SECTION_IDS } from './config/levels.js';
import { useGame } from './context/GameContext.jsx';
import { useActiveSection } from './hooks/useActiveSection.js';
import { useKonami } from './hooks/useKonami.js';
import { refreshScroll } from './lib/motion.js';
import { storage } from './lib/storage.js';

import BootScreen from './components/BootScreen.jsx';
import Confetti from './components/Confetti.jsx';
import Hud from './components/Hud.jsx';
import Interactions from './components/Interactions.jsx';
import ParticleField from './components/ParticleField.jsx';
import PixelCursor from './components/PixelCursor.jsx';
import Toasts from './components/Toasts.jsx';
import WorldMap from './components/WorldMap.jsx';

import About from './sections/About.jsx';
import Certifications from './sections/Certifications.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';
import Hero from './sections/Hero.jsx';
import Projects from './sections/Projects.jsx';
import QuestLog from './sections/QuestLog.jsx';
import Skills from './sections/Skills.jsx';

// the hidden mini-game is only downloaded when someone unlocks it
const KonamiGame = lazy(() => import('./components/KonamiGame.jsx'));

export default function App() {
  const { unlock } = useGame();
  const [booting, setBooting] = useState(() => storage.get('p1-booted') !== '1');
  // Levels below the title screen render in a (time-sliced) transition right after
  // the first paint, so the hero shows up fast and the main thread never blocks long.
  const [levelsReady, setLevelsReady] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const activeId = useActiveSection(SECTION_IDS, levelsReady);
  const shellRef = useRef(null);

  useEffect(() => {
    startTransition(() => setLevelsReady(true));
  }, []);

  // keep the page inert (not focusable) behind the intro screen
  useEffect(() => {
    if (shellRef.current) shellRef.current.inert = booting;
  }, [booting]);

  // scroll-trigger points are measured once; re-measure whenever the page height changes
  useEffect(() => {
    let t;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(refreshScroll, 150);
    });
    ro.observe(document.getElementById('main'));
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  // deep links (e.g. /#projects): the browser jumps before React renders, so redo it once the levels exist
  useEffect(() => {
    if (!levelsReady) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }, [levelsReady]);

  const finishBoot = useCallback(() => {
    storage.set('p1-booted', '1');
    setBooting(false);
    requestAnimationFrame(refreshScroll);
  }, []);

  const openGame = useCallback(() => setGameOpen(true), []);

  const onKonami = useCallback(() => {
    setConfetti(true);
    setGameOpen(true);
    unlock('Cheat code activated!', 'Konami code accepted — enjoy Coin Rush.');
  }, [unlock]);
  useKonami(onKonami);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {booting && <BootScreen onDone={finishBoot} />}

      <div ref={shellRef} className="shell">
        <ParticleField />
        <Hud activeId={activeId} />
        <WorldMap activeId={activeId} />
        <main id="main" tabIndex={-1}>
          <Hero />
          {levelsReady && (
            <>
              <About />
              <Projects />
              <Certifications />
              <Skills />
              <QuestLog />
              <Contact />
            </>
          )}
        </main>
        {levelsReady && <Footer onInsertCoin={openGame} />}
      </div>

      <div className="crt" aria-hidden="true" />
      <PixelCursor />
      <Interactions />
      <Toasts />
      {confetti && <Confetti onDone={() => setConfetti(false)} />}
      {gameOpen && (
        <Suspense fallback={null}>
          <KonamiGame onClose={() => setGameOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
