import { lazy, Suspense, useEffect, useState } from 'react';
import { hasWebGL, mightUse3D } from '../lib/device.js';
import CssCube from './CssCube.jsx';

// Three.js (~150 KB gz) is code-split and only requested on capable devices.
const ThreeCube = lazy(() => import('./ThreeCube.jsx'));

/** Hero 3D element: Three.js pixel cube when the device can handle it, CSS cube otherwise. */
export default function HeroCube() {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    if (!mightUse3D()) return undefined;
    // Upgrade CSS cube → WebGL on the visitor's first interaction (then at an idle moment),
    // so 3D never competes with page load / first input.
    const events = ['pointermove', 'scroll', 'keydown', 'touchstart'];
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    let idleId;
    const upgrade = () => {
      events.forEach((e) => window.removeEventListener(e, upgrade));
      idleId = ric(() => hasWebGL() && setUse3D(true), { timeout: 1000 });
    };
    events.forEach((e) => window.addEventListener(e, upgrade, { passive: true, once: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, upgrade));
      if (idleId) cancel(idleId);
    };
  }, []);

  return (
    <div className="cube-stage" aria-hidden="true">
      {use3D ? (
        <Suspense fallback={<CssCube />}>
          <ThreeCube />
        </Suspense>
      ) : (
        <CssCube />
      )}
    </div>
  );
}
