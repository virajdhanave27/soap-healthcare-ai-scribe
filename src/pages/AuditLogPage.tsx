import { useState } from 'react';
import { ClipboardList, Search, Shield, FileText, User, Clock } from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export default function AuditLogPage() {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const auditLog: AuditEntry[] = [
    { id: '1', timestamp: '2025-12-22 14:32:15', user: 'Dr. Alex Morgan', action: 'SOAP Note Created', resource: 'Emily Rodriguez - SN#003', details: 'AI-generated SOAP note from ambient recording (8:54 duration)', ipAddress: '192.168.1.105', severity: 'info' },
    { id: '2', timestamp: '2025-12-22 14:20:00', user: 'Dr. Alex Morgan', action: 'Recording Started', resource: 'Session for Emily Rodriguez', details: 'Ambient clinical scribe recording initiated', ipAddress: '192.168.1.105', severity: 'info' },
    { id: '3', timestamp: '2025-12-20 16:45:30', user: 'Dr. Alex Morgan', action: 'Note Signed', resource: 'Sarah Johnson - SN#001', details: 'Electronic signature applied to SOAP note', ipAddress: '192.168.1.105', severity: 'info' },
    { id: '4', timestamp: '2025-12-20 15:30:12', user: 'Dr. Alex Morgan', action: 'Note Modified', resource: 'Sarah Johnson - SN#001', details: 'Assessment section updated, Metformin dosage adjusted in plan', ipAddress: '192.168.1.105', severity: 'info' },
    { id: '5', timestamp: '2025-12-20 10:15:00', user: 'Dr. Alex Morgan', action: 'Patient Record Accessed', resource: 'Sarah Johnson - MRN-001234', details: 'Full patient record viewed during appointment', ipAddress: '192.168.1.105', severity: 'info' },
    { id: '6', timestamp: '2025-12-19 09:00:00', user: 'System', action: 'Failed Login Attempt', resource: 'Account: admin@mediscribe.ai', details: '3 failed login attempts detected from unknown IP', ipAddress: '203.0.113.42', severity: 'warning' },
    { id: '7', timestamp: '2025-12-18 17:00:00', user: 'Dr. Alex Morgan', action: 'Note Exported', resource: 'Michael Chen - SN#002', details: 'SOAP note exported as PDF for records', ipAddress: '192.168.1.105', severity: 'info' },
    { id: '8', timestamp: '2025-12-18 14:30:00', user: 'Dr. Alex Morgan', action: 'SOAP Note Created', resource: 'Michael Chen - SN#002', details: 'AI-generated SOAP note from ambient recording (10:23 duration)', ipAddress: '192.168.1.105', severity: 'info' },
    { id: '9', timestamp: '2025-12-15 11:45:00', user: 'System', action: 'Critical Alert Triggered', resource: 'Robert Williams - MRN-001237', details: 'Patient status changed to CRITICAL based on vitals assessment', ipAddress: 'System', severity: 'critical' },
    { id: '10', timestamp: '2025-12-15 08:00:00', user: 'System', action: 'Backup Completed', resource: 'Database', details: 'Automated daily backup completed successfully', ipAddress: 'System', severity: 'info' },
    { id: '11', timestamp: '2025-12-14 16:22:00', user: 'Dr. Alex Morgan', action: 'Template Created', resource: 'Acute Visit Template', details: 'New SOAP note template created for acute visits', ipAddress: '192.168.1.105', severity: 'info' },
    { id: '12', timestamp: '2025-12-12 09:30:00', user: 'System', action: 'Security Scan', resource: 'System-wide', details: 'HIPAA compliance scan completed - no violations found', ipAddress: 'System', severity: 'info' },
  ];

  const filtered = auditLog.filter(entry => {
    const matchSearch = entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = filterSeverity === 'all' || entry.severity === filterSeverity;
    return matchSearch && matchSeverity;
  });

  const severityColors: Record<string, string> = {
    info: 'bg-blue-500/20 text-blue-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    critical: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ClipboardList className="w-7 h-7 text-cyan-400" /> Audit Log
        </h1>
        <p className="text-dark-400 mt-1">HIPAA-compliant activity tracking and compliance log</p>
      </div>

      {/* Compliance Banner */}
      <div className="bg-gradient-to-r from-green-500/10 to-medical-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-4">
        <Shield className="w-8 h-8 text-green-400 flex-shrink-0" />
        <div>
          <h3 className="text-green-400 font-medium">HIPAA Compliance Status: Active</h3>
          <p className="text-green-400/60 text-sm">All access logs are encrypted and retained for 7 years per regulatory requirements. Last compliance audit: Dec 12, 2025</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
            placeholder="Search audit entries..." />
        </div>
        <div className="flex gap-2">
          {['all', 'info', 'warning', 'critical'].map(s => (
            <button key={s} onClick={() => setFilterSeverity(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition capitalize ${
                filterSeverity === s ? 'bg-cyan-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: auditLog.length, icon: ClipboardList },
          { label: 'Notes Accessed', value: auditLog.filter(e => e.action.includes('Note')).length, icon: FileText },
          { label: 'User Actions', value: auditLog.filter(e => e.user !== 'System').length, icon: User },
          { label: 'Warnings', value: auditLog.filter(e => e.severity !== 'info').length, icon: Shield },
        ].map((s, i) => (
          <div key={i} className="bg-dark-900 border border-dark-800 rounded-xl p-4 flex items-center gap-3">
            <s.icon className="w-8 h-8 text-cyan-400/50" />
            <div>
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-dark-500 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Log Entries */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-800">
                <th className="text-left p-4 text-xs text-dark-500 font-medium uppercase">Timestamp</th>
                <th className="text-left p-4 text-xs text-dark-500 font-medium uppercase">User</th>
                <th className="text-left p-4 text-xs text-dark-500 font-medium uppercase">Action</th>
                <th className="text-left p-4 text-xs text-dark-500 font-medium uppercase hidden md:table-cell">Resource</th>
                <th className="text-left p-4 text-xs text-dark-500 font-medium uppercase hidden lg:table-cell">Details</th>
                <th className="text-left p-4 text-xs text-dark-500 font-medium uppercase">Level</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-dark-600" />
                      <span className="text-dark-400 text-xs font-mono whitespace-nowrap">{entry.timestamp}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white text-sm">{entry.user}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-dark-300 text-sm font-medium">{entry.action}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-dark-400 text-sm">{entry.resource}</span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-dark-500 text-xs">{entry.details}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[entry.severity]}`}>
                      {entry.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
