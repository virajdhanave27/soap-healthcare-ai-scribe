import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  FileText, Search, Plus, CheckCircle2, Clock, Edit3,
  Trash2, Copy, Tag, Calendar, User, ChevronDown, ChevronUp,
  Printer, PenTool, AlertCircle
} from 'lucide-react';

export default function SOAPNotesPage() {
  const { soapNotes, patients, user, updateSOAPNote, deleteSOAPNote, addSOAPNote, addNotification } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewNote, setShowNewNote] = useState(false);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  // New note form
  const [newNote, setNewNote] = useState({
    patientId: '', visitType: 'Follow-up', chiefComplaint: '',
    subjective: '', objective: '', assessment: '', plan: ''
  });

  const filteredNotes = soapNotes.filter(n => {
    const matchSearch = n.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subjective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || n.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-blue-500/20 text-blue-400',
    signed: 'bg-green-500/20 text-green-400',
    amended: 'bg-purple-500/20 text-purple-400',
  };

  const statusIcons: Record<string, typeof FileText> = {
    draft: Edit3,
    completed: CheckCircle2,
    signed: PenTool,
    amended: AlertCircle,
  };

  const handleCreateNote = () => {
    const patient = patients.find(p => p.id === newNote.patientId);
    if (!patient || !user) return;
    addSOAPNote({
      patientId: newNote.patientId,
      patientName: patient.name,
      providerId: user.id,
      providerName: user.name,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      subjective: newNote.subjective,
      objective: newNote.objective,
      assessment: newNote.assessment,
      plan: newNote.plan,
      icdCodes: [], cptCodes: [],
      visitType: newNote.visitType,
      chiefComplaint: newNote.chiefComplaint,
      tags: ['manual'],
    });
    addNotification({ title: 'Note Created', message: `New SOAP note for ${patient.name} created.`, type: 'success' });
    setShowNewNote(false);
    setNewNote({ patientId: '', visitType: 'Follow-up', chiefComplaint: '', subjective: '', objective: '', assessment: '', plan: '' });
  };

  const signNote = (id: string) => {
    updateSOAPNote(id, { status: 'signed' });
    addNotification({ title: 'Note Signed', message: 'SOAP note has been electronically signed.', type: 'success' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary-400" /> SOAP Notes
          </h1>
          <p className="text-dark-400 mt-1">{soapNotes.length} total notes • {soapNotes.filter(n => n.status === 'draft').length} drafts pending</p>
        </div>
        <button onClick={() => setShowNewNote(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-medical-600 hover:from-primary-500 hover:to-medical-500 text-white rounded-xl font-medium text-sm transition">
          <Plus className="w-4 h-4" /> New SOAP Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
            placeholder="Search by patient, complaint, or content..." />
        </div>
        <div className="flex gap-2">
          {['all', 'draft', 'completed', 'signed', 'amended'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition capitalize ${
                filterStatus === s ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* New Note Modal */}
      {showNewNote && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Create New SOAP Note</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm text-dark-400 mb-1">Patient</label>
                <select value={newNote.patientId} onChange={e => setNewNote(p => ({ ...p, patientId: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">Visit Type</label>
                <select value={newNote.visitType} onChange={e => setNewNote(p => ({ ...p, visitType: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                  <option>Follow-up</option><option>New Patient</option><option>Acute Visit</option><option>Annual Physical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">Chief Complaint</label>
                <input type="text" value={newNote.chiefComplaint} onChange={e => setNewNote(p => ({ ...p, chiefComplaint: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  placeholder="Primary complaint" />
              </div>
            </div>
            {['subjective', 'objective', 'assessment', 'plan'].map(field => (
              <div key={field} className="mb-4">
                <label className="block text-sm text-dark-400 mb-1 capitalize">{field}</label>
                <textarea value={(newNote as any)[field]} onChange={e => setNewNote(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500 resize-none"
                  rows={4} placeholder={`Enter ${field}...`} />
              </div>
            ))}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowNewNote(false)} className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-xl text-sm transition">Cancel</button>
              <button onClick={handleCreateNote} disabled={!newNote.patientId}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-medical-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-40">
                Create Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No SOAP notes found</p>
          </div>
        ) : (
          filteredNotes.map(note => {
            const StatusIcon = statusIcons[note.status] || FileText;
            const isExpanded = expandedNote === note.id;
            return (
              <div key={note.id} className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden hover:border-dark-700 transition">
                {/* Header */}
                <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedNote(isExpanded ? null : note.id)}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${statusColors[note.status]?.split(' ')[0] || 'bg-dark-700'}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-white font-semibold">{note.patientName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[note.status]}`}>{note.status}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-dark-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {note.date}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {note.providerName}</span>
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {note.visitType}</span>
                      {note.recordingDuration && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.floor(note.recordingDuration / 60)}:{(note.recordingDuration % 60).toString().padStart(2, '0')}</span>
                      )}
                    </div>
                    <p className="text-dark-500 text-sm mt-1 truncate">{note.chiefComplaint}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {note.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-dark-800 text-dark-400 rounded-full text-xs hidden md:inline">{t}</span>
                    ))}
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-dark-400" /> : <ChevronDown className="w-5 h-5 text-dark-400" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-dark-800 p-5 space-y-4 animate-fade-in">
                    {/* Codes */}
                    {(note.icdCodes.length > 0 || note.cptCodes.length > 0) && (
                      <div className="flex gap-6 flex-wrap">
                        {note.icdCodes.length > 0 && (
                          <div>
                            <span className="text-xs text-dark-500">ICD-10:</span>
                            <div className="flex gap-1 mt-1">{note.icdCodes.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs font-mono">{c}</span>
                            ))}</div>
                          </div>
                        )}
                        {note.cptCodes.length > 0 && (
                          <div>
                            <span className="text-xs text-dark-500">CPT:</span>
                            <div className="flex gap-1 mt-1">{note.cptCodes.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-medical-500/20 text-medical-400 rounded text-xs font-mono">{c}</span>
                            ))}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SOAP Sections */}
                    {[
                      { label: 'Subjective', value: note.subjective, border: 'border-l-blue-500' },
                      { label: 'Objective', value: note.objective, border: 'border-l-green-500' },
                      { label: 'Assessment', value: note.assessment, border: 'border-l-yellow-500' },
                      { label: 'Plan', value: note.plan, border: 'border-l-purple-500' },
                    ].map(s => (
                      <div key={s.label} className={`${s.border} border-l-3 pl-4`}>
                        <h4 className="text-white font-medium text-sm mb-1">{s.label}</h4>
                        <p className="text-dark-400 text-sm whitespace-pre-wrap">{s.value}</p>
                      </div>
                    ))}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-dark-800">
                      {note.status === 'draft' && (
                        <button onClick={() => updateSOAPNote(note.id, { status: 'completed' })}
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Mark Complete
                        </button>
                      )}
                      {(note.status === 'completed' || note.status === 'draft') && (
                        <button onClick={() => signNote(note.id)}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition flex items-center gap-1">
                          <PenTool className="w-3 h-3" /> Sign Note
                        </button>
                      )}
                      <button onClick={() => navigator.clipboard.writeText(`SUBJECTIVE:\n${note.subjective}\n\nOBJECTIVE:\n${note.objective}\n\nASSESSMENT:\n${note.assessment}\n\nPLAN:\n${note.plan}`)}
                        className="px-3 py-1.5 bg-dark-800 text-dark-400 rounded-lg text-xs font-medium hover:bg-dark-700 transition flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      <button onClick={() => window.print()}
                        className="px-3 py-1.5 bg-dark-800 text-dark-400 rounded-lg text-xs font-medium hover:bg-dark-700 transition flex items-center gap-1">
                        <Printer className="w-3 h-3" /> Print
                      </button>
                      <button onClick={() => { if (confirm('Delete this note?')) deleteSOAPNote(note.id); }}
                        className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition flex items-center gap-1 ml-auto">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
