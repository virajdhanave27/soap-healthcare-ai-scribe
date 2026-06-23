import { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, BookOpen, MessageCircle,
  Mail, Phone, ExternalLink, Mic, FileText, Brain, Shield, Zap
} from 'lucide-react';

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the Ambient Clinical Scribe work?',
      a: 'The Ambient Clinical Scribe uses advanced AI to listen to your patient encounters in real-time. It captures the natural conversation between provider and patient, identifies medical terminology, symptoms, diagnoses, and treatment plans, then automatically structures this information into a comprehensive SOAP note format. Simply start a recording before your patient visit, and the AI handles the rest.'
    },
    {
      q: 'Is MediScribe HIPAA compliant?',
      a: 'Yes, MediScribe is fully HIPAA compliant. All audio recordings and transcriptions are encrypted both in transit and at rest using AES-256 encryption. We maintain BAA agreements, conduct regular security audits, and follow all HIPAA Privacy and Security Rule requirements. Audio recordings are automatically deleted after note generation unless you specifically choose to retain them.'
    },
    {
      q: 'How accurate is the AI-generated SOAP note?',
      a: 'Our AI achieves an average accuracy rate of 96.4% in clinical documentation. The system is trained on millions of de-identified medical records and continuously improves. All generated notes should be reviewed by the provider before signing. You can edit any section of the SOAP note before finalizing it.'
    },
    {
      q: 'Can I edit the generated SOAP note?',
      a: 'Absolutely. Every generated SOAP note is fully editable. You can modify the Subjective, Objective, Assessment, and Plan sections. You can also adjust the AI-suggested ICD-10 and CPT codes. Notes remain in draft status until you explicitly sign them.'
    },
    {
      q: 'What types of visits does MediScribe support?',
      a: 'MediScribe supports all common visit types including follow-up visits, new patient encounters, acute visits, annual physicals, urgent care visits, and telehealth consultations. You can also create custom templates for specialized visit types specific to your practice.'
    },
    {
      q: 'How do I integrate MediScribe with my EHR?',
      a: 'MediScribe integrates with major EHR systems including Epic, Cerner, Allscripts, and athenahealth through our FHIR-based API. Contact our integration team for setup assistance. Notes can also be exported in standard formats (HL7, CDA, PDF) for manual import.'
    },
    {
      q: 'Can multiple providers use the same account?',
      a: 'MediScribe supports multi-provider practices with role-based access control. Each provider has their own login, patient panel, and notes. Administrators can manage team members, view aggregate analytics, and configure practice-wide settings.'
    },
    {
      q: 'What happens if the internet connection drops during recording?',
      a: 'MediScribe records audio locally on your device, so an internet interruption won\'t stop your recording. The audio will be uploaded and processed once connectivity is restored. We recommend checking your connection before starting critical recordings.'
    },
  ];

  const guides = [
    { title: 'Getting Started Guide', desc: 'Learn the basics of MediScribe in 5 minutes', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { title: 'Recording Best Practices', desc: 'Tips for optimal audio quality and accuracy', icon: Mic, color: 'from-red-500 to-red-600' },
    { title: 'SOAP Note Mastery', desc: 'Advanced editing and customization techniques', icon: FileText, color: 'from-green-500 to-green-600' },
    { title: 'AI Features Deep Dive', desc: 'Understanding AI suggestions and coding', icon: Brain, color: 'from-purple-500 to-purple-600' },
    { title: 'Security & Compliance', desc: 'HIPAA guidelines and data protection', icon: Shield, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Keyboard Shortcuts', desc: 'Speed up your workflow with shortcuts', icon: Zap, color: 'from-cyan-500 to-cyan-600' },
  ];

  const shortcuts = [
    { keys: ['Ctrl', 'R'], action: 'Start/Stop Recording' },
    { keys: ['Ctrl', 'P'], action: 'Pause Recording' },
    { keys: ['Ctrl', 'G'], action: 'Generate SOAP Note' },
    { keys: ['Ctrl', 'S'], action: 'Save Current Note' },
    { keys: ['Ctrl', 'N'], action: 'New SOAP Note' },
    { keys: ['Ctrl', 'F'], action: 'Search' },
    { keys: ['Ctrl', '/'], action: 'Toggle Sidebar' },
    { keys: ['Esc'], action: 'Close Modal/Cancel' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <HelpCircle className="w-7 h-7 text-yellow-400" /> Help & Support
        </h1>
        <p className="text-dark-400 mt-1">Documentation, guides, and support resources</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our support team', color: 'from-green-500 to-green-600' },
          { icon: Mail, title: 'Email Support', desc: 'support@mediscribe.ai', color: 'from-blue-500 to-blue-600' },
          { icon: Phone, title: 'Phone Support', desc: '1-800-MEDI-AI', color: 'from-purple-500 to-purple-600' },
        ].map((link, i) => (
          <button key={i} className="bg-dark-900 border border-dark-800 rounded-2xl p-5 text-left hover:border-dark-700 transition group">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-3`}>
              <link.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-medium group-hover:text-primary-400 transition">{link.title}</h3>
            <p className="text-dark-400 text-sm mt-1">{link.desc}</p>
          </button>
        ))}
      </div>

      {/* Guides */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Documentation & Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {guides.map((guide, i) => (
            <button key={i} className="bg-dark-900 border border-dark-800 rounded-xl p-4 text-left hover:border-dark-700 transition flex items-center gap-4 group">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${guide.color} flex items-center justify-center flex-shrink-0`}>
                <guide.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-sm font-medium group-hover:text-primary-400 transition">{guide.title}</h3>
                <p className="text-dark-500 text-xs mt-0.5">{guide.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-dark-600 group-hover:text-dark-400" />
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-dark-800/50 transition">
                <span className="text-white text-sm font-medium pr-4">{faq.q}</span>
                {expandedFaq === i ? <ChevronUp className="w-5 h-5 text-dark-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-dark-400 flex-shrink-0" />}
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-4 animate-fade-in">
                  <p className="text-dark-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
              <span className="text-dark-300 text-sm">{s.action}</span>
              <div className="flex gap-1">
                {s.keys.map((k, j) => (
                  <kbd key={j} className="px-2 py-1 bg-dark-700 border border-dark-600 rounded text-xs text-dark-300 font-mono">{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center py-4">
        <p className="text-dark-600 text-xs">MediScribe AI v2.4.1 • Last updated: January 2026</p>
        <p className="text-dark-700 text-xs mt-1">© 2026 MediScribe AI. All rights reserved.</p>
      </div>
    </div>
  );
}
