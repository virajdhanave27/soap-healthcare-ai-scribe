import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'physician' | 'nurse' | 'admin' | 'specialist';
  specialty?: string;
  avatar?: string;
  phone?: string;
  licenseNumber?: string;
  joinDate: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  mrn: string;
  phone: string;
  email: string;
  address: string;
  insurance: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  bloodType: string;
  emergencyContact: string;
  lastVisit: string;
  status: 'active' | 'inactive' | 'critical';
}

export interface SOAPNote {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  date: string;
  status: 'draft' | 'completed' | 'signed' | 'amended';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  transcript?: string;
  recordingDuration?: number;
  icdCodes: string[];
  cptCodes: string[];
  visitType: string;
  chiefComplaint: string;
  tags: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  soapNoteId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  date: string;
}

export interface Template {
  id: string;
  name: string;
  specialty: string;
  visitType: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  isDefault: boolean;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (user: Omit<User, 'id' | 'joinDate'>, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // SOAP Notes
  soapNotes: SOAPNote[];
  addSOAPNote: (note: Omit<SOAPNote, 'id'>) => void;
  updateSOAPNote: (id: string, updates: Partial<SOAPNote>) => void;
  deleteSOAPNote: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Templates
  templates: Template[];
  addTemplate: (template: Omit<Template, 'id'>) => void;
  deleteTemplate: (id: string) => void;

  // Recording
  isRecording: boolean;
  recordingTime: number;
  setRecording: (val: boolean) => void;
  setRecordingTime: (val: number) => void;

  // Registered Users (for demo)
  registeredUsers: Array<{ email: string; password: string; user: User }>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultPatients: Patient[] = [
  {
    id: 'p1', name: 'Sarah Johnson', age: 45, gender: 'Female', dob: '1980-03-15',
    mrn: 'MRN-001234', phone: '(555) 123-4567', email: 'sarah.j@email.com',
    address: '123 Oak Street, Springfield, IL 62701', insurance: 'Blue Cross Blue Shield',
    allergies: ['Penicillin', 'Sulfa drugs'], medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    conditions: ['Type 2 Diabetes', 'Hypertension'], bloodType: 'A+',
    emergencyContact: 'John Johnson - (555) 123-4568', lastVisit: '2025-12-20', status: 'active'
  },
  {
    id: 'p2', name: 'Michael Chen', age: 62, gender: 'Male', dob: '1963-07-22',
    mrn: 'MRN-001235', phone: '(555) 234-5678', email: 'mchen@email.com',
    address: '456 Maple Ave, Springfield, IL 62702', insurance: 'Medicare',
    allergies: ['Aspirin'], medications: ['Atorvastatin 20mg', 'Amlodipine 5mg', 'Warfarin 5mg'],
    conditions: ['Atrial Fibrillation', 'Hyperlipidemia', 'GERD'], bloodType: 'O+',
    emergencyContact: 'Lisa Chen - (555) 234-5679', lastVisit: '2025-12-18', status: 'active'
  },
  {
    id: 'p3', name: 'Emily Rodriguez', age: 34, gender: 'Female', dob: '1991-11-08',
    mrn: 'MRN-001236', phone: '(555) 345-6789', email: 'emily.r@email.com',
    address: '789 Pine Rd, Springfield, IL 62703', insurance: 'Aetna',
    allergies: [], medications: ['Sertraline 50mg'], conditions: ['Anxiety', 'Migraine'],
    bloodType: 'B-', emergencyContact: 'Carlos Rodriguez - (555) 345-6780',
    lastVisit: '2025-12-22', status: 'active'
  },
  {
    id: 'p4', name: 'Robert Williams', age: 78, gender: 'Male', dob: '1947-05-30',
    mrn: 'MRN-001237', phone: '(555) 456-7890', email: 'rwilliams@email.com',
    address: '321 Elm Blvd, Springfield, IL 62704', insurance: 'Medicare',
    allergies: ['Codeine', 'Latex'], medications: ['Metoprolol 50mg', 'Furosemide 40mg', 'Digoxin 0.125mg'],
    conditions: ['CHF', 'COPD', 'CKD Stage 3'], bloodType: 'AB+',
    emergencyContact: 'Mary Williams - (555) 456-7891', lastVisit: '2025-12-15', status: 'critical'
  },
  {
    id: 'p5', name: 'Amanda Foster', age: 28, gender: 'Female', dob: '1997-09-12',
    mrn: 'MRN-001238', phone: '(555) 567-8901', email: 'afoster@email.com',
    address: '654 Cedar Ln, Springfield, IL 62705', insurance: 'United Healthcare',
    allergies: ['Ibuprofen'], medications: ['Levothyroxine 75mcg'],
    conditions: ['Hypothyroidism'], bloodType: 'O-',
    emergencyContact: 'David Foster - (555) 567-8902', lastVisit: '2025-11-30', status: 'active'
  },
];

const defaultSOAPNotes: SOAPNote[] = [
  {
    id: 'sn1', patientId: 'p1', patientName: 'Sarah Johnson', providerId: 'u1',
    providerName: 'Dr. Alex Morgan', date: '2025-12-20', status: 'signed',
    subjective: 'Patient presents with complaints of increased thirst and frequent urination over the past 2 weeks. Reports fatigue and occasional blurred vision. Denies chest pain, shortness of breath, or numbness in extremities. States she has been compliant with medications but admits to increased carbohydrate intake during holiday season. Last A1C was 7.2% three months ago.',
    objective: 'Vitals: BP 138/86 mmHg, HR 78 bpm, Temp 98.4°F, RR 16, SpO2 98% on RA. Weight: 182 lbs (up 4 lbs from last visit). BMI: 29.8. General: Alert, oriented, no acute distress. HEENT: PERRLA, no retinal changes on fundoscopic exam. CV: RRR, no murmurs. Lungs: CTA bilaterally. Extremities: No edema, sensation intact bilaterally. Skin: No lesions or ulcers.',
    assessment: '1. Type 2 Diabetes Mellitus - suboptimally controlled with likely A1C elevation\n2. Hypertension - Stage 1, currently on Lisinopril\n3. Obesity - BMI 29.8, weight gain noted',
    plan: '1. Order stat A1C, fasting glucose, BMP, lipid panel\n2. Increase Metformin to 1000mg BID\n3. Continue Lisinopril 10mg daily - consider increasing if BP remains elevated\n4. Referral to nutritionist for dietary counseling\n5. Diabetic foot exam at next visit\n6. Patient education on carbohydrate counting\n7. Follow-up in 4 weeks\n8. Call if symptoms worsen or blood glucose > 300',
    transcript: 'Doctor: Good morning Sarah, how are you doing today?\nPatient: Hi Doctor, I\'ve been feeling more tired lately and I\'m really thirsty all the time...',
    recordingDuration: 847, icdCodes: ['E11.65', 'I10', 'E66.01'],
    cptCodes: ['99214', '83036'], visitType: 'Follow-up', chiefComplaint: 'Increased thirst and polyuria',
    tags: ['diabetes', 'hypertension', 'follow-up']
  },
  {
    id: 'sn2', patientId: 'p2', patientName: 'Michael Chen', providerId: 'u1',
    providerName: 'Dr. Alex Morgan', date: '2025-12-18', status: 'completed',
    subjective: 'Patient returns for follow-up of atrial fibrillation and anticoagulation management. Reports occasional palpitations, approximately 2-3 times per week, lasting 5-10 minutes. Denies syncope, presyncope, chest pain, or dyspnea. Currently taking Warfarin 5mg daily. Last INR was 2.3 one month ago. Reports compliance with medication regimen.',
    objective: 'Vitals: BP 128/78 mmHg, HR 72 bpm (irregularly irregular), Temp 98.2°F, RR 14, SpO2 99% on RA. Weight: 175 lbs. General: Well-appearing male in no distress. CV: Irregularly irregular rhythm, no murmurs, rubs, or gallops. Lungs: Clear to auscultation bilaterally. Abdomen: Soft, non-tender, no hepatomegaly. Extremities: No edema, pulses 2+ bilaterally.',
    assessment: '1. Atrial Fibrillation - persistent, rate controlled\n2. Hyperlipidemia - on statin therapy\n3. GERD - stable on current management',
    plan: '1. Check INR today - target range 2.0-3.0\n2. Continue Warfarin 5mg daily pending INR results\n3. Continue Atorvastatin 20mg daily\n4. Continue Amlodipine 5mg daily\n5. ECG today to assess rate control\n6. Consider Holter monitor if palpitations increase in frequency\n7. Follow-up in 6 weeks or sooner if needed\n8. Go to ER if prolonged palpitations, chest pain, or shortness of breath',
    recordingDuration: 623, icdCodes: ['I48.1', 'E78.5', 'K21.0'],
    cptCodes: ['99213', '93000'], visitType: 'Follow-up', chiefComplaint: 'A-fib follow-up',
    tags: ['cardiology', 'anticoagulation', 'follow-up']
  },
  {
    id: 'sn3', patientId: 'p3', patientName: 'Emily Rodriguez', providerId: 'u1',
    providerName: 'Dr. Alex Morgan', date: '2025-12-22', status: 'draft',
    subjective: 'Patient presents with severe headache for the past 3 days. Describes it as throbbing, unilateral (right temporal), rated 8/10 in severity. Associated with photophobia and nausea. One episode of vomiting yesterday. Reports increased work stress and poor sleep (4-5 hours per night). Previous migraine pattern similar but this episode more severe and prolonged. Current Sertraline for anxiety has been helpful for mood symptoms.',
    objective: 'Vitals: BP 118/72 mmHg, HR 68 bpm, Temp 98.6°F, RR 14, SpO2 99% on RA. General: Appears uncomfortable, wearing sunglasses in exam room. HEENT: No papilledema on fundoscopic exam, TMs clear, no sinus tenderness. Neck: Supple, no meningismus, no lymphadenopathy. Neuro: CN II-XII intact, strength 5/5 all extremities, DTRs 2+ symmetric, no focal deficits. Romberg negative.',
    assessment: '1. Migraine without aura - acute severe episode\n2. Generalized Anxiety Disorder - stable on Sertraline\n3. Insomnia - likely contributing to migraine exacerbation',
    plan: '1. Sumatriptan 50mg PO for acute migraine - may repeat once after 2 hours\n2. Ondansetron 4mg ODT for nausea as needed\n3. Continue Sertraline 50mg daily\n4. Sleep hygiene education provided\n5. Consider prophylactic migraine therapy if frequency > 4/month\n6. Headache diary recommended\n7. Return precautions: worst headache of life, fever, stiff neck, neurological changes → ER\n8. Follow-up in 2 weeks',
    recordingDuration: 534, icdCodes: ['G43.009', 'F41.1', 'G47.00'],
    cptCodes: ['99214'], visitType: 'Acute visit', chiefComplaint: 'Severe headache x 3 days',
    tags: ['neurology', 'migraine', 'acute']
  }
];

const defaultAppointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'Sarah Johnson', providerId: 'u1', providerName: 'Dr. Alex Morgan', date: '2026-01-15', time: '09:00', duration: 30, type: 'Follow-up', status: 'scheduled' },
  { id: 'a2', patientId: 'p2', patientName: 'Michael Chen', providerId: 'u1', providerName: 'Dr. Alex Morgan', date: '2026-01-15', time: '09:30', duration: 30, type: 'Follow-up', status: 'scheduled' },
  { id: 'a3', patientId: 'p3', patientName: 'Emily Rodriguez', providerId: 'u1', providerName: 'Dr. Alex Morgan', date: '2026-01-15', time: '10:00', duration: 45, type: 'Follow-up', status: 'scheduled' },
  { id: 'a4', patientId: 'p4', patientName: 'Robert Williams', providerId: 'u1', providerName: 'Dr. Alex Morgan', date: '2026-01-15', time: '11:00', duration: 45, type: 'Urgent', status: 'scheduled' },
  { id: 'a5', patientId: 'p5', patientName: 'Amanda Foster', providerId: 'u1', providerName: 'Dr. Alex Morgan', date: '2026-01-16', time: '09:00', duration: 30, type: 'Annual Physical', status: 'scheduled' },
  { id: 'a6', patientId: 'p1', patientName: 'Sarah Johnson', providerId: 'u1', providerName: 'Dr. Alex Morgan', date: '2025-12-20', time: '10:00', duration: 30, type: 'Follow-up', status: 'completed', soapNoteId: 'sn1' },
  { id: 'a7', patientId: 'p2', patientName: 'Michael Chen', providerId: 'u1', providerName: 'Dr. Alex Morgan', date: '2025-12-18', time: '14:00', duration: 30, type: 'Follow-up', status: 'completed', soapNoteId: 'sn2' },
];

const defaultTemplates: Template[] = [
  {
    id: 't1', name: 'General Follow-up', specialty: 'Internal Medicine', visitType: 'Follow-up',
    subjective: 'Patient presents for follow-up of [CONDITION]. Reports [SYMPTOMS]. Medication compliance: [COMPLIANCE]. Denies [NEGATIVE SYMPTOMS].',
    objective: 'Vitals: BP [BP], HR [HR], Temp [TEMP], RR [RR], SpO2 [SPO2]. General: [GENERAL APPEARANCE]. [SYSTEM EXAM FINDINGS].',
    assessment: '1. [PRIMARY DIAGNOSIS] - [STATUS]\n2. [SECONDARY DIAGNOSIS] - [STATUS]',
    plan: '1. [MEDICATION CHANGES]\n2. [LABS/IMAGING]\n3. [REFERRALS]\n4. [FOLLOW-UP TIMELINE]\n5. [PATIENT EDUCATION]',
    isDefault: true
  },
  {
    id: 't2', name: 'New Patient Intake', specialty: 'Internal Medicine', visitType: 'New Patient',
    subjective: 'New patient presenting for [REASON]. History of present illness: [HPI]. Past medical history: [PMH]. Past surgical history: [PSH]. Family history: [FH]. Social history: [SH]. Review of systems: [ROS].',
    objective: 'Vitals: BP [BP], HR [HR], Temp [TEMP], RR [RR], SpO2 [SPO2]. Weight: [WT]. Height: [HT]. BMI: [BMI]. Complete physical examination performed.\n\nGeneral: [GENERAL]. HEENT: [HEENT]. Neck: [NECK]. CV: [CV]. Lungs: [LUNGS]. Abdomen: [ABD]. Extremities: [EXT]. Neuro: [NEURO]. Skin: [SKIN].',
    assessment: '1. [DIAGNOSIS 1]\n2. [DIAGNOSIS 2]',
    plan: '1. [INITIAL WORKUP]\n2. [MEDICATIONS]\n3. [REFERRALS]\n4. [PREVENTIVE CARE]\n5. [FOLLOW-UP]',
    isDefault: true
  },
  {
    id: 't3', name: 'Acute Visit', specialty: 'Internal Medicine', visitType: 'Acute',
    subjective: 'Patient presents with acute [CHIEF COMPLAINT] for [DURATION]. Onset: [ONSET]. Character: [CHARACTER]. Severity: [SEVERITY/10]. Aggravating factors: [AGG]. Relieving factors: [RELIEF]. Associated symptoms: [ASSOCIATED]. Denies: [DENIES].',
    objective: 'Vitals: BP [BP], HR [HR], Temp [TEMP], RR [RR], SpO2 [SPO2]. General: [APPEARANCE]. Focused exam: [FINDINGS].',
    assessment: '1. [ACUTE DIAGNOSIS]',
    plan: '1. [ACUTE MANAGEMENT]\n2. [MEDICATIONS]\n3. [RETURN PRECAUTIONS]\n4. [FOLLOW-UP]',
    isDefault: true
  }
];

const defaultNotifications: Notification[] = [
  { id: 'n1', title: 'SOAP Note Signed', message: 'SOAP note for Sarah Johnson has been successfully signed.', type: 'success', read: false, date: '2025-12-20T15:30:00' },
  { id: 'n2', title: 'Lab Results Available', message: 'Lab results for Michael Chen are now available for review.', type: 'info', read: false, date: '2025-12-19T09:15:00' },
  { id: 'n3', title: 'Appointment Reminder', message: 'You have 5 appointments scheduled for tomorrow.', type: 'info', read: true, date: '2025-12-14T18:00:00' },
  { id: 'n4', title: 'Critical Patient Alert', message: 'Robert Williams - Critical status flag updated. Review recommended.', type: 'warning', read: false, date: '2025-12-15T11:45:00' },
];

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  registeredUsers: [
    {
      email: 'demo@mediscribe.ai',
      password: 'demo123',
      user: {
        id: 'u1', email: 'demo@mediscribe.ai', name: 'Dr. Alex Morgan',
        role: 'physician', specialty: 'Internal Medicine',
        phone: '(555) 999-0001', licenseNumber: 'MD-2024-78901',
        joinDate: '2024-01-15'
      }
    }
  ],

  login: (email, password) => {
    const found = get().registeredUsers.find(u => u.email === email && u.password === password);
    if (found) {
      set({ user: found.user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  register: (userData, password) => {
    const exists = get().registeredUsers.find(u => u.email === userData.email);
    if (exists) return false;
    const newUser: User = { ...userData, id: generateId(), joinDate: new Date().toISOString().split('T')[0] };
    set(state => ({
      registeredUsers: [...state.registeredUsers, { email: userData.email, password, user: newUser }],
      user: newUser,
      isAuthenticated: true
    }));
    return true;
  },

  logout: () => set({ user: null, isAuthenticated: false }),

  updateProfile: (updates) => set(state => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),

  // Theme
  darkMode: true,
  toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  // Patients
  patients: defaultPatients,
  addPatient: (patient) => set(state => ({ patients: [...state.patients, { ...patient, id: generateId() }] })),
  updatePatient: (id, updates) => set(state => ({
    patients: state.patients.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deletePatient: (id) => set(state => ({ patients: state.patients.filter(p => p.id !== id) })),

  // SOAP Notes
  soapNotes: defaultSOAPNotes,
  addSOAPNote: (note) => {
    const id = generateId();
    set(state => ({ soapNotes: [...state.soapNotes, { ...note, id }] }));
    return id as any;
  },
  updateSOAPNote: (id, updates) => set(state => ({
    soapNotes: state.soapNotes.map(n => n.id === id ? { ...n, ...updates } : n)
  })),
  deleteSOAPNote: (id) => set(state => ({ soapNotes: state.soapNotes.filter(n => n.id !== id) })),

  // Appointments
  appointments: defaultAppointments,
  addAppointment: (apt) => set(state => ({ appointments: [...state.appointments, { ...apt, id: generateId() }] })),
  updateAppointment: (id, updates) => set(state => ({
    appointments: state.appointments.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAppointment: (id) => set(state => ({ appointments: state.appointments.filter(a => a.id !== id) })),

  // Notifications
  notifications: defaultNotifications,
  addNotification: (notif) => set(state => ({
    notifications: [{ ...notif, id: generateId(), read: false, date: new Date().toISOString() }, ...state.notifications]
  })),
  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  clearNotifications: () => set({ notifications: [] }),

  // Templates
  templates: defaultTemplates,
  addTemplate: (template) => set(state => ({ templates: [...state.templates, { ...template, id: generateId() }] })),
  deleteTemplate: (id) => set(state => ({ templates: state.templates.filter(t => t.id !== id) })),

  // Recording
  isRecording: false,
  recordingTime: 0,
  setRecording: (val) => set({ isRecording: val }),
  setRecordingTime: (val) => set({ recordingTime: val }),
}));
