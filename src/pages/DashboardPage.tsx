import { useStore } from '../store/useStore';
import {
  Users, FileText, Calendar, Mic, Clock, AlertCircle,
  ArrowUpRight, ArrowDownRight, Activity, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, patients, soapNotes, appointments } = useStore();

  const todayStr = '2026-01-15';
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const completedNotes = soapNotes.filter(n => n.status === 'signed' || n.status === 'completed').length;
  const draftNotes = soapNotes.filter(n => n.status === 'draft').length;
  const criticalPatients = patients.filter(p => p.status === 'critical').length;

  const stats = [
    { title: 'Total Patients', value: patients.length, icon: Users, change: '+12%', up: true, color: 'from-primary-500 to-primary-600' },
    { title: 'SOAP Notes', value: soapNotes.length, icon: FileText, change: '+8%', up: true, color: 'from-medical-500 to-medical-600' },
    { title: "Today's Appointments", value: todayAppts.length, icon: Calendar, change: `${todayAppts.filter(a => a.status === 'completed').length} done`, up: true, color: 'from-accent-500 to-accent-600' },
    { title: 'Avg. Note Time', value: '3.2m', icon: Clock, change: '-45%', up: true, color: 'from-purple-500 to-purple-600' },
  ];

  const weeklyData = [
    { day: 'Mon', notes: 8, appointments: 12 },
    { day: 'Tue', notes: 12, appointments: 15 },
    { day: 'Wed', notes: 10, appointments: 11 },
    { day: 'Thu', notes: 15, appointments: 18 },
    { day: 'Fri', notes: 11, appointments: 14 },
    { day: 'Sat', notes: 4, appointments: 6 },
    { day: 'Sun', notes: 2, appointments: 3 },
  ];

  const noteStatusData = [
    { name: 'Signed', value: completedNotes, color: '#22c55e' },
    { name: 'Draft', value: draftNotes, color: '#f59e0b' },
    { name: 'Completed', value: soapNotes.filter(n => n.status === 'completed').length, color: '#3b82f6' },
  ];

  const visitTypeData = [
    { type: 'Follow-up', count: 45 },
    { type: 'New Patient', count: 18 },
    { type: 'Acute', count: 22 },
    { type: 'Annual', count: 12 },
    { type: 'Urgent', count: 8 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Good morning, {user?.name?.split(' ')[1] || 'Doctor'} 👋</h1>
          <p className="text-dark-400 mt-1">Here's your clinical overview for today</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate('scribe')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white rounded-xl font-medium text-sm transition-all">
            <Mic className="w-4 h-4" /> Start Recording
          </button>
          <button onClick={() => onNavigate('soap-notes')}
            className="flex items-center gap-2 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 text-white rounded-xl font-medium text-sm border border-dark-700 transition">
            <FileText className="w-4 h-4" /> New SOAP Note
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 hover:border-dark-700 transition-all group">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-dark-400 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold">Weekly Activity</h3>
              <p className="text-dark-400 text-sm">Notes & appointments this week</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary-500" /> Notes</span>
              <span className="flex items-center gap-1.5 text-dark-400"><span className="w-2 h-2 rounded-full bg-medical-500" /> Appointments</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="notes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNotes)" strokeWidth={2} />
              <Area type="monotone" dataKey="appointments" stroke="#14b8a6" fillOpacity={1} fill="url(#colorAppts)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Note Status Pie */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-2">Note Status</h3>
          <p className="text-dark-400 text-sm mb-4">Distribution of SOAP notes</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={noteStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {noteStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {noteStatusData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-dark-300">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="text-white font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Today's Schedule</h3>
            <button onClick={() => onNavigate('appointments')} className="text-primary-400 text-sm hover:text-primary-300">View all →</button>
          </div>
          <div className="space-y-3">
            {todayAppts.length === 0 ? (
              <p className="text-dark-500 text-sm py-8 text-center">No appointments today</p>
            ) : (
              todayAppts.map(apt => (
                <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition">
                  <div className="text-center min-w-[50px]">
                    <p className="text-white font-semibold text-sm">{apt.time}</p>
                    <p className="text-dark-500 text-xs">{apt.duration}min</p>
                  </div>
                  <div className="w-px h-10 bg-dark-700" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{apt.patientName}</p>
                    <p className="text-dark-400 text-xs">{apt.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    apt.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    apt.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent SOAP Notes */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent SOAP Notes</h3>
            <button onClick={() => onNavigate('soap-notes')} className="text-primary-400 text-sm hover:text-primary-300">View all →</button>
          </div>
          <div className="space-y-3">
            {soapNotes.slice(0, 4).map(note => (
              <div key={note.id} className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition cursor-pointer">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  note.status === 'signed' ? 'bg-green-500/20' :
                  note.status === 'completed' ? 'bg-blue-500/20' :
                  'bg-yellow-500/20'
                }`}>
                  {note.status === 'signed' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> :
                   note.status === 'draft' ? <FileText className="w-5 h-5 text-yellow-400" /> :
                   <Activity className="w-5 h-5 text-blue-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{note.patientName}</p>
                  <p className="text-dark-400 text-xs">{note.chiefComplaint} • {note.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  note.status === 'signed' ? 'bg-green-500/20 text-green-400' :
                  note.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  note.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {note.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visit Types Bar Chart */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-2">Visit Type Distribution</h3>
        <p className="text-dark-400 text-sm mb-6">Breakdown by appointment type this month</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={visitTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="type" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      {criticalPatients > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Critical Patient Alert</p>
            <p className="text-red-400/70 text-sm">{criticalPatients} patient(s) flagged as critical. Please review immediately.</p>
          </div>
          <button onClick={() => onNavigate('patients')} className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition">
            Review
          </button>
        </div>
      )}
    </div>
  );
}
