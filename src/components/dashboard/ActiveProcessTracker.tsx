import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PublicSubmission } from '../../types';
import { formatDate } from '../../lib/api';
import { DsnServiceIcon } from '../common/DsnServiceIcon';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  Building2,
  AlertTriangle,
  PlusCircle,
  Eye,
} from 'lucide-react';

interface ActiveProcessTrackerProps {
  submissions: PublicSubmission[];
  isLoading?: boolean;
  onOpenNewSubmission: () => void;
}

interface StepItem {
  number: number;
  label: string;
  sublabel: string;
  description: string;
}

export const ActiveProcessTracker: React.FC<ActiveProcessTrackerProps> = ({
  submissions,
  isLoading = false,
  onOpenNewSubmission,
}) => {
  const navigate = useNavigate();

  // Prefer in-progress or submitted applications, fallback to all
  const activeSubmissions = submissions.filter((s) => s.status !== 'DRAFT');
  const displayList = activeSubmissions.length > 0 ? activeSubmissions : submissions;

  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    if (displayList.length > 0 && (!selectedId || !displayList.some((s) => s.id === selectedId))) {
      setSelectedId(displayList[0].id);
    }
  }, [displayList, selectedId]);

  const selectedSub = displayList.find((s) => s.id === selectedId) || displayList[0];
  const selectedIndex = displayList.findIndex((s) => s.id === (selectedSub?.id || ''));

  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-[#172019] border border-border text-center space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Memuat pelacak proses pengajuan...</p>
      </div>
    );
  }

  // ── EMPTY STATE ──
  if (!selectedSub || displayList.length === 0) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle text-center relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-4 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-foreground">
              Belum Ada Proses Pengajuan yang Berjalan
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Saat ini belum ada permohonan opini atau sertifikasi syariah yang sedang diproses. Mulai pengajuan resmi pertama institusi Anda.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={onOpenNewSubmission}
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="shadow-md"
            >
              + Buat Pengajuan Baru
            </Button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    );
  }

  // Determine if selected submission is DPS
  const isDps =
    !!selectedSub.dpsStage ||
    selectedSub.submissionTypeName?.toLowerCase().includes('dps') ||
    selectedSub.title?.toLowerCase().includes('dps') ||
    (Array.isArray(selectedSub.candidates) && selectedSub.candidates.length > 0);

  // Define 5-Stage Roadmap based on submission type
  const dpsSteps: StepItem[] = [
    {
      number: 1,
      label: 'Pengajuan Berkas',
      sublabel: 'Surat & Dokumen Masuk',
      description: 'Surat permohonan resmi perusahaan & berkas calon DPS telah diterima sistem DSN-MUI.',
    },
    {
      number: 2,
      label: 'Validasi Dokumen',
      sublabel: 'Verifikasi Sekretariat',
      description: 'Pemeriksaan keabsahan CV, sertifikat pelatihan dasar DPS, dan surat rekomendasi MUI setempat.',
    },
    {
      number: 3,
      label: 'Wawancara Calon',
      sublabel: 'Fit & Proper Test',
      description: 'Uji kompetensi fikih muamalah, komitmen independensi, dan wawancara calon Dewan Pengawas Syariah.',
    },
    {
      number: 4,
      label: 'Proses Internal DSN',
      sublabel: 'Telaah & Sidang Pleno',
      description: 'Pengkajian oleh Tim Pakar Syariah dan musyawarah dalam Sidang Pleno Badan Pengurus Harian (BPH).',
    },
    {
      number: 5,
      label: 'Keputusan Rekomendasi',
      sublabel: 'Penerbitan Surat DSN',
      description: 'Penerbitan Surat Rekomendasi DPS resmi untuk penetapan RUPS dan perizinan ke regulator (OJK/BI).',
    },
  ];

  const genericSteps: StepItem[] = [
    {
      number: 1,
      label: 'Pengajuan Diterima',
      sublabel: 'Registrasi Berkas',
      description: 'Surat permohonan resmi dan kelengkapan dokumen telah teregistrasi di sistem Amanah.',
    },
    {
      number: 2,
      label: 'Verifikasi Administrasi',
      sublabel: 'Pemeriksaan Dokumen',
      description: 'Verifikasi kelengkapan akad, alur transaksi, dan legalitas dokumen pendukung oleh sekretariat.',
    },
    {
      number: 3,
      label: 'Pembahasan Syariah',
      sublabel: 'Kajian Fikih Muamalah',
      description: 'Penelaahan substansi kepatuhan syariah terhadap fatwa DSN-MUI oleh tim ahli dan dewan pakar.',
    },
    {
      number: 4,
      label: 'Sidang Pleno BPH',
      sublabel: 'Musyawarah Pengesahan',
      description: 'Pembahasan tingkat pimpinan dalam Sidang Pleno Badan Pengurus Harian DSN-MUI.',
    },
    {
      number: 5,
      label: 'Penerbitan Surat/Sertifikat',
      sublabel: 'Pengesahan Resmi',
      description: 'Pengesahan dan penerbitan surat keputusan / sertifikat kesesuaian syariah bertanda tangan resmi.',
    },
  ];

  const steps = isDps ? dpsSteps : genericSteps;

  // Calculate current active step index (1-based)
  const calculateCurrentStep = (): number => {
    if (isDps) {
      if (selectedSub.dpsStage) {
        switch (selectedSub.dpsStage) {
          case 'LULUS':
            return 5;
          case 'PROSES_INTERNAL':
            return 4;
          case 'WAWANCARA':
            return 3;
          case 'VALIDASI_DOKUMEN':
            return 2;
          case 'PROSES_PENGAJUAN':
          default:
            return 1;
        }
      }
      const stage = selectedSub.status;
      switch (stage) {
        case 'LULUS':
        case 'SELESAI':
        case 'SERTIFIKAT_DITERBITKAN':
          return 5;
        case 'PROSES_INTERNAL':
        case 'PROSES_KEPUTUSAN':
          return 4;
        case 'WAWANCARA':
          return 3;
        case 'VALIDASI_DOKUMEN':
        case 'VERIFIKASI_ADMINISTRASI':
        case 'SEDANG_DIPROSES':
          return 2;
        case 'PROSES_PENGAJUAN':
        case 'SUBMITTED':
        default:
          return 1;
      }
    } else {
      const st = selectedSub.status;
      switch (st) {
        case 'SERTIFIKAT_DITERBITKAN':
        case 'SELESAI':
          return 5;
        case 'PROSES_KEPUTUSAN':
        case 'DISETUJUI':
          return 4;
        case 'DALAM_PEMBAHASAN':
          return 3;
        case 'VERIFIKASI_ADMINISTRASI':
        case 'SEDANG_DIPROSES':
          return 2;
        case 'SUBMITTED':
        default:
          return 1;
      }
    }
  };

  const currentStep = calculateCurrentStep();
  const candidatesCount = Array.isArray(selectedSub.candidates) ? selectedSub.candidates.length : 0;

  return (
    <div className="space-y-4">
      {/* ── 1. HEADER SECTION & MULTI-SUBMISSION SELECTOR TABS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#172019] p-4 sm:p-5 rounded-3xl border border-border shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                Proses Pengajuan Sedang Berjalan
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {displayList.length} Surat Terdaftar
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Pantau alur verifikasi & agenda sidang syariah untuk permohonan yang aktif
            </p>
          </div>
        </div>

        {/* Multi-letter Switcher Controls (Prev / Next & Counter) */}
        {displayList.length > 1 && (
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              Surat {selectedIndex + 1} dari {displayList.length}
            </span>
            <button
              onClick={() => {
                const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : displayList.length - 1;
                setSelectedId(displayList[prevIdx].id);
              }}
              className="p-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors"
              title="Surat Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const nextIdx = selectedIndex < displayList.length - 1 ? selectedIndex + 1 : 0;
                setSelectedId(displayList[nextIdx].id);
              }}
              className="p-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors"
              title="Surat Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── 2. MULTI-SUBMISSION SWITCHER TABS (PILLS) ── */}
      {displayList.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {displayList.map((sub, idx) => {
            const isSelected = sub.id === selectedSub.id;
            const subIsDps =
              !!sub.dpsStage ||
              sub.submissionTypeName?.toLowerCase().includes('dps') ||
              sub.title?.toLowerCase().includes('dps');

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedId(sub.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left border transition-all flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/30'
                    : 'bg-white dark:bg-[#172019] border-border hover:border-emerald-500/40 hover:bg-muted/30'
                }`}
              >
                {/* Live pulsing status beacon */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      sub.status === 'PERLU_PERBAIKAN'
                        ? 'bg-amber-500'
                        : sub.status === 'SERTIFIKAT_DITERBITKAN' || sub.status === 'SELESAI'
                        ? 'bg-teal-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  {isSelected && (
                    <span className="absolute w-4 h-4 rounded-full bg-emerald-500/30 animate-ping" />
                  )}
                </div>

                <div className="min-w-0 max-w-[210px] sm:max-w-[260px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-primary'
                      }`}
                    >
                      {sub.submissionNumber}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      • {subIsDps ? 'Rekomendasi DPS' : sub.submissionTypeName || 'Syariah'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-foreground truncate mt-0.5">
                    {sub.companyLetterNumber
                      ? `Surat: ${sub.companyLetterNumber}`
                      : sub.title || 'Pengajuan Syariah'}
                  </div>
                </div>

                <div className="ml-1 pl-2 border-l border-border/80 text-[10px] font-semibold text-muted-foreground shrink-0">
                  #{idx + 1}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── 3. MAIN TRACKER CARD FOR SELECTED SUBMISSION ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle space-y-6 relative overflow-hidden">
        {/* Top Info Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div className="flex items-start gap-4">
            {/* Squircle Service Icon */}
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <DsnServiceIcon name={isDps ? 'Users' : 'BookOpen'} className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  {selectedSub.submissionNumber}
                </span>
                <Badge status={selectedSub.status} size="sm" />
                <span className="text-xs text-muted-foreground">
                  Diajukan {formatDate(selectedSub.submittedAt || selectedSub.createdAt)}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                {selectedSub.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                {selectedSub.companyLetterNumber && (
                  <div className="flex items-center gap-1 text-foreground font-medium">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No. Surat Perusahaan: <strong>{selectedSub.companyLetterNumber}</strong></span>
                  </div>
                )}
                {isDps && candidatesCount > 0 && (
                  <div className="flex items-center gap-1 text-teal-700 dark:text-teal-300 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>{candidatesCount} Calon DPS Diajukan</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button: Detail Berkas */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/submissions/${selectedSub.id}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-sm"
            >
              Lihat Detail & Berkas Surat
            </Button>
          </div>
        </div>

        {/* ── 4. FIVE-STAGE ROADMAP STEPPER ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Alur Tahapan Penelaahan:
              </span>
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Tahap {currentStep} dari 5: {steps[currentStep - 1]?.label}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verifikasi Resmi Sekretariat DSN-MUI</span>
            </div>
          </div>

          {/* Stepper Grid (5 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {steps.map((step) => {
              const isCompleted = step.number < currentStep;
              const isActive = step.number === currentStep;
              const isUpcoming = step.number > currentStep;

              return (
                <div
                  key={step.number}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    isActive
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : isCompleted
                      ? 'bg-slate-50/70 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-muted/20 border-border/70 opacity-70'
                  }`}
                >
                  {/* Top: Step Indicator & Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/30'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                    </div>

                    {isActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        Aktif
                      </span>
                    )}

                    {isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        Selesai
                      </span>
                    )}

                    {isUpcoming && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        Menunggu
                      </span>
                    )}
                  </div>

                  {/* Middle: Step Label & Sublabel */}
                  <div className="space-y-1">
                    <h4
                      className={`text-xs sm:text-sm font-extrabold leading-snug ${
                        isActive
                          ? 'text-emerald-900 dark:text-emerald-200'
                          : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] font-medium text-muted-foreground leading-tight">
                      {step.sublabel}
                    </p>
                  </div>

                  {/* Bottom: Indicator line */}
                  <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-muted-foreground leading-tight">
                    {step.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 5. EXTRA CONTEXT HIGHLIGHT BOX ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Box 1: Identitas Surat & Tanggal */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Identitas Berkas Permohonan</span>
            </div>
            <div className="text-xs space-y-1 text-foreground">
              <div>
                <span className="text-muted-foreground">No. Agenda DSN: </span>
                <strong className="font-mono">{selectedSub.submissionNumber}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">No. Surat Pemohon: </span>
                <strong>{selectedSub.companyLetterNumber || '-'}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Tgl Surat: </span>
                <span>
                  {selectedSub.companyLetterDate
                    ? formatDate(selectedSub.companyLetterDate)
                    : formatDate(selectedSub.submittedAt || selectedSub.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Box 2: Dokumen & Calon Terdaftar */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isDps ? 'Calon DPS & Lampiran' : 'Kelengkapan Berkas'}</span>
            </div>
            <div className="text-xs space-y-1 text-foreground">
              {isDps ? (
                <>
                  <div>
                    <span className="text-muted-foreground">Jumlah Calon: </span>
                    <strong className="text-emerald-700 dark:text-emerald-300">
                      {candidatesCount} Nama Calon Terdaftar
                    </strong>
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {Array.isArray(selectedSub.candidates) && selectedSub.candidates.length > 0
                      ? selectedSub.candidates.map((c) => c.name).join(', ')
                      : 'Berkas calon lengkap tersimpan'}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-muted-foreground">Kategori Layanan: </span>
                    <strong>{selectedSub.submissionTypeName}</strong>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Dokumen resmi permohonan tersimpan aman di arsip DSN-MUI.
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Box 3: Catatan Status dari Sekretariat */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Catatan Status Pelayanan</span>
            </div>
            <p className="text-xs text-emerald-900/90 dark:text-emerald-200 leading-relaxed">
              {currentStep === 1 &&
                'Berkas surat permohonan Anda telah tercatat pada sistem Surat Masuk Amanah dan segera ditelaah oleh tim verifikator.'}
              {currentStep === 2 &&
                'Dokumen persyaratan dan legalitas sedang diverifikasi kelengkapannya oleh staf sekretariat DSN-MUI.'}
              {currentStep === 3 &&
                'Jadwal wawancara kompetensi syariah sedang disiapkan oleh panitia penguji DSN-MUI.'}
              {currentStep === 4 &&
                'Pengajuan Anda sedang diagendakan dalam musyawarah Sidang Pleno BPH DSN-MUI.'}
              {currentStep === 5 &&
                'Keputusan resmi telah disahkan dan surat penetapan dapat diunduh melalui portal ini.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
