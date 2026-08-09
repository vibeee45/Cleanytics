export default function Brand({ accent }) {
  return <div className="brand">
    <div className={`brand-mark ${accent.className}`}>C</div>
    <div><strong>Cleanytics</strong><span>Automatic Dataset Cleaner</span></div>
  </div>;
}
