import { useState } from 'react';
import { CheckCircle2, KeyRound, Palette, Save, Sun, Moon, UserRound } from 'lucide-react';

export default function Settings({ profileName = 'Lakshya', profileEmail = 'lakshya@example.com', onSaveProfile, isDarkMode, setIsDarkMode, themes, currentTheme, setCurrentTheme }) {
  const [name, setName] = useState(profileName);
  const [email, setEmail] = useState(profileEmail);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwords, setPasswords] = useState({ previous: '', next: '', confirm: '' });

  const updatePassword = (event) => {
    event.preventDefault();
    setPasswordError('');
    if (passwords.next !== passwords.confirm) { setPasswordError('New password and confirm password do not match.'); return; }
    setPasswordSaved(true);
    setPasswords({ previous: '', next: '', confirm: '' });
  };

  return <div className="max-w-3xl mx-auto space-y-6 relative z-10">
    <div><h2 className="text-2xl font-bold">Settings</h2><p className="text-sm text-[rgb(var(--text-s))] mt-1">Manage your profile, security and workspace preferences.</p></div>
    <section className="p-6 rounded-2xl bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] space-y-6">
      <div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-[rgba(var(--c-main-rgb),.12)] text-[var(--c-main)]"><UserRound size={19} /></div><div><h3 className="font-semibold">Profile</h3><p className="text-xs text-[rgb(var(--text-s))] mt-1">Update your personal account details.</p></div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="text-xs text-[rgb(var(--text-s))]">Full name<input value={name} onChange={e => setName(e.target.value)} className="mt-1 !pl-3" /></label><label className="text-xs text-[rgb(var(--text-s))]">Email address<input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 !pl-3" /></label></div>
      <button type="button" onClick={() => { onSaveProfile?.(name, email); setProfileSaved(true); window.setTimeout(() => setProfileSaved(false), 2500); }} className="inline-flex items-center gap-2 rounded-xl bg-[var(--c-main)] px-4 py-2 text-sm font-semibold text-slate-900"><Save size={15} /> Save Profile</button>{profileSaved && <span className="ml-3 text-xs text-[rgb(var(--success))]">Profile saved.</span>}
    </section>
    <section className="p-6 rounded-2xl bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] space-y-5"><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-[rgba(var(--c-main-rgb),.12)] text-[var(--c-main)]"><KeyRound size={19} /></div><div><h3 className="font-semibold">Change Password</h3><p className="text-xs text-[rgb(var(--text-s))] mt-1">Use your previous password to set a new one.</p></div></div><form onSubmit={updatePassword} className="space-y-4"><label className="block text-xs text-[rgb(var(--text-s))]">Previous password<input required type="password" value={passwords.previous} onChange={e => setPasswords({ ...passwords, previous: e.target.value })} className="mt-1 !pl-3" /></label><label className="block text-xs text-[rgb(var(--text-s))]">New password<input required minLength={8} type="password" value={passwords.next} onChange={e => setPasswords({ ...passwords, next: e.target.value })} className="mt-1 !pl-3" /></label><label className="block text-xs text-[rgb(var(--text-s))]">Confirm new password<input required minLength={8} type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className="mt-1 !pl-3" /></label>{passwordError && <p className="text-xs text-rose-400">{passwordError}</p>}<button className="inline-flex items-center gap-2 rounded-xl bg-[var(--c-main)] px-4 py-2 text-sm font-semibold text-slate-900"><KeyRound size={15} /> Update Password</button>{passwordSaved && <span className="ml-3 text-xs text-[rgb(var(--success))]">Password changed successfully.</span>}</form></section>
    <section className="p-6 rounded-2xl bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] space-y-6"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Appearance</h3><p className="text-xs text-[rgb(var(--text-s))] mt-1">Choose how your dashboard looks.</p></div><button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgb(var(--border))] text-sm">{isDarkMode ? <Sun size={15} /> : <Moon size={15} />}{isDarkMode ? 'Light mode' : 'Dark mode'}</button></div><div><h3 className="font-semibold mb-3">Accent color</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Object.values(themes).map(theme => <button key={theme.id} onClick={() => setCurrentTheme(theme)} className="flex items-center gap-2 p-3 rounded-xl border border-[rgb(var(--border))] text-xs"><span className={`w-4 h-4 rounded-full theme-swatch-${theme.id}`} />{theme.name}{currentTheme.id === theme.id && <CheckCircle2 size={14} className="ml-auto text-[var(--c-main)]" />}</button>)}</div></div><div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(var(--c-main-rgb),0.08)] text-sm"><Palette size={18} className="text-[var(--c-main)]" /> Theme changes are saved for this session.</div></section>
  </div>;
}
