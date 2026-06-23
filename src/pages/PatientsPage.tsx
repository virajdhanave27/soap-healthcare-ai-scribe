import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Users, Search, Plus, Phone, Mail, MapPin, Pill, AlertTriangle,
  ChevronDown, ChevronUp, Edit3, Trash2, X, Shield, Droplets, UserCheck
} from 'lucide-react';

export default function PatientsPage() {
  const { patients, addPatient, updatePatient, deletePatient } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', age: 0, gender: 'Male' as 'Male' | 'Female' | 'Other', dob: '', mrn: '',
    phone: '', email: '', address: '', insurance: '', allergies: '', medications: '',
    conditions: '', bloodType: '', emergencyContact: '', lastVisit: '', status: 'active' as 'active' | 'inactive' | 'critical'
  });

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const resetForm = () => setForm({
    name: '', age: 0, gender: 'Male', dob: '', mrn: '', phone: '', email: '', address: '',
    insurance: '', allergies: '', medications: '', conditions: '', bloodType: '', emergencyContact: '', lastVisit: '', status: 'active'
  });

  const handleAdd = () => {
    addPatient({
      ...form,
      allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
      medications: form.medications.split(',').map(s => s.trim()).filter(Boolean),
      conditions: form.conditions.split(',').map(s => s.trim()).filter(Boolean),
    });
    setShowAddModal(false);
    resetForm();
  };

  const startEdit = (p: typeof patients[0]) => {
    setForm({
      name: p.name, age: p.age, gender: p.gender, dob: p.dob, mrn: p.mrn,
      phone: p.phone, email: p.email, address: p.address, insurance: p.insurance,
      allergies: p.allergies.join(', '), medications: p.medications.join(', '),
      conditions: p.conditions.join(', '), bloodType: p.bloodType,
      emergencyContact: p.emergencyContact, lastVisit: p.lastVisit, status: p.status
    });
    setEditingPatient(p.id);
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingPatient) return;
    updatePatient(editingPatient, {
      ...form,
      allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
      medications: form.medications.split(',').map(s => s.trim()).filter(Boolean),
      conditions: form.conditions.split(',').map(s => s.trim()).filter(Boolean),
    });
    setShowAddModal(false);
    setEditingPatient(null);
    resetForm();
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    critical: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-accent-400" /> Patient Registry
          </h1>
          <p className="text-dark-400 mt-1">{patients.length} patients • {patients.filter(p => p.status === 'critical').length} critical</p>
        </div>
        <button onClick={() => { resetForm(); setEditingPatient(null); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-500 hover:to-accent-600 text-white rounded-xl font-medium text-sm transition">
          <Plus className="w-4 h-4" /> Add Patient
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
            placeholder="Search by name or MRN..." />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'critical', 'inactive'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition capitalize ${
                filterStatus === s ? 'bg-accent-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Patient Cards */}
      <div className="space-y-3">
        {filtered.map(patient => {
          const isExpanded = expandedPatient === patient.id;
          return (
            <div key={patient.id} className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden hover:border-dark-700 transition">
              <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedPatient(isExpanded ? null : patient.id)}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                  patient.status === 'critical' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                  patient.status === 'inactive' ? 'bg-gradient-to-br from-gray-500 to-gray-600' :
                  'bg-gradient-to-br from-accent-500 to-accent-600'
                }`}>
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold">{patient.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                      {patient.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-dark-400 flex-wrap">
                    <span>{patient.age}y {patient.gender}</span>
                    <span>MRN: {patient.mrn}</span>
                    <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {patient.bloodType}</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {patient.insurance}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  {patient.allergies.length > 0 && (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {patient.allergies.length} allergies
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-dark-400" /> : <ChevronDown className="w-5 h-5 text-dark-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-dark-800 p-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contact */}
                    <div>
                      <h4 className="text-dark-500 text-xs uppercase tracking-wider mb-3">Contact</h4>
                      <div className="space-y-2">
                        <p className="text-dark-300 text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-dark-500" /> {patient.phone}</p>
                        <p className="text-dark-300 text-sm flex items-center gap-2"><Mail className="w-4 h-4 text-dark-500" /> {patient.email}</p>
                        <p className="text-dark-300 text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-dark-500" /> {patient.address}</p>
                        <p className="text-dark-300 text-sm flex items-center gap-2"><UserCheck className="w-4 h-4 text-dark-500" /> {patient.emergencyContact}</p>
                      </div>
                    </div>

                    {/* Medical */}
                    <div>
                      <h4 className="text-dark-500 text-xs uppercase tracking-wider mb-3">Medical Info</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-dark-500">Allergies</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {patient.allergies.length > 0 ? patient.allergies.map((a, i) => (
                              <span key={i} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs">{a}</span>
                            )) : <span className="text-dark-600 text-xs">None known</span>}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-dark-500">Conditions</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {patient.conditions.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded text-xs">{c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Medications */}
                    <div>
                      <h4 className="text-dark-500 text-xs uppercase tracking-wider mb-3">Current Medications</h4>
                      <div className="space-y-1">
                        {patient.medications.map((m, i) => (
                          <p key={i} className="text-dark-300 text-sm flex items-center gap-2">
                            <Pill className="w-3 h-3 text-medical-400" /> {m}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 mt-4 border-t border-dark-800">
                    <button onClick={(e) => { e.stopPropagation(); startEdit(patient); }}
                      className="px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-lg text-xs font-medium hover:bg-primary-500/30 transition flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete this patient?')) deletePatient(patient.id); }}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingPatient(null); }} className="text-dark-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'age', label: 'Age', type: 'number' },
                { key: 'dob', label: 'Date of Birth', type: 'date' },
                { key: 'mrn', label: 'MRN', type: 'text' },
                { key: 'phone', label: 'Phone', type: 'tel' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'insurance', label: 'Insurance', type: 'text' },
                { key: 'bloodType', label: 'Blood Type', type: 'text' },
                { key: 'emergencyContact', label: 'Emergency Contact', type: 'text' },
                { key: 'lastVisit', label: 'Last Visit', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-dark-400 mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-dark-400 mb-1">Gender</label>
                <select value={form.gender} onChange={e => setForm(prev => ({ ...prev, gender: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                  <option value="active">Active</option><option value="inactive">Inactive</option><option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-dark-400 mb-1">Address</label>
              <input type="text" value={form.address} onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500" />
            </div>
            {['allergies', 'medications', 'conditions'].map(f => (
              <div key={f} className="mt-4">
                <label className="block text-sm text-dark-400 mb-1 capitalize">{f} (comma separated)</label>
                <input type="text" value={(form as any)[f]} onChange={e => setForm(prev => ({ ...prev, [f]: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                  placeholder={`e.g., Item 1, Item 2, Item 3`} />
              </div>
            ))}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowAddModal(false); setEditingPatient(null); }}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-xl text-sm transition">Cancel</button>
              <button onClick={editingPatient ? handleSaveEdit : handleAdd}
                className="px-4 py-2 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-xl text-sm font-medium transition">
                {editingPatient ? 'Save Changes' : 'Add Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
