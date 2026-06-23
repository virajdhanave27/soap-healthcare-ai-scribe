import { useStore } from '../store/useStore';
import { BarChart3, Clock, FileText, Users, Activity, ArrowUpRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export default function AnalyticsPage() {
  const { patients } = useStore();

  const monthlyData = [
    { month: 'Jul', notes: 42, appointments: 58, patients: 12 },
    { month: 'Aug', notes: 48, appointments: 65, patients: 15 },
    { month: 'Sep', notes: 55, appointments: 72, patients: 18 },
    { month: 'Oct', notes: 61, appointments: 78, patients: 14 },
    { month: 'Nov', notes: 58, appointments: 70, patients: 10 },
    { month: 'Dec', notes: 67, appointments: 85, patients: 22 },
  ];

  const timeMetrics = [
    { metric: 'Avg Note Time', before: 15.5, after: 3.2, unit: 'min' },
    { metric: 'Documentation Accuracy', before: 82, after: 96, unit: '%' },
    { metric: 'Note Completion Rate', before: 78, after: 98, unit: '%' },
    { metric: 'Time Saved/Day', before: 0, after: 2.4, unit: 'hrs' },
  ];

  const specialtyData = [
    { name: 'Internal Med', value: 35, color: '#3b82f6' },
    { name: 'Cardiology', value: 22, color: '#14b8a6' },
    { name: 'Neurology', value: 15, color: '#f59e0b' },
    { name: 'Pediatrics', value: 12, color: '#8b5cf6' },
    { name: 'Orthopedics', value: 10, color: '#22c55e' },
    { name: 'Other', value: 6, color: '#64748b' },
  ];

  const dailyPattern = [
    { hour: '8AM', notes: 2 }, { hour: '9AM', notes: 5 }, { hour: '10AM', notes: 7 },
    { hour: '11AM', notes: 6 }, { hour: '12PM', notes: 3 }, { hour: '1PM', notes: 4 },
    { hour: '2PM', notes: 8 }, { hour: '3PM', notes: 6 }, { hour: '4PM', notes: 4 },
    { hour: '5PM', notes: 2 },
  ];

  const qualityMetrics = [
    { subject: 'Completeness', A: 95, fullMark: 100 },
    { subject: 'Accuracy', A: 92, fullMark: 100 },
    { subject: 'Timeliness', A: 98, fullMark: 100 },
    { subject: 'Compliance', A: 96, fullMark: 100 },
    { subject: 'Coding', A: 88, fullMark: 100 },
    { subject: 'Detail', A: 94, fullMark: 100 },
  ];

  const topDiagnoses = [
    { diagnosis: 'Essential Hypertension', code: 'I10', count: 34 },
    { diagnosis: 'Type 2 Diabetes', code: 'E11.65', count: 28 },
    { diagnosis: 'Hyperlipidemia', code: 'E78.5', count: 22 },
    { diagnosis: 'Migraine', code: 'G43.009', count: 18 },
    { diagnosis: 'Anxiety Disorder', code: 'F41.1', count: 15 },
    { diagnosis: 'GERD', code: 'K21.0', count: 12 },
    { diagnosis: 'Atrial Fibrillation', code: 'I48.1', count: 10 },
    { diagnosis: 'Hypothyroidism', code: 'E03.9', count: 8 },
  ];

  const kpiCards = [
    { title: 'Total Notes Generated', value: '331', change: '+18%', icon: FileText, color: 'from-primary-500 to-primary-600' },
    { title: 'Active Patients', value: patients.filter(p => p.status === 'active').length.toString(), change: '+12%', icon: Users, color: 'from-accent-500 to-accent-600' },
    { title: 'Avg. Note Time', value: '3.2 min', change: '-79%', icon: Clock, color: 'from-medical-500 to-medical-600' },
    { title: 'AI Accuracy', value: '96.4%', change: '+3.2%', icon: Activity, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-indigo-400" /> Analytics & Insights
        </h1>
        <p className="text-dark-400 mt-1">Performance metrics and clinical documentation analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                {kpi.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-4">{kpi.value}</p>
            <p className="text-sm text-dark-400 mt-1">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">Monthly Trends</h3>
          <p className="text-dark-400 text-sm mb-4">Notes and appointments over 6 months</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gNotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAppts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="notes" stroke="#3b82f6" fill="url(#gNotes)" strokeWidth={2} />
              <Area type="monotone" dataKey="appointments" stroke="#14b8a6" fill="url(#gAppts)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Radar */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">Documentation Quality</h3>
          <p className="text-dark-400 text-sm mb-4">AI-assessed quality metrics</p>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={qualityMetrics}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Quality" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specialty Distribution */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">By Specialty</h3>
          <p className="text-dark-400 text-sm mb-4">Note distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={specialtyData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {specialtyData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {specialtyData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-dark-400">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </div>

        {/* Daily Pattern */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">Daily Pattern</h3>
          <p className="text-dark-400 text-sm mb-4">Notes by hour of day</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyPattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="notes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Savings */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-1">AI Impact</h3>
          <p className="text-dark-400 text-sm mb-4">Before vs. after MediScribe</p>
          <div className="space-y-4">
            {timeMetrics.map((m, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-dark-300 text-sm">{m.metric}</span>
                  <span className="text-white font-bold text-sm">{m.after}{m.unit}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-dark-600 rounded-full" style={{ width: `${(m.before / Math.max(m.before, m.after, 100)) * 100}%` }} />
                  </div>
                  <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-medical-500 rounded-full" style={{ width: `${(m.after / Math.max(m.before, m.after, 100)) * 100}%` }} />
                  </div>
                </div>
                <div className="flex justify-between text-xs mt-0.5">
                  <span className="text-dark-600">Before: {m.before}{m.unit}</span>
                  <span className="text-green-400">After: {m.after}{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Diagnoses */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-1">Top Diagnoses</h3>
        <p className="text-dark-400 text-sm mb-4">Most frequently documented ICD-10 codes</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topDiagnoses.map((d, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-dark-800/50 rounded-xl">
              <span className="text-dark-600 font-bold text-lg w-6">#{i + 1}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{d.diagnosis}</p>
                <p className="text-dark-500 text-xs font-mono">{d.code}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{d.count}</p>
                <p className="text-dark-500 text-xs">notes</p>
              </div>
              <div className="w-20 h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-medical-500 rounded-full" style={{ width: `${(d.count / 34) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
