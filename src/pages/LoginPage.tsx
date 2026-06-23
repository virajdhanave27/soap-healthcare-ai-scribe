import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Activity, Eye, EyeOff, Lock, Mail, Stethoscope, Shield, Zap, Brain, FileText } from 'lucide-react';

interface LoginPageProps {
  onSwitch: () => void;
}

export default function LoginPage({ onSwitch }: LoginPageProps) {
  const { login } = useStore();
  const [email, setEmail] = useState('demo@mediscribe.ai');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      if (!success) setError('Invalid email or password');
      setLoading(false);
    }, 800);
  };

  const features = [
    { icon: Brain, title: 'AI-Powered Scribe', desc: 'Ambient listening generates clinical notes automatically' },
    { icon: FileText, title: 'SOAP Notes', desc: 'Structured notes with ICD/CPT coding suggestions' },
    { icon: Zap, title: 'Real-time Processing', desc: 'Instant transcription and note generation' },
    { icon: Shield, title: 'HIPAA Compliant', desc: 'Enterprise-grade security and privacy' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-medical-600/20 to-accent-600/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(20,184,166,0.15) 0%, transparent 50%)',
        }} />
        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">MediScribe AI</h1>
              <p className="text-dark-400 text-sm">Clinical Intelligence Platform</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Transform Clinical
            <span className="gradient-text block">Documentation</span>
          </h2>
          <p className="text-dark-400 text-lg mb-10 max-w-md">
            AI-powered ambient clinical scribe that listens, understands, and generates comprehensive SOAP notes in real-time.
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-10 h-10 rounded-lg bg-dark-800/80 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-medical-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{f.title}</h3>
                  <p className="text-dark-400 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-2">
              {['bg-primary-500', 'bg-medical-500', 'bg-accent-500', 'bg-purple-500'].map((bg, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-dark-950 flex items-center justify-center text-white text-xs font-bold`}>
                  {['AM', 'SJ', 'RK', 'LP'][i]}
                </div>
              ))}
            </div>
            <p className="text-dark-400 text-sm">Trusted by <span className="text-white font-semibold">2,500+</span> clinicians</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">MediScribe AI</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-dark-400 mb-8">Sign in to your clinical workspace</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition"
                  placeholder="doctor@hospital.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/50" />
                <span className="text-sm text-dark-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-400 hover:text-primary-300">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-medical-600 hover:from-primary-500 hover:to-medical-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Activity className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">
              Don't have an account?{' '}
              <button onClick={onSwitch} className="text-primary-400 hover:text-primary-300 font-medium">Create account</button>
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-dark-900/50 border border-dark-800">
            <p className="text-dark-500 text-xs mb-2">Demo Credentials:</p>
            <p className="text-dark-400 text-xs">Email: <span className="text-medical-400">demo@mediscribe.ai</span></p>
            <p className="text-dark-400 text-xs">Password: <span className="text-medical-400">demo123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
