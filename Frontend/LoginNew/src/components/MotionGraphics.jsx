import { ArrowLeft, Maximize2, Move3d, Radio, Rotate3d, Sparkles } from 'lucide-react';

export default function MotionGraphics({ onBack, accent }) {
  return <main className={`motion-page ${accent.className}`}>
    <div className="motion-grid" aria-hidden="true" /><div className="motion-glow motion-glow-one" /><div className="motion-glow motion-glow-two" />
    <header className="motion-header"><button type="button" onClick={onBack}><ArrowLeft size={17} /> Back to login</button><span className="motion-brand"><span>C</span> CLEANYTICS / XR LAB</span><span className="motion-status"><Radio size={14} /> SYSTEM ONLINE</span></header>
    <section className="motion-hero"><div className="motion-copy"><span className="story-kicker"><Sparkles size={13} /> AR / VR MOTION GRAPHICS</span><h1>Data you can <em>feel.</em></h1><p>Explore an immersive visual layer for the Cleanytics cleaning engine—built for spatial dashboards, live signals and human decisions.</p><div className="motion-controls"><span><Move3d size={15} /> Spatial view</span><span><Rotate3d size={15} /> Motion tracked</span><span><Maximize2 size={15} /> Ready to enter</span></div></div><div className="xr-stage"><div className="xr-ring ring-one" /><div className="xr-ring ring-two" /><div className="xr-core"><span>C</span><i /><i /><i /></div><div className="xr-label label-one">ROWS / 125K</div><div className="xr-label label-two">QUALITY / 88%</div><div className="xr-label label-three">CLEAN / LIVE</div></div></section>
    <footer className="motion-footer"><span>REAL-TIME RENDERING ENABLED</span><span>SCROLL / DRAG TO EXPLORE</span></footer>
  </main>;
}
