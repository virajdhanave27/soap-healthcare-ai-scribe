import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard, Mic, FileText, Users, Calendar, Settings, LogOut,
  Bell, Search, ChevronLeft, ChevronRight, Stethoscope, BarChart3,
  ClipboardList, BookTemplate, HelpCircle, Moon, Sun, Menu, User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout, darkMode, toggleDarkMode, sidebarOpen, toggleSidebar, notifications, markNotificationRead } = useStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scribe', label: 'Clinical Scribe', icon: Mic },
    { id: 'soap-notes', label: 'SOAP Notes', icon: FileText },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'templates', label: 'Templates', icon: BookTemplate },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit-log', label: 'Audit Log', icon: ClipboardList },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen z-40 bg-dark-900 border-r border-dark-800 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && <span className="text-white font-bold text-lg whitespace-nowrap">MediScribe</span>}
          </div>
          <button onClick={toggleSidebar} className="text-dark-400 hover:text-white p-1 hidden lg:block">
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-primary-600/20 text-primary-400'
                  : 'text-dark-400 hover:bg-dark-800 hover:text-white'
              }`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom Items */}
        <div className="px-3 py-4 border-t border-dark-800 space-y-1">
          {bottomItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-primary-600/20 text-primary-400'
                  : 'text-dark-400 hover:bg-dark-800 hover:text-white'
              }`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden text-dark-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search patients, notes, templates..."
                className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 top-12 w-80 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  <div className="p-4 border-b border-dark-800 flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    <span className="text-xs text-dark-400">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-dark-500 text-sm text-center">No notifications</p>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <button key={n.id} onClick={() => markNotificationRead(n.id)}
                          className={`w-full p-3 text-left hover:bg-dark-800 transition flex gap-3 ${!n.read ? 'bg-dark-800/50' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            n.type === 'success' ? 'bg-green-500' :
                            n.type === 'warning' ? 'bg-yellow-500' :
                            n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="text-sm text-white font-medium">{n.title}</p>
                            <p className="text-xs text-dark-400 mt-0.5">{n.message}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
                className="flex items-center gap-3 hover:bg-dark-800 rounded-xl p-2 transition">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                {sidebarOpen && (
                  <div className="hidden md:block text-left">
                    <p className="text-sm text-white font-medium">{user?.name}</p>
                    <p className="text-xs text-dark-400">{user?.specialty || user?.role}</p>
                  </div>
                )}
              </button>

              {showProfile && (
                <div className="absolute right-0 top-12 w-56 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  <div className="p-4 border-b border-dark-800">
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-dark-400 text-xs">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button onClick={() => { onNavigate('settings'); setShowProfile(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-dark-300 hover:bg-dark-800 hover:text-white flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile Settings
                    </button>
                    <button onClick={() => { logout(); setShowProfile(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifs || showProfile) && (
        <div className="fixed inset-0 z-20" onClick={() => { setShowNotifs(false); setShowProfile(false); }} />
      )}
    </div>
  );
}
