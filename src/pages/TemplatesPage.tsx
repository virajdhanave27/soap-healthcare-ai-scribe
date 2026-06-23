import { useState } from 'react';
import { useStore } from '../store/useStore';
import { BookTemplate, Plus, Trash2, Copy, X, FileText, Tag } from 'lucide-react';

export default function TemplatesPage() {
  const { templates, addTemplate, deleteTemplate } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', specialty: 'Internal Medicine', visitType: 'Follow-up',
    subjective: '', objective: '', assessment: '', plan: '', isDefault: false
  });

  const handleAdd = () => {
    addTemplate(form);
    setShowAdd(false);
    setForm({ name: '', specialty: 'Internal Medicine', visitType: 'Follow-up', subjective: '', objective: '', assessment: '', plan: '', isDefault: false });
  };

  const copyTemplate = (t: typeof templates[0]) => {
    const text = `TEMPLATE: ${t.name}\nSpecialty: ${t.specialty}\nVisit Type: ${t.visitType}\n\nSUBJECTIVE:\n${t.subjective}\n\nOBJECTIVE:\n${t.objective}\n\nASSESSMENT:\n${t.assessment}\n\nPLAN:\n${t.plan}`;
    navigator.clipboard.writeText(text);
  };

  const selected = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookTemplate className="w-7 h-7 text-orange-400" /> SOAP Note Templates
          </h1>
          <p className="text-dark-400 mt-1">{templates.length} templates available</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white rounded-xl font-medium text-sm transition">
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="space-y-3">
          {templates.map(t => (
            <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
              className={`w-full text-left bg-dark-900 border rounded-xl p-4 transition ${
                selectedTemplate === t.id ? 'border-orange-500/50 bg-orange-500/5' : 'border-dark-800 hover:border-dark-700'
              }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-medium text-sm">{t.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-dark-400 flex items-center gap-1"><Tag className="w-3 h-3" /> {t.specialty}</span>
                    <span className="text-xs text-dark-500">•</span>
                    <span className="text-xs text-dark-400">{t.visitType}</span>
                  </div>
                </div>
                {t.isDefault && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">Default</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                  <p className="text-dark-400 text-sm">{selected.specialty} • {selected.visitType}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyTemplate(selected)}
                    className="px-3 py-1.5 bg-dark-800 text-dark-400 rounded-lg text-xs hover:bg-dark-700 transition flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  {!selected.isDefault && (
                    <button onClick={() => { deleteTemplate(selected.id); setSelectedTemplate(null); }}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Subjective', value: selected.subjective, border: 'border-l-blue-500' },
                  { label: 'Objective', value: selected.objective, border: 'border-l-green-500' },
                  { label: 'Assessment', value: selected.assessment, border: 'border-l-yellow-500' },
                  { label: 'Plan', value: selected.plan, border: 'border-l-purple-500' },
                ].map(s => (
                  <div key={s.label} className={`${s.border} border-l-3 pl-4 py-2`}>
                    <h4 className="text-white font-medium text-sm mb-1">{s.label}</h4>
                    <p className="text-dark-400 text-sm whitespace-pre-wrap font-mono">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-12 text-center">
              <FileText className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400">Select a template to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Template</h2>
              <button onClick={() => setShowAdd(false)} className="text-dark-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-dark-400 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                  placeholder="Template name" />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">Specialty</label>
                <select value={form.specialty} onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                  <option>Internal Medicine</option><option>Family Medicine</option><option>Cardiology</option>
                  <option>Neurology</option><option>Orthopedics</option><option>Pediatrics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">Visit Type</label>
                <select value={form.visitType} onChange={e => setForm(p => ({ ...p, visitType: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500">
                  <option>Follow-up</option><option>New Patient</option><option>Acute</option><option>Annual Physical</option>
                </select>
              </div>
            </div>
            {['subjective', 'objective', 'assessment', 'plan'].map(field => (
              <div key={field} className="mb-4">
                <label className="block text-sm text-dark-400 mb-1 capitalize">{field} Template</label>
                <textarea value={(form as any)[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500 resize-none font-mono"
                  rows={3} placeholder={`Enter ${field} template with [PLACEHOLDERS]...`} />
              </div>
            ))}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-xl text-sm transition">Cancel</button>
              <button onClick={handleAdd} disabled={!form.name}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium transition disabled:opacity-40">
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
