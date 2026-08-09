import { useEffect, useState } from 'react';
import { ArrowUpRight, Boxes, Gauge, ScanLine, Sparkles } from 'lucide-react';

export default function LoginStory({ onOpenMotion }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    ['01', 'Stream', 'Your dataset arrives as a live, visual data stream.'],
    ['02', 'Clean', 'Signals, duplicates and missing values are resolved in real time.'],
    ['03', 'See', 'The cleaned result becomes a clear, decision-ready insight.'],
  ];

  useEffect(() => {
    const onScroll = (event) => {
      const target = event.currentTarget;
      const progress = target.scrollTop / Math.max(1, target.scrollHeight - target.clientHeight);
      setActiveStep(Math.min(2, Math.floor(progress * 3)));
    };
    const card = document.querySelector('.app-card');
    card?.addEventListener('scroll', onScroll, { passive: true });
    return () => card?.removeEventListener('scroll', onScroll);
  }, []);

  return <section className="login-story" aria-label="Cleanytics product story">
    <div className="story-intro"><span className="story-kicker"><Sparkles size={13} /> LIVE PRODUCT STORY</span><h2>From raw rows to <span>real-time clarity.</span></h2><p>Scroll through the workflow and see how Cleanytics turns data noise into momentum.</p></div>
    <div className="story-stage">
      <div className="story-orbit orbit-a" /><div className="story-orbit orbit-b" />
      <div className="story-stage-head"><span><span className="live-dot" /> RENDERING LIVE</span><strong>{String((activeStep + 1) * 33).padStart(2, '0')}%</strong></div>
      <div className="story-bars">{[38, 72, 54, 86, 62, 94, 48].map((height, index) => <i key={index} style={{ '--bar-height': `${height}%` }} className={index === activeStep + 2 ? 'is-hot' : ''} />)}</div>
      <div className="story-scan"><ScanLine size={16} /> Live canvas / adaptive rendering</div>
    </div>
    <div className="story-steps">{steps.map(([number, title, text], index) => <article className={activeStep === index ? 'is-active' : ''} key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    <button type="button" className="motion-launch" onClick={onOpenMotion}><Boxes size={17} /> Open AR / VR Motion Graphics <ArrowUpRight size={16} /></button>
  </section>;
}
