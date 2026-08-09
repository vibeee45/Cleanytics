export default function Background({ darkMode, accent }) {
  return <div className={`background ${darkMode ? 'background-dark' : ''}`} aria-hidden="true">
    <div className="background-grid" />
    <div className={`float-cube cube-one ${accent.className}`} />
    <div className="float-cube cube-two" />
    <div className="signal-orbit orbit-one"><span /></div>
    <div className="signal-orbit orbit-two"><span /></div>
    <svg className="background-lines" viewBox="0 0 1400 800" preserveAspectRatio="none">
      <path d="M0 640 Q300 350 650 520 T1400 120" />
      <path d="M0 90 Q400 350 820 130 T1400 520" />
    </svg>
  </div>;
}
