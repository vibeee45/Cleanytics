import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, BarChart3, CheckCircle2, Cpu, Download, Eye, EyeOff,
  FileText, Home, KeyRound, Lock, Mail, Moon, Palette, PieChart,
  Settings, ShieldCheck, Sun, User, UserPlus, Zap, LogIn,
} from 'lucide-react';
import HomeScreen from './screens/home.jsx';
import Brand from './components/Brand.jsx';
import Background from './components/Background.jsx';
import Preview from './components/Preview.jsx';
import FeatureHighlights from './components/FeatureHighlights.jsx';
import LoginStory from './components/LoginStory.jsx';
import MotionGraphics from './components/MotionGraphics.jsx';

const accentConfigs = {
  ocean: { name: 'Ocean Cyan', className: 'accent-ocean', dot: '#06b6d4' },
  sunset: { name: 'Sunset Glow', className: 'accent-sunset', dot: '#f43f5e' },
  amethyst: { name: 'Amethyst', className: 'accent-amethyst', dot: '#a855f7' },
  neon: { name: 'Neon Matrix', className: 'accent-neon', dot: '#22c55e' },
  amber: { name: 'Amber Glow', className: 'accent-amber', dot: '#f59e0b' },
};

const viewFromHash = () => {
  const view = window.location.hash.replace('#/', '').replace('#', '');
  return ['login', 'signup', 'forgot', 'motion'].includes(view) ? view : 'login';
};

function ThemeControls({ darkMode, setDarkMode, colorTheme, setColorTheme, accent }) {
  const [open, setOpen] = useState(false);
  return <div className="theme-controls">
    <div className="palette-wrap">
      <button className="icon-button" type="button" aria-label="Choose accent color" onClick={() => setOpen(!open)}><Palette size={17} /></button>
      {open && <div className="palette-menu">
        <span className="palette-title">Color accent</span>
        {Object.entries(accentConfigs).map(([key, item]) => <button className="palette-option" type="button" key={key} onClick={() => { setColorTheme(key); setOpen(false); }}>
          <i style={{ background: item.dot }} />{item.name}{colorTheme === key && <CheckCircle2 size={15} />}
        </button>)}
      </div>}
    </div>
    <button className="icon-button" type="button" aria-label="Toggle dark mode" onClick={() => { setDarkMode(!darkMode); setOpen(false); }}>
      {darkMode ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  </div>;
}

function AuthForm({ view, setView, darkMode, setDarkMode, colorTheme, setColorTheme, accent, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const setValue = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  useEffect(() => { setShowPassword(false); setError(''); setSubmitted(false); }, [view]);
  const copy = { login: ['Welcome Back', 'Login to access your dashboard and manage datasets.'], signup: ['Create an Account', 'Get started with Cleanytics for free today.'], forgot: ['Reset Password', 'Enter your email address to proceed.'] }[view];
  
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (view === 'signup' && values.password !== values.confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    try {
      if (view === 'forgot') {
        await onSubmit(values.email);
        setSubmitted(true);
      } else {
        await onSubmit(values);
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <div className={`form-card ${darkMode ? 'form-card-dark' : ''}`}>
    <ThemeControls darkMode={darkMode} setDarkMode={setDarkMode} colorTheme={colorTheme} setColorTheme={setColorTheme} accent={accent} />
    <div className="form-heading"><div className={`form-icon ${accent.className}`}>{view === 'login' ? 'C' : view === 'signup' ? <User size={23} /> : <KeyRound size={23} />}</div><h2>{copy[0]}</h2><p>{copy[1]}</p></div>
    {submitted ? <div className="success-state"><CheckCircle2 size={42} /><h3>Instructions Sent!</h3><p>We sent a password reset link to <strong>{values.email}</strong>.</p><button className={`primary-button ${accent.className}`} onClick={() => setView('login')}><ArrowLeft size={15} /> Return to Login</button></div> : <form onSubmit={submit}>
      {view === 'signup' && <Field label="Full Name" icon={User} value={values.name} onChange={(e) => setValue('name', e.target.value)} placeholder="John Doe" darkMode={darkMode} />}
      <Field label={view === 'login' ? 'Email or Username' : 'Email Address'} icon={Mail} type={view === 'login' ? 'text' : 'email'} value={values.email} onChange={(e) => setValue('email', e.target.value)} placeholder={view === 'login' ? 'Enter your email or username' : 'john@example.com'} darkMode={darkMode} />
      {view !== 'forgot' && <div className={view === 'signup' ? 'field-row' : ''}><Field label="Password" icon={Lock} type={showPassword ? 'text' : 'password'} value={values.password} onChange={(e) => setValue('password', e.target.value)} placeholder="••••••••" darkMode={darkMode} /><>{view === 'signup' && <Field label="Confirm" icon={ShieldCheck} type={showPassword ? 'text' : 'password'} value={values.confirm} onChange={(e) => setValue('confirm', e.target.value)} placeholder="••••••••" darkMode={darkMode} />}</></div>}
      {error && <p className="form-error">{error}</p>}
      {view === 'login' && <button type="button" className={`text-link ${accent.className}`} onClick={() => setView('forgot')}>Forgot Password?</button>}
      {view === 'signup' && <button type="button" className={`text-link ${accent.className}`} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={13} /> : <Eye size={13} />} {showPassword ? 'Hide passwords' : 'Show passwords'}</button>}
      <button className={`primary-button ${accent.className}`} disabled={loading}>{loading ? <><Cpu size={15} className="spin" /> Processing...</> : <>{view === 'login' ? <><Lock size={15} /> Login</> : view === 'forgot' ? <><Mail size={15} /> Send Reset Link</> : 'Create Account'}</>}</button>
    </form>}
    {!submitted && view === 'forgot' && <button type="button" className="secondary-button" onClick={() => setView('login')}><ArrowLeft size={15} /> Back to Login</button>}
    {!submitted && view !== 'forgot' && <><div className="divider"><span>or</span></div><button type="button" className="secondary-button switch-button" onClick={() => setView(view === 'login' ? 'signup' : 'login')}>{view === 'login' ? <><UserPlus size={15} /> Create an account <small>Sign Up</small></> : <><LogIn size={15} /> Already have an account? <small>Log in instead</small></>}</button></>}
    <p className="terms">By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</p>
  </div>;
}

function Field({ label, icon: Icon, darkMode, ...props }) { return <label className="field"><span>{label}</span><div className="input-wrap"><Icon size={16} /><input required {...props} /></div></label>; }

export default function App() {
  const [view, setViewState] = useState(viewFromHash);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState(() => window.localStorage.getItem('cleanytics-color-theme') || 'ocean');
  const accent = useMemo(() => accentConfigs[colorTheme], [colorTheme]);
  useEffect(() => { window.localStorage.setItem('cleanytics-color-theme', colorTheme); }, [colorTheme]);
  const setView = (nextView) => { window.location.hash = `/${nextView}`; setViewState(nextView); };
  useEffect(() => { const onHashChange = () => setViewState(viewFromHash()); window.addEventListener('hashchange', onHashChange); return () => window.removeEventListener('hashchange', onHashChange); }, []);
  
  useEffect(() => {
    const token = window.localStorage.getItem('cleanytics_token');
    if (token) {
      fetch('http://127.0.0.1:8000/api/v1/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => {
        if (r.ok) return r.json();
        throw new Error();
      })
      .then(user => {
        setLoggedInEmail(user.email);
        setLoggedIn(true);
      })
      .catch(() => {
        window.localStorage.removeItem('cleanytics_token');
      });
    }
  }, []);

  const content = { login: ['Clean Data.', 'Smarter', 'Insights.', 'Upload your dataset, let AI clean it automatically and generate powerful dashboards in seconds.'], signup: ['Join Us.', 'Elevate', 'Your Data.', 'Create a free account and start transforming messy spreadsheets into powerful insights.'], forgot: ['Account Recovery.', 'Reset Your', 'Password.', 'Enter your email address to receive secure password reset instructions.'] }[view];
  if (view === 'motion') return <MotionGraphics accent={accent} onBack={() => setView('login')} />;
  
  if (loggedIn) return <HomeScreen 
    email={loggedInEmail} 
    initialThemeId={colorTheme} 
    initialDarkMode={darkMode} 
    onThemeChange={setColorTheme} 
    onLogout={() => {
      window.localStorage.removeItem('cleanytics_token');
      setLoggedIn(false);
    }} 
  />;

  const handleAuthSubmit = async (values) => {
    const baseUrl = 'http://127.0.0.1:8000/api/v1';
    if (view === 'login') {
      const resp = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      window.localStorage.setItem('cleanytics_token', data.access_token);
      setLoggedInEmail(values.email);
      setLoggedIn(true);
    } else if (view === 'signup') {
      const resp = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password, full_name: values.name }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      // Automate login on successful signup
      const loginResp = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const loginData = await loginResp.json();
      if (loginResp.ok) {
        window.localStorage.setItem('cleanytics_token', loginData.access_token);
        setLoggedInEmail(values.email);
        setLoggedIn(true);
      } else {
        setView('login');
      }
    } else if (view === 'forgot') {
      const resp = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.detail || 'Failed to request password reset');
      }
    }
  };

  return <main className={`app-shell ${darkMode ? 'dark' : ''} ${accent.className}`}><Background darkMode={darkMode} accent={accent} /><section className="app-card"><div className="content-grid"><div className="intro"><Brand accent={accent} /><div className="intro-copy"><h1>{content[0]}<br /><span className={accent.className}>{content[1]}</span> {content[2]}</h1><p>{content[3]}</p></div><Preview darkMode={darkMode} accent={accent} /></div><div className="form-column"><AuthForm view={view} setView={setView} darkMode={darkMode} setDarkMode={setDarkMode} colorTheme={colorTheme} setColorTheme={setColorTheme} accent={accent} onSubmit={handleAuthSubmit} /></div></div><FeatureHighlights darkMode={darkMode} /><LoginStory onOpenMotion={() => setView('motion')} /></section></main>;
}
