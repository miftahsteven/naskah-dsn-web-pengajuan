import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { DocumentViewerModal } from '../ui/DocumentViewerModal';
import api, { formatFileSize } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { PublicSubmissionCandidateDoc } from '../../types';
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
  Building2,
  HeartPulse,
  Info,
  Calendar,
  Hash,
  Sparkles,
  Phone,
  Mail,
  CreditCard,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface KesesuaianSyariahRsFormProps {
  initialSubmissionId?: string | null;
  onSuccess: (data: any) => void;
  onCancel?: () => void;
}

interface UploadBoxProps {
  labelNumber?: string;
  title: string;
  docKey: string;
  uploadedDoc?: PublicSubmissionCandidateDoc | null;
  isUploading?: boolean;
  infoTooltip?: string;
  badgeText?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onPreview: (doc: PublicSubmissionCandidateDoc, title: string) => void;
}

// Reusable Upload Box matching DSN-MUI visual design with 100MB max limit
const DsnUploadBox: React.FC<UploadBoxProps> = ({
  labelNumber,
  title,
  uploadedDoc,
  isUploading,
  infoTooltip,
  badgeText,
  onUpload,
  onRemove,
  onPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
      {/* Title with label number & optional Info Tooltip */}
      <div className="flex items-start justify-between gap-1 mb-2 min-h-[36px]">
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
          {labelNumber && <span className="text-emerald-700 dark:text-emerald-400 mr-1.5">{labelNumber}</span>}
          {title}
        </label>
        {infoTooltip && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-1 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              title="Informasi detail berkas"
            >
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-6 z-50 w-72 sm:w-80 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-2xl shadow-xl border border-slate-700 animate-in fade-in duration-150 pointer-events-none">
                <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Ketentuan Berkas:
                </div>
                <div className="whitespace-pre-line text-slate-200">{infoTooltip}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {badgeText && (
        <div className="mb-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 leading-normal inline-block">
            {badgeText}
          </span>
        </div>
      )}

      {/* Upload Zone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex-1 flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border-2 transition-all ${
          uploadedDoc
            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
            : isDragOver
            ? 'bg-emerald-50/40 border-emerald-500 scale-[1.01]'
            : 'bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onUpload(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Mengunggah berkas...
            </span>
          </div>
        ) : uploadedDoc ? (
          <div className="w-full flex flex-col items-center text-center space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="w-full px-2">
              <p
                className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate"
                title={uploadedDoc.fileName}
              >
                {uploadedDoc.fileName}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {formatFileSize(uploadedDoc.fileSize || 0)}
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Berkas Terunggah
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onPreview(uploadedDoc, title)}
                className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                title="Lihat Pratinjau Dokumen"
              >
                <Eye className="w-3.5 h-3.5" /> Lihat
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 transition-colors"
                title="Ganti Berkas"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Hapus Berkas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center cursor-pointer py-3 text-center group"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center mb-2 transition-colors">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              Klik atau Seret Berkas ke Sini
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              PDF, DOCX, JPG, PNG (Maksimal 100 MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const KesesuaianSyariahRsForm: React.FC<KesesuaianSyariahRsFormProps> = ({
  initialSubmissionId,
  onSuccess,
  onCancel,
}) => {
  const { user, company } = useAuth();

  const [activeSection, setActiveSection] = useState<'legal' | 'permohonan' | 'dps' | 'rs_spesifik'>('legal');

  // Identitas & Narahubung RS
  const [hospitalName, setHospitalName] = useState<string>(company?.name || '');
  const [companyLetterNumber, setCompanyLetterNumber] = useState<string>('');
  const [companyLetterDate, setCompanyLetterDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [directorName, setDirectorName] = useState<string>('');
  const [picName, setPicName] = useState<string>(user?.fullName || '');
  const [picPhone, setPicPhone] = useState<string>(user?.phone || company?.phone || '');
  const [picEmail, setPicEmail] = useState<string>(user?.email || company?.email || '');

  // Dokumen Hukum Legalitas Instansi RS (Poin d)
  const [legalDocs, setLegalDocs] = useState<{
    aktaPendirian: PublicSubmissionCandidateDoc | null;
    izinPendirian: PublicSubmissionCandidateDoc | null;
    izinOperasional: PublicSubmissionCandidateDoc | null;
    tdpNib: PublicSubmissionCandidateDoc | null;
    domisili: PublicSubmissionCandidateDoc | null;
    skRups: PublicSubmissionCandidateDoc | null;
    profilPerusahaan: PublicSubmissionCandidateDoc | null;
  }>({
    aktaPendirian: null,
    izinPendirian: null,
    izinOperasional: null,
    tdpNib: null,
    domisili: null,
    skRups: null,
    profilPerusahaan: null,
  });

  // Dokumen Persyaratan Permohonan Sertifikasi Syariah (Poin e)
  const [applicationDocs, setApplicationDocs] = useState<{
    suratPermohonan: PublicSubmissionCandidateDoc | null;
    komitmenDireksi: PublicSubmissionCandidateDoc | null;
    buktiTransfer: PublicSubmissionCandidateDoc | null;
    rekeningLks: PublicSubmissionCandidateDoc | null;
  }>({
    suratPermohonan: null,
    komitmenDireksi: null,
    buktiTransfer: null,
    rekeningLks: null,
  });

  // Dokumen Khusus Rumah Sakit (Poin g)
  const [hospitalDocs, setHospitalDocs] = useState<{
    sertifikatMukisi: PublicSubmissionCandidateDoc | null;
    sertifikatHalal: PublicSubmissionCandidateDoc | null;
    akreditasiRs: PublicSubmissionCandidateDoc | null;
  }>({
    sertifikatMukisi: null,
    sertifikatHalal: null,
    akreditasiRs: null,
  });

  // Calon Dewan Pengawas Syariah (DPS) (Poin f) - Multi-kandidat tabbing
  interface DpsCandidateItem {
    id: string;
    name: string;
    nik: string;
    phone: string;
    email: string;
    documents: {
      suratMui?: PublicSubmissionCandidateDoc;
      sertifikatPelatihan?: PublicSubmissionCandidateDoc;
      sertifikatKompetensi?: PublicSubmissionCandidateDoc;
      profilCv?: PublicSubmissionCandidateDoc;
    };
  }

  const [candidates, setCandidates] = useState<DpsCandidateItem[]>([
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

  // Uploading state dictionary for tracking loading state per box
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Load existing draft if initialSubmissionId exists
  useEffect(() => {
    if (!initialSubmissionId) return;
    api.get(`/submissions/${initialSubmissionId}`)
      .then((res) => {
        if (res.data.status === 'success') {
          const data = res.data.data;
          if (data.companyLetterNumber) setCompanyLetterNumber(data.companyLetterNumber);
          if (data.companyLetterDate) setCompanyLetterDate(data.companyLetterDate.split('T')[0]);
          if (data.candidates) {
            let parsed = data.candidates;
            if (typeof parsed === 'string') {
              try { parsed = JSON.parse(parsed); } catch {}
            }
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCandidates(parsed);
            }
          }
          // Match existing documents
          if (data.documents && Array.isArray(data.documents)) {
            data.documents.forEach((d: any) => {
              const req = (d.requirementName || '').toLowerCase();
              const docObj: PublicSubmissionCandidateDoc = {
                fileName: d.fileName,
                fileUrl: d.fileUrl,
                fileSize: d.fileSize,
                mimeType: d.mimeType,
              };

              // Legal
              if (req.includes('akta pendirian')) setLegalDocs((prev) => ({ ...prev, aktaPendirian: docObj }));
              else if (req.includes('izin pendirian')) setLegalDocs((prev) => ({ ...prev, izinPendirian: docObj }));
              else if (req.includes('izin operasional')) setLegalDocs((prev) => ({ ...prev, izinOperasional: docObj }));
              else if (req.includes('tanda daftar') || req.includes('tdp') || req.includes('nib')) setLegalDocs((prev) => ({ ...prev, tdpNib: docObj }));
              else if (req.includes('domisili')) setLegalDocs((prev) => ({ ...prev, domisili: docObj }));
              else if (req.includes('rups') || req.includes('notulensi')) setLegalDocs((prev) => ({ ...prev, skRups: docObj }));
              else if (req.includes('profil perusahaan')) setLegalDocs((prev) => ({ ...prev, profilPerusahaan: docObj }));

              // Permohonan
              else if (req.includes('surat permohonan sertifikasi')) setApplicationDocs((prev) => ({ ...prev, suratPermohonan: docObj }));
              else if (req.includes('pernyataan komitmen')) setApplicationDocs((prev) => ({ ...prev, komitmenDireksi: docObj }));
              else if (req.includes('bukti transfer')) setApplicationDocs((prev) => ({ ...prev, buktiTransfer: docObj }));
              else if (req.includes('rekening')) setApplicationDocs((prev) => ({ ...prev, rekeningLks: docObj }));

              // Hospital
              else if (req.includes('mukisi')) setHospitalDocs((prev) => ({ ...prev, sertifikatMukisi: docObj }));
              else if (req.includes('halal')) setHospitalDocs((prev) => ({ ...prev, sertifikatHalal: docObj }));
              else if (req.includes('akreditasi')) setHospitalDocs((prev) => ({ ...prev, akreditasiRs: docObj }));
            });
          }
        }
      })
      .catch((err) => console.error('Failed to load existing draft:', err));
  }, [initialSubmissionId]);

  // Generic file upload to server (Max 100MB check)
  const uploadFileToServer = async (file: File, keyId: string): Promise<PublicSubmissionCandidateDoc> => {
    const maxSizeBytes = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSizeBytes) {
      throw new Error(`Ukuran file ${file.name} melebihi batas maksimal 100 MB (${formatFileSize(file.size)}).`);
    }

    setUploadingState((prev) => ({ ...prev, [keyId]: true }));
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/submissions/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    } finally {
      setUploadingState((prev) => ({ ...prev, [keyId]: false }));
    }
  };

  // Upload Handlers: Legal Docs
  const handleUploadLegalDoc = async (key: keyof typeof legalDocs, file: File) => {
    try {
      const doc = await uploadFileToServer(file, `legal-${key}`);
      setLegalDocs((prev) => ({ ...prev, [key]: doc }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengunggah dokumen legalitas.');
    }
  };

  // Upload Handlers: Application Docs
  const handleUploadApplicationDoc = async (key: keyof typeof applicationDocs, file: File) => {
    try {
      const doc = await uploadFileToServer(file, `app-${key}`);
      setApplicationDocs((prev) => ({ ...prev, [key]: doc }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengunggah dokumen permohonan.');
    }
  };

  // Upload Handlers: Hospital Docs
  const handleUploadHospitalDoc = async (key: keyof typeof hospitalDocs, file: File) => {
    try {
      const doc = await uploadFileToServer(file, `hosp-${key}`);
      setHospitalDocs((prev) => ({ ...prev, [key]: doc }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengunggah dokumen khusus rumah sakit.');
    }
  };

  // Upload Handlers: Candidate DPS Docs
  const handleUploadCandidateDoc = async (
    candidateIndex: number,
    docKey: 'suratMui' | 'sertifikatPelatihan' | 'sertifikatKompetensi' | 'profilCv',
    file: File
  ) => {
    try {
      const doc = await uploadFileToServer(file, `cand-${candidateIndex}-${docKey}`);
      setCandidates((prev) => {
        const clone = [...prev];
        const cand = { ...clone[candidateIndex] };
        cand.documents = { ...cand.documents, [docKey]: doc };
        clone[candidateIndex] = cand;
        return clone;
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengunggah berkas calon DPS.');
    }
  };

  const handleRemoveCandidateDoc = (
    candidateIndex: number,
    docKey: 'suratMui' | 'sertifikatPelatihan' | 'sertifikatKompetensi' | 'profilCv'
  ) => {
    setCandidates((prev) => {
      const clone = [...prev];
      const cand = { ...clone[candidateIndex] };
      const nextDocs = { ...cand.documents };
      delete nextDocs[docKey];
      cand.documents = nextDocs;
      clone[candidateIndex] = cand;
      return clone;
    });
  };

  // Candidate Management
  const handleAddCandidate = () => {
    const newCand: DpsCandidateItem = {
      id: 'cand-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: '',
      nik: '',
      phone: '',
      email: '',
      documents: {},
    };
    setCandidates((prev) => {
      const next = [...prev, newCand];
      setActiveCandidateIndex(next.length - 1);
      return next;
    });
  };

  const handleRemoveCandidate = (index: number) => {
    if (candidates.length <= 1) return;
    setCandidates((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setActiveCandidateIndex((cur) => (cur >= next.length ? next.length - 1 : cur));
      return next;
    });
  };

  const handleCandidateFieldChange = (index: number, field: string, value: string) => {
    setCandidates((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [field]: value };
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
      return 'Nomor Surat Permohonan Resmi Rumah Sakit wajib diisi.';
    }
    if (!applicationDocs.suratPermohonan) {
      setActiveSection('permohonan');
      return 'Surat Permohonan Sertifikasi Syariah Resmi wajib diunggah.';
    }
    if (!applicationDocs.komitmenDireksi) {
      setActiveSection('permohonan');
      return 'Surat Pernyataan Komitmen Direksi untuk Melaksanakan Usaha Sesuai Syariah wajib diunggah.';
    }
    if (!applicationDocs.buktiTransfer) {
      setActiveSection('permohonan');
      return 'Bukti Transfer Biaya Pendaftaran Sertifikasi Syariah wajib diunggah.';
    }
    if (!applicationDocs.rekeningLks) {
      setActiveSection('permohonan');
      return 'Bukti Kepemilikan Rekening di Lembaga Keuangan Syariah (LKS) wajib diunggah.';
    }

    // Legal docs validation
    if (!legalDocs.aktaPendirian) {
      setActiveSection('legal');
      return 'Akta Pendirian Perusahaan dan Pengesahan Kemenkumham wajib diunggah.';
    }
    if (!legalDocs.izinPendirian) {
      setActiveSection('legal');
      return 'Surat Izin Pendirian Rumah Sakit wajib diunggah.';
    }
    if (!legalDocs.izinOperasional) {
      setActiveSection('legal');
      return 'Surat Izin Operasional Rumah Sakit wajib diunggah.';
    }
    if (!legalDocs.tdpNib) {
      setActiveSection('legal');
      return 'Tanda Daftar Perusahaan (TDP) / NIB Berbasis Risiko wajib diunggah.';
    }
    if (!legalDocs.domisili) {
      setActiveSection('legal');
      return 'Surat Keterangan Domisili Perusahaan/RS wajib diunggah.';
    }
    if (!legalDocs.skRups) {
      setActiveSection('legal');
      return 'Surat Keputusan RUPS / Notulensi Rapat Keputusan Berusaha Sesuai Syariah wajib diunggah.';
    }
    if (!legalDocs.profilPerusahaan) {
      setActiveSection('legal');
      return 'Profil Perusahaan / Rumah Sakit & Laporan Keuangan (1 File PDF) wajib diunggah.';
    }

    // Hospital docs validation
    if (!hospitalDocs.sertifikatMukisi) {
      setActiveSection('rs_spesifik');
      return 'Sertifikat Keanggotaan atau Surat Rekomendasi dari MUKISI wajib diunggah.';
    }
    if (!hospitalDocs.sertifikatHalal) {
      setActiveSection('rs_spesifik');
      return 'Sertifikat Halal dari BPJPH / LPPOM-MUI wajib diunggah.';
    }
    if (!hospitalDocs.akreditasiRs) {
      setActiveSection('rs_spesifik');
      return 'Sertifikat Kelulusan Akreditasi Rumah Sakit dari Pemerintah wajib diunggah.';
    }

    // Candidates validation
    if (candidates.length === 0) {
      setActiveSection('dps');
      return 'Minimal satu (1) nama calon DPS wajib diusulkan.';
    }

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      if (!c.name.trim()) {
        setActiveSection('dps');
        setActiveCandidateIndex(i);
        return `Nama lengkap Calon DPS #${i + 1} wajib diisi.`;
      }
      if (!c.documents.suratMui) {
        setActiveSection('dps');
        setActiveCandidateIndex(i);
        return `Surat Pengantar dari MUI Setempat untuk Calon #${i + 1} (${c.name}) belum diunggah.`;
      }
      if (!c.documents.sertifikatPelatihan) {
        setActiveSection('dps');
        setActiveCandidateIndex(i);
        return `Sertifikat Pelatihan Dasar Pengawas Syariah dari DSN-MUI untuk Calon #${i + 1} (${c.name}) belum diunggah.`;
      }
      if (!c.documents.sertifikatKompetensi) {
        setActiveSection('dps');
        setActiveCandidateIndex(i);
        return `Sertifikat Kompetensi Pengawas Syariah dari LSP MUI untuk Calon #${i + 1} (${c.name}) belum diunggah.`;
      }
      if (!c.documents.profilCv) {
        setActiveSection('dps');
        setActiveCandidateIndex(i);
        return `Profil Calon DPS (Daftar Riwayat Hidup & KTP) untuk Calon #${i + 1} (${c.name}) belum diunggah.`;
      }
    }

    if (!agreedToTerms) {
      return 'Anda wajib mencentang persetujuan pernyataan integritas dan kebenaran berkas persyaratan DSN-MUI.';
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
      const payload = {
        submissionId: initialSubmissionId || null,
        hospitalName: hospitalName.trim() || company?.name,
        companyLetterNumber: companyLetterNumber.trim(),
        companyLetterDate,
        directorName: directorName.trim(),
        picName: picName.trim(),
        picPhone: picPhone.trim(),
        picEmail: picEmail.trim(),
        legalDocs,
        applicationDocs,
        hospitalDocs,
        candidates,
        agreedToTerms,
      };

      const res = await api.post('/submissions/kesesuaian-syariah-rs', payload);
      if (res.data.status === 'success') {
        onSuccess(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || 'Terjadi kesalahan saat mengajukan permohonan sertifikasi syariah rumah sakit.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Profile explanation text for tooltip icon "i"
  const profilPerusahaanTooltip = `Profil perusahaan/RS berisi uraian lengkap tentang:
1. Sejarah perusahaan / rumah sakit
2. Dasar hukum pendirian
3. Visi, misi & tujuan institusi
4. Struktur organisasi
5. Profil jajaran manajemen & direksi
6. Struktur permodalan
7. Laporan keuangan terakhir (Dijadikan dalam 1 file PDF utuh).

Khusus untuk instansi yang baru mendaftar, siapkan:
• Visi, misi, dan tujuan
• Rencana struktur organisasi (di dalamnya wajib terdapat organ DPS)
• Tahapan persiapan pembukaan layanan keuangan / bisnis syariah
• Sistem dan target pemasaran
• Mitra kerjasama (perusahaan keuangan / bisnis syariah)
• Rencana strategi pengembangan institusi syariah
• Profil manajemen perusahaan`;

  const activeCandidate = candidates[activeCandidateIndex] || candidates[0];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* ── 1. INSTITUTIONAL HEADER BANNER ── */}
      <div className="bg-gradient-to-br from-[#004d25] via-[#006633] to-[#00381a] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Layanan Sertifikasi RS Syariah DSN-MUI & MUKISI
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <HeartPulse className="w-6 h-6 text-red-400" />
              Permohonan Kesesuaian Syariah Rumah Sakit
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Lengkapi berkas hukum legalitas rumah sakit, surat permohonan sertifikasi, kelengkapan calon Dewan Pengawas Syariah (DPS), serta dokumen akreditasi dan rekomendasi MUKISI.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="border-white/20 text-white hover:bg-white/10 rounded-2xl text-xs font-bold shrink-0"
              >
                Ganti Layanan
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── ERROR MESSAGE BANNER ── */}
      {errorMessage && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-in shake duration-200 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-semibold leading-relaxed">
            {errorMessage}
          </div>
        </div>
      )}

      {/* ── 2. IDENTITY SECTION & AUTO-NPWP ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Data Instansi Rumah Sakit & Narahubung
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Informasi identitas rumah sakit dan surat permohonan resmi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Nama Rumah Sakit */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Nama Rumah Sakit / Instansi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Contoh: RS Islam Sultan Agung"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* NPWP (Auto-Extracted from Registration) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                NPWP Instansi
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Dari Registrasi
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={company?.npwp || 'Sudah terisi saat registrasi'}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 text-xs font-mono font-bold cursor-not-allowed select-all"
              />
              <ShieldCheck className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Nomor Surat Permohonan RS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Nomor Surat Permohonan RS <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyLetterNumber}
              onChange={(e) => setCompanyLetterNumber(e.target.value)}
              placeholder="Contoh: 014/RS-DIR/VIII/2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          {/* Tanggal Surat */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Tanggal Surat Permohonan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={companyLetterDate}
              onChange={(e) => setCompanyLetterDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Nama Direktur Utama RS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Nama Direktur Utama RS <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
              placeholder="Contoh: dr. H. Masykur Fachruddin, Sp.PD"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Narahubung PIC */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Kontak PIC (Nama & WA)
            </label>
            <input
              type="text"
              value={`${picName} (${picPhone})`}
              onChange={(e) => {
                setPicPhone(e.target.value);
              }}
              placeholder="Nama PIC & No WhatsApp"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* ── 3. FORM NAVIGATION SECTION TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSection('legal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'legal'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Dokumen Legalitas RS</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('permohonan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'permohonan'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Dokumen Permohonan</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('dps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'dps'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>3. Calon DPS ({candidates.length} Calon)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('rs_spesifik')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'rs_spesifik'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Dokumen Khusus RS (MUKISI & Halal)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
        </button>
      </div>

      {/* ── TAB 1: DOKUMEN HUKUM LEGALITAS RUMAH SAKIT (Poin d) ── */}
      {activeSection === 'legal' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Dokumen Hukum Legalitas Instansi Rumah Sakit (Wajib)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unggah dokumen legalitas izin dan profil resmi instansi rumah sakit (PDF/DOCX maks. 100MB per berkas).
              </p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200">
              7 Dokumen Legalitas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Akta Pendirian */}
            <DsnUploadBox
              labelNumber="1."
              title="Akta Pendirian Perusahaan yang Telah Disahkan Kemenkumham Beserta Perubahannya"
              docKey="aktaPendirian"
              uploadedDoc={legalDocs.aktaPendirian}
              isUploading={uploadingState['legal-aktaPendirian']}
              onUpload={(file) => handleUploadLegalDoc('aktaPendirian', file)}
              onRemove={() => setLegalDocs((p) => ({ ...p, aktaPendirian: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 2. Surat Izin Pendirian */}
            <DsnUploadBox
              labelNumber="2."
              title="Surat Izin Pendirian Rumah Sakit dari Instansi Berwenang"
              docKey="izinPendirian"
              uploadedDoc={legalDocs.izinPendirian}
              isUploading={uploadingState['legal-izinPendirian']}
              onUpload={(file) => handleUploadLegalDoc('izinPendirian', file)}
              onRemove={() => setLegalDocs((p) => ({ ...p, izinPendirian: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 3. Surat Izin Operasional */}
            <DsnUploadBox
              labelNumber="3."
              title="Surat Izin Operasional Rumah Sakit yang Masih Berlaku dari yang Berwenang"
              docKey="izinOperasional"
              uploadedDoc={legalDocs.izinOperasional}
              isUploading={uploadingState['legal-izinOperasional']}
              onUpload={(file) => handleUploadLegalDoc('izinOperasional', file)}
              onRemove={() => setLegalDocs((p) => ({ ...p, izinOperasional: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 4. TDP / NIB */}
            <DsnUploadBox
              labelNumber="4."
              title="Tanda Daftar Perusahaan (TDP) / NIB Berbasis Risiko"
              docKey="tdpNib"
              uploadedDoc={legalDocs.tdpNib}
              isUploading={uploadingState['legal-tdpNib']}
              onUpload={(file) => handleUploadLegalDoc('tdpNib', file)}
              onRemove={() => setLegalDocs((p) => ({ ...p, tdpNib: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 5. Domisili */}
            <DsnUploadBox
              labelNumber="5."
              title="Surat Keterangan Domisili Perusahaan / Rumah Sakit"
              docKey="domisili"
              uploadedDoc={legalDocs.domisili}
              isUploading={uploadingState['legal-domisili']}
              onUpload={(file) => handleUploadLegalDoc('domisili', file)}
              onRemove={() => setLegalDocs((p) => ({ ...p, domisili: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 7. SK RUPS Syariah */}
            <DsnUploadBox
              labelNumber="6."
              title="SK RUPS / Hasil Notulansi Rapat Keputusan Berusaha Berdasarkan Prinsip Syariah"
              docKey="skRups"
              uploadedDoc={legalDocs.skRups}
              isUploading={uploadingState['legal-skRups']}
              onUpload={(file) => handleUploadLegalDoc('skRups', file)}
              onRemove={() => setLegalDocs((p) => ({ ...p, skRups: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 8. Profil Perusahaan (with tooltip "i") */}
            <div className="md:col-span-2 lg:col-span-3">
              <DsnUploadBox
                labelNumber="7."
                title="Profil Perusahaan / Rumah Sakit & Laporan Keuangan Lengkap (1 File PDF)"
                docKey="profilPerusahaan"
                uploadedDoc={legalDocs.profilPerusahaan}
                isUploading={uploadingState['legal-profilPerusahaan']}
                infoTooltip={profilPerusahaanTooltip}
                badgeText="Wajib 1 File PDF utuh mencakup sejarah, visi misi, struktur organisasi, profil manajemen & keuangan"
                onUpload={(file) => handleUploadLegalDoc('profilPerusahaan', file)}
                onRemove={() => setLegalDocs((p) => ({ ...p, profilPerusahaan: null }))}
                onPreview={handleOpenPreview}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setActiveSection('permohonan')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjut ke Dokumen Permohonan
            </Button>
          </div>
        </div>
      )}

      {/* ── TAB 2: DOKUMEN PERSYARATAN PERMOHONAN (Poin e) ── */}
      {activeSection === 'permohonan' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Dokumen Persyaratan Permohonan Sertifikasi Syariah
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dokumen administrasi pendaftaran sertifikasi kesesuaian syariah resmi.
              </p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200">
              4 Dokumen Permohonan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Surat Permohonan Sertifikasi */}
            <DsnUploadBox
              labelNumber="1."
              title="Surat Permohonan Sertifikasi Syariah Resmi dari Rumah Sakit (Ditujukan ke DSN-MUI)"
              docKey="suratPermohonan"
              uploadedDoc={applicationDocs.suratPermohonan}
              isUploading={uploadingState['app-suratPermohonan']}
              onUpload={(file) => handleUploadApplicationDoc('suratPermohonan', file)}
              onRemove={() => setApplicationDocs((p) => ({ ...p, suratPermohonan: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 2. Surat Komitmen Direksi */}
            <DsnUploadBox
              labelNumber="2."
              title="Surat Pernyataan Komitmen Direksi untuk Melaksanakan Usaha Sesuai Syariah (Bermeterai)"
              docKey="komitmenDireksi"
              uploadedDoc={applicationDocs.komitmenDireksi}
              isUploading={uploadingState['app-komitmenDireksi']}
              onUpload={(file) => handleUploadApplicationDoc('komitmenDireksi', file)}
              onRemove={() => setApplicationDocs((p) => ({ ...p, komitmenDireksi: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 3. Bukti Transfer */}
            <DsnUploadBox
              labelNumber="3."
              title="Bukti Transfer Biaya Pendaftaran Sertifikasi Syariah"
              docKey="buktiTransfer"
              uploadedDoc={applicationDocs.buktiTransfer}
              isUploading={uploadingState['app-buktiTransfer']}
              onUpload={(file) => handleUploadApplicationDoc('buktiTransfer', file)}
              onRemove={() => setApplicationDocs((p) => ({ ...p, buktiTransfer: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 4. Rekening LKS */}
            <DsnUploadBox
              labelNumber="4."
              title="Bukti Kepemilikan Rekening di Lembaga Keuangan Syariah (Buku Tabungan / Rekening Koran)"
              docKey="rekeningLks"
              uploadedDoc={applicationDocs.rekeningLks}
              isUploading={uploadingState['app-rekeningLks']}
              onUpload={(file) => handleUploadApplicationDoc('rekeningLks', file)}
              onRemove={() => setApplicationDocs((p) => ({ ...p, rekeningLks: null }))}
              onPreview={handleOpenPreview}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveSection('legal')}
            >
              Kembali ke Legalitas
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setActiveSection('dps')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjut ke Calon DPS
            </Button>
          </div>
        </div>
      )}

      {/* ── TAB 3: CALON DEWAN PENGAWAS SYARIAH (DPS) (Poin f) ── */}
      {activeSection === 'dps' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Kelengkapan Calon Dewan Pengawas Syariah (DPS)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Usulkan nama-nama calon anggota DPS Rumah Sakit beserta 4 berkas wajib per calon.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddCandidate}
              leftIcon={<Plus className="w-4 h-4" />}
              className="self-start sm:self-auto rounded-xl"
            >
              Tambah Calon DPS
            </Button>
          </div>

          {/* Candidates Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {candidates.map((cand, idx) => (
              <div
                key={cand.id}
                onClick={() => setActiveCandidateIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border whitespace-nowrap ${
                  activeCandidateIndex === idx
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Calon #{idx + 1}: {cand.name || 'Belum Diisi'}</span>
                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCandidate(idx);
                    }}
                    className="p-1 rounded-lg hover:bg-white/20 text-white/90 transition-colors"
                    title="Hapus calon ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active Candidate Form Panel */}
          {activeCandidate && (
            <div className="bg-slate-50/50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              {/* Candidate Info Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nama Lengkap & Gelar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeCandidate.name}
                    onChange={(e) => handleCandidateFieldChange(activeCandidateIndex, 'name', e.target.value)}
                    placeholder="Contoh: Dr. H. Ahmad Fauzi, M.Ag."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    NIK KTP
                  </label>
                  <input
                    type="text"
                    value={activeCandidate.nik || ''}
                    onChange={(e) => handleCandidateFieldChange(activeCandidateIndex, 'nik', e.target.value)}
                    placeholder="16 digit NIK"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nomor WhatsApp/HP
                  </label>
                  <input
                    type="text"
                    value={activeCandidate.phone || ''}
                    onChange={(e) => handleCandidateFieldChange(activeCandidateIndex, 'phone', e.target.value)}
                    placeholder="0812xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Calon DPS
                  </label>
                  <input
                    type="email"
                    value={activeCandidate.email || ''}
                    onChange={(e) => handleCandidateFieldChange(activeCandidateIndex, 'email', e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 4 Candidate Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                {/* 1. Pengantar MUI */}
                <DsnUploadBox
                  labelNumber="1."
                  title="Surat Pengantar dari Majelis Ulama Indonesia (MUI) Setempat"
                  docKey="suratMui"
                  uploadedDoc={activeCandidate.documents?.suratMui}
                  isUploading={uploadingState[`cand-${activeCandidateIndex}-suratMui`]}
                  onUpload={(file) => handleUploadCandidateDoc(activeCandidateIndex, 'suratMui', file)}
                  onRemove={() => handleRemoveCandidateDoc(activeCandidateIndex, 'suratMui')}
                  onPreview={handleOpenPreview}
                />

                {/* 2. Sertifikat Pelatihan DSN */}
                <DsnUploadBox
                  labelNumber="2."
                  title="Sertifikat Pelatihan Dasar Pengawas Syariah dari DSN-MUI Institute"
                  docKey="sertifikatPelatihan"
                  uploadedDoc={activeCandidate.documents?.sertifikatPelatihan}
                  isUploading={uploadingState[`cand-${activeCandidateIndex}-sertifikatPelatihan`]}
                  onUpload={(file) => handleUploadCandidateDoc(activeCandidateIndex, 'sertifikatPelatihan', file)}
                  onRemove={() => handleRemoveCandidateDoc(activeCandidateIndex, 'sertifikatPelatihan')}
                  onPreview={handleOpenPreview}
                />

                {/* 3. Sertifikat LSP MUI with note */}
                <DsnUploadBox
                  labelNumber="3."
                  title="Sertifikat Kompetensi Pengawas Syariah dari LSP MUI"
                  docKey="sertifikatKompetensi"
                  uploadedDoc={activeCandidate.documents?.sertifikatKompetensi}
                  isUploading={uploadingState[`cand-${activeCandidateIndex}-sertifikatKompetensi`]}
                  badgeText="Kewajiban memiliki sertifikat LSP MUI paling lambat 1 tahun setelah rekomendasi diterbitkan"
                  onUpload={(file) => handleUploadCandidateDoc(activeCandidateIndex, 'sertifikatKompetensi', file)}
                  onRemove={() => handleRemoveCandidateDoc(activeCandidateIndex, 'sertifikatKompetensi')}
                  onPreview={handleOpenPreview}
                />

                {/* 4. Profil CV & KTP */}
                <DsnUploadBox
                  labelNumber="4."
                  title="Profil Calon DPS (Daftar Riwayat Hidup / CV & KTP Terbaru)"
                  docKey="profilCv"
                  uploadedDoc={activeCandidate.documents?.profilCv}
                  isUploading={uploadingState[`cand-${activeCandidateIndex}-profilCv`]}
                  onUpload={(file) => handleUploadCandidateDoc(activeCandidateIndex, 'profilCv', file)}
                  onRemove={() => handleRemoveCandidateDoc(activeCandidateIndex, 'profilCv')}
                  onPreview={handleOpenPreview}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveSection('permohonan')}
            >
              Kembali ke Dokumen Permohonan
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setActiveSection('rs_spesifik')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjut ke Dokumen Khusus RS
            </Button>
          </div>
        </div>
      )}

      {/* ── TAB 4: DOKUMEN KHUSUS RUMAH SAKIT (Poin g) ── */}
      {activeSection === 'rs_spesifik' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Dokumen Khusus Rumah Sakit (MUKISI, Halal & Akreditasi)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sertifikat pendukung wajib untuk standar kepatuhan syariah fasilitas kesehatan.
              </p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200">
              3 Dokumen Khusus RS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. MUKISI */}
            <DsnUploadBox
              labelNumber="1."
              title="Fotokopi Sertifikat Keanggotaan atau Surat Rekomendasi MUKISI"
              docKey="sertifikatMukisi"
              uploadedDoc={hospitalDocs.sertifikatMukisi}
              isUploading={uploadingState['hosp-sertifikatMukisi']}
              badgeText="Majelis Upaya Kesehatan Islam Seluruh Indonesia"
              onUpload={(file) => handleUploadHospitalDoc('sertifikatMukisi', file)}
              onRemove={() => setHospitalDocs((p) => ({ ...p, sertifikatMukisi: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 2. Sertifikat Halal */}
            <DsnUploadBox
              labelNumber="2."
              title="Fotokopi Sertifikat Halal dari BPJPH / LPPOM-MUI"
              docKey="sertifikatHalal"
              uploadedDoc={hospitalDocs.sertifikatHalal}
              isUploading={uploadingState['hosp-sertifikatHalal']}
              badgeText="BPJPH atau LPPOM-MUI (sebelum 2021) / Lembaga Terakreditasi"
              onUpload={(file) => handleUploadHospitalDoc('sertifikatHalal', file)}
              onRemove={() => setHospitalDocs((p) => ({ ...p, sertifikatHalal: null }))}
              onPreview={handleOpenPreview}
            />

            {/* 3. Akreditasi RS */}
            <DsnUploadBox
              labelNumber="3."
              title="Fotokopi Sertifikat Kelulusan Akreditasi Rumah Sakit (Pemerintah/KARS)"
              docKey="akreditasiRs"
              uploadedDoc={hospitalDocs.akreditasiRs}
              isUploading={uploadingState['hosp-akreditasiRs']}
              badgeText="Lembaga Akreditasi RS yang Diakui Pemerintah"
              onUpload={(file) => handleUploadHospitalDoc('akreditasiRs', file)}
              onRemove={() => setHospitalDocs((p) => ({ ...p, akreditasiRs: null }))}
              onPreview={handleOpenPreview}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveSection('dps')}
            >
              Kembali ke Calon DPS
            </Button>
          </div>
        </div>
      )}

      {/* ── 4. RINGKASAN PERSYARATAN & PAKTA INTEGRITAS ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Pernyataan & Persetujuan Permohonan
          </h3>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
          <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pakta Integritas Rumah Sakit Syariah:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Seluruh berkas dokumen hukum, profil rumah sakit, dan data calon DPS yang diunggah adalah sah, benar, dan dapat dipertanggungjawabkan sesuai hukum perundang-undangan.</li>
            <li>Rumah sakit berkomitmen penuh untuk menyelenggarakan tata kelola pelayanan kesehatan berdasarkan prinsip-prinsip syariah Islam di bawah pengawasan DSN-MUI dan MUKISI.</li>
            <li>Setelah dikirim, permohonan ini akan diverifikasi dan masuk secara resmi ke agenda <strong>Surat Masuk DSN-MUI</strong> untuk diproses sidangnya.</li>
          </ul>
        </div>

        <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded mt-0.5 focus:ring-emerald-500"
          />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
            Saya menyatakan bahwa seluruh data dan dokumen hukum legalitas rumah sakit serta calon DPS di atas adalah benar dan sah. Saya menyetujui seluruh ketentuan permohonan sertifikasi syariah DSN-MUI.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 shadow-md hover:shadow-glow-green"
            leftIcon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          >
            {isSubmitting ? 'Memproses Pengajuan...' : 'Kirim Permohonan Sertifikasi RS'}
          </Button>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={previewDoc.isOpen}
        onClose={() => setPreviewDoc((p) => ({ ...p, isOpen: false }))}
        title={previewDoc.title}
        fileUrl={previewDoc.fileUrl}
        fileSize={previewDoc.fileSize}
      />
    </div>
  );
};
