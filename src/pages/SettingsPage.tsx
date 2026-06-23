import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Settings, User, Bell, Shield, Palette, Mic, Save,
  Key, Monitor, Volume2, ToggleLeft, ToggleRight, CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile, darkMode, toggleDarkMode } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialty: user?.specialty || '',
    licenseNumber: user?.licenseNumber || '',
  });

  const [preferences, setPreferences] = useState({
    autoSave: true,
    notifications: true,
    emailAlerts: false,
    soundEffects: true,
    autoGenerate: true,
    language: 'en',
    noteFormat: 'detailed',
    recordingQuality: 'high',
  });

  const handleSaveProfile = () => {
    updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'recording', label: 'Recording', icon: Mic },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-dark-400" /> Settings
        </h1>
        <p className="text-dark-400 mt-1">Manage your account and application preferences</p>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm font-medium">Settings saved successfully!</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-primary-600/20 text-primary-400'
                  : 'text-dark-400 hover:bg-dark-800 hover:text-white'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-white font-medium">{user?.name}</h3>
                  <p className="text-dark-400 text-sm">{user?.role} • {user?.specialty}</p>
                  <p className="text-dark-500 text-xs mt-1">Member since {user?.joinDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', type: 'text' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'phone', label: 'Phone', type: 'tel' },
                  { key: 'specialty', label: 'Specialty', type: 'text' },
                  { key: 'licenseNumber', label: 'License Number', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm text-dark-400 mb-1">{f.label}</label>
                    <input type={f.type} value={(profile as any)[f.key]}
                      onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition" />
                  </div>
                ))}
              </div>
              <button onClick={handleSaveProfile}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-medical-600 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition hover:from-primary-500 hover:to-medical-500">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-6">Application Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'autoSave', label: 'Auto-save Notes', desc: 'Automatically save drafts every 30 seconds' },
                  { key: 'autoGenerate', label: 'Auto-generate SOAP Notes', desc: 'Automatically generate notes after recording stops' },
                  { key: 'soundEffects', label: 'Sound Effects', desc: 'Play sounds for recording start/stop and notifications' },
                ].map(pref => (
                  <div key={pref.key} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                    <div>
                      <p className="text-white text-sm font-medium">{pref.label}</p>
                      <p className="text-dark-500 text-xs mt-0.5">{pref.desc}</p>
                    </div>
                    <button onClick={() => setPreferences(p => ({ ...p, [pref.key]: !(p as any)[pref.key] }))}
                      className="text-primary-400">
                      {(preferences as any)[pref.key] ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-dark-600" />}
                    </button>
                  </div>
                ))}
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <label className="block text-white text-sm font-medium mb-2">Default Note Format</label>
                  <select value={preferences.noteFormat} onChange={e => setPreferences(p => ({ ...p, noteFormat: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                    <option value="detailed">Detailed</option><option value="concise">Concise</option><option value="bullet">Bullet Points</option>
                  </select>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <label className="block text-white text-sm font-medium mb-2">Language</label>
                  <select value={preferences.language} onChange={e => setPreferences(p => ({ ...p, language: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                    <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-6">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'Push Notifications', desc: 'Receive in-app notifications', enabled: preferences.notifications },
                  { label: 'Email Alerts', desc: 'Critical alerts sent to your email', enabled: preferences.emailAlerts },
                  { label: 'Appointment Reminders', desc: 'Get reminded before scheduled appointments', enabled: true },
                  { label: 'Note Completion Alerts', desc: 'Notified when AI finishes generating notes', enabled: true },
                  { label: 'Critical Patient Alerts', desc: 'Immediate alerts for critical patient status changes', enabled: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                    <div>
                      <p className="text-white text-sm font-medium">{n.label}</p>
                      <p className="text-dark-500 text-xs mt-0.5">{n.desc}</p>
                    </div>
                    <button className="text-primary-400">
                      {n.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-dark-600" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recording */}
          {activeTab === 'recording' && (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-6">Recording Settings</h2>
              <div className="space-y-4">
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <label className="block text-white text-sm font-medium mb-2">Recording Quality</label>
                  <select value={preferences.recordingQuality} onChange={e => setPreferences(p => ({ ...p, recordingQuality: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                    <option value="high">High (Recommended)</option><option value="medium">Medium</option><option value="low">Low (Save bandwidth)</option>
                  </select>
                  <p className="text-dark-500 text-xs mt-1">Higher quality improves transcription accuracy</p>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-dark-400" />
                    <label className="text-white text-sm font-medium">Noise Suppression</label>
                  </div>
                  <div className="flex gap-2">
                    {['Off', 'Low', 'Medium', 'High'].map(level => (
                      <button key={level} className="px-3 py-1.5 bg-dark-700 text-dark-300 rounded-lg text-xs hover:bg-primary-600 hover:text-white transition">
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-dark-400" />
                    <label className="text-white text-sm font-medium">Speaker Detection</label>
                  </div>
                  <p className="text-dark-500 text-xs mb-2">AI distinguishes between provider and patient voices</p>
                  <button className="text-primary-400"><ToggleRight className="w-8 h-8" /></button>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-6">Security & Privacy</h2>
              <div className="space-y-4">
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="w-4 h-4 text-dark-400" />
                    <label className="text-white text-sm font-medium">Change Password</label>
                  </div>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current password" className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500" />
                    <input type="password" placeholder="New password" className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500" />
                    <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500" />
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition">Update Password</button>
                  </div>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-dark-500 text-xs mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium">Enabled</button>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Session Timeout</p>
                    <p className="text-dark-500 text-xs mt-0.5">Auto-logout after inactivity</p>
                  </div>
                  <select className="px-3 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-white text-xs focus:outline-none">
                    <option>15 min</option><option>30 min</option><option>1 hour</option><option>4 hours</option>
                  </select>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">HIPAA Compliant</span>
                  </div>
                  <p className="text-dark-500 text-xs">All data is encrypted at rest and in transit. PHI handling follows HIPAA guidelines.</p>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white mb-6">Appearance</h2>
              <div className="space-y-4">
                <div className="p-4 bg-dark-800/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-dark-400" />
                    <div>
                      <p className="text-white text-sm font-medium">Dark Mode</p>
                      <p className="text-dark-500 text-xs">Toggle dark/light theme</p>
                    </div>
                  </div>
                  <button onClick={toggleDarkMode} className="text-primary-400">
                    {darkMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-dark-600" />}
                  </button>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <p className="text-white text-sm font-medium mb-3">Accent Color</p>
                  <div className="flex gap-3">
                    {[
                      { color: 'bg-blue-500', name: 'Blue' },
                      { color: 'bg-teal-500', name: 'Teal' },
                      { color: 'bg-green-500', name: 'Green' },
                      { color: 'bg-purple-500', name: 'Purple' },
                      { color: 'bg-orange-500', name: 'Orange' },
                    ].map(c => (
                      <button key={c.name} className={`w-8 h-8 rounded-full ${c.color} hover:ring-2 ring-white/50 transition`} title={c.name} />
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <p className="text-white text-sm font-medium mb-2">Font Size</p>
                  <div className="flex gap-2">
                    {['Small', 'Medium', 'Large'].map(size => (
                      <button key={size} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${size === 'Medium' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-400 hover:bg-dark-600'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
