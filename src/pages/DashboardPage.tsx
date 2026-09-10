import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import api, { formatDate, getStatusMeta } from '../lib/api';
import type { PublicSubmission, SubmissionStats } from '../types';
import {
  PlusCircle,
  FileText,
  Clock,
  AlertTriangle,
  FileBadge,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileEdit,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { ServiceSelectionModal } from '../components/dashboard/ServiceSelectionModal';
import { ActiveProcessTracker } from '../components/dashboard/ActiveProcessTracker';


export const DashboardPage: React.FC = () => {
  const { user, company } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<PublicSubmission[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    draft: 0,
    inProgress: 0,
    actionNeeded: 0,
    completed: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/submissions?limit=10');
      if (res.data.status === 'success') {
        setSubmissions(res.data.data.submissions || []);
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeDraft = submissions.find((s) => s.status === 'DRAFT');
  const activeActionNeeded = submissions.find((s) => s.status === 'PERLU_PERBAIKAN');

  return (
    <div className="space-y-8">
      {/* ── 1. WELCOME GREETING & HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{company?.legalType || 'PT'} {company?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Selamat Datang, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Kelola pengajuan opini dan sertifikasi kesesuaian syariah perusahaan Anda dengan Dewan Syariah Nasional – MUI.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsServiceModalOpen(true)}
            className="shadow-md hover:shadow-glow-green"
            leftIcon={<PlusCircle className="w-5 h-5" />}
          >
            + Buat Pengajuan Baru
          </Button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      </div>

      {/* ── 2. PROMINENT ACTION NOTICES ── */}
      {/* Notice: Perlu Tindakan / Revisi */}
      {activeActionNeeded && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">
                Pengajuan Memerlukan Tindakan Perbaikan: {activeActionNeeded.submissionNumber}
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                {activeActionNeeded.title}
              </p>
            </div>
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={() => navigate(`/submissions/${activeActionNeeded.id}`)}
            className="whitespace-nowrap flex-shrink-0"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Lengkapi Dokumen Revisi
          </Button>
        </div>
      )}

      {/* Notice: Active Draft */}
      {activeDraft && !activeActionNeeded && (
        <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">
                Draf Pengajuan Tersimpan (Langkah {activeDraft.stepCompleted} dari 4)
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-300 mt-0.5">
                {activeDraft.title}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/submissions/${activeDraft.id}/edit`)}
            className="whitespace-nowrap flex-shrink-0"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Lanjutkan Pengajuan
          </Button>
        </div>
      )}

      {/* ── 3. METRIC SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total */}
        <div
          onClick={() => navigate('/submissions')}
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle hover:border-primary/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Pengajuan
            </span>
            <div className="w-8 h-8 rounded-xl bg-muted text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {stats.total}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span>Seluruh permohonan</span>
            <ChevronRight className="w-3 h-3 text-primary" />
          </div>
        </div>

        {/* Card 2: Dalam Proses */}
        <div
          onClick={() => navigate('/submissions?status=IN_PROGRESS')}
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle hover:border-primary/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dalam Proses
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">
            {stats.inProgress}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span>Verifikasi & Pembahasan</span>
            <ChevronRight className="w-3 h-3 text-primary" />
          </div>
        </div>

        {/* Card 3: Perlu Tindakan */}
        <div
          onClick={() => navigate('/submissions?status=ACTION_NEEDED')}
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Perlu Tindakan
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {stats.actionNeeded}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span>Memerlukan perbaikan</span>
            <ChevronRight className="w-3 h-3 text-primary" />
          </div>
        </div>

        {/* Card 4: Selesai */}
        <div
          onClick={() => navigate('/certificates')}
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Sertifikat Terbit
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileBadge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {stats.completed}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span>Siap diunduh & dicetak</span>
            <ChevronRight className="w-3 h-3 text-primary" />
          </div>
        </div>
      </div>

      {/* ── 4. ACTIVE SUBMISSIONS PROCESS TRACKER (MULTI-LETTER ROADMAP) ── */}
      <ActiveProcessTracker
        submissions={submissions}
        isLoading={isLoading}
        onOpenNewSubmission={() => setIsServiceModalOpen(true)}
      />

      {/* ── 5. RECENT SUBMISSIONS TABLE & QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submissions List (Col 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Pengajuan Terbaru</h3>
              <p className="text-xs text-muted-foreground">Status dan riwayat permohonan terkini</p>
            </div>
            <Link
              to="/submissions"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-[#172019] rounded-3xl border border-border shadow-subtle overflow-hidden">
            {isLoading ? (
              <div className="py-16 text-center text-xs text-muted-foreground">
                Memuat data pengajuan...
              </div>
            ) : submissions.length === 0 ? (
              <div className="py-16 text-center px-4 space-y-3">
                <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                <h4 className="text-sm font-bold text-foreground">Belum ada pengajuan</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Mulai pengajuan kesesuaian syariah pertama perusahaan Anda melalui portal resmi Amanah.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/submissions/new')}
                  className="mt-2"
                >
                  + Buat Pengajuan Pertama
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() =>
                      navigate(
                        sub.status === 'DRAFT'
                          ? `/submissions/${sub.id}/edit`
                          : `/submissions/${sub.id}`
                      )
                    }
                    className="p-4 sm:p-5 hover:bg-muted/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          {sub.submissionNumber}
                        </span>
                        <Badge status={sub.status} size="sm" />
                        <span className="text-[11px] text-muted-foreground">
                          • {formatDate(sub.submittedAt || sub.createdAt)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground truncate max-w-lg">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {sub.productOrServiceName ? `Produk: ${sub.productOrServiceName}` : sub.submissionTypeName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <Button variant="ghost" size="sm">
                        Detail <ChevronRight className="w-4 h-4 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Helper Sidebar (Col 1) */}
        <div className="space-y-6">
          {/* Quick Guide Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#006633] to-[#1B7F4A] text-white shadow-card space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Layanan Syariah</span>
            </div>
            <h4 className="text-base font-bold">Panduan Berkas Permohonan</h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Pastikan dokumen surat permohonan resmi dan draf akad telah ditandatangani sebelum melakukan final submission.
            </p>
            <div className="pt-2">
              <Link to="/help">
                <Button
                  variant="gold"
                  size="sm"
                  className="w-full shadow-md"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Buka Pusat Bantuan
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Info Secretariat */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Sekretariat DSN-MUI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Butuh asistensi terkait persyaratan atau agenda pembahasan sidang pleno?
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-foreground">
              <div>
                <strong>Telepon:</strong> (021) 3192 7623
              </div>
              <div>
                <strong>Email:</strong> sekretariat@dsnmui.or.id
              </div>
              <div>
                <strong>Jam Layanan:</strong> Senin - Jumat (08.30 - 16.00 WIB)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. COMPACT MACBOOK SERVICE SELECTION MODAL ── */}
      <ServiceSelectionModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />
    </div>
  );
};
