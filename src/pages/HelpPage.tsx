import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavbarPublic } from '../components/layout/NavbarPublic';
import { FooterPublic } from '../components/layout/FooterPublic';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
  HelpCircle,
  BookOpen,
  FileCheck2,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Search,
  FileText,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/master/faqs').then((res) => {
      if (res.data.status === 'success') {
        setFaqs(res.data.data);
      }
    });
  }, []);

  const allFaqItems = faqs.flatMap((cat, cIdx) =>
    cat.items.map((item: any, fIdx: number) => ({
      ...item,
      category: cat.category,
      key: `${cIdx}-${fIdx}`,
    }))
  );

  const filteredFaqs = allFaqItems.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isAuthenticated ? (
        <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-border/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors py-1.5 px-3 rounded-xl hover:bg-secondary/60"
              >
                <ArrowLeft className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Kembali ke Dashboard Portal</span>
                <span className="sm:hidden">Dashboard</span>
              </Link>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-primary text-sm tracking-tight">AMANAH</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-secondary text-primary border border-border">
                  PUSAT BANTUAN
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="primary" size="sm" leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>
      ) : (
        <NavbarPublic />
      )}

      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10 w-full">
        {/* Quick Breadcrumb / Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors py-1.5 px-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isAuthenticated ? 'Kembali ke Dashboard' : 'Kembali ke Beranda'}</span>
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <LayoutDashboard className="w-3.5 h-3.5" /> Buka Dashboard
            </Link>
          )}
        </div>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-primary flex items-center justify-center mx-auto shadow-sm">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Pusat Bantuan & Panduan Syariah
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Temukan jawaban lengkap mengenai mekanisme pengajuan, persyaratan dokumen fatwa, dan panduan teknis portal Amanah.
          </p>

          {/* Search Box */}
          <div className="relative pt-3">
            <Search className="w-4 h-4 absolute left-3.5 top-6 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan atau kata kunci (cth: revisi, sertifikat, OTP, biaya)..."
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-subtle focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Contact Hotline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-foreground">Sekretariat Telepon</div>
              <p className="text-[11px] text-muted-foreground">(021) 3192 7623</p>
              <div className="text-[10px] text-primary font-semibold">Senin - Jumat 08:30 - 16:00</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-foreground">Email Resmi</div>
              <p className="text-[11px] text-muted-foreground">sekretariat@dsnmui.or.id</p>
              <div className="text-[10px] text-primary font-semibold">Respon 1x24 jam kerja</div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-foreground">Kantor DSN-MUI</div>
              <p className="text-[11px] text-muted-foreground">Gedung MUI Lt. 3, Jl. Proklamasi 51, Menteng</p>
              <div className="text-[10px] text-primary font-semibold">Jakarta Pusat 10320</div>
            </div>
          </div>
        </div>

        {/* FAQs List */}
        <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-foreground">Daftar Tanya Jawab</h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.key || idx}
                  className="rounded-2xl bg-background border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-foreground hover:text-primary transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-2.5 bg-muted/20">
                      <div className="text-[10px] font-bold text-primary mb-1">
                        Kategori: {faq.category}
                      </div>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Card back to Dashboard */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-amber-950/20 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-foreground">
              {isAuthenticated ? 'Sudah menemukan panduan yang Anda butuhkan?' : 'Siap mengajukan permohonan syariah?'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isAuthenticated
                ? 'Kembali ke Dashboard portal untuk memantau pengajuan rekomendasi DPS dan layanan syariah Anda.'
                : 'Daftarkan akun perusahaan Anda untuk mulai mengajukan rekomendasi Dewan Pengawas Syariah.'}
            </p>
          </div>

          <Link to={isAuthenticated ? '/dashboard' : '/login'}>
            <Button
              variant="gold"
              size="md"
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
              className="shadow-md shrink-0 font-bold"
            >
              {isAuthenticated ? 'Kembali ke Dashboard' : 'Masuk ke Portal'}
            </Button>
          </Link>
        </div>
      </div>

      <FooterPublic />
    </div>
  );
};
