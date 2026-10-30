import { useLayoutEffect, useRef } from 'react';
import { SITE } from '../config/site.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { SECTION_IDS } from './labels.js';
import { usePageMotion } from './hooks/usePageMotion.js';
import { IconArrowUp } from './icons.jsx';
import ProNav from './components/ProNav.jsx';

import About from './sections/About.jsx';
import Certifications from './sections/Certifications.jsx';
import Contact from './sections/Contact.jsx';
import Experience from './sections/Experience.jsx';
import Hero from './sections/Hero.jsx';
import Projects from './sections/Projects.jsx';
import Skills from './sections/Skills.jsx';

import './styles/pro-tokens.css';
import './styles/pro.css';

/**
 * Professional mode: the same content as Player One (src/data/*.json, config/site.js),
 * presented as a calm, recruiter-friendly page. Loaded lazily; see App.jsx.
 * Section ids match Player One's so #hash links and scroll position carry across modes.
 */
export default function ProApp() {
  const rootRef = useRef(null);
  const activeId = useActiveSection(SECTION_IDS);
  usePageMotion(rootRef);

  // deep links (e.g. /?mode=pro#projects): the browser jumped before this tree existed
  useLayoutEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, []);

  return (
    <div ref={rootRef} className="pro-app">
      <a className="pro-skip" href="#main">
        Skip to content
      </a>
      <ProNav activeId={activeId} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <footer className="pro-footer">
        <div className="pro-container pro-footer-inner">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <a href="#title" className="pro-link">
            <IconArrowUp width={16} height={16} />
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}
