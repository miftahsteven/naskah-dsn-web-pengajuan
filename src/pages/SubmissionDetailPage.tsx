import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { DocumentViewerModal } from '../components/ui/DocumentViewerModal';
import api, { formatDate, formatDateTime, formatFileSize, getStatusMeta, getFileUrl } from '../lib/api';
import type { PublicSubmission } from '../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileBadge,
  Download,
  Eye,
  ChevronLeft,
  Calendar,
  Building2,
  User,
  UploadCloud,
  Send,
  Sparkles,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Check,
  MapPin,
  Users,
  Printer,
  Video,
  Mail,
} from 'lucide-react';
import { OfficialInterviewInvitationModal } from '../components/submissions/OfficialInterviewInvitationModal';
import { EditSubmissionDocumentsModal } from '../components/submissions/EditSubmissionDocumentsModal';

export const SubmissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<PublicSubmission | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Revision Modal State
  const [showRevisionModal, setShowRevisionModal] = useState<boolean>(false);

  // Document Viewer Modal State
  const [previewDoc, setPreviewDoc] = useState<{
    isOpen: boolean;
    title: string;
    fileUrl: string;
    fileSize?: number;
  }>({
    isOpen: false,
    title: '',
    fileUrl: '',
  });

  // Official Interview Invitation Modal State
  const [showInvitationModal, setShowInvitationModal] = useState<boolean>(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/submissions/${id}`);
      if (res.data.status === 'success') {
        setSubmission(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Gagal memuat detail pengajuan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-muted-foreground">
        Memuat detail pengajuan...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="py-24 text-center space-y-4">
        <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto" />
        <h3 className="text-base font-bold text-foreground">Pengajuan Tidak Ditemukan</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {errorMessage || 'Pengajuan tidak ditemukan atau Anda tidak memiliki hak akses.'}
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/submissions')}>
          Kembali ke Pengajuan Saya
        </Button>
      </div>
    );
  }

  const latestRevision = submission.revisions?.[0];
  const isActionNeeded = submission.status === 'PERLU_PERBAIKAN';
  const isCompleted = ['SERTIFIKAT_DITERBITKAN', 'SELESAI'].includes(submission.status);

  let candidatesList: any[] = [];
  if (submission.candidates) {
    if (Array.isArray(submission.candidates)) {
      candidatesList = submission.candidates as any[];
    } else {
      try {
        candidatesList = JSON.parse(submission.candidates as any);
      } catch {
        candidatesList = [];
      }
    }
  }

  const isDps =
    submission.submissionTypeName?.toLowerCase().includes('dps') ||
    submission.submissionTypeName?.toLowerCase().includes('pengawas syariah') ||
    Boolean(submission.dpsStage) ||
    candidatesList.length > 0;

  const CANDIDATE_DOC_SPECS = [
    { key: 'suratMui', title: 'Surat Pengantar dari MUI Setempat' },
    { key: 'sertifikatPelatihan', title: 'Sertifikat Pelatihan Dasar Pengawas Syariah dari DSN-MUI' },
    { key: 'sertifikatKompetensi', title: 'Sertifikat Kompetensi Pengawas Syariah dari LSP MUI' },
    { key: 'profilCv', title: 'Profil Calon DPS (Daftar Riwayat Hidup dan KTP terbaru)' },
    { key: 'suratPernyataanNonPegawai', title: 'Surat Keterangan Tidak Menjadi Pengurus/Pegawai Aktif LKS/LBS/LPS' },
    { key: 'dokumenLain', title: 'Dokumen Lain Calon (Pendukung Tambahan)' },
  ];

  const getNormalizedCandidateDocs = (rawDocs: any) => {
    if (!rawDocs) return [];
    if (Array.isArray(rawDocs)) {
      return rawDocs.map((d: any, idx: number) => ({
        key: d.key || `doc-${idx}`,
        title: d.title || d.requirementName || `Dokumen #${idx + 1}`,
        fileName: d.fileName || '',
        fileUrl: d.fileUrl || '',
        fileSize: d.fileSize || 0,
        mimeType: d.mimeType || '',
      }));
    }
    if (typeof rawDocs === 'object') {
      return CANDIDATE_DOC_SPECS.map((spec) => {
        const doc = rawDocs[spec.key];
        return {
          key: spec.key,
          title: spec.title,
          fileName: doc?.fileName || '',
          fileUrl: doc?.fileUrl || '',
          fileSize: doc?.fileSize || 0,
          mimeType: doc?.mimeType || '',
        };
      }).filter((item) => {
        if (item.key === 'dokumenLain') {
          return Boolean(item.fileUrl);
        }
        return true;
      });
    }
    return [];
  };

  const additionalSubmissionDoc = submission.documents?.find(
    (d) =>
      d.requirementName.toLowerCase().includes('dokumen lain') ||
      d.requirementName.toLowerCase().includes('pendukung tambahan')
  );

  const dpsStages = [
    { key: 'PROSES_PENGAJUAN', step: 1, label: 'Proses Pengajuan', desc: 'Permohonan diterima & tercatat di DSN-MUI' },
    { key: 'VALIDASI_DOKUMEN', step: 2, label: 'Validasi Dokumen', desc: 'Pemeriksaan 6 kelengkapan berkas persyaratan' },
    { key: 'WAWANCARA', step: 3, label: 'Wawancara', desc: 'Uji kompetensi & wawancara calon DPS' },
    { key: 'PROSES_INTERNAL', step: 4, label: 'Proses Internal', desc: 'Sidang pleno & penelaahan BPH DSN-MUI' },
    { key: 'LULUS', step: 5, label: 'Lulus / Rekomendasi', desc: 'Penerbitan surat rekomendasi resmi' },
  ];

  const currentDpsStage = submission.dpsStage || 'PROSES_PENGAJUAN';
  const getDpsStageIndex = (stage: string) => {
    switch (stage) {
      case 'PROSES_PENGAJUAN': return 0;
      case 'VALIDASI_DOKUMEN': return 1;
      case 'WAWANCARA': return 2;
      case 'PROSES_INTERNAL': return 3;
      case 'LULUS': return 4;
      case 'TIDAK_LULUS': return 4;
      default: return 0;
    }
  };
  const activeDpsStageIdx = getDpsStageIndex(currentDpsStage);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* ── BREADCRUMB & TOP HEADER ── */}
      <div className="space-y-3">
        <Link
          to="/submissions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Pengajuan Saya
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#172019] p-6 rounded-3xl border border-border shadow-subtle">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-primary px-3 py-1 rounded-lg bg-secondary border border-emerald-200">
                {submission.submissionNumber}
              </span>
              <Badge status={submission.status} size="md" />
              {isDps && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Layanan Prioritas DPS
                </span>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Diajukan: {formatDate(submission.submittedAt || submission.createdAt)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight leading-snug">
              {submission.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {submission.submissionTypeName}
              {submission.productOrServiceName && ` • Produk: ${submission.productOrServiceName}`}
              {submission.companyLetterNumber && ` • No. Surat: ${submission.companyLetterNumber}`}
            </p>
          </div>

          {isActionNeeded && (
            <Button
              variant="gold"
              size="md"
              onClick={() => setShowRevisionModal(true)}
              leftIcon={<AlertTriangle className="w-4 h-4" />}
              className="shadow-md flex-shrink-0 font-bold"
            >
              Perlu Tindakan: Ganti / Tambah Lampiran
            </Button>
          )}
        </div>
      </div>

      {/* ── DPS 5-STAGE ROADMAP (If Rekomendasi DPS) ── */}
      {isDps && (
        <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Alur Tahapan Permohonan Rekomendasi DPS
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pantau progres verifikasi dan penetapan rekomendasi DSN-MUI
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Tahap Saat Ini:</span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                currentDpsStage === 'LULUS'
                  ? 'bg-emerald-500 text-white'
                  : currentDpsStage === 'TIDAK_LULUS'
                  ? 'bg-red-500 text-white'
                  : 'bg-primary text-white'
              }`}>
                {dpsStages.find((s) => s.key === currentDpsStage)?.label || currentDpsStage}
              </span>
            </div>
          </div>

          {/* Stepper Progress Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            {dpsStages.map((stage, idx) => {
              const isPast = idx < activeDpsStageIdx;
              const isCurrent = idx === activeDpsStageIdx;
              const isFuture = idx > activeDpsStageIdx;
              const isFailedEnd = isCurrent && currentDpsStage === 'TIDAK_LULUS';
              const isSuccessEnd = isCurrent && currentDpsStage === 'LULUS';

              return (
                <div
                  key={stage.key}
                  className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between gap-3 ${
                    isCurrent
                      ? isFailedEnd
                        ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 shadow-md ring-2 ring-red-400/20'
                        : isSuccessEnd
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-md ring-2 ring-emerald-400/20'
                        : 'bg-primary/5 dark:bg-primary/10 border-primary shadow-md ring-2 ring-primary/20'
                      : isPast
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-300'
                      : 'bg-muted/30 border-border opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? isFailedEnd
                            ? 'bg-red-600 text-white'
                            : 'bg-primary text-white shadow-glow-green'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted-foreground/20 text-muted-foreground'
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4" /> : stage.step}
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                      Langkah {stage.step}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-foreground leading-tight">
                      {isFailedEnd ? 'Tidak Lulus' : stage.label}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-1">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DPS STAGE 2: DOKUMEN TERVALIDASI (STATUS VALIDASI DOKUMEN AKTIF) ── */}
      {isDps && currentDpsStage === 'VALIDASI_DOKUMEN' && !isActionNeeded && (
        <div className="p-6 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 space-y-3 shadow-subtle animate-in fade-in duration-200">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">
                  Kelengkapan Dokumen Dinyatakan Lengkap & Valid
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 uppercase tracking-wider border border-emerald-300">
                  Tahap 2: Validasi Dokumen (Aktif)
                </span>
                {submission.validationType && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    Kategori:{' '}
                    {submission.validationType === 'BARU'
                      ? 'Pengajuan Rekomendasi Baru'
                      : submission.validationType === 'PAW'
                      ? 'Pergantian Antar Waktu (PAW)'
                      : 'Penetapan Keberlanjutan Rekomendasi'}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Seluruh 6 dokumen berkas calon DPS telah diverifikasi oleh Sekretariat DSN-MUI dan dinyatakan <strong>VALID</strong>.
                Status pengajuan tetap berada pada <strong>Tahap Validasi Dokumen</strong> aktif. Tim DSN-MUI saat ini sedang menyiapkan jadwal dan menerbitkan Surat Undangan Wawancara resmi untuk calon DPS yang diajukan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── DPS STAGE 3: SURAT UNDANGAN WAWANCARA RESMI CALON DPS (OFFICIAL INVITATION CARD) ── */}
      {isDps && (currentDpsStage === 'WAWANCARA' || Boolean(submission.interviewInvitation)) && (() => {
        const invitationData = submission.interviewInvitation || {
          invitationNumber: `UND-WW/DSN-MUI/IX/2026/012`,
          invitationDate: formatDate(submission.updatedAt || new Date().toISOString()),
          interviewDayDate: 'Kamis, 17 September 2026',
          interviewTime: '09:30 - 12:00',
          format: 'OFFLINE' as const,
          venue: 'Ruang Rapat Pleno DSN-MUI Lt. 3, Gedung MUI Pusat, Jl. Proklamasi No. 51, Menteng, Jakarta Pusat',
          subject: `Undangan Wawancara Uji Kepatutan dan Kelayakan Calon Anggota DPS Terkait Surat No. ${submission.companyLetterNumber || submission.submissionNumber}`,
          candidates: candidatesList.length > 0 ? candidatesList.map((c: any) => c.name) : ['Calon Anggota Dewan Pengawas Syariah'],
          dresscode: 'Pakaian Sipil Lengkap / Batik Lengan Panjang / Jas Rapi',
          requirements: 'Membawa berkas fisik asli, portofolio riwayat hidup, serta bahan pemaparan kesiapan kepengawasan syariah.',
          contactPerson: 'Sekretariat DSN-MUI (021-3904141 / wa.me/6281234567890)',
          notes: 'Calon DPS dimohon hadir 15 menit sebelum waktu wawancara dimulai.',
          signatoryName: 'Prof. Dr. KH. Hasanuddin, M.Ag',
          signatoryRole: 'Ketua Bidang Pengawasan Syariah DSN-MUI',
        };

        return (
          <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/80 shadow-lg space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Undangan Wawancara DSN-MUI Diterbitkan
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500 bg-secondary px-2.5 py-0.5 rounded-lg border border-border">
                    {invitationData.invitationNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Tertanggal: {invitationData.invitationDate}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight pt-1">
                  Surat Undangan Wawancara Calon Dewan Pengawas Syariah (DPS)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Menghadiri Wawancara Uji Kepatutan dan Kelayakan (Fit and Proper Test) terkait permohonan rekomendasi DPS sesuai Surat Pengantar No.{' '}
                  <strong className="text-foreground font-mono font-bold">
                    {submission.companyLetterNumber || submission.submissionNumber}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowInvitationModal(true)}
                  leftIcon={<FileText className="w-4 h-4" />}
                  className="shadow-md"
                >
                  Lihat Surat Undangan Resmi (Kop DSN-MUI)
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowInvitationModal(true)}
                  leftIcon={<Printer className="w-4 h-4" />}
                >
                  Cetak
                </Button>
              </div>
            </div>

            {/* Grid Detail Pelaksanaan Wawancara */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Hari & Tanggal
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-foreground">
                  {invitationData.interviewDayDate}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Waktu Pelaksanaan
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-foreground">
                  {invitationData.interviewTime} WIB
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-1 sm:col-span-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Tempat / Ruang Wawancara
                </div>
                <p className="text-xs font-bold text-foreground leading-snug">
                  {invitationData.venue}
                </p>
              </div>
            </div>

            {/* Calon DPS Diundang & Catatan */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Kandidat Calon DPS yang Diundang Wawancara:</span>
                </div>
                <p className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm">
                  {invitationData.candidates.join(', ')}
                </p>
                <p className="text-muted-foreground text-[11px] pt-0.5">
                  Ketentuan: {invitationData.dresscode} • {invitationData.requirements}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-[11px] text-muted-foreground text-right hidden sm:block">
                  <span className="block font-bold text-foreground">Narahubung:</span>
                  <span>{invitationData.contactPerson}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── REVISION ALERT BANNER (If Perlu Tindakan) ── */}
      {isActionNeeded && (
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/95 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100 space-y-5 shadow-md animate-in fade-in duration-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-600 text-white shadow-xs">
                  Perlu Tindakan Segera
                </span>
                <h3 className="text-base sm:text-lg font-black text-amber-950 dark:text-amber-100">
                  Permintaan Perbaikan Berkas dari Tim Verifikator DSN-MUI
                </h3>
              </div>

              {/* Box Alasan Penolakan Deskriptif */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-slate-800 dark:text-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Alasan Penolakan & Petunjuk Perbaikan (Verifikator DSN-MUI):</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed pl-6">
                  "{latestRevision?.requestNotes || 'Berkas pengajuan membutuhkan perbaikan atau penambahan lampiran dokumen sesuai kriteria DSN-MUI.'}"
                </p>
                {latestRevision?.deadline && (
                  <div className="text-xs text-amber-800 dark:text-amber-400 pl-6 font-medium">
                    Batas Waktu Respon Revisi: <strong>{formatDate(latestRevision.deadline)}</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => setShowRevisionModal(true)}
                  leftIcon={<UploadCloud className="w-4 h-4" />}
                  className="shadow-md font-bold"
                >
                  Perbaiki & Ganti Lampiran Dokumen Sekarang
                </Button>
                <Link to={`/submissions/${submission.id}/edit`}>
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<FileText className="w-4 h-4" />}
                    className="border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                  >
                    Buka Form Lengkap Edit Data
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPANY OFFICIAL LETTER (Syarat #1) ── */}
      <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              1. Surat Permohonan / Pengantar dari Perusahaan
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Surat pengantar resmi berkop perusahaan (berlaku untuk seluruh kandidat yang diajukan)
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-primary">
            Wajib (1 Berkas)
          </span>
        </div>

        {submission.officialLetterUrl ? (
          <div className="p-4 rounded-2xl bg-secondary/40 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-foreground truncate flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                {submission.officialLetterName || 'Surat_Permohonan_Pengantar_Perusahaan.pdf'}
              </div>
              <div className="text-[11px] font-mono text-muted-foreground truncate">
                Ukuran Berkas: {formatFileSize(submission.officialLetterSize)}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreviewDoc({
                    isOpen: true,
                    title: submission.officialLetterName || 'Surat Permohonan Perusahaan',
                    fileUrl: submission.officialLetterUrl!,
                    fileSize: submission.officialLetterSize,
                  })
                }
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Lihat Berkas
              </Button>
              <a
                href={getFileUrl(submission.officialLetterUrl)}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                  Unduh
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground">
            Berkas surat pengantar belum diunggah.
          </div>
        )}
      </div>

      {/* ── DOKUMEN LAIN (PENDUKUNG TAMBAHAN) ── */}
      {additionalSubmissionDoc && (
        <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Dokumen Lain (Pendukung Tambahan)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Berkas pendukung tambahan yang dilampirkan oleh perusahaan
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Dokumen Pendukung
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-bold text-foreground truncate flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                {additionalSubmissionDoc.fileName}
              </div>
              <div className="text-[11px] font-mono text-muted-foreground truncate">
                Ukuran Berkas: {formatFileSize(additionalSubmissionDoc.fileSize)}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreviewDoc({
                    isOpen: true,
                    title: additionalSubmissionDoc.fileName,
                    fileUrl: additionalSubmissionDoc.fileUrl,
                    fileSize: additionalSubmissionDoc.fileSize,
                  })
                }
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Lihat Berkas
              </Button>
              <a
                href={getFileUrl(additionalSubmissionDoc.fileUrl)}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                  Unduh
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── CANDIDATE LIST WITH 5 UPLOADED DOCUMENTS (If DPS) ── */}
      {candidatesList.length > 0 && (
        <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Daftar Calon Dewan Pengawas Syariah (DPS) & Dokumen Persyaratan
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Setiap calon melengkapi berkas persyaratan resmi sesuai ketentuan DSN-MUI
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary text-primary border border-emerald-200 w-fit">
              Total {candidatesList.length} Kandidat
            </span>
          </div>

          <div className="space-y-6">
            {candidatesList.map((cand, cIdx) => {
              const docs = getNormalizedCandidateDocs(cand.documents);
              const validDocsCount = docs.filter((d) => Boolean(d.fileUrl)).length;
              return (
                <div
                  key={cand.id || cIdx}
                  className="p-5 rounded-2xl bg-muted/20 border border-border space-y-4 hover:border-primary/40 transition-colors"
                >
                  {/* Candidate Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        #{cIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{cand.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {cand.nik && <span>NIK: {cand.nik}</span>}
                          {cand.email && <span>Email: {cand.email}</span>}
                          {cand.phone && <span>Telp: {cand.phone}</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200/50 w-fit">
                      {validDocsCount} dari {docs.length} Berkas Lengkap
                    </span>
                  </div>

                  {/* Documents Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {docs.map((docItem: any, dIdx: number) => {
                      const hasFile = Boolean(docItem.fileUrl);
                      return (
                        <div
                          key={dIdx}
                          className="p-3 rounded-xl bg-white dark:bg-[#121a14] border border-border/80 flex flex-col justify-between gap-2 shadow-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                              <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] shrink-0">
                                {dIdx + 1}
                              </span>
                              <span className="truncate" title={docItem.title}>
                                {docItem.title}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-muted-foreground truncate">
                              {hasFile
                                ? `${docItem.fileName} (${formatFileSize(docItem.fileSize)})`
                                : 'Belum diunggah'}
                            </p>
                          </div>

                          {hasFile ? (
                            <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setPreviewDoc({
                                    isOpen: true,
                                    title: `${cand.name} - ${docItem.title}`,
                                    fileUrl: docItem.fileUrl,
                                    fileSize: docItem.fileSize,
                                  })
                                }
                                leftIcon={<Eye className="w-3 h-3" />}
                                className="flex-1 text-[11px] py-1 h-auto"
                              >
                                Lihat
                              </Button>
                              <a
                                href={getFileUrl(docItem.fileUrl)}
                                download={docItem.fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="sm" className="p-1.5 h-auto">
                                  <Download className="w-3.5 h-3.5" />
                                </Button>
                              </a>
                            </div>
                          ) : (
                            <div className="text-[10px] text-amber-600 font-medium pt-1">
                              Belum Dilampirkan
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DIGITAL CERTIFICATE BOX (If Published) ── */}
      {isCompleted && submission.certificate && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#006633] to-[#1B7F4A] text-white shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <FileBadge className="w-4 h-4 text-accent" /> Sertifikat Resmi Diterbitkan
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {submission.certificate.title}
              </h2>
              <p className="text-xs text-emerald-100 font-mono">
                No. Sertifikat: {submission.certificate.certificateNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="gold"
                size="md"
                onClick={() =>
                  setPreviewDoc({
                    isOpen: true,
                    title: submission.certificate?.title || 'Sertifikat Syariah',
                    fileUrl: submission.certificate?.fileUrl || '/images/kop-surat.png',
                    fileSize: submission.certificate?.fileSize,
                  })
                }
                leftIcon={<Eye className="w-4 h-4" />}
                className="shadow-lg"
              >
                Lihat Sertifikat
              </Button>
              <a
                href={`${api.defaults.baseURL}/certificates/${submission.certificate.id}/download`}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Unduh PDF
                </Button>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/20 border border-white/10 text-xs relative z-10">
            <div>
              <div className="text-emerald-200 text-[11px]">Tanggal Terbit:</div>
              <div className="font-bold">{formatDate(submission.certificate.issueDate)}</div>
            </div>
            <div>
              <div className="text-emerald-200 text-[11px]">Masa Berlaku Hingga:</div>
              <div className="font-bold">{formatDate(submission.certificate.validUntil)}</div>
            </div>
            <div>
              <div className="text-emerald-200 text-[11px]">Penerbit Resmi:</div>
              <div className="font-bold">DSN-MUI Pusat</div>
            </div>
            <div>
              <div className="text-emerald-200 text-[11px]">Total Diunduh:</div>
              <div className="font-bold">{submission.certificate.downloadCount} kali</div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROGRESS TIMELINE SECTION ── */}
      <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
        <div>
          <h3 className="text-base font-bold text-foreground">Perkembangan Proses (Progress Timeline)</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Status terkini perjalanan permohonan kesesuaian syariah di DSN-MUI
          </p>
        </div>

        {/* Visual Timeline Stepper */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
          {submission.timeline && submission.timeline.length > 0 ? (
            submission.timeline.map((act, idx) => (
              <div key={act.id || idx} className="relative flex items-start gap-4 group">
                {/* Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    idx === submission.timeline!.length - 1
                      ? 'bg-primary text-white border-primary shadow-glow-green ring-4 ring-primary/20'
                      : 'bg-emerald-600 text-white border-emerald-600'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground">{act.title}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatDateTime(act.createdAt)}
                    </span>
                  </div>
                  {act.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {act.description}
                    </p>
                  )}
                  {act.performedByName && (
                    <div className="text-[11px] text-primary font-medium pt-0.5">
                      Diproses oleh: {act.performedByName}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground">Belum ada riwayat aktivitas.</div>
          )}
        </div>
      </div>

      {/* ── DOCUMENTS & ATTACHMENTS SECTION ── */}
      <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Berkas & Dokumen Permohonan</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Dokumen resmi yang telah dilampirkan dalam pengajuan ini
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-primary">
            {(submission.documents?.length || 0) + (submission.officialLetterUrl ? 1 : 0)} Berkas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Official Letter Card */}
          {submission.officialLetterUrl && (
            <div className="p-4 rounded-2xl bg-secondary/40 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="text-xs font-bold text-foreground truncate">
                  Surat Permohonan Resmi Perusahaan
                </div>
                <div className="text-[11px] font-mono text-muted-foreground truncate">
                  {submission.officialLetterName || 'Surat_Permohonan.pdf'} (
                  {formatFileSize(submission.officialLetterSize)})
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreviewDoc({
                    isOpen: true,
                    title: submission.officialLetterName || 'Surat Permohonan',
                    fileUrl: submission.officialLetterUrl!,
                    fileSize: submission.officialLetterSize,
                  })
                }
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Lihat
              </Button>
            </div>
          )}

          {/* Attached Requirement Documents */}
          {submission.documents?.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="text-xs font-bold text-foreground truncate">
                  {doc.requirementName}
                </div>
                <div className="text-[11px] font-mono text-muted-foreground truncate">
                  {doc.fileName} ({formatFileSize(doc.fileSize)})
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreviewDoc({
                    isOpen: true,
                    title: doc.requirementName,
                    fileUrl: doc.fileUrl,
                    fileSize: doc.fileSize,
                  })
                }
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Lihat
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── INTERACTIVE EDIT & REVISION MODAL (GANTI / TAMBAH LAMPIRAN) ── */}
      {showRevisionModal && (
        <EditSubmissionDocumentsModal
          isOpen={showRevisionModal}
          onClose={() => setShowRevisionModal(false)}
          submission={submission}
          revision={latestRevision}
          onSuccess={() => {
            fetchDetail();
          }}
        />
      )}

      {/* ── UNIVERSAL DOCUMENT VIEWER MODAL ── */}
      <DocumentViewerModal
        isOpen={previewDoc.isOpen}
        onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
        title={previewDoc.title}
        fileUrl={previewDoc.fileUrl}
        fileSize={previewDoc.fileSize}
      />

      {/* ── OFFICIAL INTERVIEW INVITATION MODAL ── */}
      {showInvitationModal && (
        <OfficialInterviewInvitationModal
          isOpen={showInvitationModal}
          onClose={() => setShowInvitationModal(false)}
          submission={submission}
          invitation={
            submission.interviewInvitation || {
              invitationNumber: `UND-WW/DSN-MUI/IX/2026/012`,
              invitationDate: formatDate(submission.updatedAt || new Date().toISOString()),
              interviewDayDate: 'Kamis, 17 September 2026',
              interviewTime: '09:30 - 12:00',
              format: 'OFFLINE' as const,
              venue: 'Ruang Rapat Pleno DSN-MUI Lt. 3, Gedung MUI Pusat, Jl. Proklamasi No. 51, Menteng, Jakarta Pusat',
              subject: `Undangan Wawancara Uji Kepatutan dan Kelayakan Calon Anggota DPS Terkait Surat No. ${submission.companyLetterNumber || submission.submissionNumber}`,
              candidates: candidatesList.length > 0 ? candidatesList.map((c: any) => c.name) : ['Calon Anggota Dewan Pengawas Syariah'],
              dresscode: 'Pakaian Sipil Lengkap / Batik Lengan Panjang / Jas Rapi',
              requirements: 'Membawa berkas fisik asli, portofolio riwayat hidup, serta bahan pemaparan kesiapan kepengawasan syariah.',
              contactPerson: 'Sekretariat DSN-MUI (021-3904141 / wa.me/6281234567890)',
              notes: 'Calon DPS dimohon hadir 15 menit sebelum waktu wawancara dimulai.',
              signatoryName: 'Prof. Dr. KH. Hasanuddin, M.Ag',
              signatoryRole: 'Ketua Bidang Pengawasan Syariah DSN-MUI',
            }
          }
        />
      )}
    </div>
  );
};
