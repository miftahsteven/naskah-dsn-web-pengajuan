import React, { useState, useRef } from 'react';
import api from '../../lib/api';
import {
  PublicSubmission,
  PublicSubmissionCandidate,
  PublicSubmissionCandidateDoc,
  PublicSubmissionRevision,
} from '../../types';
import {
  X,
  AlertTriangle,
  UploadCloud,
  FileText,
  CheckCircle2,
  Eye,
  RefreshCw,
  Loader2,
  Calendar,
  AlertCircle,
  Building2,
  UserCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import { DocumentViewerModal } from '../ui/DocumentViewerModal';

interface EditSubmissionDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PublicSubmission;
  revision?: PublicSubmissionRevision;
  onSuccess: () => void;
}

const CANDIDATE_DOC_SPECS = [
  { key: 'suratMui', title: 'Surat Pengantar dari MUI Setempat', desc: 'Surat rekomendasi/pengantar dari MUI Provinsi/Kab/Kota' },
  { key: 'sertifikatPelatihan', title: 'Sertifikat Pelatihan Dasar DPS DSN-MUI', desc: 'Sertifikat pelatihan calon pengawas syariah DSN-MUI' },
  { key: 'sertifikatKompetensi', title: 'Sertifikat Kompetensi Pengawas Syariah', desc: 'Sertifikat kompetensi pengawas syariah dari LSP MUI' },
  { key: 'profilCv', title: 'Profil Calon DPS (CV & KTP Terbaru)', desc: 'Daftar riwayat hidup lengkap dan salinan KTP calon' },
  { key: 'suratPernyataanNonPegawai', title: 'Surat Pernyataan Non-Pegawai Aktif', desc: 'Surat keterangan tidak menjadi pengurus/pegawai aktif LKS/LBS/LPS' },
  { key: 'dokumenLain', title: 'Dokumen Lain Calon (Pendukung Tambahan)', desc: 'Berkas pendukung tambahan khusus untuk calon bersangkutan' },
];

export const EditSubmissionDocumentsModal: React.FC<EditSubmissionDocumentsModalProps> = ({
  isOpen,
  onClose,
  submission,
  revision,
  onSuccess,
}) => {
  // Parse existing candidates
  const getInitialCandidates = (): PublicSubmissionCandidate[] => {
    if (!submission.candidates) return [];
    if (Array.isArray(submission.candidates)) {
      return JSON.parse(JSON.stringify(submission.candidates));
    }
    try {
      return JSON.parse(submission.candidates as any);
    } catch {
      return [];
    }
  };

  const [candidates, setCandidates] = useState<PublicSubmissionCandidate[]>(getInitialCandidates);
  const [activeCandidateIndex, setActiveCandidateIndex] = useState<number>(0);

  // Official Letter State
  const [officialLetter, setOfficialLetter] = useState<PublicSubmissionCandidateDoc | null>(
    submission.officialLetterUrl
      ? {
          fileName: submission.officialLetterName || 'Surat_Permohonan_Pengantar.pdf',
          fileUrl: submission.officialLetterUrl,
          fileSize: submission.officialLetterSize || 0,
        }
      : null
  );

  // Additional Document State
  const initialAdditionalDoc = submission.documents?.find(
    (d) =>
      d.requirementName.toLowerCase().includes('dokumen lain') ||
      d.requirementName.toLowerCase().includes('pendukung')
  );

  const [additionalDoc, setAdditionalDoc] = useState<PublicSubmissionCandidateDoc | null>(
    initialAdditionalDoc
      ? {
          fileName: initialAdditionalDoc.fileName,
          fileUrl: initialAdditionalDoc.fileUrl,
          fileSize: initialAdditionalDoc.fileSize,
        }
      : null
  );

  // Response Notes State
  const [responseNotes, setResponseNotes] = useState<string>(
    'Seluruh berkas lampiran yang diminta telah kami periksa kembali dan diperbarui sesuai arahan verifikator DSN-MUI.'
  );

  // Uploading / Submitting states
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Document Viewer Preview Modal State
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

  const letterFileInputRef = useRef<HTMLInputElement>(null);
  const additionalDocInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Upload helper
  const uploadFile = async (file: File): Promise<PublicSubmissionCandidateDoc> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/submissions/upload-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  };

  // Handle Official Letter Upload
  const handleUploadOfficialLetter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingTarget('officialLetter');
    setErrorMessage(null);
    try {
      const doc = await uploadFile(file);
      setOfficialLetter(doc);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengunggah surat permohonan perusahaan.');
    } finally {
      setUploadingTarget(null);
      e.target.value = '';
    }
  };

  // Handle Additional Document Upload
  const handleUploadAdditionalDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingTarget('additionalDoc');
    setErrorMessage(null);
    try {
      const doc = await uploadFile(file);
      setAdditionalDoc(doc);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengunggah dokumen pendukung tambahan.');
    } finally {
      setUploadingTarget(null);
      e.target.value = '';
    }
  };

  // Handle Candidate Document Upload
  const handleUploadCandidateDoc = async (candidateIdx: number, docKey: string, file: File) => {
    const targetKey = `cand-${candidateIdx}-${docKey}`;
    setUploadingTarget(targetKey);
    setErrorMessage(null);
    try {
      const doc = await uploadFile(file);
      setCandidates((prev) => {
        const clone = [...prev];
        const cand = { ...clone[candidateIdx] };
        cand.documents = { ...cand.documents, [docKey]: doc };
        clone[candidateIdx] = cand;
        return clone;
      });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengunggah berkas calon.');
    } finally {
      setUploadingTarget(null);
    }
  };

  // Remove Candidate Doc
  const handleRemoveCandidateDoc = (candidateIdx: number, docKey: string) => {
    setCandidates((prev) => {
      const clone = [...prev];
      const cand = { ...clone[candidateIdx] };
      const newDocs = { ...cand.documents };
      delete newDocs[docKey];
      cand.documents = newDocs;
      clone[candidateIdx] = cand;
      return clone;
    });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseNotes.trim()) {
      setErrorMessage('Mohon berikan catatan / penjelasan tanggapan perbaikan yang telah dilakukan.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.post(`/submissions/${submission.id}/revision`, {
        responseNotes: responseNotes.trim(),
        candidates,
        officialLetter,
        additionalDoc,
      });

      if (res.data.status === 'success') {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Gagal mengirimkan tanggapan perbaikan berkas.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestedDocsList = revision?.requestedDocuments || [];
  const currentCandidate = candidates[activeCandidateIndex];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* ── HEADER ── */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Status: Perlu Tindakan
              </span>
              <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400 bg-secondary px-2.5 py-0.5 rounded-lg border border-border">
                {submission.submissionNumber}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
              Perbaiki & Ganti Lampiran Berkas Permohonan
            </h2>
            <p className="text-xs text-slate-500">
              Ganti lampiran yang tidak memenuhi syarat atau tambahkan dokumen yang dibutuhkan oleh verifikator DSN-MUI.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── BODY (SCROLLABLE) ── */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* 1. Alasan Penolakan Deskriptif Banner */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-100 space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Alasan Penolakan / Catatan Perbaikan dari Verifikator DSN-MUI:
                  </h4>
                  {revision?.deadline && (
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Batas Respon: {new Date(revision.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed shadow-xs">
                  "{revision?.requestNotes || 'Berkas pengajuan memerlukan penggantian dokumen yang tidak memenuhi syarat atau penambahan lampiran.'}"
                </div>

                {Array.isArray(requestedDocsList) && requestedDocsList.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300">
                      Dokumen yang perlu diperhatikan:
                    </span>
                    {requestedDocsList.map((docKey: string) => (
                      <span
                        key={docKey}
                        className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300"
                      >
                        {docKey}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* 2. Surat Permohonan Resmi Perusahaan */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  1. Surat Permohonan / Pengantar Resmi Perusahaan
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Wajib (1 Berkas)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{officialLetter?.fileName || 'Surat_Permohonan.pdf'}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Ukuran: {formatFileSize(officialLetter?.fileSize)}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {officialLetter && (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        isOpen: true,
                        title: officialLetter.fileName,
                        fileUrl: officialLetter.fileUrl,
                        fileSize: officialLetter.fileSize,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Lihat
                  </button>
                )}

                <input
                  ref={letterFileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleUploadOfficialLetter}
                />

                <button
                  type="button"
                  disabled={uploadingTarget === 'officialLetter'}
                  onClick={() => letterFileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {uploadingTarget === 'officialLetter' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>{officialLetter ? 'Ganti Surat Pengantar' : 'Unggah Surat Pengantar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Berkas Calon DPS (Dengan Tab jika multiple calon) */}
          {candidates.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    2. Berkas Persyaratan Calon Dewan Pengawas Syariah ({candidates.length} Calon)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500">
                  Pilih tab calon di bawah untuk mengganti atau melengkapi berkas masing-masing calon.
                </span>
              </div>

              {/* Candidate Tabs */}
              {candidates.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
                  {candidates.map((cand, idx) => {
                    const isSelected = idx === activeCandidateIndex;
                    return (
                      <button
                        key={cand.id || idx}
                        type="button"
                        onClick={() => setActiveCandidateIndex(idx)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        <span>{cand.name || `Calon #${idx + 1}`}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Document List for Current Candidate */}
              {currentCandidate && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Kelengkapan Berkas: <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{currentCandidate.name || `Calon #${activeCandidateIndex + 1}`}</span>
                      </h4>
                      {currentCandidate.nik && (
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">NIK: {currentCandidate.nik}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {CANDIDATE_DOC_SPECS.map((spec) => {
                      const doc = currentCandidate.documents?.[spec.key];
                      const isUploadingThis = uploadingTarget === `cand-${activeCandidateIndex}-${spec.key}`;
                      const isRequestedDoc = Array.isArray(requestedDocsList) && requestedDocsList.some((r: string) =>
                        r.toLowerCase().includes(spec.title.toLowerCase()) || r.toLowerCase().includes(spec.key.toLowerCase())
                      );

                      return (
                        <div
                          key={spec.key}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                            isRequestedDoc
                              ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 shadow-xs ring-1 ring-amber-400/30'
                              : doc
                              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                              : 'bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700 opacity-90'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                                {spec.title}
                              </span>
                              {isRequestedDoc && (
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500 text-white shrink-0">
                                  Harus Diperbaiki
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              {spec.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            {doc ? (
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">{doc.fileName}</span>
                                </div>
                                <div className="text-[10px] font-mono text-slate-400 pl-5">
                                  {formatFileSize(doc.fileSize)}
                                </div>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-400 italic">
                                Belum ada berkas terunggah
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 shrink-0">
                              {doc && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewDoc({
                                      isOpen: true,
                                      title: spec.title,
                                      fileUrl: doc.fileUrl,
                                      fileSize: doc.fileSize,
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Lihat Berkas"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                                  className="hidden"
                                  disabled={isUploadingThis}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleUploadCandidateDoc(activeCandidateIndex, spec.key, e.target.files[0]);
                                      e.target.value = '';
                                    }
                                  }}
                                />
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                                  doc
                                    ? 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-300'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                }`}>
                                  {isUploadingThis ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <RefreshCw className="w-3 h-3" />
                                  )}
                                  <span>{doc ? 'Ganti' : 'Unggah'}</span>
                                </span>
                              </label>

                              {doc && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCandidateDoc(activeCandidateIndex, spec.key)}
                                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-[11px]"
                                  title="Hapus"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Dokumen Lain (Pendukung Tambahan) - Cukup 1 Dokumen */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  3. Dokumen Lain (Pendukung Tambahan)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Lampirkan dokumen tambahan legalitas, rekomendasi ekstra, atau berkas pendukung lainnya (opsional/jika diminta).
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Opsional (1 Berkas)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5 min-w-0">
                {additionalDoc ? (
                  <>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{additionalDoc.fileName}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Ukuran: {formatFileSize(additionalDoc.fileSize)}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-500">
                    Belum ada dokumen pendukung tambahan yang dilampirkan.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {additionalDoc && (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        isOpen: true,
                        title: additionalDoc.fileName,
                        fileUrl: additionalDoc.fileUrl,
                        fileSize: additionalDoc.fileSize,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Lihat
                  </button>
                )}

                <input
                  ref={additionalDocInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleUploadAdditionalDoc}
                />

                <button
                  type="button"
                  disabled={uploadingTarget === 'additionalDoc'}
                  onClick={() => additionalDocInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {uploadingTarget === 'additionalDoc' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>{additionalDoc ? 'Ganti Dokumen Lain' : '+ Tambah Dokumen Lain'}</span>
                </button>

                {additionalDoc && (
                  <button
                    type="button"
                    onClick={() => setAdditionalDoc(null)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Hapus"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 5. Catatan / Tanggapan Pemohon */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Catatan / Tanggapan Pemohon Terhadap Perbaikan Dokumen *
            </label>
            <textarea
              required
              rows={3}
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              placeholder="Jelaskan dokumen apa saja yang telah diganti atau ditambahkan untuk mempermudah verifikasi tim DSN-MUI..."
              className="w-full px-4 py-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none font-medium"
            />
            <p className="text-[11px] text-slate-500">
              Setelah dikirim, status permohonan akan otomatis beralih kembali menjadi <strong>"Sedang Diproses"</strong> dan berkas akan segera ditelaah kembali oleh DSN-MUI.
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #996515 0%, #B8860B 45%, #D4AF37 100%)' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Mengirimkan Berkas Perbaikan...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Kirim Berkas Perbaikan ke DSN-MUI
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── DOCUMENT VIEWER POPUP MODAL ── */}
      <DocumentViewerModal
        isOpen={previewDoc.isOpen}
        onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
        title={previewDoc.title}
        fileUrl={previewDoc.fileUrl}
        fileSize={previewDoc.fileSize}
      />
    </div>
  );
};
