import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Activity, Eye, EyeOff, Lock, Mail, Stethoscope, User, Phone, CreditCard } from 'lucide-react';

interface RegisterPageProps {
  onSwitch: () => void;
}

export default function RegisterPage({ onSwitch }: RegisterPageProps) {
  const { register } = useStore();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'physician' as 'physician' | 'nurse' | 'admin' | 'specialist',
    specialty: '', phone: '', licenseNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = register({
        email: form.email, name: form.name, role: form.role,
        specialty: form.specialty, phone: form.phone, licenseNumber: form.licenseNumber
      }, form.password);
      if (!success) setError('Email already registered');
      setLoading(false);
    }, 800);
  };

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">MediScribe AI</h1>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">Create your account</h2>
        <p className="text-dark-400 mb-6 text-center">Join the future of clinical documentation</p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-500'}`}>
                {s}
              </div>
              {s < 2 && <div className={`w-16 h-0.5 ${step > 1 ? 'bg-primary-600' : 'bg-dark-800'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition"
                    placeholder="Dr. Jane Smith" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition"
                    placeholder="doctor@hospital.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition"
                    placeholder="Min. 6 characters" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition"
                    placeholder="••••••••" required />
                </div>
              </div>

              <button type="button" onClick={() => { if (form.name && form.email && form.password) setStep(2); }}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-medical-600 hover:from-primary-500 hover:to-medical-500 text-white font-semibold rounded-xl transition-all">
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Role</label>
                <select value={form.role} onChange={e => update('role', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition">
                  <option value="physician">Physician</option>
                  <option value="nurse">Nurse Practitioner</option>
                  <option value="specialist">Specialist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Specialty</label>
                <select value={form.specialty} onChange={e => update('specialty', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition">
                  <option value="">Select specialty</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="General Surgery">General Surgery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition"
                    placeholder="(555) 000-0000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">License Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input type="text" value={form.licenseNumber} onChange={e => update('licenseNumber', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition"
                    placeholder="MD-XXXX-XXXXX" />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-xl transition-all">
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-medical-600 hover:from-primary-500 hover:to-medical-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-dark-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-primary-400 hover:text-primary-300 font-medium">Sign in</button>
        </p>
      </div>
    </div>
  );
}
