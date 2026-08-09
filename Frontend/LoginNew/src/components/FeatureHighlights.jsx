import { BarChart3, Download, ShieldCheck, Zap } from 'lucide-react';

const items = [[ShieldCheck, 'Secure & Private', 'Your data is 100% secure'], [Zap, 'AI Powered', 'Smart cleaning in seconds'], [BarChart3, 'Insightful Dashboards', 'Visualize data instantly'], [Download, 'Download & Export', 'Get cleaned data easily']];

export default function FeatureHighlights({ darkMode }) {
  return <div className={`features ${darkMode ? 'features-dark' : ''}`}>{items.map(([Icon, title, text]) => <div className="feature" key={title}><div className="feature-icon"><Icon size={19} /></div><div><strong>{title}</strong><span>{text}</span></div></div>)}</div>;
}
