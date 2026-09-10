import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  ShieldCheck,
  Building2,
  FileCheck2,
  HelpCircle,
  ArrowRight,
  User,
  LayoutDashboard,
} from 'lucide-react';

export const NavbarPublic: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, company } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 p-1.5 shadow-md border border-border flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/images/logo-dsn.png"
              alt="Logo DSN-MUI"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-primary">
                AMANAH
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-accent/20 text-accent border border-accent/30 tracking-wider">
                PUBLIC
              </span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground tracking-tight">
              Dewan Syariah Nasional — Majelis Ulama Indonesia
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/60 transition-colors"
          >
            Beranda
          </Link>
          <a
            href="/#alur"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/60 transition-colors"
          >
            Alur Pengajuan
          </a>
          <a
            href="/#layanan"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/60 transition-colors flex items-center gap-1.5"
          >
            <span>Kanal Layanan</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              9
            </span>
          </a>
          <a
            href="/#faq"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/60 transition-colors"
          >
            FAQ
          </a>
          <Link
            to="/help"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary/60 transition-colors"
          >
            Pusat Bantuan
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
              >
                Dashboard
              </Button>
              <div className="flex items-center gap-2 pl-2 border-l border-border text-left">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user?.fullName?.charAt(0) || 'P'}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-foreground truncate max-w-[130px]">
                    {user?.fullName}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                    {company?.name}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate('/login')}
              >
                Masuk
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Ajukan Sekarang
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white dark:bg-[#172019] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Beranda
          </Link>
          <a
            href="/#alur"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            Alur Pengajuan
          </a>
          <a
            href="/#layanan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-secondary flex items-center justify-between"
          >
            <span>Kanal Layanan DSN-MUI</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">
              9 Layanan
            </span>
          </a>
          <a
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            Tanya Jawab (FAQ)
          </a>
          <Link
            to="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            Pusat Bantuan
          </Link>

          <div className="pt-4 border-t border-border flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full"
              >
                Buka Dashboard Perusahaan
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full"
                >
                  Masuk ke Akun
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full"
                >
                  Daftar Perusahaan Baru
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
