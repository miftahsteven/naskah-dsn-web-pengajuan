import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavbarPublic } from '../components/layout/NavbarPublic';
import { FooterPublic } from '../components/layout/FooterPublic';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import api from '../lib/api';
import type { SubmissionTypeMaster } from '../types';
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  FileCheck2,
  Clock,
  FileBadge,
  Building2,
  SmartphoneNfc,
  TrendingUp,
  Shield,
  Hotel,
  ShoppingBag,
  CheckCircle2,
  Search,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import { DsnServicesChannel } from '../components/home/DsnServicesChannel';


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [verifyCertNumber, setVerifyCertNumber] = useState('');

  useEffect(() => {
    // Fetch FAQs
    api.get('/master/faqs')
      .then((res) => {
        if (res.data.status === 'success') {
          setFaqs(res.data.data);
        }
      })
      .catch((err) => console.warn('Could not fetch FAQs:', err));
  }, []);

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCertNumber.trim()) {
      navigate(`/verify/public/${encodeURIComponent(verifyCertNumber.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <NavbarPublic />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 gradient-hero border-b border-border/60">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Col: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Institution badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-emerald-200/80 text-primary text-xs font-semibold shadow-subtle animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Portal Resmi Dewan Syariah Nasional – MUI</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                Pengajuan Kesesuaian Syariah Lebih Mudah melalui{' '}
                <span className="text-gradient">Amanah</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Ajukan dokumen permohonan, pantau perkembangan proses secara transparan, lengkapi kebutuhan administrasi, dan akses sertifikat kesesuaian syariah Anda dalam satu platform digital resmi.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto shadow-lg hover:shadow-glow-green"
                >
                  Ajukan Sekarang
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto"
                >
                  Masuk ke Akun PIC
                </Button>
              </div>

              {/* Trust Indicators / Stats */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-border/80 text-center sm:text-left">
                <div>
                  <div className="text-2xl lg:text-3xl font-extrabold text-primary">100%</div>
                  <div className="text-xs text-muted-foreground font-medium">Digital & Paperless</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-extrabold text-accent">Realtime</div>
                  <div className="text-xs text-muted-foreground font-medium">Pelacakan Proses</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-extrabold text-foreground">Terintegrasi</div>
                  <div className="text-xs text-muted-foreground font-medium">Surat Masuk DSN-MUI</div>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glass Card */}
                <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 space-y-6 relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-md">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">Siklus Pengajuan</div>
                        <div className="text-xs text-muted-foreground">Satu Pintu Layanan Digital</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                      Terverifikasi
                    </span>
                  </div>

                  {/* Flow preview pills */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3 shadow-subtle">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">Daftar Akun & PIC</div>
                        <div className="text-[11px] text-muted-foreground">Otentikasi aman tanpa password (Email OTP)</div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3 shadow-subtle">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">Unggah Surat & Dokumen Syarat</div>
                        <div className="text-[11px] text-muted-foreground">Checklist persyaratan otomatis sesuai jenis produk</div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3 shadow-subtle">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">Pantau Pembahasan & Revisi</div>
                        <div className="text-[11px] text-muted-foreground">Timeline transparan dari verifikasi hingga rapat pleno</div>
                      </div>
                      <Clock className="w-4 h-4 text-accent" />
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 shadow-subtle">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        4
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-emerald-900 dark:text-emerald-300">Unduh Sertifikat Digital</div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Dilengkapi QR Code Keabsahan Resmi</div>
                      </div>
                      <FileBadge className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>

                  {/* Search Verification Bar */}
                  <form onSubmit={handleVerifySearch} className="pt-2">
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5">
                      Cek Keaslian Sertifikat DSN-MUI:
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <input
                          type="text"
                          value={verifyCertNumber}
                          onChange={(e) => setVerifyCertNumber(e.target.value)}
                          placeholder="Nomor Sertifikat (cth: DSN-MUI/KS/...)"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                      <Button variant="secondary" size="sm" type="submit">
                        Verifikasi
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FOUR STEP PROCESS SECTION ── */}
      <section id="alur" className="py-20 bg-white dark:bg-[#121a14] border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest px-3 py-1 rounded-full bg-secondary">
              Alur Pelayanan
            </span>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              4 Langkah Mudah Pengajuan Kesesuaian Syariah
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Seluruh siklus pengajuan diintegrasikan ke dalam sistem digital terpusat tanpa perlu korespondensi email berulang atau konfirmasi manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-card group relative">
              <div className="w-12 h-12 rounded-2xl gradient-primary text-white flex items-center justify-center font-extrabold text-lg mb-6 shadow-md group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Daftar Perusahaan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Daftarkan lembaga/organisasi Anda dan lengkapi data kontak PIC. Otentikasi menggunakan OTP email instan tanpa password.
              </p>
              <div className="text-xs font-semibold text-primary flex items-center gap-1">
                Registrasi Cepat <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-card group relative">
              <div className="w-12 h-12 rounded-2xl gradient-primary text-white flex items-center justify-center font-extrabold text-lg mb-6 shadow-md group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Lengkapi Pengajuan</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Pilih kategori pengajuan, unggah surat permohonan resmi, dan lampirkan dokumen persyaratan sesuai checklist dinamis.
              </p>
              <div className="text-xs font-semibold text-primary flex items-center gap-1">
                Draf Tersimpan Otomatis <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-card group relative">
              <div className="w-12 h-12 rounded-2xl gradient-primary text-white flex items-center justify-center font-extrabold text-lg mb-6 shadow-md group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Pantau Proses</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Pantau setiap tahapan: verifikasi berkas, telaah tim ahli, perbaikan bila diperlukan, hingga jadwal rapat pleno BPH DSN-MUI.
              </p>
              <div className="text-xs font-semibold text-primary flex items-center gap-1">
                Timeline Transparan <Clock className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-card group relative">
              <div className="w-12 h-12 rounded-2xl gradient-gold text-white flex items-center justify-center font-extrabold text-lg mb-6 shadow-md group-hover:scale-110 transition-transform">
                04
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Terima Sertifikat</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Setelah keputusan disetujui, sertifikat kesesuaian syariah resmi diterbitkan dan dapat langsung diunduh dalam format PDF bertanda tangan digital.
              </p>
              <div className="text-xs font-semibold text-accent flex items-center gap-1">
                Digital & QR Verified <FileBadge className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DEDICATED CHANNEL: 9 RESMI DSN-MUI SERVICES ── */}
      <DsnServicesChannel />

      {/* ── 4. BENEFITS & PRINCIPLES SECTION ── */}
      <section className="py-20 bg-white dark:bg-[#121a14] border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-primary uppercase tracking-widest px-3 py-1 rounded-full bg-secondary">
                Nilai Utama Sistem
              </span>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                Satu Pintu Digital Resmi Pelayanan DSN-MUI
              </h2>
              <blockquote className="p-4 rounded-2xl bg-secondary/50 border-l-4 border-primary text-sm font-semibold text-primary italic">
                “Submit once. Track everything. Communicate transparently. Receive digitally.”
              </blockquote>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Amanah menjadi sumber informasi resmi (single source of truth) atas seluruh proses permohonan kesesuaian syariah. Perusahaan tidak perlu lagi menanyakan status melalui WhatsApp atau mengirim ulang berkas via email.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Terintegrasi Langsung ke Surat Masuk ERP</h4>
                    <p className="text-xs text-muted-foreground">Begitu diajukan, berkas otomatis masuk ke antrean kerja verifikator DSN-MUI tanpa input ulang.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Struktur Perbaikan Berkas yang Rapi</h4>
                    <p className="text-xs text-muted-foreground">Catatan revisi dari tim verifikator tersaji spesifik sehingga perusahaan dapat segera merespon dengan tepat.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Penerbitan Sertifikat Digital Tersertifikasi</h4>
                    <p className="text-xs text-muted-foreground">Sertifikat dilengkapi tanda tangan elektronik dan QR code verifikasi publik yang sah.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#006633] to-[#1B7F4A] text-white shadow-2xl relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Jaminan Kualitas & Kepatuhan</h3>
                    <p className="text-xs text-emerald-100">Dewan Syariah Nasional – MUI</p>
                  </div>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Platform Amanah mematuhi standar tata kelola dokumen pemerintahan dan sertifikasi ISO 9001:2015 untuk memastikan keamanan, kerahasiaan data perusahaan, serta keabsahan proses fatwa.
                </p>

                <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2">
                  <div className="text-xs font-semibold text-accent">Kesiapan Dokumen</div>
                  <div className="text-[11px] text-emerald-100/80">
                    Pastikan surat permohonan resmi telah ditandatangani oleh jajaran pimpinan lembaga sebelum melakukan submit akhir.
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="md"
                  onClick={() => navigate('/register')}
                  className="w-full shadow-lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Mulai Pengajuan Pertama Anda
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ SECTION ── */}
      <section id="faq" className="py-20 bg-background border-b border-border/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest px-3 py-1 rounded-full bg-secondary">
              Tanya Jawab
            </span>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-muted-foreground">
              Informasi lengkap mengenai tata cara registrasi, berkas persyaratan, dan sertifikasi.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.flatMap((cat, cIdx) => cat.items.map((faq: any, fIdx: number) => {
              const globalIdx = cIdx * 100 + fIdx;
              const isOpen = openFaqIndex === globalIdx;

              return (
                <div
                  key={globalIdx}
                  className="rounded-2xl bg-white dark:bg-[#172019] border border-border overflow-hidden shadow-subtle transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : globalIdx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3 bg-muted/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA BANNER ── */}
      <section className="py-16 gradient-primary text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Siap Mengajukan Kesesuaian Syariah untuk Produk Anda?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Daftarkan perusahaan Anda sekarang dan nikmati kemudahan administrasi digital terintegrasi bersama DSN-MUI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto shadow-xl"
            >
              Daftar Perusahaan Baru
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              Masuk ke Akun PIC
            </Button>
          </div>
        </div>
      </section>

      <FooterPublic />
    </div>
  );
};
