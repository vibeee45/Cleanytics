import { Cpu, FileText, Home, PieChart, Settings } from 'lucide-react';

export default function Preview({ darkMode, accent }) {
  return <div className={`preview ${darkMode ? 'preview-dark' : ''}`}>
    <div className="preview-sidebar"><Home size={16} /><PieChart size={16} /><FileText size={16} /><Settings size={16} /></div>
    <div className="preview-chart"><div className="live-indicator"><span /> LIVE DATA STREAM</div><div className="bars"><b /><b className={accent.className} /><b /><b /><b /></div><small>Dataset overview · syncing now</small></div>
    <div className={`ai-badge ${accent.className}`}><Cpu size={14} /> AI POWERED</div>
  </div>;
}
