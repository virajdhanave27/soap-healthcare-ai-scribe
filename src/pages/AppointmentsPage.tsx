import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Calendar, Plus, Clock, User, X, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Trash2
} from 'lucide-react';

export default function AppointmentsPage() {
  const { appointments, patients, user, addAppointment, updateAppointment, deleteAppointment } = useStore();
  const [filterDate, setFilterDate] = useState('2026-01-15');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [form, setForm] = useState({
    patientId: '', date: '2026-01-15', time: '09:00', duration: 30, type: 'Follow-up', notes: ''
  });

  const filtered = appointments.filter(a => {
    const matchDate = !filterDate || a.date === filterDate;
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchDate && matchStatus;
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  const statusColors: Record<string, string> = {
    scheduled: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    'no-show': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const typeColors: Record<string, string> = {
    'Follow-up': 'bg-blue-500',
    'New Patient': 'bg-green-500',
    'Acute Visit': 'bg-orange-500',
    'Annual Physical': 'bg-purple-500',
    'Urgent': 'bg-red-500',
    'Telehealth': 'bg-cyan-500',
  };

  const handleAdd = () => {
    const patient = patients.find(p => p.id === form.patientId);
    if (!patient || !user) return;
    addAppointment({
      patientId: form.patientId,
      patientName: patient.name,
      providerId: user.id,
      providerName: user.name,
      date: form.date,
      time: form.time,
      duration: form.duration,
      type: form.type,
      status: 'scheduled',
      notes: form.notes,
    });
    setShowAddModal(false);
    setForm({ patientId: '', date: '2026-01-15', time: '09:00', duration: 30, type: 'Follow-up', notes: '' });
  };

  const changeDate = (days: number) => {
    const d = new Date(filterDate);
    d.setDate(d.getDate() + days);
    setFilterDate(d.toISOString().split('T')[0]);
  };

  const dayName = new Date(filterDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Calendar view data
  const getWeekDays = () => {
    const start = new Date(filterDate);
    const dow = start.getDay();
    start.setDate(start.getDate() - dow);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  };

  const hours = Array.from({ length: 12 }).map((_, i) => {
    const h = i + 8;
    return `${h.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-purple-400" /> Appointments
          </h1>
          <p className="text-dark-400 mt-1">{appointments.filter(a => a.status === 'scheduled').length} upcoming • {appointments.filter(a => a.status === 'completed').length} completed</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-dark-800 rounded-lg p-0.5">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded text-xs font-medium transition ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-dark-400'}`}>List</button>
            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded text-xs font-medium transition ${viewMode === 'calendar' ? 'bg-primary-600 text-white' : 'text-dark-400'}`}>Calendar</button>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl font-medium text-sm transition">
            <Plus className="w-4 h-4" /> New Appointment
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 flex items-center justify-between">
        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-dark-800 rounded-lg transition text-dark-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-primary-500" />
          <span className="text-white font-medium hidden sm:block">{dayName}</span>
        </div>
        <button onClick={() => changeDate(1)} className="p-2 hover:bg-dark-800 rounded-lg transition text-dark-400 hover:text-white">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
              filterStatus === s ? 'bg-purple-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            }`}>{s.replace('-', ' ')}</button>
        ))}
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-12 text-center">
              <Calendar className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400">No appointments for this date</p>
            </div>
          ) : (
            filtered.map(apt => (
              <div key={apt.id} className="bg-dark-900 border border-dark-800 rounded-xl p-4 hover:border-dark-700 transition flex items-center gap-4">
                <div className={`w-1.5 h-14 rounded-full ${typeColors[apt.type] || 'bg-gray-500'}`} />
                <div className="text-center min-w-[60px]">
                  <p className="text-white font-bold text-lg">{apt.time}</p>
                  <p className="text-dark-500 text-xs">{apt.duration}min</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{apt.patientName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>{apt.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-dark-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {apt.providerName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.type}</span>
                    {apt.date !== filterDate && <span>{apt.date}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  {apt.status === 'scheduled' && (
                    <>
                      <button onClick={() => updateAppointment(apt.id, { status: 'in-progress' })}
                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition" title="Start">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateAppointment(apt.id, { status: 'cancelled' })}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Cancel">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {apt.status === 'in-progress' && (
                    <button onClick={() => updateAppointment(apt.id, { status: 'completed' })}
                      className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition" title="Complete">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => deleteAppointment(apt.id)}
                    className="p-1.5 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-8 border-b border-dark-800">
            <div className="p-3 text-xs text-dark-500 text-center">Time</div>
            {getWeekDays().map(day => (
              <div key={day} className={`p-3 text-center ${day === filterDate ? 'bg-primary-600/10' : ''}`}>
                <p className="text-xs text-dark-500">{new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p className={`text-sm font-bold ${day === filterDate ? 'text-primary-400' : 'text-white'}`}>
                  {new Date(day).getDate()}
                </p>
              </div>
            ))}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-dark-800/50">
                <div className="p-2 text-xs text-dark-500 text-center">{hour}</div>
                {getWeekDays().map(day => {
                  const dayApts = appointments.filter(a => a.date === day && a.time.startsWith(hour.split(':')[0]));
                  return (
                    <div key={day} className={`p-1 min-h-[40px] border-l border-dark-800/50 ${day === filterDate ? 'bg-primary-600/5' : ''}`}>
                      {dayApts.map(a => (
                        <div key={a.id} className={`px-1.5 py-0.5 rounded text-xs mb-0.5 truncate ${typeColors[a.type] || 'bg-gray-500'} bg-opacity-20 text-white`}>
                          {a.patientName.split(' ')[1] || a.patientName}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">New Appointment</h2>
              <button onClick={() => setShowAddModal(false)} className="text-dark-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-400 mb-1">Patient</label>
                <select value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1">Time</label>
                  <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-1">Duration (min)</label>
                  <select value={form.duration} onChange={e => setForm(p => ({ ...p, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                    <option value={15}>15 min</option><option value={30}>30 min</option><option value={45}>45 min</option><option value={60}>60 min</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                    <option>Follow-up</option><option>New Patient</option><option>Acute Visit</option>
                    <option>Annual Physical</option><option>Urgent</option><option>Telehealth</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
                  rows={2} placeholder="Optional notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-xl text-sm transition">Cancel</button>
              <button onClick={handleAdd} disabled={!form.patientId}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-40">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
