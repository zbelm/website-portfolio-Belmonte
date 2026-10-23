export const CUBE_FACES = ['</>', 'APP', 'WEB', 'GAME', 'P1', 'LV+'];

/** Lightweight CSS-3D fallback for the Three.js cube (mobile, weak GPUs, reduced motion). */
export default function CssCube() {
  return (
    <div className="css-cube-wrap">
      <div className="css-cube">
        {CUBE_FACES.map((label, i) => (
          <span key={label} className={`css-cube-face f${i}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
