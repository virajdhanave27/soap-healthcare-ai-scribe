import { useState } from 'react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ScribePage from './pages/ScribePage';
import SOAPNotesPage from './pages/SOAPNotesPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import TemplatesPage from './pages/TemplatesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuditLogPage from './pages/AuditLogPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

export default function App() {
  const { isAuthenticated } = useStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return authMode === 'login'
      ? <LoginPage onSwitch={() => setAuthMode('register')} />
      : <RegisterPage onSwitch={() => setAuthMode('login')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} />;
      case 'scribe': return <ScribePage />;
      case 'soap-notes': return <SOAPNotesPage />;
      case 'patients': return <PatientsPage />;
      case 'appointments': return <AppointmentsPage />;
      case 'templates': return <TemplatesPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'audit-log': return <AuditLogPage />;
      case 'settings': return <SettingsPage />;
      case 'help': return <HelpPage />;
      default: return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
