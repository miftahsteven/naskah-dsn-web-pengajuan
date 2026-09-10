import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { NotificationDrawer } from '../ui/NotificationDrawer';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FileBadge,
  Building2,
  HelpCircle,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  User,
  ExternalLink,
} from 'lucide-react';

export const PortalLayout: React.FC = () => {
  const { user, company, unreadNotifications, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'Pengajuan Saya',
      icon: FileText,
      path: '/submissions',
    },
    {
      label: 'Sertifikat Syariah',
      icon: FileBadge,
      path: '/certificates',
    },
    {
      label: 'Profil Perusahaan',
      icon: Building2,
      path: '/profile',
    },
    {
      label: 'Pusat Bantuan',
      icon: HelpCircle,
      path: '/help',
    },
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-[#172019] border-r border-border h-screen sticky top-0 z-30 shadow-subtle">
        {/* Brand Header */}
        <div className="p-6 border-b border-border/80 flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white p-1 shadow-md border border-border flex items-center justify-center flex-shrink-0">
              <img
                src="/images/logo-dsn.png"
                alt="Logo DSN-MUI"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-primary">
                  AMANAH
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">
                DSN-MUI Public Service
              </p>
            </div>
          </Link>
        </div>

        {/* Action Button: Buat Pengajuan */}
        <div className="p-4">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/submissions/new')}
            className="w-full shadow-md hover:shadow-glow-green"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Buat Pengajuan Baru
          </Button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isCurrentPath(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-foreground/80 hover:text-primary hover:bg-secondary/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-primary'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Company Bottom Card */}
        <div className="p-4 border-t border-border/80 bg-muted/30">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-border flex items-center justify-between gap-2 shadow-subtle">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs flex-shrink-0 border border-primary/20">
                {company?.name?.charAt(0) || 'P'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-foreground truncate">
                  {company?.name}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {user?.fullName} ({user?.role})
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Keluar"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE DRAWER ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#172019] shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/logo-dsn.png" alt="DSN-MUI" className="h-8 w-8 object-contain" />
                <span className="font-extrabold text-primary text-base">AMANAH PORTAL</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSidebarOpen(false);
                navigate('/submissions/new');
              }}
              className="w-full mb-4"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              + Pengajuan Baru
            </Button>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = isCurrentPath(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      active ? 'bg-primary text-white font-semibold' : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs font-bold text-foreground truncate">{company?.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{user?.fullName}</div>
              </div>
              <button onClick={logout} className="p-2 text-rose-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-[#172019]/80 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span>Portal Perusahaan</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-foreground capitalize">
                {location.pathname.replace('/', '').split('/')[0] || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell Button */}
            <button
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* Profile badge */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold hidden md:inline truncate max-w-[120px]">
                {user?.fullName?.split(' ')[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
    </div>
  );
};
