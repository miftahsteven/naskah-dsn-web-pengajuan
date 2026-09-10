import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { DocumentViewerModal } from '../ui/DocumentViewerModal';
import api, { formatFileSize } from '../../lib/api';
import type { PublicSubmissionCandidate, PublicSubmissionCandidateDoc } from '../../types';
import {
  UploadCloud,
  FileText,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  Loader2,
  RefreshCw,
  Building2,
  Info,
} from 'lucide-react';

interface DpsSubmissionFormProps {
  initialSubmissionId?: string | null;
  companyName?: string;
  onSuccess: (data: any) => void;
  onCancel?: () => void;
}

interface UploadBoxProps {
  labelNumber?: string;
  title: string;
  docKey: string;
  uploadedDoc?: PublicSubmissionCandidateDoc;
  isUploading?: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onPreview: (doc: PublicSubmissionCandidateDoc, title: string) => void;
}

// Reusable Upload Box matching the DSN-MUI visual design
const DsnUploadBox: React.FC<UploadBoxProps> = ({
  labelNumber,
  title,
  uploadedDoc,
  isUploading,
  onUpload,
  onRemove,
  onPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title with number */}
      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 leading-snug min-h-[32px]">
        {labelNumber && <span className="text-emerald-700 dark:text-emerald-400 mr-1">{labelNumber}</span>}
        {title}
      </label>

      {/* Upload Zone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex-1 flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 transition-all ${
          uploadedDoc
            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
            : isDragOver
            ? 'bg-emerald-50/40 border-emerald-500 scale-[1.01]'
            : 'bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.docx"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onUpload(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />

        {isUploading ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mengunggah berkas...
            </p>
          </div>
        ) : uploadedDoc ? (
          /* File Uploaded State */
          <div className="w-full flex flex-col items-center text-center py-2 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="max-w-full px-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={uploadedDoc.fileName}>
                {uploadedDoc.fileName}
              </p>
              {uploadedDoc.fileSize && (
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {formatFileSize(uploadedDoc.fileSize)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onPreview(uploadedDoc, title)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 hover:border-emerald-300 shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Lihat
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 hover:border-emerald-300 shadow-xs transition-colors"
                title="Ganti Berkas"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Ganti
              </button>

              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Hapus Berkas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Dropzone State Matching DSN Mockup */
          <div className="flex flex-col items-center justify-center text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Seret File Surat Masuk ke Sini
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[200px] leading-tight">
                Atau klik untuk menjelajah file. Mendukung PDF atau PNG.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer"
            >
              Pilih Berkas Dokumen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const DpsSubmissionForm: React.FC<DpsSubmissionFormProps> = ({
  initialSubmissionId,
  companyName = 'Perusahaan Pemohon',
  onSuccess,
  onCancel,
}) => {
  const [submissionId, setSubmissionId] = useState<string | null>(initialSubmissionId || null);
  const [companyLetterNumber, setCompanyLetterNumber] = useState<string>('');
  const [companyLetterDate, setCompanyLetterDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [officialLetter, setOfficialLetter] = useState<PublicSubmissionCandidateDoc | null>(null);
  const [isUploadingLetter, setIsUploadingLetter] = useState<boolean>(false);

  // Additional Supporting Document (Dokumen Lain - Cukup 1 Dokumen)
  const [additionalDoc, setAdditionalDoc] = useState<PublicSubmissionCandidateDoc | null>(null);
  const [isUploadingAdditionalDoc, setIsUploadingAdditionalDoc] = useState<boolean>(false);

  // Candidates array (default 1 candidate)
  const [candidates, setCandidates] = useState<PublicSubmissionCandidate[]>([
    {
      id: 'cand-' + Date.now(),
      name: '',
      nik: '',
      phone: '',
      email: '',
      documents: {},
    },
  ]);
  const [activeCandidateIndex, setActiveCandidateIndex] = useState<number>(0);

  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRevisionMode, setIsRevisionMode] = useState<boolean>(false);
  const [revisionNotes, setRevisionNotes] = useState<string>('');

  // Load existing data if initialSubmissionId provided
  useEffect(() => {
    if (!initialSubmissionId) return;
    api.get(`/submissions/${initialSubmissionId}`)
      .then((res) => {
        if (res.data.status === 'success') {
          const data = res.data.data;
          setSubmissionId(data.id);
          if (data.status === 'PERLU_PERBAIKAN') {
            setIsRevisionMode(true);
            setAgreedToTerms(true);
            if (data.revisions?.[0]?.requestNotes) {
              setRevisionNotes(data.revisions[0].requestNotes);
            }
          }
          if (data.companyLetterNumber) setCompanyLetterNumber(data.companyLetterNumber);
          if (data.companyLetterDate) setCompanyLetterDate(data.companyLetterDate.split('T')[0]);
          if (data.officialLetterUrl) {
            setOfficialLetter({
              fileName: data.officialLetterName || 'Surat_Permohonan.pdf',
              fileUrl: data.officialLetterUrl,
              fileSize: data.officialLetterSize || 0,
            });
          }
          if (data.candidates) {
            let parsed = data.candidates;
            if (typeof parsed === 'string') {
              try { parsed = JSON.parse(parsed); } catch {}
            }
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCandidates(parsed);
            }
          }
          const addDoc = data.documents?.find(
            (d: any) =>
              d.requirementName?.toLowerCase().includes('dokumen lain') ||
              d.requirementName?.toLowerCase().includes('pendukung')
          );
          if (addDoc) {
            setAdditionalDoc({
              fileName: addDoc.fileName,
              fileUrl: addDoc.fileUrl,
              fileSize: addDoc.fileSize,
            });
          }
        }
      })
      .catch((err) => console.error('Failed to load submission data:', err));
  }, [initialSubmissionId]);

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

  // Generic file upload to server
  const uploadFileToServer = async (file: File): Promise<PublicSubmissionCandidateDoc> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/submissions/upload-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  };

  // Upload Company Official Cover Letter (Requirement #1)
  const handleUploadOfficialLetter = async (file: File) => {
    setIsUploadingLetter(true);
    setErrorMessage(null);
    try {
      const doc = await uploadFileToServer(file);
      setOfficialLetter(doc);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengunggah surat pengantar perusahaan.');
    } finally {
      setIsUploadingLetter(false);
    }
  };

  // Upload Additional Supporting Document (Dokumen Lain)
  const handleUploadAdditionalDoc = async (file: File) => {
    setIsUploadingAdditionalDoc(true);
    setErrorMessage(null);
    try {
      const doc = await uploadFileToServer(file);
      setAdditionalDoc(doc);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengunggah berkas dokumen lain.');
    } finally {
      setIsUploadingAdditionalDoc(false);
    }
  };

  // Candidate Management
  const handleAddCandidate = () => {
    const newCand: PublicSubmissionCandidate = {
      id: 'cand-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: '',
      nik: '',
      phone: '',
      email: '',
      documents: {},
    };
    setCandidates((prev) => {
      const nextList = [...prev, newCand];
      setActiveCandidateIndex(nextList.length - 1);
      return nextList;
    });
  };

  const handleRemoveCandidate = (index: number) => {
    if (candidates.length <= 1) return;
    setCandidates((prev) => {
      const nextList = prev.filter((_, i) => i !== index);
      setActiveCandidateIndex((prevActive) => {
        if (prevActive >= nextList.length) return nextList.length - 1;
        if (prevActive === index) return Math.max(0, index - 1);
        return prevActive;
      });
      return nextList;
    });
  };

  const handleCandidateChange = (index: number, field: string, value: string) => {
    setCandidates((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [field]: value };
      return clone;
    });
  };

  // Candidate Document Upload
  const handleCandidateDocUpload = async (
    candidateIndex: number,
    docKey: string,
    file: File
  ) => {
    const stateKey = `${candidateIndex}-${docKey}`;
    setUploadingState((prev) => ({ ...prev, [stateKey]: true }));
    setErrorMessage(null);

    try {
      const doc = await uploadFileToServer(file);
      setCandidates((prev) => {
        const clone = [...prev];
        const cand = { ...clone[candidateIndex] };
        cand.documents = { ...cand.documents, [docKey]: doc };
        clone[candidateIndex] = cand;
        return clone;
      });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengunggah berkas calon.');
    } finally {
      setUploadingState((prev) => ({ ...prev, [stateKey]: false }));
    }
  };

  const handleCandidateDocRemove = (candidateIndex: number, docKey: string) => {
    setCandidates((prev) => {
      const clone = [...prev];
      const cand = { ...clone[candidateIndex] };
      const newDocs = { ...cand.documents };
      delete newDocs[docKey];
      cand.documents = newDocs;
      clone[candidateIndex] = cand;
      return clone;
    });
  };

  // Document Preview
  const handleOpenPreview = (doc: PublicSubmissionCandidateDoc, title: string) => {
    setPreviewDoc({
      isOpen: true,
      title,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
    });
  };

  // Validation
  const validateForm = (): string | null => {
    if (!companyLetterNumber.trim()) {
      return 'Nomor Surat Permohonan / Pengantar dari Perusahaan wajib diisi.';
    }
    if (!officialLetter) {
      return 'Surat Permohonan / Pengantar dari Perusahaan (Syarat #1) wajib diunggah.';
    }
    if (candidates.length === 0) {
      return 'Minimal satu (1) nama calon DPS wajib diusulkan.';
    }

    const docKeys = [
      { key: 'suratMui', name: 'Surat Pengantar dari MUI Setempat' },
      { key: 'sertifikatPelatihan', name: 'Sertifikat Pelatihan Dasar Pengawas Syariah dari DSN-MUI' },
      { key: 'sertifikatKompetensi', name: 'Sertifikat Kompetensi Pengawas Syariah dari LSP MUI' },
      { key: 'profilCv', name: 'Profil Calon DPS (Daftar Riwayat Hidup dan KTP terbaru)' },
      { key: 'suratPernyataanNonPegawai', name: 'Surat Keterangan Tidak Sedang Menjadi Pengurus/Pegawai Aktif di LKS/LBS/LPS' },
    ];

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      if (!c.name.trim()) {
        setActiveCandidateIndex(i);
        return `Nama lengkap Calon DPS #${i + 1} wajib diisi.`;
      }
      for (const d of docKeys) {
        if (!c.documents[d.key]) {
          setActiveCandidateIndex(i);
          return `Dokumen "${d.name}" untuk Calon #${i + 1} (${c.name || 'Tanpa Nama'}) belum diunggah.`;
        }
      }
    }

    if (!agreedToTerms) {
      return 'Anda wajib mencentang persetujuan pernyataan kriteria dan integritas dokumen DSN-MUI.';
    }

    return null;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isRevisionMode && submissionId) {
        const res = await api.post(`/submissions/${submissionId}/revision`, {
          responseNotes: `Perbaikan berkas dan kelengkapan lampiran telah diperbarui oleh pemohon melalui formulir edit data.`,
          candidates,
          officialLetter,
          additionalDoc: additionalDoc || null,
        });
        if (res.data.status === 'success') {
          onSuccess(res.data.data);
        }
      } else {
        const payload = {
          submissionId,
          title: `Permohonan Rekomendasi DPS - ${companyName} (${candidates.length} Calon)`,
          companyLetterNumber: companyLetterNumber.trim(),
          companyLetterDate,
          officialLetter,
          candidates,
          additionalDoc: additionalDoc || null,
          agreedToTerms,
        };

        const res = await api.post('/submissions/dps', payload);
        if (res.data.status === 'success') {
          onSuccess(res.data.data);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || 'Terjadi kesalahan saat mengajukan permohonan rekomendasi DPS.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-8">
      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={previewDoc.isOpen}
        onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
        title={previewDoc.title}
        fileUrl={previewDoc.fileUrl}
        fileSize={previewDoc.fileSize}
      />

      {/* Mode Perbaikan Alert */}
      {isRevisionMode && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mode Perbaikan Berkas Permohonan (Perlu Tindakan):</span>
          </div>
          {revisionNotes && (
            <p className="text-xs sm:text-sm font-semibold pl-6 text-slate-900 dark:text-slate-100 leading-relaxed">
              "{revisionNotes}"
            </p>
          )}
          <p className="text-xs text-amber-800 dark:text-amber-300 pl-6">
            Anda dapat mengganti lampiran yang diminta atau menambah dokumen lain di bawah ini. Setelah selesai, klik tombol <strong>"Kirim Perbaikan Berkas"</strong> di bagian bawah.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 leading-relaxed">
            <p className="font-bold">Periksa Kembali Data Pengajuan:</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* ── BAGIAN 1: SURAT PENGANTAR RESMI PERUSAHAAN (SYARAT #1) ── */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Syarat Utama #1
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Surat Permohonan / Pengantar dari Perusahaan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Surat resmi berkop perusahaan ini berlaku <strong>1x untuk seluruh nama calon DPS</strong> yang diusulkan.
            </p>
          </div>
          <Building2 className="w-6 h-6 text-emerald-600 hidden sm:block" />
        </div>

        {/* Nomor & Tanggal Surat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nomor Surat Pengantar Perusahaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyLetterNumber}
              onChange={(e) => setCompanyLetterNumber(e.target.value)}
              placeholder="contoh: 018/DIR-OPS/DSN/IX/2026"
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tanggal Surat Pengantar <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={companyLetterDate}
              onChange={(e) => setCompanyLetterDate(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Upload Box #1 */}
        <DsnUploadBox
          title="Surat Permohonan / Pengantar dari Perusahaan"
          docKey="officialLetter"
          uploadedDoc={officialLetter || undefined}
          isUploading={isUploadingLetter}
          onUpload={handleUploadOfficialLetter}
          onRemove={() => setOfficialLetter(null)}
          onPreview={handleOpenPreview}
        />
      </div>

      {/* ── BAGIAN 2: DAFTAR CALON DEWAN PENGAWAS SYARIAH (TAB-BASED) ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Daftar Calon Dewan Pengawas Syariah</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                {candidates.length} Calon
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilih tab nama kandidat di bawah untuk mengisi data tanpa perlu scrolling panjang ke bawah.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCandidate}
            className="self-start sm:self-auto border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-2xl font-bold shadow-xs text-xs"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Tambah Calon DPS
          </Button>
        </div>

        {/* ── CANDIDATE TABS BAR ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {candidates.map((cand, idx) => {
            const isActive = idx === activeCandidateIndex;
            const candidateName = cand.name.trim() || `Calon #${idx + 1}`;
            const uploadedCount = Object.keys(cand.documents || {}).length;
            const isComplete = uploadedCount === 5 && !!cand.name.trim();

            return (
              <div
                key={cand.id}
                onClick={() => setActiveCandidateIndex(idx)}
                className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 select-none ${
                  isActive
                    ? 'bg-emerald-50/95 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs ring-2 ring-emerald-500/20 font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:bg-slate-50/70 font-medium'
                }`}
              >
                {/* Number or Checkmark Badge */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors ${
                    isComplete
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isComplete ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                {/* Candidate Tab Name */}
                <div className="min-w-0 max-w-[150px] sm:max-w-[200px]">
                  <div className="text-xs truncate leading-tight" title={candidateName}>
                    {candidateName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    {uploadedCount}/5 berkas
                  </div>
                </div>

                {/* Delete Candidate button (if more than 1 candidate) */}
                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCandidate(idx);
                    }}
                    title={`Hapus ${candidateName}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Quick Add Button inside Tab Bar */}
          <button
            type="button"
            onClick={handleAddCandidate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-dashed border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 text-xs font-bold transition-all flex-shrink-0"
            title="Tambah Calon DPS Baru"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>

        {/* ── ACTIVE CANDIDATE FORM PANEL ── */}
        {(() => {
          const candIdx = activeCandidateIndex < candidates.length ? activeCandidateIndex : 0;
          const cand = candidates[candIdx];
          if (!cand) return null;

          return (
            <div
              key={cand.id}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden animate-in fade-in duration-200"
            >
              {/* Candidate Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    {candIdx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {cand.name ? cand.name : `Calon Dewan Pengawas Syariah #${candIdx + 1}`}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Kandidat {candIdx + 1} dari {candidates.length}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Lengkapi data identitas dan 5 berkas persyaratan khusus untuk calon ini.
                    </p>
                  </div>
                </div>

                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCandidate(candIdx)}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus Calon Ini
                  </button>
                )}
              </div>

              {/* Candidate Identity Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nama Lengkap & Gelar Calon <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cand.name}
                    onChange={(e) => handleCandidateChange(candIdx, 'name', e.target.value)}
                    placeholder="contoh: Dr. H. Ahmad Fauzi, M.Ag"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nomor KTP / NIK Calon
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={cand.nik || ''}
                    onChange={(e) => handleCandidateChange(candIdx, 'nik', e.target.value.replace(/\D/g, ''))}
                    placeholder="16 digit NIK"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    No. Telepon / WhatsApp Calon
                  </label>
                  <input
                    type="tel"
                    value={cand.phone || ''}
                    onChange={(e) => handleCandidateChange(candIdx, 'phone', e.target.value)}
                    placeholder="0812xxxxxxx"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Alamat Email Calon
                  </label>
                  <input
                    type="email"
                    value={cand.email || ''}
                    onChange={(e) => handleCandidateChange(candIdx, 'email', e.target.value)}
                    placeholder="email@kandidat.com"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* 5 UPLOAD BOXES PER CANDIDATE (MATCHING DSN-MUI MOCKUP) */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    5 Dokumen Persyaratan Wajib untuk {cand.name || `Calon #${candIdx + 1}`}
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {/* 1. Surat Pengantar MUI Setempat */}
                  <DsnUploadBox
                    labelNumber="1."
                    title="Surat Pengantar dari Majelis Ulama Indonesia (MUI) setempat"
                    docKey="suratMui"
                    uploadedDoc={cand.documents.suratMui}
                    isUploading={uploadingState[`${candIdx}-suratMui`]}
                    onUpload={(f) => handleCandidateDocUpload(candIdx, 'suratMui', f)}
                    onRemove={() => handleCandidateDocRemove(candIdx, 'suratMui')}
                    onPreview={handleOpenPreview}
                  />

                  {/* 2. Sertifikat Pelatihan Dasar Pengawas Syariah dari DSN-MUI */}
                  <DsnUploadBox
                    labelNumber="2."
                    title="Sertifikat Pelatihan Dasar Pengawas Syariah dari DSN-MUI"
                    docKey="sertifikatPelatihan"
                    uploadedDoc={cand.documents.sertifikatPelatihan}
                    isUploading={uploadingState[`${candIdx}-sertifikatPelatihan`]}
                    onUpload={(f) => handleCandidateDocUpload(candIdx, 'sertifikatPelatihan', f)}
                    onRemove={() => handleCandidateDocRemove(candIdx, 'sertifikatPelatihan')}
                    onPreview={handleOpenPreview}
                  />

                  {/* 3. Sertifikat Kompetensi Pengawas Syariah dari LSP MUI */}
                  <DsnUploadBox
                    labelNumber="3."
                    title="Sertifikat Kompetensi Pengawas Syariah dari Lembaga Sertifikasi Profesi Majelis Ulama Indonesia (LSP MUI)"
                    docKey="sertifikatKompetensi"
                    uploadedDoc={cand.documents.sertifikatKompetensi}
                    isUploading={uploadingState[`${candIdx}-sertifikatKompetensi`]}
                    onUpload={(f) => handleCandidateDocUpload(candIdx, 'sertifikatKompetensi', f)}
                    onRemove={() => handleCandidateDocRemove(candIdx, 'sertifikatKompetensi')}
                    onPreview={handleOpenPreview}
                  />

                  {/* 4. Profil calon DPS (Daftar Riwayat Hidup dan KTP terbaru) */}
                  <DsnUploadBox
                    labelNumber="4."
                    title="Profil calon DPS (Daftar Riwayat Hidup dan KTP terbaru)"
                    docKey="profilCv"
                    uploadedDoc={cand.documents.profilCv}
                    isUploading={uploadingState[`${candIdx}-profilCv`]}
                    onUpload={(f) => handleCandidateDocUpload(candIdx, 'profilCv', f)}
                    onRemove={() => handleCandidateDocRemove(candIdx, 'profilCv')}
                    onPreview={handleOpenPreview}
                  />

                  {/* 5. Surat Keterangan tidak sedang menjadi pengurus atau pegawai aktif */}
                  <DsnUploadBox
                    labelNumber="5."
                    title="Tidak sedang menjadi pengurus atau pegawai aktif di LKS, LBS, dan/atau LPS"
                    docKey="suratPernyataanNonPegawai"
                    uploadedDoc={cand.documents.suratPernyataanNonPegawai}
                    isUploading={uploadingState[`${candIdx}-suratPernyataanNonPegawai`]}
                    onUpload={(f) => handleCandidateDocUpload(candIdx, 'suratPernyataanNonPegawai', f)}
                    onRemove={() => handleCandidateDocRemove(candIdx, 'suratPernyataanNonPegawai')}
                    onPreview={handleOpenPreview}
                  />
                </div>
              </div>

              {/* Navigation Between Candidate Tabs */}
              {candidates.length > 1 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={candIdx === 0}
                    onClick={() => setActiveCandidateIndex(candIdx - 1)}
                  >
                    ← Calon Sebelumnya
                  </Button>

                  <span className="text-xs text-slate-400">
                    Menampilkan Calon {candIdx + 1} dari {candidates.length}
                  </span>

                  {candIdx < candidates.length - 1 ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveCandidateIndex(candIdx + 1)}
                    >
                      Calon Berikutnya →
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCandidate}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Tambah Calon Lagi
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── BAGIAN 3: DOKUMEN LAIN (PENDUKUNG TAMBAHAN) ── */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-black">
                3
              </span>
              Dokumen Lain (Pendukung Tambahan)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unggah dokumen apapun sebagai pendukung. Cukup 1 dokumen saja.
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 w-fit">
            Opsional (Cukup 1 Berkas)
          </span>
        </div>

        <div className="max-w-xl">
          <DsnUploadBox
            title="Dokumen Lain / Berkas Pendukung Tambahan (Cukup 1 Dokumen Saja)"
            docKey="additionalDoc"
            uploadedDoc={additionalDoc || undefined}
            isUploading={isUploadingAdditionalDoc}
            onUpload={handleUploadAdditionalDoc}
            onRemove={() => setAdditionalDoc(null)}
            onPreview={handleOpenPreview}
          />
        </div>
      </div>

      {/* ── BAGIAN 4: PAKTA INTEGRITAS & PERNYATAAN RESMI DSN-MUI ── */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <label className="flex items-start gap-3.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 rounded-md text-emerald-700 border-2 border-slate-300 dark:border-slate-600 focus:ring-emerald-500 mt-0.5 flex-shrink-0 cursor-pointer"
          />
          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            Saya menyatakan bahwa dokumen yang diupload telah sesuai dengan kriteria dan persyaratan DSN-MUI, jika terdapat ketidaksesuaian dokumen yang disampaikan, maka DSN-MUI berhak untuk menolak permohonan yang diajukan.
          </span>
        </label>
      </div>

      {/* ── BOTTOM ACTION BUTTONS ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Batal
          </Button>
        ) : (
          <div />
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full sm:w-auto min-w-[280px] shadow-lg text-sm font-bold h-12"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? 'Mengirimkan Permohonan...' : 'Kirim Permohonan Rekomendasi DPS'}
        </Button>
      </div>
    </form>
  );
};
