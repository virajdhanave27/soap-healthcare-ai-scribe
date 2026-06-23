import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import {
  Mic, Square, Play, Pause, RotateCcw, Save, Wand2,
  Volume2, Loader2, CheckCircle2, AlertCircle, FileText, Copy,
  ChevronDown, ChevronUp, Sparkles, Clock
} from 'lucide-react';

export default function ScribePage() {
  const { patients, user, isRecording, recordingTime, setRecording, setRecordingTime, addSOAPNote, addNotification } = useStore();

  const [selectedPatient, setSelectedPatient] = useState('');
  const [visitType, setVisitType] = useState('Follow-up');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);

  const [transcript, setTranscript] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [icdCodes, setIcdCodes] = useState<string[]>([]);
  const [cptCodes, setCptCodes] = useState<string[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated transcript lines
  const transcriptLines = [
    { time: 3, speaker: 'Doctor', text: 'Good morning. How are you feeling today?' },
    { time: 7, speaker: 'Patient', text: 'Hi doctor. I\'ve been having this persistent headache for about a week now.' },
    { time: 14, speaker: 'Doctor', text: 'I see. Can you describe the headache? Where exactly is it located?' },
    { time: 20, speaker: 'Patient', text: 'It\'s mostly on the right side, kind of throbbing. It gets worse in the afternoon.' },
    { time: 27, speaker: 'Doctor', text: 'On a scale of 1 to 10, how would you rate the pain?' },
    { time: 31, speaker: 'Patient', text: 'I\'d say about a 7. It\'s really affecting my work.' },
    { time: 36, speaker: 'Doctor', text: 'Have you experienced any nausea, vision changes, or sensitivity to light?' },
    { time: 42, speaker: 'Patient', text: 'Yes, actually. I\'ve been more sensitive to light and had some nausea yesterday.' },
    { time: 49, speaker: 'Doctor', text: 'Any history of migraines in your family?' },
    { time: 53, speaker: 'Patient', text: 'My mother gets them frequently.' },
    { time: 57, speaker: 'Doctor', text: 'Let me do a quick neurological exam. Follow my finger with your eyes please.' },
    { time: 64, speaker: 'Doctor', text: 'Good. Your cranial nerves look normal. Let me check your blood pressure.' },
    { time: 70, speaker: 'Doctor', text: 'Blood pressure is 128 over 82. That\'s within normal range.' },
    { time: 76, speaker: 'Doctor', text: 'Based on your symptoms, this appears to be a migraine presentation. I\'d like to start you on sumatriptan for acute episodes.' },
    { time: 84, speaker: 'Patient', text: 'Is that safe? I\'m not on any other medications.' },
    { time: 88, speaker: 'Doctor', text: 'Yes, it\'s generally very safe. I\'ll also recommend keeping a headache diary and we\'ll follow up in two weeks.' },
  ];

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(recordingTime + 1);
      }, 1000);

      audioRef.current = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);

      // Add transcript lines based on time
      const currentLine = transcriptLines.find(l => l.time === recordingTime);
      if (currentLine) {
        setTranscript(prev => prev + (prev ? '\n' : '') + `[${currentLine.speaker}]: ${currentLine.text}`);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) clearInterval(audioRef.current);
    };
  }, [isRecording, isPaused, recordingTime]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    if (!selectedPatient) return;
    setRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setTranscript('');
    setIsGenerated(false);
    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
  };

  const stopRecording = () => {
    setRecording(false);
    setIsPaused(false);
    setAudioLevel(0);
  };

  const generateSOAPNote = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const patient = patients.find(p => p.id === selectedPatient);
      setSubjective(`Patient ${patient?.name || 'N/A'} presents with complaints of persistent headache for approximately one week. Describes the pain as throbbing, localized to the right side, rated 7/10 in severity. Reports worsening in the afternoon. Associated symptoms include photophobia and nausea (one episode yesterday). Denies vision changes, neck stiffness, or fever. Family history significant for maternal migraines. No current medications. No known drug allergies.`);
      setObjective(`Vitals: BP 128/82 mmHg, HR 72 bpm, Temp 98.6°F, RR 16, SpO2 99% on RA.\nGeneral: Alert and oriented x3, appears uncomfortable but in no acute distress.\nHEENT: Normocephalic, atraumatic. PERRLA. No papilledema on fundoscopic exam. TMs clear bilaterally.\nNeck: Supple, full ROM, no meningismus.\nNeuro: CN II-XII intact. Motor strength 5/5 all extremities. Sensation intact. DTRs 2+ symmetric. Romberg negative. Gait normal.\nNo focal neurological deficits identified.`);
      setAssessment(`1. Migraine without aura (G43.009) - New diagnosis. Consistent with unilateral throbbing headache with photophobia and nausea. Positive family history supports diagnosis.\n2. Rule out tension-type headache, cluster headache, secondary causes.`);
      setPlan(`1. Sumatriptan 50mg PO at onset of migraine - may repeat once after 2 hours if needed. Max 200mg/24hrs.\n2. OTC Acetaminophen 1000mg PRN for mild headaches. Avoid NSAIDs per patient preference.\n3. Headache diary - document frequency, severity, triggers, duration.\n4. Lifestyle modifications: Regular sleep schedule, adequate hydration, stress management.\n5. Return precautions: Worst headache of life, fever with stiff neck, neurological changes, vision loss → ER immediately.\n6. Consider prophylactic therapy if frequency >4 episodes/month at follow-up.\n7. Follow-up in 2 weeks to assess response to treatment.\n8. MRI brain if symptoms persist or worsen - low clinical suspicion for secondary cause currently.`);
      setIcdCodes(['G43.009', 'R51.9']);
      setCptCodes(['99213', '96127']);
      setIsProcessing(false);
      setIsGenerated(true);
    }, 3000);
  };

  const saveNote = () => {
    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient || !user) return;
    addSOAPNote({
      patientId: selectedPatient,
      patientName: patient.name,
      providerId: user.id,
      providerName: user.name,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      subjective, objective, assessment, plan,
      transcript, recordingDuration: recordingTime,
      icdCodes, cptCodes, visitType, chiefComplaint,
      tags: ['ai-generated', visitType.toLowerCase()]
    });
    addNotification({ title: 'SOAP Note Saved', message: `SOAP note for ${patient.name} saved as draft.`, type: 'success' });
    setIsGenerated(false);
    setTranscript('');
    setSubjective(''); setObjective(''); setAssessment(''); setPlan('');
    setRecordingTime(0);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Mic className="w-7 h-7 text-medical-400" /> Ambient Clinical Scribe
        </h1>
        <p className="text-dark-400 mt-1">AI-powered ambient listening for automatic SOAP note generation</p>
      </div>

      {/* Setup Panel */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Session Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-dark-400 mb-2">Patient *</label>
            <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition">
              <option value="">Select patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-2">Visit Type</label>
            <select value={visitType} onChange={e => setVisitType(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition">
              <option>Follow-up</option>
              <option>New Patient</option>
              <option>Acute Visit</option>
              <option>Annual Physical</option>
              <option>Urgent</option>
              <option>Telehealth</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-dark-400 mb-2">Chief Complaint</label>
            <input type="text" value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white text-sm placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
              placeholder="e.g., Persistent headache" />
          </div>
        </div>
      </div>

      {/* Recording Control */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8">
        <div className="flex flex-col items-center">
          {/* Audio Visualizer */}
          {isRecording && (
            <div className="flex items-center gap-0.5 h-16 mb-6">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i}
                  className="w-1.5 bg-gradient-to-t from-medical-500 to-primary-500 rounded-full transition-all duration-100"
                  style={{
                    height: `${isPaused ? 4 : Math.max(4, (Math.sin(i * 0.5 + audioLevel * 0.02) + 1) * 30 * (audioLevel / 100))}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Timer */}
          <div className={`text-5xl font-mono font-bold mb-6 ${isRecording ? (isPaused ? 'text-yellow-400' : 'text-red-400') : 'text-dark-500'}`}>
            {formatTime(recordingTime)}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mb-6">
            {isRecording ? (
              <>
                <div className={`w-3 h-3 rounded-full relative ${isPaused ? 'bg-yellow-400' : 'bg-red-500 recording-pulse'}`} />
                <span className={`text-sm font-medium ${isPaused ? 'text-yellow-400' : 'text-red-400'}`}>
                  {isPaused ? 'Paused' : 'Recording...'}
                </span>
              </>
            ) : recordingTime > 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Recording complete</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-dark-500" />
                <span className="text-sm text-dark-500">Ready to record</span>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {!isRecording && recordingTime === 0 && (
              <button onClick={startRecording} disabled={!selectedPatient}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white flex items-center justify-center transition-all shadow-lg shadow-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed">
                <Mic className="w-8 h-8" />
              </button>
            )}

            {isRecording && (
              <>
                <button onClick={() => setIsPaused(!isPaused)}
                  className="w-14 h-14 rounded-full bg-dark-700 hover:bg-dark-600 text-white flex items-center justify-center transition">
                  {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                </button>
                <button onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white flex items-center justify-center transition-all shadow-lg shadow-red-500/25">
                  <Square className="w-8 h-8" />
                </button>
                <button onClick={() => { setRecording(false); setRecordingTime(0); setTranscript(''); }}
                  className="w-14 h-14 rounded-full bg-dark-700 hover:bg-dark-600 text-white flex items-center justify-center transition">
                  <RotateCcw className="w-6 h-6" />
                </button>
              </>
            )}

            {!isRecording && recordingTime > 0 && !isGenerated && (
              <div className="flex gap-3">
                <button onClick={() => { setRecordingTime(0); setTranscript(''); }}
                  className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl flex items-center gap-2 transition">
                  <RotateCcw className="w-5 h-5" /> Reset
                </button>
                <button onClick={generateSOAPNote} disabled={isProcessing}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-medical-600 hover:from-primary-500 hover:to-medical-500 text-white rounded-xl flex items-center gap-2 font-semibold transition disabled:opacity-60">
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  {isProcessing ? 'Generating...' : 'Generate SOAP Note'}
                </button>
              </div>
            )}
          </div>

          {!selectedPatient && !isRecording && (
            <p className="text-yellow-400/70 text-sm mt-4 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Please select a patient before recording
            </p>
          )}
        </div>
      </div>

      {/* Live Transcript */}
      {(transcript || isRecording) && (
        <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
          <button onClick={() => setShowTranscript(!showTranscript)}
            className="w-full p-4 flex items-center justify-between hover:bg-dark-800/50 transition">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-medical-400" /> Live Transcript
              {isRecording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            </h3>
            {showTranscript ? <ChevronUp className="w-5 h-5 text-dark-400" /> : <ChevronDown className="w-5 h-5 text-dark-400" />}
          </button>
          {showTranscript && (
            <div className="px-6 pb-6">
              <div className="bg-dark-950 rounded-xl p-4 max-h-64 overflow-y-auto font-mono text-sm">
                {transcript ? transcript.split('\n').map((line, i) => {
                  const isDoctor = line.startsWith('[Doctor]');
                  return (
                    <div key={i} className={`py-1 ${isDoctor ? 'text-primary-400' : 'text-accent-400'}`}>
                      {line}
                    </div>
                  );
                }) : (
                  <p className="text-dark-600 italic">Transcript will appear here as conversation is detected...</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Processing Animation */}
      {isProcessing && (
        <div className="bg-dark-900 border border-primary-500/30 rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-primary-400 animate-pulse" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
            </div>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">AI is Processing Your Visit</h3>
          <p className="text-dark-400 text-sm mb-4">Analyzing transcript, identifying medical entities, generating structured SOAP note...</p>
          <div className="flex justify-center gap-6 text-xs text-dark-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Speech recognized</span>
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin text-primary-400" /> Extracting entities</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-dark-600" /> Generating note</span>
          </div>
        </div>
      )}

      {/* Generated SOAP Note */}
      {isGenerated && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-medical-400" /> AI-Generated SOAP Note
            </h2>
            <div className="flex gap-2">
              <button onClick={saveNote}
                className="px-4 py-2 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-500 hover:to-accent-600 text-white rounded-xl flex items-center gap-2 text-sm font-medium transition">
                <Save className="w-4 h-4" /> Save as Draft
              </button>
            </div>
          </div>

          {/* Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-dark-400 mb-2">ICD-10 Codes (AI Suggested)</h4>
              <div className="flex flex-wrap gap-2">
                {icdCodes.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-mono">{c}</span>
                ))}
              </div>
            </div>
            <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
              <h4 className="text-sm font-medium text-dark-400 mb-2">CPT Codes (AI Suggested)</h4>
              <div className="flex flex-wrap gap-2">
                {cptCodes.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-medical-500/20 text-medical-400 rounded-full text-sm font-mono">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* SOAP Sections */}
          {[
            { label: 'Subjective', value: subjective, setter: setSubjective, color: 'border-l-blue-500' },
            { label: 'Objective', value: objective, setter: setObjective, color: 'border-l-green-500' },
            { label: 'Assessment', value: assessment, setter: setAssessment, color: 'border-l-yellow-500' },
            { label: 'Plan', value: plan, setter: setPlan, color: 'border-l-purple-500' },
          ].map(section => (
            <div key={section.label} className={`bg-dark-900 border border-dark-800 ${section.color} border-l-4 rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-lg">{section.label}</h3>
                <button onClick={() => copyToClipboard(section.value)}
                  className="text-dark-500 hover:text-white transition p-1"><Copy className="w-4 h-4" /></button>
              </div>
              <textarea
                value={section.value}
                onChange={e => section.setter(e.target.value)}
                className="w-full bg-transparent text-dark-300 text-sm leading-relaxed resize-none focus:outline-none min-h-[100px]"
                rows={5}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
