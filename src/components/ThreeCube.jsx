/**
 * Three.js hero: a rotating pixel-textured cube with orbiting voxels.
 * - Renders at half resolution + `image-rendering: pixelated` for a chunky retro look
 *   (also halves GPU cost).
 * - Face textures are drawn on tiny canvases with the pixel font, then re-drawn
 *   when the theme changes.
 * - Pauses when off-screen or when the tab is hidden; disposes everything on unmount.
 */
import { useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  NearestFilter,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { play } from '../lib/sound.js';
import CssCube, { CUBE_FACES } from './CssCube.jsx';

const TEX = 40;

function readPalette() {
  const s = getComputedStyle(document.documentElement);
  const v = (name) => s.getPropertyValue(name).trim();
  return {
    ink: v('--on-accent') || '#12062b',
    border: v('--border') || '#b69cff',
    accents: [v('--btn-yellow'), v('--btn-cyan'), v('--btn-pink'), v('--btn-purple')],
  };
}

/** Draw one cube face: accent background, pixel frame, label in the pixel font (alpha-thresholded = crisp). */
function faceTexture(label, bg, ink) {
  const c = document.createElement('canvas');
  c.width = c.height = TEX;
  const g = c.getContext('2d');
  g.fillStyle = bg;
  g.fillRect(0, 0, TEX, TEX);
  g.fillStyle = ink;
  g.fillRect(0, 0, TEX, 3);
  g.fillRect(0, TEX - 3, TEX, 3);
  g.fillRect(0, 0, 3, TEX);
  g.fillRect(TEX - 3, 0, 3, TEX);
  [[6, 6], [TEX - 8, 6], [6, TEX - 8], [TEX - 8, TEX - 8]].forEach(([x, y]) => g.fillRect(x, y, 2, 2));

  // render text on a scratch canvas, then snap alpha so edges stay pixel-sharp
  const t = document.createElement('canvas');
  t.width = t.height = TEX;
  const tg = t.getContext('2d');
  tg.font = '8px "Press Start 2P", monospace';
  tg.textAlign = 'center';
  tg.textBaseline = 'middle';
  tg.fillStyle = '#fff';
  tg.fillText(label, TEX / 2, TEX / 2 + 1);
  const img = tg.getImageData(0, 0, TEX, TEX);
  for (let i = 3; i < img.data.length; i += 4) img.data[i] = img.data[i] > 110 ? 255 : 0;
  tg.putImageData(img, 0, 0);
  tg.globalCompositeOperation = 'source-in';
  tg.fillStyle = ink;
  tg.fillRect(0, 0, TEX, TEX);
  g.drawImage(t, 0, 0);

  const tex = new CanvasTexture(c);
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export default function ThreeCube() {
  const hostRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    let renderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    } catch {
      setFailed(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.max(0.5, (window.devicePixelRatio || 1) * 0.5));
    renderer.domElement.className = 'three-canvas';
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.3, 7);
    scene.add(new AmbientLight(0xffffff, 1.7));
    const sun = new DirectionalLight(0xffffff, 1.3);
    sun.position.set(3, 4, 5);
    scene.add(sun);

    const group = new Group();
    scene.add(group);

    const cubeGeo = new BoxGeometry(1.8, 1.8, 1.8);
    const cube = new Mesh(cubeGeo, new MeshLambertMaterial());
    group.add(cube);
    const edgeGeo = new EdgesGeometry(cubeGeo);
    const edgeMat = new LineBasicMaterial({ color: 0x000000 });
    cube.add(new LineSegments(edgeGeo, edgeMat));

    // orbiting voxels
    const voxGeo = new BoxGeometry(0.22, 0.22, 0.22);
    const voxels = Array.from({ length: 10 }, (_, i) => {
      const mesh = new Mesh(voxGeo, new MeshLambertMaterial());
      mesh.userData = { angle: (i / 10) * Math.PI * 2, radius: 1.75 + (i % 3) * 0.2, speed: 0.4 + (i % 4) * 0.08, y: ((i % 5) - 2) * 0.28 };
      group.add(mesh);
      return mesh;
    });

    let textures = [];
    let faceMats = [];
    let disposed = false;
    const applyTheme = async () => {
      try {
        await document.fonts.load('8px "Press Start 2P"');
      } catch {
        /* font not ready — fallback font is fine */
      }
      if (disposed) return;
      const p = readPalette();
      textures.forEach((t) => t.dispose());
      faceMats.forEach((m) => m.dispose());
      textures = CUBE_FACES.map((label, i) => faceTexture(label, p.accents[i % 4], p.ink));
      faceMats = textures.map((map) => new MeshLambertMaterial({ map }));
      cube.material = faceMats;
      edgeMat.color.set(p.ink);
      voxels.forEach((v, i) => v.material.color.set(p.accents[i % 4]));
    };
    applyTheme();
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // mouse tilt + click to spin
    let tiltX = 0;
    let tiltY = 0;
    let spin = 0;
    const onMove = (e) => {
      tiltY = (e.clientX / window.innerWidth - 0.5) * 0.7;
      tiltX = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    const onClick = () => {
      spin = 0.35;
      play('coin');
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('click', onClick);

    // render loop — only while visible
    let raf = 0;
    let running = false;
    let visible = true;
    let last = performance.now();
    const tick = (now) => {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      cube.rotation.y += dt * (0.6 + spin * 20);
      cube.rotation.x += dt * 0.25;
      spin *= 0.95;
      cube.position.y = Math.sin(now / 600) * 0.08;
      group.rotation.y += (tiltY - group.rotation.y) * 0.05;
      group.rotation.x += (tiltX - group.rotation.x) * 0.05;
      voxels.forEach((v) => {
        const u = v.userData;
        u.angle += dt * u.speed;
        v.position.set(Math.cos(u.angle) * u.radius, u.y + Math.sin(u.angle * 2) * 0.1, Math.sin(u.angle) * u.radius);
        v.rotation.x += dt;
        v.rotation.y += dt;
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    const onVisibility = () => !document.hidden && start();
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      host.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      textures.forEach((t) => t.dispose());
      faceMats.forEach((m) => m.dispose());
      voxels.forEach((v) => v.material.dispose());
      [cubeGeo, edgeGeo, voxGeo].forEach((g) => g.dispose());
      edgeMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) return <CssCube />;
  return <div ref={hostRef} className="three-host" />;
}
